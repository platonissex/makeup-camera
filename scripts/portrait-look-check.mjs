import puppeteer from "puppeteer-core";

const base = "http://127.0.0.1:4173/";
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--autoplay-policy=no-user-gesture-required",
  ],
});

function fail(msg, extra) {
  console.error("FAIL", msg, extra ? JSON.stringify(extra) : "");
  process.exitCode = 1;
}

async function snap(page) {
  return page.evaluate(() => {
    const hold = document.querySelector("#hold");
    return {
      lookId: window.__makeup.lookId,
      kind: window.__makeup.lookKind,
      styles: window.__makeup.pigmentStyles,
      faceLost: window.__makeup.faceLost,
      kicker: document.querySelector(".kicker") ? document.querySelector(".kicker").textContent : "",
      orient: window.__makeup.orient,
      frame: window.__makeup.frame,
      effect: window.__makeup.effectOn,
      alpha: window.__makeup.previewAlpha,
      hold: hold ? hold.textContent : "",
      pressed: hold ? hold.getAttribute("aria-pressed") : "",
      app: {
        w: document.querySelector("#app").clientWidth,
        h: document.querySelector("#app").clientHeight,
      },
      status: document.querySelector("[data-try-status]")
        ? document.querySelector("[data-try-status]").textContent
        : "",
    };
  });
}

async function waitReady(page) {
  await page.waitForFunction(
    () =>
      window.__makeup &&
      window.__makeup.modelReady &&
      window.__makeup.screen === "tryon" &&
      window.__makeup.detectCount > 3 &&
      window.__makeup.faceLost === false &&
      window.__makeup.pigmentLayers > 0 &&
      window.__makeup.orient.poseLock === true &&
      window.__makeup.orient.headUp === true,
    { timeout: 40000 },
  );
}

async function installPhone(page) {
  await page.evaluateOnNewDocument(() => {
    const orig = window.matchMedia.bind(window);
    window.matchMedia = (q) => {
      const query = String(q);
      if (query.includes("pointer") && query.includes("coarse")) {
        return {
          matches: true,
          media: query,
          addEventListener() {},
          removeEventListener() {},
          addListener() {},
          removeListener() {},
          dispatchEvent() {
            return false;
          },
        };
      }
      return orig(q);
    };
    const orient = {
      angle: 0,
      type: "portrait-primary",
      lock: () => Promise.reject(new DOMException("lock unsupported", "NotSupportedError")),
      addEventListener() {},
      removeEventListener() {},
    };
    try {
      Object.defineProperty(screen, "orientation", { configurable: true, get: () => orient });
    } catch {}
    try {
      Object.defineProperty(window, "orientation", { configurable: true, get: () => 0 });
    } catch {}
  });
}

const wide = await browser.newPage();
await installPhone(wide);
await wide.setViewport({ width: 844, height: 390, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await wide.goto(base + "?photo=ref-face.png&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
await wide.waitForSelector("[data-try]");
const layout = await wide.evaluate(() => {
  const app = document.querySelector("#app");
  return { w: app.clientWidth, h: app.clientHeight, portrait: window.__makeup.orient.portrait };
});
console.log("layout", JSON.stringify(layout));
if (!(layout.h > layout.w && layout.portrait)) fail("portrait layout", layout);
await wide.close();

const page = await browser.newPage();
page.setDefaultTimeout(40000);
const logs = [];
page.on("pageerror", (e) => logs.push("pageerror " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") logs.push("console " + m.text().slice(0, 200));
});
await installPhone(page);
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(base + "?photo=ref-face.png&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-try='natural_brow_v1']");
await page.waitForFunction(() => {
  const v = document.querySelector("video");
  return v && v.readyState >= 2 && window.__makeup && window.__makeup.debug.running;
});
await page.click("[data-try='natural_brow_v1']");
await waitReady(page);
let state = await snap(page);
console.log("brow", JSON.stringify(state));
if (state.lookId !== "natural_brow_v1" || state.kind !== "soft") fail("brow id", state);
if (!state.styles.includes("brow") || state.styles.some((s) => s !== "brow" && s !== "skin")) fail("brow styles", state);
if (!state.kicker.includes("自然眉")) fail("brow title", state);
if (!state.effect || state.pressed !== "true" || state.hold !== "关闭效果") fail("brow toggle on", state);
if (state.frame.frameH <= state.frame.frameW) fail("brow frame portrait", state);
if (state.status.includes("没有看到脸") || state.status.includes("按住")) fail("brow status", state);

await page.click("#hold");
await page.waitForFunction(() => window.__makeup.effectOn === false && window.__makeup.previewAlpha === 0);
state = await snap(page);
console.log("brow off", JSON.stringify({ effect: state.effect, alpha: state.alpha, hold: state.hold, pressed: state.pressed, styles: state.styles }));
if (state.hold !== "看效果" || state.pressed !== "false") fail("toggle off label", state);
if (state.styles.some((s) => s !== "brow" && s !== "skin")) fail("toggle off kept brow look", state);

await page.click("#hold");
await page.waitForFunction(() => window.__makeup.effectOn === true && window.__makeup.previewAlpha === 1);

await page.evaluate(() => window.__makeup.tryOn("daily_commute_v1"));
await page.waitForFunction(() => {
  const s = window.__makeup.pigmentStyles;
  return (
    window.__makeup.lookId === "daily_commute_v1" &&
    window.__makeup.lookKind === "daily" &&
    s.includes("brow") &&
    s.includes("skin") &&
    s.includes("lip") &&
    s.includes("blush") &&
    !s.includes("shadow") &&
    !s.includes("highlight")
  );
});
state = await snap(page);
console.log("daily", JSON.stringify(state));
if (!state.kicker.includes("日常通勤")) fail("daily title", state);

await page.evaluate(() => window.__makeup.tryOn("evening_glam_v1"));
await page.waitForFunction(() => {
  const s = window.__makeup.pigmentStyles;
  return (
    window.__makeup.lookId === "evening_glam_v1" &&
    window.__makeup.lookKind === "evening" &&
    s.includes("brow") &&
    s.includes("skin") &&
    s.includes("highlight") &&
    s.includes("blush") &&
    s.includes("lip") &&
    !s.includes("shadow")
  );
});
state = await snap(page);
console.log("evening", JSON.stringify(state));
if (!state.kicker.includes("晚宴")) fail("evening title", state);

await page.evaluate(() => window.__makeup.tryOn("vitality_blush_v1"));
await page.waitForFunction(() => {
  const s = window.__makeup.pigmentStyles;
  return (
    window.__makeup.lookId === "vitality_blush_v1" &&
    window.__makeup.lookKind === "blush" &&
    s.includes("brow") &&
    s.includes("skin") &&
    s.includes("blush") &&
    s.includes("lip") &&
    !s.includes("shadow") &&
    !s.includes("highlight")
  );
});
state = await snap(page);
console.log("blush", JSON.stringify(state));
if (!state.kicker.includes("腮红")) fail("blush title", state);

await page.evaluate(() => window.__makeup.goto("natural_brow_v1", 0));
await page.waitForFunction(
  () => window.__makeup.screen === "guide" && window.__makeup.lookId === "natural_brow_v1" && window.__makeup.effectOn === false,
);
await page.click("#hold");
await page.waitForFunction(() => {
  const s = window.__makeup.pigmentStyles;
  return (
    window.__makeup.effectOn === true &&
    window.__makeup.previewAlpha === 1 &&
    s.length > 0 &&
    s.includes("brow") &&
    s.every((x) => x === "brow" || x === "skin")
  );
});
state = await snap(page);
console.log("guide brow", JSON.stringify(state));
if (state.lookId !== "natural_brow_v1" || state.alpha !== 1) fail("guide look", state);

const side = await browser.newPage();
side.setDefaultTimeout(40000);
await installPhone(side);
await side.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await side.goto(base + "?photo=ref-face.png&sensor=90&try=daily_commute_v1&cpu=1&mirror=0", {
  waitUntil: "domcontentloaded",
});
await side.waitForFunction(
  () =>
    window.__makeup &&
    window.__makeup.faceLost === false &&
    window.__makeup.orient.headUp === true &&
    window.__makeup.orient.poseLock === true &&
    window.__makeup.frame.videoWidth > window.__makeup.frame.videoHeight &&
    window.__makeup.frame.frameH > window.__makeup.frame.frameW &&
    window.__makeup.lookId === "daily_commute_v1" &&
    window.__makeup.pigmentStyles.includes("brow") &&
    window.__makeup.pigmentStyles.includes("lip") &&
    window.__makeup.pigmentStyles.includes("blush") &&
    !window.__makeup.pigmentStyles.includes("shadow") &&
    !window.__makeup.pigmentStyles.includes("highlight"),
  { timeout: 25000 },
);
state = await snap(side);
console.log("landscape-sensor", JSON.stringify(state));
if (!(state.frame.frameH > state.frame.frameW)) fail("sideways buffer stayed landscape", state);
if (state.status.includes("没有看到脸")) fail("sideways buffer kept the no-face warning", state);
await side.close();

if (logs.length) console.log("logs", logs.join(" | "));
await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("ok");

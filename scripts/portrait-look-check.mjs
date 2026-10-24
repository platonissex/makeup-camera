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

const page = await browser.newPage();
page.setDefaultTimeout(40000);
const logs = [];
page.on("pageerror", (e) => logs.push("pageerror " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") logs.push("console " + m.text().slice(0, 200));
});
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
// Phone is portrait (angle 0, coarse pointer) but the viewport reports landscape.
await page.setViewport({ width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(base + "?photo=ref-face.png&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-try='natural_brow_v1']");
const layout = await page.evaluate(() => {
  const app = document.querySelector("#app");
  return { w: app.clientWidth, h: app.clientHeight, portrait: window.__makeup.orient.portrait };
});
console.log("layout", JSON.stringify(layout));
if (!(layout.h > layout.w && layout.portrait)) fail("portrait layout", layout);

await page.click("[data-try='natural_brow_v1']");
await waitReady(page);
let state = await snap(page);
console.log("brow", JSON.stringify(state));
if (state.lookId !== "natural_brow_v1" || state.kind !== "soft") fail("brow id", state);
if (!state.styles.length || state.styles.some((s) => s !== "brow")) fail("brow styles", state);
if (!state.kicker.includes("自然眉")) fail("brow title", state);
if (!state.effect || state.pressed !== "true" || state.hold !== "关闭效果") fail("brow toggle on", state);
if (state.frame.frameH <= state.frame.frameW) fail("brow frame portrait", state);
if (state.status.includes("没有看到脸") || state.status.includes("按住")) fail("brow status", state);

await page.click("#hold");
await page.waitForFunction(() => window.__makeup.effectOn === false && window.__makeup.previewAlpha === 0);
state = await snap(page);
console.log("brow off", JSON.stringify({ effect: state.effect, alpha: state.alpha, hold: state.hold, pressed: state.pressed, styles: state.styles }));
if (state.hold !== "看效果" || state.pressed !== "false") fail("toggle off label", state);
if (state.styles.some((s) => s !== "brow")) fail("toggle off kept brow look", state);

await page.click("#hold");
await page.waitForFunction(() => window.__makeup.effectOn === true && window.__makeup.previewAlpha === 1);

await page.evaluate(() => window.__makeup.tryOn("daily_commute_v1"));
await page.waitForFunction(() => {
  const s = window.__makeup.pigmentStyles;
  return (
    window.__makeup.lookId === "daily_commute_v1" &&
    window.__makeup.lookKind === "daily" &&
    s.includes("shadow") &&
    s.includes("lip") &&
    s.includes("blush") &&
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
    s.includes("highlight") &&
    s.includes("shadow") &&
    s.includes("lip") &&
    !s.every((x) => x === "brow")
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
  return window.__makeup.effectOn === true && s.length > 0 && s.every((x) => x === "brow");
});
state = await snap(page);
console.log("guide brow", JSON.stringify(state));
if (state.lookId !== "natural_brow_v1") fail("guide look", state);

const before = await snap(page);
await page.evaluate(async () => {
  const img = new Image();
  img.src = "ref-face.png";
  await img.decode();
  const c = document.createElement("canvas");
  c.width = 1280;
  c.height = 720;
  const g = c.getContext("2d");
  const paint = () => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = "#c4b2a4";
    g.fillRect(0, 0, c.width, c.height);
    g.translate(c.width, 0);
    g.rotate(Math.PI / 2);
    const s = Math.min(c.height / img.naturalWidth, c.width / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    g.drawImage(img, (c.height - dw) / 2, (c.width - dh) / 2, dw, dh);
  };
  paint();
  setInterval(paint, 80);
  const video = document.querySelector("video");
  video.srcObject = c.captureStream(12);
  await video.play();
});
await page.waitForFunction(
  () =>
    window.__makeup.faceLost === false &&
    window.__makeup.orient.headUp === true &&
    window.__makeup.orient.poseLock === true &&
    window.__makeup.frame.frameH > window.__makeup.frame.frameW &&
    window.__makeup.pigmentStyles.length > 0 &&
    window.__makeup.pigmentStyles.every((s) => s === "brow"),
  { timeout: 20000 },
);
state = await snap(page);
console.log("landscape-sensor", JSON.stringify(state));
console.log("before-rotation", before.frame, before.orient);
if (state.frame.rotation === before.frame.rotation && state.frame.videoWidth === before.frame.videoWidth)
  fail("landscape sensor did not change the buffer", state);

if (logs.length) console.log("logs", logs.join(" | "));
await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("ok");

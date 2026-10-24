import puppeteer from "puppeteer-core";

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
const page = await browser.newPage();
page.setDefaultTimeout(20000);
const logs = [];
page.on("pageerror", (e) => logs.push("pageerror " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") logs.push("console " + m.text().slice(0, 240));
});
await page.evaluateOnNewDocument(() => {
  window.__playAbort = 0;
  window.__playCalls = 0;
  window.__streams = [];
  window.__trace = [];
  const devices = navigator.mediaDevices;
  devices.getUserMedia = async () => {
    window.__trace.push(["gum-start", performance.now()]);
    const c = document.createElement("canvas");
    c.width = 96;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = "#c4b2a4";
    g.fillRect(0, 0, c.width, c.height);
    const stream = c.captureStream(8);
    window.__streams.push(stream);
    await new Promise((r) => setTimeout(r, 280));
    window.__trace.push(["gum-end", performance.now()]);
    return stream;
  };
  HTMLVideoElement.prototype.play = function () {
    const video = this;
    const src = video.srcObject;
    const seq = (video.__seq = (video.__seq || 0) + 1);
    window.__playCalls++;
    window.__trace.push(["play-start", performance.now()]);
    return new Promise((resolve, reject) => {
      const started = performance.now();
      const timer = setInterval(() => {
        if (video.__seq !== seq) return;
        if (video.srcObject !== src) {
          clearInterval(timer);
          window.__playAbort++;
          window.__trace.push(["play-abort", performance.now()]);
          reject(
            new DOMException(
              "The play() request was interrupted by a new load request.",
              "AbortError",
            ),
          );
          return;
        }
        if (performance.now() - started >= 400) {
          clearInterval(timer);
          window.__trace.push(["play-end", performance.now()]);
          resolve();
        }
      }, 15);
    });
  };
});
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-try]");
await page.evaluate(() => {
  document.querySelector("[data-try='daily_commute_v1']").click();
  document.querySelector("[data-try='evening_glam_v1']").click();
});
await page.waitForFunction(
  () =>
    window.__makeup &&
    window.__makeup.screen === "tryon" &&
    document.querySelector("video").srcObject &&
    window.__trace.filter((e) => e[0] === "play-end").length >= 2,
  { timeout: 8000 },
);
const afterDouble = await page.evaluate(() => ({
  trace: window.__trace.slice(),
  screen: window.__makeup.screen,
  cameraError: window.__makeup.cameraError,
  aborts: window.__playAbort,
  plays: window.__playCalls,
  src: !!document.querySelector("video").srcObject,
  live: document.querySelector("video").srcObject
    ? document.querySelector("video").srcObject.getTracks().every((t) => t.readyState === "live")
    : false,
}));
await page.click("#back");
await page.waitForFunction(
  () =>
    window.__makeup.screen === "start" &&
    !document.querySelector("video").srcObject &&
    window.__streams.length > 0 &&
    window.__streams.every((s) => s.getTracks().every((t) => t.readyState === "ended")),
  { timeout: 4000 },
);
const afterLeave = await page.evaluate(() => ({
  screen: window.__makeup.screen,
  cameraError: window.__makeup.cameraError,
  aborts: window.__playAbort,
  ended: window.__streams.every((s) => s.getTracks().every((t) => t.readyState === "ended")),
  src: document.querySelector("video").srcObject,
}));
await page.click("[data-try='natural_brow_v1']");
await page.waitForFunction(
  () => window.__makeup && window.__makeup.screen === "tryon" && document.querySelector("video").srcObject,
  { timeout: 8000 },
);
const afterReturn = await page.evaluate(() => ({
  screen: window.__makeup.screen,
  cameraError: window.__makeup.cameraError,
  aborts: window.__playAbort,
  plays: window.__playCalls,
  live: document.querySelector("video").srcObject.getTracks().every((t) => t.readyState === "live"),
}));
const trace = afterDouble.trace;
const playEnd = trace.find((e) => e[0] === "play-end");
const gums = trace.filter((e) => e[0] === "gum-start");
const secondGum = gums[1];
const serialized = gums.length >= 2 && !!(playEnd && secondGum && secondGum[1] >= playEnd[1] - 5);
console.log(JSON.stringify({ afterDouble, afterLeave, afterReturn, serialized, trace, logs: logs.filter((l) => /abort|play\(\)|NotAllowed|相机/i.test(l)) }, null, 2));
const bad =
  afterDouble.cameraError ||
  afterLeave.cameraError ||
  afterReturn.cameraError ||
  afterDouble.aborts ||
  afterLeave.aborts ||
  afterReturn.aborts ||
  !afterDouble.live ||
  !afterLeave.ended ||
  afterLeave.src ||
  !afterReturn.live ||
  !serialized;
await browser.close();
if (bad) process.exit(1);

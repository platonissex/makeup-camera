import { writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";
const base = "http://127.0.0.1:4173/";
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox","--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--enable-webgl"],
});
async function dump(name, query) {
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const logs = [];
  page.on("pageerror", (e) => logs.push("pageerror " + e.message));
  page.on("console", (m) => { if (m.type()==="error" || m.type()==="warning") logs.push(m.type()+" "+m.text().slice(0,180)); });
  await page.goto(base + query, { waitUntil: "domcontentloaded" });
  const info = await page.waitForFunction(() => {
    const api = window.__makeup;
    return api && api.modelReady && api.pigmentLayers > 0 && api.pigmentEngine === "webgl2" && api.detectCount > 3 && api.nose;
  }, { timeout: 40000 }).then(() => page.evaluate(() => {
    const api = window.__makeup;
    return { engine: api.pigmentEngine, smoothing: api.smoothingEngine, layers: api.pigmentLayers, styles: api.pigmentStyles, detects: api.detectCount, nose: api.nose, gl: window.__glPigment, err: api.modelError, faceLost: api.faceLost, screen: api.screen };
  })).catch(async (e) => {
    const state = await page.evaluate(() => window.__makeup ? { ready: window.__makeup.modelReady, err: window.__makeup.modelError, cam: window.__makeup.cameraError, detects: window.__makeup.detectCount, layers: window.__makeup.pigmentLayers, faceLost: window.__makeup.faceLost, screen: window.__makeup.screen, delegate: window.__makeup.delegate } : null);
    throw new Error(e.message + " state " + JSON.stringify(state) + " logs " + logs.slice(-10).join(" | "));
  });
  await new Promise(r => setTimeout(r, 500));
  const data = await page.evaluate(() => {
    const c = document.querySelector("#view");
    return { url: c.toDataURL("image/png"), w: c.width, h: c.height };
  });
  writeFileSync(`/workspace/artifacts/${name}.png`, Buffer.from(data.url.split(",")[1], "base64"));
  console.log(name, data.w, data.h, JSON.stringify(info));
  if (logs.length) console.log(" logs", logs.slice(-6).join(" | "));
  await page.close();
}
try {
  await dump("photo-daily", "?photo=ref-face.png&try=daily_commute_v1&cpu=1&mirror=0");
  await dump("photo-evening", "?photo=ref-face.png&try=evening_glam_v1&cpu=1&mirror=0");
} finally { await browser.close(); }

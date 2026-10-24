import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://127.0.0.1:4173/";
const outDir = resolve("artifacts");
mkdirSync(outDir, { recursive: true });

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
    "--window-size=390,844",
  ],
});

async function shot(name, query) {
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const logs = [];
  page.on("console", (msg) => logs.push(msg.type() + " " + msg.text()));
  page.on("pageerror", (err) => logs.push("pageerror " + err.message));
  await page.goto(base + query, { waitUntil: "domcontentloaded" });
  const info = await page.waitForFunction(
    () => {
      const api = window.__makeup;
      if (!api) return false;
      return api.pigmentLayers > 0 && api.pigmentEngine === "webgl2" && api.detectCount > 2;
    },
    { timeout: 20000 },
  ).then(() => page.evaluate(() => {
    const api = window.__makeup;
    return {
      engine: api.pigmentEngine,
      smoothing: api.smoothingEngine,
      layers: api.pigmentLayers,
      styles: api.pigmentStyles,
      detects: api.detectCount,
      lag: api.noseLagPx,
      faceLost: api.faceLost,
      screen: api.screen,
      gl: window.__glPigment || null,
    };
  })).catch(async (err) => {
    const state = await page.evaluate(() => ({
      makeup: typeof window.__makeup === "object" ? {
        screen: window.__makeup.screen,
        layers: window.__makeup.pigmentLayers,
        engine: window.__makeup.pigmentEngine,
        detects: window.__makeup.detectCount,
        faceLost: window.__makeup.faceLost,
        modelError: window.__makeup.modelError,
        cameraError: window.__makeup.cameraError,
      } : null,
      gl: window.__glPigment || null,
    }));
    throw new Error(err.message + " state " + JSON.stringify(state) + " logs " + logs.slice(-12).join(" | "));
  });
  const canvas = await page.$("#view");
  if (!canvas) throw new Error("missing #view");
  const file = resolve(outDir, name + ".png");
  await canvas.screenshot({ path: file });
  console.log(name, JSON.stringify(info), file);
  await page.close();
  return info;
}

try {
  await shot("daily-still", "?fixture=1&try=daily_commute_v1&cpu=1&motion=0&mirror=0");
  await shot("daily-motion", "?fixture=1&try=daily_commute_v1&cpu=1&motion=1&mirror=0");
  await shot("evening-still", "?fixture=1&try=evening_glam_v1&cpu=1&motion=0&mirror=0");
} finally {
  await browser.close();
}

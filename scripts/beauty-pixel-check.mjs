import { mkdirSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = "http://127.0.0.1:4173/";
const outDir = "/opt/cursor/artifacts/screenshots";
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
    "--autoplay-policy=no-user-gesture-required",
  ],
});

function fail(msg, extra) {
  console.error("FAIL", msg, extra ? JSON.stringify(extra) : "");
  process.exitCode = 1;
}

async function openLook(id) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("pageerror", e.message));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${base}?photo=ref-face.png&try=${id}&cpu=1&mirror=0`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    () =>
      window.__makeup &&
      window.__makeup.modelReady &&
      window.__makeup.screen === "tryon" &&
      window.__makeup.detectCount > 4 &&
      window.__makeup.faceLost === false &&
      window.__makeup.effectOn === true &&
      window.__makeup.pigmentLayers > 0,
    { timeout: 45000 },
  );
  await new Promise((r) => setTimeout(r, 400));
  return page;
}

async function probe(page) {
  return page.evaluate(() => {
    const view = document.querySelector("#view");
    const video = document.querySelector("video");
    const lm = window.__makeup.landmarks;
    const w = view.width;
    const h = view.height;
    const scale = Math.max(w / video.videoWidth, h / video.videoHeight);
    const dw = video.videoWidth * scale;
    const dh = video.videoHeight * scale;
    const ox = (w - dw) / 2;
    const oy = (h - dh) / 2;
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.drawImage(video, ox, oy, dw, dh);
    const bare = octx.getImageData(0, 0, w, h).data;
    const made = view.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const sample = (id, rad) => {
      const x = ox + lm[id][0] * dw;
      const y = oy + lm[id][1] * dh;
      let br = 0;
      let bg = 0;
      let bb = 0;
      let mr = 0;
      let mg = 0;
      let mb = 0;
      let n = 0;
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const xi = Math.round(x + dx);
          const yi = Math.round(y + dy);
          if (xi < 0 || yi < 0 || xi >= w || yi >= h) continue;
          const i = (yi * w + xi) * 4;
          br += bare[i];
          bg += bare[i + 1];
          bb += bare[i + 2];
          mr += made[i];
          mg += made[i + 1];
          mb += made[i + 2];
          n++;
        }
      }
      const by = luma(br / n, bg / n, bb / n);
      const my = luma(mr / n, mg / n, mb / n);
      return {
        id,
        dY: Math.round((my - by) * 10) / 10,
        dR: Math.round((mr / n - br / n) * 10) / 10,
        dG: Math.round((mg / n - bg / n) * 10) / 10,
        dB: Math.round((mb / n - bb / n) * 10) / 10,
      };
    };
    const ids = [105, 334, 70, 300, 159, 386, 50, 280, 10, 151];
    return {
      lookId: window.__makeup.lookId,
      kind: window.__makeup.lookKind,
      styles: window.__makeup.pigmentStyles,
      effect: window.__makeup.effectOn,
      faceLost: window.__makeup.faceLost,
      ms: window.__makeup.frameMs,
      samples: ids.map((id) => sample(id, 4)),
    };
  });
}

async function saveView(page, name) {
  const data = await page.evaluate(() => document.querySelector("#view").toDataURL("image/png"));
  writeFileSync(`${outDir}/${name}.png`, Buffer.from(data.split(",")[1], "base64"));
}

const daily = await openLook("daily_commute_v1");
const dailyProbe = await probe(daily);
console.log("daily", JSON.stringify(dailyProbe));
await saveView(daily, "daily-on");
await daily.screenshot({ path: `${outDir}/daily-on-ui.png` });
await daily.evaluate(() => window.__makeup.hold(false));
await new Promise((r) => setTimeout(r, 350));
await saveView(daily, "daily-off");
await daily.close();

const evening = await openLook("evening_glam_v1");
const eveningProbe = await probe(evening);
console.log("evening", JSON.stringify(eveningProbe));
await saveView(evening, "evening-on");
await evening.screenshot({ path: `${outDir}/evening-on-ui.png` });
await evening.close();

function byId(report, id) {
  return report.samples.find((s) => s.id === id);
}

function check(name, report) {
  const styles = report.styles;
  if (!styles.includes("brow") || !styles.includes("skin") || !styles.includes("blush") || !styles.includes("lip")) {
    fail(name + " layers", styles);
  }
  if (styles.includes("shadow") || styles.includes("shadowDeep")) fail(name + " lid stain", styles);
  const brow = [105, 334].map((id) => byId(report, id).dY);
  const browDrop = -(brow[0] + brow[1]) / 2;
  if (browDrop < 4) fail(name + " brows faint", { brow, browDrop });
  const lid = [159, 386].map((id) => byId(report, id).dY);
  if (lid.some((v) => v < -3 || v > 10)) fail(name + " lid", lid);
  const cheeks = [50, 280].map((id) => byId(report, id));
  for (const c of cheeks) {
    if (c.dR - c.dG < 6) fail(name + " blush not red", c);
    if (c.dY < 0 || c.dY > 14) fail(name + " blush tone", c);
  }
  const mid = byId(report, 151).dY;
  if (mid < 4) fail(name + " skin not brighter", mid);
  if (byId(report, 10).dY < -1) fail(name + " forehead darkened", byId(report, 10));
}

check("daily", dailyProbe);
check("evening", eveningProbe);
await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("beauty pixel check ok");

import { writeFileSync } from "node:fs";
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
  ],
});

function launchPage() {
  return browser.newPage();
}

async function ready(page) {
  const logs = [];
  page.on("pageerror", (e) => logs.push("pageerror " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.push(m.type() + " " + m.text().slice(0, 180));
  });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  return logs;
}

const LID_R = [133, 173, 157, 158, 159, 160, 161, 246, 33];
const LID_L = [362, 398, 384, 385, 386, 387, 388, 466, 263];

async function shot(page, name) {
  const data = await page.evaluate(() => {
    const c = document.querySelector("#view");
    return { url: c.toDataURL("image/png"), w: c.width, h: c.height };
  });
  writeFileSync(`/workspace/artifacts/${name}.png`, Buffer.from(data.url.split(",")[1], "base64"));
  return data;
}

async function linerProbe(page) {
  return page.evaluate((lidR, lidL) => {
    const view = document.querySelector("#view");
    const video = document.querySelector("video");
    const lm = window.__makeup.landmarks;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const w = view.width;
    const h = view.height;
    const scale = Math.max(w / vw, h / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const ox = (w - dw) / 2;
    const oy = (h - dh) / 2;
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.drawImage(video, ox, oy, dw, dh);
    const bare = octx.getImageData(0, 0, w, h).data;
    const made = view.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const map = (nx, ny) => ({ x: ox + nx * dw, y: oy + ny * dh });
    const lum = (data, x, y) => {
      const xi = Math.round(x);
      const yi = Math.round(y);
      if (xi < 1 || yi < 1 || xi >= w - 1 || yi >= h - 1) return null;
      const i = (yi * w + xi) * 4;
      return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    };
    const eye = (ids) => {
      const pts = ids.map((id) => map(lm[id][0], lm[id][1]));
      const samples = [];
      const n = 18;
      for (let s = 0; s < n; s++) {
        const t = s / (n - 1);
        const f = t * (pts.length - 1);
        const i = Math.min(pts.length - 2, Math.floor(f));
        const u = f - i;
        const p = {
          x: pts[i].x + (pts[i + 1].x - pts[i].x) * u,
          y: pts[i].y + (pts[i + 1].y - pts[i].y) * u,
        };
        let best = -999;
        let bestAt = 0;
        for (let dy = -6; dy <= 6; dy++) {
          const on = lum(made, p.x, p.y + dy);
          const bareOn = lum(bare, p.x, p.y + dy);
          if (on == null || bareOn == null) continue;
          const darken = bareOn - on;
          if (darken > best) {
            best = darken;
            bestAt = dy;
          }
        }
        const above = (() => {
          const a = lum(made, p.x, p.y - 10);
          const b = lum(bare, p.x, p.y - 10);
          return a == null || b == null ? 0 : b - a;
        })();
        samples.push({
          t: Math.round(t * 100) / 100,
          darken: Math.round(best * 10) / 10,
          at: bestAt,
          above: Math.round(above * 10) / 10,
        });
      }
      const onLine = samples.filter((s) => s.darken > 6);
      let gap = 0;
      let run = 0;
      for (const s of samples) {
        if (s.darken > 6) run = 0;
        else {
          run++;
          gap = Math.max(gap, run);
        }
      }
      const mid = samples.filter((s) => s.t > 0.2 && s.t < 0.7);
      const tip = samples.filter((s) => s.t > 0.9);
      const midD = mid.reduce((a, s) => a + s.darken, 0) / Math.max(1, mid.length);
      const tipD = tip.reduce((a, s) => a + s.darken, 0) / Math.max(1, tip.length);
      const aboveM = mid.reduce((a, s) => a + s.above, 0) / Math.max(1, mid.length);
      return {
        covered: onLine.length,
        total: samples.length,
        longestGap: gap,
        midDarken: Math.round(midD * 10) / 10,
        tipDarken: Math.round(tipD * 10) / 10,
        aboveDarken: Math.round(aboveM * 10) / 10,
        profile: samples.map((s) => s.darken),
        offsets: samples.map((s) => s.at),
      };
    };
    return { right: eye(lidR), left: eye(lidL), gl: window.__glPigment, engine: window.__makeup.pigmentEngine };
  }, LID_R, LID_L);
}

async function diffEyes(page, name) {
  const url = await page.evaluate((lidR, lidL) => {
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
    const bare = octx.getImageData(0, 0, w, h);
    const made = view.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h);
    const ids = lidR.concat(lidL);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const id of ids) {
      const x = ox + lm[id][0] * dw;
      const y = oy + lm[id][1] * dh;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
    const padX = (x1 - x0) * 0.28;
    const padY = (x1 - x0) * 0.22;
    const sx = Math.max(0, Math.floor(x0 - padX));
    const sy = Math.max(0, Math.floor(y0 - padY));
    const sw = Math.min(w - sx, Math.ceil(x1 - x0 + padX * 2));
    const sh = Math.min(h - sy, Math.ceil(y1 - y0 + padY * 2));
    const c = document.createElement("canvas");
    c.width = sw;
    c.height = sh;
    const img = c.getContext("2d").createImageData(sw, sh);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const i = ((sy + y) * w + (sx + x)) * 4;
        const o = (y * sw + x) * 4;
        const d =
          (bare.data[i] - made.data[i] +
            (bare.data[i + 1] - made.data[i + 1]) +
            (bare.data[i + 2] - made.data[i + 2])) /
          3;
        const v = Math.max(0, Math.min(255, d * 8));
        img.data[o] = v;
        img.data[o + 1] = v;
        img.data[o + 2] = v;
        img.data[o + 3] = 255;
      }
    }
    c.getContext("2d").putImageData(img, 0, 0);
    return c.toDataURL("image/png");
  }, LID_R, LID_L);
  writeFileSync(`/workspace/artifacts/${name}.png`, Buffer.from(url.split(",")[1], "base64"));
}

async function cropEyes(page, name) {
  const url = await page.evaluate((lidR, lidL) => {
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
    const ids = lidR.concat(lidL);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const id of ids) {
      const x = ox + lm[id][0] * dw;
      const y = oy + lm[id][1] * dh;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
    const padX = (x1 - x0) * 0.35;
    const padY = (x1 - x0) * 0.28;
    const sx = Math.max(0, Math.floor(x0 - padX));
    const sy = Math.max(0, Math.floor(y0 - padY));
    const sw = Math.min(w - sx, Math.ceil(x1 - x0 + padX * 2));
    const sh = Math.min(h - sy, Math.ceil(y1 - y0 + padY * 2));
    const c = document.createElement("canvas");
    c.width = sw;
    c.height = sh;
    c.getContext("2d").drawImage(view, sx, sy, sw, sh, 0, 0, sw, sh);
    return c.toDataURL("image/png");
  }, LID_R, LID_L);
  writeFileSync(`/workspace/artifacts/${name}.png`, Buffer.from(url.split(",")[1], "base64"));
}

try {
  const photo = await launchPage();
  const logs = await ready(photo);
  await photo.goto(base + "?photo=ref-face.png&try=daily_commute_v1&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
  await photo.waitForFunction(
    () => {
      const api = window.__makeup;
      return api && api.modelReady && api.pigmentEngine === "webgl2" && api.detectCount > 3 && api.landmarks;
    },
    { timeout: 40000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  const dailyShot = await shot(photo, "photo-daily");
  const dailyLiner = await linerProbe(photo);
  await cropEyes(photo, "liner-daily-eyes");
  await diffEyes(photo, "liner-daily-diff");
  console.log("daily", dailyShot.w, dailyShot.h, JSON.stringify(dailyLiner));
  if (logs.length) console.log("logs", logs.slice(-6).join(" | "));

  await photo.goto(base + "?photo=ref-face.png&try=evening_glam_v1&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
  await photo.waitForFunction(
    () => window.__makeup && window.__makeup.pigmentEngine === "webgl2" && window.__makeup.detectCount > 3,
    { timeout: 40000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  await shot(photo, "photo-evening");
  const eveningLiner = await linerProbe(photo);
  await cropEyes(photo, "liner-evening-eyes");
  await diffEyes(photo, "liner-evening-diff");
  console.log("evening", JSON.stringify(eveningLiner));
  await photo.close();

  const motion = await launchPage();
  await ready(motion);
  await motion.goto(base + "?fixture=1&try=daily_commute_v1&cpu=1&mirror=0", { waitUntil: "domcontentloaded" });
  await motion.waitForFunction(
    () => {
      const api = window.__makeup;
      return api && api.modelReady && api.pigmentEngine === "webgl2" && api.trackLagPx && api.detectCount > 4;
    },
    { timeout: 40000 },
  );
  const samples = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 2800) {
    samples.push(
      await motion.evaluate(() => ({
        nose: window.__makeup.noseLagPx,
        track: window.__makeup.trackLagPx,
      })),
    );
    await new Promise((r) => setTimeout(r, 50));
  }
  await shot(motion, "fixture-daily-motion");
  let maxNose = 0;
  let maxSpread = 0;
  let maxAny = 0;
  for (const s of samples) {
    maxNose = Math.max(maxNose, s.nose || 0);
    const vals = Object.values(s.track || {});
    if (!vals.length) continue;
    const hi = Math.max(...vals);
    const lo = Math.min(...vals);
    maxAny = Math.max(maxAny, hi);
    maxSpread = Math.max(maxSpread, hi - lo);
  }
  console.log(
    "motion",
    JSON.stringify({
      frames: samples.length,
      maxNose: Math.round(maxNose * 100) / 100,
      maxAny: Math.round(maxAny * 100) / 100,
      maxSpread: Math.round(maxSpread * 100) / 100,
    }),
  );
  await motion.close();
} finally {
  await browser.close();
}

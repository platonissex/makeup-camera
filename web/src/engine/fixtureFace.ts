// Synthetic face used by ?fixture=1 so the pigment path can be checked
// without a camera or a stock photo. Landmarks follow the same indices
// the makeup geometry reads.

import { MIRROR } from "./mirror";

export type Norm = { x: number; y: number };

function ellipse(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number): Norm[] {
  const out: Norm[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? a0 : a0 + ((a1 - a0) * i) / (n - 1);
    out.push({ x: cx + Math.cos(t) * rx, y: cy + Math.sin(t) * ry });
  }
  return out;
}

export function fixtureLandmarks(timeSec: number, motion: boolean): Norm[] {
  const yaw = motion ? Math.sin(timeSec * 0.85) * 0.22 : 0.08;
  const mouth = motion ? Math.sin(timeSec * 3.1) * 0.5 + 0.5 : 0.2;
  const pts: Norm[] = Array.from({ length: 478 }, (_, i) => {
    const a = (i / 478) * Math.PI * 2;
    return { x: 0.5 + Math.cos(a) * 0.08, y: 0.52 + Math.sin(a) * 0.1 };
  });
  const set = (i: number, x: number, y: number, mirror = true) => {
    pts[i] = { x, y };
    if (!mirror) return;
    const j = MIRROR[i];
    if (j !== i) pts[j] = { x: 1 - x, y };
  };

  const oval = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
    378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109,
  ];
  oval.forEach((id, i) => {
    const a = -Math.PI / 2 + (i / oval.length) * Math.PI * 2;
    pts[id] = { x: 0.5 + Math.cos(a) * 0.23, y: 0.5 + Math.sin(a) * 0.32 };
  });

  set(151, 0.5, 0.28, false);
  set(10, 0.5, 0.2, false);
  set(152, 0.5, 0.8, false);
  set(234, 0.27, 0.5);
  set(1, 0.5, 0.55, false);
  set(2, 0.5, 0.58, false);
  set(6, 0.5, 0.45, false);
  set(168, 0.5, 0.4, false);
  set(9, 0.5, 0.36, false);
  set(48, 0.455, 0.56);
  set(98, 0.47, 0.575);

  const eyeC = { x: 0.4, y: 0.405 };
  const upper = [133, 173, 157, 158, 159, 160, 161, 246, 33];
  const lower = [33, 7, 163, 144, 145, 153, 154, 155, 133];
  ellipse(eyeC.x, eyeC.y, 0.052, 0.02, 0, -Math.PI, upper.length).forEach((p, i) => set(upper[i], p.x, p.y));
  ellipse(eyeC.x, eyeC.y, 0.05, 0.018, Math.PI, 0, lower.length).forEach((p, i) => set(lower[i], p.x, p.y));
  set(468, eyeC.x, eyeC.y);
  set(471, eyeC.x - 0.02, eyeC.y);

  const browLower = [107, 66, 105, 63, 70];
  const browUpper = [55, 65, 52, 53, 46];
  [
    [0.455, 0.352],
    [0.425, 0.338],
    [0.395, 0.328],
    [0.365, 0.338],
    [0.338, 0.352],
  ].forEach(([x, y], i) => set(browLower[i], x, y));
  [
    [0.45, 0.338],
    [0.422, 0.322],
    [0.392, 0.312],
    [0.362, 0.324],
    [0.336, 0.34],
  ].forEach(([x, y], i) => set(browUpper[i], x, y));

  set(50, 0.36, 0.56);
  set(116, 0.325, 0.5);
  set(205, 0.37, 0.6);
  set(187, 0.39, 0.62);
  set(123, 0.31, 0.48);

  const lipR = [61, 185, 40, 39, 37];
  [
    [0.43, 0.625],
    [0.448, 0.608],
    [0.465, 0.598],
    [0.48, 0.592],
    [0.492, 0.588],
  ].forEach(([x, y], i) => set(lipR[i], x, y));
  set(0, 0.5, 0.598, false);
  const lowR = [84, 181, 91, 146];
  [
    [0.47, 0.652],
    [0.45, 0.648],
    [0.44, 0.64],
    [0.432, 0.632],
  ].forEach(([x, y], i) => set(lowR[i], x, y));
  set(17, 0.5, 0.66, false);

  const inR = [78, 191, 80, 81, 82];
  [
    [0.445, 0.624],
    [0.46, 0.614],
    [0.475, 0.608],
    [0.488, 0.606],
    [0.496, 0.608],
  ].forEach(([x, y], i) => set(inR[i], x, y));
  set(13, 0.5, 0.612, false);
  const inLow = [87, 178, 88, 95];
  [
    [0.47, 0.64],
    [0.455, 0.638],
    [0.445, 0.632],
    [0.44, 0.626],
  ].forEach(([x, y], i) => set(inLow[i], x, y));
  set(14, 0.5, 0.646, false);

  const open = mouth * 0.028;
  for (const id of [17, 84, 181, 91, 146, 314, 405, 321, 375, 14, 87, 178, 88, 95, 317, 402, 318, 324]) {
    pts[id] = { x: pts[id].x, y: pts[id].y + open };
  }

  const ang = yaw * 0.28;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const squash = 1 - Math.abs(yaw) * 0.12;
  for (let i = 0; i < pts.length; i++) {
    let x = (pts[i].x - 0.5) * squash;
    let y = pts[i].y - 0.48;
    const xr = x * cos - y * sin;
    const yr = x * sin + y * cos;
    x = xr + 0.5 + yaw * 0.015;
    y = yr + 0.48;
    if (motion) {
      x += Math.sin(timeSec * 42 + i * 0.37) * 0.0014;
      y += Math.cos(timeSec * 37 + i * 0.21) * 0.0014;
    }
    pts[i] = { x, y };
  }
  pts[1] = { x: pts[1].x + yaw * 0.035, y: pts[1].y };
  return pts;
}

export function paintFixture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeSec: number,
  motion: boolean,
): void {
  const pts = fixtureLandmarks(timeSec, motion);
  const p = (i: number) => ({ x: pts[i].x * w, y: pts[i].y * h });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#c4b2a4");
  sky.addColorStop(1, "#8d7568");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const oval = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
    378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109,
  ];
  ctx.beginPath();
  oval.forEach((id, i) => {
    const q = p(id);
    if (i === 0) ctx.moveTo(q.x, q.y);
    else ctx.lineTo(q.x, q.y);
  });
  ctx.closePath();
  const skin = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.85);
  skin.addColorStop(0, "#f0c7b0");
  skin.addColorStop(0.55, "#e2ad93");
  skin.addColorStop(1, "#c98978");
  ctx.fillStyle = skin;
  ctx.fill();

  const eye = (ids: number[], iris: number) => {
    ctx.beginPath();
    ids.forEach((id, i) => {
      const q = p(id);
      if (i === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    });
    ctx.closePath();
    ctx.fillStyle = "#f7f1ea";
    ctx.fill();
    const c = p(iris);
    ctx.beginPath();
    ctx.fillStyle = "#3a2a24";
    ctx.arc(c.x, c.y, w * 0.012, 0, Math.PI * 2);
    ctx.fill();
  };
  eye([33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7], 468);
  eye([263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249], MIRROR[468]);

  const stroke = (ids: number[], color: string, width: number) => {
    ctx.beginPath();
    ids.forEach((id, i) => {
      const q = p(id);
      if (i === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  stroke([70, 63, 105, 66, 107], "rgba(90,60,50,0.35)", w * 0.004);
  stroke([MIRROR[70], MIRROR[63], MIRROR[105], MIRROR[66], MIRROR[107]], "rgba(90,60,50,0.35)", w * 0.004);

  const lip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
  ctx.beginPath();
  lip.forEach((id, i) => {
    const q = p(id);
    if (i === 0) ctx.moveTo(q.x, q.y);
    else ctx.lineTo(q.x, q.y);
  });
  ctx.closePath();
  ctx.fillStyle = "#c47d78";
  ctx.fill();
}

import { LandmarkStabilizer, type Vec } from "../web/src/engine/stabilize";

const ANCHORS = [33, 263, 133, 362, 6, 168, 10, 151, 234, 454, 1];

function baseFace(): Vec[] {
  const pts: Vec[] = Array.from({ length: 478 }, () => ({ x: 150, y: 150 }));
  const put = (i: number, x: number, y: number) => {
    pts[i] = { x, y };
  };
  put(33, 110, 120);
  put(263, 190, 120);
  put(133, 135, 122);
  put(362, 165, 122);
  put(6, 150, 145);
  put(168, 150, 132);
  put(10, 150, 70);
  put(151, 150, 90);
  put(234, 90, 160);
  put(454, 210, 160);
  put(1, 150, 165);
  put(13, 150, 200);
  put(14, 150, 214);
  put(61, 124, 206);
  put(291, 176, 206);
  return pts;
}

function pose(p: Vec, ang: number, tx: number, ty: number): Vec {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const x = p.x - 150;
  const y = p.y - 140;
  return { x: x * c - y * s + 150 + tx, y: x * s + y * c + 140 + ty };
}

function sample(frame: number, noisy: boolean): { raw: Vec[]; truth: Vec[] } {
  const moving = frame >= 3 && frame <= 14;
  const u = moving ? (frame - 3) / 11 : frame > 14 ? 1 : 0;
  const ang = u * 0.22;
  const tx = u * 42;
  const ty = u * -16;
  const mouth = Math.sin((frame / 30) * Math.PI * 2 * 3) * 9;
  const truth = baseFace().map((p, i) => {
    const q = pose(p, ang, tx, ty);
    if (i === 13 || i === 14 || i === 61 || i === 291) q.y += mouth * (i === 14 ? 1 : 0.35);
    return q;
  });
  const raw = truth.map((p, i) => {
    if (!noisy || frame === 0) return { ...p };
    return {
      x: p.x + Math.sin(frame * 9.1 + i * 0.7) * 1.7,
      y: p.y + Math.cos(frame * 8.3 + i * 0.4) * 1.7,
    };
  });
  return { raw, truth };
}

function dist(a: Vec, b: Vec): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const stab = new LandmarkStabilizer(478, { minCutoff: 1.5, beta: 0.09, dCutoff: 1 });
let endMove: Vec[] = [];
let endTruth: Vec[] = [];
const settledErrs: number[] = [];
const mouthSpan: number[] = [];
let mouthMin = Infinity;
let mouthMax = -Infinity;
for (let frame = 0; frame <= 36; frame++) {
  const { raw, truth } = sample(frame, true);
  const out = stab.smooth(raw, frame / 30);
  if (frame === 14) {
    endMove = out;
    endTruth = truth;
  }
  if (frame >= 24 && frame <= 36) {
    let worst = 0;
    for (const i of ANCHORS) worst = Math.max(worst, dist(out[i], truth[i]));
    settledErrs.push(worst);
  }
  if (frame >= 20 && frame <= 36) {
    const rel = out[13].y - out[33].y;
    mouthMin = Math.min(mouthMin, rel);
    mouthMax = Math.max(mouthMax, rel);
    mouthSpan.push(rel);
  }
}

const lag33 = dist(endMove[33], endTruth[33]);
const lag263 = dist(endMove[263], endTruth[263]);
const err33 = { x: endMove[33].x - endTruth[33].x, y: endMove[33].y - endTruth[33].y };
const err263 = { x: endMove[263].x - endTruth[263].x, y: endMove[263].y - endTruth[263].y };
const shear = Math.hypot(err33.x - err263.x, err33.y - err263.y);
const settledErr = settledErrs.reduce((a, b) => a + b, 0) / Math.max(1, settledErrs.length);
const mouthAmp = mouthMax - mouthMin;

const report = { lag33, lag263, shear, settledErr, mouthAmp };
console.log(JSON.stringify(report, null, 2));

const problems: string[] = [];
if (lag33 > 8) problems.push(`eye lag ${lag33.toFixed(2)}px during the turn`);
if (shear > 3) problems.push(`anchors sheared ${shear.toFixed(2)}px`);
if (settledErr > 2.6) problems.push(`settled anchor error ${settledErr.toFixed(2)}px`);
if (mouthAmp < 5) problems.push(`mouth amplitude collapsed to ${mouthAmp.toFixed(2)}px`);
if (problems.length) {
  throw new Error(problems.join("\n"));
}
console.log("stabilizer ok");

// Rigid pose + expression residuals.
// The similarity that carries the head is smoothed as one pose, with the
// same blend on scale, rotation, and translation so a turn cannot leave
// the eyes a frame behind the nose. Leftover expression (blink, talk) is
// filtered per point with the same settings on every landmark, so brows,
// liner, and lips stay painted on the same frame. A large jump snaps to
// the new pose instead of easing in over the next turns.

export type Vec = { x: number; y: number };

export type EuroParams = {
  minCutoff: number;
  beta: number;
  dCutoff: number;
};

export const SMOOTHING_NAME = "rigid-residual-one-euro";

const RIGID_INDEX = [33, 263, 133, 362, 6, 168, 10, 151, 234, 454, 1];
const RIGID_WEIGHT = [1, 1, 1, 1, 1, 0.9, 0.75, 0.7, 0.65, 0.65, 0.35];

type Sim = { a: number; b: number; tx: number; ty: number };

const IDENTITY: Sim = { a: 1, b: 0, tx: 0, ty: 0 };

function alpha(dt: number, cutoff: number): number {
  const tau = 1 / (2 * Math.PI * Math.max(1e-4, cutoff));
  return 1 / (1 + tau / Math.max(1e-4, dt));
}

export class OneEuroFilter {
  minCutoff: number;
  beta: number;
  dCutoff: number;
  private xPrev: number | null = null;
  private dxPrev = 0;
  private tPrev: number | null = null;

  constructor(minCutoff = 1, beta = 0, dCutoff = 1) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  reset(): void {
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }

  filter(x: number, t: number): number {
    const prev = this.xPrev;
    const tPrev = this.tPrev;
    if (prev === null || tPrev === null || t - tPrev > 0.45) {
      this.xPrev = x;
      this.tPrev = t;
      this.dxPrev = 0;
      return x;
    }
    const dt = Math.max(1e-4, t - tPrev);
    const dx = (x - prev) / dt;
    const dxHat = alpha(dt, this.dCutoff) * dx + (1 - alpha(dt, this.dCutoff)) * this.dxPrev;
    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const xHat = alpha(dt, cutoff) * x + (1 - alpha(dt, cutoff)) * prev;
    this.xPrev = xHat;
    this.dxPrev = dxHat;
    this.tPrev = t;
    return xHat;
  }
}

function solve4(m: number[][], rhs: number[]): number[] | null {
  const a = m.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < 4; col++) {
    let piv = col;
    for (let row = col + 1; row < 4; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[piv][col])) piv = row;
    }
    if (Math.abs(a[piv][col]) < 1e-8) return null;
    const tmp = a[col];
    a[col] = a[piv];
    a[piv] = tmp;
    const div = a[col][col];
    for (let k = col; k < 5; k++) a[col][k] /= div;
    for (let row = 0; row < 4; row++) {
      if (row === col) continue;
      const f = a[row][col];
      if (f === 0) continue;
      for (let k = col; k < 5; k++) a[row][k] -= f * a[col][k];
    }
  }
  return [a[0][4], a[1][4], a[2][4], a[3][4]];
}

function fitSimilarity(src: Vec[], dst: Vec[]): Sim | null {
  const A = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const rhs = [0, 0, 0, 0];
  let used = 0;
  for (let k = 0; k < RIGID_INDEX.length; k++) {
    const i = RIGID_INDEX[k];
    const w = RIGID_WEIGHT[k];
    const p = src[i];
    const q = dst[i];
    if (!p || !q) continue;
    if (![p.x, p.y, q.x, q.y].every(Number.isFinite)) continue;
    const rows = [
      [p.x, -p.y, 1, 0, q.x],
      [p.y, p.x, 0, 1, q.y],
    ];
    for (const row of rows) {
      for (let r = 0; r < 4; r++) {
        rhs[r] += w * row[r] * row[4];
        for (let c = 0; c < 4; c++) A[r][c] += w * row[r] * row[c];
      }
    }
    used++;
  }
  if (used < 4) return null;
  const s = solve4(A, rhs);
  if (!s) return null;
  const scale = Math.hypot(s[0], s[1]);
  if (scale < 0.45 || scale > 2.2) return null;
  return { a: s[0], b: s[1], tx: s[2], ty: s[3] };
}

function applySim(s: Sim, p: Vec): Vec {
  return {
    x: s.a * p.x - s.b * p.y + s.tx,
    y: s.b * p.x + s.a * p.y + s.ty,
  };
}

function invertSim(s: Sim): Sim {
  const det = s.a * s.a + s.b * s.b;
  if (det < 1e-8) return IDENTITY;
  return {
    a: s.a / det,
    b: -s.b / det,
    tx: -(s.a * s.tx + s.b * s.ty) / det,
    ty: -(-s.b * s.tx + s.a * s.ty) / det,
  };
}

function clone(points: Vec[]): Vec[] {
  return points.map((p) => ({ x: p.x, y: p.y }));
}

function poseAlpha(dt: number, speedPx: number): number {
  // Below ~16 px/s is detector noise. Above that, open the pose filter so a
  // turn lands on this frame instead of trailing the face.
  const cutoff = 1.8 + 0.55 * Math.max(0, speedPx - 16);
  return alpha(dt, Math.min(48, cutoff));
}

export class LandmarkStabilizer {
  private readonly count: number;
  private readonly residual: EuroParams;
  private ref: Vec[] | null = null;
  private tSeen: number | null = null;
  private prevRaw: Sim | null = null;
  private prevSim: Sim | null = null;
  private rx: OneEuroFilter[] = [];
  private ry: OneEuroFilter[] = [];

  constructor(count: number, residual: EuroParams) {
    this.count = count;
    // Every landmark uses the same residual. A slower filter on the lids
    // than on the lips is what made one layer slide off the others.
    this.residual = {
      minCutoff: Math.max(2.8, residual.minCutoff),
      beta: Math.max(1.15, residual.beta),
      dCutoff: Math.max(6, residual.dCutoff),
    };
    this.alloc();
  }

  private alloc(): void {
    const p = this.residual;
    this.rx = [];
    this.ry = [];
    for (let i = 0; i < this.count; i++) {
      this.rx.push(new OneEuroFilter(p.minCutoff, p.beta, p.dCutoff));
      this.ry.push(new OneEuroFilter(p.minCutoff, p.beta, p.dCutoff));
    }
  }

  reset(): void {
    this.ref = null;
    this.prevRaw = null;
    this.prevSim = null;
    for (const f of this.rx) f.reset();
    for (const f of this.ry) f.reset();
  }

  private poseTravel(from: Sim, to: Sim): number {
    if (!this.ref) return 0;
    let sum = 0;
    let n = 0;
    for (let k = 0; k < RIGID_INDEX.length; k++) {
      const p = this.ref[RIGID_INDEX[k]];
      if (!p) continue;
      const a = applySim(from, p);
      const b = applySim(to, p);
      sum += Math.hypot(a.x - b.x, a.y - b.y);
      n++;
    }
    return n ? sum / n : 0;
  }

  private snapResiduals(): void {
    for (const f of this.rx) f.reset();
    for (const f of this.ry) f.reset();
  }

  smooth(points: Vec[], tSeconds: number): Vec[] {
    if (this.tSeen !== null && tSeconds - this.tSeen > 0.45) this.reset();
    const prevT = this.tSeen;
    this.tSeen = tSeconds;
    if (points.length !== this.count) {
      this.reset();
      return clone(points);
    }
    if (!this.ref) {
      this.ref = clone(points);
      this.prevRaw = IDENTITY;
      this.prevSim = IDENTITY;
      return clone(points);
    }
    const raw = fitSimilarity(this.ref, points) ?? IDENTITY;
    const dt = prevT === null ? 1 / 30 : Math.max(1e-4, tSeconds - prevT);
    const jump = this.prevRaw ? this.poseTravel(this.prevRaw, raw) : 0;
    const behind = this.prevSim ? this.poseTravel(this.prevSim, raw) : 0;
    // A detection pop, or a pose that has fallen more than a lid-width
    // behind, takes the raw frame now. Creeping back is the stutter.
    if (jump > 22 || behind > 12) {
      this.snapResiduals();
      this.prevRaw = raw;
      this.prevSim = raw;
      return clone(points);
    }
    const speed = jump / dt;
    const blend = poseAlpha(dt, speed);
    const prev = this.prevSim ?? raw;
    const sim: Sim = {
      a: prev.a + (raw.a - prev.a) * blend,
      b: prev.b + (raw.b - prev.b) * blend,
      tx: prev.tx + (raw.tx - prev.tx) * blend,
      ty: prev.ty + (raw.ty - prev.ty) * blend,
    };
    this.prevRaw = raw;
    this.prevSim = sim;
    const inv = invertSim(raw);
    const out: Vec[] = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const rest = applySim(inv, p);
      const fx = this.rx[i].filter(rest.x, tSeconds);
      const fy = this.ry[i].filter(rest.y, tSeconds);
      out[i] = applySim(sim, { x: fx, y: fy });
    }
    return out;
  }
}

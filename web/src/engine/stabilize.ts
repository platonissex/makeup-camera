// Rigid pose + expression residuals.
// Independent One Euro on every landmark lags as a block when the head
// turns (the mask swims) and still jitters relative to itself. Here the
// similarity that carries the head (eyes, nose bridge, forehead, cheeks)
// is filtered quickly, and each point's leftover motion is filtered on
// its own so talk and blinks stay put without dragging the whole mask.

export type Vec = { x: number; y: number };

export type EuroParams = {
  minCutoff: number;
  beta: number;
  dCutoff: number;
};

export const SMOOTHING_NAME = "rigid-residual-one-euro";

const RIGID_INDEX = [33, 263, 133, 362, 6, 168, 10, 151, 234, 454, 1];
const RIGID_WEIGHT = [1, 1, 1, 1, 1, 0.9, 0.75, 0.7, 0.65, 0.65, 0.35];

const LIP = new Set<number>([
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84,
  181, 91, 146, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402,
  317, 14, 87, 178, 88, 95,
]);

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

export class LandmarkStabilizer {
  private readonly count: number;
  private readonly residual: EuroParams;
  private ref: Vec[] | null = null;
  private tSeen: number | null = null;
  private rx: OneEuroFilter[] = [];
  private ry: OneEuroFilter[] = [];
  private simF = {
    a: new OneEuroFilter(1.7, 1.8, 7),
    b: new OneEuroFilter(1.7, 1.8, 7),
    tx: new OneEuroFilter(1.7, 1.8, 7),
    ty: new OneEuroFilter(1.7, 1.8, 7),
  };

  constructor(count: number, residual: EuroParams) {
    this.count = count;
    this.residual = {
      minCutoff: residual.minCutoff,
      beta: residual.beta,
      dCutoff: Math.max(1.6, residual.dCutoff),
    };
    this.alloc();
  }

  private alloc(): void {
    const base = this.residual;
    this.rx = [];
    this.ry = [];
    for (let i = 0; i < this.count; i++) {
      const lip = LIP.has(i);
      const minCutoff = lip ? base.minCutoff * 1.45 : base.minCutoff;
      const beta = lip ? Math.max(0.55, base.beta * 4) : base.beta;
      const dCutoff = lip ? Math.max(2.4, base.dCutoff) : base.dCutoff;
      this.rx.push(new OneEuroFilter(minCutoff, beta, dCutoff));
      this.ry.push(new OneEuroFilter(minCutoff, beta, dCutoff));
    }
  }

  reset(): void {
    this.ref = null;
    this.simF.a.reset();
    this.simF.b.reset();
    this.simF.tx.reset();
    this.simF.ty.reset();
    for (const f of this.rx) f.reset();
    for (const f of this.ry) f.reset();
  }

  smooth(points: Vec[], tSeconds: number): Vec[] {
    if (this.tSeen !== null && tSeconds - this.tSeen > 0.45) this.reset();
    this.tSeen = tSeconds;
    if (points.length !== this.count) {
      this.reset();
      return clone(points);
    }
    if (!this.ref) {
      this.ref = clone(points);
      return clone(points);
    }
    const raw = fitSimilarity(this.ref, points) ?? IDENTITY;
    const sim: Sim = {
      a: this.simF.a.filter(raw.a, tSeconds),
      b: this.simF.b.filter(raw.b, tSeconds),
      tx: this.simF.tx.filter(raw.tx, tSeconds),
      ty: this.simF.ty.filter(raw.ty, tSeconds),
    };
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

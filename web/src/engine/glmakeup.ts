// WebGL2 pigment for the shared try-on / long-press path.
// Masks are feathered in a shader, then multiplied or soft-lit onto the
// camera frame already in the 2D view. Lips get a second softer pass plus
// a pose-shifted gloss. Eyeliner is a dark core with a short feather so it
// does not leave an orange halo.

import earcut from "earcut";

export type Pt = { x: number; y: number };

export type GlFill = {
  points: Pt[];
  holes?: Pt[][];
  alpha: number;
};

export type GlLine = {
  points: Pt[];
  alpha: number;
  widthImg: number;
};

export type GlBrush = {
  center: Pt;
  axis: Pt;
  perp: Pt;
  alongOut: number;
  alongIn: number;
  across: number;
  alpha: number;
};

export type GlLayer = {
  style: string;
  fills: GlFill[];
  lines: GlLine[];
  brushes: GlBrush[];
};

export type GlMap = {
  map(p: Pt): Pt;
  mapLen(n: number): number;
};

export type GlState = { yaw?: number; look?: string };

type Rgb = [number, number, number];

type Recipe = {
  lip: Rgb;
  lipOp: number;
  lipSoft: Rgb;
  lipSoftOp: number;
  gloss: number;
  glossRgb: Rgb;
  liner: Rgb;
  linerOp: number;
  shadow: Rgb;
  shadowOp: number;
  deep: Rgb;
  deepOp: number;
  blush: Rgb;
  blushOp: number;
  hiOp: number;
};

const DAILY: Recipe = {
  lip: [0.64, 0.36, 0.38],
  lipOp: 0.3,
  lipSoft: [0.8, 0.5, 0.52],
  lipSoftOp: 0.1,
  gloss: 0.12,
  glossRgb: [1, 0.84, 0.78],
  liner: [0.14, 0.09, 0.08],
  linerOp: 0.62,
  shadow: [0.55, 0.42, 0.4],
  shadowOp: 0.13,
  deep: [0.42, 0.3, 0.28],
  deepOp: 0.16,
  blush: [0.74, 0.45, 0.46],
  blushOp: 0.14,
  hiOp: 0.08,
};

const EVENING: Recipe = {
  lip: [0.46, 0.16, 0.2],
  lipOp: 0.46,
  lipSoft: [0.68, 0.28, 0.32],
  lipSoftOp: 0.16,
  gloss: 0.2,
  glossRgb: [1, 0.8, 0.74],
  liner: [0.07, 0.045, 0.04],
  linerOp: 0.74,
  shadow: [0.42, 0.3, 0.28],
  shadowOp: 0.2,
  deep: [0.32, 0.2, 0.18],
  deepOp: 0.24,
  blush: [0.66, 0.34, 0.38],
  blushOp: 0.18,
  hiOp: 0.1,
};

function recipe(look?: string): Recipe {
  return look === "evening" ? EVENING : DAILY;
}

type GL = WebGL2RenderingContext;

type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };

type Session = {
  canvas: HTMLCanvasElement;
  gl: GL;
  mesh: WebGLProgram;
  line: WebGLProgram;
  blur: WebGLProgram;
  combine: WebGLProgram;
  gloss: WebGLProgram;
  brush: WebGLProgram;
  buf: WebGLBuffer;
  quad: WebGLBuffer;
  a: Target | null;
  b: Target | null;
  c: Target | null;
  holeEmpty: WebGLTexture;
};

type BBox = { x: number; y: number; w: number; h: number };

const GL_STYLES = new Set([
  "lip",
  "liner",
  "lash",
  "shadow",
  "shadowDeep",
  "blush",
  "highlight",
]);

let session: Session | null | undefined;
let drawnFrames = 0;
const drawnStyles = new Set<string>();

export function glPigmentActive(): boolean {
  return drawnFrames > 0;
}

export function glPigmentStyles(): string[] {
  return [...drawnStyles];
}

function fail(message: string): null {
  console.warn(message);
  session = null;
  return null;
}

function compile(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function program(gl: GL, vs: string, fs: string): WebGLProgram | null {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

const MESH_VS = `#version 300 es
layout(location=0) in vec2 aPos;
uniform vec2 uOrigin;
uniform vec2 uSize;
void main() {
  vec2 p = (aPos - uOrigin) / uSize;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;

const FILL_FS = `#version 300 es
precision highp float;
out vec4 o;
void main() { o = vec4(1.0); }`;

const LINE_VS = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in float aSide;
uniform vec2 uOrigin;
uniform vec2 uSize;
out float vSide;
void main() {
  vSide = aSide;
  vec2 p = (aPos - uOrigin) / uSize;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;

const LINE_FS = `#version 300 es
precision highp float;
in float vSide;
uniform float uFeather;
uniform float uAlpha;
out vec4 o;
void main() {
  float d = abs(vSide);
  float a = (1.0 - smoothstep(1.0 - uFeather, 1.0, d)) * uAlpha;
  o = vec4(a);
}`;

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const BLUR_FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec2 uDir;
uniform float uRadius;
in vec2 vUv;
out vec4 o;
void main() {
  float sigma = max(0.75, uRadius * 0.48);
  float sum = 0.0;
  float wsum = 0.0;
  int R = int(min(18.0, ceil(uRadius)));
  for (int i = -18; i <= 18; i++) {
    if (abs(i) > R) continue;
    float x = float(i);
    float w = exp(-0.5 * (x * x) / (sigma * sigma));
    sum += texture(uTex, vUv + uDir * uTexel * x).r * w;
    wsum += w;
  }
  o = vec4(sum / max(1e-4, wsum));
}`;

const COMBINE_FS = `#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform sampler2D uHole;
uniform vec3 uRgb;
uniform float uOpacity;
uniform float uPower;
uniform float uGrad;
in vec2 vUv;
out vec4 o;
void main() {
  float m = texture(uMask, vUv).r;
  float h = texture(uHole, vUv).r;
  float a = clamp(m * (1.0 - h), 0.0, 1.0);
  a = pow(max(a, 0.0), uPower);
  float shade = mix(1.15, 0.72, vUv.y);
  a *= mix(1.0, shade, uGrad);
  a = clamp(a * uOpacity, 0.0, 1.0);
  if (a < 0.004) discard;
  o = vec4(uRgb, a);
}`;

const GLOSS_FS = `#version 300 es
precision highp float;
uniform sampler2D uLip;
uniform sampler2D uHole;
uniform sampler2D uGloss;
uniform vec3 uRgb;
uniform float uOpacity;
in vec2 vUv;
out vec4 o;
void main() {
  float lip = texture(uLip, vUv).r;
  float hole = texture(uHole, vUv).r;
  float g = texture(uGloss, vUv).r;
  float a = g * clamp(lip * (1.0 - hole), 0.0, 1.0);
  a = pow(max(a, 0.0), 0.7);
  a = clamp(a * uOpacity, 0.0, 1.0);
  if (a < 0.004) discard;
  o = vec4(uRgb, a);
}`;

const BRUSH_VS = `#version 300 es
layout(location=0) in vec2 aPos;
uniform vec2 uOrigin;
uniform vec2 uSize;
out vec2 vCss;
void main() {
  vCss = aPos;
  vec2 p = (aPos - uOrigin) / uSize;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;

const BRUSH_FS = `#version 300 es
precision highp float;
in vec2 vCss;
uniform vec2 uCenter;
uniform vec2 uAxis;
uniform vec2 uPerp;
uniform float uOut;
uniform float uIn;
uniform float uAcross;
out vec4 o;
void main() {
  vec2 d = vCss - uCenter;
  float along = dot(d, uAxis);
  float across = dot(d, uPerp);
  float sigma = along >= 0.0 ? max(uOut, 1.0) : max(uIn, 1.0);
  float g = exp(-(along * along) / (sigma * sigma) - (across * across) / max(1.0, uAcross * uAcross));
  o = vec4(g);
}`;

function makeTarget(gl: GL, w: number, h: number): Target | null {
  const tex = gl.createTexture();
  const fb = gl.createFramebuffer();
  if (!tex || !fb) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
  return { tex, fb, w, h };
}

function resizeTarget(gl: GL, slot: Target | null, w: number, h: number): Target | null {
  if (slot && slot.w === w && slot.h === h) return slot;
  if (slot) {
    gl.deleteTexture(slot.tex);
    gl.deleteFramebuffer(slot.fb);
  }
  return makeTarget(gl, w, h);
}

function getSession(): Session | null {
  if (session !== undefined) return session;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    preserveDrawingBuffer: true,
    depth: false,
    stencil: false,
  });
  if (!gl) return fail("WebGL2 unavailable");
  const mesh = program(gl, MESH_VS, FILL_FS);
  const line = program(gl, LINE_VS, LINE_FS);
  const blur = program(gl, QUAD_VS, BLUR_FS);
  const combine = program(gl, QUAD_VS, COMBINE_FS);
  const gloss = program(gl, QUAD_VS, GLOSS_FS);
  const brush = program(gl, BRUSH_VS, BRUSH_FS);
  const buf = gl.createBuffer();
  const quad = gl.createBuffer();
  const holeEmpty = gl.createTexture();
  if (!mesh || !line || !blur || !combine || !gloss || !brush || !buf || !quad || !holeEmpty) {
    return fail("WebGL2 program link failed");
  }
  gl.bindTexture(gl.TEXTURE_2D, holeEmpty);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  session = {
    canvas,
    gl,
    mesh,
    line,
    blur,
    combine,
    gloss,
    brush,
    buf,
    quad,
    a: null,
    b: null,
    c: null,
    holeEmpty,
  };
  return session;
}

function toneOf(style: string, tone: Record<string, number> | null | undefined): number {
  if (!tone) return 1;
  const key = style === "shadowDeep" ? "shadow" : style;
  const v = tone[key];
  if (typeof v !== "number") return 1;
  return Math.max(0.85, Math.min(1.15, v));
}

function amp(alpha: number, tone: number, gain: number, cap: number): number {
  return Math.max(0, Math.min(cap, alpha * tone * gain));
}

function expand(box: BBox | null, x: number, y: number, pad: number): BBox {
  if (!box) return { x: x - pad, y: y - pad, w: pad * 2, h: pad * 2 };
  const x0 = Math.min(box.x, x - pad);
  const y0 = Math.min(box.y, y - pad);
  const x1 = Math.max(box.x + box.w, x + pad);
  const y1 = Math.max(box.y + box.h, y + pad);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function triangulate(outer: Pt[], holes: Pt[][]): Float32Array | null {
  if (outer.length < 3) return null;
  const coords: number[] = [];
  const holeStarts: number[] = [];
  for (const p of outer) coords.push(p.x, p.y);
  for (const hole of holes) {
    if (hole.length < 3) continue;
    holeStarts.push(coords.length / 2);
    for (const p of hole) coords.push(p.x, p.y);
  }
  const idx = earcut(coords, holeStarts.length ? holeStarts : undefined);
  if (idx.length < 3) return null;
  const out = new Float32Array(idx.length * 2);
  for (let i = 0; i < idx.length; i++) {
    out[i * 2] = coords[idx[i] * 2];
    out[i * 2 + 1] = coords[idx[i] * 2 + 1];
  }
  return out;
}

function extrude(points: Pt[], radius: number): { xy: Float32Array; side: Float32Array } | null {
  if (points.length < 2 || radius < 0.2) return null;
  const n = points.length;
  const normals: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    normals.push({ x: -ty, y: tx });
  }
  const xy: number[] = [];
  const side: number[] = [];
  const push = (p: Pt, s: number) => {
    xy.push(p.x, p.y);
    side.push(s);
  };
  for (let i = 0; i < n - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const na = normals[i];
    const nb = normals[i + 1];
    const aL = { x: a.x + na.x * radius, y: a.y + na.y * radius };
    const aR = { x: a.x - na.x * radius, y: a.y - na.y * radius };
    const bL = { x: b.x + nb.x * radius, y: b.y + nb.y * radius };
    const bR = { x: b.x - nb.x * radius, y: b.y - nb.y * radius };
    push(aL, 1);
    push(aR, -1);
    push(bL, 1);
    push(aR, -1);
    push(bR, -1);
    push(bL, 1);
  }
  return { xy: new Float32Array(xy), side: new Float32Array(side) };
}

function bindTarget(gl: GL, t: Target): void {
  gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
  gl.viewport(0, 0, t.w, t.h);
}

function clear(gl: GL): void {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawMesh(s: Session, origin: Pt, size: Pt, xy: Float32Array): void {
  const gl = s.gl;
  gl.useProgram(s.mesh);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
  gl.bufferData(gl.ARRAY_BUFFER, xy, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(s.mesh, "uOrigin"), origin.x, origin.y);
  gl.uniform2f(gl.getUniformLocation(s.mesh, "uSize"), size.x, size.y);
  gl.drawArrays(gl.TRIANGLES, 0, xy.length / 2);
}

function drawLines(s: Session, origin: Pt, size: Pt, xy: Float32Array, side: Float32Array, feather: number, alpha = 1): void {
  const gl = s.gl;
  gl.useProgram(s.line);
  const inter = new Float32Array(xy.length + side.length);
  const n = side.length;
  for (let i = 0; i < n; i++) {
    inter[i * 3] = xy[i * 2];
    inter[i * 3 + 1] = xy[i * 2 + 1];
    inter[i * 3 + 2] = side[i];
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
  gl.bufferData(gl.ARRAY_BUFFER, inter, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 12, 8);
  gl.uniform2f(gl.getUniformLocation(s.line, "uOrigin"), origin.x, origin.y);
  gl.uniform2f(gl.getUniformLocation(s.line, "uSize"), size.x, size.y);
  gl.uniform1f(gl.getUniformLocation(s.line, "uFeather"), feather);
  gl.uniform1f(gl.getUniformLocation(s.line, "uAlpha"), alpha);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.disableVertexAttribArray(1);
}

function blurPass(s: Session, src: Target, dst: Target, dir: Pt, radiusPx: number): void {
  const gl = s.gl;
  bindTarget(gl, dst);
  clear(gl);
  gl.useProgram(s.blur);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, src.tex);
  gl.uniform1i(gl.getUniformLocation(s.blur, "uTex"), 0);
  gl.uniform2f(gl.getUniformLocation(s.blur, "uTexel"), 1 / src.w, 1 / src.h);
  gl.uniform2f(gl.getUniformLocation(s.blur, "uDir"), dir.x, dir.y);
  gl.uniform1f(gl.getUniformLocation(s.blur, "uRadius"), radiusPx);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function blurInto(s: Session, radiusPx: number): void {
  if (!s.a || !s.b || radiusPx < 0.6) return;
  blurPass(s, s.a, s.b, { x: 1, y: 0 }, radiusPx);
  blurPass(s, s.b, s.a, { x: 0, y: 1 }, radiusPx);
}

function present(
  s: Session,
  ctx: CanvasRenderingContext2D,
  box: BBox,
  rgb: [number, number, number],
  opacity: number,
  power: number,
  grad: number,
  mode: GlobalCompositeOperation,
  hole: WebGLTexture | null,
): void {
  const gl = s.gl;
  if (!s.a) return;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, s.canvas.width, s.canvas.height);
  clear(gl);
  gl.disable(gl.BLEND);
  gl.useProgram(s.combine);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, s.a.tex);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, hole ?? s.holeEmpty);
  gl.uniform1i(gl.getUniformLocation(s.combine, "uMask"), 0);
  gl.uniform1i(gl.getUniformLocation(s.combine, "uHole"), 1);
  gl.uniform3f(gl.getUniformLocation(s.combine, "uRgb"), rgb[0], rgb[1], rgb[2]);
  gl.uniform1f(gl.getUniformLocation(s.combine, "uOpacity"), opacity);
  gl.uniform1f(gl.getUniformLocation(s.combine, "uPower"), power);
  gl.uniform1f(gl.getUniformLocation(s.combine, "uGrad"), grad);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.flush();
  ctx.save();
  ctx.globalCompositeOperation = mode;
  ctx.drawImage(s.canvas, box.x, box.y, box.w, box.h);
  ctx.restore();
}

function prepare(s: Session, pw: number, ph: number): boolean {
  s.canvas.width = pw;
  s.canvas.height = ph;
  s.a = resizeTarget(s.gl, s.a, pw, ph);
  s.b = resizeTarget(s.gl, s.b, pw, ph);
  s.c = resizeTarget(s.gl, s.c, pw, ph);
  return !!(s.a && s.b && s.c);
}

function beginMask(s: Session): void {
  const gl = s.gl;
  if (!s.a) return;
  bindTarget(gl, s.a);
  clear(gl);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.MAX);
  gl.blendFunc(gl.ONE, gl.ONE);
}

function mapPt(map: GlMap, p: Pt): Pt {
  return map.map(p);
}

function axisCss(map: GlMap, origin: Pt, vec: Pt): Pt {
  const a = map.map(origin);
  const b = map.map({ x: origin.x + vec.x * 40, y: origin.y + vec.y * 40 });
  let x = b.x - a.x;
  let y = b.y - a.y;
  const len = Math.hypot(x, y) || 1;
  x /= len;
  y /= len;
  return { x, y };
}

function lineRadius(style: string, widthImg: number, map: GlMap): number {
  const w = map.mapLen(widthImg);
  if (style === "liner") return Math.max(0.4, Math.min(0.85, w * 0.45 + 0.32));
  if (style === "lash") return Math.max(0.32, Math.min(0.6, w * 0.4 + 0.22));
  return Math.max(1.2, Math.min(7, w)) * 0.5;
}

function remember(style: string): void {
  drawnFrames++;
  drawnStyles.add(style);
  const g = globalThis as { __glPigment?: { frames: number; styles: string[] } };
  g.__glPigment = { frames: drawnFrames, styles: [...drawnStyles] };
}

export function renderGlPigment(
  ctx: CanvasRenderingContext2D,
  state: GlState,
  map: GlMap,
  layer: GlLayer,
  toneMap: Record<string, number> | null | undefined,
): boolean {
  if (!GL_STYLES.has(layer.style)) return false;
  const s = getSession();
  if (!s) return false;
  const tone = toneOf(layer.style, toneMap);
  try {
    if (layer.style === "liner" || layer.style === "lash") {
      return drawLineLayer(s, ctx, map, layer, tone, state);
    }
    if (layer.style === "blush" || layer.style === "highlight") {
      return drawBrushLayer(s, ctx, map, layer, tone, state);
    }
    if (layer.style === "lip") return drawLip(s, ctx, state, map, layer, tone);
    if (layer.style === "shadow" || layer.style === "shadowDeep") {
      return drawShadow(s, ctx, map, layer, tone, state);
    }
    return false;
  } catch (err) {
    console.warn("WebGL makeup", err);
    return false;
  }
}

function pixelSize(ctx: CanvasRenderingContext2D, box: BBox): { pw: number; ph: number; dpr: number } | null {
  const dpr = Math.min(2.5, Math.max(1, Math.abs(ctx.getTransform().a) || 1));
  let pw = Math.max(2, Math.round(box.w * dpr));
  let ph = Math.max(2, Math.round(box.h * dpr));
  const cap = 960;
  const scale = Math.min(1, cap / Math.max(pw, ph));
  pw = Math.max(2, Math.round(pw * scale));
  ph = Math.max(2, Math.round(ph * scale));
  if (box.w < 2 || box.h < 2) return null;
  return { pw, ph, dpr: pw / box.w };
}

function drawLip(
  s: Session,
  ctx: CanvasRenderingContext2D,
  state: GlState,
  map: GlMap,
  layer: GlLayer,
  tone: number,
): boolean {
  const fills = layer.fills.filter((f) => f.points.length >= 3 && f.alpha > 0.02);
  if (!fills.length) return true;
  const mapped: { points: Pt[]; holes: Pt[][]; alpha: number }[] = [];
  let box: BBox | null = null;
  const insetPx = 2.8;
  for (const f of fills) {
    const points = insetLoop(relaxLoop(f.points.map((p) => mapPt(map, p))), insetPx);
    const holes = (f.holes ?? []).map((h) => h.map((p) => mapPt(map, p)));
    for (const p of points) box = expand(box, p.x, p.y, 5);
    mapped.push({ points, holes, alpha: f.alpha });
  }
  if (!box) return true;
  const size = pixelSize(ctx, box);
  if (!size || !prepare(s, size.pw, size.ph)) return false;
  const origin = { x: box.x, y: box.y };
  const span = { x: box.w, y: box.h };
  beginMask(s);
  let any = false;
  const holeTris: Float32Array[] = [];
  for (const fill of mapped) {
    const tri = triangulate(fill.points, []);
    if (!tri) continue;
    any = true;
    drawMesh(s, origin, span, tri);
    for (const hole of fill.holes) {
      const ht = triangulate(hole, []);
      if (ht) holeTris.push(ht);
    }
  }
  if (!any) return false;
  s.gl.blendEquation(s.gl.FUNC_ADD);
  s.gl.disable(s.gl.BLEND);
  blurInto(s, 1.15 * size.dpr);
  let holeTex: WebGLTexture | null = null;
  if (holeTris.length && s.c && s.b) {
    bindTarget(s.gl, s.c);
    clear(s.gl);
    s.gl.enable(s.gl.BLEND);
    s.gl.blendEquation(s.gl.MAX);
    s.gl.blendFunc(s.gl.ONE, s.gl.ONE);
    for (const ht of holeTris) drawMesh(s, origin, span, ht);
    s.gl.disable(s.gl.BLEND);
    blurPass(s, s.c, s.b, { x: 1, y: 0 }, 0.65 * size.dpr);
    blurPass(s, s.b, s.c, { x: 0, y: 1 }, 0.65 * size.dpr);
    holeTex = s.c.tex;
  }
  const alpha = Math.max(...mapped.map((f) => f.alpha));
  const scale = Math.max(0.7, Math.min(1.2, alpha / 0.6)) * tone;
  const rec = recipe(state.look);
  present(s, ctx, box, rec.lip, Math.min(0.55, rec.lipOp * scale), 1.4, 0.06, "multiply", holeTex);
  present(s, ctx, box, rec.lipSoft, Math.min(0.22, rec.lipSoftOp * scale), 1.6, 0, "soft-light", holeTex);
  const holePts = mapped.flatMap((f) => f.holes.flat());
  drawLipGloss(s, ctx, state, box, mapped[0].points, holePts, holeTex, Math.min(0.28, rec.gloss * scale), rec.glossRgb);
  remember("lip");
  return true;
}

function relaxLoop(points: Pt[]): Pt[] {
  if (points.length < 6) return points;
  const n = points.length;
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = points[(i + n - 1) % n];
    const b = points[i];
    const c = points[(i + 1) % n];
    out.push({ x: a.x * 0.2 + b.x * 0.6 + c.x * 0.2, y: a.y * 0.2 + b.y * 0.6 + c.y * 0.2 });
  }
  return out;
}

function insetLoop(points: Pt[], px: number): Pt[] {
  const b = boundsOf(points);
  return points.map((p) => {
    const dx = b.cx - p.x;
    const dy = b.cy - p.y;
    const len = Math.hypot(dx, dy) || 1;
    const pull = Math.min(px, len * 0.16);
    return { x: p.x + (dx / len) * pull, y: p.y + (dy / len) * pull };
  });
}

function boundsOf(points: Pt[]): { minX: number; maxX: number; minY: number; maxY: number; cx: number; cy: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
    sx += p.x;
    sy += p.y;
  }
  const n = Math.max(1, points.length);
  return { minX, maxX, minY, maxY, cx: sx / n, cy: sy / n };
}

function drawLipGloss(
  s: Session,
  ctx: CanvasRenderingContext2D,
  state: GlState,
  box: BBox,
  points: Pt[],
  holePts: Pt[],
  hole: WebGLTexture | null,
  opacity: number,
  rgb: Rgb,
): void {
  if (!s.a || !s.b || points.length < 4 || opacity < 0.04) return;
  const all = boundsOf(points);
  const width = Math.max(8, all.maxX - all.minX);
  const yaw = state.yaw ?? 0;
  const shift = -yaw * width * 0.22;
  const mouth = holePts.length >= 3 ? boundsOf(holePts) : null;
  const lowerTop = mouth ? mouth.maxY : all.minY + (all.maxY - all.minY) * 0.58;
  const lowerH = Math.max(3, all.maxY - lowerTop);
  const midX = (mouth ? mouth.cx : all.cx) + shift;
  stampMaskedGloss(
    s,
    ctx,
    box,
    hole,
    { x: midX, y: lowerTop + lowerH * 0.42 },
    Math.max(3, width * 0.09),
    Math.max(1.6, lowerH * 0.22),
    opacity,
    rgb,
  );
}

function stampMaskedGloss(
  s: Session,
  ctx: CanvasRenderingContext2D,
  box: BBox,
  hole: WebGLTexture | null,
  center: Pt,
  rx: number,
  ry: number,
  opacity: number,
  rgb: [number, number, number],
): void {
  if (!s.a || !s.b || opacity < 0.02) return;
  const gl = s.gl;
  bindTarget(gl, s.b);
  clear(gl);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.MAX);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.useProgram(s.brush);
  const xy = new Float32Array([
    box.x, box.y,
    box.x + box.w, box.y,
    box.x, box.y + box.h,
    box.x + box.w, box.y,
    box.x + box.w, box.y + box.h,
    box.x, box.y + box.h,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
  gl.bufferData(gl.ARRAY_BUFFER, xy, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(s.brush, "uOrigin"), box.x, box.y);
  gl.uniform2f(gl.getUniformLocation(s.brush, "uSize"), box.w, box.h);
  gl.uniform2f(gl.getUniformLocation(s.brush, "uCenter"), center.x, center.y);
  gl.uniform2f(gl.getUniformLocation(s.brush, "uAxis"), 1, 0);
  gl.uniform2f(gl.getUniformLocation(s.brush, "uPerp"), 0, 1);
  gl.uniform1f(gl.getUniformLocation(s.brush, "uOut"), rx);
  gl.uniform1f(gl.getUniformLocation(s.brush, "uIn"), rx);
  gl.uniform1f(gl.getUniformLocation(s.brush, "uAcross"), ry);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.disable(gl.BLEND);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, s.canvas.width, s.canvas.height);
  clear(gl);
  gl.useProgram(s.gloss);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, s.a.tex);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, hole ?? s.holeEmpty);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, s.b.tex);
  gl.uniform1i(gl.getUniformLocation(s.gloss, "uLip"), 0);
  gl.uniform1i(gl.getUniformLocation(s.gloss, "uHole"), 1);
  gl.uniform1i(gl.getUniformLocation(s.gloss, "uGloss"), 2);
  gl.uniform3f(gl.getUniformLocation(s.gloss, "uRgb"), rgb[0], rgb[1], rgb[2]);
  gl.uniform1f(gl.getUniformLocation(s.gloss, "uOpacity"), opacity);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.flush();
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.drawImage(s.canvas, box.x, box.y, box.w, box.h);
  ctx.restore();
}

function drawLineLayer(
  s: Session,
  ctx: CanvasRenderingContext2D,
  map: GlMap,
  layer: GlLayer,
  tone: number,
  state: GlState,
): boolean {
  const lines = layer.lines.filter((ln) => ln.points.length >= 2 && ln.alpha > 0.02);
  if (!lines.length) return true;
  let box: BBox | null = null;
  const built: { xy: Float32Array; side: Float32Array; alpha: number }[] = [];
  for (const ln of lines) {
    const pts = ln.points.map((p) => mapPt(map, p));
    const radius = lineRadius(layer.style, ln.widthImg, map);
    for (const p of pts) box = expand(box, p.x, p.y, radius + 3);
    const mesh = extrude(pts, radius);
    if (mesh) built.push({ ...mesh, alpha: ln.alpha });
  }
  if (!box || !built.length) return true;
  const size = pixelSize(ctx, box);
  if (!size || !prepare(s, size.pw, size.ph)) return false;
  beginMask(s);
  const feather = layer.style === "liner" ? 0.62 : 0.7;
  for (const mesh of built) {
    drawLines(s, { x: box.x, y: box.y }, { x: box.w, y: box.h }, mesh.xy, mesh.side, feather, mesh.alpha);
  }
  s.gl.disable(s.gl.BLEND);
  const liner = layer.style === "liner";
  blurInto(s, (liner ? 0.45 : 0.35) * size.dpr);
  const alpha = Math.max(...built.map((b) => b.alpha));
  const rec = recipe(state.look);
  const dark = liner ? rec.liner : ([0.1, 0.07, 0.06] as Rgb);
  const opacity = liner ? Math.min(rec.linerOp, 0.8 * tone) : Math.min(0.4, alpha * tone * 0.9);
  present(s, ctx, box, dark, opacity, 1.15, 0, "multiply", null);
  remember(layer.style);
  return true;
}

function drawShadow(
  s: Session,
  ctx: CanvasRenderingContext2D,
  map: GlMap,
  layer: GlLayer,
  tone: number,
  state: GlState,
): boolean {
  const fills = layer.fills.filter((f) => f.points.length >= 3 && f.alpha > 0.02);
  if (!fills.length) return true;
  const mapped: { points: Pt[]; alpha: number }[] = [];
  let box: BBox | null = null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const f of fills) {
    const points = f.points.map((p) => mapPt(map, p));
    for (const p of points) {
      box = expand(box, p.x, p.y, 10);
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    mapped.push({ points, alpha: f.alpha });
  }
  if (!box) return true;
  const size = pixelSize(ctx, box);
  if (!size || !prepare(s, size.pw, size.ph)) return false;
  beginMask(s);
  let any = false;
  for (const fill of mapped) {
    const tri = triangulate(fill.points, []);
    if (!tri) continue;
    any = true;
    drawMesh(s, { x: box.x, y: box.y }, { x: box.w, y: box.h }, tri);
  }
  if (!any) return false;
  s.gl.disable(s.gl.BLEND);
  const deep = layer.style === "shadowDeep";
  const feat = Math.max(8, Math.min(maxX - minX, maxY - minY));
  const blurPx = Math.max(3.2, Math.min(deep ? 8 : 7.5, feat * (deep ? 0.2 : 0.18)));
  blurInto(s, blurPx * size.dpr);
  const alpha = Math.max(...mapped.map((f) => f.alpha));
  const rec = recipe(state.look);
  const rgb = deep ? rec.deep : rec.shadow;
  const cap = deep ? rec.deepOp : rec.shadowOp;
  present(s, ctx, box, rgb, Math.min(cap, alpha * tone * 0.95), 1.05, deep ? 0.2 : 0.08, "multiply", null);
  remember(layer.style);
  return true;
}

function drawBrushLayer(
  s: Session,
  ctx: CanvasRenderingContext2D,
  map: GlMap,
  layer: GlLayer,
  tone: number,
  state: GlState,
): boolean {
  const brushes = layer.brushes.filter((b) => b.alpha > 0.02);
  if (!brushes.length) return true;
  let any = false;
  for (const brush of brushes) {
    const center = mapPt(map, brush.center);
    const axis = axisCss(map, brush.center, brush.axis);
    const perp = axisCss(map, brush.center, brush.perp);
    const alongOut = Math.max(4, map.mapLen(brush.alongOut));
    const alongIn = Math.max(3, map.mapLen(brush.alongIn));
    const across = Math.max(2, map.mapLen(brush.across));
    const reach = Math.max(alongOut, alongIn, across) * 2.8;
    const box: BBox = { x: center.x - reach, y: center.y - reach, w: reach * 2, h: reach * 2 };
    const size = pixelSize(ctx, box);
    if (!size || !prepare(s, size.pw, size.ph)) return false;
    beginMask(s);
    const gl = s.gl;
    gl.useProgram(s.brush);
    const xy = new Float32Array([
      box.x, box.y,
      box.x + box.w, box.y,
      box.x, box.y + box.h,
      box.x + box.w, box.y,
      box.x + box.w, box.y + box.h,
      box.x, box.y + box.h,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
    gl.bufferData(gl.ARRAY_BUFFER, xy, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(gl.getUniformLocation(s.brush, "uOrigin"), box.x, box.y);
    gl.uniform2f(gl.getUniformLocation(s.brush, "uSize"), box.w, box.h);
    gl.uniform2f(gl.getUniformLocation(s.brush, "uCenter"), center.x, center.y);
    gl.uniform2f(gl.getUniformLocation(s.brush, "uAxis"), axis.x, axis.y);
    gl.uniform2f(gl.getUniformLocation(s.brush, "uPerp"), perp.x, perp.y);
    gl.uniform1f(gl.getUniformLocation(s.brush, "uOut"), alongOut);
    gl.uniform1f(gl.getUniformLocation(s.brush, "uIn"), alongIn);
    gl.uniform1f(gl.getUniformLocation(s.brush, "uAcross"), across);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disable(gl.BLEND);
    const hi = layer.style === "highlight";
    const rec = recipe(state.look);
    const rgb: Rgb = hi ? [1, 0.96, 0.93] : rec.blush;
    const mode: GlobalCompositeOperation = hi ? "soft-light" : "multiply";
    const cap = hi ? rec.hiOp : rec.blushOp;
    present(s, ctx, box, rgb, Math.min(cap, brush.alpha * tone * (hi ? 0.5 : 0.75)), 1.05, 0, mode, null);
    any = true;
  }
  if (any) remember(layer.style);
  return true;
}

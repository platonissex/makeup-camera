// WebGL2 try-on. A feathered skin mask gets an edge-aware beauty pass
// (separable bilateral blur of the photo, then a warm lift), then cheek,
// lip, and highlight color is mixed in the shader so it follows the photo.
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
  shadowOp: 0.28,
  deep: [0.42, 0.3, 0.28],
  deepOp: 0.2,
  blush: [0.94, 0.42, 0.46],
  blushOp: 0.42,
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
  shadowOp: 0.36,
  deep: [0.32, 0.2, 0.18],
  deepOp: 0.26,
  blush: [0.9, 0.34, 0.4],
  blushOp: 0.48,
  hiOp: 0.1,
};

const BLUSH: Recipe = {
  lip: [0.82, 0.46, 0.5],
  lipOp: 0.22,
  lipSoft: [0.92, 0.62, 0.64],
  lipSoftOp: 0.08,
  gloss: 0.08,
  glossRgb: [1, 0.86, 0.82],
  liner: [0.14, 0.09, 0.08],
  linerOp: 0.62,
  shadow: [0.7, 0.48, 0.46],
  shadowOp: 0.12,
  deep: [0.55, 0.36, 0.34],
  deepOp: 0.08,
  blush: [0.95, 0.42, 0.48],
  blushOp: 0.4,
  hiOp: 0.05,
};

function recipe(look?: string): Recipe {
  if (look === "evening") return EVENING;
  if (look === "blush") return BLUSH;
  return DAILY;
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
  fusion: WebGLProgram;
  rgbBlur: WebGLProgram;
  buf: WebGLBuffer;
  quad: WebGLBuffer;
  a: Target | null;
  b: Target | null;
  c: Target | null;
  soft: Target | null;
  holeEmpty: WebGLTexture;
  base: WebGLTexture | null;
  baseW: number;
  baseH: number;
  scratch: HTMLCanvasElement | null;
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
  "skin",
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
layout(location=2) in float aAlong;
uniform vec2 uOrigin;
uniform vec2 uSize;
out float vSide;
out float vAlong;
void main() {
  vSide = aSide;
  vAlong = aAlong;
  vec2 p = (aPos - uOrigin) / uSize;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;

const LINE_FS = `#version 300 es
precision highp float;
in float vSide;
in float vAlong;
uniform float uFeather;
uniform float uAlpha;
uniform float uTaper;
out vec4 o;
void main() {
  float d = abs(vSide);
  float edge = 1.0 - smoothstep(1.0 - uFeather, 1.0, d);
  float taper = 1.0;
  if (uTaper > 0.5) {
    taper *= smoothstep(0.0, 0.07, vAlong);
    taper *= 1.0 - smoothstep(0.64, 1.0, vAlong);
  }
  o = vec4(edge * uAlpha * taper);
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
  int R = int(min(28.0, ceil(uRadius)));
  for (int i = -28; i <= 28; i++) {
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

const FUSION_FS = `#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform sampler2D uBase;
uniform sampler2D uHole;
uniform vec3 uRgb;
uniform vec2 uTexel;
uniform float uOpacity;
uniform float uPower;
uniform float uSoften;
uniform float uLift;
uniform float uMode;
uniform float uLuma;
uniform sampler2D uSoft;
in vec2 vUv;
out vec4 o;

float softLight(float b, float s) {
  return s <= 0.5
    ? b - (1.0 - 2.0 * s) * b * (1.0 - b)
    : b + (2.0 * s - 1.0) * (sqrt(max(b, 0.0)) - b);
}
vec3 softLight3(vec3 b, vec3 s) {
  return vec3(softLight(b.r, s.r), softLight(b.g, s.g), softLight(b.b, s.b));
}
void main() {
  vec3 src = texture(uBase, vUv).rgb;
  vec3 soft = texture(uSoft, vUv).rgb;
  float m = pow(clamp(texture(uMask, vUv).r, 0.0, 1.0), max(0.35, uPower));
  m *= 1.0 - texture(uHole, vUv).r;
  float luma = dot(src, vec3(0.2126, 0.7152, 0.0722));
  float gate = 1.0;
  if (uLuma > 0.5) {
    float mid = smoothstep(0.05, 0.22, luma) * (1.0 - smoothstep(0.88, 0.99, luma));
    gate = mix(0.62, 1.0, mid);
  }
  float a = clamp(m * uOpacity * gate, 0.0, 1.0);
  vec3 color = src;
  if (uMode < 0.5) {
    float detail = length(src - soft);
    float keep = smoothstep(0.018, 0.12, detail);
    float softenAmt = clamp(uSoften, 0.0, 1.0) * a * (1.0 - 0.75 * keep);
    color = mix(src, soft, softenAmt);
    vec3 lifted = min(vec3(1.0), color + vec3(0.070, 0.042, 0.022));
    color = mix(color, lifted, clamp(uLift, 0.0, 1.0) * a);
  } else if (uMode < 1.5) {
    color = mix(src, softLight3(src, uRgb), a);
  } else if (uMode < 2.5) {
    color = mix(src, src * uRgb, a);
  } else {
    color = mix(src, 1.0 - (1.0 - src) * (1.0 - uRgb), a);
  }
  o = vec4(color, 1.0);
}`;

const RGB_BLUR_FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uOrig;
uniform vec2 uTexel;
uniform vec2 uDir;
uniform float uRadius;
in vec2 vUv;
out vec4 o;
void main() {
  vec3 center = texture(uOrig, vUv).rgb;
  float sigma = max(1.0, uRadius * 0.5);
  float range2 = 0.11 * 0.11;
  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  int R = int(min(16.0, ceil(uRadius)));
  for (int i = -16; i <= 16; i++) {
    if (abs(i) > R) continue;
    float x = float(i);
    vec2 uv = vUv + uDir * uTexel * x;
    vec3 c = texture(uTex, uv).rgb;
    vec3 ref = texture(uOrig, uv).rgb;
    vec3 d = ref - center;
    float spatial = exp(-0.5 * (x * x) / (sigma * sigma));
    float range = exp(-dot(d, d) / (2.0 * range2));
    float w = spatial * range;
    sum += c * w;
    wsum += w;
  }
  o = vec4(sum / max(1e-4, wsum), 1.0);
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
  const fusion = program(gl, QUAD_VS, FUSION_FS);
  const rgbBlur = program(gl, QUAD_VS, RGB_BLUR_FS);
  const buf = gl.createBuffer();
  const quad = gl.createBuffer();
  const holeEmpty = gl.createTexture();
  if (!mesh || !line || !blur || !combine || !gloss || !brush || !fusion || !rgbBlur || !buf || !quad || !holeEmpty) {
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
    fusion,
    rgbBlur,
    buf,
    quad,
    a: null,
    b: null,
    c: null,
    soft: null,
    holeEmpty,
    base: null,
    baseW: 0,
    baseH: 0,
    scratch: null,
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

function extrude(
  points: Pt[],
  radius: number,
  taper: boolean,
): { xy: Float32Array; side: Float32Array; along: Float32Array } | null {
  if (points.length < 2 || radius < 0.2) return null;
  const n = points.length;
  const cum = new Array<number>(n);
  cum[0] = 0;
  for (let i = 1; i < n; i++) {
    cum[i] = cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const total = Math.max(1e-4, cum[n - 1]);
  const left: Pt[] = new Array(n);
  const right: Pt[] = new Array(n);
  const al = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(n - 1, i + 1);
    let tx = points[i1].x - points[i0].x;
    let ty = points[i1].y - points[i0].y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    let nx = -ty;
    let ny = tx;
    if (i > 0 && i < n - 1) {
      let inx = points[i].x - points[i - 1].x;
      let iny = points[i].y - points[i - 1].y;
      let outx = points[i + 1].x - points[i].x;
      let outy = points[i + 1].y - points[i].y;
      const il = Math.hypot(inx, iny) || 1;
      const ol = Math.hypot(outx, outy) || 1;
      inx /= il;
      iny /= il;
      outx /= ol;
      outy /= ol;
      const n1x = -iny;
      const n1y = inx;
      const n2x = -outy;
      const n2y = outx;
      let mx = n1x + n2x;
      let my = n1y + n2y;
      const ml = Math.hypot(mx, my);
      if (ml > 1e-4) {
        mx /= ml;
        my /= ml;
        const denom = mx * n2x + my * n2y;
        const miter = denom > 0.35 ? Math.min(2.1, 1 / denom) : 1;
        nx = mx * miter;
        ny = my * miter;
      }
    }
    const along = cum[i] / total;
    let rad = radius;
    if (taper) {
      const tip = along <= 0.64 ? 1 : Math.max(0.22, (1 - (along - 0.64) / 0.36) ** 1.2);
      const root = along >= 0.045 ? 1 : 0.62 + (along / 0.045) * 0.38;
      rad *= tip * root;
    }
    const p = points[i];
    left[i] = { x: p.x + nx * rad, y: p.y + ny * rad };
    right[i] = { x: p.x - nx * rad, y: p.y - ny * rad };
    al[i] = along;
  }
  const xy: number[] = [];
  const side: number[] = [];
  const along: number[] = [];
  const push = (p: Pt, s: number, a: number) => {
    xy.push(p.x, p.y);
    side.push(s);
    along.push(a);
  };
  for (let i = 0; i < n - 1; i++) {
    push(left[i], 1, al[i]);
    push(right[i], -1, al[i]);
    push(left[i + 1], 1, al[i + 1]);
    push(right[i], -1, al[i]);
    push(right[i + 1], -1, al[i + 1]);
    push(left[i + 1], 1, al[i + 1]);
  }
  return {
    xy: new Float32Array(xy),
    side: new Float32Array(side),
    along: new Float32Array(along),
  };
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

function drawLines(
  s: Session,
  origin: Pt,
  size: Pt,
  xy: Float32Array,
  side: Float32Array,
  along: Float32Array,
  feather: number,
  alpha = 1,
  taper = 0,
): void {
  const gl = s.gl;
  gl.useProgram(s.line);
  const n = side.length;
  const inter = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    inter[i * 4] = xy[i * 2];
    inter[i * 4 + 1] = xy[i * 2 + 1];
    inter[i * 4 + 2] = side[i];
    inter[i * 4 + 3] = along[i];
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
  gl.bufferData(gl.ARRAY_BUFFER, inter, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 16, 12);
  gl.uniform2f(gl.getUniformLocation(s.line, "uOrigin"), origin.x, origin.y);
  gl.uniform2f(gl.getUniformLocation(s.line, "uSize"), size.x, size.y);
  gl.uniform1f(gl.getUniformLocation(s.line, "uFeather"), feather);
  gl.uniform1f(gl.getUniformLocation(s.line, "uAlpha"), alpha);
  gl.uniform1f(gl.getUniformLocation(s.line, "uTaper"), taper);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.disableVertexAttribArray(1);
  gl.disableVertexAttribArray(2);
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

function rgbBlurPass(
  s: Session,
  src: WebGLTexture,
  dst: Target,
  dir: Pt,
  radiusPx: number,
  srcW: number,
  srcH: number,
  orig: WebGLTexture,
): void {
  const gl = s.gl;
  bindTarget(gl, dst);
  clear(gl);
  gl.disable(gl.BLEND);
  gl.useProgram(s.rgbBlur);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, src);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, orig);
  gl.uniform1i(loc(gl, s.rgbBlur, "uTex"), 0);
  gl.uniform1i(loc(gl, s.rgbBlur, "uOrig"), 1);
  gl.uniform2f(loc(gl, s.rgbBlur, "uTexel"), 1 / srcW, 1 / srcH);
  gl.uniform2f(loc(gl, s.rgbBlur, "uDir"), dir.x, dir.y);
  gl.uniform1f(loc(gl, s.rgbBlur, "uRadius"), radiusPx);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function softBase(s: Session, radiusPx: number): WebGLTexture | null {
  if (!s.base || !s.b || !s.soft || radiusPx < 0.8) return s.base;
  rgbBlurPass(s, s.base, s.b, { x: 1, y: 0 }, radiusPx, s.baseW, s.baseH, s.base);
  rgbBlurPass(s, s.b.tex, s.soft, { x: 0, y: 1 }, radiusPx, s.b.w, s.b.h, s.base);
  return s.soft.tex;
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

function ensureBase(s: Session, w: number, h: number): WebGLTexture | null {
  const gl = s.gl;
  if (s.base && s.baseW === w && s.baseH === h) return s.base;
  if (s.base) gl.deleteTexture(s.base);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  s.base = tex;
  s.baseW = w;
  s.baseH = h;
  return tex;
}

function uploadBase(s: Session, ctx: CanvasRenderingContext2D, box: BBox): boolean {
  const src = ctx.canvas as HTMLCanvasElement;
  const m = ctx.getTransform();
  const x = box.x * m.a + box.y * m.c + m.e;
  const y = box.x * m.b + box.y * m.d + m.f;
  const w = box.w * m.a + box.h * m.c;
  const h = box.w * m.b + box.h * m.d;
  if (w < 2 || h < 2 || !s.a) return false;
  if (!s.scratch) s.scratch = document.createElement("canvas");
  const scratch = s.scratch;
  scratch.width = s.canvas.width;
  scratch.height = s.canvas.height;
  const g = scratch.getContext("2d");
  if (!g) return false;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, scratch.width, scratch.height);
  g.drawImage(src, x, y, w, h, 0, 0, scratch.width, scratch.height);
  const tex = ensureBase(s, scratch.width, scratch.height);
  if (!tex) return false;
  const gl = s.gl;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scratch);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  return true;
}

function fuse(
  s: Session,
  ctx: CanvasRenderingContext2D,
  box: BBox,
  rgb: Rgb,
  opacity: number,
  opts: { mode: number; power: number; soften: number; lift: number; luma: boolean; blur: number },
  hole: WebGLTexture | null = null,
): void {
  const gl = s.gl;
  if (!s.a || opacity < 0.004 || !uploadBase(s, ctx, box) || !s.base) return;
  const soft = opts.soften > 0.001 ? softBase(s, opts.blur) : s.base;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, s.canvas.width, s.canvas.height);
  clear(gl);
  gl.disable(gl.BLEND);
  gl.useProgram(s.fusion);
  gl.bindBuffer(gl.ARRAY_BUFFER, s.quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, s.a.tex);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, s.base);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, hole ?? s.holeEmpty);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, soft ?? s.base);
  gl.uniform1i(loc(gl, s.fusion, "uMask"), 0);
  gl.uniform1i(loc(gl, s.fusion, "uBase"), 1);
  gl.uniform1i(loc(gl, s.fusion, "uHole"), 2);
  gl.uniform1i(loc(gl, s.fusion, "uSoft"), 3);
  gl.uniform3f(loc(gl, s.fusion, "uRgb"), rgb[0], rgb[1], rgb[2]);
  gl.uniform2f(loc(gl, s.fusion, "uTexel"), 1 / s.canvas.width, 1 / s.canvas.height);
  gl.uniform1f(loc(gl, s.fusion, "uOpacity"), opacity);
  gl.uniform1f(loc(gl, s.fusion, "uPower"), opts.power);
  gl.uniform1f(loc(gl, s.fusion, "uSoften"), opts.soften);
  gl.uniform1f(loc(gl, s.fusion, "uLift"), opts.lift);
  gl.uniform1f(loc(gl, s.fusion, "uMode"), opts.mode);
  gl.uniform1f(loc(gl, s.fusion, "uLuma"), opts.luma ? 1 : 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.flush();
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(s.canvas, box.x, box.y, box.w, box.h);
  ctx.restore();
}

function prepare(s: Session, pw: number, ph: number): boolean {
  s.canvas.width = pw;
  s.canvas.height = ph;
  s.a = resizeTarget(s.gl, s.a, pw, ph);
  s.b = resizeTarget(s.gl, s.b, pw, ph);
  s.c = resizeTarget(s.gl, s.c, pw, ph);
  s.soft = resizeTarget(s.gl, s.soft, pw, ph);
  return !!(s.a && s.b && s.c && s.soft);
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
  if (style === "liner") return Math.max(1.15, Math.min(1.45, w * 0.35 + 1.1));
  if (style === "lash") return Math.max(0.32, Math.min(0.6, w * 0.4 + 0.22));
  return Math.max(1.2, Math.min(7, w)) * 0.5;
}

function remember(style: string): void {
  drawnFrames++;
  const added = !drawnStyles.has(style);
  if (added) drawnStyles.add(style);
  const g = globalThis as { __glPigment?: { frames: number; styles: string[] } };
  if (!g.__glPigment || added) g.__glPigment = { frames: drawnFrames, styles: [...drawnStyles] };
  else g.__glPigment.frames = drawnFrames;
}

const uniformLocs = new WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
function loc(gl: GL, program: WebGLProgram, name: string): WebGLUniformLocation | null {
  let table = uniformLocs.get(program);
  if (!table) {
    table = new Map();
    uniformLocs.set(program, table);
  }
  if (table.has(name)) return table.get(name) ?? null;
  const found = gl.getUniformLocation(program, name);
  table.set(name, found);
  return found;
}

let paintedLook = "";

function growLoop(points: Pt[], k: number): Pt[] {
  if (points.length < 3) return points;
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  cx /= points.length;
  cy /= points.length;
  return points.map((p) => ({ x: cx + (p.x - cx) * k, y: cy + (p.y - cy) * k }));
}

function drawSkin(
  s: Session,
  ctx: CanvasRenderingContext2D,
  map: GlMap,
  layer: GlLayer,
  tone: number,
): boolean {
  const fills = layer.fills.filter((f) => f.points.length >= 8 && f.alpha > 0.02);
  if (!fills.length) return true;
  let box: BBox | null = null;
  const mapped: { points: Pt[]; holes: Pt[][]; alpha: number }[] = [];
  for (const f of fills) {
    const points = f.points.map((p) => mapPt(map, p));
    const holes = (f.holes ?? []).map((h, i) =>
      growLoop(h.map((p) => mapPt(map, p)), i < 2 ? 1.34 : i < 4 ? 1.08 : 1.18),
    );
    for (const p of points) box = expand(box, p.x, p.y, 18);
    mapped.push({ points, holes, alpha: f.alpha });
  }
  if (!box) return true;
  const size = pixelSize(ctx, box);
  if (!size || !prepare(s, size.pw, size.ph)) return false;
  const origin = { x: box.x, y: box.y };
  const span = { x: box.w, y: box.h };
  beginMask(s);
  let any = false;
  for (const fill of mapped) {
    const tri = triangulate(fill.points, fill.holes);
    if (!tri) continue;
    any = true;
    drawMesh(s, origin, span, tri);
  }
  if (!any) return false;
  s.gl.blendEquation(s.gl.FUNC_ADD);
  s.gl.disable(s.gl.BLEND);
  blurInto(s, Math.max(10, Math.min(26, size.pw * 0.04)));
  let holeTex: WebGLTexture | null = null;
  const holePts = mapped.flatMap((f) => f.holes);
  if (holePts.length && s.c && s.b) {
    bindTarget(s.gl, s.c);
    clear(s.gl);
    s.gl.enable(s.gl.BLEND);
    s.gl.blendEquation(s.gl.MAX);
    s.gl.blendFunc(s.gl.ONE, s.gl.ONE);
    for (const hole of holePts) {
      const ht = triangulate(hole, []);
      if (ht) drawMesh(s, origin, span, ht);
    }
    s.gl.disable(s.gl.BLEND);
    blurPass(s, s.c, s.b, { x: 1, y: 0 }, Math.max(3, size.pw * 0.012));
    blurPass(s, s.b, s.c, { x: 0, y: 1 }, Math.max(3, size.pw * 0.012));
    holeTex = s.c.tex;
  }
  const alpha = Math.max(...mapped.map((f) => f.alpha)) * tone;
  fuse(
    s,
    ctx,
    box,
    [1, 0.97, 0.94],
    Math.min(1, alpha),
    {
      mode: 0,
      power: 1.04,
      soften: 0.82,
      lift: 0.78,
      luma: true,
      blur: Math.max(14, Math.min(16, size.pw * 0.03)),
    },
    holeTex,
  );
  remember("skin");
  return true;
}

export function renderGlPigment(
  ctx: CanvasRenderingContext2D,
  state: GlState,
  map: GlMap,
  layer: GlLayer,
  toneMap: Record<string, number> | null | undefined,
): boolean {
  const look = state.look || "";
  if (look !== paintedLook) {
    paintedLook = look;
    drawnStyles.clear();
  }
  if (!GL_STYLES.has(layer.style)) return false;
  const s = getSession();
  if (!s) return false;
  const tone = toneOf(layer.style, toneMap);
  try {
    if (layer.style === "liner" || layer.style === "lash") {
      return drawLineLayer(s, ctx, map, layer, tone, state);
    }
    if (layer.style === "skin") return drawSkin(s, ctx, map, layer, tone);
    if (layer.style === "blush" || layer.style === "highlight") {
      return drawBrushLayer(s, ctx, map, layer, tone, state);
    }
    if (layer.style === "lip") return drawLip(s, ctx, state, map, layer, tone);
    if (layer.style === "shadow" || layer.style === "shadowDeep") {
      // A filled ribbon ends in a cap. Blur turns that cap into a hair at the
      // outer canthus. Try-on lid color is an ellipse brush instead.
      if (layer.brushes.length > 0 && layer.fills.length === 0) {
        return drawBrushLayer(s, ctx, map, layer, tone, state);
      }
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
  fuse(
    s,
    ctx,
    box,
    rec.lip,
    Math.min(0.4, rec.lipOp * scale),
    { mode: 2, power: 1.35, soften: 0, lift: 0, luma: true, blur: 1 },
    holeTex,
  );
  fuse(
    s,
    ctx,
    box,
    rec.lipSoft,
    Math.min(0.16, rec.lipSoftOp * scale),
    { mode: 1, power: 1.55, soften: 0, lift: 0, luma: true, blur: 1 },
    holeTex,
  );
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
  gl.uniform2f(loc(gl, s.brush, "uOrigin"), box.x, box.y);
  gl.uniform2f(loc(gl, s.brush, "uSize"), box.w, box.h);
  gl.uniform2f(loc(gl, s.brush, "uCenter"), center.x, center.y);
  gl.uniform2f(loc(gl, s.brush, "uAxis"), 1, 0);
  gl.uniform2f(loc(gl, s.brush, "uPerp"), 0, 1);
  gl.uniform1f(loc(gl, s.brush, "uOut"), rx);
  gl.uniform1f(loc(gl, s.brush, "uIn"), rx);
  gl.uniform1f(loc(gl, s.brush, "uAcross"), ry);
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
  const liner = layer.style === "liner";
  const built: { xy: Float32Array; side: Float32Array; along: Float32Array; alpha: number }[] = [];
  for (const ln of lines) {
    const pts = ln.points.map((p) => mapPt(map, p));
    const radius = lineRadius(layer.style, ln.widthImg, map);
    for (const p of pts) box = expand(box, p.x, p.y, radius + 3);
    const mesh = extrude(pts, radius, liner);
    if (mesh) built.push({ ...mesh, alpha: ln.alpha });
  }
  if (!box || !built.length) return true;
  const size = pixelSize(ctx, box);
  if (!size || !prepare(s, size.pw, size.ph)) return false;
  beginMask(s);
  const feather = liner ? 0.5 : 0.7;
  for (const mesh of built) {
    drawLines(
      s,
      { x: box.x, y: box.y },
      { x: box.w, y: box.h },
      mesh.xy,
      mesh.side,
      mesh.along,
      feather,
      mesh.alpha,
      liner ? 1 : 0,
    );
  }
  s.gl.disable(s.gl.BLEND);
  blurInto(s, (liner ? 0.62 : 0.35) * size.dpr);
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
      box = expand(box, p.x, p.y, 28);
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
  const blurPx = Math.max(9, Math.min(16, feat * 0.62));
  blurInto(s, blurPx * size.dpr);
  const alpha = Math.max(...mapped.map((f) => f.alpha));
  const rec = recipe(state.look);
  const rgb = deep ? rec.deep : rec.shadow;
  const cap = deep ? rec.deepOp : rec.shadowOp;
  // A wide lid wash carries a high fill alpha. The thin lesson band stays
  // near its old strength because its fill alpha is much lower.
  const gain = deep ? 0.7 : 0.55;
  present(s, ctx, box, rgb, Math.min(cap, alpha * tone * gain), 1.02, deep ? 0.12 : 0.05, "multiply", null);
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
    gl.uniform2f(loc(gl, s.brush, "uOrigin"), box.x, box.y);
    gl.uniform2f(loc(gl, s.brush, "uSize"), box.w, box.h);
    gl.uniform2f(loc(gl, s.brush, "uCenter"), center.x, center.y);
    gl.uniform2f(loc(gl, s.brush, "uAxis"), axis.x, axis.y);
    gl.uniform2f(loc(gl, s.brush, "uPerp"), perp.x, perp.y);
    gl.uniform1f(loc(gl, s.brush, "uOut"), alongOut);
    gl.uniform1f(loc(gl, s.brush, "uIn"), alongIn);
    gl.uniform1f(loc(gl, s.brush, "uAcross"), across);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disable(gl.BLEND);
    const hi = layer.style === "highlight";
    const deep = layer.style === "shadowDeep";
    const shadow = layer.style === "shadow" || deep;
    const rec = recipe(state.look);
    const rgb: Rgb = hi ? [1, 0.97, 0.94] : deep ? rec.deep : shadow ? rec.shadow : rec.blush;
    if (hi) {
      fuse(s, ctx, box, rgb, Math.min(rec.hiOp, brush.alpha * tone * 0.35), {
        mode: 3,
        power: 0.85,
        soften: 0,
        lift: 0,
        luma: true,
        blur: 1,
      });
    } else if (!shadow) {
      fuse(s, ctx, box, rgb, Math.min(rec.blushOp, brush.alpha * tone * 0.7), {
        mode: 1,
        power: 0.7,
        soften: 0,
        lift: 0,
        luma: true,
        blur: 1,
      });
    } else {
      fuse(s, ctx, box, rgb, Math.min(0.06, (deep ? rec.deepOp : rec.shadowOp) * brush.alpha * 0.12), {
        mode: 1,
        power: 1.4,
        soften: 0,
        lift: 0,
        luma: true,
        blur: 1,
      });
    }
    any = true;
  }
  if (any) remember(layer.style);
  return true;
}

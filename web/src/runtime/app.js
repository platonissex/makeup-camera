import { LandmarkStabilizer, SMOOTHING_NAME } from "../engine/stabilize";
import { renderGlPigment } from "../engine/glmakeup";
import { fixtureLandmarks, paintFixture } from "../engine/fixtureFace";
var mn = typeof self < "u" ? self : {};
function rn() {
  throw Error("Invalid UTF8");
}
function xa(t, e) {
  return ((e = String.fromCharCode.apply(null, e)), t == null ? e : t + e);
}
let Hr, Zs;
const R1 = typeof TextDecoder < "u";
let I1;
const O1 = typeof TextEncoder < "u";
function ul(t) {
  if (O1) t = (I1 || (I1 = new TextEncoder())).encode(t);
  else {
    let n = 0;
    const r = new Uint8Array(3 * t.length);
    for (let s = 0; s < t.length; s++) {
      var e = t.charCodeAt(s);
      if (e < 128) r[n++] = e;
      else {
        if (e < 2048) r[n++] = (e >> 6) | 192;
        else {
          if (e >= 55296 && e <= 57343) {
            if (e <= 56319 && s < t.length) {
              const o = t.charCodeAt(++s);
              if (o >= 56320 && o <= 57343) {
                ((e = 1024 * (e - 55296) + o - 56320 + 65536),
                  (r[n++] = (e >> 18) | 240),
                  (r[n++] = ((e >> 12) & 63) | 128),
                  (r[n++] = ((e >> 6) & 63) | 128),
                  (r[n++] = (63 & e) | 128));
                continue;
              }
              s--;
            }
            e = 65533;
          }
          ((r[n++] = (e >> 12) | 224), (r[n++] = ((e >> 6) & 63) | 128));
        }
        r[n++] = (63 & e) | 128;
      }
    }
    t = n === r.length ? r : r.subarray(0, n);
  }
  return t;
}
var ri, os;
t: {
  for (var Ma = ["CLOSURE_FLAGS"], Qs = mn, to = 0; to < Ma.length; to++)
    if ((Qs = Qs[Ma[to]]) == null) {
      os = null;
      break t;
    }
  os = Qs;
}
var xr,
  La = os && os[610401301];
ri = La != null && La;
const Sa = mn.navigator;
function xo(t) {
  return (
    !!ri && !!xr && xr.brands.some(({ brand: e }) => e && e.indexOf(t) != -1)
  );
}
function zt(t) {
  var e;
  return (
    ((e = mn.navigator) && (e = e.userAgent)) || (e = ""),
    e.indexOf(t) != -1
  );
}
function Ve() {
  return !!ri && !!xr && xr.brands.length > 0;
}
function eo() {
  return Ve()
    ? xo("Chromium")
    : ((zt("Chrome") || zt("CriOS")) && !(!Ve() && zt("Edge"))) || zt("Silk");
}
function si(t) {
  return (si[" "](t), t);
}
((xr = (Sa && Sa.userAgentData) || null), (si[" "] = function () {}));
var P1 = !Ve() && (zt("Trident") || zt("MSIE"));
(!zt("Android") || eo(),
  eo(),
  zt("Safari") &&
    (eo() ||
      (!Ve() && zt("Coast")) ||
      (!Ve() && zt("Opera")) ||
      (!Ve() && zt("Edge")) ||
      (Ve() ? xo("Microsoft Edge") : zt("Edg/")) ||
      (Ve() && xo("Opera"))));
var hl = {},
  mr = null;
function C1(t) {
  const e = t.length;
  let n = (3 * e) / 4;
  n % 3
    ? (n = Math.floor(n))
    : "=.".indexOf(t[e - 1]) != -1 &&
      (n = "=.".indexOf(t[e - 2]) != -1 ? n - 2 : n - 1);
  const r = new Uint8Array(n);
  let s = 0;
  return (
    (function (o, i) {
      function a(l) {
        for (; c < o.length; ) {
          const u = o.charAt(c++),
            h = mr[u];
          if (h != null) return h;
          if (!/^[\s\xa0]*$/.test(u))
            throw Error("Unknown base64 encoding at char: " + u);
        }
        return l;
      }
      fl();
      let c = 0;
      for (;;) {
        const l = a(-1),
          u = a(0),
          h = a(64),
          p = a(64);
        if (p === 64 && l === -1) break;
        (i((l << 2) | (u >> 4)),
          h != 64 &&
            (i(((u << 4) & 240) | (h >> 2)),
            p != 64 && i(((h << 6) & 192) | p)));
      }
    })(t, function (o) {
      r[s++] = o;
    }),
    s !== n ? r.subarray(0, s) : r
  );
}
function fl() {
  if (!mr) {
    mr = {};
    var t =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
          "",
        ),
      e = ["+/=", "+/", "-_=", "-_.", "-_"];
    for (let n = 0; n < 5; n++) {
      const r = t.concat(e[n].split(""));
      hl[n] = r;
      for (let s = 0; s < r.length; s++) {
        const o = r[s];
        mr[o] === void 0 && (mr[o] = s);
      }
    }
  }
}
var dl = typeof Uint8Array < "u",
  pl = !P1 && typeof btoa == "function";
function Ta(t) {
  if (!pl) {
    var e;
    (e === void 0 && (e = 0), fl(), (e = hl[e]));
    var n = Array(Math.floor(t.length / 3)),
      r = e[64] || "";
    let c = 0,
      l = 0;
    for (; c < t.length - 2; c += 3) {
      var s = t[c],
        o = t[c + 1],
        i = t[c + 2],
        a = e[s >> 2];
      ((s = e[((3 & s) << 4) | (o >> 4)]),
        (o = e[((15 & o) << 2) | (i >> 6)]),
        (i = e[63 & i]),
        (n[l++] = a + s + o + i));
    }
    switch (((a = 0), (i = r), t.length - c)) {
      case 2:
        i = e[(15 & (a = t[c + 1])) << 2] || r;
      case 1:
        ((t = t[c]), (n[l] = e[t >> 2] + e[((3 & t) << 4) | (a >> 4)] + i + r));
    }
    return n.join("");
  }
  for (e = "", n = 0, r = t.length - 10240; n < r; )
    e += String.fromCharCode.apply(null, t.subarray(n, (n += 10240)));
  return (
    (e += String.fromCharCode.apply(null, n ? t.subarray(n) : t)),
    btoa(e)
  );
}
const Ra = /[-_.]/g,
  F1 = { "-": "+", _: "/", ".": "=" };
function N1(t) {
  return F1[t] || "";
}
function ml(t) {
  if (!pl) return C1(t);
  (Ra.test(t) && (t = t.replace(Ra, N1)), (t = atob(t)));
  const e = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
  return e;
}
function Or(t) {
  return dl && t != null && t instanceof Uint8Array;
}
var Gn = {};
function gn() {
  return D1 || (D1 = new Ne(null, Gn));
}
function oi(t) {
  gl(Gn);
  var e = t.g;
  return (e = e == null || Or(e) ? e : typeof e == "string" ? ml(e) : null) ==
    null
    ? e
    : (t.g = e);
}
var Ne = class {
  h() {
    return new Uint8Array(oi(this) || 0);
  }
  constructor(t, e) {
    if ((gl(e), (this.g = t), t != null && t.length === 0))
      throw Error("ByteString should be constructed with non-empty values");
  }
};
let D1, U1;
function gl(t) {
  if (t !== Gn) throw Error("illegal external caller");
}
function yl(t, e) {
  (t.__closure__error__context__984382 ||
    (t.__closure__error__context__984382 = {}),
    (t.__closure__error__context__984382.severity = e));
}
function Mo(t) {
  return (yl((t = Error(t)), "warning"), t);
}
var bs = typeof Symbol == "function" && typeof Symbol() == "symbol",
  B1 = new Set();
function Pr(t, e, n = !1, r = !1) {
  return (
    (t =
      typeof Symbol == "function" && typeof Symbol() == "symbol"
        ? r && Symbol.for && t
          ? Symbol.for(t)
          : t != null
            ? Symbol(t)
            : Symbol()
        : e),
    n && B1.add(t),
    t
  );
}
var G1 = Pr("jas", void 0, !0, !0),
  Ia = Pr(void 0, "0di"),
  no = Pr(void 0, "2ex"),
  ur = Pr(void 0, "1oa", !0),
  Hn = Pr(void 0, Symbol(), !0);
const A = bs ? G1 : "Ga",
  _l = { Ga: { value: 0, configurable: !0, writable: !0, enumerable: !1 } },
  wl = Object.defineProperties;
function Es(t, e) {
  (bs || A in t || wl(t, _l), (t[A] |= e));
}
function ut(t, e) {
  (bs || A in t || wl(t, _l), (t[A] = e));
}
function Zn(t) {
  return (Es(t, 34), t);
}
function H1(t, e) {
  ut(e, -30975 & (0 | t));
}
function Lo(t, e) {
  ut(e, -30941 & (34 | t));
}
function ii() {
  return typeof BigInt == "function";
}
function It(t) {
  return Array.prototype.slice.call(t);
}
var ai,
  Cr = {},
  bl = {};
function Oa(t) {
  return !(!t || typeof t != "object" || t.Ia !== bl);
}
function ci(t) {
  return (
    t !== null &&
    typeof t == "object" &&
    !Array.isArray(t) &&
    t.constructor === Object
  );
}
function li(t, e) {
  if (t != null) {
    if (typeof t == "string") t = t ? new Ne(t, Gn) : gn();
    else if (t.constructor !== Ne)
      if (Or(t)) t = t.length ? new Ne(new Uint8Array(t), Gn) : gn();
      else {
        if (!e) throw Error();
        t = void 0;
      }
  }
  return t;
}
function is(t) {
  return !(!Array.isArray(t) || t.length) && !!(1 & (0 | t[A]));
}
const Pa = [];
function Ze(t) {
  if (2 & t) throw Error();
}
(ut(Pa, 55), (ai = Object.freeze(Pa)));
class as {
  constructor(e, n, r) {
    ((this.l = 0), (this.g = e), (this.h = n), (this.m = r));
  }
  next() {
    if (this.l < this.g.length) {
      const e = this.g[this.l++];
      return { done: !1, value: this.h ? this.h.call(this.m, e) : e };
    }
    return { done: !0, value: void 0 };
  }
  [Symbol.iterator]() {
    return new as(this.g, this.h, this.m);
  }
}
function ui(t) {
  return Hn ? t[Hn] : void 0;
}
var W1 = Object.freeze({});
function vs(t) {
  return ((t.Qa = !0), t);
}
var j1 = vs((t) => typeof t == "number"),
  Ca = vs((t) => typeof t == "string"),
  V1 = vs((t) => typeof t == "boolean"),
  ks = typeof mn.BigInt == "function" && typeof mn.BigInt(0) == "bigint",
  So = vs((t) =>
    ks ? t >= Y1 && t <= z1 : t[0] === "-" ? Fa(t, $1) : Fa(t, q1),
  );
const $1 = Number.MIN_SAFE_INTEGER.toString(),
  Y1 = ks ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
  q1 = Number.MAX_SAFE_INTEGER.toString(),
  z1 = ks ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
function Fa(t, e) {
  if (t.length > e.length) return !1;
  if (t.length < e.length || t === e) return !0;
  for (let n = 0; n < t.length; n++) {
    const r = t[n],
      s = e[n];
    if (r > s) return !1;
    if (r < s) return !0;
  }
}
const K1 = typeof Uint8Array.prototype.slice == "function";
let El,
  $ = 0,
  st = 0;
function Na(t) {
  const e = t >>> 0;
  (($ = e), (st = ((t - e) / 4294967296) >>> 0));
}
function Wn(t) {
  if (t < 0) {
    Na(-t);
    const [e, n] = pi($, st);
    (($ = e >>> 0), (st = n >>> 0));
  } else Na(t);
}
function hi(t) {
  const e = El || (El = new DataView(new ArrayBuffer(8)));
  (e.setFloat32(0, +t, !0), (st = 0), ($ = e.getUint32(0, !0)));
}
function fi(t, e) {
  const n = 4294967296 * e + (t >>> 0);
  return Number.isSafeInteger(n) ? n : Mr(t, e);
}
function di(t, e) {
  const n = 2147483648 & e;
  return (
    n && ((e = ~e >>> 0), (t = (1 + ~t) >>> 0) == 0 && (e = (e + 1) >>> 0)),
    typeof (t = fi(t, e)) == "number" ? (n ? -t : t) : n ? "-" + t : t
  );
}
function Mr(t, e) {
  if (((t >>>= 0), (e >>>= 0) <= 2097151)) var n = "" + (4294967296 * e + t);
  else
    ii()
      ? (n = "" + ((BigInt(e) << BigInt(32)) | BigInt(t)))
      : ((t =
          (16777215 & t) +
          6777216 * (n = 16777215 & ((t >>> 24) | (e << 8))) +
          6710656 * (e = (e >> 16) & 65535)),
        (n += 8147497 * e),
        (e *= 2),
        t >= 1e7 && ((n += (t / 1e7) >>> 0), (t %= 1e7)),
        n >= 1e7 && ((e += (n / 1e7) >>> 0), (n %= 1e7)),
        (n = e + Da(n) + Da(t)));
  return n;
}
function Da(t) {
  return ((t = String(t)), "0000000".slice(t.length) + t);
}
function As(t) {
  if (t.length < 16) Wn(Number(t));
  else if (ii())
    ((t = BigInt(t)),
      ($ = Number(t & BigInt(4294967295)) >>> 0),
      (st = Number((t >> BigInt(32)) & BigInt(4294967295))));
  else {
    const e = +(t[0] === "-");
    st = $ = 0;
    const n = t.length;
    for (let r = e, s = ((n - e) % 6) + e; s <= n; r = s, s += 6) {
      const o = Number(t.slice(r, s));
      ((st *= 1e6),
        ($ = 1e6 * $ + o),
        $ >= 4294967296 &&
          ((st += Math.trunc($ / 4294967296)), (st >>>= 0), ($ >>>= 0)));
    }
    if (e) {
      const [r, s] = pi($, st);
      (($ = r), (st = s));
    }
  }
}
function pi(t, e) {
  return ((e = ~e), t ? (t = 1 + ~t) : (e += 1), [t, e]);
}
const mi = typeof BigInt == "function" ? BigInt.asIntN : void 0,
  X1 = typeof BigInt == "function" ? BigInt.asUintN : void 0,
  Pn = Number.isSafeInteger,
  xs = Number.isFinite,
  cs = Math.trunc;
function Qe(t) {
  return t == null || typeof t == "number"
    ? t
    : t === "NaN" || t === "Infinity" || t === "-Infinity"
      ? Number(t)
      : void 0;
}
function vl(t) {
  return t == null || typeof t == "boolean"
    ? t
    : typeof t == "number"
      ? !!t
      : void 0;
}
const J1 = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
function Ms(t) {
  switch (typeof t) {
    case "bigint":
      return !0;
    case "number":
      return xs(t);
    case "string":
      return J1.test(t);
    default:
      return !1;
  }
}
function Qn(t) {
  if (t == null) return t;
  if (typeof t == "string" && t) t = +t;
  else if (typeof t != "number") return;
  return xs(t) ? 0 | t : void 0;
}
function kl(t) {
  if (t == null) return t;
  if (typeof t == "string" && t) t = +t;
  else if (typeof t != "number") return;
  return xs(t) ? t >>> 0 : void 0;
}
function Ua(t) {
  if (t[0] === "-") return !1;
  const e = t.length;
  return e < 20 || (e === 20 && Number(t.substring(0, 6)) < 184467);
}
function gi(t) {
  return ((t = cs(t)), Pn(t) || (Wn(t), (t = di($, st))), t);
}
function yi(t) {
  var e = cs(Number(t));
  if (Pn(e)) return String(e);
  if (
    ((e = t.indexOf(".")) !== -1 && (t = t.substring(0, e)),
    (e = t.length),
    !(t[0] === "-"
      ? e < 20 || (e === 20 && Number(t.substring(0, 7)) > -922337)
      : e < 19 || (e === 19 && Number(t.substring(0, 6)) < 922337)))
  )
    if ((As(t), (t = $), 2147483648 & (e = st)))
      if (ii()) t = "" + ((BigInt(0 | e) << BigInt(32)) | BigInt(t >>> 0));
      else {
        const [n, r] = pi(t, e);
        t = "-" + Mr(n, r);
      }
    else t = Mr(t, e);
  return t;
}
function ls(t) {
  return t == null
    ? t
    : typeof t == "bigint"
      ? (So(t)
          ? (t = Number(t))
          : ((t = mi(64, t)), (t = So(t) ? Number(t) : String(t))),
        t)
      : Ms(t)
        ? typeof t == "number"
          ? gi(t)
          : yi(t)
        : void 0;
}
function Z1(t) {
  if (t == null) return t;
  var e = typeof t;
  if (e === "bigint") return String(X1(64, t));
  if (Ms(t)) {
    if (e === "string")
      return (
        (e = cs(Number(t))),
        Pn(e) && e >= 0
          ? (t = String(e))
          : ((e = t.indexOf(".")) !== -1 && (t = t.substring(0, e)),
            Ua(t) || (As(t), (t = Mr($, st)))),
        t
      );
    if (e === "number")
      return (t = cs(t)) >= 0 && Pn(t)
        ? t
        : (function (n) {
            if (n < 0) {
              Wn(n);
              var r = Mr($, st);
              return ((n = Number(r)), Pn(n) ? n : r);
            }
            return Ua((r = String(n))) ? r : (Wn(n), fi($, st));
          })(t);
  }
}
function Al(t) {
  if (typeof t != "string") throw Error();
  return t;
}
function tr(t) {
  if (t != null && typeof t != "string") throw Error();
  return t;
}
function jn(t) {
  return t == null || typeof t == "string" ? t : void 0;
}
function _i(t, e, n, r) {
  if (t != null && typeof t == "object" && t.W === Cr) return t;
  if (!Array.isArray(t))
    return (
      n
        ? 2 & r
          ? ((t = e[Ia]) || (Zn((t = new e()).u), (t = e[Ia] = t)), (e = t))
          : (e = new e())
        : (e = void 0),
      e
    );
  let s = (n = 0 | t[A]);
  return (
    s === 0 && (s |= 32 & r),
    (s |= 2 & r),
    s !== n && ut(t, s),
    new e(t)
  );
}
function Q1(t, e, n) {
  if (e)
    t: {
      if (!Ms((e = t))) throw Mo("int64");
      switch (typeof e) {
        case "string":
          e = yi(e);
          break t;
        case "bigint":
          if (((t = e = mi(64, e)), Ca(t))) {
            if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(t)) throw Error(String(t));
          } else if (j1(t) && !Number.isSafeInteger(t)) throw Error(String(t));
          e = ks
            ? BigInt(e)
            : V1(e)
              ? e
                ? "1"
                : "0"
              : Ca(e)
                ? e.trim() || "0"
                : String(e);
          break t;
        default:
          e = gi(e);
      }
    }
  else e = ls(t);
  return typeof (n = (t = e) == null ? (n ? 0 : void 0) : t) == "string" &&
    Pn((e = +n))
    ? e
    : n;
}
const th = {};
let eh = (function () {
  try {
    return (
      si(
        new (class extends Map {
          constructor() {
            super();
          }
        })(),
      ),
      !1
    );
  } catch {
    return !0;
  }
})();
class ro {
  constructor() {
    this.g = new Map();
  }
  get(e) {
    return this.g.get(e);
  }
  set(e, n) {
    return (this.g.set(e, n), (this.size = this.g.size), this);
  }
  delete(e) {
    return ((e = this.g.delete(e)), (this.size = this.g.size), e);
  }
  clear() {
    (this.g.clear(), (this.size = this.g.size));
  }
  has(e) {
    return this.g.has(e);
  }
  entries() {
    return this.g.entries();
  }
  keys() {
    return this.g.keys();
  }
  values() {
    return this.g.values();
  }
  forEach(e, n) {
    return this.g.forEach(e, n);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}
const nh = eh
  ? (Object.setPrototypeOf(ro.prototype, Map.prototype),
    Object.defineProperties(ro.prototype, {
      size: { value: 0, configurable: !0, enumerable: !0, writable: !0 },
    }),
    ro)
  : class extends Map {
      constructor() {
        super();
      }
    };
function Ba(t) {
  return t;
}
function so(t) {
  if (2 & t.L) throw Error("Cannot mutate an immutable Map");
}
var ne = class extends nh {
  constructor(t, e, n = Ba, r = Ba) {
    super();
    let s = 0 | t[A];
    ((s |= 64),
      ut(t, s),
      (this.L = s),
      (this.S = e),
      (this.R = n),
      (this.Y = this.S ? rh : r));
    for (let o = 0; o < t.length; o++) {
      const i = t[o],
        a = n(i[0], !1, !0);
      let c = i[1];
      (e
        ? c === void 0 && (c = null)
        : (c = r(i[1], !1, !0, void 0, void 0, s)),
        super.set(a, c));
    }
  }
  na(t = Ga) {
    if (this.size !== 0) return this.X(t);
  }
  X(t = Ga) {
    const e = [],
      n = super.entries();
    for (var r; !(r = n.next()).done; )
      (((r = r.value)[0] = t(r[0])), (r[1] = t(r[1])), e.push(r));
    return e;
  }
  clear() {
    (so(this), super.clear());
  }
  delete(t) {
    return (so(this), super.delete(this.R(t, !0, !1)));
  }
  entries() {
    var t = this.ma();
    return new as(t, sh, this);
  }
  keys() {
    return this.Ha();
  }
  values() {
    var t = this.ma();
    return new as(t, ne.prototype.get, this);
  }
  forEach(t, e) {
    super.forEach((n, r) => {
      t.call(e, this.get(r), r, this);
    });
  }
  set(t, e) {
    return (
      so(this),
      (t = this.R(t, !0, !1)) == null
        ? this
        : e == null
          ? (super.delete(t), this)
          : super.set(t, this.Y(e, !0, !0, this.S, !1, this.L))
    );
  }
  Na(t) {
    const e = this.R(t[0], !1, !0);
    ((t = t[1]),
      (t = this.S
        ? t === void 0
          ? null
          : t
        : this.Y(t, !1, !0, void 0, !1, this.L)),
      super.set(e, t));
  }
  has(t) {
    return super.has(this.R(t, !1, !1));
  }
  get(t) {
    t = this.R(t, !1, !1);
    const e = super.get(t);
    if (e !== void 0) {
      var n = this.S;
      return n
        ? ((n = this.Y(e, !1, !0, n, this.ra, this.L)) !== e && super.set(t, n),
          n)
        : e;
    }
  }
  ma() {
    return Array.from(super.keys());
  }
  Ha() {
    return super.keys();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
function rh(t, e, n, r, s, o) {
  return ((t = _i(t, r, n, o)), s && (t = Ss(t)), t);
}
function Ga(t) {
  return t;
}
function sh(t) {
  return [t, this.get(t)];
}
let oh, xl, ih;
function Ha() {
  return oh || (oh = new ne(Zn([]), void 0, void 0, void 0, th));
}
function wi(t, e, n, r, s) {
  if (t != null) {
    if (Array.isArray(t))
      t = is(t)
        ? void 0
        : s && 2 & (0 | t[A])
          ? t
          : bi(t, e, n, r !== void 0, s);
    else if (ci(t)) {
      const o = {};
      for (let i in t) o[i] = wi(t[i], e, n, r, s);
      t = o;
    } else t = e(t, r);
    return t;
  }
}
function bi(t, e, n, r, s) {
  const o = r || n ? 0 | t[A] : 0,
    i = r ? !!(32 & o) : void 0;
  r = It(t);
  for (let a = 0; a < r.length; a++) r[a] = wi(r[a], e, n, i, s);
  return (n && ((t = ui(t)) && (r[Hn] = It(t)), n(o, r)), r);
}
function ah(t) {
  return wi(t, Ml, void 0, void 0, !1);
}
function Ml(t) {
  return t.W === Cr
    ? t.toJSON()
    : t instanceof ne
      ? t.na(ah)
      : (function (e) {
          switch (typeof e) {
            case "number":
              return isFinite(e) ? e : String(e);
            case "bigint":
              return So(e) ? Number(e) : String(e);
            case "boolean":
              return e ? 1 : 0;
            case "object":
              if (e)
                if (Array.isArray(e)) {
                  if (is(e)) return;
                } else {
                  if (Or(e)) return Ta(e);
                  if (e instanceof Ne) {
                    const n = e.g;
                    return n == null
                      ? ""
                      : typeof n == "string"
                        ? n
                        : (e.g = Ta(n));
                  }
                  if (e instanceof ne) return e.na();
                }
          }
          return e;
        })(t);
}
function Ll(t) {
  return bi(t, Ml, void 0, void 0, !1);
}
function Ye(t, e, n) {
  return ((t = Sl(t, e[0], e[1], n ? 1 : 2)), e !== xl && n && Es(t, 16384), t);
}
function Sl(t, e, n, r) {
  if (t == null) {
    var s = 96;
    (n ? ((t = [n]), (s |= 512)) : (t = []),
      e && (s = (-33521665 & s) | ((1023 & e) << 15)));
  } else {
    if (!Array.isArray(t)) throw Error("narr");
    if (2048 & (s = 0 | t[A])) throw Error("farr");
    if (64 & s) return t;
    if ((r === 1 || r === 2 || (s |= 64), n && ((s |= 512), n !== t[0])))
      throw Error("mid");
    t: {
      if ((r = (n = t).length)) {
        const o = r - 1;
        if (ci(n[o])) {
          if ((e = o - (512 & (s |= 256) ? 0 : -1)) >= 1024)
            throw Error("pvtlmt");
          s = (-33521665 & s) | ((1023 & e) << 15);
          break t;
        }
      }
      if (e) {
        if ((e = Math.max(e, r - (512 & s ? 0 : -1))) > 1024)
          throw Error("spvt");
        s = (-33521665 & s) | ((1023 & e) << 15);
      }
    }
  }
  return (ut(t, s), t);
}
function To(t, e, n = Lo) {
  if (t != null) {
    if (dl && t instanceof Uint8Array) return e ? t : new Uint8Array(t);
    if (Array.isArray(t)) {
      var r = 0 | t[A];
      return 2 & r
        ? t
        : (e && (e = r === 0 || (!!(32 & r) && !(64 & r || !(16 & r)))),
          e
            ? (ut(t, -12293 & (34 | r)), t)
            : bi(t, To, 4 & r ? Lo : n, !0, !0));
    }
    return (
      t.W === Cr
        ? (t = 2 & (r = 0 | (n = t.u)[A]) ? t : new t.constructor(Ls(n, r, !0)))
        : t instanceof ne &&
          !(2 & t.L) &&
          ((n = Zn(t.X(To))), (t = new ne(n, t.S, t.R, t.Y))),
      t
    );
  }
}
function Ls(t, e, n) {
  const r = n || 2 & e ? Lo : H1,
    s = !!(32 & e);
  return (
    (t = (function (o, i, a) {
      const c = It(o);
      var l = c.length;
      const u = 256 & i ? c[l - 1] : void 0;
      for (l += u ? -1 : 0, i = 512 & i ? 1 : 0; i < l; i++) c[i] = a(c[i]);
      if (u) {
        i = c[i] = {};
        for (const h in u) i[h] = a(u[h]);
      }
      return ((o = ui(o)) && (c[Hn] = It(o)), c);
    })(t, e, (o) => To(o, s, r))),
    Es(t, 32 | (n ? 2 : 0)),
    t
  );
}
function Ss(t) {
  const e = t.u,
    n = 0 | e[A];
  return 2 & n ? new t.constructor(Ls(e, n, !1)) : t;
}
function Vn(t, e) {
  return We((t = t.u), 0 | t[A], e);
}
function We(t, e, n, r) {
  if (n === -1) return null;
  var s = n + (512 & e ? 0 : -1);
  const o = t.length - 1;
  return s >= o && 256 & e
    ? t[o][n]
    : r && 256 & e && (e = t[o][n]) != null
      ? (t[s] != null &&
          no != null &&
          ((s = (t = U1 ?? (U1 = {}))[no] || 0) >= 4 ||
            ((t[no] = s + 1),
            yl((t = Error()), "incident"),
            (function (i) {
              mn.setTimeout(() => {
                throw i;
              }, 0);
            })(t))),
        e)
      : s <= o
        ? t[s]
        : void 0;
}
function Y(t, e, n) {
  const r = t.u;
  let s = 0 | r[A];
  return (Ze(s), nt(r, s, e, n), t);
}
function nt(t, e, n, r) {
  const s = 512 & e ? 0 : -1,
    o = n + s;
  var i = t.length - 1;
  return o >= i && 256 & e
    ? ((t[i][n] = r), e)
    : o <= i
      ? ((t[o] = r), 256 & e && n in (t = t[i]) && delete t[n], e)
      : (r !== void 0 &&
          (n >= (i = (e >> 15) & 1023 || 536870912)
            ? r != null && ((t[i + s] = { [n]: r }), ut(t, (e |= 256)))
            : (t[o] = r)),
        e);
}
function Kr(t, e) {
  let n = 0 | (t = t.u)[A];
  const r = We(t, n, e),
    s = Qe(r);
  return (s != null && s !== r && nt(t, n, e, s), s);
}
function Tl(t) {
  let e = 0 | (t = t.u)[A];
  const n = We(t, e, 1),
    r = li(n, !0);
  return (r != null && r !== n && nt(t, e, 1, r), r);
}
function ln() {
  return W1 === void 0 ? 2 : 4;
}
function un(t, e, n, r, s) {
  const o = t.u,
    i = 2 & (t = 0 | o[A]) ? 1 : r;
  s = !!s;
  let a = 0 | (r = Ei(o, t, e))[A];
  if (!(4 & a)) {
    4 & a && ((r = It(r)), (a = De(a, t)), (t = nt(o, t, e, r)));
    let c = 0,
      l = 0;
    for (; c < r.length; c++) {
      const u = n(r[c]);
      u != null && (r[l++] = u);
    }
    (l < c && (r.length = l),
      (a = vi(a, t)),
      (n = -4097 & (20 | a)),
      (a = n &= -8193),
      ut(r, a),
      2 & a && Object.freeze(r));
  }
  return (
    i === 1 || (i === 4 && 32 & a)
      ? Ce(a) || ((s = a), (a |= 2), a !== s && ut(r, a), Object.freeze(r))
      : (i === 2 &&
          Ce(a) &&
          ((r = It(r)),
          (a = De(a, t)),
          (a = qe(a, t, s)),
          ut(r, a),
          (t = nt(o, t, e, r))),
        Ce(a) || ((e = a), (a = qe(a, t, s)), a !== e && ut(r, a))),
    r
  );
}
function Ei(t, e, n, r) {
  return ((t = We(t, e, n, r)), Array.isArray(t) ? t : ai);
}
function vi(t, e) {
  return (t === 0 && (t = De(t, e)), 1 | t);
}
function Ce(t) {
  return (!!(2 & t) && !!(4 & t)) || !!(2048 & t);
}
function Rl(t) {
  t = It(t);
  for (let e = 0; e < t.length; e++) {
    const n = (t[e] = It(t[e]));
    Array.isArray(n[1]) && (n[1] = Zn(n[1]));
  }
  return t;
}
function Ro(t, e, n, r) {
  let s = 0 | (t = t.u)[A];
  (Ze(s), nt(t, s, e, (r === "0" ? Number(n) === 0 : n === r) ? void 0 : n));
}
function er(t, e, n, r, s) {
  Ze(e);
  var o = !(!(64 & e) && 16384 & e);
  const i = (s = Ei(t, e, n, s)) !== ai;
  if (o || !i) {
    let a = (o = i ? 0 | s[A] : 0);
    ((!i || 2 & a || Ce(a) || (4 & a && !(32 & a))) &&
      ((s = It(s)), (a = De(a, e)), (e = nt(t, e, n, s))),
      (a = -13 & vi(a, e)),
      (a = qe(r ? -17 & a : 16 | a, e, !0)),
      a !== o && ut(s, a));
  }
  return s;
}
function oo(t, e) {
  var n = wu;
  return Ai(ki((t = t.u)), t, 0 | t[A], n) === e ? e : -1;
}
function ki(t) {
  if (bs) return t[ur] ?? (t[ur] = new Map());
  if (ur in t) return t[ur];
  const e = new Map();
  return (Object.defineProperty(t, ur, { value: e }), e);
}
function Il(t, e, n, r) {
  const s = ki(t),
    o = Ai(s, t, e, n);
  return (o !== r && (o && (e = nt(t, e, o)), s.set(n, r)), e);
}
function Ai(t, e, n, r) {
  let s = t.get(r);
  if (s != null) return s;
  s = 0;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    We(e, n, i) != null && (s !== 0 && (n = nt(e, n, s)), (s = i));
  }
  return (t.set(r, s), s);
}
function xi(t, e, n, r) {
  let s,
    o = 0 | t[A];
  if ((r = We(t, o, n, r)) != null && r.W === Cr)
    return ((e = Ss(r)) !== r && nt(t, o, n, e), e.u);
  if (Array.isArray(r)) {
    const i = 0 | r[A];
    s = 2 & i ? Ye(Ls(r, i, !1), e, !0) : 64 & i ? r : Ye(s, e, !0);
  } else s = Ye(void 0, e, !0);
  return (s !== r && nt(t, o, n, s), s);
}
function Ol(t, e, n, r) {
  let s = 0 | (t = t.u)[A];
  return (
    (e = _i((r = We(t, s, n, r)), e, !1, s)) !== r &&
      e != null &&
      nt(t, s, n, e),
    e
  );
}
function F(t, e, n, r = !1) {
  if ((e = Ol(t, e, n, r)) == null) return e;
  if (!(2 & (r = 0 | (t = t.u)[A]))) {
    const s = Ss(e);
    s !== e && nt(t, r, n, (e = s));
  }
  return e;
}
function Pl(t, e, n, r, s, o, i) {
  t = t.u;
  var a = !!(2 & e);
  const c = a ? 1 : s;
  ((o = !!o), i && (i = !a));
  var l = 0 | (s = Ei(t, e, r))[A];
  if (!(a = !!(4 & l))) {
    var u = s,
      h = e;
    const p = !!(2 & (l = vi(l, e)));
    p && (h |= 2);
    let f = !p,
      d = !0,
      m = 0,
      g = 0;
    for (; m < u.length; m++) {
      const y = _i(u[m], n, !1, h);
      if (y instanceof n) {
        if (!p) {
          const _ = !!(2 & (0 | y.u[A]));
          (f && (f = !_), d && (d = _));
        }
        u[g++] = y;
      }
    }
    (g < m && (u.length = g),
      (l |= 4),
      (l = d ? 16 | l : -17 & l),
      ut(u, (l = f ? 8 | l : -9 & l)),
      p && Object.freeze(u));
  }
  if (i && !(8 & l || (!s.length && (c === 1 || (c === 4 && 32 & l))))) {
    for (
      Ce(l) && ((s = It(s)), (l = De(l, e)), (e = nt(t, e, r, s))),
        n = s,
        i = l,
        u = 0;
      u < n.length;
      u++
    )
      (l = n[u]) !== (h = Ss(l)) && (n[u] = h);
    ((i |= 8), ut(n, (i = n.length ? -17 & i : 16 | i)), (l = i));
  }
  return (
    c === 1 || (c === 4 && 32 & l)
      ? Ce(l) ||
        ((e = l),
        (l |= !s.length || (16 & l && (!a || 32 & l)) ? 2 : 2048) !== e &&
          ut(s, l),
        Object.freeze(s))
      : (c === 2 &&
          Ce(l) &&
          (ut((s = It(s)), (l = qe((l = De(l, e)), e, o))),
          (e = nt(t, e, r, s))),
        Ce(l) || ((r = l), (l = qe(l, e, o)) !== r && ut(s, l))),
    s
  );
}
function Ge(t, e, n) {
  const r = 0 | t.u[A];
  return Pl(t, r, e, n, ln(), !1, !(2 & r));
}
function x(t, e, n, r) {
  return (r == null && (r = void 0), Y(t, n, r));
}
function br(t, e, n, r) {
  r == null && (r = void 0);
  t: {
    let s = 0 | (t = t.u)[A];
    if ((Ze(s), r == null)) {
      const o = ki(t);
      if (Ai(o, t, s, n) !== e) break t;
      o.set(n, 0);
    } else s = Il(t, s, n, e);
    nt(t, s, e, r);
  }
}
function De(t, e) {
  return -2049 & (t = 32 | (2 & e ? 2 | t : -3 & t));
}
function qe(t, e, n) {
  return ((32 & e && n) || (t &= -33), t);
}
function us(t, e, n, r) {
  const s = 0 | t.u[A];
  (Ze(s),
    (t = Pl(t, s, n, e, 2, !0)),
    (r = r ?? new n()),
    t.push(r),
    (t[A] = 2 & (0 | r.u[A]) ? -9 & t[A] : -17 & t[A]));
}
function Jt(t, e) {
  return Qn(Vn(t, e));
}
function re(t, e) {
  return jn(Vn(t, e));
}
function at(t, e) {
  return Kr(t, e) ?? 0;
}
function Lr(t, e, n) {
  if (n != null && typeof n != "boolean")
    throw (
      (t = typeof n),
      Error(
        `Expected boolean but got ${t != "object" ? t : n ? (Array.isArray(n) ? "array" : t) : "null"}: ${n}`,
      )
    );
  Y(t, e, n);
}
function Se(t, e, n) {
  if (n != null) {
    if (typeof n != "number" || !xs(n)) throw Mo("int32");
    n |= 0;
  }
  Y(t, e, n);
}
function v(t, e, n) {
  if (n != null && typeof n != "number")
    throw Error(
      `Value of float/double field must be a number, found ${typeof n}: ${n}`,
    );
  Y(t, e, n);
}
function hs(t, e, n) {
  {
    const i = t.u;
    let a = 0 | i[A];
    if ((Ze(a), n == null)) nt(i, a, e);
    else {
      var r = (t = 0 | n[A]),
        s = Ce(t),
        o = s || Object.isFrozen(n);
      for (
        s || (t = 0),
          o ||
            ((n = It(n)), (r = 0), (t = qe((t = De(t, a)), a, !0)), (o = !1)),
          t |= 21,
          s = 0;
        s < n.length;
        s++
      ) {
        const c = n[s],
          l = Al(c);
        Object.is(c, l) ||
          (o &&
            ((n = It(n)), (r = 0), (t = qe((t = De(t, a)), a, !0)), (o = !1)),
          (n[s] = l));
      }
      (t !== r &&
        (o && ((n = It(n)), (t = qe((t = De(t, a)), a, !0))), ut(n, t)),
        nt(i, a, e, n));
    }
  }
}
function Ts(t, e, n) {
  (Ze(0 | t.u[A]), un(t, e, jn, 2, !0).push(Al(n)));
}
function Cl(t, e) {
  return Error(`Invalid wire type: ${t} (at position ${e})`);
}
function Mi() {
  return Error("Failed to read varint, encoding is invalid.");
}
function Fl(t, e) {
  return Error(`Tried to read past the end of the data ${e} > ${t}`);
}
function Li(t) {
  if (typeof t == "string") return { buffer: ml(t), N: !1 };
  if (Array.isArray(t)) return { buffer: new Uint8Array(t), N: !1 };
  if (t.constructor === Uint8Array) return { buffer: t, N: !1 };
  if (t.constructor === ArrayBuffer)
    return { buffer: new Uint8Array(t), N: !1 };
  if (t.constructor === Ne)
    return { buffer: oi(t) || new Uint8Array(0), N: !0 };
  if (t instanceof Uint8Array)
    return {
      buffer: new Uint8Array(t.buffer, t.byteOffset, t.byteLength),
      N: !1,
    };
  throw Error(
    "Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers",
  );
}
function Si(t, e) {
  let n,
    r = 0,
    s = 0,
    o = 0;
  const i = t.h;
  let a = t.g;
  do ((n = i[a++]), (r |= (127 & n) << o), (o += 7));
  while (o < 32 && 128 & n);
  for (o > 32 && (s |= (127 & n) >> 4), o = 3; o < 32 && 128 & n; o += 7)
    ((n = i[a++]), (s |= (127 & n) << o));
  if ((fn(t, a), n < 128)) return e(r >>> 0, s >>> 0);
  throw Mi();
}
function Ti(t) {
  let e = 0,
    n = t.g;
  const r = n + 10,
    s = t.h;
  for (; n < r; ) {
    const o = s[n++];
    if (((e |= o), (128 & o) == 0)) return (fn(t, n), !!(127 & e));
  }
  throw Mi();
}
function Ke(t) {
  const e = t.h;
  let n = t.g,
    r = e[n++],
    s = 127 & r;
  if (
    128 & r &&
    ((r = e[n++]),
    (s |= (127 & r) << 7),
    128 & r &&
      ((r = e[n++]),
      (s |= (127 & r) << 14),
      128 & r &&
        ((r = e[n++]),
        (s |= (127 & r) << 21),
        128 & r &&
          ((r = e[n++]),
          (s |= r << 28),
          128 & r &&
            128 & e[n++] &&
            128 & e[n++] &&
            128 & e[n++] &&
            128 & e[n++] &&
            128 & e[n++]))))
  )
    throw Mi();
  return (fn(t, n), s);
}
function He(t) {
  return Ke(t) >>> 0;
}
function Io(t) {
  var e = t.h;
  const n = t.g,
    r = e[n],
    s = e[n + 1],
    o = e[n + 2];
  return (
    (e = e[n + 3]),
    fn(t, t.g + 4),
    ((r << 0) | (s << 8) | (o << 16) | (e << 24)) >>> 0
  );
}
function Oo(t) {
  var e = Io(t);
  t = 2 * (e >> 31) + 1;
  const n = (e >>> 23) & 255;
  return (
    (e &= 8388607),
    n == 255
      ? e
        ? NaN
        : t * (1 / 0)
      : n == 0
        ? 1401298464324817e-60 * t * e
        : t * Math.pow(2, n - 150) * (e + 8388608)
  );
}
function ch(t) {
  return Ke(t);
}
function io(t, e, { ba: n = !1 } = {}) {
  ((t.ba = n),
    e &&
      ((e = Li(e)),
      (t.h = e.buffer),
      (t.m = e.N),
      (t.j = 0),
      (t.l = t.h.length),
      (t.g = t.j)));
}
function fn(t, e) {
  if (((t.g = e), e > t.l)) throw Fl(t.l, e);
}
function Nl(t, e) {
  if (e < 0) throw Error(`Tried to read a negative byte length: ${e}`);
  const n = t.g,
    r = n + e;
  if (r > t.l) throw Fl(e, t.l - n);
  return ((t.g = r), n);
}
function Dl(t, e) {
  if (e == 0) return gn();
  var n = Nl(t, e);
  return (
    t.ba && t.m
      ? (n = t.h.subarray(n, n + e))
      : ((t = t.h),
        (n =
          n === (e = n + e)
            ? new Uint8Array(0)
            : K1
              ? t.slice(n, e)
              : new Uint8Array(t.subarray(n, e)))),
    n.length == 0 ? gn() : new Ne(n, Gn)
  );
}
((ne.prototype.toJSON = void 0), (ne.prototype.Ia = bl));
var Wa = [];
function Ul(t) {
  var e = t.g;
  if (e.g == e.l) return !1;
  t.l = t.g.g;
  var n = He(t.g);
  if (((e = n >>> 3), !((n &= 7) >= 0 && n <= 5))) throw Cl(n, t.l);
  if (e < 1) throw Error(`Invalid field number: ${e} (at position ${t.l})`);
  return ((t.m = e), (t.h = n), !0);
}
function Xr(t) {
  switch (t.h) {
    case 0:
      t.h != 0 ? Xr(t) : Ti(t.g);
      break;
    case 1:
      fn((t = t.g), t.g + 8);
      break;
    case 2:
      if (t.h != 2) Xr(t);
      else {
        var e = He(t.g);
        fn((t = t.g), t.g + e);
      }
      break;
    case 5:
      fn((t = t.g), t.g + 4);
      break;
    case 3:
      for (e = t.m; ; ) {
        if (!Ul(t)) throw Error("Unmatched start-group tag: stream EOF");
        if (t.h == 4) {
          if (t.m != e) throw Error("Unmatched end-group tag");
          break;
        }
        Xr(t);
      }
      break;
    default:
      throw Cl(t.h, t.l);
  }
}
function Fr(t, e, n) {
  const r = t.g.l,
    s = He(t.g),
    o = t.g.g + s;
  let i = o - r;
  if (
    (i <= 0 && ((t.g.l = o), n(e, t, void 0, void 0, void 0), (i = o - t.g.g)),
    i)
  )
    throw Error(
      `Message parsing ended unexpectedly. Expected to read ${s} bytes, instead read ${s - i} bytes, either the data ended unexpectedly or the message misreported its own length`,
    );
  return ((t.g.g = o), (t.g.l = r), e);
}
function Ri(t) {
  var e = He(t.g),
    n = Nl((t = t.g), e);
  if (((t = t.h), R1)) {
    var r,
      s = t;
    ((r = Zs) || (r = Zs = new TextDecoder("utf-8", { fatal: !0 })),
      (e = n + e),
      (s = n === 0 && e === s.length ? s : s.subarray(n, e)));
    try {
      var o = r.decode(s);
    } catch (a) {
      if (Hr === void 0) {
        try {
          r.decode(new Uint8Array([128]));
        } catch {}
        try {
          (r.decode(new Uint8Array([97])), (Hr = !0));
        } catch {
          Hr = !1;
        }
      }
      throw (!Hr && (Zs = void 0), a);
    }
  } else {
    ((e = (o = n) + e), (n = []));
    let a,
      c = null;
    for (; o < e; ) {
      var i = t[o++];
      (i < 128
        ? n.push(i)
        : i < 224
          ? o >= e
            ? rn()
            : ((a = t[o++]),
              i < 194 || (192 & a) != 128
                ? (o--, rn())
                : n.push(((31 & i) << 6) | (63 & a)))
          : i < 240
            ? o >= e - 1
              ? rn()
              : ((a = t[o++]),
                (192 & a) != 128 ||
                (i === 224 && a < 160) ||
                (i === 237 && a >= 160) ||
                (192 & (r = t[o++])) != 128
                  ? (o--, rn())
                  : n.push(((15 & i) << 12) | ((63 & a) << 6) | (63 & r)))
            : i <= 244
              ? o >= e - 2
                ? rn()
                : ((a = t[o++]),
                  (192 & a) != 128 ||
                  (a - 144 + (i << 28)) >> 30 ||
                  (192 & (r = t[o++])) != 128 ||
                  (192 & (s = t[o++])) != 128
                    ? (o--, rn())
                    : ((i =
                        ((7 & i) << 18) |
                        ((63 & a) << 12) |
                        ((63 & r) << 6) |
                        (63 & s)),
                      (i -= 65536),
                      n.push(55296 + ((i >> 10) & 1023), 56320 + (1023 & i))))
              : rn(),
        n.length >= 8192 && ((c = xa(c, n)), (n.length = 0)));
    }
    o = xa(c, n);
  }
  return o;
}
function Bl(t) {
  const e = He(t.g);
  return Dl(t.g, e);
}
function Rs(t, e, n) {
  var r = He(t.g);
  for (r = t.g.g + r; t.g.g < r; ) n.push(e(t.g));
}
var Wr = [];
function lh(t) {
  return t;
}
let Cn;
function pe(t, e, n) {
  e.g ? e.m(t, e.g, e.h, n) : e.m(t, e.h, n);
}
var E = class {
  constructor(t, e) {
    this.u = Sl(t, e);
  }
  toJSON() {
    const t = !Cn;
    try {
      return (t && (Cn = Ll), Gl(this));
    } finally {
      t && (Cn = void 0);
    }
  }
  l() {
    var t = $h;
    return t.g ? t.l(this, t.g, t.h, !0) : t.l(this, t.h, t.defaultValue, !0);
  }
  clone() {
    const t = this.u;
    return new this.constructor(Ls(t, 0 | t[A], !1));
  }
  N() {
    return !!(2 & (0 | this.u[A]));
  }
};
function Gl(t) {
  var e = t.u;
  {
    e = (t = Cn(e)) !== e;
    let l = t.length;
    if (l) {
      var n = t[l - 1],
        r = ci(n);
      r ? l-- : (n = void 0);
      var s = t;
      if (r) {
        t: {
          var o,
            i = n,
            a = !1;
          if (i)
            for (let u in i)
              isNaN(+u)
                ? ((o ?? (o = {}))[u] = i[u])
                : ((r = i[u]),
                  Array.isArray(r) &&
                    (is(r) || (Oa(r) && r.size === 0)) &&
                    (r = null),
                  r == null && (a = !0),
                  r != null && ((o ?? (o = {}))[u] = r));
          if ((a || (o = i), o))
            for (let u in o) {
              a = o;
              break t;
            }
          a = null;
        }
        i = a == null ? n != null : a !== n;
      }
      for (
        ;
        l > 0 && ((o = s[l - 1]) == null || is(o) || (Oa(o) && o.size === 0));
        l--
      )
        var c = !0;
      ((s !== t || i || c) &&
        (e
          ? (c || i || a) && (s.length = l)
          : (s = Array.prototype.slice.call(s, 0, l)),
        a && s.push(a)),
        (c = s));
    } else c = t;
  }
  return c;
}
function ja(t) {
  return t
    ? /^\d+$/.test(t)
      ? (As(t), new Po($, st))
      : null
    : uh || (uh = new Po(0, 0));
}
((E.prototype.W = Cr),
  (E.prototype.toString = function () {
    try {
      return ((Cn = lh), Gl(this).toString());
    } finally {
      Cn = void 0;
    }
  }));
var Po = class {
  constructor(t, e) {
    ((this.h = t >>> 0), (this.g = e >>> 0));
  }
};
let uh;
function Va(t) {
  return t
    ? /^-?\d+$/.test(t)
      ? (As(t), new Co($, st))
      : null
    : hh || (hh = new Co(0, 0));
}
var Co = class {
  constructor(t, e) {
    ((this.h = t >>> 0), (this.g = e >>> 0));
  }
};
let hh;
function Fn(t, e, n) {
  for (; n > 0 || e > 127; )
    (t.g.push((127 & e) | 128),
      (e = ((e >>> 7) | (n << 25)) >>> 0),
      (n >>>= 7));
  t.g.push(e);
}
function nr(t, e) {
  for (; e > 127; ) (t.g.push((127 & e) | 128), (e >>>= 7));
  t.g.push(e);
}
function Is(t, e) {
  if (e >= 0) nr(t, e);
  else {
    for (let n = 0; n < 9; n++) (t.g.push((127 & e) | 128), (e >>= 7));
    t.g.push(1);
  }
}
function Sr(t, e) {
  (t.g.push((e >>> 0) & 255),
    t.g.push((e >>> 8) & 255),
    t.g.push((e >>> 16) & 255),
    t.g.push((e >>> 24) & 255));
}
function $n(t, e) {
  e.length !== 0 && (t.l.push(e), (t.h += e.length));
}
function Wt(t, e, n) {
  nr(t.g, 8 * e + n);
}
function Ii(t, e) {
  return (Wt(t, e, 2), (e = t.g.end()), $n(t, e), e.push(t.h), e);
}
function Oi(t, e) {
  var n = e.pop();
  for (n = t.h + t.g.length() - n; n > 127; )
    (e.push((127 & n) | 128), (n >>>= 7), t.h++);
  (e.push(n), t.h++);
}
function Os(t, e, n) {
  (Wt(t, e, 2), nr(t.g, n.length), $n(t, t.g.end()), $n(t, n));
}
function fs(t, e, n, r) {
  n != null && ((e = Ii(t, e)), r(n, t), Oi(t, e));
}
function me() {
  const t = class {
    constructor() {
      throw Error();
    }
  };
  return (Object.setPrototypeOf(t, t.prototype), t);
}
var Pi = me(),
  Hl = me(),
  Ci = me(),
  Fi = me(),
  Wl = me(),
  jl = me(),
  Ni = me(),
  Vl = me(),
  $l = me(),
  rr = class {
    constructor(t, e, n) {
      ((this.g = t), (this.h = e), (t = Pi), (this.l = (!!t && n === t) || !1));
    }
  };
function Ps(t, e) {
  return new rr(t, e, Pi);
}
function Yl(t, e, n, r, s) {
  fs(t, n, Xl(e, r), s);
}
const fh = Ps(function (t, e, n, r, s) {
    return t.h === 2 && (Fr(t, xi(e, r, n), s), !0);
  }, Yl),
  dh = Ps(function (t, e, n, r, s) {
    return t.h === 2 && (Fr(t, xi(e, r, n, !0), s), !0);
  }, Yl);
var Cs = Symbol(),
  Di = Symbol(),
  $a = Symbol(),
  Ya = Symbol();
let ql, zl;
function An(t, e, n, r) {
  var s = r[t];
  if (s) return s;
  (((s = {}).Pa = r),
    (s.V = (function (h) {
      switch (typeof h) {
        case "boolean":
          return xl || (xl = [0, void 0, !0]);
        case "number":
          return h > 0
            ? void 0
            : h === 0
              ? ih || (ih = [0, void 0])
              : [-h, void 0];
        case "string":
          return [0, h];
        case "object":
          return h;
      }
    })(r[0])));
  var o = r[1];
  let i = 1;
  o &&
    o.constructor === Object &&
    ((s.ga = o),
    typeof (o = r[++i]) == "function" &&
      ((s.la = !0), ql ?? (ql = o), zl ?? (zl = r[i + 1]), (o = r[(i += 2)])));
  const a = {};
  for (
    ;
    o && Array.isArray(o) && o.length && typeof o[0] == "number" && o[0] > 0;

  ) {
    for (var c = 0; c < o.length; c++) a[o[c]] = o;
    o = r[++i];
  }
  for (c = 1; o !== void 0; ) {
    let h;
    typeof o == "number" && ((c += o), (o = r[++i]));
    var l = void 0;
    if (
      (o instanceof rr ? (h = o) : ((h = fh), i--), h == null ? void 0 : h.l)
    ) {
      ((o = r[++i]), (l = r));
      var u = i;
      (typeof o == "function" && ((o = o()), (l[u] = o)), (l = o));
    }
    for (
      u = c + 1,
        typeof (o = r[++i]) == "number" && o < 0 && ((u -= o), (o = r[++i]));
      c < u;
      c++
    ) {
      const p = a[c];
      l ? n(s, c, h, l, p) : e(s, c, h, p);
    }
  }
  return (r[t] = s);
}
function Kl(t) {
  return Array.isArray(t) ? (t[0] instanceof rr ? t : [dh, t]) : [t, void 0];
}
function Xl(t, e) {
  return t instanceof E ? t.u : Array.isArray(t) ? Ye(t, e, !1) : void 0;
}
function Ui(t, e, n, r) {
  const s = n.g;
  t[e] = r ? (o, i, a) => s(o, i, a, r) : s;
}
function Bi(t, e, n, r, s) {
  const o = n.g;
  let i, a;
  t[e] = (c, l, u) =>
    o(c, l, u, a || (a = An(Di, Ui, Bi, r).V), i || (i = Gi(r)), s);
}
function Gi(t) {
  let e = t[$a];
  if (e != null) return e;
  const n = An(Di, Ui, Bi, t);
  return (
    (e = n.la
      ? (r, s) => ql(r, s, n)
      : (r, s) => {
          const o = 0 | r[A];
          for (; Ul(s) && s.h != 4; ) {
            var i = s.m,
              a = n[i];
            if (a == null) {
              var c = n.ga;
              c && (c = c[i]) && (c = ph(c)) != null && (a = n[i] = c);
            }
            (a != null && a(s, r, i)) ||
              ((i = (a = s).l),
              Xr(a),
              a.fa
                ? (a = void 0)
                : ((c = a.g.g - i), (a.g.g = i), (a = Dl(a.g, c))),
              (i = r),
              a && ((c = i[Hn]) ? c.push(a) : (i[Hn] = [a])));
          }
          return (16384 & o && Zn(r), !0);
        }),
    (t[$a] = e)
  );
}
function ph(t) {
  const e = (t = Kl(t))[0].g;
  if ((t = t[1])) {
    const n = Gi(t),
      r = An(Di, Ui, Bi, t).V;
    return (s, o, i) => e(s, o, i, r, n);
  }
  return e;
}
function Fs(t, e, n) {
  t[e] = n.h;
}
function Ns(t, e, n, r) {
  let s, o;
  const i = n.h;
  t[e] = (a, c, l) =>
    i(a, c, l, o || (o = An(Cs, Fs, Ns, r).V), s || (s = Jl(r)));
}
function Jl(t) {
  let e = t[Ya];
  if (!e) {
    const n = An(Cs, Fs, Ns, t);
    ((e = (r, s) => Zl(r, s, n)), (t[Ya] = e));
  }
  return e;
}
function Zl(t, e, n) {
  for (
    var r = 0 | t[A],
      s = 512 & r ? 0 : -1,
      o = t.length,
      i = 512 & r ? 1 : 0,
      a = o + (256 & r ? -1 : 0);
    i < a;
    i++
  ) {
    const c = t[i];
    if (c == null) continue;
    const l = i - s,
      u = qa(n, l);
    u && u(e, c, l);
  }
  if (256 & r) {
    r = t[o - 1];
    for (const c in r)
      ((s = +c),
        Number.isNaN(s) ||
          ((o = r[s]) != null && (a = qa(n, s)) && a(e, o, s)));
  }
  if ((t = ui(t)))
    for ($n(e, e.g.end()), n = 0; n < t.length; n++)
      $n(e, oi(t[n]) || new Uint8Array(0));
}
function qa(t, e) {
  var n = t[e];
  if (n) return n;
  if ((n = t.ga) && (n = n[e])) {
    var r = (n = Kl(n))[0].h;
    if ((n = n[1])) {
      const s = Jl(n),
        o = An(Cs, Fs, Ns, n).V;
      n = t.la ? zl(o, s) : (i, a, c) => r(i, a, c, o, s);
    } else n = r;
    return (t[e] = n);
  }
}
function sr(t, e) {
  if (Array.isArray(e)) {
    var n = 0 | e[A];
    if (4 & n) return e;
    for (var r = 0, s = 0; r < e.length; r++) {
      const o = t(e[r]);
      o != null && (e[s++] = o);
    }
    return (
      s < r && (e.length = s),
      ut(e, -12289 & (5 | n)),
      2 & n && Object.freeze(e),
      e
    );
  }
}
function At(t, e, n) {
  return new rr(t, e, n);
}
function or(t, e, n) {
  return new rr(t, e, n);
}
function xt(t, e, n) {
  nt(t, 0 | t[A], e, n);
}
var mh = Ps(
  function (t, e, n, r, s) {
    return (
      t.h === 2 &&
      ((t = Fr(t, Ye([void 0, void 0], r, !0), s)),
      Ze((r = 0 | e[A])),
      (s = We(e, r, n)) instanceof ne
        ? 2 & s.L
          ? ((s = s.X()).push(t), nt(e, r, n, s))
          : s.Na(t)
        : Array.isArray(s)
          ? (2 & (0 | s[A]) && nt(e, r, n, (s = Rl(s))), s.push(t))
          : nt(e, r, n, [t]),
      !0)
    );
  },
  function (t, e, n, r, s) {
    if (e instanceof ne)
      e.forEach((o, i) => {
        fs(t, n, Ye([i, o], r, !1), s);
      });
    else if (Array.isArray(e))
      for (let o = 0; o < e.length; o++) {
        const i = e[o];
        Array.isArray(i) && fs(t, n, Ye(i, r, !1), s);
      }
  },
);
function Ql(t, e, n) {
  if (
    ((e = (function (r) {
      if (r == null) return r;
      const s = typeof r;
      if (s === "bigint") return String(mi(64, r));
      if (Ms(r)) {
        if (s === "string") return yi(r);
        if (s === "number") return gi(r);
      }
    })(e)),
    e != null && (typeof e == "string" && Va(e), e != null))
  )
    switch ((Wt(t, n, 0), typeof e)) {
      case "number":
        ((t = t.g), Wn(e), Fn(t, $, st));
        break;
      case "bigint":
        ((n = BigInt.asUintN(64, e)),
          (n = new Co(Number(n & BigInt(4294967295)), Number(n >> BigInt(32)))),
          Fn(t.g, n.h, n.g));
        break;
      default:
        ((n = Va(e)), Fn(t.g, n.h, n.g));
    }
}
function tu(t, e, n) {
  (e = Qn(e)) != null && e != null && (Wt(t, n, 0), Is(t.g, e));
}
function eu(t, e, n) {
  (e = vl(e)) != null && (Wt(t, n, 0), t.g.g.push(e ? 1 : 0));
}
function nu(t, e, n) {
  (e = jn(e)) != null && Os(t, n, ul(e));
}
function ru(t, e, n, r, s) {
  fs(t, n, Xl(e, r), s);
}
function su(t, e, n) {
  (e =
    e == null || typeof e == "string" || Or(e) || e instanceof Ne
      ? e
      : void 0) != null && Os(t, n, Li(e).buffer);
}
function ou(t, e, n) {
  return (
    (t.h === 5 || t.h === 2) &&
    ((e = er(e, 0 | e[A], n, !1, !1)),
    t.h == 2 ? Rs(t, Oo, e) : e.push(Oo(t.g)),
    !0)
  );
}
var Oe = At(
    function (t, e, n) {
      if (t.h !== 1) return !1;
      var r = t.g;
      t = Io(r);
      const s = Io(r);
      r = 2 * (s >> 31) + 1;
      const o = (s >>> 20) & 2047;
      return (
        (t = 4294967296 * (1048575 & s) + t),
        xt(
          e,
          n,
          o == 2047
            ? t
              ? NaN
              : r * (1 / 0)
            : o == 0
              ? 5e-324 * r * t
              : r * Math.pow(2, o - 1075) * (t + 4503599627370496),
        ),
        !0
      );
    },
    function (t, e, n) {
      (e = Qe(e)) != null &&
        (Wt(t, n, 1),
        (t = t.g),
        (n = El || (El = new DataView(new ArrayBuffer(8)))).setFloat64(
          0,
          +e,
          !0,
        ),
        ($ = n.getUint32(0, !0)),
        (st = n.getUint32(4, !0)),
        Sr(t, $),
        Sr(t, st));
    },
    me(),
  ),
  ft = At(
    function (t, e, n) {
      return t.h === 5 && (xt(e, n, Oo(t.g)), !0);
    },
    function (t, e, n) {
      (e = Qe(e)) != null && (Wt(t, n, 5), (t = t.g), hi(e), Sr(t, $));
    },
    Ni,
  ),
  gh = or(
    ou,
    function (t, e, n) {
      if ((e = sr(Qe, e)) != null)
        for (let i = 0; i < e.length; i++) {
          var r = t,
            s = n,
            o = e[i];
          o != null && (Wt(r, s, 5), (r = r.g), hi(o), Sr(r, $));
        }
    },
    Ni,
  ),
  Hi = or(
    ou,
    function (t, e, n) {
      if ((e = sr(Qe, e)) != null && e.length) {
        (Wt(t, n, 2), nr(t.g, 4 * e.length));
        for (let r = 0; r < e.length; r++) ((n = t.g), hi(e[r]), Sr(n, $));
      }
    },
    Ni,
  ),
  Xe = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, Si(t.g, di)), !0);
    },
    Ql,
    jl,
  ),
  ao = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, (t = Si(t.g, di)) === 0 ? void 0 : t), !0);
    },
    Ql,
    jl,
  ),
  yh = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, Si(t.g, fi)), !0);
    },
    function (t, e, n) {
      if ((e = Z1(e)) != null && (typeof e == "string" && ja(e), e != null))
        switch ((Wt(t, n, 0), typeof e)) {
          case "number":
            ((t = t.g), Wn(e), Fn(t, $, st));
            break;
          case "bigint":
            ((n = BigInt.asUintN(64, e)),
              (n = new Po(
                Number(n & BigInt(4294967295)),
                Number(n >> BigInt(32)),
              )),
              Fn(t.g, n.h, n.g));
            break;
          default:
            ((n = ja(e)), Fn(t.g, n.h, n.g));
        }
    },
    me(),
  ),
  ot = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, Ke(t.g)), !0);
    },
    tu,
    Fi,
  ),
  Ds = or(
    function (t, e, n) {
      return (
        (t.h === 0 || t.h === 2) &&
        ((e = er(e, 0 | e[A], n, !1, !1)),
        t.h == 2 ? Rs(t, Ke, e) : e.push(Ke(t.g)),
        !0)
      );
    },
    function (t, e, n) {
      if ((e = sr(Qn, e)) != null && e.length) {
        n = Ii(t, n);
        for (let r = 0; r < e.length; r++) Is(t.g, e[r]);
        Oi(t, n);
      }
    },
    Fi,
  ),
  In = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, (t = Ke(t.g)) === 0 ? void 0 : t), !0);
    },
    tu,
    Fi,
  ),
  Q = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, Ti(t.g)), !0);
    },
    eu,
    Hl,
  ),
  Nn = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, (t = Ti(t.g)) === !1 ? void 0 : t), !0);
    },
    eu,
    Hl,
  ),
  vt = or(
    function (t, e, n) {
      return t.h === 2 && ((t = Ri(t)), er(e, 0 | e[A], n, !1).push(t), !0);
    },
    function (t, e, n) {
      if ((e = sr(jn, e)) != null)
        for (let i = 0; i < e.length; i++) {
          var r = t,
            s = n,
            o = e[i];
          o != null && Os(r, s, ul(o));
        }
    },
    Ci,
  ),
  $e = At(
    function (t, e, n) {
      return t.h === 2 && (xt(e, n, (t = Ri(t)) === "" ? void 0 : t), !0);
    },
    nu,
    Ci,
  ),
  H = At(
    function (t, e, n) {
      return t.h === 2 && (xt(e, n, Ri(t)), !0);
    },
    nu,
    Ci,
  ),
  pt = (function (t, e, n = Pi) {
    return new rr(t, e, n);
  })(
    function (t, e, n, r, s) {
      return (
        t.h === 2 &&
        ((r = Ye(void 0, r, !0)),
        er(e, 0 | e[A], n, !0).push(r),
        Fr(t, r, s),
        !0)
      );
    },
    function (t, e, n, r, s) {
      if (Array.isArray(e))
        for (let o = 0; o < e.length; o++) ru(t, e[o], n, r, s);
    },
  ),
  W = Ps(function (t, e, n, r, s, o) {
    return (
      t.h === 2 && (Il(e, 0 | e[A], o, n), Fr(t, (e = xi(e, r, n)), s), !0)
    );
  }, ru),
  iu = At(
    function (t, e, n) {
      return t.h === 2 && (xt(e, n, Bl(t)), !0);
    },
    su,
    Vl,
  ),
  _h = or(
    function (t, e, n) {
      return (
        (t.h === 0 || t.h === 2) &&
        ((e = er(e, 0 | e[A], n, !1, !1)),
        t.h == 2 ? Rs(t, He, e) : e.push(He(t.g)),
        !0)
      );
    },
    function (t, e, n) {
      if ((e = sr(kl, e)) != null)
        for (let i = 0; i < e.length; i++) {
          var r = t,
            s = n,
            o = e[i];
          o != null && (Wt(r, s, 0), nr(r.g, o));
        }
    },
    Wl,
  ),
  wh = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, (t = He(t.g)) === 0 ? void 0 : t), !0);
    },
    function (t, e, n) {
      (e = kl(e)) != null && e != null && (Wt(t, n, 0), nr(t.g, e));
    },
    Wl,
  ),
  se = At(
    function (t, e, n) {
      return t.h === 0 && (xt(e, n, Ke(t.g)), !0);
    },
    function (t, e, n) {
      (e = Qn(e)) != null && ((e = parseInt(e, 10)), Wt(t, n, 0), Is(t.g, e));
    },
    $l,
  );
class bh {
  constructor(e, n) {
    ((this.h = e),
      (this.g = n),
      (this.l = F),
      (this.m = x),
      (this.defaultValue = void 0));
  }
}
function ge(t, e) {
  return new bh(t, e);
}
function tn(t, e) {
  return (n, r) => {
    if (Wr.length) {
      const o = Wr.pop();
      (o.o(r), io(o.g, n, r), (n = o));
    } else
      n = new (class {
        constructor(o, i) {
          if (Wa.length) {
            const a = Wa.pop();
            (io(a, o, i), (o = a));
          } else
            o = new (class {
              constructor(a, c) {
                ((this.h = null),
                  (this.m = !1),
                  (this.g = this.l = this.j = 0),
                  io(this, a, c));
              }
              clear() {
                ((this.h = null),
                  (this.m = !1),
                  (this.g = this.l = this.j = 0),
                  (this.ba = !1));
              }
            })(o, i);
          ((this.g = o),
            (this.l = this.g.g),
            (this.h = this.m = -1),
            this.o(i));
        }
        o({ fa: o = !1 } = {}) {
          this.fa = o;
        }
      })(n, r);
    try {
      const o = new t(),
        i = o.u;
      Gi(e)(i, n);
      var s = o;
    } finally {
      (n.g.clear(), (n.m = -1), (n.h = -1), Wr.length < 100 && Wr.push(n));
    }
    return s;
  };
}
function Us(t) {
  return function () {
    const e = new (class {
      constructor() {
        ((this.l = []),
          (this.h = 0),
          (this.g = new (class {
            constructor() {
              this.g = [];
            }
            length() {
              return this.g.length;
            }
            end() {
              const i = this.g;
              return ((this.g = []), i);
            }
          })()));
      }
    })();
    (Zl(this.u, e, An(Cs, Fs, Ns, t)), $n(e, e.g.end()));
    const n = new Uint8Array(e.h),
      r = e.l,
      s = r.length;
    let o = 0;
    for (let i = 0; i < s; i++) {
      const a = r[i];
      (n.set(a, o), (o += a.length));
    }
    return ((e.l = [n]), n);
  };
}
var za = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ka = [
    0,
    $e,
    At(
      function (t, e, n) {
        return t.h === 2 && (xt(e, n, (t = Bl(t)) === gn() ? void 0 : t), !0);
      },
      function (t, e, n) {
        if (e != null) {
          if (e instanceof E) {
            const r = e.Ra;
            return void (
              r && ((e = r(e)), e != null && Os(t, n, Li(e).buffer))
            );
          }
          if (Array.isArray(e)) return;
        }
        su(t, e, n);
      },
      Vl,
    ),
  ];
let co,
  Xa = globalThis.trustedTypes;
function Ja(t) {
  co === void 0 &&
    (co = (function () {
      let n = null;
      if (!Xa) return n;
      try {
        const r = (s) => s;
        n = Xa.createPolicy("goog#html", {
          createHTML: r,
          createScript: r,
          createScriptURL: r,
        });
      } catch {}
      return n;
    })());
  var e = co;
  return new (class {
    constructor(n) {
      this.g = n;
    }
    toString() {
      return this.g + "";
    }
  })(e ? e.createScriptURL(t) : t);
}
function Eh(t, ...e) {
  if (e.length === 0) return Ja(t[0]);
  let n = t[0];
  for (let r = 0; r < e.length; r++) n += encodeURIComponent(e[r]) + t[r + 1];
  return Ja(n);
}
var au = [0, ot, se, Q, -1, Ds, se, -1],
  vh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  cu = [
    0,
    Q,
    H,
    Q,
    se,
    -1,
    or(
      function (t, e, n) {
        return (
          (t.h === 0 || t.h === 2) &&
          ((e = er(e, 0 | e[A], n, !1, !1)),
          t.h == 2 ? Rs(t, ch, e) : e.push(Ke(t.g)),
          !0)
        );
      },
      function (t, e, n) {
        if ((e = sr(Qn, e)) != null && e.length) {
          n = Ii(t, n);
          for (let r = 0; r < e.length; r++) Is(t.g, e[r]);
          Oi(t, n);
        }
      },
      $l,
    ),
    H,
    -1,
    [0, Q, -1],
    se,
    Q,
    -1,
  ],
  lu = [0, H, -2],
  Za = class extends E {
    constructor(t) {
      super(t);
    }
  },
  uu = [0],
  hu = [0, ot, Q, 1, Q, -3],
  Ht = class extends E {
    constructor(t) {
      super(t, 2);
    }
  },
  dt = {};
dt[336783863] = [
  0,
  H,
  Q,
  -1,
  ot,
  [
    0,
    [1, 2, 3, 4, 5, 6, 7, 8],
    W,
    uu,
    W,
    cu,
    W,
    lu,
    W,
    hu,
    W,
    au,
    W,
    [0, H, -2],
    W,
    [0, H, se],
    W,
    [0, se, H],
  ],
  [0, H],
  Q,
  [0, [1, 3], [2, 4], W, [0, Ds], -1, W, [0, vt], -1, pt, [0, H, -1]],
  H,
];
var Qa = [0, ao, -1, Nn, -3, ao, Ds, $e, In, ao, -1, Nn, In, Nn, -2, $e];
function jt(t, e) {
  Ro(t, 2, tr(e), "");
}
function z(t, e) {
  Ts(t, 3, e);
}
function O(t, e) {
  Ts(t, 4, e);
}
var kt = class extends E {
    constructor(t) {
      super(t, 500);
    }
    o(t) {
      return x(this, 0, 7, t);
    }
  },
  Er = [-1, {}],
  tc = [0, H, 1, Er],
  ec = [0, H, vt, Er];
function Vt(t, e) {
  us(t, 1, kt, e);
}
function J(t, e) {
  Ts(t, 10, e);
}
function U(t, e) {
  Ts(t, 15, e);
}
var Ct = class extends E {
    constructor(t) {
      super(t, 500);
    }
    o(t) {
      return x(this, 0, 1001, t);
    }
  },
  fu = [
    -500,
    pt,
    [
      -500,
      $e,
      -1,
      vt,
      -3,
      [-2, dt, Q],
      pt,
      Ka,
      In,
      -1,
      tc,
      ec,
      pt,
      [0, $e, Nn],
      $e,
      Qa,
      In,
      vt,
      987,
      vt,
    ],
    4,
    pt,
    [-500, H, -1, [-1, {}], 998, H],
    pt,
    [-500, H, vt, -1, [-2, {}, Q], 997, vt, -1],
    In,
    pt,
    [-500, H, vt, Er, 998, vt],
    vt,
    In,
    tc,
    ec,
    pt,
    [0, $e, -1, Er],
    vt,
    -2,
    Qa,
    $e,
    -1,
    Nn,
    [0, Nn, wh],
    978,
    Er,
    pt,
    Ka,
  ];
Ct.prototype.g = Us(fu);
var kh = tn(Ct, fu),
  Ah = class extends E {
    constructor(t) {
      super(t);
    }
  },
  du = class extends E {
    constructor(t) {
      super(t);
    }
    g() {
      return Ge(this, Ah, 1);
    }
  },
  pu = [0, pt, [0, ot, ft, H, -1]],
  Bs = tn(du, pu),
  xh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Mh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  lo = class extends E {
    constructor(t) {
      super(t);
    }
    h() {
      return F(this, xh, 2);
    }
    g() {
      return Ge(this, Mh, 5);
    }
  },
  mu = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [
      0,
      vt,
      Ds,
      Hi,
      [
        0,
        se,
        [0, ot, -3],
        [0, ft, -3],
        [0, ot, -1, [0, pt, [0, ot, -2]]],
        pt,
        [0, ft, -1, H, ft],
      ],
      H,
      -1,
      Xe,
      pt,
      [0, ot, ft],
      vt,
      Xe,
    ],
  ),
  gu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Dn = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [0, pt, [0, ft, -4]],
  ),
  yu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Nr = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [0, pt, [0, ft, -4]],
  ),
  Lh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Sh = [0, ot, -1, Hi, se],
  _u = class extends E {
    constructor(t) {
      super(t);
    }
  };
_u.prototype.g = Us([0, ft, -4, Xe]);
var Th = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Rh = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [0, pt, [0, 1, ot, H, pu], Xe],
  ),
  nc = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ih = class extends E {
    constructor(t) {
      super(t);
    }
    oa() {
      const t = Tl(this);
      return t ?? gn();
    }
  },
  Oh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  wu = [1, 2],
  Ph = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [0, pt, [0, wu, W, [0, Hi], W, [0, iu], ot, H], Xe],
  ),
  Wi = class extends E {
    constructor(t) {
      super(t);
    }
  },
  bu = [0, H, ot, ft, vt, -1],
  rc = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ch = [0, Q, -1],
  sc = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Jr = [1, 2, 3, 4, 5],
  ds = class extends E {
    constructor(t) {
      super(t);
    }
    g() {
      return Tl(this) != null;
    }
    h() {
      return re(this, 2) != null;
    }
  },
  tt = class extends E {
    constructor(t) {
      super(t);
    }
    g() {
      return vl(Vn(this, 2)) ?? !1;
    }
  },
  Eu = [0, iu, H, [0, ot, Xe, -1], [0, yh, Xe]],
  ct = [0, Eu, Q, [0, Jr, W, hu, W, cu, W, au, W, uu, W, lu], se],
  Gs = class extends E {
    constructor(t) {
      super(t);
    }
  },
  ji = [0, ct, ft, -1, ot],
  Fh = ge(502141897, Gs);
dt[502141897] = ji;
var Nh = tn(
    class extends E {
      constructor(t) {
        super(t);
      }
    },
    [0, [0, se, -1, gh, _h], Sh],
  ),
  vu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  ku = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Vi = [0, ct, ft, [0, ct], Q],
  Au = [0, ct, ji, Vi, ft, [0, [0, Eu]]],
  Dh = ge(508968150, ku);
((dt[508968150] = Au), (dt[508968149] = Vi));
var xu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Uh = ge(513916220, xu);
dt[513916220] = [0, ct, Au, ot];
var Mn = class extends E {
    constructor(t) {
      super(t);
    }
    h() {
      return F(this, Wi, 2);
    }
    g() {
      Y(this, 2);
    }
  },
  Mu = [0, ct, bu];
dt[478825465] = Mu;
var Bh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Lu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  $i = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Yi = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Su = class extends E {
    constructor(t) {
      super(t);
    }
  },
  oc = [0, ct, [0, ct], Mu, -1],
  Tu = [0, ct, ft, ot],
  qi = [0, ct, ft],
  Ru = [0, ct, Tu, qi, ft],
  Gh = ge(479097054, Su);
((dt[479097054] = [0, ct, Ru, oc]), (dt[463370452] = oc), (dt[464864288] = Tu));
var Hh = ge(462713202, Yi);
((dt[462713202] = Ru), (dt[474472470] = qi));
var Wh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Iu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ou = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Pu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  zi = [0, ct, ft, -1, ot],
  Fo = [0, ct, ft, Q];
Pu.prototype.g = Us([0, ct, qi, [0, ct], ji, Vi, zi, Fo]);
var Cu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  jh = ge(456383383, Cu);
dt[456383383] = [0, ct, bu];
var Fu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Vh = ge(476348187, Fu);
dt[476348187] = [0, ct, Ch];
var Nu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  ic = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Du = [0, se, -1],
  $h = ge(
    458105876,
    class extends E {
      constructor(t) {
        super(t);
      }
      g() {
        var t = this.u;
        const e = 0 | t[A],
          n = 2 & e;
        return (
          (t = (function (r, s, o) {
            var i = ic;
            const a = 2 & s;
            let c = !1;
            if (o == null) {
              if (a) return Ha();
              o = [];
            } else if (o.constructor === ne) {
              if (!(2 & o.L) || a) return o;
              o = o.X();
            } else Array.isArray(o) ? (c = !!(2 & (0 | o[A]))) : (o = []);
            if (a) {
              if (!o.length) return Ha();
              c || ((c = !0), Zn(o));
            } else c && ((c = !1), (o = Rl(o)));
            return (
              c || (64 & (0 | o[A]) ? (o[A] &= -33) : 32 & s && Es(o, 32)),
              nt(r, s, 2, (i = new ne(o, i, Q1, void 0))),
              i
            );
          })(t, e, We(t, e, 2))),
          !n && ic && (t.ra = !0),
          t
        );
      }
    },
  );
dt[458105876] = [0, Du, mh, [!0, Xe, [0, H, -1, vt]]];
var Ki = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Uu = ge(458105758, Ki);
dt[458105758] = [0, ct, H, Du];
var Bu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Yh = ge(443442058, Bu);
((dt[443442058] = [0, ct, H, ot, ft, vt, -1, Q, ft]), (dt[514774813] = zi));
var Gu = class extends E {
    constructor(t) {
      super(t);
    }
  },
  qh = ge(516587230, Gu);
function No(t, e) {
  return (
    (e = e ? e.clone() : new Wi()),
    t.displayNamesLocale !== void 0
      ? Y(e, 1, tr(t.displayNamesLocale))
      : t.displayNamesLocale === void 0 && Y(e, 1),
    t.maxResults !== void 0
      ? Se(e, 2, t.maxResults)
      : "maxResults" in t && Y(e, 2),
    t.scoreThreshold !== void 0
      ? v(e, 3, t.scoreThreshold)
      : "scoreThreshold" in t && Y(e, 3),
    t.categoryAllowlist !== void 0
      ? hs(e, 4, t.categoryAllowlist)
      : "categoryAllowlist" in t && Y(e, 4),
    t.categoryDenylist !== void 0
      ? hs(e, 5, t.categoryDenylist)
      : "categoryDenylist" in t && Y(e, 5),
    e
  );
}
function Xi(t, e = -1, n = "") {
  return {
    categories: t.map((r) => ({
      index: Jt(r, 1) ?? 0 ?? -1,
      score: at(r, 2) ?? 0,
      categoryName: re(r, 3) ?? "" ?? "",
      displayName: re(r, 4) ?? "" ?? "",
    })),
    headIndex: e,
    headName: n,
  };
}
function Hu(t) {
  var i, a;
  var e = un(t, 3, Qe, ln()),
    n = un(t, 2, Qn, ln()),
    r = un(t, 1, jn, ln()),
    s = un(t, 9, jn, ln());
  const o = { categories: [], keypoints: [] };
  for (let c = 0; c < e.length; c++)
    o.categories.push({
      score: e[c],
      index: n[c] ?? -1,
      categoryName: r[c] ?? "",
      displayName: s[c] ?? "",
    });
  if (
    ((e = (i = F(t, lo, 4)) == null ? void 0 : i.h()) &&
      (o.boundingBox = {
        originX: Jt(e, 1) ?? 0,
        originY: Jt(e, 2) ?? 0,
        width: Jt(e, 3) ?? 0,
        height: Jt(e, 4) ?? 0,
        angle: 0,
      }),
    (a = F(t, lo, 4)) == null ? void 0 : a.g().length)
  )
    for (const c of F(t, lo, 4).g())
      o.keypoints.push({
        x: Kr(c, 1) ?? 0,
        y: Kr(c, 2) ?? 0,
        score: Kr(c, 4) ?? 0,
        label: re(c, 3) ?? "",
      });
  return o;
}
function Hs(t) {
  const e = [];
  for (const n of Ge(t, yu, 1))
    e.push({
      x: at(n, 1) ?? 0,
      y: at(n, 2) ?? 0,
      z: at(n, 3) ?? 0,
      visibility: at(n, 4) ?? 0,
    });
  return e;
}
function vr(t) {
  const e = [];
  for (const n of Ge(t, gu, 1))
    e.push({
      x: at(n, 1) ?? 0,
      y: at(n, 2) ?? 0,
      z: at(n, 3) ?? 0,
      visibility: at(n, 4) ?? 0,
    });
  return e;
}
function ac(t) {
  return Array.from(t, (e) => (e > 127 ? e - 256 : e));
}
function cc(t, e) {
  if (t.length !== e.length)
    throw Error(
      `Cannot compute cosine similarity between embeddings of different sizes (${t.length} vs. ${e.length}).`,
    );
  let n = 0,
    r = 0,
    s = 0;
  for (let o = 0; o < t.length; o++)
    ((n += t[o] * e[o]), (r += t[o] * t[o]), (s += e[o] * e[o]));
  if (r <= 0 || s <= 0)
    throw Error("Cannot compute cosine similarity on embedding with 0 norm.");
  return n / Math.sqrt(r * s);
}
let jr;
((dt[516587230] = [0, ct, zi, Fo, ft]), (dt[518928384] = Fo));
const zh = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8,
  0, 65, 0, 253, 15, 253, 98, 11,
]);
async function Wu() {
  if (jr === void 0)
    try {
      (await WebAssembly.instantiate(zh), (jr = !0));
    } catch {
      jr = !1;
    }
  return jr;
}
async function hr(t, e = Eh``) {
  const n = (await Wu()) ? "wasm_internal" : "wasm_nosimd_internal";
  return {
    wasmLoaderPath: `${e}/${t}_${n}.js`,
    wasmBinaryPath: `${e}/${t}_${n}.wasm`,
  };
}
var on = class {};
function ju() {
  var t = navigator;
  return (
    typeof OffscreenCanvas < "u" &&
    (!(function (e = navigator) {
      return (e = e.userAgent).includes("Safari") && !e.includes("Chrome");
    })(t) ||
      !!(
        (t = t.userAgent.match(/Version\/([\d]+).*Safari/)) &&
        t.length >= 1 &&
        Number(t[1]) >= 17
      ))
  );
}
async function lc(t) {
  if (typeof importScripts != "function") {
    const e = document.createElement("script");
    return (
      (e.src = t.toString()),
      (e.crossOrigin = "anonymous"),
      new Promise((n, r) => {
        (e.addEventListener(
          "load",
          () => {
            n();
          },
          !1,
        ),
          e.addEventListener(
            "error",
            (s) => {
              r(s);
            },
            !1,
          ),
          document.body.appendChild(e));
      })
    );
  }
  importScripts(t.toString());
}
function Vu(t) {
  return t.videoWidth !== void 0
    ? [t.videoWidth, t.videoHeight]
    : t.naturalWidth !== void 0
      ? [t.naturalWidth, t.naturalHeight]
      : t.displayWidth !== void 0
        ? [t.displayWidth, t.displayHeight]
        : [t.width, t.height];
}
function k(t, e, n) {
  (t.m ||
    console.error(
      "No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target",
    ),
    n((e = t.i.stringToNewUTF8(e))),
    t.i._free(e));
}
function uc(t, e, n) {
  if (!t.i.canvas) throw Error("No OpenGL canvas configured.");
  if (
    (n ? t.i._bindTextureToStream(n) : t.i._bindTextureToCanvas(),
    !(n = t.i.canvas.getContext("webgl2") || t.i.canvas.getContext("webgl")))
  )
    throw Error(
      "Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.",
    );
  (t.i.gpuOriginForWebTexturesIsBottomLeft &&
    n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !0),
    n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, e),
    t.i.gpuOriginForWebTexturesIsBottomLeft &&
      n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1));
  const [r, s] = Vu(e);
  return (
    !t.l ||
      (r === t.i.canvas.width && s === t.i.canvas.height) ||
      ((t.i.canvas.width = r), (t.i.canvas.height = s)),
    [r, s]
  );
}
function hc(t, e, n) {
  t.m ||
    console.error(
      "No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target",
    );
  const r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) r[s] = t.i.stringToNewUTF8(e[s]);
  ((e = t.i._malloc(4 * r.length)), t.i.HEAPU32.set(r, e >> 2), n(e));
  for (const s of r) t.i._free(s);
  t.i._free(e);
}
function be(t, e, n) {
  ((t.i.simpleListeners = t.i.simpleListeners || {}),
    (t.i.simpleListeners[e] = n));
}
function je(t, e, n) {
  let r = [];
  ((t.i.simpleListeners = t.i.simpleListeners || {}),
    (t.i.simpleListeners[e] = (s, o, i) => {
      o ? (n(r, i), (r = [])) : r.push(s);
    }));
}
((on.forVisionTasks = function (t) {
  return hr("vision", t);
}),
  (on.forTextTasks = function (t) {
    return hr("text", t);
  }),
  (on.forGenAiExperimentalTasks = function (t) {
    return hr("genai_experimental", t);
  }),
  (on.forGenAiTasks = function (t) {
    return hr("genai", t);
  }),
  (on.forAudioTasks = function (t) {
    return hr("audio", t);
  }),
  (on.isSimdSupported = function () {
    return Wu();
  }));
async function Kh(t, e, n, r) {
  return (
    (t = await (async (s, o, i, a, c) => {
      if (
        (o && (await lc(o)),
        !self.ModuleFactory || (i && (await lc(i), !self.ModuleFactory)))
      )
        throw Error("ModuleFactory not set.");
      return (
        self.Module &&
          c &&
          (((o = self.Module).locateFile = c.locateFile),
          c.mainScriptUrlOrBlob &&
            (o.mainScriptUrlOrBlob = c.mainScriptUrlOrBlob)),
        (c = await self.ModuleFactory(self.Module || c)),
        (self.ModuleFactory = self.Module = void 0),
        new s(c, a)
      );
    })(t, n.wasmLoaderPath, n.assetLoaderPath, e, {
      locateFile: (s) =>
        s.endsWith(".wasm")
          ? n.wasmBinaryPath.toString()
          : n.assetBinaryPath && s.endsWith(".data")
            ? n.assetBinaryPath.toString()
            : s,
    })),
    await t.o(r),
    t
  );
}
function uo(t, e) {
  const n = F(t.baseOptions, ds, 1) || new ds();
  (typeof e == "string"
    ? (Y(n, 2, tr(e)), Y(n, 1))
    : e instanceof Uint8Array && (Y(n, 1, li(e, !1)), Y(n, 2)),
    x(t.baseOptions, 0, 1, n));
}
function fc(t) {
  try {
    const e = t.G.length;
    if (e === 1) throw Error(t.G[0].message);
    if (e > 1)
      throw Error(
        "Encountered multiple errors: " + t.G.map((n) => n.message).join(", "),
      );
  } finally {
    t.G = [];
  }
}
function w(t, e) {
  t.B = Math.max(t.B, e);
}
function Ws(t, e) {
  ((t.A = new kt()),
    jt(t.A, "PassThroughCalculator"),
    z(t.A, "free_memory"),
    O(t.A, "free_memory_unused_out"),
    J(e, "free_memory"),
    Vt(e, t.A));
}
function Yn(t, e) {
  (z(t.A, e), O(t.A, e + "_unused_out"));
}
function js(t) {
  t.g.addBoolToStream(!0, "free_memory", t.B);
}
var Zr = class {
  constructor(t) {
    ((this.g = t),
      (this.G = []),
      (this.B = 0),
      this.g.setAutoRenderToScreen(!1));
  }
  l(t, e = !0) {
    var n, r, s, o, i, a;
    if (e) {
      const c = t.baseOptions || {};
      if (
        (n = t.baseOptions) != null &&
        n.modelAssetBuffer &&
        (r = t.baseOptions) != null &&
        r.modelAssetPath
      )
        throw Error(
          "Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer",
        );
      if (
        !(
          ((s = F(this.baseOptions, ds, 1)) != null && s.g()) ||
          ((o = F(this.baseOptions, ds, 1)) != null && o.h()) ||
          ((i = t.baseOptions) != null && i.modelAssetBuffer) ||
          ((a = t.baseOptions) != null && a.modelAssetPath)
        )
      )
        throw Error(
          "Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set",
        );
      if (
        ((function (l, u) {
          let h = F(l.baseOptions, sc, 3);
          if (!h) {
            var p = (h = new sc()),
              f = new Za();
            br(p, 4, Jr, f);
          }
          ("delegate" in u &&
            (u.delegate === "GPU"
              ? ((u = h), (p = new vh()), br(u, 2, Jr, p))
              : ((u = h), (p = new Za()), br(u, 4, Jr, p))),
            x(l.baseOptions, 0, 3, h));
        })(this, c),
        c.modelAssetPath)
      )
        return fetch(c.modelAssetPath.toString())
          .then((l) => {
            if (l.ok) return l.arrayBuffer();
            throw Error(
              `Failed to fetch model: ${c.modelAssetPath} (${l.status})`,
            );
          })
          .then((l) => {
            try {
              this.g.i.FS_unlink("/model.dat");
            } catch {}
            (this.g.i.FS_createDataFile(
              "/",
              "model.dat",
              new Uint8Array(l),
              !0,
              !1,
              !1,
            ),
              uo(this, "/model.dat"),
              this.m(),
              this.I());
          });
      if (c.modelAssetBuffer instanceof Uint8Array)
        uo(this, c.modelAssetBuffer);
      else if (c.modelAssetBuffer)
        return (async function (l) {
          const u = [];
          for (var h = 0; ; ) {
            const { done: p, value: f } = await l.read();
            if (p) break;
            (u.push(f), (h += f.length));
          }
          if (u.length === 0) return new Uint8Array(0);
          if (u.length === 1) return u[0];
          ((l = new Uint8Array(h)), (h = 0));
          for (const p of u) (l.set(p, h), (h += p.length));
          return l;
        })(c.modelAssetBuffer).then((l) => {
          (uo(this, l), this.m(), this.I());
        });
    }
    return (this.m(), this.I(), Promise.resolve());
  }
  I() {}
  da() {
    let t;
    if (
      (this.g.da((e) => {
        t = kh(e);
      }),
      !t)
    )
      throw Error("Failed to retrieve CalculatorGraphConfig");
    return t;
  }
  setGraph(t, e) {
    (this.g.attachErrorListener((n, r) => {
      this.G.push(Error(r));
    }),
      this.g.La(),
      this.g.setGraph(t, e),
      (this.A = void 0),
      fc(this));
  }
  finishProcessing() {
    (this.g.finishProcessing(), fc(this));
  }
  close() {
    ((this.A = void 0), this.g.closeGraph());
  }
};
function Ue(t, e) {
  if (!t) throw Error(`Unable to obtain required WebGL resource: ${e}`);
  return t;
}
((Zr.prototype.close = Zr.prototype.close),
  (function (t, e) {
    t = t.split(".");
    var n,
      r = mn;
    for (
      (t[0] in r) || r.execScript === void 0 || r.execScript("var " + t[0]);
      t.length && (n = t.shift());

    )
      t.length || e === void 0
        ? (r = r[n] && r[n] !== Object.prototype[n] ? r[n] : (r[n] = {}))
        : (r[n] = e);
  })("TaskRunner", Zr));
class Xh {
  constructor(e, n, r, s) {
    ((this.g = e), (this.h = n), (this.m = r), (this.l = s));
  }
  bind() {
    this.g.bindVertexArray(this.h);
  }
  close() {
    (this.g.deleteVertexArray(this.h),
      this.g.deleteBuffer(this.m),
      this.g.deleteBuffer(this.l));
  }
}
function dc(t, e, n) {
  const r = t.g;
  if (
    ((n = Ue(r.createShader(n), "Failed to create WebGL shader")),
    r.shaderSource(n, e),
    r.compileShader(n),
    !r.getShaderParameter(n, r.COMPILE_STATUS))
  )
    throw Error(`Could not compile WebGL shader: ${r.getShaderInfoLog(n)}`);
  return (r.attachShader(t.h, n), n);
}
function pc(t, e) {
  const n = t.g,
    r = Ue(n.createVertexArray(), "Failed to create vertex array");
  n.bindVertexArray(r);
  const s = Ue(n.createBuffer(), "Failed to create buffer");
  (n.bindBuffer(n.ARRAY_BUFFER, s),
    n.enableVertexAttribArray(t.O),
    n.vertexAttribPointer(t.O, 2, n.FLOAT, !1, 0, 0),
    n.bufferData(
      n.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      n.STATIC_DRAW,
    ));
  const o = Ue(n.createBuffer(), "Failed to create buffer");
  return (
    n.bindBuffer(n.ARRAY_BUFFER, o),
    n.enableVertexAttribArray(t.I),
    n.vertexAttribPointer(t.I, 2, n.FLOAT, !1, 0, 0),
    n.bufferData(
      n.ARRAY_BUFFER,
      new Float32Array(e ? [0, 1, 0, 0, 1, 0, 1, 1] : [0, 0, 0, 1, 1, 1, 1, 0]),
      n.STATIC_DRAW,
    ),
    n.bindBuffer(n.ARRAY_BUFFER, null),
    n.bindVertexArray(null),
    new Xh(n, r, s, o)
  );
}
function Ji(t, e) {
  if (t.g) {
    if (e !== t.g) throw Error("Cannot change GL context once initialized");
  } else t.g = e;
}
function Zi(t, e, n, r) {
  return (
    Ji(t, e),
    t.h || (t.m(), t.C()),
    n
      ? (t.s || (t.s = pc(t, !0)), (n = t.s))
      : (t.v || (t.v = pc(t, !1)), (n = t.v)),
    e.useProgram(t.h),
    n.bind(),
    t.l(),
    (t = r()),
    n.g.bindVertexArray(null),
    t
  );
}
function Vs(t, e, n) {
  return (
    Ji(t, e),
    (t = Ue(e.createTexture(), "Failed to create texture")),
    e.bindTexture(e.TEXTURE_2D, t),
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, n ?? e.LINEAR),
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, n ?? e.LINEAR),
    e.bindTexture(e.TEXTURE_2D, null),
    t
  );
}
function $s(t, e, n) {
  (Ji(t, e),
    t.A || (t.A = Ue(e.createFramebuffer(), "Failed to create framebuffe.")),
    e.bindFramebuffer(e.FRAMEBUFFER, t.A),
    e.framebufferTexture2D(
      e.FRAMEBUFFER,
      e.COLOR_ATTACHMENT0,
      e.TEXTURE_2D,
      n,
      0,
    ));
}
function Qi(t) {
  var e;
  (e = t.g) == null || e.bindFramebuffer(t.g.FRAMEBUFFER, null);
}
var ta = class {
  G() {
    return `
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `;
  }
  m() {
    const t = this.g;
    if (
      ((this.h = Ue(t.createProgram(), "Failed to create WebGL program")),
      (this.aa = dc(
        this,
        `
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,
        t.VERTEX_SHADER,
      )),
      (this.Z = dc(this, this.G(), t.FRAGMENT_SHADER)),
      t.linkProgram(this.h),
      !t.getProgramParameter(this.h, t.LINK_STATUS))
    )
      throw Error(
        `Error during program linking: ${t.getProgramInfoLog(this.h)}`,
      );
    ((this.O = t.getAttribLocation(this.h, "aVertex")),
      (this.I = t.getAttribLocation(this.h, "aTex")));
  }
  C() {}
  l() {}
  close() {
    if (this.h) {
      const t = this.g;
      (t.deleteProgram(this.h),
        t.deleteShader(this.aa),
        t.deleteShader(this.Z));
    }
    (this.A && this.g.deleteFramebuffer(this.A),
      this.v && this.v.close(),
      this.s && this.s.close());
  }
};
function Pe(t, e) {
  switch (e) {
    case 0:
      return t.g.find((n) => n instanceof Uint8Array);
    case 1:
      return t.g.find((n) => n instanceof Float32Array);
    case 2:
      return t.g.find(
        (n) => typeof WebGLTexture < "u" && n instanceof WebGLTexture,
      );
    default:
      throw Error(`Type is not supported: ${e}`);
  }
}
function Do(t) {
  var e = Pe(t, 1);
  if (!e) {
    if ((e = Pe(t, 0))) e = new Float32Array(e).map((r) => r / 255);
    else {
      e = new Float32Array(t.width * t.height);
      const r = qn(t);
      var n = ea(t);
      if (
        ($s(n, r, $u(t)),
        "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod"
          .split(";")
          .includes(navigator.platform) ||
          (navigator.userAgent.includes("Mac") &&
            "document" in self &&
            "ontouchend" in self.document))
      ) {
        ((n = new Float32Array(t.width * t.height * 4)),
          r.readPixels(0, 0, t.width, t.height, r.RGBA, r.FLOAT, n));
        for (let s = 0, o = 0; s < e.length; ++s, o += 4) e[s] = n[o];
      } else r.readPixels(0, 0, t.width, t.height, r.RED, r.FLOAT, e);
    }
    t.g.push(e);
  }
  return e;
}
function $u(t) {
  let e = Pe(t, 2);
  if (!e) {
    const n = qn(t);
    e = qu(t);
    const r = Do(t),
      s = Yu(t);
    (n.texImage2D(n.TEXTURE_2D, 0, s, t.width, t.height, 0, n.RED, n.FLOAT, r),
      Uo(t));
  }
  return e;
}
function qn(t) {
  if (!t.canvas)
    throw Error(
      "Conversion to different image formats require that a canvas is passed when initializing the image.",
    );
  return (
    t.h ||
      (t.h = Ue(
        t.canvas.getContext("webgl2"),
        "You cannot use a canvas that is already bound to a different type of rendering context.",
      )),
    t.h
  );
}
function Yu(t) {
  if (((t = qn(t)), !Vr))
    if (
      t.getExtension("EXT_color_buffer_float") &&
      t.getExtension("OES_texture_float_linear") &&
      t.getExtension("EXT_float_blend")
    )
      Vr = t.R32F;
    else {
      if (!t.getExtension("EXT_color_buffer_half_float"))
        throw Error(
          "GPU does not fully support 4-channel float32 or float16 formats",
        );
      Vr = t.R16F;
    }
  return Vr;
}
function ea(t) {
  return (t.l || (t.l = new ta()), t.l);
}
function qu(t) {
  const e = qn(t);
  (e.viewport(0, 0, t.width, t.height), e.activeTexture(e.TEXTURE0));
  let n = Pe(t, 2);
  return (
    n ||
      ((n = Vs(ea(t), e, t.m ? e.LINEAR : e.NEAREST)), t.g.push(n), (t.j = !0)),
    e.bindTexture(e.TEXTURE_2D, n),
    n
  );
}
function Uo(t) {
  t.h.bindTexture(t.h.TEXTURE_2D, null);
}
var Vr,
  gt = class {
    constructor(t, e, n, r, s, o, i) {
      ((this.g = t),
        (this.m = e),
        (this.j = n),
        (this.canvas = r),
        (this.l = s),
        (this.width = o),
        (this.height = i),
        this.j &&
          --mc === 0 &&
          console.error(
            "You seem to be creating MPMask instances without invoking .close(). This leaks resources.",
          ));
    }
    Fa() {
      return !!Pe(this, 0);
    }
    ja() {
      return !!Pe(this, 1);
    }
    P() {
      return !!Pe(this, 2);
    }
    ia() {
      return (
        (e = Pe((t = this), 0)) ||
          ((e = Do(t)),
          (e = new Uint8Array(e.map((n) => 255 * n))),
          t.g.push(e)),
        e
      );
      var t, e;
    }
    ha() {
      return Do(this);
    }
    M() {
      return $u(this);
    }
    clone() {
      const t = [];
      for (const e of this.g) {
        let n;
        if (e instanceof Uint8Array) n = new Uint8Array(e);
        else if (e instanceof Float32Array) n = new Float32Array(e);
        else {
          if (!(e instanceof WebGLTexture))
            throw Error(`Type is not supported: ${e}`);
          {
            const r = qn(this),
              s = ea(this);
            (r.activeTexture(r.TEXTURE1),
              (n = Vs(s, r, this.m ? r.LINEAR : r.NEAREST)),
              r.bindTexture(r.TEXTURE_2D, n));
            const o = Yu(this);
            (r.texImage2D(
              r.TEXTURE_2D,
              0,
              o,
              this.width,
              this.height,
              0,
              r.RED,
              r.FLOAT,
              null,
            ),
              r.bindTexture(r.TEXTURE_2D, null),
              $s(s, r, n),
              Zi(s, r, !1, () => {
                (qu(this),
                  r.clearColor(0, 0, 0, 0),
                  r.clear(r.COLOR_BUFFER_BIT),
                  r.drawArrays(r.TRIANGLE_FAN, 0, 4),
                  Uo(this));
              }),
              Qi(s),
              Uo(this));
          }
        }
        t.push(n);
      }
      return new gt(
        t,
        this.m,
        this.P(),
        this.canvas,
        this.l,
        this.width,
        this.height,
      );
    }
    close() {
      (this.j && qn(this).deleteTexture(Pe(this, 2)), (mc = -1));
    }
  };
((gt.prototype.close = gt.prototype.close),
  (gt.prototype.clone = gt.prototype.clone),
  (gt.prototype.getAsWebGLTexture = gt.prototype.M),
  (gt.prototype.getAsFloat32Array = gt.prototype.ha),
  (gt.prototype.getAsUint8Array = gt.prototype.ia),
  (gt.prototype.hasWebGLTexture = gt.prototype.P),
  (gt.prototype.hasFloat32Array = gt.prototype.ja),
  (gt.prototype.hasUint8Array = gt.prototype.Fa));
var mc = 250;
function ke(t, e) {
  switch (e) {
    case 0:
      return t.g.find((n) => n instanceof ImageData);
    case 1:
      return t.g.find(
        (n) => typeof ImageBitmap < "u" && n instanceof ImageBitmap,
      );
    case 2:
      return t.g.find(
        (n) => typeof WebGLTexture < "u" && n instanceof WebGLTexture,
      );
    default:
      throw Error(`Type is not supported: ${e}`);
  }
}
function zu(t) {
  var e = ke(t, 0);
  if (!e) {
    e = zn(t);
    const n = Ys(t),
      r = new Uint8Array(t.width * t.height * 4);
    ($s(n, e, Qr(t)),
      e.readPixels(0, 0, t.width, t.height, e.RGBA, e.UNSIGNED_BYTE, r),
      Qi(n),
      (e = new ImageData(new Uint8ClampedArray(r.buffer), t.width, t.height)),
      t.g.push(e));
  }
  return e;
}
function Qr(t) {
  let e = ke(t, 2);
  if (!e) {
    const n = zn(t);
    e = ts(t);
    const r = ke(t, 1) || zu(t);
    (n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, r), gr(t));
  }
  return e;
}
function zn(t) {
  if (!t.canvas)
    throw Error(
      "Conversion to different image formats require that a canvas is passed when initializing the image.",
    );
  return (
    t.h ||
      (t.h = Ue(
        t.canvas.getContext("webgl2"),
        "You cannot use a canvas that is already bound to a different type of rendering context.",
      )),
    t.h
  );
}
function Ys(t) {
  return (t.l || (t.l = new ta()), t.l);
}
function ts(t) {
  const e = zn(t);
  (e.viewport(0, 0, t.width, t.height), e.activeTexture(e.TEXTURE0));
  let n = ke(t, 2);
  return (
    n || ((n = Vs(Ys(t), e)), t.g.push(n), (t.m = !0)),
    e.bindTexture(e.TEXTURE_2D, n),
    n
  );
}
function gr(t) {
  t.h.bindTexture(t.h.TEXTURE_2D, null);
}
function gc(t) {
  const e = zn(t);
  return Zi(Ys(t), e, !0, () =>
    (function (n, r) {
      const s = n.canvas;
      if (s.width === n.width && s.height === n.height) return r();
      const o = s.width,
        i = s.height;
      return (
        (s.width = n.width),
        (s.height = n.height),
        (n = r()),
        (s.width = o),
        (s.height = i),
        n
      );
    })(t, () => {
      if (
        (e.bindFramebuffer(e.FRAMEBUFFER, null),
        e.clearColor(0, 0, 0, 0),
        e.clear(e.COLOR_BUFFER_BIT),
        e.drawArrays(e.TRIANGLE_FAN, 0, 4),
        !(t.canvas instanceof OffscreenCanvas))
      )
        throw Error(
          "Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas",
        );
      return t.canvas.transferToImageBitmap();
    }),
  );
}
var yt = class {
  constructor(t, e, n, r, s, o, i) {
    ((this.g = t),
      (this.j = e),
      (this.m = n),
      (this.canvas = r),
      (this.l = s),
      (this.width = o),
      (this.height = i),
      (this.j || this.m) &&
        --yc === 0 &&
        console.error(
          "You seem to be creating MPImage instances without invoking .close(). This leaks resources.",
        ));
  }
  Ea() {
    return !!ke(this, 0);
  }
  ka() {
    return !!ke(this, 1);
  }
  P() {
    return !!ke(this, 2);
  }
  Ca() {
    return zu(this);
  }
  Ba() {
    var t = ke(this, 1);
    return (
      t ||
        (Qr(this),
        ts(this),
        (t = gc(this)),
        gr(this),
        this.g.push(t),
        (this.j = !0)),
      t
    );
  }
  M() {
    return Qr(this);
  }
  clone() {
    const t = [];
    for (const e of this.g) {
      let n;
      if (e instanceof ImageData)
        n = new ImageData(e.data, this.width, this.height);
      else if (e instanceof WebGLTexture) {
        const r = zn(this),
          s = Ys(this);
        (r.activeTexture(r.TEXTURE1),
          (n = Vs(s, r)),
          r.bindTexture(r.TEXTURE_2D, n),
          r.texImage2D(
            r.TEXTURE_2D,
            0,
            r.RGBA,
            this.width,
            this.height,
            0,
            r.RGBA,
            r.UNSIGNED_BYTE,
            null,
          ),
          r.bindTexture(r.TEXTURE_2D, null),
          $s(s, r, n),
          Zi(s, r, !1, () => {
            (ts(this),
              r.clearColor(0, 0, 0, 0),
              r.clear(r.COLOR_BUFFER_BIT),
              r.drawArrays(r.TRIANGLE_FAN, 0, 4),
              gr(this));
          }),
          Qi(s),
          gr(this));
      } else {
        if (!(e instanceof ImageBitmap))
          throw Error(`Type is not supported: ${e}`);
        (Qr(this), ts(this), (n = gc(this)), gr(this));
      }
      t.push(n);
    }
    return new yt(
      t,
      this.ka(),
      this.P(),
      this.canvas,
      this.l,
      this.width,
      this.height,
    );
  }
  close() {
    (this.j && ke(this, 1).close(),
      this.m && zn(this).deleteTexture(ke(this, 2)),
      (yc = -1));
  }
};
((yt.prototype.close = yt.prototype.close),
  (yt.prototype.clone = yt.prototype.clone),
  (yt.prototype.getAsWebGLTexture = yt.prototype.M),
  (yt.prototype.getAsImageBitmap = yt.prototype.Ba),
  (yt.prototype.getAsImageData = yt.prototype.Ca),
  (yt.prototype.hasWebGLTexture = yt.prototype.P),
  (yt.prototype.hasImageBitmap = yt.prototype.ka),
  (yt.prototype.hasImageData = yt.prototype.Ea));
var yc = 250;
function ye(...t) {
  return t.map(([e, n]) => ({ start: e, end: n }));
}
const Jh = (function (t) {
  return class extends t {
    La() {
      this.i._registerModelResourcesGraphService();
    }
  };
})(
  ((_c = class {
    constructor(t, e) {
      ((this.l = !0),
        (this.i = t),
        (this.g = null),
        (this.h = 0),
        (this.m = typeof this.i._addIntToInputStream == "function"),
        e !== void 0
          ? (this.i.canvas = e)
          : ju()
            ? (this.i.canvas = new OffscreenCanvas(1, 1))
            : (console.warn(
                "OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas.",
              ),
              (this.i.canvas = document.createElement("canvas"))));
    }
    async initializeGraph(t) {
      const e = await (await fetch(t)).arrayBuffer();
      ((t = !(t.endsWith(".pbtxt") || t.endsWith(".textproto"))),
        this.setGraph(new Uint8Array(e), t));
    }
    setGraphFromString(t) {
      this.setGraph(new TextEncoder().encode(t), !1);
    }
    setGraph(t, e) {
      const n = t.length,
        r = this.i._malloc(n);
      (this.i.HEAPU8.set(t, r),
        e ? this.i._changeBinaryGraph(n, r) : this.i._changeTextGraph(n, r),
        this.i._free(r));
    }
    configureAudio(t, e, n, r, s) {
      (this.i._configureAudio ||
        console.warn(
          'Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?',
        ),
        k(this, r || "input_audio", (o) => {
          k(this, (s = s || "audio_header"), (i) => {
            this.i._configureAudio(o, i, t, e ?? 0, n);
          });
        }));
    }
    setAutoResizeCanvas(t) {
      this.l = t;
    }
    setAutoRenderToScreen(t) {
      this.i._setAutoRenderToScreen(t);
    }
    setGpuBufferVerticalFlip(t) {
      this.i.gpuOriginForWebTexturesIsBottomLeft = t;
    }
    da(t) {
      (be(this, "__graph_config__", (e) => {
        t(e);
      }),
        k(this, "__graph_config__", (e) => {
          this.i._getGraphConfig(e, void 0);
        }),
        delete this.i.simpleListeners.__graph_config__);
    }
    attachErrorListener(t) {
      this.i.errorListener = t;
    }
    attachEmptyPacketListener(t, e) {
      ((this.i.emptyPacketListeners = this.i.emptyPacketListeners || {}),
        (this.i.emptyPacketListeners[t] = e));
    }
    addAudioToStream(t, e, n) {
      this.addAudioToStreamWithShape(t, 0, 0, e, n);
    }
    addAudioToStreamWithShape(t, e, n, r, s) {
      const o = 4 * t.length;
      (this.h !== o &&
        (this.g && this.i._free(this.g),
        (this.g = this.i._malloc(o)),
        (this.h = o)),
        this.i.HEAPF32.set(t, this.g / 4),
        k(this, r, (i) => {
          this.i._addAudioToInputStream(this.g, e, n, i, s);
        }));
    }
    addGpuBufferToStream(t, e, n) {
      k(this, e, (r) => {
        const [s, o] = uc(this, t, r);
        this.i._addBoundTextureToStream(r, s, o, n);
      });
    }
    addBoolToStream(t, e, n) {
      k(this, e, (r) => {
        this.i._addBoolToInputStream(t, r, n);
      });
    }
    addDoubleToStream(t, e, n) {
      k(this, e, (r) => {
        this.i._addDoubleToInputStream(t, r, n);
      });
    }
    addFloatToStream(t, e, n) {
      k(this, e, (r) => {
        this.i._addFloatToInputStream(t, r, n);
      });
    }
    addIntToStream(t, e, n) {
      k(this, e, (r) => {
        this.i._addIntToInputStream(t, r, n);
      });
    }
    addUintToStream(t, e, n) {
      k(this, e, (r) => {
        this.i._addUintToInputStream(t, r, n);
      });
    }
    addStringToStream(t, e, n) {
      k(this, e, (r) => {
        k(this, t, (s) => {
          this.i._addStringToInputStream(s, r, n);
        });
      });
    }
    addStringRecordToStream(t, e, n) {
      k(this, e, (r) => {
        hc(this, Object.keys(t), (s) => {
          hc(this, Object.values(t), (o) => {
            this.i._addFlatHashMapToInputStream(
              s,
              o,
              Object.keys(t).length,
              r,
              n,
            );
          });
        });
      });
    }
    addProtoToStream(t, e, n, r) {
      k(this, n, (s) => {
        k(this, e, (o) => {
          const i = this.i._malloc(t.length);
          (this.i.HEAPU8.set(t, i),
            this.i._addProtoToInputStream(i, t.length, o, s, r),
            this.i._free(i));
        });
      });
    }
    addEmptyPacketToStream(t, e) {
      k(this, t, (n) => {
        this.i._addEmptyPacketToInputStream(n, e);
      });
    }
    addBoolVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateBoolVector(t.length);
        if (!s) throw Error("Unable to allocate new bool vector on heap.");
        for (const o of t) this.i._addBoolVectorEntry(s, o);
        this.i._addBoolVectorToInputStream(s, r, n);
      });
    }
    addDoubleVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateDoubleVector(t.length);
        if (!s) throw Error("Unable to allocate new double vector on heap.");
        for (const o of t) this.i._addDoubleVectorEntry(s, o);
        this.i._addDoubleVectorToInputStream(s, r, n);
      });
    }
    addFloatVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateFloatVector(t.length);
        if (!s) throw Error("Unable to allocate new float vector on heap.");
        for (const o of t) this.i._addFloatVectorEntry(s, o);
        this.i._addFloatVectorToInputStream(s, r, n);
      });
    }
    addIntVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateIntVector(t.length);
        if (!s) throw Error("Unable to allocate new int vector on heap.");
        for (const o of t) this.i._addIntVectorEntry(s, o);
        this.i._addIntVectorToInputStream(s, r, n);
      });
    }
    addUintVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateUintVector(t.length);
        if (!s)
          throw Error("Unable to allocate new unsigned int vector on heap.");
        for (const o of t) this.i._addUintVectorEntry(s, o);
        this.i._addUintVectorToInputStream(s, r, n);
      });
    }
    addStringVectorToStream(t, e, n) {
      k(this, e, (r) => {
        const s = this.i._allocateStringVector(t.length);
        if (!s) throw Error("Unable to allocate new string vector on heap.");
        for (const o of t)
          k(this, o, (i) => {
            this.i._addStringVectorEntry(s, i);
          });
        this.i._addStringVectorToInputStream(s, r, n);
      });
    }
    addBoolToInputSidePacket(t, e) {
      k(this, e, (n) => {
        this.i._addBoolToInputSidePacket(t, n);
      });
    }
    addDoubleToInputSidePacket(t, e) {
      k(this, e, (n) => {
        this.i._addDoubleToInputSidePacket(t, n);
      });
    }
    addFloatToInputSidePacket(t, e) {
      k(this, e, (n) => {
        this.i._addFloatToInputSidePacket(t, n);
      });
    }
    addIntToInputSidePacket(t, e) {
      k(this, e, (n) => {
        this.i._addIntToInputSidePacket(t, n);
      });
    }
    addUintToInputSidePacket(t, e) {
      k(this, e, (n) => {
        this.i._addUintToInputSidePacket(t, n);
      });
    }
    addStringToInputSidePacket(t, e) {
      k(this, e, (n) => {
        k(this, t, (r) => {
          this.i._addStringToInputSidePacket(r, n);
        });
      });
    }
    addProtoToInputSidePacket(t, e, n) {
      k(this, n, (r) => {
        k(this, e, (s) => {
          const o = this.i._malloc(t.length);
          (this.i.HEAPU8.set(t, o),
            this.i._addProtoToInputSidePacket(o, t.length, s, r),
            this.i._free(o));
        });
      });
    }
    addBoolVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateBoolVector(t.length);
        if (!r) throw Error("Unable to allocate new bool vector on heap.");
        for (const s of t) this.i._addBoolVectorEntry(r, s);
        this.i._addBoolVectorToInputSidePacket(r, n);
      });
    }
    addDoubleVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateDoubleVector(t.length);
        if (!r) throw Error("Unable to allocate new double vector on heap.");
        for (const s of t) this.i._addDoubleVectorEntry(r, s);
        this.i._addDoubleVectorToInputSidePacket(r, n);
      });
    }
    addFloatVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateFloatVector(t.length);
        if (!r) throw Error("Unable to allocate new float vector on heap.");
        for (const s of t) this.i._addFloatVectorEntry(r, s);
        this.i._addFloatVectorToInputSidePacket(r, n);
      });
    }
    addIntVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateIntVector(t.length);
        if (!r) throw Error("Unable to allocate new int vector on heap.");
        for (const s of t) this.i._addIntVectorEntry(r, s);
        this.i._addIntVectorToInputSidePacket(r, n);
      });
    }
    addUintVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateUintVector(t.length);
        if (!r)
          throw Error("Unable to allocate new unsigned int vector on heap.");
        for (const s of t) this.i._addUintVectorEntry(r, s);
        this.i._addUintVectorToInputSidePacket(r, n);
      });
    }
    addStringVectorToInputSidePacket(t, e) {
      k(this, e, (n) => {
        const r = this.i._allocateStringVector(t.length);
        if (!r) throw Error("Unable to allocate new string vector on heap.");
        for (const s of t)
          k(this, s, (o) => {
            this.i._addStringVectorEntry(r, o);
          });
        this.i._addStringVectorToInputSidePacket(r, n);
      });
    }
    attachBoolListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachBoolListener(n);
        }));
    }
    attachBoolVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachBoolVectorListener(n);
        }));
    }
    attachIntListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachIntListener(n);
        }));
    }
    attachIntVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachIntVectorListener(n);
        }));
    }
    attachUintListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachUintListener(n);
        }));
    }
    attachUintVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachUintVectorListener(n);
        }));
    }
    attachDoubleListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachDoubleListener(n);
        }));
    }
    attachDoubleVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachDoubleVectorListener(n);
        }));
    }
    attachFloatListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachFloatListener(n);
        }));
    }
    attachFloatVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachFloatVectorListener(n);
        }));
    }
    attachStringListener(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.i._attachStringListener(n);
        }));
    }
    attachStringVectorListener(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.i._attachStringVectorListener(n);
        }));
    }
    attachProtoListener(t, e, n) {
      (be(this, t, e),
        k(this, t, (r) => {
          this.i._attachProtoListener(r, n || !1);
        }));
    }
    attachProtoVectorListener(t, e, n) {
      (je(this, t, e),
        k(this, t, (r) => {
          this.i._attachProtoVectorListener(r, n || !1);
        }));
    }
    attachAudioListener(t, e, n) {
      (this.i._attachAudioListener ||
        console.warn(
          'Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?',
        ),
        be(this, t, (r, s) => {
          ((r = new Float32Array(r.buffer, r.byteOffset, r.length / 4)),
            e(r, s));
        }),
        k(this, t, (r) => {
          this.i._attachAudioListener(r, n || !1);
        }));
    }
    finishProcessing() {
      this.i._waitUntilIdle();
    }
    closeGraph() {
      (this.i._closeGraph(),
        (this.i.simpleListeners = void 0),
        (this.i.emptyPacketListeners = void 0));
    }
  }),
  class extends _c {
    get ea() {
      return this.i;
    }
    qa(t, e, n) {
      k(this, e, (r) => {
        const [s, o] = uc(this, t, r);
        this.ea._addBoundTextureAsImageToStream(r, s, o, n);
      });
    }
    U(t, e) {
      (be(this, t, e),
        k(this, t, (n) => {
          this.ea._attachImageListener(n);
        }));
    }
    ca(t, e) {
      (je(this, t, e),
        k(this, t, (n) => {
          this.ea._attachImageVectorListener(n);
        }));
    }
  }),
);
var _c,
  oe = class extends Jh {};
async function I(t, e, n) {
  return (async function (r, s, o, i) {
    return Kh(r, s, o, i);
  })(t, n.canvas ?? (ju() ? void 0 : document.createElement("canvas")), e, n);
}
function Ku(t, e, n, r) {
  if (t.T) {
    const o = new _u();
    if (n != null && n.regionOfInterest) {
      if (!t.pa) throw Error("This task doesn't support region-of-interest.");
      var s = n.regionOfInterest;
      if (s.left >= s.right || s.top >= s.bottom)
        throw Error("Expected RectF with left < right and top < bottom.");
      if (s.left < 0 || s.top < 0 || s.right > 1 || s.bottom > 1)
        throw Error("Expected RectF values to be in [0,1].");
      (v(o, 1, (s.left + s.right) / 2),
        v(o, 2, (s.top + s.bottom) / 2),
        v(o, 4, s.right - s.left),
        v(o, 3, s.bottom - s.top));
    } else (v(o, 1, 0.5), v(o, 2, 0.5), v(o, 4, 1), v(o, 3, 1));
    if (n != null && n.rotationDegrees) {
      if ((n == null ? void 0 : n.rotationDegrees) % 90 != 0)
        throw Error("Expected rotation to be a multiple of 90°.");
      if (
        (v(o, 5, (-Math.PI * n.rotationDegrees) / 180),
        (n == null ? void 0 : n.rotationDegrees) % 180 != 0)
      ) {
        const [i, a] = Vu(e);
        ((n = (at(o, 3) * a) / i),
          (s = (at(o, 4) * i) / a),
          v(o, 4, n),
          v(o, 3, s));
      }
    }
    t.g.addProtoToStream(o.g(), "mediapipe.NormalizedRect", t.T, r);
  }
  (t.g.qa(e, t.aa, r ?? performance.now()), t.finishProcessing());
}
function ie(t, e, n) {
  var r;
  if ((r = t.baseOptions) != null && r.g())
    throw Error(
      "Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.",
    );
  Ku(t, e, n, t.B + 1);
}
function Te(t, e, n, r) {
  var s;
  if (!((s = t.baseOptions) != null && s.g()))
    throw Error(
      "Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.",
    );
  Ku(t, e, n, r);
}
function Kn(t, e, n, r) {
  var s = e.data;
  const o = e.width,
    i = o * (e = e.height);
  if ((s instanceof Uint8Array || s instanceof Float32Array) && s.length !== i)
    throw Error("Unsupported channel count: " + s.length / i);
  return ((t = new gt([s], n, !1, t.g.i.canvas, t.O, o, e)), r ? t.clone() : t);
}
var Ot = class extends Zr {
  constructor(t, e, n, r) {
    (super(t),
      (this.g = t),
      (this.aa = e),
      (this.T = n),
      (this.pa = r),
      (this.O = new ta()));
  }
  l(t, e = !0) {
    if (
      ("runningMode" in t &&
        Lr(this.baseOptions, 2, !!t.runningMode && t.runningMode !== "IMAGE"),
      t.canvas !== void 0 && this.g.i.canvas !== t.canvas)
    )
      throw Error("You must create a new task to reset the canvas.");
    return super.l(t, e);
  }
  close() {
    (this.O.close(), super.close());
  }
};
Ot.prototype.close = Ot.prototype.close;
var $t = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect_in", !1),
      (this.j = { detections: [] }),
      x((t = this.h = new Gs()), 0, 1, (e = new tt())),
      v(this.h, 2, 0.5),
      v(this.h, 3, 0.3));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      "minDetectionConfidence" in t &&
        v(this.h, 2, t.minDetectionConfidence ?? 0.5),
      "minSuppressionThreshold" in t &&
        v(this.h, 3, t.minSuppressionThreshold ?? 0.3),
      this.l(t)
    );
  }
  D(t, e) {
    return ((this.j = { detections: [] }), ie(this, t, e), this.j);
  }
  F(t, e, n) {
    return ((this.j = { detections: [] }), Te(this, t, n, e), this.j);
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "norm_rect_in"), U(t, "detections"));
    const e = new Ht();
    pe(e, Fh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.face_detector.FaceDetectorGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect_in"),
      O(n, "DETECTIONS:detections"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoVectorListener("detections", (r, s) => {
        for (const o of r) ((r = mu(o)), this.j.detections.push(Hu(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("detections", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
(($t.prototype.detectForVideo = $t.prototype.F),
  ($t.prototype.detect = $t.prototype.D),
  ($t.prototype.setOptions = $t.prototype.o),
  ($t.createFromModelPath = async function (t, e) {
    return I($t, t, { baseOptions: { modelAssetPath: e } });
  }),
  ($t.createFromModelBuffer = function (t, e) {
    return I($t, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  ($t.createFromOptions = function (t, e) {
    return I($t, t, e);
  }));
var na = ye(
    [61, 146],
    [146, 91],
    [91, 181],
    [181, 84],
    [84, 17],
    [17, 314],
    [314, 405],
    [405, 321],
    [321, 375],
    [375, 291],
    [61, 185],
    [185, 40],
    [40, 39],
    [39, 37],
    [37, 0],
    [0, 267],
    [267, 269],
    [269, 270],
    [270, 409],
    [409, 291],
    [78, 95],
    [95, 88],
    [88, 178],
    [178, 87],
    [87, 14],
    [14, 317],
    [317, 402],
    [402, 318],
    [318, 324],
    [324, 308],
    [78, 191],
    [191, 80],
    [80, 81],
    [81, 82],
    [82, 13],
    [13, 312],
    [312, 311],
    [311, 310],
    [310, 415],
    [415, 308],
  ),
  ra = ye(
    [263, 249],
    [249, 390],
    [390, 373],
    [373, 374],
    [374, 380],
    [380, 381],
    [381, 382],
    [382, 362],
    [263, 466],
    [466, 388],
    [388, 387],
    [387, 386],
    [386, 385],
    [385, 384],
    [384, 398],
    [398, 362],
  ),
  sa = ye(
    [276, 283],
    [283, 282],
    [282, 295],
    [295, 285],
    [300, 293],
    [293, 334],
    [334, 296],
    [296, 336],
  ),
  Xu = ye([474, 475], [475, 476], [476, 477], [477, 474]),
  oa = ye(
    [33, 7],
    [7, 163],
    [163, 144],
    [144, 145],
    [145, 153],
    [153, 154],
    [154, 155],
    [155, 133],
    [33, 246],
    [246, 161],
    [161, 160],
    [160, 159],
    [159, 158],
    [158, 157],
    [157, 173],
    [173, 133],
  ),
  ia = ye(
    [46, 53],
    [53, 52],
    [52, 65],
    [65, 55],
    [70, 63],
    [63, 105],
    [105, 66],
    [66, 107],
  ),
  Ju = ye([469, 470], [470, 471], [471, 472], [472, 469]),
  aa = ye(
    [10, 338],
    [338, 297],
    [297, 332],
    [332, 284],
    [284, 251],
    [251, 389],
    [389, 356],
    [356, 454],
    [454, 323],
    [323, 361],
    [361, 288],
    [288, 397],
    [397, 365],
    [365, 379],
    [379, 378],
    [378, 400],
    [400, 377],
    [377, 152],
    [152, 148],
    [148, 176],
    [176, 149],
    [149, 150],
    [150, 136],
    [136, 172],
    [172, 58],
    [58, 132],
    [132, 93],
    [93, 234],
    [234, 127],
    [127, 162],
    [162, 21],
    [21, 54],
    [54, 103],
    [103, 67],
    [67, 109],
    [109, 10],
  ),
  Zu = [...na, ...ra, ...sa, ...oa, ...ia, ...aa],
  Qu = ye(
    [127, 34],
    [34, 139],
    [139, 127],
    [11, 0],
    [0, 37],
    [37, 11],
    [232, 231],
    [231, 120],
    [120, 232],
    [72, 37],
    [37, 39],
    [39, 72],
    [128, 121],
    [121, 47],
    [47, 128],
    [232, 121],
    [121, 128],
    [128, 232],
    [104, 69],
    [69, 67],
    [67, 104],
    [175, 171],
    [171, 148],
    [148, 175],
    [118, 50],
    [50, 101],
    [101, 118],
    [73, 39],
    [39, 40],
    [40, 73],
    [9, 151],
    [151, 108],
    [108, 9],
    [48, 115],
    [115, 131],
    [131, 48],
    [194, 204],
    [204, 211],
    [211, 194],
    [74, 40],
    [40, 185],
    [185, 74],
    [80, 42],
    [42, 183],
    [183, 80],
    [40, 92],
    [92, 186],
    [186, 40],
    [230, 229],
    [229, 118],
    [118, 230],
    [202, 212],
    [212, 214],
    [214, 202],
    [83, 18],
    [18, 17],
    [17, 83],
    [76, 61],
    [61, 146],
    [146, 76],
    [160, 29],
    [29, 30],
    [30, 160],
    [56, 157],
    [157, 173],
    [173, 56],
    [106, 204],
    [204, 194],
    [194, 106],
    [135, 214],
    [214, 192],
    [192, 135],
    [203, 165],
    [165, 98],
    [98, 203],
    [21, 71],
    [71, 68],
    [68, 21],
    [51, 45],
    [45, 4],
    [4, 51],
    [144, 24],
    [24, 23],
    [23, 144],
    [77, 146],
    [146, 91],
    [91, 77],
    [205, 50],
    [50, 187],
    [187, 205],
    [201, 200],
    [200, 18],
    [18, 201],
    [91, 106],
    [106, 182],
    [182, 91],
    [90, 91],
    [91, 181],
    [181, 90],
    [85, 84],
    [84, 17],
    [17, 85],
    [206, 203],
    [203, 36],
    [36, 206],
    [148, 171],
    [171, 140],
    [140, 148],
    [92, 40],
    [40, 39],
    [39, 92],
    [193, 189],
    [189, 244],
    [244, 193],
    [159, 158],
    [158, 28],
    [28, 159],
    [247, 246],
    [246, 161],
    [161, 247],
    [236, 3],
    [3, 196],
    [196, 236],
    [54, 68],
    [68, 104],
    [104, 54],
    [193, 168],
    [168, 8],
    [8, 193],
    [117, 228],
    [228, 31],
    [31, 117],
    [189, 193],
    [193, 55],
    [55, 189],
    [98, 97],
    [97, 99],
    [99, 98],
    [126, 47],
    [47, 100],
    [100, 126],
    [166, 79],
    [79, 218],
    [218, 166],
    [155, 154],
    [154, 26],
    [26, 155],
    [209, 49],
    [49, 131],
    [131, 209],
    [135, 136],
    [136, 150],
    [150, 135],
    [47, 126],
    [126, 217],
    [217, 47],
    [223, 52],
    [52, 53],
    [53, 223],
    [45, 51],
    [51, 134],
    [134, 45],
    [211, 170],
    [170, 140],
    [140, 211],
    [67, 69],
    [69, 108],
    [108, 67],
    [43, 106],
    [106, 91],
    [91, 43],
    [230, 119],
    [119, 120],
    [120, 230],
    [226, 130],
    [130, 247],
    [247, 226],
    [63, 53],
    [53, 52],
    [52, 63],
    [238, 20],
    [20, 242],
    [242, 238],
    [46, 70],
    [70, 156],
    [156, 46],
    [78, 62],
    [62, 96],
    [96, 78],
    [46, 53],
    [53, 63],
    [63, 46],
    [143, 34],
    [34, 227],
    [227, 143],
    [123, 117],
    [117, 111],
    [111, 123],
    [44, 125],
    [125, 19],
    [19, 44],
    [236, 134],
    [134, 51],
    [51, 236],
    [216, 206],
    [206, 205],
    [205, 216],
    [154, 153],
    [153, 22],
    [22, 154],
    [39, 37],
    [37, 167],
    [167, 39],
    [200, 201],
    [201, 208],
    [208, 200],
    [36, 142],
    [142, 100],
    [100, 36],
    [57, 212],
    [212, 202],
    [202, 57],
    [20, 60],
    [60, 99],
    [99, 20],
    [28, 158],
    [158, 157],
    [157, 28],
    [35, 226],
    [226, 113],
    [113, 35],
    [160, 159],
    [159, 27],
    [27, 160],
    [204, 202],
    [202, 210],
    [210, 204],
    [113, 225],
    [225, 46],
    [46, 113],
    [43, 202],
    [202, 204],
    [204, 43],
    [62, 76],
    [76, 77],
    [77, 62],
    [137, 123],
    [123, 116],
    [116, 137],
    [41, 38],
    [38, 72],
    [72, 41],
    [203, 129],
    [129, 142],
    [142, 203],
    [64, 98],
    [98, 240],
    [240, 64],
    [49, 102],
    [102, 64],
    [64, 49],
    [41, 73],
    [73, 74],
    [74, 41],
    [212, 216],
    [216, 207],
    [207, 212],
    [42, 74],
    [74, 184],
    [184, 42],
    [169, 170],
    [170, 211],
    [211, 169],
    [170, 149],
    [149, 176],
    [176, 170],
    [105, 66],
    [66, 69],
    [69, 105],
    [122, 6],
    [6, 168],
    [168, 122],
    [123, 147],
    [147, 187],
    [187, 123],
    [96, 77],
    [77, 90],
    [90, 96],
    [65, 55],
    [55, 107],
    [107, 65],
    [89, 90],
    [90, 180],
    [180, 89],
    [101, 100],
    [100, 120],
    [120, 101],
    [63, 105],
    [105, 104],
    [104, 63],
    [93, 137],
    [137, 227],
    [227, 93],
    [15, 86],
    [86, 85],
    [85, 15],
    [129, 102],
    [102, 49],
    [49, 129],
    [14, 87],
    [87, 86],
    [86, 14],
    [55, 8],
    [8, 9],
    [9, 55],
    [100, 47],
    [47, 121],
    [121, 100],
    [145, 23],
    [23, 22],
    [22, 145],
    [88, 89],
    [89, 179],
    [179, 88],
    [6, 122],
    [122, 196],
    [196, 6],
    [88, 95],
    [95, 96],
    [96, 88],
    [138, 172],
    [172, 136],
    [136, 138],
    [215, 58],
    [58, 172],
    [172, 215],
    [115, 48],
    [48, 219],
    [219, 115],
    [42, 80],
    [80, 81],
    [81, 42],
    [195, 3],
    [3, 51],
    [51, 195],
    [43, 146],
    [146, 61],
    [61, 43],
    [171, 175],
    [175, 199],
    [199, 171],
    [81, 82],
    [82, 38],
    [38, 81],
    [53, 46],
    [46, 225],
    [225, 53],
    [144, 163],
    [163, 110],
    [110, 144],
    [52, 65],
    [65, 66],
    [66, 52],
    [229, 228],
    [228, 117],
    [117, 229],
    [34, 127],
    [127, 234],
    [234, 34],
    [107, 108],
    [108, 69],
    [69, 107],
    [109, 108],
    [108, 151],
    [151, 109],
    [48, 64],
    [64, 235],
    [235, 48],
    [62, 78],
    [78, 191],
    [191, 62],
    [129, 209],
    [209, 126],
    [126, 129],
    [111, 35],
    [35, 143],
    [143, 111],
    [117, 123],
    [123, 50],
    [50, 117],
    [222, 65],
    [65, 52],
    [52, 222],
    [19, 125],
    [125, 141],
    [141, 19],
    [221, 55],
    [55, 65],
    [65, 221],
    [3, 195],
    [195, 197],
    [197, 3],
    [25, 7],
    [7, 33],
    [33, 25],
    [220, 237],
    [237, 44],
    [44, 220],
    [70, 71],
    [71, 139],
    [139, 70],
    [122, 193],
    [193, 245],
    [245, 122],
    [247, 130],
    [130, 33],
    [33, 247],
    [71, 21],
    [21, 162],
    [162, 71],
    [170, 169],
    [169, 150],
    [150, 170],
    [188, 174],
    [174, 196],
    [196, 188],
    [216, 186],
    [186, 92],
    [92, 216],
    [2, 97],
    [97, 167],
    [167, 2],
    [141, 125],
    [125, 241],
    [241, 141],
    [164, 167],
    [167, 37],
    [37, 164],
    [72, 38],
    [38, 12],
    [12, 72],
    [38, 82],
    [82, 13],
    [13, 38],
    [63, 68],
    [68, 71],
    [71, 63],
    [226, 35],
    [35, 111],
    [111, 226],
    [101, 50],
    [50, 205],
    [205, 101],
    [206, 92],
    [92, 165],
    [165, 206],
    [209, 198],
    [198, 217],
    [217, 209],
    [165, 167],
    [167, 97],
    [97, 165],
    [220, 115],
    [115, 218],
    [218, 220],
    [133, 112],
    [112, 243],
    [243, 133],
    [239, 238],
    [238, 241],
    [241, 239],
    [214, 135],
    [135, 169],
    [169, 214],
    [190, 173],
    [173, 133],
    [133, 190],
    [171, 208],
    [208, 32],
    [32, 171],
    [125, 44],
    [44, 237],
    [237, 125],
    [86, 87],
    [87, 178],
    [178, 86],
    [85, 86],
    [86, 179],
    [179, 85],
    [84, 85],
    [85, 180],
    [180, 84],
    [83, 84],
    [84, 181],
    [181, 83],
    [201, 83],
    [83, 182],
    [182, 201],
    [137, 93],
    [93, 132],
    [132, 137],
    [76, 62],
    [62, 183],
    [183, 76],
    [61, 76],
    [76, 184],
    [184, 61],
    [57, 61],
    [61, 185],
    [185, 57],
    [212, 57],
    [57, 186],
    [186, 212],
    [214, 207],
    [207, 187],
    [187, 214],
    [34, 143],
    [143, 156],
    [156, 34],
    [79, 239],
    [239, 237],
    [237, 79],
    [123, 137],
    [137, 177],
    [177, 123],
    [44, 1],
    [1, 4],
    [4, 44],
    [201, 194],
    [194, 32],
    [32, 201],
    [64, 102],
    [102, 129],
    [129, 64],
    [213, 215],
    [215, 138],
    [138, 213],
    [59, 166],
    [166, 219],
    [219, 59],
    [242, 99],
    [99, 97],
    [97, 242],
    [2, 94],
    [94, 141],
    [141, 2],
    [75, 59],
    [59, 235],
    [235, 75],
    [24, 110],
    [110, 228],
    [228, 24],
    [25, 130],
    [130, 226],
    [226, 25],
    [23, 24],
    [24, 229],
    [229, 23],
    [22, 23],
    [23, 230],
    [230, 22],
    [26, 22],
    [22, 231],
    [231, 26],
    [112, 26],
    [26, 232],
    [232, 112],
    [189, 190],
    [190, 243],
    [243, 189],
    [221, 56],
    [56, 190],
    [190, 221],
    [28, 56],
    [56, 221],
    [221, 28],
    [27, 28],
    [28, 222],
    [222, 27],
    [29, 27],
    [27, 223],
    [223, 29],
    [30, 29],
    [29, 224],
    [224, 30],
    [247, 30],
    [30, 225],
    [225, 247],
    [238, 79],
    [79, 20],
    [20, 238],
    [166, 59],
    [59, 75],
    [75, 166],
    [60, 75],
    [75, 240],
    [240, 60],
    [147, 177],
    [177, 215],
    [215, 147],
    [20, 79],
    [79, 166],
    [166, 20],
    [187, 147],
    [147, 213],
    [213, 187],
    [112, 233],
    [233, 244],
    [244, 112],
    [233, 128],
    [128, 245],
    [245, 233],
    [128, 114],
    [114, 188],
    [188, 128],
    [114, 217],
    [217, 174],
    [174, 114],
    [131, 115],
    [115, 220],
    [220, 131],
    [217, 198],
    [198, 236],
    [236, 217],
    [198, 131],
    [131, 134],
    [134, 198],
    [177, 132],
    [132, 58],
    [58, 177],
    [143, 35],
    [35, 124],
    [124, 143],
    [110, 163],
    [163, 7],
    [7, 110],
    [228, 110],
    [110, 25],
    [25, 228],
    [356, 389],
    [389, 368],
    [368, 356],
    [11, 302],
    [302, 267],
    [267, 11],
    [452, 350],
    [350, 349],
    [349, 452],
    [302, 303],
    [303, 269],
    [269, 302],
    [357, 343],
    [343, 277],
    [277, 357],
    [452, 453],
    [453, 357],
    [357, 452],
    [333, 332],
    [332, 297],
    [297, 333],
    [175, 152],
    [152, 377],
    [377, 175],
    [347, 348],
    [348, 330],
    [330, 347],
    [303, 304],
    [304, 270],
    [270, 303],
    [9, 336],
    [336, 337],
    [337, 9],
    [278, 279],
    [279, 360],
    [360, 278],
    [418, 262],
    [262, 431],
    [431, 418],
    [304, 408],
    [408, 409],
    [409, 304],
    [310, 415],
    [415, 407],
    [407, 310],
    [270, 409],
    [409, 410],
    [410, 270],
    [450, 348],
    [348, 347],
    [347, 450],
    [422, 430],
    [430, 434],
    [434, 422],
    [313, 314],
    [314, 17],
    [17, 313],
    [306, 307],
    [307, 375],
    [375, 306],
    [387, 388],
    [388, 260],
    [260, 387],
    [286, 414],
    [414, 398],
    [398, 286],
    [335, 406],
    [406, 418],
    [418, 335],
    [364, 367],
    [367, 416],
    [416, 364],
    [423, 358],
    [358, 327],
    [327, 423],
    [251, 284],
    [284, 298],
    [298, 251],
    [281, 5],
    [5, 4],
    [4, 281],
    [373, 374],
    [374, 253],
    [253, 373],
    [307, 320],
    [320, 321],
    [321, 307],
    [425, 427],
    [427, 411],
    [411, 425],
    [421, 313],
    [313, 18],
    [18, 421],
    [321, 405],
    [405, 406],
    [406, 321],
    [320, 404],
    [404, 405],
    [405, 320],
    [315, 16],
    [16, 17],
    [17, 315],
    [426, 425],
    [425, 266],
    [266, 426],
    [377, 400],
    [400, 369],
    [369, 377],
    [322, 391],
    [391, 269],
    [269, 322],
    [417, 465],
    [465, 464],
    [464, 417],
    [386, 257],
    [257, 258],
    [258, 386],
    [466, 260],
    [260, 388],
    [388, 466],
    [456, 399],
    [399, 419],
    [419, 456],
    [284, 332],
    [332, 333],
    [333, 284],
    [417, 285],
    [285, 8],
    [8, 417],
    [346, 340],
    [340, 261],
    [261, 346],
    [413, 441],
    [441, 285],
    [285, 413],
    [327, 460],
    [460, 328],
    [328, 327],
    [355, 371],
    [371, 329],
    [329, 355],
    [392, 439],
    [439, 438],
    [438, 392],
    [382, 341],
    [341, 256],
    [256, 382],
    [429, 420],
    [420, 360],
    [360, 429],
    [364, 394],
    [394, 379],
    [379, 364],
    [277, 343],
    [343, 437],
    [437, 277],
    [443, 444],
    [444, 283],
    [283, 443],
    [275, 440],
    [440, 363],
    [363, 275],
    [431, 262],
    [262, 369],
    [369, 431],
    [297, 338],
    [338, 337],
    [337, 297],
    [273, 375],
    [375, 321],
    [321, 273],
    [450, 451],
    [451, 349],
    [349, 450],
    [446, 342],
    [342, 467],
    [467, 446],
    [293, 334],
    [334, 282],
    [282, 293],
    [458, 461],
    [461, 462],
    [462, 458],
    [276, 353],
    [353, 383],
    [383, 276],
    [308, 324],
    [324, 325],
    [325, 308],
    [276, 300],
    [300, 293],
    [293, 276],
    [372, 345],
    [345, 447],
    [447, 372],
    [352, 345],
    [345, 340],
    [340, 352],
    [274, 1],
    [1, 19],
    [19, 274],
    [456, 248],
    [248, 281],
    [281, 456],
    [436, 427],
    [427, 425],
    [425, 436],
    [381, 256],
    [256, 252],
    [252, 381],
    [269, 391],
    [391, 393],
    [393, 269],
    [200, 199],
    [199, 428],
    [428, 200],
    [266, 330],
    [330, 329],
    [329, 266],
    [287, 273],
    [273, 422],
    [422, 287],
    [250, 462],
    [462, 328],
    [328, 250],
    [258, 286],
    [286, 384],
    [384, 258],
    [265, 353],
    [353, 342],
    [342, 265],
    [387, 259],
    [259, 257],
    [257, 387],
    [424, 431],
    [431, 430],
    [430, 424],
    [342, 353],
    [353, 276],
    [276, 342],
    [273, 335],
    [335, 424],
    [424, 273],
    [292, 325],
    [325, 307],
    [307, 292],
    [366, 447],
    [447, 345],
    [345, 366],
    [271, 303],
    [303, 302],
    [302, 271],
    [423, 266],
    [266, 371],
    [371, 423],
    [294, 455],
    [455, 460],
    [460, 294],
    [279, 278],
    [278, 294],
    [294, 279],
    [271, 272],
    [272, 304],
    [304, 271],
    [432, 434],
    [434, 427],
    [427, 432],
    [272, 407],
    [407, 408],
    [408, 272],
    [394, 430],
    [430, 431],
    [431, 394],
    [395, 369],
    [369, 400],
    [400, 395],
    [334, 333],
    [333, 299],
    [299, 334],
    [351, 417],
    [417, 168],
    [168, 351],
    [352, 280],
    [280, 411],
    [411, 352],
    [325, 319],
    [319, 320],
    [320, 325],
    [295, 296],
    [296, 336],
    [336, 295],
    [319, 403],
    [403, 404],
    [404, 319],
    [330, 348],
    [348, 349],
    [349, 330],
    [293, 298],
    [298, 333],
    [333, 293],
    [323, 454],
    [454, 447],
    [447, 323],
    [15, 16],
    [16, 315],
    [315, 15],
    [358, 429],
    [429, 279],
    [279, 358],
    [14, 15],
    [15, 316],
    [316, 14],
    [285, 336],
    [336, 9],
    [9, 285],
    [329, 349],
    [349, 350],
    [350, 329],
    [374, 380],
    [380, 252],
    [252, 374],
    [318, 402],
    [402, 403],
    [403, 318],
    [6, 197],
    [197, 419],
    [419, 6],
    [318, 319],
    [319, 325],
    [325, 318],
    [367, 364],
    [364, 365],
    [365, 367],
    [435, 367],
    [367, 397],
    [397, 435],
    [344, 438],
    [438, 439],
    [439, 344],
    [272, 271],
    [271, 311],
    [311, 272],
    [195, 5],
    [5, 281],
    [281, 195],
    [273, 287],
    [287, 291],
    [291, 273],
    [396, 428],
    [428, 199],
    [199, 396],
    [311, 271],
    [271, 268],
    [268, 311],
    [283, 444],
    [444, 445],
    [445, 283],
    [373, 254],
    [254, 339],
    [339, 373],
    [282, 334],
    [334, 296],
    [296, 282],
    [449, 347],
    [347, 346],
    [346, 449],
    [264, 447],
    [447, 454],
    [454, 264],
    [336, 296],
    [296, 299],
    [299, 336],
    [338, 10],
    [10, 151],
    [151, 338],
    [278, 439],
    [439, 455],
    [455, 278],
    [292, 407],
    [407, 415],
    [415, 292],
    [358, 371],
    [371, 355],
    [355, 358],
    [340, 345],
    [345, 372],
    [372, 340],
    [346, 347],
    [347, 280],
    [280, 346],
    [442, 443],
    [443, 282],
    [282, 442],
    [19, 94],
    [94, 370],
    [370, 19],
    [441, 442],
    [442, 295],
    [295, 441],
    [248, 419],
    [419, 197],
    [197, 248],
    [263, 255],
    [255, 359],
    [359, 263],
    [440, 275],
    [275, 274],
    [274, 440],
    [300, 383],
    [383, 368],
    [368, 300],
    [351, 412],
    [412, 465],
    [465, 351],
    [263, 467],
    [467, 466],
    [466, 263],
    [301, 368],
    [368, 389],
    [389, 301],
    [395, 378],
    [378, 379],
    [379, 395],
    [412, 351],
    [351, 419],
    [419, 412],
    [436, 426],
    [426, 322],
    [322, 436],
    [2, 164],
    [164, 393],
    [393, 2],
    [370, 462],
    [462, 461],
    [461, 370],
    [164, 0],
    [0, 267],
    [267, 164],
    [302, 11],
    [11, 12],
    [12, 302],
    [268, 12],
    [12, 13],
    [13, 268],
    [293, 300],
    [300, 301],
    [301, 293],
    [446, 261],
    [261, 340],
    [340, 446],
    [330, 266],
    [266, 425],
    [425, 330],
    [426, 423],
    [423, 391],
    [391, 426],
    [429, 355],
    [355, 437],
    [437, 429],
    [391, 327],
    [327, 326],
    [326, 391],
    [440, 457],
    [457, 438],
    [438, 440],
    [341, 382],
    [382, 362],
    [362, 341],
    [459, 457],
    [457, 461],
    [461, 459],
    [434, 430],
    [430, 394],
    [394, 434],
    [414, 463],
    [463, 362],
    [362, 414],
    [396, 369],
    [369, 262],
    [262, 396],
    [354, 461],
    [461, 457],
    [457, 354],
    [316, 403],
    [403, 402],
    [402, 316],
    [315, 404],
    [404, 403],
    [403, 315],
    [314, 405],
    [405, 404],
    [404, 314],
    [313, 406],
    [406, 405],
    [405, 313],
    [421, 418],
    [418, 406],
    [406, 421],
    [366, 401],
    [401, 361],
    [361, 366],
    [306, 408],
    [408, 407],
    [407, 306],
    [291, 409],
    [409, 408],
    [408, 291],
    [287, 410],
    [410, 409],
    [409, 287],
    [432, 436],
    [436, 410],
    [410, 432],
    [434, 416],
    [416, 411],
    [411, 434],
    [264, 368],
    [368, 383],
    [383, 264],
    [309, 438],
    [438, 457],
    [457, 309],
    [352, 376],
    [376, 401],
    [401, 352],
    [274, 275],
    [275, 4],
    [4, 274],
    [421, 428],
    [428, 262],
    [262, 421],
    [294, 327],
    [327, 358],
    [358, 294],
    [433, 416],
    [416, 367],
    [367, 433],
    [289, 455],
    [455, 439],
    [439, 289],
    [462, 370],
    [370, 326],
    [326, 462],
    [2, 326],
    [326, 370],
    [370, 2],
    [305, 460],
    [460, 455],
    [455, 305],
    [254, 449],
    [449, 448],
    [448, 254],
    [255, 261],
    [261, 446],
    [446, 255],
    [253, 450],
    [450, 449],
    [449, 253],
    [252, 451],
    [451, 450],
    [450, 252],
    [256, 452],
    [452, 451],
    [451, 256],
    [341, 453],
    [453, 452],
    [452, 341],
    [413, 464],
    [464, 463],
    [463, 413],
    [441, 413],
    [413, 414],
    [414, 441],
    [258, 442],
    [442, 441],
    [441, 258],
    [257, 443],
    [443, 442],
    [442, 257],
    [259, 444],
    [444, 443],
    [443, 259],
    [260, 445],
    [445, 444],
    [444, 260],
    [467, 342],
    [342, 445],
    [445, 467],
    [459, 458],
    [458, 250],
    [250, 459],
    [289, 392],
    [392, 290],
    [290, 289],
    [290, 328],
    [328, 460],
    [460, 290],
    [376, 433],
    [433, 435],
    [435, 376],
    [250, 290],
    [290, 392],
    [392, 250],
    [411, 416],
    [416, 433],
    [433, 411],
    [341, 463],
    [463, 464],
    [464, 341],
    [453, 464],
    [464, 465],
    [465, 453],
    [357, 465],
    [465, 412],
    [412, 357],
    [343, 412],
    [412, 399],
    [399, 343],
    [360, 363],
    [363, 440],
    [440, 360],
    [437, 399],
    [399, 456],
    [456, 437],
    [420, 456],
    [456, 363],
    [363, 420],
    [401, 435],
    [435, 288],
    [288, 401],
    [372, 383],
    [383, 353],
    [353, 372],
    [339, 255],
    [255, 249],
    [249, 339],
    [448, 261],
    [261, 255],
    [255, 448],
    [133, 243],
    [243, 190],
    [190, 133],
    [133, 155],
    [155, 112],
    [112, 133],
    [33, 246],
    [246, 247],
    [247, 33],
    [33, 130],
    [130, 25],
    [25, 33],
    [398, 384],
    [384, 286],
    [286, 398],
    [362, 398],
    [398, 414],
    [414, 362],
    [362, 463],
    [463, 341],
    [341, 362],
    [263, 359],
    [359, 467],
    [467, 263],
    [263, 249],
    [249, 255],
    [255, 263],
    [466, 467],
    [467, 260],
    [260, 466],
    [75, 60],
    [60, 166],
    [166, 75],
    [238, 239],
    [239, 79],
    [79, 238],
    [162, 127],
    [127, 139],
    [139, 162],
    [72, 11],
    [11, 37],
    [37, 72],
    [121, 232],
    [232, 120],
    [120, 121],
    [73, 72],
    [72, 39],
    [39, 73],
    [114, 128],
    [128, 47],
    [47, 114],
    [233, 232],
    [232, 128],
    [128, 233],
    [103, 104],
    [104, 67],
    [67, 103],
    [152, 175],
    [175, 148],
    [148, 152],
    [119, 118],
    [118, 101],
    [101, 119],
    [74, 73],
    [73, 40],
    [40, 74],
    [107, 9],
    [9, 108],
    [108, 107],
    [49, 48],
    [48, 131],
    [131, 49],
    [32, 194],
    [194, 211],
    [211, 32],
    [184, 74],
    [74, 185],
    [185, 184],
    [191, 80],
    [80, 183],
    [183, 191],
    [185, 40],
    [40, 186],
    [186, 185],
    [119, 230],
    [230, 118],
    [118, 119],
    [210, 202],
    [202, 214],
    [214, 210],
    [84, 83],
    [83, 17],
    [17, 84],
    [77, 76],
    [76, 146],
    [146, 77],
    [161, 160],
    [160, 30],
    [30, 161],
    [190, 56],
    [56, 173],
    [173, 190],
    [182, 106],
    [106, 194],
    [194, 182],
    [138, 135],
    [135, 192],
    [192, 138],
    [129, 203],
    [203, 98],
    [98, 129],
    [54, 21],
    [21, 68],
    [68, 54],
    [5, 51],
    [51, 4],
    [4, 5],
    [145, 144],
    [144, 23],
    [23, 145],
    [90, 77],
    [77, 91],
    [91, 90],
    [207, 205],
    [205, 187],
    [187, 207],
    [83, 201],
    [201, 18],
    [18, 83],
    [181, 91],
    [91, 182],
    [182, 181],
    [180, 90],
    [90, 181],
    [181, 180],
    [16, 85],
    [85, 17],
    [17, 16],
    [205, 206],
    [206, 36],
    [36, 205],
    [176, 148],
    [148, 140],
    [140, 176],
    [165, 92],
    [92, 39],
    [39, 165],
    [245, 193],
    [193, 244],
    [244, 245],
    [27, 159],
    [159, 28],
    [28, 27],
    [30, 247],
    [247, 161],
    [161, 30],
    [174, 236],
    [236, 196],
    [196, 174],
    [103, 54],
    [54, 104],
    [104, 103],
    [55, 193],
    [193, 8],
    [8, 55],
    [111, 117],
    [117, 31],
    [31, 111],
    [221, 189],
    [189, 55],
    [55, 221],
    [240, 98],
    [98, 99],
    [99, 240],
    [142, 126],
    [126, 100],
    [100, 142],
    [219, 166],
    [166, 218],
    [218, 219],
    [112, 155],
    [155, 26],
    [26, 112],
    [198, 209],
    [209, 131],
    [131, 198],
    [169, 135],
    [135, 150],
    [150, 169],
    [114, 47],
    [47, 217],
    [217, 114],
    [224, 223],
    [223, 53],
    [53, 224],
    [220, 45],
    [45, 134],
    [134, 220],
    [32, 211],
    [211, 140],
    [140, 32],
    [109, 67],
    [67, 108],
    [108, 109],
    [146, 43],
    [43, 91],
    [91, 146],
    [231, 230],
    [230, 120],
    [120, 231],
    [113, 226],
    [226, 247],
    [247, 113],
    [105, 63],
    [63, 52],
    [52, 105],
    [241, 238],
    [238, 242],
    [242, 241],
    [124, 46],
    [46, 156],
    [156, 124],
    [95, 78],
    [78, 96],
    [96, 95],
    [70, 46],
    [46, 63],
    [63, 70],
    [116, 143],
    [143, 227],
    [227, 116],
    [116, 123],
    [123, 111],
    [111, 116],
    [1, 44],
    [44, 19],
    [19, 1],
    [3, 236],
    [236, 51],
    [51, 3],
    [207, 216],
    [216, 205],
    [205, 207],
    [26, 154],
    [154, 22],
    [22, 26],
    [165, 39],
    [39, 167],
    [167, 165],
    [199, 200],
    [200, 208],
    [208, 199],
    [101, 36],
    [36, 100],
    [100, 101],
    [43, 57],
    [57, 202],
    [202, 43],
    [242, 20],
    [20, 99],
    [99, 242],
    [56, 28],
    [28, 157],
    [157, 56],
    [124, 35],
    [35, 113],
    [113, 124],
    [29, 160],
    [160, 27],
    [27, 29],
    [211, 204],
    [204, 210],
    [210, 211],
    [124, 113],
    [113, 46],
    [46, 124],
    [106, 43],
    [43, 204],
    [204, 106],
    [96, 62],
    [62, 77],
    [77, 96],
    [227, 137],
    [137, 116],
    [116, 227],
    [73, 41],
    [41, 72],
    [72, 73],
    [36, 203],
    [203, 142],
    [142, 36],
    [235, 64],
    [64, 240],
    [240, 235],
    [48, 49],
    [49, 64],
    [64, 48],
    [42, 41],
    [41, 74],
    [74, 42],
    [214, 212],
    [212, 207],
    [207, 214],
    [183, 42],
    [42, 184],
    [184, 183],
    [210, 169],
    [169, 211],
    [211, 210],
    [140, 170],
    [170, 176],
    [176, 140],
    [104, 105],
    [105, 69],
    [69, 104],
    [193, 122],
    [122, 168],
    [168, 193],
    [50, 123],
    [123, 187],
    [187, 50],
    [89, 96],
    [96, 90],
    [90, 89],
    [66, 65],
    [65, 107],
    [107, 66],
    [179, 89],
    [89, 180],
    [180, 179],
    [119, 101],
    [101, 120],
    [120, 119],
    [68, 63],
    [63, 104],
    [104, 68],
    [234, 93],
    [93, 227],
    [227, 234],
    [16, 15],
    [15, 85],
    [85, 16],
    [209, 129],
    [129, 49],
    [49, 209],
    [15, 14],
    [14, 86],
    [86, 15],
    [107, 55],
    [55, 9],
    [9, 107],
    [120, 100],
    [100, 121],
    [121, 120],
    [153, 145],
    [145, 22],
    [22, 153],
    [178, 88],
    [88, 179],
    [179, 178],
    [197, 6],
    [6, 196],
    [196, 197],
    [89, 88],
    [88, 96],
    [96, 89],
    [135, 138],
    [138, 136],
    [136, 135],
    [138, 215],
    [215, 172],
    [172, 138],
    [218, 115],
    [115, 219],
    [219, 218],
    [41, 42],
    [42, 81],
    [81, 41],
    [5, 195],
    [195, 51],
    [51, 5],
    [57, 43],
    [43, 61],
    [61, 57],
    [208, 171],
    [171, 199],
    [199, 208],
    [41, 81],
    [81, 38],
    [38, 41],
    [224, 53],
    [53, 225],
    [225, 224],
    [24, 144],
    [144, 110],
    [110, 24],
    [105, 52],
    [52, 66],
    [66, 105],
    [118, 229],
    [229, 117],
    [117, 118],
    [227, 34],
    [34, 234],
    [234, 227],
    [66, 107],
    [107, 69],
    [69, 66],
    [10, 109],
    [109, 151],
    [151, 10],
    [219, 48],
    [48, 235],
    [235, 219],
    [183, 62],
    [62, 191],
    [191, 183],
    [142, 129],
    [129, 126],
    [126, 142],
    [116, 111],
    [111, 143],
    [143, 116],
    [118, 117],
    [117, 50],
    [50, 118],
    [223, 222],
    [222, 52],
    [52, 223],
    [94, 19],
    [19, 141],
    [141, 94],
    [222, 221],
    [221, 65],
    [65, 222],
    [196, 3],
    [3, 197],
    [197, 196],
    [45, 220],
    [220, 44],
    [44, 45],
    [156, 70],
    [70, 139],
    [139, 156],
    [188, 122],
    [122, 245],
    [245, 188],
    [139, 71],
    [71, 162],
    [162, 139],
    [149, 170],
    [170, 150],
    [150, 149],
    [122, 188],
    [188, 196],
    [196, 122],
    [206, 216],
    [216, 92],
    [92, 206],
    [164, 2],
    [2, 167],
    [167, 164],
    [242, 141],
    [141, 241],
    [241, 242],
    [0, 164],
    [164, 37],
    [37, 0],
    [11, 72],
    [72, 12],
    [12, 11],
    [12, 38],
    [38, 13],
    [13, 12],
    [70, 63],
    [63, 71],
    [71, 70],
    [31, 226],
    [226, 111],
    [111, 31],
    [36, 101],
    [101, 205],
    [205, 36],
    [203, 206],
    [206, 165],
    [165, 203],
    [126, 209],
    [209, 217],
    [217, 126],
    [98, 165],
    [165, 97],
    [97, 98],
    [237, 220],
    [220, 218],
    [218, 237],
    [237, 239],
    [239, 241],
    [241, 237],
    [210, 214],
    [214, 169],
    [169, 210],
    [140, 171],
    [171, 32],
    [32, 140],
    [241, 125],
    [125, 237],
    [237, 241],
    [179, 86],
    [86, 178],
    [178, 179],
    [180, 85],
    [85, 179],
    [179, 180],
    [181, 84],
    [84, 180],
    [180, 181],
    [182, 83],
    [83, 181],
    [181, 182],
    [194, 201],
    [201, 182],
    [182, 194],
    [177, 137],
    [137, 132],
    [132, 177],
    [184, 76],
    [76, 183],
    [183, 184],
    [185, 61],
    [61, 184],
    [184, 185],
    [186, 57],
    [57, 185],
    [185, 186],
    [216, 212],
    [212, 186],
    [186, 216],
    [192, 214],
    [214, 187],
    [187, 192],
    [139, 34],
    [34, 156],
    [156, 139],
    [218, 79],
    [79, 237],
    [237, 218],
    [147, 123],
    [123, 177],
    [177, 147],
    [45, 44],
    [44, 4],
    [4, 45],
    [208, 201],
    [201, 32],
    [32, 208],
    [98, 64],
    [64, 129],
    [129, 98],
    [192, 213],
    [213, 138],
    [138, 192],
    [235, 59],
    [59, 219],
    [219, 235],
    [141, 242],
    [242, 97],
    [97, 141],
    [97, 2],
    [2, 141],
    [141, 97],
    [240, 75],
    [75, 235],
    [235, 240],
    [229, 24],
    [24, 228],
    [228, 229],
    [31, 25],
    [25, 226],
    [226, 31],
    [230, 23],
    [23, 229],
    [229, 230],
    [231, 22],
    [22, 230],
    [230, 231],
    [232, 26],
    [26, 231],
    [231, 232],
    [233, 112],
    [112, 232],
    [232, 233],
    [244, 189],
    [189, 243],
    [243, 244],
    [189, 221],
    [221, 190],
    [190, 189],
    [222, 28],
    [28, 221],
    [221, 222],
    [223, 27],
    [27, 222],
    [222, 223],
    [224, 29],
    [29, 223],
    [223, 224],
    [225, 30],
    [30, 224],
    [224, 225],
    [113, 247],
    [247, 225],
    [225, 113],
    [99, 60],
    [60, 240],
    [240, 99],
    [213, 147],
    [147, 215],
    [215, 213],
    [60, 20],
    [20, 166],
    [166, 60],
    [192, 187],
    [187, 213],
    [213, 192],
    [243, 112],
    [112, 244],
    [244, 243],
    [244, 233],
    [233, 245],
    [245, 244],
    [245, 128],
    [128, 188],
    [188, 245],
    [188, 114],
    [114, 174],
    [174, 188],
    [134, 131],
    [131, 220],
    [220, 134],
    [174, 217],
    [217, 236],
    [236, 174],
    [236, 198],
    [198, 134],
    [134, 236],
    [215, 177],
    [177, 58],
    [58, 215],
    [156, 143],
    [143, 124],
    [124, 156],
    [25, 110],
    [110, 7],
    [7, 25],
    [31, 228],
    [228, 25],
    [25, 31],
    [264, 356],
    [356, 368],
    [368, 264],
    [0, 11],
    [11, 267],
    [267, 0],
    [451, 452],
    [452, 349],
    [349, 451],
    [267, 302],
    [302, 269],
    [269, 267],
    [350, 357],
    [357, 277],
    [277, 350],
    [350, 452],
    [452, 357],
    [357, 350],
    [299, 333],
    [333, 297],
    [297, 299],
    [396, 175],
    [175, 377],
    [377, 396],
    [280, 347],
    [347, 330],
    [330, 280],
    [269, 303],
    [303, 270],
    [270, 269],
    [151, 9],
    [9, 337],
    [337, 151],
    [344, 278],
    [278, 360],
    [360, 344],
    [424, 418],
    [418, 431],
    [431, 424],
    [270, 304],
    [304, 409],
    [409, 270],
    [272, 310],
    [310, 407],
    [407, 272],
    [322, 270],
    [270, 410],
    [410, 322],
    [449, 450],
    [450, 347],
    [347, 449],
    [432, 422],
    [422, 434],
    [434, 432],
    [18, 313],
    [313, 17],
    [17, 18],
    [291, 306],
    [306, 375],
    [375, 291],
    [259, 387],
    [387, 260],
    [260, 259],
    [424, 335],
    [335, 418],
    [418, 424],
    [434, 364],
    [364, 416],
    [416, 434],
    [391, 423],
    [423, 327],
    [327, 391],
    [301, 251],
    [251, 298],
    [298, 301],
    [275, 281],
    [281, 4],
    [4, 275],
    [254, 373],
    [373, 253],
    [253, 254],
    [375, 307],
    [307, 321],
    [321, 375],
    [280, 425],
    [425, 411],
    [411, 280],
    [200, 421],
    [421, 18],
    [18, 200],
    [335, 321],
    [321, 406],
    [406, 335],
    [321, 320],
    [320, 405],
    [405, 321],
    [314, 315],
    [315, 17],
    [17, 314],
    [423, 426],
    [426, 266],
    [266, 423],
    [396, 377],
    [377, 369],
    [369, 396],
    [270, 322],
    [322, 269],
    [269, 270],
    [413, 417],
    [417, 464],
    [464, 413],
    [385, 386],
    [386, 258],
    [258, 385],
    [248, 456],
    [456, 419],
    [419, 248],
    [298, 284],
    [284, 333],
    [333, 298],
    [168, 417],
    [417, 8],
    [8, 168],
    [448, 346],
    [346, 261],
    [261, 448],
    [417, 413],
    [413, 285],
    [285, 417],
    [326, 327],
    [327, 328],
    [328, 326],
    [277, 355],
    [355, 329],
    [329, 277],
    [309, 392],
    [392, 438],
    [438, 309],
    [381, 382],
    [382, 256],
    [256, 381],
    [279, 429],
    [429, 360],
    [360, 279],
    [365, 364],
    [364, 379],
    [379, 365],
    [355, 277],
    [277, 437],
    [437, 355],
    [282, 443],
    [443, 283],
    [283, 282],
    [281, 275],
    [275, 363],
    [363, 281],
    [395, 431],
    [431, 369],
    [369, 395],
    [299, 297],
    [297, 337],
    [337, 299],
    [335, 273],
    [273, 321],
    [321, 335],
    [348, 450],
    [450, 349],
    [349, 348],
    [359, 446],
    [446, 467],
    [467, 359],
    [283, 293],
    [293, 282],
    [282, 283],
    [250, 458],
    [458, 462],
    [462, 250],
    [300, 276],
    [276, 383],
    [383, 300],
    [292, 308],
    [308, 325],
    [325, 292],
    [283, 276],
    [276, 293],
    [293, 283],
    [264, 372],
    [372, 447],
    [447, 264],
    [346, 352],
    [352, 340],
    [340, 346],
    [354, 274],
    [274, 19],
    [19, 354],
    [363, 456],
    [456, 281],
    [281, 363],
    [426, 436],
    [436, 425],
    [425, 426],
    [380, 381],
    [381, 252],
    [252, 380],
    [267, 269],
    [269, 393],
    [393, 267],
    [421, 200],
    [200, 428],
    [428, 421],
    [371, 266],
    [266, 329],
    [329, 371],
    [432, 287],
    [287, 422],
    [422, 432],
    [290, 250],
    [250, 328],
    [328, 290],
    [385, 258],
    [258, 384],
    [384, 385],
    [446, 265],
    [265, 342],
    [342, 446],
    [386, 387],
    [387, 257],
    [257, 386],
    [422, 424],
    [424, 430],
    [430, 422],
    [445, 342],
    [342, 276],
    [276, 445],
    [422, 273],
    [273, 424],
    [424, 422],
    [306, 292],
    [292, 307],
    [307, 306],
    [352, 366],
    [366, 345],
    [345, 352],
    [268, 271],
    [271, 302],
    [302, 268],
    [358, 423],
    [423, 371],
    [371, 358],
    [327, 294],
    [294, 460],
    [460, 327],
    [331, 279],
    [279, 294],
    [294, 331],
    [303, 271],
    [271, 304],
    [304, 303],
    [436, 432],
    [432, 427],
    [427, 436],
    [304, 272],
    [272, 408],
    [408, 304],
    [395, 394],
    [394, 431],
    [431, 395],
    [378, 395],
    [395, 400],
    [400, 378],
    [296, 334],
    [334, 299],
    [299, 296],
    [6, 351],
    [351, 168],
    [168, 6],
    [376, 352],
    [352, 411],
    [411, 376],
    [307, 325],
    [325, 320],
    [320, 307],
    [285, 295],
    [295, 336],
    [336, 285],
    [320, 319],
    [319, 404],
    [404, 320],
    [329, 330],
    [330, 349],
    [349, 329],
    [334, 293],
    [293, 333],
    [333, 334],
    [366, 323],
    [323, 447],
    [447, 366],
    [316, 15],
    [15, 315],
    [315, 316],
    [331, 358],
    [358, 279],
    [279, 331],
    [317, 14],
    [14, 316],
    [316, 317],
    [8, 285],
    [285, 9],
    [9, 8],
    [277, 329],
    [329, 350],
    [350, 277],
    [253, 374],
    [374, 252],
    [252, 253],
    [319, 318],
    [318, 403],
    [403, 319],
    [351, 6],
    [6, 419],
    [419, 351],
    [324, 318],
    [318, 325],
    [325, 324],
    [397, 367],
    [367, 365],
    [365, 397],
    [288, 435],
    [435, 397],
    [397, 288],
    [278, 344],
    [344, 439],
    [439, 278],
    [310, 272],
    [272, 311],
    [311, 310],
    [248, 195],
    [195, 281],
    [281, 248],
    [375, 273],
    [273, 291],
    [291, 375],
    [175, 396],
    [396, 199],
    [199, 175],
    [312, 311],
    [311, 268],
    [268, 312],
    [276, 283],
    [283, 445],
    [445, 276],
    [390, 373],
    [373, 339],
    [339, 390],
    [295, 282],
    [282, 296],
    [296, 295],
    [448, 449],
    [449, 346],
    [346, 448],
    [356, 264],
    [264, 454],
    [454, 356],
    [337, 336],
    [336, 299],
    [299, 337],
    [337, 338],
    [338, 151],
    [151, 337],
    [294, 278],
    [278, 455],
    [455, 294],
    [308, 292],
    [292, 415],
    [415, 308],
    [429, 358],
    [358, 355],
    [355, 429],
    [265, 340],
    [340, 372],
    [372, 265],
    [352, 346],
    [346, 280],
    [280, 352],
    [295, 442],
    [442, 282],
    [282, 295],
    [354, 19],
    [19, 370],
    [370, 354],
    [285, 441],
    [441, 295],
    [295, 285],
    [195, 248],
    [248, 197],
    [197, 195],
    [457, 440],
    [440, 274],
    [274, 457],
    [301, 300],
    [300, 368],
    [368, 301],
    [417, 351],
    [351, 465],
    [465, 417],
    [251, 301],
    [301, 389],
    [389, 251],
    [394, 395],
    [395, 379],
    [379, 394],
    [399, 412],
    [412, 419],
    [419, 399],
    [410, 436],
    [436, 322],
    [322, 410],
    [326, 2],
    [2, 393],
    [393, 326],
    [354, 370],
    [370, 461],
    [461, 354],
    [393, 164],
    [164, 267],
    [267, 393],
    [268, 302],
    [302, 12],
    [12, 268],
    [312, 268],
    [268, 13],
    [13, 312],
    [298, 293],
    [293, 301],
    [301, 298],
    [265, 446],
    [446, 340],
    [340, 265],
    [280, 330],
    [330, 425],
    [425, 280],
    [322, 426],
    [426, 391],
    [391, 322],
    [420, 429],
    [429, 437],
    [437, 420],
    [393, 391],
    [391, 326],
    [326, 393],
    [344, 440],
    [440, 438],
    [438, 344],
    [458, 459],
    [459, 461],
    [461, 458],
    [364, 434],
    [434, 394],
    [394, 364],
    [428, 396],
    [396, 262],
    [262, 428],
    [274, 354],
    [354, 457],
    [457, 274],
    [317, 316],
    [316, 402],
    [402, 317],
    [316, 315],
    [315, 403],
    [403, 316],
    [315, 314],
    [314, 404],
    [404, 315],
    [314, 313],
    [313, 405],
    [405, 314],
    [313, 421],
    [421, 406],
    [406, 313],
    [323, 366],
    [366, 361],
    [361, 323],
    [292, 306],
    [306, 407],
    [407, 292],
    [306, 291],
    [291, 408],
    [408, 306],
    [291, 287],
    [287, 409],
    [409, 291],
    [287, 432],
    [432, 410],
    [410, 287],
    [427, 434],
    [434, 411],
    [411, 427],
    [372, 264],
    [264, 383],
    [383, 372],
    [459, 309],
    [309, 457],
    [457, 459],
    [366, 352],
    [352, 401],
    [401, 366],
    [1, 274],
    [274, 4],
    [4, 1],
    [418, 421],
    [421, 262],
    [262, 418],
    [331, 294],
    [294, 358],
    [358, 331],
    [435, 433],
    [433, 367],
    [367, 435],
    [392, 289],
    [289, 439],
    [439, 392],
    [328, 462],
    [462, 326],
    [326, 328],
    [94, 2],
    [2, 370],
    [370, 94],
    [289, 305],
    [305, 455],
    [455, 289],
    [339, 254],
    [254, 448],
    [448, 339],
    [359, 255],
    [255, 446],
    [446, 359],
    [254, 253],
    [253, 449],
    [449, 254],
    [253, 252],
    [252, 450],
    [450, 253],
    [252, 256],
    [256, 451],
    [451, 252],
    [256, 341],
    [341, 452],
    [452, 256],
    [414, 413],
    [413, 463],
    [463, 414],
    [286, 441],
    [441, 414],
    [414, 286],
    [286, 258],
    [258, 441],
    [441, 286],
    [258, 257],
    [257, 442],
    [442, 258],
    [257, 259],
    [259, 443],
    [443, 257],
    [259, 260],
    [260, 444],
    [444, 259],
    [260, 467],
    [467, 445],
    [445, 260],
    [309, 459],
    [459, 250],
    [250, 309],
    [305, 289],
    [289, 290],
    [290, 305],
    [305, 290],
    [290, 460],
    [460, 305],
    [401, 376],
    [376, 435],
    [435, 401],
    [309, 250],
    [250, 392],
    [392, 309],
    [376, 411],
    [411, 433],
    [433, 376],
    [453, 341],
    [341, 464],
    [464, 453],
    [357, 453],
    [453, 465],
    [465, 357],
    [343, 357],
    [357, 412],
    [412, 343],
    [437, 343],
    [343, 399],
    [399, 437],
    [344, 360],
    [360, 440],
    [440, 344],
    [420, 437],
    [437, 456],
    [456, 420],
    [360, 420],
    [420, 363],
    [363, 360],
    [361, 401],
    [401, 288],
    [288, 361],
    [265, 372],
    [372, 353],
    [353, 265],
    [390, 339],
    [339, 249],
    [249, 390],
    [339, 448],
    [448, 255],
    [255, 339],
  );
function wc(t) {
  t.j = {
    faceLandmarks: [],
    faceBlendshapes: [],
    facialTransformationMatrixes: [],
  };
}
var et = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !1),
      (this.j = {
        faceLandmarks: [],
        faceBlendshapes: [],
        facialTransformationMatrixes: [],
      }),
      (this.outputFacialTransformationMatrixes = this.outputFaceBlendshapes =
        !1),
      x((t = this.h = new ku()), 0, 1, (e = new tt())),
      (this.v = new vu()),
      x(this.h, 0, 3, this.v),
      (this.s = new Gs()),
      x(this.h, 0, 2, this.s),
      Se(this.s, 4, 1),
      v(this.s, 2, 0.5),
      v(this.v, 2, 0.5),
      v(this.h, 4, 0.5));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      "numFaces" in t && Se(this.s, 4, t.numFaces ?? 1),
      "minFaceDetectionConfidence" in t &&
        v(this.s, 2, t.minFaceDetectionConfidence ?? 0.5),
      "minTrackingConfidence" in t &&
        v(this.h, 4, t.minTrackingConfidence ?? 0.5),
      "minFacePresenceConfidence" in t &&
        v(this.v, 2, t.minFacePresenceConfidence ?? 0.5),
      "outputFaceBlendshapes" in t &&
        (this.outputFaceBlendshapes = !!t.outputFaceBlendshapes),
      "outputFacialTransformationMatrixes" in t &&
        (this.outputFacialTransformationMatrixes =
          !!t.outputFacialTransformationMatrixes),
      this.l(t)
    );
  }
  D(t, e) {
    return (wc(this), ie(this, t, e), this.j);
  }
  F(t, e, n) {
    return (wc(this), Te(this, t, n, e), this.j);
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "norm_rect"), U(t, "face_landmarks"));
    const e = new Ht();
    pe(e, Dh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "NORM_LANDMARKS:face_landmarks"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoVectorListener("face_landmarks", (r, s) => {
        for (const o of r) ((r = Nr(o)), this.j.faceLandmarks.push(Hs(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("face_landmarks", (r) => {
        w(this, r);
      }),
      this.outputFaceBlendshapes &&
        (U(t, "blendshapes"),
        O(n, "BLENDSHAPES:blendshapes"),
        this.g.attachProtoVectorListener("blendshapes", (r, s) => {
          if (this.outputFaceBlendshapes)
            for (const o of r)
              ((r = Bs(o)), this.j.faceBlendshapes.push(Xi(r.g() ?? [])));
          w(this, s);
        }),
        this.g.attachEmptyPacketListener("blendshapes", (r) => {
          w(this, r);
        })),
      this.outputFacialTransformationMatrixes &&
        (U(t, "face_geometry"),
        O(n, "FACE_GEOMETRY:face_geometry"),
        this.g.attachProtoVectorListener("face_geometry", (r, s) => {
          if (this.outputFacialTransformationMatrixes)
            for (const o of r)
              (r = F(Nh(o), Lh, 2)) &&
                this.j.facialTransformationMatrixes.push({
                  rows: Jt(r, 1) ?? 0 ?? 0,
                  columns: Jt(r, 2) ?? 0 ?? 0,
                  data: un(r, 3, Qe, ln()).slice() ?? [],
                });
          w(this, s);
        }),
        this.g.attachEmptyPacketListener("face_geometry", (r) => {
          w(this, r);
        })),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((et.prototype.detectForVideo = et.prototype.F),
  (et.prototype.detect = et.prototype.D),
  (et.prototype.setOptions = et.prototype.o),
  (et.createFromModelPath = function (t, e) {
    return I(et, t, { baseOptions: { modelAssetPath: e } });
  }),
  (et.createFromModelBuffer = function (t, e) {
    return I(et, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (et.createFromOptions = function (t, e) {
    return I(et, t, e);
  }),
  (et.FACE_LANDMARKS_LIPS = na),
  (et.FACE_LANDMARKS_LEFT_EYE = ra),
  (et.FACE_LANDMARKS_LEFT_EYEBROW = sa),
  (et.FACE_LANDMARKS_LEFT_IRIS = Xu),
  (et.FACE_LANDMARKS_RIGHT_EYE = oa),
  (et.FACE_LANDMARKS_RIGHT_EYEBROW = ia),
  (et.FACE_LANDMARKS_RIGHT_IRIS = Ju),
  (et.FACE_LANDMARKS_FACE_OVAL = aa),
  (et.FACE_LANDMARKS_CONTOURS = Zu),
  (et.FACE_LANDMARKS_TESSELATION = Qu));
var Ee = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !0),
      x((t = this.j = new xu()), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.j, tt, 1);
  }
  set baseOptions(t) {
    x(this.j, 0, 1, t);
  }
  o(t) {
    return super.l(t);
  }
  Oa(t, e, n) {
    const r = typeof e != "function" ? e : {};
    if (
      ((this.h = typeof e == "function" ? e : n), ie(this, t, r ?? {}), !this.h)
    )
      return this.s;
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "norm_rect"), U(t, "stylized_image"));
    const e = new Ht();
    pe(e, Uh, this.j);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.face_stylizer.FaceStylizerGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "STYLIZED_IMAGE:stylized_image"),
      n.o(e),
      Vt(t, n),
      this.g.U("stylized_image", (r, s) => {
        var o = !this.h,
          i = r.data,
          a = r.width;
        const c = a * (r = r.height);
        if (i instanceof Uint8Array)
          if (i.length === 3 * c) {
            const l = new Uint8ClampedArray(4 * c);
            for (let u = 0; u < c; ++u)
              ((l[4 * u] = i[3 * u]),
                (l[4 * u + 1] = i[3 * u + 1]),
                (l[4 * u + 2] = i[3 * u + 2]),
                (l[4 * u + 3] = 255));
            i = new ImageData(l, a, r);
          } else {
            if (i.length !== 4 * c)
              throw Error("Unsupported channel count: " + i.length / c);
            i = new ImageData(
              new Uint8ClampedArray(i.buffer, i.byteOffset, i.length),
              a,
              r,
            );
          }
        else if (!(i instanceof WebGLTexture))
          throw Error(`Unsupported format: ${i.constructor.name}`);
        ((a = new yt([i], !1, !1, this.g.i.canvas, this.O, a, r)),
          (this.s = o = o ? a.clone() : a),
          this.h && this.h(o),
          w(this, s));
      }),
      this.g.attachEmptyPacketListener("stylized_image", (r) => {
        ((this.s = null), this.h && this.h(null), w(this, r));
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Ee.prototype.stylize = Ee.prototype.Oa),
  (Ee.prototype.setOptions = Ee.prototype.o),
  (Ee.createFromModelPath = function (t, e) {
    return I(Ee, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Ee.createFromModelBuffer = function (t, e) {
    return I(Ee, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Ee.createFromOptions = function (t, e) {
    return I(Ee, t, e);
  }));
var ca = ye(
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
);
function bc(t) {
  ((t.gestures = []),
    (t.landmarks = []),
    (t.worldLandmarks = []),
    (t.handedness = []));
}
function Ec(t) {
  return t.gestures.length === 0
    ? {
        gestures: [],
        landmarks: [],
        worldLandmarks: [],
        handedness: [],
        handednesses: [],
      }
    : {
        gestures: t.gestures,
        landmarks: t.landmarks,
        worldLandmarks: t.worldLandmarks,
        handedness: t.handedness,
        handednesses: t.handedness,
      };
}
function vc(t, e = !0) {
  const n = [];
  for (const s of t) {
    var r = Bs(s);
    t = [];
    for (const o of r.g())
      ((r = e && Jt(o, 1) != null ? (Jt(o, 1) ?? 0) : -1),
        t.push({
          score: at(o, 2) ?? 0,
          index: r,
          categoryName: re(o, 3) ?? "" ?? "",
          displayName: re(o, 4) ?? "" ?? "",
        }));
    n.push(t);
  }
  return n;
}
var Ft = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !1),
      (this.gestures = []),
      (this.landmarks = []),
      (this.worldLandmarks = []),
      (this.handedness = []),
      x((t = this.j = new Su()), 0, 1, (e = new tt())),
      (this.s = new Yi()),
      x(this.j, 0, 2, this.s),
      (this.C = new $i()),
      x(this.s, 0, 3, this.C),
      (this.v = new Lu()),
      x(this.s, 0, 2, this.v),
      (this.h = new Bh()),
      x(this.j, 0, 3, this.h),
      v(this.v, 2, 0.5),
      v(this.s, 4, 0.5),
      v(this.C, 2, 0.5));
  }
  get baseOptions() {
    return F(this.j, tt, 1);
  }
  set baseOptions(t) {
    x(this.j, 0, 1, t);
  }
  o(t) {
    var s, o, i, a;
    if (
      (Se(this.v, 3, t.numHands ?? 1),
      "minHandDetectionConfidence" in t &&
        v(this.v, 2, t.minHandDetectionConfidence ?? 0.5),
      "minTrackingConfidence" in t &&
        v(this.s, 4, t.minTrackingConfidence ?? 0.5),
      "minHandPresenceConfidence" in t &&
        v(this.C, 2, t.minHandPresenceConfidence ?? 0.5),
      t.cannedGesturesClassifierOptions)
    ) {
      var e = new Mn(),
        n = e,
        r = No(
          t.cannedGesturesClassifierOptions,
          (s = F(this.h, Mn, 3)) == null ? void 0 : s.h(),
        );
      (x(n, 0, 2, r), x(this.h, 0, 3, e));
    } else
      t.cannedGesturesClassifierOptions === void 0 &&
        ((o = F(this.h, Mn, 3)) == null || o.g());
    return (
      t.customGesturesClassifierOptions
        ? (x(
            (n = e = new Mn()),
            0,
            2,
            (r = No(
              t.customGesturesClassifierOptions,
              (i = F(this.h, Mn, 4)) == null ? void 0 : i.h(),
            )),
          ),
          x(this.h, 0, 4, e))
        : t.customGesturesClassifierOptions === void 0 &&
          ((a = F(this.h, Mn, 4)) == null || a.g()),
      this.l(t)
    );
  }
  Ja(t, e) {
    return (bc(this), ie(this, t, e), Ec(this));
  }
  Ka(t, e, n) {
    return (bc(this), Te(this, t, n, e), Ec(this));
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"),
      J(t, "norm_rect"),
      U(t, "hand_gestures"),
      U(t, "hand_landmarks"),
      U(t, "world_hand_landmarks"),
      U(t, "handedness"));
    const e = new Ht();
    pe(e, Gh, this.j);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "HAND_GESTURES:hand_gestures"),
      O(n, "LANDMARKS:hand_landmarks"),
      O(n, "WORLD_LANDMARKS:world_hand_landmarks"),
      O(n, "HANDEDNESS:handedness"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoVectorListener("hand_landmarks", (r, s) => {
        for (const o of r) {
          r = Nr(o);
          const i = [];
          for (const a of Ge(r, yu, 1))
            i.push({
              x: at(a, 1) ?? 0,
              y: at(a, 2) ?? 0,
              z: at(a, 3) ?? 0,
              visibility: at(a, 4) ?? 0,
            });
          this.landmarks.push(i);
        }
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("hand_landmarks", (r) => {
        w(this, r);
      }),
      this.g.attachProtoVectorListener("world_hand_landmarks", (r, s) => {
        for (const o of r) {
          r = Dn(o);
          const i = [];
          for (const a of Ge(r, gu, 1))
            i.push({
              x: at(a, 1) ?? 0,
              y: at(a, 2) ?? 0,
              z: at(a, 3) ?? 0,
              visibility: at(a, 4) ?? 0,
            });
          this.worldLandmarks.push(i);
        }
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("world_hand_landmarks", (r) => {
        w(this, r);
      }),
      this.g.attachProtoVectorListener("hand_gestures", (r, s) => {
        (this.gestures.push(...vc(r, !1)), w(this, s));
      }),
      this.g.attachEmptyPacketListener("hand_gestures", (r) => {
        w(this, r);
      }),
      this.g.attachProtoVectorListener("handedness", (r, s) => {
        (this.handedness.push(...vc(r)), w(this, s));
      }),
      this.g.attachEmptyPacketListener("handedness", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
function kc(t) {
  return {
    landmarks: t.landmarks,
    worldLandmarks: t.worldLandmarks,
    handednesses: t.handedness,
    handedness: t.handedness,
  };
}
((Ft.prototype.recognizeForVideo = Ft.prototype.Ka),
  (Ft.prototype.recognize = Ft.prototype.Ja),
  (Ft.prototype.setOptions = Ft.prototype.o),
  (Ft.createFromModelPath = function (t, e) {
    return I(Ft, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Ft.createFromModelBuffer = function (t, e) {
    return I(Ft, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Ft.createFromOptions = function (t, e) {
    return I(Ft, t, e);
  }),
  (Ft.HAND_CONNECTIONS = ca));
var Nt = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !1),
      (this.landmarks = []),
      (this.worldLandmarks = []),
      (this.handedness = []),
      x((t = this.h = new Yi()), 0, 1, (e = new tt())),
      (this.s = new $i()),
      x(this.h, 0, 3, this.s),
      (this.j = new Lu()),
      x(this.h, 0, 2, this.j),
      Se(this.j, 3, 1),
      v(this.j, 2, 0.5),
      v(this.s, 2, 0.5),
      v(this.h, 4, 0.5));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      "numHands" in t && Se(this.j, 3, t.numHands ?? 1),
      "minHandDetectionConfidence" in t &&
        v(this.j, 2, t.minHandDetectionConfidence ?? 0.5),
      "minTrackingConfidence" in t &&
        v(this.h, 4, t.minTrackingConfidence ?? 0.5),
      "minHandPresenceConfidence" in t &&
        v(this.s, 2, t.minHandPresenceConfidence ?? 0.5),
      this.l(t)
    );
  }
  D(t, e) {
    return (
      (this.landmarks = []),
      (this.worldLandmarks = []),
      (this.handedness = []),
      ie(this, t, e),
      kc(this)
    );
  }
  F(t, e, n) {
    return (
      (this.landmarks = []),
      (this.worldLandmarks = []),
      (this.handedness = []),
      Te(this, t, n, e),
      kc(this)
    );
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"),
      J(t, "norm_rect"),
      U(t, "hand_landmarks"),
      U(t, "world_hand_landmarks"),
      U(t, "handedness"));
    const e = new Ht();
    pe(e, Hh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "LANDMARKS:hand_landmarks"),
      O(n, "WORLD_LANDMARKS:world_hand_landmarks"),
      O(n, "HANDEDNESS:handedness"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoVectorListener("hand_landmarks", (r, s) => {
        for (const o of r) ((r = Nr(o)), this.landmarks.push(Hs(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("hand_landmarks", (r) => {
        w(this, r);
      }),
      this.g.attachProtoVectorListener("world_hand_landmarks", (r, s) => {
        for (const o of r) ((r = Dn(o)), this.worldLandmarks.push(vr(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("world_hand_landmarks", (r) => {
        w(this, r);
      }),
      this.g.attachProtoVectorListener("handedness", (r, s) => {
        var o = this.handedness,
          i = o.push;
        const a = [];
        for (const c of r) {
          r = Bs(c);
          const l = [];
          for (const u of r.g())
            l.push({
              score: at(u, 2) ?? 0,
              index: Jt(u, 1) ?? 0 ?? -1,
              categoryName: re(u, 3) ?? "" ?? "",
              displayName: re(u, 4) ?? "" ?? "",
            });
          a.push(l);
        }
        (i.call(o, ...a), w(this, s));
      }),
      this.g.attachEmptyPacketListener("handedness", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Nt.prototype.detectForVideo = Nt.prototype.F),
  (Nt.prototype.detect = Nt.prototype.D),
  (Nt.prototype.setOptions = Nt.prototype.o),
  (Nt.createFromModelPath = function (t, e) {
    return I(Nt, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Nt.createFromModelBuffer = function (t, e) {
    return I(Nt, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Nt.createFromOptions = function (t, e) {
    return I(Nt, t, e);
  }),
  (Nt.HAND_CONNECTIONS = ca));
var t1 = ye(
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
  [11, 12],
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [17, 19],
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [18, 20],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [29, 31],
  [30, 32],
  [27, 31],
  [28, 32],
);
function Ac(t) {
  t.h = {
    faceLandmarks: [],
    faceBlendshapes: [],
    poseLandmarks: [],
    poseWorldLandmarks: [],
    poseSegmentationMasks: [],
    leftHandLandmarks: [],
    leftHandWorldLandmarks: [],
    rightHandLandmarks: [],
    rightHandWorldLandmarks: [],
  };
}
function xc(t) {
  try {
    if (!t.C) return t.h;
    t.C(t.h);
  } finally {
    js(t);
  }
}
function $r(t, e) {
  ((t = Nr(t)), e.push(Hs(t)));
}
var Z = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "input_frames_image", null, !1),
      (this.h = {
        faceLandmarks: [],
        faceBlendshapes: [],
        poseLandmarks: [],
        poseWorldLandmarks: [],
        poseSegmentationMasks: [],
        leftHandLandmarks: [],
        leftHandWorldLandmarks: [],
        rightHandLandmarks: [],
        rightHandWorldLandmarks: [],
      }),
      (this.outputPoseSegmentationMasks = this.outputFaceBlendshapes = !1),
      x((t = this.j = new Pu()), 0, 1, (e = new tt())),
      (this.J = new $i()),
      x(this.j, 0, 2, this.J),
      (this.Z = new Wh()),
      x(this.j, 0, 3, this.Z),
      (this.s = new Gs()),
      x(this.j, 0, 4, this.s),
      (this.H = new vu()),
      x(this.j, 0, 5, this.H),
      (this.v = new Iu()),
      x(this.j, 0, 6, this.v),
      (this.K = new Ou()),
      x(this.j, 0, 7, this.K),
      v(this.s, 2, 0.5),
      v(this.s, 3, 0.3),
      v(this.H, 2, 0.5),
      v(this.v, 2, 0.5),
      v(this.v, 3, 0.3),
      v(this.K, 2, 0.5),
      v(this.J, 2, 0.5));
  }
  get baseOptions() {
    return F(this.j, tt, 1);
  }
  set baseOptions(t) {
    x(this.j, 0, 1, t);
  }
  o(t) {
    return (
      "minFaceDetectionConfidence" in t &&
        v(this.s, 2, t.minFaceDetectionConfidence ?? 0.5),
      "minFaceSuppressionThreshold" in t &&
        v(this.s, 3, t.minFaceSuppressionThreshold ?? 0.3),
      "minFacePresenceConfidence" in t &&
        v(this.H, 2, t.minFacePresenceConfidence ?? 0.5),
      "outputFaceBlendshapes" in t &&
        (this.outputFaceBlendshapes = !!t.outputFaceBlendshapes),
      "minPoseDetectionConfidence" in t &&
        v(this.v, 2, t.minPoseDetectionConfidence ?? 0.5),
      "minPoseSuppressionThreshold" in t &&
        v(this.v, 3, t.minPoseSuppressionThreshold ?? 0.3),
      "minPosePresenceConfidence" in t &&
        v(this.K, 2, t.minPosePresenceConfidence ?? 0.5),
      "outputPoseSegmentationMasks" in t &&
        (this.outputPoseSegmentationMasks = !!t.outputPoseSegmentationMasks),
      "minHandLandmarksConfidence" in t &&
        v(this.J, 2, t.minHandLandmarksConfidence ?? 0.5),
      this.l(t)
    );
  }
  D(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return (
      (this.C = typeof e == "function" ? e : n),
      Ac(this),
      ie(this, t, r),
      xc(this)
    );
  }
  F(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return (
      (this.C = typeof n == "function" ? n : r),
      Ac(this),
      Te(this, t, s, e),
      xc(this)
    );
  }
  m() {
    var t = new Ct();
    (J(t, "input_frames_image"),
      U(t, "pose_landmarks"),
      U(t, "pose_world_landmarks"),
      U(t, "face_landmarks"),
      U(t, "left_hand_landmarks"),
      U(t, "left_hand_world_landmarks"),
      U(t, "right_hand_landmarks"),
      U(t, "right_hand_world_landmarks"));
    const e = new Ht(),
      n = new za();
    (Ro(
      n,
      1,
      tr(
        "type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions",
      ),
      "",
    ),
      (function (s, o) {
        if (o != null)
          if (Array.isArray(o)) Y(s, 2, Ll(o));
          else {
            if (!(typeof o == "string" || o instanceof Ne || Or(o)))
              throw Error(
                "invalid value in Any.value field: " +
                  o +
                  " expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array",
              );
            Ro(s, 2, li(o, !1), gn());
          }
      })(n, this.j.g()));
    const r = new kt();
    (jt(
      r,
      "mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph",
    ),
      us(r, 8, za, n),
      z(r, "IMAGE:input_frames_image"),
      O(r, "POSE_LANDMARKS:pose_landmarks"),
      O(r, "POSE_WORLD_LANDMARKS:pose_world_landmarks"),
      O(r, "FACE_LANDMARKS:face_landmarks"),
      O(r, "LEFT_HAND_LANDMARKS:left_hand_landmarks"),
      O(r, "LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"),
      O(r, "RIGHT_HAND_LANDMARKS:right_hand_landmarks"),
      O(r, "RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"),
      r.o(e),
      Vt(t, r),
      Ws(this, t),
      this.g.attachProtoListener("pose_landmarks", (s, o) => {
        ($r(s, this.h.poseLandmarks), w(this, o));
      }),
      this.g.attachEmptyPacketListener("pose_landmarks", (s) => {
        w(this, s);
      }),
      this.g.attachProtoListener("pose_world_landmarks", (s, o) => {
        var i = this.h.poseWorldLandmarks;
        ((s = Dn(s)), i.push(vr(s)), w(this, o));
      }),
      this.g.attachEmptyPacketListener("pose_world_landmarks", (s) => {
        w(this, s);
      }),
      this.outputPoseSegmentationMasks &&
        (O(r, "POSE_SEGMENTATION_MASK:pose_segmentation_mask"),
        Yn(this, "pose_segmentation_mask"),
        this.g.U("pose_segmentation_mask", (s, o) => {
          ((this.h.poseSegmentationMasks = [Kn(this, s, !0, !this.C)]),
            w(this, o));
        }),
        this.g.attachEmptyPacketListener("pose_segmentation_mask", (s) => {
          ((this.h.poseSegmentationMasks = []), w(this, s));
        })),
      this.g.attachProtoListener("face_landmarks", (s, o) => {
        ($r(s, this.h.faceLandmarks), w(this, o));
      }),
      this.g.attachEmptyPacketListener("face_landmarks", (s) => {
        w(this, s);
      }),
      this.outputFaceBlendshapes &&
        (U(t, "extra_blendshapes"),
        O(r, "FACE_BLENDSHAPES:extra_blendshapes"),
        this.g.attachProtoListener("extra_blendshapes", (s, o) => {
          var i = this.h.faceBlendshapes;
          (this.outputFaceBlendshapes && ((s = Bs(s)), i.push(Xi(s.g() ?? []))),
            w(this, o));
        }),
        this.g.attachEmptyPacketListener("extra_blendshapes", (s) => {
          w(this, s);
        })),
      this.g.attachProtoListener("left_hand_landmarks", (s, o) => {
        ($r(s, this.h.leftHandLandmarks), w(this, o));
      }),
      this.g.attachEmptyPacketListener("left_hand_landmarks", (s) => {
        w(this, s);
      }),
      this.g.attachProtoListener("left_hand_world_landmarks", (s, o) => {
        var i = this.h.leftHandWorldLandmarks;
        ((s = Dn(s)), i.push(vr(s)), w(this, o));
      }),
      this.g.attachEmptyPacketListener("left_hand_world_landmarks", (s) => {
        w(this, s);
      }),
      this.g.attachProtoListener("right_hand_landmarks", (s, o) => {
        ($r(s, this.h.rightHandLandmarks), w(this, o));
      }),
      this.g.attachEmptyPacketListener("right_hand_landmarks", (s) => {
        w(this, s);
      }),
      this.g.attachProtoListener("right_hand_world_landmarks", (s, o) => {
        var i = this.h.rightHandWorldLandmarks;
        ((s = Dn(s)), i.push(vr(s)), w(this, o));
      }),
      this.g.attachEmptyPacketListener("right_hand_world_landmarks", (s) => {
        w(this, s);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Z.prototype.detectForVideo = Z.prototype.F),
  (Z.prototype.detect = Z.prototype.D),
  (Z.prototype.setOptions = Z.prototype.o),
  (Z.createFromModelPath = function (t, e) {
    return I(Z, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Z.createFromModelBuffer = function (t, e) {
    return I(Z, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Z.createFromOptions = function (t, e) {
    return I(Z, t, e);
  }),
  (Z.HAND_CONNECTIONS = ca),
  (Z.POSE_CONNECTIONS = t1),
  (Z.FACE_LANDMARKS_LIPS = na),
  (Z.FACE_LANDMARKS_LEFT_EYE = ra),
  (Z.FACE_LANDMARKS_LEFT_EYEBROW = sa),
  (Z.FACE_LANDMARKS_LEFT_IRIS = Xu),
  (Z.FACE_LANDMARKS_RIGHT_EYE = oa),
  (Z.FACE_LANDMARKS_RIGHT_EYEBROW = ia),
  (Z.FACE_LANDMARKS_RIGHT_IRIS = Ju),
  (Z.FACE_LANDMARKS_FACE_OVAL = aa),
  (Z.FACE_LANDMARKS_CONTOURS = Zu),
  (Z.FACE_LANDMARKS_TESSELATION = Qu));
var Yt = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "input_image", "norm_rect", !0),
      (this.j = { classifications: [] }),
      x((t = this.h = new Cu()), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (x(this.h, 0, 2, No(t, F(this.h, Wi, 2))), this.l(t));
  }
  sa(t, e) {
    return ((this.j = { classifications: [] }), ie(this, t, e), this.j);
  }
  ta(t, e, n) {
    return ((this.j = { classifications: [] }), Te(this, t, n, e), this.j);
  }
  m() {
    var t = new Ct();
    (J(t, "input_image"), J(t, "norm_rect"), U(t, "classifications"));
    const e = new Ht();
    pe(e, jh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"),
      z(n, "IMAGE:input_image"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "CLASSIFICATIONS:classifications"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoListener("classifications", (r, s) => {
        ((this.j = (function (o) {
          const i = {
            classifications: Ge(o, Th, 1).map((a) => {
              var c;
              return Xi(
                ((c = F(a, du, 4)) == null ? void 0 : c.g()) ?? [],
                Jt(a, 2) ?? 0,
                re(a, 3) ?? "",
              );
            }),
          };
          return (
            ls(Vn(o, 2)) != null && (i.timestampMs = ls(Vn(o, 2)) ?? 0),
            i
          );
        })(Rh(r))),
          w(this, s));
      }),
      this.g.attachEmptyPacketListener("classifications", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Yt.prototype.classifyForVideo = Yt.prototype.ta),
  (Yt.prototype.classify = Yt.prototype.sa),
  (Yt.prototype.setOptions = Yt.prototype.o),
  (Yt.createFromModelPath = function (t, e) {
    return I(Yt, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Yt.createFromModelBuffer = function (t, e) {
    return I(Yt, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Yt.createFromOptions = function (t, e) {
    return I(Yt, t, e);
  }));
var Dt = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !0),
      (this.h = new Fu()),
      (this.embeddings = { embeddings: [] }),
      x((t = this.h), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    var e = this.h,
      n = F(this.h, rc, 2);
    return (
      (n = n ? n.clone() : new rc()),
      t.l2Normalize !== void 0
        ? Lr(n, 1, t.l2Normalize)
        : "l2Normalize" in t && Y(n, 1),
      t.quantize !== void 0 ? Lr(n, 2, t.quantize) : "quantize" in t && Y(n, 2),
      x(e, 0, 2, n),
      this.l(t)
    );
  }
  za(t, e) {
    return (ie(this, t, e), this.embeddings);
  }
  Aa(t, e, n) {
    return (Te(this, t, n, e), this.embeddings);
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "norm_rect"), U(t, "embeddings_out"));
    const e = new Ht();
    pe(e, Vh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "EMBEDDINGS:embeddings_out"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoListener("embeddings_out", (r, s) => {
        ((r = Ph(r)),
          (this.embeddings = (function (o) {
            return {
              embeddings: Ge(o, Oh, 1).map((i) => {
                var c, l;
                const a = {
                  headIndex: Jt(i, 3) ?? 0 ?? -1,
                  headName: re(i, 4) ?? "" ?? "",
                };
                if (Ol(i, nc, oo(i, 1)) !== void 0)
                  ((i = un((i = F(i, nc, oo(i, 1))), 1, Qe, ln())),
                    (a.floatEmbedding = i.slice()));
                else {
                  const u = new Uint8Array(0);
                  a.quantizedEmbedding =
                    ((l = (c = F(i, Ih, oo(i, 2))) == null ? void 0 : c.oa()) ==
                    null
                      ? void 0
                      : l.h()) ?? u;
                }
                return a;
              }),
              timestampMs: ls(Vn(o, 2)) ?? 0,
            };
          })(r)),
          w(this, s));
      }),
      this.g.attachEmptyPacketListener("embeddings_out", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Dt.cosineSimilarity = function (t, e) {
  if (t.floatEmbedding && e.floatEmbedding)
    t = cc(t.floatEmbedding, e.floatEmbedding);
  else {
    if (!t.quantizedEmbedding || !e.quantizedEmbedding)
      throw Error(
        "Cannot compute cosine similarity between quantized and float embeddings.",
      );
    t = cc(ac(t.quantizedEmbedding), ac(e.quantizedEmbedding));
  }
  return t;
}),
  (Dt.prototype.embedForVideo = Dt.prototype.Aa),
  (Dt.prototype.embed = Dt.prototype.za),
  (Dt.prototype.setOptions = Dt.prototype.o),
  (Dt.createFromModelPath = function (t, e) {
    return I(Dt, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Dt.createFromModelBuffer = function (t, e) {
    return I(Dt, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Dt.createFromOptions = function (t, e) {
    return I(Dt, t, e);
  }));
var Bo = class {
  constructor(t, e, n) {
    ((this.confidenceMasks = t),
      (this.categoryMask = e),
      (this.qualityScores = n));
  }
  close() {
    var t, e;
    ((t = this.confidenceMasks) == null ||
      t.forEach((n) => {
        n.close();
      }),
      (e = this.categoryMask) == null || e.close());
  }
};
function Mc(t) {
  ((t.categoryMask = void 0),
    (t.confidenceMasks = void 0),
    (t.qualityScores = void 0));
}
function Lc(t) {
  try {
    const e = new Bo(t.confidenceMasks, t.categoryMask, t.qualityScores);
    if (!t.j) return e;
    t.j(e);
  } finally {
    js(t);
  }
}
Bo.prototype.close = Bo.prototype.close;
var Lt = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !1),
      (this.s = []),
      (this.outputCategoryMask = !1),
      (this.outputConfidenceMasks = !0),
      (this.h = new Ki()),
      (this.v = new Nu()),
      x(this.h, 0, 3, this.v),
      x((t = this.h), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      t.displayNamesLocale !== void 0
        ? Y(this.h, 2, tr(t.displayNamesLocale))
        : "displayNamesLocale" in t && Y(this.h, 2),
      "outputCategoryMask" in t &&
        (this.outputCategoryMask = t.outputCategoryMask ?? !1),
      "outputConfidenceMasks" in t &&
        (this.outputConfidenceMasks = t.outputConfidenceMasks ?? !0),
      super.l(t)
    );
  }
  I() {
    (function (t) {
      var n, r;
      const e = Ge(t.da(), kt, 1).filter((s) =>
        (re(s, 1) ?? "").includes(
          "mediapipe.tasks.TensorsToSegmentationCalculator",
        ),
      );
      if (((t.s = []), e.length > 1))
        throw Error(
          "The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.",
        );
      e.length === 1 &&
        (
          ((r = (n = F(e[0], Ht, 7)) == null ? void 0 : n.l()) == null
            ? void 0
            : r.g()) ?? new Map()
        ).forEach((s, o) => {
          t.s[Number(o)] = re(s, 1) ?? "";
        });
    })(this);
  }
  segment(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return (
      (this.j = typeof e == "function" ? e : n),
      Mc(this),
      ie(this, t, r),
      Lc(this)
    );
  }
  Ma(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return (
      (this.j = typeof n == "function" ? n : r),
      Mc(this),
      Te(this, t, s, e),
      Lc(this)
    );
  }
  Da() {
    return this.s;
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "norm_rect"));
    const e = new Ht();
    pe(e, Uu, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      n.o(e),
      Vt(t, n),
      Ws(this, t),
      this.outputConfidenceMasks &&
        (U(t, "confidence_masks"),
        O(n, "CONFIDENCE_MASKS:confidence_masks"),
        Yn(this, "confidence_masks"),
        this.g.ca("confidence_masks", (r, s) => {
          ((this.confidenceMasks = r.map((o) => Kn(this, o, !0, !this.j))),
            w(this, s));
        }),
        this.g.attachEmptyPacketListener("confidence_masks", (r) => {
          ((this.confidenceMasks = []), w(this, r));
        })),
      this.outputCategoryMask &&
        (U(t, "category_mask"),
        O(n, "CATEGORY_MASK:category_mask"),
        Yn(this, "category_mask"),
        this.g.U("category_mask", (r, s) => {
          ((this.categoryMask = Kn(this, r, !1, !this.j)), w(this, s));
        }),
        this.g.attachEmptyPacketListener("category_mask", (r) => {
          ((this.categoryMask = void 0), w(this, r));
        })),
      U(t, "quality_scores"),
      O(n, "QUALITY_SCORES:quality_scores"),
      this.g.attachFloatVectorListener("quality_scores", (r, s) => {
        ((this.qualityScores = r), w(this, s));
      }),
      this.g.attachEmptyPacketListener("quality_scores", (r) => {
        ((this.categoryMask = void 0), w(this, r));
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Lt.prototype.getLabels = Lt.prototype.Da),
  (Lt.prototype.segmentForVideo = Lt.prototype.Ma),
  (Lt.prototype.segment = Lt.prototype.segment),
  (Lt.prototype.setOptions = Lt.prototype.o),
  (Lt.createFromModelPath = function (t, e) {
    return I(Lt, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Lt.createFromModelBuffer = function (t, e) {
    return I(Lt, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Lt.createFromOptions = function (t, e) {
    return I(Lt, t, e);
  }));
var Go = class {
  constructor(t, e, n) {
    ((this.confidenceMasks = t),
      (this.categoryMask = e),
      (this.qualityScores = n));
  }
  close() {
    var t, e;
    ((t = this.confidenceMasks) == null ||
      t.forEach((n) => {
        n.close();
      }),
      (e = this.categoryMask) == null || e.close());
  }
};
Go.prototype.close = Go.prototype.close;
var Zh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ln = [0, ot, -2],
  ps = [0, Oe, -3, Q, Oe, -1],
  Sc = [0, ps],
  Tc = [0, ps, ot, -1],
  ho = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Rc = [0, Oe, -1, Q],
  Qh = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ic = class extends E {
    constructor(t) {
      super(t);
    }
  },
  Ho = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15],
  e1 = class extends E {
    constructor(t) {
      super(t);
    }
  };
e1.prototype.g = Us([
  0,
  pt,
  [
    0,
    Ho,
    W,
    ps,
    W,
    [0, ps, Ln],
    W,
    Sc,
    W,
    [0, Sc, Ln],
    W,
    Rc,
    W,
    [0, Oe, -3, Q, se],
    W,
    [0, Oe, -3, Q],
    W,
    [0, H, Oe, -2, Q, ot, Q, -1, 2, Oe, Ln],
    W,
    Tc,
    W,
    [0, Tc, Ln],
    Oe,
    Ln,
    H,
    W,
    [0, Oe, -3, Q, Ln, -1],
    W,
    [0, pt, Rc],
  ],
  H,
  [0, H, ot, -1, Q],
]);
var ve = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect_in", !1),
      (this.outputCategoryMask = !1),
      (this.outputConfidenceMasks = !0),
      (this.h = new Ki()),
      (this.s = new Nu()),
      x(this.h, 0, 3, this.s),
      x((t = this.h), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      "outputCategoryMask" in t &&
        (this.outputCategoryMask = t.outputCategoryMask ?? !1),
      "outputConfidenceMasks" in t &&
        (this.outputConfidenceMasks = t.outputConfidenceMasks ?? !0),
      super.l(t)
    );
  }
  segment(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    ((this.j = typeof n == "function" ? n : r),
      (this.qualityScores = this.categoryMask = this.confidenceMasks = void 0),
      (n = this.B + 1),
      (r = new e1()));
    const o = new Ic();
    var i = new Zh();
    if ((Se(i, 1, 255), x(o, 0, 12, i), e.keypoint && e.scribble))
      throw Error("Cannot provide both keypoint and scribble.");
    if (e.keypoint) {
      var a = new ho();
      (Lr(a, 3, !0),
        v(a, 1, e.keypoint.x),
        v(a, 2, e.keypoint.y),
        br(o, 5, Ho, a));
    } else {
      if (!e.scribble)
        throw Error("Must provide either a keypoint or a scribble.");
      for (a of ((i = new Qh()), e.scribble))
        (Lr((e = new ho()), 3, !0),
          v(e, 1, a.x),
          v(e, 2, a.y),
          us(i, 1, ho, e));
      br(o, 15, Ho, i);
    }
    (us(r, 1, Ic, o),
      this.g.addProtoToStream(r.g(), "drishti.RenderData", "roi_in", n),
      ie(this, t, s));
    t: {
      try {
        const l = new Go(
          this.confidenceMasks,
          this.categoryMask,
          this.qualityScores,
        );
        if (!this.j) {
          var c = l;
          break t;
        }
        this.j(l);
      } finally {
        js(this);
      }
      c = void 0;
    }
    return c;
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"), J(t, "roi_in"), J(t, "norm_rect_in"));
    const e = new Ht();
    pe(e, Uu, this.h);
    const n = new kt();
    (jt(
      n,
      "mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraph",
    ),
      z(n, "IMAGE:image_in"),
      z(n, "ROI:roi_in"),
      z(n, "NORM_RECT:norm_rect_in"),
      n.o(e),
      Vt(t, n),
      Ws(this, t),
      this.outputConfidenceMasks &&
        (U(t, "confidence_masks"),
        O(n, "CONFIDENCE_MASKS:confidence_masks"),
        Yn(this, "confidence_masks"),
        this.g.ca("confidence_masks", (r, s) => {
          ((this.confidenceMasks = r.map((o) => Kn(this, o, !0, !this.j))),
            w(this, s));
        }),
        this.g.attachEmptyPacketListener("confidence_masks", (r) => {
          ((this.confidenceMasks = []), w(this, r));
        })),
      this.outputCategoryMask &&
        (U(t, "category_mask"),
        O(n, "CATEGORY_MASK:category_mask"),
        Yn(this, "category_mask"),
        this.g.U("category_mask", (r, s) => {
          ((this.categoryMask = Kn(this, r, !1, !this.j)), w(this, s));
        }),
        this.g.attachEmptyPacketListener("category_mask", (r) => {
          ((this.categoryMask = void 0), w(this, r));
        })),
      U(t, "quality_scores"),
      O(n, "QUALITY_SCORES:quality_scores"),
      this.g.attachFloatVectorListener("quality_scores", (r, s) => {
        ((this.qualityScores = r), w(this, s));
      }),
      this.g.attachEmptyPacketListener("quality_scores", (r) => {
        ((this.categoryMask = void 0), w(this, r));
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((ve.prototype.segment = ve.prototype.segment),
  (ve.prototype.setOptions = ve.prototype.o),
  (ve.createFromModelPath = function (t, e) {
    return I(ve, t, { baseOptions: { modelAssetPath: e } });
  }),
  (ve.createFromModelBuffer = function (t, e) {
    return I(ve, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (ve.createFromOptions = function (t, e) {
    return I(ve, t, e);
  }));
var qt = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "input_frame_gpu", "norm_rect", !1),
      (this.j = { detections: [] }),
      x((t = this.h = new Bu()), 0, 1, (e = new tt())));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      t.displayNamesLocale !== void 0
        ? Y(this.h, 2, tr(t.displayNamesLocale))
        : "displayNamesLocale" in t && Y(this.h, 2),
      t.maxResults !== void 0
        ? Se(this.h, 3, t.maxResults)
        : "maxResults" in t && Y(this.h, 3),
      t.scoreThreshold !== void 0
        ? v(this.h, 4, t.scoreThreshold)
        : "scoreThreshold" in t && Y(this.h, 4),
      t.categoryAllowlist !== void 0
        ? hs(this.h, 5, t.categoryAllowlist)
        : "categoryAllowlist" in t && Y(this.h, 5),
      t.categoryDenylist !== void 0
        ? hs(this.h, 6, t.categoryDenylist)
        : "categoryDenylist" in t && Y(this.h, 6),
      this.l(t)
    );
  }
  D(t, e) {
    return ((this.j = { detections: [] }), ie(this, t, e), this.j);
  }
  F(t, e, n) {
    return ((this.j = { detections: [] }), Te(this, t, n, e), this.j);
  }
  m() {
    var t = new Ct();
    (J(t, "input_frame_gpu"), J(t, "norm_rect"), U(t, "detections"));
    const e = new Ht();
    pe(e, Yh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.ObjectDetectorGraph"),
      z(n, "IMAGE:input_frame_gpu"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "DETECTIONS:detections"),
      n.o(e),
      Vt(t, n),
      this.g.attachProtoVectorListener("detections", (r, s) => {
        for (const o of r) ((r = mu(o)), this.j.detections.push(Hu(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("detections", (r) => {
        w(this, r);
      }),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((qt.prototype.detectForVideo = qt.prototype.F),
  (qt.prototype.detect = qt.prototype.D),
  (qt.prototype.setOptions = qt.prototype.o),
  (qt.createFromModelPath = async function (t, e) {
    return I(qt, t, { baseOptions: { modelAssetPath: e } });
  }),
  (qt.createFromModelBuffer = function (t, e) {
    return I(qt, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (qt.createFromOptions = function (t, e) {
    return I(qt, t, e);
  }));
var Wo = class {
  constructor(t, e, n) {
    ((this.landmarks = t),
      (this.worldLandmarks = e),
      (this.segmentationMasks = n));
  }
  close() {
    var t;
    (t = this.segmentationMasks) == null ||
      t.forEach((e) => {
        e.close();
      });
  }
};
function Oc(t) {
  ((t.landmarks = []), (t.worldLandmarks = []), (t.segmentationMasks = void 0));
}
function Pc(t) {
  try {
    const e = new Wo(t.landmarks, t.worldLandmarks, t.segmentationMasks);
    if (!t.s) return e;
    t.s(e);
  } finally {
    js(t);
  }
}
Wo.prototype.close = Wo.prototype.close;
var Ut = class extends Ot {
  constructor(t, e) {
    (super(new oe(t, e), "image_in", "norm_rect", !1),
      (this.landmarks = []),
      (this.worldLandmarks = []),
      (this.outputSegmentationMasks = !1),
      x((t = this.h = new Gu()), 0, 1, (e = new tt())),
      (this.v = new Ou()),
      x(this.h, 0, 3, this.v),
      (this.j = new Iu()),
      x(this.h, 0, 2, this.j),
      Se(this.j, 4, 1),
      v(this.j, 2, 0.5),
      v(this.v, 2, 0.5),
      v(this.h, 4, 0.5));
  }
  get baseOptions() {
    return F(this.h, tt, 1);
  }
  set baseOptions(t) {
    x(this.h, 0, 1, t);
  }
  o(t) {
    return (
      "numPoses" in t && Se(this.j, 4, t.numPoses ?? 1),
      "minPoseDetectionConfidence" in t &&
        v(this.j, 2, t.minPoseDetectionConfidence ?? 0.5),
      "minTrackingConfidence" in t &&
        v(this.h, 4, t.minTrackingConfidence ?? 0.5),
      "minPosePresenceConfidence" in t &&
        v(this.v, 2, t.minPosePresenceConfidence ?? 0.5),
      "outputSegmentationMasks" in t &&
        (this.outputSegmentationMasks = t.outputSegmentationMasks ?? !1),
      this.l(t)
    );
  }
  D(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return (
      (this.s = typeof e == "function" ? e : n),
      Oc(this),
      ie(this, t, r),
      Pc(this)
    );
  }
  F(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return (
      (this.s = typeof n == "function" ? n : r),
      Oc(this),
      Te(this, t, s, e),
      Pc(this)
    );
  }
  m() {
    var t = new Ct();
    (J(t, "image_in"),
      J(t, "norm_rect"),
      U(t, "normalized_landmarks"),
      U(t, "world_landmarks"),
      U(t, "segmentation_masks"));
    const e = new Ht();
    pe(e, qh, this.h);
    const n = new kt();
    (jt(n, "mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"),
      z(n, "IMAGE:image_in"),
      z(n, "NORM_RECT:norm_rect"),
      O(n, "NORM_LANDMARKS:normalized_landmarks"),
      O(n, "WORLD_LANDMARKS:world_landmarks"),
      n.o(e),
      Vt(t, n),
      Ws(this, t),
      this.g.attachProtoVectorListener("normalized_landmarks", (r, s) => {
        this.landmarks = [];
        for (const o of r) ((r = Nr(o)), this.landmarks.push(Hs(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("normalized_landmarks", (r) => {
        ((this.landmarks = []), w(this, r));
      }),
      this.g.attachProtoVectorListener("world_landmarks", (r, s) => {
        this.worldLandmarks = [];
        for (const o of r) ((r = Dn(o)), this.worldLandmarks.push(vr(r)));
        w(this, s);
      }),
      this.g.attachEmptyPacketListener("world_landmarks", (r) => {
        ((this.worldLandmarks = []), w(this, r));
      }),
      this.outputSegmentationMasks &&
        (O(n, "SEGMENTATION_MASK:segmentation_masks"),
        Yn(this, "segmentation_masks"),
        this.g.ca("segmentation_masks", (r, s) => {
          ((this.segmentationMasks = r.map((o) => Kn(this, o, !0, !this.s))),
            w(this, s));
        }),
        this.g.attachEmptyPacketListener("segmentation_masks", (r) => {
          ((this.segmentationMasks = []), w(this, r));
        })),
      (t = t.g()),
      this.setGraph(new Uint8Array(t), !0));
  }
};
((Ut.prototype.detectForVideo = Ut.prototype.F),
  (Ut.prototype.detect = Ut.prototype.D),
  (Ut.prototype.setOptions = Ut.prototype.o),
  (Ut.createFromModelPath = function (t, e) {
    return I(Ut, t, { baseOptions: { modelAssetPath: e } });
  }),
  (Ut.createFromModelBuffer = function (t, e) {
    return I(Ut, t, { baseOptions: { modelAssetBuffer: e } });
  }),
  (Ut.createFromOptions = function (t, e) {
    return I(Ut, t, e);
  }),
  (Ut.POSE_CONNECTIONS = t1));
const t2 = 478,
  ms = {
    R_EYE_OUTER: 33,
    R_EYE_INNER: 133,
    R_EYE_UPPER_1: 246,
    R_EYE_UPPER_2: 161,
    R_EYE_UPPER_3: 160,
    R_EYE_UPPER_MID: 159,
    R_EYE_UPPER_5: 158,
    R_EYE_UPPER_6: 157,
    R_EYE_UPPER_7: 173,
    R_EYE_LOWER_1: 7,
    R_EYE_LOWER_2: 163,
    R_EYE_LOWER_3: 144,
    R_EYE_LOWER_MID: 145,
    R_EYE_LOWER_5: 153,
    R_EYE_LOWER_6: 154,
    R_EYE_LOWER_7: 155,
    R_IRIS: 468,
    R_IRIS_OUTER: 471,
    L_EYE_OUTER: 263,
    L_EYE_INNER: 362,
    L_EYE_UPPER_1: 466,
    L_EYE_UPPER_2: 388,
    L_EYE_UPPER_3: 387,
    L_EYE_UPPER_MID: 386,
    L_EYE_UPPER_5: 385,
    L_EYE_UPPER_6: 384,
    L_EYE_UPPER_7: 398,
    L_EYE_LOWER_1: 249,
    L_EYE_LOWER_2: 390,
    L_EYE_LOWER_3: 373,
    L_EYE_LOWER_MID: 374,
    L_EYE_LOWER_5: 380,
    L_EYE_LOWER_6: 381,
    L_EYE_LOWER_7: 382,
    L_IRIS: 473,
    L_IRIS_OUTER: 474,
    R_BROW_OUTER_UP: 46,
    R_BROW_OUTER_DOWN: 70,
    R_BROW_PEAK_UP: 52,
    R_BROW_UPPER_MID: 53,
    R_BROW_MID_UP: 65,
    R_BROW_INNER_UP: 55,
    R_BROW_INNER_DOWN: 107,
    R_BROW_PEAK: 105,
    R_BROW_LOWER_MID: 63,
    R_BROW_LOWER_IN: 66,
    L_BROW_OUTER_UP: 276,
    L_BROW_OUTER_DOWN: 300,
    L_BROW_PEAK_UP: 282,
    L_BROW_UPPER_MID: 283,
    L_BROW_MID_UP: 295,
    L_BROW_INNER_UP: 285,
    L_BROW_INNER_DOWN: 336,
    L_BROW_PEAK: 334,
    L_BROW_LOWER_MID: 293,
    L_BROW_LOWER_IN: 296,
    NOSE_TIP: 1,
    NOSE_BASE: 2,
    NOSE_BRIDGE: 6,
    GLABELLA: 9,
    HAIRLINE: 10,
    FOREHEAD: 151,
    NOSE_ROOT: 168,
    CHIN: 152,
    R_NOSE_ALA: 48,
    L_NOSE_ALA: 278,
    R_NOSTRIL: 98,
    L_NOSTRIL: 327,
    R_FACE_LAT: 234,
    L_FACE_LAT: 454,
    R_CHEEK_1: 50,
    R_ZYGOMA: 116,
    R_CHEEK_2: 205,
    R_CHEEK_3: 187,
    L_CHEEK_1: 280,
    L_ZYGOMA: 345,
    L_CHEEK_2: 425,
    L_CHEEK_3: 411,
    R_JAW: 172,
    L_JAW: 397,
    R_MOUTH: 61,
    L_MOUTH: 291,
    UPPER_LIP: 0,
    CUPID_R: 37,
    CUPID_L: 267,
    LOWER_LIP: 17,
    UPPER_LIP_IN: 13,
    LOWER_LIP_IN: 14,
  },
  n1 = new Map();
for (const [t, e] of Object.entries(ms)) n1.set(e, t);
const e2 = [
    0, 1, 2, 248, 4, 5, 6, 249, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 34,
    265, 266, 267, 268, 269, 270, 303, 42, 273, 274, 275, 276, 277, 278, 279,
    280, 281, 282, 283, 284, 285, 286, 287, 288, 392, 290, 291, 292, 293, 294,
    295, 296, 297, 298, 299, 300, 301, 302, 73, 74, 305, 76, 307, 308, 309, 310,
    311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 94, 324,
    325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339,
    340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354,
    355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369,
    370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 151, 152, 380, 381, 382,
    383, 384, 385, 386, 387, 388, 389, 390, 164, 391, 166, 393, 168, 394, 395,
    396, 397, 398, 399, 175, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409,
    410, 411, 412, 413, 414, 415, 416, 417, 418, 195, 419, 197, 420, 199, 200,
    421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435,
    436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 227, 448, 449, 450,
    451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465,
    466, 467, 3, 7, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 264,
    35, 36, 37, 38, 39, 40, 271, 272, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
    53, 54, 55, 56, 57, 58, 289, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 41, 304, 75, 306, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90, 91, 92, 93, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
    108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
    123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
    138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 153, 154,
    155, 156, 157, 158, 159, 160, 161, 162, 163, 165, 59, 167, 169, 170, 171,
    172, 173, 174, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187,
    188, 189, 190, 191, 192, 193, 194, 196, 198, 201, 202, 203, 204, 205, 206,
    207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221,
    222, 223, 224, 225, 226, 447, 228, 229, 230, 231, 232, 233, 234, 235, 236,
    237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 473, 474, 475, 476,
    477, 468, 469, 470, 471, 472,
  ],
  n2 = {
    face_oval: [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
      378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
      162, 21, 54, 103, 67, 109,
    ],
    right_eye: [
      33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163,
      7,
    ],
    left_eye: [
      263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390,
      249,
    ],
    right_brow: [55, 65, 52, 53, 46, 70, 63, 105, 66, 107],
    left_brow: [285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
    lip_outer: [
      61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17,
      84, 181, 91, 146,
    ],
    lip_inner: [
      78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14,
      87, 178, 88, 95,
    ],
  };
function qs(t) {
  if (t in ms) return ms[t];
  const e = Number(t);
  if (Number.isInteger(e) && e >= 0 && e < t2) return e;
  throw new Error("未知关键点：" + t);
}
function la(t) {
  return e2[t];
}
function yr(t) {
  const e = t.startsWith("R_")
    ? "L_" + t.slice(2)
    : t.startsWith("L_")
      ? "R_" + t.slice(2)
      : t;
  if (e in ms) return e;
  const n = la(qs(t));
  return n1.get(n) ?? String(n);
}
function ua(t) {
  const e = n2[t];
  if (!e) throw new Error("未知轮廓：" + t);
  return e;
}
const Cc = ["FOREHEAD", "NOSE_TIP", "CHIN", "R_FACE_LAT", "L_FACE_LAT"].map(qs);
class q {
  constructor(e, n) {
    ((this.x = e), (this.y = n));
  }
  add(e) {
    return new q(this.x + e.x, this.y + e.y);
  }
  sub(e) {
    return new q(this.x - e.x, this.y - e.y);
  }
  mul(e) {
    return new q(this.x * e, this.y * e);
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  len() {
    return Math.hypot(this.x, this.y);
  }
  norm() {
    const e = this.len();
    return e < 1e-8 ? new q(1, 0) : this.mul(1 / e);
  }
  perpToward(e) {
    const n = new q(-this.y, this.x),
      r = new q(this.y, -this.x);
    return (n.dot(e) >= r.dot(e) ? n : r).norm();
  }
}
function j(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Xn(t, e, n) {
  let r = !1,
    s = t.length - 1;
  for (let o = 0; o < t.length; o++) {
    const i = t[o].y,
      a = t[s].y,
      c = t[o].x,
      l = t[s].x;
    (i > n != a > n &&
      e < ((l - c) * (n - i)) / (a - i + 1e-12) + c &&
      (r = !r),
      (s = o));
  }
  return r;
}
function jo(t, e) {
  let n = Number.POSITIVE_INFINITY;
  for (let r = 0; r < e.length; r++) {
    const s = e[r],
      o = e[(r + 1) % e.length];
    n = Math.min(n, r2(t, s, o));
  }
  return n;
}
function r2(t, e, n) {
  const r = n.x - e.x,
    s = n.y - e.y,
    o = r * r + s * s,
    i = o < 1e-8 ? 0 : j(((t.x - e.x) * r + (t.y - e.y) * s) / o, 0, 1);
  return Math.hypot(t.x - (e.x + r * i), t.y - (e.y + s * i));
}
function ir(t) {
  let e = 0,
    n = 0;
  for (const s of t) ((e += s.x), (n += s.y));
  const r = Math.max(1, t.length);
  return new q(e / r, n / r);
}
class Tr {
  constructor(e) {
    if (((this.landmarks = e), e.points.length < 478))
      throw new Error(`需要至少 478 个关键点，实际 ${e.points.length}`);
    if (e.imageWidth <= 0 || e.imageHeight <= 0)
      throw new Error("图像尺寸无效");
    const n = e.imageWidth,
      r = e.imageHeight;
    ((this.px = e.points.map((a) => new q(a.x * n, a.y * r))),
      (this.fw = Math.max(
        1,
        this.at("R_FACE_LAT").sub(this.at("L_FACE_LAT")).len(),
      )));
    const s = (this.at("R_FACE_LAT").x + this.at("L_FACE_LAT").x) * 0.5;
    ((this.yaw = j((this.at("NOSE_TIP").x - s) / (this.fw * 0.5), -1, 1)),
      (this.right = this.sideFrame("R_EYE_OUTER", "R_EYE_INNER", "RIGHT")),
      (this.left = this.sideFrame("L_EYE_OUTER", "L_EYE_INNER", "LEFT")));
    const o = this.at("R_EYE_OUTER").sub(this.at("L_EYE_OUTER")).norm(),
      i = o.perpToward(this.at("FOREHEAD").sub(this.at("CHIN")));
    this.center = {
      xAxis: o,
      yAxis: i,
      ew: (this.right.ew + this.left.ew) / 2,
      fw: this.fw,
      side: "CENTER",
    };
  }
  px;
  fw;
  yaw;
  right;
  left;
  center;
  at(e) {
    return this.px[qs(e)];
  }
  frame(e) {
    return e === "RIGHT" ? this.right : e === "LEFT" ? this.left : this.center;
  }
  sideFrame(e, n, r) {
    const s = this.at(e).sub(this.at(n)),
      o = Math.max(1, s.len()),
      i = s.mul(1 / o),
      a = i.perpToward(this.at("FOREHEAD").sub(this.at("CHIN")));
    return { xAxis: i, yAxis: a, ew: o, fw: this.fw, side: r };
  }
}
function an(t, e, n) {
  let r;
  if (t.kind === "lm") r = e.at(t.name);
  else if (t.kind === "lerp") {
    const a = e.at(t.a),
      c = e.at(t.b);
    r = a.add(c.sub(a).mul(t.t));
  } else {
    const a = t.names.map((c) => e.at(c));
    return ir(a);
  }
  const s = t.offX,
    o = t.offY;
  if (s === 0 && o === 0) return r;
  const i = t.unit === "FW" ? n.fw : n.ew;
  return r.add(n.xAxis.mul(s * i)).add(n.yAxis.mul(o * i));
}
function s2(t, e, n, r, s, o, i = 48) {
  const a = (s * Math.PI) / 180,
    c = Math.cos(a),
    l = Math.sin(a),
    u = [];
  for (let h = 0; h < i; h++) {
    const p = (2 * Math.PI * h) / i,
      f = n * o * Math.cos(p),
      d = r * o * Math.sin(p),
      m = f * c - d * l,
      g = f * l + d * c;
    u.push(t.add(e.xAxis.mul(m)).add(e.yAxis.mul(g)));
  }
  return u;
}
function o2(t, e, n, r, s) {
  const o = s * s,
    i = o * s;
  return e
    .mul(2)
    .add(n.sub(t).mul(s))
    .add(t.mul(2).sub(e.mul(5)).add(n.mul(4)).sub(r).mul(o))
    .add(t.mul(-1).add(e.mul(3)).sub(n.mul(3)).add(r).mul(i))
    .mul(0.5);
}
function Vo(t, e = 6, n = !1) {
  const r = t.length;
  if (r < 2 || (!n && r === 2)) return t.slice();
  const s = Math.max(1, e),
    o = n ? r : r - 1,
    i = [],
    a = (c) => (n ? t[((c % r) + r) % r] : t[j(c, 0, r - 1)]);
  for (let c = 0; c < o; c++) {
    const l = a(c - 1),
      u = a(c),
      h = a(c + 1),
      p = a(c + 2);
    for (let f = 0; f < s; f++) i.push(o2(l, u, h, p, f / s));
  }
  return (i.push(n ? a(0) : t[r - 1]), i);
}
function i2(t, e, n, r, s, o, i, a, c) {
  const l = (m, g, y, _) => {
      const b = Math.max(1e-6, _ - y),
        T = j((c - y) / b, 0, 1);
      return m.mul(1 - T).add(g.mul(T));
    },
    u = l(t, e, s, o),
    h = l(e, n, o, i),
    p = l(n, r, i, a),
    f = l(u, h, s, i),
    d = l(h, p, o, a);
  return l(f, d, o, i);
}
function a2(t, e = 12, n = !1) {
  const r = t.length;
  if (r < 2) return t.slice();
  if (!n && r === 2) return [t[0], t[r - 1]];
  const s = Math.max(1, e),
    o = n ? r : r - 1,
    i = [],
    a = (l) => (n ? t[((l % r) + r) % r] : t[j(l, 0, r - 1)]),
    c = (l, u, h) => {
      const p = h.sub(u).len();
      return l + (p < 1e-4 ? 0.001 : Math.sqrt(p));
    };
  for (let l = 0; l < o; l++) {
    const u = a(l - 1),
      h = a(l),
      p = a(l + 1),
      f = a(l + 2),
      d = 0,
      m = c(d, u, h),
      g = c(m, h, p),
      y = c(g, p, f),
      _ = Math.max(1e-6, g - m);
    for (let b = 0; b < s; b++)
      i.push(i2(u, h, p, f, d, m, g, y, m + _ * (b / s)));
  }
  return (i.push(n ? t[0] : t[r - 1]), i);
}
function fo(t, e) {
  if (t.length === 0) return 0.03;
  if (t.length === 1) return t[0];
  const n = j(e, 0, 1) * (t.length - 1),
    r = j(Math.floor(n), 0, t.length - 2),
    s = j(n - r, 0, 1);
  return t[r] + (t[r + 1] - t[r]) * s;
}
function c2(t, e, n, r = 6) {
  if (t.length <= 2) {
    const a = t.map((c, l) => {
      const u = t.length <= 1 ? 0 : l / (t.length - 1);
      return fo(e, u) * n;
    });
    return { pts: t.slice(), widths: a };
  }
  const s = Vo(t, r, !1),
    o = t.length - 1,
    i = [];
  for (let a = 0; a < o; a++)
    for (let c = 0; c < r; c++) i.push(fo(e, (a + c / r) / o) * n);
  for (i.push(fo(e, 1) * n); i.length < s.length; ) i.push(i[i.length - 1]);
  return { pts: s, widths: i.slice(0, s.length) };
}
function Ae(t, e) {
  return ua(e).map((n) => t.px[n]);
}
function es(t, e) {
  if (t.length === 0) return t;
  const n = ir(t);
  return t.map((r) => {
    const s = r.sub(n),
      o = Math.max(0.001, s.len());
    return r.sub(s.mul(e / o));
  });
}
function l2(t, e) {
  if (t.length === 0) return t;
  const n = ir(t);
  return t.map((r) => {
    const s = r.sub(n),
      o = Math.max(0.001, s.len());
    return r.add(s.mul(e / o));
  });
}
function po(t, e) {
  return t === "FW" ? e.fw : e.ew;
}
function r1(t) {
  return {
    closed: !1,
    phase: 0,
    part: 0,
    parts: 1,
    role: "edge",
    ghostAlpha: 0.32,
    pathId: "",
    pathOrder: 0,
    mergeFlip: !1,
    ...t,
  };
}
function Re() {
  return { layers: [] };
}
function s1(t) {
  return t.layers.some(
    (e) =>
      e.fills.length > 0 ||
      e.hairs.length > 0 ||
      e.lines.length > 0 ||
      e.brushes.length > 0,
  );
}
function u2(t, e) {
  return {
    layers: t.layers.map((n) => {
      var r, s;
      return {
        ...n,
        fills: n.fills.map((o) => {
          var i;
          return {
            ...o,
            points: o.points.map((a) => a.add(e)),
            holes:
              (i = o.holes) == null
                ? void 0
                : i.map((a) => a.map((c) => c.add(e))),
          };
        }),
        hairs: n.hairs.map((o) => ({ ...o, a: o.a.add(e), b: o.b.add(e) })),
        lines: n.lines.map((o) => ({
          ...o,
          points: o.points.map((i) => i.add(e)),
        })),
        brushes: n.brushes.map((o) => ({ ...o, center: o.center.add(e) })),
        head: (r = n.head) == null ? void 0 : r.add(e),
        tail: (s = n.tail) == null ? void 0 : s.add(e),
      };
    }),
  };
}
function Bt(t, e) {
  return { layers: t.layers.concat(e.layers) };
}
function h2(t, e) {
  return e === 1
    ? t
    : {
        layers: t.layers.map((n) => ({
          ...n,
          fills: n.fills.map((r) => ({ ...r, alpha: r.alpha * e })),
          hairs: n.hairs.map((r) => ({ ...r, alpha: r.alpha * e })),
          lines: n.lines.map((r) => ({ ...r, alpha: r.alpha * e })),
          brushes: n.brushes.map((r) => ({ ...r, alpha: r.alpha * e })),
        })),
      };
}
function Fc(t, e) {
  return {
    ...t,
    strokes: t.strokes.map((n) => ({
      ...n,
      points: n.points.map((r) => r.add(e)),
    })),
    dots: t.dots.map((n) => ({ ...n, at: n.at.add(e) })),
    oval: t.oval.map((n) => n.add(e)),
    eyes: t.eyes.map((n) => n.map((r) => r.add(e))),
    brows: t.brows.map((n) => n.map((r) => r.add(e))),
    mouth: t.mouth.map((n) => n.add(e)),
    preview: u2(t.preview, e),
  };
}
function $o(t, e) {
  const n = t.emphasis < 0.5;
  if (t.role === "ghost") {
    if (e.settled || n || t.phase !== e.phase) return null;
    const o = w2(e.progress);
    return o < 0.03
      ? null
      : { trim: 1, solid: !0, alpha: t.ghostAlpha * o * t.emphasis, ghost: !0 };
  }
  if (e.settled)
    return { trim: 1, solid: !1, alpha: 0.9 * t.emphasis, ghost: !1 };
  if (n)
    return t.phase >= 0
      ? null
      : { trim: 1, solid: !1, alpha: 0.62 * t.emphasis, ghost: !1 };
  if (t.phase < 0 || t.phase < e.phase)
    return { trim: 1, solid: !1, alpha: 0.7 * t.emphasis, ghost: !1 };
  if (t.phase > e.phase) return null;
  const r = Math.max(1, t.parts),
    s = (e.progress - t.part * (1 / r)) * r;
  return s <= 0.02
    ? null
    : s < 1
      ? { trim: j(s, 0, 1), solid: !0, alpha: 0.96 * t.emphasis, ghost: !1 }
      : { trim: 1, solid: !1, alpha: 0.9 * t.emphasis, ghost: !1 };
}
function f2(t, e) {
  const n = [],
    r = new Map();
  for (const o of t.strokes)
    if (o.role === "edge" && o.pathId) {
      const i = r.get(o.pathId) ?? [];
      (i.push(o), r.set(o.pathId, i));
    }
  const s = new Set();
  for (const o of t.strokes) {
    const i = $o(o, e);
    if (i)
      if (o.role === "edge" && o.pathId) {
        if (s.has(o.pathId)) continue;
        (s.add(o.pathId), n.push(...d2(r.get(o.pathId) ?? [], e)));
      } else {
        const a = i.trim < 0.985 ? i1(o.points, !1, i.trim, 0) : o.points;
        a.length >= 2 &&
          n.push({
            points: a,
            style: o.style,
            alpha: i.alpha,
            solid: i.solid,
            dashShiftImg: 0,
            ghost: i.ghost,
          });
      }
  }
  return n;
}
function d2(t, e) {
  const n = t.slice().sort((a, c) => a.pathOrder - c.pathOrder),
    r = [];
  for (const a of n) {
    const c = $o(a, e);
    c && r.push({ seg: a, draw: c });
  }
  if (
    r.length === n.length &&
    r.every(({ draw: a }) => !a.ghost && a.trim >= 0.985 && !a.solid) &&
    p2(n)
  ) {
    const a = [];
    for (const c of n)
      m2(a, c.mergeFlip ? c.points.slice().reverse() : c.points);
    if (a.length >= 2) {
      const c = Math.min(...r.map((l) => l.draw.alpha));
      return [
        {
          points: a,
          style: n[0].style,
          alpha: c,
          solid: !1,
          dashShiftImg: 0,
          ghost: !1,
        },
      ];
    }
  }
  const o = [];
  let i = 0;
  for (const a of n) {
    const c = $o(a, e);
    if (c) {
      const l = c.trim < 0.985 ? i1(a.points, !1, c.trim, 0) : a.points;
      l.length >= 2 &&
        o.push({
          points: l,
          style: a.style,
          alpha: c.alpha,
          solid: c.solid,
          dashShiftImg: i,
          ghost: c.ghost,
        });
    }
    i += o1(a.points);
  }
  return o;
}
function p2(t) {
  let e = null;
  for (const n of t) {
    const r = n.mergeFlip ? n.points.slice().reverse() : n.points;
    if (r.length < 2 || (e && r[0].sub(e).len() > 4)) return !1;
    e = r[r.length - 1];
  }
  return !0;
}
function m2(t, e) {
  e.length !== 0 &&
    (t.length > 0 && t[t.length - 1].sub(e[0]).len() < 4
      ? t.push(...e.slice(1))
      : t.push(...e));
}
function o1(t) {
  let e = 0;
  for (let n = 1; n < t.length; n++) e += t[n].sub(t[n - 1]).len();
  return e;
}
function g2(t, e, n) {
  const r = Math.max(0.8, e),
    s = Math.max(0.4, n);
  if (t < r * 1.4) return { on: r, gap: s, phase: 0 };
  const o = r + s,
    i = Math.max(1, Math.floor(t / o));
  let a = s,
    c = Number.POSITIVE_INFINITY;
  for (let l = Math.max(1, i - 3); l <= i + 4; l++) {
    const u = (t - r * (l + 0.7)) / l;
    if (u < r * 0.42 || u > r * 1.45) continue;
    const h = Math.abs(u - s);
    h < c && ((c = h), (a = u));
  }
  return { on: r, gap: a, phase: 0 };
}
function y2(t, e, n, r) {
  if (t.emphasis < 0.5 && !e.settled) return t.phase >= 0 ? 0 : 1;
  if (e.settled || t.phase < 0 || t.phase < e.phase) return 1;
  if (t.phase > e.phase) return 0;
  if (n.has(t.phase)) return 1;
  const o = Math.max(1, r),
    i = (e.progress - t.order * (1 / o)) * o;
  return i <= 0 ? 0 : i < 1 ? F2(j(i, 0, 1)) : 1;
}
function _2(t, e, n, r) {
  if (e.settled || t.emphasis < 0.5 || t.phase !== e.phase || n.has(t.phase))
    return !1;
  const s = Math.max(1, r),
    o = (e.progress - t.order * (1 / s)) * s;
  return o >= 0.04 && o <= 0.98;
}
function w2(t) {
  const e = j(t, 0, 1);
  return e < 0.16 ? e / 0.16 : e > 0.7 ? j((1 - e) / 0.3, 0, 1) : 1;
}
const b2 = 16183784,
  E2 = 7235423,
  v2 = 1.32,
  k2 = 0.55,
  A2 = 0.55,
  x2 = 1.55,
  M2 = 3.3,
  L2 = 2.4,
  S2 = 0.88,
  T2 = 0.18;
function R2(t, e, n) {
  const r = j(n, 0, 1),
    s = (o) => {
      const i = (t >> o) & 255,
        a = (e >> o) & 255;
      return j(Math.round(i + (a - i) * r), 0, 255);
    };
  return (s(16) << 16) | (s(8) << 8) | s(0);
}
function Un(t) {
  return t === "brow"
    ? 12886160
    : t === "liner" || t === "lash"
      ? 12036508
      : t === "lid" || t === "shadow"
        ? 14136512
        : t === "lip"
          ? 15182006
          : t === "blush"
            ? 15184060
            : t === "skin"
              ? 14996164
              : 15192776;
}
function I2(t) {
  return R2(b2, Un(t), 0.2);
}
function O2() {
  return E2;
}
function he(t, e) {
  const n = (t >> 16) & 255,
    r = (t >> 8) & 255,
    s = t & 255;
  return `rgba(${n},${r},${s},${e})`;
}
function Pt(t, e, n) {
  if (t.length === 0) return [new q(0, 0), new q(1, 0)];
  if (t.length === 1) return [t[0], new q(1, 0)];
  const r = e ? t.concat([t[0]]) : t,
    s = [];
  for (let c = 0; c < r.length - 1; c++)
    s.push(Math.max(1e-6, r[c + 1].sub(r[c]).len()));
  const o = Math.max(
    1e-6,
    s.reduce((c, l) => c + l, 0),
  );
  let i = j(n, 0, 0.999999) * o;
  for (let c = 0; c < s.length; c++) {
    if (i <= s[c] || c === s.length - 1) {
      const l = j(i / s[c], 0, 1),
        u = r[c + 1].sub(r[c]);
      return [r[c].add(u.mul(l)), u.norm()];
    }
    i -= s[c];
  }
  const a = r[r.length - 1].sub(r[r.length - 2]);
  return [r[r.length - 1], a.norm()];
}
function i1(t, e, n, r) {
  return t.length < 2 || n <= 0.004 ? [] : (P2(t, e, n, r, 0, 1e7, 0)[0] ?? []);
}
function P2(t, e, n, r, s, o, i) {
  if (t.length < 2 || n <= 0.004 || o <= 0.2) return [];
  const a = t,
    c = new Array(a.length).fill(0);
  for (let y = 0; y < a.length - 1; y++)
    c[y + 1] = c[y] + a[y + 1].sub(a[y]).len();
  const l = Math.max(1e-6, c[c.length - 1]),
    u = j(n, 0, 1) * l,
    h = Math.max(0.5, o + i),
    p = (((s % 1) + 1) % 1) * h,
    f = j(o * 0.12, 0.35, 1.35),
    d = [];
  let m = null,
    g = 0;
  for (; g <= u + 1e-4; ) {
    const y = Math.min(g, u);
    if (
      ((((y - p) % h) + h) % h <= o
        ? (m || (m = []), m.push(C2(a, c, r, y, l)))
        : m && (Nc(m, d), (m = null)),
      y >= u - 1e-6)
    )
      break;
    g += f;
  }
  return (m && Nc(m, d), d);
}
function C2(t, e, n, r, s, o) {
  let i;
  i = j(j(n, 0, 1) * s + r, 0, s);
  const a = j(i, 0, e[e.length - 1]);
  let c = 1;
  for (; c < e.length && e[c] < a; ) c++;
  if (c >= e.length) return t[t.length - 1];
  const l = Math.max(1e-6, e[c] - e[c - 1]),
    u = j((a - e[c - 1]) / l, 0, 1);
  return t[c - 1].add(t[c].sub(t[c - 1]).mul(u));
}
function Nc(t, e) {
  if (t.length >= 2) {
    e.push(t);
    return;
  }
  t.length !== 0 && e.push([t[0], t[0].add(new q(0.35, 0))]);
}
function F2(t) {
  const r = t - 1;
  return Math.max(0, 1 + 2.55 * r * r * r + 1.55 * r * r);
}
function N2(t) {
  return t === "liner" || t === "lash"
    ? 4866104
    : t === "shadowDeep"
      ? 6178364
      : t === "shadow"
        ? 9073252
        : t === "highlight"
          ? 16248806
          : t === "lip"
            ? 12868966
            : t === "blush"
              ? 13406344
              : 10125428;
}
const _r = 7033670;
function Dc(t) {
  return t === "one_euro_strong"
    ? { minCutoff: 0.7, beta: 0.04, dCutoff: 1 }
    : { minCutoff: 1.5, beta: 0.09, dCutoff: 1 };
}
class Uc {
  constructor(e = 1, n = 0, r = 1) {
    ((this.minCutoff = e), (this.beta = n), (this.dCutoff = r));
  }
  xPrev = null;
  dxPrev = 0;
  tPrev = null;
  reset() {
    ((this.xPrev = null), (this.dxPrev = 0), (this.tPrev = null));
  }
  filter(e, n) {
    const r = this.xPrev,
      s = this.tPrev;
    if (r === null || s === null)
      return ((this.xPrev = e), (this.tPrev = n), (this.dxPrev = 0), e);
    const o = Math.max(1e-4, n - s),
      i = (e - r) / o,
      a = this.alpha(o, this.dCutoff),
      c = a * i + (1 - a) * this.dxPrev,
      l = this.minCutoff + this.beta * Math.abs(c),
      u = this.alpha(o, l),
      h = u * e + (1 - u) * r;
    return ((this.xPrev = h), (this.dxPrev = c), (this.tPrev = n), h);
  }
  alpha(e, n) {
    return 1 / (1 + 1 / (2 * Math.PI * Math.max(1e-4, n)) / e);
  }
}
class Bc {
  inner;
  constructor(e, n) {
    this.inner = new LandmarkStabilizer(e, n);
  }
  smooth(e, n) {
    return this.inner.smooth(e, n);
  }
  reset() {
    this.inner.reset();
  }
}
function mo(t, e, n = 0.55) {
  const r = t.eyeBlinkRight ?? 0,
    s = t.eyeBlinkLeft ?? 0;
  return e === "RIGHT" ? r >= n : (e === "LEFT" || r >= n) && s >= n;
}
function D2(t, e, n, r) {
  for (const s of n)
    if (!(s < 0 || s >= t.length || s >= e.length) && e[s].sub(t[s]).len() > r)
      return !0;
  return !1;
}
function U2(t, e, n) {
  let r = 0,
    s = 0,
    o = 0;
  for (const i of n)
    i < 0 ||
      i >= t.length ||
      i >= e.length ||
      ((r += e[i].x - t[i].x), (s += e[i].y - t[i].y), o++);
  return o === 0 ? new q(0, 0) : new q(r / o, s / o);
}
function B2(t) {
  const e = t.fw / t.landmarks.imageWidth;
  if (e < 0.3) return "too_far";
  if (e > 0.78) return "too_close";
  const n = t.at("R_EYE_OUTER"),
    r = t.at("L_EYE_OUTER"),
    s = n.add(r).mul(0.5),
    o = t.at("NOSE_TIP"),
    i = Math.max(1, r.sub(n).len());
  return Math.abs(o.x - s.x) / i > 0.16 ? "turned" : "ok";
}
function G2(t, e) {
  const n = t === "RIGHT" ? Math.max(0, e) : t === "LEFT" ? Math.max(0, -e) : 0;
  return 1 - 0.78 * Math.min(1, Math.max(0, (n - 0.1) / 0.42));
}
function H2(t) {
  return t === "low" ? 0.78 : t === "high" ? 1.16 : 1;
}
function W2(t) {
  return t === "low" ? "medium" : t === "medium" ? "high" : "low";
}
function a1(t) {
  return t === "low" ? "低" : t === "high" ? "高" : "中";
}
class j2 {
  constructor(e, n, r) {
    ((this.a = e), (this.b = n), (this.c = r));
  }
  at(e) {
    return Math.max(0, this.a + this.b * e + this.c * e * e) * V2(e);
  }
}
function V2(t) {
  if (t <= 0.6) return 1;
  const n = j((t - 0.6) / (1 - 0.6), 0, 1);
  return j(0.5 * (1 + Math.cos(Math.PI * n)), 0, 1);
}
function Et(t) {
  return t.at("FOREHEAD").sub(t.at("NOSE_TIP")).norm();
}
function Qt(t, e, n) {
  const r = n === "LEFT" ? la(e) : e;
  return t.px[r];
}
function bt(t, e, n) {
  const r = n === "LEFT" ? yr(e) : e;
  return t.at(r);
}
function ar(t, e = 4) {
  if (t.length < 3) return t;
  const n = a2(t, Math.max(8, e * 4), !1);
  return $2(n, t[0], t[t.length - 1]);
}
function $2(t, e, n) {
  if (t.length === 0) return [e, n];
  const r = t.slice();
  return ((r[0] = e), (r[r.length - 1] = n), r);
}
function yn(t, e, n) {
  const s = [];
  for (let o = 0; o <= 10; o++) s.push(Pt(t, !1, e + ((n - e) * o) / 10)[0]);
  return s;
}
function fr(t, e) {
  return ar(
    e.map((n) => t.px[n]),
    2,
  );
}
function V(t, e, n, r, s, o = 0.32) {
  const i = t.filter((a) => a.length >= 2);
  return i.map((a, c) =>
    r1({
      points: a,
      style: n,
      emphasis: r,
      phase: e,
      part: c,
      parts: Math.max(1, i.length),
      role: s,
      ghostAlpha: o,
    }),
  );
}
function Y2(t, e, n) {
  if (e.length < 3 || (Xn(e, t.x, t.y) && jo(t, e) >= n)) return t;
  const s = ir(e).sub(t),
    o = s.len() < 0.001 ? new q(0, 1) : s.norm();
  let i = t,
    a = Math.max(1, n);
  for (let c = 0; c < 12; c++) {
    if (Xn(e, i.x, i.y) && jo(i, e) >= n * 0.85) return i;
    ((i = i.add(o.mul(a))), (a *= 1.25));
  }
  return i;
}
function c1(t, e, n) {
  return Y2(e, Ae(t, "face_oval"), n);
}
function q2(t) {
  let e = 0,
    n = 0,
    r = 0,
    s = 0,
    o = 0;
  for (const a of t) {
    const c = a.t * (1 - a.t),
      l = c * a.t;
    ((e += c * c),
      (n += c * l),
      (r += l * l),
      (s += c * a.lift),
      (o += l * a.lift));
  }
  const i = e * r - n * n;
  return Math.abs(i) < 1e-8
    ? [0, 0]
    : [(s * r - n * o) / i, (e * o - n * s) / i];
}
function z2(t, e) {
  const n = t.map((s) => s.slice()),
    r = e.slice();
  for (let s = 0; s < 3; s++) {
    let o = s;
    for (let l = s + 1; l < 3; l++)
      Math.abs(n[l][s]) > Math.abs(n[o][s]) && (o = l);
    if (Math.abs(n[o][s]) < 1e-10) return null;
    const i = n[s];
    ((n[s] = n[o]), (n[o] = i));
    const a = r[s];
    ((r[s] = r[o]), (r[o] = a));
    const c = n[s][s];
    for (let l = s; l < 3; l++) n[s][l] /= c;
    r[s] /= c;
    for (let l = 0; l < 3; l++) {
      if (l === s) continue;
      const u = n[l][s];
      for (let h = s; h < 3; h++) n[l][h] -= u * n[s][h];
      r[l] -= u * r[s];
    }
  }
  return r;
}
function K2(t, e) {
  const n = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    r = [0, 0, 0];
  for (const i of t) {
    const a = i.t <= 0.62 ? 1 : 0.15,
      c = [1, i.t, i.t * i.t];
    for (let l = 0; l < 3; l++) {
      r[l] += a * c[l] * i.width;
      for (let u = 0; u < 3; u++) n[l][u] += a * c[l] * c[u];
    }
  }
  ((n[1][1] += 0.08), (n[2][2] += 0.35));
  const s = z2(n, r) ?? [e * 0.028, 0, 0],
    o = j(s[0], e * 0.01, e * 0.1);
  return new j2(o, s[1], s[2]);
}
function X2(t, e, n) {
  const r = t.fw,
    s = es(Ae(t, "face_oval"), r * 0.01),
    o = r * 0.008,
    i = (h) => Xn(s, h.x, h.y) && jo(h, s) >= o;
  if (i(n)) return n;
  const a = i(e) ? e : ir(s);
  let c = 0,
    l = 1,
    u = a;
  for (let h = 0; h < 16; h++) {
    const p = (c + l) * 0.5,
      f = a.mul(1 - p).add(n.mul(p));
    i(f) ? ((c = p), (u = f)) : (l = p);
  }
  return u;
}
function J2(t, e) {
  const n = Et(t),
    r = t.fw,
    s = [107, 66, 105, 63, 70].map((D) => Qt(t, D, e)),
    o = [55, 65, 52, 53, 46].map((D) => Qt(t, D, e)),
    i = s.map((D, G) => D.add(o[G]).mul(0.5)),
    a = s.map((D, G) => D.sub(o[G]).len()),
    c = i[0],
    l = i[1],
    u = c.mul(0.97).add(l.mul(0.03)),
    h = i[i.length - 1],
    p = h.sub(i[i.length - 2]),
    f = (p.len() < 0.001 ? h.sub(u) : p).norm(),
    d = Math.max(r * 0.04, h.sub(u).len()),
    m = X2(t, h, h.add(f.mul(d * 0.1))),
    g = m.sub(u).norm();
  let y = new q(-g.y, g.x);
  y.dot(n) < 0 && (y = y.mul(-1));
  const _ = Math.max(1, m.sub(u).dot(g)),
    b = [];
  for (let D = 0; D < i.length; D++) {
    const G = j(i[D].sub(u).dot(g) / _, 0, 0.995),
      we = u.mul(1 - G).add(m.mul(G)),
      Ie = i[D].sub(we).dot(y);
    b.push({ t: G, lift: Ie, width: j(a[D], r * 0.008, r * 0.08) });
  }
  const [T, M] = q2(b),
    R = K2(b, r),
    it = 64,
    B = [],
    N = [];
  for (let D = 0; D <= it; D++) {
    const G = D / it,
      we = G * (1 - G) * (T + M * G),
      Ie = (1 - 2 * G) * (T + M * G) + G * (1 - G) * M,
      ae = m.sub(u).add(y.mul(Ie)),
      ce = ae.len();
    let en = ce < 1e-4 ? y : new q(-ae.y / ce, ae.x / ce);
    en.dot(y) < 0 && (en = en.mul(-1));
    const xn = j(G / 0.18, 0, 1),
      lr = xn * xn * (3 - 2 * xn),
      Gr = y
        .mul(1 - lr)
        .add(en.mul(lr))
        .norm(),
      nn = u
        .mul(1 - G)
        .add(m.mul(G))
        .add(y.mul(we)),
      va = R.at(G),
      T1 = Math.sin(Math.PI * G) ** 2,
      ka = va * 0.5 * 0.14 * T1,
      Aa = va * 0.5;
    (B.push(nn.add(Gr.mul(Aa + ka))), N.push(nn.sub(Gr.mul(Aa - ka))));
  }
  ((B[B.length - 1] = m), (N[N.length - 1] = m));
  let K = 2,
    Mt = Number.NEGATIVE_INFINITY;
  for (let D = 2; D < B.length - 2; D++) {
    const G = B[D].dot(n);
    G > Mt && ((Mt = G), (K = D));
  }
  return {
    head: u,
    peak: B[K],
    tail: m,
    lower: N,
    upper: B,
    upperInner: B.slice(0, K + 1),
    upperOuter: B.slice(K),
  };
}
function go(t, e, n) {
  if (Xn(t, n.x, n.y)) return n;
  let r = 0,
    s = 1;
  for (let o = 0; o < 8; o++) {
    const i = (r + s) * 0.5,
      a = e.mul(1 - i).add(n.mul(i));
    Xn(t, a.x, a.y) ? (r = i) : (s = i);
  }
  return e.mul(1 - r).add(n.mul(r));
}
function Gc(t, e, n = !1) {
  const r = Et(t),
    s = e.tail.sub(e.head).norm(),
    o = [],
    i = n ? 5 : 15,
    a = n ? 0.28 : 1;
  for (let c = 0; c < i; c++) {
    const l = ((c + 0.5) / i) * a;
    if (!n && l < 0.22 && c % 2 === 0) continue;
    const u = Pt(e.lower, !1, l)[0],
      h = Pt(e.upper, !1, l)[0],
      p = u.add(h).mul(0.5),
      f = Math.max(t.fw * 0.01, h.sub(u).len()),
      d =
        l < 0.24
          ? r.mul(0.94).add(s.mul(0.12)).norm()
          : l > 0.74
            ? s.mul(0.78).sub(r.mul(0.32)).norm()
            : s.mul(0.58).add(r.mul(0.5)).norm(),
      m = f * (l < 0.24 ? 0.55 : 0.88),
      g = l < 0.24 ? 0.15 : 0.32;
    o.push({
      points: [p.sub(d.mul(m * 0.35)), p.add(d.mul(m * 0.55))],
      alpha: g,
    });
  }
  return o;
}
function yo(t, e, n) {
  return t.map((r, s) =>
    r1({
      points: r.points,
      style: "brow",
      emphasis: n,
      phase: e,
      part: s,
      parts: Math.max(1, t.length),
      role: "ghost",
      ghostAlpha: r.alpha,
    }),
  );
}
function dr(t, e, n, r) {
  return V([t.lower], n, "brow", r, "edge").map((s) => ({
    ...s,
    pathId: `brow-lower-${e}`,
    pathOrder: 0,
  }));
}
function Yr(t, e, n, r) {
  const s = V([t.upperOuter, t.upperInner], n, "brow", r, "edge"),
    o = `brow-upper-${e}`;
  return [
    { ...s[0], pathId: o, pathOrder: 1 },
    { ...s[1], pathId: o, pathOrder: 0 },
  ];
}
function _e(t) {
  return { layers: [t] };
}
function Z2(t, e, n) {
  const r = Et(t),
    s = e.tail.sub(e.head).norm(),
    o = [],
    i = [Ae(t, "right_eye"), Ae(t, "left_eye")],
    a = (l) => i.some((u) => u.length >= 3 && Xn(u, l.x, l.y)),
    c = 22;
  for (let l = 0; l < c; l++) {
    const u = (l + 0.35) / c,
      h = u < 0.3,
      p = u > 0.82;
    if ((h && l % 3 !== 0) || (p && l % 2 === 1)) continue;
    const f = Pt(e.lower, !1, u)[0],
      d = Pt(e.upper, !1, u)[0],
      m = d.sub(f).len();
    if (m < t.fw * 0.003) continue;
    const g = h || p ? 1 : 2,
      y = h
        ? r.mul(0.96).add(s.mul(0.08)).norm()
        : p
          ? s.mul(0.92).add(r.mul(0.16)).norm()
          : s.mul(0.62).add(r.mul(0.48)).norm(),
      _ = h ? u / 0.3 : p ? Math.max(0, 1 - (u - 0.82) / 0.18) : 1,
      b = (h ? 0.08 : p ? 0.11 : 0.18) * _;
    for (let T = 0; T < g; T++) {
      const M = (T + 0.5) / g,
        R = Math.sin(l * 12.9898 + T * 4.7) * 0.1,
        it = f.mul(1 - M).add(d.mul(M)),
        B = d.sub(f).norm(),
        N = go(n, it, it.add(B.mul(m * R))),
        K = m * (h ? 0.72 : p ? 0.42 * _ : 0.64),
        Mt = go(n, N, N.sub(y.mul(K * (h ? 0.12 : 0.28)))),
        D = go(n, N, N.add(y.mul(K * (h ? 0.88 : 0.64))));
      const corners = [t.px[33], t.px[263]],
        nearEye = (q) => corners.some((c) => c && q.sub(c).len() < t.fw * 0.09);
      D.sub(Mt).len() < t.fw * 0.0025 ||
        a(Mt) ||
        a(D) ||
        nearEye(Mt) ||
        nearEye(D) ||
        o.push({
          a: Mt,
          b: D,
          alpha: b,
          widthImg: t.fw * (p ? 0.0022 : h ? 0.0018 : 0.0026),
        });
    }
  }
  return o;
}
function Q2(t, e) {
  const n = e.upper.concat(e.lower.slice().reverse());
  return _e({
    style: "brow",
    fills: [{ points: n, alpha: 0.04 }],
    hairs: Z2(t, e, n),
    lines: [],
    brushes: [],
    head: e.head,
    tail: e.tail,
  });
}
function pr(t, e, n, r) {
  const s = J2(t, e),
    o = r === "points" || r === "lesson" ? 0 : -1,
    i = [s.head, s.peak, s.tail].map((u, h) => ({
      at: u,
      order: h,
      style: "brow",
      emphasis: n,
      phase: o,
    })),
    a = Gc(t, s),
    c = [],
    l = [];
  return (
    r === "points"
      ? l.push("先定眉头、眉峰、眉尾三个点")
      : r === "lower"
        ? (c.push(...dr(s, e, 0, n)), l.push("从眉头沿下缘画到眉尾"))
        : r === "fill"
          ? (c.push(...dr(s, e, -1, n)),
            c.push(...Yr(s, e, 0, n)),
            c.push(...yo(a, 1, n)),
            l.push("上缘从眉峰收到眉尾，再连回眉头"),
            l.push("短笔触顺着毛流填：眉头向上且淡，眉身斜向外，眉尾斜向下"))
          : r === "head"
            ? (c.push(...dr(s, e, -1, n)),
              c.push(...Yr(s, e, -1, n)),
              c.push(...yo(Gc(t, s, !0), 0, n)),
              l.push("眉头向上扫开，笔触要淡，不要留一个方头"))
            : r === "check"
              ? (c.push(...dr(s, e, 0, n)),
                c.push(...Yr(s, e, 0, n)),
                l.push("两边的眉形对一下高低，轮廓要重合"))
              : (c.push(...dr(s, e, 1, n)),
                c.push(...Yr(s, e, 2, n)),
                c.push(...yo(a, 3, n)),
                l.push(
                  "先定眉头、眉峰、眉尾三个点",
                  "从眉头沿下缘画到眉尾",
                  "上缘从眉峰收到眉尾，再连回眉头",
                  "短笔触顺着毛流填：眉头向上且淡，眉身斜向外，眉尾斜向下",
                )),
    { strokes: c, dots: i, captions: l, preview: Q2(t, s) }
  );
}
function ha(t, e, n, r) {
  const s = bt(t, "R_IRIS", e),
    o = Et(t);
  return n.map((i) => {
    const a = i.sub(s),
      c = a.len() < 0.001 ? o : a.norm();
    return i.add(c.mul(r));
  });
}
function fa(t, e) {
  return ar(
    [133, 173, 157, 158, 159, 160, 161, 246, 33].map((n) => Qt(t, n, e)),
    2,
  );
}
function zs(t, e) {
  return [133, 173, 157, 158, 159, 160, 161, 246, 33].map((n) => Qt(t, n, e));
}
function l1(t, e) {
  const n = Et(t),
    r = bt(t, "R_EYE_LOWER_MID", e),
    s = zs(t, e),
    o = s.filter((i) => i.sub(r).dot(n) > t.fw * 0.012);
  return o.length >= 3 ? o : s.slice(2, 7);
}
function t0(t, e, n) {
  const r = zs(t, e);
  if (r.length < 4) return [];
  const s = Et(t),
    o = s.mul(t.fw * 0.004),
    i = Pt(r, !1, 0.68)[0].add(o),
    a = r[r.length - 1].add(o),
    c = bt(t, "R_EYE_INNER", e),
    l = bt(t, "R_EYE_OUTER", e),
    u = Math.max(8, l.sub(c).len()),
    h = l.sub(c).norm(),
    p = Qt(t, 70, e).sub(l).norm();
  let f = h.mul(0.46).add(s.mul(0.54)).add(p.mul(0.1)).norm();
  f.dot(s) < 0.4 && (f = s.mul(0.55).add(h.mul(0.45)).norm());
  const d = a.add(f.mul(u * n * 0.5)),
    m = a.add(f.mul(u * n)),
    g = u * 0.07,
    y = (_) => {
      const b = _.sub(a).dot(s);
      return b >= g ? _ : _.add(s.mul(g - b));
    };
  return [i, a, y(d), y(m)];
}
function e0(t, e, n) {
  const r = zs(t, e),
    s = [];
  if (r.length >= 2) {
    s.push({ points: r, alpha: 0.5, widthImg: t.fw * 0.0024 });
    const i = yn(r, 0.5, 1);
    i.length >= 2 &&
      s.push({ points: i, alpha: 0.24, widthImg: t.fw * 0.0016 });
  }
  const o = t0(t, e, n);
  if (o.length >= 2)
    for (let a = 0; a < 3; a++) {
      const c = yn(o, a / 3, (a + 1) / 3);
      c.length < 2 ||
        s.push({
          points: c,
          alpha: 0.46 * (1 - a * 0.28),
          widthImg: t.fw * (0.0018 - a * 3e-4),
        });
    }
  return _e({ style: "liner", fills: [], hairs: [], lines: s, brushes: [] });
}
function n0(t, e) {
  const n = da(t, e);
  if (n.length < 3) return Re();
  const r = Pt(n, !1, 0.36)[0],
    s = Pt(n, !1, 0.64)[0],
    o = Et(t),
    i = s.sub(r).norm(),
    a = r
      .add(s)
      .mul(0.5)
      .sub(o.mul(t.fw * 0.007));
  return _e({
    style: "highlight",
    fills: [],
    hairs: [],
    lines: [],
    brushes: [
      {
        center: a,
        axis: i,
        perp: i.perpToward(o),
        alongOut: t.fw * 0.028,
        alongIn: t.fw * 0.028,
        across: t.fw * 0.007,
        alpha: 0.16,
      },
    ],
  });
}
function Yo(t, e, n) {
  return Bt(e0(t, e, n), n0(t, e));
}
function da(t, e) {
  return ar(
    [33, 7, 163, 144, 145, 153, 154, 155, 133].map((n) => Qt(t, n, e)),
    2,
  );
}
function r0(t, e, n) {
  const r = bt(t, "R_EYE_LOWER_MID", e),
    s = Qt(t, 70, e),
    o = n.sub(r).norm(),
    i = s.sub(n).norm(),
    a = o.mul(0.5).add(i.mul(0.5)).norm(),
    c = bt(t, "R_EYE_OUTER", e)
      .sub(bt(t, "R_EYE_INNER", e))
      .len();
  return c1(t, n.add(a.mul(c * 0.28)), t.fw * 0.012);
}
function s0(t, e, n) {
  const r = ha(t, e, fa(t, e), t.fw * 0.011),
    s = Pt(r, !1, 0.34)[0],
    o = r[r.length - 1],
    i = yn(r, 0.55, 1),
    a = yn(r, 0.34, 0.55),
    c = r0(t, e, o),
    l = Pt(r, !1, 0.68)[0],
    u = [o, c],
    h = [c, l],
    p = [
      { at: s, order: 0, style: "liner", emphasis: n, phase: 0 },
      { at: o, order: 1, style: "liner", emphasis: n, phase: 0 },
      { at: c, order: 2, style: "liner", emphasis: n, phase: 0 },
    ],
    f = [],
    d = V([i, a], 1, "liner", n, "edge"),
    m = `tight-${e}`;
  return (
    f.push({ ...d[0], pathId: m, pathOrder: 1 }),
    f.push({ ...d[1], pathId: m, pathOrder: 0 }),
    f.push(...V([u], 2, "liner", n, "edge")),
    f.push(...V([h], 3, "liner", n, "edge")),
    f.push(...V([i, a, u, h], 4, "liner", n, "ghost", 0.28)),
    {
      strokes: f,
      dots: p,
      captions: [
        "先点起点、外眼角和眼尾的尖",
        "贴着睫毛根，从中间画到外眼角，再补起点到中间",
        "眼尾下缘，从外眼角拉到尖",
        "眼尾上缘，从尖收回上眼皮约三分之二处",
        "每一段轻轻描一笔，然后只留下轮廓",
      ],
      preview: Yo(t, e, 0.26),
    }
  );
}
function _o(t, e, n, r) {
  const s = [];
  for (let i = 1; i <= 4; i++) {
    const a = Math.min(0.96, 0.25 + i * 0.14),
      c = Pt(t, !1, a)[0];
    s.push([c.sub(r.mul(4)), c.add(r.mul(2))]);
  }
  const o = [];
  for (let i = 0; i <= 2; i++) {
    const a = Pt(e, !1, 0.35 + i * 0.15)[0];
    o.push([a, a.add(n.sub(a).norm().mul(8))]);
  }
  return s.concat(o);
}
function wo(t, e) {
  const n = Et(t),
    r = l1(t, e);
  if (r.length < 3) return Re();
  const s = t.fw * 0.028,
    o = t.fw * 0.024,
    i = r.map((c) => c.add(n.mul(s))),
    a = r.map((c) => c.add(n.mul(s + o)));
  return _e({
    style: "shadow",
    fills: [{ points: a.concat(i.slice().reverse()), alpha: 0.22 }],
    hairs: [],
    lines: [],
    brushes: [],
  });
}
function Hc(t, e) {
  const n = Et(t),
    r = l1(t, e),
    s = yn(r, 0.46, 1);
  if (s.length < 3) return Re();
  const o = t.fw * 0.02,
    i = t.fw * 0.032,
    a = s.map((l) => l.add(n.mul(o))),
    c = s.map((l) => l.add(n.mul(o + i)));
  return _e({
    style: "shadowDeep",
    fills: [{ points: c.concat(a.slice().reverse()), alpha: 0.4 }],
    hairs: [],
    lines: [],
    brushes: [],
  });
}
function Wc(t, e) {
  const n = yn(da(t, e), 0, 0.28);
  return n.length < 2
    ? Re()
    : _e({
        style: "liner",
        fills: [],
        hairs: [],
        lines: [{ points: n, alpha: 0.32, widthImg: t.fw * 0.0012 }],
        brushes: [],
      });
}
function jc(t, e) {
  const n = bt(t, "R_ZYGOMA", e),
    r = Qt(t, 123, e),
    s = Et(t),
    o = r.sub(n).norm(),
    i = n.add(o.mul(t.fw * 0.015)).add(s.mul(t.fw * 0.01));
  return _e({
    style: "highlight",
    fills: [],
    hairs: [],
    lines: [],
    brushes: [
      {
        center: i,
        axis: o,
        perp: o.perpToward(s),
        alongOut: t.fw * 0.05,
        alongIn: t.fw * 0.028,
        across: t.fw * 0.02,
        alpha: 0.26,
      },
    ],
  });
}
function o0(t) {
  const e = t.px[17],
    n = t.px[14],
    r = Et(t),
    s = t.px[61].sub(t.px[291]).norm(),
    o = e.mul(0.72).add(n.mul(0.28));
  return _e({
    style: "highlight",
    fills: [],
    hairs: [],
    lines: [],
    brushes: [
      {
        center: o,
        axis: s,
        perp: s.perpToward(r),
        alongOut: t.fw * 0.026,
        alongIn: t.fw * 0.02,
        across: t.fw * 0.008,
        alpha: 0.14,
      },
    ],
  });
}
function Vc(t, e, n, r, s = !1) {
  const o = Et(t),
    i = t.fw,
    a = ha(t, e, fa(t, e), i * 0.012),
    c = bt(t, "R_EYE_INNER", e),
    l = bt(t, "R_EYE_OUTER", e),
    u = bt(t, "R_IRIS", e),
    h = Qt(t, 105, e),
    p = Qt(t, 70, e),
    f = c.add(Qt(t, 55, e).sub(c).mul(0.38)),
    d = u.add(h.sub(u).mul(0.4)),
    m = l.add(p.sub(l).mul(0.3)),
    g = ar([f, d, m]),
    y = a.slice().reverse(),
    _ = l.sub(c).norm(),
    b = l.add(p.sub(l).mul(0.5)).add(_.mul(i * 0.018)),
    T = Pt(g, !1, 0.72)[0],
    M = [b, T],
    R = [b, a[a.length - 1]],
    it = yn(da(t, e), 0, 0.34),
    B = [],
    N = [],
    K = [],
    Mt = _o(g, a, s ? d : r ? b : d, o);
  return s
    ? (B.push(
        { at: c, order: 0, style: "shadow", emphasis: n, phase: 0 },
        { at: d, order: 1, style: "shadow", emphasis: n, phase: 0 },
        { at: l, order: 2, style: "shadow", emphasis: n, phase: 0 },
        { at: b, order: 3, style: "shadow", emphasis: n, phase: 0 },
      ),
      N.push(...V([g], 1, "shadow", n, "edge")),
      N.push(...V([y], 2, "shadow", n, "edge")),
      N.push(...V([M, R], 3, "shadow", n, "edge")),
      N.push(...V([it], 4, "shadow", n, "edge")),
      N.push(...V(_o(g, a, d, o), 5, "shadow", n, "ghost", 0.26)),
      K.push(
        "点内眼角、褶皱最高点、外眼角和外V",
        "沿褶皱从内眼角画到外眼角",
        "贴着睫毛根上方，把月牙收拢",
        "外三分之一：从V字尖连到褶皱，再连到睫毛根",
        "外眼角下方也可以轻轻带一下",
        "沿褶皱来回晕，再在眼皮上拍开",
      ),
      { strokes: N, dots: B, captions: K, preview: wo(t, e) })
    : r
      ? (B.push(
          { at: c, order: 0, style: "shadow", emphasis: n, phase: -1 },
          { at: d, order: 1, style: "shadow", emphasis: n, phase: -1 },
          { at: l, order: 2, style: "shadow", emphasis: n, phase: -1 },
          { at: b, order: 0, style: "shadow", emphasis: n, phase: 0 },
        ),
        N.push(...V([g, y], -1, "shadow", n, "edge")),
        N.push(...V([M, R], 1, "shadow", n, "edge")),
        N.push(...V([it], 2, "shadow", n, "edge")),
        N.push(...V(Mt.slice(-4), 3, "shadow", n, "ghost", 0.26)),
        K.push(
          "点出外眼角的V字尖",
          "从V字尖连到褶皱，再连到睫毛根",
          "外眼角下方三分之一轻轻带一下",
          "在外侧三分之一拍开、晕开",
        ),
        { strokes: N, dots: B, captions: K, preview: wo(t, e) })
      : (B.push(
          { at: c, order: 0, style: "shadow", emphasis: n, phase: 0 },
          { at: d, order: 1, style: "shadow", emphasis: n, phase: 0 },
          { at: l, order: 2, style: "shadow", emphasis: n, phase: 0 },
        ),
        N.push(...V([g], 1, "shadow", n, "edge")),
        N.push(...V([y], 2, "shadow", n, "edge")),
        N.push(...V(_o(g, a, d, o), 3, "shadow", n, "ghost", 0.26)),
        K.push(
          "点内眼角、褶皱最高点和外眼角",
          "沿褶皱从内眼角画到外眼角",
          "贴着睫毛根上方，把月牙收拢",
          "刷子沿褶皱来回晕，再在眼皮上拍开",
        ),
        { strokes: N, dots: B, captions: K, preview: wo(t, e) });
}
function i0(t) {
  const e = ir(ua("lip_inner").map((n) => t.px[n]));
  return [37, 0, 267, 61, 291, 17, 40, 270, 84, 314].map((n) => {
    const r = t.px[n],
      s = r.sub(e).norm();
    return [r.sub(s.mul(t.fw * 0.02)), r.sub(s.mul(t.fw * 0.006))];
  });
}
function a0(t, e) {
  const n = [
      { at: t.at("CUPID_R"), order: 0, style: "lip", emphasis: e, phase: 0 },
      { at: t.at("CUPID_L"), order: 1, style: "lip", emphasis: e, phase: 0 },
      { at: t.at("UPPER_LIP"), order: 2, style: "lip", emphasis: e, phase: 0 },
      { at: t.at("R_MOUTH"), order: 3, style: "lip", emphasis: e, phase: 0 },
      { at: t.at("L_MOUTH"), order: 4, style: "lip", emphasis: e, phase: 0 },
      { at: t.at("LOWER_LIP"), order: 5, style: "lip", emphasis: e, phase: 0 },
    ],
    r = fr(t, [37, 39, 40, 185, 61]),
    s = fr(t, [267, 269, 270, 409, 291]),
    o = fr(t, [37, 0, 267]),
    i = fr(t, [61, 146, 91, 181, 84, 17]),
    a = fr(t, [291, 375, 321, 405, 314, 17]),
    c = [],
    l = V([r, s, o], 1, "lip", e, "edge");
  (c.push({ ...l[0], pathId: "lip-upper", pathOrder: 0, mergeFlip: !0 }),
    c.push({ ...l[1], pathId: "lip-upper", pathOrder: 2 }),
    c.push({ ...l[2], pathId: "lip-upper", pathOrder: 1 }));
  const u = V([i, a], 2, "lip", e, "edge");
  (c.push({ ...u[0], pathId: "lip-lower", pathOrder: 0 }),
    c.push({ ...u[1], pathId: "lip-lower", pathOrder: 1, mergeFlip: !0 }),
    c.push(...V(i0(t), 3, "lip", e, "ghost", 0.24)));
  const h = Ae(t, "lip_outer"),
    p = Ae(t, "lip_inner");
  return {
    strokes: c,
    dots: n,
    captions: [
      "点两个唇峰、唇谷、两个嘴角和下唇中点",
      "上唇从唇峰画到嘴角，再连过唇谷",
      "下唇从两个嘴角收到中点",
      "从中间向外填，轮廓留在唇线上",
    ],
    preview: _e({
      style: "lip",
      fills: [{ points: h, alpha: 0.6, holes: p.length >= 3 ? [p] : [] }],
      hairs: [],
      lines: [],
      brushes: [],
    }),
  };
}
function pa(t, e) {
  const n = bt(t, "R_CHEEK_1", e)
      .add(bt(t, "R_CHEEK_2", e))
      .mul(0.5),
    s = bt(t, "R_ZYGOMA", e)
      .add(Qt(t, 123, e))
      .mul(0.5)
      .sub(n)
      .norm();
  let o = new q(-s.y, s.x);
  return (o.dot(Et(t)) < 0 && (o = o.mul(-1)), [n, s, o]);
}
function c0(t, e) {
  const [n, r, s] = pa(t, e),
    o = t.fw,
    a = [
      [0.1, 0],
      [0.086, 0.014],
      [0.062, 0.034],
      [0.034, 0.052],
      [0.006, 0.062],
      [-0.02, 0.056],
      [-0.042, 0.04],
      [-0.052, 0.016],
      [-0.048, -0.012],
      [-0.034, -0.04],
      [-0.01, -0.054],
      [0.018, -0.05],
      [0.046, -0.034],
      [0.072, -0.016],
    ].map(([c, l]) => c1(t, n.add(r.mul(c * o)).add(s.mul(l * o)), o * 0.018));
  return ar(a, 3);
}
function l0(t, e, n, r) {
  const s = new q(-n.y, n.x),
    o = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    o.push(t.add(new q(Math.cos(a), Math.sin(a)).mul(r * 0.028)));
  }
  return [
    o.concat([o[0]]),
    [t, t.add(n.mul(r * 0.05)).add(s.mul(r * 0.01))],
    [t.add(n.mul(r * 0.04)), t.add(n.mul(r * 0.09))],
    [t.add(n.mul(r * 0.08)), e],
  ];
}
function u0(t, e, n) {
  const r = c0(t, e),
    s =
      r.length >= 3 && r[0].sub(r[r.length - 1]).len() > 1
        ? r.concat([r[0]])
        : r,
    [o, i] = pa(t, e);
  let a = s[0],
    c = Number.NEGATIVE_INFINITY;
  for (const l of s) {
    const u = l.sub(o).dot(i);
    u > c && ((c = u), (a = l));
  }
  return {
    strokes: [
      ...V([s], 1, "blush", n, "edge"),
      ...V(l0(o, a, i, t.fw), 2, "blush", n, "ghost", 0.26),
    ],
    dots: [
      { at: o, order: 0, style: "blush", emphasis: n, phase: 0 },
      { at: a, order: 1, style: "blush", emphasis: n, phase: 0 },
    ],
    captions: [
      "点苹果肌中心，再点朝太阳穴的那一头",
      "宽头在苹果肌，沿边缘收到太阳穴",
      "先在苹果肌打圈，再向太阳穴扫开",
    ],
    preview: h0(t, e),
  };
}
function h0(t, e) {
  const [n] = pa(t, e),
    o = t.fw,
    i = Et(t);
  let across = bt(t, "R_EYE_OUTER", e).sub(bt(t, "R_EYE_INNER", e));
  across.len() < 1 && (across = new q(1, 0));
  across = across.norm();
  let axis = across.mul(0.9).add(i.mul(0.32)).norm();
  const mid = t.px[1] ? t.px[1].x : n.x;
  (n.x - mid) * axis.x < 0 && (axis = axis.mul(-1));
  let perp = new q(-axis.y, axis.x);
  perp.dot(i) < 0 && (perp = perp.mul(-1));
  const a = n.add(axis.mul(o * 0.012)).sub(i.mul(o * 0.008));
  return _e({
    style: "blush",
    fills: [],
    hairs: [],
    lines: [],
    brushes: [
      {
        center: a,
        axis,
        perp,
        alongOut: o * 0.105,
        alongIn: o * 0.05,
        across: o * 0.034,
        alpha: 0.12,
      },
    ],
  });
}
function f0(t, e, n) {
  const r = Et(t),
    s = ha(t, e, fa(t, e), t.fw * 0.01),
    o = [0.22, 0.55, 0.88].map((c) => Pt(s, !1, c)[0]),
    i = s[s.length - 1].sub(s[0]).norm(),
    a = o.map((c, l) => {
      const u = r
        .mul(0.86)
        .add(i.mul((l - 1) * 0.12))
        .norm();
      return [c, c.add(u.mul(t.fw * (0.03 + l * 0.004)))];
    });
  return {
    strokes: [
      ...V(a, 1, "lash", n, "edge"),
      ...V(a, 2, "lash", n, "ghost", 0.3),
    ],
    dots: o.map((c, l) => ({
      at: c,
      order: l,
      style: "lash",
      emphasis: n,
      phase: 0,
    })),
    captions: [
      "点睫毛根的内、中、外",
      "从根部向上，标出要刷到的方向",
      "顺着这个方向刷，根部多停一下",
    ],
    preview: _e({
      style: "lash",
      fills: [],
      hairs: [],
      brushes: [],
      lines: [{ points: zs(t, e), alpha: 0.16, widthImg: t.fw * 0.0016 }],
    }),
  };
}
function d0(t, e, n) {
  const r = Et(t),
    s = t.fw,
    o = bt(t, "R_EYE_INNER", e).sub(r.mul(s * 0.028)),
    i = bt(t, "R_EYE_LOWER_MID", e).sub(r.mul(s * 0.032)),
    a = bt(t, "R_EYE_OUTER", e).sub(r.mul(s * 0.026)),
    c = ar([o, i, a], 3),
    l = [o, i, a].map((u) => [
      u.sub(r.mul(s * 0.008)),
      u.add(r.mul(s * 0.006)),
    ]);
  return {
    strokes: [
      ...V([c], 1, "skin", n, "edge"),
      ...V(l, 2, "skin", n, "ghost", 0.24),
    ],
    dots: [o, i, a].map((u, h) => ({
      at: u,
      order: h,
      style: "skin",
      emphasis: n,
      phase: 0,
    })),
    captions: [
      "点在眼下发青的内、中、外，别碰到眼睛",
      "把这三点连成眼下的一条",
      "在这一条里拍开",
    ],
    preview: Re(),
  };
}
function $c(t, e, n) {
  const r = [
    t.at("FOREHEAD"),
    t.at("NOSE_TIP"),
    t.at("CHIN"),
    t.at("R_CHEEK_1"),
    t.at("L_CHEEK_1"),
  ];
  return {
    strokes: [],
    dots: r.map((s, o) => ({
      at: s,
      order: o,
      style: "skin",
      emphasis: e,
      phase: 0,
    })),
    captions: [n],
    preview: Re(),
  };
}
function Yc(t, e, n) {
  const r = [
      t.at("FOREHEAD"),
      t.at("NOSE_TIP"),
      t.at("CHIN"),
      t.at("R_CHEEK_2"),
      t.at("L_CHEEK_2"),
    ],
    s = Et(t),
    o = new q(-s.y, s.x),
    i = r.map((a) => [a.sub(o.mul(t.fw * 0.02)), a.add(o.mul(t.fw * 0.02))]);
  return {
    strokes: V(i, 0, "skin", e, "ghost", 0.22),
    dots: r.map((a, c) => ({
      at: a,
      order: c,
      style: "skin",
      emphasis: e,
      phase: -1,
    })),
    captions: [n],
    preview: Re(),
  };
}
function qo(t, e, n, r) {
  return t === "b1_points" || t === "s06_brow_points"
    ? pr(e, n, r, "points")
    : t === "b2_lower" || t === "s07_brow_lower"
      ? pr(e, n, r, "lower")
      : t === "b3_fill" || t === "s08_brow_fill"
        ? pr(e, n, r, "fill")
        : t === "b4_head" || t === "s09_brow_head"
          ? pr(e, n, r, "head")
          : t === "b5_check"
            ? pr(e, n, r, "check")
            : t === "s10_eyeshadow"
              ? Vc(e, n, r, !1)
              : t === "s11_eyeshadow_outer"
                ? Vc(e, n, r, !0)
                : t === "s12_eyeliner"
                  ? s0(e, n, r)
                  : t === "s13_lashes"
                    ? f0(e, n, r)
                    : t === "s14_blush"
                      ? u0(e, n, r)
                      : t === "s15_lips"
                        ? a0(e, r)
                        : t === "s04_concealer"
                          ? d0(e, n, r)
                          : t === "s02_foundation_dots"
                            ? $c(e, r, "额头、鼻尖、下巴和两边脸颊，各点一点")
                            : t === "s03_foundation_blend"
                              ? Yc(e, r, "在这几个点上拍开，不要来回擦")
                              : t === "s05_powder"
                                ? Yc(e, r, "粉扑按在额头、鼻翼两侧和脸颊")
                                : t === "s01_prep"
                                  ? $c(e, r, "薄薄一层，避开眼睛和嘴唇")
                                  : {
                                      strokes: [],
                                      dots: [],
                                      captions: ["照着亮着的位置画"],
                                      preview: Re(),
                                    };
}
function u1(t, e, n, r, s, o, i) {
  const a = e.fw,
    c = n
      .map((u) => u.phase)
      .concat(r.map((u) => u.phase))
      .filter((u) => u >= 0),
    l = (c.length ? Math.max(...c) : 0) + 1;
  return {
    imageWidth: t.imageWidth,
    imageHeight: t.imageHeight,
    faceWidthPx: a,
    yaw: e.yaw,
    strokes: n,
    dots: r,
    oval: es(Ae(e, "face_oval"), a * 0.01),
    eyes: ["right_eye", "left_eye"].map((u) => es(Ae(e, u), a * 0.012)),
    brows: ["right_brow", "left_brow"].map((u) => l2(Ae(e, u), a * 0.004)),
    mouth: es(Ae(e, "lip_inner"), a * 0.002),
    blockBrows: o,
    phaseCount: l,
    captions: s,
    preview: i,
  };
}
function p0(t, e, n, r, s) {
  const o = new Tr(t),
    i = [],
    a = [],
    c = [];
  let l = Re();
  if (
    (e.sides.forEach((u, h) => {
      let p = G2(u.side, e.yaw);
      if ((r === "both_sequential" && h !== s && (p *= 0.36), p < 0.05)) return;
      const f = qo(e.stepId, o, u.side, p);
      (c.length === 0 && c.push(...f.captions),
        i.push(...f.strokes),
        a.push(...f.dots),
        (l = Bt(l, f.preview)));
    }),
    c.length === 0)
  ) {
    const u = qo(e.stepId, o, "RIGHT", 1);
    (c.push(...u.captions),
      i.push(...u.strokes),
      a.push(...u.dots),
      (l = Bt(l, u.preview)));
  }
  return u1(t, o, i, a, c, n !== "brow", l);
}
function m0(t) {
  return t.startsWith("natural_brow")
    ? "soft"
    : t.startsWith("vitality")
      ? "blush"
      : t.startsWith("evening") || t.startsWith("dinner")
        ? "evening"
        : "daily";
}
function lidCrease(t, e) {
  const up = Et(t),
    lid = zs(t, e);
  if (lid.length < 4) return null;
  const brow = bt(t, "R_BROW_LOWER_MID", e),
    mid = lid[Math.min(lid.length - 1, 4)],
    room = Math.max(0, brow.sub(mid).dot(up));
  return {
    up,
    lid,
    crease: Math.min(t.fw * 0.09, Math.max(t.fw * 0.046, room * 0.68)),
  };
}
function lidEllipse(t, e, spec) {
  const span = lidCrease(t, e);
  if (!span) return Re();
  const frame = t.frame(e),
    p = Pt(span.lid, !1, spec.u)[0],
    center = p.add(span.up.mul(span.crease * spec.lift)),
    axis = frame.xAxis,
    perp = axis.perpToward(span.up);
  return _e({
    style: spec.style,
    fills: [],
    hairs: [],
    lines: [],
    brushes: [
      {
        center,
        axis,
        perp,
        alongOut: frame.ew * spec.out,
        alongIn: frame.ew * spec.inn,
        across: Math.max(t.fw * 0.012, span.crease * spec.across),
        alpha: spec.alpha,
      },
    ],
  });
}
function lidWash(t, e) {
  // Gaussian on the mid lid. alongOut is aimed at the canthus and stays
  // inside ~3 sigma of it, so the falloff is an oval, not a corner hair.
  return lidEllipse(t, e, {
    u: 0.4,
    lift: 0.36,
    out: 0.16,
    inn: 0.22,
    across: 0.4,
    alpha: 0.96,
    style: "shadow",
  });
}
function creaseWash(t, e) {
  return lidEllipse(t, e, {
    u: 0.56,
    lift: 0.55,
    out: 0.08,
    inn: 0.1,
    across: 0.24,
    alpha: 0.72,
    style: "shadowDeep",
  });
}
function g0(t, e) {
  const n = new Tr(t),
    r = (a, c, l) => h2(qo(a, n, c, 1).preview, l);
  let s = Re();
  const o = (a, c, l) => {
      s = Bt(s, r(a, c, l));
    },
    i = (a, c) => {
      (o(a, "RIGHT", c), o(a, "LEFT", c));
    },
    wash = (gain, deep) => {
      (s = Bt(s, h2(lidWash(n, "RIGHT"), gain))),
        (s = Bt(s, h2(lidWash(n, "LEFT"), gain))),
        deep > 0 &&
          ((s = Bt(s, h2(creaseWash(n, "RIGHT"), deep))),
          (s = Bt(s, h2(creaseWash(n, "LEFT"), deep))));
    };
  e === "daily"
    ? (i("s08_brow_fill", 0.42),
      wash(1, 0.8),
      i("s14_blush", 0.7),
      o("s15_lips", "CENTER", 0.72))
    : e === "evening"
      ? (i("s08_brow_fill", 0.58),
        wash(1, 1),
        i("s14_blush", 0.95),
        (s = Bt(s, h2(jc(n, "RIGHT"), 0.4))),
        (s = Bt(s, h2(jc(n, "LEFT"), 0.4))),
        o("s15_lips", "CENTER", 1.05))
      : e === "blush"
        ? (i("s08_brow_fill", 0.4), i("s14_blush", 1.05), o("s15_lips", "CENTER", 0.62))
        : (i("s08_brow_fill", 0.48), o("s15_lips", "CENTER", 0.4));
  const built = u1(t, n, [], [], [], !0, s);
  return ((built.look = e), built);
}
function rt(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function L(t, e, n = "") {
  const r = t[e];
  return typeof r == "string" ? r : n;
}
function xe(t, e, n = 0) {
  const r = t[e];
  return typeof r == "number" ? r : n;
}
function _n(t, e, n = !1) {
  const r = t[e];
  return typeof r == "boolean" ? r : n;
}
function qr(t, e) {
  const n = t[e];
  if (!Array.isArray(n)) throw new Error("缺少字段 " + e);
  return n;
}
function Tt(t, e) {
  const n = t[e];
  return Array.isArray(n) ? n : [];
}
function Ks(t) {
  if (t === "FW" || t === "EW") return t;
  throw new Error("未知长度单位：" + t);
}
function h1(t) {
  return t === "preview_only" ? "preview_only" : "persistent";
}
function y0(t) {
  if (
    t === "right" ||
    t === "left" ||
    t === "both_sequential" ||
    t === "both_simultaneous" ||
    t === "center"
  )
    return t;
  throw new Error("未知 side：" + t);
}
function wn(t) {
  if (!rt(t)) throw new Error("无法解析点");
  const e = t.off,
    n = Array.isArray(e) && typeof e[0] == "number" ? e[0] : 0,
    r = Array.isArray(e) && typeof e[1] == "number" ? e[1] : 0,
    s = Ks(L(t, "u", "EW"));
  if (Array.isArray(t.avg))
    return { kind: "avg", names: t.avg.map((o) => String(o)) };
  if (Array.isArray(t.lerp)) {
    const o = t.lerp;
    return {
      kind: "lerp",
      a: String(o[0]),
      b: String(o[1]),
      t: Number(o[2]),
      offX: n,
      offY: r,
      unit: s,
    };
  }
  if (typeof t.lm == "string")
    return { kind: "lm", name: t.lm, offX: n, offY: r, unit: s };
  throw new Error("无法解析点");
}
function _0(t) {
  return t.kind === "lm"
    ? { ...t, name: yr(t.name) }
    : t.kind === "lerp"
      ? { ...t, a: yr(t.a), b: yr(t.b) }
      : { ...t, names: t.names.map(yr) };
}
function w0(t) {
  return {
    center: wn(t.center ?? null),
    rx: xe(t, "rx"),
    ry: xe(t, "ry"),
    rotationDeg: xe(t, "rotationDeg"),
    unit: Ks(L(t, "u", "FW")),
  };
}
function b0(t) {
  return {
    id: L(t, "id"),
    points: Tt(t, "points").map(wn),
    contour: typeof t.contour == "string" ? t.contour : null,
    holes: Tt(t, "holes").map((e) => String(e)),
    feather: xe(t, "feather"),
    unit: Ks(L(t, "u", "EW")),
    fillStyle: L(t, "fillStyle", "color"),
    ellipse: rt(t.ellipse) ? w0(t.ellipse) : null,
  };
}
function E0(t) {
  return {
    id: L(t, "id"),
    points: Tt(t, "points").map(wn),
    contour: typeof t.contour == "string" ? t.contour : null,
    widths: Tt(t, "width").map((e) => Number(e)),
    unit: Ks(L(t, "u", "EW")),
    renderMode: h1(L(t, "renderMode", "persistent")),
    style: L(t, "style", "line"),
  };
}
function v0(t) {
  return {
    id: L(t, "id"),
    at: wn(t.at ?? null),
    style: L(t, "style", "target_dot"),
    renderMode: h1(L(t, "renderMode", "persistent")),
  };
}
function k0(t) {
  return {
    id: L(t, "id"),
    from: wn(t.from ?? null),
    to: wn(t.to ?? null),
    extend: xe(t, "extend"),
    style: L(t, "style", "dashed"),
  };
}
function A0(t) {
  if (!t) return { kind: "none", demoRepeats: 1 };
  const e = Math.max(1, Math.trunc(xe(t, "demoRepeats", 2))),
    n = L(t, "type", "none");
  return n === "brush_stroke"
    ? {
        kind: "brush",
        strokes: Tt(t, "strokes").map((s) => {
          if (!rt(s)) throw new Error("笔画无效");
          const o = L(s, "direction");
          return {
            pathId: L(s, "path"),
            reverse:
              _n(s, "reverse") || o === "reverse" || o === "outer_to_inner",
            segmented: _n(s, "segmented"),
            count: Math.trunc(xe(s, "count", 1)),
          };
        }),
        demoRepeats: e,
      }
    : n === "marker_sequence"
      ? { kind: "markers", ids: Tt(t, "markerIds").map(String), demoRepeats: e }
      : n === "zone_pulse"
        ? { kind: "zone", ids: Tt(t, "zoneIds").map(String), demoRepeats: e }
        : n === "radial"
          ? {
              kind: "radial",
              origin: wn(t.origin ?? null),
              count: Math.trunc(xe(t, "count", 8)),
              demoRepeats: e,
            }
          : { kind: "none", demoRepeats: e };
}
function x0(t) {
  return {
    title: t ? L(t, "title") : "",
    voice: t ? L(t, "voice") : "",
    tip: t ? L(t, "tip") : "",
    mistakes: t ? Tt(t, "commonMistakes").map(String) : [],
  };
}
function M0(t) {
  return {
    type: L(t, "type", "none"),
    optional: _n(t, "optional", !0),
    rubric: L(t, "rubric"),
  };
}
function L0(t, e) {
  const n = e === "eye" || e === "lash";
  return {
    precision: t
      ? L(t, "precision", n ? "high" : "normal")
      : n
        ? "high"
        : "normal",
    freezeOnBlink: t ? _n(t, "freezeOnBlink", n) : n,
    freezeOnOcclusion: t ? _n(t, "freezeOnOcclusion", !0) : !0,
    smoothing: t
      ? L(t, "smoothing", n ? "one_euro_strong" : "one_euro")
      : n
        ? "one_euro_strong"
        : "one_euro",
  };
}
function S0(t) {
  const e = rt(t.geometry) ? t.geometry : null,
    n = L(t, "region", "skin");
  return {
    stepId: L(t, "stepId"),
    title: L(t, "title"),
    region: n,
    tool: L(t, "tool"),
    toolLabel: L(t, "toolLabel", L(t, "tool")),
    side: y0(L(t, "side", "center")),
    mirror: _n(t, "mirror"),
    anchors: Tt(t, "anchors").map(String),
    zones: e ? Tt(e, "zones").filter(rt).map(b0) : [],
    paths: e ? Tt(e, "paths").filter(rt).map(E0) : [],
    markers: e ? Tt(e, "markers").filter(rt).map(v0) : [],
    guides: e ? Tt(e, "guides").filter(rt).map(k0) : [],
    animation: A0(rt(t.animation) ? t.animation : null),
    pressure: L(t, "pressure", "light"),
    blend: L(t, "blend"),
    script: x0(rt(t.script) ? t.script : null),
    estSeconds: Math.trunc(xe(t, "estSeconds")),
    check: rt(t.check) ? M0(t.check) : null,
    tracking: L0(rt(t.tracking) ? t.tracking : null, n),
  };
}
function T0(t) {
  const e = [];
  for (const n of t.split(".")) {
    if (!n) continue;
    const r = n.split("[")[0];
    r && e.push({ kind: "key", name: r });
    const s = /\[(\d+)]/g;
    let o;
    for (; (o = s.exec(n)); ) e.push({ kind: "index", i: Number(o[1]) });
  }
  return e;
}
function ns(t, e, n, r) {
  if (n === e.length) return r;
  const s = e[n];
  if (s.kind === "index") {
    if (!Array.isArray(t)) throw new Error("下标无法写入");
    const i = t.slice();
    if (s.i < 0 || s.i >= i.length) throw new Error("下标越界：" + s.i);
    return ((i[s.i] = ns(i[s.i], e, n + 1, r)), i);
  }
  if (Array.isArray(t)) {
    const i = t.slice(),
      a = i.findIndex((c) => rt(c) && c.id === s.name);
    if (a < 0) throw new Error("找不到 id=" + s.name);
    return ((i[a] = ns(i[a], e, n + 1, r)), i);
  }
  if (!rt(t)) throw new Error("路径无法写入：" + s.name);
  const o = t[s.name] ?? {};
  return { ...t, [s.name]: ns(o, e, n + 1, r) };
}
function R0(t, e) {
  for (const [n, r] of Object.entries(t)) {
    const s = typeof r == "string" ? r : "",
      o = n === "eyeType" ? e.eyeType : n === "faceShape" ? e.faceShape : null;
    if (o === null || o !== s) return !1;
  }
  return !0;
}
function I0(t, e) {
  const n = t.variants;
  if (!Array.isArray(n)) return t;
  let r = t;
  for (const s of n) {
    if (!rt(s) || !rt(r)) continue;
    const o = s.when,
      i = s.override;
    if (!(!rt(o) || !rt(i)) && R0(o, e))
      for (const [a, c] of Object.entries(i)) r = ns(r, T0(a), 0, c);
  }
  return rt(r) ? r : t;
}
function O0(t) {
  return {
    tool: L(t, "tool"),
    label: L(t, "label", L(t, "tool")),
    required: _n(t, "required", !0),
    alt: Tt(t, "alt").map(String),
  };
}
function P0(t, e) {
  const n = JSON.parse(t);
  if (!rt(n)) throw new Error("妆容不是对象");
  const r = qr(n, "steps").map((s) => {
    if (!rt(s)) throw new Error("步骤无效");
    return S0(I0(s, e));
  });
  return {
    lookId: L(n, "lookId"),
    version: L(n, "version", "1.0.0"),
    name: L(n, "name"),
    level: L(n, "level", "beginner"),
    estMinutes: Math.trunc(xe(n, "estMinutes")),
    tags: qr(n, "tags").map(String),
    summary: L(n, "summary"),
    supportedEyeTypes: qr(n, "supportedEyeTypes").map(String),
    kit: qr(n, "kit").filter(rt).map(O0),
    steps: r,
  };
}
function C0(t) {
  return t.startsWith("R_") ? "RIGHT" : t.startsWith("L_") ? "LEFT" : "CENTER";
}
function F0(t) {
  return t.kind === "lm" ? [t.name] : t.kind === "lerp" ? [t.a, t.b] : t.names;
}
function N0(t, e) {
  const n = new Tr(e);
  let r;
  return (
    t.side === "right"
      ? (r = [Sn(t, n, "RIGHT", !1)])
      : t.side === "left"
        ? (r = [Sn(t, n, "LEFT", t.mirror)])
        : t.side === "center"
          ? (r = [Sn(t, n, "CENTER", !1)])
          : t.mirror
            ? (r = [Sn(t, n, "RIGHT", !1), Sn(t, n, "LEFT", !0)])
            : (r = [Sn(t, n, "CENTER", !1)]),
    {
      stepId: t.stepId,
      sides: r,
      animation: t.animation,
      yaw: n.yaw,
      faceWidthPx: n.fw,
    }
  );
}
function Sn(t, e, n, r) {
  const s = e.frame(n),
    o = (f) => (r ? _0(f) : f),
    i = (f) => {
      if (s.side !== "CENTER") return s;
      const d = F0(f).map(C0),
        m = [...new Set(d)];
      return m.length === 1 && m[0] === "RIGHT"
        ? e.right
        : m.length === 1 && m[0] === "LEFT"
          ? e.left
          : s;
    },
    a = (f) => {
      const d = ua(f);
      return r ? d.map((m) => la(m)) : d;
    },
    c = t.zones.map((f) => {
      let d;
      if (f.ellipse) {
        const g = f.ellipse,
          y = o(g.center),
          _ = i(y),
          b = an(y, e, _),
          T = po(g.unit, _);
        d = s2(b, _, g.rx, g.ry, g.rotationDeg, T);
      } else
        f.contour
          ? (d = a(f.contour).map((g) => e.px[g]))
          : (d = f.points.map((g) => {
              const y = o(g);
              return an(y, e, i(y));
            }));
      const m = f.ellipse || d.length < 3 ? d : Vo(d, 7, !0);
      return {
        id: f.id,
        outline: m,
        holes: f.holes.map((g) => {
          const y = a(g).map((_) => e.px[_]);
          return y.length < 3 ? y : Vo(y, 5, !0);
        }),
        featherPx: f.feather * po(f.unit, s),
        fillStyle: f.fillStyle,
      };
    }),
    l = t.paths.map((f) => {
      const d = f.contour
          ? a(f.contour).map((y) => e.px[y])
          : f.points.map((y) => {
              const _ = o(y);
              return an(_, e, i(_));
            }),
        m = po(f.unit, s),
        g = c2(d, f.widths, m);
      return {
        id: f.id,
        points: g.pts,
        widthsPx: g.widths,
        renderMode: f.renderMode,
        style: f.style,
      };
    }),
    u = t.markers.map((f) => {
      const d = o(f.at);
      return {
        id: f.id,
        at: an(d, e, i(d)),
        style: f.style,
        renderMode: f.renderMode,
      };
    }),
    h = t.guides.map((f) => {
      const d = o(f.from),
        m = o(f.to),
        g = an(d, e, i(d)),
        y = an(m, e, i(m)),
        _ = y.add(y.sub(g).mul(f.extend));
      return { id: f.id, from: g, to: _, style: f.style };
    }),
    p = D0(t, e, s, o);
  return { side: n, zones: c, paths: l, markers: u, guides: h, arrows: p };
}
function D0(t, e, n, r) {
  if (t.animation.kind !== "radial") return [];
  const s = an(r(t.animation.origin), e, n),
    o = n.fw * 0.18,
    i = j(t.animation.count, 3, 16),
    a = [];
  for (let c = 0; c < i; c++) {
    const l = (2 * Math.PI * c) / i,
      u = n.xAxis.mul(Math.cos(l)).add(n.yAxis.mul(Math.sin(l)));
    a.push({ from: s.add(u.mul(o * 0.35)), to: s.add(u.mul(o)) });
  }
  return a;
}
function Xs(t, e, n, r) {
  const s = Math.max(n / t, r / e),
    o = t * s,
    i = e * s;
  return { scale: s, dw: o, dh: i, ox: (n - o) / 2, oy: (r - i) / 2 };
}
class bo {
  constructor(e, n, r) {
    ((this.imageWidth = e), (this.imageHeight = n), (this.fit = r));
  }
  map(e) {
    return {
      x: this.fit.ox + (e.x / this.imageWidth) * this.fit.dw,
      y: this.fit.oy + (e.y / this.imageHeight) * this.fit.dh,
    };
  }
  mapLen(e) {
    return (e / Math.max(1, this.imageWidth)) * this.fit.dw;
  }
}
function Kt(t, e, n, r) {
  if (e.length === 0) return;
  const s = n.map(e[0]);
  t.moveTo(s.x, s.y);
  for (let o = 1; o < e.length; o++) {
    const i = n.map(e[o]);
    t.lineTo(i.x, i.y);
  }
  r && t.closePath();
}
function U0(t, e, n) {
  (t.beginPath(), Kt(t, e.oval, n, !0));
  for (const r of e.eyes) Kt(t, r, n, !0);
  if ((Kt(t, e.mouth, n, !0), e.blockBrows))
    for (const r of e.brows) r.length >= 3 && Kt(t, r, n, !0);
  t.clip("evenodd");
}
let Tn = null,
  Rn = null;
function qc() {
  if (Rn != null) return Rn;
  try {
    const t = document.createElement("canvas");
    ((t.width = 1), (t.height = 1));
    const e = t.getContext("2d");
    if (!e) return (Rn = !1);
    ((e.fillStyle = "#c8b8b0"),
      e.fillRect(0, 0, 1, 1),
      (e.globalCompositeOperation = "soft-light"),
      (e.fillStyle = "rgba(180,140,150,0.4)"),
      e.fillRect(0, 0, 1, 1));
    const n = e.getImageData(0, 0, 1, 1).data;
    Rn = n[0] > 80 && n[0] < 230;
  } catch {
    Rn = !1;
  }
  return !!Rn;
}
function B0(t) {
  return t === "highlight"
    ? qc()
      ? "soft-light"
      : "screen"
    : G0()
      ? "multiply"
      : qc()
        ? "soft-light"
        : "source-over";
}
function G0() {
  if (Tn != null) return Tn;
  try {
    const t = document.createElement("canvas");
    ((t.width = 1), (t.height = 1));
    const e = t.getContext("2d");
    if (!e) return (Tn = !1);
    ((e.fillStyle = "#ffffff"),
      e.fillRect(0, 0, 1, 1),
      (e.globalCompositeOperation = "multiply"),
      (e.fillStyle = "#808080"),
      e.fillRect(0, 0, 1, 1));
    const n = e.getImageData(0, 0, 1, 1).data;
    Tn = n[0] < 250 && n[0] > 100;
  } catch {
    Tn = !1;
  }
  return !!Tn;
}
const H0 = new Set([1, 10, 33, 152, 263]);
function W0(t, e, n) {
  for (let r = 0; r < e.length; r++) {
    const s = n.map(e[r]),
      o = H0.has(r);
    (t.beginPath(),
      (t.fillStyle = o ? "#ffb020" : "rgba(90, 230, 255, 0.95)"),
      t.arc(s.x, s.y, o ? 2.6 : 1.15, 0, Math.PI * 2),
      t.fill());
  }
}
const j0 = [
  "blush",
  "highlight",
  "shadow",
  "shadowDeep",
  "brow",
  "lip",
  "liner",
  "lash",
];
function V0(t, e, n, r, s, o, i, a, c, l, u, h, p, f, d = !0) {
  if (
    (t.save(),
    t.clearRect(0, 0, e, n),
    (t.fillStyle = "#100E0C"),
    t.fillRect(0, 0, e, n),
    r && s > 1 && o > 1)
  ) {
    (t.save(), d && (t.translate(e, 0), t.scale(-1, 1)));
    const m = Xs(s, o, e, n);
    (t.drawImage(r, m.ox, m.oy, m.dw, m.dh),
      a &&
        a.preview.layers.length &&
        X0(t, a, new bo(a.imageWidth, a.imageHeight, m), h, p),
      u &&
        i &&
        (i.strokes.length > 0 || i.dots.length > 0) &&
        nf(t, i, c, l, new bo(i.imageWidth, i.imageHeight, m)),
      f && f.length && W0(t, f, new bo(1, 1, m)),
      t.restore());
  }
  t.restore();
}
function zc(t) {
  const e = j0.indexOf(t);
  return e < 0 ? 40 : e;
}
function $0(t, e) {
  const r = e[t === "shadowDeep" ? "shadow" : t];
  return r == null ? 1 : Math.max(0.85, Math.min(1.15, r));
}
const Y0 = {
  brow: 0.34,
  shadow: 0.22,
  shadowDeep: 0.42,
  liner: 0.58,
  lash: 0.28,
  blush: 0.32,
  lip: 0.72,
  highlight: 0.34,
};
function f1(t, e) {
  return Math.max(0, Math.min(Y0[t] ?? 0.2, e));
}
function q0(t) {
  const e = kr(t, 9073504, 0.62),
    n = (r, s) => Math.max(s, (e >> r) & 255);
  return (n(16, 108) << 16) | (n(8, 90) << 8) | n(0, 78);
}
function z0(t, e, n) {
  const r = (s, o, i) => Math.max(o, Math.min(i, e.mapLen(n * s)));
  return t === "brow"
    ? r(0.028, 5, 9)
    : t === "lip"
      ? r(0.008, 1.6, 2.4)
      : t === "shadow" || t === "shadowDeep"
        ? r(0.012, 3, 5)
        : r(0.02, 4, 8);
}
function K0(t, e, n, r) {
  if (!(r === "blush" || r === "highlight")) {
    if ((t.beginPath(), Kt(t, e.oval, n, !0), r === "lip"))
      Kt(t, e.mouth, n, !0);
    else if (r === "brow") for (const s of e.eyes) Kt(t, s, n, !0);
    else {
      for (const s of e.eyes) Kt(t, s, n, !0);
      if ((Kt(t, e.mouth, n, !0), r !== "liner" && r !== "lash"))
        for (const s of e.brows) s.length >= 3 && Kt(t, s, n, !0);
    }
    t.clip("evenodd");
  }
}
const GlStyles = new Set([
  "lip",
  "liner",
  "lash",
  "shadow",
  "shadowDeep",
  "blush",
  "highlight",
]);
function X0(t, e, n, r, s) {
  const o = e.preview.layers.slice().sort((i, a) => zc(i.style) - zc(a.style));
  for (const i of o) {
    t.save();
    K0(t, e, n, i.style);
    let used = !1;
    if (GlStyles.has(i.style)) {
      try {
        used = renderGlPigment(t, e, n, i, s);
      } catch (err) {
        (console.warn("WebGL makeup", err), (used = !1));
      }
    }
    used || X0Layer(t, e, n, r, s, i);
    t.restore();
  }
}
function X0Layer(t, e, n, r, s, i) {
  const a = i.style === "brow" ? q0(r) : N2(i.style),
    c = $0(i.style, s),
    l = B0(i.style),
    u = l === "source-over" ? 0.4 : 1,
    h = (p) => f1(i.style, p * c * u);
  (t.save(), K0(t, e, n, i.style), (t.globalCompositeOperation = l));
  for (const p of i.fills)
    i.style === "lip"
      ? J0(t, n, p, a, h(p.alpha))
      : Z0(t, n, p, a, h(p.alpha), z0(i.style, n, e.faceWidthPx), i);
  for (const p of i.brushes) Q0(t, n, p, a, h(p.alpha));
  for (const p of i.lines) {
    const f = i.style === "liner" || i.style === "lash",
      d = f
        ? Math.max(
            i.style === "liner" ? 1.15 : 0.7,
            Math.min(i.style === "liner" ? 1.65 : 1.15, n.mapLen(p.widthImg)),
          )
        : Math.max(
            1.2,
            Math.min(i.style === "shadow" ? 8 : 2.2, n.mapLen(p.widthImg)),
          ),
      m = f ? 0.7 : Math.min(6, d);
    ef(t, p.points, n, a, h(p.alpha), d, m);
  }
  (i.hairs.length && tf(t, n, i, a, c * u), t.restore());
}
let wt = null;
function Dr(t, e) {
  if (t < 2 || e < 2 || t > 1600 || e > 1600) return null;
  (wt || (wt = document.createElement("canvas")),
    (wt.width !== t || wt.height !== e) && ((wt.width = t), (wt.height = e)));
  const n = wt.getContext("2d", { willReadFrequently: !0 });
  return n
    ? (n.setTransform(1, 0, 0, 1, 0, 0),
      (n.globalCompositeOperation = "source-over"),
      n.clearRect(0, 0, t, e),
      n)
    : null;
}
function rs(t, e, n, r, s) {
  if (e.length !== 0) {
    t.moveTo(e[0].x - n, e[0].y - r);
    for (let o = 1; o < e.length; o++) t.lineTo(e[o].x - n, e[o].y - r);
    s && t.closePath();
  }
}
function Kc(t, e, n, r) {
  const s = Math.round(r);
  if (s < 1) return;
  const o = new Float32Array(e * n);
  for (let a = 0; a < o.length; a++) o[a] = t[a * 4 + 3];
  const i = new Float32Array(o.length);
  for (let a = 0; a < n; a++) {
    const c = a * e;
    for (let l = 0; l < e; l++) {
      let u = 0,
        h = 0;
      const p = Math.max(0, l - s),
        f = Math.min(e - 1, l + s);
      for (let d = p; d <= f; d++) ((u += o[c + d]), h++);
      i[c + l] = u / h;
    }
  }
  for (let a = 0; a < e; a++)
    for (let c = 0; c < n; c++) {
      let l = 0,
        u = 0;
      const h = Math.max(0, c - s),
        p = Math.min(n - 1, c + s);
      for (let f = h; f <= p; f++) ((l += i[f * e + a]), u++);
      t[(c * e + a) * 4 + 3] = l / u;
    }
}
function Xc(t, e, n) {
  let r = 1 / 0;
  for (let s = 0; s < n.length; s++) {
    const o = n[s],
      i = n[(s + 1) % n.length],
      a = i.x - o.x,
      c = i.y - o.y,
      l = a * a + c * c,
      u =
        l < 1e-8
          ? 0
          : Math.max(0, Math.min(1, ((t - o.x) * a + (e - o.y) * c) / l));
    r = Math.min(r, Math.hypot(t - (o.x + a * u), e - (o.y + c * u)));
  }
  return r;
}
function J0(t, e, n, r, s) {
  if (n.points.length < 3 || s < 0.02) return;
  const o = n.points.map((M) => e.map(M)),
    i = (n.holes ?? [])
      .map((M) => M.map((R) => e.map(R)))
      .filter((M) => M.length >= 3);
  let a = 1 / 0,
    c = 1 / 0,
    l = -1 / 0,
    u = -1 / 0;
  for (const M of o)
    ((a = Math.min(a, M.x)),
      (c = Math.min(c, M.y)),
      (l = Math.max(l, M.x)),
      (u = Math.max(u, M.y)));
  ((a = Math.floor(a - 2)),
    (c = Math.floor(c - 2)),
    (l = Math.ceil(l + 2)),
    (u = Math.ceil(u + 2)));
  const h = l - a,
    p = u - c,
    f = Dr(h, p);
  if (!f || !wt) return;
  const d = f.getImageData(0, 0, h, p),
    m = d.data,
    g = (r >> 16) & 255,
    y = (r >> 8) & 255,
    _ = r & 255,
    b = 2.05,
    T = 2.2;
  for (let M = 0; M < p; M++)
    for (let R = 0; R < h; R++) {
      const it = a + R + 0.5,
        B = c + M + 0.5;
      if (!zo(o, it, B) || i.some((ce) => zo(ce, it, B))) continue;
      const N = Xc(it, B, o);
      let K = N;
      for (const ce of i) K = Math.min(K, Xc(it, B, ce));
      const Mt = Math.min(1, N / b),
        D = Math.min(1, K / T),
        G = Mt * Mt * (3 - 2 * Mt),
        we = D * D * (3 - 2 * D),
        Ie = G * we;
      if (Ie < 0.04) continue;
      const ae = (M * h + R) * 4;
      ((m[ae] = g),
        (m[ae + 1] = y),
        (m[ae + 2] = _),
        (m[ae + 3] = Math.round(s * Ie * 255)));
    }
  (f.putImageData(d, 0, 0), t.drawImage(wt, a, c));
}
function Z0(t, e, n, r, s, o, i) {
  if (n.points.length < 3 || s < 0.02) return;
  const a = n.points.map((b) => e.map(b)),
    c = (n.holes ?? []).map((b) => b.map((T) => e.map(T)));
  let l = 1 / 0,
    u = 1 / 0,
    h = -1 / 0,
    p = -1 / 0;
  for (const b of a)
    ((l = Math.min(l, b.x)),
      (u = Math.min(u, b.y)),
      (h = Math.max(h, b.x)),
      (p = Math.max(p, b.y)));
  const f = Math.ceil(o * 2 + 2);
  ((l = Math.floor(l - f)),
    (u = Math.floor(u - f)),
    (h = Math.ceil(h + f)),
    (p = Math.ceil(p + f)));
  const d = h - l,
    m = p - u,
    g = Dr(d, m);
  if (!g || !wt) return;
  (g.beginPath(), rs(g, a, l, u, !0));
  for (const b of c) b.length >= 3 && rs(g, b, l, u, !0);
  ((g.fillStyle = "#fff"), g.fill("evenodd"));
  const y = g.getImageData(0, 0, d, m),
    _ = Math.max(1, Math.round(o * 0.55));
  if (
    (Kc(y.data, d, m, _),
    Kc(y.data, d, m, _),
    g.putImageData(y, 0, 0),
    c.length)
  ) {
    ((g.globalCompositeOperation = "destination-out"), g.beginPath());
    for (const b of c) b.length >= 3 && rs(g, b, l, u, !0);
    ((g.fillStyle = "#000"), g.fill());
  }
  if (i.head && i.tail && i.style === "brow") {
    const b = e.map(i.head),
      T = e.map(i.tail);
    g.globalCompositeOperation = "destination-in";
    const M = g.createLinearGradient(b.x - l, b.y - u, T.x - l, T.y - u);
    (M.addColorStop(0, "rgba(0,0,0,0)"),
      M.addColorStop(0.3, "rgba(0,0,0,0.08)"),
      M.addColorStop(0.48, "rgba(0,0,0,1)"),
      M.addColorStop(0.86, "rgba(0,0,0,0.75)"),
      M.addColorStop(1, "rgba(0,0,0,0.12)"),
      (g.fillStyle = M),
      g.fillRect(0, 0, d, m));
  }
  ((g.globalCompositeOperation = "source-in"),
    (g.fillStyle = he(r, Math.max(0, Math.min(0.86, s)))),
    g.fillRect(0, 0, d, m),
    t.drawImage(wt, l, u));
}
function Q0(t, e, n, r, s) {
  if (s < 0.02) return;
  const o = e.map(n.center),
    i = e.map(n.center.add(n.axis.mul(40))),
    a = e.map(n.center.add(n.perp.mul(40)));
  let c = i.x - o.x,
    l = i.y - o.y;
  const u = Math.hypot(c, l) || 1;
  ((c /= u), (l /= u));
  let h = a.x - o.x,
    p = a.y - o.y;
  const f = Math.hypot(h, p) || 1;
  ((h /= f), (p /= f));
  const d = Math.max(6, e.mapLen(n.alongOut)),
    m = Math.max(3, e.mapLen(n.alongIn)),
    g = Math.max(2.2, e.mapLen(n.across)),
    y = Math.max(d, m, g) * 2.5,
    _ = Math.floor(o.x - y),
    b = Math.floor(o.y - y),
    T = Math.ceil(y * 2),
    M = Math.ceil(y * 2),
    R = Dr(T, M);
  if (!R || !wt) return;
  const it = R.getImageData(0, 0, T, M),
    B = it.data,
    N = (r >> 16) & 255,
    K = (r >> 8) & 255,
    Mt = r & 255,
    D = Math.max(0, Math.min(0.78, s));
  for (let G = 0; G < M; G++)
    for (let we = 0; we < T; we++) {
      const Ie = _ + we + 0.5 - o.x,
        ae = b + G + 0.5 - o.y,
        ce = Ie * c + ae * l,
        en = Ie * h + ae * p,
        xn = ce >= 0 ? d : m,
        lr = Math.exp(-(ce * ce) / (xn * xn) - (en * en) / (g * g));
      if (lr < 0.045) continue;
      const Gr = D * lr,
        nn = (G * T + we) * 4;
      ((B[nn] = N),
        (B[nn + 1] = K),
        (B[nn + 2] = Mt),
        (B[nn + 3] = Math.round(Gr * 255)));
    }
  (R.putImageData(it, 0, 0), t.drawImage(wt, _, b));
}
function tf(t, e, n, r, s) {
  const o = n.hairs.map((d) => ({
    a: e.map(d.a),
    b: e.map(d.b),
    alpha: f1("brow", d.alpha * s),
    width: Math.max(0.65, Math.min(1.05, e.mapLen(d.widthImg))),
  }));
  let i = 1 / 0,
    a = 1 / 0,
    c = -1 / 0,
    l = -1 / 0;
  for (const d of o)
    ((i = Math.min(i, d.a.x, d.b.x)),
      (a = Math.min(a, d.a.y, d.b.y)),
      (c = Math.max(c, d.a.x, d.b.x)),
      (l = Math.max(l, d.a.y, d.b.y)));
  const u = 6;
  ((i = Math.floor(i - u)), (a = Math.floor(a - u)));
  const h = Math.ceil(c - i + u * 2),
    p = Math.ceil(l - a + u * 2),
    f = Dr(h, p);
  if (!(!f || !wt)) {
    for (const d of o) {
      const m = (g, y) => {
        (f.beginPath(),
          f.moveTo(d.a.x - i, d.a.y - a),
          f.lineTo(d.b.x - i, d.b.y - a),
          (f.strokeStyle = he(r, y)),
          (f.lineWidth = g),
          (f.lineCap = "round"),
          f.stroke());
      };
      m(d.width, d.alpha);
    }
    t.drawImage(wt, i, a);
  }
}
function ef(t, e, n, r, s, o, i) {
  if (e.length < 2 || s < 0.02) return;
  const a = e.map((y) => n.map(y));
  let c = 1 / 0,
    l = 1 / 0,
    u = -1 / 0,
    h = -1 / 0;
  for (const y of a)
    ((c = Math.min(c, y.x)),
      (l = Math.min(l, y.y)),
      (u = Math.max(u, y.x)),
      (h = Math.max(h, y.y)));
  const p = Math.ceil(o + i + 2);
  ((c = Math.floor(c - p)), (l = Math.floor(l - p)));
  const f = Math.ceil(u - c + p * 2),
    d = Math.ceil(h - l + p * 2),
    m = Dr(f, d);
  if (!m || !wt) return;
  const g = (y, _) => {
    (m.beginPath(),
      rs(m, a, c, l, !1),
      (m.strokeStyle = he(r, Math.max(0, Math.min(0.9, _)))),
      (m.lineWidth = y),
      (m.lineCap = "round"),
      (m.lineJoin = "round"),
      m.stroke());
  };
  (g(o + i, s * 0.22),
    g(o + i * 0.45, s * 0.4),
    g(Math.max(0.8, o), s),
    t.drawImage(wt, c, l));
}
function nf(t, e, n, r, s) {
  const o = Math.min(1.28, Math.max(0.72, r));
  (t.save(), U0(t, e, s), (t.globalCompositeOperation = "source-over"));
  const i = new Set(
      e.strokes.filter((l) => l.role === "edge").map((l) => l.phase),
    ),
    a = [],
    c = [];
  for (const l of f2(e, n))
    l.points.length < 2 ||
      (l.ghost
        ? (t.beginPath(),
          Kt(t, l.points, s, !1),
          (t.strokeStyle = he(Un(l.style), Math.min(0.45, l.alpha))),
          (t.lineWidth = 2.2 * o),
          (t.lineCap = "round"),
          (t.lineJoin = "round"),
          t.setLineDash([]),
          t.stroke(),
          a.push(l))
        : (rf(
            t,
            l.points,
            s,
            l.style,
            l.alpha,
            l.solid,
            o,
            s.mapLen(l.dashShiftImg),
            s.mapLen(o1(l.points)),
          ),
          l.solid && c.push(l)));
  if (!n.settled) {
    for (const l of c) Jc(t, l.points, s, l.style, o);
    if (a.length) {
      const l = Math.min(a.length - 1, Math.floor(n.progress * a.length));
      Jc(t, a[l].points, s, a[l].style, o);
    }
  }
  for (const l of e.dots) {
    const u = Math.max(
        1,
        e.dots.filter((f) => f.phase === l.phase && f.emphasis === l.emphasis)
          .length,
      ),
      h = y2(l, n, i, u);
    if (h < 0.04) continue;
    const p = _2(l, n, i, u) ? 1 + 0.1 * Math.sin(n.pulse * Math.PI * 2) : 1;
    sf(t, l.at, s, l.style, l.emphasis, h * p, o);
  }
  t.restore();
}
function Jc(t, e, n, r, s) {
  const o = e[e.length - 1];
  if (!o) return;
  const i = n.map(o),
    a = 7.5 * s,
    c = t.createRadialGradient(i.x, i.y, 0, i.x, i.y, a);
  (c.addColorStop(0, he(Un(r), 0.62)),
    c.addColorStop(0.45, he(Un(r), 0.28)),
    c.addColorStop(1, he(Un(r), 0)),
    t.beginPath(),
    t.arc(i.x, i.y, a, 0, Math.PI * 2),
    (t.fillStyle = c),
    t.fill());
}
function rf(t, e, n, r, s, o, i, a, c) {
  const l = v2 * i,
    u = k2 * i,
    h = A2 * i,
    p = M2 * i,
    f = L2 * i,
    d = a < 0.5 ? g2(c, p, f) : { on: p, gap: f, phase: 0 },
    m = d.on + d.gap,
    g = m <= 0.1 ? 0 : (((a + d.phase) % m) + m) % m,
    y = r === "brow" ? "butt" : "round",
    _ = (b, T, M, R) => {
      (t.save(),
        t.translate(b, T),
        t.beginPath(),
        Kt(t, e, n, !1),
        (t.strokeStyle = R),
        (t.lineWidth = M),
        (t.lineCap = y),
        (t.lineJoin = "round"),
        o
          ? t.setLineDash([])
          : (t.setLineDash([d.on, d.gap]), (t.lineDashOffset = g)),
        t.stroke(),
        t.restore());
    };
  (_(h * 0.35, h, u, he(O2(), Math.min(0.28, T2 * s))),
    _(0, 0, l, he(I2(r), Math.min(0.96, S2 * s))));
}
function sf(t, e, n, r, s, o, i) {
  const a = n.map(e),
    c = x2 * i * o,
    l = Math.min(1, Math.max(0.2, s));
  (t.beginPath(),
    t.arc(a.x, a.y, c, 0, Math.PI * 2),
    (t.strokeStyle = he(16052198, 0.9 * l)),
    (t.lineWidth = 0.7 * i),
    t.setLineDash([]),
    t.stroke(),
    t.beginPath(),
    t.arc(a.x, a.y, c * 0.4, 0, Math.PI * 2),
    (t.fillStyle = he(Un(r), 0.55 * l)),
    t.fill());
}
function of(t, e, n, r) {
  if (e.length < 3 || t.width < 2) return _r;
  const s = t.getContext("2d", { willReadFrequently: !0 });
  if (!s) return _r;
  let o = n,
    i = r,
    a = 0,
    c = 0;
  for (const _ of e)
    ((o = Math.min(o, _.x)),
      (i = Math.min(i, _.y)),
      (a = Math.max(a, _.x)),
      (c = Math.max(c, _.y)));
  if (
    ((o = Math.max(0, Math.floor(o))),
    (i = Math.max(0, Math.floor(i))),
    (a = Math.min(t.width - 1, Math.ceil(a))),
    (c = Math.min(t.height - 1, Math.ceil(c))),
    a - o < 2 || c - i < 2)
  )
    return _r;
  const l = s.getImageData(o, i, a - o + 1, c - i + 1).data,
    u = [],
    h = Math.max(1, Math.floor((a - o) / 8)),
    p = Math.max(1, Math.floor((c - i) / 6)),
    f = a - o + 1;
  for (let _ = i; _ <= c; _ += p)
    for (let b = o; b <= a; b += h) {
      if (!zo(e, b, _)) continue;
      const T = ((_ - i) * f + (b - o)) * 4;
      u.push((l[T] << 16) | (l[T + 1] << 8) | l[T + 2]);
    }
  if (u.length < 6) return _r;
  const d = (_) => {
    const b = (_ >> 16) & 255,
      T = (_ >> 8) & 255,
      M = _ & 255;
    return (b * 3 + T * 6 + M) / 10;
  };
  u.sort((_, b) => d(_) - d(b));
  const m = Math.max(1, Math.floor(u.length * 0.45)),
    g = u.slice(0, m).filter((_) => {
      const b = d(_);
      return b >= 18 && b <= 190;
    }),
    y = g.length ? g : u;
  return af(y[Math.floor(y.length / 2)]);
}
function af(t) {
  const e = (t >> 16) & 255,
    n = (t >> 8) & 255,
    r = t & 255,
    s = (e * 3 + n * 6 + r) / 10;
  return s > 165
    ? kr(t, 6967364, 0.55)
    : s < 30
      ? kr(t, 5916220, 0.4)
      : kr(t, 5127220, 0.12);
}
function kr(t, e, n) {
  const r = (s) => {
    const o = (t >> s) & 255,
      i = (e >> s) & 255;
    return Math.max(0, Math.min(255, Math.round(o + (i - o) * n)));
  };
  return (r(16) << 16) | (r(8) << 8) | r(0);
}
function zo(t, e, n) {
  let r = !1,
    s = t.length - 1;
  for (let o = 0; o < t.length; o++) {
    const i = t[o].y,
      a = t[s].y,
      c = t[o].x,
      l = t[s].x;
    (i > n != a > n &&
      e < ((l - c) * (n - i)) / (a - i + 1e-12) + c &&
      (r = !r),
      (s = o));
  }
  return r;
}
function cf(t, e, n) {
  return kr(t, e, Math.min(1, Math.max(0, n)));
}
const Ko = new URLSearchParams(location.search).get("debug") === "1";
Ko && document.body.classList.add("debug-hits");
const lf = [
  "looks/natural_brow.json",
  "looks/daily_commute.json",
  "looks/vitality_blush.json",
  "looks/evening_glam.json",
];
function ma(t) {
  return new URL(t, document.baseURI).href;
}
function uf(t) {
  return t === "skin"
    ? "底妆"
    : t === "brow"
      ? "眉毛"
      : t === "eye"
        ? "眼妆"
        : t === "lash"
          ? "睫毛"
          : t === "cheek"
            ? "脸颊"
            : t === "lip"
              ? "嘴唇"
              : t === "finish"
                ? "检查"
                : "这一步";
}
function d1(t) {
  return t === "light" ? "力度轻" : t === "medium" ? "力度适中" : t;
}
function hf(t) {
  return t === "monolid"
    ? "单眼皮"
    : t === "inner_double"
      ? "内双"
      : t === "double"
        ? "双眼皮"
        : t;
}
function ff(t) {
  return t === "round" ? "偏圆" : t === "long" ? "偏长" : "标准";
}
function df(t) {
  return t === "too_far"
    ? "再靠近一点，让脸占画面一半左右"
    : t === "too_close"
      ? "稍微远一点"
      : t === "turned"
        ? "请正对镜头"
        : null;
}
function Rr(t) {
  return t instanceof Error
    ? (t.name ? t.name + ": " : "") + t.message
    : String(t);
}
const St = document.querySelector("#app"),
  S = document.createElement("video"),
  Js = document.createElement("div");
Js.className = "cam-hold";
Js.setAttribute("aria-hidden", "true");
S.className = "cam";
S.muted = !0;
S.defaultMuted = !0;
S.autoplay = !0;
S.playsInline = !0;
S.controls = !1;
S.setAttribute("muted", "");
S.setAttribute("playsinline", "");
S.setAttribute("webkit-playsinline", "");
S.setAttribute("x5-playsinline", "true");
S.setAttribute("x5-video-player-type", "h5-page");
S.setAttribute("x5-video-player-fullscreen", "false");
S.setAttribute("x5-video-orientation", "portrait");
S.disablePictureInPicture = !0;
S.disableRemotePlayback = !0;
Js.appendChild(S);
document.body.appendChild(Js);
const mt = document.createElement("canvas"),
  Zc = mt.getContext("2d", { willReadFrequently: !0 }),
  cn = document.createElement("canvas"),
  pf = cn.getContext("2d");
let Me = 0,
  fe = !1,
  Ur = !1,
  bn = !0,
  p1 = !1,
  ga = "",
  ya = 0,
  _a = 0,
  En = null,
  Qc = 0,
  tl = 0,
  te = 0,
  ee = 0,
  Xo = !1,
  Jo = 0,
  P = "start",
  dn = [],
  le = {
    eyeType: localStorage.getItem("eyeType") || "double",
    faceShape: localStorage.getItem("faceShape") || "oval",
  },
  Be = localStorage.getItem("intensity") || "medium",
  Je = null,
  Jn = null,
  Rt = 0,
  Gt = 0,
  Zo = null,
  Eo = "home",
  Zt = null,
  de = "",
  gs = "正在准备人脸模型…",
  Le = "",
  Xt = "",
  ze = null,
  vn = !1,
  ss = !1,
  el = -1,
  kn = !0,
  Ar = !1,
  m1 = "ok",
  C = null,
  lt = null,
  On = null,
  Bn = null,
  g1 = {},
  vo = null,
  ko = null,
  ue = null,
  zr = "",
  ht = null,
  lastRawPx = null,
  lastFiltPx = null,
  Qo = _r,
  wa = 0,
  ys = !1,
  Ao = !1,
  Fe = !1,
  y1 = 0,
  ba = 0,
  hn = null,
  ti = "",
  _s = 0;
function Br() {
  return dn.find((t) => t.lookId === Je) ?? null;
}
function pn() {
  var t;
  return ((t = Br()) == null ? void 0 : t.steps[Rt]) ?? null;
}
function mf() {
  const t = pn();
  return t
    ? t.side === "left"
      ? "LEFT"
      : t.side === "right"
        ? "RIGHT"
        : t.side === "both_sequential"
          ? Gt === 0
            ? "RIGHT"
            : "LEFT"
          : "CENTER"
    : "CENTER";
}
function wr() {
  ((wa = performance.now()), (ys = !1), (hn = null), (Fe = !1));
}
function Ir() {
  ((Gt = 0), (C = null), (lt = null), (On = null), (Bn = null), wr());
  const t = Br();
  t &&
    (localStorage.setItem("progressLook", t.lookId),
    localStorage.setItem("progressStep", String(Rt)));
}
async function _1() {
  const t = [];
  for (const e of lf) {
    const n = await fetch(ma(e));
    if (!n.ok) throw new Error("读不到妆容 " + e);
    t.push(P0(await n.text(), le));
  }
  dn = t;
}
function gf() {
  const t = globalThis.OffscreenCanvas;
  if (typeof t != "function") return;
  const e = t.prototype;
  if (e.__glPatched) return;
  e.__glPatched = !0;
  const n = e.getContext;
  e.getContext = function (r, s) {
    try {
      const c = n.call(this, r, s);
      if (c) return c;
    } catch {}
    if (r !== "webgl" && r !== "webgl2" && r !== "experimental-webgl")
      try {
        return n.call(this, r, s);
      } catch {
        return null;
      }
    this.__glHost || (this.__glHost = document.createElement("canvas"));
    const o = this.__glHost;
    ((o.width = this.width || 1), (o.height = this.height || 1));
    const i = r;
    let a = o.getContext(i, s);
    if (!a && s) {
      const c = { ...s };
      (delete c.failIfMajorPerformanceCaveat,
        delete c.powerPreference,
        (a = o.getContext(i, c)));
    }
    return (
      !a &&
        r === "webgl2" &&
        (a = o.getContext("webgl", s) || o.getContext("webgl")),
      a
    );
  };
  for (const r of ["width", "height"]) {
    const s = Object.getOwnPropertyDescriptor(e, r);
    !(s != null && s.set) ||
      !s.configurable ||
      Object.defineProperty(e, r, {
        configurable: !0,
        enumerable: s.enumerable,
        get: s.get,
        set(o) {
          (s.set.call(this, o), this.__glHost && (this.__glHost[r] = o));
        },
      });
  }
}
function yf() {
  try {
    const e = document.createElement("canvas").getContext("webgl2");
    if (!e) return !1;
    const n = e.createShader(e.VERTEX_SHADER);
    return n
      ? (e.shaderSource(
          n,
          "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }",
        ),
        e.compileShader(n),
        e.getShaderParameter(n, e.COMPILE_STATUS) === !0)
      : !1;
  } catch {
    return !1;
  }
}
async function nl(t, e) {
  const n = ma("models/face_landmarker.task");
  return et.createFromOptions(t, {
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: !0,
    baseOptions: { modelAssetPath: n, delegate: e },
  });
}
async function w1() {
  gf();
  try {
    const t = await on.forVisionTasks(ma("mediapipe/wasm"));
    if (!Xo && yf())
      try {
        ((Zt = await wf(nl(t, "GPU"), 15e3)), (Le = "GPU"));
      } catch (n) {
        (console.warn("GPU delegate failed", n), (Zt = null));
      }
    (Zt || ((Zt = await nl(t, "CPU")), (Le = "CPU")),
      (gs = Le === "GPU" ? "人脸模型已就绪（GPU）" : "人脸模型已就绪（CPU）"),
      (de = ""));
  } catch (t) {
    ((de = "人脸模型：" + Rr(t)), (gs = de));
  }
  X();
}
async function _f(t) {
  if (!(Le === "CPU" || Xo)) {
    (console.warn("falling back to CPU", t), (Xo = !0), (Jo = 0));
    try {
      Zt == null || Zt.close();
    } catch {}
    ((Zt = null),
      (Le = ""),
      (C = null),
      (ht = null),
      (fe = !1),
      (ue = null),
      await w1());
  }
}
function wf(t, e) {
  return new Promise((n, r) => {
    const s = window.setTimeout(() => r(new Error("初始化超时")), e);
    t.then(
      (o) => {
        (clearTimeout(s), n(o));
      },
      (o) => {
        (clearTimeout(s), r(o));
      },
    );
  });
}
function openFixtureStream(motion) {
  const c = document.createElement("canvas");
  ((c.width = 720), (c.height = 960));
  const g = c.getContext("2d");
  if (!g || typeof c.captureStream != "function") return null;
  const paint = () => paintFixture(g, c.width, c.height, performance.now() / 1000, motion);
  return (paint(), setInterval(paint, 33), c.captureStream(30));
}
function openPhotoStream(url) {
  const c = document.createElement("canvas");
  ((c.width = 720), (c.height = 1280));
  const g = c.getContext("2d");
  const img = new Image();
  const paint = () => {
    if (!g || !img.complete || !img.naturalWidth) return;
    const s = Math.min(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const dw = img.naturalWidth * s,
      dh = img.naturalHeight * s;
    (g.setTransform(1, 0, 0, 1, 0, 0),
      (g.fillStyle = "#c4b2a4"),
      g.fillRect(0, 0, c.width, c.height),
      g.drawImage(img, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh));
  };
  return (
    (img.onload = paint),
    (img.src = url),
    setInterval(paint, 80),
    c.captureStream(12)
  );
}
async function bf() {
  const fq = new URLSearchParams(location.search);
  const photo = fq.get("photo");
  if (photo) {
    const stream = openPhotoStream(photo);
    if (stream) return stream;
  }
  if (fq.get("fixture") === "1") {
    const stream = openFixtureStream(fq.get("motion") !== "0");
    if (stream) return stream;
  }
  const t = {
    facingMode: { ideal: "user" },
    width: { ideal: 720 },
    height: { ideal: 1280 },
  };
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: !1, video: t });
  } catch (e) {
    const n = e instanceof DOMException ? e.name : "";
    if (n === "OverconstrainedError" || n === "ConstraintNotSatisfiedError")
      return navigator.mediaDevices.getUserMedia({
        audio: !1,
        video: { facingMode: "user" },
      });
    throw e;
  }
}
let camGen = 0,
  playP = null,
  camTail = Promise.resolve(),
  frameLoop = 0;
function stopTracks(stream) {
  if (!stream || typeof stream.getTracks != "function") return;
  for (const tr of stream.getTracks()) {
    try {
      tr.stop();
    } catch {}
  }
}
function isPlayAbort(e) {
  return !!e && e.name === "AbortError";
}
function enqueueCam(fn) {
  const run = camTail.then(fn, fn);
  camTail = run.then(
    () => {},
    () => {},
  );
  return run;
}
async function settlePlay() {
  const p = playP;
  if (!p) return;
  try {
    await p;
  } catch {}
}
async function playAttached(gen) {
  await settlePlay();
  if (gen !== camGen) return false;
  let p;
  try {
    p = S.play();
  } catch (e) {
    if (gen !== camGen || isPlayAbort(e)) return false;
    throw e;
  }
  playP = p;
  p.catch(() => {});
  try {
    await p;
    return gen === camGen;
  } catch (e) {
    if (gen !== camGen || isPlayAbort(e)) return false;
    throw e;
  } finally {
    if (playP === p) playP = null;
  }
}
function detachVideo() {
  try {
    S.pause();
  } catch {}
  if (S.srcObject) S.srcObject = null;
  try {
    S.load();
  } catch {}
}
function leaveCamera() {
  const gen = ++camGen;
  vn = false;
  const stream = ze;
  ze = null;
  return enqueueCam(async () => {
    if (gen !== camGen) return;
    stopTracks(stream);
    await settlePlay();
    if (gen !== camGen) return;
    detachVideo();
  });
}
async function startCamera(t) {
  const gen = ++camGen;
  Xt = "";
  vn = false;
  await settlePlay();
  if (gen !== camGen) return;
  const old = ze;
  ze = null;
  stopTracks(old);
  await settlePlay();
  if (gen !== camGen) return;
  detachVideo();
  let stream = null;
  try {
    stream = await bf();
    if (gen !== camGen) {
      stopTracks(stream);
      return;
    }
    ze = stream;
    S.srcObject = stream;
    let ok = await playAttached(gen);
    if (gen !== camGen) return;
    if (!ok && !document.hidden) ok = await playAttached(gen);
    if (gen !== camGen) return;
    if (!ok && !document.hidden) {
      if (ze === stream) {
        ze = null;
        stopTracks(stream);
        detachVideo();
      }
      return;
    }
    vn = !document.hidden;
    A1();
    P = t;
    cr();
    if (vn) E1();
  } catch (e) {
    if (gen !== camGen || isPlayAbort(e)) return;
    if (ze === stream) {
      ze = null;
      stopTracks(stream);
    }
    const n = e instanceof DOMException ? e.name : "";
    n === "NotAllowedError" || n === "PermissionDeniedError"
      ? (Xt =
          "相机：没有允许使用相机。请在 Safari 的网站设置里允许相机，然后重新点「开始化妆」。")
      : n === "NotFoundError"
        ? (Xt = "相机：这台设备没有可用的摄像头。")
        : n === "NotReadableError"
          ? (Xt = "相机：摄像头被别的应用占用了。" + Rr(e))
          : (Xt = "相机：" + Rr(e));
  }
  if (gen === camGen) X();
}
function b1(t = "home") {
  return enqueueCam(() => startCamera(t));
}
function E1() {
  const token = ++frameLoop;
  Ao = !0;
  const t = (n) => {
    if (token !== frameLoop || !vn) {
      if (token === frameLoop) Ao = !1;
      return;
    }
    (sl(n), requestAnimationFrame(t));
  };
  requestAnimationFrame(t);
  const e = () => {
    if (token !== frameLoop || !vn) return;
    sl(performance.now());
    const n = S.requestVideoFrameCallback;
    typeof n == "function" && n.call(S, e);
  };
  typeof S.requestVideoFrameCallback == "function" &&
    S.requestVideoFrameCallback(e);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    vn = false;
    try {
      S.pause();
    } catch {}
    return;
  }
  if (!ze) return;
  vn = true;
  void playAttached(camGen).catch(() => {});
  E1();
});
function cr() {
  const t = window.visualViewport,
    e = t ? t.height : window.innerHeight,
    n = t ? t.width : window.innerWidth;
  ((St.style.position = "fixed"),
    (St.style.top = "0px"),
    (St.style.left = "0px"),
    (St.style.right = "auto"),
    (St.style.bottom = "auto"),
    (St.style.width = `${Math.round(n)}px`),
    (St.style.height = `${Math.round(e)}px`),
    ws());
}
window.addEventListener("resize", cr);
window.addEventListener("orientationchange", () => {
  (Ur || (fe = !1), (ue = null), cr());
});
var cl;
(cl = window.visualViewport) == null || cl.addEventListener("resize", cr);
var ll;
(ll = window.visualViewport) == null || ll.addEventListener("scroll", cr);
cr();
function sn(t) {
  return Number.isFinite(t) ? String(Math.round(t * 1e3) / 1e3) : "-";
}
function Ef(t, e, n, r, s) {
  let o = document.querySelector("#debug-readout");
  o ||
    ((o = document.createElement("pre")),
    (o.id = "debug-readout"),
    (o.className = "debug-readout"),
    document.body.appendChild(o));
  const i = te > 1 && ee > 1 ? Xs(te, ee, t, e) : null,
    a = En == null ? "—" : En ? "是" : "否",
    c = [
      `facing ${ga || "-"}`,
      `track ${ya || "-"}x${_a || "-"}`,
      `video ${S.videoWidth}x${S.videoHeight}`,
      `locked rot ${Me} ${Ur ? "manual" : "auto"} mirror ${bn ? "on" : "off"}`,
      `头朝上？ ${a}`,
      `oriented ${te}x${ee}`,
      `view ${t}x${e} canvas ${n}x${r}`,
      `dpr ${sn(window.devicePixelRatio || 1)} cap ${sn(s)}`,
      i
        ? `cover s ${sn(i.scale)} ox ${sn(i.ox)} oy ${sn(i.oy)} dw ${sn(i.dw)} dh ${sn(i.dh)} mirror`
        : "cover -",
      `analysis ${mt.width}x${mt.height} ${Le || "-"} dots ${(ht == null ? void 0 : ht.length) ?? 0}`,
      "cyan 478  amber 1 10 33 152 263",
      "red outline = button hit box",
    ];
  o.textContent = c.join(`
`);
}
let rl = 0;
function sl(t) {
  !vn ||
    document.hidden ||
    t - rl < 8 ||
    ((rl = t),
    (P === "guide" || P === "tryon") && S.readyState >= 2 && L1(),
    v1(t),
    If(t));
}
function v1(t) {
  const e = document.querySelector("#view");
  if (!e) return;
  const n = Math.min(window.devicePixelRatio || 1, 3),
    r = e.clientWidth,
    s = e.clientHeight;
  if (r < 2 || s < 2) return;
  const o = Math.round(r * n),
    i = Math.round(s * n);
  (e.width !== o || e.height !== i) && ((e.width = o), (e.height = i));
  const a = e.getContext("2d");
  if (!a) return;
  a.setTransform(n, 0, 0, n, 0, 0);
  const c = k1(t),
    l = (P === "tryon" || Fe) && !!lt && s1(lt.preview);
  y1 = l ? 1 : 0;
  const u = P === "guide" && t > ba && !Fe && !kn && fe,
    h = te > 1 && ee > 1 ? cn : null;
  (V0(
    a,
    r,
    s,
    h,
    te,
    ee,
    C,
    l ? lt : null,
    c,
    H2(Be),
    u,
    Qo,
    g1,
    Ko ? ht : null,
    bn,
  ),
    Ko && Ef(r, s, o, i, n));
  const p = document.querySelector("[data-live]");
  p && Of(p, c);
  const f = document.querySelector("[data-try-status]");
  f &&
    (f.textContent =
      !fe && S.readyState >= 2
        ? "正在对准画面"
        : kn
          ? "没有看到脸，请正对镜头"
          : "这是画完的样子。步骤里按住「看效果」也是这一层。");
}
function vf(t) {
  C && !ys && ((ys = !0), (wa = t));
}
function k1(t) {
  if ((vf(t), hn)) return hn;
  const e = (C == null ? void 0 : C.phaseCount) ?? 1,
    n = ys ? t - wa : 0,
    r = Math.min(14, n / 1e3),
    s = (t % 1400) / 1400,
    o = Math.max(1, e),
    i = r / 1.55;
  if (i >= o - 0.02) return { phase: 99, progress: 1, pulse: s, settled: !0 };
  const a = Math.max(0, Math.min(o - 1, Math.floor(i)));
  return {
    phase: a,
    progress: Math.max(0, Math.min(1, i - a)),
    pulse: s,
    settled: !1,
  };
}
function A1() {
  var n;
  const t = ze == null ? void 0 : ze.getVideoTracks()[0],
    e =
      ((n = t == null ? void 0 : t.getSettings) == null ? void 0 : n.call(t)) ??
      {};
  ((ga = e.facingMode || "user"),
    (ya = e.width || 0),
    (_a = e.height || 0),
    !p1 && e.facingMode === "environment" && (bn = !1));
}
function kf() {
  const t = window.visualViewport,
    e = t ? t.width : window.innerWidth;
  return (t ? t.height : window.innerHeight) + 1 >= e;
}
function Af(t, e) {
  const n = t > e,
    r = kf();
  return r && n ? 270 : !r && e > t ? 90 : 0;
}
function xf() {
  const t = S.videoWidth,
    e = S.videoHeight;
  if (!(t < 2 || e < 2)) {
    if (!Ur) {
      const n = Af(t, e);
      (!fe || n !== Me) && ((Me = n), (ue = null), (ht = null), (C = null));
    }
    fe = !0;
  }
}
function x1() {
  const t = [0, 90, 180, 270],
    e = Math.max(0, t.indexOf(Me));
  ((Me = t[(e + 1) % t.length]),
    (Ur = !0),
    (fe = !0),
    (ue = null),
    (ht = null),
    (C = null),
    (En = null));
}
function M1() {
  ((bn = !bn), (p1 = !0));
}
function Mf(t, e, n) {
  return n === 90 || n === 270 ? { w: e, h: t } : { w: t, h: e };
}
function Lf(t, e, n, r, s) {
  const o = t.canvas;
  (t.setTransform(1, 0, 0, 1, 0, 0),
    t.clearRect(0, 0, o.width, o.height),
    s === 90
      ? (t.translate(o.width, 0), t.rotate(Math.PI / 2))
      : s === 180
        ? (t.translate(o.width, o.height), t.rotate(Math.PI))
        : s === 270 && (t.translate(0, o.height), t.rotate(-Math.PI / 2)),
    t.drawImage(e, 0, 0, n, r),
    t.setTransform(1, 0, 0, 1, 0, 0));
}
function ol(t) {
  let e = 1,
    n = 1,
    r = 0,
    s = 0;
  for (const a of t) {
    if (
      !Number.isFinite(a.x) ||
      !Number.isFinite(a.y) ||
      a.x < -0.08 ||
      a.x > 1.08 ||
      a.y < -0.08 ||
      a.y > 1.08
    )
      return !1;
    (a.x < e && (e = a.x),
      a.y < n && (n = a.y),
      a.x > r && (r = a.x),
      a.y > s && (s = a.y));
  }
  const o = r - e,
    i = s - n;
  return o > 0.08 && i > 0.08 && o < 0.98 && i < 0.98;
}
function L1() {
  const t = S.videoWidth,
    e = S.videoHeight;
  if (t < 2 || e < 2) return !1;
  ((t !== Qc || e !== tl) &&
    ((Qc = t), (tl = e), (ue = null), (ht = null), (C = null), (En = null)),
    A1(),
    xf());
  const n = Me,
    r = Mf(t, e, n);
  ((cn.width !== r.w || cn.height !== r.h) &&
    ((cn.width = r.w), (cn.height = r.h)),
    Lf(pf, S, t, e, n),
    (te = r.w),
    (ee = r.h),
    (Me = n));
  const s = Math.min(1, 480 / Math.max(r.w, r.h)),
    o = Math.max(2, Math.round(r.w * s)),
    i = Math.max(2, Math.round((r.h * o) / r.w));
  return (
    (mt.width !== o || mt.height !== i) && ((mt.width = o), (mt.height = i)),
    Zc.setTransform(1, 0, 0, 1, 0, 0),
    Zc.drawImage(cn, 0, 0, o, i),
    !0
  );
}
const Sf = {
  brow: [105, 334],
  blush: [50, 280],
  lip: [13, 14],
  shadow: [159, 386],
  liner: [145, 374],
  lash: [159, 386],
};
function Tf() {
  if (!ht || mt.width < 2) return;
  const t = mt.getContext("2d", { willReadFrequently: !0 });
  if (!t) return;
  const e = {};
  for (const [n, r] of Object.entries(Sf)) {
    let s = 0,
      o = 0;
    for (const a of r) {
      const c = ht[a];
      if (!c) continue;
      const l = Math.max(0, Math.min(mt.width - 1, Math.round(c.x * mt.width))),
        u = Math.max(0, Math.min(mt.height - 1, Math.round(c.y * mt.height))),
        h = t.getImageData(l, u, 1, 1).data;
      ((s += (h[0] * 0.3 + h[1] * 0.59 + h[2] * 0.11) / 255), o++);
    }
    const i = o ? s / o : 0.5;
    e[n] = Math.max(0.85, Math.min(1.15, 1 + 0.3 * (0.5 - i)));
  }
  g1 = e;
}
function Rf(t, e) {
  var r;
  if (_s % 6 !== 0) return;
  const n =
    (r =
      lt == null
        ? void 0
        : lt.preview.layers.find((s) => s.style === "brow" && s.fills[0])) ==
    null
      ? void 0
      : r.fills[0];
  (n && (Qo = cf(Qo, of(mt, n.points, t, e), 0.18)), Tf());
}
async function If(t) {
  var r, s, o;
  const boot = new URLSearchParams(location.search);
  const fixture = boot.get("fixture") === "1";
  const photo = boot.get("photo");
  const synthetic = fixture && !photo;
  if (
    ss ||
    (!synthetic && !Zt) ||
    S.readyState < 2 ||
    (P !== "guide" && P !== "tryon") ||
    !L1()
  )
    return;
  const e = mt.width,
    n = mt.height;
  ss = !0;
  try {
    const i = Math.max(el + 1, t);
    el = i;
    const a = synthetic
      ? {
          faceLandmarks: [
            fixtureLandmarks(i / 1e3, new URLSearchParams(location.search).get("motion") !== "0"),
          ],
          faceBlendshapes: [],
        }
      : Zt.detectForVideo(mt, i);
    _s++;
    const c = (r = a.faceLandmarks) == null ? void 0 : r[0];
    if (!(!!c && c.length >= 478 && ol(c))) {
      (c &&
        c.length >= 478 &&
        !ol(c) &&
        Le === "GPU" &&
        (Jo++, Jo >= 3 && _f("landmarks outside the frame")),
        (kn = !0),
        (Ar = !c),
        (C = null),
        (lt = null),
        (En = null));
      return;
    }
    const u = c[10],
      h = c[152];
    ((En = !!u && !!h && h.y - u.y > 0.04 && h.y - u.y > Math.abs(h.x - u.x)),
      (kn = !1));
    const p = (P === "tryon" ? Jn : Je) || "",
      f = P === "guide" ? pn() : null;
    if ((P === "guide" && !f) || !p) return;
    const d = {};
    for (const R of ((o = (s = a.faceBlendshapes) == null ? void 0 : s[0]) ==
    null
      ? void 0
      : o.categories) ?? [])
      d[R.categoryName ?? ""] = R.score ?? 0;
    const m = c.map((R) => new q(R.x, R.y)),
      g = m.map((R) => new q(R.x * e, R.y * n)),
      y = new Tr({ points: m, imageWidth: e, imageHeight: n });
    if (f) {
      const R = mf(),
        it =
          f.tracking.freezeOnBlink &&
          (f.side === "both_simultaneous"
            ? mo(d, "RIGHT") || mo(d, "LEFT")
            : mo(d, R)),
        B = f.anchors.map((K) => qs(K)),
        N =
          f.tracking.freezeOnOcclusion &&
          vo != null &&
          D2(vo, g, B, y.fw * 0.18);
      if (it || N) {
        if (((Ar = !0), On && ko)) {
          const K = U2(ko, g, Cc);
          ((C = Fc(On, K)), Bn && (lt = Fc(Bn, K)));
        }
        return;
      }
      (!ue || zr !== f.tracking.smoothing) &&
        ((ue = new Bc(478, Dc(f.tracking.smoothing))),
        (zr = f.tracking.smoothing));
    } else
      (!ue || zr !== "one_euro") &&
        ((ue = new Bc(478, Dc("one_euro"))), (zr = "one_euro"));
    if (((Ar = !1), !ue)) return;
    const smoothedPx = ue.smooth(g, i / 1e3);
    ((lastRawPx = g), (lastFiltPx = smoothedPx));
    const b = smoothedPx.map((R) => new q(R.x / e, R.y / n));
    ht = b;
    const T = { points: b, imageWidth: e, imageHeight: n };
    if (f) {
      const R = N0(f, T),
        it = p0(T, R, f.region, f.side, Gt);
      ((C = it), (On = it));
    } else ((C = null), (On = null));
    const M = g0(T, m0(p));
    ((lt = M),
      (Bn = M),
      (ko = Cc.map((R) => g[R])),
      (vo = g),
      (m1 = B2(new Tr(T))),
      Rf(e, n));
  } catch (i) {
    de = "人脸模型：" + Rr(i);
  } finally {
    ((ss = !1), (P === "guide" || P === "tryon") && v1(performance.now()));
  }
}
function Of(t, e) {
  const n = pn(),
    r = Br(),
    s = (r == null ? void 0 : r.steps.length) ?? 1,
    o = (n == null ? void 0 : n.script.voice) ?? "",
    a =
      (C && !e.settled && e.phase >= 0 && e.phase < C.captions.length
        ? C.captions[e.phase]
        : "") || o,
    c =
      performance.now() < ba
        ? "引导藏起来 3 秒，看真实妆面"
        : !fe && S.readyState >= 2
          ? "正在对准画面"
          : kn
            ? "没有看到脸，请正对镜头"
            : Ar
              ? "位置已锁定，手拿开之后会继续跟"
              : df(m1),
    l = t.querySelector("[data-phase]");
  l && (l.textContent = c || a);
  const u = t.querySelector("[data-side]");
  u &&
    (n == null ? void 0 : n.side) === "both_sequential" &&
    (u.textContent = Gt === 0 ? "先画亮着的这一侧" : "换到另一侧，跟着高亮走");
  const h = t.querySelector("[data-intensity]");
  h && (h.textContent = `提示强度 ${a1(Be)}，长按标题可换`);
  const p = t.querySelector("[data-tool]");
  if (p && n) {
    const m =
      n.side === "both_sequential"
        ? Gt === 0
          ? " · 先画这一侧"
          : " · 换另一侧"
        : "";
    p.textContent = `${n.toolLabel} · ${d1(n.pressure)}${m}`;
  }
  const f = t.querySelector("[data-bar]");
  f && (f.style.width = `${((Rt + 1) / s) * 100}%`);
  const d = t.querySelector("[data-err]");
  if (d) {
    const m = [de, Xt].filter(Boolean).join(`
`);
    ((d.textContent = m), (d.style.display = m ? "block" : "none"));
  }
  ws();
}
function Pf() {
  const t = document.querySelector(".stage");
  if (!t || te < 2 || ee < 2) return null;
  const e = t.clientWidth,
    n = t.clientHeight;
  return e < 2 || n < 2 ? null : { viewW: e, viewH: n, fit: Xs(te, ee, e, n) };
}
function Cf(t, e) {
  const n = t.x / Math.max(1, mt.width),
    r = t.y / Math.max(1, mt.height);
  return { x: e.viewW - (e.fit.ox + n * e.fit.dw), y: e.fit.oy + r * e.fit.dh };
}
function il(t, e) {
  if (t.length <= e) return t.slice();
  const n = [];
  for (let r = 0; r < e; r++)
    n.push(t[Math.round((r * (t.length - 1)) / (e - 1))]);
  return n;
}
const Ff = [
  70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 300, 293, 334, 296, 336, 285, 295,
  282, 283, 276,
];
function Nf(t, e, n, r) {
  const s = r.ox + t.x * r.dw;
  return { x: bn ? e - s : s, y: r.oy + t.y * r.dh };
}
function S1(t, e) {
  if (!ht || ht.length < 478 || t < 2 || e < 2 || te < 2 || ee < 2) return null;
  const n = Xs(te, ee, t, e);
  let r = 1 / 0,
    s = 1 / 0,
    o = -1 / 0,
    i = -1 / 0,
    a = 1 / 0;
  for (let y = 0; y < ht.length; y++) {
    const _ = Nf(ht[y], t, e, n);
    (_.x < r && (r = _.x),
      _.y < s && (s = _.y),
      _.x > o && (o = _.x),
      _.y > i && (i = _.y),
      Ff.includes(y) && _.y < a && (a = _.y));
  }
  const c = Math.max(1, o - r),
    l = Math.max(1, i - s),
    u = c * 0.15,
    h = l * 0.15,
    p = Math.min(s, a),
    f = Math.max(l * 0.15, l * 0.46),
    d = p - f,
    m = i + h,
    g = { left: r, top: s, right: o, bottom: i, width: c, height: l };
  return {
    left: r - u,
    right: o + u,
    top: d,
    bottom: m,
    width: c,
    height: m - d,
    raw: g,
  };
}
function ei(t, e) {
  return t.right - t.left < 1 ||
    t.bottom - t.top < 1 ||
    e.right - e.left < 1 ||
    e.bottom - e.top < 1
    ? !1
    : t.left < e.right &&
        t.right > e.left &&
        t.top < e.bottom &&
        t.bottom > e.top;
}
function ni(t, e) {
  const n = t.getBoundingClientRect(),
    r = e.getBoundingClientRect();
  return {
    left: n.left - r.left,
    top: n.top - r.top,
    right: n.right - r.left,
    bottom: n.bottom - r.top,
    width: n.width,
    height: n.height,
  };
}
function al(t, e) {
  (t.classList.toggle("hud-compact", e),
    (t.style.top = "auto"),
    (t.style.bottom = "auto"),
    (t.style.height = "auto"),
    (t.style.maxHeight = "none"));
  const n = t.scrollHeight;
  return ((t.style.height = ""), n);
}
function ws() {
  const t = document.querySelector(".stage"),
    e = t == null ? void 0 : t.querySelector(".hud"),
    n = document.querySelector(".dock");
  if (!t || !e || !n) return;
  const r = t.clientWidth,
    s = t.clientHeight;
  if (r < 2 || s < 2) return;
  const o = 8,
    i = 10,
    a = n.offsetHeight + o,
    c = al(e, !1),
    l = al(e, !0),
    u = S1(r, s),
    h = u ? u.top - i - o : s,
    p = u ? s - a - o - u.bottom : s - a - i;
  let f = !1,
    d = !1;
  (h >= c
    ? (d = !0)
    : p >= c
      ? (d = !1)
      : h >= l
        ? ((f = !0), (d = !0))
        : ((f = !0), (d = !1)),
    e.classList.toggle("hud-compact", f),
    (e.style.maxHeight = "none"),
    d
      ? ((e.style.top = `${i}px`), (e.style.bottom = "auto"))
      : ((e.style.top = "auto"), (e.style.bottom = `${a}px`)),
    u &&
      ei(ni(e, t), u) &&
      (e.classList.toggle("hud-compact", !0),
      (e.style.top = "auto"),
      (e.style.bottom = `${a}px`),
      (e.style.maxHeight = "none")));
}
function X() {
  if (P === "guide") {
    ((St.innerHTML = Wf()), qf());
    return;
  }
  if (P === "tryon") {
    ((St.innerHTML = Uf()), $f());
    return;
  }
  (P === "start"
    ? (St.innerHTML = Df())
    : P === "home"
      ? (St.innerHTML = Gf())
      : P === "prep"
        ? (St.innerHTML = Hf())
        : P === "settings"
          ? (St.innerHTML = Vf())
          : (St.innerHTML = jf()),
    Yf());
}
function Df() {
  const t = (e, n, r) =>
    `<button class="card" type="button" data-try="${e}"><h2>${n}</h2><p>${r}</p></button>`;
  return `<section class="screen scroll">
    <h1>化妆相机</h1>
    <p class="muted">先选一个妆，看画在脸上的效果。满意了再跟着一步步画。</p>
    <p class="muted" style="margin-top:12px">${_t(de || gs)}</p>
    ${Xt ? `<p class="rose" style="margin-top:8px">${_t(Xt)}</p>` : ""}
    <div class="stack" style="margin-top:16px">
      ${t("daily_commute_v1", "日常通勤", "贴着睫毛的眼线和一点眼尾，卧蚕浅浅的。唇色中间深，边上淡出去。")}
      ${t("evening_glam_v1", "晚宴精致", "两层眼影、眼线和短眼尾，腮红上一点高光，嘴唇像薄薄一层唇釉。")}
      ${t("natural_brow_v1", "自然眉", "只补眉毛，嘴唇一点颜色。")}
      ${t("vitality_blush_v1", "元气腮红", "腮红比日常多一点，嘴唇只染一层。")}
    </div>
    <button class="btn block" id="start" style="margin-top:16px">开始化妆</button>
    <div class="row" style="margin-top:10px">
      <button class="text-btn" id="rotate" type="button">旋转画面</button>
      <button class="text-btn" id="flip" type="button">翻转画面</button>
    </div>
    <p class="muted" style="margin-top:14px">Safari 里可以用「添加到主屏幕」，全屏打开。</p>
  </section>`;
}
function Uf() {
  const t = dn.find((n) => n.lookId === Jn),
    e = (t == null ? void 0 : t.name) ?? "试妆";
  return `<div class="stage">
    <canvas id="view"></canvas>
    <div class="dock tryon-dock">
      <p class="kicker">试妆 · ${_t(e)}</p>
      <p class="muted tryon-note" data-try-status>正在对准画面</p>
      <button class="btn block" id="follow" type="button">开始跟着画</button>
      <div class="row">
        <button class="text-btn" id="back" type="button">换一个妆</button>
        <button class="text-btn" id="rotate" type="button">旋转画面</button>
        <button class="text-btn" id="flip" type="button">翻转画面</button>
      </div>
    </div>
  </div>`;
}
async function Bf(t) {
  if (((Jn = t), (Je = t), (lt = null), (Bn = null), !ze)) {
    await b1("tryon");
    return;
  }
  ((P = "tryon"), X());
}
function Gf() {
  const t = localStorage.getItem("progressLook"),
    e = Number(localStorage.getItem("progressStep") || "0"),
    n = dn.find((i) => i.lookId === t),
    r = dn.filter((i) => i.steps.length <= 8),
    s = dn.filter((i) => i.steps.length > 8),
    o = (i) => `<button class="card" data-look="${_t(i.lookId)}">
      <div class="row"><h2 style="flex:1">${_t(i.name)}</h2><span class="rose">${i.steps.length} 步</span></div>
      <p>${_t(i.summary)}</p>
      <div class="meta">${i.tags.map(_t).join("  ·  ")}  ·  约 ${i.estMinutes} 分钟</div>
    </button>`;
  return `<section class="screen scroll">
    <div class="row">
      <div style="flex:1">
        <h1>化妆相机</h1>
        <p class="muted">选一个妆，线会画在你自己的脸上。</p>
      </div>
      <button class="text-btn" id="settings">设置</button>
    </div>
    <p class="cyan" id="profile" style="margin-top:8px">眼型 ${hf(le.eyeType)} · 脸型 ${ff(le.faceShape)}</p>
    ${de ? `<p class="rose">${_t(de)}</p>` : `<p class="muted">${_t(gs)}</p>`}
    ${Xt ? `<p class="rose">${_t(Xt)}</p>` : ""}
    ${n ? `<button class="btn block" id="resume" style="margin-top:16px;background:#1c1714;color:#f6f0e8">继续「${_t(n.name)}」· 第 ${e + 1} 步</button>` : ""}
    <h3 class="muted" style="margin:22px 0 8px">单项</h3>
    <div class="stack">${r.map(o).join("")}</div>
    <h3 class="muted" style="margin:22px 0 8px">完整妆</h3>
    <div class="stack">${s.map(o).join("")}</div>
  </section>`;
}
function Hf() {
  const t = dn.find((n) => n.lookId === Zo);
  if (!t) return '<section class="screen"><p>没有这个妆容</p></section>';
  const e = t.kit
    .map(
      (n) => `<label class="check"><input type="checkbox" />
        <span><b>${_t(n.label)}${n.required ? "" : "（可跳过）"}</b><br/>
        <span class="muted">${n.alt.length ? "没有的话可以用 " + n.alt.map(_t).join("、") : ""}</span></span></label>`,
    )
    .join("");
  return `<section class="screen">
    <div class="row"><button class="text-btn" id="back">返回</button><h2 style="margin:0">${_t(t.name)}</h2></div>
    <div class="grow" style="overflow:auto">
      <p class="muted">开始前看一眼手里有什么。缺的可以跳过对应那一步。</p>
      <p class="cyan">手机放稳，正面来光，脸占画面一半左右。</p>
      ${e}
    </div>
    <button class="btn block" id="go">开始画</button>
  </section>`;
}
function Wf() {
  const t = pn(),
    e = Br(),
    n = (e == null ? void 0 : e.steps.length) ?? 1,
    r =
      !!e &&
      Rt === e.steps.length - 1 &&
      ((t == null ? void 0 : t.side) !== "both_sequential" || Gt === 1),
    s =
      (t == null ? void 0 : t.side) === "both_sequential"
        ? Gt === 0
          ? " · 先画这一侧"
          : " · 换另一侧"
        : "";
  return `<div class="stage">
    <canvas id="view"></canvas>
    <div class="hud" data-live>
      <button class="hud-hit" id="title" type="button">
        <div class="kicker">第 ${Rt + 1}/${n} 步 · ${uf((t == null ? void 0 : t.region) ?? "")}</div>
        <div class="hud-title">${_t((t == null ? void 0 : t.title) ?? "")}</div>
        <p class="tool cyan" data-tool>${_t((t == null ? void 0 : t.toolLabel) ?? "")} · ${d1((t == null ? void 0 : t.pressure) ?? "")}${s}</p>
        <p class="tip" data-phase>${_t((t == null ? void 0 : t.script.voice) ?? "")}</p>
      </button>
      <button class="hold" id="hold" type="button">看效果</button>
      <p class="muted intensity-line" data-intensity>提示强度 ${a1(Be)}，长按标题可换</p>
      <div class="bar"><span data-bar style="width:${((Rt + 1) / n) * 100}%"></span></div>
      <div class="hud-more" id="more" hidden>
        ${(t == null ? void 0 : t.side) === "both_sequential" ? `<p class="rose" data-side>${Gt === 0 ? "先画亮着的这一侧" : "换到另一侧，跟着高亮走"}</p>` : ""}
        ${t != null && t.script.tip ? `<p class="muted">${_t(t.script.tip)}</p>` : ""}
        <p class="err" data-err style="display:none"></p>
      </div>
    </div>
    <div class="dock">
      <div class="row">
        <button class="text-btn" id="prev">上一步</button>
        <button class="text-btn" id="replay">再看一遍</button>
        <button class="btn" id="next">${r ? "完成" : "下一步"}</button>
      </div>
      <div class="row" style="justify-content:space-between">
        <button class="text-btn dim" id="exit" type="button">退出</button>
        <button class="text-btn dim" id="skip" type="button">跳过这步</button>
      </div>
      <div class="row">
        <button class="text-btn dim" id="rotate" type="button">旋转画面</button>
        <button class="text-btn dim" id="flip" type="button">翻转画面</button>
      </div>
    </div>
  </div>`;
}
function jf() {
  return `<section class="screen scroll">
    <h1>这一妆画完了</h1>
    <p class="muted">照片留在这台手机上，没有上传。</p>
    ${ti ? `<img class="shot" alt="刚拍下的妆面" src="${ti}" />` : ""}
    <button class="btn block" id="home" style="margin-top:16px">回到妆容</button>
  </section>`;
}
function Vf() {
  const t = (e, n, r) =>
    `<div class="seg" data-group="${e}">${n.map(([s, o]) => `<button type="button" data-value="${s}" class="${s === r ? "on" : ""}">${o}</button>`).join("")}</div>`;
  return `<section class="screen scroll">
    <div class="row"><button class="text-btn" id="back">返回</button><h2 style="margin:0">设置</h2></div>
    <p class="muted">眼型按你自己看起来最像的选。模板会换路径和粗细。</p>
    <p>眼型</p>
    ${t(
      "eye",
      [
        ["monolid", "单眼皮"],
        ["inner_double", "内双"],
        ["double", "双眼皮"],
      ],
      le.eyeType,
    )}
    <p>脸型</p>
    ${t(
      "face",
      [
        ["oval", "标准"],
        ["round", "偏圆"],
        ["long", "偏长"],
      ],
      le.faceShape,
    )}
    <p>提示强度</p>
    <p class="muted">默认是中。高只稍微加粗一点，不会改成深色。</p>
    ${t(
      "intensity",
      [
        ["low", "低"],
        ["medium", "中"],
        ["high", "高"],
      ],
      Be,
    )}
  </section>`;
}
function Ea() {
  var t, e;
  ((t = document.querySelector("#rotate")) == null ||
    t.addEventListener("click", () => {
      x1();
    }),
    (e = document.querySelector("#flip")) == null ||
      e.addEventListener("click", () => {
        M1();
      }));
}
function $f() {
  var t, e;
  (Ea(),
    (t = document.querySelector("#follow")) == null ||
      t.addEventListener("click", () => {
        ((Je = Jn), (Rt = 0), (P = "guide"), Ir(), X());
      }),
    (e = document.querySelector("#back")) == null ||
      e.addEventListener("click", () => {
        ((P = "start"), X(), leaveCamera());
      }));
}
function Yf() {
  var t, e, n, r, s, o, i;
  (Ea(),
    (t = document.querySelector("#start")) == null ||
      t.addEventListener("click", () => void b1()),
    document.querySelectorAll("[data-try]").forEach((a) => {
      a.addEventListener("click", () => void Bf(a.dataset.try ?? ""));
    }),
    (e = document.querySelector("#settings")) == null ||
      e.addEventListener("click", () => {
        ((Eo = "home"), (P = "settings"), X());
      }),
    (n = document.querySelector("#profile")) == null ||
      n.addEventListener("click", () => {
        ((Eo = "home"), (P = "settings"), X());
      }),
    document.querySelectorAll("[data-look]").forEach((a) => {
      a.addEventListener("click", () => {
        ((Zo = a.dataset.look ?? null), (P = "prep"), X());
      });
    }),
    (r = document.querySelector("#resume")) == null ||
      r.addEventListener("click", () => {
        ((Je = localStorage.getItem("progressLook")),
          (Rt = Number(localStorage.getItem("progressStep") || "0")),
          (P = "guide"),
          Ir(),
          X());
      }),
    (s = document.querySelector("#back")) == null ||
      s.addEventListener("click", () => {
        ((P = P === "settings" ? Eo : "home"), X());
      }),
    (o = document.querySelector("#go")) == null ||
      o.addEventListener("click", () => {
        ((Je = Zo), (Rt = 0), (P = "guide"), Ir(), X());
      }),
    (i = document.querySelector("#home")) == null ||
      i.addEventListener("click", () => {
        ((P = "home"), X(), leaveCamera());
      }),
    document.querySelectorAll(".seg button").forEach((a) => {
      a.addEventListener("click", () => {
        var u;
        const c = (u = a.parentElement) == null ? void 0 : u.dataset.group,
          l = a.dataset.value ?? "";
        (c === "eye" && (le = { ...le, eyeType: l }),
          c === "face" && (le = { ...le, faceShape: l }),
          c === "intensity" && (Be = l),
          localStorage.setItem("eyeType", le.eyeType),
          localStorage.setItem("faceShape", le.faceShape),
          localStorage.setItem("intensity", Be),
          _1().then(X));
      });
    }));
}
function qf() {
  var a, c, l, u, h, p;
  const t = document.querySelector("#title");
  let e = null,
    n = !1;
  (t == null ||
    t.addEventListener("pointerdown", () => {
      ((n = !1),
        (e = window.setTimeout(() => {
          ((n = !0),
            (e = null),
            (Be = W2(Be)),
            localStorage.setItem("intensity", Be),
            X());
        }, 550)));
    }),
    t == null ||
      t.addEventListener("pointerup", () => {
        var f;
        (e != null && (clearTimeout(e), (e = null)),
          n ||
            ((f = document.querySelector("#more")) == null ||
              f.toggleAttribute("hidden"),
            ws()));
      }),
    t == null ||
      t.addEventListener("pointerleave", () => {
        (e != null && clearTimeout(e), (e = null));
      }));
  const r = document.querySelector("#hold"),
    s = (f) => {
      (f.preventDefault(), (Fe = !0));
    },
    o = () => {
      Fe = !1;
    };
  (r == null || r.addEventListener("pointerdown", s),
    r == null || r.addEventListener("pointerup", o),
    r == null || r.addEventListener("pointercancel", o),
    r == null || r.addEventListener("pointerleave", o),
    Ea(),
    (a = document.querySelector("#replay")) == null ||
      a.addEventListener("click", () => wr()),
    (c = document.querySelector("#prev")) == null ||
      c.addEventListener("click", () => {
        const f = pn();
        if ((f == null ? void 0 : f.side) === "both_sequential" && Gt > 0) {
          ((Gt = 0), wr(), X());
          return;
        }
        if (Rt > 0) {
          Rt -= 1;
          const d = pn();
          ((Gt = (d == null ? void 0 : d.side) === "both_sequential" ? 1 : 0),
            wr(),
            X());
        }
      }));
  const i = () => {
    const f = pn(),
      d = Br();
    if ((f == null ? void 0 : f.side) === "both_sequential" && Gt === 0) {
      ((Gt = 1), wr(), X());
      return;
    }
    if (d && Rt < d.steps.length - 1) {
      ((Rt += 1), Ir(), X());
      return;
    }
    const m = document.querySelector("#view");
    ((ti = m ? m.toDataURL("image/jpeg", 0.86) : ""),
      (P = "finish"),
      X(),
      leaveCamera());
  };
  ((l = document.querySelector("#next")) == null ||
    l.addEventListener("click", i),
    (u = document.querySelector("#skip")) == null ||
      u.addEventListener("click", i),
    (h = document.querySelector("#exit")) == null ||
      h.addEventListener("click", () => {
        ((P = "home"), X(), leaveCamera());
      }),
    ws(),
    (p = document.querySelector(".stage")) == null ||
      p.addEventListener("pointerdown", (f) => {
        f.target.closest(".hud, .dock, .err, .banner") ||
          (ba = performance.now() + 3e3);
      }));
}
function _t(t) {
  return t.replace(
    /[&<>"']/g,
    (e) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        e
      ],
  );
}
const zf = {
  goto(t, e) {
    ((Je = t), (Jn = t), (Rt = e), (P = "guide"), Ir(), (hn = null), X());
  },
  tryOn(t) {
    ((Jn = t),
      (Je = t),
      (P = "tryon"),
      (C = null),
      (lt = null),
      (On = null),
      (Bn = null),
      (hn = null),
      (Fe = !1),
      X());
  },
  settle() {
    ((hn = { phase: 99, progress: 1, pulse: 0, settled: !0 }), (Fe = !1));
  },
  setAppearance(t, e, n = !1) {
    ((hn = { phase: t, progress: e, pulse: 0, settled: n }), (Fe = !1));
  },
  hold(t) {
    Fe = t;
  },
  cycleRotation: x1,
  toggleMirror: M1,
  get screen() {
    return P;
  },
  get ready() {
    return !!Zt && !!ze;
  },
  get faceLost() {
    return kn;
  },
  get delegate() {
    return Le;
  },
  get nose() {
    if (!ht || ht.length < 2) return null;
    const t = ht[1];
    return { x: t.x, y: t.y };
  },
  get landmarks() {
    return ht ? ht.map((t) => [t.x, t.y]) : null;
  },
  get detectCount() {
    return _s;
  },
  get modelError() {
    return de;
  },
  get cameraError() {
    return Xt;
  },
  get modelReady() {
    return !!Zt;
  },
  get pigmentEngine() {
    const g = globalThis.__glPigment;
    return g && g.frames > 0 ? "webgl2" : "canvas2d";
  },
  get smoothingEngine() {
    return SMOOTHING_NAME;
  },
  get noseLagPx() {
    if (!lastRawPx || !lastFiltPx || !lastRawPx[1] || !lastFiltPx[1]) return null;
    return Math.hypot(lastRawPx[1].x - lastFiltPx[1].x, lastRawPx[1].y - lastFiltPx[1].y);
  },
  get trackLagPx() {
    if (!lastRawPx || !lastFiltPx) return null;
    const ids = [33, 263, 159, 386, 70, 300, 13, 1, 50, 280];
    const out = {};
    for (const i of ids) {
      const a = lastRawPx[i],
        b = lastFiltPx[i];
      if (!a || !b) continue;
      out[i] = Math.hypot(a.x - b.x, a.y - b.y);
    }
    return out;
  },
  get strokes() {
    return (C == null ? void 0 : C.strokes.length) ?? 0;
  },
  get dots() {
    return (C == null ? void 0 : C.dots.length) ?? 0;
  },
  get preview() {
    return !!lt && s1(lt.preview);
  },
  get previewAlpha() {
    return y1;
  },
  get pigmentLayers() {
    return (lt == null ? void 0 : lt.preview.layers.length) ?? 0;
  },
  get pigmentStyles() {
    return (lt == null ? void 0 : lt.preview.layers.map((t) => t.style)) ?? [];
  },
  get orient() {
    return {
      rotation: Me,
      locked: fe,
      manual: Ur,
      mirror: bn,
      facing: ga,
      trackW: ya,
      trackH: _a,
      headUp: En,
    };
  },
  get appearance() {
    return k1(performance.now());
  },
  get layout() {
    const t = document.querySelector(".stage"),
      e = t == null ? void 0 : t.querySelector(".hud"),
      n = t == null ? void 0 : t.querySelector(".dock");
    if (!t || !e) return null;
    const r = S1(t.clientWidth, t.clientHeight),
      s = ni(e, t),
      o = n ? ni(n, t) : null;
    return {
      face: r,
      hud: s,
      dock: o,
      overlap: !!(r && ei(s, r)),
      dockOverlap: !!(r && o && ei(o, r)),
      faceFill: r ? r.width / t.clientWidth : 0,
      viewW: t.clientWidth,
      viewH: t.clientHeight,
      anchor: e.style.top === "auto" || e.style.top === "" ? "bottom" : "top",
    };
  },
  get marks() {
    const t = Pf(),
      e = { strokes: [], dots: [], mouth: [] };
    if (!C || !t) return e;
    const n = (r) => Cf(r, t);
    return {
      strokes: C.strokes
        .filter((r) => r.role === "edge" && r.points.length >= 2)
        .map((r) => ({
          style: r.style,
          emphasis: r.emphasis,
          points: il(r.points, 28).map(n),
        })),
      dots: C.dots.map((r) => ({
        ...n(r.at),
        emphasis: r.emphasis,
        style: r.style,
      })),
      mouth: il(C.mouth, 12).map(n),
    };
  },
  get frame() {
    return {
      rotation: Me,
      rotationLocked: fe,
      frameW: te,
      frameH: ee,
      videoWidth: S.videoWidth,
      videoHeight: S.videoHeight,
      delegate: Le,
    };
  },
  get debug() {
    return {
      screen: P,
      faceLost: kn,
      frozen: Ar,
      detectCount: _s,
      modelError: de,
      cameraError: Xt,
      delegate: Le,
      rotation: Me,
      rotationLocked: fe,
      frameW: te,
      frameH: ee,
      videoWidth: S.videoWidth,
      videoHeight: S.videoHeight,
      readyState: S.readyState,
      hidden: document.hidden,
      running: vn,
      busy: ss,
      strokes: (C == null ? void 0 : C.strokes.length) ?? 0,
      dots: (C == null ? void 0 : C.dots.length) ?? 0,
    };
  },
};
window.__makeup = zf;
_1()
  .then(X)
  .catch((t) => {
    ((de = "人脸模型：" + Rr(t)), X());
  });
const bootQ = new URLSearchParams(location.search);
bootQ.get("cpu") === "1" && (Xo = !0);
w1();
X();
bootQ.get("mirror") === "0" && ((bn = !1), (p1 = !0));
const bootLook = bootQ.get("try");
bootLook && ((Jn = bootLook), (Je = bootLook));
(bootQ.get("fixture") === "1" || bootQ.get("still") || bootQ.get("photo")) &&
  b1(bootLook ? "tryon" : "start");

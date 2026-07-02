"use client";

import { useEffect, useRef } from "react";

/**
 * Image 4:5 avec ondulation au passage de la souris (WebGL).
 * Chaque déplacement du curseur émet une onde concentrique qui se propage,
 * distord l'échantillonnage de la texture puis s'amortit. Repli propre :
 * si WebGL est indisponible, l'`<img>` reste affichée telle quelle.
 */

const MAX = 10; // ondes simultanées max (doit matcher la boucle du shader)
const LIFETIME = 1.5; // s
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uImgAspect;
uniform float uBoxAspect;
uniform int uCount;
uniform vec2 uOrigin[${MAX}];
uniform float uAge[${MAX}];

void main() {
  // couvre le cadre 4:5 sans déformer (object-fit: cover)
  vec2 scale = vec2(1.0);
  if (uImgAspect > uBoxAspect) scale.x = uBoxAspect / uImgAspect;
  else scale.y = uImgAspect / uBoxAspect;
  vec2 cuv = (vUv - 0.5) * scale + 0.5;

  vec2 disp = vec2(0.0);
  for (int i = 0; i < ${MAX}; i++) {
    if (i >= uCount) break;
    float age = uAge[i];
    vec2 diff = vUv - uOrigin[i];
    vec2 adiff = vec2(diff.x * uBoxAspect, diff.y); // distances circulaires
    float d = length(adiff);
    float front = age * 0.9;
    float ring = d - front;
    float band = smoothstep(0.09, 0.0, abs(ring));
    float amp = 0.03 * exp(-age * 3.0) * exp(-d * 4.5);
    vec2 dir = d > 0.0001 ? normalize(adiff) : vec2(0.0);
    dir = vec2(dir.x / uBoxAspect, dir.y);
    disp += dir * sin(ring * 38.0) * band * amp;
  }

  vec4 col = texture2D(uTex, cuv + disp);
  col.rgb += clamp(length(disp) * 6.0, 0.0, 0.18); // léger reflet sur les crêtes
  gl_FragColor = col;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export default function RippleImage({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", { premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return; // repli : l'<img> reste visible

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uImgAspect = gl.getUniformLocation(prog, "uImgAspect");
    const uBoxAspect = gl.getUniformLocation(prog, "uBoxAspect");
    const uCount = gl.getUniformLocation(prog, "uCount");
    const uOrigin = gl.getUniformLocation(prog, "uOrigin");
    const uAge = gl.getUniformLocation(prog, "uAge");

    let imgAspect = 1;
    let boxAspect = 0.8;
    let ready = false;
    let raf = 0;
    let running = false;
    const ripples: { x: number; y: number; t0: number }[] = [];
    const t0 = performance.now();
    const nowS = () => (performance.now() - t0) / 1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      boxAspect = w / h;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      const t = nowS();
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t0 > LIFETIME) ripples.splice(i, 1);
      }
      const n = Math.min(ripples.length, MAX);
      const origins = new Float32Array(MAX * 2);
      const ages = new Float32Array(MAX);
      for (let i = 0; i < n; i++) {
        origins[i * 2] = ripples[ripples.length - n + i].x;
        origins[i * 2 + 1] = ripples[ripples.length - n + i].y;
        ages[i] = t - ripples[ripples.length - n + i].t0;
      }
      gl.uniform1f(uImgAspect, imgAspect);
      gl.uniform1f(uBoxAspect, boxAspect);
      gl.uniform1i(uCount, n);
      gl.uniform2fv(uOrigin, origins);
      gl.uniform1fv(uAge, ages);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (ripples.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false; // plus d'onde : on arrête la boucle (dernier rendu = image nette)
      }
    };
    const kick = () => {
      if (!ready || running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      imgAspect = img.naturalWidth / img.naturalHeight;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resize();
      ready = true;
      if (imgRef.current) imgRef.current.style.opacity = "0"; // bascule sur le canvas
      draw(); // rendu initial net
    };

    const addRipple = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height; // uv depuis le bas
      const last = ripples[ripples.length - 1];
      if (last && Math.hypot(last.x - x, last.y - y) < 0.03) return; // throttle spatial
      ripples.push({ x, y, t0: nowS() });
      if (ripples.length > MAX) ripples.shift();
      kick();
    };

    const onResize = () => {
      resize();
      if (ready && !running) draw();
    };

    canvas.addEventListener("pointermove", addRipple);
    canvas.addEventListener("pointerdown", addRipple);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", addRipple);
      canvas.removeEventListener("pointerdown", addRipple);
      window.removeEventListener("resize", onResize);
    };
  }, [src]);

  return (
    <div className="ripple">
      {/* poster / repli sans WebGL — masquée une fois le canvas prêt */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} />
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ShardPalette {
  fillR: number;
  fillG: number;
  fillB: number;
  edgeR: number;
  edgeG: number;
  edgeB: number;
  glintR: number;
  glintG: number;
  glintB: number;
}

type ShardKind = 'wireframe' | 'glass' | 'cluster';

interface Shard {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  verts: [Vec3, Vec3, Vec3];
  clusterVert?: Vec3; // 4th vertex for connected double-triangle wireframe clusters seen in the video
  palette: ShardPalette;
  kind: ShardKind;
  baseFillAlpha: number;
  baseStrokeAlpha: number;
}

interface MicroParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rot: number;
  vRot: number;
  size: number;
  isMiniTriangle: boolean;
  r: number;
  g: number;
  b: number;
  baseAlpha: number;
}

interface BokehOrb {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  r: number;
  g: number;
  b: number;
  baseAlpha: number;
}

// Exact colors from the reference video: glowing ice-white, bright aqua-cyan, mint-teal, and electric sky-cyan on deep space navy/teal
const SHARD_PALETTES: ShardPalette[] = [
  // 1. Crisp Ice-White & Bright Cyan Edge
  {
    fillR: 224, fillG: 242, fillB: 254,
    edgeR: 255, edgeG: 255, edgeB: 255,
    glintR: 255, glintG: 255, glintB: 255,
  },
  // 2. Electric Aqua Cyan (#22D3EE / #67E8F9)
  {
    fillR: 34, fillG: 211, fillB: 238,
    edgeR: 165, edgeG: 243, edgeB: 252,
    glintR: 255, glintG: 255, glintB: 255,
  },
  // 3. Glowing Mint-Teal (#2DD4BF / #5EEAD4)
  {
    fillR: 45, fillG: 212, fillB: 191,
    edgeR: 153, edgeG: 246, edgeB: 228,
    glintR: 240, glintG: 253, glintB: 250,
  },
  // 4. Deep Cyan-Blue Glass (#06B6D4 / #38BDF8)
  {
    fillR: 6, fillG: 182, fillB: 212,
    edgeR: 103, edgeG: 232, edgeB: 249,
    glintR: 224, glintG: 242, glintB: 254,
  },
];

const BOKEH_COLORS = [
  { r: 20, g: 184, b: 166 },  // Emerald-Teal glow
  { r: 6, g: 182, b: 212 },   // Cyan glow
  { r: 56, g: 189, b: 248 },  // Sky-Blue glow
  { r: 167, g: 243, b: 208 }, // Soft Mint-White glow
  { r: 224, g: 242, b: 254 }, // Ice-White bokeh
];

const Z_NEAR = 55;
const Z_FAR = 1150;
const FOV = 500;

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createSharpTriangle(scale: number): [Vec3, Vec3, Vec3] {
  const angles = [
    randomRange(0, Math.PI * 0.5),
    randomRange(Math.PI * 0.65, Math.PI * 1.25),
    randomRange(Math.PI * 1.4, Math.PI * 1.92),
  ];
  return [0, 1, 2].map((i) => {
    const r = scale * randomRange(0.55, 1.45);
    return {
      x: Math.cos(angles[i]) * r,
      y: Math.sin(angles[i]) * r,
      z: randomRange(-scale * 0.3, scale * 0.3),
    };
  }) as [Vec3, Vec3, Vec3];
}

function rotateVertex(v: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;

  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = v.x * cosY + z1 * sinY;
  const z2 = -v.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

export const HeroShardsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let shards: Shard[] = [];
    let microParticles: MicroParticle[] = [];
    let bokehOrbs: BokehOrb[] = [];

    let rafId: number | null = null;
    let isHeroVisible = true;
    let isTabVisible = !document.hidden;
    let resizeTimer: number | null = null;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const spawnShard = (randomZ: boolean): Shard => {
      const spreadX = Math.max(width, 1000) * 1.25;
      const spreadY = Math.max(height, 720) * 1.25;

      const sizeRoll = Math.random();
      const size =
        sizeRoll < 0.24
          ? randomRange(38, 70)
          : sizeRoll < 0.7
          ? randomRange(20, 38)
          : randomRange(10, 20);

      const palette = SHARD_PALETTES[Math.floor(Math.random() * SHARD_PALETTES.length)];
      const kindRoll = Math.random();
      const kind: ShardKind =
        kindRoll < 0.42 ? 'wireframe' : kindRoll < 0.76 ? 'glass' : 'cluster';

      const rotDirX = Math.random() < 0.5 ? 1 : -1;
      const rotDirY = Math.random() < 0.5 ? 1 : -1;
      const rotDirZ = Math.random() < 0.5 ? 1 : -1;

      const verts = createSharpTriangle(size);
      // Adjacent vertex to form connected wireframe triangle clusters like the video
      const clusterVert: Vec3 = {
        x: (verts[0].x + verts[1].x) * 0.65 + randomRange(-size * 0.7, size * 0.7),
        y: (verts[0].y + verts[1].y) * 0.65 + randomRange(-size * 0.7, size * 0.7),
        z: randomRange(-size * 0.35, size * 0.35),
      };

      return {
        x: randomRange(-spreadX * 0.5, spreadX * 0.5),
        y: randomRange(-spreadY * 0.5, spreadY * 0.5),
        z: randomZ ? randomRange(Z_NEAR + 20, Z_FAR) : randomRange(Z_FAR * 0.85, Z_FAR),
        vx: randomRange(-1.5, 2.1),
        vy: randomRange(-1.2, 1.2),
        vz: -randomRange(3.6, 7.8),
        wavePhase: randomRange(0, Math.PI * 2),
        waveSpeed: randomRange(0.0028, 0.006),
        waveAmp: randomRange(0.45, 1.35),
        rotX: randomRange(0, Math.PI * 2),
        rotY: randomRange(0, Math.PI * 2),
        rotZ: randomRange(0, Math.PI * 2),
        vRotX: rotDirX * randomRange(0.028, 0.072),
        vRotY: rotDirY * randomRange(0.028, 0.072),
        vRotZ: rotDirZ * randomRange(0.018, 0.048),
        verts,
        clusterVert,
        palette,
        kind,
        baseFillAlpha:
          kind === 'wireframe'
            ? randomRange(0.03, 0.1)
            : kind === 'cluster'
            ? randomRange(0.08, 0.22)
            : randomRange(0.22, 0.55),
        baseStrokeAlpha:
          kind === 'wireframe' || kind === 'cluster'
            ? randomRange(0.7, 0.96)
            : randomRange(0.45, 0.82),
      };
    };

    const spawnMicroParticle = (randomZ: boolean): MicroParticle => {
      const spreadX = Math.max(width, 1000) * 1.25;
      const spreadY = Math.max(height, 720) * 1.25;
      const c = BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)];
      const isMiniTriangle = Math.random() < 0.62;

      return {
        x: randomRange(-spreadX * 0.5, spreadX * 0.5),
        y: randomRange(-spreadY * 0.5, spreadY * 0.5),
        z: randomZ ? randomRange(Z_NEAR, Z_FAR) : randomRange(Z_FAR * 0.88, Z_FAR),
        vx: randomRange(-1.3, 1.7),
        vy: randomRange(-1.0, 1.0),
        vz: -randomRange(3.2, 6.8),
        rot: randomRange(0, Math.PI * 2),
        vRot: (Math.random() < 0.5 ? 1 : -1) * randomRange(0.045, 0.11),
        size: isMiniTriangle ? randomRange(3.2, 8.2) : randomRange(1.0, 2.6),
        isMiniTriangle,
        r: c.r,
        g: c.g,
        b: c.b,
        baseAlpha: randomRange(0.45, 0.92),
      };
    };

    const spawnBokehOrb = (randomZ: boolean): BokehOrb => {
      const spreadX = Math.max(width, 1000) * 1.2;
      const spreadY = Math.max(height, 720) * 1.2;
      const c = BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)];

      return {
        x: randomRange(-spreadX * 0.5, spreadX * 0.5),
        y: randomRange(-spreadY * 0.5, spreadY * 0.5),
        z: randomZ ? randomRange(Z_NEAR + 70, Z_FAR) : randomRange(Z_FAR * 0.88, Z_FAR),
        vx: randomRange(-0.85, 1.25),
        vy: randomRange(-0.7, 0.7),
        vz: -randomRange(2.0, 4.6),
        radius: randomRange(6, 24),
        r: c.r,
        g: c.g,
        b: c.b,
        baseAlpha: randomRange(0.18, 0.45),
      };
    };

    const initScene = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect ? rect.width : window.innerWidth;
      height = rect ? rect.height : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const targetShardCount = width < 768 ? 48 : 98;
      const targetMicroCount = width < 768 ? 95 : 185;
      const targetBokehCount = width < 768 ? 22 : 44;

      shards = Array.from({ length: targetShardCount }, () => spawnShard(true));
      microParticles = Array.from({ length: targetMicroCount }, () => spawnMicroParticle(true));
      bokehOrbs = Array.from({ length: targetBokehCount }, () => spawnBokehOrb(true));
    };

    const drawFrame = (now: number, stepPhysics: boolean) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.1;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.1;

      // 1. Exact Deep Midnight Space-Navy & Atmospheric Teal Background from the video
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030912');
      bgGrad.addColorStop(0.45, '#071626');
      bgGrad.addColorStop(0.78, '#081D2E');
      bgGrad.addColorStop(1, '#040C17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Glowing Emerald-Teal & Cyan Nebula Clouds (matching the glowing regions in the video)
      const maxDim = Math.max(width, height);
      const tCloud = now * 0.0006;

      // Right-center emerald/cyan nebula cloud
      const cloud1X = width * 0.66 + Math.cos(tCloud) * 35 + currentParallaxX * 0.4;
      const cloud1Y = height * 0.56 + Math.sin(tCloud * 0.8) * 25 + currentParallaxY * 0.4;
      const cloud1 = ctx.createRadialGradient(cloud1X, cloud1Y, 0, cloud1X, cloud1Y, maxDim * 0.44);
      cloud1.addColorStop(0, 'rgba(16, 185, 145, 0.25)');
      cloud1.addColorStop(0.42, 'rgba(6, 182, 212, 0.15)');
      cloud1.addColorStop(0.75, 'rgba(12, 74, 110, 0.07)');
      cloud1.addColorStop(1, 'rgba(4, 12, 23, 0)');
      ctx.fillStyle = cloud1;
      ctx.fillRect(0, 0, width, height);

      // Left-bottom cyan/teal nebula cloud
      const cloud2X = width * 0.18 + Math.sin(tCloud * 1.1) * 30 + currentParallaxX * 0.4;
      const cloud2Y = height * 0.68 + Math.cos(tCloud * 0.9) * 25 + currentParallaxY * 0.4;
      const cloud2 = ctx.createRadialGradient(cloud2X, cloud2Y, 0, cloud2X, cloud2Y, maxDim * 0.38);
      cloud2.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      cloud2.addColorStop(0.45, 'rgba(20, 184, 166, 0.12)');
      cloud2.addColorStop(1, 'rgba(4, 12, 23, 0)');
      ctx.fillStyle = cloud2;
      ctx.fillRect(0, 0, width, height);

      // Upper-center subtle deep cyan-blue glow
      const cloud3X = width * 0.48 + currentParallaxX * 0.25;
      const cloud3Y = height * 0.28 + currentParallaxY * 0.25;
      const cloud3 = ctx.createRadialGradient(cloud3X, cloud3Y, 0, cloud3X, cloud3Y, maxDim * 0.35);
      cloud3.addColorStop(0, 'rgba(14, 116, 144, 0.18)');
      cloud3.addColorStop(1, 'rgba(4, 12, 23, 0)');
      ctx.fillStyle = cloud3;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const spreadX = Math.max(width, 1000) * 0.68;
      const spreadY = Math.max(height, 720) * 0.68;

      // 3. Soft Glowing Bokeh Depth Orbs (teal, cyan, ice-white out-of-focus circles)
      for (let i = 0; i < bokehOrbs.length; i++) {
        const b = bokehOrbs[i];
        if (stepPhysics) {
          b.x += b.vx;
          b.y += b.vy;
          b.z += b.vz;

          if (b.z <= Z_NEAR || Math.abs(b.x) > spreadX || Math.abs(b.y) > spreadY) {
            bokehOrbs[i] = spawnBokehOrb(false);
            continue;
          }
        }

        const perspective = FOV / (FOV + b.z);
        const depthFactor = Math.max(0, Math.min(1, 1 - (b.z - Z_NEAR) / (Z_FAR - Z_NEAR)));
        const edgeFade =
          b.z < Z_NEAR + 100
            ? (b.z - Z_NEAR) / 100
            : b.z > Z_FAR - 150
            ? (Z_FAR - b.z) / 150
            : 1;

        const sx = cx + b.x * perspective + currentParallaxX * (0.3 + depthFactor * 0.6);
        const sy = cy + b.y * perspective + currentParallaxY * (0.3 + depthFactor * 0.6);
        const rad = Math.max(3, b.radius * perspective * 1.5);

        if (sx < -rad || sx > width + rad || sy < -rad || sy > height + rad) continue;

        const alpha = b.baseAlpha * (0.4 + depthFactor * 0.6) * Math.max(0, edgeFade);
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad);
        grad.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, ${alpha.toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${b.r}, ${b.g}, ${b.b}, ${(alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);

        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 4. Fast-Streaming Micro-Triangles & Sparkling Star Specks
      for (let i = 0; i < microParticles.length; i++) {
        const p = microParticles[i];
        if (stepPhysics) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.rot += p.vRot;

          if (p.z <= Z_NEAR || Math.abs(p.x) > spreadX || Math.abs(p.y) > spreadY) {
            microParticles[i] = spawnMicroParticle(false);
            continue;
          }
        }

        const perspective = FOV / (FOV + p.z);
        const depthFactor = Math.max(0, Math.min(1, 1 - (p.z - Z_NEAR) / (Z_FAR - Z_NEAR)));
        const edgeFade =
          p.z < Z_NEAR + 80
            ? (p.z - Z_NEAR) / 80
            : p.z > Z_FAR - 130
            ? (Z_FAR - p.z) / 130
            : 1;

        const parallaxScale = 0.35 + depthFactor * 0.85;
        const sx = cx + p.x * perspective + currentParallaxX * parallaxScale;
        const sy = cy + p.y * perspective + currentParallaxY * parallaxScale;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        const alpha = p.baseAlpha * (0.45 + depthFactor * 0.55) * Math.max(0, edgeFade);
        const scaledSize = Math.max(1.0, p.size * (0.55 + depthFactor * 0.75));

        if (p.isMiniTriangle) {
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const ang = p.rot + (k * Math.PI * 2) / 3;
            const vx = sx + Math.cos(ang) * scaledSize;
            const vy = sy + Math.sin(ang) * scaledSize;
            if (k === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha.toFixed(3)})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, scaledSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 253, 255, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 5. Fast-Tumbling 3D Cyan/White/Aqua Triangular Shards & Connected Wireframe Clusters
      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        if (stepPhysics) {
          const waveOffset = Math.sin(now * s.waveSpeed + s.wavePhase) * s.waveAmp;
          s.x += s.vx + waveOffset * 0.38;
          s.y += s.vy + Math.cos(now * s.waveSpeed + s.wavePhase) * s.waveAmp * 0.38;
          s.z += s.vz;
          s.rotX += s.vRotX;
          s.rotY += s.vRotY;
          s.rotZ += s.vRotZ;

          if (s.z <= Z_NEAR || Math.abs(s.x) > spreadX * 1.12 || Math.abs(s.y) > spreadY * 1.12) {
            shards[i] = spawnShard(false);
          }
        }
      }

      shards.sort((a, b) => b.z - a.z);

      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        const depthFactor = Math.max(0, Math.min(1, 1 - (s.z - Z_NEAR) / (Z_FAR - Z_NEAR)));
        const edgeFade =
          s.z < Z_NEAR + 90
            ? (s.z - Z_NEAR) / 90
            : s.z > Z_FAR - 150
            ? (Z_FAR - s.z) / 150
            : 1;

        const parallaxScale = 0.45 + depthFactor * 1.05;
        const offsetX = currentParallaxX * parallaxScale;
        const offsetY = currentParallaxY * parallaxScale;

        const rVerts: Vec3[] = [];
        const pts: { x: number; y: number }[] = [];
        for (let vIdx = 0; vIdx < 3; vIdx++) {
          const rv = rotateVertex(s.verts[vIdx], s.rotX, s.rotY, s.rotZ);
          rVerts.push(rv);
          const wz = Math.max(20, FOV + s.z + rv.z);
          const scale = FOV / wz;
          pts.push({
            x: cx + (s.x + rv.x) * scale + offsetX,
            y: cy + (s.y + rv.y) * scale + offsetY,
          });
        }

        if (
          pts.every((pt) => pt.x < -110) ||
          pts.every((pt) => pt.x > width + 110) ||
          pts.every((pt) => pt.y < -110) ||
          pts.every((pt) => pt.y > height + 110)
        ) {
          continue;
        }

        const ux = rVerts[1].x - rVerts[0].x;
        const uy = rVerts[1].y - rVerts[0].y;
        const uz = rVerts[1].z - rVerts[0].z;
        const vx = rVerts[2].x - rVerts[0].x;
        const vy = rVerts[2].y - rVerts[0].y;
        const vz = rVerts[2].z - rVerts[0].z;
        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        const normalZ = Math.abs(nz / nLen);
        const specularFlash = Math.pow(normalZ, 4);

        const visibility = Math.max(0, edgeFade);
        const fillAlpha =
          s.baseFillAlpha * (0.4 + depthFactor * 0.6) * (0.7 + specularFlash * 0.5) * visibility;
        const strokeAlpha =
          s.baseStrokeAlpha * (0.45 + depthFactor * 0.55) * visibility;

        const pal = s.palette;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.closePath();

        if (s.kind === 'wireframe' || s.kind === 'cluster') {
          ctx.fillStyle = `rgba(${pal.fillR}, ${pal.fillG}, ${pal.fillB}, ${fillAlpha.toFixed(3)})`;
          ctx.fill();

          ctx.lineWidth = 1.0 + depthFactor * 0.9;
          ctx.strokeStyle = `rgba(${pal.edgeR}, ${pal.edgeG}, ${pal.edgeB}, ${strokeAlpha.toFixed(3)})`;
          ctx.stroke();

          // Connected secondary wireframe triangle & vertex dots (matching the mesh clusters in the video)
          if (s.kind === 'cluster' && s.clusterVert) {
            const rv4 = rotateVertex(s.clusterVert, s.rotX, s.rotY, s.rotZ);
            const wz4 = Math.max(20, FOV + s.z + rv4.z);
            const scale4 = FOV / wz4;
            const pt4 = {
              x: cx + (s.x + rv4.x) * scale4 + offsetX,
              y: cy + (s.y + rv4.y) * scale4 + offsetY,
            };

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pt4.x, pt4.y);
            ctx.lineTo(pts[1].x, pts[1].y);
            ctx.lineWidth = 0.85 + depthFactor * 0.65;
            ctx.strokeStyle = `rgba(${pal.edgeR}, ${pal.edgeG}, ${pal.edgeB}, ${(strokeAlpha * 0.8).toFixed(3)})`;
            ctx.stroke();

            // Tiny bright vertex nodes on cluster corners
            if (depthFactor > 0.35) {
              ctx.fillStyle = `rgba(255, 255, 255, ${(strokeAlpha * 0.9).toFixed(3)})`;
              for (const pCorner of [pts[0], pts[1], pts[2], pt4]) {
                ctx.beginPath();
                ctx.arc(pCorner.x, pCorner.y, 1.4, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        } else {
          // Glowing translucent cyan/aqua/ice-white shard
          const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
          grad.addColorStop(
            0,
            `rgba(${pal.glintR}, ${pal.glintG}, ${pal.glintB}, ${(
              fillAlpha * (0.75 + specularFlash * 0.5)
            ).toFixed(3)})`
          );
          grad.addColorStop(
            1,
            `rgba(${pal.fillR}, ${pal.fillG}, ${pal.fillB}, ${(fillAlpha * 0.55).toFixed(3)})`
          );

          ctx.fillStyle = grad;
          ctx.fill();

          ctx.lineWidth = 0.85 + depthFactor * 0.75;
          ctx.strokeStyle = `rgba(${pal.edgeR}, ${pal.edgeG}, ${pal.edgeB}, ${strokeAlpha.toFixed(3)})`;
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const startLoop = () => {
      if (prefersReducedMotion || rafId !== null || !isHeroVisible || !isTabVisible) return;
      const tick = (now: number) => {
        if (!isHeroVisible || !isTabVisible) {
          rafId = null;
          return;
        }
        drawFrame(now, true);
        rafId = window.requestAnimationFrame(tick);
      };
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    initScene();

    if (prefersReducedMotion) {
      drawFrame(performance.now(), false);
    } else {
      startLoop();
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!width || !height) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetParallaxX = -normX * 22;
      targetParallaxY = -normY * 22;
    };

    const handleResize = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        initScene();
        if (prefersReducedMotion) {
          drawFrame(performance.now(), false);
        }
      }, 120);
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isHeroVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && isTabVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
};

export default HeroShardsBackground;

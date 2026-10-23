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
  clusterVert?: Vec3;
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

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  r: number;
  g: number;
  b: number;
  pulsePhase: number;
}

interface NeuralPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

interface AuroraSpec {
  yRatio: number;
  amplitude: number;
  thickness: number;
  freq1: number;
  freq2: number;
  speed1: number;
  speed2: number;
  phase: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
}

interface WaveMote {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  alpha: number;
  r: number;
  g: number;
  b: number;
}

// Background 1: Glass Shards palettes
const SHARD_PALETTES: ShardPalette[] = [
  {
    fillR: 224, fillG: 242, fillB: 254,
    edgeR: 255, edgeG: 255, edgeB: 255,
    glintR: 255, glintG: 255, glintB: 255,
  },
  {
    fillR: 34, fillG: 211, fillB: 238,
    edgeR: 165, edgeG: 243, edgeB: 252,
    glintR: 255, glintG: 255, glintB: 255,
  },
  {
    fillR: 45, fillG: 212, fillB: 191,
    edgeR: 153, edgeG: 246, edgeB: 228,
    glintR: 240, glintG: 253, glintB: 250,
  },
  {
    fillR: 6, fillG: 182, fillB: 212,
    edgeR: 103, edgeG: 232, edgeB: 249,
    glintR: 224, glintG: 242, glintB: 254,
  },
];

const BOKEH_COLORS = [
  { r: 20, g: 184, b: 166 },
  { r: 6, g: 182, b: 212 },
  { r: 56, g: 189, b: 248 },
  { r: 167, g: 243, b: 208 },
  { r: 224, g: 242, b: 254 },
];

// Background 4: Aurora Flow bands
const AURORA_BANDS: AuroraSpec[] = [
  {
    yRatio: 0.32,
    amplitude: 58,
    thickness: 190,
    freq1: 0.0024,
    freq2: 0.0052,
    speed1: 0.0014,
    speed2: -0.0021,
    phase: 0.4,
    r: 34, g: 211, b: 238, // #22D3EE Cyan
    alpha: 0.24,
  },
  {
    yRatio: 0.52,
    amplitude: 68,
    thickness: 210,
    freq1: 0.002,
    freq2: 0.0044,
    speed1: -0.0012,
    speed2: 0.0018,
    phase: 2.1,
    r: 20, g: 184, b: 166, // #14B8A6 Emerald-Teal
    alpha: 0.22,
  },
  {
    yRatio: 0.68,
    amplitude: 50,
    thickness: 175,
    freq1: 0.0028,
    freq2: 0.006,
    speed1: 0.0016,
    speed2: 0.0011,
    phase: 4.0,
    r: 37, g: 99, b: 235, // #2563EB Blue
    alpha: 0.24,
  },
  {
    yRatio: 0.42,
    amplitude: 45,
    thickness: 160,
    freq1: 0.0031,
    freq2: 0.0048,
    speed1: -0.0015,
    speed2: -0.0013,
    phase: 5.2,
    r: 99, g: 102, b: 241, // #6366F1 Indigo
    alpha: 0.16,
  },
];

const Z_NEAR = 55;
const Z_FAR = 1150;
const FOV = 500;

const TOTAL_BACKGROUNDS = 5;
const SCENE_DURATION_MS = 6500;
const TRANSITION_DURATION_MS = 1000;

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

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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

    // Scene 1 state (Glass Shards)
    let shards: Shard[] = [];
    let microParticles: MicroParticle[] = [];
    let bokehOrbs: BokehOrb[] = [];

    // Scene 3 state (Neural Network)
    let neuralNodes: NeuralNode[] = [];
    let neuralPulses: NeuralPulse[] = [];

    // Scene 4 & 5 state (Wave Motes)
    let waveMotes: WaveMote[] = [];

    let rafId: number | null = null;
    let isHeroVisible = true;
    let isTabVisible = !document.hidden;
    let resizeTimer: number | null = null;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Carousel state (0..4)
    let activeScene = 0;
    let prevScene: number | null = null;
    let sceneStartTime = performance.now();
    let transitionStartTime = 0;

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

    const initNeuralNetwork = () => {
      const nodeCount = width < 768 ? 44 : 72;
      const colors = [
        { r: 34, g: 211, b: 238 },  // #22D3EE Cyan
        { r: 56, g: 189, b: 248 },  // #38BDF8 Sky Blue
        { r: 37, g: 99, b: 235 },   // #2563EB Royal Blue
        { r: 45, g: 212, b: 191 },  // #2DD4BF Teal
      ];
      neuralNodes = Array.from({ length: nodeCount }, () => {
        const c = colors[Math.floor(Math.random() * colors.length)];
        const angle = randomRange(0, Math.PI * 2);
        const speed = randomRange(0.28, 0.72);
        return {
          x: randomRange(0, width),
          y: randomRange(0, height),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: randomRange(1.8, 3.6),
          r: c.r,
          g: c.g,
          b: c.b,
          pulsePhase: randomRange(0, Math.PI * 2),
        };
      });
      neuralPulses = [];
    };

    const initWaveMotes = () => {
      const count = width < 768 ? 38 : 68;
      waveMotes = Array.from({ length: count }, () => {
        const c = BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)];
        return {
          x: randomRange(0, width),
          y: randomRange(0, height),
          vx: randomRange(-0.35, 0.35),
          vy: -randomRange(0.4, 1.15),
          radius: randomRange(1.2, 3.2),
          alpha: randomRange(0.3, 0.8),
          r: c.r,
          g: c.g,
          b: c.b,
        };
      });
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

      initNeuralNetwork();
      initWaveMotes();
    };

    // =========================================================================
    // SCENE 1: Glass Shards (Existing background, unchanged)
    // =========================================================================
    const drawScene1GlassShards = (now: number, stepPhysics: boolean, sceneAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = sceneAlpha;

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

      // Soft Glowing Bokeh Depth Orbs
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

      // Fast-Streaming Micro-Triangles & Sparkling Star Specks
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

      // Fast-Tumbling 3D Cyan/White/Aqua Triangular Shards & Connected Wireframe Clusters
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

    // =========================================================================
    // SCENE 2: Squircle Shift (~40px squircles, 8px gap, diagonal wave, max 0.35 alpha)
    // =========================================================================
    const drawScene2SquircleShift = (now: number, sceneAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = sceneAlpha;

      const squircleSize = 40;
      const gap = 8;
      const cell = squircleSize + gap;
      const cols = Math.ceil(width / cell) + 2;
      const rows = Math.ceil(height / cell) + 2;
      const t = now * 0.0022;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const centerX = c * cell + squircleSize * 0.5 + currentParallaxX * 0.35;
          const centerY = r * cell + squircleSize * 0.5 + currentParallaxY * 0.35;

          // Diagonal wave passing across the grid + secondary harmonic
          const diagPhase = (c * 0.26 + r * 0.26) - t;
          const secondaryPhase = (c * 0.14 - r * 0.19) + t * 0.65;
          const rawWave = Math.sin(diagPhase) * 0.72 + Math.cos(secondaryPhase) * 0.28;
          const wave = (rawWave + 1) * 0.5; // 0..1
          const highlight = Math.pow(wave, 2.2);

          // Scale 0.85 -> 1.0 and slight rotation
          const scale = 0.85 + wave * 0.15;
          const rot = Math.sin(diagPhase) * 0.11;

          // Color shifts from dark navy (#0F2744) to teal/cyan (#22D3EE)
          const red = Math.round(15 + (34 - 15) * highlight);
          const green = Math.round(39 + (211 - 39) * highlight);
          const blue = Math.round(68 + (238 - 68) * highlight);

          // Low opacity (max 0.35) so it stays subtle and readable
          const fillAlpha = 0.06 + highlight * 0.26;
          const strokeAlpha = 0.1 + highlight * 0.25;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(rot);
          ctx.scale(scale, scale);

          drawRoundedRectPath(
            ctx,
            -squircleSize * 0.5,
            -squircleSize * 0.5,
            squircleSize,
            squircleSize,
            11
          );

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${fillAlpha.toFixed(3)})`;
          ctx.fill();

          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${strokeAlpha.toFixed(3)})`;
          ctx.stroke();

          ctx.restore();
        }
      }

      ctx.restore();
    };

    // =========================================================================
    // SCENE 3: Neural Network (~70 glowing nodes, distance-faded lines, light pulses)
    // =========================================================================
    const drawScene3NeuralNetwork = (now: number, stepPhysics: boolean, sceneAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = sceneAlpha;

      const maxDist = 175;
      const maxDistSq = maxDist * maxDist;

      // Update nodes
      if (stepPhysics) {
        for (let i = 0; i < neuralNodes.length; i++) {
          const n = neuralNodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -30) n.x = width + 30;
          else if (n.x > width + 30) n.x = -30;
          if (n.y < -30) n.y = height + 30;
          else if (n.y > height + 30) n.y = -30;
        }
      }

      // Draw connecting lines and collect valid edges for light pulses
      const validPairs: [number, number][] = [];
      ctx.lineWidth = 1.0;

      for (let i = 0; i < neuralNodes.length; i++) {
        const a = neuralNodes[i];
        const ax = a.x + currentParallaxX * 0.5;
        const ay = a.y + currentParallaxY * 0.5;

        for (let j = i + 1; j < neuralNodes.length; j++) {
          const b = neuralNodes[j];
          const bx = b.x + currentParallaxX * 0.5;
          const by = b.y + currentParallaxY * 0.5;

          const dx = ax - bx;
          const dy = ay - by;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const fade = Math.pow(1 - dist / maxDist, 1.45);
            const lineAlpha = fade * 0.42;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineAlpha.toFixed(3)})`;
            ctx.stroke();

            if (dist < maxDist * 0.85) {
              validPairs.push([i, j]);
            }
          }
        }
      }

      // Spawn & advance synaptic light pulses along connected lines
      if (stepPhysics && validPairs.length > 0 && neuralPulses.length < 18 && Math.random() < 0.25) {
        const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
        const flip = Math.random() < 0.5;
        neuralPulses.push({
          fromIdx: flip ? pair[0] : pair[1],
          toIdx: flip ? pair[1] : pair[0],
          progress: 0,
          speed: randomRange(0.016, 0.034),
        });
      }

      for (let i = neuralPulses.length - 1; i >= 0; i--) {
        const pulse = neuralPulses[i];
        if (stepPhysics) {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            neuralPulses.splice(i, 1);
            continue;
          }
        }

        const fromNode = neuralNodes[pulse.fromIdx];
        const toNode = neuralNodes[pulse.toIdx];
        if (!fromNode || !toNode) {
          neuralPulses.splice(i, 1);
          continue;
        }

        const ax = fromNode.x + currentParallaxX * 0.5;
        const ay = fromNode.y + currentParallaxY * 0.5;
        const bx = toNode.x + currentParallaxX * 0.5;
        const by = toNode.y + currentParallaxY * 0.5;

        const distSq = (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
        if (distSq > maxDistSq * 1.2) {
          neuralPulses.splice(i, 1);
          continue;
        }

        const px = ax + (bx - ax) * pulse.progress;
        const py = ay + (by - ay) * pulse.progress;
        const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.95;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, 9);
        glow.addColorStop(0, `rgba(224, 242, 254, ${pulseAlpha.toFixed(3)})`);
        glow.addColorStop(0.45, `rgba(34, 211, 238, ${(pulseAlpha * 0.65).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Draw glowing nodes
      for (let i = 0; i < neuralNodes.length; i++) {
        const n = neuralNodes[i];
        const nx = n.x + currentParallaxX * 0.5;
        const ny = n.y + currentParallaxY * 0.5;
        const breathe = 0.75 + 0.25 * Math.sin(now * 0.003 + n.pulsePhase);

        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.radius * 4.2);
        halo.addColorStop(0, `rgba(${n.r}, ${n.g}, ${n.b}, ${(0.55 * breathe).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${n.r}, ${n.g}, ${n.b}, 0)`);
        ctx.beginPath();
        ctx.arc(nx, ny, n.radius * 4.2, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${(0.88 * breathe).toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // =========================================================================
    // SCENE 4: Aurora Flow (3-4 large soft flowing cyan/teal/blue/indigo aurora ribbons)
    // =========================================================================
    const drawScene4AuroraFlow = (now: number, stepPhysics: boolean, sceneAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = sceneAlpha;

      const stepX = 28;
      for (let bIdx = 0; bIdx < AURORA_BANDS.length; bIdx++) {
        const band = AURORA_BANDS[bIdx];
        const baseY = height * band.yRatio + currentParallaxY * (0.3 + bIdx * 0.12);

        ctx.beginPath();
        const topPoints: { x: number; y: number }[] = [];
        for (let x = -stepX; x <= width + stepX; x += stepX) {
          const yOffset =
            Math.sin(x * band.freq1 + now * band.speed1 + band.phase) * band.amplitude +
            Math.cos(x * band.freq2 + now * band.speed2) * (band.amplitude * 0.55);
          const py = baseY + yOffset;
          topPoints.push({ x, y: py });
          if (x === -stepX) ctx.moveTo(x, py - band.thickness * 0.5);
          else ctx.lineTo(x, py - band.thickness * 0.5);
        }

        for (let i = topPoints.length - 1; i >= 0; i--) {
          const pt = topPoints[i];
          ctx.lineTo(pt.x, pt.y + band.thickness * 0.5);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(
          0,
          baseY - band.thickness * 0.7,
          0,
          baseY + band.thickness * 0.7
        );
        grad.addColorStop(0, `rgba(${band.r}, ${band.g}, ${band.b}, 0)`);
        grad.addColorStop(0.5, `rgba(${band.r}, ${band.g}, ${band.b}, ${band.alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${band.r}, ${band.g}, ${band.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Subtle rising luminous starlight specks inside the aurora
      for (let i = 0; i < waveMotes.length; i++) {
        const m = waveMotes[i];
        if (stepPhysics) {
          m.x += m.vx;
          m.y += m.vy * 0.6;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = randomRange(0, width);
          }
        }
        const mx = m.x + currentParallaxX * 0.4;
        const my = m.y + currentParallaxY * 0.4;
        ctx.beginPath();
        ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.r}, ${m.g}, ${m.b}, ${(m.alpha * 0.55).toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // =========================================================================
    // SCENE 5: Quantum Cyber Wave (3D undulating particle wave & luminous streams)
    // =========================================================================
    const drawScene5QuantumWave = (now: number, stepPhysics: boolean, sceneAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = sceneAlpha;

      const rows = 14;
      const cols = width < 768 ? 28 : 48;
      const t = now * 0.002;

      for (let r = 0; r < rows; r++) {
        const rowProgress = r / (rows - 1); // 0 (far) -> 1 (near)
        const baseY = height * (0.22 + rowProgress * 0.68) + currentParallaxY * (0.2 + rowProgress * 0.6);
        const amp = 14 + rowProgress * 34;
        const lineAlpha = 0.08 + rowProgress * 0.26;

        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const colProgress = c / cols;
          const px = colProgress * width + currentParallaxX * (0.2 + rowProgress * 0.5);
          const waveY =
            Math.sin(c * 0.24 + r * 0.45 - t) * amp +
            Math.cos(c * 0.15 - r * 0.3 + t * 0.7) * (amp * 0.45);
          const py = baseY + waveY;

          if (c === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.lineWidth = 0.8 + rowProgress * 0.9;
        ctx.strokeStyle =
          r % 2 === 0
            ? `rgba(34, 211, 238, ${lineAlpha.toFixed(3)})`
            : `rgba(45, 212, 191, ${(lineAlpha * 0.85).toFixed(3)})`;
        ctx.stroke();

        // Glowing wave crest nodes along the ribbons
        for (let c = 0; c <= cols; c += 2) {
          const colProgress = c / cols;
          const px = colProgress * width + currentParallaxX * (0.2 + rowProgress * 0.5);
          const waveY =
            Math.sin(c * 0.24 + r * 0.45 - t) * amp +
            Math.cos(c * 0.15 - r * 0.3 + t * 0.7) * (amp * 0.45);
          const py = baseY + waveY;

          ctx.beginPath();
          ctx.arc(px, py, 1.1 + rowProgress * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165, 243, 252, ${(lineAlpha * 1.45).toFixed(3)})`;
          ctx.fill();
        }
      }

      // Rising light motes
      for (let i = 0; i < waveMotes.length; i++) {
        const m = waveMotes[i];
        if (stepPhysics) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = randomRange(0, width);
          }
        }
        const mx = m.x + currentParallaxX * 0.45;
        const my = m.y + currentParallaxY * 0.45;
        ctx.beginPath();
        ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.r}, ${m.g}, ${m.b}, ${(m.alpha * 0.65).toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();
    };

    const renderSceneByIndex = (
      sceneIdx: number,
      now: number,
      stepPhysics: boolean,
      alpha: number
    ) => {
      switch (sceneIdx) {
        case 0:
          drawScene1GlassShards(now, stepPhysics, alpha);
          break;
        case 1:
          drawScene2SquircleShift(now, alpha);
          break;
        case 2:
          drawScene3NeuralNetwork(now, stepPhysics, alpha);
          break;
        case 3:
          drawScene4AuroraFlow(now, stepPhysics, alpha);
          break;
        case 4:
        default:
          drawScene5QuantumWave(now, stepPhysics, alpha);
          break;
      }
    };

    const drawFrame = (now: number, stepPhysics: boolean) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.1;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.1;

      // Shared dark navy base (#0A1A2F -> #0B2233) across all 5 backgrounds so text stays readable
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0A1A2F');
      bgGrad.addColorStop(0.55, '#091E32');
      bgGrad.addColorStop(1, '#0B2233');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Automatic 5-background carousel rotation
      if (!prefersReducedMotion && stepPhysics) {
        if (prevScene === null && now - sceneStartTime >= SCENE_DURATION_MS) {
          prevScene = activeScene;
          activeScene = (activeScene + 1) % TOTAL_BACKGROUNDS;
          transitionStartTime = now;
          sceneStartTime = now;
        }
      }

      if (prevScene !== null) {
        const elapsed = now - transitionStartTime;
        const t = Math.min(1, Math.max(0, elapsed / TRANSITION_DURATION_MS));
        // Smooth cosine crossfade
        const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);

        renderSceneByIndex(prevScene, now, stepPhysics, 1 - easeT);
        renderSceneByIndex(activeScene, now, stepPhysics, easeT);

        if (t >= 1) {
          prevScene = null;
        }
      } else {
        renderSceneByIndex(activeScene, now, stepPhysics, 1);
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
        sceneStartTime = performance.now();
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
          sceneStartTime = performance.now();
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import {
  DEFAULT_IDLE_POSE,
  ROBOT_SERVICE_CARDS,
  RobotAnimationState,
  RobotJointTargets,
} from '../robot-hero/RobotController';

export interface RobotSceneProps {
  activeServiceId?: string;
  animationState?: RobotAnimationState;
  isSpeaking?: boolean;
  speechEnergy?: number;
  greetTriggerCount?: number;
  isVisible?: boolean;
  onRobotClick?: () => void;
}

interface FingerRig {
  proximal: THREE.Group;
  middle: THREE.Group;
  distal: THREE.Group;
  fingerIndex: number; // 0 = thumb, 1 = index, 2 = middle, 3 = ring, 4 = pinky
  isThumb?: boolean;
  isIndex?: boolean;
}

interface ArmRig {
  clavicleGroup: THREE.Group;
  shoulderGroup: THREE.Group;
  elbowGroup: THREE.Group;
  wristGroup: THREE.Group;
  fingers: FingerRig[];
}

/**
 * Generates a high-definition cute & expressive mascot eye texture
 * with a vibrant electric-blue (#087BFA) and cyan (#00C7F2) iris,
 * large visible dark pupil, and dual crisp white catchlight highlights.
 */
function createExpressiveHumanoidEyeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    // Soft outer luminous cyan-blue iris aura
    const outerGlow = ctx.createRadialGradient(cx, cy, 60, cx, cy, 248);
    outerGlow.addColorStop(0, 'rgba(56, 217, 255, 1)');
    outerGlow.addColorStop(0.55, 'rgba(0, 199, 242, 0.98)');
    outerGlow.addColorStop(0.84, 'rgba(8, 123, 250, 0.92)');
    outerGlow.addColorStop(0.95, 'rgba(23, 77, 235, 0.65)');
    outerGlow.addColorStop(1, 'rgba(4, 16, 42, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 248, 0, Math.PI * 2);
    ctx.fill();

    // Bright cyan outer iris rim
    ctx.strokeStyle = '#38E2FF';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, 204, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle radial iris fibers
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      ctx.strokeStyle =
        i % 2 === 0 ? 'rgba(225, 253, 255, 0.85)' : 'rgba(8, 123, 250, 0.75)';
      ctx.lineWidth = i % 3 === 0 ? 4.2 : 2.4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 96, Math.sin(angle) * 96);
      ctx.lineTo(Math.cos(angle) * 194, Math.sin(angle) * 194);
      ctx.stroke();
    }
    ctx.restore();

    // Luminous inner iris ring around pupil
    ctx.strokeStyle = '#B8F6FF';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, 108, 0, Math.PI * 2);
    ctx.stroke();

    // Large, clearly visible deep navy-black pupil
    const pupilGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 102);
    pupilGrad.addColorStop(0, '#01040D');
    pupilGrad.addColorStop(0.84, '#040F29');
    pupilGrad.addColorStop(1, '#072A6C');
    ctx.fillStyle = pupilGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 102, 0, Math.PI * 2);
    ctx.fill();

    // Large primary crisp white catchlight highlight (top-right)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(cx + 58, cy - 62, 46, 36, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Secondary cute lower-left white catchlight highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.arc(cx - 56, cy + 58, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a large, smooth, friendly rounded pearl-white humanoid mascot head.
 */
function createRoundedMascotHeadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.38, 96, 72);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Friendly, slightly wider-than-tall rounded mascot head proportions
    const sx = 1.12;
    const sy = 0.98;
    const sz = 1.0;

    v.x *= sx;
    v.y *= sy;
    v.z *= sz;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates a smooth, rounded-squircle glossy dark face screen that conforms
 * precisely to the front ellipsoid of the large rounded white head, housing both
 * the large expressive blue eyes and the friendly curved smile.
 */
function createMascotFaceScreenGeometry(
  halfHeight = 0.165,
  arcAngle = Math.PI * 0.52,
  surfaceOffset = 0.008
): THREE.BufferGeometry {
  const segX = 72;
  const segY = 48;
  const geo = new THREE.PlaneGeometry(1, 1, segX, segY);
  const pos = geo.attributes.position;

  const headRx = 0.38 * 1.12; // 0.4256
  const headRy = 0.38 * 0.98; // 0.3724
  const headRz = 0.38 * 1.0;  // 0.3800

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i); // -0.5 .. 0.5
    const v = pos.getY(i); // -0.5 .. 0.5

    const nx = u * 2; // -1 .. 1
    const ny = v * 2; // -1 .. 1

    // Smooth superellipse squircle corners for a cute, friendly face screen
    const cornerTaper = Math.pow(
      Math.max(0.02, 1 - Math.pow(Math.abs(nx) * 0.94, 4.0)),
      0.32
    );
    // Center screen slightly above equator (yCenter = 0.008)
    const y = 0.008 + ny * halfHeight * cornerTaper;

    const sinPhi = THREE.MathUtils.clamp(y / headRy, -0.95, 0.95);
    const cosPhi = Math.sqrt(Math.max(0.05, 1 - sinPhi * sinPhi));

    const angle = nx * (arcAngle * 0.5);
    const x = (headRx + surfaceOffset) * cosPhi * Math.sin(angle);
    const z = (headRz + surfaceOffset) * cosPhi * Math.cos(angle);

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates a single continuous, organically sculpted pearl-white ceramic humanoid torso shell
 * with full athletic shoulder breadth, sculpted pectoral chest plate, and tapered lower ribcage.
 */
function createSculptedTorsoGeometry(): THREE.BufferGeometry {
  const radialSegs = 96;
  const heightSegs = 64;
  const height = 0.76;
  const geo = new THREE.CylinderGeometry(1, 1, height, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = (v.y + height / 2) / height; // 0 (bottom of ribcage) .. 1 (neck collar)
    const lenXZ = Math.hypot(v.x, v.z);

    if (lenXZ < 1e-5) {
      pos.setXYZ(i, 0, t * height, 0);
      continue;
    }

    const nx = v.x / lenXZ;
    const nz = v.z / lenXZ;

    // Athletic V-taper: maintains broad shoulder width up to t = 0.82 so deltoids connect seamlessly!
    const lowerToChest = smoothstep(0.0, 0.74, t);
    const shoulderToNeck = smoothstep(0.82, 1.0, t);
    const rx =
      0.26 +
      0.215 * lowerToChest -
      0.305 * Math.pow(shoulderToNeck, 1.3);

    const rz =
      0.175 +
      0.068 * smoothstep(0.0, 0.65, t) -
      0.085 * Math.pow(shoulderToNeck, 1.25);

    const angle = Math.atan2(nx, nz);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const exp = 2.4;
    const normR =
      1 /
      Math.pow(
        Math.pow(Math.abs(sinA), exp) + Math.pow(Math.abs(cosA), exp),
        1 / exp
      );

    const x = sinA * rx * normR;
    let z = cosA * rz * normR;

    // Sculpted Pectoral Plateau on the front (+Z)
    if (nz > 0.15) {
      const pecHeightMask =
        smoothstep(0.28, 0.52, t) * (1 - smoothstep(0.8, 0.96, t));
      const pecWidthMask = Math.exp(-Math.pow(nx / 0.74, 4));
      z += 0.018 * pecHeightMask * pecWidthMask;
    }

    // Subtle dorsal spine groove on the back (-Z)
    if (nz < -0.2) {
      const spineGroove =
        0.012 *
        Math.exp(-Math.pow(nx / 0.16, 2)) *
        smoothstep(0.1, 0.85, t);
      z += spineGroove;
    }

    const edgeRound =
      Math.sin(Math.min(1, t / 0.05) * (Math.PI / 2)) *
      Math.sin(Math.min(1, (1 - t) / 0.05) * (Math.PI / 2));
    const scaleEdge = 0.93 + 0.07 * edgeRound;

    pos.setXYZ(i, x * scaleEdge, t * height, z * scaleEdge);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates a chest logo mesh that conforms strictly to the exact front surface curvature
 * of `createSculptedTorsoGeometry()` so the original IAMTECHNI logo never clips or distorts.
 */
function createConformalChestLogoGeometry(
  width: number,
  height: number,
  centerY = 0.49
): THREE.BufferGeometry {
  const segX = 32;
  const segY = 16;
  const geo = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geo.attributes.position;

  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  const torsoHeight = 0.76;

  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const ly = pos.getY(i);
    const y = centerY + ly;
    const t = Math.max(0, Math.min(1, y / torsoHeight));

    const lowerToChest = smoothstep(0.0, 0.74, t);
    const shoulderToNeck = smoothstep(0.82, 1.0, t);
    const rx =
      0.26 +
      0.215 * lowerToChest -
      0.305 * Math.pow(shoulderToNeck, 1.3);
    const rz =
      0.175 +
      0.068 * smoothstep(0.0, 0.65, t) -
      0.085 * Math.pow(shoulderToNeck, 1.25);

    const sinA = Math.max(-0.85, Math.min(0.85, lx / rx));
    const cosA = Math.sqrt(Math.max(0.01, 1 - sinA * sinA));
    const exp = 2.4;
    const normR =
      1 /
      Math.pow(
        Math.pow(Math.abs(sinA), exp) + Math.pow(Math.abs(cosA), exp),
        1 / exp
      );

    let z = cosA * rz * normR;
    const pecHeightMask =
      smoothstep(0.28, 0.52, t) * (1 - smoothstep(0.8, 0.96, t));
    const pecWidthMask = Math.exp(-Math.pow(sinA / 0.74, 4));
    z += 0.018 * pecHeightMask * pecWidthMask;

    pos.setXYZ(i, lx, ly, z + 0.0045);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates an organically tapered anatomical limb segment (bicep, forearm, or thigh)
 * with smooth rounded caps and subtle muscular contour instead of blocky boxes.
 */
function createSculptedLimbGeometry(
  topRx: number,
  bottomRx: number,
  topRz: number,
  bottomRz: number,
  length: number
): THREE.BufferGeometry {
  const radialSegs = 48;
  const heightSegs = 28;
  const geo = new THREE.CylinderGeometry(1, 1, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = (length / 2 - v.y) / length;
    const lenXZ = Math.hypot(v.x, v.z);
    if (lenXZ < 1e-5) continue;

    const nx = v.x / lenXZ;
    const nz = v.z / lenXZ;

    const muscleSwell = Math.sin(t * Math.PI) * 0.08;
    const endBevel =
      Math.sin(Math.min(1, t / 0.1) * (Math.PI / 2)) *
      Math.sin(Math.min(1, (1 - t) / 0.1) * (Math.PI / 2));

    const rx =
      (topRx + (bottomRx - topRx) * t) * (1 + muscleSwell) * (0.86 + 0.14 * endBevel);
    const rz =
      (topRz + (bottomRz - topRz) * t) * (1 + muscleSwell) * (0.86 + 0.14 * endBevel);

    pos.setXYZ(i, nx * rx, v.y, nz * rz);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Studio environment map & physical tone mapping setup.
 */
const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.98;

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.045
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    return () => {
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
};

/**
 * Dynamically frames the humanoid ambassador across 1366x768, 1440x900, and mobile viewports
 * so the robot stays large, visually dominant, and never clipped.
 */
const ResponsiveCameraRig: React.FC = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = size.width / Math.max(1, size.height);
      if (size.width < 500) {
        camera.fov = 31;
        camera.position.set(0, 0.14, 5.95);
        camera.lookAt(0, 0.06, 0);
      } else if (aspect > 1.35) {
        camera.fov = 29.5;
        camera.position.set(0, 0.14, 5.65);
        camera.lookAt(0, 0.06, 0);
      } else {
        camera.fov = 30.5;
        camera.position.set(0, 0.14, 5.8);
        camera.lookAt(0, 0.06, 0);
      }
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  return null;
};

interface HumanoidAmbassadorProps {
  activeServiceId: string;
  animationState: RobotAnimationState;
  isSpeaking: boolean;
  speechEnergy: number;
  greetTriggerCount: number;
  isVisible: boolean;
  globalPointerRef: React.MutableRefObject<{ targetX: number; targetY: number }>;
}

const HumanoidAmbassador: React.FC<HumanoidAmbassadorProps> = ({
  activeServiceId,
  animationState,
  isSpeaking,
  speechEnergy,
  greetTriggerCount,
  isVisible,
  globalPointerRef,
}) => {
  const { gl } = useThree();

  const liveStateRef = useRef({
    activeServiceId,
    animationState,
    isSpeaking,
    speechEnergy,
    isVisible,
  });

  useEffect(() => {
    liveStateRef.current = {
      activeServiceId,
      animationState,
      isSpeaking,
      speechEnergy,
      isVisible,
    };
  }, [activeServiceId, animationState, isSpeaking, speechEnergy, isVisible]);

  const jointPoseRef = useRef<RobotJointTargets>({ ...DEFAULT_IDLE_POSE });
  const internalGestureStateRef = useRef<RobotAnimationState>(animationState);
  const conversationalWeightRef = useRef({ left: 0.2, right: 0.6 });
  const pointerDampRef = useRef({ x: 0, y: 0 });
  const wavePhaseRef = useRef({ weight: 0, angle: 0 });
  const blinkStateRef = useRef({
    nextBlinkTime: 2.2,
    blinkProgress: 0,
    isBlinking: false,
  });

  // Helper: Proximal-to-distal human biomechanical tween (Shoulder -> Elbow -> Wrist -> Fingers)
  // with natural timing asymmetry between left and right arms
  const scheduleBiomechanicalPose = (
    tl: gsap.core.Timeline,
    target: RobotJointTargets,
    startTime: number,
    leadHand: 'left' | 'right' | 'both',
    baseDuration = 0.96
  ) => {
    const pose = jointPoseRef.current;
    const rightDelay = leadHand === 'left' ? 0.14 : 0.0;
    const leftDelay = leadHand === 'left' ? 0.0 : 0.14;

    // 1. Core & Head lead the gesture shift
    tl.to(
      pose,
      {
        waistYaw: target.waistYaw,
        waistPitch: target.waistPitch,
        torsoYaw: target.torsoYaw,
        torsoPitch: target.torsoPitch,
        torsoRoll: target.torsoRoll,
        headYaw: target.headYaw,
        headPitch: target.headPitch,
        headRoll: target.headRoll,
        duration: baseDuration * 0.92,
        ease: 'sine.inOut',
        overwrite: 'auto',
      },
      startTime
    );

    // 2. Right Arm: Shoulder -> Elbow -> Wrist -> Fingers
    tl.to(
      pose,
      {
        rightShoulderPitch: target.rightShoulderPitch,
        rightShoulderYaw: target.rightShoulderYaw,
        rightShoulderRoll: target.rightShoulderRoll,
        duration: baseDuration * 0.95,
        ease: 'power2.inOut',
        overwrite: 'auto',
      },
      startTime + rightDelay + 0.02
    );
    tl.to(
      pose,
      {
        rightElbowPitch: target.rightElbowPitch,
        rightElbowForward: target.rightElbowForward,
        duration: baseDuration * 1.02,
        ease: 'power2.out',
        overwrite: 'auto',
      },
      startTime + rightDelay + 0.09
    );
    tl.to(
      pose,
      {
        rightWristRoll: target.rightWristRoll,
        rightWristPitch: target.rightWristPitch,
        rightWristSupination: target.rightWristSupination,
        duration: baseDuration * 1.06,
        ease: 'sine.out',
        overwrite: 'auto',
      },
      startTime + rightDelay + 0.16
    );
    tl.to(
      pose,
      {
        rightFingerCurl: target.rightFingerCurl,
        rightPointing: target.rightPointing,
        duration: baseDuration * 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      },
      startTime + rightDelay + 0.22
    );

    // 3. Left Arm: Shoulder -> Elbow -> Wrist -> Fingers (with slight timing offset)
    tl.to(
      pose,
      {
        leftShoulderPitch: target.leftShoulderPitch,
        leftShoulderYaw: target.leftShoulderYaw,
        leftShoulderRoll: target.leftShoulderRoll,
        duration: baseDuration * 0.95,
        ease: 'power2.inOut',
        overwrite: 'auto',
      },
      startTime + leftDelay + 0.02
    );
    tl.to(
      pose,
      {
        leftElbowPitch: target.leftElbowPitch,
        leftElbowForward: target.leftElbowForward,
        duration: baseDuration * 1.02,
        ease: 'power2.out',
        overwrite: 'auto',
      },
      startTime + leftDelay + 0.09
    );
    tl.to(
      pose,
      {
        leftWristRoll: target.leftWristRoll,
        leftWristPitch: target.leftWristPitch,
        leftWristSupination: target.leftWristSupination,
        duration: baseDuration * 1.06,
        ease: 'sine.out',
        overwrite: 'auto',
      },
      startTime + leftDelay + 0.16
    );
    tl.to(
      pose,
      {
        leftFingerCurl: target.leftFingerCurl,
        leftPointing: target.leftPointing,
        duration: baseDuration * 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      },
      startTime + leftDelay + 0.22
    );
  };

  // Multi-phase GSAP choreography synchronized with service explanations:
  // Enters primary gesture (presenting / pointing / explaining / greeting),
  // performs conversational emphasis, then blends smoothly into returnToIdle -> idle pause.
  useEffect(() => {
    const activeCard = ROBOT_SERVICE_CARDS.find((c) => c.id === activeServiceId);
    if (!activeCard || animationState === 'idle') {
      internalGestureStateRef.current = 'returnToIdle';
      const idleTl = gsap.timeline({
        onComplete: () => {
          internalGestureStateRef.current = 'idle';
        },
      });
      scheduleBiomechanicalPose(idleTl, DEFAULT_IDLE_POSE, 0, 'right', 1.05);
      idleTl.to(
        conversationalWeightRef.current,
        { left: 0.08, right: 0.08, duration: 0.8, ease: 'sine.out' },
        0
      );
      return () => {
        idleTl.kill();
      };
    }

    const primaryTarget: RobotJointTargets = {
      ...DEFAULT_IDLE_POSE,
      ...activeCard.pose,
    };
    const leadHand = activeCard.activeHand;
    internalGestureStateRef.current = activeCard.primaryGestureState;

    const tl = gsap.timeline();

    // Activate conversational wrist/forearm emphasis only on the active gesturing hand(s)
    tl.to(
      conversationalWeightRef.current,
      {
        left: leadHand === 'left' || leadHand === 'both' ? 1.0 : 0.15,
        right: leadHand === 'right' || leadHand === 'both' ? 1.0 : 0.15,
        duration: 0.65,
        ease: 'sine.inOut',
      },
      0
    );

    // Phase 1 (0.0s - 1.15s): Proximal-to-distal entry into the service's primary gesture
    scheduleBiomechanicalPose(tl, primaryTarget, 0, leadHand, 0.96);

    // Phase 2 (1.35s - 2.75s): If pointing or follow-up pose exists, transition smoothly from point to open-palm explanation
    if (activeCard.followUpPose) {
      const followUpTarget: RobotJointTargets = {
        ...primaryTarget,
        ...activeCard.followUpPose,
      };
      tl.call(
        () => {
          internalGestureStateRef.current = 'explaining';
        },
        [],
        1.35
      );
      scheduleBiomechanicalPose(tl, followUpTarget, 1.35, leadHand, 0.88);
    }

    // Phase 3 (2.95s - 4.10s): Smooth returnToIdle pause before the next service card
    if (!isSpeaking) {
      tl.call(
        () => {
          internalGestureStateRef.current = 'returnToIdle';
        },
        [],
        2.95
      );
      tl.to(
        conversationalWeightRef.current,
        {
          left: 0.12,
          right: 0.12,
          duration: 0.9,
          ease: 'sine.inOut',
        },
        2.95
      );
      scheduleBiomechanicalPose(tl, DEFAULT_IDLE_POSE, 2.95, leadHand, 1.02);
      tl.call(
        () => {
          internalGestureStateRef.current = 'idle';
        },
        [],
        4.05
      );
    }

    return () => {
      tl.kill();
    };
  }, [activeServiceId, animationState, isSpeaking]);

  // Welcoming Hand-Wave Gesture:
  // Raises right hand naturally from a relaxed position, waves gently with wrist, forearm & fingers,
  // and lowers the hand smoothly back to a relaxed position.
  useEffect(() => {
    if (greetTriggerCount === 0) return;

    internalGestureStateRef.current = 'greeting';
    const tl = gsap.timeline({
      onComplete: () => {
        internalGestureStateRef.current = 'returnToIdle';
      },
    });

    // 1. Raise right hand smoothly from relaxed position
    tl.to(
      wavePhaseRef.current,
      {
        weight: 1,
        duration: 0.55,
        ease: 'power2.out',
      },
      0
    );

    // 2. Gentle wrist & forearm wave (3 soft oscillations)
    tl.fromTo(
      wavePhaseRef.current,
      { angle: 0 },
      {
        angle: Math.PI * 3.5,
        duration: 1.75,
        ease: 'sine.inOut',
      },
      0.2
    );

    // 3. Smoothly lower the hand back to a relaxed position (weight -> 0)
    tl.to(
      wavePhaseRef.current,
      {
        weight: 0,
        angle: 0,
        duration: 0.85,
        ease: 'power2.inOut',
      },
      1.95
    );

    return () => {
      tl.kill();
    };
  }, [greetTriggerCount]);

  // Construct the sculpted humanoid AI ambassador & THREE.AnimationMixer clips
  const rig = useMemo(() => {
    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposableGeometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposableMaterials.push(m);
      return m;
    };

    // --- PREMIUM STUDIO PBR MATERIALS (Sculptural Pearl-White Ceramic & Brushed Platinum-Silver) ---
    const pearlCeramicMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xecf3fc,
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
        envMapIntensity: 0.68,
      })
    );

    const platinumWhiteMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe2ecf8,
        roughness: 0.22,
        metalness: 0.16,
        clearcoat: 0.82,
        clearcoatRoughness: 0.12,
        envMapIntensity: 0.72,
      })
    );

    const brushedSilverMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xbdd0e6,
        roughness: 0.26,
        metalness: 0.82,
        envMapIntensity: 0.85,
      })
    );

    // Sleek Deep Sapphire-Obsidian Optical Eye Mask
    const opticalVisorMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x04112c,
        emissive: 0x051638,
        emissiveIntensity: 0.45,
        roughness: 0.12,
        metalness: 0.12,
        clearcoat: 0.95,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.12,
      })
    );

    const electricBlueGlowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x087bfa,
        emissive: 0x087bfa,
        emissiveIntensity: 2.1,
        roughness: 0.14,
      })
    );

    const cyanLuminousMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x00c7f2,
        emissive: 0x00c7f2,
        emissiveIntensity: 2.4,
        roughness: 0.1,
      })
    );

    const rootSceneGroup = new THREE.Group();
    const ambassadorRoot = new THREE.Group();
    ambassadorRoot.name = 'AmbassadorRoot';
    ambassadorRoot.position.set(0, -0.15, 0);
    rootSceneGroup.add(ambassadorRoot);

    // =========================================================================
    // A. STUDIO PLATFORM & SUBTLE CONCENTRIC HOLOGRAPHIC HALO
    // =========================================================================
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, -1.17, 0);
    rootSceneGroup.add(platformGroup);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 16, 128, 128, 120);
      grad.addColorStop(0, 'rgba(7, 22, 56, 0.18)');
      grad.addColorStop(0.55, 'rgba(8, 123, 250, 0.07)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    disposableTextures.push(shadowTex);

    const shadowPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(3.8, 2.6)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
        })
      )
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.05;
    platformGroup.add(shadowPlane);

    const plinthBase = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.95, 1.08, 0.08, 64)),
      pearlCeramicMat
    );
    plinthBase.scale.set(1.12, 1, 0.82);
    plinthBase.receiveShadow = true;
    platformGroup.add(plinthBase);

    const plinthCyanRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.96, 0.01, 16, 72)),
      cyanLuminousMat
    );
    plinthCyanRing.rotation.x = Math.PI / 2;
    plinthCyanRing.scale.set(1.12, 0.82, 1);
    plinthCyanRing.position.y = 0.038;
    platformGroup.add(plinthCyanRing);

    // Subtle Technical Halo Behind Head & Shoulders
    const haloGroup = new THREE.Group();
    haloGroup.name = 'HaloGroup';
    haloGroup.position.set(0, 0.72, -0.72);
    rootSceneGroup.add(haloGroup);

    const outerHalo = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.46, 0.0075, 16, 96)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x087bfa,
          transparent: true,
          opacity: 0.19,
        })
      )
    );
    haloGroup.add(outerHalo);

    const innerCyanHalo = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.12, 0.0065, 16, 84)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x00c7f2,
          transparent: true,
          opacity: 0.24,
        })
      )
    );
    innerCyanHalo.rotation.x = 0.16;
    innerCyanHalo.rotation.y = -0.14;
    haloGroup.add(innerCyanHalo);

    const subtlePurpleArc = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.3, 0.0055, 12, 72, Math.PI * 1.15)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x7200f5,
          transparent: true,
          opacity: 0.14,
        })
      )
    );
    subtlePurpleArc.rotation.z = 0.45;
    haloGroup.add(subtlePurpleArc);

    // =========================================================================
    // B. SCULPTED PELVIS & ATHLETIC HUMANOID LEGS
    // =========================================================================
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, -0.44, 0);
    ambassadorRoot.add(pelvisGroup);

    const pelvisShell = new THREE.Mesh(
      trackGeo(createSculptedLimbGeometry(0.268, 0.238, 0.178, 0.158, 0.24)),
      pearlCeramicMat
    );
    pelvisShell.castShadow = true;
    pelvisGroup.add(pelvisShell);

    const pelvisBeltSeam = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.264, 0.006, 12, 48)),
      cyanLuminousMat
    );
    pelvisBeltSeam.rotation.x = Math.PI / 2;
    pelvisBeltSeam.scale.set(1.02, 0.68, 1);
    pelvisBeltSeam.position.set(0, 0.11, 0.01);
    pelvisGroup.add(pelvisBeltSeam);

    [-1, 1].forEach((side) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * 0.175, -0.11, 0);
      pelvisGroup.add(legGroup);

      const hipBall = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.106, 24, 24)),
        brushedSilverMat
      );
      legGroup.add(hipBall);

      const thighShell = new THREE.Mesh(
        trackGeo(createSculptedLimbGeometry(0.114, 0.094, 0.124, 0.104, 0.48)),
        pearlCeramicMat
      );
      thighShell.position.set(0, -0.24, 0.01);
      thighShell.rotation.z = side * -0.02;
      thighShell.castShadow = true;
      legGroup.add(thighShell);

      const thighAccent = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.0055, 0.24, 8, 12)),
        cyanLuminousMat
      );
      thighAccent.position.set(side * 0.106, -0.24, 0.02);
      legGroup.add(thighAccent);

      const kneeJoint = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.092, 24, 24)),
        brushedSilverMat
      );
      kneeJoint.position.set(0, -0.48, 0.01);
      legGroup.add(kneeJoint);
    });

    // =========================================================================
    // C. SMOOTH TAPERED WAIST & CONTINUOUS V-TAPER HUMANOID TORSO
    // =========================================================================
    const waistGroup = new THREE.Group();
    waistGroup.name = 'WaistGroup';
    waistGroup.position.set(0, -0.31, 0);
    ambassadorRoot.add(waistGroup);

    // Smoothly tapered Bionic Abdomen (clean silhouette, zero protruding bumps!)
    const abdomenShell = new THREE.Mesh(
      trackGeo(createSculptedLimbGeometry(0.258, 0.242, 0.174, 0.165, 0.28)),
      platinumWhiteMat
    );
    abdomenShell.position.y = 0.14;
    abdomenShell.castShadow = true;
    waistGroup.add(abdomenShell);

    const waistSilverSeam = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.254, 0.008, 12, 48)),
      brushedSilverMat
    );
    waistSilverSeam.rotation.x = Math.PI / 2;
    waistSilverSeam.scale.set(1.01, 0.68, 1);
    waistSilverSeam.position.set(0, 0.14, 0.0);
    waistGroup.add(waistSilverSeam);

    const waistGlowSeam = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.258, 0.006, 12, 48)),
      cyanLuminousMat
    );
    waistGlowSeam.rotation.x = Math.PI / 2;
    waistGlowSeam.scale.set(1.01, 0.68, 1);
    waistGlowSeam.position.set(0, 0.23, 0.0);
    waistGroup.add(waistGlowSeam);

    // Single Continuous Sculpted V-Taper Humanoid Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.name = 'TorsoGroup';
    torsoGroup.position.set(0, 0.24, 0);
    waistGroup.add(torsoGroup);

    const sculptedTorsoMesh = new THREE.Mesh(
      trackGeo(createSculptedTorsoGeometry()),
      pearlCeramicMat
    );
    sculptedTorsoMesh.castShadow = true;
    sculptedTorsoMesh.receiveShadow = true;
    torsoGroup.add(sculptedTorsoMesh);

    // Sleek Flush Collarbone Optical Trim Strips
    [-1, 1].forEach((side) => {
      const clavicleCyanStrip = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.0055, 0.22, 8, 12)),
        cyanLuminousMat
      );
      clavicleCyanStrip.position.set(side * 0.2, 0.68, 0.182);
      clavicleCyanStrip.rotation.z = Math.PI / 2 + side * -0.15;
      clavicleCyanStrip.rotation.y = side * -0.22;
      torsoGroup.add(clavicleCyanStrip);
    });

    // Subtle Luminous Cyan Lower Sternum Node (Below Chest Logo)
    const coreRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.035, 0.0055, 12, 32)),
      cyanLuminousMat
    );
    coreRing.position.set(0, 0.27, 0.236);
    torsoGroup.add(coreRing);

    const coreCenter = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(0.025, 24)),
      electricBlueGlowMat
    );
    coreCenter.position.set(0, 0.27, 0.237);
    torsoGroup.add(coreCenter);

    // Exact native aspect ratio (574:186) for undistorted IAMTECHNI chest logo
    const badgeWidth = 0.48;
    const badgeHeight = badgeWidth * (186 / 574);

    // =========================================================================
    // D. ANATOMICAL BIONIC NECK & SCULPTED HUMANOID HEAD / BIONIC EYE MASK
    // =========================================================================
    const neckGroup = new THREE.Group();
    neckGroup.name = 'NeckGroup';
    neckGroup.position.set(0, 0.74, 0.0);
    torsoGroup.add(neckGroup);

    const neckCore = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.118, 0.142, 0.2, 36)),
      brushedSilverMat
    );
    neckCore.position.y = 0.09;
    neckGroup.add(neckCore);

    const throatPlate = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.068, 0.1, 12, 18)),
      platinumWhiteMat
    );
    throatPlate.position.set(0, 0.09, 0.062);
    throatPlate.scale.set(1.05, 1, 0.75);
    neckGroup.add(throatPlate);

    [-1, 1].forEach((side) => {
      const scmTendon = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.021, 0.17, 10, 14)),
        platinumWhiteMat
      );
      scmTendon.position.set(side * 0.084, 0.095, 0.045);
      scmTendon.rotation.z = side * 0.24;
      scmTendon.rotation.x = 0.18;
      neckGroup.add(scmTendon);

      const scmCyanSeam = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.0042, 0.14, 8, 10)),
        cyanLuminousMat
      );
      scmCyanSeam.position.set(side * 0.096, 0.095, 0.062);
      scmCyanSeam.rotation.z = side * 0.24;
      scmCyanSeam.rotation.x = 0.18;
      neckGroup.add(scmCyanSeam);
    });

    const neckCyanCollar = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.148, 0.0065, 12, 42)),
      cyanLuminousMat
    );
    neckCyanCollar.rotation.x = Math.PI / 2;
    neckCyanCollar.position.y = 0.012;
    neckGroup.add(neckCyanCollar);

    // Head Group (Large rounded white head positioned cleanly atop the neck)
    const headGroup = new THREE.Group();
    headGroup.name = 'HeadGroup';
    headGroup.position.set(0, 0.45, 0.015);
    neckGroup.add(headGroup);

    // 1. Large Rounded Pearl-White Mascot Head
    const faceGeo = trackGeo(createRoundedMascotHeadGeometry());
    const sculptedHeadMesh = new THREE.Mesh(faceGeo, pearlCeramicMat);
    sculptedHeadMesh.castShadow = true;
    sculptedHeadMesh.receiveShadow = true;
    headGroup.add(sculptedHeadMesh);

    // 2. Subtle Forehead Cyan Neural Accent Pill
    const foreheadNeuralNode = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.006, 0.068, 8, 12)),
      cyanLuminousMat
    );
    foreheadNeuralNode.position.set(0, 0.258, 0.305);
    foreheadNeuralNode.rotation.z = Math.PI / 2;
    headGroup.add(foreheadNeuralNode);

    // 3. Glossy Dark Face Screen (Contoured seamlessly onto the large rounded white head)
    const screenBezelGeo = trackGeo(
      createMascotFaceScreenGeometry(0.176, Math.PI * 0.55, 0.005)
    );
    const screenBezel = new THREE.Mesh(screenBezelGeo, brushedSilverMat);
    headGroup.add(screenBezel);

    const screenGlassGeo = trackGeo(
      createMascotFaceScreenGeometry(0.162, Math.PI * 0.52, 0.01)
    );
    const screenGlass = new THREE.Mesh(screenGlassGeo, opticalVisorMat);
    headGroup.add(screenGlass);

    // 4. Large Expressive Blue Eyes with Visible Pupils and Highlights on the Glossy Dark Face Screen
    const eyeTex = createExpressiveHumanoidEyeTexture();
    disposableTextures.push(eyeTex);

    const eyePlaneMat = trackMat(
      new THREE.MeshBasicMaterial({
        map: eyeTex,
        transparent: true,
        depthWrite: false,
      })
    );

    const buildMascotEye = (side: -1 | 1) => {
      const eyeSocketGroup = new THREE.Group();
      const angle = side * 0.25;
      const eyeY = 0.036;
      const cosPhi = Math.sqrt(1 - Math.pow(eyeY / (0.38 * 0.98), 2));
      const rX = (0.38 * 1.12 + 0.018) * cosPhi;
      const rZ = (0.38 * 1.0 + 0.018) * cosPhi;
      eyeSocketGroup.position.set(
        Math.sin(angle) * rX,
        eyeY,
        Math.cos(angle) * rZ
      );
      eyeSocketGroup.rotation.y = angle;
      headGroup.add(eyeSocketGroup);

      const pupilGroup = new THREE.Group();
      eyeSocketGroup.add(pupilGroup);

      // Large, expressive, joyful rounded-oval blue eye with visible pupil & catchlight highlights
      const eyeDisc = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(0.136, 0.146)),
        eyePlaneMat
      );
      eyeDisc.renderOrder = 6;
      pupilGroup.add(eyeDisc);

      // Friendly Floating Cyan Eyebrow Arc above each eye
      const upperEyelidArc = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.068, 0.0055, 12, 28, Math.PI * 0.46)),
        cyanLuminousMat
      );
      upperEyelidArc.rotation.z = Math.PI * 0.27 - side * 0.06;
      upperEyelidArc.position.set(0, 0.032, 0.004);
      eyeSocketGroup.add(upperEyelidArc);

      return { eyeSocketGroup, pupilGroup, upperEyelidArc };
    };

    const leftEyeRig = buildMascotEye(-1);
    const rightEyeRig = buildMascotEye(1);

    // 5. Friendly Curved Smile on the Glossy Dark Face Screen
    const vocalMouthGroup = new THREE.Group();
    vocalMouthGroup.position.set(0, -0.028, 0.394);
    headGroup.add(vocalMouthGroup);

    const brightSmileMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xa8f7ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 2.8,
        roughness: 0.1,
      })
    );

    // Bright, welcoming upward-curved smile arc on the glossy dark face screen
    const smileCurveBar = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.054, 0.0082, 16, 40, Math.PI * 0.62)),
      brightSmileMat
    );
    smileCurveBar.rotation.z = Math.PI * 1.19;
    smileCurveBar.rotation.x = -0.1;
    smileCurveBar.position.set(0, 0.0, 0.002);
    smileCurveBar.renderOrder = 6;
    vocalMouthGroup.add(smileCurveBar);

    const mouthBars: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * 0.016;
      const node = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.0032, 0.008, 6, 10)),
        cyanLuminousMat
      );
      node.position.set(offset, -0.036 + Math.abs(offset) * 0.18, 0.004);
      node.scale.y = 0.01;
      vocalMouthGroup.add(node);
      mouthBars.push(node);
    }

    // 6. Cute Rounded Side Ear Pods with Glowing Cyan Rings
    [-1, 1].forEach((side) => {
      const earModule = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.088, 0.076, 0.045, 32)),
        brushedSilverMat
      );
      earModule.rotation.z = Math.PI / 2;
      earModule.position.set(side * 0.422, 0.01, 0.0);
      headGroup.add(earModule);

      const earDome = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.074, 24, 24)),
        pearlCeramicMat
      );
      earDome.scale.set(0.45, 0.95, 0.95);
      earDome.position.set(side * 0.438, 0.01, 0.0);
      headGroup.add(earDome);

      const earCyanRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.068, 0.0065, 12, 32)),
        cyanLuminousMat
      );
      earCyanRing.rotation.y = Math.PI / 2;
      earCyanRing.position.set(side * 0.445, 0.01, 0.0);
      headGroup.add(earCyanRing);
    });

    // =========================================================================
    // E. ANATOMICALLY SCULPTED ARMS & PROPERLY ORIENTED 5-FINGER HANDS
    // =========================================================================
    const buildAnatomicalArm = (side: -1 | 1): ArmRig => {
      const clavicleGroup = new THREE.Group();
      clavicleGroup.position.set(side * 0.405, 0.59, 0.0);
      torsoGroup.add(clavicleGroup);

      const innerSocket = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.108, 24, 24)),
        brushedSilverMat
      );
      clavicleGroup.add(innerSocket);

      const shoulderGroup = new THREE.Group();
      clavicleGroup.add(shoulderGroup);

      // Sculpted Teardrop Humanoid Deltoid Cap
      const deltoidCap = new THREE.Mesh(
        trackGeo(createSculptedLimbGeometry(0.112, 0.095, 0.118, 0.102, 0.24)),
        pearlCeramicMat
      );
      deltoidCap.position.set(side * 0.015, -0.05, 0);
      deltoidCap.rotation.z = side * 0.12;
      deltoidCap.castShadow = true;
      shoulderGroup.add(deltoidCap);

      const shoulderCyanRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.108, 0.0055, 12, 32)),
        cyanLuminousMat
      );
      shoulderCyanRing.rotation.y = Math.PI / 2;
      shoulderCyanRing.position.x = side * 0.024;
      shoulderGroup.add(shoulderCyanRing);

      // Sculpted Upper Arm (Bicep / Tricep)
      const upperArmShell = new THREE.Mesh(
        trackGeo(createSculptedLimbGeometry(0.092, 0.076, 0.096, 0.08, 0.42)),
        pearlCeramicMat
      );
      upperArmShell.position.set(0, -0.24, 0);
      upperArmShell.castShadow = true;
      shoulderGroup.add(upperArmShell);

      // Brushed-Silver Rotary Elbow Joint
      const elbowGroup = new THREE.Group();
      elbowGroup.position.set(0, -0.45, 0);
      shoulderGroup.add(elbowGroup);

      const elbowSphere = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.082, 24, 24)),
        brushedSilverMat
      );
      elbowGroup.add(elbowSphere);

      const elbowGlowRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.076, 0.0055, 12, 28)),
        electricBlueGlowMat
      );
      elbowGlowRing.rotation.y = Math.PI / 2;
      elbowGroup.add(elbowGlowRing);

      // Sculpted Tapered Forearm Shell
      const forearmShell = new THREE.Mesh(
        trackGeo(createSculptedLimbGeometry(0.082, 0.058, 0.086, 0.062, 0.39)),
        pearlCeramicMat
      );
      forearmShell.position.set(0, -0.21, 0);
      forearmShell.castShadow = true;
      elbowGroup.add(forearmShell);

      const forearmVein = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.005, 0.22, 8, 12)),
        cyanLuminousMat
      );
      forearmVein.position.set(side * 0.07, -0.21, 0.015);
      elbowGroup.add(forearmVein);

      // Multi-Axis Wrist & Anatomically Contoured Humanoid Hand
      const wristGroup = new THREE.Group();
      wristGroup.position.set(0, -0.41, 0);
      elbowGroup.add(wristGroup);

      const wristCuff = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.058, 0.054, 0.038, 24)),
        brushedSilverMat
      );
      wristGroup.add(wristCuff);

      // Sculpted Contoured Humanoid Palm
      const palmMesh = new THREE.Mesh(
        trackGeo(createSculptedLimbGeometry(0.062, 0.068, 0.032, 0.028, 0.14)),
        pearlCeramicMat
      );
      palmMesh.position.set(0, -0.085, 0);
      palmMesh.castShadow = true;
      wristGroup.add(palmMesh);

      const palmEmitterFront = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(0.022, 20)),
        cyanLuminousMat
      );
      palmEmitterFront.position.set(0, -0.085, 0.031);
      wristGroup.add(palmEmitterFront);

      const palmEmitterBack = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(0.02, 20)),
        cyanLuminousMat
      );
      palmEmitterBack.position.set(0, -0.085, -0.031);
      palmEmitterBack.rotation.y = Math.PI;
      wristGroup.add(palmEmitterBack);

      // 5 Articulated 3-Phalanx Fingers in TRUE anatomical order (Thumb + Index on inner/upper side)
      const fingers: FingerRig[] = [];
      const fingerSpecs = [
        { radialOffset: 0.044, len: 0.043, splay: 0.06, fingerIndex: 1, isIndex: true },
        { radialOffset: 0.015, len: 0.048, splay: 0.02, fingerIndex: 2, isIndex: false },
        { radialOffset: -0.014, len: 0.044, splay: -0.02, fingerIndex: 3, isIndex: false },
        { radialOffset: -0.041, len: 0.036, splay: -0.06, fingerIndex: 4, isIndex: false },
      ];

      fingerSpecs.forEach((spec) => {
        const proximal = new THREE.Group();
        proximal.position.set(spec.radialOffset * side, -0.152, 0);
        proximal.rotation.z = spec.splay * side;
        wristGroup.add(proximal);

        const knuckle1 = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.012, 12, 12)),
          brushedSilverMat
        );
        proximal.add(knuckle1);

        const p1 = new THREE.Mesh(
          trackGeo(new THREE.CapsuleGeometry(0.011, spec.len, 8, 12)),
          pearlCeramicMat
        );
        p1.position.y = -spec.len * 0.55;
        proximal.add(p1);

        const middle = new THREE.Group();
        middle.position.set(0, -spec.len * 1.08, 0);
        proximal.add(middle);

        const knuckle2 = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.0105, 10, 10)),
          brushedSilverMat
        );
        middle.add(knuckle2);

        const p2 = new THREE.Mesh(
          trackGeo(new THREE.CapsuleGeometry(0.0098, spec.len * 0.76, 8, 12)),
          pearlCeramicMat
        );
        p2.position.y = -spec.len * 0.42;
        middle.add(p2);

        const distal = new THREE.Group();
        distal.position.set(0, -spec.len * 0.84, 0);
        middle.add(distal);

        const p3 = new THREE.Mesh(
          trackGeo(new THREE.CapsuleGeometry(0.0086, spec.len * 0.6, 8, 12)),
          platinumWhiteMat
        );
        p3.position.y = -spec.len * 0.34;
        distal.add(p3);

        fingers.push({
          proximal,
          middle,
          distal,
          fingerIndex: spec.fingerIndex,
          isIndex: spec.isIndex,
        });
      });

      // Articulated 3-Joint Thumb placed on the SAME radial side (+side * 0.058) next to Index Finger
      const thumbProximal = new THREE.Group();
      thumbProximal.position.set(side * 0.058, -0.082, 0.014);
      thumbProximal.rotation.z = side * 0.48;
      thumbProximal.rotation.y = -side * 0.28;
      wristGroup.add(thumbProximal);

      const t1 = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.013, 0.034, 8, 12)),
        pearlCeramicMat
      );
      t1.position.y = -0.02;
      thumbProximal.add(t1);

      const thumbMiddle = new THREE.Group();
      thumbMiddle.position.set(0, -0.04, 0);
      thumbProximal.add(thumbMiddle);

      const t2 = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.011, 0.026, 8, 12)),
        brushedSilverMat
      );
      t2.position.y = -0.016;
      thumbMiddle.add(t2);

      const thumbDistal = new THREE.Group();
      thumbDistal.position.set(0, -0.032, 0);
      thumbMiddle.add(thumbDistal);

      const t3 = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.0095, 0.022, 8, 12)),
        pearlCeramicMat
      );
      t3.position.y = -0.014;
      thumbDistal.add(t3);

      fingers.push({
        proximal: thumbProximal,
        middle: thumbMiddle,
        distal: thumbDistal,
        fingerIndex: 0,
        isThumb: true,
      });

      return {
        clavicleGroup,
        shoulderGroup,
        elbowGroup,
        wristGroup,
        fingers,
      };
    };

    const viewerLeftArm = buildAnatomicalArm(-1);
    const viewerRightArm = buildAnatomicalArm(1);

    // =========================================================================
    // F. THREE.ANIMATIONMIXER & RIGGED KEYFRAME ANIMATION CLIPS
    // =========================================================================
    const mixer = new THREE.AnimationMixer(rootSceneGroup);

    const breathTimes = [0, 1.1, 2.2, 3.3, 4.4];
    const rootPosTrack = new THREE.VectorKeyframeTrack(
      'AmbassadorRoot.position',
      breathTimes,
      [
        0, -0.34, 0,
        0, -0.32, 0,
        0, -0.3, 0,
        0, -0.32, 0,
        0, -0.34, 0,
      ]
    );
    rootPosTrack.setInterpolation(THREE.InterpolateSmooth);

    const haloRotTrack = new THREE.NumberKeyframeTrack(
      'HaloGroup.rotation[z]',
      [0, 4.4],
      [0, Math.PI * 0.25]
    );

    const idleBreathClip = new THREE.AnimationClip('AmbassadorIdleBreath', 4.4, [
      rootPosTrack,
      haloRotTrack,
    ]);
    const idleAction = mixer.clipAction(idleBreathClip);
    idleAction.play();

    return {
      rootSceneGroup,
      ambassadorRoot,
      waistGroup,
      torsoGroup,
      headGroup,
      leftEyeRig,
      rightEyeRig,
      mouthBars,
      smileCurveBar,
      viewerLeftArm,
      viewerRightArm,
      innerCyanHalo,
      subtlePurpleArc,
      mixer,
      disposableGeometries,
      disposableMaterials,
      disposableTextures,
      badgeWidth,
      badgeHeight,
    };
  }, []);

  // Load the original transparent IAMTECHNI logo (/logo-clean.png) onto a conformal curved chest mesh
  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    let logoGeo: THREE.BufferGeometry | null = null;
    let logoMat: THREE.MeshBasicMaterial | null = null;
    let logoTex: THREE.Texture | null = null;
    let logoMesh: THREE.Mesh | null = null;

    loader.load(
      '/logo-clean.png',
      (texture) => {
        if (!isMounted) {
          texture.dispose();
          return;
        }
        logoTex = texture;
        logoTex.colorSpace = THREE.SRGBColorSpace;
        logoTex.anisotropy = gl.capabilities.getMaxAnisotropy();

        logoGeo = createConformalChestLogoGeometry(
          rig.badgeWidth,
          rig.badgeHeight,
          0.49
        );
        logoMat = new THREE.MeshBasicMaterial({
          map: logoTex,
          transparent: true,
          depthWrite: false,
        });
        logoMesh = new THREE.Mesh(logoGeo, logoMat);
        logoMesh.position.set(0, 0.49, 0);
        logoMesh.renderOrder = 4;
        rig.torsoGroup.add(logoMesh);
      },
      undefined,
      () => {
        // Fallback if offline
      }
    );

    return () => {
      isMounted = false;
      if (logoMesh) rig.torsoGroup.remove(logoMesh);
      if (logoGeo) logoGeo.dispose();
      if (logoMat) logoMat.dispose();
      if (logoTex) logoTex.dispose();
    };
  }, [gl, rig]);

  // Clean up Three.js resources on unmount
  useEffect(() => {
    return () => {
      rig.mixer.stopAllAction();
      rig.disposableGeometries.forEach((g) => g.dispose());
      rig.disposableMaterials.forEach((m) => m.dispose());
      rig.disposableTextures.forEach((t) => t.dispose());
    };
  }, [rig]);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Frame loop: advances THREE.AnimationMixer + blends 7-Scene GSAP poses, blinking, and mouse tracking
  useFrame((state, delta) => {
    if (!liveStateRef.current.isVisible || document.hidden) {
      return;
    }

    const dt = Math.min(delta, 0.1);
    const elapsed = state.clock.getElapsedTime();
    const { isSpeaking: speakingNow, speechEnergy: energyNow } =
      liveStateRef.current;
    const pose = jointPoseRef.current;
    const motionScale = prefersReducedMotion ? 0.12 : 1.0;

    // 1. Advance THREE.AnimationMixer rigged clips
    rig.mixer.update(dt * motionScale);

    // 2. Smoothly damp pointer tracking
    const targetX = globalPointerRef.current.targetX || state.pointer.x || 0;
    const targetY = globalPointerRef.current.targetY || state.pointer.y || 0;

    pointerDampRef.current.x = THREE.MathUtils.damp(
      pointerDampRef.current.x,
      targetX,
      4.2,
      dt
    );
    pointerDampRef.current.y = THREE.MathUtils.damp(
      pointerDampRef.current.y,
      targetY,
      4.2,
      dt
    );

    // 3. Waist, Torso & Head Articulation
    const breathWave = Math.sin(elapsed * 2.05) * motionScale;
    const speechNod = speakingNow
      ? Math.sin(elapsed * 11.2) * 0.04 * Math.max(0.3, energyNow)
      : 0;
    const speechYaw = speakingNow ? Math.cos(elapsed * 3.2) * 0.055 : 0;

    rig.waistGroup.rotation.y =
      pose.waistYaw + pointerDampRef.current.x * 0.06 * motionScale;
    rig.waistGroup.rotation.x = pose.waistPitch;

    rig.torsoGroup.rotation.y =
      pose.torsoYaw + pointerDampRef.current.x * 0.1 * motionScale;
    rig.torsoGroup.rotation.x =
      pose.torsoPitch -
      pointerDampRef.current.y * 0.04 * motionScale +
      breathWave * 0.012;
    rig.torsoGroup.rotation.z =
      pose.torsoRoll + Math.sin(elapsed * 1.1) * 0.012 * motionScale;

    rig.headGroup.rotation.y =
      pose.headYaw +
      pointerDampRef.current.x * 0.22 * motionScale +
      speechYaw;
    rig.headGroup.rotation.x =
      pose.headPitch -
      pointerDampRef.current.y * 0.14 * motionScale +
      speechNod;
    rig.headGroup.rotation.z =
      pose.headRoll +
      Math.sin(elapsed * 1.35) * 0.022 * motionScale -
      pointerDampRef.current.x * 0.035;

    // 4. Expressive Eye Pupil Tracking & Natural Blinking
    const px = pointerDampRef.current.x * 0.014;
    const py = pointerDampRef.current.y * 0.01;
    rig.leftEyeRig.pupilGroup.position.set(px, py, 0.002);
    rig.rightEyeRig.pupilGroup.position.set(px, py, 0.002);

    const bState = blinkStateRef.current;
    if (elapsed > bState.nextBlinkTime && !bState.isBlinking) {
      bState.isBlinking = true;
      bState.blinkProgress = 0;
      bState.nextBlinkTime = elapsed + 2.8 + Math.random() * 2.5;
    }
    if (bState.isBlinking) {
      bState.blinkProgress += dt * 11.0;
      const openRatio = Math.max(0.06, Math.abs(Math.cos(bState.blinkProgress)));
      rig.leftEyeRig.eyeSocketGroup.scale.y = openRatio;
      rig.rightEyeRig.eyeSocketGroup.scale.y = openRatio;
      if (bState.blinkProgress >= Math.PI) {
        bState.isBlinking = false;
        rig.leftEyeRig.eyeSocketGroup.scale.y = 1;
        rig.rightEyeRig.eyeSocketGroup.scale.y = 1;
      }
    }

    // 5. Vocal Resonance Smile & Speech Waveform Animation
    rig.mouthBars.forEach((bar, idx) => {
      if (speakingNow) {
        bar.visible = true;
        const pulse =
          Math.abs(Math.sin(elapsed * 15.5 + idx * 0.9)) *
          (0.6 + energyNow * 1.7);
        bar.scale.y = THREE.MathUtils.clamp(0.6 + pulse * 2.2, 0.4, 3.0);
      } else {
        bar.visible = false;
      }
    });

    // 6. Natural Human-Like Presenter Arm, Wrist & 5-Finger Biomechanics
    const speechBoost = speakingNow ? 1.45 : 1.0;
    const leftConvWeight =
      conversationalWeightRef.current.left * speechBoost * motionScale;
    const rightConvWeight =
      conversationalWeightRef.current.right * speechBoost * motionScale;

    // Non-repetitive multi-frequency conversational phrasing (asymmetric between left and right arms)
    const leftBeat =
      (Math.sin(elapsed * 2.7 + 0.4) * 0.55 +
        Math.sin(elapsed * 4.3 + 1.9) * 0.45) *
      leftConvWeight;
    const rightBeat =
      (Math.sin(elapsed * 2.5 - 0.7) * 0.55 +
        Math.sin(elapsed * 4.1 + 0.6) * 0.45) *
      rightConvWeight;

    // --- VIEWER-LEFT ARM (Explaining & Presenting toward Left-Side Content & Cards) ---
    const leftLiftProgress = THREE.MathUtils.clamp(
      (pose.leftElbowPitch + 0.22) / 2.06,
      0,
      1
    );
    // Natural 3D forward arc during arm raising/lowering so hands never pass through side cards
    const leftMidLiftArc = Math.sin(leftLiftProgress * Math.PI) * 0.36;

    rig.viewerLeftArm.clavicleGroup.rotation.z =
      breathWave * 0.012 - leftLiftProgress * 0.055;

    rig.viewerLeftArm.shoulderGroup.rotation.z = -THREE.MathUtils.clamp(
      pose.leftShoulderRoll + leftBeat * 0.035,
      0.12,
      0.72
    );
    rig.viewerLeftArm.shoulderGroup.rotation.x = THREE.MathUtils.clamp(
      pose.leftShoulderPitch -
        leftMidLiftArc * 0.5 +
        breathWave * 0.015 +
        leftBeat * 0.055,
      -0.95,
      0.08
    );
    rig.viewerLeftArm.shoulderGroup.rotation.y = THREE.MathUtils.clamp(
      pose.leftShoulderYaw + leftBeat * 0.045,
      -0.55,
      0.55
    );

    rig.viewerLeftArm.elbowGroup.rotation.z = -THREE.MathUtils.clamp(
      pose.leftElbowPitch + leftBeat * 0.11,
      -0.35,
      2.08
    );
    rig.viewerLeftArm.elbowGroup.rotation.x = THREE.MathUtils.clamp(
      pose.leftElbowForward - leftMidLiftArc - leftBeat * 0.06,
      -1.35,
      -0.08
    );

    // Coordinated wrist pronation/supination & emphasis rotation
    rig.viewerLeftArm.wristGroup.rotation.y = THREE.MathUtils.clamp(
      pose.leftWristSupination - leftBeat * 0.14,
      -0.92,
      0.92
    );
    rig.viewerLeftArm.wristGroup.rotation.z = THREE.MathUtils.clamp(
      pose.leftWristRoll + leftBeat * 0.09,
      -0.52,
      0.52
    );
    rig.viewerLeftArm.wristGroup.rotation.x = THREE.MathUtils.clamp(
      pose.leftWristPitch + leftBeat * 0.07,
      -0.45,
      0.45
    );

    // Individual 5-Finger Articulation (Natural Cascade, Open Palm & Pointing)
    const leftPointW = THREE.MathUtils.clamp(pose.leftPointing, 0, 1);
    rig.viewerLeftArm.fingers.forEach((f) => {
      const cascadeOffset = f.isThumb ? 0.0 : (f.fingerIndex - 1) * 0.075;
      const beatOpen = Math.max(0, leftBeat) * 0.08;
      const baseCurl = THREE.MathUtils.clamp(
        pose.leftFingerCurl + cascadeOffset - beatOpen,
        0.02,
        0.92
      );
      const pointTargetCurl = f.isIndex
        ? 0.01
        : f.isThumb
        ? 0.95
        : 1.45 + (f.fingerIndex - 2) * 0.12;
      const finalCurl = THREE.MathUtils.lerp(baseCurl, pointTargetCurl, leftPointW);

      f.proximal.rotation.x = -finalCurl * 0.68;
      f.middle.rotation.x = -finalCurl * 0.88;
      f.distal.rotation.x = -finalCurl * 0.68;
    });

    // --- VIEWER-RIGHT ARM (Welcoming Wave, Open-Palm Explaining, Presenting & Pointing) ---
    const waveW = wavePhaseRef.current.weight;
    const waveOsc = Math.sin(wavePhaseRef.current.angle) * 0.25 * waveW;

    const rightTargetElbow = THREE.MathUtils.lerp(
      pose.rightElbowPitch + rightBeat * 0.11,
      1.96 + waveOsc * 0.42,
      waveW
    );
    const rightLiftProgress = THREE.MathUtils.clamp(
      (rightTargetElbow + 0.22) / 2.18,
      0,
      1
    );
    const rightMidLiftArc = Math.sin(rightLiftProgress * Math.PI) * 0.36;

    rig.viewerRightArm.clavicleGroup.rotation.z =
      -breathWave * 0.012 + rightLiftProgress * 0.055;

    rig.viewerRightArm.shoulderGroup.rotation.z = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightShoulderRoll + rightBeat * 0.035,
        0.56,
        waveW
      ),
      0.12,
      0.75
    );
    rig.viewerRightArm.shoulderGroup.rotation.x = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightShoulderPitch -
          rightMidLiftArc * 0.5 -
          breathWave * 0.015 +
          rightBeat * 0.055,
        -0.34,
        waveW
      ),
      -0.95,
      0.08
    );
    rig.viewerRightArm.shoulderGroup.rotation.y = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightShoulderYaw - rightBeat * 0.045,
        0.14,
        waveW
      ),
      -0.55,
      0.55
    );

    rig.viewerRightArm.elbowGroup.rotation.z = THREE.MathUtils.clamp(
      rightTargetElbow,
      -0.35,
      2.12
    );
    rig.viewerRightArm.elbowGroup.rotation.x = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightElbowForward - rightMidLiftArc - rightBeat * 0.06,
        -0.18,
        waveW
      ),
      -1.35,
      -0.08
    );

    // Coordinated wrist pronation/supination & gentle wave oscillation
    rig.viewerRightArm.wristGroup.rotation.y = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightWristSupination + rightBeat * 0.14,
        0.08,
        waveW
      ),
      -0.92,
      0.92
    );
    rig.viewerRightArm.wristGroup.rotation.z = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        pose.rightWristRoll - rightBeat * 0.09,
        -0.12 + waveOsc * 0.72,
        waveW
      ),
      -0.55,
      0.55
    );
    rig.viewerRightArm.wristGroup.rotation.x = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(pose.rightWristPitch + rightBeat * 0.07, 0.0, waveW),
      -0.45,
      0.45
    );

    // Individual 5-Finger Articulation (Natural Cascade, Waving Ripple & Index Pointing)
    const rightPointW = THREE.MathUtils.clamp(
      pose.rightPointing * (1 - waveW),
      0,
      1
    );
    rig.viewerRightArm.fingers.forEach((f) => {
      const cascadeOffset = f.isThumb ? 0.0 : (f.fingerIndex - 1) * 0.075;
      const beatOpen = Math.max(0, rightBeat) * 0.08;
      const waveFingerRipple =
        Math.sin(wavePhaseRef.current.angle * 1.4 - f.fingerIndex * 0.42) *
        0.075 *
        waveW;

      const baseCurl = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(pose.rightFingerCurl, 0.05, waveW) +
          cascadeOffset * (1 - waveW * 0.5) -
          beatOpen +
          waveFingerRipple,
        0.02,
        0.92
      );
      const pointTargetCurl = f.isIndex
        ? 0.01
        : f.isThumb
        ? 0.95
        : 1.45 + (f.fingerIndex - 2) * 0.12;
      const finalCurl = THREE.MathUtils.lerp(
        baseCurl,
        pointTargetCurl,
        rightPointW
      );

      f.proximal.rotation.x = -finalCurl * 0.68;
      f.middle.rotation.x = -finalCurl * 0.88;
      f.distal.rotation.x = -finalCurl * 0.68;
    });

    // 7. Subtle Technical Halo Counter-Rotation
    rig.innerCyanHalo.rotation.z = -elapsed * 0.16 * motionScale;
    rig.subtlePurpleArc.rotation.z = 0.45 + elapsed * 0.1 * motionScale;
  });

  return <primitive object={rig.rootSceneGroup} />;
};

export const RobotScene: React.FC<RobotSceneProps> = ({
  activeServiceId = ROBOT_SERVICE_CARDS[0].id,
  animationState = 'explaining',
  isSpeaking = false,
  speechEnergy = 0,
  greetTriggerCount = 0,
  isVisible = true,
  onRobotClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const globalPointerRef = useRef({ targetX: 0, targetY: 0 });

  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglAvailable(false);
      }
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  // Track pointer across the window for natural head and upper-body responsiveness
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      globalPointerRef.current.targetX = THREE.MathUtils.clamp(nx, -1, 1);
      globalPointerRef.current.targetY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handlePointerLeave = () => {
      globalPointerRef.current.targetX = 0;
      globalPointerRef.current.targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, []);

  if (!webglAvailable) {
    return (
      <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F3F8FF] border border-[#087BFA]/20 text-center">
        <img
          src="/logo-clean.png"
          alt="IAMTECHNI AI Ambassador Logo"
          width={287}
          height={93}
          loading="eager"
          decoding="async"
          className="h-12 w-auto object-contain mb-3"
        />
        <div className="text-base font-bold text-[#071638]">
          IAMTECHNI AI Ambassador
        </div>
        <p className="text-xs text-slate-600 max-w-xs mt-1">
          Interactive service tour is active. Select any capability to explore IAMTECHNI solutions.
        </p>
      </div>
    );
  }

  const isHeadless =
    typeof navigator !== 'undefined' &&
    (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

  return (
    <div
      ref={wrapperRef}
      onClick={onRobotClick}
      role="region"
      aria-label="Interactive 3D IAMTECHNI Humanoid AI Ambassador"
      className="relative w-full h-full min-h-0 select-none cursor-pointer"
    >
      <Canvas
        resize={{ offsetSize: true }}
        shadows={!isHeadless}
        dpr={isHeadless ? 1 : [1, 2]}
        camera={{ position: [0, 0.14, 5.65], fov: 29.5, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <StudioEnvironment />
        <ResponsiveCameraRig />

        {/* Balanced Sculptural Studio Key, Cool Fill & Cyan Rim Lighting */}
        <hemisphereLight args={[0xffffff, 0x9bb5d8, 0.82]} position={[0, 8, 0]} />
        <directionalLight
          position={[3.8, 5.4, 4.4]}
          intensity={1.55}
          castShadow={!isHeadless}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={16}
          shadow-camera-left={-3.0}
          shadow-camera-right={3.0}
          shadow-camera-top={3.0}
          shadow-camera-bottom={-3.0}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
        <directionalLight position={[-4.2, 2.2, 3.0]} intensity={0.95} color={0x00c7f2} />
        <directionalLight position={[0.6, 3.6, -4.5]} intensity={1.25} color={0x087bfa} />

        {/* Sculpted Humanoid AI Ambassador */}
        <HumanoidAmbassador
          activeServiceId={activeServiceId}
          animationState={animationState}
          isSpeaking={isSpeaking}
          speechEnergy={speechEnergy}
          greetTriggerCount={greetTriggerCount}
          isVisible={isVisible}
          globalPointerRef={globalPointerRef}
        />
      </Canvas>
    </div>
  );
};

export default RobotScene;

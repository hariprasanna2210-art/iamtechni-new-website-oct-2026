import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Activity,
  Cpu,
  Globe,
  Smartphone,
  Layers,
  Cloud,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { HeroServiceSlide } from './heroCarouselData';
import { PageRoute } from '../../types';

export interface HeroServiceVisualsProps {
  slide: HeroServiceSlide;
  onNavigate: (route: PageRoute) => void;
  compact?: boolean;
}

const renderPrimaryArtwork = (slideId: string) => {
  switch (slideId) {
    case 'ai-generative':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Artificial Intelligence and Generative AI neural network visual"
        >
          <defs>
            <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="aiBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>

          {/* Left Input Vector Nodes */}
          {[42, 88, 134, 180].map((cy, idx) => (
            <g key={`in-${idx}`}>
              <path
                d={`M 56 ${cy} C 118 ${cy}, 142 110, 205 110`}
                stroke="url(#aiBeam)"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                strokeDasharray="4 4"
              />
              <circle
                cx="56"
                cy={cy}
                r="10"
                fill="#07142B"
                stroke="#00D2FF"
                strokeWidth="1.5"
              />
              <circle cx="56" cy={cy} r="3.5" fill="#00D2FF" />
            </g>
          ))}

          {/* Central Neural Transformer Core */}
          <circle
            cx="205"
            cy="110"
            r="48"
            fill="url(#aiGrad)"
            stroke="#00D2FF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <circle
            cx="205"
            cy="110"
            r="34"
            fill="#061229"
            stroke="#A78BFA"
            strokeOpacity="0.6"
            strokeWidth="1.2"
            strokeDasharray="5 4"
          />
          <circle cx="205" cy="110" r="16" fill="#00D2FF" fillOpacity="0.22" />
          <text
            x="205"
            y="107"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="10"
            fontWeight="700"
            fontFamily="monospace"
          >
            LLM + RAG
          </text>
          <text
            x="205"
            y="120"
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="8"
            fontFamily="monospace"
          >
            NEURAL CORE
          </text>

          {/* Right Generative Assistant UI Card */}
          <path
            d="M 253 92 H 292 M 253 128 H 292"
            stroke="#00D2FF"
            strokeWidth="1.6"
          />
          <rect
            x="292"
            y="34"
            width="146"
            height="152"
            rx="12"
            fill="#07152E"
            stroke="#38BDF8"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <rect
            x="306"
            y="48"
            width="74"
            height="14"
            rx="7"
            fill="#00D2FF"
            fillOpacity="0.16"
          />
          <text
            x="343"
            y="58"
            textAnchor="middle"
            fill="#00D2FF"
            fontSize="8"
            fontWeight="700"
            fontFamily="monospace"
          >
            AI COPILOT
          </text>

          {/* Simulated Prompt & Grounded Output */}
          <rect
            x="306"
            y="72"
            width="118"
            height="28"
            rx="6"
            fill="#0D2147"
            stroke="#1E3A8A"
          />
          <rect x="314" y="80" width="84" height="4" rx="2" fill="#93C5FD" />
          <rect x="314" y="89" width="58" height="4" rx="2" fill="#60A5FA" />

          <rect
            x="306"
            y="108"
            width="118"
            height="64"
            rx="6"
            fill="#091B3A"
            stroke="#00D2FF"
            strokeOpacity="0.35"
          />
          <rect x="314" y="118" width="96" height="4.5" rx="2" fill="#E2E8F0" />
          <rect x="314" y="128" width="102" height="4.5" rx="2" fill="#94A3B8" />
          <rect x="314" y="138" width="76" height="4.5" rx="2" fill="#38BDF8" />
          <rect
            x="314"
            y="151"
            width="68"
            height="12"
            rx="4"
            fill="#7C3AED"
            fillOpacity="0.3"
          />
          <text
            x="348"
            y="159.5"
            textAnchor="middle"
            fill="#C4B5FD"
            fontSize="7.5"
            fontFamily="monospace"
          >
            VERIFIED SOURCE
          </text>
        </svg>
      );

    case 'ml-automation':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Machine Learning predictive analytics and automation pipeline visual"
        >
          <defs>
            <linearGradient id="mlArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.36" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Chart Frame */}
          <rect
            x="24"
            y="24"
            width="266"
            height="172"
            rx="12"
            fill="#07142B"
            stroke="#38BDF8"
            strokeOpacity="0.35"
          />
          {/* Horizontal Grid Lines */}
          {[62, 98, 134, 170].map((y) => (
            <line
              key={y}
              x1="40"
              y1={y}
              x2="274"
              y2={y}
              stroke="#1E3A8A"
              strokeOpacity="0.55"
              strokeDasharray="3 3"
            />
          ))}

          {/* Predictive Confidence Fill & Curve */}
          <path
            d="M 42 162 C 88 152, 118 118, 162 106 C 202 95, 232 58, 272 46 L 272 170 L 42 170 Z"
            fill="url(#mlArea)"
          />
          <path
            d="M 42 162 C 88 152, 118 118, 162 106 C 202 95, 232 58, 272 46"
            stroke="#00D2FF"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Forecast Dashed Projection */}
          <path
            d="M 162 106 C 202 82, 236 44, 272 34"
            stroke="#A78BFA"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle cx="162" cy="106" r="4.5" fill="#00D2FF" />
          <circle cx="222" cy="68" r="4.5" fill="#00D2FF" />
          <circle cx="272" cy="46" r="5.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />

          <text x="42" y="44" fill="#93C5FD" fontSize="9" fontFamily="monospace">
            PREDICTIVE FORECAST // +96.8% CONFIDENCE
          </text>

          {/* Right Automated Workflow Pipeline Nodes */}
          {[
            { y: 36, title: '01. DATA INGEST', sub: 'Kafka + Stream API', color: '#38BDF8' },
            { y: 94, title: '02. ML INFERENCE', sub: 'XGBoost + Neural Net', color: '#00D2FF' },
            { y: 152, title: '03. AUTO ACTION', sub: 'Zero-Touch Execution', color: '#A78BFA' },
          ].map((node, i) => (
            <g key={node.title}>
              {i < 2 && (
                <line
                  x1="372"
                  y1={node.y + 42}
                  x2="372"
                  y2={node.y + 58}
                  stroke="#00D2FF"
                  strokeWidth="1.5"
                />
              )}
              <rect
                x="308"
                y={node.y}
                width="128"
                height="42"
                rx="9"
                fill="#081835"
                stroke={node.color}
                strokeOpacity="0.55"
              />
              <text
                x="320"
                y={node.y + 18}
                fill="#F8FAFC"
                fontSize="9"
                fontWeight="700"
                fontFamily="monospace"
              >
                {node.title}
              </text>
              <text
                x="320"
                y={node.y + 31}
                fill="#94A3B8"
                fontSize="8"
                fontFamily="sans-serif"
              >
                {node.sub}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'robotics-systems':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Robotics and intelligent autonomous hardware control visual"
        >
          {/* Spatial Radar & LiDAR Grid */}
          <circle
            cx="132"
            cy="112"
            r="76"
            fill="#06132C"
            stroke="#00E5FF"
            strokeOpacity="0.35"
            strokeWidth="1.4"
          />
          <circle
            cx="132"
            cy="112"
            r="52"
            stroke="#38BDF8"
            strokeOpacity="0.28"
            strokeDasharray="4 4"
          />
          <circle
            cx="132"
            cy="112"
            r="26"
            stroke="#00E5FF"
            strokeOpacity="0.4"
          />
          <line x1="56" y1="112" x2="208" y2="112" stroke="#1E3A8A" />
          <line x1="132" y1="36" x2="132" y2="188" stroke="#1E3A8A" />

          {/* Articulated Robotic Arm Schematic inside Radar */}
          <rect x="112" y="156" width="40" height="12" rx="4" fill="#38BDF8" />
          <path
            d="M 132 156 L 106 112 L 148 74 L 176 82"
            stroke="#00E5FF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="132" cy="156" r="6" fill="#07142B" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="106" cy="112" r="6" fill="#07142B" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="148" cy="74" r="6" fill="#07142B" stroke="#00E5FF" strokeWidth="2" />
          {/* Gripper End-Effector */}
          <path
            d="M 176 74 L 188 78 M 176 90 L 188 86"
            stroke="#A78BFA"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Kinematics & Telemetry Control HUD */}
          <rect
            x="232"
            y="28"
            width="204"
            height="164"
            rx="12"
            fill="#07152E"
            stroke="#00E5FF"
            strokeOpacity="0.4"
          />
          <text
            x="248"
            y="50"
            fill="#00E5FF"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="monospace"
          >
            ROS2_CONTROL // KINEMATICS
          </text>

          {[
            { label: 'AXIS J1 TORQUE', pct: 86, val: '42.4 Nm', color: '#00E5FF' },
            { label: 'LIDAR SLAM SYNC', pct: 98, val: '0.3 mm', color: '#38BDF8' },
            { label: 'EDGE AI VISION', pct: 92, val: '120 FPS', color: '#A78BFA' },
          ].map((bar, idx) => {
            const y = 70 + idx * 38;
            return (
              <g key={bar.label}>
                <text x="248" y={y} fill="#CBD5E1" fontSize="8.5" fontFamily="monospace">
                  {bar.label}
                </text>
                <text
                  x="420"
                  y={y}
                  textAnchor="end"
                  fill={bar.color}
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {bar.val}
                </text>
                <rect x="248" y={y + 6} width="172" height="7" rx="3.5" fill="#0F254A" />
                <rect
                  x="248"
                  y={y + 6}
                  width={(172 * bar.pct) / 100}
                  height="7"
                  rx="3.5"
                  fill={bar.color}
                />
              </g>
            );
          })}
        </svg>
      );

    case 'web-ecommerce':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Modern website and e-commerce storefront interface mockup"
        >
          {/* Browser Window Frame */}
          <rect
            x="24"
            y="22"
            width="284"
            height="176"
            rx="12"
            fill="#07152E"
            stroke="#38BDF8"
            strokeOpacity="0.45"
          />
          <line x1="24" y1="46" x2="308" y2="46" stroke="#1E3A8A" />
          <circle cx="40" cy="34" r="3.5" fill="#F87171" />
          <circle cx="52" cy="34" r="3.5" fill="#FBBF24" />
          <circle cx="64" cy="34" r="3.5" fill="#34D399" />
          <rect x="82" y="28" width="140" height="12" rx="6" fill="#0C224A" />
          <text x="152" y="36.5" textAnchor="middle" fill="#93C5FD" fontSize="7.5" fontFamily="monospace">
            https://store.iamtechni.in
          </text>

          {/* Hero Banner Inside Browser */}
          <rect
            x="38"
            y="58"
            width="162"
            height="68"
            rx="8"
            fill="#0D2552"
            stroke="#00D2FF"
            strokeOpacity="0.35"
          />
          <rect x="48" y="70" width="92" height="8" rx="4" fill="#F8FAFC" />
          <rect x="48" y="84" width="124" height="5" rx="2.5" fill="#93C5FD" />
          <rect x="48" y="98" width="64" height="16" rx="8" fill="#00D2FF" />

          {/* E-Commerce Product Grid */}
          {[38, 128, 218].map((x, idx) => (
            <g key={x}>
              <rect
                x={x}
                y={idx === 2 ? 58 : 136}
                width="76"
                height={idx === 2 ? 128 : 50}
                rx="8"
                fill="#091C3E"
                stroke="#2563EB"
                strokeOpacity="0.45"
              />
              <rect
                x={x + 8}
                y={idx === 2 ? 68 : 144}
                width="60"
                height={idx === 2 ? 64 : 18}
                rx="4"
                fill="#112C5E"
              />
              <rect
                x={x + 8}
                y={idx === 2 ? 142 : 168}
                width="42"
                height="5"
                rx="2.5"
                fill="#38BDF8"
              />
            </g>
          ))}

          {/* Right Lighthouse Core Web Vitals Card */}
          <rect
            x="322"
            y="22"
            width="114"
            height="176"
            rx="12"
            fill="#07152E"
            stroke="#00D2FF"
            strokeOpacity="0.45"
          />
          <circle
            cx="379"
            cy="86"
            r="34"
            stroke="#1E3A8A"
            strokeWidth="6"
          />
          <circle
            cx="379"
            cy="86"
            r="34"
            stroke="#34D399"
            strokeWidth="6"
            strokeDasharray="205 220"
            strokeLinecap="round"
          />
          <text
            x="379"
            y="91"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="16"
            fontWeight="800"
            fontFamily="monospace"
          >
            99
          </text>
          <text
            x="379"
            y="138"
            textAnchor="middle"
            fill="#34D399"
            fontSize="9"
            fontWeight="700"
            fontFamily="monospace"
          >
            CORE VITALS
          </text>
          <text
            x="379"
            y="154"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="8"
            fontFamily="sans-serif"
          >
            Edge SSR + Instant
          </text>
          <text
            x="379"
            y="166"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="8"
            fontFamily="sans-serif"
          >
            Stripe Checkout
          </text>
        </svg>
      );

    case 'mobile-apps':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="iOS and Android native mobile app screens mockup"
        >
          {/* Primary iOS Phone Mockup */}
          <rect
            x="64"
            y="16"
            width="112"
            height="188"
            rx="20"
            fill="#071630"
            stroke="#00D2FF"
            strokeWidth="1.8"
          />
          <rect x="102" y="23" width="36" height="5" rx="2.5" fill="#1E3A8A" />
          {/* App Balance / Telemetry Header */}
          <rect
            x="76"
            y="38"
            width="88"
            height="52"
            rx="10"
            fill="#0D2654"
            stroke="#38BDF8"
            strokeOpacity="0.4"
          />
          <text x="86" y="54" fill="#38BDF8" fontSize="7.5" fontFamily="monospace">
            LIVE SYNC // 60FPS
          </text>
          <text x="86" y="72" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="sans-serif">
            99.94%
          </text>
          {/* App Action Cards */}
          <rect x="76" y="98" width="88" height="36" rx="8" fill="#0A1E42" stroke="#1E3A8A" />
          <circle cx="92" cy="116" r="8" fill="#00D2FF" fillOpacity="0.25" />
          <rect x="106" y="110" width="46" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="106" y="119" width="32" height="4" rx="2" fill="#60A5FA" />

          <rect x="76" y="142" width="88" height="46" rx="8" fill="#0A1E42" stroke="#7C3AED" strokeOpacity="0.5" />
          <path
            d="M 86 174 Q 104 154, 120 166 T 154 152"
            stroke="#A78BFA"
            strokeWidth="2"
            fill="none"
          />

          {/* Secondary Android Device Screen + Cross-Platform Telemetry */}
          <rect
            x="196"
            y="28"
            width="106"
            height="176"
            rx="18"
            fill="#061228"
            stroke="#A78BFA"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          <rect x="208" y="46" width="82" height="64" rx="10" fill="#0C1F44" />
          <circle cx="249" cy="78" r="16" fill="#00D2FF" fillOpacity="0.2" stroke="#00D2FF" />
          <path d="M 244 78 L 248 82 L 256 74" stroke="#00D2FF" strokeWidth="2" strokeLinecap="round" />
          <rect x="208" y="120" width="82" height="28" rx="7" fill="#0A1B3C" />
          <rect x="208" y="156" width="82" height="32" rx="7" fill="#0A1B3C" />

          {/* Right Native Capability Badges */}
          {[
            { y: 40, label: 'iOS Swift & SwiftUI', tag: 'NATIVE' },
            { y: 94, label: 'Android Kotlin JetPack', tag: '60 FPS' },
            { y: 148, label: 'Flutter & React Native', tag: 'HYBRID' },
          ].map((item) => (
            <g key={item.label}>
              <rect
                x="318"
                y={item.y}
                width="120"
                height="42"
                rx="10"
                fill="#07152E"
                stroke="#38BDF8"
                strokeOpacity="0.4"
              />
              <text x="328" y={item.y + 17} fill="#00D2FF" fontSize="8" fontWeight="700" fontFamily="monospace">
                {item.tag}
              </text>
              <text x="328" y={item.y + 31} fill="#E2E8F0" fontSize="8.5" fontFamily="sans-serif">
                {item.label}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'custom-software':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Custom enterprise software dashboard and workflow architecture"
        >
          {/* Enterprise Command Dashboard */}
          <rect
            x="22"
            y="20"
            width="416"
            height="180"
            rx="14"
            fill="#06132B"
            stroke="#3B82F6"
            strokeOpacity="0.45"
          />
          {/* Sidebar */}
          <line x1="96" y1="20" x2="96" y2="200" stroke="#1E3A8A" />
          <rect x="34" y="36" width="50" height="10" rx="5" fill="#00D2FF" />
          {[62, 82, 102, 122, 142].map((y, idx) => (
            <rect
              key={y}
              x="34"
              y={y}
              width="48"
              height="8"
              rx="4"
              fill={idx === 0 ? '#38BDF8' : '#1E3A8A'}
            />
          ))}

          {/* Top KPI Strip */}
          {[
            { x: 112, label: 'API THROUGHPUT', val: '50,400 /s', color: '#00D2FF' },
            { x: 218, label: 'TENANT ISOLATION', val: 'SOC2 TYPE II', color: '#34D399' },
            { x: 324, label: 'WORKFLOW SLA', val: '99.99%', color: '#A78BFA' },
          ].map((kpi) => (
            <g key={kpi.label}>
              <rect
                x={kpi.x}
                y="34"
                width="98"
                height="48"
                rx="8"
                fill="#0A1E42"
                stroke="#2563EB"
                strokeOpacity="0.4"
              />
              <text x={kpi.x + 10} y="50" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">
                {kpi.label}
              </text>
              <text
                x={kpi.x + 10}
                y="69"
                fill={kpi.color}
                fontSize="11"
                fontWeight="800"
                fontFamily="monospace"
              >
                {kpi.val}
              </text>
            </g>
          ))}

          {/* Lower Microservices & ERP Workflow Graph */}
          <rect
            x="112"
            y="94"
            width="310"
            height="92"
            rx="10"
            fill="#081938"
            stroke="#00D2FF"
            strokeOpacity="0.3"
          />
          {[
            { x: 130, title: 'AUTH & SSO' },
            { x: 228, title: 'CORE ERP ENGINE' },
            { x: 332, title: 'BILLING & BI' },
          ].map((svc, idx) => (
            <g key={svc.title}>
              {idx < 2 && (
                <line
                  x1={svc.x + 76}
                  y1="140"
                  x2={svc.x + 98}
                  y2="140"
                  stroke="#00D2FF"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                />
              )}
              <rect
                x={svc.x}
                y="116"
                width="76"
                height="48"
                rx="8"
                fill="#0D2654"
                stroke="#38BDF8"
                strokeOpacity="0.6"
              />
              <text
                x={svc.x + 38}
                y="143"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="8"
                fontWeight="700"
                fontFamily="monospace"
              >
                {svc.title}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'cloud-devops':
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Cloud architecture, Kubernetes cluster, and DevOps CI/CD pipeline diagram"
        >
          {/* Top CI/CD Automated Pipeline */}
          <rect
            x="24"
            y="24"
            width="412"
            height="68"
            rx="12"
            fill="#07152E"
            stroke="#00D2FF"
            strokeOpacity="0.4"
          />
          <text x="40" y="42" fill="#00D2FF" fontSize="8.5" fontWeight="700" fontFamily="monospace">
            ZERO-DOWNTIME GITOPS CI/CD PIPELINE
          </text>
          {[
            { x: 40, label: 'GIT COMMIT', color: '#38BDF8' },
            { x: 140, label: 'CONTAINER BUILD', color: '#00D2FF' },
            { x: 240, label: 'SEC SCAN', color: '#A78BFA' },
            { x: 340, label: 'K8S PROD DEPLOY', color: '#34D399' },
          ].map((stage, i) => (
            <g key={stage.label}>
              {i < 3 && (
                <line
                  x1={stage.x + 82}
                  y1="66"
                  x2={stage.x + 100}
                  y2="66"
                  stroke="#00D2FF"
                  strokeWidth="1.6"
                />
              )}
              <rect
                x={stage.x}
                y="52"
                width="82"
                height="28"
                rx="6"
                fill="#0B2148"
                stroke={stage.color}
                strokeOpacity="0.65"
              />
              <text
                x={stage.x + 41}
                y="69"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="monospace"
              >
                {stage.label}
              </text>
            </g>
          ))}

          {/* Multi-Region Cloud Infrastructure Mesh */}
          {[
            { x: 24, region: 'AWS US-EAST // PRIMARY', nodes: '12 K8s Pods Active', accent: '#00D2FF' },
            { x: 238, region: 'AZURE EU-CENTRAL // EDGE', nodes: 'Auto-Scaling Mesh', accent: '#38BDF8' },
          ].map((cluster) => (
            <g key={cluster.region}>
              <rect
                x={cluster.x}
                y="108"
                width="198"
                height="88"
                rx="12"
                fill="#07152E"
                stroke={cluster.accent}
                strokeOpacity="0.45"
              />
              <text
                x={cluster.x + 16}
                y="130"
                fill={cluster.accent}
                fontSize="8.5"
                fontWeight="700"
                fontFamily="monospace"
              >
                {cluster.region}
              </text>
              <text
                x={cluster.x + 16}
                y="146"
                fill="#CBD5E1"
                fontSize="8.5"
                fontFamily="sans-serif"
              >
                {cluster.nodes}
              </text>
              {[0, 1, 2, 3].map((n) => (
                <rect
                  key={n}
                  x={cluster.x + 16 + n * 42}
                  y="158"
                  width="34"
                  height="22"
                  rx="5"
                  fill="#0D2654"
                  stroke="#00D2FF"
                  strokeOpacity="0.5"
                />
              ))}
            </g>
          ))}
        </svg>
      );

    case 'digital-marketing':
    default:
      return (
        <svg
          viewBox="0 0 460 220"
          className="w-full h-full"
          fill="none"
          aria-label="Digital marketing, technical SEO, and revenue growth analytics chart"
        >
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Left Revenue & Organic Visibility Chart */}
          <rect
            x="24"
            y="24"
            width="256"
            height="172"
            rx="12"
            fill="#07152E"
            stroke="#8B5CF6"
            strokeOpacity="0.45"
          />
          <text x="40" y="46" fill="#C4B5FD" fontSize="9" fontWeight="700" fontFamily="monospace">
            ORGANIC SEARCH & PIPELINE GROWTH
          </text>

          {/* Growth Bars */}
          {[
            { x: 48, h: 38 },
            { x: 84, h: 54 },
            { x: 120, h: 72 },
            { x: 156, h: 94 },
            { x: 192, h: 114 },
            { x: 228, h: 132 },
          ].map((b, i) => (
            <rect
              key={b.x}
              x={b.x}
              y={180 - b.h}
              width="22"
              height={b.h}
              rx="4"
              fill={i >= 4 ? '#00D2FF' : '#3B82F6'}
              fillOpacity={0.35 + i * 0.1}
            />
          ))}

          {/* Trend Curve */}
          <path
            d="M 58 140 C 98 124, 144 96, 238 48"
            stroke="#00D2FF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="238" cy="48" r="5" fill="#00D2FF" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Right Conversion Funnel Breakdown */}
          <rect
            x="294"
            y="24"
            width="142"
            height="172"
            rx="12"
            fill="#07152E"
            stroke="#00D2FF"
            strokeOpacity="0.4"
          />
          <text x="310" y="46" fill="#00D2FF" fontSize="8.5" fontWeight="700" fontFamily="monospace">
            FULL-FUNNEL ROAS
          </text>
          {[
            { y: 62, w: 110, label: 'SERP #1 RANKINGS', val: '+185%' },
            { y: 104, w: 94, label: 'QUALIFIED LEADS', val: '4.2x' },
            { y: 146, w: 78, label: 'REVENUE ROI', val: '360%' },
          ].map((f) => (
            <g key={f.label}>
              <rect
                x={365 - f.w / 2}
                y={f.y}
                width={f.w}
                height="32"
                rx="7"
                fill="#0D2654"
                stroke="#38BDF8"
                strokeOpacity="0.5"
              />
              <text
                x="365"
                y={f.y + 14}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="7"
                fontFamily="monospace"
              >
                {f.label}
              </text>
              <text
                x="365"
                y={f.y + 26}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="9.5"
                fontWeight="800"
                fontFamily="monospace"
              >
                {f.val}
              </text>
            </g>
          ))}
        </svg>
      );
  }
};

const getServiceBadgeIcon = (slideId: string) => {
  switch (slideId) {
    case 'ai-generative':
      return Sparkles;
    case 'ml-automation':
      return Activity;
    case 'robotics-systems':
      return Cpu;
    case 'web-ecommerce':
      return Globe;
    case 'mobile-apps':
      return Smartphone;
    case 'custom-software':
      return Layers;
    case 'cloud-devops':
      return Cloud;
    case 'digital-marketing':
    default:
      return TrendingUp;
  }
};

export const HeroServiceVisuals: React.FC<HeroServiceVisualsProps> = ({
  slide,
  onNavigate,
  compact = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const BadgeIcon = getServiceBadgeIcon(slide.id);

  if (compact) {
    // Dedicated Mobile & Tablet Compact Visual Showcase below the 3D Robot
    return (
      <div className="w-full shrink-0">
        <motion.div
          key={`mobile-visual-${slide.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0.9, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onNavigate(slide.route)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate(slide.route);
            }
          }}
          className="group relative w-full rounded-2xl bg-[#071329]/90 backdrop-blur-xl border border-[#00D2FF]/30 p-2 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.45),0_0_20px_rgba(0,210,255,0.08)] cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] font-semibold min-w-0">
              <BadgeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00D2FF] shrink-0" />
              <span className="truncate">{slide.visualHeader.badge}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {slide.visualHeader.statusText}
            </span>
          </div>

          {/* Compact SVG Visual — Scales with available viewport height */}
          <div className="w-full h-[clamp(66px,11.2dvh,136px)] rounded-xl bg-[#040B1A]/90 border border-white/10 overflow-hidden">
            {renderPrimaryArtwork(slide.id)}
          </div>

          {/* Supporting Metrics Strip */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            {slide.supportingCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl bg-[#091936]/90 border border-white/10 px-2 py-1 sm:px-2.5 sm:py-1.5 flex items-center justify-between gap-1.5"
              >
                <div className="min-w-0">
                  <div className="text-[9.5px] sm:text-[10px] text-slate-400 truncate leading-tight">
                    {card.label}
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-white truncate leading-tight">
                    {card.value}
                  </div>
                </div>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00D2FF] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full flex flex-col justify-center"
      aria-label={`Visual showcase for ${slide.categoryLabel}`}
    >
      <motion.div
        key={`desktop-visual-${slide.id}`}
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0.9, x: 8, scale: 0.99 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col gap-2.5 xl:gap-3.5"
      >
        {/* Ambient Frame Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-3xl opacity-35 blur-2xl transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at 65% 35%, ${slide.accentHex}33, ${slide.secondaryHex}22, transparent 75%)`,
          }}
        />

        {/* 1. Primary Service Visual Showcase Card */}
        <div
          onClick={() => onNavigate(slide.route)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate(slide.route);
            }
          }}
          className="group relative rounded-2xl bg-[#07132A]/90 backdrop-blur-xl border border-[#00D2FF]/30 hover:border-[#00D2FF]/65 p-3 xl:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* Top Glowing Accent Hairline */}
          <div
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${slide.accentHex}, ${slide.secondaryHex}, transparent)`,
            }}
          />

          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 mb-2 xl:mb-2.5">
            <div className="inline-flex items-center gap-2 text-[10.5px] xl:text-[11px] font-mono uppercase tracking-wider text-[#00D2FF] font-semibold">
              <span className="w-5 h-5 xl:w-6 xl:h-6 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/35 flex items-center justify-center shrink-0">
                <BadgeIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#00D2FF]" />
              </span>
              <span className="truncate">{slide.visualHeader.badge}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] font-mono font-semibold text-emerald-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {slide.visualHeader.statusText}
            </span>
          </div>

          {/* Primary Graphic Canvas — Proportional to viewport height */}
          <div className="relative w-full h-[clamp(128px,21.5dvh,202px)] rounded-xl bg-[#040B1A]/95 border border-white/10 overflow-hidden shadow-inner">
            {renderPrimaryArtwork(slide.id)}
          </div>

          {/* Footer Title & Action */}
          <div className="mt-2 xl:mt-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs xl:text-sm font-bold text-white truncate group-hover:text-[#00D2FF] transition-colors">
                {slide.visualHeader.title}
              </div>
              <div className="text-[10.5px] xl:text-[11px] text-slate-400 truncate">
                Click to explore architecture & case deliverables
              </div>
            </div>
            <span className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-[#00D2FF]/15 border border-[#00D2FF]/35 flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-[#040814] transition-all duration-200 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* 2. Two Supporting Visual Sub-Cards */}
        <div className="grid grid-cols-2 gap-2.5 xl:gap-3.5">
          {slide.supportingCards.map((card, idx) => {
            const isPurple = card.accent === 'purple';
            const SubIcon = idx === 0 ? Zap : ShieldCheck;
            return (
              <div
                key={card.label}
                onClick={() => onNavigate(slide.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(slide.route);
                  }
                }}
                className={`group relative rounded-2xl bg-[#07142C]/85 backdrop-blur-xl border p-2.5 xl:p-3.5 transition-all duration-300 cursor-pointer ${
                  isPurple
                    ? 'border-purple-400/25 hover:border-purple-400/60 shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
                    : 'border-[#00D2FF]/25 hover:border-[#00D2FF]/60 shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9.5px] xl:text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                    {card.label}
                  </span>
                  <SubIcon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isPurple ? 'text-purple-400' : 'text-[#00D2FF]'
                    }`}
                  />
                </div>
                <div className="text-base xl:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>{card.value}</span>
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isPurple ? 'text-purple-400' : 'text-[#00D2FF]'
                    }`}
                  />
                </div>
                <p className="mt-0.5 text-[10.5px] xl:text-[11px] text-slate-300/85 leading-snug line-clamp-2">
                  {card.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

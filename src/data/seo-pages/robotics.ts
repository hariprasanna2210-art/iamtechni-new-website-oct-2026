import { ServicePageData } from './types';

export const roboticsSeoPage: ServicePageData = {
  slug: 'robotics',
  seoTitle: 'Robotics & Emerging Technologies | ROS2, Edge AI & IoT Telemetry | IAMTECHNI',
  metaDescription:
    'Robotics software engineering and industrial IoT telemetry by IAMTECHNI. ROS2 middleware, edge computer vision, WebRTC teleoperation, and real-time fleet dashboards.',
  h1: 'Robotics & Emerging Technologies',
  sections: [
    {
      h2: 'Robotic Control Software, ROS2 Bridges & Edge Computer Vision',
      paragraphs: [
        'IAMTECHNI engineers the software layers that connect autonomous hardware and industrial sensors with cloud intelligence. We build ROS/ROS2 middleware bridges, deterministic safety state machines, and low-latency edge perception pipelines.',
        'Our architectures enable reliable spatial telemetry, obstacle mapping, and automated dispatch across warehouse and manufacturing environments.',
      ],
    },
    {
      h2: 'Industrial IoT Telemetry & WebRTC Teleoperation Cockpits',
      paragraphs: [
        'We develop sub-second WebSocket and WebRTC web control interfaces for monitoring sensor fleets, streaming live video feeds, and buffering edge telemetry safely during network dropouts.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do you design custom mechanical hardware or software systems?',
      answer:
        'We specialize in the software, firmware integration, and cloud control layers that interface with standard industrial robots, microcontrollers, and IoT sensor hardware.',
    },
    {
      question: 'How do you handle connectivity dropouts on remote autonomous devices?',
      answer:
        'We engineer edge-first architectures with local SQLite/buffer queues that record telemetry during disconnects and automatically synchronize once connection is restored.',
    },
  ],
};

export default roboticsSeoPage;

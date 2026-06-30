// The single source of truth for content. Copy is Hridik's: dry, deadpan, concise.
// bodyY: 0 = top of head, 1 = soles of feet. Drives camera traverse + station order.
// region: which humanoid mesh-group lights up amber when this station is active.

const BASE = import.meta.env.BASE_URL;

export type Region =
  | 'brain'
  | 'eyes'
  | 'face'
  | 'jaw'
  | 'spine'
  | 'arms'
  | 'core'
  | 'legs';

export type Station = {
  id: string;
  no: string; // project id shown in HUD
  region: Region;
  hud: string; // short telemetry label
  anatomy: string; // human-readable region
  title: string;
  blurb: string;
  tags: string[];
  link: string;
  media?: { type: 'video' | 'image'; src: string; poster?: string };
  side: 'left' | 'right';
  bodyY: number;
};

export const stations: Station[] = [
  {
    id: 'eeg',
    no: 'PRJ-01',
    region: 'brain',
    hud: 'BRAIN / CORTEX',
    anatomy: 'Neural cortex',
    title: '8-Channel EEG Board',
    blurb:
      'Single-layer KiCad board for eight-channel EEG acquisition. Analog front end, electrode impedance handling, feeding a biomedical ML pipeline for NeuroTechX.',
    tags: ['KiCad', 'PCB', 'EEG', 'Biomedical'],
    link: 'https://github.com/HridikH/portfolio',
    side: 'left',
    bodyY: 0.06,
  },
  {
    id: 'ur3',
    no: 'PRJ-02',
    region: 'eyes',
    hud: 'OPTIC / VISION',
    anatomy: 'Visual cortex',
    title: 'UR3 Vision-Guided Arm',
    blurb:
      'OpenCV detection and real-time pose estimation driving pick-and-place on a UR3. ROS integration. Sub-five-millimeter placement.',
    tags: ['Python', 'ROS', 'OpenCV', 'C++'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/ur3.mp4`, poster: `${BASE}media/ur3-poster.jpg` },
    side: 'right',
    bodyY: 0.14,
  },
  {
    id: 'grogu',
    no: 'PRJ-03',
    region: 'face',
    hud: 'FACE / EXPR',
    anatomy: 'Facial actuation',
    title: 'Animatronic Grogu',
    blurb:
      'ECE 445 capstone. Servo-driven facial expressions, a local LLM with Claude API, Whisper in, Coqui out, and a custom PCB for power. It looks at you.',
    tags: ['Python', 'C++', 'KiCad', 'ROS', 'LLM'],
    link: 'https://github.com/HridikH/portfolio',
    side: 'left',
    bodyY: 0.2,
  },
  {
    id: 'jarvis',
    no: 'PRJ-04',
    region: 'jaw',
    hud: 'VOCAL / LANG',
    anatomy: 'Language center',
    title: 'Jarvis Voice Assistant',
    blurb:
      'Local-first voice assistant. Wake word, Whisper STT, Coqui TTS, a hybrid local LLM and Claude API, and modular tool use.',
    tags: ['Python', 'LLM', 'Claude API', 'Whisper'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/jarvis.mp4`, poster: `${BASE}media/jarvis-poster.jpg` },
    side: 'right',
    bodyY: 0.26,
  },
  {
    id: 'kernel',
    no: 'PRJ-05',
    region: 'spine',
    hud: 'SPINE / BUS',
    anatomy: 'Nervous system',
    title: 'We_Are_Kernel — RISC-V OS',
    blurb:
      'A RISC-V kernel from scratch. Sv39 paging, VirtIO, a FAT filesystem, fork exec exit, pipes, a shell with redirection, and preemptive multitasking.',
    tags: ['C', 'RISC-V', 'Systems'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'image', src: `${BASE}media/kernel-terminal.svg` },
    side: 'left',
    bodyY: 0.42,
  },
  {
    id: 'crs',
    no: 'PRJ-06',
    region: 'arms',
    hud: 'ARMS / HANDS',
    anatomy: 'Manipulators',
    title: '3-DOF CRS Force-Control Arm',
    blurb:
      'Hybrid force and position control on a three-DOF arm. Task-space impedance, a Jacobian transpose law, a fifty-hertz loop. Peg insertion, zig-zag, and pushing an egg without breaking it.',
    tags: ['MATLAB', 'ROS', 'Control Theory', 'C'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/crs-arm.mp4`, poster: `${BASE}media/crs-arm-poster.jpg` },
    side: 'right',
    bodyY: 0.52,
  },
  {
    id: 'bb8',
    no: 'PRJ-07',
    region: 'core',
    hud: 'CORE / GYRO',
    anatomy: 'Balance core',
    title: 'BB-8 Reaction-Wheel Robot',
    blurb:
      'A spherical robot held steady by a reaction wheel. IMU stabilization, embedded motor control, a SolidWorks body.',
    tags: ['C++', 'IMU', 'SolidWorks', 'Embedded'],
    link: 'https://github.com/HridikH/portfolio',
    side: 'left',
    bodyY: 0.6,
  },
  {
    id: 'pendulum',
    no: 'PRJ-08',
    region: 'legs',
    hud: 'LEGS / VEST',
    anatomy: 'Vestibular balance',
    title: 'LQR Inverted Pendulum',
    blurb:
      'An inverted pendulum held upright by full-state LQR. Simulated in MATLAB, then made to stand up in hardware.',
    tags: ['MATLAB', 'Control Theory', 'Embedded'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/pendulum.mp4`, poster: `${BASE}media/pendulum-poster.jpg` },
    side: 'right',
    bodyY: 0.86,
  },
];

export const links = {
  github: 'https://github.com/HridikH/portfolio',
  linkedin: 'https://www.linkedin.com/in/hridikh/',
  email: 'hridikh2@illinois.edu',
  resume: `${BASE}media/Hridik_Hingorani_Resume.pdf`,
  instagram: 'https://instagram.com/dilkikhaamoshiyan',
  fiction: 'https://instagram.com/hridik775',
};

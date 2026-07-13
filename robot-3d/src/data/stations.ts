// The single source of truth for content. Copy is Hridik's: dry, deadpan, concise.
// bodyY: 0 = top of head, 1 = soles of feet. Drives camera traverse + station order.
// region: which G1 mesh-group lights up when this station is active.
// Copied unchanged from the scroll-cinema build (src/data/stations.ts).

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
  link?: string; // outbound repo/report/demo; omitted for planned/in-progress work
  status?: string; // set on planned/in-progress projects -> amber "pending" treatment
  progress?: string; // what's done so far, in place of a quantified result
  metric?: string; // one quantified result, rendered as a stat line
  media?: { type: 'video' | 'image'; src: string; poster?: string };
  side: 'left' | 'right';
  bodyY: number;
};

export const stations: Station[] = [
  {
    id: 'flexhand',
    no: 'PRJ-01',
    region: 'brain',
    hud: 'BRAIN / MOTOR',
    anatomy: 'Motor cortex',
    title: 'Flex-Sensor Teleop Hand',
    status: 'Planned / in progress',
    blurb:
      'A leader–follower teleoperation system: a flex-sensor glove drives a 5-DOF FlexiGrip robotic hand over ESP-NOW wireless, with a planned EMG muscle-sensor layer as a second, switchable input mode.',
    progress:
      'Electrical foundation designed and validated — a 5-channel flex-sensor-to-ESP32 interface board in KiCad, schematic capture through PCB layout, ERC/DRC clean and breadboard-validated before committing to fab.',
    tags: ['ESP32', 'ESP-NOW', 'KiCad', 'PCA9685', 'Flex Sensors', 'EMG (planned)'],
    side: 'left',
    bodyY: 0.06,
  },
  {
    id: 'ur3',
    metric: '15 mm placement accuracy',
    no: 'PRJ-02',
    region: 'eyes',
    hud: 'OPTIC / VISION',
    anatomy: 'Visual cortex',
    title: 'UR3 Vision-Guided Arm',
    blurb:
      'OpenCV detection, RRT and A* path planning, and real-time pose estimation driving pick-and-place on a UR3. ROS integration. 15-millimeter placement.',
    tags: ['Python', 'ROS', 'OpenCV', 'C++'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/ur3.mp4`, poster: `${BASE}media/ur3-poster.jpg` },
    side: 'right',
    bodyY: 0.14,
  },
  {
    id: 'grogu',
    metric: '22 DOF',
    no: 'PRJ-03',
    region: 'face',
    hud: 'FACE / EXPR',
    anatomy: 'Facial actuation',
    title: 'Animatronic Grogu',
    status: 'Planned / in progress',
    blurb:
      'ECE 445 capstone. A 22-DOF bipedal animatronic. Will own the software, the LLM pipeline (local LLM with Claude API, Whisper in, Coqui out), and the mechanical design end to end, on a custom PCB for power. It will look at you.',
    tags: ['Python', 'C++', 'KiCad', 'ROS', 'LLM'],
    side: 'left',
    bodyY: 0.2,
  },
  {
    id: 'jarvis',
    metric: '30 ms wake-to-response',
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
    metric: '6,000 lines of C',
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
    metric: '50 Hz control loop',
    no: 'PRJ-06',
    region: 'arms',
    hud: 'ARMS / HANDS',
    anatomy: 'Manipulators',
    title: '6-DOF CRS Force-Control Arm',
    blurb:
      'Hybrid force and position control on a six-DOF arm. Task-space impedance, a Jacobian transpose law, a fifty-hertz loop. Peg insertion, zig-zag, and pushing an egg without breaking it.',
    tags: ['MATLAB', 'ROS', 'Control Theory', 'C'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/crs-arm.mp4`, poster: `${BASE}media/crs-arm-poster.jpg` },
    side: 'right',
    bodyY: 0.52,
  },
  {
    id: 'pendulum',
    metric: '3 s settling time',
    no: 'PRJ-07',
    region: 'legs',
    hud: 'LEGS / VEST',
    anatomy: 'Vestibular balance',
    title: 'LQR Inverted Pendulum',
    blurb:
      'An inverted pendulum held upright by full-state LQR. Simulated in MATLAB, then made to stand up in hardware.',
    tags: ['MATLAB', 'Control Theory', 'Embedded'],
    link: 'https://github.com/HridikH/portfolio',
    media: { type: 'video', src: `${BASE}media/pendulum.mp4`, poster: `${BASE}media/pendulum-poster.jpg` },
    side: 'left',
    bodyY: 0.86,
  },
  {
    id: 'cartpole',
    metric: '1 kHz RK4 · scratch LQR',
    no: 'PRJ-08',
    region: 'legs',
    hud: 'SIM / CTRL',
    anatomy: 'Motor control',
    title: 'Cart-Pole Control Simulator',
    blurb:
      'A CLI simulator with full nonlinear cart-pole dynamics, RK4 integration at one kilohertz, and PID and LQR control. The LQR solver is written from scratch with discrete Riccati iteration. Benchmarked across six gain presets.',
    tags: ['Rust', 'LQR', 'PID', 'Simulation'],
    link: 'https://github.com/hridikh/cart-pole-control',
    side: 'right',
    bodyY: 0.9,
  },
  {
    id: 'motionplanning',
    metric: 'A* 6–11% shorter · <20 ms',
    no: 'PRJ-09',
    region: 'legs',
    hud: 'PLAN / NAV',
    anatomy: 'Path planning',
    title: 'Motion Planning Visualizer: A* vs RRT*',
    blurb:
      'From-scratch implementations of A* and RRT* benchmarked on identical maps, with animated visualizations of the search expansion. A* found six-to-eleven-percent shorter paths in under twenty milliseconds.',
    tags: ['Python', 'A*', 'RRT*', 'Planning'],
    link: 'https://github.com/hridikh/motion-planning-visualizer',
    side: 'left',
    bodyY: 0.94,
  },
];

export const links = {
  github: 'https://github.com/HridikH/portfolio',
  linkedin: 'https://www.linkedin.com/in/HridikH',
  email: 'hridikh2@illinois.edu',
  resume: `${BASE}media/Hridik_Hingorani_Resume.pdf`, // concise
  cvFull: `${BASE}media/Hridik_Hingorani_CV.pdf`, // full, built from resume/cv.tex
  instagram: 'https://instagram.com/dilkikhaamoshiyan',
  fiction: 'https://instagram.com/hridik775',
};

// "Off the clock" + contact copy, carried over from the previous site verbatim.
export const offClock = {
  label: 'Off the clock',
  title: 'The other half compiles too.',
  body:
    'Alongside the engineering, Hridik writes poetry and literary fiction. The poems lean on Mumbai-specific references, Hinglish code-switching, and language he tries to keep precise. Posted, fairly regularly, on Instagram.',
  pull: 'Engineering and writing are both just ways of making something out of nothing.',
};

export const contact = {
  label: 'End of diagnostic',
  title: 'Building future readiness today.',
  body: 'Open to a Fall 2026 co-op or internship in robotics and controls. Champaign, IL.',
  status: 'open to Fall 2026 co-op / internship (robotics & controls)',
};

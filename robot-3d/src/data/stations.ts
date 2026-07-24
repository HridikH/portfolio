// The single source of truth for project content. Copy is Hridik's: dry, deadpan, concise.
// bodyY: 0 = top of head, 1 = soles of feet. Drives camera traverse + scroll order (top to bottom).
// region: which G1 mesh-group lights up when this station is active.
// featuredRank: strongest-first ordering for any "featured" surface, INDEPENDENT of body location.
//   The robot walk stays head-to-toe (by bodyY); featuredRank lets a featured view lead with the
//   strongest completed work without disturbing the anatomical mapping.
// phase: completed (default) | in-progress | planned. Drives the status badge + amber treatment.
//   Completed work leads the walk; in-progress/planned are clearly marked and never lead.

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

export type Phase = 'completed' | 'in-progress' | 'planned';

export type Station = {
  id: string;
  no: string; // project id shown in HUD (sequential, top to bottom)
  region: Region;
  hud: string; // short telemetry label
  anatomy: string; // human-readable region
  title: string;
  blurb: string;
  tags: string[];
  link?: string; // outbound repo/report/demo; omitted when no verified URL exists yet
  phase?: Phase; // undefined == completed
  featuredRank?: number; // 1 = strongest; used for featured ordering, not body order
  progress?: string; // what is done so far, in place of a quantified result
  metric?: string; // one quantified result, rendered as a stat line
  media?: { type: 'video' | 'image'; src: string; poster?: string };
  side: 'left' | 'right';
  bodyY: number;
};

// Ordered head to toe (bodyY ascending) so the diagnostic walk reads top to bottom.
// Completed work opens the walk; the two unfinished projects sit mid-body, clearly badged.
export const stations: Station[] = [
  {
    id: 'ur3',
    metric: '15 mm placement accuracy',
    no: 'PRJ-01',
    region: 'eyes',
    hud: 'OPTIC / VISION',
    anatomy: 'Visual cortex',
    title: 'UR3 Vision-Guided Arm',
    phase: 'completed',
    featuredRank: 1,
    blurb:
      'OpenCV detection, RRT and A* path planning, and real-time pose estimation driving pick-and-place on a UR3. ROS integration. Reached 15 mm placement accuracy in bench testing.',
    tags: ['Python', 'ROS', 'OpenCV', 'C++'],
    link: 'https://github.com/HridikH/ur3-image-drawing',
    media: { type: 'video', src: `${BASE}media/ur3.mp4`, poster: `${BASE}media/ur3-poster.jpg` },
    side: 'right',
    bodyY: 0.14,
  },
  {
    id: 'grogu',
    metric: '22 DOF',
    no: 'PRJ-02',
    region: 'face',
    hud: 'FACE / EXPR',
    anatomy: 'Facial actuation',
    title: 'Animatronic Grogu',
    phase: 'planned',
    featuredRank: 9,
    blurb:
      'ECE 445 senior design capstone, currently in planning. A 22-DOF bipedal animatronic. Planned scope covers the software, the LLM voice pipeline (local LLM with Claude API, Whisper in, Coqui out), and the mechanical design, on a custom PCB for power.',
    tags: ['Python', 'C++', 'KiCad', 'ROS', 'LLM'],
    side: 'left',
    bodyY: 0.2,
  },
  {
    id: 'jupiter',
    metric: '0.3 to 0.6 s first token, warm',
    no: 'PRJ-03',
    region: 'jaw',
    hud: 'VOCAL / LANG',
    anatomy: 'Language center',
    title: 'Jupiter AI',
    phase: 'completed',
    featuredRank: 8,
    blurb:
      'A fully local voice assistant for Apple Silicon, no cloud and no API keys. Whisper STT, a Qwen3 router and main model on MLX with speculative decoding and a persistent prompt cache, and Kokoro streaming TTS. Continuous VAD gives real barge-in: start speaking and it halts generation mid-sentence.',
    tags: ['Python', 'MLX', 'Qwen3', 'Whisper', 'Kokoro TTS'],
    link: 'https://github.com/HridikH/JupiterAI',
    media: { type: 'video', src: `${BASE}media/jarvis.mp4`, poster: `${BASE}media/jarvis-poster.jpg` },
    side: 'right',
    bodyY: 0.26,
  },
  {
    id: 'kernel',
    metric: '6,000 lines of C',
    no: 'PRJ-04',
    region: 'spine',
    hud: 'SPINE / BUS',
    anatomy: 'Nervous system',
    title: 'We_Are_Kernel, RISC-V OS',
    phase: 'completed',
    featuredRank: 3,
    blurb:
      'A RISC-V kernel from scratch. Sv39 paging, VirtIO, a FAT filesystem, fork exec exit, pipes, a shell with redirection, and preemptive multitasking.',
    tags: ['C', 'RISC-V', 'Systems'],
    // TODO(hridik): course OS project is likely private. Provide a public mirror, writeup, or demo link,
    // or leave unlinked. Do not link the portfolio repo.
    link: undefined,
    media: { type: 'image', src: `${BASE}media/kernel-terminal.svg` },
    side: 'left',
    bodyY: 0.42,
  },
  {
    id: 'crs',
    metric: '50 Hz control loop',
    no: 'PRJ-05',
    region: 'arms',
    hud: 'ARMS / HANDS',
    anatomy: 'Manipulators',
    title: '6-DOF CRS Force-Control Arm',
    phase: 'completed',
    featuredRank: 2,
    blurb:
      'Hybrid force and position control on a six-DOF arm. Task-space impedance, a Jacobian transpose law, a fifty-hertz loop. Peg insertion, zig-zag, and pushing an egg without breaking it.',
    tags: ['MATLAB', 'ROS', 'Control Theory', 'C'],
    link: 'https://github.com/HridikH/ME446_repo',
    media: { type: 'video', src: `${BASE}media/crs-arm.mp4`, poster: `${BASE}media/crs-arm-poster.jpg` },
    side: 'right',
    bodyY: 0.52,
  },
  {
    id: 'flexhand',
    no: 'PRJ-06',
    region: 'arms',
    hud: 'HANDS / TELEOP',
    anatomy: 'Teleoperated grasp',
    title: 'Flex-Sensor Teleop Hand',
    phase: 'in-progress',
    featuredRank: 7,
    blurb:
      'A leader-follower teleoperation system: a flex-sensor glove drives a 5-DOF FlexiGrip robotic hand over ESP-NOW wireless, with a planned EMG muscle-sensor layer as a second, switchable input mode.',
    progress:
      'Electrical foundation designed and validated: a 5-channel flex-sensor-to-ESP32 interface board in KiCad, schematic capture through PCB layout, ERC/DRC clean and breadboard-validated before committing to fab.',
    tags: ['ESP32', 'ESP-NOW', 'KiCad', 'PCA9685', 'Flex Sensors', 'EMG (planned)'],
    side: 'left',
    bodyY: 0.56,
  },
  {
    id: 'pendulum',
    metric: '3 s settling time',
    no: 'PRJ-07',
    region: 'legs',
    hud: 'LEGS / VEST',
    anatomy: 'Vestibular balance',
    title: 'LQR Inverted Pendulum',
    phase: 'completed',
    featuredRank: 4,
    blurb:
      'An inverted pendulum held upright by full-state LQR. Simulated in MATLAB, then made to stand up in hardware.',
    tags: ['MATLAB', 'Control Theory', 'Embedded'],
    // TODO(hridik): add the correct public repo URL if one exists.
    link: undefined,
    media: { type: 'video', src: `${BASE}media/pendulum.mp4`, poster: `${BASE}media/pendulum-poster.jpg` },
    side: 'right',
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
    phase: 'completed',
    featuredRank: 5,
    blurb:
      'A CLI simulator with full nonlinear cart-pole dynamics, RK4 integration at one kilohertz, and PID and LQR control. The LQR solver is written from scratch with discrete Riccati iteration. Benchmarked across six gain presets.',
    tags: ['Rust', 'LQR', 'PID', 'Simulation'],
    link: 'https://github.com/HridikH/cart-pole-control',
    side: 'left',
    bodyY: 0.9,
  },
  {
    id: 'motionplanning',
    metric: 'A* 6 to 11% shorter · under 20 ms',
    no: 'PRJ-09',
    region: 'legs',
    hud: 'PLAN / NAV',
    anatomy: 'Path planning',
    title: 'Motion Planning Visualizer: A* vs RRT*',
    phase: 'completed',
    featuredRank: 6,
    blurb:
      'From-scratch implementations of A* and RRT* benchmarked on identical maps, with animated visualizations of the search expansion. A* found 6 to 11% shorter paths in under twenty milliseconds.',
    tags: ['Python', 'A*', 'RRT*', 'Planning'],
    link: 'https://github.com/HridikH/motion-planning-visualizer',
    side: 'right',
    bodyY: 0.94,
  },
];

export const links = {
  github: 'https://github.com/HridikH', // profile, not the portfolio repo
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

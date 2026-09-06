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
  linkNote?: string; // shown in place of a link for completed work with no public repo (e.g. private coursework)
  phase?: Phase; // undefined == completed
  featuredRank?: number; // 1 = strongest; used for featured ordering, not body order
  progress?: string; // what is done so far, in place of a quantified result
  metric?: string; // one quantified result, rendered as a stat line
  media?: { type: 'video' | 'image'; src: string; poster?: string };
  side: 'left' | 'right';
  bodyY: number;
};

// Scroll order = array order. The four lead projects are ordered for relevance to
// real-time control / robotics roles, so the camera tours the body rather than
// strictly descending it; bodyY still pins each project to its correct body region.
export const stations: Station[] = [
  {
    id: 'crs',
    metric: '1 kHz torque loop · 5 N-m saturation',
    no: 'PRJ-01',
    region: 'arms',
    hud: 'ARMS / HANDS',
    anatomy: 'Manipulators',
    title: 'Real-Time Task-Space Impedance Control, CRS Arm',
    phase: 'completed',
    featuredRank: 1,
    blurb:
      'A 1 kHz task-space impedance controller in C issuing joint torque commands to a 3-joint arm. Task-space PD law mapped through the Jacobian transpose, per-waypoint stiffness modes for selective compliance, Coulomb and viscous friction compensation, and torque saturation at 5 N-m. Joint velocity estimated by finite-differencing encoder angles through a 3-sample moving average. Normal force is open-loop feedforward via estimated contact stiffness, with no force sensor, verified against a physical scale. Debugged actuator saturation, loop-timing violations, and near-singular configurations on an oscilloscope. Peg insertion, zig-zag, and pushing an egg without breaking it.',
    tags: ['C', 'TMS320F28335 DSP', 'Impedance Control', 'Real-Time'],
    // HridikH/ME446_repo now returns 404 (deleted or made private). Unlinked so the
    // lead card cannot 404 in front of an interviewer. Restore the link if republished.
    link: undefined,
    linkNote: 'Code available on request',
    media: { type: 'video', src: `${BASE}media/crs-arm.mp4`, poster: `${BASE}media/crs-arm-poster.jpg` },
    side: 'right',
    bodyY: 0.52,
  },
  {
    id: 'ur3',
    metric: '142 strokes, drawn in 7 minutes',
    no: 'PRJ-02',
    region: 'eyes',
    hud: 'OPTIC / VISION',
    anatomy: 'Visual cortex',
    title: 'UR3 Vision-Guided Contour Drawing',
    phase: 'completed',
    featuredRank: 2,
    blurb:
      'Closed-form analytic inverse kinematics derived from scratch for a 6-DOF UR3, alongside product-of-exponentials forward kinematics via matrix exponentials, with joint targets commanded over ROS and held to 0.0005 rad per joint. The vision front end (Canny edge detection, contour extraction, polygonal simplification) maps an arbitrary image onto a 20 cm workspace square. Executed a 142-stroke test drawing in 7 minutes on physical hardware.',
    tags: ['Python', 'ROS', 'OpenCV'],
    link: 'https://github.com/HridikH/ur3-image-drawing',
    media: { type: 'video', src: `${BASE}media/ur3.mp4`, poster: `${BASE}media/ur3-poster.jpg` },
    side: 'left',
    bodyY: 0.14,
  },
  {
    id: 'kernel',
    metric: '6,000 lines of C',
    no: 'PRJ-03',
    region: 'spine',
    hud: 'SPINE / BUS',
    anatomy: 'Nervous system',
    title: 'RISC-V Preemptive Multitasking OS Kernel',
    phase: 'completed',
    featuredRank: 3,
    blurb:
      'A roughly 6,000-line bare-metal kernel built from scratch: preemptive scheduler with deterministic context switching, Sv39 three-level virtual memory, a VirtIO block device driver, a FAT filesystem, fork/exec/exit, pipes, and an interactive shell. Traced a page-table entry truncation bug through GDB and QEMU that silently corrupted physical page numbers on high-address mappings, isolated it to PTE field packing, and validated the fix across the full paging path.',
    tags: ['C', 'RISC-V Assembly', 'Systems'],
    // Private ECE 391 coursework: not published, to respect course academic-integrity policy.
    link: undefined,
    linkNote: 'Code available on request',
    media: { type: 'image', src: `${BASE}media/kernel-terminal.svg` },
    side: 'right',
    bodyY: 0.42,
  },
  {
    id: 'flexhand',
    no: 'PRJ-04',
    region: 'arms',
    hud: 'HANDS / TELEOP',
    anatomy: 'Teleoperated grasp',
    title: 'Flex-Sensor Teleoperated Hand',
    phase: 'in-progress',
    featuredRank: 4,
    blurb:
      'Leader-follower teleoperation over ESP-NOW: a 5-channel flex-sensor interface board designed and fully routed in KiCad, with the ESP32 restricted to ADC1-only pins (GPIO32 to 36) to avoid ADC2 and WiFi contention, 50 kilohm dividers per channel, and a PCA9685 PWM driver for servo output.',
    progress:
      'Firmware stack written: ADC sampling, the ESP-NOW leader-follower link, and PWM servo mapping. Breadboard-validated the full glove-to-hand signal path, catching hardware bugs before committing the board to fabrication.',
    tags: ['ESP32', 'C++', 'KiCad', 'ESP-NOW', 'PCA9685'],
    side: 'left',
    bodyY: 0.56,
  },
  {
    id: 'grogu',
    metric: '22 DOF',
    no: 'PRJ-05',
    region: 'face',
    hud: 'FACE / EXPR',
    anatomy: 'Facial actuation',
    title: 'Animatronic Grogu',
    phase: 'planned',
    featuredRank: 9,
    blurb:
      'ECE 445 senior design capstone, currently in planning. A 22-DOF bipedal animatronic. Planned scope covers the software, the LLM voice pipeline (local LLM with Claude API, Whisper in, Coqui out), and the mechanical design, on a custom PCB for power.',
    tags: ['Python', 'C++', 'KiCad', 'ROS', 'LLM'],
    side: 'right',
    bodyY: 0.2,
  },
  {
    id: 'jupiter',
    metric: '0.3 to 0.6 s first token, warm',
    no: 'PRJ-06',
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
    side: 'left',
    bodyY: 0.26,
  },
  {
    id: 'pendulum',
    // 1.1 s is the measured figure (confirmed by Hridik, backed by a plot). The old
    // 3 s claim and the ~0.9 s design-pole prediction are both retired; use 1.1 s only.
    metric: '1.1 s settling time',
    no: 'PRJ-07',
    region: 'legs',
    hud: 'LEGS / VEST',
    anatomy: 'Vestibular balance',
    title: 'Inverted Pendulum, Pole Placement and Observer',
    phase: 'completed',
    featuredRank: 4,
    blurb:
      'Pole-placement state feedback with a Luenberger observer, built as two decoupled 2-state blocks and gain-scheduled across the upright and hanging linearizations. Friction parameters identified from logged step-response data.',
    tags: ['MATLAB', 'State Estimation', 'System ID', 'Embedded'],
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
      'An LQR solver written from scratch, numerical linearization through discrete Riccati iteration, with no external math libraries. Benchmarked 6 gain presets against tuned PID on settling time and actuator effort, over full nonlinear dynamics integrated at 1 kHz with RK4.',
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

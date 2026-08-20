// Experience / teaching / research / leadership / education.
// Source of truth: Hridik's content brief. Do not invent facts.

export type RecordEntry = {
  role: string;
  org: string;
  meta: string; // dates · location
  lines: string[];
  featured?: boolean;
};

export type RecordGroup = { heading: string; entries: RecordEntry[] };

export type RecordSectionData = {
  hud: string;
  title: string;
  groups: RecordGroup[];
};

export const recordSections: RecordSectionData[] = [
  {
    hud: 'RECORD / EXPERIENCE',
    title: 'Experience',
    groups: [
      {
        heading: 'Internships',
        entries: [
          {
            role: 'AI Software Engineering Intern',
            org: 'Software Associates',
            meta: 'May 2026 · August 2026 · Remote',
            lines: [
              'Built a local-first voice assistant on embedded Linux and Apple Silicon: Whisper STT, LLM routing through Ollama with cloud fallback, Coqui TTS, a FastAPI service layer, and an Electron client. Ran MLX LoRA fine-tuning to adapt the local model’s response behavior.',
              'Diagnosed and fixed audio-pipeline timing failures, device interface faults, and I2C/UART peripheral errors that were dropping utterances mid-stream, taking capture from intermittent to reliable end to end.',
              'Shipped a Python and Flask trading service on the Interactive Brokers REST API: a five-indicator weighted signal engine (RSI, MACD, Bollinger Bands, moving averages, ATR), automated stop-loss, take-profit and trailing-stop risk logic, and a live position and P&L dashboard.',
            ],
          },
          {
            role: 'AI Software Development Intern',
            org: 'HealthArk Insights',
            meta: 'May 2025 · August 2025 · Mumbai, India',
            lines: [
              'Python document-processing features: summarization, web scraping, and dynamic formatting tools built to client specifications. Requirements gathered and validated with clients directly. Shipped to production.',
            ],
          },
        ],
      },
    ],
  },
  {
    hud: 'RECORD / TEACH+RESEARCH',
    title: 'Teaching & research',
    groups: [
      {
        heading: 'Course assistant',
        entries: [
          {
            role: 'ECE 385 (FPGA Design) Course Assistant',
            org: 'University of Illinois at Urbana-Champaign',
            meta: 'January 2026 · present',
            lines: [
              'Leads lab sections for 60+ students on SystemVerilog, FPGA timing closure, and hardware-software co-design. Debugs student implementations across RTL logic, timing constraints, and board-level signal integrity.',
            ],
          },
          {
            role: 'MATH 257 (Linear Algebra) Course Assistant',
            org: 'University of Illinois at Urbana-Champaign',
            meta: 'January 2025 · December 2025',
            lines: [
              'Taught Python-based linear algebra lab sections to roughly 200 students through hands-on computational exercises.',
            ],
          },
        ],
      },
      {
        heading: 'Research',
        entries: [
          {
            role: 'Project Lead, Brainwaves Team',
            org: 'NeuroTechX UIUC',
            meta: 'ongoing',
            lines: [
              'Leads the Brainwaves project team, overseeing the club podcast and social output. EEG signal-processing and neural-network research through the club.',
            ],
          },
          {
            role: 'Independent EEG Research',
            org: 'Self-directed',
            meta: 'ongoing',
            lines: [
              '8-channel, 2-layer EEG acquisition board in KiCad. Op-amp analog front end with low-pass filtering for microvolt-level biopotentials; schematic capture through PCB layout for signal integrity across all eight channels. Separate from the club work.',
            ],
          },
        ],
      },
    ],
  },
  {
    hud: 'RECORD / LEAD+EDU',
    title: 'Leadership & education',
    groups: [
      {
        heading: 'Projects & organizations',
        entries: [
          {
            role: 'Project Lead, StethoSpy',
            org: 'I-MADE UIUC',
            meta: 'January 2024 · August 2025',
            featured: true,
            lines: [
              'Prototype electronic stethoscope for heart-sound acquisition and murmur screening, aimed at rural and low-infrastructure settings. Custom PCB captures heart sounds; an ADC/DAC pipeline processes the analog signal to flag cardiac irregularities for follow-up. Not clinically validated.',
              'Hardware design and signal processing owned end to end. Built for healthcare access gaps in underserved communities.',
            ],
          },
          {
            role: 'Event Lead, then Senior Coordinator, National Team',
            org: 'Hindu YUVA',
            meta: 'January 2025 · present',
            lines: [
              'Manages the UIUC chapter and the event team. Large-scale Hindu cultural and community events at chapter and national scope.',
            ],
          },
        ],
      },
      {
        heading: 'Education',
        entries: [
          {
            role: 'BS Computer Engineering, Minor in Mathematics',
            org: 'University of Illinois at Urbana-Champaign',
            meta: 'August 2023 · expected May 2027',
            lines: [
              'Coursework: ECE 470 Robotics · ECE 486 Control Systems · ECE 484 Principles of Safe Autonomy · ECE 391 Operating Systems · ECE 494 Deep Learning for Computer Vision.',
            ],
          },
        ],
      },
    ],
  },
];

export const phone = '(447) 902-5994';

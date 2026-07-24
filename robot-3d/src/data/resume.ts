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
            role: 'AI Intern',
            org: 'Software Associates',
            meta: 'May 2026 · present · North Potomac, MD',
            lines: [
              'AI-powered algorithmic trading bot in Python. Multi-indicator signal engine (RSI, MACD, Bollinger Bands, SMA/EMA, ATR) generating weighted BUY/SELL/HOLD signals with confidence scoring.',
              'Interactive Brokers Client Portal REST API for live market data, historical bars, and automated order execution with session keepalive. ATR-based dynamic position sizing; automated stop-loss, take-profit, and trailing stop; per-trade portfolio exposure capped at 1%.',
              'Real-time Flask + JavaScript dashboard: auto-refreshing signal cards, live P&L, open positions, full trade history. Modular 6-file architecture across signals, risk, and broker connectivity.',
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
            meta: 'August 2025 · present',
            lines: [
              'Supported 100+ students in SystemVerilog FPGA labs: FSMs, datapaths, memory systems, VGA output, simulation, synthesis, testbench verification, hardware debugging. Root-caused failures in timing, reset logic, module interfaces, and deployment.',
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
            meta: 'expected May 2027',
            lines: [
              'Coursework: ECE 470 Robotics · ECE 489 Robot Dynamics & Control · ECE 486 Control Systems · ECE 391 Operating Systems · ECE 385 FPGA Design · ECE 210 Analog Signal Processing · CS 225 Data Structures · MATH 257 Linear Algebra.',
            ],
          },
        ],
      },
    ],
  },
];

export const phone = '(447) 902-5994';

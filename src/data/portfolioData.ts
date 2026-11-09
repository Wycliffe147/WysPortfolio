export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Client & Business" | "Systems & Automation" | "Edge & Web" | "AI & Desktop";
  infra: "Cloudflare" | "Render" | "Vercel" | "Local/Linux" | "Local/Windows" | "Multi-Cloud";
  tech: string[];
  thumbnail: string;
  logo: string;
  gradient?: string;
  featured?: boolean;
  showOnHome?: boolean;
  sortOrder?: number;
  links: {
    live?: string;
    github?: string;
  };
  metrics?: string;
  story?: {
    challenge: string;
    solution: string;
    impact: string;
  };
}

export interface ClientPartner {
  name: string;
  role: string;
  organization: string;
  domain?: string;
  badge: string;
  quote: string;
  logo: string;
  avatarText: string;
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  {
    name: "RGM Malawi Ministries",
    role: "Leadership & Media Team",
    organization: "RGM Malawi",
    domain: "rgmmalawi.org",
    badge: "Cloudflare D1 & Pages",
    logo: "/logos/rgm.png",
    quote: "Wycliffe built a high-speed, localized portal for our nationwide community with rock-solid uptime and effortless content distribution.",
    avatarText: "RG"
  },
  {
    name: "Pamthunzi Electronics",
    role: "Retail & Operations",
    organization: "Pamthunzi Retail",
    domain: "pamthunzi-electronics.pages.dev",
    badge: "E-Commerce & Auth Backend",
    logo: "/logos/pamthunzi.png",
    quote: "Transformed our inventory and stock discovery into a fast, mobile-friendly catalog that customers find effortless to navigate.",
    avatarText: "PE"
  },
  {
    name: "School Administration Network",
    role: "Academic Directors",
    organization: "Secondary Schools Malawi",
    domain: "school-os-mw",
    badge: "School OS & WhatsApp Dispatch",
    logo: "/logos/reportgen.png",
    quote: "The automated report card engine and WhatsApp dispatch eliminated weeks of tedious paperwork. Parents receive grades immediately on their phones.",
    avatarText: "SO"
  },
  {
    name: "Wamaka Rice",
    role: "Agribusiness & Brand",
    organization: "Wamaka Agro",
    domain: "wamaka-rice",
    badge: "Brand Identity & Web Assets",
    logo: "/logos/wamaka.png",
    quote: "Delivered distinct digital assets and branding that elevated our agricultural produce in the regional marketplace.",
    avatarText: "WR"
  },
  {
    name: "DigiHelp Community",
    role: "Digital Services & Support",
    organization: "DigiHelp Malawi",
    domain: "digihelp-site.pages.dev",
    badge: "Cloudflare Edge",
    logo: "/logos/digihelp.svg",
    quote: "An accessible, lightweight web infrastructure helping students and citizens locate technical assistance with minimal mobile data.",
    avatarText: "DH"
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "school-os-mw",
    sortOrder: 3,
    title: "School OS Malawi",
    tagline: "Comprehensive School Management, Payments & Parent Portal",
    description: "An educational management system built for Malawian institutions, streamlining student records, fee collection, and digital discovery.",
    category: "Systems & Automation",
    infra: "Render",
    tech: ["Node.js", "Express", "MongoDB", "Render", "Tailwind CSS"],
    thumbnail: "/e-library.png",
    logo: "/logos/reportgen.png",
    gradient: "from-indigo-100 via-purple-50 to-emerald-50",
    featured: true,
    metrics: "Active School Deployment",
    links: {
      github: "https://github.com/Wycliffe147/school-os-mw"
    },
    story: {
      challenge: "Schools struggled with fragmented spreadsheets, manual fee tracking, and slow report generation.",
      solution: "Engineered a unified management platform with automated fee tracking and accessible portals.",
      impact: "Streamlined administrative burden by over 70% and gave parents direct digital visibility into academic progress."
    }
  },
  {
    id: "report-generator-web",
    sortOrder: 2,
    title: "Automated Report Card & WhatsApp Dispatcher",
    tagline: "Student PDF Report Engine with WhatsApp Baileys Integration",
    description: "High-speed batch report card generator that merges grades, renders secure PDF report cards, and automatically dispatches them directly to parents via WhatsApp.",
    category: "Systems & Automation",
    infra: "Render",
    tech: ["Node.js", "Baileys WhatsApp API", "pdf-lib", "Express", "Render"],
    thumbnail: "/ReportGenICO.png",
    logo: "/logos/reportgen.png",
    gradient: "from-emerald-100 via-teal-50 to-cyan-50",
    featured: true,
    metrics: "Thousands of PDFs Dispatched",
    links: {
      github: "https://github.com/Wycliffe147/report-generator-web"
    },
    story: {
      challenge: "Printing physical report cards for thousands of students cost schools heavily in paper and took weeks to reach guardians.",
      solution: "Created an automated pipeline using pdf-lib for dynamic report generation and Baileys socket integration for direct WhatsApp delivery.",
      impact: "Reduced distribution time from 2 weeks to under 30 minutes with zero paper wastage."
    }
  },
  {
    id: "rgm-site",
    sortOrder: 1,
    title: "RGM Malawi Portal",
    tagline: "Official Ministry Portal & Database on Cloudflare D1",
    description: "Edge-hosted community platform with serverless SQLite database bindings, event calendars, and publication archive.",
    category: "Client & Business",
    infra: "Cloudflare",
    tech: ["Cloudflare Pages", "Cloudflare D1 (SQLite)", "Wrangler", "JavaScript"],
    thumbnail: "/logos/rgm.png",
    logo: "/logos/rgm.png",
    gradient: "from-amber-100 via-amber-50 to-indigo-50",
    featured: true,
    metrics: "Custom Domain with Sub-50ms Edge Response",
    links: {
      live: "https://rgmmalawi.org",
      github: "https://github.com/Wycliffe147/rgm-site"
    },
    story: {
      challenge: "Needed a reliable, zero-maintenance web presence capable of serving thousands of congregants with low latency across Southern Africa.",
      solution: "Architected purely on Cloudflare edge infrastructure utilizing Cloudflare D1 serverless database.",
      impact: "Zero hosting cost, 100% uptime, and instant global page delivery without managing any virtual servers."
    }
  },
  {
    id: "pamthunzi-electronics",
    sortOrder: 4,
    title: "Pamthunzi Electronics Storefront",
    tagline: "Commercial Retail Catalog with JWT Admin & Inventory",
    description: "Fast e-commerce and retail stock catalog designed for speedy asset loading on mobile devices, with token-secured administrative controls.",
    category: "Client & Business",
    infra: "Cloudflare",
    tech: ["Cloudflare Pages", "JWT Authentication", "JavaScript", "Responsive Design"],
    thumbnail: "/logos/pamthunzi.png",
    logo: "/logos/pamthunzi.png",
    gradient: "from-rose-100 via-slate-50 to-amber-50",
    featured: true,
    metrics: "Commercial Retail in Production",
    links: {
      live: "https://pamthunzi-electronics.pages.dev",
      github: "https://github.com/Wycliffe147/pamthunzi-electronics"
    },
    story: {
      challenge: "Local retail electronics customers needed to inspect stock availability and specs before visiting physical shops.",
      solution: "Built a lightning-quick mobile catalog with instant item search and a lightweight backend for price updates.",
      impact: "Boosted customer inquiries and streamlined sales operations."
    }
  },
  {
    id: "wylibrary",
    sortOrder: 5,
    title: "WyLibrary Knowledge Engine",
    tagline: "Large-Scale Educational Digital Sanctuary & Asset Delivery",
    description: "Curated digital repository managing 10,000+ educational resources and books with low-bandwidth offline caching and instant previews.",
    category: "Edge & Web",
    infra: "Multi-Cloud",
    tech: ["Cloudflare Pages", "Cloudflare R2", "Node.js", "Firebase RTDB"],
    thumbnail: "/e-library.png",
    logo: "/logos/wylibrary.png",
    gradient: "from-sky-100 via-indigo-50 to-blue-50",
    featured: true,
    metrics: "10,000+ Indexed Resources",
    links: {
      live: "https://wylibrary.org",
      github: "https://github.com/Wycliffe147/e-library"
    },
    story: {
      challenge: "High data costs and inconsistent connections prevented students from reliably accessing key reference textbooks.",
      solution: "Constructed an edge-cached digital library backed by Cloudflare R2 object storage with progressive download buffers.",
      impact: "Provides students with frictionless access to critical learning materials."
    }
  },
  {
    id: "wamaka-rice",
    sortOrder: 9,
    title: "Wamaka Rice Digital Brand",
    tagline: "Modern Agribusiness Identity & Digital Presence",
    description: "Agricultural commerce portal and visual brand identity highlighting domestic Malawian rice production and distribution channels.",
    category: "Client & Business",
    infra: "Cloudflare",
    tech: ["Cloudflare Pages", "SVG Design", "Tailwind CSS", "JavaScript"],
    thumbnail: "/logos/wamaka.png",
    logo: "/logos/wamaka.png",
    gradient: "from-emerald-100 via-lime-50 to-amber-50",
    featured: true,
    metrics: "Regional Agriculture Brand",
    links: {
      github: "https://github.com/Wycliffe147/wamaka-rice"
    },
    story: {
      challenge: "An emerging agricultural producer needed premium digital branding to reach wholesalers and distributors.",
      solution: "Created clean visual identities, vector marks, and a fast product landing showcase.",
      impact: "Elevated brand credibility and enabled direct commercial order inquiries."
    }
  },
  {
    id: "star-pdf-search",
    sortOrder: 10,
    title: "Star PDF Search Engine",
    tagline: "High-Speed Client-Side PDF Content Indexer",
    description: "Instantaneous textual retrieval engine parsing through multi-thousand-page documents with PDF.js client-side memory indexing.",
    category: "Systems & Automation",
    infra: "Cloudflare",
    tech: ["JavaScript", "PDF.js", "Cloudflare Pages", "Web Workers"],
    thumbnail: "/StarPdf.png",
    logo: "/logos/starpdf.png",
    gradient: "from-amber-100 via-yellow-50 to-sky-50",
    featured: false,
    metrics: "Instant In-Browser Search",
    links: {
      live: "https://star-pdfs.pages.dev",
      github: "https://github.com/Wycliffe147/Strar-pdf-search-website"
    }
  },
  {
    id: "jarvis-omarchy",
    sortOrder: 6,
    title: "JARVIS for Omarchy Linux",
    tagline: "Native Arch Linux & Hyprland IPC Companion with Wayland Automation",
    description: "Modular desktop AI companion tailored directly for Arch Linux and the Hyprland Wayland compositor. Features deep IPC control, PipeWire audio routing via wpctl, Wayland screen capture via grim, playerctl MPRIS media transport, and window management automation.",
    category: "AI & Desktop",
    infra: "Local/Linux",
    tech: ["Python", "Arch Linux", "Hyprland IPC", "PipeWire (wpctl)", "Wayland (grim/wtype)"],
    thumbnail: "/profile.png",
    logo: "/Logo v2.2.png",
    gradient: "from-purple-100 via-indigo-50 to-slate-100",
    featured: true,
    showOnHome: true,
    metrics: "Native Wayland Subsystem",
    links: {
      github: "https://github.com/Wycliffe147/jarvis-assistant"
    },
    story: {
      challenge: "Desktop assistants lack deep hooks into modern Wayland compositors and Linux tiling window managers, leaving power users disconnected.",
      solution: "Engineered native tool bridges mapping voice triggers and intents directly to hyprctl IPC, wpctl audio nodes, grim screenshots, and synthetic keystrokes.",
      impact: "Delivers zero-latency, hands-free workspace switching, screen OCR, volume adjustment, and local command execution entirely offline."
    }
  },
  {
    id: "jarvis-android-termux",
    sortOrder: 7,
    title: "JARVIS on Android (Termux)",
    tagline: "Autonomous On-Device Smartphone AI with Hardware & ADB Control",
    description: "Voice-controlled AI assistant that runs entirely on an Android phone via Termux without requiring a PC, cloud server, or companion app. Controls device hardware, SMS, calls, contacts, camera, and other Android devices over wireless ADB.",
    category: "AI & Desktop",
    infra: "Local/Linux",
    tech: ["Python", "Termux API", "Whisper STT", "Piper TTS", "Wireless ADB"],
    thumbnail: "/profile.png",
    logo: "/Logo v2.2.png",
    gradient: "from-emerald-100 via-teal-50 to-indigo-50",
    featured: true,
    showOnHome: true,
    metrics: "100% On-Device Android Execution",
    links: {
      github: "https://github.com/Wycliffe147/jarvis-assistant"
    },
    story: {
      challenge: "Smartphone assistants are vendor-locked and cannot automate third-party apps, dispatch terminal commands, or function offline.",
      solution: "Built a local intent router utilizing on-device Whisper speech recognition, Piper neural voice, Termux API bindings, and loopback ADB automation.",
      impact: "Empowered an ordinary Android phone to perform autonomous device actions, capture and OCR screens, and dispatch notifications locally."
    }
  },
  {
    id: "jarvis-windows",
    sortOrder: 8,
    title: "JARVIS Companion for Windows",
    tagline: "Win32 & Core Audio Automation Assistant with Phone Tethering",
    description: "Native Windows port utilizing Win32 APIs, pycaw Core Audio control, pywinauto UI automation, and PIL screen analysis. Integrates a wireless ADB bridge to control tethered mobile devices and mirror screens via scrcpy.",
    category: "AI & Desktop",
    infra: "Local/Linux",
    tech: ["Python", "pywinauto", "pycaw (Core Audio)", "Tesseract OCR", "SAPI5 / Piper"],
    thumbnail: "/profile.png",
    logo: "/Logo v2.2.png",
    gradient: "from-blue-100 via-sky-50 to-indigo-50",
    featured: true,
    showOnHome: true,
    metrics: "Win32 & Wireless ADB Bridge",
    links: {
      github: "https://github.com/Wycliffe147/jarvis-windows"
    },
    story: {
      challenge: "Porting a Unix-native shell assistant to Windows required re-architecting hardware interactions away from bash pipelines to native COM interfaces.",
      solution: "Rewrote hardware tools with Windows-native equivalents using pycaw for master audio endpoints, pywinauto for GUI manipulation, and native SAPI5 voices.",
      impact: "Provided unified desktop voice automation, local screen OCR, and seamless cross-platform phone control from a Windows workstation."
    }
  },
  {
    id: "digihelp-site",
    sortOrder: 11,
    title: "DigiHelp Community Hub",
    tagline: "Public Digital Services & Knowledge Base",
    description: "Digital literacy and technical assistance platform deployed on Cloudflare Pages providing localized guides and tools.",
    category: "Client & Business",
    infra: "Cloudflare",
    tech: ["Cloudflare Pages", "HTML5", "Modern CSS", "Edge DNS"],
    thumbnail: "/logos/digihelp.svg",
    logo: "/logos/digihelp.svg",
    gradient: "from-cyan-100 via-sky-50 to-emerald-50",
    featured: false,
    metrics: "Low Bandwidth Accessible",
    links: {
      live: "https://digihelp-site.pages.dev",
      github: "https://github.com/Wycliffe147/digihelp-site"
    }
  },
  {
    id: "report-generator-excel",
    sortOrder: 12,
    title: "Report Generator (Excel Origin)",
    tagline: "The VBA + WhatsApp Root of a School Automation Lineage",
    description: "The original macro-enabled Excel application that started it all. Used VBA macros for batch student report card generation and WPPConnect to dispatch results directly to parents over WhatsApp from a Windows PC. This is where the idea was born.",
    category: "Systems & Automation",
    infra: "Local/Windows",
    tech: ["MS Excel VBA", "WPPConnect", "Node.js", "Windows Batch"],
    thumbnail: "/logos/reportgen.png",
    logo: "/logos/reportgen.png",
    gradient: "from-green-100 via-emerald-50 to-teal-50",
    featured: false,
    showOnHome: false,
    metrics: "Origin of School OS Malawi",
    links: {
      live: "https://github.com/Wycliffe147/WysPortfolio/releases/tag/ExcelReportV2.0.0",
      github: "https://github.com/Wycliffe147/WysPortfolio/releases/download/ExcelReportV2.0.0/Excel.Report.Generator.zip"
    },
    story: {
      challenge: "Schools needed automated report card generation and direct parent communication before any web infrastructure existed.",
      solution: "Built a macro-driven Excel workbook with VBA batch processing and integrated WPPConnect to dispatch report cards to parents over WhatsApp from a Windows PC.",
      impact: "This project directly evolved into report-generator-web and later into the full School OS Malawi platform - a complete lineage born from one spreadsheet."
    }
  }
];

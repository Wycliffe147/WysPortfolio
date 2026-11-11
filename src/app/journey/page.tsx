"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Cpu,
  Terminal,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Archive,
  History,
  GitBranch,
  ArrowUpRight,
  Clock,
  Compass,
  Code2,
  Workflow,
  Lightbulb,
  Smartphone,
  Flame,
  Globe2
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

interface ArchiveEdition {
  version: string;
  date: string;
  title: string;
  description: string;
  tech: string[];
  url: string;
  tag: string;
}

const ARCHIVE_EDITIONS: ArchiveEdition[] = [
  {
    version: "v0",
    date: "June 9, 2025",
    title: "First Web Release (The Clean Slate)",
    description: "The very first deployment of Wy's Portfolio on Vercel. Created after separating heavy binary files from the original repo, establishing the clean web presence with Firebase integration.",
    tech: ["HTML5", "CSS3", "JavaScript", "Firebase Auth", "Vercel"],
    url: "/archive/v0/index.html",
    tag: "archive-v0-original"
  },
  {
    version: "v1",
    date: "August 17, 2025",
    title: "Introduction of View All Projects",
    description: "The first milestone expanding beyond a single page. Introduced the 'View All Projects' action and the standalone gallery showcase page with custom filtering.",
    tech: ["HTML5", "Vanilla JS", "Modular CSS", "All Projects Gallery"],
    url: "/archive/v1/index.html",
    tag: "archive-v1-aug2025-all-projects"
  },
  {
    version: "v2",
    date: "January 18, 2026",
    title: "Vercel Web Analytics & Foundation",
    description: "The edition that ran throughout early 2026 with Vercel Web Analytics tracking scripts embedded directly, capturing initial traffic patterns and usage.",
    tech: ["Vercel Insights", "HTML5", "JavaScript", "Static Analytics"],
    url: "/archive/v2/index.html",
    tag: "archive-v2-jan2026-analytics"
  },
  {
    version: "v3",
    date: "April 6, 2026",
    title: "The e-library Milestone (May 2026 State)",
    description: "Replaced the generic placeholder project card with the live e-library platform showcase. This remained the live production state throughout May 2026.",
    tech: ["HTML5", "CSS Grid", "e-library Integration", "Responsive Cards"],
    url: "/archive/v3/index.html",
    tag: "archive-v3-apr2026-elibrary"
  },
  {
    version: "v4",
    date: "June 28, 2026",
    title: "Three.js Experiments & Dark Mode",
    description: "Mid-2026 major visual upgrade introducing interactive 3D background experiments, site-wide dark mode styling, and dynamic project status indicators.",
    tech: ["Three.js", "Dark Mode", "Interactive Canvas", "CSS Variables"],
    url: "/archive/v4/index.html",
    tag: "archive-v2-june2026"
  },
  {
    version: "v5",
    date: "July 31, 2026",
    title: "Final Legacy HTML & Excel V2.0.0 Release",
    description: "The culmination of the vanilla HTML/CSS era. Features the Three.js mesh canvas, full project details view, and the final direct download release of Excel Report Generator V2.0.0.",
    tech: ["Three.js", "Excel V2.0.0 Release", "Vanilla JS SPA", "Full Modal System"],
    url: "/archive/v5/index.html",
    tag: "archive-v3-july2026-legacy"
  },
  {
    version: "v6",
    date: "November 9, 2026",
    title: "Pre-Next.js Rewrite Legacy Snapshot",
    description: "The complete, preserved state of the legacy HTML portfolio preserved just before initiating the modern Next.js 14 multi-cloud architectural rebuild.",
    tech: ["HTML5 / CSS3", "Pre-Next.js State", "Full Project History", "Firebase RTDB"],
    url: "/archive/v6/index.html",
    tag: "archive-v4-nov2026-pre-nextjs"
  }
];

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-violet-700">The Journey</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              All Projects
            </Link>
            <a
              href="https://github.com/Wycliffe147/WysPortfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40 border-b border-slate-200/70 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold tracking-wide uppercase mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Origins, Systems & Persistence</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1] mb-6">
            From Building Scooby-Doo to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Systems Architect
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            The authentic story of building with what you have: overcoming internet bundle limits in Malawi, teaching myself across school breaks, solving real friction in Malawian schools, and preserving every milestone along the way.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-violet-600" />
              <span>2023 - 2026 Archive</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
              <Archive className="w-3.5 h-3.5 text-indigo-600" />
              <span>7 Deployed Generations</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Edge-Hosted on Vercel</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
              <span>VBA to Multi-Cloud Lineage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative Chapters */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-20">
        
        {/* Chapter 1 */}
        <section className="relative pl-6 sm:pl-10 border-l-2 border-violet-200 space-y-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs">
            1
          </div>

          <div>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-widest">
              Early Childhood & The Builder Instinct
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              "When I Grow Up, I Will Make My Own Scooby-Doo"
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              I have been fascinated by how things work for as long as I can remember. When I was three years old, my uncles recall me regularly telling them that when I grew up, I was going to build my own Scooby-Doo. As I got older, that childlike curiosity matured into a deep fascination with games, robotics, inventions, and the desire to build things.
            </p>
            <p>
              My fundamental goal was never to write code for the sake of writing code. I wanted to help people and solve real-world problems with things I created. At first, I didn't want to be confined to software; I actually preferred physical inventions and hands-on hardware. While my path eventually saw accelerated growth on the software side, the builder instinct remains the same: create practical tools that make someone's life demonstrably better.
            </p>
            <p>
              I cannot pinpoint the exact moment I learned to operate a computer. Between the ages of 3 and 5, my cousins had laptops and my uncles had desktop PCs. By watching them, wanting to play computer games, and navigating movie media players, I naturally figured out how a computer functioned from the ground up without formal training.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-sm flex gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">The Early Constraint</span>
              The drive to invent was completely real, but I lacked physical resources and mentorship. There were no maker labs, no robotic kits, and no experienced engineers around to ask for direction. Every breakthrough had to be extracted through keen observation and relentless trial and error.
            </div>
          </div>
        </section>

        {/* Chapter 2 */}
        <section className="relative pl-6 sm:pl-10 border-l-2 border-indigo-200 space-y-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs">
            2
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Secondary School & The Self-Directed Era
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              From the Robert Laws ICT Club to First Smartphone
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              In Form 1 at <strong>Robert Laws Secondary School</strong>, I joined the school ICT Club. That was where I was first introduced to web development and typed my very first lines of HTML inside the school computer lab.
            </p>
            <p>
              Beyond the bare basics of HTML and CSS, progress was steady but slow until <strong>2023</strong>, when I finally acquired my very first smartphone. That smartphone blew the doors open. Suddenly, I had access to YouTube tutorials, developer discussions on Reddit, and, in that same year, ChatGPT. For someone who never had an experienced teacher to ask questions to, an AI that could explain obscure syntax errors and programming concepts on demand was a game-changer.
            </p>
            <p>
              Back then, I didn't have a specific product to build, so I built for practice. I redesigned standard tutorial examples, reconstructed basic layouts, and even wrote personal essays and poems entirely in raw HTML tags just to build muscle memory. (In fact, one of my earliest preserved repositories, <code className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">Wy-s-website</code> from September 2024, literally contains <code className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">Poem by Wycliffe.html</code>).
            </p>
          </div>
        </section>

        {/* Chapter 3 */}
        <section className="relative pl-6 sm:pl-10 border-l-2 border-sky-200 space-y-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs">
            3
          </div>

          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">
              Late 2024: Post-MSCE & The Bandwidth Reality
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              The Data Bundle Wall & The Kali Linux Dopamine Hit
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              In August 2024, during the holiday after sitting for MSCE for the first time, I was eager to get back to my personal engineering interests after months of intense school revision. I wanted to learn directly from the internet, but in Malawi, internet access requires purchasing cellular data bundles.
            </p>
            <p>
              When you are first starting out, you don't yet know what tools fit your workflow. You have to download multiple software packages, runtimes, and frameworks just to test them until you find what works. But I could not afford the sheer amount of data bundles required to experiment freely.
            </p>
            <p>
              I recognized two realities: first, technology was evolving at blinding speed, and to be truly valuable (or, for lack of a better term, <em>dangerous</em> in tech), I needed a deep, unshakeable familiarity with computers. Second, every other discipline I was curious about required computer fluency as a prerequisite.
            </p>
            <p>
              So understanding the lower levels of computing came first. I decided to dive into ethical hacking and cybersecurity for a very pragmatic, humorous reason: <em>I wanted to see if I could use those skills to secure free internet, so I would have unlimited freedom to continue learning.</em>
            </p>
            <p>
              That dive led me straight into <strong>Kali Linux</strong>, networking protocols, bash terminals, and system internals. The rush of commanding an operating system from the terminal delivered a massive dopamine hit that transformed my curiosity from casual interest into an obsession.
            </p>
          </div>
        </section>

        {/* Chapter 4 */}
        <section className="relative pl-6 sm:pl-10 border-l-2 border-emerald-200 space-y-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs">
            4
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Early 2025: Star Secondary & The Real World Problem
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              The Report Card Crisis & The USB Flash Drive Dilemma
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              By late 2024 and early 2025, I was at <strong>Star Secondary School</strong> repeating Form 3. That was where theory met real-world friction.
            </p>
            <p>
              First, the school lacked an official digital emblem, so I designed an official school logo for them. But the biggest problem emerged right after the Term 1 exams:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Delayed Delivery:</strong> Student report cards intended for delivery during the school holiday were delivered well after Term 2 had already begun.
              </li>
              <li>
                <strong>Widespread Inaccuracies:</strong> Some students had grades recorded for subjects they never took; others were missing grades for core subjects; others had marks mistakenly inflated or deflated.
              </li>
            </ul>
            <p>
              I saw the root cause: an interlocking trap between <strong>speed and accuracy</strong>. In trying to be fast, the administration made errors. In trying to fix errors, delivery slowed to a crawl. Each problem was making the other worse.
            </p>
            <p>
              I stepped in to build an automated batch generator in Excel. Standard spreadsheet formulas quickly proved inadequate for the multi-subject logic, so I spent a week teaching myself <strong>VBA macros</strong> to automate report card compilation and bulk generation.
            </p>
            <p>
              To demonstrate progress to the school's Exam Manager, I had to copy the macro workbook onto a <strong>USB flash drive</strong> and take it to school. But the physical handoff failed repeatedly: some days I forgot the drive at home; other days the Exam Manager was in meetings or invigilating exams and didn't have time to look.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-violet-50/80 border border-violet-200/70 text-violet-950 text-sm">
            <span className="font-bold text-violet-800 block text-base mb-1">
              The Epiphany That Built Wy's Portfolio
            </span>
            <p className="leading-relaxed">
              I realized that sending files via WhatsApp or email meant constantly managing recipients and updates. What I needed was a <strong>dedicated, permanent website</strong> where I could upload the Excel tool once, and the Exam Manager, teachers, and classmates could access the latest build anytime, anywhere.
            </p>
            <p className="leading-relaxed mt-2">
              That single thought was the genesis of this portfolio. First, it was just a download page for the report generator. Then the vision expanded: <em>"If I'm going to keep solving problems and building software, this website should become the home for everything I create, a living archive of my journey, and my first chance to do real web engineering on a problem that actually matters."</em>
            </p>
          </div>
        </section>

        {/* Chapter 5: The Lineage Diagram */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Workflow className="w-6 h-6 text-violet-400" />
            <h2 className="font-display text-2xl font-bold text-white">
              The Lineage: From Spreadsheet to School OS
            </h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            What started as a single VBA macro running on an Excel workbook in Form 3 evolved into a full software family that modernized school management across Malawi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-xs font-mono font-semibold text-emerald-400">STAGE 1 (Early 2025)</div>
              <h3 className="font-bold text-white text-base">Excel Report Generator</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                VBA batch macro engine that compiled student marks and integrated WPPConnect to dispatch report cards over WhatsApp from a Windows PC.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                Spawned Wy's Portfolio as its download home.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-xs font-mono font-semibold text-sky-400">STAGE 2 (Mid 2025)</div>
              <h3 className="font-bold text-white text-base">report-generator-web</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Migrated the logic from local desktop Excel to a lightweight browser application, removing dependency on Microsoft Office licenses.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                First web SaaS implementation.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-xs font-mono font-semibold text-violet-400">STAGE 3 (2026 - Present)</div>
              <h3 className="font-bold text-white text-base">school-os-mw (School OS)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-scale Malawi School Operating System with multi-term academic grading, parent portal, tuition billing, and zero-maintenance edge architecture.
              </p>
              <div className="pt-2 text-[11px] font-mono text-violet-300 font-semibold">
                Complete school operations in production.
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 6: The Time Machine Archive */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-violet-600" />
              <span>Living Time Machine</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950">
              The 7-Generation Portfolio Vault
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every single era of this website has been extracted from git history and deployed live to Vercel edge. Click any edition to run the exact historical website as it existed at that moment in time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ARCHIVE_EDITIONS.map((item) => (
              <div
                key={item.version}
                className="group relative p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-violet-300 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-100">
                      {item.version.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-600">
                    Tag: {item.tag}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Launch Archive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Ancestor Repos Section */}
          <div className="p-6 rounded-3xl bg-slate-100/70 border border-slate-200/80 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-slate-800" />
              <span>Ancestor Repositories on GitHub</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Before the current repository existed, the portfolio moved through distinct experimentation repos on GitHub:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <a
                href="https://github.com/Wycliffe147/WyPortfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900">WyPortfolio</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Created April 26, 2025. Housed the original Excel macros and ReportGenDownloads.html.
                  </div>
                </div>
                <div className="text-[11px] text-violet-700 font-semibold mt-3 flex items-center gap-1">
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              <a
                href="https://github.com/Wycliffe147/WyPortfolio-PWA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900">WyPortfolio-PWA</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Created April 27, 2025. Experiment with service workers and offline PWA manifests.
                  </div>
                </div>
                <div className="text-[11px] text-violet-700 font-semibold mt-3 flex items-center gap-1">
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              <a
                href="https://github.com/Wycliffe147/WyPortfolio-Dashborad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900">WyPortfolio-Dashborad</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Created June 7, 2025. Dedicated repo testing early dashboard authentication.
                  </div>
                </div>
                <div className="text-[11px] text-violet-700 font-semibold mt-3 flex items-center gap-1">
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Chapter 7: Living Philosophy & Wide Horizons */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-800/60 border border-violet-700 text-violet-200 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Wide Horizons</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            The Philosophy: Solve What Is in Front of You
          </h2>

          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              I do not define myself as just a "web developer" or a "frontend engineer". My interests span operating systems, low-bandwidth networks, automation scripts, Android mods (like the <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">mi-boot-replacer</code> module), and physical robotics.
            </p>
            <p>
              Software was the medium that allowed me to grow the fastest without needing an expensive hardware lab. But the underlying drive has never changed since I was three years old: look at the world around you, spot where systems are failing people, and build something practical that fixes it.
            </p>
            <p className="text-violet-300 font-semibold pt-2">
              This chronicle is not a museum piece; it is an active engineering log. As new challenges arise and new systems are shipped, this timeline will continue to grow.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
            >
              <span>Explore All Current Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-800/80 hover:bg-violet-800 text-white font-semibold text-sm transition-colors border border-violet-700/80"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Wy's Portfolio</span>
            <span>© 2025 - 2026 Wycliffe Mwanganda</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-slate-900 transition-colors">Projects</Link>
            <Link href="/journey" className="hover:text-slate-900 font-semibold text-violet-700">The Journey</Link>
            <a href="https://github.com/Wycliffe147" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

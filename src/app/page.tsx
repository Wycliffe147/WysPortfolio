"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import {
  ExternalLink,
  Server,
  Cloud,
  Cpu,
  CheckCircle2,
  Send,
  Globe,
  Terminal,
  ArrowRight,
  Zap,
  ShieldCheck,
  Eye,
  X,
  Code2,
  Building2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Check,
  ChevronRight,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import { PROJECTS, CLIENT_PARTNERS, ProjectItem } from "@/data/portfolioData";
import { mergeProjects } from "@/lib/projectUtils";

export default function HomePage() {
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeStoryProject, setActiveStoryProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const merged = mergeProjects(val, PROJECTS);
          setAllProjects(merged);
        } else {
          setAllProjects(PROJECTS);
        }
      },
      (err) => {
        console.warn("Firebase listener warning:", err);
        setAllProjects(PROJECTS);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = [
    "All",
    "Client & Business",
    "Systems & Automation",
    "Edge & Web",
    "AI & Desktop"
  ];

  // Only display projects marked to show on home (or default true)
  const homeProjects = allProjects.filter((p) => p.showOnHome !== false);

  const filteredProjects =
    selectedCategory === "All"
      ? homeProjects
      : homeProjects.filter((p) => p.category === selectedCategory);

  const getInfraBadge = (infra: ProjectItem["infra"]) => {
    switch (infra) {
      case "Cloudflare":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200/80",
          dot: "bg-amber-500",
          name: "Cloudflare Edge"
        };
      case "Render":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
          dot: "bg-emerald-500",
          name: "Render Cloud"
        };
      case "Vercel":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200/80",
          dot: "bg-sky-500",
          name: "Vercel Platform"
        };
      case "Multi-Cloud":
        return {
          bg: "bg-violet-50 text-violet-800 border-violet-200/80",
          dot: "bg-violet-500",
          name: "Multi-Cloud Mesh"
        };
      default:
        return {
          bg: "bg-purple-50 text-purple-800 border-purple-200/80",
          dot: "bg-purple-500",
          name: "Linux Native"
        };
    }
  };

  const getGradientBanner = (project: ProjectItem) => {
    if (project.gradient && project.gradient.trim() !== "") {
      return project.gradient;
    }
    switch (project.infra) {
      case "Cloudflare":
        return "from-amber-200/70 via-orange-100 to-amber-50";
      case "Render":
        return "from-emerald-200/70 via-teal-100 to-emerald-50";
      case "Vercel":
        return "from-sky-200/70 via-blue-100 to-sky-50";
      case "Multi-Cloud":
        return "from-violet-200/70 via-indigo-100 to-sky-50";
      default:
        return "from-purple-200/70 via-fuchsia-100 to-purple-50";
    }
  };

  return (
    <div className="min-h-screen text-slate-900 relative">
      {/* 4-point ambient radiant mesh backdrop */}
      <div className="mesh-backdrop" aria-hidden="true" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="#top" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/20 shadow-sm flex items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-emerald-500 text-white font-bold text-sm">
              <Image
                src="/profile.png"
                alt="Wycliffe Mwanganda"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 tracking-tight block text-sm sm:text-base group-hover:text-violet-700 transition-colors">
                Wycliffe Mwanganda
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="ping-radar absolute h-2 w-2 rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Open for new projects
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600" aria-label="Main navigation">
            <a href="#clients" className="hover:text-violet-700 transition-colors">
              Clients
            </a>
            <a href="#systems" className="hover:text-violet-700 transition-colors">
              Systems
            </a>
            <Link href="/projects" className="hover:text-violet-700 transition-colors flex items-center gap-1.5">
              <span>All Projects</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                {allProjects.length}
              </span>
            </Link>
            <a href="#clouds" className="hover:text-violet-700 transition-colors">
              Clouds in Concert
            </a>
            <a href="#contact" className="hover:text-violet-700 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Wycliffe147"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full border border-slate-200 bg-white transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
            >
              <span>Start a project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-violet-600" />
                <span>Based in Malawi, shipping worldwide</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
                Move at the speed of your ideas with{" "}
                <span className="gradient-headline">
                  zero cloud waste.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                I am a systems engineer and multi-cloud architect. I build production platforms,
                automated workflows, and edge databases across Cloudflare, Render, and Vercel that stay
                fast on low bandwidth and cost almost nothing to run.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#systems"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-violet-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <span>See the systems</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-full border border-slate-300 shadow-xs hover:border-violet-600 transition-all text-sm"
                >
                  <Mail className="w-4 h-4 text-violet-600" />
                  <span>Email me</span>
                </a>
              </div>

              {/* 4-Colored Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="premium-card p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Live Systems
                  </div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-violet-700">
                    8+
                  </div>
                </div>

                <div className="premium-card p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Users Impacted
                  </div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-sky-600">
                    10,000+
                  </div>
                </div>

                <div className="premium-card p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Free Tier Mastery
                  </div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-emerald-600">
                    100%
                  </div>
                </div>

                <div className="premium-card p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Edge Response
                  </div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-amber-600">
                    &lt;50ms
                  </div>
                </div>
              </div>
            </div>

            {/* Right-Side Deployment Status & Sparkline Widget */}
            <div className="lg:col-span-5">
              <div className="premium-card p-6 relative overflow-hidden bg-white/95">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-base font-bold text-slate-900">
                      Deployment Status
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      Active production nodes
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    All systems live
                  </span>
                </div>

                {/* Network Uptime with Animated Sparkline Chart */}
                <div className="py-4 my-2 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
                        99.98
                      </span>
                      <span className="font-bold text-slate-500 text-sm">%</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      network uptime <span className="text-slate-400">last 30 days</span>
                    </div>
                  </div>

                  {/* 18-bar uptime sparkline chart */}
                  <div className="flex items-end gap-1 h-10 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100" title="30-day stable uptime graph">
                    {[45, 60, 52, 70, 65, 80, 75, 90, 85, 95, 88, 92, 98, 94, 96, 92, 99, 100].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className="chart-bar w-1 rounded-t-xs bg-emerald-500/80 inline-block"
                      />
                    ))}
                  </div>
                </div>

                {/* Real Live Endpoint Routes */}
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block font-mono text-xs">
                        rgmmalawi.org
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Cloudflare D1 SQLite Edge
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-semibold">19ms</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">
                        100%
                      </span>
                    </div>
                  </li>

                  <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block font-mono text-xs">
                        school-os-mw
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Render Node Engine & Baileys
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-semibold">41ms</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">
                        99.9%
                      </span>
                    </div>
                  </li>

                  <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block font-mono text-xs">
                        wyport.vercel.app
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Vercel Next.js 15 & SSR
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-semibold">33ms</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">
                        99.98%
                      </span>
                    </div>
                  </li>

                  <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block font-mono text-xs">
                        pamthunzi.pages.dev
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Cloudflare Pages Storefront
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-semibold">28ms</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">
                        99.99%
                      </span>
                    </div>
                  </li>
                </ul>

                {/* Bottom micro-chips */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 font-semibold border border-violet-100 flex items-center gap-1">
                    <Check className="w-3 h-3 text-violet-600" /> Edge DNS (&lt;12ms)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> $0/mo Cloud Free Tier
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WHO I WORK WITH */}
        <section id="clients" className="py-20 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                PROVEN SOCIAL PROOF
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Who I work with
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-xl">
                Ministries, shops, secondary schools, and agribusiness that need software that works everyday.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CLIENT_PARTNERS.map((client, idx) => (
                <article
                  key={idx}
                  className="premium-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                        {client.logo ? (
                          <Image
                            src={client.logo}
                            alt={client.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-display font-bold text-violet-700 text-sm">
                            {client.avatarText}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900 text-base leading-snug">
                          {client.name}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium block">
                          {client.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {client.domain}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {client.badge}
                      </span>
                    </div>

                    <blockquote className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-violet-300 pl-3">
                      &ldquo;{client.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{client.organization}</span>
                    <span className="text-emerald-700 font-semibold">Active Client</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: SYSTEMS I HAVE SHIPPED */}
        <section id="systems" className="py-20 border-t border-slate-200/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                SYSTEMS ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Systems I have shipped
              </h2>
              <p className="text-slate-600 mt-2 text-base">
                Production-grade applications built for resilience, accessibility, and zero wasted compute.
              </p>
            </div>

            {/* Category filter pills & View All shortcut */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-violet-600"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors ml-auto sm:ml-0"
              >
                <span>View All ({allProjects.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const infra = getInfraBadge(project.infra);
              const bannerBg = getGradientBanner(project);
              const isCustomInline = bannerBg.startsWith("linear-gradient") || bannerBg.startsWith("#") || bannerBg.startsWith("rgb");

              return (
                <article
                  key={project.id}
                  className="premium-card flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Header banner filled with project logo over ambient gradient */}
                    <div
                      className={`relative h-48 sm:h-52 p-4 border-b border-slate-100 flex flex-col justify-between overflow-hidden ${
                        !isCustomInline ? `bg-gradient-to-br ${bannerBg}` : ""
                      }`}
                      style={isCustomInline ? { background: bannerBg } : undefined}
                    >
                      {/* Ambient enlarged logo watermark */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                        <Image
                          src={project.logo}
                          alt=""
                          fill
                          unoptimized={typeof project.logo === "string" && (project.logo.startsWith("data:") || project.logo.startsWith("http"))}
                          className="object-cover blur-xl opacity-20 scale-125 transition-transform duration-500 group-hover:scale-135"
                        />
                      </div>

                      {/* Prominent logo filling the canvas */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            src={project.logo}
                            alt={`${project.title} logo`}
                            fill
                            unoptimized={typeof project.logo === "string" && (project.logo.startsWith("data:") || project.logo.startsWith("http"))}
                            className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Overlay chips */}
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${infra.bg} shadow-xs`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${infra.dot}`} />
                          {infra.name}
                        </span>

                        {project.metrics && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-md border border-white/80 shadow-xs">
                            {project.metrics}
                          </span>
                        )}
                      </div>
                      <div className="relative z-10"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-display font-bold text-slate-900 text-lg leading-snug group-hover:text-violet-700 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 mb-3">
                        {project.tagline}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-6 pt-0 mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live site</span>
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-300 transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    {project.story && (
                      <button
                        onClick={() => setActiveStoryProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900 transition-colors ml-auto"
                      >
                        <span>Read the story</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom View All Projects CTA Banner */}
          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl max-w-3xl w-full mx-auto shadow-xl">
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                  Full Catalog & Archives
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  Explore all {allProjects.length} systems & tools
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                  Showing {homeProjects.length} featured on homepage. Browse the complete catalog with live search, filters, and architecture notes.
                </p>
              </div>

              <Link
                href="/projects"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg group"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
        {activeStoryProject && activeStoryProject.story && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveStoryProject(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <Image
                    src={activeStoryProject.logo}
                    alt={activeStoryProject.title}
                    width={36}
                    height={36}
                    unoptimized={typeof activeStoryProject.logo === "string" && (activeStoryProject.logo.startsWith("data:") || activeStoryProject.logo.startsWith("http"))}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {activeStoryProject.title}
                  </h3>
                  <span className="text-xs text-violet-700 font-semibold">
                    Technical Case Study & Story
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100">
                  <h4 className="font-display font-bold text-rose-700 text-xs uppercase tracking-wider mb-1">
                    The Challenge
                  </h4>
                  <p className="text-rose-950 leading-relaxed text-sm">
                    {activeStoryProject.story.challenge}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-100">
                  <h4 className="font-display font-bold text-violet-700 text-xs uppercase tracking-wider mb-1">
                    The Engineering Solution
                  </h4>
                  <p className="text-violet-950 leading-relaxed text-sm">
                    {activeStoryProject.story.solution}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                  <h4 className="font-display font-bold text-emerald-700 text-xs uppercase tracking-wider mb-1">
                    Measurable Impact
                  </h4>
                  <p className="text-emerald-950 leading-relaxed text-sm">
                    {activeStoryProject.story.impact}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {activeStoryProject.tech.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActiveStoryProject(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: CLOUDS IN CONCERT (MULTI-CLOUD ARCHITECTURE) */}
        <section id="clouds" className="py-20 border-t border-slate-200/80 bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                THE RIGHT TOOL FOR THE RIGHT PROBLEM
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Clouds in Concert
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-xl">
                A multi-cloud toolkit with a bias towards simplicity, resilience, and zero operational waste.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="premium-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Cloud className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                  01 / Edge
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Cloudflare
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Put compute, SQLite data, and media close to the people using them.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Workers & Pages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    D1 Serverless SQLite
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    R2 Asset Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Wrangler CLI Automation
                  </li>
                </ul>
              </article>

              <article className="premium-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Server className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  02 / Services
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Render
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Keep long-running Node daemons steady and report engines connected.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Node.js Express Daemons
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    WhatsApp Baileys Socket
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Dynamic PDF Rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    MongoDB Cluster Sync
                  </li>
                </ul>
              </article>

              <article className="premium-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-1">
                  03 / Web
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Vercel
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Deliver modern web experiences with global edge SSR and instant preview branches.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Next.js 15 App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Tailwind CSS 3 Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Serverless API Routes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Git Continuous Integration
                  </li>
                </ul>
              </article>

              <article className="premium-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-1">
                  04 / Desktop AI
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Linux + AI
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Deep OS customization, local automation scripts, and native speech assistants.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Arch Linux / Omarchy / Hyprland
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Python Speech Synthesis (JARVIS)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Bash System Automations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Firebase RTDB Synchronization
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACT */}
        <section id="contact" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card p-8 sm:p-14 text-center relative overflow-hidden bg-white">
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                HAVE A GOOD PROBLEM?
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Let us make it <span className="gradient-headline">run beautifully.</span>
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Tell me what slows your business or school down. I will turn it into a dependable,
                high-speed system that runs with zero cloud waste.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:wycliffemwanganda@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-violet-700 shadow-sm transition-all text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send an email</span>
                </a>

                <a
                  href="https://wa.me/?text=Hi%20Wycliffe%2C%20let%20us%20talk%20about%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Message on WhatsApp</span>
                </a>

                <a
                  href="https://github.com/Wycliffe147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-violet-600 hover:text-violet-700 transition-all text-sm"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View GitHub</span>
                </a>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>WM ↗ MALAWI</span>
                <span>•</span>
                <span>AVAILABLE WORLDWIDE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 bg-white/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800">WM</span>
            <span>
              Wycliffe Mwanganda. Built on the edge in Malawi. Engineered with Next.js 15, Tailwind, and Free Tier Cloud.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Wycliffe147"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-violet-700 font-medium transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

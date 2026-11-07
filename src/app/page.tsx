"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Server,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  MessageSquare,
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
  Smartphone
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import { PROJECTS, CLIENT_PARTNERS, ProjectItem } from "@/data/portfolioData";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeStoryProject, setActiveStoryProject] = useState<ProjectItem | null>(null);

  const categories = [
    "All",
    "Client & Business",
    "Systems & Automation",
    "Edge & Web",
    "AI & Desktop"
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

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
          bg: "bg-blue-50 text-blue-800 border-blue-200/80",
          dot: "bg-blue-500",
          name: "Vercel Platform"
        };
      case "Multi-Cloud":
        return {
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
          dot: "bg-indigo-500",
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white relative">
      {/* Radiant ambient gradient mesh */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-pattern opacity-70 z-0" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-600/30 shadow-sm">
              <Image
                src="/profile.png"
                alt="Wycliffe Mwanganda"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight block text-sm sm:text-base">
                Wycliffe Mwanganda
              </span>
              <span className="text-xs text-indigo-600 font-medium block">
                Systems & Multi-Cloud Engineer
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#partners" className="hover:text-indigo-600 transition-colors">
              Partners & Proof
            </a>
            <a href="#projects" className="hover:text-indigo-600 transition-colors">
              Projects & Code
            </a>
            <a href="#cloud-matrix" className="hover:text-indigo-600 transition-colors">
              Cloud Matrix
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Wycliffe147"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Let&apos;s Build</span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for New Architecture & Systems Engineering
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Architecting High-Speed Systems with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Zero Cloud Waste.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
                I build battle-tested production platforms, automated data pipelines,
                and edge systems across Cloudflare Workers, Render backend engines,
                and Vercel. From localized educational OS tools to retail commerce in Malawi,
                I make robust engineering deliver tangible results.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore Built Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#partners"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Client Testimonials</span>
                </a>
              </div>

              {/* Quick stats ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-2xl font-black text-indigo-600">8+</div>
                  <div className="text-xs font-medium text-slate-600">Live Deployments</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-2xl font-black text-emerald-600">10k+</div>
                  <div className="text-xs font-medium text-slate-600">Students & Users</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-2xl font-black text-amber-600">100%</div>
                  <div className="text-xs font-medium text-slate-600">Zero Cost Cloud Free Tier</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-2xl font-black text-purple-600">&lt;50ms</div>
                  <div className="text-xs font-medium text-slate-600">Edge Response Speeds</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Card showcasing real multi-cloud active deployment */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-200/40 to-pink-200/40 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-mono font-bold text-slate-500">
                      wy-cloud-orchestrator
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active Production
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        CF
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Cloudflare Edge & D1</div>
                        <div className="text-xs text-slate-500">rgmmalawi.org & pamthunzi</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 99.98%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        RN
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Render Backend Engines</div>
                        <div className="text-xs text-slate-500">Report Generator & WhatsApp daemon</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> High Throughput
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        VC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Vercel & Next.js 15</div>
                        <div className="text-xs text-slate-500">wyport.vercel.app portfolio portal</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fast SSR
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                        FB
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Firebase Realtime DB</div>
                        <div className="text-xs text-slate-500">Live project sync & zero maintenance</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Free Tier
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Architected to stay 100% free with enterprise reliability and scalability.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WHO I WORK WITH (CLIENT PARTNERS & SOCIAL PROOF) */}
        <section id="partners" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                Trusted Partnerships & Endorsements
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Who I Have Built For & What They Say
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Direct testimonials from the organizations, businesses, and educational leaders
                who rely on my software everyday.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CLIENT_PARTNERS.map((client, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                          {client.logo ? (
                            <Image
                              src={client.logo}
                              alt={client.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <span className="font-bold text-indigo-600 text-sm">
                              {client.avatarText}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                            {client.name}
                          </h3>
                          <span className="text-xs text-slate-500 block font-medium">
                            {client.role} • {client.organization}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-block px-2.5 py-1 rounded-md bg-white border border-slate-200 text-indigo-700 text-[11px] font-semibold mb-3">
                      {client.badge}
                    </div>

                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      &ldquo;{client.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px]">{client.domain}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Partner
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: PROJECT SHOWCASE WITH ACTUAL LOGOS & ARCHITECTURE STORIES */}
        <section id="projects" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Code2 className="w-3.5 h-3.5" />
                Engineering Portfolio
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured Systems & Deployments
              </h2>
              <p className="text-slate-600 mt-2 text-base">
                Each project represents a production problem solved with clean architecture and real logos.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const infra = getInfraBadge(project.infra);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div>
                    {/* Top image preview with prominent real logo overlay */}
                    <div className="relative h-44 w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                      {/* Branded Logo Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-white/60 shadow-md flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                          <Image
                            src={project.logo}
                            alt={`${project.title} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800 pr-2">
                          {project.title}
                        </span>
                      </div>

                      {/* Infrastructure badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs ${infra.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${infra.dot}`} />
                          {infra.name}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="text-xs font-semibold text-indigo-600 mb-1">
                        {project.category}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1 mb-3">
                        {project.tagline}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {project.metrics && (
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{project.metrics}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Site</span>
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    {project.story && (
                      <button
                        onClick={() => setActiveStoryProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 p-1.5 transition-colors"
                        title="Read Architectural Story"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Story</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ARCHITECTURE STORY MODAL */}
        {activeStoryProject && activeStoryProject.story && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveStoryProject(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
                  <Image
                    src={activeStoryProject.logo}
                    alt={activeStoryProject.title}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeStoryProject.title}
                  </h3>
                  <span className="text-xs text-indigo-600 font-semibold">
                    Architecture & Engineering Story
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100">
                  <div className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1">
                    The Challenge
                  </div>
                  <p className="text-rose-950 leading-relaxed">
                    {activeStoryProject.story.challenge}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <div className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-1">
                    The Engineering Solution
                  </div>
                  <p className="text-indigo-950 leading-relaxed">
                    {activeStoryProject.story.solution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">
                    The Measurable Impact
                  </div>
                  <p className="text-emerald-950 leading-relaxed">
                    {activeStoryProject.story.impact}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveStoryProject(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MULTI-CLOUD MATRIX */}
        <section id="cloud-matrix" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Cloud className="w-3.5 h-3.5" />
                Zero Cost Infrastructure Mastery
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Multi-Cloud Architecture & Tooling Matrix
              </h2>
              <p className="mt-3 text-base text-slate-600">
                How I orchestrate enterprise-grade platforms completely on free tiers with zero operational costs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Cloudflare Edge</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Global edge computation and serverless database storage.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Cloudflare Pages & Workers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Cloudflare D1 Serverless SQLite
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Cloudflare R2 Object Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Wrangler CLI Automation
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Render Services</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Long-running Node daemons and heavy PDF generation engines.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Express.js REST APIs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Baileys WhatsApp Sockets
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    pdf-lib Dynamic Document Merge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    MongoDB Cluster Integration
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Vercel & Next.js</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Modern responsive frontends and serverless edge functions.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Next.js 15 App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Tailwind CSS 3 Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Serverless API Routes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Vercel CLI Git Sync
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Linux & Desktop AI</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Low-level system customization, local automation, and assistants.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Arch Linux / Omarchy / Hyprland
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Python Voice Synthesis (JARVIS)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Bash / CLI Automation Scripts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Firebase Spark RTDB Sync
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACT & CONNECT */}
        <section id="contact" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
                Direct Collaboration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Have a System, School, or Business to Build?
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed mb-8">
                Whether you need automated WhatsApp report dispatchers, Cloudflare edge applications,
                or a clean web presence, let us build software that makes an immediate difference.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:wycliffemwanganda@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>wycliffemwanganda@gmail.com</span>
                </a>

                <a
                  href="https://github.com/Wycliffe147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-sm border border-indigo-700/50 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>github.com/Wycliffe147</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden relative">
              <Image src="/profile.png" alt="Wycliffe" fill className="object-cover" />
            </div>
            <span>
              Wycliffe Mwanganda. Engineered with Next.js 15, Tailwind, and Free Tier Cloud.
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
              className="inline-flex items-center gap-1 hover:text-indigo-600 font-medium transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

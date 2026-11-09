"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  CheckCircle2,
  SlidersHorizontal,
  FolderGit2
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import { PROJECTS, ProjectItem } from "@/data/portfolioData";
import { mergeProjects } from "@/lib/projectUtils";

export default function AllProjectsPage() {
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = (p.title || "").toLowerCase().includes(q);
      const inTagline = (p.tagline || "").toLowerCase().includes(q);
      const inDesc = (p.description || "").toLowerCase().includes(q);
      const inTech = (p.tech || []).some((t) => t.toLowerCase().includes(q));
      const inInfra = (p.infra || "").toLowerCase().includes(q);

      return inTitle || inTagline || inDesc || inTech || inInfra;
    });
  }, [allProjects, selectedCategory, searchQuery]);

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
    <div className="min-h-screen text-slate-900 relative bg-slate-50">
      <div className="mesh-backdrop opacity-60" aria-hidden="true" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-violet-700 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              {allProjects.length} Total Systems
            </span>
            <Link
              href="/admin"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold shadow-xs mb-3">
            <FolderGit2 className="w-3.5 h-3.5 text-violet-600" />
            <span>Complete Architecture Archive</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            All Projects &amp; Systems
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mt-2 max-w-3xl font-normal leading-relaxed">
            Searchable catalog of all deployed applications, edge microservices, offline AI tools, and production client platforms.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, technology (e.g. SQLite, Cloudflare, Node.js), or domain..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-violet-600 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> of{" "}
              <span className="font-bold text-slate-900">{allProjects.length}</span> systems
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900">No projects found</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No systems matched your search or category filter. Try clearing the search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const infra = getInfraBadge(project.infra);
              const bannerBg = getGradientBanner(project);
              const isCustomInline =
                bannerBg.startsWith("linear-gradient") ||
                bannerBg.startsWith("#") ||
                bannerBg.startsWith("rgb");

              return (
                <article
                  key={project.id}
                  className="premium-card flex flex-col justify-between overflow-hidden group bg-white"
                >
                  <div>
                    {/* Header Banner */}
                    <div
                      className={`relative h-48 sm:h-52 p-4 border-b border-slate-100 flex flex-col justify-between overflow-hidden ${
                        !isCustomInline ? `bg-gradient-to-br ${bannerBg}` : ""
                      }`}
                      style={isCustomInline ? { background: bannerBg } : undefined}
                    >
                      {/* Ambient watermark */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                        <Image
                          src={project.logo}
                          alt=""
                          fill
                          unoptimized={typeof project.logo === "string" && (project.logo.startsWith("data:") || project.logo.startsWith("http"))}
                          className="object-cover blur-xl opacity-20 scale-125 transition-transform duration-500 group-hover:scale-135"
                        />
                      </div>

                      {/* Prominent logo */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            src={project.logo}
                            alt={`${project.title} logo`}
                            fill
                            unoptimized={typeof project.logo === "string" && (project.logo.startsWith("data:") || project.logo.startsWith("http"))}
                            className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Overlay chips */}
                      <div className="flex items-center justify-between relative z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${infra.bg} shadow-xs`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${infra.dot}`} />
                          {infra.name}
                        </span>

                        {project.metrics && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-md border border-white/80 shadow-xs">
                            {project.metrics}
                          </span>
                        )}
                      </div>
                      <div className="relative z-10" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h2 className="font-display font-bold text-slate-900 text-lg leading-snug group-hover:text-violet-700 transition-colors">
                          {project.title}
                        </h2>
                        {project.showOnHome && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Featured
                          </span>
                        )}
                      </div>

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
        )}
      </main>

      {/* ARCHITECTURE STORY MODAL */}
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
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  Engineering Architecture
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {activeStoryProject.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  The Problem &amp; Constraint
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeStoryProject.story.challenge}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200/80">
                <h4 className="text-xs font-bold text-violet-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-600" />
                  The Architectural Solution
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeStoryProject.story.solution}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Production Impact &amp; Results
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeStoryProject.story.impact}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Tech: {activeStoryProject.tech.slice(0, 3).join(", ")}
              </span>
              <button
                onClick={() => setActiveStoryProject(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Wycliffe Mwanganda. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/admin" className="hover:text-slate-900 transition-colors">
              Admin
            </Link>
            <a
              href="https://github.com/Wycliffe147"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

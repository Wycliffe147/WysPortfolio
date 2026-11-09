"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, onValue, push, remove, set, update } from "firebase/database";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Cloud,
  Layers,
  Sparkles,
  Palette,
  Sliders,
  Eye,
  EyeOff,
  Pencil,
  DownloadCloud,
  Server,
  Activity,
  ShieldCheck,
  Upload,
  Link2
} from "lucide-react";
import { PROJECTS } from "@/data/portfolioData";

interface FirebaseProject {
  id?: string;
  title: string;
  category: string;
  shortDesc: string;
  tech: string[];
  links: {
    live?: string;
    github?: string;
  };
  infra?: string;
  thumbnail?: string;
  logo?: string;
  gradient?: string;
  showOnHome?: boolean;
  featured?: boolean;
  sortOrder?: number;
}

const BRAND_GRADIENT_PRESETS = [
  { name: "Gold & Royal (RGM)", value: "from-amber-100 via-amber-50 to-indigo-50", preview: "#fef3c7" },
  { name: "Crimson & Retail (Pamthunzi)", value: "from-rose-100 via-slate-50 to-amber-50", preview: "#ffe4e6" },
  { name: "Harvest Green (Wamaka)", value: "from-emerald-100 via-lime-50 to-amber-50", preview: "#d1fae5" },
  { name: "Knowledge Sky (WyLibrary)", value: "from-sky-100 via-indigo-50 to-blue-50", preview: "#e0f2fe" },
  { name: "Academic Violet (School OS)", value: "from-indigo-100 via-purple-50 to-emerald-50", preview: "#e0e7ff" },
  { name: "Star Gold (Star PDF)", value: "from-amber-100 via-yellow-50 to-sky-50", preview: "#fef08a" },
  { name: "Cyber Purple (JARVIS Linux)", value: "from-purple-100 via-indigo-50 to-slate-100", preview: "#f3e8ff" },
  { name: "Emerald Cyber (JARVIS Android)", value: "from-emerald-100 via-teal-50 to-indigo-50", preview: "#d1fae5" },
  { name: "Sky Cyber (JARVIS Windows)", value: "from-blue-100 via-sky-50 to-indigo-50", preview: "#dbeafe" },
  { name: "Digital Cyan (DigiHelp)", value: "from-cyan-100 via-sky-50 to-emerald-50", preview: "#cffafe" },
  { name: "Neutral Studio Frost", value: "from-slate-100 via-slate-50 to-zinc-100", preview: "#f1f5f9" }
];

const PRESET_LOGOS = [
  { name: "RGM Malawi", path: "/logos/rgm.png" },
  { name: "Pamthunzi Retail", path: "/logos/pamthunzi.png" },
  { name: "Wamaka Rice", path: "/logos/wamaka.png" },
  { name: "WyLibrary", path: "/logos/wylibrary.png" },
  { name: "Report Generator", path: "/logos/reportgen.png" },
  { name: "Star PDF", path: "/logos/starpdf.png" },
  { name: "DigiHelp", path: "/logos/digihelp.svg" },
  { name: "Brand Emblem", path: "/Logo v2.2.png" },
  { name: "Profile Photo", path: "/profile.png" }
];

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"projects" | "users">("projects");

  // Projects State
  const [projects, setProjects] = useState<Record<string, FirebaseProject>>({});
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Gradient control mode
  const [gradientMode, setGradientMode] = useState<"preset" | "manual">("preset");
  const [manualColorStart, setManualColorStart] = useState("#fed7aa");
  const [manualColorEnd, setManualColorEnd] = useState("#e0e7ff");
  const [manualAngle, setManualAngle] = useState("135deg");

  // Logo source mode
  const [logoMode, setLogoMode] = useState<"upload" | "preset" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProject, setNewProject] = useState<FirebaseProject>({
    title: "",
    category: "Systems & Automation",
    shortDesc: "",
    tech: [],
    infra: "Cloudflare",
    links: { live: "", github: "" },
    logo: "/logos/rgm.png",
    gradient: "from-amber-100 via-amber-50 to-indigo-50",
    showOnHome: true,
    sortOrder: undefined
  });
  const [techInput, setTechInput] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Update manual gradient whenever manual colors change
  useEffect(() => {
    if (gradientMode === "manual") {
      setNewProject((prev) => ({
        ...prev,
        gradient: `linear-gradient(${manualAngle}, ${manualColorStart}, ${manualColorEnd})`
      }));
    }
  }, [gradientMode, manualColorStart, manualColorEnd, manualAngle]);

  // Check login session
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  // Firebase Realtime Listener for Projects
  useEffect(() => {
    if (!isAuthenticated) return;

    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setProjects(val);
      } else {
        setProjects({});
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Incorrect password");
      }
    } catch {
      setAuthError("Network error checking password");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, SVG, WebP, JPG).");
      return;
    }

    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewProject((prev) => ({ ...prev, logo: result }));
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 512;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let dataUrl = canvas.toDataURL("image/webp", 0.92);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/png");
          }
          setNewProject((prev) => ({ ...prev, logo: dataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCancelForm = () => {
    setIsAddingProject(false);
    setEditingKey(null);
    setLogoMode("upload");
    setNewProject({
      title: "",
      category: "Systems & Automation",
      shortDesc: "",
      tech: [],
      infra: "Cloudflare",
      links: { live: "", github: "" },
      logo: "/logos/rgm.png",
      gradient: "from-amber-100 via-amber-50 to-indigo-50",
      showOnHome: true,
      sortOrder: undefined
    });
    setTechInput("");
  };

  const handleStartEdit = (key: string, project: FirebaseProject) => {
    setEditingKey(key);
    setIsAddingProject(true);
    setNewProject({
      title: project.title || "",
      category: project.category || "Systems & Automation",
      shortDesc: project.shortDesc || "",
      tech: project.tech || [],
      infra: project.infra || "Cloudflare",
      links: project.links || { live: "", github: "" },
      logo: project.logo || "/logos/rgm.png",
      gradient: project.gradient || "from-amber-100 via-amber-50 to-indigo-50",
      showOnHome: project.showOnHome !== false && project.featured !== false,
      sortOrder: project.sortOrder
    });
    setTechInput(project.tech ? project.tech.join(", ") : "");
    if (
      project.gradient &&
      (project.gradient.startsWith("linear-gradient") || project.gradient.startsWith("#"))
    ) {
      setGradientMode("manual");
    } else {
      setGradientMode("preset");
    }

    if (project.logo?.startsWith("data:")) {
      setLogoMode("upload");
    } else if (PRESET_LOGOS.some((p) => p.path === project.logo)) {
      setLogoMode("preset");
    } else if (project.logo) {
      setLogoMode("url");
    } else {
      setLogoMode("preset");
    }

    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSeedDefaultProjects = async () => {
    if (
      !confirm(
        "Import all 9 default portfolio projects into Firebase Realtime Database? This will ensure all projects can be edited and toggled here in the dashboard."
      )
    ) {
      return;
    }

    try {
      const updates: Record<string, any> = {};
      PROJECTS.forEach((proj) => {
        updates[`projects/${proj.id}`] = {
          title: proj.title,
          category: proj.category,
          shortDesc: proj.description,
          tagline: proj.tagline,
          description: proj.description,
          tech: proj.tech,
          infra: proj.infra,
          logo: proj.logo,
          thumbnail: proj.thumbnail,
          gradient: proj.gradient || "from-amber-100 via-amber-50 to-indigo-50",
          links: proj.links,
          showOnHome: proj.showOnHome !== false && proj.featured !== false,
          featured: proj.featured !== false && proj.showOnHome !== false,
          sortOrder: proj.sortOrder || 99,
          metrics: proj.metrics || null,
          story: proj.story || null,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      });

      await update(ref(db), updates);
      setStatusMsg("Successfully imported all 9 default projects into Firebase Realtime Database!");
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to seed projects into Firebase.");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.shortDesc) return;

    try {
      const techArray = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...newProject,
        showOnHome: newProject.showOnHome !== false,
        featured: newProject.showOnHome !== false,
        sortOrder:
          newProject.sortOrder !== undefined && newProject.sortOrder !== null && String(newProject.sortOrder) !== ""
            ? Number(newProject.sortOrder)
            : null,
        tech: techArray.length ? techArray : ["Full-Stack"],
        updatedAt: Date.now()
      };

      if (editingKey) {
        await set(ref(db, `projects/${editingKey}`), {
          ...payload,
          createdAt: (projects[editingKey] as any)?.createdAt || Date.now()
        });
        setStatusMsg("Project updated in Firebase RTDB successfully!");
      } else {
        const projectsRef = ref(db, "projects");
        const newProjRef = push(projectsRef);
        await set(newProjRef, {
          ...payload,
          createdAt: Date.now()
        });
        setStatusMsg("Project added to Firebase RTDB successfully!");
      }

      handleCancelForm();
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err) {
      setStatusMsg("Failed to save project to Firebase.");
      console.error(err);
    }
  };

  const handleDeleteProject = async (key: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await remove(ref(db, `projects/${key}`));
      setStatusMsg("Project removed from Firebase.");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative">
        <div className="mesh-backdrop opacity-60" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-8 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Public Portfolio
          </Link>

          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xl">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Dashboard Access
            </h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Enter your dashboard password to manage live Firebase projects and monitor active systems.
            </p>

            {authError && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-bold">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password..."
                    required
                    className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {authLoading ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentGradient = newProject.gradient || "from-amber-100 via-amber-50 to-indigo-50";
  const isCustomInlinePreview =
    currentGradient.startsWith("linear-gradient") ||
    currentGradient.startsWith("#") ||
    currentGradient.startsWith("rgb");

  // Unified Admin View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative">
      <div className="mesh-backdrop opacity-50" aria-hidden="true" />

      {/* Top Navbar */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Site</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight">WysPortfolio Admin</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Status Notification */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("projects")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "projects"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Projects CRUD (Firebase)</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "projects"
                    ? "bg-indigo-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {Object.keys(projects).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System &amp; Cloud Status</span>
            </button>
          </div>

          {activeTab === "projects" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSeedDefaultProjects}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shadow-xs"
                title="Import all 9 default projects into Firebase RTDB"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>Import Standard Projects</span>
              </button>

              <button
                onClick={() => {
                  if (isAddingProject) {
                    handleCancelForm();
                  } else {
                    setIsAddingProject(true);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isAddingProject
                    ? editingKey
                      ? "Cancel Edit"
                      : "Cancel"
                    : "Add Project"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            {/* Create / Edit Project Inline Form */}
            {isAddingProject && (
              <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  {editingKey ? "Edit Project in Firebase Database" : "Add Project to Firebase Database"}
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  {editingKey
                    ? "Updating this item will immediately sync the new details to your live portfolio."
                    : "Items created here will instantly sync to your live European Firebase Realtime Database."}
                </p>

                <form onSubmit={handleSaveProject} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) =>
                          setNewProject({ ...newProject, title: e.target.value })
                        }
                        placeholder="e.g. Pamthunzi Electronics"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        Category
                      </label>
                      <select
                        value={newProject.category}
                        onChange={(e) =>
                          setNewProject({ ...newProject, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Client & Business">Client & Business</option>
                        <option value="Systems & Automation">Systems & Automation</option>
                        <option value="Edge & Web">Edge & Web</option>
                        <option value="AI & Desktop">AI & Desktop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        Deployment Infrastructure
                      </label>
                      <select
                        value={newProject.infra}
                        onChange={(e) =>
                          setNewProject({ ...newProject, infra: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Cloudflare">Cloudflare (Pages/D1/R2)</option>
                        <option value="Render">Render (Backend/Services)</option>
                        <option value="Vercel">Vercel (Edge/Frontend)</option>
                        <option value="Local/Linux">Local / Linux Subsystem</option>
                        <option value="Multi-Cloud">Multi-Cloud</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-slate-800 font-bold">
                            Project Logo Asset
                          </label>
                          <span className="text-xs text-slate-500">
                            Upload from your device storage, pick a preset, or enter an external URL.
                          </span>
                        </div>

                        {/* Mode Switcher */}
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
                          <button
                            type="button"
                            onClick={() => setLogoMode("upload")}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              logoMode === "upload"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLogoMode("preset")}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              logoMode === "preset"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Presets</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLogoMode("url")}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              logoMode === "url"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Custom URL</span>
                          </button>
                        </div>
                      </div>

                      {/* Upload from Device Mode */}
                      {logoMode === "upload" && (
                        <div className="space-y-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />

                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                          >
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                Click to choose logo from your device
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Select PNG, SVG, WebP, or JPG from local storage (auto-optimized)
                              </p>
                            </div>
                          </div>

                          {newProject.logo?.startsWith("data:") && (
                            <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg">
                              <span className="flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Custom logo loaded from device storage
                              </span>
                              <button
                                type="button"
                                onClick={() => setNewProject({ ...newProject, logo: "/Logo v2.2.png" })}
                                className="text-xs text-emerald-700 hover:text-red-600 font-semibold underline"
                              >
                                Reset to Default
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Presets Mode */}
                      {logoMode === "preset" && (
                        <select
                          value={newProject.logo}
                          onChange={(e) =>
                            setNewProject({ ...newProject, logo: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                        >
                          {PRESET_LOGOS.map((l) => (
                            <option key={l.path} value={l.path}>
                              {l.name} ({l.path})
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Custom URL Mode */}
                      {logoMode === "url" && (
                        <input
                          type="text"
                          value={newProject.logo}
                          onChange={(e) =>
                            setNewProject({ ...newProject, logo: e.target.value })
                          }
                          placeholder="https://example.com/logo.png or /logos/custom.svg"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="e.g. Node.js, Cloudflare D1, Express"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={newProject.links.live}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            links: { ...newProject.links, live: e.target.value }
                          })
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                        GitHub Repository
                      </label>
                      <input
                        type="url"
                        value={newProject.links.github}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            links: { ...newProject.links, github: e.target.value }
                          })
                        }
                        placeholder="https://github.com/Wycliffe147/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                      Short Description *
                    </label>
                    <textarea
                      value={newProject.shortDesc}
                      onChange={(e) =>
                        setNewProject({ ...newProject, shortDesc: e.target.value })
                      }
                      rows={2}
                      placeholder="Brief summary of the architecture and utility..."
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  {/* Homepage Display Toggle & Display Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Display on Homepage
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          When enabled, this project appears on the main homepage. When disabled, it is only listed on the /projects archive.
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={newProject.showOnHome !== false}
                          onChange={(e) =>
                            setNewProject({ ...newProject, showOnHome: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1 font-bold">
                          Display Order
                        </label>
                        <span className="text-[11px] text-slate-500 block mb-2">
                          Lower number appears first (e.g. 1, 2, 3)
                        </span>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={newProject.sortOrder ?? ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            sortOrder: e.target.value ? Number(e.target.value) : undefined
                          })
                        }
                        placeholder="e.g. 1"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* BRAND GRADIENT CONTROLS */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Palette className="w-4 h-4 text-indigo-600" />
                          Card Header Brand Gradient
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Choose an auto brand color palette or mix custom colors manually.
                        </span>
                      </div>

                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                        <button
                          type="button"
                          onClick={() => setGradientMode("preset")}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            gradientMode === "preset"
                              ? "bg-white text-indigo-700 shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Auto Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => setGradientMode("manual")}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            gradientMode === "manual"
                              ? "bg-white text-indigo-700 shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Manual Mix
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: Auto Presets */}
                    {gradientMode === "preset" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BRAND_GRADIENT_PRESETS.map((p) => {
                          const isSelected = newProject.gradient === p.value;
                          return (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => setNewProject({ ...newProject, gradient: p.value })}
                              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <span
                                className="w-5 h-5 rounded-md border border-slate-300 shrink-0"
                                style={{ backgroundColor: p.preview }}
                              />
                              <span className="text-xs font-semibold text-slate-800 truncate">
                                {p.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Mode 2: Manual Mix */
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-bold">
                              Start Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={manualColorStart}
                                onChange={(e) => setManualColorStart(e.target.value)}
                                className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={manualColorStart}
                                onChange={(e) => setManualColorStart(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-bold">
                              End Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={manualColorEnd}
                                onChange={(e) => setManualColorEnd(e.target.value)}
                                className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={manualColorEnd}
                                onChange={(e) => setManualColorEnd(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-bold">
                              Gradient Angle
                            </label>
                            <select
                              value={manualAngle}
                              onChange={(e) => setManualAngle(e.target.value)}
                              className="w-full px-2 py-2 bg-white border border-slate-200 rounded text-xs font-medium"
                            >
                              <option value="135deg">135° (Diagonal)</option>
                              <option value="90deg">90° (Left to Right)</option>
                              <option value="180deg">180° (Top to Bottom)</option>
                              <option value="45deg">45° (Angled Up)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-bold">
                            Custom CSS / Tailwind Override
                          </label>
                          <input
                            type="text"
                            value={newProject.gradient}
                            onChange={(e) => setNewProject({ ...newProject, gradient: e.target.value })}
                            placeholder="e.g. from-indigo-200 to-rose-100 or linear-gradient(...)"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* LIVE CARD PREVIEW BOX */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Live Card Header Preview</span>
                      </div>

                      <div
                        className={`h-40 rounded-2xl border border-slate-200 relative overflow-hidden transition-all duration-300 ${
                          !isCustomInlinePreview ? `bg-gradient-to-br ${currentGradient}` : ""
                        }`}
                        style={isCustomInlinePreview ? { background: currentGradient } : undefined}
                      >
                        {/* Ambient blur watermark */}
                        {newProject.logo && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <Image
                              src={newProject.logo}
                              alt=""
                              fill
                              unoptimized={typeof newProject.logo === "string" && (newProject.logo.startsWith("data:") || newProject.logo.startsWith("http"))}
                              className="object-cover blur-xl opacity-20 scale-125"
                            />
                          </div>
                        )}

                        {/* Centered logo filling edge-to-edge */}
                        {newProject.logo && (
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-full">
                              <Image
                                src={newProject.logo}
                                alt="Logo Preview"
                                fill
                                unoptimized={typeof newProject.logo === "string" && (newProject.logo.startsWith("data:") || newProject.logo.startsWith("http"))}
                                className="object-contain drop-shadow-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Overlay chips */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 text-[10px] font-bold border border-white/80 shadow-xs">
                            {newProject.infra || "Cloudflare"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm"
                    >
                      {editingKey ? "Update Project" : "Save to Database"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Project List */}
            {Object.keys(projects).length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl shadow-xs">
                <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">
                  No Firebase Projects Found
                </h4>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1 mb-4">
                  Add projects above to store dynamic showcase entries directly into your European Firebase RTDB.
                </p>
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Entry</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(projects)
                  .sort(([, a], [, b]) => {
                    const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 999;
                    const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 999;
                    return orderA - orderB;
                  })
                  .map(([key, item]) => {
                  const cardGradient = item.gradient || "from-amber-100 via-amber-50 to-indigo-50";
                  const isCustomCardInline =
                    cardGradient.startsWith("linear-gradient") ||
                    cardGradient.startsWith("#") ||
                    cardGradient.startsWith("rgb");

                  return (
                    <div
                      key={key}
                      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Visual Banner */}
                        <div
                          className={`h-36 relative overflow-hidden border-b border-slate-100 ${
                            !isCustomCardInline ? `bg-gradient-to-br ${cardGradient}` : ""
                          }`}
                          style={isCustomCardInline ? { background: cardGradient } : undefined}
                        >
                          {/* Ambient blur watermark */}
                          {item.logo && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <Image
                                src={item.logo}
                                alt=""
                                fill
                                unoptimized={typeof item.logo === "string" && (item.logo.startsWith("data:") || item.logo.startsWith("http"))}
                                className="object-cover blur-xl opacity-20 scale-125"
                              />
                            </div>
                          )}

                          {/* Logo touching nearest edges */}
                          {item.logo && (
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                              <div className="relative w-full h-full">
                                <Image
                                  src={item.logo}
                                  alt={item.title}
                                  fill
                                  unoptimized={typeof item.logo === "string" && (item.logo.startsWith("data:") || item.logo.startsWith("http"))}
                                  className="object-contain drop-shadow-xs"
                                />
                              </div>
                            </div>
                          )}

                          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                            {typeof item.sortOrder === "number" && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-900 text-white shadow-xs">
                                #{item.sortOrder}
                              </span>
                            )}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 border border-white/80">
                              {item.infra || "Cloudflare"}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                item.showOnHome !== false && item.featured !== false
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {item.showOnHome !== false && item.featured !== false
                                ? "Homepage"
                                : "Archive Only"}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <span className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider block mb-1">
                            {item.category}
                          </span>

                          <h4 className="text-base font-bold text-slate-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                            {item.shortDesc}
                          </p>

                          {item.tech && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {item.tech.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs pt-4">
                        <div className="flex items-center gap-3">
                          {item.links?.live && (
                            <a
                              href={item.links.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {item.links?.github && (
                            <a
                              href={item.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                              GitHub
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(key, item)}
                            className="text-slate-600 hover:text-indigo-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs"
                            title="Edit project"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProject(key)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SYSTEM & CLOUD STATUS */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">System &amp; Cloud Deployment Status</h3>
                <p className="text-slate-600 text-xs mt-0.5">
                  Live connectivity monitor for Firebase Realtime Database and production edge routing.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-600 font-mono">All Systems Operational</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <Cloud className="w-4 h-4 text-indigo-600" />
                  Database
                </div>
                <div className="font-bold text-slate-900 text-sm">Firebase RTDB (Europe)</div>
                <div className="text-xs text-emerald-700 font-medium mt-1">Spark Plan ($0/mo) Active</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <Server className="w-4 h-4 text-sky-600" />
                  Frontend &amp; SSR
                </div>
                <div className="font-bold text-slate-900 text-sm">Vercel Global Edge</div>
                <div className="text-xs text-emerald-700 font-medium mt-1">Automatic CI/CD via GitHub</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Admin Security
                </div>
                <div className="font-bold text-slate-900 text-sm">HttpOnly Session Cookie</div>
                <div className="text-xs text-slate-600 font-medium mt-1">Master password authenticated</div>
              </div>
            </div>

            {/* Live Storage & Database Quota Meter */}
            {(() => {
              const totalPayloadBytes = JSON.stringify(projects).length;
              const totalKB = (totalPayloadBytes / 1024).toFixed(1);
              const sparkQuotaBytes = 1024 * 1024 * 1024; // 1 GB
              const percentUsed = ((totalPayloadBytes / sparkQuotaBytes) * 100).toFixed(4);
              const customUploadCount = Object.values(projects).filter(
                (p) => p.logo && p.logo.startsWith("data:")
              ).length;

              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <DownloadCloud className="w-4 h-4 text-indigo-600" />
                        Live Database Storage &amp; Logo Quota
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time calculation of all stored projects and device logos against the Firebase Spark 1 GB free tier.
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm">{totalKB} KB used</span>
                      <span className="text-slate-500 text-xs block">of 1,024 MB (1 GB Free)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(1, Number(percentUsed) * 20))}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-slate-500 block text-[11px]">Spark Quota Used</span>
                      <span className="font-bold text-emerald-700 font-mono text-sm">{percentUsed}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-slate-500 block text-[11px]">Total Projects</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">{Object.keys(projects).length}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-slate-500 block text-[11px]">Device Logos (Base64)</span>
                      <span className="font-bold text-indigo-700 font-mono text-sm">{customUploadCount}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-slate-500 block text-[11px]">Remaining Space</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">&gt; 99.99%</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <span className="font-bold block">About User Tracking &amp; Authentication</span>
              <p className="text-indigo-800 leading-relaxed">
                WysPortfolio is a public engineering showcase. Visitors browse anonymously without needing user accounts, keeping performance blazing fast with zero registration barriers. Real visitor traffic and Core Web Vitals are tracked privacy-first via Vercel Web Analytics.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

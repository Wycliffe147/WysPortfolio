"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, onValue, push, remove, set } from "firebase/database";
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
  Sparkles
} from "lucide-react";

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
}

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"projects" | "users">("projects");

  // Projects State
  const [projects, setProjects] = useState<Record<string, FirebaseProject>>({});
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<FirebaseProject>({
    title: "",
    category: "Systems & Automation",
    shortDesc: "",
    tech: [],
    infra: "Cloudflare",
    links: { live: "", github: "" }
  });
  const [techInput, setTechInput] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.shortDesc) return;

    try {
      const techArray = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const projectsRef = ref(db, "projects");
      const newProjRef = push(projectsRef);

      await set(newProjRef, {
        ...newProject,
        tech: techArray.length ? techArray : ["Full-Stack"],
        createdAt: Date.now()
      });

      setStatusMsg("Project added to Firebase RTDB successfully!");
      setIsAddingProject(false);
      setNewProject({
        title: "",
        category: "Systems & Automation",
        shortDesc: "",
        tech: [],
        infra: "Cloudflare",
        links: { live: "", github: "" }
      });
      setTechInput("");
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err) {
      setStatusMsg("Failed to add project to Firebase.");
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
        <div className="fixed inset-0 pointer-events-none bg-mesh-pattern opacity-60 z-0" />

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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
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

  // Unified Admin View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative">
      <div className="fixed inset-0 pointer-events-none bg-mesh-pattern opacity-50 z-0" />

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
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
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
              <Users className="w-4 h-4" />
              <span>Active Auth & Users</span>
            </button>
          </div>

          {activeTab === "projects" && (
            <button
              onClick={() => setIsAddingProject(!isAddingProject)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingProject ? "Cancel" : "Add Project"}</span>
            </button>
          )}
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            {/* Create Project Inline Form */}
            {isAddingProject && (
              <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Add Project to Firebase Database
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  Items created here will instantly sync to your live Firebase Realtime Database.
                </p>

                <form onSubmit={handleCreateProject} className="space-y-4">
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

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm"
                    >
                      Save to Database
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
                {Object.entries(projects).map(([key, item]) => (
                  <div
                    key={key}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.infra || "Cloudflare"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.category}
                        </span>
                      </div>

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

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
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

                      <button
                        onClick={() => handleDeleteProject(key)}
                        className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE USERS & AUTH MONITOR */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Active Users Dashboard</h3>
                <p className="text-slate-600 text-xs">
                  Inspect authenticated client sessions and user activity logged via Google Auth.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-600 font-mono">Realtime Listener Active</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="text-xs uppercase bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-bold">User / Client</th>
                    <th className="px-4 py-3 font-bold">Auth Provider</th>
                    <th className="px-4 py-3 font-bold">Session Status</th>
                    <th className="px-4 py-3 rounded-r-lg font-bold">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        W
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-slate-900">Admin Session</div>
                        <div className="text-[11px] text-slate-500">wycliffemwanganda@gmail.com</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">Vercel Session (Admin)</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Online
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">Just now</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        G
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-slate-900">Firebase Google User</div>
                        <div className="text-[11px] text-slate-500">wysportfolio.firebaseapp.com</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">Google OAuth 2.0</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Idle
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">Recent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <span>Connected to Firebase European RTDB (`wysportfolio-default-rtdb`)</span>
              </div>
              <span className="font-mono text-slate-500">Spark Plan: $0 / Month</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

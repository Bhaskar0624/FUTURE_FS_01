"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, LogOut, Plus, Trash2, Eye } from "lucide-react";

type Tab = "profile" | "projects" | "experiences" | "skills" | "certificates" | "journey";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Data states (using any for flexibility with JSON)
  const [profile, setProfile] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();

      if (data) {
        if (data.profile) setProfile(data.profile);
        if (data.projects) setProjects(data.projects);
        if (data.experiences) setExperiences(data.experiences);
        if (data.skills) setSkills(data.skills);
        if (data.certificates) setCertificates(data.certificates);
        if (data.journey) setJourney(data.journey);
      }
    } catch (e) {
      console.error("Error loading data:", e);
      showMessage("Error loading data");
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    console.log("Starting local upload:", file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      console.log("Upload successful:", result.url);
      return result.url;
    } catch (error: any) {
      console.error("Upload error catch:", error);
      showMessage(`Upload failed: ${error.message}`);
      alert(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveData = async (section: string, data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) throw new Error("Failed to save");
      showMessage(`${section} saved!`);
      loadData(); // Reload to ensure sync
    } catch (e) {
      console.error(e);
      showMessage("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    await saveData("profile", profile);
  };

  const saveProject = async (project: any) => {
    // Logic handled in render for add/edit, here we just save the whole array
    // But wait, the original logic saved one item. 
    // With JSON file, it's easier to save the whole array. 
    // I will adapt the render loop to update the state array, and then verify the 'save' button just saves the state.
    // Actually, let's keep it simple. The button in the render loop passes 'project'. 
    // I need to update the specific project in the 'projects' array state, then save the 'projects' array.

    // However, the render loop handlers *already* update the state: 
    // onChange={(e) => { const updated = [...projects]; updated[idx] = ...; setProjects(updated); }}
    // So 'projects' state is always current.
    // The 'saveProject' function receives 'project' but we should probably just save the 'projects' array.
    // BUT, let's look at how it's called: onClick={() => saveProject(project)}
    // It's called for a specific project. 

    // Let's change the strategy: The state is the source of truth. 
    // We will create generic save wrappers that save the CURRENT STATE of that section.

    await saveData("projects", projects);
  };

  const deleteProject = async (id: string) => { // ID might be missing for new items, so passing index might be safer, but let's see.
    // The previous logic used ID.
    // If I switch to local JSON, I can just use the state.
    // But the render loop passes ID. 
    // Let's filter by ID if present, or we might need to change the call signature to index.
    // For now, let's assume objects have IDs (generated in my previous plan).
    if (!confirm("Are you sure?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated); // Update UI immediately
    await saveData("projects", updated);
  };

  const saveExperience = async (exp: any) => {
    await saveData("experiences", experiences);
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    await saveData("experiences", updated);
  };

  const saveSkill = async (skill: any) => {
    await saveData("skills", skills);
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    await saveData("skills", updated);
  };

  // Need to add certificate functions since they were there
  const saveCertificate = async (cert: any) => {
    await saveData("certificates", certificates);
  };

  const deleteCertificate = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = certificates.filter(c => c.id !== id);
    setCertificates(updated);
    await saveData("certificates", updated);
  };

  const saveJourney = async (item: any) => {
    await saveData("journey", journey);
  };

  const deleteJourney = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = journey.filter(j => j.id !== id);
    setJourney(updated);
    await saveData("journey", updated);
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--carbon)]">
        <div className="glass-strong w-full max-w-sm rounded-2xl p-8">
          <div className="mb-6 text-center">
            <span className="font-mono text-sm tracking-widest text-[var(--gold)]">ADMIN PANEL</span>
            <p className="mt-2 text-xs text-[var(--ash)]">Enter your admin password</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-4 py-3 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
          />
          {loginError && <p className="mb-3 text-xs text-red-400">{loginError}</p>}
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-[var(--gold)] py-3 font-mono text-xs uppercase tracking-widest text-[var(--carbon)] transition-all hover:opacity-90"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "projects", label: "Projects" },
    { key: "experiences", label: "Experience" },
    { key: "skills", label: "Skills" },
    { key: "certificates", label: "Certificates" },
    { key: "journey", label: "Journey" },
  ];

  const profileFields = [
    "name", "title", "email", "location", "status",
    "github_url", "linkedin_url", "twitter_url",
    "seo_title", "seo_description"
  ];

  return (
    <div className="min-h-screen bg-[var(--carbon)]">
      {/* Header */}
      <header className="glass-strong border-b border-[var(--gold)]/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm tracking-widest text-[var(--gold)]">CMS DASHBOARD</span>
            {(message || uploading) && (
              <span className="rounded-full bg-[var(--sage)]/20 px-3 py-1 font-mono text-xs text-[var(--sage-light)]">
                {uploading ? "Uploading..." : message}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--gold)]/10 px-3 py-1.5 font-mono text-xs text-[var(--ash)] transition-colors hover:text-[var(--gold)]"
            >
              <Eye size={12} /> Preview
            </a>
            <button
              onClick={() => setAuthenticated(false)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${activeTab === tab.key
                ? "bg-[var(--gold)] text-[var(--carbon)]"
                : "text-[var(--ash)] hover:text-[var(--gold)]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--gold)]">Profile Info</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field} className={field === "seo_description" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">
                    {field.replace(/_/g, " ")}
                  </label>
                  <input
                    value={profile[field] || ""}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                  />
                </div>
              ))}

              {/* Explicit Resume Upload Field */}
              <div className="sm:col-span-2 border border-[var(--gold)]/20 rounded-lg p-4 bg-[var(--carbon)]/50">
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">
                    RESUME URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload-input"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadFile(file);
                          if (url) {
                            setProfile({ ...profile, resume_url: url });
                          }
                        }
                      }}
                    />
                    <label
                      htmlFor="resume-upload-input"
                      className="cursor-pointer flex items-center gap-2 rounded bg-[var(--gold)]/10 px-3 py-1.5 font-mono text-[10px] text-[var(--gold)] hover:bg-[var(--gold)]/20"
                    >
                      <span>UPLOAD NEW RESUME</span>
                    </label>
                  </div>
                </div>
                <input
                  value={profile.resume_url || ""}
                  onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                  className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full resize-none rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                />
              </div>
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--gold)] px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--carbon)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <button
              onClick={() => setProjects([...projects, { title: "", description: "", tags: [], category: "Web", sort_order: projects.length }])}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--gold)]/20 px-4 py-2 font-mono text-xs text-[var(--gold)] transition-all hover:border-[var(--gold)]/40"
            >
              <Plus size={14} /> Add Project
            </button>
            {projects.map((project, idx) => (
              <div key={project.id || idx} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Title</label>
                    <input
                      value={project.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setProjects(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Category</label>
                    <input
                      value={project.category}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        setProjects(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Description</label>
                    <textarea
                      rows={2}
                      value={project.description || ""}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setProjects(updated);
                      }}
                      className="w-full resize-none rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Tags (comma separated)</label>
                    <input
                      value={(project.tags || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = { ...updated[idx], tags: e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean) };
                        setProjects(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">GitHub URL</label>
                    <input
                      value={project.github_url || ""}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = { ...updated[idx], github_url: e.target.value };
                        setProjects(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div className="sm:col-span-2 border-t border-[var(--gold)]/10 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Project Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`project-image-${idx}`}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadFile(file);
                            if (url) {
                              const updated = [...projects];
                              updated[idx] = { ...updated[idx], image_url: url };
                              setProjects(updated);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor={`project-image-${idx}`}
                        className="cursor-pointer font-mono text-[10px] text-[var(--gold)] hover:underline"
                      >
                        UPLOAD IMAGE
                      </label>
                    </div>
                    {project.image_url ? (
                      <div className="relative aspect-video w-48 overflow-hidden rounded-lg border border-[var(--gold)]/20">
                        <img src={project.image_url} alt="Project" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed border-[var(--gold)]/10 bg-[var(--carbon)]">
                        <span className="text-[10px] text-[var(--ash)]">No image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveProject(project)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 font-mono text-xs text-[var(--carbon)]"
                  >
                    <Save size={12} /> Save
                  </button>
                  {project.id && (
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === "experiences" && (
          <div className="space-y-4">
            <button
              onClick={() => setExperiences([...experiences, { role: "", company: "", period: "", description: "", sort_order: experiences.length }])}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--gold)]/20 px-4 py-2 font-mono text-xs text-[var(--gold)] transition-all hover:border-[var(--gold)]/40"
            >
              <Plus size={14} /> Add Experience
            </button>
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Role</label>
                    <input
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = { ...updated[idx], role: e.target.value };
                        setExperiences(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Company</label>
                    <input
                      value={exp.company || ""}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = { ...updated[idx], company: e.target.value };
                        setExperiences(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Period</label>
                    <input
                      value={exp.period || ""}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = { ...updated[idx], period: e.target.value };
                        setExperiences(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Description</label>
                    <textarea
                      rows={3}
                      value={exp.description || ""}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setExperiences(updated);
                      }}
                      className="w-full resize-none rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveExperience(exp)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 font-mono text-xs text-[var(--carbon)]"
                  >
                    <Save size={12} /> Save
                  </button>
                  {exp.id && (
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <button
              onClick={() => setSkills([...skills, { category: "", items: [], sort_order: skills.length }])}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--gold)]/20 px-4 py-2 font-mono text-xs text-[var(--gold)] transition-all hover:border-[var(--gold)]/40"
            >
              <Plus size={14} /> Add Skill Category
            </button>
            {skills.map((skill, idx) => (
              <div key={skill.id || idx} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Category Name</label>
                    <input
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        setSkills(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Items (comma separated)</label>
                    <input
                      value={(skill.items || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = { ...updated[idx], items: e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean) };
                        setSkills(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveSkill(skill)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 font-mono text-xs text-[var(--carbon)]"
                  >
                    <Save size={12} /> Save
                  </button>
                  {skill.id && (
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            <button
              onClick={() => setCertificates([...certificates, { title: "", issuer: "", date: "", url: "", sort_order: certificates.length }])}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--gold)]/20 px-4 py-2 font-mono text-xs text-[var(--gold)] transition-all hover:border-[var(--gold)]/40"
            >
              <Plus size={14} /> Add Certificate
            </button>
            {certificates.map((cert, idx) => (
              <div key={cert.id || idx} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Title</label>
                    <input
                      value={cert.title}
                      onChange={(e) => {
                        const updated = [...certificates];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setCertificates(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Issuer</label>
                    <input
                      value={cert.issuer || ""}
                      onChange={(e) => {
                        const updated = [...certificates];
                        updated[idx] = { ...updated[idx], issuer: e.target.value };
                        setCertificates(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Date</label>
                    <input
                      value={cert.date || ""}
                      onChange={(e) => {
                        const updated = [...certificates];
                        updated[idx] = { ...updated[idx], date: e.target.value };
                        setCertificates(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">URL</label>
                    <input
                      value={cert.url || ""}
                      onChange={(e) => {
                        const updated = [...certificates];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setCertificates(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveCertificate(cert)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 font-mono text-xs text-[var(--carbon)]"
                  >
                    <Save size={12} /> Save
                  </button>
                  {cert.id && (
                    <button
                      onClick={() => deleteCertificate(cert.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Journey Tab */}
        {activeTab === "journey" && (
          <div className="space-y-4">
            <button
              onClick={() => setJourney([...journey, { year: "", title: "", description: "", sort_order: journey.length }])}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--gold)]/20 px-4 py-2 font-mono text-xs text-[var(--gold)] transition-all hover:border-[var(--gold)]/40"
            >
              <Plus size={14} /> Add Journey Item
            </button>
            {journey.map((item, idx) => (
              <div key={item.id || idx} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Year</label>
                    <input
                      value={item.year}
                      onChange={(e) => {
                        const updated = [...journey];
                        updated[idx] = { ...updated[idx], year: e.target.value };
                        setJourney(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Title</label>
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...journey];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setJourney(updated);
                      }}
                      className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ash)]">Description</label>
                    <textarea
                      rows={3}
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...journey];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setJourney(updated);
                      }}
                      className="w-full resize-none rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-3 py-2 text-sm text-[var(--beige)] outline-none focus:border-[var(--gold)]/40"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveJourney(item)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 font-mono text-xs text-[var(--carbon)]"
                  >
                    <Save size={12} /> Save
                  </button>
                  {item.id && (
                    <button
                      onClick={() => deleteJourney(item.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import { ExternalLink, Github } from "lucide-react";
import Atropos from 'atropos/react';
import 'atropos/css';

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Atropos
        className="atropos-project-card"
        shadow={false}
        highlight={false}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${hovered
            ? "border-[var(--gold)]/30 glow-gold"
            : "border-[var(--gold)]/5 bg-[var(--carbon-light)]"
            }`}
        >
          {/* Project image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--carbon-lighter)] to-[var(--carbon)]">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="h-full w-full object-cover"
                data-atropos-offset="5"
              />
            ) : (
              <>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-6xl font-bold text-[var(--gold)]/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </>
            )}

            {/* Hover overlay with links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center gap-4 bg-[var(--carbon)]/90 backdrop-blur-sm"
              data-atropos-offset="10"
            >
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/30 text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
                >
                  <Github size={16} />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/30 text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6" data-atropos-offset="3">
            <h3 className="mb-2 text-lg font-medium text-[var(--beige)]">{project.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-[var(--ash)]">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags && project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--carbon-lighter)] px-3 py-1 font-mono text-[10px] text-[var(--sage-light)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Atropos>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: any[] }) {
  // Use passed projects or fallback to empty array
  const displayProjects = projects && projects.length > 0 ? projects : [];

  console.log('Projects component received:', projects); // Debug log

  return (
    <section id="projects" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="// portfolio" title="Featured Projects" />

        {displayProjects.length === 0 ? (
          <p className="text-center text-[var(--ash)]">No projects to display yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {displayProjects.map((project, i) => (
              <ProjectCard
                key={project.id || i}
                project={{
                  title: project.title,
                  desc: project.description,
                  tags: project.tags || [],
                  category: project.category || "Web",
                  image: project.image_url || null,
                  github: project.github_url || "#",
                  live: project.live_url || "#"
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

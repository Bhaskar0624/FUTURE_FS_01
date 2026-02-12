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
          import { useState} from "react";
        import {motion, AnimatePresence} from "framer-motion";
        import Image from "next/image";

        export default function Projects({projects}: {projects: any[] }) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

        return (
        <section id="projects" className="relative min-h-screen w-full bg-black px-6 py-24 text-white">

          {/* SECTION HEADER (Minimalist) */}
          <div className="mb-20 flex w-full items-end justify-between border-b border-white/20 pb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">
              ( Selected Works )
            </h2>
            <span className="font-mono text-xs text-white/50">{projects.length} Items</span>
          </div>

          {/* PROJECT LIST */}
          <div className="relative z-10 flex flex-col">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative flex w-full cursor-pointer items-center justify-between border-b border-white/10 py-12 transition-colors hover:bg-white hover:text-black hover:px-6"
              >
                {/* Project Title (Huge) */}
                <h3 className="font-heading text-6xl font-normal uppercase leading-none tracking-tight sm:text-7xl md:text-8xl">
                  {project.title}
                </h3>

                {/* Project Meta (Tags) */}
                <div className="hidden flex-col items-end gap-2 text-right sm:flex">
                  <span className="font-mono text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100">
                    {project.tags?.[0] || "Development"}
                  </span>
                  <span className="font-mono text-xs tracking-widest uppercase opacity-40 group-hover:opacity-100">
                    ( {2024 - index} )
                  </span>
                </div>

                {/* Mobile Arrow */}
                <div className="sm:hidden">
                  <span className="text-2xl">→</span>
                </div>

              </motion.div>
            ))}
          </div>

          {/* FLOATING PREVIEW IMAGE (Desktop Only) */}
          <div className="pointer-events-none fixed inset-0 z-0 hidden items-center justify-center md:flex">
            <AnimatePresence mode="wait">
              {hoveredProject !== null && projects[hoveredProject] && (
            <motion.div
              key={hoveredProject}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative aspect-video w-[600px] overflow-hidden bg-white/10"
            >
              {/* Image with slight parallax or filter */}
              <div className="absolute inset-0 grayscale transition-all duration-500">
                 {projects[hoveredProject].image_url ? (
                    <Image
                      src={projects[hoveredProject].image_url}
                      alt={projects[hoveredProject].title}
                      fill
                      className="object-cover opacity-60"
                    />
                 ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                        <span className="font-mono text-xs text-white/50">NO PREVIEW</span>
                    </div>
                 )}
              </div>
              
              {/* Overlay Blend */}
              <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
            </motion.div>
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

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";

const experiences = [
  {
    role: "AI Engineering Student",
    company: "Self-Directed Learning",
    period: "2024 — Present",
    points: [
      "Deep diving into LLM architectures, fine-tuning, and deployment",
      "Building RAG pipelines and AI-powered development tools",
      "Studying prompt engineering and multi-agent systems",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance & Personal Projects",
    period: "2023 — Present",
    points: [
      "Developing production web apps with Next.js, React, and TypeScript",
      "Designing and implementing database architectures with Supabase",
      "Creating 3D interactive experiences with Three.js",
    ],
  },
  {
    role: "Vibecoder & Creative Developer",
    company: "Open Source & Community",
    period: "2023 — Present",
    points: [
      "Contributing to open-source projects and developer tools",
      "Experimenting with creative coding, generative art, and WebGL",
      "Building developer community and sharing knowledge",
    ],
  },
];

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
    >
      {/* Timeline connector */}
      {index < experiences.length - 1 && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-[var(--gold)]/20 to-transparent" />
      )}

      <div className="flex gap-6">
        {/* Dot */}
        <div className="relative z-10 flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/20 bg-[var(--carbon-light)]">
            <div className="h-2 w-2 rounded-full bg-[var(--gold)]" />
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6 flex-1 transition-all duration-300 group-hover:border-[var(--gold)]/20">
          <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-[var(--beige)]">{exp.role}</h3>
            <span className="font-mono text-xs text-[var(--gold)]">{exp.period}</span>
          </div>
          <p className="mb-3 font-mono text-xs text-[var(--sage-light)]">{exp.company}</p>
          <ul className="space-y-2">
            {exp.points.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--ash)]">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--gold)]/40" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience({ experiences }: { experiences: any[] }) {
  // Use passed experiences or fallback to empty.
  const displayExperiences = experiences?.length > 0 ? experiences.map(exp => ({
    role: exp.role || "Role",
    company: exp.company || "Company",
    period: exp.period || exp.date || "2024",
    points: exp.description ? exp.description.split('\n') : ["No description provided."]
  })) : [];

  if (displayExperiences.length === 0) return null; // Or show empty state

  return (
    <section id="experience" className="relative py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader label="// experience" title="Where I've Been" />

        <div className="flex flex-col gap-8">
          {displayExperiences.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

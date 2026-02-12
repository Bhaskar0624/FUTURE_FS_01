"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

const skillCategories = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Three.js", "Framer Motion", "GSAP"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Python", "REST APIs", "PostgreSQL", "MongoDB", "Firebase", "Supabase"],
  },
  {
    label: "AI / ML",
    skills: ["OpenAI API", "LangChain", "Prompt Engineering", "RAG", "Fine-tuning", "Computer Vision"],
  },
  {
    label: "Tools",
    skills: ["Git", "Docker", "Vercel", "VS Code", "Figma", "Linux", "CI/CD"],
  },
];

function SkillNode({ skill, index, catIdx }: { skill: string; index: number; catIdx: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: catIdx * 0.1 + index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`cursor-default rounded-full border px-4 py-2 font-mono text-xs transition-all duration-300 ${hovered
        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] glow-gold"
        : "border-[var(--gold)]/10 bg-[var(--carbon-light)] text-[var(--ash)]"
        }`}
    >
      {skill}
    </motion.div>
  );
}

function SkillCategory({ cat, catIdx }: { cat: typeof skillCategories[0]; catIdx: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: catIdx * 0.1 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[var(--gold)]" />
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--gold)]">
          {cat.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cat.skills.map((skill, i) => (
          <SkillNode key={skill} skill={skill} index={i} catIdx={catIdx} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills({ skills }: { skills: any[] }) {
  // If we have dynamic skills, group them. Otherwise use default.
  const hasDynamic = skills && skills.length > 0;

  let displayedCategories = skillCategories;

  if (hasDynamic) {
    displayedCategories = skills.map(s => ({
      label: s.category || "Other",
      skills: s.items || []
    }));
  }

  return (
    <section id="skills" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader label="// tech stack" title="Skills & Technologies" />

        <div className="grid gap-12 md:grid-cols-2">
          {displayedCategories.map((cat, catIdx) => (
            <SkillCategory key={cat.label} cat={cat} catIdx={catIdx} />
          ))}
        </div>
      </div>
    </section>
  );
}

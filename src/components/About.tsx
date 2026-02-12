"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";

function TimelineItem({ item, index }: { item: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`flex gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start`}
    >
      {/* Year badge */}
      <div className="flex-shrink-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)]/20 bg-[var(--carbon-light)]">
          <span className="font-mono text-sm text-[var(--gold)]">{item.year}</span>
        </div>
      </div>

      {/* Content */}
      <div className="glass rounded-2xl p-6 flex-1">
        <h3 className="mb-2 text-lg font-medium text-[var(--beige)]">{item.title}</h3>
        <p className="text-sm leading-relaxed text-[var(--ash)]">{item.description || item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function About({ profile, journey }: { profile: any; journey: any[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const name = profile?.name || "Bhaskar";
  const bio = profile?.bio || "I'm a developer, AI engineer student, and vibecoder who believes technology should feel alive. I craft digital experiences that merge engineering precision with creative vision, building at the intersection of code and artificial intelligence.";

  // Use database journey or fallback to empty array
  const timeline = journey && journey.length > 0 ? journey : [];

  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader label="// about me" title="The Journey" />

        {/* Bio */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 glass rounded-2xl p-8 text-center"
        >
          <p className="text-base leading-relaxed text-[var(--beige-dark)] sm:text-lg">
            <span className="text-[var(--gold)]">{name}</span> — {bio}
          </p>
        </motion.div>

        {/* Timeline */}
        {timeline.length > 0 ? (
          <div className="flex flex-col gap-8">
            {timeline.map((item, i) => (
              <TimelineItem key={item.id || i} item={item} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--ash)]">No journey timeline yet.</p>
        )}
      </div>
    </section>
  );
}

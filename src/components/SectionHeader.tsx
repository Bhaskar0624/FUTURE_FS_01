"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function SectionHeader({ label, title }: { label: string; title: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="mb-16 text-center">
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--sage)]"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl font-light tracking-tight text-[var(--beige)] sm:text-5xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}

export default SectionHeader;

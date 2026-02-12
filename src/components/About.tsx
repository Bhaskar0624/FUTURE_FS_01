"use client";

import { motion } from "framer-motion";

export default function About({ profile, journey }: { profile: any; journey: any[] }) {
  return (
    <section id="about" className="relative min-h-screen w-full bg-black px-6 py-24 text-white">

      {/* HEADER */}
      <div className="mb-24 flex w-full items-end justify-between border-b border-white/20 pb-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">
          ( Biography )
        </h2>
      </div>

      <div className="grid gap-20 md:grid-cols-[1fr_2fr]">

        {/* LEFT: PROFILE */}
        <div className="sticky top-32 h-fit">
          <h3 className="mb-8 font-heading text-4xl font-light uppercase leading-tight tracking-tight sm:text-5xl">
            {profile?.heading || "Digital\nArchitect"}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            {profile?.long_bio ||
              "I build digital products that feel alive. My work sits at the intersection of rigorous engineering and fluid interaction design."}
          </p>
        </div>

        {/* RIGHT: JOURNEY (Minimal List) */}
        <div className="flex flex-col border-l border-white/10 pl-8 md:pl-16">
          {journey.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative border-b border-white/10 py-12 last:border-none"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-heading text-2xl font-medium uppercase tracking-tight">
                  {item.title}
                </span>
                <span className="font-mono text-xs text-white/40">
                  {new Date(item.date).getFullYear()}
                </span>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

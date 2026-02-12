"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import MagneticButton from "./ui/MagneticButton";

// Dynamically import the new Liquid Scene
const FluidDistortionScene = dynamic(() => import("./FluidDistortionScene"), { ssr: false });

export default function Hero({ profile }: { profile: any }) {
  const name = profile?.name || "BHASKAR";
  const role = profile?.title || "DEVELOPER & AI ENGINEER";

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-6 py-12 text-white">

      {/* 2. OVERLAY GRAIN (Texture) */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.05]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* 3. NAVIGATION (Minimalist Corners) */}
      <nav className="relative z-20 flex w-full justify-between font-mono text-xs tracking-widest uppercase text-white/70">
        <div>( {new Date().getFullYear()} )</div>
        <div className="text-right">Based in India<br />Available for work</div>
      </nav>

      {/* 4. MAIN CONTENT (Editorial Style) */}
      <div className="relative z-20 flex h-full flex-col justify-center">

        {/* Massive Role Text */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mb-4 text-xs font-bold tracking-[0.5em] text-white/50">
            {role}
          </h2>
        </motion.div>

        {/* GIGANTIC NAME (Shoya Style) */}
        <motion.h1
          className="relative text-[12vw] font-black leading-[0.8] tracking-tighter text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {name}
        </motion.h1>
        <motion.h1
          className="relative ml-[10vw] text-[12vw] font-black leading-[0.8] tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)" }} // White Outline
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          DEV
        </motion.h1>

      </div>

      {/* 5. BOTTOM INTERACTION AREA */}
      <div className="relative z-20 flex w-full items-end justify-between">

        <div className="max-w-md text-sm leading-relaxed text-white/60">
          Crafting <span className="text-white">liquid digital experiences</span> at the intersection of design and artificial intelligence.
        </div>

        <MagneticButton>
          <a href="#projects" className="group flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:bg-white hover:text-black">
            <span className="font-mono text-xs uppercase tracking-widest group-hover:font-bold">Explore</span>
          </a>
        </MagneticButton>

      </div>

    </section>
  );
}

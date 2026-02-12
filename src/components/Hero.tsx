"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import MagneticButton from "./ui/MagneticButton";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero({ profile }: { profile: any }) {
  // Use profile data or fallbacks
  const name = profile?.name || "Bhaskar";
  const title = profile?.title || "Full Stack Developer";
  const bio = profile?.bio || "Building intelligent, cinematic digital experiences at the intersection of code, AI, and creative engineering.";

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* 3D Scene */}
      <HeroScene />

      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 gradient-mesh" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--carbon)] via-transparent to-[var(--carbon)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--carbon)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Terminal tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-block"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--ash)]">
            <span className="text-[var(--sage)]">~/</span> {title.toLowerCase()}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-5xl font-light leading-tight tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="block text-[var(--beige)]">Hi, I&apos;m</span>
          <span className="block text-gradient-animated font-medium">{name}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-[var(--ash)] sm:text-lg"
        >
          {bio}
        </motion.p>

        {/* CTA Buttons - Resume URL logic added */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <MagneticButton>
            <a
              href="#projects"
              className="relative overflow-hidden rounded-full bg-[var(--gold)] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[var(--carbon)] transition-all hover:shadow-[0_0_40px_rgba(244,208,63,0.5)] hover:scale-105"
            >
              <span className="relative z-10">Explore My Work</span>
            </a>
          </MagneticButton>
          {profile?.resume_url ? (
            <MagneticButton>
              <a
                href={profile.resume_url}
                target="_blank"
                className="rounded-full border border-[var(--gold)]/30 px-8 py-3 font-mono text-xs uppercase tracking-widest text-[var(--gold)] transition-all hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 hover:shadow-[0_0_30px_rgba(244,208,63,0.3)] hover:scale-105"
              >
                Resume
              </a>
            </MagneticButton>
          ) : (
            <MagneticButton>
              <a
                href="#contact"
                className="rounded-full border border-[var(--gold)]/30 px-8 py-3 font-mono text-xs uppercase tracking-widest text-[var(--gold)] transition-all hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 hover:shadow-[0_0_30px_rgba(244,208,63,0.3)] hover:scale-105"
              >
                Get in Touch
              </a>
            </MagneticButton>
          )}
        </motion.div>


      </div>
    </section>
  );
}

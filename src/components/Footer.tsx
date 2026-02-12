"use client";

import { motion } from "framer-motion";

export default function Footer({ profile }: { profile: any }) {
  return (
    <footer className="border-t border-[var(--gold)]/5 py-12 transition-colors duration-300 hover:border-[var(--gold)]/20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <span className="group inline-block cursor-default font-mono text-sm tracking-widest text-[var(--gold)] transition-transform duration-300 hover:scale-105">
              BHASKAR.DEV
              <span className="block h-[1px] w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
            </span>
            <p className="mt-2 font-mono text-xs text-[var(--ash)]">
              Developer × AI Engineer × Vibecoder
            </p>
          </div>

          <div className="font-mono text-xs text-[var(--ash)]">
            <span className="text-[var(--sage)]">const</span> year ={" "}
            <span className="inline-block text-[var(--gold)] transition-transform duration-300 hover:scale-110 hover:text-[var(--gold-glow)]">
              {new Date().getFullYear()}
            </span>;
            <span className="text-[var(--ash)]"> // Built with passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

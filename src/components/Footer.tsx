"use client";

import { motion } from "framer-motion";

export default function Footer({ profile }: { profile: any }) {
  return (
    <footer className="border-t border-[var(--gold)]/5 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <span className="font-mono text-sm tracking-widest text-[var(--gold)]">BHASKAR.DEV</span>
            <p className="mt-1 font-mono text-xs text-[var(--ash)]">
              Developer × AI Engineer × Vibecoder
            </p>
          </div>

          <div className="font-mono text-xs text-[var(--ash)]">
            <span className="text-[var(--sage)]">const</span> year ={" "}
            <span className="text-[var(--gold)]">{new Date().getFullYear()}</span>;
            <span className="text-[var(--ash)]"> // Built with passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

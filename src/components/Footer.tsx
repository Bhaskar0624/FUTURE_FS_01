"use client";

import { motion } from "framer-motion";

export default function Footer({ profile }: { profile: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-white/20 bg-black px-6 py-12 text-white">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

        {/* LEFT: COPYRIGHT */}
        <div className="font-mono text-xs uppercase tracking-widest text-white/40">
          © {currentYear} {profile?.name || "Bhaskar"}. All Rights Reserved.
        </div>

        {/* CENTER: SCROLL TO TOP */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-mono text-xs uppercase tracking-widest text-white transition-colors hover:text-white/50"
        >
          ( Back to Top )
        </button>

        {/* RIGHT: CREDIT */}
        <div className="font-mono text-xs uppercase tracking-widest text-white/40 text-right">
          Designed & Built in 2026
        </div>

      </div>
    </footer>
  );
}

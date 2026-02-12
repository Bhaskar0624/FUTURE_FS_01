"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Outer ring */}
          <motion.div
            className="pointer-events-none fixed z-[9999] hidden md:block"
            animate={{
              x: pos.x - 16,
              y: pos.y - 16,
              scale: clicking ? 0.8 : 1,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className={`h-8 w-8 rounded-full border transition-colors duration-200 ${
                clicking ? "border-[var(--gold)]" : "border-[var(--gold)]/30"
              }`}
            />
          </motion.div>
          {/* Inner dot */}
          <motion.div
            className="pointer-events-none fixed z-[9999] hidden md:block"
            animate={{
              x: pos.x - 2,
              y: pos.y - 2,
              scale: clicking ? 2 : 1,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
          >
            <div className="h-1 w-1 rounded-full bg-[var(--gold)]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

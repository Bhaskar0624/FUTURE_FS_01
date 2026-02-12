"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--emerald)] to-[var(--coral)] origin-left z-[9999]"
            style={{ scaleX }}
        />
    );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Send, Github, Linkedin, Twitter, Mail } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/bhaskar" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/bhaskar" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/bhaskar" },
  { icon: Mail, label: "Email", href: "mailto:hello@bhaskar.dev" },
];

export default function Contact({ profile }: { profile: any }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const email = profile?.email || "hello@bhaskar.dev";
  const location = profile?.location || "India";
  const status = profile?.status || "Open to opportunities";

  // Dynamic socials
  // We can filter valid URLs or just use defaults if missing.
  // The icon map is a bit tricky if we want to be fully dynamic, but let's stick to these 4 for now and update hrefs.
  const socials = [
    { icon: Github, label: "GitHub", href: profile?.github_url || "#" },
    { icon: Linkedin, label: "LinkedIn", href: profile?.linkedin_url || "#" },
    { icon: Twitter, label: "Twitter", href: profile?.twitter_url || "#" },
    { icon: Mail, label: "Email", href: `mailto:${email}` },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader label="// contact" title="Let's Connect" />

        <div ref={ref} className="grid gap-12 md:grid-cols-2">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-8 text-base leading-relaxed text-[var(--ash)]">
              Have a project idea, collaboration opportunity, or just want to chat about
              AI and code? I&apos;d love to hear from you.
            </p>

            {/* Terminal-style info */}
            <div className="mb-8 glass rounded-xl p-5 font-mono text-sm">
              <div className="mb-3 flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <p className="text-[var(--ash)]">
                <span className="text-[var(--sage)]">$</span> cat contact.json
              </p>
              <p className="mt-2 text-[var(--gold)]">{"{"}</p>
              <p className="ml-4 text-[var(--beige-dark)]">
                &quot;email&quot;: <span className="text-[var(--sage-light)]">&quot;{email}&quot;</span>
              </p>
              <p className="ml-4 text-[var(--beige-dark)]">
                &quot;location&quot;: <span className="text-[var(--sage-light)]">&quot;{location}&quot;</span>
              </p>
              <p className="ml-4 text-[var(--beige-dark)]">
                &quot;status&quot;: <span className="text-[var(--sage-light)]">&quot;{status}&quot;</span>
              </p>
              <p className="text-[var(--gold)]">{"}"}</p>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
    <section id="contact" className="relative h-screen w-full bg-black px-6 py-24 text-white">
      
      {/* HEADER */}
      <div className="mb-12 flex w-full items-end justify-between border-b border-white/20 pb-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">
          ( Contact )
        </h2>
      </div>

      <div className="flex h-full flex-col justify-between">
        
        {/* BIG CTA */}
        <div>
          <h2 className="mb-8 font-heading text-6xl font-normal uppercase leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
            Let's <br/> Work <br/> Together
          </h2>
          
          <MagneticButton>
            <a 
              href={`mailto:${profile?.email || "hello@bhaskar.dev"}`}
              className="inline-flex h-20 items-center justify-center rounded-full border border-white bg-white px-10 text-black transition-transform hover:scale-105"
            >
              <span className="font-mono text-sm uppercase tracking-widest font-bold">Email Me</span>
            </a>
          </MagneticButton>
        </div>

        {/* FOOTER INFO */}
        <div className="flex w-full flex-col justify-between gap-8 border-t border-white/20 pt-8 sm:flex-row">
          
          <div className="flex flex-col gap-2">
             <span className="font-mono text-xs uppercase text-white/50">Socials</span>
             <div className="flex gap-6">
                {["LinkedIn", "GitHub", "Twitter"].map(link => (
                    <a key={link} href="#" className="font-heading text-lg uppercase hover:line-through">{link}</a>
                ))}
             </div>
          </div>

          <div className="text-right">
             <span className="block font-mono text-xs uppercase text-white/50 mb-2">Local Time</span>
             <span className="font-heading text-2xl">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} IST
             </span>
          </div>

        </div>

      </div>
    </section>
              );
}

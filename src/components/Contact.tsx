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
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/10 text-[var(--ash)] transition-all hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-4">
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--ash)]">
                Name
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-4 py-3 text-sm text-[var(--beige)] outline-none transition-colors focus:border-[var(--gold)]/40"
                placeholder="Your name"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--ash)]">
                Email
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-4 py-3 text-sm text-[var(--beige)] outline-none transition-colors focus:border-[var(--gold)]/40"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[var(--ash)]">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-[var(--gold)]/10 bg-[var(--carbon)] px-4 py-3 text-sm text-[var(--beige)] outline-none transition-colors focus:border-[var(--gold)]/40"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--gold)] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--carbon)] transition-all hover:shadow-[0_0_20px_rgba(201,169,110,0.2)] disabled:opacity-60"
            >
              {submitted ? (
                "Message Sent!"
              ) : (
                <>
                  Send Message <Send size={14} />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

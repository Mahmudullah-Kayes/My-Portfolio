"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, MapPin } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AboutSettings {
  title: string;
  description: string[];
  image_url: string;
}

interface HeroSettings {
  status: "available" | "busy" | "offline";
  available_text: string;
  busy_text: string;
  offline_text: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const EDUCATION = [
  {
    degree: "Bachelor's in Computer Science",
    institution: "Northern University Bangladesh",
    period: "2025 – 2028",
  },
  {
    degree: "Diploma in Computer Science",
    institution: "Shyamoli Ideal Polytechnic Institute",
    period: "2020 – 2024",
  },
];

const EXPERIENCE = [
  {
    role: "Full Stack Developer",
    company: "Atolyn",
    period: "2024 – Present",
    stack: ["Next.js", "Laravel", "MySQL"],
  },
  {
    role: "Frontend Developer",
    company: "Freelancer",
    period: "2021 – 2023",
    stack: ["React", "Tailwind CSS", "Bootstrap"],
  },
];

const STATUS_CFG = {
  available: { dot: "bg-emerald-400", text: "text-emerald-400" },
  busy:      { dot: "bg-amber-400",   text: "text-amber-400"   },
  offline:   { dot: "bg-red-400",     text: "text-red-400"     },
};

const DEFAULTS = {
  about: {
    title: "",
    description: [
      "Hey there! I'm Kayes, a passionate Full Stack Developer who believes code is poetry and every project is a new adventure in the digital cosmos.",
      "I specialize in crafting modern web applications that don't just work — they inspire. From sleek frontends to robust backends, I build digital experiences that matter.",
    ],
    image_url: "",
  } as AboutSettings,
  hero: {
    status: "available" as const,
    available_text: "Available for projects",
    busy_text: "Currently busy",
    offline_text: "Currently offline",
  } as HeroSettings,
};

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [about, setAbout]         = useState<AboutSettings>(DEFAULTS.about);
  const [hero, setHero]           = useState<HeroSettings>(DEFAULTS.hero);
  const [imgErr, setImgErr]       = useState(false);
  const [tab, setTab]             = useState<"education" | "experience">("education");

  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      supabase.from("about_settings").select("*").limit(1).order("created_at", { ascending: true }).single(),
      supabase.from("hero_settings").select("*").limit(1).order("created_at", { ascending: true }).single(),
    ]).then(([{ data: a }, { data: h }]) => {
      if (a) setAbout({ title: a.title || DEFAULTS.about.title, description: a.description || DEFAULTS.about.description, image_url: a.image_url || "" });
      if (h) setHero({ status: h.status || "available", available_text: h.available_text, busy_text: h.busy_text, offline_text: h.offline_text });
    }).finally(() => setLoading(false));
  }, []);

  if (!isMounted) return null;

  const sc = STATUS_CFG[hero.status];
  const statusLabel = hero.status === "available" ? hero.available_text : hero.status === "busy" ? hero.busy_text : hero.offline_text;

  if (loading) return (
    <section id="about" className="py-32 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border border-teal-400/30 border-t-teal-400 animate-spin" />
    </section>
  );

  return (
    <section id="about" className="relative py-20 sm:py-28">

      {/* Glass surface: just enough to make text readable over the animated bg */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.5px]" />

      {/* One single centered glow — doesn't compete, just adds depth */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-teal-500/4 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-28">

          {/* ══════════════════════════════════════════
              LEFT COLUMN — desktop only, sticky profile
              Mobile: hidden, replaced by inline strip below
          ══════════════════════════════════════════ */}
          <motion.aside
            initial={{ opacity: 1, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col gap-8 lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-28 lg:self-start"
          >
            {/* Large profile image */}
            <div className="relative w-full aspect-[4/5]">
              {/* Teal glow behind image */}
              <div className="absolute -inset-1 bg-gradient-to-b from-teal-400/15 via-teal-400/5 to-transparent rounded-2xl blur-md" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/6 bg-gray-900/80">
                {imgErr || !about.image_url ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Code2 size={36} className="text-teal-400/25" />
                    <span className="text-gray-700 text-xs">Kayes</span>
                  </div>
                ) : (
                  <Image
                    src={about.image_url}
                    alt="Kayes"
                    fill
                    className="object-cover hover:scale-[1.02] transition-transform duration-700"
                    priority
                    onError={() => setImgErr(true)}
                  />
                )}
                {/* Subtle bottom gradient overlay for text legibility if needed */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Floating name tag at bottom of image */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-sm leading-none mb-1">Mahmudullah Kayes</p>
                <p className="text-gray-500 text-xs">Full Stack Developer</p>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-col gap-3 pl-1">
              <div className="flex items-center gap-2">
                <MapPin size={11} className="text-gray-700 flex-shrink-0" />
                <span className="text-gray-600 text-xs">Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sc.dot} opacity-40`} />
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                </span>
                <span className={`text-xs ${sc.text}`}>{statusLabel}</span>
              </div>
            </div>

          </motion.aside>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN — main content (both views)
          ══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Section heading */}
            <motion.div
              initial={{ opacity: 1, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-10 sm:mb-12 lg:mb-14 lg:pt-2"
            >
              <p className="text-[10px] text-teal-400/50 tracking-[0.3em] uppercase mb-3">About</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                The person behind the code
              </h2>
            </motion.div>

            {/* ── Mobile-only profile strip ── */}
            <motion.div
              initial={{ opacity: 1, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="flex lg:hidden items-center gap-4 mb-8 pb-8 border-b border-white/5"
            >
              <div className="relative flex-shrink-0 w-16 h-16">
                <div className="absolute -inset-px bg-gradient-to-br from-teal-400/20 to-transparent rounded-xl" />
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/6 bg-gray-900">
                  {imgErr || !about.image_url ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code2 size={20} className="text-teal-400/30" />
                    </div>
                  ) : (
                    <Image src={about.image_url} alt="Kayes" fill className="object-cover" priority onError={() => setImgErr(true)} />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-white font-semibold text-sm leading-none">Mahmudullah Kayes</p>
                {/* Status — directly under name */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sc.dot} opacity-40`} />
                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                  </span>
                  <span className={`text-[11px] ${sc.text}`}>{statusLabel}</span>
                </div>
                {/* Location — under status */}
                <div className="flex items-center gap-1">
                  <MapPin size={9} className="text-gray-500" />
                  <span className="text-gray-500 text-[11px]">Dhaka, Bangladesh</span>
                </div>
              </div>
            </motion.div>

            {/* ── Bio ── */}
            <motion.div
              initial={{ opacity: 1, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="space-y-4 mb-10"
            >
              {about.description.map((p, i) => (
                <p key={i} className="text-gray-300 text-sm sm:text-[15px] lg:text-base leading-relaxed">{p}</p>
              ))}
            </motion.div>

            {/* ── Divider ── */}
            <div className="h-px bg-white/5 mb-10" />

            {/* ── Education / Experience tabs ── */}
            <motion.div
              initial={{ opacity: 1, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              {/* Tab strip */}
              <div className="flex gap-7 mb-8">
                {(["education", "experience"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative pb-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200 ${tab === t ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
                  >
                    {t}
                    {tab === t && (
                      <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-px bg-teal-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {(tab === "education" ? EDUCATION : EXPERIENCE).map((item, i, arr) => {
                  const isExp  = tab === "experience";
                  const expItem = isExp ? (item as typeof EXPERIENCE[0]) : null;
                  const isLast  = i === arr.length - 1;
                  return (
                    <div key={i} className="flex gap-5">
                      {/* Spine */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-[5px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400/50 flex-shrink-0" />
                        {!isLast && <div className="w-px flex-1 bg-white/5 mt-1.5" />}
                      </div>
                      {/* Content */}
                      <div className={`flex-1 min-w-0 ${!isLast ? "pb-8" : ""}`}>
                        <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1.5">{item.period}</p>
                        <p className="text-white text-sm lg:text-base font-medium leading-snug mb-1">
                          {isExp ? expItem!.role : (item as typeof EDUCATION[0]).degree}
                        </p>
                        <p className="text-gray-400 text-xs lg:text-sm mb-2.5">
                          {isExp ? expItem!.company : (item as typeof EDUCATION[0]).institution}
                        </p>
                        {isExp && expItem!.stack && (
                          <div className="flex flex-wrap gap-2">
                            {expItem!.stack.map(tag => (
                              <span key={tag} className="text-[11px] text-gray-400 px-2.5 py-1 rounded-full border border-white/8 bg-white/3">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Github, Linkedin, Phone, Facebook } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "available" | "busy" | "offline";

interface HeroSettings {
  status: Status;
  available_text: string;
  busy_text: string;
  offline_text: string;
}

interface ContactSettings {
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  social_links: { github: string; linkedin: string; twitter: string; facebook: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_HERO: HeroSettings = {
  status: "available",
  available_text: "I'm available for new projects",
  busy_text: "I'm really busy right now",
  offline_text: "I'm currently offline",
};

const DEFAULT_CONTACT: ContactSettings = {
  title: "", description: "", email: "", phone: "", location: "",
  social_links: { github: "", linkedin: "", twitter: "", facebook: "" },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings] = useState<HeroSettings>(DEFAULT_HERO);
  const [contact, setContact] = useState<ContactSettings>(DEFAULT_CONTACT);

  useEffect(() => {
    setIsMounted(true);

    supabase
      .from("contact_settings")
      .select("*")
      .limit(1)
      .order("created_at", { ascending: true })
      .single()
      .then(({ data }) => { if (data) setContact(data); });

  }, []);

  if (!isMounted) return null;

  const wa = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;

  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent">

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-5 sm:px-8">
        <div className="flex flex-col items-center text-center gap-5 sm:gap-6">

          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <p className="text-emerald-400 text-xs tracking-widest uppercase font-medium">Available for new projects</p>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Kayes
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-400 leading-relaxed max-w-sm mx-auto">
              I build fast, modern web apps — from idea to launch.
            </p>
          </div>
          {/* CTA Buttons — clear hierarchy: primary dominates */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href={`${wa}?text=Hi%20Kayes,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.`}
              target="_blank" rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-indigo-600 rounded-xl text-white font-bold text-sm sm:text-base hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 border border-teal-400/20 overflow-hidden"
            >
              <span className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-[shimmer_3s_ease-in-out_1s_infinite]" />
              <span className="relative z-10 flex items-center gap-2">
                Start a Project
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a>

            <a
              href="#client-projects"
              className="flex items-center justify-center px-6 py-3.5 bg-white/5 border border-white/15 rounded-xl text-gray-300 font-medium text-sm sm:text-base hover:bg-white/10 hover:border-white/25 hover:text-white transition-all duration-300"
            >
              See My Work
            </a>
          </div>

          {/* Social Cards */}
          <div className="w-full pt-2 sm:pt-4">
            <p className="text-xs text-gray-600 tracking-widest uppercase mb-4">Find me on</p>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <SocialCard
                href={wa}
                icon={<Phone size={16} />}
                label="WhatsApp"
                handle="Chat directly"
                accent="from-green-500/20 to-green-500/5"
                border="border-green-500/20"
                iconColor="text-green-400"
              />
              <SocialCard
                href={contact.social_links.github}
                icon={<Github size={16} />}
                label="GitHub"
                handle="See my code"
                accent="from-gray-500/20 to-gray-500/5"
                border="border-gray-500/20"
                iconColor="text-gray-300"
              />
              <SocialCard
                href={contact.social_links.linkedin}
                icon={<Linkedin size={16} />}
                label="LinkedIn"
                handle="Professional profile"
                accent="from-blue-500/20 to-blue-500/5"
                border="border-blue-500/20"
                iconColor="text-blue-400"
              />
              <SocialCard
                href={contact.social_links.facebook}
                icon={<Facebook size={16} />}
                label="Facebook"
                handle="Follow updates"
                accent="from-blue-600/20 to-blue-600/5"
                border="border-blue-600/20"
                iconColor="text-blue-500"
              />
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(100%)  skewX(12deg); }
        }
      `}</style>
    </section>
  );
};

// ─── SocialCard ───────────────────────────────────────────────────────────────

interface SocialCardProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  handle: string;
  accent: string;
  border: string;
  iconColor: string;
}

const SocialCard = ({ href, icon, label, handle, accent, border, iconColor }: SocialCardProps) => (
  <a
    href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br ${accent} border ${border} hover:brightness-125 active:scale-95 transition-all duration-200`}
  >
    <span className={`flex-shrink-0 ${iconColor} transition-transform duration-200 group-hover:scale-110`}>
      {icon}
    </span>
    <div className="text-left min-w-0">
      <p className="text-white text-xs font-semibold leading-none mb-0.5">{label}</p>
      <p className="text-gray-500 text-[11px] leading-none truncate">{handle}</p>
    </div>
  </a>
);

export default Hero;
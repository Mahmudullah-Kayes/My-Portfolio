"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type SectionName =
  | "client-projects"
  | "about"
  | "how-i-work"
  | "works"
  | "testimonials"
  | "footer";

async function loadSection(section: SectionName): Promise<ComponentType> {
  switch (section) {
    case "client-projects":
      return (await import("@/components/sections/ClientProjects")).default;
    case "about":
      return (await import("@/components/sections/About")).default;
    case "how-i-work":
      return (await import("@/components/sections/HowIWork")).default;
    case "works":
      return (await import("@/components/sections/Works")).default;
    case "testimonials":
      return (await import("@/components/sections/Testimonials")).default;
    case "footer":
      return (await import("@/components/sections/Footer")).default;
  }
}

interface DeferredHomeSectionProps {
  section: SectionName;
  id: string;
  placeholderClassName: string;
}

export default function DeferredHomeSection({
  section,
  id,
  placeholderClassName,
}: DeferredHomeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [LoadedSection, setLoadedSection] = useState<ComponentType | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const load = async () => {
      try {
        const component = await loadSection(section);
        if (!cancelled) setLoadedSection(() => component);
      } catch (error) {
        console.error(`Failed to load the ${section} section:`, error);
        if (!cancelled) setLoadFailed(true);
      }
    };

    if (!("IntersectionObserver" in window)) {
      void load();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [section]);

  return (
    <div
      ref={containerRef}
      id={id}
      aria-busy={!LoadedSection && !loadFailed}
      className={LoadedSection || loadFailed ? undefined : placeholderClassName}
    >
      {LoadedSection ? (
        <LoadedSection />
      ) : loadFailed ? (
        <p className="sr-only">This section could not be loaded.</p>
      ) : null}
    </div>
  );
}

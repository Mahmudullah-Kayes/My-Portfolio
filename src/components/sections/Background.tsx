"use client";

import { useEffect, useMemo, useState } from "react";
import ClientOnly from "@/components/ClientOnly";

const Background = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showEffects, setShowEffects] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const conn = (navigator as any).connection ?? {};
      const slow = conn.saveData || ["2g", "slow-2g"].includes(conn.effectiveType ?? "");
      if (reduced || slow || window.innerWidth < 768) setShowEffects(false);
    } catch {
      // ignore
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <ClientOnly>
        {showEffects && (
          <>
            <StarField />
            <FloatingParticles />
            <MeteorShower />
          </>
        )}
      </ClientOnly>
    </div>
  );
};

const StarField = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.3,
        brightness: Math.random() * 0.4 + 0.15,
        delay: Math.random() * 6,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-10">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-slate-200"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.brightness,
            animation: `twinkle 4s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 15,
        dur: 12 + Math.random() * 8,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-[5]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/15"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `floatUp ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const METEOR_PALETTES = [
  ["rgba(255,255,255,1)", "rgba(180,220,255,0)", "rgba(160,210,255,0.55)"],
  ["rgba(255,245,200,1)", "rgba(255,200,100,0)", "rgba(255,200,80,0.45)"],
  ["rgba(255,255,255,1)", "rgba(150,230,255,0)", "rgba(140,225,255,0.5)"],
  ["rgba(255,220,160,1)", "rgba(255,160,60,0)", "rgba(255,160,60,0.4)"],
] as const;

const MeteorShower = () => {
  const meteors = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angleDeg = -(28 + Math.random() * 18);
        const tailLen = 80 + Math.random() * 120;
        const headW = 1 + Math.random() * 1.8;
        const dur = 7 + Math.random() * 8;
        const delay = -(Math.random() * dur);
        const palette = METEOR_PALETTES[i % METEOR_PALETTES.length];

        return {
          id: i,
          x: Math.random() * 95,
          angleDeg,
          tailLen,
          headW,
          dur,
          delay,
          start: `${-(20 + Math.random() * 80)}vh`,
          palette,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 z-[8] overflow-hidden pointer-events-none">
      {meteors.map((m) => {
        const [headColor, trailColor, glowColor] = m.palette;

        const sharedStyle = {
          borderRadius: "999px",
        };

        return (
          <div
            key={m.id}
            className="absolute"
            style={{
              left: `${m.x}vw`,
              top: 0,
              width: 0,
              height: 0,
              transformOrigin: "top center",
              ["--rot" as any]: `${m.angleDeg}deg`,
              ["--start" as any]: m.start,
              animation: `meteorFall ${m.dur}s linear ${m.delay}s infinite`,
            }}
          >
            <div
              className="absolute"
              style={{
                ...sharedStyle,
                left: 0,
                top: 0,
                width: `${m.headW}px`,
                height: `${m.tailLen}px`,
                marginLeft: `${-m.headW / 2}px`,
                background: `linear-gradient(to bottom, ${trailColor} 0%, ${headColor} 100%)`,
              }}
            />

            <div
              className="absolute"
              style={{
                ...sharedStyle,
                left: 0,
                top: `${m.tailLen - m.headW}px`,
                width: `${m.headW * 2}px`,
                height: `${m.headW * 2}px`,
                marginLeft: `${-m.headW}px`,
                borderRadius: "50%",
                background: headColor,
                boxShadow: `0 0 ${m.headW * 4}px ${m.headW * 2}px ${glowColor}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Background;
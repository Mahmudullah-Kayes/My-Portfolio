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
        <GlowOrbs />
        <SubtleNebula />
        {showEffects && (
          <>
            <StarField />
            <FloatingParticles />
            <CosmicDust />
            <MeteorShower />
            <PlanetaryOrbs />
            <AuroraEffects />
            <GravitationalLensing />
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

const GlowOrbs = () => (
  <div className="absolute inset-0 z-[1]">
    {[
      { x: 20, y: 15, s: 120, c: "rgba(6,182,212,.12)", d: 0, dur: 8 },
      { x: 80, y: 75, s: 100, c: "rgba(99,102,241,.10)", d: 3, dur: 10 },
      { x: 10, y: 80, s: 90, c: "rgba(56,189,248,.06)", d: 6, dur: 9 },
    ].map((o, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${o.x}%`,
          top: `${o.y}%`,
          width: `${o.s}px`,
          height: `${o.s}px`,
          background: o.c,
          filter: "blur(20px)",
          animation: `gentleGlow ${o.dur}s ease-in-out ${o.d}s infinite`,
        }}
      />
    ))}
  </div>
);

const SubtleNebula = () => (
  <div className="absolute inset-0 z-0">
    {[
      { x: 30, y: 25, s: 200, c: "rgba(6,182,212,.035)", d: 0, dur: 25 },
      { x: 70, y: 60, s: 180, c: "rgba(99,102,241,.03)", d: 8, dur: 30 },
      { x: 15, y: 75, s: 150, c: "rgba(56,189,248,.02)", d: 15, dur: 35 },
    ].map((n, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${n.x}%`,
          top: `${n.y}%`,
          width: `${n.s}px`,
          height: `${n.s}px`,
          background: n.c,
          filter: "blur(60px)",
          animation: `subtleWave ${n.dur}s ease-in-out ${n.d}s infinite`,
        }}
      />
    ))}
  </div>
);

const CosmicDust = () => {
  const dust = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 20,
        dur: 15 + Math.random() * 10,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-[2]">
      {dust.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full bg-sky-200/10"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animation: `cosmicFloat ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const PlanetaryOrbs = () => (
  <div className="absolute inset-0 z-[1]">
    {[
      {
        x: 5,
        y: 20,
        s: 40,
        bg: "radial-gradient(circle at 30% 30%,rgba(255,100,100,.15),rgba(150,50,150,.08))",
        d: 0,
        dur: 60,
      },
      {
        x: 90,
        y: 80,
        s: 25,
        bg: "radial-gradient(circle at 30% 30%,rgba(100,150,255,.12),rgba(50,100,200,.06))",
        d: 20,
        dur: 80,
      },
      {
        x: 85,
        y: 15,
        s: 15,
        bg: "radial-gradient(circle at 30% 30%,rgba(150,255,150,.1),rgba(100,200,100,.05))",
        d: 40,
        dur: 50,
      },
    ].map((p, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.s}px`,
          height: `${p.s}px`,
          background: p.bg,
          animation: `planetRotate ${p.dur}s linear ${p.d}s infinite`,
        }}
      />
    ))}
  </div>
);

const AuroraEffects = () => (
  <div className="absolute inset-0 z-0">
    {[
      {
        x: 20,
        y: 10,
        w: 300,
        h: 100,
        bg: "linear-gradient(45deg,rgba(0,255,150,.08),rgba(100,200,255,.05))",
        d: 0,
        dur: 18,
      },
      {
        x: 60,
        y: 70,
        w: 250,
        h: 80,
        bg: "linear-gradient(-45deg,rgba(255,100,200,.06),rgba(150,100,255,.04))",
        d: 9,
        dur: 22,
      },
    ].map((a, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${a.x}%`,
          top: `${a.y}%`,
          width: `${a.w}px`,
          height: `${a.h}px`,
          background: a.bg,
          filter: "blur(40px)",
          animation: `auroraFlow ${a.dur}s ease-in-out ${a.d}s infinite`,
        }}
      />
    ))}
  </div>
);

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
          left: `${m.x}vw`,
          top: 0,
          borderRadius: "999px",
          transformOrigin: "bottom center",
          ["--rot" as any]: `${m.angleDeg}deg`,
          ["--start" as any]: m.start,
          animation: `meteorFall ${m.dur}s linear ${m.delay}s infinite`,
        };

        return (
          <div key={m.id} className="absolute" style={{ left: `${m.x}vw`, top: 0, width: 0, height: 0 }}>
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
                top: `${m.tailLen - m.headW * 1.5}px`,
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

const GravitationalLensing = () => (
  <div className="absolute inset-0 z-[5]">
    {[{ x: 30, y: 40, s: 80, d: 0 }, { x: 70, y: 60, s: 60, d: 5 }].map((l, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${l.x}%`,
          top: `${l.y}%`,
          width: `${l.s}px`,
          height: `${l.s}px`,
          border: "2px solid rgba(255,255,255,.1)",
          background: "radial-gradient(ellipse at center,transparent 30%,rgba(200,220,255,.1) 40%,transparent 60%)",
          filter: "blur(2px)",
          animation: `gravBend 15s ease-in-out ${l.d}s infinite`,
        }}
      />
    ))}
  </div>
);

export default Background;

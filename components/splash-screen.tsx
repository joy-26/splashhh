"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SplashScreen() {
  const logoControls = useAnimation();
  const glowControls = useAnimation();
  const containerControls = useAnimation();
  const taglineControls = useAnimation();

  const [textVisible, setTextVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [glowActive, setGlowActive] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      // Step 1: Logo zooms into center rapidly
      await logoControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      });

      // Brief pause on center — then trigger glow bloom
      await new Promise((r) => setTimeout(r, 120));
      setGlowActive(true);

      await new Promise((r) => setTimeout(r, 480));

      // Step 2 & 3: Logo slides left, text reveals simultaneously
      setTextVisible(true);

      await Promise.all([
        logoControls.start({
          x: "-56px",
          transition: { duration: 0.72, ease: EASING },
        }),
        containerControls.start({
          width: "220px",
          transition: { duration: 0.72, ease: EASING },
        }),
      ]);

      // Step 4: Tagline fades in
      await new Promise((r) => setTimeout(r, 260));
      setTaglineVisible(true);

      await taglineControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASING },
      });
    };

    sequence();
  }, [logoControls, glowControls, containerControls, taglineControls]);

  return (
    <div className="relative flex items-center justify-center w-full h-[100dvh] bg-black overflow-hidden select-none">

      {/* ── Center lock ── */}
      <div className="relative flex items-center justify-center">

        {/* Red Glow Bloom */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(220,38,38,0.38) 0%, rgba(220,38,38,0.12) 45%, transparent 72%)",
            filter: "blur(28px)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            glowActive
              ? { opacity: 1, scale: 1.15, transition: { duration: 0.9, ease: EASING } }
              : {}
          }
        />

        {/* Logo */}
        <motion.div
          className="relative z-10 flex-shrink-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={logoControls}
          style={{ width: 96, height: 96 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6zav1x60RgyXnRH2w4WtcXl9sTz5R4.png"
            alt="Aryzen Arena logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Text reveal container */}
        <motion.div
          className="overflow-hidden z-10 flex-shrink-0"
          style={{ width: 0 }}
          animate={containerControls}
        >
          <div className="pl-4 flex flex-col items-start justify-center gap-[2px] whitespace-nowrap">
            {/* ARYZEN */}
            <span
              className="text-white font-cabinet leading-none tracking-tight"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "2.75rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              ARYZEN
            </span>
            {/* ARENA */}
            <span
              className="text-white leading-none"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                letterSpacing: "0.45em",
                width: "100%",
                display: "block",
              }}
            >
              ARENA
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Tagline ── */}
      <AnimatePresence>
        {taglineVisible && (
          <motion.div
            className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASING }}
          >
            <p
              className="text-center"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                color: "#DC2626",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Real Tournaments. Real Money.
            </p>
            <p
              className="text-center"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                color: "#6b7280",
                fontSize: "0.78rem",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              🇮🇳 Made by Gamers, for Gamers
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

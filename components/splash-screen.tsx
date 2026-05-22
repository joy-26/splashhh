"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGO_SIZE = 100;

export default function SplashScreen() {
  const [phase, setPhase] = useState<"zoom" | "slide" | "done">("zoom");
  const [glowVisible, setGlowVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    const run = async () => {
      // 1 — Logo zooms in (phase stays "zoom")
      await new Promise((r) => setTimeout(r, 500));

      // 2 — Bloom fires
      setGlowVisible(true);
      await new Promise((r) => setTimeout(r, 600));

      // 3 — Slide phase: logo moves left, text reveals
      setPhase("slide");
      await new Promise((r) => setTimeout(r, 850));

      // 4 — Tagline
      setPhase("done");
      setTaglineVisible(true);
    };

    run();
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-start min-h-[100dvh] w-full overflow-hidden select-none"
      style={{ background: "#000" }}
    >
      {/* ── Background vignette - sits at z-index 0, BEHIND everything ── */}
      <AnimatePresence>
        {glowVisible && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          >
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120vw",
                height: "80vh",
                background:
                  "radial-gradient(ellipse 50% 50% at center, rgba(220,38,38,0.25) 0%, rgba(220,38,38,0.08) 40%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area - top 70% ── */}
      <div
        className="relative flex flex-col items-center justify-center w-full"
        style={{ height: "70dvh", zIndex: 10 }}
      >
        {/* Branding block: logo + text side-by-side */}
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{
            x: phase === "zoom" ? 0 : -20,
          }}
          transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
        >
          {/* Spartan Logo */}
          <motion.div
            className="relative flex-shrink-0"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6zav1x60RgyXnRH2w4WtcXl9sTz5R4.png"
              alt="Aryzen Arena Spartan helmet"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Text block - always present, animates in */}
          <motion.div
            className="flex flex-col items-start justify-center"
            style={{ paddingLeft: "14px", gap: "2px" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: phase === "zoom" ? 0 : 1,
              x: phase === "zoom" ? -20 : 0,
            }}
            transition={{ duration: 0.75, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            {/* ARYZEN — bold red */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(2.25rem, 10vw, 3.5rem)",
                fontWeight: 800,
                color: "#DC2626",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              ARYZEN
            </span>

            {/* ARENA — medium red, letter-spaced to match ARYZEN width */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(0.7rem, 3vw, 1rem)",
                fontWeight: 500,
                color: "#DC2626",
                letterSpacing: "0.58em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                paddingRight: "0.58em",
              }}
            >
              ARENA
            </span>
          </motion.div>
        </motion.div>

        {/* ── Taglines - positioned below branding block ── */}
        <AnimatePresence>
          {taglineVisible && (
            <motion.div
              className="flex flex-col items-center gap-2 mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
            >
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "#DC2626",
                  fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                }}
              >
                Real Tournaments. Real Money.
              </p>
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "#6b7280",
                  fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Made by Gamers, for Gamers
                <span role="img" aria-label="India flag">🇮🇳</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom 30% reserved for Get Started button ── */}
      <div
        className="relative w-full"
        style={{ height: "30dvh", zIndex: 10 }}
      />
    </div>
  );
}

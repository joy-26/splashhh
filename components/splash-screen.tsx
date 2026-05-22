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
      {/* ── Layered Bloom Effect - multiple shadows for "expensive" glow ── */}
      <AnimatePresence>
        {glowVisible && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          >
            {/* Outer diffuse layer */}
            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "140vw",
                height: "90vh",
                background:
                  "radial-gradient(ellipse 45% 40% at center, rgba(127,29,29,0.2) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            {/* Mid layer */}
            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                height: "60vh",
                background:
                  "radial-gradient(ellipse 50% 45% at center, rgba(220,38,38,0.2) 0%, transparent 60%)",
                filter: "blur(50px)",
              }}
            />
            {/* Inner hot core */}
            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50vw",
                height: "40vh",
                background:
                  "radial-gradient(ellipse 55% 50% at center, rgba(220,38,38,0.25) 0%, transparent 55%)",
                filter: "blur(30px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area - top 60% (shifted up 10%) ── */}
      <div
        className="relative flex flex-col items-center justify-center w-full"
        style={{ height: "60dvh", zIndex: 10 }}
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
            {/* ARYZEN — gradient text with embossed effect */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(2.25rem, 10vw, 3.5rem)",
                fontWeight: 800,
                background: "linear-gradient(180deg, #DC2626 0%, #7F1D1D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
              }}
            >
              ARYZEN
            </span>

            {/* ARENA — reversed gradient, letter-spaced to match ARYZEN width */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(0.7rem, 3vw, 1rem)",
                fontWeight: 500,
                background: "linear-gradient(180deg, #7F1D1D 0%, #DC2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.58em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                paddingRight: "0.58em",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
              }}
            >
              ARENA
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Taglines - separate section with breathing room ── */}
      <div
        className="relative flex flex-col items-center justify-start w-full"
        style={{ height: "40dvh", zIndex: 10, paddingTop: "1rem" }}
      >
        <AnimatePresence>
          {taglineVisible && (
            <motion.div
              className="flex flex-col items-center gap-3"
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
                  fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Made by Gamers, for Gamers
                <span 
                  role="img" 
                  aria-label="India flag"
                  style={{ fontSize: "1.25em" }}
                >
                  🇮🇳
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

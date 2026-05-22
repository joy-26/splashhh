"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGO_SIZE = 90;
const TEXT_BLOCK_WIDTH = 180; // Width of the text container for the mask reveal

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

      // 3 — Slide phase: logo moves left, text reveals from mask
      setPhase("slide");
      await new Promise((r) => setTimeout(r, 900));

      // 4 — Tagline
      setPhase("done");
      setTaglineVisible(true);
    };

    run();
  }, []);

  return (
    <div
      className="relative flex flex-col min-h-[100dvh] w-full overflow-hidden select-none"
      style={{ background: "#000" }}
    >
      {/* ── Layered Bloom Effect - gritty multi-layer glow ── */}
      <AnimatePresence>
        {glowVisible && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          >
            {/* Outer diffuse layer - wide spread */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "160vw",
                height: "100vh",
                background:
                  "radial-gradient(ellipse 50% 35% at center, rgba(127,29,29,0.25) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            {/* Mid layer - tighter */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100vw",
                height: "70vh",
                background:
                  "radial-gradient(ellipse 45% 40% at center, rgba(185,28,28,0.2) 0%, transparent 60%)",
                filter: "blur(50px)",
              }}
            />
            {/* Inner hot core - concentrated */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60vw",
                height: "50vh",
                background:
                  "radial-gradient(ellipse 50% 45% at center, rgba(220,38,38,0.3) 0%, transparent 50%)",
                filter: "blur(35px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area - TRUE CENTER of the 80% viewport ── */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{ height: "80dvh", zIndex: 10 }}
      >
        {/* 
          Branding block container - this is the mask parent with overflow: hidden.
          The logo slides left within this, revealing text from behind the mask.
        */}
        <div 
          className="relative flex items-center"
          style={{ 
            // Total width = logo + text block + gap
            width: LOGO_SIZE + TEXT_BLOCK_WIDTH + 12,
            height: LOGO_SIZE,
            overflow: "hidden",
          }}
        >
          {/* Text block - starts hidden outside the mask (x offset), slides into view */}
          <motion.div
            className="absolute flex flex-col items-start justify-center"
            style={{ 
              left: LOGO_SIZE + 12,
              top: "50%",
              width: TEXT_BLOCK_WIDTH,
              gap: "3px",
            }}
            initial={{ x: TEXT_BLOCK_WIDTH, y: "-50%" }}
            animate={{
              x: phase === "zoom" ? TEXT_BLOCK_WIDTH : 0,
              y: "-50%",
            }}
            transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
          >
            {/* ARYZEN — gradient text (crimson to blood-red) */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(2rem, 9vw, 3rem)",
                fontWeight: 800,
                background: "linear-gradient(180deg, #DC2626 0%, #7F1D1D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
              }}
            >
              ARYZEN
            </span>

            {/* ARENA — medium weight, massive letter-spacing to match ARYZEN width */}
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(0.6rem, 2.5vw, 0.85rem)",
                fontWeight: 500,
                background: "linear-gradient(180deg, #991B1B 0%, #DC2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.62em",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                paddingRight: "0.62em",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
              }}
            >
              ARENA
            </span>
          </motion.div>

          {/* Spartan Logo - starts centered in container, slides left to final position */}
          <motion.div
            className="absolute flex-shrink-0"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              left: 0,
              top: 0,
              zIndex: 5,
            }}
            initial={{ scale: 0, opacity: 0, x: (TEXT_BLOCK_WIDTH + 12) / 2 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: phase === "zoom" ? (TEXT_BLOCK_WIDTH + 12) / 2 : 0,
            }}
            transition={{ 
              scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              x: { duration: 0.75, ease: EASE_OUT_EXPO },
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6zav1x60RgyXnRH2w4WtcXl9sTz5R4.png"
              alt="Aryzen Arena Spartan helmet"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* ── Taglines - positioned just above the bottom 20% ── */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center justify-end"
        style={{ 
          bottom: "10dvh", 
          paddingBottom: "1rem",
          zIndex: 10,
        }}
      >
        <AnimatePresence>
          {taglineVisible && (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
            >
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "#DC2626",
                  fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
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
                  fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                Made by Gamers, for Gamers
                <span 
                  role="img" 
                  aria-label="India flag"
                  style={{ fontSize: "1.5em" }}
                >
                  🇮🇳
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom 20% reserved for Get Started button ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "20dvh", zIndex: 10 }}
      />
    </div>
  );
}

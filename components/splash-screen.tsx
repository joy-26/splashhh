"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGO_SIZE = 140;

export default function SplashScreen() {
  const logoControls = useAnimation();
  const textControls = useAnimation();

  const [glowVisible, setGlowVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    const run = async () => {
      // 1 — Logo zooms in from nothing to center
      await logoControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      });

      // 2 — Bloom fires
      await new Promise((r) => setTimeout(r, 80));
      setGlowVisible(true);

      await new Promise((r) => setTimeout(r, 500));

      // 3 — Logo slides left + text expands simultaneously
      setTextVisible(true);
      await Promise.all([
        logoControls.start({
          x: -80,
          transition: { duration: 0.75, ease: EASE_OUT_EXPO },
        }),
        textControls.start({
          width: "auto",
          opacity: 1,
          transition: { duration: 0.75, ease: EASE_OUT_EXPO },
        }),
      ]);

      // 4 — Tagline
      await new Promise((r) => setTimeout(r, 220));
      setTaglineVisible(true);
    };

    run();
  }, [logoControls, textControls]);

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

      {/* ── Main content area - top 80% ── */}
      <div
        className="relative flex flex-col items-center justify-center w-full"
        style={{ height: "80dvh", zIndex: 10 }}
      >
        {/* Branding block: logo + text side-by-side */}
        <div className="relative flex items-center justify-center">
          {/* Spartan Logo */}
          <motion.div
            className="relative flex-shrink-0"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={logoControls}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6zav1x60RgyXnRH2w4WtcXl9sTz5R4.png"
              alt="Aryzen Arena Spartan helmet"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Text reveal container */}
          {textVisible && (
            <motion.div
              className="overflow-hidden flex-shrink-0"
              style={{ width: 0, opacity: 0 }}
              animate={textControls}
            >
              <div
                className="flex flex-col items-start justify-center"
                style={{ paddingLeft: "18px", gap: "3px" }}
              >
                {/* ARYZEN — bold white with subtle red glow from left */}
                <span
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: "clamp(2.4rem, 6vw, 3.2rem)",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    textShadow:
                      "-6px 0 18px rgba(220,38,38,0.9), -2px 0 8px rgba(220,38,38,0.6)",
                    display: "block",
                  }}
                >
                  ARYZEN
                </span>

                {/* ARENA — medium weight, letter-spaced to match ARYZEN width */}
                <span
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    letterSpacing: "0.52em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    display: "block",
                    paddingRight: "0.52em",
                  }}
                >
                  ARENA
                </span>
              </div>
            </motion.div>
          )}
        </div>

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
                }}
              >
                Made by Gamers, for Gamers
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom 20% reserved for Get Started button ── */}
      <div
        className="relative w-full"
        style={{ height: "20dvh", zIndex: 10 }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// How far left the logo travels — expressed as a CSS calc so it never
// leaves the viewport. "50vw - 10vw - half-logo-width" puts the logo's
// right edge ~10vw from the left edge.
const LOGO_SIZE = 140; // px
const LOGO_SLIDE_X = `calc(-50vw + 10vw + ${LOGO_SIZE / 2}px)`;

export default function SplashScreen() {
  const logoControls = useAnimation();
  const textControls = useAnimation();
  const taglineControls = useAnimation();

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
          x: LOGO_SLIDE_X,
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
  }, [logoControls, textControls, taglineControls]);

  return (
    <div
      className="relative flex items-center justify-center min-h-[100dvh] w-full overflow-x-hidden select-none"
      style={{ background: "#000" }}
    >
      {/* ── Noise SVG filter (hidden) ── */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="noise-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noiseOut"
            />
            <feColorMatrix type="saturate" values="0" in="noiseOut" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* ── Branding block: logo + text side-by-side ── */}
      <div className="relative flex items-center">

        {/* Volumetric gritty bloom — centered behind the whole block */}
        <AnimatePresence>
          {glowVisible && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 0 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            >
              {/* Outer diffuse layer */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 480,
                  height: 480,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(220,38,38,0.55) 0%, rgba(220,38,38,0.22) 38%, rgba(220,38,38,0.06) 62%, transparent 78%)",
                  filter: "url(#noise-filter) blur(32px)",
                }}
              />
              {/* Inner hot core */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(220,38,38,0.75) 0%, rgba(180,20,20,0.3) 55%, transparent 80%)",
                  filter: "blur(18px)",
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spartan Logo */}
        <motion.div
          className="relative flex-shrink-0"
          style={{
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            zIndex: 10,
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
            style={{ width: 0, opacity: 0, zIndex: 10 }}
            animate={textControls}
          >
            <div
              className="flex flex-col items-start justify-center"
              style={{ paddingLeft: "18px", gap: "3px" }}
            >
              {/* ARYZEN — bold white with red inner glow */}
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: "clamp(2.4rem, 6vw, 3.2rem)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  // Red inner-glow: simulates light bleeding from the left (the helmet side)
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
                  // ~0.52em tracking makes "ARENA" span the same width as "ARYZEN" at 800w
                  letterSpacing: "0.52em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  display: "block",
                  // Slight right-pad so the last letter's gap doesn't cause visual overhang
                  paddingRight: "0.52em",
                }}
              >
                ARENA
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Tagline ── */}
      <AnimatePresence>
        {taglineVisible && (
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center gap-2"
            style={{ bottom: "clamp(2rem, 6vw, 3.5rem)" }}
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
                color: "#4b5563",
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
  );
}

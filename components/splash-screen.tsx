"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGO_SIZE = 90;
const TEXT_BLOCK_WIDTH = 180;
const GAP = 16;
// Total row width so we can compute the logo's final screen-center-relative position
const ROW_WIDTH = LOGO_SIZE + GAP + TEXT_BLOCK_WIDTH;

export default function SplashScreen() {
  const [phase, setPhase] = useState<"zoom" | "slide" | "done">("zoom");
  const [glowVisible, setGlowVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  // The logo is always absolutely positioned on the full screen.
  // Zoom phase:  centered  → top: 50%, left: 50%, translate(-50%, -50%)
  // Slide phase: moves to the left slot of the centered row.
  // The row is centered, so its left edge is at:  50vw - ROW_WIDTH/2
  // The logo occupies the first LOGO_SIZE px of that row.
  // Therefore the logo's final center is at:  50vw - ROW_WIDTH/2 + LOGO_SIZE/2
  // Expressed as a translate from screen center (50vw, 50vh):
  //   x offset = -(ROW_WIDTH/2 - LOGO_SIZE/2)  =  -(TEXT_BLOCK_WIDTH + GAP) / 2

  const LOGO_FINAL_X = -((TEXT_BLOCK_WIDTH + GAP) / 2); // negative = left

  useEffect(() => {
    const run = async () => {
      // 1 — Logo zooms in
      await new Promise((r) => setTimeout(r, 500));

      // 2 — Bloom fires
      setGlowVisible(true);
      await new Promise((r) => setTimeout(r, 600));

      // 3 — Slide: logo moves left, text mask expands
      setPhase("slide");
      await new Promise((r) => setTimeout(r, 900));

      // 4 — Taglines
      setPhase("done");
      setTaglineVisible(true);
    };

    run();
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden select-none"
      style={{ background: "#000" }}
    >
      {/* ── Layered Bloom ── */}
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

      {/* ── Branding area — occupies top 70% of screen ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "70dvh",
          zIndex: 10,
        }}
      >
        {/*
          Logo: absolutely centered on the FULL screen during zoom.
          Uses top/left 50% + Framer translate to sit at viewport center.
          On slide phase, translateX shifts left by LOGO_FINAL_X to land
          in the left slot of the centered row.
        */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            zIndex: 5,
          }}
          initial={{ scale: 0, opacity: 0, x: -(LOGO_SIZE / 2), y: -(LOGO_SIZE / 2) }}
          animate={
            phase === "zoom"
              ? {
                  scale: 1,
                  opacity: 1,
                  x: -(LOGO_SIZE / 2),
                  y: -(LOGO_SIZE / 2),
                }
              : {
                  scale: 1,
                  opacity: 1,
                  x: LOGO_FINAL_X - LOGO_SIZE / 2,
                  y: -(LOGO_SIZE / 2),
                }
          }
          transition={
            phase === "zoom"
              ? {
                  scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  x: { duration: 0 },
                  y: { duration: 0 },
                }
              : {
                  x: { duration: 0.75, ease: EASE_OUT_EXPO },
                  y: { duration: 0 },
                  scale: { duration: 0 },
                  opacity: { duration: 0 },
                }
          }
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6zav1x60RgyXnRH2w4WtcXl9sTz5R4.png"
            alt="Aryzen Arena Spartan helmet"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/*
          Text mask: centered in the branding area, left-offset to sit
          next to where the logo lands. overflow:hidden + width 0→full.
        */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            // Row is centered: left edge = 50% - ROW_WIDTH/2
            // Text starts at: left edge + LOGO_SIZE + GAP
            left: `calc(50% - ${ROW_WIDTH / 2}px + ${LOGO_SIZE + GAP}px)`,
            overflow: "hidden",
            transform: "translateY(-50%)",
          }}
          initial={{ width: 0 }}
          animate={{ width: phase === "zoom" ? 0 : TEXT_BLOCK_WIDTH }}
          transition={
            phase === "zoom"
              ? { duration: 0 }
              : { duration: 0.75, ease: EASE_OUT_EXPO }
          }
        >
          <div
            className="flex flex-col items-start justify-center"
            style={{ width: TEXT_BLOCK_WIDTH, gap: "3px" }}
          >
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
          </div>
        </motion.div>
      </div>

      {/* ── Taglines ── */}
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

      {/* ── Bottom reserved zone for Get Started button ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "20dvh", zIndex: 10 }}
      />
    </div>
  );
}

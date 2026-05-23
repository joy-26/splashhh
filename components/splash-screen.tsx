"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* ============================================================================
 * SPLASH SCREEN — Cinematic intro
 * ----------------------------------------------------------------------------
 * Sequence (HIGH performance tier):
 *   1. Anticipation (350ms) — dark scene, vignette + faint vertical beam build
 *   2. Slash         (250ms) — diagonal blade strike, audio whoosh
 *   3. Reveal        (550ms) — helmet scales in (spring) + bloom blooms outward
 *   4. Recoil        (140ms) — helmet micro-pulse to sell the impact
 *   5. Slide         (1050ms) — logo moves left, ARYZEN/ARENA text mask expands
 *   6. Taglines      (600ms) — fade up beneath logo
 *   7. Idle (∞)              — breathing helmet + slow bloom pulse + drifting dust
 *
 * PERFORMANCE TIERS (PERF_TIER):
 *   "high"   — all effects: bloom layers, grain, dust, vignette, breathing loop
 *   "medium" — bloom + vignette only (no grain, no dust, no breathing loop)
 *   "low"    — single bloom layer, no decoration, no idle loops, no recoil
 *
 * To later optimize for low-end devices, override PERF_TIER below or wire it
 * to a device-detection hook. Every effect respecting the tier is marked with
 * `// PERF:` so it can be tree-shaken or gated by Lovable/automated tools.
 * useReducedMotion() also automatically forces "low" tier for a11y.
 * ========================================================================= */

type PerfTier = "high" | "medium" | "low";

// PERF: Change this default, or replace with a runtime detector
// (e.g. navigator.hardwareConcurrency < 4 → "low") to optimize for low-end.
const PERF_TIER_DEFAULT: PerfTier = "high";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGO_SIZE = 120;
const TEXT_BLOCK_WIDTH = 220;
const GAP = 16;
const ROW_WIDTH = LOGO_SIZE + GAP + TEXT_BLOCK_WIDTH;

// Phase timings (ms) — single source of truth. PERF: scale these for "low" tier.
const T = {
  anticipation: 350,
  slash: 250,
  reveal: 550,
  recoil: 140,
  slide: 1050,
  tagline: 600,
} as const;

export default function SplashScreen() {
  const prefersReducedMotion = useReducedMotion();

  // PERF: reduced-motion users get the lowest tier automatically.
  const perfTier: PerfTier = prefersReducedMotion ? "low" : PERF_TIER_DEFAULT;

  type Phase = "anticipation" | "slash" | "reveal" | "slide" | "done";
  const [phase, setPhase] = useState<Phase>("anticipation");
  const [glowVisible, setGlowVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [slashVisible, setSlashVisible] = useState(false);
  const [helmetRecoil, setHelmetRecoil] = useState(false);
  const [helmetRevealed, setHelmetRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const LOGO_FINAL_X = -((TEXT_BLOCK_WIDTH + GAP) / 2);

  // Preload audio
  useEffect(() => {
    try {
      audioRef.current = new Audio("/sounds/slash.mp3");
      audioRef.current.volume = 0.5;
    } catch {
      /* silent */
    }
  }, []);

  const playSlashSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    const run = async () => {
      // 1 — ANTICIPATION: scene breathes in, vignette settles, beam glints
      await new Promise((r) => setTimeout(r, T.anticipation));

      // 2 — SLASH: blade strike causes the reveal
      setPhase("slash");
      setSlashVisible(true);
      playSlashSound();
      await new Promise((r) => setTimeout(r, T.slash));

      // 3 — REVEAL: helmet emerges from the slash, bloom blooms outward
      setPhase("reveal");
      setHelmetRevealed(true);
      setGlowVisible(true);
      await new Promise((r) => setTimeout(r, T.reveal));

      // 4 — RECOIL: helmet absorbs the impact
      // PERF: skip recoil on "low" tier
      if (perfTier !== "low") {
        setHelmetRecoil(true);
        await new Promise((r) => setTimeout(r, T.recoil));
        setHelmetRecoil(false);
      }

      // 4b — HOLD: let the assembled mark breathe before it moves
      await new Promise((r) => setTimeout(r, 250));

      // 5 — SLIDE: logo slides left, text mask expands
      setPhase("slide");
      await new Promise((r) => setTimeout(r, T.slide));

      // 5b — HOLD: let ARYZEN ARENA exist fully before taglines arrive
      await new Promise((r) => setTimeout(r, 200));

      // 6 — Taglines
      setPhase("done");
      setTaglineVisible(true);
    };

    run();
  }, [perfTier]);

  // PERF: dust particles only rendered on "high" tier
  const dustParticles = useMemo(() => {
    if (perfTier !== "high") return [];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${(i * 13 + 7) % 100}%`,
      delay: (i * 0.7) % 4,
      duration: 8 + (i % 3) * 2,
      size: 1 + (i % 2),
    }));
  }, [perfTier]);

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 40%, #1e293b 0%, #0F172A 65%)",
      }}
    >
      {/* ── Atmospheric Vignette (high + medium tier) ── */}
      {/* PERF: removed entirely on "low" tier */}
      {perfTier !== "low" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(ellipse 80% 60% at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}

      {/* ── Film Grain (high tier only) ── */}
      {/* PERF: SVG noise overlay — remove for "medium" and "low" */}
      {perfTier === "high" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 2,
            opacity: 0.06,
            mixBlendMode: "overlay",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1, 0 0 0 0 1, 0 0 0 0 1, 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* ── Drifting Dust Particles (high tier only) ── */}
      {/* PERF: 8 motion divs — disable entirely for low-end */}
      {dustParticles.length > 0 && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 3 }}>
          {dustParticles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: "absolute",
                left: p.left,
                bottom: "-10px",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(203, 213, 225, 0.4)",
                boxShadow: "0 0 4px rgba(203, 213, 225, 0.3)",
              }}
              animate={{
                y: [0, -window.innerHeight - 20],
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.85, 1],
              }}
            />
          ))}
        </div>
      )}

      {/* ── Anticipation Beam — faint vertical light glint before slash ── */}
      <AnimatePresence>
        {phase === "anticipation" && (
          <motion.div
            className="pointer-events-none absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "2px",
              height: "70vh",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(220,38,38,0.25) 50%, transparent 100%)",
              filter: "blur(2px)",
              zIndex: 3,
            }}
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          />
        )}
      </AnimatePresence>

      {/* ── Layered Bloom (gated by tier) ── */}
      <AnimatePresence>
        {glowVisible && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 4 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          >
            {/* PERF: outer halos only on high/medium */}
            {perfTier !== "low" && (
              <>
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
              </>
            )}
            {/* Core bloom — present on all tiers */}
            <motion.div
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
              // PERF: idle pulse only on high tier
              animate={
                perfTier === "high" && phase === "done"
                  ? { opacity: [1, 0.82, 1], scale: [1, 1.04, 1] }
                  : {}
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Branding area — occupies top 80% of screen (bottom 20% for button) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "20dvh",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/*
          Helmet logo. Hidden until the slash draws — the slash CAUSES the reveal.
          Living end-state: subtle breathing scale loop after phase === "done".
        */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            zIndex: 6,
            marginTop: -(LOGO_SIZE / 2),
            marginLeft: -(LOGO_SIZE / 2),
            // PERF: filter is GPU-cheap on modern devices but skip on "low"
            filter:
              perfTier !== "low"
                ? "drop-shadow(0 8px 24px rgba(220,38,38,0.25))"
                : undefined,
          }}
          initial={{ scale: 0.6, opacity: 0, x: 0, y: 0 }}
          animate={
            phase === "anticipation" || phase === "slash"
              ? { scale: 0.6, opacity: 0, x: 0, y: 0 }
              : phase === "reveal"
              ? {
                  scale: helmetRecoil ? 1.06 : 1,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }
              : phase === "slide"
              ? { scale: 1, opacity: 1, x: LOGO_FINAL_X, y: 0 }
              : // phase === "done" — living idle
                {
                  scale: perfTier === "high" ? [1, 1.018, 1] : 1,
                  opacity: 1,
                  x: LOGO_FINAL_X,
                  y: 0,
                }
          }
          transition={
            phase === "reveal"
              ? helmetRecoil
                ? {
                    scale: { type: "spring", stiffness: 320, damping: 16, duration: 0.14 },
                  }
                : {
                    scale: { type: "spring", stiffness: 160, damping: 13 },
                    opacity: { duration: 0.5, ease: EASE_OUT_EXPO },
                  }
              : phase === "slide"
              ? { x: { duration: T.slide / 1000, ease: EASE_OUT_EXPO } }
              : phase === "done"
              ? {
                  // PERF: breathing loop — disable on medium/low
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : { duration: 0 }
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

        {/* ── Diagonal Slash — the causal reveal stroke ── */}
        <AnimatePresence>
          {slashVisible && !helmetRevealed && (
            <motion.div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: LOGO_SIZE * 1.4,
                height: LOGO_SIZE * 1.4,
                transform: "translate(-50%, -50%)",
                zIndex: 7, // Above helmet during reveal moment
                pointerEvents: "none",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotate(-18deg)",
                  overflow: "visible",
                }}
              >
                <motion.line
                  x1="5"
                  y1="95"
                  x2="95"
                  y2="5"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.7, 0] }}
                  transition={{
                    pathLength: { duration: T.slash / 1000, ease: "easeOut" },
                    opacity: { times: [0, 0.25, 1], duration: 0.5 },
                  }}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(220, 38, 38, 0.7))",
                  }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text mask: width 0 → TEXT_BLOCK_WIDTH on slide phase */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: `calc(50% - ${ROW_WIDTH / 2}px + ${LOGO_SIZE + GAP}px)`,
            overflow: "hidden",
            transform: "translateY(-50%)",
            zIndex: 6,
          }}
          initial={{ width: 0 }}
          animate={{
            width:
              phase === "slide" || phase === "done" ? TEXT_BLOCK_WIDTH : 0,
          }}
          transition={
            phase === "slide" || phase === "done"
              ? { duration: T.slide / 1000, ease: EASE_OUT_EXPO }
              : { duration: 0 }
          }
        >
          <div
            className="flex flex-col items-start justify-center"
            style={{ width: TEXT_BLOCK_WIDTH, gap: "3px" }}
          >
            {/* Letter-by-letter clip reveal — each letter drops in top-to-bottom
                with a 30ms stagger. PERF: on "low" tier this renders as a single
                static span (see ternary below). */}
            <span
              style={{
                display: "inline-flex",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "clamp(2rem, 9vw, 3rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
              aria-label="ARYZEN"
            >
              {"ARYZEN".split("").map((letter, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    // Each letter is a clipping container
                  }}
                >
                  <motion.span
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(180deg, #FF4655 0%, #991B1B 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                    }}
                    // PERF: skip stagger animation on "low" tier
                    initial={perfTier !== "low" ? { y: "-100%", opacity: 0 } : false}
                    animate={
                      (phase === "slide" || phase === "done")
                        ? { y: "0%", opacity: 1 }
                        : perfTier !== "low"
                        ? { y: "-100%", opacity: 0 }
                        : {}
                    }
                    transition={{
                      y: {
                        duration: 0.38,
                        delay: i * 0.03,
                        ease: EASE_OUT_EXPO,
                      },
                      opacity: {
                        duration: 0.2,
                        delay: i * 0.03,
                      },
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent 0%, #CBD5E1 100%)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "clamp(0.6rem, 2.5vw, 0.85rem)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  letterSpacing: "0.62em",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  paddingRight: "0.62em",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
                }}
              >
                ARENA
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, #CBD5E1 0%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/*
        Taglines block — composed with strict horizontal symmetry.
        Position: centered between the wordmark and the bottom 20dvh button zone.
        Visual hierarchy: ornamented divider → primary tagline → credits with flag.
        Each element shares a center axis to feel deliberate, not stacked.
      */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{
          // Sits at ~70% screen height — pulled up from the button zone so it
          // breathes with the wordmark above and the button below.
          top: "62dvh",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {taglineVisible && (
            <motion.div
              className="flex flex-col items-center"
              style={{ gap: "0.875rem" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: T.tagline / 1000, ease: EASE_OUT_EXPO }}
            >
              {/*
                Ornamented divider — short rule with a small diamond accent
                centered. Two segments draw outward from the diamond to
                emphasize the center axis. Replaces the weak hairline.
              */}
              <motion.div
                className="flex items-center justify-center"
                style={{ gap: "8px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: EASE_OUT_EXPO,
                  }}
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent 0%, #FF4655 100%)",
                    transformOrigin: "right",
                  }}
                />
                <motion.span
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 45 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5,
                    ease: EASE_OUT_EXPO,
                  }}
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    background: "#FF4655",
                    boxShadow: "0 0 8px rgba(255,70,85,0.6)",
                  }}
                />
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: EASE_OUT_EXPO,
                  }}
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, #FF4655 0%, transparent 100%)",
                    transformOrigin: "left",
                  }}
                />
              </motion.div>

              {/*
                Primary tagline — palette unified with the helmet's bright
                crimson (#FB6470 reads as the same hue family as #FF4655).
                Tracking and weight calibrated for mobile legibility.
              */}
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "#FB6470",
                  fontSize: "clamp(0.72rem, 2.6vw, 0.88rem)",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textAlign: "center",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Real Tournaments. Real Money.
              </p>

              {/*
                Credits row — flag glyph at the start, properly readable
                tracking. Custom SVG flag (no emoji dependency, renders the
                same on every OS).
              */}
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "#94a3b8",
                  fontSize: "clamp(0.65rem, 2.1vw, 0.78rem)",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  textAlign: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                <IndiaFlag />
                <span>Made for India, by Indians</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom reserved zone — Get Started button slot */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "20dvh", zIndex: 10 }}
      />
    </div>
  );
}

/* ============================================================================
 * IndiaFlag — minimal 14×10 SVG. Three horizontal stripes (saffron / white /
 * green) with a small navy disc representing the Ashoka Chakra. The chakra's
 * 24 spokes are intentionally omitted at this size — they would render as
 * noise. Renders identically across all operating systems (no emoji
 * font fallback). Vertically aligned to the cap-height of the credits text.
 * ========================================================================= */
function IndiaFlag() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        borderRadius: "1px",
        boxShadow: "0 0 0 0.5px rgba(148,163,184,0.3)",
      }}
      aria-label="Made in India"
      role="img"
    >
      <rect x="0" y="0" width="14" height="3.33" fill="#FF9933" />
      <rect x="0" y="3.33" width="14" height="3.34" fill="#FFFFFF" />
      <rect x="0" y="6.67" width="14" height="3.33" fill="#138808" />
      <circle cx="7" cy="5" r="1.1" fill="none" stroke="#000080" strokeWidth="0.4" />
    </svg>
  );
}

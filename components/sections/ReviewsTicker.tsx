"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Review = { author: string; text: string };

/**
 * One review at a time, auto-advancing — framer-motion is already a site
 * dependency (Header/Reveal), and the app-wide
 * MotionConfig reducedMotion="user" in the root layout already makes the
 * crossfade a no-op for prefers-reduced-motion, so nothing extra needed
 * here for that.
 */
export function ReviewsTicker({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(id);
  }, [reviews.length]);

  const current = reviews[index];

  return (
    <div
      aria-live="polite"
      className="flex min-h-[3rem] items-start gap-2 text-sm"
    >
      <span aria-hidden="true" className="shrink-0 pt-0.5 text-accent">
        ★★★★★
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-muted"
        >
          “{current.text}” — {current.author}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

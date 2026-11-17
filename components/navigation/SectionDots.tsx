"use client";

import { useEffect, useState } from "react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * Homepage-only scroll-spy nav (astenavocats.com format). Real <a href>
 * anchors so it works with JS disabled; IntersectionObserver only upgrades
 * it with an active-dot indicator. `scroll-behavior: smooth` is already
 * global (app/globals.css), so no scroll-jacking JS needed here.
 */
export function SectionDots({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Section"
      className="fixed end-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          aria-current={activeId === id ? "true" : undefined}
          className={`h-2.5 w-2.5 rounded-full border border-accent transition-colors ${focusRing} ${
            activeId === id ? "bg-accent" : "bg-transparent hover:bg-accent/40"
          }`}
        />
      ))}
    </nav>
  );
}

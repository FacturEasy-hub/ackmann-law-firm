"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { navItems } from "@/lib/nav-items";
import { siteConfig } from "@/lib/config";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-[0_8px_24px_-20px_rgba(21,46,37,0.5)]">
      <Container className="flex h-20 items-center justify-between lg:h-24">
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            aria-label={siteConfig.firmName}
            className={`flex items-center gap-3 ${focusRing}`}
          >
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-sm lg:h-12 lg:w-12">
              <Image
                src="/brand/ackmann-monogram.webp"
                alt=""
                width={512}
                height={512}
                priority
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="font-[family-name:var(--font-display)] text-lg leading-tight text-foreground">
                Ackmann
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">
                Law Firm
              </span>
            </span>
          </Link>
        </motion.span>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative pb-2 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:origin-center after:bg-accent after:transition-transform after:duration-300 ${focusRing} ${
                  isActive
                    ? "text-foreground after:scale-x-100"
                    : "text-foreground/80 after:scale-x-0 hover:text-foreground hover:after:scale-x-100"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <LanguageSwitcher />
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={t("openMenu")}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(true)}
          className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden ${focusRing}`}
        >
          <span aria-hidden="true" className="h-px w-5 bg-foreground" />
          <span aria-hidden="true" className="h-px w-5 bg-foreground" />
        </button>
      </Container>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}

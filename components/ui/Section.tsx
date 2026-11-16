import type { ComponentPropsWithoutRef } from "react";

/**
 * Vertical rhythm wrapper. Cut twice from the original 64-160px scale
 * (SPEC.md Section 11): first to py-10/14/20, still too much scroll before
 * any substance appeared, then to this. Pass `className` to override for
 * sections that need tighter or looser hierarchy — spacing is a starting
 * point, not a rule.
 */
export function Section({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section className={`py-6 md:py-8 lg:py-12 ${className}`} {...props} />
  );
}

import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

type NativeButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

type ButtonProps = LinkButtonProps | NativeButtonProps;

const base =
  "inline-flex items-center justify-center rounded-sm border px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

// Primary filled navy, secondary outline. No pills, no shadows.
const variants: Record<Variant, string> = {
  primary:
    "border-foreground bg-foreground text-background hover:bg-foreground/90",
  secondary: "border-foreground text-foreground hover:bg-foreground/5",
};

export function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as Omit<LinkButtonProps, "variant" | "className" | "href">)}
      />
    );
  }

  return (
    <button
      className={classes}
      {...(props as Omit<NativeButtonProps, "variant" | "className" | "href">)}
    />
  );
}

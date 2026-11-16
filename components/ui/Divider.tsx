export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-t border-border/60 ${className}`} />;
}

type RoutePlaceholderProps = {
  className?: string;
  title?: string;
};

export function RoutePlaceholder({
  className = "",
  title = "Ondara–Bernia",
}: RoutePlaceholderProps) {
  return (
    <div
      aria-label={`Editorial route artwork for ${title}; photography to be confirmed`}
      className={`route-placeholder ${className}`}
      role="img"
    >
      <span className="route-placeholder__sun" />
      <span className="route-placeholder__ridge route-placeholder__ridge--back" />
      <span className="route-placeholder__ridge route-placeholder__ridge--front" />
      <span className="route-placeholder__label">Photography to be confirmed</span>
      <strong>{title}</strong>
      <small>Marina Alta · 77 km</small>
    </div>
  );
}

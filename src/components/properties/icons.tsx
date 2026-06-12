// Custom media icons shared between PropertyCard (grid) and PropertyGallery (detail)

// Floor plan: outer walls + inner partition + door arc
export function FloorPlanIcon({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="1" />
      <line x1="13" y1="2" x2="13" y2="13" />
      <line x1="2" y1="13" x2="13" y2="13" />
      <path d="M13 13 A7 7 0 0 0 6 6" />
    </svg>
  );
}

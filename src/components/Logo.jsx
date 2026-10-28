// Generic demo mark: a cup with rising steam inside a ring. Uses currentColor.
export default function Logo({ size = 36, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 22h18v4.5a9 9 0 0 1-18 0V22z" fill="currentColor" />
      <path d="M31 24h2.2a3.3 3.3 0 0 1 0 6.6H30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 37.5h22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 18.5c-1.6-1.8 1.6-3.2 0-5.2M22.5 18.5c-1.6-1.8 1.6-3.2 0-5.2M27 18.5c-1.6-1.8 1.6-3.2 0-5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

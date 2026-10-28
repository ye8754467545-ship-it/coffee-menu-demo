// Small hand-drawn style ornaments. All are decorative and hidden from assistive tech.

export function Bean({ size = 18, rotate = 0, style, className = '' }) {
  return (
    <svg className={`decor bean ${className}`} width={size} height={size * 1.35} viewBox="0 0 20 27"
      style={{ ...style, '--rot': `${rotate}deg` }} aria-hidden="true">
      <defs>
        <radialGradient id="beanShade" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#7a4a2c" />
          <stop offset="0.6" stopColor="#4a2a17" />
          <stop offset="1" stopColor="#2a160b" />
        </radialGradient>
      </defs>
      <ellipse cx="10" cy="13.5" rx="9" ry="12.5" fill="url(#beanShade)" />
      <path d="M10 2.5c-3 4-3 7.5 0 11s3 7 0 11" fill="none" stroke="#1b0d05" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Fine scatter of cocoa / coffee dust.
export function Dust({ className = '', seed = 1, count = 22, color = 'var(--cocoa)' }) {
  const dots = [];
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < count; i++) {
    dots.push(<circle key={i} cx={rnd() * 100} cy={rnd() * 100} r={0.4 + rnd() * 1.3} opacity={0.35 + rnd() * 0.55} />);
  }
  return (
    <svg className={`decor dust ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" fill={color} aria-hidden="true">
      {dots}
    </svg>
  );
}

// Dry-brush stroke, like the painted swooshes in print menus.
export function Brush({ className = '', color = 'var(--caramel)' }) {
  return (
    <svg className={`decor brush ${className}`} viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <g fill={color}>
        <path d="M6 92C70 60 150 36 236 24c58-8 112-9 156-6-46 6-96 14-150 28C164 66 92 90 30 112c-14 5-34-8-24-20z" opacity=".9" />
        <path d="M40 98c70-30 150-52 230-64 40-6 80-8 116-8-50 8-110 18-170 36-54 16-104 36-150 52z" opacity=".55" />
        <path d="M90 104c60-22 130-40 200-50-60 14-124 32-186 56z" opacity=".4" />
      </g>
    </svg>
  );
}

// Organic vertical edge for the dark panel (drawn for the panel's inline-start side).
export function PanelEdge({ className = '' }) {
  return (
    <svg className={`panel-edge ${className}`} viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M60 0H34C14 60 4 120 18 190s38 120 26 200-36 130-30 210 30 140 22 220-30 120-26 180H60z" />
    </svg>
  );
}

// Horizontal wave used where a coloured section meets the paper.
export function WaveTop({ className = '' }) {
  return (
    <svg className={`wave-top ${className}`} viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 60V34c120-22 260-30 400-14s260 30 400 14 300-34 400-20v46z" />
    </svg>
  );
}

// Condensation droplets for cold drinks.
export function Drops({ className = '' }) {
  const drops = [[12, 20, 3], [30, 64, 2.2], [70, 30, 2.6], [84, 72, 1.8], [52, 86, 2.4], [22, 44, 1.5], [62, 52, 1.4]];
  return (
    <svg className={`decor drops ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="drop" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".45" stopColor="#e9f3f8" stopOpacity=".55" />
          <stop offset="1" stopColor="#9fc0d3" stopOpacity=".35" />
        </radialGradient>
      </defs>
      {drops.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.25} fill="url(#drop)" />)}
    </svg>
  );
}

// Translucent ice cube.
export function Ice({ size = 46, rotate = 0, style, className = '' }) {
  return (
    <svg className={`decor ice ${className}`} width={size} height={size} viewBox="0 0 50 50"
      style={{ ...style, '--rot': `${rotate}deg` }} aria-hidden="true">
      <defs>
        <linearGradient id="iceFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".5" stopColor="#d8e9f2" stopOpacity=".55" />
          <stop offset="1" stopColor="#a9c8d9" stopOpacity=".6" />
        </linearGradient>
      </defs>
      <path d="M8 14 26 6l18 9-2 22-17 8-17-9z" fill="url(#iceFace)" stroke="#fff" strokeOpacity=".8" strokeWidth="1" />
      <path d="M8 14l17 9 19-8M25 23l0 22" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1" />
      <path d="M13 16l8 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

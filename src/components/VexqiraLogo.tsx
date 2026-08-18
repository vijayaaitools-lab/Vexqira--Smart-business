import React from 'react';

interface VexqiraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'mark' | 'horizontal' | 'emblem';
  showSubtitle?: boolean;
}

export const VexqiraLogo: React.FC<VexqiraLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  showSubtitle = false
}) => {
  const sizeMap = {
    sm: { icon: 36, text: 'text-xl', sub: 'text-[10px]' },
    md: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    lg: { icon: 68, text: 'text-3xl', sub: 'text-sm' },
    xl: { icon: 100, text: 'text-4xl', sub: 'text-base' },
    '2xl': { icon: 150, text: 'text-5xl', sub: 'text-lg' }
  };

  const currentSize = sizeMap[size];

  // Full Circular Emblem Artwork matching the exact uploaded image
  if (variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          width={currentSize.icon * 3.6}
          height={currentSize.icon * 3.6}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-full drop-shadow-2xl select-none"
        >
          <defs>
            {/* Outer Glowing Neon Ring Gradient */}
            <linearGradient id="ringGrad" x1="50" y1="50" x2="450" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="70%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>

            {/* V Stem Gradient (Cyan -> Royal Blue -> Indigo -> Purple) */}
            <linearGradient id="vGrad" x1="120" y1="180" x2="350" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="30%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>

            {/* Upward Arrow Head Gradient */}
            <linearGradient id="arrowGrad" x1="280" y1="120" x2="360" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="60%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#E879F9" />
            </linearGradient>

            {/* Gear and Brain Nodes Gradient */}
            <linearGradient id="gearPurpleGrad" x1="260" y1="120" x2="380" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>

            {/* VEXQIRA Text Gradient (Cyan -> Blue -> Purple -> Magenta -> Pink) */}
            <linearGradient id="vexqiraTextGrad" x1="50" y1="300" x2="450" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="22%" stopColor="#0EA5E9" />
              <stop offset="48%" stopColor="#4F46E5" />
              <stop offset="75%" stopColor="#9333EA" />
              <stop offset="90%" stopColor="#C026D3" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            {/* Glowing Neon Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00D2FF" floodOpacity="0.5" />
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#C026D3" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Deep Black Inner Circle Canvas */}
          <circle cx="250" cy="250" r="236" fill="#000000" />

          {/* Outer Glowing Neon Ring */}
          <circle cx="250" cy="250" r="234" stroke="url(#ringGrad)" strokeWidth="7" filter="url(#neonGlow)" />

          {/* 1. LEFT MONITOR WITH CODE </ > */}
          <g transform="translate(85, 175)">
            <rect x="0" y="0" width="76" height="54" rx="8" fill="#060D17" stroke="#00D2FF" strokeWidth="4" />
            {/* Inner screen */}
            <rect x="6" y="6" width="64" height="42" rx="4" fill="#040810" />
            {/* Code Brackets */}
            <path d="M 22 27 L 31 19 M 22 29 L 31 37" stroke="#00D2FF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 54 27 L 45 19 M 54 29 L 45 37" stroke="#00D2FF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 36 38 L 40 16" stroke="#00D2FF" strokeWidth="3.5" strokeLinecap="round" />
            {/* Monitor Stand */}
            <path d="M 38 54 L 38 64 M 25 64 L 51 64" stroke="#00D2FF" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 2. RIGHT GEAR WITH BRAIN CIRCUIT */}
          <g transform="translate(280, 130)">
            {/* Gear Outer Teeth */}
            <circle cx="55" cy="55" r="42" fill="none" stroke="url(#gearPurpleGrad)" strokeWidth="12" strokeDasharray="18 9" />
            <circle cx="55" cy="55" r="30" fill="#0D061A" stroke="#A855F7" strokeWidth="2.5" />
            
            {/* Brain circuit inside gear */}
            <g transform="translate(32, 32)">
              {/* Brain hemisphere lines */}
              <path d="M 12 24 C 6 20, 6 12, 14 8 C 18 4, 28 6, 28 14 C 28 20, 24 24, 20 28" stroke="#00D2FF" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 34 24 C 40 20, 40 12, 32 8 C 28 4, 18 6, 18 14 C 18 20, 22 24, 26 28" stroke="#E879F9" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Circuit Nodes */}
              <circle cx="10" cy="18" r="3" fill="#00D2FF" />
              <circle cx="16" cy="10" r="3" fill="#00D2FF" />
              <circle cx="36" cy="18" r="3" fill="#E879F9" />
              <circle cx="30" cy="10" r="3" fill="#E879F9" />
              <circle cx="23" cy="24" r="3.5" fill="#38BDF8" />
              <path d="M 10 18 L 16 18 M 16 10 L 23 15 M 36 18 L 30 18 M 30 10 L 23 15" stroke="#818CF8" strokeWidth="1.5" />
            </g>
          </g>

          {/* 3. CHATBOT ROBOT HEAD ON FAR RIGHT */}
          <g transform="translate(382, 178)">
            {/* Robot head bubble */}
            <rect x="0" y="0" width="50" height="40" rx="12" fill="#140A26" stroke="#9333EA" strokeWidth="3" />
            {/* Glowing cyan eyes */}
            <circle cx="16" cy="20" r="4.5" fill="#00D2FF" />
            <circle cx="34" cy="20" r="4.5" fill="#00D2FF" />
            {/* Antenna */}
            <path d="M 25 0 L 25 -8" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
            <circle cx="25" cy="-9" r="3.5" fill="#00D2FF" />
            {/* Ears */}
            <rect x="-4" y="14" width="4" height="12" rx="2" fill="#9333EA" />
            <rect x="50" y="14" width="4" height="12" rx="2" fill="#9333EA" />
            {/* Bubble tail */}
            <path d="M 8 40 L 16 40 L 8 48 Z" fill="#9333EA" />
          </g>

          {/* 4. MAIN CENTRAL STYLIZED V SWOOSH CURVING INTO UPWARD ARROW */}
          <g filter="url(#neonGlow)">
            {/* Left Top V Swoosh Tail */}
            <path
              d="M 115 80 C 128 175, 172 260, 218 260 C 242 260, 290 170, 360 62"
              stroke="url(#vGrad)"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Upward Arrow Head on Top Right */}
            <path
              d="M 312 52 L 372 56 L 364 116"
              stroke="url(#arrowGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left Checkmark Swoosh overlap */}
            <path
              d="M 190 220 C 178 250, 202 265, 222 250"
              stroke="#00D2FF"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* 3D Core Highlight Curve */}
            <path
              d="M 128 98 C 140 178, 178 238, 212 238 C 234 238, 274 162, 332 80"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* 5. VEXQIRA LOGOTYPE TEXT */}
          <text
            x="250"
            y="326"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontWeight="900"
            fontSize="58"
            letterSpacing="10"
            fill="url(#vexqiraTextGrad)"
          >
            VEXQIRA
          </text>

          {/* 6. SUBTITLE: THE SMART BUSINESS BUILDING */}
          <line x1="68" y1="346" x2="110" y2="346" stroke="#38BDF8" strokeWidth="2" />
          <text
            x="250"
            y="352"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontWeight="800"
            fontSize="15"
            letterSpacing="6"
            fill="#FFFFFF"
          >
            THE SMART BUSINESS BUILDING
          </text>
          <line x1="390" y1="346" x2="432" y2="346" stroke="#D946EF" strokeWidth="2" />

          {/* 7. THREE PILLARS (AUTOMATION | WEB DEVELOPMENT | AI ASSISTANT) */}
          <g transform="translate(0, 375)">
            {/* Pillar 1: AUTOMATION (Two Gears) */}
            <g transform="translate(108, 0)">
              <circle cx="12" cy="8" r="8" stroke="#00D2FF" strokeWidth="2.5" strokeDasharray="5 3" fill="none" />
              <circle cx="24" cy="18" r="6" stroke="#00D2FF" strokeWidth="2" strokeDasharray="4 2" fill="none" />
              <text x="18" y="38" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#FFFFFF" letterSpacing="1.5">
                AUTOMATION
              </text>
            </g>

            {/* Divider 1 */}
            <line x1="195" y1="4" x2="195" y2="40" stroke="#334155" strokeWidth="2" />

            {/* Pillar 2: WEB DEVELOPMENT (Globe) */}
            <g transform="translate(250, 0)">
              <circle cx="0" cy="12" r="10" stroke="#00D2FF" strokeWidth="2.5" fill="none" />
              <line x1="-10" y1="12" x2="10" y2="12" stroke="#00D2FF" strokeWidth="1.5" />
              <ellipse cx="0" cy="12" rx="5" ry="10" stroke="#00D2FF" strokeWidth="1.5" fill="none" />
              <text x="0" y="38" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#FFFFFF" letterSpacing="1.5">
                WEB DEVELOPMENT
              </text>
            </g>

            {/* Divider 2 */}
            <line x1="310" y1="4" x2="310" y2="40" stroke="#334155" strokeWidth="2" />

            {/* Pillar 3: AI ASSISTANT (Brain Circuit) */}
            <g transform="translate(370, 0)">
              <circle cx="0" cy="12" r="9" stroke="#C026D3" strokeWidth="2.5" fill="none" />
              <circle cx="-3" cy="9" r="1.5" fill="#00D2FF" />
              <circle cx="3" cy="9" r="1.5" fill="#00D2FF" />
              <circle cx="-3" cy="15" r="1.5" fill="#00D2FF" />
              <circle cx="3" cy="15" r="1.5" fill="#00D2FF" />
              <path d="M -3 9 L 3 9 M 0 6 L 0 18 M -3 15 L 3 15" stroke="#C026D3" strokeWidth="1.5" />
              <text x="0" y="38" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#FFFFFF" letterSpacing="1.5">
                AI ASSISTANT
              </text>
            </g>
          </g>

          {/* 8. BOTTOM SLOGAN: EMPOWERING BUSINESSES. ELEVATING GROWTH. */}
          <text
            x="250"
            y="445"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontWeight="800"
            fontSize="12.5"
            letterSpacing="3.5"
            fill="#00D2FF"
          >
            EMPOWERING BUSINESSES. ELEVATING GROWTH.
          </text>
        </svg>
      </div>
    );
  }

  // Standalone Vector Mark Icon
  const MarkIcon = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md"
    >
      <defs>
        <linearGradient id="markVGradFull" x1="15" y1="105" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="35%" stopColor="#0284C7" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="markRingGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
      </defs>

      {/* Dark background capsule */}
      <rect width="120" height="120" rx="30" fill="#000000" />
      <rect width="116" height="116" x="2" y="2" rx="28" stroke="url(#markRingGrad)" strokeWidth="2.5" opacity="0.9" />

      {/* V Arrow Swoosh */}
      <path
        d="M 28 34 C 32 66, 46 94, 56 94 C 64 94, 78 66, 96 20"
        stroke="url(#markVGradFull)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 82 16 L 102 18 L 98 38"
        stroke="url(#markVGradFull)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 3D Highlight */}
      <path
        d="M 32 38 C 36 66, 46 84, 55 84 C 62 84, 72 64, 84 30"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{MarkIcon}</div>;
  }

  // Horizontal Brand Lockup with vivid Cyan-to-Magenta text (Never white, high-contrast)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {MarkIcon}
      <div className="flex flex-col">
        <div className="flex items-center">
          <span
            className={`font-black tracking-widest ${currentSize.text} font-sans uppercase bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent`}
            style={{
              backgroundImage: 'linear-gradient(90deg, #00D2FF 0%, #0EA5E9 25%, #4F46E5 50%, #8B5CF6 75%, #D946EF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            VEXQIRA
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-bold tracking-wider uppercase ${currentSize.sub} text-slate-600 -mt-0.5`}>
            The Smart Business Building
          </span>
        )}
      </div>
    </div>
  );
};

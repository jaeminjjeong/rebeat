import React from 'react';

export const AnimatedSeoulSkyline = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] max-w-[1600px] sm:w-[150%] md:w-full"
      preserveAspectRatio="xMidYMax meet"
      viewBox="0 0 1440 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="skyGradient" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
          <stop offset="0%" stopColor="#3730a3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      <rect width="1440" height="360" fill="url(#skyGradient)" />

      {/* Stars */}
      <circle className="star" cx="150" cy="80" r="1.5" fill="white" style={{ animationDelay: '0s' }} />
      <circle className="star" cx="300" cy="120" r="1" fill="white" style={{ animationDelay: '0.8s' }} />
      <circle className="star" cx="450" cy="60" r="1.2" fill="white" style={{ animationDelay: '1.5s' }} />
      <circle className="star" cx="600" cy="150" r="1" fill="white" style={{ animationDelay: '0.3s' }} />
      <circle className="star" cx="850" cy="90" r="1.8" fill="white" style={{ animationDelay: '1.1s' }} />
      <circle className="star" cx="1000" cy="130" r="1" fill="white" style={{ animationDelay: '0.6s' }} />
      <circle className="star" cx="1150" cy="70" r="1.3" fill="white" style={{ animationDelay: '1.8s' }} />
      <circle className="star" cx="1300" cy="160" r="1.1" fill="white" style={{ animationDelay: '0.2s' }} />
      
      {/* Shooting Star */}
      <path
        className="shooting-star"
        d="M1000 50 l-250 125"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        style={{ animationDelay: '3s' }}
      />
      
      {/* Skyline */}
      <path
        fill="url(#skylineGradient)"
        d="M0 360 L0 280 C50 270, 120 290, 200 280 C280 270, 350 240, 450 250 C550 260, 600 300, 700 290 C800 280, 880 260, 950 270 C1020 280, 1100 310, 1200 300 C1300 290, 1380 280, 1440 290 L1440 360 Z"
      />
      
      {/* Namsan Tower (Simplified) */}
      <g transform="translate(720 290)">
        <path d="M-5 -130 L5 -130 L5 0 L-5 0 Z" fill="#334155" />
        <path d="M-15 -145 L15 -145 L10 -130 L-10 -130 Z" fill="#334155" />
        <circle className="tower-light" cx="0" cy="-148" r="4" fill="#a5b4fc" />
      </g>
    </svg>
  </div>
);

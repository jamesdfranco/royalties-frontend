"use client";

interface PlaceholderCrownLogoProps {
  size?: number;
}

export default function PlaceholderCrownLogo({ size = 40 }: PlaceholderCrownLogoProps) {
  return (
    <div
      className="bg-black flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        style={{ width: size * 0.6, height: size * 0.6 }}
      >
        {/* Crown shape - geometric and sharp */}
        <path d="M3 18 L3 10 L7 14 L12 6 L17 14 L21 10 L21 18 Z" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </div>
  );
}


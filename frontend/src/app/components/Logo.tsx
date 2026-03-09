import React from "react";

interface LogoProps {
  className?: string;
}

export function DhsudLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DHSUD logo"
      role="img"
    >
      <circle cx="60" cy="60" r="58" fill="#0b3d91" stroke="#0b3d91" strokeWidth="4" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontSize="36"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        DHS
      </text>
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        HREDR
      </text>
    </svg>
  );
}

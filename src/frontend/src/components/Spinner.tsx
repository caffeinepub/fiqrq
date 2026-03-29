import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}

export default function Spinner({
  size = "md",
  centered = false,
}: SpinnerProps) {
  const sizeMap = { sm: 24, md: 36, lg: 48 };
  const px = sizeMap[size];

  const spinner = (
    <div
      style={{
        width: px,
        height: px,
        border: "3px solid rgba(212,175,55,0.15)",
        borderTopColor: "#d4af37",
        borderRadius: "50%",
        animation: "spin-gold 0.8s linear infinite",
      }}
    />
  );

  if (centered) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        {spinner}
      </div>
    );
  }
  return spinner;
}

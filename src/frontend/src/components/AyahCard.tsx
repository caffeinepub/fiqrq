import React, { useRef, useEffect } from "react";
import type { Ayah } from "../utils/api";

interface AyahCardProps {
  ayah: Ayah;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onPlay: () => void;
  onCopy: () => void;
  onShare: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

export default function AyahCard({
  ayah,
  isPlaying,
  isLoadingAudio,
  onPlay,
  onCopy,
  onShare,
  onFavorite,
  isFavorite,
}: AyahCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isPlaying]);

  return (
    <div
      ref={cardRef}
      className={isPlaying ? "ayah-playing" : ""}
      style={{
        backgroundColor: "#1a1508",
        border: isPlaying
          ? "1px solid rgba(212,175,55,0.5)"
          : "1px solid rgba(212,175,55,0.15)",
        borderLeft: isPlaying
          ? "3px solid #d4af37"
          : "1px solid rgba(212,175,55,0.15)",
        borderRadius: 16,
        padding: "1.25rem",
        marginBottom: "0.75rem",
        boxShadow: isPlaying
          ? "0 0 20px rgba(212,175,55,0.12)"
          : "0 2px 12px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#d4af37",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {ayah.numberInSurah}
        </div>
      </div>

      <p
        lang="ar"
        dir="rtl"
        style={{
          fontFamily: "Amiri, serif",
          fontSize: "1.5rem",
          lineHeight: 2.2,
          color: "#f5f0e8",
          textAlign: "right",
          margin: "0 0 0.75rem",
        }}
      >
        {ayah.text}
      </p>

      {ayah.translation && (
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            color: "rgba(245,240,232,0.65)",
            margin: "0 0 1rem",
            fontStyle: "italic",
          }}
        >
          {ayah.translation}
        </p>
      )}

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
          margin: "0.75rem 0",
        }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onPlay}
          className="action-btn play-btn"
          style={{
            backgroundColor: isPlaying
              ? "rgba(212,175,55,0.2)"
              : "rgba(212,175,55,0.08)",
            borderColor: "rgba(212,175,55,0.5)",
            color: "#d4af37",
            minWidth: 72,
          }}
        >
          {isLoadingAudio ? (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                border: "2px solid #d4af37",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin-gold 0.6s linear infinite",
              }}
            />
          ) : isPlaying ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#d4af37"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#d4af37"
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button type="button" onClick={onCopy} className="action-btn">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </button>

        <button type="button" onClick={onShare} className="action-btn">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>

        <button
          type="button"
          onClick={onFavorite}
          className={isFavorite ? "action-btn active" : "action-btn"}
          style={
            isFavorite
              ? {
                  borderColor: "#d4af37",
                  color: "#d4af37",
                  background: "rgba(212,175,55,0.1)",
                }
              : {}
          }
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#d4af37" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { type DailyAyah, getDailyAyah } from "../utils/api";
import Spinner from "./Spinner";

export default function DailyCard() {
  const [ayah, setAyah] = useState<DailyAyah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDailyAyah = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getDailyAyah();
      setAyah(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyAyah();
  }, [fetchDailyAyah]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1508 0%, #241c09 100%)",
        border: "1px solid rgba(212,175,55,0.35)",
        borderRadius: 20,
        padding: "1.5rem",
        boxShadow: "0 4px 32px rgba(212,175,55,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background:
            "radial-gradient(circle at top right, rgba(212,175,55,0.06), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: 3,
            height: 18,
            backgroundColor: "#d4af37",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.75rem",
            color: "#d4af37",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Ayah of the Day
        </span>
      </div>

      {loading && <Spinner centered />}

      {error && (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <p
            style={{
              color: "rgba(245,240,232,0.5)",
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
            }}
          >
            Failed to load
          </p>
          <button
            type="button"
            onClick={fetchDailyAyah}
            style={{
              color: "#d4af37",
              background: "none",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "Poppins",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {ayah && !loading && (
        <>
          <p
            lang="ar"
            dir="rtl"
            style={{
              fontFamily: "Amiri, serif",
              fontSize: "1.5rem",
              lineHeight: 2.2,
              color: "#f5f0e8",
              textAlign: "right",
              margin: "0 0 1rem",
            }}
          >
            {ayah.arabic}
          </p>
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
              marginBottom: "0.75rem",
            }}
          />
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: "rgba(245,240,232,0.7)",
              fontStyle: "italic",
              margin: "0 0 0.75rem",
            }}
          >
            {ayah.translation}
          </p>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.75rem",
              color: "#d4af37",
              opacity: 0.8,
            }}
          >
            {ayah.surahEnglishName} · {ayah.surahName} · Ayah {ayah.ayahNumber}
          </p>
        </>
      )}
    </div>
  );
}

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Spinner from "../components/Spinner";
import {
  type Ayah,
  type SurahInfo,
  getSurahArabic,
  getSurahList,
} from "../utils/api";
import { getLastPage, setLastPage } from "../utils/storage";

const AYAHS_PER_PAGE = 12;
const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export default function QuranReader() {
  const [surahList, setSurahList] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [error, setError] = useState("");
  const touchStartX = useRef(0);
  const navigate = useNavigate();

  const totalPages = Math.ceil(ayahs.length / AYAHS_PER_PAGE);
  const pageAyahs = ayahs.slice(
    currentPage * AYAHS_PER_PAGE,
    (currentPage + 1) * AYAHS_PER_PAGE,
  );

  useEffect(() => {
    getSurahList()
      .then((list) => {
        setSurahList(list);
        const last = getLastPage();
        if (last) {
          setSelectedSurah(last.surah);
          setCurrentPage(last.page);
        }
      })
      .catch(() => setError("Failed to load surah list"))
      .finally(() => setLoadingSurahs(false));
  }, []);

  useEffect(() => {
    if (loadingSurahs) return;
    setLoadingAyahs(true);
    setError("");
    getSurahArabic(selectedSurah)
      .then((data) => {
        setAyahs(data);
        setCurrentPage(0);
      })
      .catch(() => setError("Failed to load surah. Check your connection."))
      .finally(() => setLoadingAyahs(false));
  }, [selectedSurah, loadingSurahs]);

  useEffect(() => {
    if (ayahs.length > 0) {
      setLastPage(selectedSurah, currentPage);
    }
  }, [selectedSurah, currentPage, ayahs.length]);

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentSurahInfo = surahList.find((s) => s.number === selectedSurah);
  const showBismillah = selectedSurah !== 9 && currentPage === 0;

  return (
    <div className="page-container">
      <div
        style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#0d0b06",
          borderBottom: "1px solid rgba(212,175,55,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "#d4af37",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#f5f0e8",
                margin: 0,
              }}
            >
              Al-Qur’an
            </h2>
            {currentSurahInfo && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(245,240,232,0.5)",
                  margin: 0,
                }}
              >
                {currentSurahInfo.englishName} ·{" "}
                {currentSurahInfo.numberOfAyahs} ayahs
              </p>
            )}
          </div>
          {currentSurahInfo && (
            <p
              lang="ar"
              dir="rtl"
              style={{
                fontFamily: "Amiri, serif",
                fontSize: "1.1rem",
                color: "#d4af37",
                margin: 0,
              }}
            >
              {currentSurahInfo.name}
            </p>
          )}
        </div>
        {!loadingSurahs && (
          <select
            className="fiqrq-select"
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(Number(e.target.value))}
          >
            {surahList.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.englishName} — {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div
        style={{ padding: "1rem 1.25rem", minHeight: 400 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(loadingSurahs || loadingAyahs) && <Spinner centered />}
        {error && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "rgba(245,240,232,0.5)", marginBottom: 12 }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => setSelectedSurah(selectedSurah)}
              style={{
                color: "#d4af37",
                background: "none",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "Poppins",
              }}
            >
              Retry
            </button>
          </div>
        )}
        {!loadingAyahs && !error && pageAyahs.length > 0 && (
          <div>
            {showBismillah && (
              <p
                lang="ar"
                dir="rtl"
                style={{
                  fontFamily: "Amiri, serif",
                  fontSize: "1.4rem",
                  color: "#d4af37",
                  textAlign: "center",
                  lineHeight: 2,
                  marginBottom: "1.5rem",
                }}
              >
                {BISMILLAH}
              </p>
            )}
            {pageAyahs.map((ayah) => (
              <div key={ayah.number} style={{ marginBottom: "1rem" }}>
                <p
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: "Amiri, serif",
                    fontSize: "1.6rem",
                    lineHeight: 2.4,
                    color: "#f5f0e8",
                    textAlign: "right",
                    margin: 0,
                  }}
                >
                  {ayah.text}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      margin: "0 6px",
                      borderRadius: "50%",
                      border: "1px solid rgba(212,175,55,0.4)",
                      fontSize: "0.7rem",
                      color: "#d4af37",
                      fontFamily: "Poppins",
                      verticalAlign: "middle",
                    }}
                  >
                    {ayah.numberInSurah}
                  </span>
                </p>
              </div>
            ))}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
                margin: "1.5rem 0",
              }}
            />
          </div>
        )}
      </div>

      {!loadingAyahs && totalPages > 1 && (
        <div
          style={{
            position: "sticky",
            bottom: 68,
            backgroundColor: "#0d0b06",
            borderTop: "1px solid rgba(212,175,55,0.1)",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={currentPage === 0}
            style={{
              backgroundColor:
                currentPage === 0
                  ? "rgba(212,175,55,0.05)"
                  : "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 10,
              color: currentPage === 0 ? "rgba(212,175,55,0.3)" : "#d4af37",
              padding: "8px 20px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.85rem",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(245,240,232,0.5)",
            }}
          >
            {currentPage + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={currentPage === totalPages - 1}
            style={{
              backgroundColor:
                currentPage === totalPages - 1
                  ? "rgba(212,175,55,0.05)"
                  : "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 10,
              color:
                currentPage === totalPages - 1
                  ? "rgba(212,175,55,0.3)"
                  : "#d4af37",
              padding: "8px 20px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.85rem",
              cursor:
                currentPage === totalPages - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Next
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

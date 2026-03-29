import React, { useState, useEffect, useRef, useCallback } from "react";
import AyahCard from "../components/AyahCard";
import BottomNav from "../components/BottomNav";
import Spinner from "../components/Spinner";
import { useAudio } from "../hooks/useAudio";
import {
  type Ayah,
  type SurahInfo,
  getAudioUrl,
  getSurahFull,
  getSurahList,
} from "../utils/api";
import {
  type FavoriteAyah,
  addFavorite,
  getFavorites,
  getLastAyah,
  isFavorite,
  removeFavorite,
  setLastAyah,
} from "../utils/storage";

export default function Study() {
  const [surahList, setSurahList] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<number | null>(null);

  const { playingUrl, isLoading: audioLoading, toggle } = useAudio();
  const currentAyahIndexRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load surah list once
  useEffect(() => {
    getSurahList().then((list) => {
      setSurahList(list);
      const last = getLastAyah();
      if (last) setSelectedSurah(last.surah);
    });
  }, []);

  // Sync favorites from localStorage
  const refreshFavorites = useCallback(() => {
    const favs = getFavorites();
    setFavoriteIds(new Set(favs.map((f) => f.id)));
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Fetch surah content when selected surah changes
  useEffect(() => {
    if (surahList.length === 0) return;
    setLoading(true);
    setError("");
    getSurahFull(selectedSurah)
      .then(({ surah, ayahs: fetchedAyahs }) => {
        setSurahInfo(surah);
        setAyahs(fetchedAyahs);
      })
      .catch(() => setError("Failed to load surah. Check your connection."))
      .finally(() => setLoading(false));
  }, [selectedSurah, surahList]);

  // Listen for audioended event to auto-play next ayah
  useEffect(() => {
    const handler = (e: Event) => {
      const endedUrl = (e as CustomEvent).detail.url;
      const idx = ayahs.findIndex((a) => getAudioUrl(a.number) === endedUrl);
      if (idx !== -1 && idx < ayahs.length - 1) {
        const nextAyah = ayahs[idx + 1];
        const nextUrl = getAudioUrl(nextAyah.number);
        currentAyahIndexRef.current = idx + 1;
        setLastAyah(selectedSurah, nextAyah.numberInSurah);
        // Small delay for natural feel
        setTimeout(() => toggle(nextUrl), 400);
      }
    };
    window.addEventListener("fiqrq:audioended", handler);
    return () => window.removeEventListener("fiqrq:audioended", handler);
  }, [ayahs, selectedSurah, toggle]);

  const handlePlay = useCallback(
    (ayah: Ayah) => {
      const url = getAudioUrl(ayah.number);
      toggle(url);
      setLastAyah(selectedSurah, ayah.numberInSurah);
    },
    [selectedSurah, toggle],
  );

  const handleCopy = useCallback((ayah: Ayah) => {
    const text = `${ayah.text}\n\n${ayah.translation}\n— ${ayah.surahEnglishName} ${ayah.numberInSurah}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(ayah.numberInSurah);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const handleShare = useCallback((ayah: Ayah) => {
    const text = `${ayah.text}\n\n"${ayah.translation}"\n— ${ayah.surahEnglishName}, ${ayah.numberInSurah}`;
    if (navigator.share) {
      navigator.share({ title: "FiqrQ", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, []);

  const handleFavorite = useCallback(
    (ayah: Ayah) => {
      const id = `${ayah.surahNumber}:${ayah.numberInSurah}`;
      const fav: FavoriteAyah = {
        id,
        surahNum: ayah.surahNumber!,
        ayahNum: ayah.numberInSurah,
        surahName: ayah.surahName!,
        surahEnglishName: ayah.surahEnglishName!,
        arabic: ayah.text,
        translation: ayah.translation ?? "",
        savedAt: Date.now(),
      };
      if (isFavorite(id)) removeFavorite(id);
      else addFavorite(fav);
      refreshFavorites();
    },
    [refreshFavorites],
  );

  return (
    <div className="page-container">
      {/* Header */}
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
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#f5f0e8",
            margin: "0 0 10px",
          }}
        >
          Study Qur’an
        </h2>
        {surahList.length > 0 && (
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

      {/* Content */}
      <div ref={containerRef} style={{ padding: "1rem 1.25rem" }}>
        {loading && <Spinner centered />}

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

        {!loading && !error && surahInfo && (
          <>
            {/* Surah Header */}
            <div
              style={{
                backgroundColor: "#1a1508",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: 16,
                padding: "1.25rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              <p
                lang="ar"
                dir="rtl"
                style={{
                  fontFamily: "Amiri, serif",
                  fontSize: "1.1rem",
                  color: "#d4af37",
                  margin: "0 0 6px",
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p
                lang="ar"
                dir="rtl"
                style={{
                  fontFamily: "Amiri, serif",
                  fontSize: "1.6rem",
                  color: "#f5f0e8",
                  margin: "0 0 4px",
                }}
              >
                {surahInfo.name}
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#d4af37",
                  margin: "0 0 2px",
                }}
              >
                {surahInfo.englishName}
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(245,240,232,0.5)",
                  margin: 0,
                }}
              >
                {surahInfo.englishNameTranslation} · {surahInfo.numberOfAyahs}{" "}
                Ayahs · {surahInfo.revelationType}
              </p>
            </div>

            {/* Copy notification */}
            {copied !== null && (
              <div
                style={{
                  position: "fixed",
                  top: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#1a1508",
                  border: "1px solid rgba(212,175,55,0.4)",
                  borderRadius: 10,
                  padding: "8px 20px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.8rem",
                  color: "#d4af37",
                  zIndex: 200,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                Copied ayah {copied}
              </div>
            )}

            {/* Ayah cards */}
            {ayahs.map((ayah) => {
              const url = getAudioUrl(ayah.number);
              const isPlaying = playingUrl === url;
              const isLoadingThis = audioLoading && isPlaying;
              const id = `${ayah.surahNumber}:${ayah.numberInSurah}`;
              return (
                <AyahCard
                  key={ayah.number}
                  ayah={ayah}
                  isPlaying={isPlaying}
                  isLoadingAudio={isLoadingThis}
                  onPlay={() => handlePlay(ayah)}
                  onCopy={() => handleCopy(ayah)}
                  onShare={() => handleShare(ayah)}
                  onFavorite={() => handleFavorite(ayah)}
                  isFavorite={favoriteIds.has(id)}
                />
              );
            })}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

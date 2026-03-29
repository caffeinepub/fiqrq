import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import duaData from "../data/dua.json";
import hadithData from "../data/hadith.json";
import { type FavoriteAyah, getFavorites } from "../utils/storage";

type Section = "hadith" | "dua" | "favorites" | "info";

const TABS: { key: Section; label: string; icon: string }[] = [
  { key: "hadith", label: "Hadith", icon: "📜" },
  { key: "dua", label: "Dua", icon: "🤲" },
  { key: "favorites", label: "Saved", icon: "❤️" },
  { key: "info", label: "Info", icon: "ℹ️" },
];

export default function More() {
  const [activeTab, setActiveTab] = useState<Section>("hadith");
  const [favorites, setFavorites] = useState<FavoriteAyah[]>([]);

  useEffect(() => {
    // Handle hash navigation from Home page
    const hash = window.location.hash.replace("#", "") as Section;
    if (hash && ["hadith", "dua", "favorites", "info"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "favorites") {
      setFavorites(getFavorites());
    }
  }, [activeTab]);

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: "FiqrQ - Islamic Companion",
        text: "A beautiful app for Quran reading, study, Hadith and Dua.",
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ padding: "1.25rem 1.25rem 0" }}>
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#f5f0e8",
            margin: "0 0 1rem",
          }}
        >
          More
        </h2>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                backgroundColor:
                  activeTab === tab.key ? "rgba(212,175,55,0.15)" : "#1a1508",
                border:
                  activeTab === tab.key
                    ? "1px solid rgba(212,175,55,0.5)"
                    : "1px solid rgba(212,175,55,0.15)",
                borderRadius: 20,
                color:
                  activeTab === tab.key ? "#d4af37" : "rgba(245,240,232,0.6)",
                padding: "6px 14px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.8rem",
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.25rem" }}>
        {/* Hadith Tab */}
        {activeTab === "hadith" && (
          <div id="hadith">
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.4)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Prophetic Traditions
            </p>
            {hadithData.map((h: any) => (
              <div
                key={h.id}
                className="fiqrq-card"
                style={{ marginBottom: "0.75rem" }}
              >
                <p
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: "Amiri, serif",
                    fontSize: "1.2rem",
                    lineHeight: 2,
                    color: "#f5f0e8",
                    textAlign: "right",
                    margin: "0 0 0.75rem",
                  }}
                >
                  {h.arabic}
                </p>
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
                    margin: "0.5rem 0",
                  }}
                />
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    color: "rgba(245,240,232,0.75)",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {h.text}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.72rem",
                    color: "#d4af37",
                    opacity: 0.7,
                    margin: 0,
                  }}
                >
                  {h.narrator} · {h.source}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Dua Tab */}
        {activeTab === "dua" && (
          <div id="dua">
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.4)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Daily Supplications
            </p>
            {duaData.map((d: any) => (
              <div
                key={d.id}
                className="fiqrq-card"
                style={{ marginBottom: "0.75rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#d4af37",
                      margin: 0,
                    }}
                  >
                    {d.title}
                  </p>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(245,240,232,0.4)",
                      fontFamily: "Poppins",
                    }}
                  >
                    {d.source}
                  </span>
                </div>
                <p
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: "Amiri, serif",
                    fontSize: "1.3rem",
                    lineHeight: 2,
                    color: "#f5f0e8",
                    textAlign: "right",
                    margin: "0 0 6px",
                  }}
                >
                  {d.arabic}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.78rem",
                    color: "rgba(245,240,232,0.5)",
                    fontStyle: "italic",
                    margin: "0 0 4px",
                  }}
                >
                  {d.transliteration}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.82rem",
                    color: "rgba(245,240,232,0.7)",
                    margin: 0,
                  }}
                >
                  {d.translation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.4)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Saved Ayahs
            </p>
            {favorites.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>❤️</p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(245,240,232,0.4)",
                  }}
                >
                  No favorites yet.
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.8rem",
                    color: "rgba(245,240,232,0.3)",
                  }}
                >
                  Save ayahs from the Study page.
                </p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="fiqrq-card"
                  style={{ marginBottom: "0.75rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "0.75rem",
                        color: "#d4af37",
                      }}
                    >
                      {fav.surahEnglishName} · {fav.ayahNum}
                    </span>
                    <span
                      lang="ar"
                      dir="rtl"
                      style={{
                        fontFamily: "Amiri",
                        fontSize: "0.9rem",
                        color: "rgba(245,240,232,0.5)",
                      }}
                    >
                      {fav.surahName}
                    </span>
                  </div>
                  <p
                    lang="ar"
                    dir="rtl"
                    style={{
                      fontFamily: "Amiri, serif",
                      fontSize: "1.2rem",
                      lineHeight: 2,
                      color: "#f5f0e8",
                      textAlign: "right",
                      margin: "0 0 6px",
                    }}
                  >
                    {fav.arabic}
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "0.8rem",
                      color: "rgba(245,240,232,0.6)",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    {fav.translation}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === "info" && (
          <div>
            {/* About */}
            <div className="fiqrq-card" style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <img
                  src="/assets/uploads/file_00000000e1d071fa94d8c428638a67a8-019d393a-1148-70a9-a044-9ed66a28081d-1.png"
                  alt="FiqrQ"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#d4af37",
                      margin: 0,
                    }}
                  >
                    FiqrQ
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "0.7rem",
                      color: "rgba(245,240,232,0.5)",
                      margin: 0,
                    }}
                  >
                    Islamic Companion App
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "0.85rem",
                  color: "rgba(245,240,232,0.7)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                FiqrQ (فِكْر) is your personal Islamic companion for reading and
                studying the Holy Qur’an, exploring authentic Hadith, and
                accessing daily Duʿa. Built with love for the Muslim ummah.
              </p>
            </div>

            {/* Downloads placeholder */}
            <div
              className="fiqrq-card"
              style={{ marginBottom: "0.75rem", opacity: 0.6 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📥</span>
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#f5f0e8",
                      margin: 0,
                    }}
                  >
                    Downloads
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "0.75rem",
                      color: "rgba(245,240,232,0.4)",
                      margin: 0,
                    }}
                  >
                    Offline audio — Coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Share App */}
            <button
              type="button"
              onClick={handleShareApp}
              style={{
                width: "100%",
                backgroundColor: "#1a1508",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: 14,
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                marginBottom: "0.75rem",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 22 }}>🔗</span>
              <div>
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#d4af37",
                    margin: 0,
                  }}
                >
                  Share FiqrQ
                </p>
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "0.75rem",
                    color: "rgba(245,240,232,0.5)",
                    margin: 0,
                  }}
                >
                  Share with friends & family
                </p>
              </div>
            </button>

            {/* Feedback */}
            <a
              href="mailto:feedback@fiqrq.app?subject=FiqrQ Feedback"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: "#1a1508",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: 14,
                padding: "1rem",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 22 }}>📬</span>
              <div>
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#f5f0e8",
                    margin: 0,
                  }}
                >
                  Send Feedback
                </p>
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "0.75rem",
                    color: "rgba(245,240,232,0.5)",
                    margin: 0,
                  }}
                >
                  Help us improve FiqrQ
                </p>
              </div>
            </a>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

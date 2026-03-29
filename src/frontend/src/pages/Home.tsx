import React from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import DailyCard from "../components/DailyCard";
import { getLastAyah, getLastPage } from "../utils/storage";

const QUICK_ACTIONS = [
  {
    icon: "📖",
    label: "Read Qur'an",
    sub: "Page by page",
    path: "/quran",
    color: "rgba(212,175,55,0.08)",
  },
  {
    icon: "🎓",
    label: "Study Qur'an",
    sub: "Arabic + Translation",
    path: "/study",
    color: "rgba(212,175,55,0.06)",
  },
  {
    icon: "📜",
    label: "Hadith",
    sub: "Prophetic traditions",
    path: "/more#hadith",
    color: "rgba(212,175,55,0.05)",
  },
  {
    icon: "🤲",
    label: "Dua",
    sub: "Daily supplications",
    path: "/more#dua",
    color: "rgba(212,175,55,0.05)",
  },
];

export default function Home() {
  const lastPage = getLastPage();
  const lastAyah = getLastAyah();

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ padding: "1.5rem 1.25rem 0", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <img
            src="/assets/uploads/file_00000000e1d071fa94d8c428638a67a8-019d393a-1148-70a9-a044-9ed66a28081d-1.png"
            alt="FiqrQ"
            style={{
              width: 44,
              height: 44,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#d4af37",
              margin: 0,
            }}
          >
            FiqrQ
          </h1>
        </div>
        <p
          lang="ar"
          dir="rtl"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "1.15rem",
            color: "rgba(245,240,232,0.7)",
            margin: "4px 0 0",
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* Main content */}
      <div style={{ padding: "1.25rem" }}>
        {/* Daily Ayah Card */}
        <DailyCard />

        {/* Continue Reading */}
        {(lastPage || lastAyah) && (
          <div style={{ marginTop: "1rem" }}>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              Continue
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              {lastPage && (
                <Link
                  to="/quran"
                  style={{
                    flex: 1,
                    backgroundColor: "#1a1508",
                    border: "1px solid rgba(212,175,55,0.2)",
                    borderRadius: 12,
                    padding: "0.75rem 1rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>📖</span>
                  <div>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#f5f0e8",
                        margin: 0,
                      }}
                    >
                      Qur'an
                    </p>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "0.7rem",
                        color: "rgba(245,240,232,0.5)",
                        margin: 0,
                      }}
                    >
                      Surah {lastPage.surah}, p.{lastPage.page + 1}
                    </p>
                  </div>
                </Link>
              )}
              {lastAyah && (
                <Link
                  to="/study"
                  style={{
                    flex: 1,
                    backgroundColor: "#1a1508",
                    border: "1px solid rgba(212,175,55,0.2)",
                    borderRadius: 12,
                    padding: "0.75rem 1rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>🎓</span>
                  <div>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#f5f0e8",
                        margin: 0,
                      }}
                    >
                      Study
                    </p>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "0.7rem",
                        color: "rgba(245,240,232,0.5)",
                        margin: 0,
                      }}
                    >
                      Surah {lastAyah.surah}:{lastAyah.ayah}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginTop: "1.25rem" }}>
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(245,240,232,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}
          >
            Quick Access
          </h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                style={{
                  backgroundColor: "#1a1508",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: 16,
                  padding: "1.1rem 1rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  background: action.color,
                  backdropFilter: "blur(4px)",
                }}
              >
                <span style={{ fontSize: 28 }}>{action.icon}</span>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#f5f0e8",
                    margin: 0,
                  }}
                >
                  {action.label}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.7rem",
                    color: "rgba(245,240,232,0.5)",
                    margin: 0,
                  }}
                >
                  {action.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

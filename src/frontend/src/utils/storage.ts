// FiqrQ localStorage utilities

export interface FavoriteAyah {
  id: string; // `${surahNum}:${ayahNum}`
  surahNum: number;
  ayahNum: number;
  surahName: string;
  surahEnglishName: string;
  arabic: string;
  translation: string;
  savedAt: number;
}

export interface LastAyah {
  surah: number;
  ayah: number;
}

// Last Quran reading page
export function getLastPage(): { surah: number; page: number } | null {
  try {
    const val = localStorage.getItem("fiqrq_lastPage");
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function setLastPage(surah: number, page: number): void {
  localStorage.setItem("fiqrq_lastPage", JSON.stringify({ surah, page }));
}

// Last study ayah
export function getLastAyah(): LastAyah | null {
  try {
    const val = localStorage.getItem("fiqrq_lastAyah");
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function setLastAyah(surah: number, ayah: number): void {
  localStorage.setItem("fiqrq_lastAyah", JSON.stringify({ surah, ayah }));
}

// Favorites
export function getFavorites(): FavoriteAyah[] {
  try {
    const val = localStorage.getItem("fiqrq_favorites");
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function addFavorite(ayah: FavoriteAyah): void {
  const favs = getFavorites();
  if (!favs.find((f) => f.id === ayah.id)) {
    favs.unshift(ayah);
    localStorage.setItem("fiqrq_favorites", JSON.stringify(favs));
  }
}

export function removeFavorite(id: string): void {
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem("fiqrq_favorites", JSON.stringify(favs));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}

// FiqrQ API utilities - alquran.cloud v1

const BASE = "https://api.alquran.cloud/v1";

export interface SurahInfo {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number; // global ayah number (1-6236)
  numberInSurah: number;
  text: string;
  translation?: string;
  surahNumber?: number;
  surahName?: string;
  surahEnglishName?: string;
}

export interface DailyAyah {
  arabic: string;
  translation: string;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  globalNumber: number;
}

// Fetch list of all 114 surahs
export async function getSurahList(): Promise<SurahInfo[]> {
  const res = await fetch(`${BASE}/surah`);
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const data = await res.json();
  return data.data as SurahInfo[];
}

// Fetch all ayahs for a surah in Arabic (quran-uthmani)
export async function getSurahArabic(surahNum: number): Promise<Ayah[]> {
  const res = await fetch(`${BASE}/surah/${surahNum}/quran-uthmani`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNum}`);
  const data = await res.json();
  return data.data.ayahs.map((a: any) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    surahNumber: surahNum,
    surahName: data.data.name,
    surahEnglishName: data.data.englishName,
  }));
}

// Fetch all ayahs for a surah with English translation (en.sahih)
export async function getSurahTranslation(surahNum: number): Promise<Ayah[]> {
  const res = await fetch(`${BASE}/surah/${surahNum}/en.sahih`);
  if (!res.ok)
    throw new Error(`Failed to fetch translation for surah ${surahNum}`);
  const data = await res.json();
  return data.data.ayahs.map((a: any) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
  }));
}

// Fetch both Arabic and translation for a surah, merged
export async function getSurahFull(surahNum: number): Promise<{
  surah: SurahInfo;
  ayahs: Ayah[];
}> {
  const [arabicRes, translationRes] = await Promise.all([
    fetch(`${BASE}/surah/${surahNum}/quran-uthmani`),
    fetch(`${BASE}/surah/${surahNum}/en.sahih`),
  ]);
  if (!arabicRes.ok || !translationRes.ok)
    throw new Error("Failed to fetch surah");

  const arabicData = await arabicRes.json();
  const translationData = await translationRes.json();

  const arabicAyahs = arabicData.data.ayahs;
  const translationAyahs = translationData.data.ayahs;

  const surahInfo: SurahInfo = {
    number: arabicData.data.number,
    name: arabicData.data.name,
    englishName: arabicData.data.englishName,
    englishNameTranslation: arabicData.data.englishNameTranslation,
    numberOfAyahs: arabicData.data.numberOfAyahs,
    revelationType: arabicData.data.revelationType,
  };

  const ayahs: Ayah[] = arabicAyahs.map((a: any, i: number) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    translation: translationAyahs[i]?.text ?? "",
    surahNumber: surahNum,
    surahName: arabicData.data.name,
    surahEnglishName: arabicData.data.englishName,
  }));

  return { surah: surahInfo, ayahs };
}

// Get audio URL for an ayah from Mishary Rashid Alafasy
export function getAudioUrl(globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
}

// Get a daily ayah - seeded by day of year so same all day, different each day
export async function getDailyAyah(): Promise<DailyAyah> {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const ayahNumber = (dayOfYear % 6236) + 1;

  const res = await fetch(
    `${BASE}/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`,
  );
  if (!res.ok) throw new Error("Failed to fetch daily ayah");
  const data = await res.json();

  const arabicEdition = data.data[0];
  const translationEdition = data.data[1];

  return {
    arabic: arabicEdition.text,
    translation: translationEdition.text,
    surahName: arabicEdition.surah.name,
    surahEnglishName: arabicEdition.surah.englishName,
    ayahNumber: arabicEdition.numberInSurah,
    globalNumber: arabicEdition.number,
  };
}

# FiqrQ - Islamic Companion App

## Current State
New project. Empty Motoko backend, no frontend pages.

## Requested Changes (Diff)

### Add
- Full Islamic companion app with 4 pages: Home, Quran Reader, Study, More
- Global audio singleton player (one audio at a time)
- localStorage persistence: lastPage, lastAyah, favorites[]
- Quran API integration: https://api.alquran.cloud
  - Arabic edition: quran-uthmani
  - Translation: en.sahih (Sahih International)
  - Reciter for audio: ar.alafasy (Mishary Rashid Alafasy)
- PWA manifest + service worker caching
- Design system: bg #0d0b06, cards #1a1508, accent #d4af37, text cream
- Fonts: Amiri (Arabic), Poppins (UI)
- App icon: /assets/uploads/file_00000000e1d071fa94d8c428638a67a8-019d393a-1148-70a9-a044-9ed66a28081d-1.png

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan

1. **Home page** (`/`)
   - Bismillah header with FiqrQ logo/icon
   - Daily ayah card: seeded by date (same card all day), fetched from alquran.cloud
   - Continue Reading card: pulls lastPage/lastAyah from localStorage
   - Quick actions grid: Read Quran, Study Quran, Hadith, Dua (links to routes)
   - Bottom nav: Home, Quran, Study, More

2. **Quran Reader page** (`/quran`)
   - Load Surah list, then load ayahs for selected surah OR paginated view
   - Page-based: 12 ayahs per page
   - Arabic only (Amiri font, right-to-left)
   - Prev/Next buttons + swipe gestures
   - Page indicator
   - Save lastPage to localStorage

3. **Study page** (`/study`) -- MOST IMPORTANT
   - Surah selector dropdown (114 surahs)
   - Ayah cards: Arabic + Sahih International translation
   - Per-ayah controls: Play/Pause, Copy, Share, Favorite
   - Audio: singleton, auto-plays next ayah, highlights active ayah, scrolls into view
   - Saves lastAyah to localStorage
   - Favorites toggle stored in localStorage

4. **More page** (`/more`)
   - Hadith section: loaded from local JSON data
   - Dua section: loaded from local JSON data
   - Favorites: display saved ayahs from localStorage
   - Downloads: UI placeholder
   - About, Share app (navigator.share), Feedback (mailto)

5. **Audio module** (`useAudio` hook / AudioManager class)
   - Global singleton
   - play(url), pause(), toggle(currentUrl)
   - Emits state for active ayah UI

6. **Data files**
   - hadith.json: 20 authentic hadiths
   - dua.json: 15 duas with Arabic + translation

7. **Modular React structure**
   - `components/BottomNav`, `components/AyahCard`, `components/DailyCard`, `components/Spinner`, `components/LoadingSpinner`
   - `hooks/useAudio`, `hooks/useFavorites`, `hooks/useLocalStorage`
   - `pages/Home`, `pages/QuranReader`, `pages/Study`, `pages/More`
   - `utils/api.ts` (API calls), `utils/storage.ts` (localStorage helpers)

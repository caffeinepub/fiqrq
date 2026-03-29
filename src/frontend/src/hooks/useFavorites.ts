import { useCallback, useState } from "react";
import {
  type FavoriteAyah,
  addFavorite,
  getFavorites,
  isFavorite,
  removeFavorite,
} from "../utils/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAyah[]>(getFavorites);

  const toggleFavorite = useCallback((ayah: FavoriteAyah) => {
    if (isFavorite(ayah.id)) {
      removeFavorite(ayah.id);
    } else {
      addFavorite(ayah);
    }
    setFavorites(getFavorites());
  }, []);

  const checkFavorite = useCallback(
    (id: string) => {
      return favorites.some((f) => f.id === id);
    },
    [favorites],
  );

  return { favorites, toggleFavorite, checkFavorite, setFavorites };
}

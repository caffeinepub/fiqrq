import { useCallback, useEffect, useState } from "react";

// Global singleton audio state
let globalAudio: HTMLAudioElement | null = null;
let globalPlayingUrl = "";
let listeners: Array<(url: string, loading: boolean) => void> = [];

function notifyListeners(url: string, loading: boolean) {
  for (const fn of listeners) {
    fn(url, loading);
  }
}

function audioPlay(url: string): void {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.src = "";
  }

  if (!url) {
    globalPlayingUrl = "";
    notifyListeners("", false);
    return;
  }

  globalPlayingUrl = url;
  notifyListeners(url, true);

  const audio = new Audio(url);
  globalAudio = audio;

  audio.addEventListener("canplay", () => {
    notifyListeners(globalPlayingUrl, false);
  });

  audio.addEventListener("ended", () => {
    globalPlayingUrl = "";
    globalAudio = null;
    notifyListeners("", false);
    // Signal that current audio ended - components listen to this
    window.dispatchEvent(
      new CustomEvent("fiqrq:audioended", { detail: { url } }),
    );
  });

  audio.addEventListener("error", () => {
    globalPlayingUrl = "";
    globalAudio = null;
    notifyListeners("", false);
  });

  audio.play().catch(() => {
    globalPlayingUrl = "";
    globalAudio = null;
    notifyListeners("", false);
  });
}

function audioPause(): void {
  if (globalAudio) {
    globalAudio.pause();
    globalPlayingUrl = "";
    globalAudio = null;
    notifyListeners("", false);
  }
}

export function useAudio() {
  const [playingUrl, setPlayingUrl] = useState(globalPlayingUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = (url: string, loading: boolean) => {
      setPlayingUrl(url);
      setIsLoading(loading);
    };
    listeners.push(handler);
    // Sync with current state on mount
    setPlayingUrl(globalPlayingUrl);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const play = useCallback((url: string) => {
    audioPlay(url);
  }, []);

  const pause = useCallback(() => {
    audioPause();
  }, []);

  const toggle = useCallback((url: string) => {
    if (globalPlayingUrl === url) {
      audioPause();
    } else {
      audioPlay(url);
    }
  }, []);

  const isPlaying = useCallback(
    (url: string) => {
      return globalPlayingUrl === url && playingUrl === url;
    },
    [playingUrl],
  );

  return { playingUrl, isLoading, play, pause, toggle, isPlaying };
}

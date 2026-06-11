import { useCallback, useEffect, useState } from "react";

/**
 * Cronômetro regressivo em segundos.
 * `restart(n)` (re)inicia a contagem; `remaining` decrementa ao vivo até 0.
 */
export function useCountdown(initialSeconds = 0) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const running = remaining > 0;

  const restart = useCallback((seconds: number) => {
    setRemaining(seconds);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return { remaining, restart };
}

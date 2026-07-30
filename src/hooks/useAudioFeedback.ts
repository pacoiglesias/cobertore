import { useCallback } from 'react';

// Generador de tonos usando Web Audio API nativo
// No requiere dependencias externas ni archivos .mp3
const playTone = (frequency: number, type: OscillatorType, duration: number, volume: number) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Silently fail if Audio API is not supported or blocked by browser policies
  }
};

export function useAudioFeedback() {
  const playSuccess = useCallback(() => {
    // Un acorde sutil y agudo ("Ding")
    playTone(600, 'sine', 0.2, 0.1);
    setTimeout(() => playTone(800, 'sine', 0.4, 0.1), 100);
  }, []);

  const playClick = useCallback(() => {
    // Un "tick" seco para interacciones de UI (tabs, botones menores)
    playTone(400, 'square', 0.05, 0.05);
  }, []);

  const playDelete = useCallback(() => {
    // Un tono grave para acciones destructivas (borrar)
    playTone(200, 'sawtooth', 0.3, 0.1);
    setTimeout(() => playTone(150, 'sawtooth', 0.4, 0.1), 150);
  }, []);

  const playError = useCallback(() => {
    // Doble tono grave
    playTone(300, 'square', 0.2, 0.1);
    setTimeout(() => playTone(250, 'square', 0.3, 0.1), 150);
  }, []);

  return { playSuccess, playClick, playDelete, playError };
}

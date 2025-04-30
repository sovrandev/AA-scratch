import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Import sound files for various game events and UI interactions
 */
import errorSound from '../assets/sounds/error.mp3';
import successSound from '../assets/sounds/success.mp3';
import tickSound from '../assets/sounds/tick.mp3';
import unboxSound from '../assets/sounds/unbox.mp3';
import countupSound from '../assets/sounds/number_adding_up.wav';
import confettiSound from '../assets/sounds/celebration.wav';
import bigSpinSound from '../assets/sounds/big_spin.wav';
import gemSound from '../assets/sounds/mines_gem.wav';
import bombSound from '../assets/sounds/mines_bomb.wav';
import revealSound from '../assets/sounds/mines_reveal.wav';

/**
 * Context for sound functionality
 * @type {React.Context}
 */
const SoundContext = createContext(null);

// Create audio instances
const errorAudio = new Audio(errorSound);
const successAudio = new Audio(successSound);
const tickAudio = new Audio(tickSound);
const unboxAudio = new Audio(unboxSound);
const confettiAudio = new Audio(confettiSound);
const bigSpinAudio = new Audio(bigSpinSound);
const gemAudio = new Audio(gemSound);
const bombAudio = new Audio(bombSound);
const revealAudio = new Audio(revealSound);
const countupAudio = new Audio(countupSound);

/**
 * Provider component for sound functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const SoundProvider = ({ children }) => {
  const [battlesMuted, setBattlesMuted] = useLocalStorage('battlesMuted', false);
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Configure audio settings when volume changes
  useEffect(() => {
    errorAudio.volume = volume;
    successAudio.volume = volume;
    tickAudio.volume = volume;
    unboxAudio.volume = volume;
    confettiAudio.volume = volume;
    bigSpinAudio.volume = 0.25;
    gemAudio.volume = volume;
    bombAudio.volume = volume;
    revealAudio.volume = volume;
    countupAudio.volume = 0.25;

    // Once all audio is configured, mark as initialized
    setIsInitialized(true);
  }, [volume]);

  /**
   * Safely plays an audio element with error handling
   * @param {HTMLAudioElement} audio - Audio element to play
   * @param {string} name - Name of the sound for error logging
   */
  const safePlayAudio = useCallback((audio, name) => {
    audio.currentTime = 0; // Reset audio to start
    audio.play().catch(err => console.log(`Error playing ${name} sound:`, err));
  }, []);

  /**
   * Plays error sound
   */
  const playError = useCallback(() => {
    safePlayAudio(errorAudio, 'error');
  }, [safePlayAudio]);

  /**
   * Plays success sound
   */
  const playSuccess = useCallback(() => {
    safePlayAudio(successAudio, 'success');
  }, [safePlayAudio]);

  /**
   * Plays tick sound (used for UI interactions)
   */
  const playTick = useCallback(() => {
    if (battlesMuted) return; // Prevent playing if muted
    safePlayAudio(tickAudio, 'tick');
  }, [battlesMuted, safePlayAudio]);

  /**
   * Plays unbox sound (used when opening boxes)
   */
  const playUnbox = useCallback(() => {
    if (battlesMuted) return; // Prevent playing if muted
    safePlayAudio(unboxAudio, 'unbox');
  }, [battlesMuted, safePlayAudio]);

  /**
   * Plays confetti sound (used for celebrations)
   */
  const playConfetti = useCallback(() => {
    if (battlesMuted) return; // Prevent playing if muted
    safePlayAudio(confettiAudio, 'confetti');
  }, [battlesMuted, safePlayAudio]);

  /**
   * Plays big spin sound (used for special animations)
   */
  const playBigSpin = useCallback(() => {
    if (battlesMuted) return; // Prevent playing if muted
    safePlayAudio(bigSpinAudio, 'big spin');
  }, [battlesMuted, safePlayAudio]);

  /**
   * Plays gem sound (used in mines game for successful reveals)
   */
  const playGem = useCallback(() => {
    safePlayAudio(gemAudio, 'gem');
  }, [safePlayAudio]);

  /**
   * Plays bomb sound (used in mines game for failed reveals)
   */
  const playBomb = useCallback(() => {
    safePlayAudio(bombAudio, 'bomb');
  }, [safePlayAudio]);

  /**
   * Plays reveal sound (used in mines game for tile reveals)
   */
  const playReveal = useCallback(() => {
    safePlayAudio(revealAudio, 'reveal');
  }, [safePlayAudio]);

  /**
   * Plays countup sound (used for counting up numbers)
   */
  const playCountup = useCallback(() => {
    safePlayAudio(countupAudio, 'countup');
  }, [safePlayAudio]);

  const value = {
    playError,
    playSuccess,
    playTick,
    playUnbox,
    playConfetti,
    playBigSpin,
    playGem,
    playBomb,
    playReveal,
    playCountup,
    battlesMuted,
    setBattlesMuted,
    volume,
    setVolume,
    isInitialized
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Hook for accessing sound functionality
 * @returns {Object} Sound context
 * @throws {Error} If used outside of SoundProvider
 */
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}; 
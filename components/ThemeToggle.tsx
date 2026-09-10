'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLightTheme = document.documentElement.classList.contains('light');
    setIsLight(isLightTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isLight;
    setIsLight(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('light');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('light');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] shrink-0 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all active:scale-95 shrink-0 ${
        isLight
          ? 'bg-amber-100/90 hover:bg-amber-200/90 text-amber-600 border border-amber-300/60 shadow-sm'
          : 'bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 border border-white/[0.08]'
      } ${className}`}
      aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLight ? 'Dark Mode me switch karein' : 'Light Mode me switch karein'}
    >
      {isLight ? (
        <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-800 transition-transform hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform hover:rotate-45" />
      )}
    </button>
  );
}

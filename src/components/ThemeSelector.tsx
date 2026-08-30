import React from 'react';
import { Palette } from 'lucide-react';
import { ThemeId } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themes: { id: ThemeId; label: string; color: string }[] = [
    { id: 'emerald', label: 'Light', color: 'bg-emerald-500' },
    { id: 'luxury', label: 'Dark', color: 'bg-yellow-500' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-bg-base border border-border-subtle rounded-xl shadow-sm">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onThemeChange(t.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
            currentTheme === t.id
              ? 'bg-bg-surface text-brand shadow-sm border border-border-subtle'
              : 'text-text-muted hover:text-text-main border border-transparent'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${t.color}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

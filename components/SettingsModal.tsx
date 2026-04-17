// components/SettingsModal.tsx
"use client";

import React from 'react';

interface Settings {
  timer_duration: number;
  max_players: number;
  sound_enabled: boolean;
}

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

const TIMER_OPTIONS = [10, 20, 30, 60];
const PLAYER_OPTIONS = [2, 4, 6, 8];

export function SettingsModal({ settings, onSave, onClose }: Props) {
  const [local, setLocal] = React.useState<Settings>(settings);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="muz-card w-full max-w-sm p-6 muz-pop">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black" style={{ color: '#F0F4FF' }}>⚙️ Paramètres</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.6)' }}>
            ✕
          </button>
        </div>

        {/* Timer */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-widest block mb-3"
            style={{ color: 'rgba(240,244,255,0.4)' }}>
            ⏱ Durée du timer
          </label>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map(t => (
              <button key={t}
                onClick={() => setLocal(l => ({ ...l, timer_duration: t }))}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: local.timer_duration === t ? '#FF00AA' : 'rgba(255,255,255,0.06)',
                  color: local.timer_duration === t ? 'white' : 'rgba(240,244,255,0.5)',
                  border: local.timer_duration === t ? 'none' : '1px solid rgba(139,92,246,0.2)',
                  boxShadow: local.timer_duration === t ? '0 4px 12px rgba(255,0,170,0.3)' : 'none',
                }}>
                {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Max joueurs */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-widest block mb-3"
            style={{ color: 'rgba(240,244,255,0.4)' }}>
            👥 Joueurs maximum
          </label>
          <div className="flex gap-2">
            {PLAYER_OPTIONS.map(n => (
              <button key={n}
                onClick={() => setLocal(l => ({ ...l, max_players: n }))}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: local.max_players === n ? '#8B5CF6' : 'rgba(255,255,255,0.06)',
                  color: local.max_players === n ? 'white' : 'rgba(240,244,255,0.5)',
                  border: local.max_players === n ? 'none' : '1px solid rgba(139,92,246,0.2)',
                  boxShadow: local.max_players === n ? '0 4px 12px rgba(139,92,246,0.3)' : 'none',
                }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Son */}
        <div className="mb-6 flex items-center justify-between">
          <label className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.7)' }}>
            🔊 Son
          </label>
          <button
            onClick={() => setLocal(l => ({ ...l, sound_enabled: !l.sound_enabled }))}
            className="w-14 h-7 rounded-full transition-all relative"
            style={{ background: local.sound_enabled ? '#00E5D1' : 'rgba(255,255,255,0.1)' }}>
            <span className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all"
              style={{ left: local.sound_enabled ? '1.75rem' : '2px' }} />
          </button>
        </div>

        <button
          onClick={() => { onSave(local); onClose(); }}
          className="muz-btn-pink w-full py-3 rounded-xl font-black text-base">
          Sauvegarder
        </button>
      </div>
    </div>
  );
}

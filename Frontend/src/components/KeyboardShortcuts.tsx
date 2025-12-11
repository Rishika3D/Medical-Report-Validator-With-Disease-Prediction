import React, { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onNavigate: (tab: string) => void;
}

export function KeyboardShortcuts({ onNavigate }: KeyboardShortcutsProps) {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { key: 'D', description: 'Dashboard', action: 'dashboard' },
    { key: 'P', description: 'Patients', action: 'patients' },
    { key: 'U', description: 'Upload', action: 'upload' },
    { key: 'R', description: 'Reports', action: 'reports' },
    { key: 'A', description: 'Analytics', action: 'analytics' },
    { key: 'C', description: 'Compare', action: 'compare' },
    { key: 'S', description: 'Settings', action: 'settings' },
    { key: '?', description: 'Show shortcuts', action: 'help' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts overlay
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setIsVisible(!isVisible);
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Navigate with keyboard shortcuts
      const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase());
      if (shortcut) {
        e.preventDefault();
        onNavigate(shortcut.action);
        setIsVisible(false);
      }

      // Close overlay with Escape
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onNavigate]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center neon-glow-cyan hover:scale-110 transition-all shadow-2xl z-40"
        title="Keyboard shortcuts (Shift + ?)"
      >
        <Keyboard size={20} className="text-black" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/95 backdrop-blur-xl border neon-border-cyan rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow-cyan">
              <Keyboard size={20} className="text-black" />
            </div>
            <h2 className="text-cyan-400 neon-text-cyan">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all"
          >
            <X size={20} className="text-gray-400 hover:text-cyan-400" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-2 gap-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-3 bg-black/60 border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-all"
            >
              <span className="text-gray-300">{shortcut.description}</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 text-black text-sm rounded-lg neon-glow-cyan shadow-lg">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-cyan-500/20 text-center">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400">Shift + ?</kbd> to toggle this menu
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Shortcuts work globally except when typing in text fields
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts
 * 
 * Usage:
 * useKeyboardShortcut({
 *   key: 'k',
 *   ctrlKey: true,
 *   metaKey: true, // For Mac support
 *   callback: () => setModalOpen(true)
 * });
 */
export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  callback,
  enabled = true
}: UseKeyboardShortcutOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Check if the key matches (case-insensitive)
    const keyMatches = event.key.toLowerCase() === key.toLowerCase();
    
    // Check modifier keys
    // For cross-platform support, we check if either ctrl OR meta is pressed when both are specified
    const ctrlOrMeta = (ctrlKey || metaKey) 
      ? (event.ctrlKey || event.metaKey) 
      : (!event.ctrlKey && !event.metaKey);
    
    const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey;
    const altMatches = altKey ? event.altKey : !event.altKey;

    // Don't trigger if user is typing in an input/textarea
    const target = event.target as HTMLElement;
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) 
      || target.isContentEditable;

    if (keyMatches && ctrlOrMeta && shiftMatches && altMatches && !isTyping) {
      event.preventDefault();
      callback();
    }
  }, [key, ctrlKey, metaKey, shiftKey, altKey, callback, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Preset hook for the NotebookLM shortcut (Ctrl/Cmd + K)
 */
export function useNotebookLMShortcut(callback: () => void, enabled = true) {
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    callback,
    enabled
  });
}

export default useKeyboardShortcut;

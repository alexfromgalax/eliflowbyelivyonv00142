import { useState, useCallback, useRef } from "react";

const STORAGE_KEY = "eli-flow-likes";

interface LikesStore {
  [category: string]: string[]; // ordered: last liked is last in array
}

function loadLikes(): LikesStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLikes(store: LikesStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * Hook to manage "liked" (favorited) items per category.
 * - Liked items are persisted in localStorage.
 * - `sortItems`: returns items with liked ones on top — but only uses the snapshot
 *   from when the hook was first mounted (so newly liked items don't jump immediately).
 * - `getDefault`: returns the last liked item (to use as pre-selection).
 * - `toggleLike`: toggles an item's liked status. If newly liked, it becomes the last liked (= new default).
 */
export function useLikes(category: string) {
  const [liked, setLiked] = useState<string[]>(() => loadLikes()[category] || []);
  
  // Snapshot of liked items at mount time — used for sorting only.
  // Newly liked items won't reorder until next session/mount.
  const initialLikedRef = useRef<string[]>(loadLikes()[category] || []);

  const isLiked = useCallback((item: string) => liked.includes(item), [liked]);

  const toggleLike = useCallback((item: string) => {
    setLiked(prev => {
      const store = loadLikes();
      let updated: string[];
      if (prev.includes(item)) {
        updated = prev.filter(x => x !== item);
      } else {
        updated = [...prev, item]; // last liked = last element
      }
      store[category] = updated;
      saveLikes(store);
      return updated;
    });
  }, [category]);

  /** Sort items: liked first (using initial snapshot), then non-liked (in original order).
   *  Items liked during this session stay in their original position until next load. */
  const sortItems = useCallback((items: string[]): string[] => {
    const snapshot = initialLikedRef.current;
    const likedItems = snapshot.filter(l => items.includes(l));
    const nonLiked = items.filter(i => !snapshot.includes(i));
    return [...likedItems, ...nonLiked];
  }, []);

  /** The last liked item = default pre-selection */
  const getDefault = useCallback((): string | undefined => {
    return liked.length > 0 ? liked[liked.length - 1] : undefined;
  }, [liked]);

  return { liked, isLiked, toggleLike, sortItems, getDefault };
}

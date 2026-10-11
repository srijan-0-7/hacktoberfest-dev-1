import { get, set, del, keys } from 'idb-keyval';
import { SavedObservation } from '../types/observation';

const METADATA_STORAGE_KEY = 'fieldlens_observations_v1';
const IDB_IMAGE_PREFIX = 'fieldlens_img_';

/**
 * Loads observation metadata from localStorage.
 */
export function loadObservations(): SavedObservation[] {
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
    return [];
  } catch (err) {
    console.error('Failed to load observations from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new observation, storing the image in IndexedDB and metadata in localStorage.
 */
export async function saveObservation(
  observation: SavedObservation,
  imageDataUrl?: string
): Promise<void> {
  let hasStoredImage = false;

  // Try storing image in IndexedDB
  if (imageDataUrl) {
    try {
      await set(`${IDB_IMAGE_PREFIX}${observation.id}`, imageDataUrl);
      hasStoredImage = true;
    } catch (err) {
      console.warn('Failed to store image in IndexedDB (storage quota or restricted environment):', err);
      // Fallback: If IndexedDB fails, we still allow metadata to save
      hasStoredImage = false;
    }
  }

  const record: SavedObservation = {
    ...observation,
    hasStoredImage,
  };

  const existing = loadObservations();
  // Filter out any duplicate if updating
  const filtered = existing.filter(o => o.id !== record.id);
  const updated = [record, ...filtered];

  try {
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    // If quota exceeded in localStorage, try trimming old metadata
    console.error('LocalStorage error saving observation:', err);
    throw new Error('Local storage quota exceeded. Please remove some older observations.');
  }
}

/**
 * Retrieves the stored image data URL for a given observation ID.
 */
export async function loadObservationImage(id: string): Promise<string | null> {
  try {
    const data = await get<string>(`${IDB_IMAGE_PREFIX}${id}`);
    return data || null;
  } catch (err) {
    console.warn(`Could not load image from IndexedDB for ${id}:`, err);
    return null;
  }
}

/**
 * Deletes an observation and its stored image.
 */
export async function deleteObservation(id: string): Promise<void> {
  // 1. Remove image from IndexedDB
  try {
    await del(`${IDB_IMAGE_PREFIX}${id}`);
  } catch (err) {
    console.warn(`Failed to delete IndexedDB image for ${id}:`, err);
  }

  // 2. Remove from localStorage
  try {
    const current = loadObservations();
    const updated = current.filter(o => o.id !== id);
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(`Failed to delete observation ${id} from localStorage:`, err);
    throw new Error('Failed to update storage after deletion.');
  }
}

/**
 * Deletes all observations and stored images.
 */
export async function clearAllObservations(): Promise<void> {
  try {
    const allKeys = await keys();
    for (const key of allKeys) {
      if (typeof key === 'string' && key.startsWith(IDB_IMAGE_PREFIX)) {
        await del(key);
      }
    }
    localStorage.removeItem(METADATA_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear observations:', err);
  }
}

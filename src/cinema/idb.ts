// Tiny IndexedDB wrapper for caching captured WebP frame sequences.
// Store: "hh-scroll", keyed by `${url}|${width}`. Value: Blob[] (WebP frames).
import { IDB_STORE } from './assets';

const DB_NAME = 'hh-scroll-db';
const VERSION = 1;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet(key: string): Promise<Blob[] | null> {
  try {
    const db = await open();
    return await new Promise<Blob[] | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve((req.result as Blob[]) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null; // storage blocked / private mode — just re-capture
  }
}

/** Only call after a COMPLETE capture — never persist a stalled decode. */
export async function idbSet(key: string, frames: Blob[]): Promise<void> {
  try {
    const db = await open();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(frames, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* non-fatal */
  }
}

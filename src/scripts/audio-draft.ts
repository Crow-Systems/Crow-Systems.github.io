const DB_NAME = "cs-drafts";
const STORE = "audio";

interface AudioRecord {
  savedAt: number;
  blob: Blob;
  duration?: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  try {
    const req = op(db.transaction(STORE, mode).objectStore(STORE));
    return await new Promise<T>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export async function saveAudio(key: string, blob: Blob, duration?: number) {
  try {
    await run("readwrite", (store) =>
      store.put(
        { savedAt: Date.now(), blob, duration } satisfies AudioRecord,
        key,
      ),
    );
  } catch {
    // IDB unavailable — drop silently
  }
}

export async function loadAudio(
  key: string,
): Promise<{ blob: Blob | null; duration: number }> {
  try {
    const record = await run<AudioRecord | undefined>("readonly", (store) =>
      store.get(key),
    );
    const blob = record?.blob;
    if (!blob) return { blob: null, duration: 0 };
    // IDB-stored blobs come back backed by IndexedDB's storage, which some
    // media pipelines can't stream (Chromium blob-URL regression: "element
    // has no supported sources" / "media resource was not suitable"). Rebuild
    // a fresh blob from the bytes so the recording plays after a reload.
    return {
      blob: new Blob([await blob.arrayBuffer()], { type: blob.type }),
      duration: record?.duration ?? 0,
    };
  } catch {
    return { blob: null, duration: 0 };
  }
}

export async function clearAudio(key: string) {
  try {
    await run("readwrite", (store) => store.delete(key));
  } catch {
    // ignore
  }
}
export interface DraftPayload {
  mode?: "audio" | "text";
  values: Record<string, string>;
}

interface DraftEnvelope {
  savedAt: number;
  payload: DraftPayload;
}

export function loadDraft(key: string): DraftPayload | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { payload } = JSON.parse(raw) as DraftEnvelope;
    return payload ?? null;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, payload: DraftPayload) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), payload }));
  } catch {
    // storage unavailable or full — drop the draft silently
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
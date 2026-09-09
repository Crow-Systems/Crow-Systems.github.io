import { useCallback, useEffect, useRef, useState } from "react";

import {
  clearDraft,
  saveDraft,
  type DraftPayload,
} from "../scripts/form-draft";
import { clearAudio, loadAudio, saveAudio } from "../scripts/audio-draft";

export function useDraft(
  key: string,
  payload: DraftPayload,
  audio: Blob | null,
  audioDuration: number,
) {
  const [draftAudio, setDraftAudio] = useState<Blob | null>(null);
  const [draftDuration, setDraftDuration] = useState(0);
  const latest = useRef({ payload, audio, audioDuration });
  latest.current = { payload, audio, audioDuration };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadAudio(key).then(({ blob, duration }) => {
      if (!cancelled) {
        setDraftAudio(blob);
        setDraftDuration(duration);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const persist = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const { payload, audio, audioDuration } = latest.current;
    const hasContent =
      !!audio || Object.values(payload.values).some((v) => v.trim() !== "");
    if (audio) void saveAudio(key, audio, audioDuration);
    if (hasContent) {
      saveDraft(key, payload);
    } else if (!audio) {
      // nothing to keep: drop the draft and any stored audio
      clearDraft(key);
      void clearAudio(key);
    }
    // ponytail: stored audio is kept when audio == null but the draft has
    // content — the blob may not be restored yet (async load / text mode).
    // Deleting a recording in-session without clearing the draft leaves a
    // stale blob; acceptable until draft is cleared or submitted.
  }, [key]);

  useEffect(() => {
    timer.current = setTimeout(persist, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [payload, audio, persist]);

  useEffect(() => {
    const onPageHide = () => {
      if (timer.current) clearTimeout(timer.current);
      persist();
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [persist]);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    clearDraft(key);
    void clearAudio(key);
    setDraftAudio(null);
    setDraftDuration(0);
  }, [key]);

  return { draftAudio, draftDuration, clear };
}
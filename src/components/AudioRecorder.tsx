import { useState, useRef, useCallback, useEffect } from "react";
import WaveformBars from "./WaveformBars";

interface Props {
  recordStartLabel: string;
  recordStopLabel: string;
  recordDeleteLabel: string;
  playLabel: string;
  audioNoBlob: string;
  audioDeleteFail: string;
  micError: string;
  discardRecording: string;
  onAudioChange: (blob: Blob | null) => void;
}

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function AudioRecorder({
  recordStartLabel,
  recordStopLabel,
  recordDeleteLabel,
  playLabel,
  audioNoBlob,
  audioDeleteFail,
  micError,
  discardRecording,
  onAudioChange,
}: Props) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000);
  }, []);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const mediaSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const elementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  function ensureAudioCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
    }
    return audioCtxRef.current;
  }

  function startLevelLoop() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    function tick() {
      analyser!.getByteFrequencyData(data);
      const binSize = Math.floor(data.length / 5);
      const out: number[] = [];
      for (let i = 0; i < 5; i++) {
        let sum = 0;
        let count = 0;
        for (
          let j = i * binSize;
          j < (i + 1) * binSize && j < data.length;
          j++
        ) {
          sum += data[j]!;
          count++;
        }
        out.push(count > 0 ? sum / count / 255 : 0);
      }
      setLevels(out);
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();
  }

  function stopLevelLoop() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLevels([]);
  }

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopLevelLoop();
      if (elementSourceRef.current) {
        elementSourceRef.current.disconnect();
        elementSourceRef.current = null;
      }
      if (audioEl.current) {
        audioEl.current.pause();
        audioEl.current.src = "";
        audioEl.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
        analyserRef.current = null;
      }
    };
  }, [audioUrl]);

  const clearRecording = useCallback(() => {
    if (audioEl.current) {
      audioEl.current.pause();
      audioEl.current.src = "";
    }
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaSourceRef.current) {
      mediaSourceRef.current.disconnect();
      mediaSourceRef.current = null;
    }
    if (elementSourceRef.current) {
      elementSourceRef.current.disconnect();
      elementSourceRef.current = null;
    }
    stopLevelLoop();
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setPlaying(false);
    setPlaybackPosition(0);
    setRecording(false);
    onAudioChange(null);
  }, [audioUrl, onAudioChange]);

  const handleDelete = useCallback(() => {
    if (!audioBlob && !recording) {
      showFeedback(audioDeleteFail);
      return;
    }
    if (!window.confirm(discardRecording)) return;
    clearRecording();
  }, [audioBlob, recording, discardRecording, audioDeleteFail, showFeedback, clearRecording]);

  const startRecording = useCallback(async () => {
    if (audioBlob || playing) {
      if (!window.confirm(discardRecording)) return;
      clearRecording();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType =
        ["audio/webm", "audio/mp4", "audio/mp3", "audio/wav", "audio/ogg"].find((t) =>
          MediaRecorder.isTypeSupported(t),
        ) || "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType });
      chunks.current = [];
      setDuration(0);
      mediaRecorder.current = mr;

      if (elementSourceRef.current) elementSourceRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      const ctx = ensureAudioCtx();
      mediaSourceRef.current = ctx.createMediaStreamSource(stream);
      mediaSourceRef.current.connect(analyserRef.current!);

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: mimeType });
        setAudioBlob(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecording(false);
        stopLevelLoop();
        if (mediaSourceRef.current) {
          mediaSourceRef.current.disconnect();
          mediaSourceRef.current = null;
        }
        stream.getTracks().forEach((t) => t.stop());
        onAudioChange(blob);
      };

      mr.start();
      setRecording(true);
      startLevelLoop();

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          if (next >= 300) {
            mr.stop();
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return next;
        });
      }, 1000);
    } catch {
      setRecording(false);
      showFeedback(micError);
    }
  }, [
    audioUrl,
    onAudioChange,
    audioBlob,
    playing,
    clearRecording,
    showFeedback,
    discardRecording,
    micError,
  ]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    stopLevelLoop();
    if (mediaSourceRef.current) {
      mediaSourceRef.current.disconnect();
      mediaSourceRef.current = null;
    }
    setRecording(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (!audioUrl) {
      showFeedback(audioNoBlob);
      return;
    }
    if (playing) {
      audioEl.current?.pause();
      setPlaying(false);
      stopLevelLoop();
      return;
    }
    if (!audioEl.current) {
      audioEl.current = new Audio();
      audioEl.current.addEventListener("timeupdate", () => {
        if (audioEl.current)
          setPlaybackPosition(Math.floor(audioEl.current.currentTime));
      });
      audioEl.current.onended = () => {
        setPlaying(false);
        stopLevelLoop();
      };
      if (mediaSourceRef.current) {
        mediaSourceRef.current.disconnect();
        mediaSourceRef.current = null;
      }
      if (analyserRef.current) analyserRef.current.disconnect();
      const ctx = ensureAudioCtx();
      elementSourceRef.current = ctx.createMediaElementSource(audioEl.current);
      elementSourceRef.current.connect(analyserRef.current!);
      analyserRef.current!.connect(ctx.destination);
    }
    audioEl.current.src = audioUrl;
    audioEl.current.play();
    setPlaybackPosition(0);
    setPlaying(true);
    startLevelLoop();
  }, [audioUrl, playing, showFeedback, audioNoBlob]);

  return (
    <div className="relative bg-surface rounded-xl p-12 border border-outline-variant/30 mb-6 flex flex-col items-center justify-center text-center">
      <WaveformBars
        active={recording || playing}
        levels={recording || playing ? levels : undefined}
      />
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleDelete}
          className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-red-500 hover:text-red-500 transition-all"
          aria-label={recordDeleteLabel}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className="w-20 h-20 rounded-full text-4xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
          aria-label={recording ? recordStopLabel : recordStartLabel}
        >
          {recording ? "⏹" : "🎙️"}
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all"
          aria-label={playLabel}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      <p className="mt-4 font-mono text-sm">
        <span className={playing ? "text-primary" : "text-on-surface-variant"}>
          {playing ? formatTime(playbackPosition) : formatTime(duration)}
        </span>
        <span className="text-on-surface-variant">
          {" / "}
          {formatTime(audioBlob ? duration : 300)}
        </span>
      </p>
      {feedback && (
        <div
          className="absolute bottom-2 mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
          role="alert"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

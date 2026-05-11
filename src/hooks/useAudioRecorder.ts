import { useState, useRef, useCallback, useEffect } from 'react';
import { MAX_RECORDING_DURATION, AUDIO_MIME_TYPES } from '../data/constants';
import { uploadAudio } from '../api/client';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [description, setDescription] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    setIsSubmitted(false);
    setDescription('');
    chunksRef.current = [];
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = AUDIO_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_RECORDING_DURATION) {
            stopRecording();
            return MAX_RECORDING_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permission to record audio, or use the text description instead.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const playRecording = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    audioRef.current.onended = () => setIsPlaying(false);
  }, [audioUrl]);

  const deleteRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
    }
    resetRecording();
  }, [resetRecording]);

  const handleSubmit = useCallback(async (descriptionText?: string) => {
    if (!audioBlob) return { success: false, message: 'No audio recorded' };

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadAudio({
        audioBlob,
        description: descriptionText || description,
        duration,
        mimeType: audioBlob.type,
      });
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Upload failed. Please try again.');
      }
      return result;
    } catch {
      setError('Network error. Please check your connection and try again.');
      return { success: false, message: 'Network error' };
    } finally {
      setIsUploading(false);
    }
  }, [audioBlob, description, duration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const formatDuration = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const secsRemainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secsRemainder).padStart(2, '0')}`;
  };

  return {
    isRecording,
    isPlaying,
    audioBlob,
    audioUrl,
    duration,
    error,
    isUploading,
    isSubmitted,
    description,
    setDescription,
    startRecording,
    stopRecording,
    toggleRecording,
    playRecording,
    deleteRecording,
    handleSubmit,
    formatDuration,
    resetRecording,
  };
}
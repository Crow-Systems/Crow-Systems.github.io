import { useState, useCallback, useRef, useEffect } from 'react'
import type { AudioRecorderState } from '@/types'

const MAX_RECORDING_MS = 5 * 60 * 1000 // 5 minutes

export function useAudioRecorder(): AudioRecorderState & {
  start: () => Promise<void>
  stop: () => void
  togglePause: () => void
  deleteRecording: () => void
  download: () => void
} {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    blob: null,
    url: null,
    error: null,
    permissionDenied: false,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    if (mediaRecorderRef.current && state.isRecording) {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // Already stopped
      }
    }
    setState((prev) => ({ ...prev, isRecording: false, isPaused: false }))
  }, [clearTimer, state.isRecording])

  // Auto-stop at 5 minutes
  useEffect(() => {
    if (state.duration >= MAX_RECORDING_MS) {
      stop()
    }
  }, [state.duration, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer()
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop()
        } catch {
          // Ignore
        }
      }
      if (state.url) {
        URL.revokeObjectURL(state.url)
      }
    }
  }, [clearTimer, state.url])

  const start = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRecording: false,
      error: null,
      permissionDenied: false,
    }))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)

        // Clean up stream tracks
        stream.getTracks().forEach((track) => track.stop())

        setState((prev) => ({
          ...prev,
          blob,
          url,
          isRecording: false,
          isPaused: false,
        }))
      }

      mediaRecorderRef.current.start(100)
      startTimeRef.current = Date.now()

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        setState((prev) => ({ ...prev, duration: elapsed, isRecording: true }))
      }, 100)

      setState((prev) => ({ ...prev, isRecording: true, isPaused: false, error: null }))
    } catch (err) {
      const msg =
        err instanceof Error &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
          ? 'Microphone access denied. Please enable microphone permissions to use this feature.'
          : err instanceof Error
            ? err.message
            : 'Failed to access microphone'

      setState((prev) => ({
        ...prev,
        error: msg,
        permissionDenied:
          err instanceof Error &&
          (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'),
      }))
    }
  }, [])

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return

    if (state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause()
      clearTimer()
      setState((prev) => ({ ...prev, isPaused: true }))
    } else if (state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume()
      startTimeRef.current = Date.now() - state.duration
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        setState((prev) => ({ ...prev, duration: elapsed }))
      }, 100)
      setState((prev) => ({ ...prev, isPaused: false }))
    }
  }, [state.isRecording, state.isPaused, clearTimer])

  const deleteRecording = useCallback(() => {
    clearTimer()
    if (state.url) {
      URL.revokeObjectURL(state.url)
    }
    if (mediaRecorderRef.current && state.isRecording) {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // Ignore
      }
    }
    chunksRef.current = []
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      blob: null,
      url: null,
      error: null,
      permissionDenied: false,
    })
  }, [state.isRecording, state.url, clearTimer])

  const download = useCallback(() => {
    if (!state.blob || !state.url) return
    const a = document.createElement('a')
    a.href = state.url
    a.download = `crow-idea-${Date.now()}.webm`
    a.click()
  }, [state.blob, state.url])

  return {
    ...state,
    start,
    stop,
    togglePause,
    deleteRecording,
    download,
  }
}
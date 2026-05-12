import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionWrapper } from "../components/layout/SectionWrapper";

export function AudioIdeaSection() {
  const {
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
    toggleRecording,
    playRecording,
    deleteRecording,
    handleSubmit,
    formatDuration,
  } = useAudioRecorder();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(description);
  };

  return (
    <SectionWrapper
      id="audio"
      title="Share Your Idea"
      subtitle="Audio Submission"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card hover>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-accent"}`}
                />
                <h3 className="font-heading text-2xl font-bold text-on-surface">
                  Audio Idea Submission
                </h3>
              </div>

              <div className="bg-surface rounded-xl p-10 border border-outline-variant/30 mb-8 flex flex-col items-center justify-center text-center">
                <div className="flex gap-2 items-center mb-8 h-16">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isRecording
                          ? "bg-primary animate-pulse"
                          : "bg-outline-variant/40"
                      }`}
                      style={{ height: `${8 + i * 3}px` }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={deleteRecording}
                    disabled={!audioBlob && !isRecording}
                    className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-30"
                    aria-label="Delete recording"
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
                    onClick={toggleRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                      isRecording
                        ? "bg-red-500 text-white shadow-red-500/30"
                        : "bg-primary text-on-primary shadow-primary/20"
                    }`}
                    aria-label={
                      isRecording ? "Stop recording" : "Start recording"
                    }
                  >
                    {isRecording ? (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                        <path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z" />
                        <path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482 1 1 0 011.464 1.464A5 5 0 005 10z" />
                        <path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={playRecording}
                    disabled={!audioUrl || isRecording}
                    className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                    aria-label="Play recording"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {isPlaying ? (
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      ) : (
                        <path d="M8 5v14l11-7z" />
                      )}
                    </svg>
                  </button>
                </div>

                <p className="mt-6 font-mono text-sm text-on-surface-variant">
                  {formatDuration(duration)} / 05:00
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    Additional Context{" "}
                    <span className="text-on-surface-variant/60 italic">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg p-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] transition-all font-body text-sm"
                    placeholder="Describe any technical constraints or specific outcomes you're looking for..."
                    rows={3}
                  />
                </div>

                {error && (
                  <div
                    className="text-sm text-red-600 bg-red-50/80 p-3 rounded-lg"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {isSubmitted && (
                  <div
                    className="text-sm text-green-700 bg-green-50/80 p-3 rounded-lg font-medium"
                    role="status"
                  >
                    ✓ Your audio idea has been submitted successfully. Our team
                    will review it within 4 business hours.
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  loading={isUploading}
                  className="w-full"
                  disabled={!audioBlob}
                >
                  {isUploading
                    ? "Uploading..."
                    : isSubmitted
                      ? "✓ Submitted!"
                      : "Submit Audio Idea"}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hover className="p-8">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent mb-6"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m12 12 4-2 4 2v4H8v-4l4-2z" />
            </svg>
            <h4 className="font-heading text-xl font-bold mb-3 text-on-surface">
              Corporate-Grade Security
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              All submissions, including audio files, are encrypted using
              AES-256 at rest and TLS 1.3 in transit. We prioritize your
              intellectual property. Standard NDAs are available upon request
              during the discovery phase.
            </p>
          </Card>

          <Card hover className="p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    alt="Leadership Portrait"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                  />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Marcus Thorne</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Managing Partner, Crow Systems
                  </p>
                </div>
              </div>
              <p className="italic text-on-surface-variant text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
                "We built this intake system to capture the 'why' behind the
                problem. Audio allows us to hear the priorities that
                spreadsheets often hide."
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-surface/50">
            <h3 className="font-heading text-lg font-bold mb-4 text-on-surface">
              Business Hours
            </h3>
            <div className="space-y-3 text-sm text-on-surface-variant font-body">
              <div className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <p className="font-medium text-sm text-on-surface">
                    Mon — Fri: 08:00 - 18:00 EST
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Sat: 10:00 - 14:00 EST (On-call only)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <p className="text-on-surface-variant">
                  North America, European Union, &amp; APAC
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary mt-0.5 shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                </svg>
                <p className="text-on-surface-variant">
                  solutions@crowsystems.tech
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}

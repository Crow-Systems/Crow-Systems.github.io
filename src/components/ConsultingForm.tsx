import { useState, useCallback } from "react";
import { z } from "zod";
import { submitConsultation } from "../scripts/api";
import AudioRecorder from "./AudioRecorder";

interface ConsultingLocale {
  audioSubmission: string;
  additionalContext: string;
  placeholder: string;
  submitAudio: string;
  uploading: string;
  submitted: string;
  audioSuccess: string;
  recordDeleteLabel: string;
  recordStartLabel: string;
  recordStopLabel: string;
  playLabel: string;
  consultForm: {
    heading: string;
    fullName: string;
    company: string;
    email: string;
    phone: string;
    problem: string;
    submit: string;
    submitting: string;
    write: string;
    record: string;
  };
  validation: {
    nameRequired: string;
    companyRequired: string;
    emailRequired: string;
    problemRequired: string;
    phoneRequired: string;
  };
  problems: string[];
  goalsPlaceholder: string;
  consultSuccess: string;
  audioNoBlob: string;
  audioDeleteFail: string;
  micError: string;
  discardRecording: string;
}

interface Props {
  locale: ConsultingLocale;
}

export default function ConsultingForm({ locale }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"audio" | "text">("audio");

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorderKey, setRecorderKey] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const schema = z.object({
    name: z.string().min(1, locale.validation.nameRequired),
    phone: z.string().min(1, locale.validation.phoneRequired),
    email: z.string().optional(),
    company: z.string().optional(),
  });

  const validate = useCallback(() => {
    const result = schema.safeParse({ name, phone, email, company });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return false;
    }
    setFieldErrors({});
    return true;
  }, [name, phone, email, company, schema]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "text") {
        await submitConsultation({
          fullName: name,
          company: company || "",
          email: email || "",
          phone,
          businessProblem: description || "No description provided",
        });
      } else {
        const BASE =
          import.meta.env.PUBLIC_API_BASE_URL ||
          "https://crowsys.chrislabs.net/api/v1";
        const AUDIO_UPLOAD =
          import.meta.env.PUBLIC_AUDIO_UPLOAD_ENDPOINT || "/audio/upload";
        const formData = new FormData();
        if (audioBlob) formData.append("audio", audioBlob, "recording.webm");
        formData.append("name", name);
        formData.append("phone", phone);
        if (email) formData.append("email", email);
        if (company) formData.append("company", company);
        if (description) formData.append("description", description);
        const res = await fetch(`${BASE}${AUDIO_UPLOAD}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
      }

      setSuccess(
        mode === "audio" ? locale.audioSuccess : locale.consultSuccess,
      );
      setName("");
      setPhone("");
      setEmail("");
      setCompany("");
      setDescription("");
      setAudioBlob(null);
      setRecorderKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";

  const labelClass =
    "text-xs font-bold uppercase tracking-widest text-on-surface-variant";

  const errClass = "text-xs text-red-500 mt-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-8 shadow-sm space-y-8"
      noValidate
    >
      {error && (
        <div
          className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-bold"
          role="status"
        >
          {success}
        </div>
      )}

      <fieldset>
        <legend className="font-heading text-xl font-bold text-on-surface mb-6">
          {locale.consultForm.heading}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="cf-name" className={labelClass}>
              {locale.consultForm.fullName}
              <span className="text-error">*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p className={errClass} id="cf-name-err">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-phone" className={labelClass}>
              {locale.consultForm.phone}
              <span className="text-error">*</span>
            </label>
            <input
              id="cf-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
            {fieldErrors.phone && (
              <p className={errClass} id="cf-phone-err">
                {fieldErrors.phone}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-email" className={labelClass}>
              {locale.consultForm.email}
            </label>
            <input
              id="cf-email"
              type="email"
              placeholder="j.doe@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-company" className={labelClass}>
              {locale.consultForm.company}
            </label>
            <input
              id="cf-company"
              type="text"
              placeholder="Your company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-xl font-bold text-on-surface mb-4">
          {locale.audioSubmission}
        </legend>

        <div className="inline-flex items-center gap-px bg-surface-container/80 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-300 ${
              mode === "text"
                ? "bg-primary text-white shadow-sm shadow-black/10"
                : "text-on-surface-variant hover:bg-primary/10"
            }`}
          >
            <span className="mr-1">✏️</span>
            {locale.consultForm.write}
          </button>
          <button
            type="button"
            onClick={() => setMode("audio")}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-300 ${
              mode === "audio"
                ? "bg-primary text-white shadow-sm shadow-black/10"
                : "text-on-surface-variant hover:bg-primary/10"
            }`}
          >
            <span className="mr-1">🎤</span>
            {locale.consultForm.record}
          </button>
        </div>

        {mode === "audio" ? (
          <>
            <AudioRecorder
              key={recorderKey}
              recordStartLabel={locale.recordStartLabel}
              recordStopLabel={locale.recordStopLabel}
              recordDeleteLabel={locale.recordDeleteLabel}
              playLabel={locale.playLabel}
              audioNoBlob={locale.audioNoBlob}
              audioDeleteFail={locale.audioDeleteFail}
              micError={locale.micError}
              discardRecording={locale.discardRecording}
              onAudioChange={(blob) => setAudioBlob(blob)}
            />
            <div className="space-y-4">
              <label htmlFor="cf-audio-context" className={labelClass}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: locale.additionalContext,
                  }}
                />
              </label>
              <textarea
                id="cf-audio-context"
                className="w-full bg-white border border-outline-variant rounded-lg p-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] transition-all font-body text-sm"
                placeholder={locale.placeholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="space-y-4 mb-6">
            <label htmlFor="cf-description" className={labelClass}>
              {locale.consultForm.problem}
              <span className="text-error">*</span>
            </label>
            <textarea
              id="cf-description"
              rows={4}
              placeholder={locale.goalsPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-36 bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm"
            />
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {submitting
            ? mode === "audio"
              ? locale.uploading
              : locale.consultForm.submitting
            : mode === "audio"
              ? locale.submitAudio
              : locale.consultForm.submit}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </form>
  );
}

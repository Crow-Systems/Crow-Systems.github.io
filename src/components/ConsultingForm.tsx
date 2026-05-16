import { useState, useCallback, useMemo, useEffect } from "react";
import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubmitConsultation, useUploadAudio } from "../scripts/api-hooks";
import AudioRecorder from "./AudioRecorder";
import PhoneInput from "./PhoneInput";

const queryClient = new QueryClient();

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
    emailInvalid: string;
    problemRequired: string;
    phoneRequired: string;
    phoneInvalid: string;
    descriptionMin: string;
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
  readonly locale: ConsultingLocale;
}

function ConsultingFormInner({ locale }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"audio" | "text">("audio");

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorderKey, setRecorderKey] = useState(0);

  const submitMutation = useSubmitConsultation();
  const uploadMutation = useUploadAudio();
  const submitting = submitMutation.isPending || uploadMutation.isPending;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, locale.validation.nameRequired),
        phone: z
          .string()
          .trim()
          .min(1, locale.validation.phoneRequired)
          .refine(
            (val) => {
              try {
                return parsePhoneNumber(val, "MX")?.isPossible() ?? false;
              } catch {
                return false;
              }
            },
            { message: locale.validation.phoneInvalid },
          ),
        email: z
          .string()
          .trim()
          .optional()
          .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: locale.validation.emailInvalid,
          }),
        company: z.string().optional(),
      }),
    [locale],
  );

  const runValidation = useCallback(() => {
    const result = schema.safeParse({ name, phone, email, company });
    const errs: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!errs[key]) errs[key] = issue.message;
      }
    }

    if (mode === "text" && description.trim().length < 10) {
      errs.description = locale.validation.descriptionMin;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [name, phone, email, company, description, mode, schema, locale]);

  const shouldValidate = useMemo(
    () => hasSubmitted || Object.values(touched).some(Boolean),
    [hasSubmitted, touched],
  );

  useEffect(() => {
    if (shouldValidate) runValidation();
  }, [name, phone, email, company, description, shouldValidate, runValidation]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  type Field = "name" | "phone" | "email" | "company" | "description";

  const fieldState = (field: Field) => {
    const show = touched[field] || hasSubmitted;
    const err = fieldErrors[field];
    const values: Record<Field, string> = {
      name,
      phone,
      email,
      company,
      description,
    };
    return {
      showError: show && !!err,
      showSuccess: show && !err && values[field].length > 0,
      errorId: `cf-${field}-err`,
    };
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setTouched({
      name: true,
      phone: true,
      email: true,
      company: true,
      description: true,
    });
    if (!runValidation()) return;

    setError(null);
    setSuccess(null);

    const onSuccess = () => {
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
      setTouched({});
      setHasSubmitted(false);
    };

    const onError = (err: Error) => {
      const msg = err.message.replace(/^HTTP \d+: /, "");
      setError(msg);
    };

    if (mode === "text") {
      submitMutation.mutate(
        {
          fullName: name,
          company: company || "",
          email: email || "",
          phone,
          businessProblem: description || "No description provided",
        },
        { onSuccess, onError },
      );
    } else {
      if (!audioBlob) {
        setError(locale.audioNoBlob);
        return;
      }
      uploadMutation.mutate(
        {
          audioBlob,
          fullName: name,
          phone,
          email: email || undefined,
          company: company || undefined,
          description: description || undefined,
        },
        { onSuccess, onError },
      );
    }
  };

  const inputClass =
    "w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-on-surface-variant";

  const errClass = "text-xs text-red-500 mt-1 flex items-center gap-1";

  const inputErrClass = "border-red-400 border-l-2";

  const inputSuccessClass = "border-green-400 border-l-2";

  const loadingLabel =
    mode === "audio" ? locale.uploading : locale.consultForm.submitting;
  const submitLabel =
    mode === "audio" ? locale.submitAudio : locale.consultForm.submit;
  const buttonText = submitting ? loadingLabel : submitLabel;

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
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="cf-name"
                type="text"
                placeholder="Full legal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-required="true"
                aria-invalid={fieldState("name").showError || undefined}
                aria-describedby={
                  fieldState("name").showError
                    ? fieldState("name").errorId
                    : undefined
                }
                className={`${inputClass} ${fieldState("name").showError ? inputErrClass : ""} ${fieldState("name").showSuccess ? inputSuccessClass : ""}`}
              />
              {fieldState("name").showSuccess && (
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {fieldState("name").showError && (
              <p
                className={errClass}
                id={fieldState("name").errorId}
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {fieldErrors.name}
              </p>
            )}
          </div>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            onBlur={() => handleBlur("phone")}
            showError={fieldState("phone").showError}
            showSuccess={fieldState("phone").showSuccess}
            errorId={fieldState("phone").errorId}
            errorMessage={fieldErrors.phone}
            label={locale.consultForm.phone}
            required
          />
          <div className="space-y-2">
            <label htmlFor="cf-email" className={labelClass}>
              {locale.consultForm.email}
            </label>
            <div className="relative">
              <input
                id="cf-email"
                type="email"
                placeholder="j.doe@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-required="false"
                aria-invalid={fieldState("email").showError || undefined}
                aria-describedby={
                  fieldState("email").showError
                    ? fieldState("email").errorId
                    : undefined
                }
                className={`${inputClass} ${fieldState("email").showError ? inputErrClass : ""} ${fieldState("email").showSuccess ? inputSuccessClass : ""}`}
              />
              {fieldState("email").showSuccess && (
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {fieldState("email").showError && (
              <p
                className={errClass}
                id={fieldState("email").errorId}
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-company" className={labelClass}>
              {locale.consultForm.company}
            </label>
            <div className="relative">
              <input
                id="cf-company"
                type="text"
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onBlur={() => handleBlur("company")}
                aria-required="false"
                aria-invalid={fieldState("company").showError || undefined}
                aria-describedby={
                  fieldState("company").showError
                    ? fieldState("company").errorId
                    : undefined
                }
                className={`${inputClass} ${fieldState("company").showError ? inputErrClass : ""} ${fieldState("company").showSuccess ? inputSuccessClass : ""}`}
              />
              {fieldState("company").showSuccess && (
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {fieldState("company").showError && (
              <p
                className={errClass}
                id={fieldState("company").errorId}
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {fieldErrors.company}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-lg font-bold text-on-surface mb-4">
          {locale.audioSubmission}
        </legend>

        <div className="inline-flex items-center gap-px bg-surface-container/80 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`flex gap-1 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-300 ${
              mode === "text"
                ? "bg-primary text-white shadow-sm shadow-black/10"
                : "text-on-surface-variant hover:bg-primary/10"
            }`}
          >
            <svg
              className="mr-1"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            {locale.consultForm.write}
          </button>
          <button
            type="button"
            onClick={() => setMode("audio")}
            className={`flex gap-1 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-300 ${
              mode === "audio"
                ? "bg-primary text-white shadow-sm shadow-black/10"
                : "text-on-surface-variant hover:bg-primary/10"
            }`}
          >
            <svg
              className="mr-1"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
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
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm min-h-[100px]"
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
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="cf-description"
                rows={4}
                placeholder={locale.goalsPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur("description")}
                aria-required="true"
                aria-invalid={fieldState("description").showError || undefined}
                aria-describedby={
                  fieldState("description").showError
                    ? fieldState("description").errorId
                    : undefined
                }
                className={`w-full h-36 bg-surface-container-lowest border rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm ${fieldState("description").showError ? inputErrClass : ""} ${fieldState("description").showSuccess ? inputSuccessClass : ""} ${!fieldState("description").showError && !fieldState("description").showSuccess ? "border-outline-variant/50" : ""}`}
              />
              {fieldState("description").showSuccess && (
                <svg
                  className="absolute right-3 top-3 w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {fieldState("description").showError && (
              <p
                className={errClass}
                id={fieldState("description").errorId}
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {fieldErrors.description}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-full md:w-auto md:px-12 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed md:mx-auto"
      >
        <span>{buttonText}</span>
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

export default function ConsultingForm({ locale }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConsultingFormInner locale={locale} />
    </QueryClientProvider>
  );
}

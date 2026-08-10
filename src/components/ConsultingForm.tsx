import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { useFormFields } from '../hooks/useFormFields';
import { ApiError } from '../scripts/api';
import {
  useSubmitConsultation,
  useUploadAudio,
} from '../scripts/api-hooks';
import AudioRecorder from './AudioRecorder';
import FormField from './FormField';
import PhoneInput from './PhoneInput';

const queryClient = new QueryClient();

interface ConsultingLocale {
  audioSubmission: string;
  additionalContext: string;
  additionalContextOptional: string;
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
    fullNamePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    email: string;
    emailPlaceholder: string;
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
  errorKeys: Record<string, string>;
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

type ErrorType = "network" | "server" | "unknown";

interface ErrorDisplay {
  message: string;
  type: ErrorType;
  key: string;
}

interface FieldConfig {
  key: string;
  type: "text" | "email";
  label: string;
  placeholder: string;
  required?: boolean;
}

const VALIDATION_FIELD_MAP: Record<string, string> = {
  VALIDATION_NAME_REQUIRED: "name",
  VALIDATION_EMAIL_INVALID: "email",
  VALIDATION_PHONE_INVALID: "phone",
  VALIDATION_COMPANY_REQUIRED: "company",
  VALIDATION_DESCRIPTION_MIN: "description",
};

function mapErrorKeyToField(key: string): string | null {
  return VALIDATION_FIELD_MAP[key] ?? null;
}

function resolveErrorKey(key: string, locale: ConsultingLocale): string {
  return locale.errorKeys[key] || key;
}

function ConsultingFormInner({ locale }: Props) {
  const {
    values,
    setValue,
    setFieldErrors,
    touched,
    setTouched,
    hasSubmitted,
    setHasSubmitted,
    serverFieldErrorsRef,
    handleBlur,
    clearServerFieldError,
    getFieldState,
    scrollToFirstError,
    reset,
  } = useFormFields({
    name: "",
    phone: "",
    email: "",
    company: "",
    description: "",
  });

  const [mode, setMode] = useState<"audio" | "text">("audio");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorderKey, setRecorderKey] = useState(0);

  const submitMutation = useSubmitConsultation();
  const uploadMutation = useUploadAudio();
  const submitting = submitMutation.isPending || uploadMutation.isPending;
  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, locale.validation.nameRequired),
        phone: z
          .string()
          .trim()
          .min(1, locale.validation.phoneRequired)
          .refine(
            (val) => parsePhoneNumberFromString(val, "MX")?.isPossible() ?? false,
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
    const result = schema.safeParse({
      name: values.name ?? "",
      phone: values.phone ?? "",
      email: values.email ?? "",
      company: values.company ?? "",
    });
    const errs: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!errs[key]) errs[key] = issue.message;
      }
    }

    if (mode === "text" && (values.description ?? "").trim().length < 10) {
      errs.description = locale.validation.descriptionMin;
    }

    for (const [key, val] of Object.entries(serverFieldErrorsRef.current)) {
      if (!errs[key]) errs[key] = val;
    }

    setFieldErrors(errs);
    return errs;
  }, [values, mode, schema, locale, setFieldErrors, serverFieldErrorsRef]);

  const shouldValidate = useMemo(
    () => hasSubmitted || Object.values(touched).some(Boolean),
    [hasSubmitted, touched],
  );

  useEffect(() => {
    if (shouldValidate) runValidation();
  }, [values, shouldValidate, runValidation]);

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
    const errs = runValidation();
    if (Object.keys(errs).length > 0) {
      scrollToFirstError(errs);
      return;
    }

    setErrorDisplay(null);
    setSuccess(null);

    const onSuccess = () => {
      window.umami?.track("consulting-form-success", { mode });
      const email = (values.email ?? "").trim();
      if (email) window.umami?.identify(email);
      setSuccess(
        mode === "audio" ? locale.audioSuccess : locale.consultSuccess,
      );
      reset(["name", "phone", "email", "company", "description"]);
      setAudioBlob(null);
      setRecorderKey((k) => k + 1);
    };

    const onError = (err: Error) => {
      window.umami?.track("consulting-form-error", {
        mode,
        error:
          err instanceof ApiError
            ? err.errorKey || "unknown"
            : err instanceof TypeError
              ? "network"
              : "unknown",
      });
      if (err instanceof ApiError && err.errorKey) {
        const field = mapErrorKeyToField(err.errorKey);
        const msg = resolveErrorKey(err.errorKey, locale);
        if (field) {
          serverFieldErrorsRef.current = {
            ...serverFieldErrorsRef.current,
            [field]: msg,
          };
          setFieldErrors((prev) => ({ ...prev, [field]: msg }));
          setTouched((prev) => ({ ...prev, [field]: true }));
          setHasSubmitted(true);
        } else if (err.errorKey.startsWith("NETWORK")) {
          setErrorDisplay({ message: msg, type: "network", key: err.errorKey });
        } else {
          setErrorDisplay({ message: msg, type: "server", key: err.errorKey });
        }
      } else if (err instanceof TypeError) {
        setErrorDisplay({
          message: locale.errorKeys?.NETWORK_ERROR || "Unable to connect.",
          type: "network",
          key: "NETWORK_ERROR",
        });
      } else {
        const msg = err.message.replace(/^HTTP \d+: /, "");
        setErrorDisplay({
          message: locale.errorKeys?.UNKNOWN_ERROR || msg,
          type: "unknown",
          key: "UNKNOWN_ERROR",
        });
      }
    };

    if (mode === "text") {
      submitMutation.mutate(
        {
          fullName: values.name ?? "",
          company: (values.company ?? "") || "",
          email: (values.email ?? "") || "",
          phone: values.phone ?? "",
          businessProblem: (values.description ?? "") || "No description provided",
        },
        { onSuccess, onError },
      );
    } else {
      if (!audioBlob) {
        setErrorDisplay({
          message: locale.audioNoBlob,
          type: "unknown",
          key: "AUDIO_NO_BLOB",
        });
        return;
      }
      uploadMutation.mutate(
        {
          audioBlob,
          fullName: values.name ?? "",
          phone: values.phone ?? "",
          email: (values.email ?? "") || undefined,
          company: (values.company ?? "") || undefined,
          description: (values.description ?? "") || undefined,
        },
        { onSuccess, onError },
      );
    }
  };

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

  const FIELDS: FieldConfig[] = [
    {
      key: "name",
      type: "text",
      label: locale.consultForm.fullName,
      placeholder: locale.consultForm.fullNamePlaceholder,
      required: true,
    },
    {
      key: "email",
      type: "email",
      label: locale.consultForm.email,
      placeholder: locale.consultForm.emailPlaceholder,
    },
    {
      key: "company",
      type: "text",
      label: locale.consultForm.company,
      placeholder: locale.consultForm.companyPlaceholder,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-4 md:p-8 shadow-sm space-y-8"
      noValidate
    >
      {errorDisplay && (
        <div
          className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${
            errorDisplay.type === "network"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : errorDisplay.type === "server"
                ? "bg-orange-50 text-orange-800 border-orange-200"
                : "bg-red-50 text-red-600 border-red-200"
          }`}
          role="alert"
        >
          {errorDisplay.type === "network" ? (
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v.01M8 12a8 8 0 0 0 8 0m-6-4a6 6 0 0 1 8 0m-10-2a10 10 0 0 1 14 0M3.05 8.05a14 14 0 0 1 17.9 0"
              />
            </svg>
          ) : errorDisplay.type === "server" ? (
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
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
          )}
          <p className="flex-1 font-medium">{errorDisplay.message}</p>
          <button
            type="button"
            onClick={() => setErrorDisplay(null)}
            className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
            aria-label="Dismiss error"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
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
          {FIELDS.map((field) => {
            const state = getFieldState(field.key);
            return (
              <FormField
                key={field.key}
                id={`cf-${field.key}`}
                label={field.label}
                required={field.required}
                value={values[field.key] ?? ""}
                onChange={(val) => {
                  setValue(field.key, val);
                  clearServerFieldError(field.key);
                }}
                onBlur={() => handleBlur(field.key)}
                showError={state.showError}
                showSuccess={state.showSuccess}
                error={state.error}
                errorId={state.errorId}
                type={field.type}
                placeholder={field.placeholder}
              />
            );
          })}
          <PhoneInput
            value={values.phone ?? ""}
            onChange={(val) => {
              setValue("phone", val);
              clearServerFieldError("phone");
            }}
            onBlur={() => handleBlur("phone")}
            showError={getFieldState("phone").showError}
            showSuccess={getFieldState("phone").showSuccess}
            errorId={getFieldState("phone").errorId}
            errorMessage={getFieldState("phone").error}
            label={locale.consultForm.phone}
            required
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-lg font-bold text-on-surface mb-4">
          {locale.audioSubmission}
        </legend>

        <div className="inline-flex items-center gap-px bg-surface-container/80 rounded-full p-1 mb-6">
          <button
            type="button"
            data-umami-event="consulting-mode-toggle"
            data-umami-event-mode="write"
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
            data-umami-event="consulting-mode-toggle"
            data-umami-event-mode="audio"
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
                {locale.additionalContext}
                <span className="text-on-surface-variant/60 italic">{locale.additionalContextOptional}</span>
              </label>
              <textarea
                id="cf-audio-context"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm min-h-[100px]"
                placeholder={locale.placeholder}
                value={values.description ?? ""}
                onChange={(e) => {
                  setValue("description", e.target.value);
                  clearServerFieldError("description");
                }}
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
                value={values.description ?? ""}
                onChange={(e) => {
                  setValue("description", e.target.value);
                  clearServerFieldError("description");
                }}
                onBlur={() => handleBlur("description")}
                aria-required="true"
                aria-invalid={getFieldState("description").showError || undefined}
                aria-describedby={
                  getFieldState("description").showError
                    ? getFieldState("description").errorId
                    : undefined
                }
                className={`w-full h-36 bg-surface-container-lowest border rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm ${getFieldState("description").showError ? inputErrClass : ""} ${getFieldState("description").showSuccess ? inputSuccessClass : ""} ${!getFieldState("description").showError && !getFieldState("description").showSuccess ? "border-outline-variant/50" : ""}`}
              />
              {getFieldState("description").showSuccess && (
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
            {getFieldState("description").showError && (
              <p
                className={errClass}
                id={getFieldState("description").errorId}
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
                {getFieldState("description").error}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        onClick={() => window.umami?.track("consulting-form-submit", { mode })}
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

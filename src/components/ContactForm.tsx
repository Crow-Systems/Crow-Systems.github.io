import { useState, useCallback, useMemo, useEffect } from "react";
import { z } from "zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubmitContact } from "../scripts/api-hooks";
import { ApiError } from "../scripts/api";
import FormField from "./FormField";
import { useFormFields } from "../hooks/useFormFields";

const queryClient = new QueryClient();

interface ContactLocale {
  name: string;
  email: string;
  subject: string;
  message: string;
  sendMessage: string;
  nameRequired: string;
  emailRequired: string;
  subjectRequired: string;
  messageRequired: string;
  sending: string;
  success: string;
  failed: string;
  errorKeys: Record<string, string>;
}

interface Props {
  readonly locale: ContactLocale;
}

type ErrorType = "network" | "server" | "unknown";

interface ErrorDisplay {
  message: string;
  type: ErrorType;
  key: string;
}

interface FieldConfig {
  key: string;
  type: "text" | "email" | "textarea";
  label: string;
  placeholder?: string;
  required: boolean;
  rows?: number;
}

const VALIDATION_FIELD_MAP: Record<string, string> = {
  VALIDATION_NAME_REQUIRED: "name",
  VALIDATION_EMAIL_INVALID: "email",
  VALIDATION_SUBJECT_REQUIRED: "subject",
  VALIDATION_MESSAGE_MIN: "message",
};

function mapErrorKeyToField(key: string): string | null {
  return VALIDATION_FIELD_MAP[key] ?? null;
}

function resolveErrorKey(key: string, locale: ContactLocale): string {
  return locale.errorKeys[key] || key;
}

function ContactFormInner({ locale }: Props) {
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
    email: "",
    subject: "",
    message: "",
  });

  const submitMutation = useSubmitContact();
  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, locale.nameRequired),
        email: z
          .string()
          .trim()
          .min(1, locale.emailRequired)
          .refine(
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            { message: locale.emailRequired },
          ),
        subject: z.string().trim().min(1, locale.subjectRequired),
        message: z.string().trim().min(10, locale.messageRequired),
      }),
    [locale],
  );

  const runValidation = useCallback(() => {
    const result = schema.safeParse({
      name: values.name ?? "",
      email: values.email ?? "",
      subject: values.subject ?? "",
      message: values.message ?? "",
    });
    const errs: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!errs[key]) errs[key] = issue.message;
      }
    }

    for (const [key, val] of Object.entries(serverFieldErrorsRef.current)) {
      if (!errs[key]) errs[key] = val;
    }

    setFieldErrors(errs);
    return errs;
  }, [values, schema, locale, setFieldErrors, serverFieldErrorsRef]);

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
      email: true,
      subject: true,
      message: true,
    });
    const errs = runValidation();
    if (Object.keys(errs).length > 0) {
      scrollToFirstError(errs, "cnt-");
      return;
    }

    setErrorDisplay(null);
    setSuccess(null);

    const onSuccess = () => {
      setSuccess(locale.success);
      reset(["name", "email", "subject", "message"]);
    };

    const onError = (err: Error) => {
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

    submitMutation.mutate(
      {
        name: (values.name ?? "").trim(),
        email: (values.email ?? "").trim(),
        subject: (values.subject ?? "").trim(),
        message: (values.message ?? "").trim(),
      },
      { onSuccess, onError },
    );
  };

  const FIELDS: FieldConfig[] = [
    {
      key: "name",
      type: "text",
      label: locale.name,
      placeholder: locale.name,
      required: true,
    },
    {
      key: "email",
      type: "email",
      label: locale.email,
      placeholder: locale.email,
      required: true,
    },
    {
      key: "subject",
      type: "text",
      label: locale.subject,
      placeholder: locale.subject,
      required: true,
    },
    {
      key: "message",
      type: "textarea",
      label: locale.message,
      placeholder: locale.message,
      required: true,
      rows: 5,
    },
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-8 shadow-sm">
      {errorDisplay && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 border ${
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
          className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-bold"
          role="status"
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {FIELDS.map((field) => {
          const state = getFieldState(field.key);
          return (
            <FormField
              key={field.key}
              id={`cnt-${field.key}`}
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
              rows={field.rows}
            />
          );
        })}
        <button
          type="submit"
          data-umami-event="contact-form-submit"
          disabled={submitMutation.isPending}
          className="w-full bg-primary text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {submitMutation.isPending ? locale.sending : locale.sendMessage}
          </span>
        </button>
      </form>
    </div>
  );
}

export default function ContactForm({ locale }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContactFormInner locale={locale} />
    </QueryClientProvider>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  error?: string;
  errorId?: string;
  showError: boolean;
  showSuccess: boolean;
  type?: "text" | "email" | "textarea";
  rows?: number;
}

const inputClass =
  "w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";

const inputErrClass = "border-red-400 border-l-2";
const inputSuccessClass = "border-green-400 border-l-2";
const labelClass =
  "text-xs font-bold uppercase tracking-wider text-on-surface-variant";
const errClass = "text-xs text-red-500 mt-1 flex items-center gap-1";

function ErrorIcon() {
  return (
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
  );
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute w-4 h-4 text-green-500 ${className ?? "right-3 top-1/2 -translate-y-1/2"}`}
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
  );
}

export default function FormField({
  id,
  label,
  required,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  errorId,
  showError,
  showSuccess,
  type = "text",
  rows,
}: FormFieldProps) {
  const resolvedErrorId = errorId ?? `${id}-err`;
  const isTextarea = type === "textarea";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows ?? 5}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-required={required}
            aria-invalid={showError || undefined}
            aria-describedby={showError ? resolvedErrorId : undefined}
            className={`resize-none font-body ${inputClass} ${showError ? inputErrClass : ""} ${showSuccess ? inputSuccessClass : ""}`}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-required={required}
            aria-invalid={showError || undefined}
            aria-describedby={showError ? resolvedErrorId : undefined}
            className={`${inputClass} ${showError ? inputErrClass : ""} ${showSuccess ? inputSuccessClass : ""}`}
          />
        )}
        {showSuccess && (
          <SuccessIcon
            className={isTextarea ? "right-3 top-3" : "right-3 top-1/2 -translate-y-1/2"}
          />
        )}
      </div>
      {showError && error && (
        <p className={errClass} id={resolvedErrorId} role="alert">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

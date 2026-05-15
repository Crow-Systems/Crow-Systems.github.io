import { useCallback } from "react";
import RPNInput from "react-phone-number-input/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  showError: boolean;
  showSuccess: boolean;
  errorId?: string;
  errorMessage?: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
}

const inputClass =
  "w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";

const inputErrClass = "border-red-400 border-l-2";
const inputSuccessClass = "border-green-400 border-l-2";

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  showError,
  showSuccess,
  errorId = "cf-phone-err",
  errorMessage,
  label,
  required,
  placeholder = "+52 55 1234 5678",
  id = "cf-phone",
}: PhoneInputProps) {
  const handleChange = useCallback(
    (v?: string) => onChange(v ?? ""),
    [onChange],
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <RPNInput
          id={id}
          defaultCountry="MX"
          placeholder={placeholder}
          value={value || undefined}
          onChange={handleChange}
          onBlur={onBlur}
          autoComplete="tel"
          aria-required={required}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className={`${inputClass} ${showError ? inputErrClass : ""} ${showSuccess ? inputSuccessClass : ""}`}
        />
        {showSuccess && (
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
      {showError && errorMessage && (
        <p
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
          id={errorId}
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
          {errorMessage}
        </p>
      )}
    </div>
  );
}

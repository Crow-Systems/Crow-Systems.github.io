import { useState, useCallback, useRef } from "react";

export interface FieldState {
  showError: boolean;
  showSuccess: boolean;
  errorId: string;
  error: string | undefined;
}

export function useFormFields(initialValues: Record<string, string> = {}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const serverFieldErrorsRef = useRef<Record<string, string>>({});

  const setValue = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const clearServerFieldError = useCallback((field: string) => {
    if (field in serverFieldErrorsRef.current) {
      const next = { ...serverFieldErrorsRef.current };
      delete next[field];
      serverFieldErrorsRef.current = next;
    }
  }, []);

  const getFieldState = (field: string): FieldState => ({
    showError: (touched[field] || hasSubmitted) && !!fieldErrors[field],
    showSuccess:
      (touched[field] || hasSubmitted) &&
      !fieldErrors[field] &&
      (values[field] ?? "").length > 0,
    errorId: `cf-${field}-err`,
    error: fieldErrors[field],
  });

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const id = firstKey === "phone" ? "cf-phone" : `cf-${firstKey}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }
  };

  const reset = useCallback((fieldKeys?: string[]) => {
    if (fieldKeys) {
      setValues((prev) => {
        const next = { ...prev };
        for (const k of fieldKeys) delete next[k];
        return next;
      });
    } else {
      setValues({});
    }
    setFieldErrors({});
    setTouched({});
    setHasSubmitted(false);
    serverFieldErrorsRef.current = {};
  }, []);

  return {
    values,
    setValue,
    fieldErrors,
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
  };
}

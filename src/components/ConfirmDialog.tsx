import { useEffect, useRef } from 'react';

interface Props {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        className="bg-surface rounded-xl border border-outline-variant/30 px-6 py-5 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-on-surface font-body text-base leading-6 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-all text-sm font-medium"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-all text-sm font-medium ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                : "bg-primary hover:bg-primary-dark focus:ring-2 focus:ring-primary-muted"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
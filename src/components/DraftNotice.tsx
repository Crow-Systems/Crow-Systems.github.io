import { useEffect, useState } from 'react';

interface Props {
  message: string;
  clearLabel: string;
  className?: string;
  onClear: () => void;
}

export default function DraftNotice({ message, clearLabel, className = "", onClear }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`p-4 bg-surface-container-low text-on-surface-variant rounded-lg text-sm flex items-center justify-between gap-3 ${className}`}
      role="status"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => {
          onClear();
          setVisible(false);
        }}
        className="shrink-0 underline hover:text-primary transition-colors"
      >
        {clearLabel}
      </button>
    </div>
  );
}
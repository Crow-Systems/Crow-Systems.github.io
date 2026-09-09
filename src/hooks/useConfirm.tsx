import { useCallback, useRef, useState } from 'react';

import ConfirmDialog from '../components/ConfirmDialog';

interface ConfirmOptions {
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
}

export function useConfirm() {
  const [dialog, setDialog] = useState<{ message: string; options: ConfirmOptions } | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((message: string, options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setDialog({ message, options });
    });
  }, []);

  const handleClose = useCallback((value: boolean) => {
    setDialog(null);
    resolver.current?.(value);
    resolver.current = null;
  }, []);

  const confirmDialog = dialog ? (
    <ConfirmDialog
      message={dialog.message}
      confirmLabel={dialog.options.confirmLabel}
      cancelLabel={dialog.options.cancelLabel}
      danger={dialog.options.danger}
      onConfirm={() => handleClose(true)}
      onCancel={() => handleClose(false)}
    />
  ) : null;

  return { confirm, confirmDialog };
}
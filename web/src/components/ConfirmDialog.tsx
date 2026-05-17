import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoadingLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmLoadingLabel,
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmClasses = destructive
    ? "bg-red text-white hover:bg-red/90 disabled:opacity-50"
    : "bg-navy text-white hover:bg-navy-90 disabled:opacity-50";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!loading) onCancel();
        }}
      />
      <div className="relative w-full max-w-md rounded-lg bg-white border border-border shadow-xl p-6">
        <h2
          id="confirm-dialog-title"
          className="font-serif text-xl text-navy mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-navy-80 leading-6 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-navy transition hover:bg-grey disabled:opacity-50"
          >
            {cancelLabel ?? t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${confirmClasses}`}
          >
            {loading
              ? (confirmLoadingLabel ?? t("common.deleting"))
              : (confirmLabel ?? t("common.delete"))}
          </button>
        </div>
      </div>
    </div>
  );
}

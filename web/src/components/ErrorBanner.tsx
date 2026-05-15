import { useTranslation } from "react-i18next";
import type { ApiError } from "../types";

export default function ErrorBanner({ error }: { error: unknown }) {
  const { t } = useTranslation();
  if (!error) return null;
  const e = error as ApiError;
  return (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-red/30 bg-red/5 px-4 py-3 text-red text-sm"
    >
      <strong className="font-semibold">{e.code ?? t("common.error")}</strong>:{" "}
      {e.message ?? String(error)}
    </div>
  );
}

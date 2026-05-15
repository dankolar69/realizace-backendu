import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="text-center py-20">
      <p className="text-sm font-medium text-green">{t("notFound.code")}</p>
      <h1 className="font-serif text-4xl font-normal text-navy mt-2">
        {t("notFound.title")}
      </h1>
      <p className="text-navy-60 mt-3 mb-8">{t("notFound.message")}</p>
      <Link
        to="/"
        className="inline-flex items-center gap-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-90"
      >
        {t("notFound.back")}
      </Link>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { articlesApi } from "../api/articles";
import type { Article } from "../types";
import ErrorBanner from "../components/ErrorBanner";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ArticleDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    articlesApi
      .get(id)
      .then(setArticle)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await articlesApi.remove(id);
      navigate("/");
    } catch (e) {
      setError(e);
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (loading) return <p className="text-navy-60">{t("common.loading")}</p>;
  if (error) return <ErrorBanner error={error} />;
  if (!article) return <p className="text-navy-60">{t("common.notFound")}</p>;

  return (
    <article className="max-w-3xl mx-auto">
      <p className="mb-6">
        <Link
          to="/"
          className="text-sm text-navy hover:text-navy-80 hover:underline"
        >
          {t("article.back")}
        </Link>
      </p>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full max-h-[420px] object-cover bg-grey"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}

        <div className="p-8">
          <header className="mb-6">
            <div className="flex items-center gap-2 text-xs mb-3">
              {article.topic ? (
                <span className="inline-block px-2 py-0.5 rounded-full bg-navy-10 text-navy font-medium">
                  {article.topic.name}
                </span>
              ) : null}
              <span className="text-navy-50">
                {new Date(article.createdDate).toLocaleString()}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-navy leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-navy-60 mt-2">
              {t("common.by")}{" "}
              <span className="font-medium text-navy-80">
                {article.authorName}
              </span>
            </p>
          </header>

          <div className="text-navy-90 leading-7 space-y-4 text-[15px]">
            {article.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="flex gap-2 mt-10 pt-6 border-t border-border">
            <Link
              to={`/articles/${article.id}/edit`}
              className="inline-flex items-center gap-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-90"
            >
              {t("common.edit")}
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="inline-flex items-center gap-1 rounded-lg border border-red/40 bg-white px-4 py-2.5 text-sm font-medium text-red transition hover:bg-red/5 disabled:opacity-50"
            >
              {deleting ? t("common.deleting") : t("common.delete")}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t("article.deleteTitle")}
        message={t("article.confirmDelete")}
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}

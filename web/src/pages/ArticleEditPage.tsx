import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArticleForm, { type ArticleFormValues } from "../components/ArticleForm";
import { articlesApi } from "../api/articles";
import type { Article } from "../types";
import ErrorBanner from "../components/ErrorBanner";

export default function ArticleEditPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    articlesApi
      .get(id)
      .then(setArticle)
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: ArticleFormValues) {
    if (!id) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await articlesApi.update({
        id,
        title: values.title,
        content: values.content,
        authorName: values.authorName,
        topicId: values.topicId,
        ...(values.imageUrl ? { imageUrl: values.imageUrl } : {}),
      });
      navigate(`/articles/${id}`);
    } catch (e) {
      setSubmitError(e);
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-navy-60">{t("common.loading")}</p>;
  if (loadError) return <ErrorBanner error={loadError} />;
  if (!article) return <p className="text-navy-60">{t("common.notFound")}</p>;

  return (
    <section className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-navy">
          {t("article.editTitle")}
        </h1>
        <p className="text-sm text-navy-60 mt-1">{t("article.editSubtitle")}</p>
      </header>
      <ArticleForm
        initial={article}
        submitLabel={t("article.form.submitEdit")}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={submitError}
      />
    </section>
  );
}

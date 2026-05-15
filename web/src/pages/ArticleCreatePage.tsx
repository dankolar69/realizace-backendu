import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArticleForm, { type ArticleFormValues } from "../components/ArticleForm";
import { articlesApi } from "../api/articles";

export default function ArticleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: ArticleFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await articlesApi.create({
        title: values.title,
        content: values.content,
        authorName: values.authorName,
        topicId: values.topicId,
        ...(values.imageUrl ? { imageUrl: values.imageUrl } : {}),
      });
      navigate(`/articles/${created.id}`);
    } catch (e) {
      setError(e);
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-navy">
          {t("article.createTitle")}
        </h1>
        <p className="text-sm text-navy-60 mt-1">
          {t("article.createSubtitle")}
        </p>
      </header>
      <ArticleForm
        submitLabel={t("article.form.submitCreate")}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </section>
  );
}

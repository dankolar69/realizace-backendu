import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Article, Topic } from "../types";
import { topicsApi } from "../api/topics";
import ErrorBanner from "./ErrorBanner";
import SelectFilter from "./SelectFilter";

export type ArticleFormValues = {
  title: string;
  content: string;
  authorName: string;
  topicId: string;
  imageUrl: string;
};

type Props = {
  initial?: Partial<Article>;
  submitLabel: string;
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  submitting?: boolean;
  error?: unknown;
};

const empty: ArticleFormValues = {
  title: "",
  content: "",
  authorName: "",
  topicId: "",
  imageUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm leading-[1.4] text-navy placeholder:text-navy-50 transition focus:outline-none focus:ring-2 focus:ring-navy-10 focus:border-navy";

const inputErrorClass =
  "border-red focus:border-red focus:ring-red/20";

const labelTextClass = "text-sm font-medium text-navy-80";

type FieldErrors = {
  topicId?: string;
  imageUrl?: string;
};

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ArticleForm({
  initial,
  submitLabel,
  onSubmit,
  submitting,
  error,
}: Props) {
  const { t } = useTranslation();
  const [values, setValues] = useState<ArticleFormValues>({
    ...empty,
    ...(initial
      ? {
          title: initial.title ?? "",
          content: initial.content ?? "",
          authorName: initial.authorName ?? "",
          topicId: initial.topicId ?? "",
          imageUrl: initial.imageUrl ?? "",
        }
      : null),
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<unknown>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    topicsApi
      .list()
      .then((r) => setTopics(r.itemList))
      .catch(setTopicsError)
      .finally(() => setTopicsLoading(false));
  }, []);

  const topicOptions = useMemo(
    () => topics.map((tp) => ({ value: tp.id, label: tp.name })),
    [topics],
  );

  function validate(v: ArticleFormValues): FieldErrors {
    const errs: FieldErrors = {};
    if (!v.topicId) errs.topicId = t("article.form.errors.topicRequired");
    if (!v.imageUrl.trim())
      errs.imageUrl = t("article.form.errors.imageUrlRequired");
    else if (!isValidUrl(v.imageUrl.trim()))
      errs.imageUrl = t("article.form.errors.imageUrlInvalid");
    return errs;
  }

  function update<K extends keyof ArticleFormValues>(
    key: K,
    value: ArticleFormValues[K],
  ) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (submitted) setFieldErrors(validate(next));
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    void onSubmit(values);
  }

  return (
    <form
      className="bg-white border border-border rounded-lg p-6 flex flex-col gap-5 w-full"
      onSubmit={handleSubmit}
      noValidate
    >
      <ErrorBanner error={error} />
      <ErrorBanner error={topicsError} />

      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{t("article.form.title")}</span>
        <input
          type="text"
          required
          maxLength={150}
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{t("article.form.topic")}</span>
        <div>
          <SelectFilter
            label={
              topicsLoading
                ? t("article.form.loadingTopics")
                : t("article.form.selectTopic")
            }
            ariaLabel={t("article.form.topic")}
            options={topicOptions}
            selected={values.topicId}
            onChange={(v) => update("topicId", v)}
            allOptionLabel={t("article.form.noTopic")}
          />
        </div>
        {fieldErrors.topicId ? (
          <p role="alert" className="text-xs text-red font-medium mt-0.5">
            {fieldErrors.topicId}
          </p>
        ) : null}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{t("article.form.author")}</span>
        <input
          type="text"
          required
          maxLength={100}
          value={values.authorName}
          onChange={(e) => update("authorName", e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{t("article.form.imageUrl")}</span>
        <input
          type="url"
          required
          value={values.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          placeholder={t("article.form.imagePlaceholder")}
          className={`${inputClass} ${
            fieldErrors.imageUrl ? inputErrorClass : ""
          }`}
          aria-invalid={Boolean(fieldErrors.imageUrl)}
        />
        {fieldErrors.imageUrl ? (
          <p role="alert" className="text-xs text-red font-medium mt-0.5">
            {fieldErrors.imageUrl}
          </p>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{t("article.form.content")}</span>
        <textarea
          required
          rows={10}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className={`${inputClass} resize-y font-[inherit] leading-6`}
        />
      </label>

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t("common.saving") : submitLabel}
        </button>
      </div>
    </form>
  );
}

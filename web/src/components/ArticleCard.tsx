import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Article, Topic } from "../types";

type Props = {
  article: Article;
  topic?: Topic;
};

const EXCERPT_LEN = 100;

export default function ArticleCard({ article, topic }: Props) {
  const { t } = useTranslation();
  const isTruncated = article.content.length > EXCERPT_LEN;
  const excerpt = isTruncated
    ? article.content.slice(0, EXCERPT_LEN).trimEnd()
    : article.content;

  return (
    <article className="group">
      <Link
        to={`/articles/${article.id}`}
        className="block h-full bg-white border border-border rounded-lg overflow-hidden flex flex-col transition-all hover:border-navy-20 hover:shadow-sm hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-10 focus-visible:border-navy"
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full aspect-video object-cover bg-grey"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            {topic ? (
              <span className="inline-block px-2 py-0.5 rounded-full bg-navy-10 text-navy font-medium">
                {topic.name}
              </span>
            ) : null}
            <span className="text-navy-50">
              {new Date(article.createdDate).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-serif text-[19px] leading-snug font-normal text-navy group-hover:text-navy-80 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-navy-60">
            {t("common.by")} {article.authorName}
          </p>
          <p className="text-[13px] text-navy-70 leading-snug mt-0.5 line-clamp-2">
            {article.content}
          </p>
          {isTruncated ? (
            <span className="read-more text-[13px] mt-0.5">
              {t("common.readMore")}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

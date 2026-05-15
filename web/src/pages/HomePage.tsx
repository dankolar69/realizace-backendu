import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { articlesApi } from "../api/articles";
import { topicsApi } from "../api/topics";
import type { Article, Topic } from "../types";
import ArticleCard from "../components/ArticleCard";
import ErrorBanner from "../components/ErrorBanner";
import MultiSelectFilter from "../components/MultiSelectFilter";

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 11l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 8.5V3a1 1 0 011-1h5.5a1 1 0 01.7.3l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4 0l-5-5a1 1 0 01-.3-.7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FittingTopicPills({
  topics,
  activeIds,
  onToggle,
}: {
  topics: Topic[];
  activeIds: string[];
  onToggle: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const pills = Array.from(container.children) as HTMLElement[];
      pills.forEach((p) => {
        p.style.display = "";
      });
      const containerRight = container.getBoundingClientRect().right;
      const rights = pills.map((p) => p.getBoundingClientRect().right);
      pills.forEach((el, i) => {
        if (rights[i] > containerRight + 0.5) {
          el.style.display = "none";
        }
      });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    let fontReady: Promise<FontFaceSet> | undefined;
    if (document.fonts && document.fonts.ready) {
      fontReady = document.fonts.ready;
      void fontReady.then(() => measure());
    }
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [topics, activeIds]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-nowrap items-center gap-2 mb-8 overflow-hidden w-full"
    >
      {topics.map((t) => {
        const active = activeIds.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            aria-pressed={active}
            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "border-navy bg-navy text-white"
                : "border-border bg-white text-navy-70 hover:border-navy-30 hover:text-navy"
            }`}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [topicMap, setTopicMap] = useState<Record<string, Topic>>({});
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    topicsApi
      .list()
      .then((r) => setTopics(r.itemList))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    articlesApi
      .list({
        topicId: topicIds.length === 1 ? topicIds[0] : undefined,
        searchQuery: searchQuery || undefined,
      })
      .then((r) => {
        setArticles(r.itemList);
        setTopicMap(r.topicMap);
        setError(null);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [topicIds, searchQuery]);

  const topicOptions = useMemo(
    () => topics.map((tp) => ({ value: tp.id, label: tp.name })),
    [topics],
  );

  function toggleTopic(id: string) {
    setTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  const filteredArticles = useMemo(() => {
    if (topicIds.length < 2) return articles;
    const set = new Set(topicIds);
    return articles.filter((a) => set.has(a.topicId));
  }, [articles, topicIds]);

  const hasActiveFilters = topicIds.length > 0 || searchQuery !== "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function clearAll() {
    setSearchInput("");
    setSearchQuery("");
    setTopicIds([]);
  }

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-navy">
          {t("home.title")}
        </h1>
        <p className="text-sm text-navy-60 mt-1">{t("home.subtitle")}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <form className="relative flex-1 min-w-[260px]" onSubmit={handleSearch}>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-50" />
          <input
            type="search"
            placeholder={t("home.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm leading-[1.4] text-navy placeholder:text-navy-50 transition focus:outline-none focus:ring-2 focus:ring-navy-10 focus:border-navy"
          />
        </form>

        <MultiSelectFilter
          label={t("home.topicFilter")}
          ariaLabel={t("home.topicFilterAria")}
          icon={TagIcon}
          options={topicOptions}
          selected={topicIds}
          onChange={setTopicIds}
        />

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-sm font-medium text-red transition hover:text-red/80"
          >
            <XIcon className="h-4 w-4" />
            {t("common.clear")}
          </button>
        ) : null}
      </div>

      {topics.length > 0 ? (
        <FittingTopicPills
          topics={topics}
          activeIds={topicIds}
          onToggle={toggleTopic}
        />
      ) : null}

      <ErrorBanner error={error} />

      {loading ? (
        <p className="text-navy-60">{t("common.loading")}</p>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-lg py-16 text-center">
          <p className="text-navy-60">{t("home.noArticles")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((a) => (
            <ArticleCard key={a.id} article={a} topic={topicMap[a.topicId]} />
          ))}
        </div>
      )}
    </section>
  );
}

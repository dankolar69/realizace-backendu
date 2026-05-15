import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { topicsApi } from "../api/topics";
import type { Topic } from "../types";
import ErrorBanner from "../components/ErrorBanner";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm leading-[1.4] text-navy placeholder:text-navy-50 transition focus:outline-none focus:ring-2 focus:ring-navy-10 focus:border-navy";

const primaryBtn =
  "inline-flex items-center gap-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-90 disabled:opacity-50 disabled:cursor-not-allowed";

const ghostBtn =
  "inline-flex items-center rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-navy-80 transition hover:bg-grey";

const dangerBtn =
  "inline-flex items-center rounded-lg border border-red/40 bg-white px-3 py-2 text-sm font-medium text-red transition hover:bg-red/5";

export default function TopicsPage() {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    return topicsApi
      .list()
      .then((r) => {
        setTopics(r.itemList);
        setError(null);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await topicsApi.create({ name: newName.trim() });
      setNewName("");
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(topic: Topic) {
    setEditingId(topic.id);
    setEditingName(topic.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function saveEdit() {
    if (!editingId || !editingName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await topicsApi.update({ id: editingId, name: editingName.trim() });
      cancelEdit();
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(topic: Topic) {
    if (!confirm(t("topics.confirmDelete", { name: topic.name }))) return;
    setError(null);
    try {
      await topicsApi.remove(topic.id);
      await refresh();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-navy">
          {t("topics.title")}
        </h1>
        <p className="text-sm text-navy-60 mt-1">{t("topics.subtitle")}</p>
      </header>

      <ErrorBanner error={error} />

      <form className="flex gap-2 mb-8" onSubmit={handleCreate}>
        <input
          type="text"
          maxLength={50}
          placeholder={t("topics.newPlaceholder")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
          className={inputClass}
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className={primaryBtn}
        >
          {creating ? t("common.adding") : t("common.add")}
        </button>
      </form>

      {loading ? (
        <p className="text-navy-60">{t("common.loading")}</p>
      ) : topics.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-lg py-12 text-center">
          <p className="text-navy-60">{t("topics.noTopics")}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {topics.map((tp) => (
            <li
              key={tp.id}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg transition-colors hover:border-navy-20"
            >
              {editingId === tp.id ? (
                <>
                  <input
                    type="text"
                    maxLength={50}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className={inputClass}
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={saving || !editingName.trim()}
                      className={primaryBtn}
                    >
                      {saving ? t("common.saving") : t("common.save")}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg text-sm text-navy-60 hover:bg-grey transition-colors"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-navy">
                    {tp.name}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(tp)}
                      className={ghostBtn}
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tp)}
                      className={dangerBtn}
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

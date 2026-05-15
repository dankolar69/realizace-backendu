import { apiGet, apiPost } from "./client";
import type { Article, ArticleListResponse } from "../types";

export type ArticleCreateInput = {
  title: string;
  content: string;
  authorName: string;
  topicId: string;
  imageUrl?: string;
};

export type ArticleUpdateInput = Partial<ArticleCreateInput> & { id: string };

export const articlesApi = {
  list: (filter?: { topicId?: string; searchQuery?: string }) =>
    apiGet<ArticleListResponse>("/article/list", filter),
  get: (id: string) => apiGet<Article>("/article/get", { id }),
  create: (data: ArticleCreateInput) => apiPost<Article>("/article/create", data),
  update: (data: ArticleUpdateInput) => apiPost<Article>("/article/update", data),
  remove: (id: string) =>
    apiPost<Record<string, never>>("/article/delete", { id }),
};

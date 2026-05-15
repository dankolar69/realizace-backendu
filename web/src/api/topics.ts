import { apiGet, apiPost } from "./client";
import type { Topic, TopicListResponse } from "../types";

export const topicsApi = {
  list: () => apiGet<TopicListResponse>("/topic/list"),
  get: (id: string) => apiGet<Topic>("/topic/get", { id }),
  create: (data: { name: string }) => apiPost<Topic>("/topic/create", data),
  update: (data: { id: string; name: string }) =>
    apiPost<Topic>("/topic/update", data),
  remove: (id: string) => apiPost<Record<string, never>>("/topic/delete", { id }),
};

export type Topic = {
  id: string;
  name: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  imageUrl?: string;
  topicId: string;
  createdDate: string;
  topic?: Topic;
};

export type ArticleListResponse = {
  itemList: Article[];
  topicMap: Record<string, Topic>;
};

export type TopicListResponse = {
  itemList: Topic[];
};

export type ApiError = {
  code?: string;
  message: string;
  validationError?: unknown;
};

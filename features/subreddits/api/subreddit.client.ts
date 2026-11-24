import { api } from "@/lib/api"
import type { ApiResponse, PaginationMeta } from "@/types/api-response"

type Order = "asc" | "desc"

type SubredditSortBy =
  | "n_total"
  | "pct_positive"
  | "pct_negative"
  | "pct_neutral"
  | "avg_score"
  | "n_posts"
  | "subreddit"

export type SubredditSentiment =  {
  subreddit: string
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  avg_score: number
  n_posts: number
}

type SubredditParams = {
  min_comments?: number
  search?: string
  sort_by?: SubredditSortBy
  order?: Order
  page?: number
  page_size?: number
}

type TopSubredditParams = {
  metric?: string
  limit?: number
  min_comments?: number
}

export const subredditsApi = {
  getAll(params?: SubredditParams) {
    return api.get<ApiResponse<SubredditSentiment[], PaginationMeta>>(
      "/analytics/subreddits",
      params
    )
  },

  getTop(params?: TopSubredditParams) {
    return api.get<ApiResponse<SubredditSentiment[], Record<string, unknown>>>(
      "/analytics/subreddits/top",
      params
    )
  },
}
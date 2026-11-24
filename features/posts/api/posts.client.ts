import { api } from "@/lib/api"
import type { ApiResponse, PaginationMeta } from "@/types/api-response"

type Order = "asc" | "desc"
type PostMetric = "volume" | "pct_negative" | "pct_positive" | "balance"

type PostSortBy =
  | "n_total"
  | "pct_positive"
  | "pct_negative"
  | "pct_neutral"
  | "balance_index"
  | "post_score"
  | "post_upvote_ratio"
  | "post_created_time"

export type PostSentiment = {
  post_id: string
  subreddit: string
  post_title: string
  post_score: number
  post_upvote_ratio: number
  post_created_time: string
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  balance_index: number
}

export type PostCommentCountDistribution = {
  bin_index: number
  log10_start: number
  log10_end: number
  comments_start: number
  comments_end: number
  n_posts: number
}

type PostsParams = {
  min_comments?: number
  subreddit?: string
  search?: string
  sort_by?: PostSortBy
  order?: Order
  page?: number
  page_size?: number
}

type TopPostsParams = {
  metric?: PostMetric
  limit?: number
  min_comments?: number
}

type CommentCountDistributionParams = {
  bins?: number
}

export const postsApi = {
  getAll(params?: PostsParams) {
    return api.get<ApiResponse<PostSentiment[], PaginationMeta>>(
      "/analytics/posts",
      params
    )
  },

  getTop(params?: TopPostsParams) {
    return api.get<ApiResponse<PostSentiment[], Record<string, unknown>>>(
      "/analytics/posts/top",
      params
    )
  },

  getCommentCountDistribution(params?: CommentCountDistributionParams) {
    return api.get<
      ApiResponse<PostCommentCountDistribution[], Record<string, unknown>>
    >("/analytics/posts/comment-count-distribution", params)
  },
}
import { api } from "@/lib/api"
import type { ApiResponse, PaginationMeta } from "@/types/api-response"

type Sentiment = "positive" | "negative" | "neutral"
type KeywordSourceField = "comment" | "post_title" | "post_body"
type KeywordDirection = "negative" | "positive"

export type TopKeyword =  {
  keyword: string
  n_occurrences: number
}

export type DistinctiveKeyword =  {
  keyword: string
  n_occurrences: number
  per_10k_tokens: number
  log2_ratio: number
}

export type NegativeVsPositiveKeyword =  {
  keyword: string
  n_positive: number
  n_negative: number
  neg_vs_pos_log2_ratio: number
}

export type KeywordTheme =  {
  theme: string
  sentiment: Sentiment
  n_occurrences: number
  per_10k_tokens: number
}

export type KeywordThemeDefinition =  {
  theme: string
  keywords: string[]
}

type TopKeywordsParams =  {
  source_field?: KeywordSourceField
  sentiment?: Sentiment
  page?: number
  page_size?: number
}

type DistinctiveKeywordsParams =  {
  sentiment: Sentiment
  limit?: number
  min_occurrences?: number
}

type NegativeVsPositiveParams =  {
  direction?: KeywordDirection
  limit?: number
  min_occurrences?: number
}

type TotalMeta = { total: number }

export const keywordsApi = {
  getTop(params?: TopKeywordsParams) {
    return api.get<ApiResponse<TopKeyword[], PaginationMeta>>(
      "/analytics/keywords/top",
      params
    )
  },

  getDistinctive(params: DistinctiveKeywordsParams) {
    return api.get<ApiResponse<DistinctiveKeyword[], Record<string, unknown>>>(
      "/analytics/keywords/distinctive",
      params
    )
  },

  getNegativeVsPositive(params?: NegativeVsPositiveParams) {
    return api.get<
      ApiResponse<NegativeVsPositiveKeyword[], Record<string, unknown>>
    >("/analytics/keywords/negative-vs-positive", params)
  },

  getThemes() {
    return api.get<ApiResponse<KeywordTheme[], TotalMeta>>(
      "/analytics/keywords/themes"
    )
  },

  getThemeDefinitions() {
    return api.get<ApiResponse<KeywordThemeDefinition[], TotalMeta>>(
      "/analytics/keywords/themes/definitions"
    )
  },
}
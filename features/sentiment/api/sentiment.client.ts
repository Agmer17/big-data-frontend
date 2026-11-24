import { api } from "@/lib/api"
import type { ApiResponse, PaginationMeta } from "@/types/api-response"

type Sentiment = "positive" | "negative" | "neutral"
type Order = "asc" | "desc"
type TopMetric = "volume" | "pct_positive" | "pct_negative"

export type OverallSentiment = {
  sentiment: Sentiment
  n_comments: number
  percentage: number
}

export type OverallSentimentSummary =  {
  total_comments: number
  n_positive: number
  n_negative: number
  n_neutral: number
  positive_to_negative_ratio: number
}

export type DailySentiment = {
  comment_date: string
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  n_total_ma7: number | null
}

export type MonthlySentiment = {
  month_start: string
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  d_pct_positive_pp: number | null
  d_pct_negative_pp: number | null
  d_pct_neutral_pp: number | null
}

export type TopSentimentPeriod = {
  comment_date?: string
  month_start?: string
  n_total: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
}

type DailyParams = {
  start_date?: string
  end_date?: string
  order?: Order
  page?: number
  page_size?: number
}

type MonthlyParams = {
  start_month?: string
  end_month?: string
  order?: Order
}

type TopParams = {
  metric?: TopMetric
  limit?: number
  min_comments?: number
}

export const sentimentApi = {
  getOverall() {
    return api.get<ApiResponse<OverallSentiment[], { total: number }>>(
      "/analytics/sentiment/overall"
    )
  },

  getOverallSummary() {
    return api.get<ApiResponse<OverallSentimentSummary, Record<string, never>>>(
      "/analytics/sentiment/overall/summary"
    )
  },

  getDaily(params?: DailyParams) {
    return api.get<ApiResponse<DailySentiment[], PaginationMeta>>(
      "/analytics/sentiment/daily",
      params
    )
  },

  getDailyTop(params?: TopParams) {
    return api.get<ApiResponse<TopSentimentPeriod[], Record<string, unknown>>>(
      "/analytics/sentiment/daily/top",
      params
    )
  },

  getMonthly(params?: MonthlyParams) {
    return api.get<ApiResponse<MonthlySentiment[], { total: number }>>(
      "/analytics/sentiment/monthly",
      params
    )
  },

  getMonthlyTop(params?: TopParams) {
    return api.get<ApiResponse<TopSentimentPeriod[], Record<string, unknown>>>(
      "/analytics/sentiment/monthly/top",
      params
    )
  },
}
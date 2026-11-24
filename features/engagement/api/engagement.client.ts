import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api-response"

type TotalMeta = { total: number }

export interface ScoreDistribution {
  score_category: string
  category_order: number
  n_comments: number
  percentage: number
}

export interface EngagementBySentiment {
  sentiment: "positive" | "negative" | "neutral"
  n_comments: number
  avg_score: number
  avg_ups: number
  avg_downs: number
}

export interface ScoreCategorySentiment {
  score_category: string
  category_order: number
  n_comments: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
}

export interface ControversialitySentiment {
  controversiality: number
  n_comments: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
}

export interface ControversialityBySentiment {
  sentiment: "positive" | "negative" | "neutral"
  pct_controversial: number
}

export const engagementApi = {
  getScoreDistribution() {
    return api.get<ApiResponse<ScoreDistribution[], TotalMeta>>(
      "/analytics/engagement/score-distribution"
    )
  },

  getBySentiment() {
    return api.get<ApiResponse<EngagementBySentiment[], TotalMeta>>(
      "/analytics/engagement/by-sentiment"
    )
  },

  getScoreCategorySentiment() {
    return api.get<ApiResponse<ScoreCategorySentiment[], TotalMeta>>(
      "/analytics/engagement/score-category-sentiment"
    )
  },

  getControversiality() {
    return api.get<ApiResponse<ControversialitySentiment[], TotalMeta>>(
      "/analytics/engagement/controversiality"
    )
  },

  getControversialityBySentiment() {
    return api.get<ApiResponse<ControversialityBySentiment[], TotalMeta>>(
      "/analytics/engagement/controversiality/by-sentiment"
    )
  },
}
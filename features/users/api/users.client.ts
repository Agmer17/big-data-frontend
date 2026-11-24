import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api-response"

export type KarmaSentiment = {
  karma_category: string
  category_order: number
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  avg_score: number
  n_accounts: number
}

export type KarmaWeightedComparison = {
  karma_category: string
  category_order: number
  cw_pct_positive: number
  aw_pct_positive: number
  cw_pct_negative: number
  aw_pct_negative: number
  cw_pct_neutral: number
  aw_pct_neutral: number
  n_accounts_aw: number
}

export type AccountAgeSentiment = {
  age_category: string
  category_order: number
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  n_accounts: number
}

export type VerificationSentiment = {
  verified_status: "TRUE" | "FALSE" | "NULL"
  n_total: number
  n_positive: number
  n_negative: number
  n_neutral: number
  pct_positive: number
  pct_negative: number
  pct_neutral: number
  n_accounts: number
}

type TotalMeta = { total: number }

export const usersApi = {
  getKarmaSentiment() {
    return api.get<ApiResponse<KarmaSentiment[], TotalMeta>>(
      "/analytics/users/karma/sentiment"
    )
  },

  getKarmaWeightedComparison() {
    return api.get<ApiResponse<KarmaWeightedComparison[], TotalMeta>>(
      "/analytics/users/karma/weighted-comparison"
    )
  },

  getAccountAge() {
    return api.get<ApiResponse<AccountAgeSentiment[], TotalMeta>>(
      "/analytics/users/account-age"
    )
  },

  getVerification() {
    return api.get<ApiResponse<VerificationSentiment[], TotalMeta>>(
      "/analytics/users/verification"
    )
  },
}
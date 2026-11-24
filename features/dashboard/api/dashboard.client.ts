import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api-response"

export interface DashboardSummary {
  dominant_sentiment: {
    sentiment: string
    n_comments: number
    percentage: number
    positive_to_negative_ratio: number
  }

  peak_activity: {
    busiest_day: {
      comment_date: string
      n_total: number
    }
    busiest_month: {
      month_start: string
      n_total: number
    }
    most_negative_month: {
      month_start: string
      pct_negative: number
    }
    most_positive_month: {
      month_start: string
      pct_positive: number
    }
  }

  subreddits: {
    largest: {
      subreddit: string
      n_total: number
      pct_of_all_comments: number
    }[]
    highest_pct_negative: {
      subreddit: string
      pct_negative: number
    }
    lowest_pct_negative: {
      subreddit: string
      pct_negative: number
    }
  }

  karma_negative_by_category: {
    karma_category: string
    n_total: number
    comment_weighted_pct_negative: number
    account_weighted_pct_negative: number
  }[]

  engagement_by_sentiment: {
    sentiment: string
    avg_score: number
    avg_ups: number
    avg_downs: number
  }[]

  largest_discussion_post: {
    post_id: string
    subreddit: string
    post_title: string
    n_total: number
    pct_negative: number
  }

  top_comment_keywords: string[]

  association_strength: {
    analysis: string
    cramers_v: number | null
  }[]
}

export const dashboardApi = {
  getSummary() {
    return api.get<ApiResponse<DashboardSummary, Record<string, never>>>(
      "/analytics/summary"
    )
  },
}
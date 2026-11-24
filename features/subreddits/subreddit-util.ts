import type { ChartConfig } from "@/components/ui/chart"

export type SubredditMetricOption = "volume" | "pct_negative" | "pct_positive"
export type SubredditChartViewMode = "stacked" | "volume"
export type SubredditSortField =
  | "n_total"
  | "pct_positive"
  | "pct_negative"
  | "pct_neutral"
  | "avg_score"
  | "n_posts"
  | "subreddit"

export const SUBREDDIT_CHART_CONFIG = {
  negative: {
    label: "Negatif",
    color: "var(--chart-1)",
  },
  positive: {
    label: "Positif",
    color: "var(--chart-2)",
  },
  neutral: {
    label: "Netral",
    color: "var(--chart-3)",
  },
  n_total: {
    label: "Total Komentar",
    color: "var(--chart-4)",
  },
  avg_score: {
    label: "Rata-rata Skor",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const intFormatter = new Intl.NumberFormat("id-ID")
const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const percentFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const scoreFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatSubredditName(name?: string): string {
  if (!name) return "—"
  return name.startsWith("r/") ? name : `r/${name}`
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return intFormatter.format(Math.round(value))
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return compactFormatter.format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return `${percentFormatter.format(value)}%`
}

export function formatScore(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return scoreFormatter.format(value)
}
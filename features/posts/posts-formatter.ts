import type { ChartConfig } from "@/components/ui/chart"

export type TopPostMetricOption = "volume" | "pct_negative" | "pct_positive" | "balance"

export type PostSortField =
  | "n_total"
  | "pct_positive"
  | "pct_negative"
  | "pct_neutral"
  | "balance_index"
  | "post_score"
  | "post_upvote_ratio"
  | "post_created_time"

export const POSTS_CHART_CONFIG = {
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
  n_posts: {
    label: "Jumlah Post",
    color: "var(--chart-4)",
  },
  n_total: {
    label: "Total Komentar",
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
const decimalFormatter = new Intl.NumberFormat("id-ID", {
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

export function formatUpvoteRatio(ratio: number | null | undefined): string {
  if (ratio == null || Number.isNaN(ratio)) return "—"
  const normalized = ratio <= 1 ? ratio * 100 : ratio
  return `${percentFormatter.format(normalized)}%`
}

export function formatDecimal(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return decimalFormatter.format(value)
}

export function formatPostDate(dateStr?: string): string {
  if (!dateStr) return "—"
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr

  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
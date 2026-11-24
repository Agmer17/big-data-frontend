import type { ChartConfig } from "@/components/ui/chart"

export type SentimentGranularity = "monthly" | "daily"
export type TemporalMetricMode = "percentage" | "volume"
export type TopMetricOption = "volume" | "pct_negative" | "pct_positive"

export const SENTIMENT_CHART_CONFIG = {
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
  n_total_ma7: {
    label: "Rata-rata 7 Hari (MA-7)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const intFormatter = new Intl.NumberFormat("id-ID")
const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const ratioFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

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
  return `${decimalFormatter.format(value)}%`
}

export function formatPpDelta(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${decimalFormatter.format(value)} pp`
}

export function formatRatio(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return `${ratioFormatter.format(value)} : 1`
}

export function formatDateLabel(dateStr?: string, mode: "short" | "full" = "short"): string {
  if (!dateStr) return "—"
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr

  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: mode === "short" ? "short" : "long",
    year: mode === "full" ? "numeric" : undefined,
  })
}

export function formatMonthLabel(monthStr?: string, mode: "short" | "full" = "short"): string {
  if (!monthStr) return "—"
  const parsed = new Date(monthStr)
  if (Number.isNaN(parsed.getTime())) return monthStr

  return parsed.toLocaleDateString("id-ID", {
    month: mode === "short" ? "short" : "long",
    year: "numeric",
  })
}
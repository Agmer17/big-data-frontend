import type { ChartConfig } from "@/components/ui/chart"

export type KeywordSentiment = "positive" | "negative" | "neutral"
export type KeywordSourceField = "comment" | "post_title" | "post_body"
export type KeywordDirection = "negative" | "positive"
export type ThemeMetricMode = "per_10k_tokens" | "n_occurrences"

export const KEYWORDS_CHART_CONFIG = {
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
  n_occurrences: {
    label: "Frekuensi",
    color: "var(--chart-4)",
  },
  log2_ratio: {
    label: "Log₂ Ratio",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const SENTIMENT_LABELS_ID: Record<KeywordSentiment, string> = {
  negative: "Negatif",
  neutral: "Netral",
  positive: "Positif",
}

const SOURCE_FIELD_LABELS_ID: Record<KeywordSourceField, string> = {
  comment: "Komentar",
  post_title: "Judul Post",
  post_body: "Isi Post",
}

export function formatSentimentLabel(sentiment: KeywordSentiment): string {
  return SENTIMENT_LABELS_ID[sentiment] ?? sentiment
}

export function formatSourceFieldLabel(source: KeywordSourceField): string {
  return SOURCE_FIELD_LABELS_ID[source] ?? source
}

export function formatThemeLabel(theme: string): string {
  if (!theme) return "—"
  return theme
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getSentimentChartColor(sentiment: KeywordSentiment): string {
  if (sentiment === "negative") return "var(--chart-1)"
  if (sentiment === "positive") return "var(--chart-2)"
  return "var(--chart-3)"
}

const intFormatter = new Intl.NumberFormat("id-ID")
const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const percentFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return intFormatter.format(Math.round(value))
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return compactFormatter.format(value)
}

export function formatDecimal(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return decimalFormatter.format(value)
}

export function formatSignedDecimal(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${decimalFormatter.format(value)}`
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return `${percentFormatter.format(value)}%`
}
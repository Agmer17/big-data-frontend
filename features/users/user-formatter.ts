import type { ChartConfig } from "@/components/ui/chart"

export type KarmaChartViewMode = "stacked" | "volume_score"
export type WeightedPolarityMetric = "negative" | "positive" | "neutral"
export type AgeChartViewMode = "stacked" | "volume"

export const USERS_CHART_CONFIG = {
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
    label: "Skor Rerata",
    color: "var(--chart-2)",
  },
  cw: {
    label: "Comment-Weighted",
    color: "var(--chart-1)",
  },
  aw: {
    label: "Account-Weighted",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const KARMA_LABELS_ID: Record<string, string> = {
  "Negative karma": "Karma Negatif",
  "Zero karma": "Karma Nol (0)",
  "Very low": "Sangat Rendah",
  Low: "Rendah",
  Moderate: "Menengah",
  High: "Tinggi",
  "Very high": "Sangat Tinggi",
  Unknown: "Tidak Diketahui",
}

const AGE_LABELS_ID: Record<string, string> = {
  "Less than 30 days": "< 30 Hari",
  "30-90 days": "30–90 Hari",
  "91-365 days": "91–365 Hari",
  "1-3 years": "1–3 Tahun",
  "More than 3 years": "> 3 Tahun",
  Unknown: "Tidak Diketahui",
}

const VERIFICATION_LABELS_ID: Record<string, string> = {
  TRUE: "Terverifikasi",
  FALSE: "Belum Terverifikasi",
  NULL: "Tidak Diketahui",
}

export function formatKarmaLabel(category: string): string {
  return KARMA_LABELS_ID[category] ?? category
}

export function formatAgeLabel(category: string): string {
  return AGE_LABELS_ID[category] ?? category
}

export function formatVerificationLabel(status: string): string {
  return VERIFICATION_LABELS_ID[status] ?? status
}

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

export function formatPpDelta(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${percentFormatter.format(value)} pp`
}

export function formatScore(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return scoreFormatter.format(value)
}
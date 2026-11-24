import type { ChartConfig } from "@/components/ui/chart"

export type ScoreChartViewMode = "sentiment_composition" | "volume_distribution"

export const ENGAGEMENT_CHART_CONFIG = {
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
    n_comments: {
        label: "Jumlah Komentar",
        color: "var(--chart-4)",
    },
    avg_score: {
        label: "Rerata Score",
        color: "var(--chart-4)",
    },
    avg_ups: {
        label: "Rerata Upvotes",
        color: "var(--chart-2)",
    },
    avg_downs: {
        label: "Rerata Downvotes",
        color: "var(--chart-1)",
    },
    pct_controversial: {
        label: "Kontroversial (%)",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const SENTIMENT_LABELS_ID: Record<"positive" | "negative" | "neutral", string> = {
    negative: "Negatif",
    neutral: "Netral",
    positive: "Positif",
}

const SCORE_CATEGORY_LABELS_ID: Record<string, string> = {
    "Negative (<0)": "Negatif (< 0)",
    Negative: "Negatif (< 0)",
    "Zero (0)": "Nol (0)",
    Zero: "Nol (0)",
    "Low (1-5)": "Rendah (1–5)",
    Low: "Rendah (1–5)",
    "Medium (6-25)": "Menengah (6–25)",
    Medium: "Menengah (6–25)",
    "Moderate (6-25)": "Menengah (6–25)",
    "High (26-100)": "Tinggi (26–100)",
    High: "Tinggi (26–100)",
    "Very high (>100)": "Sangat Tinggi (> 100)",
    "Viral (>100)": "Viral (> 100)",
    Viral: "Viral (> 100)",
}

const SENTIMENT_ORDER: Record<"positive" | "negative" | "neutral", number> = {
    negative: 1,
    neutral: 2,
    positive: 3,
}

export function getSentimentOrder(sentiment: "positive" | "negative" | "neutral"): number {
    return SENTIMENT_ORDER[sentiment] ?? 99
}

export function formatSentimentLabel(sentiment: "positive" | "negative" | "neutral"): string {
    return SENTIMENT_LABELS_ID[sentiment] ?? sentiment
}

export function formatScoreCategoryLabel(category: string): string {
    return SCORE_CATEGORY_LABELS_ID[category] ?? category
}

export function formatControversialityLabel(controversiality: number): string {
    return controversiality === 1 ? "Kontroversial (1)" : "Non-Kontroversial (0)"
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
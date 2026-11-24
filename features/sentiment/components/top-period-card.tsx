"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDailyTopSentiment, useMonthlyTopSentiment } from "../hooks/use-sentiment"
import {
    type SentimentGranularity,
    type TopMetricOption,
    formatDateLabel,
    formatMonthLabel,
    formatNumber,
    formatPercent,
} from "../sentiment-formatter"

const METRIC_OPTIONS: Array<{ value: TopMetricOption; label: string }> = [
    { value: "volume", label: "Volume" },
    { value: "pct_negative", label: "% Negatif" },
    { value: "pct_positive", label: "% Positif" },
]

export function TopPeriodsCard() {
    const [granularity, setGranularity] = React.useState<SentimentGranularity>("monthly")
    const [metric, setMetric] = React.useState<TopMetricOption>("volume")

    const monthlyTopQuery = useMonthlyTopSentiment({
        metric,
        limit: 6,
        min_comments: 50,
    })
    const dailyTopQuery = useDailyTopSentiment({
        metric,
        limit: 6,
        min_comments: 20,
    })

    const activeQuery = granularity === "monthly" ? monthlyTopQuery : dailyTopQuery
    const items = activeQuery.data ?? []

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">Periode Puncak</CardTitle>
                        <CardDescription>
                            Lonjakan aktivitas dan polaritas ekstrem
                        </CardDescription>
                    </div>

                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setGranularity("monthly")}
                            className={cn(
                                "rounded-md px-2 py-1 font-medium transition-colors",
                                granularity === "monthly"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Bulan
                        </button>
                        <button
                            type="button"
                            onClick={() => setGranularity("daily")}
                            className={cn(
                                "rounded-md px-2 py-1 font-medium transition-colors",
                                granularity === "daily"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Hari
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    {METRIC_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMetric(opt.value)}
                            className={cn(
                                "rounded-md px-2 py-1 font-medium transition-colors",
                                metric === opt.value
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {activeQuery.isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full rounded-md" />
                        ))}
                    </div>
                ) : activeQuery.isError || items.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data peringkat periode tidak tersedia.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const label =
                                granularity === "monthly"
                                    ? formatMonthLabel(item.month_start, "full")
                                    : formatDateLabel(item.comment_date, "full")

                            const primaryMetric =
                                metric === "volume"
                                    ? `${formatNumber(item.n_total)} komentar`
                                    : metric === "pct_negative"
                                        ? `${formatPercent(item.pct_negative)} negatif`
                                        : `${formatPercent(item.pct_positive)} positif`

                            return (
                                <div
                                    key={`${label}-${index}`}
                                    className="rounded-lg border border-border/70 bg-card p-2.5 transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground tabular-nums">
                                                {index + 1}
                                            </span>
                                            <span className="truncate font-medium">{label}</span>
                                        </div>
                                        <span className="shrink-0 font-semibold tabular-nums">
                                            {primaryMetric}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            style={{
                                                width: `${item.pct_negative}%`,
                                                backgroundColor: "var(--chart-1)",
                                            }}
                                            title={`Negatif: ${formatPercent(item.pct_negative)}`}
                                        />
                                        <div
                                            style={{
                                                width: `${item.pct_neutral}%`,
                                                backgroundColor: "var(--chart-3)",
                                            }}
                                            title={`Netral: ${formatPercent(item.pct_neutral)}`}
                                        />
                                        <div
                                            style={{
                                                width: `${item.pct_positive}%`,
                                                backgroundColor: "var(--chart-2)",
                                            }}
                                            title={`Positif: ${formatPercent(item.pct_positive)}`}
                                        />
                                    </div>

                                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                                        <span>Vol: {formatNumber(item.n_total)}</span>
                                        <span>
                                            Neg {formatPercent(item.pct_negative)} · Net{" "}
                                            {formatPercent(item.pct_neutral)} · Pos{" "}
                                            {formatPercent(item.pct_positive)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
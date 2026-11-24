"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
    SUBREDDIT_CHART_CONFIG,
    type SubredditChartViewMode,
    type SubredditMetricOption,
    formatCompactNumber,
    formatNumber,
    formatPercent,
    formatScore,
    formatSubredditName,
} from "../subreddit-util"
import { SubredditSentiment } from "../api/subreddit.client"
import { useTopSubreddits } from "../hooks/use-subreddit"

const METRIC_OPTIONS: Array<{ value: SubredditMetricOption; label: string }> = [
    { value: "volume", label: "Volume" },
    { value: "pct_negative", label: "% Negatif" },
    { value: "pct_positive", label: "% Positif" },
]

const MIN_COMMENTS_OPTIONS = [100, 500, 1000]

type ChartSubredditRow = SubredditSentiment & {
    displayName: string
}

type TooltipPayloadEntry = {
    payload?: ChartSubredditRow
}

function TopSubredditTooltipContent({
    active,
    payload,
}: {
    active?: boolean
    payload?: TooltipPayloadEntry[]
}) {
    if (!active || !payload || payload.length === 0) return null
    const item = payload[0]?.payload
    if (!item) return null

    return (
        <div className="min-w-[225px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">{item.displayName}</p>
            <div className="mt-1 flex items-center justify-between gap-4 text-[11px] text-muted-foreground tabular-nums">
                <span>{formatNumber(item.n_total)} komentar</span>
                <span>{formatNumber(item.n_posts)} post</span>
                <span>Skor: {formatScore(item.avg_score)}</span>
            </div>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-1)" }}
                        />
                        Negatif
                    </span>
                    <span className="font-medium">
                        {formatPercent(item.pct_negative)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            ({formatNumber(item.n_negative)})
                        </span>
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-3)" }}
                        />
                        Netral
                    </span>
                    <span className="font-medium">
                        {formatPercent(item.pct_neutral)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            ({formatNumber(item.n_neutral)})
                        </span>
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-2)" }}
                        />
                        Positif
                    </span>
                    <span className="font-medium">
                        {formatPercent(item.pct_positive)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            ({formatNumber(item.n_positive)})
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export function TopSubredditsChart() {
    const [metric, setMetric] = React.useState<SubredditMetricOption>("volume")
    const [viewMode, setViewMode] = React.useState<SubredditChartViewMode>("stacked")
    const [minComments, setMinComments] = React.useState<number>(100)

    const { data, isLoading, isError } = useTopSubreddits({
        metric,
        limit: 10,
        min_comments: minComments,
    })

    const chartData = React.useMemo<ChartSubredditRow[]>(() => {
        return (data ?? []).map((item) => ({
            ...item,
            displayName: formatSubredditName(item.subreddit),
        }))
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="text-base">Top 10 Komunitas Subreddit</CardTitle>
                        <CardDescription>
                            Perbandingan polaritas opini dan volume komentar antar subreddit utama
                        </CardDescription>
                    </div>

                    <div className="inline-flex self-start rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode("stacked")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                viewMode === "stacked"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Komposisi (%)
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("volume")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                viewMode === "volume"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Volume
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        {METRIC_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setMetric(opt.value)}
                                className={cn(
                                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                                    metric === opt.value
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>Min. komentar:</span>
                        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
                            {MIN_COMMENTS_OPTIONS.map((threshold) => (
                                <button
                                    key={threshold}
                                    type="button"
                                    onClick={() => setMinComments(threshold)}
                                    className={cn(
                                        "rounded-md px-2 py-0.5 font-medium tabular-nums transition-colors",
                                        minComments === threshold
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {formatNumber(threshold)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[360px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                        Data peringkat subreddit tidak tersedia.
                    </div>
                ) : viewMode === "stacked" ? (
                    <ChartContainer config={SUBREDDIT_CHART_CONFIG} className="h-[360px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="displayName"
                                width={126}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip content={<TopSubredditTooltipContent />} />
                            <Bar
                                dataKey="pct_negative"
                                name="negative"
                                stackId="sentiment"
                                fill="var(--chart-1)"
                                radius={[4, 0, 0, 4]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="pct_neutral"
                                name="neutral"
                                stackId="sentiment"
                                fill="var(--chart-3)"
                                barSize={20}
                            />
                            <Bar
                                dataKey="pct_positive"
                                name="positive"
                                stackId="sentiment"
                                fill="var(--chart-2)"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <ChartContainer config={SUBREDDIT_CHART_CONFIG} className="h-[360px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactNumber(Number(value))}
                            />
                            <YAxis
                                type="category"
                                dataKey="displayName"
                                width={126}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip content={<TopSubredditTooltipContent />} />
                            <Bar
                                dataKey="n_total"
                                name="n_total"
                                fill="var(--chart-4)"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
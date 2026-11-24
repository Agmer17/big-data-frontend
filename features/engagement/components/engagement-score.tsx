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
    useScoreCategorySentiment,
    useScoreDistribution,
} from "../hooks/use-engagement"
import {
    ENGAGEMENT_CHART_CONFIG,
    type ScoreChartViewMode,
    formatCompactNumber,
    formatNumber,
    formatPercent,
    formatScoreCategoryLabel,
} from "../engagement-formatter"

type MergedScoreRow = {
    score_category: string
    category_order: number
    displayLabel: string
    n_comments: number
    percentage: number
    pct_positive: number
    pct_negative: number
    pct_neutral: number
}

type TooltipPayloadEntry = {
    payload?: MergedScoreRow
}

function ScoreSentimentTooltipContent({
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
            <p className="font-semibold text-foreground">{item.displayLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Volume:{" "}
                <span className="font-medium text-foreground">
                    {formatNumber(item.n_comments)}
                </span>{" "}
                komentar ({formatPercent(item.percentage)})
            </p>

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
                    <span className="font-medium">{formatPercent(item.pct_negative)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-3)" }}
                        />
                        Netral
                    </span>
                    <span className="font-medium">{formatPercent(item.pct_neutral)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-2)" }}
                        />
                        Positif
                    </span>
                    <span className="font-medium">{formatPercent(item.pct_positive)}</span>
                </div>
            </div>
        </div>
    )
}

export function ScoreSentimentChart() {
    const [viewMode, setViewMode] = React.useState<ScoreChartViewMode>(
        "sentiment_composition"
    )

    const distQuery = useScoreDistribution()
    const categorySentimentQuery = useScoreCategorySentiment()

    const isLoading = distQuery.isLoading || categorySentimentQuery.isLoading
    const isError = distQuery.isError && categorySentimentQuery.isError

    const chartData = React.useMemo<MergedScoreRow[]>(() => {
        const sentimentRows = categorySentimentQuery.data ?? []
        const distRows = distQuery.data ?? []
        const distMap = new Map(distRows.map((row) => [row.score_category, row]))

        const totalAll = distRows.reduce((acc, row) => acc + row.n_comments, 0)

        if (sentimentRows.length > 0) {
            return [...sentimentRows]
                .sort((a, b) => a.category_order - b.category_order)
                .map((row) => {
                    const distItem = distMap.get(row.score_category)
                    const count = distItem?.n_comments ?? row.n_comments
                    const share =
                        distItem?.percentage ??
                        (totalAll > 0 ? (count / totalAll) * 100 : 0)

                    return {
                        score_category: row.score_category,
                        category_order: row.category_order,
                        displayLabel: formatScoreCategoryLabel(row.score_category),
                        n_comments: count,
                        percentage: share,
                        pct_positive: row.pct_positive,
                        pct_negative: row.pct_negative,
                        pct_neutral: row.pct_neutral,
                    }
                })
        }

        return [...distRows]
            .sort((a, b) => a.category_order - b.category_order)
            .map((row) => ({
                score_category: row.score_category,
                category_order: row.category_order,
                displayLabel: formatScoreCategoryLabel(row.score_category),
                n_comments: row.n_comments,
                percentage: row.percentage,
                pct_positive: 0,
                pct_negative: 0,
                pct_neutral: 0,
            }))
    }, [distQuery.data, categorySentimentQuery.data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Kategori Skor &amp; Komposisi Sentimen
                    </CardTitle>
                    <CardDescription>
                        {viewMode === "sentiment_composition"
                            ? "Perubahan proporsi polaritas opini dari komentar skor negatif hingga tinggi"
                            : "Sebaran jumlah komentar pada setiap tingkatan perolehan skor"}
                    </CardDescription>
                </div>

                <div className="inline-flex self-start rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    <button
                        type="button"
                        onClick={() => setViewMode("sentiment_composition")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition-colors",
                            viewMode === "sentiment_composition"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Komposisi (%)
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("volume_distribution")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition-colors",
                            viewMode === "volume_distribution"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Volume
                    </button>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                        Data distribusi kategori skor tidak tersedia.
                    </div>
                ) : viewMode === "sentiment_composition" ? (
                    <ChartContainer config={ENGAGEMENT_CHART_CONFIG} className="h-[340px] w-full">
                        <BarChart
                            data={chartData}
                            margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-border/60"
                            />
                            <XAxis
                                dataKey="displayLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <ChartTooltip content={<ScoreSentimentTooltipContent />} />
                            <Bar
                                dataKey="pct_negative"
                                name="negative"
                                stackId="scoreSentiment"
                                fill="var(--chart-1)"
                                radius={[0, 0, 4, 4]}
                                maxBarSize={46}
                            />
                            <Bar
                                dataKey="pct_neutral"
                                name="neutral"
                                stackId="scoreSentiment"
                                fill="var(--chart-3)"
                                maxBarSize={46}
                            />
                            <Bar
                                dataKey="pct_positive"
                                name="positive"
                                stackId="scoreSentiment"
                                fill="var(--chart-2)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={46}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <ChartContainer config={ENGAGEMENT_CHART_CONFIG} className="h-[340px] w-full">
                        <BarChart
                            data={chartData}
                            margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-border/60"
                            />
                            <XAxis
                                dataKey="displayLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactNumber(Number(value))}
                            />
                            <ChartTooltip content={<ScoreSentimentTooltipContent />} />
                            <Bar
                                dataKey="n_comments"
                                name="n_comments"
                                fill="var(--chart-4)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={46}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
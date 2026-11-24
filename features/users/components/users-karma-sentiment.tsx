"use client"

import * as React from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
} from "recharts"
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
import type { KarmaSentiment } from "../api/users.client"
import { useKarmaSentiment } from "../hooks/use-users"
import {
    type KarmaChartViewMode,
    USERS_CHART_CONFIG,
    formatCompactNumber,
    formatKarmaLabel,
    formatNumber,
    formatPercent,
    formatScore,
} from "../user-formatter"

type KarmaChartRow = KarmaSentiment & {
    displayLabel: string
}

type TooltipPayloadEntry = {
    payload?: KarmaChartRow
}

function KarmaSentimentTooltipContent({
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
        <div className="min-w-[230px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">{item.displayLabel}</p>
            <div className="mt-1 flex items-center justify-between gap-4 text-[11px] text-muted-foreground tabular-nums">
                <span>{formatNumber(item.n_total)} komentar</span>
                <span>{formatNumber(item.n_accounts)} akun</span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Skor rerata komentar:{" "}
                <span className="font-medium text-foreground">{formatScore(item.avg_score)}</span>
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

export function KarmaSentimentChart() {
    const [viewMode, setViewMode] = React.useState<KarmaChartViewMode>("stacked")
    const [hideUnknown, setHideUnknown] = React.useState<boolean>(true)

    const { data, isLoading, isError } = useKarmaSentiment()

    const chartData = React.useMemo<KarmaChartRow[]>(() => {
        const sorted = [...(data ?? [])].sort(
            (a, b) => a.category_order - b.category_order
        )
        const filtered = hideUnknown
            ? sorted.filter((item) => item.karma_category !== "Unknown")
            : sorted

        return filtered.map((item) => ({
            ...item,
            displayLabel: formatKarmaLabel(item.karma_category),
        }))
    }, [data, hideUnknown])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Distribusi Sentimen berdasarkan Tingkat Karma
                    </CardTitle>
                    <CardDescription>
                        {viewMode === "stacked"
                            ? "Proporsi polaritas komentar dari akun karma negatif hingga sangat tinggi"
                            : "Perbandingan volume komentar dan rata-rata skor (karma) tiap segmen"}
                    </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setHideUnknown((prev) => !prev)}
                        className={cn(
                            "rounded-lg border border-border px-2.5 py-1 text-xs font-medium transition-colors",
                            hideUnknown
                                ? "bg-muted/50 text-muted-foreground hover:text-foreground"
                                : "bg-background text-foreground shadow-xs"
                        )}
                    >
                        {hideUnknown ? "Sembunyikan Unknown" : "Tampilkan Unknown"}
                    </button>

                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
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
                            onClick={() => setViewMode("volume_score")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                viewMode === "volume_score"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Volume &amp; Skor
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                        Data sentimen karma tidak tersedia.
                    </div>
                ) : viewMode === "stacked" ? (
                    <ChartContainer config={USERS_CHART_CONFIG} className="h-[340px] w-full">
                        <BarChart
                            data={chartData}
                            margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
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
                            <ChartTooltip content={<KarmaSentimentTooltipContent />} />
                            <Bar
                                dataKey="pct_negative"
                                name="negative"
                                stackId="sentiment"
                                fill="var(--chart-1)"
                                radius={[0, 0, 4, 4]}
                                maxBarSize={44}
                            />
                            <Bar
                                dataKey="pct_neutral"
                                name="neutral"
                                stackId="sentiment"
                                fill="var(--chart-3)"
                                maxBarSize={44}
                            />
                            <Bar
                                dataKey="pct_positive"
                                name="positive"
                                stackId="sentiment"
                                fill="var(--chart-2)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={44}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <ChartContainer config={USERS_CHART_CONFIG} className="h-[340px] w-full">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                dataKey="displayLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactNumber(Number(value))}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatScore(Number(value))}
                            />
                            <ChartTooltip content={<KarmaSentimentTooltipContent />} />
                            <Bar
                                yAxisId="left"
                                dataKey="n_total"
                                name="n_total"
                                fill="var(--chart-4)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                            <Line
                                yAxisId="right"
                                dataKey="avg_score"
                                name="avg_score"
                                type="monotone"
                                stroke="var(--chart-2)"
                                strokeWidth={2.5}
                                dot={{ r: 3.5, fill: "var(--chart-2)" }}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </ComposedChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
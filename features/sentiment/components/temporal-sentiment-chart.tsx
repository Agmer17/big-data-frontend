"use client"

import * as React from "react"
import {
    Area,
    AreaChart,
    Bar,
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
import { useDailySentiment, useMonthlySentiment } from "../hooks/use-sentiment"
import {
    SENTIMENT_CHART_CONFIG,
    type SentimentGranularity,
    type TemporalMetricMode,
    formatCompactNumber,
    formatDateLabel,
    formatMonthLabel,
    formatNumber,
    formatPercent,
    formatPpDelta,
} from "../sentiment-formatter"

type NormalizedTemporalPoint = {
    periodKey: string
    axisLabel: string
    fullLabel: string
    n_total: number
    n_total_ma7: number | null
    pct_positive: number
    pct_negative: number
    pct_neutral: number
    d_pct_positive_pp: number | null
    d_pct_negative_pp: number | null
    d_pct_neutral_pp: number | null
}

type TooltipPayloadEntry = {
    dataKey?: string | number
    color?: string
    value?: number | string
    payload?: NormalizedTemporalPoint
}

function TemporalTooltipContent({
    active,
    payload,
    granularity,
}: {
    active?: boolean
    payload?: TooltipPayloadEntry[]
    granularity: SentimentGranularity
}) {
    if (!active || !payload || payload.length === 0) return null
    const point = payload[0]?.payload
    if (!point) return null

    return (
        <div className="min-w-[210px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-medium text-foreground">{point.fullLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Volume: <span className="font-medium text-foreground">{formatNumber(point.n_total)}</span> komentar
            </p>

            {granularity === "daily" && point.n_total_ma7 != null && (
                <p className="text-[11px] text-muted-foreground tabular-nums">
                    Rata-rata 7 hari: <span className="font-medium text-foreground">{formatNumber(point.n_total_ma7)}</span>
                </p>
            )}

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-2 rounded-[2px]" style={{ backgroundColor: "var(--chart-1)" }} />
                        Negatif
                    </span>
                    <span className="font-medium">
                        {formatPercent(point.pct_negative)}
                        {granularity === "monthly" && point.d_pct_negative_pp != null && (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                                ({formatPpDelta(point.d_pct_negative_pp)})
                            </span>
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-2 rounded-[2px]" style={{ backgroundColor: "var(--chart-3)" }} />
                        Netral
                    </span>
                    <span className="font-medium">
                        {formatPercent(point.pct_neutral)}
                        {granularity === "monthly" && point.d_pct_neutral_pp != null && (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                                ({formatPpDelta(point.d_pct_neutral_pp)})
                            </span>
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-2 rounded-[2px]" style={{ backgroundColor: "var(--chart-2)" }} />
                        Positif
                    </span>
                    <span className="font-medium">
                        {formatPercent(point.pct_positive)}
                        {granularity === "monthly" && point.d_pct_positive_pp != null && (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                                ({formatPpDelta(point.d_pct_positive_pp)})
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function TemporalSentimentChart() {
    const [granularity, setGranularity] = React.useState<SentimentGranularity>("monthly")
    const [metricMode, setMetricMode] = React.useState<TemporalMetricMode>("percentage")

    const monthlyQuery = useMonthlySentiment({ order: "asc" })
    const dailyQuery = useDailySentiment({ order: "asc", page: 1, page_size: 90 })

    const isLoading = granularity === "monthly" ? monthlyQuery.isLoading : dailyQuery.isLoading
    const isError = granularity === "monthly" ? monthlyQuery.isError : dailyQuery.isError

    const series = React.useMemo<NormalizedTemporalPoint[]>(() => {
        if (granularity === "monthly") {
            return (monthlyQuery.data ?? []).map((item) => ({
                periodKey: item.month_start,
                axisLabel: formatMonthLabel(item.month_start, "short"),
                fullLabel: formatMonthLabel(item.month_start, "full"),
                n_total: item.n_total,
                n_total_ma7: null,
                pct_positive: item.pct_positive,
                pct_negative: item.pct_negative,
                pct_neutral: item.pct_neutral,
                d_pct_positive_pp: item.d_pct_positive_pp,
                d_pct_negative_pp: item.d_pct_negative_pp,
                d_pct_neutral_pp: item.d_pct_neutral_pp,
            }))
        }

        return (dailyQuery.data?.data ?? []).map((item) => ({
            periodKey: item.comment_date,
            axisLabel: formatDateLabel(item.comment_date, "short"),
            fullLabel: formatDateLabel(item.comment_date, "full"),
            n_total: item.n_total,
            n_total_ma7: item.n_total_ma7,
            pct_positive: item.pct_positive,
            pct_negative: item.pct_negative,
            pct_neutral: item.pct_neutral,
            d_pct_positive_pp: null,
            d_pct_negative_pp: null,
            d_pct_neutral_pp: null,
        }))
    }, [granularity, monthlyQuery.data, dailyQuery.data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="text-base">Dinamika Sentimen Temporal</CardTitle>
                    <CardDescription>
                        {granularity === "monthly"
                            ? "Pergerakan bulanan beserta perubahan poin persentase antar bulan"
                            : "Tren harian (90 hari pertama) dengan indikator moving average 7 hari"}
                    </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setGranularity("monthly")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                granularity === "monthly"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Bulanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setGranularity("daily")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                granularity === "daily"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Harian
                        </button>
                    </div>

                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setMetricMode("percentage")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                metricMode === "percentage"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Proporsi (%)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMetricMode("volume")}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                metricMode === "volume"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Volume
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[320px] w-full rounded-lg" />
                ) : isError || series.length === 0 ? (
                    <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                        Data tren temporal tidak tersedia.
                    </div>
                ) : metricMode === "percentage" ? (
                    <ChartContainer config={SENTIMENT_CHART_CONFIG} className="h-[320px] w-full">
                        <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillNegative" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="fillNeutral" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.22} />
                                    <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="fillPositive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                dataKey="axisLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={24}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <ChartTooltip content={<TemporalTooltipContent granularity={granularity} />} />
                            <Area
                                dataKey="pct_negative"
                                name="negative"
                                type="monotone"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                fill="url(#fillNegative)"
                            />
                            <Area
                                dataKey="pct_neutral"
                                name="neutral"
                                type="monotone"
                                stroke="var(--chart-3)"
                                strokeWidth={2}
                                fill="url(#fillNeutral)"
                            />
                            <Area
                                dataKey="pct_positive"
                                name="positive"
                                type="monotone"
                                stroke="var(--chart-2)"
                                strokeWidth={2}
                                fill="url(#fillPositive)"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <ChartContainer config={SENTIMENT_CHART_CONFIG} className="h-[320px] w-full">
                        <ComposedChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                dataKey="axisLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={24}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactNumber(Number(value))}
                            />
                            <ChartTooltip content={<TemporalTooltipContent granularity={granularity} />} />
                            <Bar
                                dataKey="n_total"
                                name="n_total"
                                fill="var(--chart-4)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={28}
                            />
                            {granularity === "daily" && (
                                <Line
                                    dataKey="n_total_ma7"
                                    name="n_total_ma7"
                                    type="monotone"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )}
                            <ChartLegend content={<ChartLegendContent />} />
                        </ComposedChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
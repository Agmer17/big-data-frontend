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
import type { EngagementBySentiment } from "../api/engagement.client"
import { useEngagementBySentiment } from "../hooks/use-engagement"
import {
    ENGAGEMENT_CHART_CONFIG,
    formatNumber,
    formatScore,
    formatSentimentLabel,
    getSentimentOrder,
} from "../engagement-formatter"

type SentimentMetricRow = EngagementBySentiment & {
    displayLabel: string
}

type TooltipPayloadEntry = {
    payload?: SentimentMetricRow
}

function EngagementMetricsTooltipContent({
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
        <div className="min-w-[215px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">Sentimen {item.displayLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Populasi: <span className="font-medium text-foreground">{formatNumber(item.n_comments)}</span> komentar
            </p>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-4)" }}
                        />
                        Rerata Score
                    </span>
                    <span className="font-medium">{formatScore(item.avg_score)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-2)" }}
                        />
                        Rerata Upvotes
                    </span>
                    <span className="font-medium">{formatScore(item.avg_ups)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-1)" }}
                        />
                        Rerata Downvotes
                    </span>
                    <span className="font-medium">{formatScore(item.avg_downs)}</span>
                </div>
            </div>
        </div>
    )
}

export function SentimentEngagementMetricsChart() {
    const { data, isLoading, isError } = useEngagementBySentiment()

    const chartData = React.useMemo<SentimentMetricRow[]>(() => {
        return [...(data ?? [])]
            .sort(
                (a, b) => getSentimentOrder(a.sentiment) - getSentimentOrder(b.sentiment)
            )
            .map((item) => ({
                ...item,
                displayLabel: formatSentimentLabel(item.sentiment),
            }))
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">
                    Apresiasi Komentar per Sentimen
                </CardTitle>
                <CardDescription>
                    Rata-rata perolehan score, upvotes, dan downvotes berdasarkan nada opini
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-4">
                {isLoading ? (
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                        Data rata-rata score dan vote tidak tersedia.
                    </div>
                ) : (
                    <>
                        <ChartContainer config={ENGAGEMENT_CHART_CONFIG} className="h-[245px] w-full">
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
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatScore(Number(value))}
                                />
                                <ChartTooltip content={<EngagementMetricsTooltipContent />} />
                                <Bar
                                    dataKey="avg_score"
                                    name="avg_score"
                                    fill="var(--chart-4)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={18}
                                />
                                <Bar
                                    dataKey="avg_ups"
                                    name="avg_ups"
                                    fill="var(--chart-2)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={18}
                                />
                                <Bar
                                    dataKey="avg_downs"
                                    name="avg_downs"
                                    fill="var(--chart-1)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={18}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </BarChart>
                        </ChartContainer>

                        <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
                            {chartData.map((item) => (
                                <div
                                    key={item.sentiment}
                                    className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs tabular-nums"
                                >
                                    <p className="font-medium text-foreground">{item.displayLabel}</p>
                                    <p className="mt-1 text-base font-semibold">
                                        {formatScore(item.avg_score)}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        +{formatScore(item.avg_ups)} / -{formatScore(item.avg_downs)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
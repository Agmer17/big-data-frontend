"use client"

import * as React from "react"
import {
    CartesianGrid,
    ReferenceLine,
    Scatter,
    ScatterChart,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
    SUBREDDIT_CHART_CONFIG,
    formatNumber,
    formatPercent,
    formatScore,
    formatSubredditName,
} from "../subreddit-util"
import { SubredditSentiment } from "../api/subreddit.client"
import { useTopSubreddits } from "../hooks/use-subreddit"

type ScatterSubredditPoint = SubredditSentiment & {
    displayName: string
}

type TooltipPayloadEntry = {
    payload?: ScatterSubredditPoint
}

function ScatterSubredditTooltipContent({
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
        <div className="min-w-[210px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">{item.displayName}</p>
            <div className="mt-2 space-y-1 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Rata-rata Skor</span>
                    <span className="font-medium">{formatScore(item.avg_score)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Sentimen Negatif</span>
                    <span className="font-medium">{formatPercent(item.pct_negative)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Sentimen Positif</span>
                    <span className="font-medium">{formatPercent(item.pct_positive)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Total Komentar</span>
                    <span className="font-medium">{formatNumber(item.n_total)}</span>
                </div>
            </div>
        </div>
    )
}

export function SubredditScorePolarityChart() {
    const { data, isLoading, isError } = useTopSubreddits({
        metric: "volume",
        limit: 25,
        min_comments: 100,
    })

    const { points, avgNegative, avgScore } = React.useMemo(() => {
        const raw = data ?? []
        if (raw.length === 0) {
            return { points: [], avgNegative: 0, avgScore: 0 }
        }

        const mapped: ScatterSubredditPoint[] = raw.map((item) => ({
            ...item,
            displayName: formatSubredditName(item.subreddit),
        }))

        const meanNeg =
            mapped.reduce((acc, item) => acc + item.pct_negative, 0) / mapped.length
        const meanScore =
            mapped.reduce((acc, item) => acc + item.avg_score, 0) / mapped.length

        return {
            points: mapped,
            avgNegative: meanNeg,
            avgScore: meanScore,
        }
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">Polaritas vs Skor Komentar</CardTitle>
                <CardDescription>
                    Korelasi persentase sentimen negatif dengan rata-rata karma pada 25 subreddit terbesar
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-3">
                {isLoading ? (
                    <Skeleton className="h-[360px] w-full rounded-lg" />
                ) : isError || points.length === 0 ? (
                    <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                        Data sebaran skor tidak tersedia.
                    </div>
                ) : (
                    <>
                        <ChartContainer config={SUBREDDIT_CHART_CONFIG} className="h-[325px] w-full">
                            <ScatterChart margin={{ top: 12, right: 16, left: -12, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                                <XAxis
                                    type="number"
                                    dataKey="pct_negative"
                                    name="Negatif (%)"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${Math.round(Number(value))}%`}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="avg_score"
                                    name="Rata-rata Skor"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatScore(Number(value))}
                                />
                                <ZAxis type="number" dataKey="n_total" range={[55, 360]} />
                                <ReferenceLine
                                    x={avgNegative}
                                    stroke="var(--border)"
                                    strokeDasharray="4 4"
                                />
                                <ReferenceLine
                                    y={avgScore}
                                    stroke="var(--border)"
                                    strokeDasharray="4 4"
                                />
                                <ChartTooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                    content={<ScatterSubredditTooltipContent />}
                                />
                                <Scatter
                                    data={points}
                                    fill="var(--chart-1)"
                                    fillOpacity={0.75}
                                    stroke="var(--chart-1)"
                                />
                            </ScatterChart>
                        </ChartContainer>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground tabular-nums">
                            <span>Ukuran titik = volume komentar</span>
                            <span>
                                Garis putus: rerata {formatPercent(avgNegative)} neg · skor{" "}
                                {formatScore(avgScore)}
                            </span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
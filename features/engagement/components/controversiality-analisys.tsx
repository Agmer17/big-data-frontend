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
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { ControversialityBySentiment } from "../api/engagement.client"
import {
    useControversiality,
    useControversialityBySentiment,
} from "../hooks/use-engagement"
import {
    ENGAGEMENT_CHART_CONFIG,
    formatControversialityLabel,
    formatNumber,
    formatPercent,
    formatPpDelta,
    formatSentimentLabel,
    getSentimentOrder,
} from "../engagement-formatter"

type ControversialSentimentRow = ControversialityBySentiment & {
    displayLabel: string
}

type TooltipPayloadEntry = {
    payload?: ControversialSentimentRow
}

function ControversialityTooltipContent({
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
        <div className="min-w-[205px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">Sentimen {item.displayLabel}</p>
            <div className="mt-2 flex items-center justify-between gap-4 tabular-nums">
                <span className="text-muted-foreground">Proporsi Kontroversial</span>
                <span className="font-medium">{formatPercent(item.pct_controversial)}</span>
            </div>
        </div>
    )
}

export function ControversialityAnalysisCard() {
    const controQuery = useControversiality()
    const bySentimentQuery = useControversialityBySentiment()

    const isLoading = controQuery.isLoading || bySentimentQuery.isLoading
    const isError = controQuery.isError && bySentimentQuery.isError

    const { statusRows, totalComments, negDeltaPp } = React.useMemo(() => {
        const raw = controQuery.data ?? []
        const sorted = [...raw].sort((a, b) => b.controversiality - a.controversiality)
        const total = sorted.reduce((acc, row) => acc + row.n_comments, 0)

        const controItem = sorted.find((r) => r.controversiality === 1)
        const normalItem = sorted.find((r) => r.controversiality === 0)
        const delta =
            controItem && normalItem
                ? controItem.pct_negative - normalItem.pct_negative
                : null

        return {
            statusRows: sorted,
            totalComments: total,
            negDeltaPp: delta,
        }
    }, [controQuery.data])

    const sentimentControData = React.useMemo<ControversialSentimentRow[]>(() => {
        return [...(bySentimentQuery.data ?? [])]
            .sort(
                (a, b) => getSentimentOrder(a.sentiment) - getSentimentOrder(b.sentiment)
            )
            .map((item) => ({
                ...item,
                displayLabel: formatSentimentLabel(item.sentiment),
            }))
    }, [bySentimentQuery.data])

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">
                    Dinamika Komentar Kontroversial
                </CardTitle>
                <CardDescription>
                    Perbandingan polaritas opini pada komentar kontroversial (1) vs non-kontroversial (0) serta tingkat kontroversi tiap sentimen
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <div className="grid gap-6 lg:grid-cols-12">
                        <Skeleton className="h-[220px] w-full rounded-lg lg:col-span-7" />
                        <Skeleton className="h-[220px] w-full rounded-lg lg:col-span-5" />
                    </div>
                ) : isError || (statusRows.length === 0 && sentimentControData.length === 0) ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data analisis kontroversialitas tidak tersedia.
                    </p>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-12">
                        <div className="space-y-3.5 lg:col-span-7">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-foreground">
                                    Komposisi Sentimen berdasarkan Status Kontroversi
                                </span>
                                {negDeltaPp != null && (
                                    <span className="text-muted-foreground tabular-nums">
                                        Selisih negatif:{" "}
                                        <span className="font-medium text-foreground">
                                            {formatPpDelta(negDeltaPp)}
                                        </span>
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                {statusRows.map((row) => {
                                    const sharePct =
                                        totalComments > 0 ? (row.n_comments / totalComments) * 100 : 0

                                    return (
                                        <div
                                            key={row.controversiality}
                                            className="rounded-lg border border-border/70 bg-card p-3.5"
                                        >
                                            <div className="flex items-center justify-between gap-2 text-xs">
                                                <span className="font-semibold">
                                                    {formatControversialityLabel(row.controversiality)}
                                                </span>
                                                <span className="text-muted-foreground tabular-nums">
                                                    <span className="font-medium text-foreground">
                                                        {formatNumber(row.n_comments)}
                                                    </span>{" "}
                                                    komentar ({formatPercent(sharePct)})
                                                </span>
                                            </div>

                                            <div className="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    style={{
                                                        width: `${row.pct_negative}%`,
                                                        backgroundColor: "var(--chart-1)",
                                                    }}
                                                    title={`Negatif: ${formatPercent(row.pct_negative)}`}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_neutral}%`,
                                                        backgroundColor: "var(--chart-3)",
                                                    }}
                                                    title={`Netral: ${formatPercent(row.pct_neutral)}`}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_positive}%`,
                                                        backgroundColor: "var(--chart-2)",
                                                    }}
                                                    title={`Positif: ${formatPercent(row.pct_positive)}`}
                                                />
                                            </div>

                                            <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs tabular-nums">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="size-2 shrink-0 rounded-[2px]"
                                                        style={{ backgroundColor: "var(--chart-1)" }}
                                                    />
                                                    <span className="text-muted-foreground">Neg:</span>
                                                    <span className="font-medium">
                                                        {formatPercent(row.pct_negative)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1.5">
                                                    <span
                                                        className="size-2 shrink-0 rounded-[2px]"
                                                        style={{ backgroundColor: "var(--chart-3)" }}
                                                    />
                                                    <span className="text-muted-foreground">Net:</span>
                                                    <span className="font-medium">
                                                        {formatPercent(row.pct_neutral)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-end gap-1.5">
                                                    <span
                                                        className="size-2 shrink-0 rounded-[2px]"
                                                        style={{ backgroundColor: "var(--chart-2)" }}
                                                    />
                                                    <span className="text-muted-foreground">Pos:</span>
                                                    <span className="font-medium">
                                                        {formatPercent(row.pct_positive)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-lg border border-border/70 bg-muted/20 p-3.5 lg:col-span-5">
                            <div>
                                <p className="text-xs font-medium text-foreground">
                                    Rasio Kontroversial per Sentimen
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    Persentase komentar yang mendapat rasio upvote/downvote terbelah
                                </p>
                            </div>

                            <ChartContainer
                                config={ENGAGEMENT_CHART_CONFIG}
                                className="mt-3 h-[175px] w-full"
                            >
                                <BarChart
                                    data={sentimentControData}
                                    layout="vertical"
                                    margin={{ top: 4, right: 16, left: -8, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        horizontal={false}
                                        strokeDasharray="3 3"
                                        className="stroke-border/60"
                                    />
                                    <XAxis
                                        type="number"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="displayLabel"
                                        width={64}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <ChartTooltip content={<ControversialityTooltipContent />} />
                                    <Bar
                                        dataKey="pct_controversial"
                                        name="pct_controversial"
                                        fill="var(--chart-1)"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
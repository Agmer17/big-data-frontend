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
import { cn } from "@/lib/utils"
import type { PostCommentCountDistribution } from "../api/posts.client"
import { usePostCommentCountDistribution } from "../hooks/use-posts"
import {
    POSTS_CHART_CONFIG,
    formatCompactNumber,
    formatDecimal,
    formatNumber,
    formatPercent,
} from "../posts-formatter"

const BIN_PRESETS = [25, 40, 60]

type HistogramRow = PostCommentCountDistribution & {
    axisLabel: string
    rangeLabel: string
    sharePct: number
}

type TooltipPayloadEntry = {
    payload?: HistogramRow
}

function HistogramTooltipContent({
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
            <p className="font-semibold text-foreground">
                Rentang {item.rangeLabel} komentar
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Interval log₁₀: {formatDecimal(item.log10_start)} –{" "}
                {formatDecimal(item.log10_end)}
            </p>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Jumlah Post</span>
                    <span className="font-semibold">{formatNumber(item.n_posts)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Proporsi Korpus</span>
                    <span className="font-medium">{formatPercent(item.sharePct)}</span>
                </div>
            </div>
        </div>
    )
}

export function CommentCountHistogramChart() {
    const [bins, setBins] = React.useState<number>(40)
    const { data, isLoading, isError } = usePostCommentCountDistribution({ bins })

    const { chartData, totalPosts } = React.useMemo(() => {
        const raw = [...(data ?? [])].sort((a, b) => a.bin_index - b.bin_index)
        const total = raw.reduce((acc, item) => acc + item.n_posts, 0)

        const mapped: HistogramRow[] = raw.map((item) => {
            const startInt = Math.max(1, Math.round(item.comments_start))
            const endInt = Math.max(startInt, Math.round(item.comments_end))
            const rangeLabel =
                startInt === endInt
                    ? formatNumber(startInt)
                    : `${formatNumber(startInt)}–${formatNumber(endInt)}`

            return {
                ...item,
                axisLabel: formatCompactNumber(startInt),
                rangeLabel,
                sharePct: total > 0 ? (item.n_posts / total) * 100 : 0,
            }
        })

        return { chartData: mapped, totalPosts: total }
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Distribusi Kepadatan Komentar (Skala Log₁₀)
                    </CardTitle>
                    <CardDescription>
                        Sebaran frekuensi jumlah komentar per post untuk mengamati pola ekor panjang (long-tail)
                    </CardDescription>
                </div>

                <div className="flex items-center gap-1.5 self-start text-xs text-muted-foreground">
                    <span>Bins:</span>
                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
                        {BIN_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setBins(preset)}
                                className={cn(
                                    "rounded-md px-2 py-1 font-medium tabular-nums transition-colors",
                                    bins === preset
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-3">
                {isLoading ? (
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                        Data distribusi jumlah komentar per post tidak tersedia.
                    </div>
                ) : (
                    <>
                        <ChartContainer config={POSTS_CHART_CONFIG} className="h-[310px] w-full">
                            <BarChart
                                data={chartData}
                                margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
                                barCategoryGap={1}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    className="stroke-border/60"
                                />
                                <XAxis
                                    dataKey="axisLabel"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={28}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatCompactNumber(Number(value))}
                                />
                                <ChartTooltip content={<HistogramTooltipContent />} />
                                <Bar
                                    dataKey="n_posts"
                                    name="n_posts"
                                    fill="var(--chart-4)"
                                    radius={[2, 2, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground tabular-nums">
                            <span>Sumbu X: batas bawah komentar tiap interval log₁₀</span>
                            <span>Total populasi histogram: {formatNumber(totalPosts)} post</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
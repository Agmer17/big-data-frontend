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
import {
    KEYWORDS_CHART_CONFIG,
    type KeywordDirection,
    formatDecimal,
    formatNumber,
    formatSignedDecimal,
} from "../keyword-formatter"
import { NegativeVsPositiveKeyword } from "../api/keyword.client"
import { useNegativeVsPositiveKeywords } from "../hooks/use-keyword"

const DIRECTION_TABS: Array<{ value: KeywordDirection; label: string }> = [
    { value: "negative", label: "Dominan Negatif" },
    { value: "positive", label: "Dominan Positif" },
]

const MIN_OCCURRENCE_PRESETS = [20, 50, 100]

type PolarizedChartRow = NegativeVsPositiveKeyword & {
    magnitude: number
}

type TooltipPayloadEntry = {
    payload?: PolarizedChartRow
}

function NegativeVsPositiveTooltipContent({
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
            <p className="font-mono text-sm font-semibold text-foreground">
                {item.keyword}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Neg vs Pos Log₂ Ratio:{" "}
                <span className="font-semibold text-foreground">
                    {formatSignedDecimal(item.neg_vs_pos_log2_ratio)}
                </span>
            </p>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-1)" }}
                        />
                        Komentar Negatif
                    </span>
                    <span className="font-medium">{formatNumber(item.n_negative)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-2)" }}
                        />
                        Komentar Positif
                    </span>
                    <span className="font-medium">{formatNumber(item.n_positive)}</span>
                </div>
            </div>
        </div>
    )
}

export function NegativeVsPositiveChart() {
    const [direction, setDirection] = React.useState<KeywordDirection>("negative")
    const [minOccurrences, setMinOccurrences] = React.useState<number>(20)

    const { data, isLoading, isError } = useNegativeVsPositiveKeywords({
        direction,
        limit: 12,
        min_occurrences: minOccurrences,
    })

    const chartData = React.useMemo<PolarizedChartRow[]>(() => {
        return (data ?? [])
            .map((item) => ({
                ...item,
                magnitude: Math.abs(item.neg_vs_pos_log2_ratio),
            }))
            .sort((a, b) => b.magnitude - a.magnitude)
    }, [data])

    const barColor =
        direction === "negative" ? "var(--chart-1)" : "var(--chart-2)"

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            Polarisasi Leksikal: Negatif vs Positif
                        </CardTitle>
                        <CardDescription>
                            Kata kunci dengan ketimpangan kemunculan tertinggi antara kutub negatif dan positif
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                        <span>Min:</span>
                        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
                            {MIN_OCCURRENCE_PRESETS.map((threshold) => (
                                <button
                                    key={threshold}
                                    type="button"
                                    onClick={() => setMinOccurrences(threshold)}
                                    className={cn(
                                        "rounded-md px-2 py-0.5 font-medium tabular-nums transition-colors",
                                        minOccurrences === threshold
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {threshold}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    {DIRECTION_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setDirection(tab.value)}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                direction === tab.value
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[360px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                        Data perbandingan negatif vs positif tidak tersedia.
                    </div>
                ) : (
                    <ChartContainer config={KEYWORDS_CHART_CONFIG} className="h-[360px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
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
                                tickFormatter={(value) => formatDecimal(Number(value))}
                            />
                            <YAxis
                                type="category"
                                dataKey="keyword"
                                width={108}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip content={<NegativeVsPositiveTooltipContent />} />
                            <Bar
                                dataKey="magnitude"
                                name="log2_ratio"
                                fill={barColor}
                                radius={[0, 4, 4, 0]}
                                barSize={18}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
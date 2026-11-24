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
    type KeywordSentiment,
    formatDecimal,
    formatNumber,
    formatSentimentLabel,
    formatSignedDecimal,
    getSentimentChartColor,
} from "../keyword-formatter"
import { DistinctiveKeyword } from "../api/keyword.client"
import { useDistinctiveKeywords } from "../hooks/use-keyword"

const SENTIMENT_TABS: Array<{ value: KeywordSentiment; label: string }> = [
    { value: "negative", label: "Negatif" },
    { value: "neutral", label: "Netral" },
    { value: "positive", label: "Positif" },
]

const MIN_OCCURRENCE_PRESETS = [20, 50, 100]

type TooltipPayloadEntry = {
    payload?: DistinctiveKeyword
}

function DistinctiveKeywordTooltipContent({
    active,
    payload,
    sentiment,
}: {
    active?: boolean
    payload?: TooltipPayloadEntry[]
    sentiment: KeywordSentiment
}) {
    if (!active || !payload || payload.length === 0) return null
    const item = payload[0]?.payload
    if (!item) return null

    return (
        <div className="min-w-[225px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-mono text-sm font-semibold text-foreground">
                {item.keyword}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
                Kelas sentimen: {formatSentimentLabel(sentiment)}
            </p>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Smoothed Log₂ Ratio</span>
                    <span className="font-semibold">
                        {formatSignedDecimal(item.log2_ratio)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Intensitas / 10rb Token</span>
                    <span className="font-medium">
                        {formatDecimal(item.per_10k_tokens)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Total Kemunculan</span>
                    <span className="font-medium">
                        {formatNumber(item.n_occurrences)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function DistinctiveKeywordsCard() {
    const [sentiment, setSentiment] = React.useState<KeywordSentiment>("negative")
    const [minOccurrences, setMinOccurrences] = React.useState<number>(20)

    const { data, isLoading, isError } = useDistinctiveKeywords({
        sentiment,
        limit: 12,
        min_occurrences: minOccurrences,
    })

    const chartData = React.useMemo(() => {
        return [...(data ?? [])].sort((a, b) => b.log2_ratio - a.log2_ratio)
    }, [data])

    const activeBarColor = getSentimentChartColor(sentiment)

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            Keyword Paling Khas per Sentimen
                        </CardTitle>
                        <CardDescription>
                            Skor kekhasan leksikal berdasarkan smoothed log₂ ratio dibanding kelas lain
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

                <div className="grid grid-cols-3 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    {SENTIMENT_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setSentiment(tab.value)}
                            className={cn(
                                "rounded-md px-2.5 py-1 font-medium transition-colors",
                                sentiment === tab.value
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
                        Data keyword khas tidak tersedia untuk filter ini.
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
                            <ChartTooltip
                                content={<DistinctiveKeywordTooltipContent sentiment={sentiment} />}
                            />
                            <Bar
                                dataKey="log2_ratio"
                                name="log2_ratio"
                                fill={activeBarColor}
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
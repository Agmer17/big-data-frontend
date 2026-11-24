"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useOverallSentiment } from "../hooks/use-sentiment"
import {
    SENTIMENT_CHART_CONFIG,
    formatCompactNumber,
    formatNumber,
    formatPercent,
} from "../sentiment-formatter"

const SENTIMENT_ORDER: Array<"negative" | "neutral" | "positive"> = [
    "negative",
    "neutral",
    "positive",
]

export function OverallSentimentCard() {
    const { data, isLoading, isError } = useOverallSentiment()

    const chartData = React.useMemo(() => {
        if (!data) return []
        const byKey = new Map(data.map((item) => [item.sentiment, item]))

        return SENTIMENT_ORDER.map((key) => {
            const found = byKey.get(key)
            return {
                sentiment: key,
                label: SENTIMENT_CHART_CONFIG[key].label,
                n_comments: found?.n_comments ?? 0,
                percentage: found?.percentage ?? 0,
                fill: SENTIMENT_CHART_CONFIG[key].color,
            }
        })
    }, [data])

    const totalComments = React.useMemo(
        () => chartData.reduce((acc, item) => acc + item.n_comments, 0),
        [chartData]
    )

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">Distribusi Keseluruhan</CardTitle>
                <CardDescription>
                    Proporsi klasifikasi sentimen seluruh dataset
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-6">
                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="mx-auto size-48 rounded-full" />
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-full" />
                            <Skeleton className="h-9 w-full" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    </div>
                ) : isError || chartData.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data distribusi sentimen tidak tersedia.
                    </p>
                ) : (
                    <>
                        <ChartContainer
                            config={SENTIMENT_CHART_CONFIG}
                            className="mx-auto aspect-square h-[210px] w-full"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent nameKey="sentiment" hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="n_comments"
                                    nameKey="sentiment"
                                    innerRadius={62}
                                    outerRadius={88}
                                    paddingAngle={2}
                                    strokeWidth={0}
                                >
                                    {chartData.map((entry) => (
                                        <Cell key={entry.sentiment} fill={entry.fill} />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy ?? 0) - 4}
                                                            className="fill-foreground text-xl font-semibold tabular-nums"
                                                        >
                                                            {formatCompactNumber(totalComments)}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy ?? 0) + 16}
                                                            className="fill-muted-foreground text-xs"
                                                        >
                                                            Komentar
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <div className="space-y-3.5">
                            {chartData.map((item) => (
                                <div key={item.sentiment} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-medium">
                                            <span
                                                className="size-2.5 shrink-0 rounded-[2px]"
                                                style={{ backgroundColor: item.fill }}
                                                aria-hidden="true"
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2 tabular-nums">
                                            <span className="text-muted-foreground">
                                                {formatNumber(item.n_comments)}
                                            </span>
                                            <span className="w-12 text-right font-medium">
                                                {formatPercent(item.percentage)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                                                backgroundColor: item.fill,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
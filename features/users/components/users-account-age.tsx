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
import type { AccountAgeSentiment } from "../api/users.client"
import { useAccountAgeSentiment } from "../hooks/use-users"
import {
    type AgeChartViewMode,
    USERS_CHART_CONFIG,
    formatAgeLabel,
    formatCompactNumber,
    formatNumber,
    formatPercent,
    formatScore,
} from "../user-formatter"

type AgeChartRow = AccountAgeSentiment & {
    displayLabel: string
    commentsPerAccount: number
}

type TooltipPayloadEntry = {
    payload?: AgeChartRow
}

function AccountAgeTooltipContent({
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
                Intensitas:{" "}
                <span className="font-medium text-foreground">
                    {formatScore(item.commentsPerAccount)}
                </span>{" "}
                komentar/akun
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

export function AccountAgeChart() {
    const [viewMode, setViewMode] = React.useState<AgeChartViewMode>("stacked")
    const { data, isLoading, isError } = useAccountAgeSentiment()

    const chartData = React.useMemo<AgeChartRow[]>(() => {
        return [...(data ?? [])]
            .sort((a, b) => a.category_order - b.category_order)
            .map((item) => ({
                ...item,
                displayLabel: formatAgeLabel(item.age_category),
                commentsPerAccount:
                    item.n_accounts > 0 ? item.n_total / item.n_accounts : 0,
            }))
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Sentimen berdasarkan Usia Akun
                    </CardTitle>
                    <CardDescription>
                        Perbandingan polaritas opini antara akun baru (&lt; 30 hari) hingga akun lama (&gt; 3 tahun)
                    </CardDescription>
                </div>

                <div className="inline-flex self-start rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
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
                        onClick={() => setViewMode("volume")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition-colors",
                            viewMode === "volume"
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
                    <Skeleton className="h-[310px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[310px] items-center justify-center text-sm text-muted-foreground">
                        Data usia akun tidak tersedia.
                    </div>
                ) : viewMode === "stacked" ? (
                    <ChartContainer config={USERS_CHART_CONFIG} className="h-[310px] w-full">
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
                            <ChartTooltip content={<AccountAgeTooltipContent />} />
                            <Bar
                                dataKey="pct_negative"
                                name="negative"
                                stackId="age"
                                fill="var(--chart-1)"
                                radius={[0, 0, 4, 4]}
                                maxBarSize={46}
                            />
                            <Bar
                                dataKey="pct_neutral"
                                name="neutral"
                                stackId="age"
                                fill="var(--chart-3)"
                                maxBarSize={46}
                            />
                            <Bar
                                dataKey="pct_positive"
                                name="positive"
                                stackId="age"
                                fill="var(--chart-2)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={46}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <ChartContainer config={USERS_CHART_CONFIG} className="h-[310px] w-full">
                        <BarChart
                            data={chartData}
                            margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
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
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactNumber(Number(value))}
                            />
                            <ChartTooltip content={<AccountAgeTooltipContent />} />
                            <Bar
                                dataKey="n_total"
                                name="n_total"
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
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
import { useKarmaWeightedComparison } from "../hooks/use-users"
import {
    USERS_CHART_CONFIG,
    type WeightedPolarityMetric,
    formatKarmaLabel,
    formatNumber,
    formatPercent,
    formatPpDelta,
} from "../user-formatter"

const METRIC_OPTIONS: Array<{ value: WeightedPolarityMetric; label: string }> = [
    { value: "negative", label: "Negatif" },
    { value: "neutral", label: "Netral" },
    { value: "positive", label: "Positif" },
]

type WeightedComparisonRow = {
    karma_category: string
    category_order: number
    displayLabel: string
    cwValue: number
    awValue: number
    deltaPp: number
    n_accounts_aw: number
}

type TooltipPayloadEntry = {
    payload?: WeightedComparisonRow
}

function WeightedComparisonTooltipContent({
    active,
    payload,
    metricLabel,
}: {
    active?: boolean
    payload?: TooltipPayloadEntry[]
    metricLabel: string
}) {
    if (!active || !payload || payload.length === 0) return null
    const item = payload[0]?.payload
    if (!item) return null

    return (
        <div className="min-w-[235px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">{item.displayLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Populasi: <span className="font-medium text-foreground">{formatNumber(item.n_accounts_aw)}</span> akun
            </p>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1.5 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-1)" }}
                        />
                        Comment-Weighted ({metricLabel})
                    </span>
                    <span className="font-medium">{formatPercent(item.cwValue)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ backgroundColor: "var(--chart-4)" }}
                        />
                        Account-Weighted ({metricLabel})
                    </span>
                    <span className="font-medium">{formatPercent(item.awValue)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-1.5">
                    <span className="text-muted-foreground">Selisih (CW − AW)</span>
                    <span className="font-semibold">{formatPpDelta(item.deltaPp)}</span>
                </div>
            </div>
        </div>
    )
}

export function KarmaWeightedComparisonChart() {
    const [metric, setMetric] = React.useState<WeightedPolarityMetric>("negative")
    const { data, isLoading, isError } = useKarmaWeightedComparison()

    const metricLabel =
        METRIC_OPTIONS.find((opt) => opt.value === metric)?.label ?? "Negatif"

    const chartData = React.useMemo<WeightedComparisonRow[]>(() => {
        const sorted = [...(data ?? [])]
            .filter((item) => item.karma_category !== "Unknown")
            .sort((a, b) => a.category_order - b.category_order)

        return sorted.map((item) => {
            const cwValue =
                metric === "negative"
                    ? item.cw_pct_negative
                    : metric === "positive"
                        ? item.cw_pct_positive
                        : item.cw_pct_neutral

            const awValue =
                metric === "negative"
                    ? item.aw_pct_negative
                    : metric === "positive"
                        ? item.aw_pct_positive
                        : item.aw_pct_neutral

            return {
                karma_category: item.karma_category,
                category_order: item.category_order,
                displayLabel: formatKarmaLabel(item.karma_category),
                cwValue,
                awValue,
                deltaPp: cwValue - awValue,
                n_accounts_aw: item.n_accounts_aw,
            }
        })
    }, [data, metric])

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div>
                    <CardTitle className="text-base">
                        Bias Pengguna Aktif (CW vs AW)
                    </CardTitle>
                    <CardDescription>
                        Perbandingan pembobotan berbasis komentar terhadap rata-rata per akun unik
                    </CardDescription>
                </div>

                <div className="grid grid-cols-3 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    {METRIC_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMetric(opt.value)}
                            className={cn(
                                "rounded-md px-2 py-1 font-medium transition-colors",
                                metric === opt.value
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <Skeleton className="h-[325px] w-full rounded-lg" />
                ) : isError || chartData.length === 0 ? (
                    <div className="flex h-[325px] items-center justify-center text-sm text-muted-foreground">
                        Data perbandingan pembobotan tidak tersedia.
                    </div>
                ) : (
                    <ChartContainer config={USERS_CHART_CONFIG} className="h-[325px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
                            <XAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${Math.round(Number(value))}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="displayLabel"
                                width={98}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11 }}
                            />
                            <ChartTooltip
                                content={<WeightedComparisonTooltipContent metricLabel={metricLabel} />}
                            />
                            <Bar
                                dataKey="cwValue"
                                name="cw"
                                fill="var(--chart-1)"
                                radius={[0, 3, 3, 0]}
                                barSize={10}
                            />
                            <Bar
                                dataKey="awValue"
                                name="aw"
                                fill="var(--chart-4)"
                                radius={[0, 3, 3, 0]}
                                barSize={10}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
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
import {
    useKeywordThemeDefinitions,
    useKeywordThemes,
} from "../hooks/use-keyword"
import {
    KEYWORDS_CHART_CONFIG,
    type ThemeMetricMode,
    formatCompactNumber,
    formatDecimal,
    formatNumber,
    formatThemeLabel,
} from "../keyword-formatter"

type AggregatedThemeRow = {
    theme: string
    displayLabel: string
    negPer10k: number
    neuPer10k: number
    posPer10k: number
    negCount: number
    neuCount: number
    posCount: number
    totalPer10k: number
    totalCount: number
}

type TooltipPayloadEntry = {
    payload?: AggregatedThemeRow
}

function ThemeIntensityTooltipContent({
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
        <div className="min-w-[245px] rounded-lg border border-border/60 bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
            <p className="font-semibold text-foreground">{item.displayLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                Total kemunculan:{" "}
                <span className="font-medium text-foreground">
                    {formatNumber(item.totalCount)}
                </span>{" "}
                token
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
                        {formatDecimal(item.negPer10k)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            /10k ({formatCompactNumber(item.negCount)})
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
                        {formatDecimal(item.neuPer10k)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            /10k ({formatCompactNumber(item.neuCount)})
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
                        {formatDecimal(item.posPer10k)}{" "}
                        <span className="text-[11px] text-muted-foreground">
                            /10k ({formatCompactNumber(item.posCount)})
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export function KeywordThemesChart() {
    const [metricMode, setMetricMode] =
        React.useState<ThemeMetricMode>("per_10k_tokens")
    const [selectedTheme, setSelectedTheme] = React.useState<string>("")

    const themesQuery = useKeywordThemes()
    const definitionsQuery = useKeywordThemeDefinitions()

    const chartData = React.useMemo<AggregatedThemeRow[]>(() => {
        const raw = themesQuery.data ?? []
        const map = new Map<string, AggregatedThemeRow>()

        for (const row of raw) {
            const current = map.get(row.theme) ?? {
                theme: row.theme,
                displayLabel: formatThemeLabel(row.theme),
                negPer10k: 0,
                neuPer10k: 0,
                posPer10k: 0,
                negCount: 0,
                neuCount: 0,
                posCount: 0,
                totalPer10k: 0,
                totalCount: 0,
            }

            if (row.sentiment === "negative") {
                current.negPer10k = row.per_10k_tokens
                current.negCount = row.n_occurrences
            } else if (row.sentiment === "neutral") {
                current.neuPer10k = row.per_10k_tokens
                current.neuCount = row.n_occurrences
            } else if (row.sentiment === "positive") {
                current.posPer10k = row.per_10k_tokens
                current.posCount = row.n_occurrences
            }

            current.totalPer10k =
                current.negPer10k + current.neuPer10k + current.posPer10k
            current.totalCount = current.negCount + current.neuCount + current.posCount
            map.set(row.theme, current)
        }

        return [...map.values()].sort((a, b) =>
            metricMode === "per_10k_tokens"
                ? b.totalPer10k - a.totalPer10k
                : b.totalCount - a.totalCount
        )
    }, [themesQuery.data, metricMode])

    const definitions = definitionsQuery.data ?? []

    const activeTheme = selectedTheme || definitions[0]?.theme

    const activeDefinition = definitions.find(
        (item) => item.theme === activeTheme
    )

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Intensitas Tema Wacana per Sentimen
                    </CardTitle>
                    <CardDescription>
                        Perbandingan kemunculan klaster tema (per 10.000 token maupun frekuensi absolut) beserta kamus kata kuncinya
                    </CardDescription>
                </div>

                <div className="inline-flex self-start rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    <button
                        type="button"
                        onClick={() => setMetricMode("per_10k_tokens")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition-colors",
                            metricMode === "per_10k_tokens"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Per 10rb Token
                    </button>
                    <button
                        type="button"
                        onClick={() => setMetricMode("n_occurrences")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition-colors",
                            metricMode === "n_occurrences"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Frekuensi
                    </button>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-6">
                {themesQuery.isLoading ? (
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                ) : themesQuery.isError || chartData.length === 0 ? (
                    <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                        Data intensitas tema wacana tidak tersedia.
                    </div>
                ) : (
                    <ChartContainer config={KEYWORDS_CHART_CONFIG} className="h-[340px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
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
                                tickFormatter={(value) =>
                                    metricMode === "per_10k_tokens"
                                        ? formatDecimal(Number(value))
                                        : formatCompactNumber(Number(value))
                                }
                            />
                            <YAxis
                                type="category"
                                dataKey="displayLabel"
                                width={136}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip content={<ThemeIntensityTooltipContent />} />
                            <Bar
                                dataKey={
                                    metricMode === "per_10k_tokens" ? "negPer10k" : "negCount"
                                }
                                name="negative"
                                fill="var(--chart-1)"
                                radius={[0, 3, 3, 0]}
                                barSize={8}
                            />
                            <Bar
                                dataKey={
                                    metricMode === "per_10k_tokens" ? "neuPer10k" : "neuCount"
                                }
                                name="neutral"
                                fill="var(--chart-3)"
                                radius={[0, 3, 3, 0]}
                                barSize={8}
                            />
                            <Bar
                                dataKey={
                                    metricMode === "per_10k_tokens" ? "posPer10k" : "posCount"
                                }
                                name="positive"
                                fill="var(--chart-2)"
                                radius={[0, 3, 3, 0]}
                                barSize={8}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>
                )}

                {!definitionsQuery.isLoading && definitions.length > 0 && (
                    <div className="rounded-lg border border-border/70 bg-muted/25 p-3.5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs font-medium text-foreground">
                                Kamus Kata Kunci Penyusun Tema
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {definitions.map((def) => (
                                    <button
                                        key={def.theme}
                                        type="button"
                                        onClick={() => setSelectedTheme(def.theme)}
                                        className={cn(
                                            "rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
                                            selectedTheme === def.theme
                                                ? "border-border bg-background text-foreground shadow-xs"
                                                : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {formatThemeLabel(def.theme)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeDefinition && (
                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
                                {activeDefinition.keywords.map((kw) => (
                                    <span
                                        key={kw}
                                        className="rounded-md border border-border/70 bg-background px-2 py-0.5 font-mono text-[11px] text-foreground"
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
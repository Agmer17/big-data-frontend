"use client"

import * as React from "react"
import { BookOpen, Flame, Hash, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    useDistinctiveKeywords,
    useKeywordThemeDefinitions,
    useKeywordThemes,
    useTopKeywords,
} from "../hooks/use-keyword"
import {
    formatDecimal,
    formatNumber,
    formatSignedDecimal,
    formatThemeLabel,
} from "../keyword-formatter"

export function KeywordsKpiCards() {
    const topCommentQuery = useTopKeywords({
        source_field: "comment",
        page: 1,
        page_size: 1,
    })
    const themesQuery = useKeywordThemes()
    const definitionsQuery = useKeywordThemeDefinitions()
    const distinctiveNegQuery = useDistinctiveKeywords({
        sentiment: "negative",
        limit: 1,
        min_occurrences: 20,
    })
    const distinctivePosQuery = useDistinctiveKeywords({
        sentiment: "positive",
        limit: 1,
        min_occurrences: 20,
    })

    const isLoading =
        topCommentQuery.isLoading ||
        themesQuery.isLoading ||
        distinctiveNegQuery.isLoading ||
        distinctivePosQuery.isLoading

    const dominantTheme = React.useMemo(() => {
        const rows = themesQuery.data ?? []
        if (rows.length === 0) return null

        const grouped = new Map<
            string,
            { theme: string; totalOccurrences: number; totalPer10k: number }
        >()

        for (const row of rows) {
            const existing = grouped.get(row.theme) ?? {
                theme: row.theme,
                totalOccurrences: 0,
                totalPer10k: 0,
            }
            existing.totalOccurrences += row.n_occurrences
            existing.totalPer10k += row.per_10k_tokens
            grouped.set(row.theme, existing)
        }

        return [...grouped.values()].sort(
            (a, b) => b.totalOccurrences - a.totalOccurrences
        )[0]
    }, [themesQuery.data])

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="size-4 rounded-sm" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-7 w-36" />
                            <Skeleton className="h-3.5 w-44" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const topKeyword = topCommentQuery.data?.data?.[0]
    const totalDefinedThemes = definitionsQuery.data?.length ?? 0
    const topNegDistinctive = distinctiveNegQuery.data?.[0]
    const topPosDistinctive = distinctivePosQuery.data?.[0]

    const metrics = [
        {
            title: "Kata Kunci Terpopuler",
            value: topKeyword ? `"${topKeyword.keyword}"` : "—",
            description: topKeyword
                ? `${formatNumber(topKeyword.n_occurrences)} kemunculan di komentar`
                : "Data top keyword tidak tersedia",
            icon: Hash,
            accentVar: "var(--chart-4)",
        },
        {
            title: "Tema Wacana Dominan",
            value: dominantTheme ? formatThemeLabel(dominantTheme.theme) : "—",
            description: dominantTheme
                ? `${formatNumber(dominantTheme.totalOccurrences)} token · ${totalDefinedThemes} tema terdefinisi`
                : "Data tema wacana tidak tersedia",
            icon: BookOpen,
            accentVar: "var(--chart-3)",
        },
        {
            title: "Penanda Khas Negatif",
            value: topNegDistinctive ? `"${topNegDistinctive.keyword}"` : "—",
            description: topNegDistinctive
                ? `Log₂ ratio ${formatSignedDecimal(topNegDistinctive.log2_ratio)} · ${formatDecimal(topNegDistinctive.per_10k_tokens)} / 10rb token`
                : "Data keyword khas negatif tidak tersedia",
            icon: Flame,
            accentVar: "var(--chart-1)",
        },
        {
            title: "Penanda Khas Positif",
            value: topPosDistinctive ? `"${topPosDistinctive.keyword}"` : "—",
            description: topPosDistinctive
                ? `Log₂ ratio ${formatSignedDecimal(topPosDistinctive.log2_ratio)} · ${formatDecimal(topPosDistinctive.per_10k_tokens)} / 10rb token`
                : "Data keyword khas positif tidak tersedia",
            icon: Sparkles,
            accentVar: "var(--chart-2)",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {item.title}
                        </CardTitle>
                        <item.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 min-w-0">
                            {item.accentVar && (
                                <span
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.accentVar }}
                                    aria-hidden="true"
                                />
                            )}
                            <span className="truncate text-2xl font-semibold tracking-tight">
                                {item.value}
                            </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground tabular-nums">
                            {item.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
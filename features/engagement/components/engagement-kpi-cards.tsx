"use client"

import * as React from "react"
import { ArrowBigUp, Flame, Layers, MessageSquareWarning } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    useControversiality,
    useControversialityBySentiment,
    useEngagementBySentiment,
    useScoreDistribution,
} from "../hooks/use-engagement"
import {
    formatCompactNumber,
    formatNumber,
    formatPercent,
    formatScore,
    formatScoreCategoryLabel,
    formatSentimentLabel,
} from "../engagement-formatter"

export function EngagementKpiCards() {
    const scoreDistQuery = useScoreDistribution()
    const bySentimentQuery = useEngagementBySentiment()
    const controversialityQuery = useControversiality()
    const controversialBySentimentQuery = useControversialityBySentiment()

    const isLoading =
        scoreDistQuery.isLoading ||
        bySentimentQuery.isLoading ||
        controversialityQuery.isLoading ||
        controversialBySentimentQuery.isLoading

    const summary = React.useMemo(() => {
        const distRows = scoreDistQuery.data ?? []
        const dominantBucket = [...distRows].sort(
            (a, b) => b.n_comments - a.n_comments
        )[0]

        const topScoreSentiment = [...(bySentimentQuery.data ?? [])].sort(
            (a, b) => b.avg_score - a.avg_score
        )[0]

        const controRows = controversialityQuery.data ?? []
        const controTotal = controRows.reduce((acc, row) => acc + row.n_comments, 0)
        const controversialRow = controRows.find((row) => row.controversiality === 1)
        const controversialCount = controversialRow?.n_comments ?? 0
        const controversialPct =
            controTotal > 0 ? (controversialCount / controTotal) * 100 : 0

        const mostControversialSentiment = [
            ...(controversialBySentimentQuery.data ?? []),
        ].sort((a, b) => b.pct_controversial - a.pct_controversial)[0]

        return {
            dominantBucket,
            topScoreSentiment,
            controversialCount,
            controversialPct,
            mostControversialSentiment,
        }
    }, [
        scoreDistQuery.data,
        bySentimentQuery.data,
        controversialityQuery.data,
        controversialBySentimentQuery.data,
    ])

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

    if (scoreDistQuery.isError && bySentimentQuery.isError) {
        return (
            <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                    Gagal memuat ringkasan metrik engagement komentar.
                </CardContent>
            </Card>
        )
    }

    const metrics = [
        {
            title: "Kategori Skor Dominan",
            value: summary.dominantBucket
                ? formatScoreCategoryLabel(summary.dominantBucket.score_category)
                : "—",
            description: summary.dominantBucket
                ? `${formatPercent(summary.dominantBucket.percentage)} (${formatCompactNumber(summary.dominantBucket.n_comments)} komentar)`
                : "Data distribusi skor tidak tersedia",
            icon: Layers,
            accentVar: "var(--chart-4)",
        },
        {
            title: "Rerata Skor Tertinggi",
            value: summary.topScoreSentiment
                ? formatScore(summary.topScoreSentiment.avg_score)
                : "—",
            description: summary.topScoreSentiment
                ? `Sentimen ${formatSentimentLabel(summary.topScoreSentiment.sentiment)} · ${formatScore(summary.topScoreSentiment.avg_ups)} upvotes`
                : "Data engagement sentimen tidak tersedia",
            icon: ArrowBigUp,
            accentVar: "var(--chart-2)",
        },
        {
            title: "Tingkat Kontroversialitas",
            value: formatPercent(summary.controversialPct),
            description: `${formatNumber(summary.controversialCount)} komentar berstatus kontroversial`,
            icon: Flame,
            accentVar: "var(--chart-1)",
        },
        {
            title: "Sentimen Paling Kontroversial",
            value: summary.mostControversialSentiment
                ? formatSentimentLabel(summary.mostControversialSentiment.sentiment)
                : "—",
            description: summary.mostControversialSentiment
                ? `${formatPercent(summary.mostControversialSentiment.pct_controversial)} komentar memicu perdebatan`
                : "Data kontroversi per sentimen tidak tersedia",
            icon: MessageSquareWarning,
            accentVar: "var(--chart-3)",
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
                            <span className="truncate text-2xl font-semibold tracking-tight tabular-nums">
                                {item.value}
                            </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                            {item.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
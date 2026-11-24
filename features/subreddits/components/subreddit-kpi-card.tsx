"use client"

import { Flame, HeartHandshake, Layers, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    formatNumber,
    formatPercent,
    formatSubredditName,
} from "../subreddit-util"
import { useSubreddits, useTopSubreddits } from "../hooks/use-subreddit"

export function SubredditKpiCards() {
    const listMetaQuery = useSubreddits({
        min_comments: 100,
        sort_by: "n_total",
        order: "desc",
        page: 1,
        page_size: 1,
    })
    const topNegativeQuery = useTopSubreddits({
        metric: "pct_negative",
        limit: 1,
        min_comments: 100,
    })
    const topPositiveQuery = useTopSubreddits({
        metric: "pct_positive",
        limit: 1,
        min_comments: 100,
    })

    const isLoading =
        listMetaQuery.isLoading ||
        topNegativeQuery.isLoading ||
        topPositiveQuery.isLoading

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

    const totalSubreddits = listMetaQuery.data?.meta?.total
    const topVolume = listMetaQuery.data?.data?.[0]
    const topNegative = topNegativeQuery.data?.[0]
    const topPositive = topPositiveQuery.data?.[0]

    const metrics = [
        {
            title: "Komunitas Teranalisis",
            value: formatNumber(totalSubreddits),
            description: "Subreddit dengan minimal 100 komentar",
            icon: Layers,
            accentVar: undefined,
        },
        {
            title: "Volume Diskusi Tertinggi",
            value: formatSubredditName(topVolume?.subreddit),
            description: topVolume
                ? `${formatNumber(topVolume.n_total)} komentar · ${formatNumber(topVolume.n_posts)} post`
                : "Data tidak tersedia",
            icon: Trophy,
            accentVar: "var(--chart-4)",
        },
        {
            title: "Sentimen Negatif Tertinggi",
            value: formatSubredditName(topNegative?.subreddit),
            description: topNegative
                ? `${formatPercent(topNegative.pct_negative)} negatif (${formatNumber(topNegative.n_total)} komentar)`
                : "Data tidak tersedia",
            icon: Flame,
            accentVar: "var(--chart-1)",
        },
        {
            title: "Sentimen Positif Tertinggi",
            value: formatSubredditName(topPositive?.subreddit),
            description: topPositive
                ? `${formatPercent(topPositive.pct_positive)} positif (${formatNumber(topPositive.n_total)} komentar)`
                : "Data tidak tersedia",
            icon: HeartHandshake,
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
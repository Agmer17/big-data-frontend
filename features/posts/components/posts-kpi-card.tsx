"use client"

import { FileText, Flame, MessageSquare, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePosts, useTopPosts } from "../hooks/use-posts"
import {
    formatDecimal,
    formatNumber,
    formatPercent,
    formatSubredditName,
} from "../posts-formatter"

export function PostsKpiCards() {
    const listMetaQuery = usePosts({
        min_comments: 1,
        sort_by: "n_total",
        order: "desc",
        page: 1,
        page_size: 1,
    })
    const topBalanceQuery = useTopPosts({
        metric: "balance",
        limit: 1,
        min_comments: 50,
    })
    const topNegativeQuery = useTopPosts({
        metric: "pct_negative",
        limit: 1,
        min_comments: 50,
    })

    const isLoading =
        listMetaQuery.isLoading ||
        topBalanceQuery.isLoading ||
        topNegativeQuery.isLoading

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

    const totalPosts = listMetaQuery.data?.meta?.total
    const topVolumePost = listMetaQuery.data?.data?.[0]
    const topBalancePost = topBalanceQuery.data?.[0]
    const topNegativePost = topNegativeQuery.data?.[0]

    const metrics = [
        {
            title: "Total Post Teranalisis",
            value: formatNumber(totalPosts),
            description: "Utas diskusi dengan minimal 1 komentar",
            icon: FileText,
            accentVar: undefined,
        },
        {
            title: "Diskusi Paling Ramai",
            value: topVolumePost ? `${formatNumber(topVolumePost.n_total)}` : "—",
            description: topVolumePost
                ? `${formatSubredditName(topVolumePost.subreddit)} · ${topVolumePost.post_title}`
                : "Data volume post tidak tersedia",
            icon: MessageSquare,
            accentVar: "var(--chart-4)",
        },
        {
            title: "Indeks Keseimbangan Puncak",
            value: topBalancePost ? formatDecimal(topBalancePost.balance_index) : "—",
            description: topBalancePost
                ? `${formatPercent(topBalancePost.pct_positive)} pos vs ${formatPercent(topBalancePost.pct_negative)} neg (${formatSubredditName(topBalancePost.subreddit)})`
                : "Data keseimbangan post tidak tersedia",
            icon: Scale,
            accentVar: "var(--chart-3)",
        },
        {
            title: "Polaritas Negatif Tertinggi",
            value: topNegativePost ? formatPercent(topNegativePost.pct_negative) : "—",
            description: topNegativePost
                ? `${formatNumber(topNegativePost.n_total)} komentar di ${formatSubredditName(topNegativePost.subreddit)}`
                : "Data sentimen negatif post tidak tersedia",
            icon: Flame,
            accentVar: "var(--chart-1)",
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
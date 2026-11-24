"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PostSentiment } from "../api/posts.client"
import { useTopPosts } from "../hooks/use-posts"
import {
    type TopPostMetricOption,
    formatDecimal,
    formatNumber,
    formatPercent,
    formatPostDate,
    formatSubredditName,
    formatUpvoteRatio,
} from "../posts-formatter"

const METRIC_OPTIONS: Array<{ value: TopPostMetricOption; label: string }> = [
    { value: "volume", label: "Teramai" },
    { value: "balance", label: "Berimbang" },
    { value: "pct_negative", label: "% Negatif" },
    { value: "pct_positive", label: "% Positif" },
]

const MIN_COMMENTS_OPTIONS = [
    { value: 0, label: "Semua" },
    { value: 50, label: "≥ 50" },
    { value: 200, label: "≥ 200" },
]

export function TopPostsCard() {
    const [metric, setMetric] = React.useState<TopPostMetricOption>("volume")
    const [minComments, setMinComments] = React.useState<number>(0)

    function handleMetricChange(nextMetric: TopPostMetricOption) {
        setMetric(nextMetric)
        if (nextMetric !== "volume" && minComments === 0) {
            setMinComments(50)
        } else if (nextMetric === "volume" && minComments === 50) {
            setMinComments(0)
        }
    }

    const { data, isLoading, isError } = useTopPosts({
        metric,
        limit: 6,
        min_comments: minComments,
    })

    const items = data ?? []

    function renderPrimaryBadge(post: PostSentiment) {
        if (metric === "volume") {
            return `${formatNumber(post.n_total)} komentar`
        }
        if (metric === "balance") {
            return `Balance ${formatDecimal(post.balance_index)}`
        }
        if (metric === "pct_negative") {
            return `${formatPercent(post.pct_negative)} negatif`
        }
        return `${formatPercent(post.pct_positive)} positif`
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">Post Paling Menonjol</CardTitle>
                        <CardDescription>
                            Utas diskusi dengan aktivitas dan polaritas opini tertinggi
                        </CardDescription>
                    </div>

                    <div className="inline-flex shrink-0 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        {MIN_COMMENTS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setMinComments(opt.value)}
                                className={cn(
                                    "rounded-md px-2 py-1 font-medium tabular-nums transition-colors",
                                    minComments === opt.value
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                    {METRIC_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleMetricChange(opt.value)}
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
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-20 w-full rounded-lg" />
                        ))}
                    </div>
                ) : isError || items.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data peringkat post tidak tersedia untuk kriteria ini.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {items.map((post, index) => (
                            <div
                                key={post.post_id}
                                className="rounded-lg border border-border/70 bg-card p-3 transition-colors hover:bg-muted/30"
                            >
                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground tabular-nums">
                                            {index + 1}
                                        </span>
                                        <span className="truncate font-medium text-muted-foreground">
                                            {formatSubredditName(post.subreddit)}
                                        </span>
                                        <span className="text-muted-foreground/60">·</span>
                                        <span className="shrink-0 text-[11px] text-muted-foreground">
                                            {formatPostDate(post.post_created_time)}
                                        </span>
                                    </div>

                                    <span className="shrink-0 font-semibold tabular-nums">
                                        {renderPrimaryBadge(post)}
                                    </span>
                                </div>

                                <p
                                    className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-medium text-foreground"
                                    title={post.post_title}
                                >
                                    {post.post_title}
                                </p>

                                <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        style={{
                                            width: `${post.pct_negative}%`,
                                            backgroundColor: "var(--chart-1)",
                                        }}
                                        title={`Negatif: ${formatPercent(post.pct_negative)}`}
                                    />
                                    <div
                                        style={{
                                            width: `${post.pct_neutral}%`,
                                            backgroundColor: "var(--chart-3)",
                                        }}
                                        title={`Netral: ${formatPercent(post.pct_neutral)}`}
                                    />
                                    <div
                                        style={{
                                            width: `${post.pct_positive}%`,
                                            backgroundColor: "var(--chart-2)",
                                        }}
                                        title={`Positif: ${formatPercent(post.pct_positive)}`}
                                    />
                                </div>

                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground tabular-nums">
                                    <span>
                                        Skor {formatNumber(post.post_score)} · Upvote{" "}
                                        {formatUpvoteRatio(post.post_upvote_ratio)} ·{" "}
                                        {formatNumber(post.n_total)} kom
                                    </span>
                                    <span>
                                        Neg {formatPercent(post.pct_negative)} · Pos{" "}
                                        {formatPercent(post.pct_positive)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
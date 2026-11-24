"use client"

import { MessageSquare, Scale, ThumbsDown, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOverallSentimentSummary } from "../hooks/use-sentiment"
import { formatNumber, formatPercent, formatRatio } from "./../sentiment-formatter"

export function SentimentKpiCards() {
    const { data, isLoading, isError } = useOverallSentimentSummary()

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
                            <Skeleton className="h-7 w-32" />
                            <Skeleton className="h-3.5 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (isError || !data) {
        return (
            <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                    Gagal memuat ringkasan metrik sentimen.
                </CardContent>
            </Card>
        )
    }

    const total = data.total_comments || 1
    const pctNegative = (data.n_negative / total) * 100
    const pctPositive = (data.n_positive / total) * 100
    const pctNeutral = (data.n_neutral / total) * 100

    const metrics = [
        {
            title: "Total Komentar",
            value: formatNumber(data.total_comments),
            description: `Netral mencakup ${formatPercent(pctNeutral)} (${formatNumber(data.n_neutral)})`,
            icon: MessageSquare,
            accentVar: undefined,
        },
        {
            title: "Sentimen Negatif",
            value: formatNumber(data.n_negative),
            description: `${formatPercent(pctNegative)} dari total korpus`,
            icon: ThumbsDown,
            accentVar: "var(--chart-1)",
        },
        {
            title: "Sentimen Positif",
            value: formatNumber(data.n_positive),
            description: `${formatPercent(pctPositive)} dari total korpus`,
            icon: ThumbsUp,
            accentVar: "var(--chart-2)",
        },
        {
            title: "Rasio Positif : Negatif",
            value: formatRatio(data.positive_to_negative_ratio),
            description: "Perbandingan polaritas opini langsung",
            icon: Scale,
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
                        <div className="flex items-center gap-2">
                            {item.accentVar && (
                                <span
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.accentVar }}
                                    aria-hidden="true"
                                />
                            )}
                            <span className="text-2xl font-semibold tracking-tight tabular-nums">
                                {item.value}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
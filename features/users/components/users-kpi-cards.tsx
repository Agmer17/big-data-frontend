"use client"

import * as React from "react"
import { Award, ShieldCheck, TrendingDown, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    useKarmaSentiment,
    useVerificationSentiment,
} from "../hooks/use-users"
import {
    formatCompactNumber,
    formatKarmaLabel,
    formatNumber,
    formatPercent,
    formatScore,
} from "../user-formatter"

export function UsersKpiCards() {
    const karmaQuery = useKarmaSentiment()
    const verificationQuery = useVerificationSentiment()

    const isLoading = karmaQuery.isLoading || verificationQuery.isLoading

    const summary = React.useMemo(() => {
        const karmaRows = karmaQuery.data ?? []
        const verifRows = verificationQuery.data ?? []

        const totalAccounts = karmaRows.reduce((acc, row) => acc + row.n_accounts, 0)
        const totalComments = karmaRows.reduce((acc, row) => acc + row.n_total, 0)

        const knownKarma = karmaRows.filter((row) => row.karma_category !== "Unknown")
        const dominantKarma = [...knownKarma].sort((a, b) => b.n_total - a.n_total)[0]
        const mostNegativeKarma = [...knownKarma].sort(
            (a, b) => b.pct_negative - a.pct_negative
        )[0]
        const leastNegativeKarma = [...knownKarma].sort(
            (a, b) => a.pct_negative - b.pct_negative
        )[0]

        const verifiedRow = verifRows.find((row) => row.verified_status === "TRUE")
        const totalVerifComments = verifRows.reduce((acc, row) => acc + row.n_total, 0)
        const verifiedCommentShare =
            verifiedRow && totalVerifComments > 0
                ? (verifiedRow.n_total / totalVerifComments) * 100
                : 0

        return {
            totalAccounts,
            totalComments,
            dominantKarma,
            mostNegativeKarma,
            leastNegativeKarma,
            verifiedRow,
            verifiedCommentShare,
        }
    }, [karmaQuery.data, verificationQuery.data])

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

    if (karmaQuery.isError || !karmaQuery.data) {
        return (
            <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                    Gagal memuat ringkasan karakteristik akun pengguna.
                </CardContent>
            </Card>
        )
    }

    const avgCommentsPerAccount =
        summary.totalAccounts > 0 ? summary.totalComments / summary.totalAccounts : 0

    const metrics = [
        {
            title: "Total Akun Unik",
            value: formatNumber(summary.totalAccounts),
            description: `Rerata ${formatScore(avgCommentsPerAccount)} komentar per akun`,
            icon: Users,
            accentVar: undefined,
        },
        {
            title: "Segmen Karma Dominan",
            value: summary.dominantKarma
                ? formatKarmaLabel(summary.dominantKarma.karma_category)
                : "—",
            description: summary.dominantKarma
                ? `${formatCompactNumber(summary.dominantKarma.n_total)} komentar · skor rerata ${formatScore(summary.dominantKarma.avg_score)}`
                : "Data tidak tersedia",
            icon: Award,
            accentVar: "var(--chart-4)",
        },
        {
            title: "Rentang Sentimen Negatif",
            value:
                summary.mostNegativeKarma && summary.leastNegativeKarma
                    ? `${formatPercent(summary.leastNegativeKarma.pct_negative)} – ${formatPercent(summary.mostNegativeKarma.pct_negative)}`
                    : "—",
            description:
                summary.mostNegativeKarma && summary.leastNegativeKarma
                    ? `Terendah di ${formatKarmaLabel(summary.leastNegativeKarma.karma_category)}, tertinggi di ${formatKarmaLabel(summary.mostNegativeKarma.karma_category)}`
                    : "Data tidak tersedia",
            icon: TrendingDown,
            accentVar: "var(--chart-1)",
        },
        {
            title: "Kontribusi Akun Terverifikasi",
            value: formatPercent(summary.verifiedCommentShare),
            description: summary.verifiedRow
                ? `${formatNumber(summary.verifiedRow.n_accounts)} akun terverifikasi (${formatPercent(summary.verifiedRow.pct_negative)} negatif)`
                : "Data verifikasi tidak tersedia",
            icon: ShieldCheck,
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
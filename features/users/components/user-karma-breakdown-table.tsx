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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    useKarmaSentiment,
    useKarmaWeightedComparison,
} from "../hooks/use-users"
import {
    formatKarmaLabel,
    formatNumber,
    formatPercent,
    formatPpDelta,
    formatScore,
} from "../user-formatter"

export function KarmaBreakdownTable() {
    const sentimentQuery = useKarmaSentiment()
    const weightedQuery = useKarmaWeightedComparison()

    const isLoading = sentimentQuery.isLoading || weightedQuery.isLoading

    const rows = React.useMemo(() => {
        const base = [...(sentimentQuery.data ?? [])].sort(
            (a, b) => a.category_order - b.category_order
        )
        const weightedMap = new Map(
            (weightedQuery.data ?? []).map((item) => [item.karma_category, item])
        )

        return base.map((item) => {
            const weighted = weightedMap.get(item.karma_category)
            const commentsPerAccount =
                item.n_accounts > 0 ? item.n_total / item.n_accounts : 0
            const negDeltaPp = weighted
                ? weighted.cw_pct_negative - weighted.aw_pct_negative
                : null

            return {
                ...item,
                commentsPerAccount,
                aw_pct_negative: weighted?.aw_pct_negative ?? null,
                negDeltaPp,
            }
        })
    }, [sentimentQuery.data, weightedQuery.data])

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">
                    Matriks Lengkap Segmen Karma Pengguna
                </CardTitle>
                <CardDescription>
                    Rincian populasi akun, intensitas komentar, skor karma rata-rata, dan selisih pembobotan sentimen negatif
                </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
                {isLoading ? (
                    <div className="space-y-2.5 px-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Skeleton key={index} className="h-9 w-full" />
                        ))}
                    </div>
                ) : sentimentQuery.isError || rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data rincian segmen karma tidak tersedia.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Kategori Karma</TableHead>
                                    <TableHead className="text-right">Akun</TableHead>
                                    <TableHead className="text-right">Komentar</TableHead>
                                    <TableHead className="text-right">Komentar/Akun</TableHead>
                                    <TableHead className="text-right">Skor Rerata</TableHead>
                                    <TableHead className="text-right">Negatif (CW)</TableHead>
                                    <TableHead className="text-right">Negatif (AW)</TableHead>
                                    <TableHead className="text-right">Selisih</TableHead>
                                    <TableHead className="text-right">Positif (CW)</TableHead>
                                    <TableHead className="w-[120px] pr-6">Sebaran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.karma_category}>
                                        <TableCell className="pl-6 font-medium whitespace-nowrap">
                                            {formatKarmaLabel(row.karma_category)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatNumber(row.n_accounts)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatNumber(row.n_total)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatScore(row.commentsPerAccount)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatScore(row.avg_score)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatPercent(row.pct_negative)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatPercent(row.aw_pct_negative)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatPpDelta(row.negDeltaPp)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatPercent(row.pct_positive)}
                                        </TableCell>
                                        <TableCell className="pr-6">
                                            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    style={{
                                                        width: `${row.pct_negative}%`,
                                                        backgroundColor: "var(--chart-1)",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_neutral}%`,
                                                        backgroundColor: "var(--chart-3)",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_positive}%`,
                                                        backgroundColor: "var(--chart-2)",
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
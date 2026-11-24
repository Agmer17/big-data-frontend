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
    useScoreCategorySentiment,
    useScoreDistribution,
} from "../hooks/use-engagement"
import {
    formatNumber,
    formatPercent,
    formatScoreCategoryLabel,
} from "../engagement-formatter"

export function EngagementBreakdownTable() {
    const categoryQuery = useScoreCategorySentiment()
    const distQuery = useScoreDistribution()

    const isLoading = categoryQuery.isLoading || distQuery.isLoading

    const rows = React.useMemo(() => {
        const base = categoryQuery.data ?? []
        const distRows = distQuery.data ?? []
        const distMap = new Map(
            distRows.map((item) => [item.score_category, item])
        )
        const grandTotal = distRows.reduce((acc, item) => acc + item.n_comments, 0)

        return [...base]
            .sort((a, b) => a.category_order - b.category_order)
            .map((item) => {
                const distItem = distMap.get(item.score_category)
                const total = distItem?.n_comments ?? item.n_comments
                const percentage =
                    distItem?.percentage ??
                    (grandTotal > 0 ? (total / grandTotal) * 100 : 0)

                return {
                    ...item,
                    total,
                    percentage,
                }
            })
    }, [categoryQuery.data, distQuery.data])

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">
                    Matriks Distribusi Skor &amp; Polaritas Sentimen
                </CardTitle>
                <CardDescription>
                    Rincian volume komentar, pangsa distribusi, serta persentase sentimen pada setiap kategori skor
                </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
                {isLoading ? (
                    <div className="space-y-2.5 px-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-9 w-full" />
                        ))}
                    </div>
                ) : categoryQuery.isError || rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data rincian kategori skor tidak tersedia.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Kategori Skor</TableHead>
                                    <TableHead className="text-right">Komentar</TableHead>
                                    <TableHead className="text-right">Pangsa</TableHead>
                                    <TableHead className="text-right">Negatif</TableHead>
                                    <TableHead className="text-right">Netral</TableHead>
                                    <TableHead className="text-right">Positif</TableHead>
                                    <TableHead className="w-[130px] pr-6">Sebaran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.score_category}>
                                        <TableCell className="pl-6 font-medium whitespace-nowrap">
                                            {formatScoreCategoryLabel(row.score_category)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatNumber(row.total)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatPercent(row.percentage)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatPercent(row.pct_negative)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatPercent(row.pct_neutral)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatPercent(row.pct_positive)}
                                        </TableCell>
                                        <TableCell className="pr-6">
                                            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    style={{
                                                        width: `${row.pct_negative}%`,
                                                        backgroundColor: "var(--chart-1)",
                                                    }}
                                                    title={`Negatif: ${formatPercent(row.pct_negative)}`}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_neutral}%`,
                                                        backgroundColor: "var(--chart-3)",
                                                    }}
                                                    title={`Netral: ${formatPercent(row.pct_neutral)}`}
                                                />
                                                <div
                                                    style={{
                                                        width: `${row.pct_positive}%`,
                                                        backgroundColor: "var(--chart-2)",
                                                    }}
                                                    title={`Positif: ${formatPercent(row.pct_positive)}`}
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
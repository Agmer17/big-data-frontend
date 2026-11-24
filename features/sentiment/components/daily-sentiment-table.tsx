"use client"

import * as React from "react"
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { useDailySentiment } from "../hooks/use-sentiment"
import {
    formatDateLabel,
    formatNumber,
    formatPercent,
} from "../sentiment-formatter"

const PAGE_SIZE = 10

export function DailySentimentTable() {
    const [page, setPage] = React.useState(1)
    const [order, setOrder] = React.useState<"desc" | "asc">("desc")

    const { data, isLoading, isError, isFetching } = useDailySentiment({
        page,
        page_size: PAGE_SIZE,
        order,
    })

    const rows = data?.data ?? []
    const meta = data?.meta
    const totalItems = meta?.total ?? 0
    const totalPages =
        meta?.total_pages ?? (totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1)

    function toggleOrder() {
        setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
        setPage(1)
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                    <CardTitle className="text-base">Log Sentimen Harian</CardTitle>
                    <CardDescription>
                        Rincian volume komentar, moving average 7 hari, dan komposisi harian
                    </CardDescription>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleOrder}
                    className="h-8 gap-1.5 text-xs"
                >
                    <ArrowDownUp className="size-3.5" />
                    {order === "desc" ? "Terbaru" : "Terlama"}
                </Button>
            </CardHeader>

            <CardContent className="flex-1 px-0">
                {isLoading ? (
                    <div className="space-y-2.5 px-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Skeleton key={index} className="h-9 w-full" />
                        ))}
                    </div>
                ) : isError || rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data log harian tidak tersedia.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Tanggal</TableHead>
                                    <TableHead className="text-right">Komentar</TableHead>
                                    <TableHead className="text-right">MA-7</TableHead>
                                    <TableHead className="text-right">Negatif</TableHead>
                                    <TableHead className="text-right">Netral</TableHead>
                                    <TableHead className="text-right">Positif</TableHead>
                                    <TableHead className="w-[110px] pr-6">Sebaran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.comment_date}>
                                        <TableCell className="pl-6 font-medium whitespace-nowrap">
                                            {formatDateLabel(row.comment_date, "full")}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatNumber(row.n_total)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatNumber(row.n_total_ma7)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatPercent(row.pct_negative)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatPercent(row.pct_neutral)}
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

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span className="tabular-nums">
                    Halaman {page} dari {totalPages}
                    {totalItems > 0 ? ` · ${formatNumber(totalItems)} hari` : ""}
                    {isFetching && !isLoading ? " · Memuat..." : ""}
                </span>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        disabled={page <= 1 || isFetching}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className="mr-1 size-3.5" />
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        disabled={page >= totalPages || isFetching}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Berikutnya
                        <ChevronRight className="ml-1 size-3.5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
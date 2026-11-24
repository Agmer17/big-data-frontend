"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { useTopKeywords } from "../hooks/use-keyword"
import {
    type KeywordSentiment,
    type KeywordSourceField,
    formatNumber,
    formatPercent,
    formatSourceFieldLabel,
} from "../keyword-formatter"

const PAGE_SIZE = 15

const SOURCE_OPTIONS: Array<{ value: KeywordSourceField; label: string }> = [
    { value: "comment", label: "Komentar" },
    { value: "post_title", label: "Judul Post" },
    { value: "post_body", label: "Isi Post" },
]

const SENTIMENT_FILTER_OPTIONS: Array<{
    value: "all" | KeywordSentiment
    label: string
}> = [
        { value: "all", label: "Semua" },
        { value: "negative", label: "Negatif" },
        { value: "neutral", label: "Netral" },
        { value: "positive", label: "Positif" },
    ]

export function TopKeywordsTable() {
    const [sourceField, setSourceField] =
        React.useState<KeywordSourceField>("comment")
    const [sentimentFilter, setSentimentFilter] = React.useState<
        "all" | KeywordSentiment
    >("all")
    const [page, setPage] = React.useState<number>(1)

    function handleSourceFieldChange(nextSource: KeywordSourceField) {
        setSourceField(nextSource)
        if (nextSource !== "comment") {
            setSentimentFilter("all")
        }
        setPage(1)
    }

    function handleSentimentFilterChange(nextSentiment: "all" | KeywordSentiment) {
        setSentimentFilter(nextSentiment)
        setPage(1)
    }

    const { data, isLoading, isError, isFetching } = useTopKeywords({
        source_field: sourceField,
        sentiment:
            sourceField === "comment" && sentimentFilter !== "all"
                ? sentimentFilter
                : undefined,
        page,
        page_size: PAGE_SIZE,
    })

    const rows = data?.data ?? []
    const meta = data?.meta
    const totalItems = meta?.total ?? 0
    const totalPages =
        meta?.total_pages ?? (totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1)

    const maxOccurrences = React.useMemo(() => {
        if (rows.length === 0) return 1
        return Math.max(...rows.map((r) => r.n_occurrences), 1)
    }, [rows])

    const barFillVar =
        sourceField === "comment" && sentimentFilter === "negative"
            ? "var(--chart-1)"
            : sourceField === "comment" && sentimentFilter === "positive"
                ? "var(--chart-2)"
                : sourceField === "comment" && sentimentFilter === "neutral"
                    ? "var(--chart-3)"
                    : "var(--chart-4)"

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Frekuensi Kata Kunci Teratas ({formatSourceFieldLabel(sourceField)})
                    </CardTitle>
                    <CardDescription>
                        Peringkat kata kunci paling sering muncul berdasarkan sumber teks dan kelas sentimen komentar
                    </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                        {SOURCE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSourceFieldChange(opt.value)}
                                className={cn(
                                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                                    sourceField === opt.value
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div
                        className={cn(
                            "inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs transition-opacity",
                            sourceField !== "comment" && "pointer-events-none opacity-45"
                        )}
                        title={
                            sourceField !== "comment"
                                ? "Filter sentimen hanya tersedia untuk sumber Komentar"
                                : undefined
                        }
                    >
                        {SENTIMENT_FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                disabled={sourceField !== "comment"}
                                onClick={() => handleSentimentFilterChange(opt.value)}
                                className={cn(
                                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                                    sentimentFilter === opt.value
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 px-0">
                {isLoading ? (
                    <div className="space-y-2.5 px-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className="h-9 w-full" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Gagal memuat daftar kata kunci teratas.
                    </p>
                ) : rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Tidak ada data kata kunci untuk kombinasi filter ini.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 pl-6">Peringkat</TableHead>
                                    <TableHead>Kata Kunci</TableHead>
                                    <TableHead className="text-right">Kemunculan</TableHead>
                                    <TableHead className="w-[240px] pr-6">
                                        Skala Relatif (vs Puncak Halaman)
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, idx) => {
                                    const rank = (page - 1) * PAGE_SIZE + idx + 1
                                    const relativePct = (row.n_occurrences / maxOccurrences) * 100

                                    return (
                                        <TableRow key={`${row.keyword}-${rank}`}>
                                            <TableCell className="pl-6 text-xs text-muted-foreground tabular-nums">
                                                #{rank}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-medium">
                                                {row.keyword}
                                            </TableCell>
                                            <TableCell className="text-right font-medium tabular-nums">
                                                {formatNumber(row.n_occurrences)}
                                            </TableCell>
                                            <TableCell className="pr-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full transition-all"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(2, relativePct))}%`,
                                                                backgroundColor: barFillVar,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-11 text-right text-[11px] text-muted-foreground tabular-nums">
                                                        {formatPercent(relativePct)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span className="tabular-nums">
                    Halaman {page} dari {totalPages}
                    {totalItems > 0 ? ` · ${formatNumber(totalItems)} kata kunci` : ""}
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
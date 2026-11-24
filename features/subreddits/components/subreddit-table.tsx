"use client"

import * as React from "react"
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { useSubreddits } from "../hooks/use-subreddit"
import {
    type SubredditSortField,
    formatNumber,
    formatPercent,
    formatScore,
    formatSubredditName,
} from "../subreddit-util"

const PAGE_SIZE = 15
const MIN_COMMENTS_PRESETS = [100, 500, 1000, 5000]

export function SubredditsTable() {
    const [searchInput, setSearchInput] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [minComments, setMinComments] = React.useState<number>(100)
    const [sortBy, setSortBy] = React.useState<SubredditSortField>("n_total")
    const [order, setOrder] = React.useState<"asc" | "desc">("desc")
    const [page, setPage] = React.useState<number>(1)

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchInput.trim())
            setPage(1)
        }, 350)

        return () => window.clearTimeout(timer)
    }, [searchInput])

    const { data, isLoading, isError, isFetching } = useSubreddits({
        min_comments: minComments,
        search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
        sort_by: sortBy,
        order,
        page,
        page_size: PAGE_SIZE,
    })

    const rows = data?.data ?? []
    const meta = data?.meta
    const totalItems = meta?.total ?? 0
    const totalPages =
        meta?.total_pages ?? (totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1)

    function handleSort(field: SubredditSortField) {
        if (sortBy === field) {
            setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
        } else {
            setSortBy(field)
            setOrder(field === "subreddit" ? "asc" : "desc")
        }
        setPage(1)
    }

    function renderSortIcon(field: SubredditSortField) {
        if (sortBy !== field) {
            return <ArrowUpDown className="ml-1 inline size-3 opacity-45" />
        }
        return order === "desc" ? (
            <ArrowDown className="ml-1 inline size-3" />
        ) : (
            <ArrowUp className="ml-1 inline size-3" />
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <CardTitle className="text-base">Direktori Subreddit &amp; Distribusi Sentimen</CardTitle>
                    <CardDescription>
                        Telusuri, urutkan, dan bandingkan metrik polaritas di seluruh komunitas Reddit
                    </CardDescription>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari nama subreddit..."
                            className="h-8 pr-8 pl-8 text-xs"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput("")}
                                aria-label="Hapus pencarian"
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="shrink-0">Min:</span>
                        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
                            {MIN_COMMENTS_PRESETS.map((threshold) => (
                                <button
                                    key={threshold}
                                    type="button"
                                    onClick={() => {
                                        setMinComments(threshold)
                                        setPage(1)
                                    }}
                                    className={cn(
                                        "rounded-md px-2 py-1 font-medium tabular-nums transition-colors",
                                        minComments === threshold
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {formatNumber(threshold)}
                                </button>
                            ))}
                        </div>
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
                        Gagal memuat daftar subreddit.
                    </p>
                ) : rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Tidak ada subreddit yang sesuai dengan filter pencarian.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("subreddit")}
                                            className="inline-flex items-center font-medium hover:text-foreground"
                                        >
                                            Subreddit
                                            {renderSortIcon("subreddit")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("n_total")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Komentar
                                            {renderSortIcon("n_total")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("n_posts")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Post
                                            {renderSortIcon("n_posts")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("avg_score")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Skor Rerata
                                            {renderSortIcon("avg_score")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("pct_negative")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Negatif
                                            {renderSortIcon("pct_negative")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("pct_neutral")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Netral
                                            {renderSortIcon("pct_neutral")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("pct_positive")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Positif
                                            {renderSortIcon("pct_positive")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="w-[130px] pr-6">Sebaran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.subreddit}>
                                        <TableCell className="pl-6 font-medium whitespace-nowrap">
                                            {formatSubredditName(row.subreddit)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatNumber(row.n_total)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatNumber(row.n_posts)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatScore(row.avg_score)}
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

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span className="tabular-nums">
                    Halaman {page} dari {totalPages}
                    {totalItems > 0 ? ` · ${formatNumber(totalItems)} subreddit` : ""}
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
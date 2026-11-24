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
import { usePosts } from "../hooks/use-posts"
import {
    type PostSortField,
    formatDecimal,
    formatNumber,
    formatPercent,
    formatPostDate,
    formatSubredditName,
    formatUpvoteRatio,
} from "../posts-formatter"

const PAGE_SIZE = 15
const MIN_COMMENTS_PRESETS = [1, 10, 50, 100]

export function PostsTable() {
    const [titleInput, setTitleInput] = React.useState("")
    const [debouncedTitle, setDebouncedTitle] = React.useState("")
    const [subredditInput, setSubredditInput] = React.useState("")
    const [debouncedSubreddit, setDebouncedSubreddit] = React.useState("")
    const [minComments, setMinComments] = React.useState<number>(1)
    const [sortBy, setSortBy] = React.useState<PostSortField>("n_total")
    const [order, setOrder] = React.useState<"asc" | "desc">("desc")
    const [page, setPage] = React.useState<number>(1)

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedTitle(titleInput.trim())
            setPage(1)
        }, 350)

        return () => window.clearTimeout(timer)
    }, [titleInput])

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            const cleaned = subredditInput.trim().replace(/^r\//i, "")
            setDebouncedSubreddit(cleaned)
            setPage(1)
        }, 350)

        return () => window.clearTimeout(timer)
    }, [subredditInput])

    const { data, isLoading, isError, isFetching } = usePosts({
        min_comments: minComments,
        search: debouncedTitle.length > 0 ? debouncedTitle : undefined,
        subreddit: debouncedSubreddit.length > 0 ? debouncedSubreddit : undefined,
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

    function handleSort(field: PostSortField) {
        if (sortBy === field) {
            setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
        } else {
            setSortBy(field)
            setOrder("desc")
        }
        setPage(1)
    }

    function renderSortIcon(field: PostSortField) {
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
            <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Direktori Utas Post &amp; Sentimen Komentar
                    </CardTitle>
                    <CardDescription>
                        Cari judul topik diskusi, saring per subreddit, dan urutkan berdasarkan polaritas maupun indeks keseimbangan
                    </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative w-full sm:w-56">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            placeholder="Cari judul post..."
                            className="h-8 pr-8 pl-8 text-xs"
                        />
                        {titleInput && (
                            <button
                                type="button"
                                onClick={() => setTitleInput("")}
                                aria-label="Hapus pencarian judul"
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="relative w-full sm:w-44">
                        <Input
                            value={subredditInput}
                            onChange={(e) => setSubredditInput(e.target.value)}
                            placeholder="Filter r/subreddit..."
                            className="h-8 pr-8 text-xs"
                        />
                        {subredditInput && (
                            <button
                                type="button"
                                onClick={() => setSubredditInput("")}
                                aria-label="Hapus filter subreddit"
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="shrink-0">Min kom:</span>
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
                            <Skeleton key={index} className="h-11 w-full" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Gagal memuat daftar post diskusi.
                    </p>
                ) : rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Tidak ada post yang sesuai dengan kriteria pencarian atau filter.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[290px] pl-6">Judul Post &amp; Subreddit</TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("post_created_time")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Tanggal
                                            {renderSortIcon("post_created_time")}
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
                                            onClick={() => handleSort("post_score")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Skor
                                            {renderSortIcon("post_score")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("post_upvote_ratio")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Upvote
                                            {renderSortIcon("post_upvote_ratio")}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("balance_index")}
                                            className="inline-flex items-center justify-end font-medium hover:text-foreground"
                                        >
                                            Balance
                                            {renderSortIcon("balance_index")}
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
                                    <TableHead className="w-[115px] pr-6">Sebaran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.post_id}>
                                        <TableCell className="max-w-[360px] pl-6">
                                            <p
                                                className="line-clamp-2 text-xs leading-snug font-medium text-foreground"
                                                title={row.post_title}
                                            >
                                                {row.post_title}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                {formatSubredditName(row.subreddit)}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                                            {formatPostDate(row.post_created_time)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatNumber(row.n_total)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatNumber(row.post_score)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatUpvoteRatio(row.post_upvote_ratio)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatDecimal(row.balance_index)}
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
                    {totalItems > 0 ? ` · ${formatNumber(totalItems)} post` : ""}
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
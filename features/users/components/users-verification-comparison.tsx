"use client"

import * as React from "react"
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useVerificationSentiment } from "../hooks/use-users"
import {
    formatNumber,
    formatPercent,
    formatScore,
    formatVerificationLabel,
} from "../user-formatter"

export function VerificationComparisonCard() {
    const { data, isLoading, isError } = useVerificationSentiment()

    const { rows, totalComments } = React.useMemo(() => {
        const orderMap: Record<string, number> = { TRUE: 1, FALSE: 2, NULL: 3 }
        const sorted = [...(data ?? [])].sort(
            (a, b) => (orderMap[a.verified_status] ?? 9) - (orderMap[b.verified_status] ?? 9)
        )
        const total = sorted.reduce((acc, item) => acc + item.n_total, 0)
        return { rows: sorted, totalComments: total }
    }, [data])

    function renderStatusIcon(status: string) {
        if (status === "TRUE") {
            return <ShieldCheck className="size-4 text-foreground" />
        }
        if (status === "FALSE") {
            return <ShieldAlert className="size-4 text-muted-foreground" />
        }
        return <ShieldQuestion className="size-4 text-muted-foreground" />
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">Status Verifikasi Akun</CardTitle>
                <CardDescription>
                    Perbedaan polaritas dan intensitas komentar berdasarkan status verifikasi email/akun
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                ) : isError || rows.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Data verifikasi akun tidak tersedia.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {rows.map((row) => {
                            const sharePct =
                                totalComments > 0 ? (row.n_total / totalComments) * 100 : 0
                            const commentsPerAccount =
                                row.n_accounts > 0 ? row.n_total / row.n_accounts : 0

                            return (
                                <div
                                    key={row.verified_status}
                                    className="rounded-lg border border-border/70 bg-card p-3.5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/50">
                                                {renderStatusIcon(row.verified_status)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {formatVerificationLabel(row.verified_status)}
                                                </p>
                                                <p className="text-xs text-muted-foreground tabular-nums">
                                                    {formatNumber(row.n_accounts)} akun ·{" "}
                                                    {formatScore(commentsPerAccount)} komentar/akun
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right tabular-nums">
                                            <p className="text-sm font-semibold">
                                                {formatNumber(row.n_total)}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {formatPercent(sharePct)} korpus
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-muted">
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

                                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs tabular-nums">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="size-2 shrink-0 rounded-[2px]"
                                                style={{ backgroundColor: "var(--chart-1)" }}
                                            />
                                            <span className="text-muted-foreground">Neg:</span>
                                            <span className="font-medium">
                                                {formatPercent(row.pct_negative)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-1.5">
                                            <span
                                                className="size-2 shrink-0 rounded-[2px]"
                                                style={{ backgroundColor: "var(--chart-3)" }}
                                            />
                                            <span className="text-muted-foreground">Net:</span>
                                            <span className="font-medium">
                                                {formatPercent(row.pct_neutral)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-end gap-1.5">
                                            <span
                                                className="size-2 shrink-0 rounded-[2px]"
                                                style={{ backgroundColor: "var(--chart-2)" }}
                                            />
                                            <span className="text-muted-foreground">Pos:</span>
                                            <span className="font-medium">
                                                {formatPercent(row.pct_positive)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
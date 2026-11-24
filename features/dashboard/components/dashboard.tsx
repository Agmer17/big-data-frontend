"use client"

import {
  AlertCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react"

import {
  DiscussionAndKeywordsSection,
  EngagementSection,
  KarmaSection,
  PeakActivitySection,
  SentimentOverview,
  SubredditSection,
} from "@/features/dashboard/components/dashboard-sections"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useDashboardSummary } from "../hooks/use-dashboard-summary"

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 lg:col-span-1" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>

      <Skeleton className="h-80" />
    </div>
  )
}

export function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDashboardSummary()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl pt-12">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Gagal memuat summary</AlertTitle>
          <AlertDescription>
            Data analisis belum berhasil diambil dari backend.
            Periksa koneksi API, lalu coba muat ulang.
          </AlertDescription>
        </Alert>

        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="size-4" />
            Coba lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-9 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="size-4" />
            <span>Dashboard analitik Reddit</span>
          </div>

        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Data bersumber dari endpoint analytics
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <SentimentOverview data={data} />
      <PeakActivitySection data={data} />
      <SubredditSection data={data} />
      <KarmaSection data={data} />
      <EngagementSection data={data} />
      <DiscussionAndKeywordsSection data={data} />

      <footer className="border-t pt-5 text-xs leading-relaxed text-muted-foreground">
        Dashboard ini merangkum hasil klasifikasi pada dataset Reddit,
        bukan ukuran opini seluruh penduduk atau representasi seluruh
        pihak yang terdampak konflik. Interpretasi perlu
        mempertimbangkan bias komunitas, periode pengambilan data,
        dan keterbatasan model klasifikasi sentimen.
      </footer>
    </div>
  )
}


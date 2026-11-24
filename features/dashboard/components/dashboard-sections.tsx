
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  CalendarDays,
  MessageCircle,
  MessagesSquare,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DashboardSummary } from "@/features/dashboard/api/dashboard.client"

/* -------------------------------------------------------------------------- */
/* Palet & helper                                                              */
/* -------------------------------------------------------------------------- */

// Palet sengaja netral (rose / teal / slate), tidak memakai kombinasi warna
// bendera pihak mana pun supaya visual tidak terbaca sebagai keberpihakan.
const COLORS = {
  negative: "oklch(0.645 0.246 16.439)", // rose-500
  positive: "oklch(0.704 0.14 182.503)", // teal-500
  neutral: "oklch(0.554 0.046 257.417)", // slate-500
  sky: "oklch(0.685 0.169 237.323)", // sky-500
  violet: "oklch(0.606 0.25 292.717)", // violet-500
  amber: "oklch(0.769 0.188 70.08)", // amber-500
} as const

const SENTIMENT_META: Record<string, { label: string; color: string }> = {
  negative: { label: "Negatif", color: COLORS.negative },
  positive: { label: "Positif", color: COLORS.positive },
  neutral: { label: "Netral", color: COLORS.neutral },
}

function getSentimentMeta(sentiment: string) {
  return (
    SENTIMENT_META[sentiment.toLowerCase()] ?? {
      label: sentiment,
      color: COLORS.neutral,
    }
  )
}

const numberFormatter = new Intl.NumberFormat("id-ID")

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatPercent(value: number) {
  return `${value.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`
}

function formatMonth(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${safeValue}%`, backgroundColor: color }}
      />
    </div>
  )
}

function TooltipRow({
  color,
  label,
  value,
}: {
  color?: string
  label: ReactNode
  value: ReactNode
}) {
  return (
    <div className="flex w-full items-center justify-between gap-6">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-mono font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  )
}

type TooltipItem = { color?: string; payload?: { fill?: string } }

function tooltipFormatter(config: ChartConfig, format: (value: number) => string) {
  function TooltipFormatter(value: unknown, name: unknown, item: TooltipItem) {
    return (
      <TooltipRow
        color={item.payload?.fill ?? item.color}
        label={config[String(name)]?.label ?? String(name)}
        value={format(Number(value))}
      />
    )
  }

  return TooltipFormatter
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-4 space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}


const sentimentConfig = {
  negatif: { label: "Negatif", color: COLORS.negative },
  lainnya: { label: "Positif & netral", color: COLORS.neutral },
} satisfies ChartConfig

export function SentimentOverview({ data }: { data: DashboardSummary }) {
  const sentiment = data.dominant_sentiment
  const otherPercentage = Math.max(0, 100 - sentiment.percentage)
  const positivePer100Negative = sentiment.positive_to_negative_ratio * 100

  const pieData = [
    { key: "negatif", value: sentiment.percentage, fill: COLORS.negative },
    { key: "positif", value: otherPercentage, fill: COLORS.neutral },
  ]

  return (
    <section id="overview" className="scroll-mt-8">
      <SectionHeading
        title="Gambaran sentimen"
        description="Ringkasan distribusi sentimen dan volume komentar dalam dataset."
      />

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <Card className="border-border/70">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Sentimen dominan</CardDescription>
              <Badge variant="destructive">Negatif</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-4 sm:flex-row">
            <div className="relative aspect-square w-44 shrink-0">
              <ChartContainer
                config={sentimentConfig}
                className="aspect-auto size-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={tooltipFormatter(sentimentConfig, formatPercent)}
                      />
                    }
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="key"
                    innerRadius="68%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    cornerRadius={6}
                    strokeWidth={0}
                  />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold tabular-nums">
                  {formatPercent(sentiment.percentage)}
                </span>
                <span className="text-xs text-muted-foreground">negatif</span>
              </div>
            </div>

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS.negative }}
                />
                <div>
                  <p className="font-medium">
                    {formatNumber(sentiment.n_comments)} komentar negatif
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercent(sentiment.percentage)} dari seluruh komentar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS.neutral }}
                />
                <div>
                  <p className="font-medium">Positif & netral</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercent(otherPercentage)},
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardDescription>Total komentar negatif</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {formatNumber(sentiment.n_comments)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressBar value={sentiment.percentage} color={COLORS.negative} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4" />
              <span>Terklasifikasi negatif</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardDescription>Rasio positif terhadap negatif</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {positivePer100Negative.toLocaleString("id-ID", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              <span className="ml-1 text-base font-medium text-muted-foreground">
                : 100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressBar value={positivePer100Negative} color={COLORS.positive} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="size-4" />
              <span>Komentar positif per 100 komentar negatif</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Sentimen mengukur nada komentar (misalnya marah, kecewa, atau mendukung),
        bukan keberpihakan terhadap salah satu pihak dalam konflik.
      </p>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Puncak aktivitas                                                         */
/* -------------------------------------------------------------------------- */

export function PeakActivitySection({ data }: { data: DashboardSummary }) {
  const metrics = [
    {
      label: "Hari tersibuk",
      value: formatDate(data.peak_activity.busiest_day.comment_date),
      detail: `${formatNumber(data.peak_activity.busiest_day.n_total)} komentar`,
      icon: CalendarDays,
      color: COLORS.sky,
    },
    {
      label: "Bulan tersibuk",
      value: formatMonth(data.peak_activity.busiest_month.month_start),
      detail: `${formatNumber(data.peak_activity.busiest_month.n_total)} komentar`,
      icon: MessagesSquare,
      color: COLORS.violet,
    },
    {
      label: "Bulan paling negatif",
      value: formatMonth(data.peak_activity.most_negative_month.month_start),
      detail: `${formatPercent(data.peak_activity.most_negative_month.pct_negative)} negatif`,
      icon: TrendingDown,
      color: COLORS.negative,
      percent: data.peak_activity.most_negative_month.pct_negative,
    },
    {
      label: "Bulan paling positif",
      value: formatMonth(data.peak_activity.most_positive_month.month_start),
      detail: `${formatPercent(data.peak_activity.most_positive_month.pct_positive)} positif`,
      icon: TrendingUp,
      color: COLORS.positive,
      percent: data.peak_activity.most_positive_month.pct_positive,
    },
  ]

  return (
    <section id="activity" className="scroll-mt-8">
      <SectionHeading
        title="Puncak aktivitas"
        description="Tanggal dan bulan dengan volume komentar atau proporsi sentimen tertinggi."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/70">
            <CardContent className="flex items-start gap-3 p-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  color: metric.color,
                  backgroundColor: `color-mix(in oklab, ${metric.color} 15%, transparent)`,
                }}
              >
                <metric.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="truncate text-sm font-semibold capitalize">
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
                {metric.percent !== undefined && (
                  <div className="pt-1">
                    <ProgressBar value={metric.percent} color={metric.color} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Distribusi subreddit                                                     */
/* -------------------------------------------------------------------------- */

const subredditConfig = {
  n_total: { label: "Komentar", color: COLORS.sky },
} satisfies ChartConfig

const contrastConfig = {
  pct: { label: "Komentar negatif" },
} satisfies ChartConfig

export function SubredditSection({ data }: { data: DashboardSummary }) {
  const { largest, highest_pct_negative: high, lowest_pct_negative: low } =
    data.subreddits

  const volumeData = largest.map((item) => ({
    subreddit: `r/${item.subreddit}`,
    n_total: item.n_total,
    pct: item.pct_of_all_comments,
  }))

  const contrastData = [
    {
      kind: "Tertinggi",
      subreddit: `r/${high.subreddit}`,
      pct: high.pct_negative,
      fill: COLORS.negative,
    },
    {
      kind: "Terendah",
      subreddit: `r/${low.subreddit}`,
      pct: low.pct_negative,
      fill: COLORS.positive,
    },
  ]

  return (
    <section id="subreddits" className="scroll-mt-8">
      <SectionHeading
        title="Distribusi subreddit"
        description="Subreddit dengan volume komentar terbesar dan perbandingan proporsi komentar negatif."
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">
              Subreddit dengan komentar terbanyak
            </CardTitle>
            <CardDescription>
              Jumlah komentar dan kontribusinya terhadap seluruh dataset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={subredditConfig}
              className="aspect-auto w-full"
              style={{ height: Math.max(220, volumeData.length * 48) }}
            >
              <BarChart
                data={volumeData}
                layout="vertical"
                margin={{ left: 0, right: 56 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <YAxis
                  dataKey="subreddit"
                  type="category"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => truncate(value, 18)}
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={{ fillOpacity: 0.08 }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => (
                        <TooltipRow
                          color={COLORS.sky}
                          label="Komentar"
                          value={`${formatNumber(Number(value))} (${formatPercent(
                            Number(item.payload?.pct ?? 0),
                          )})`}
                        />
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="n_total"
                  fill="var(--color-n_total)"
                  radius={6}
                  barSize={22}
                >
                  <LabelList
                    dataKey="pct"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: unknown) => formatPercent(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Kontras proporsi negatif</CardTitle>
            <CardDescription>
              Subreddit paling negatif dibandingkan yang paling tidak negatif.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={contrastConfig}
              className="aspect-auto h-36 w-full"
            >
              <BarChart
                data={contrastData}
                layout="vertical"
                margin={{ left: 0, right: 56 }}
              >
                <YAxis
                  dataKey="subreddit"
                  type="category"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => truncate(value, 18)}
                />
                <XAxis type="number" domain={[0, 100]} hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => (
                        <TooltipRow
                          color={item.payload?.fill}
                          label={item.payload?.kind}
                          value={formatPercent(Number(value))}
                        />
                      )}
                    />
                  }
                />
                <Bar dataKey="pct" radius={6} barSize={26}>
                  <LabelList
                    dataKey="pct"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: unknown) => formatPercent(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              {contrastData.map((item) => (
                <span key={item.kind} className="inline-flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  {item.kind}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. Sentimen berdasarkan karma                                               */
/* -------------------------------------------------------------------------- */

const karmaConfig = {
  comment: { label: "Berbobot komentar", color: COLORS.negative },
  account: { label: "Berbobot akun", color: COLORS.violet },
} satisfies ChartConfig

export function KarmaSection({ data }: { data: DashboardSummary }) {
  const rows = data.karma_negative_by_category.map((item) => ({
    category: item.karma_category,
    comment: item.comment_weighted_pct_negative,
    account: item.account_weighted_pct_negative,
    n_total: item.n_total,
  }))
  const showLabels = rows.length <= 4

  return (
    <section id="karma" className="scroll-mt-8">
      <SectionHeading
        title="Sentimen berdasarkan karma"
        description="Membandingkan persentase komentar negatif berbobot komentar dan berbobot akun pada tiap kategori karma."
      />
      <Card className="border-border/70">
        <CardContent className="space-y-4 p-5">
          <ChartContainer
            config={karmaConfig}
            className="aspect-auto h-72 w-full"
          >
            <BarChart data={rows} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                width={44}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${value}%`}
              />
              <ChartTooltip
                cursor={{ fillOpacity: 0.08 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) =>
                      `${label} (${formatNumber(
                        Number(payload?.[0]?.payload?.n_total ?? 0),
                      )} data)`
                    }
                    formatter={tooltipFormatter(karmaConfig, formatPercent)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="comment" fill="var(--color-comment)" radius={[6, 6, 0, 0]}>
                {showLabels && (
                  <LabelList
                    position="top"
                    offset={6}
                    className="fill-foreground"
                    fontSize={11}
                    formatter={(value: unknown) => formatPercent(Number(value))}
                  />
                )}
              </Bar>
              <Bar dataKey="account" fill="var(--color-account)" radius={[6, 6, 0, 0]}>
                {showLabels && (
                  <LabelList
                    position="top"
                    offset={6}
                    className="fill-foreground"
                    fontSize={11}
                    formatter={(value: unknown) => formatPercent(Number(value))}
                  />
                )}
              </Bar>
            </BarChart>
          </ChartContainer>

          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t pt-4 text-xs text-muted-foreground">
            {rows.map((row) => (
              <span key={row.category}>
                {row.category}:{" "}
                <span className="font-medium tabular-nums text-foreground">
                  {formatNumber(row.n_total)}
                </span>{" "}
                data
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 5. Engagement berdasarkan sentimen                                          */
/* -------------------------------------------------------------------------- */

const scoreConfig = {
  avg_score: { label: "Rata-rata score" },
} satisfies ChartConfig

const voteConfig = {
  ups: { label: "Upvotes", color: COLORS.sky },
  downs: { label: "Downvotes", color: COLORS.amber },
} satisfies ChartConfig

export function EngagementSection({ data }: { data: DashboardSummary }) {
  const rows = data.engagement_by_sentiment.map((item) => {
    const meta = getSentimentMeta(item.sentiment)
    return {
      label: meta.label,
      avg_score: item.avg_score,
      ups: item.avg_ups,
      downs: item.avg_downs,
      fill: meta.color,
    }
  })

  const twoDecimals = (value: number) => value.toFixed(2)

  return (
    <section id="engagement" className="scroll-mt-8">
      <SectionHeading
        title="Sentimen negatif berdasarkan karma"
        description="Membandingkan proporsi komentar negatif dari seluruh komentar dengan rata-rata proporsi komentar negatif per akun pada setiap kategori karma."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Rata-rata score</CardTitle>
            <CardDescription>
              <CardDescription>
                Rata-rata score yang diperoleh komentar pada setiap kategori sentimen.
              </CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={scoreConfig}
              className="aspect-auto h-60 w-full"
            >
              <BarChart data={rows} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ fillOpacity: 0.08 }}
                  content={
                    <ChartTooltipContent
                      formatter={tooltipFormatter(scoreConfig, twoDecimals)}
                    />
                  }
                />
                <Bar dataKey="avg_score" radius={[8, 8, 0, 0]} maxBarSize={72}>
                  <LabelList
                    position="top"
                    offset={6}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: unknown) => twoDecimals(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Upvotes vs downvotes</CardTitle>
            <CardDescription>
              Rata-rata upvotes dan downvotes yang diterima komentar pada setiap kategori sentimen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={voteConfig}
              className="aspect-auto h-60 w-full"
            >
              <BarChart data={rows} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ fillOpacity: 0.08 }}
                  content={
                    <ChartTooltipContent
                      formatter={tooltipFormatter(voteConfig, twoDecimals)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="ups" fill="var(--color-ups)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="downs" fill="var(--color-downs)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 6. Diskusi terbesar & kata kunci                                            */
/* -------------------------------------------------------------------------- */

const postConfig = {
  value: { label: "Komentar negatif", color: COLORS.negative },
} satisfies ChartConfig

function keywordClass(index: number) {
  if (index < 3) return "px-3.5 py-2 text-base font-semibold"
  if (index < 8) return "px-3 py-1.5 text-sm"
  return "px-2.5 py-1 text-xs"
}

export function DiscussionAndKeywordsSection({ data }: { data: DashboardSummary }) {
  const post = data.largest_discussion_post

  return (
    <section id="discussion" className="scroll-mt-8">
      <SectionHeading
        title="Diskusi terbesar & kata kunci"
        description="Thread dengan jumlah komentar terbanyak serta istilah yang sering muncul dalam komentar."
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Diskusi dengan komentar terbanyak</CardDescription>
              <Badge variant="secondary">r/{post.subreddit}</Badge>
            </div>
            <CardTitle className="text-base leading-relaxed">
              {post.post_title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-5">
              <div className="relative size-28 shrink-0">
                <ChartContainer
                  config={postConfig}
                  className="aspect-auto size-full"
                >
                  <RadialBarChart
                    data={[
                      { key: "negatif", value: post.pct_negative, fill: COLORS.negative },
                    ]}
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="74%"
                    outerRadius="100%"
                    barSize={12}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={8}
                      background={{ fill: COLORS.neutral, fillOpacity: 0.15 }}
                    />
                  </RadialBarChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold tabular-nums">
                    {formatPercent(post.pct_negative)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">negatif</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Total komentar</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {formatNumber(post.n_total)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Post ID: {post.post_id}</span>
              <Link
                href={`https://www.reddit.com/comments/${encodeURIComponent(post.post_id)}/`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                Buka diskusi di Reddit
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Top comment keywords</CardTitle>
            <CardDescription>
              Ukuran kata mengikuti peringkat kemunculan dalam komentar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            {data.top_comment_keywords.map((keyword, index) => (
              <Badge
                key={keyword}
                variant={index < 3 ? "default" : "secondary"}
                className={keywordClass(index)}
              >
                {keyword}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
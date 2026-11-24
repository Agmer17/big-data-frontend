import { DailySentimentTable } from "./daily-sentiment-table"
import { OverallSentimentCard } from "./overall-card-sentiment"
import { SentimentKpiCards } from "./sentiment-kpi-card"
import { TemporalSentimentChart } from "./temporal-sentiment-chart"
import { TopPeriodsCard } from "./top-period-card"

export function SentimentDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Analisis Sentimen &amp; Dinamika Temporal
                </h1>
                <p className="text-sm text-muted-foreground">
                    Evaluasi distribusi polaritas opini publik dan fluktuasi volume diskusi Reddit
                    terkait konflik Israel–Palestina.
                </p>
            </header>

            <SentimentKpiCards />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <TemporalSentimentChart />
                </div>
                <div className="lg:col-span-4">
                    <OverallSentimentCard />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <TopPeriodsCard />
                </div>
                <div className="lg:col-span-7">
                    <DailySentimentTable />
                </div>
            </section>
        </div>
    )
}
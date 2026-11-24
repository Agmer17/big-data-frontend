import { ControversialityAnalysisCard } from "./controversiality-analisys";
import { EngagementBreakdownTable } from "./engagement-breakdown";
import { EngagementKpiCards } from "./engagement-kpi-cards";
import { SentimentEngagementMetricsChart } from "./engagement-metric";
import { ScoreSentimentChart } from "./engagement-score";

export function EngagementDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Engagement Komentar &amp; Kontroversialitas
                </h1>
                <p className="text-sm text-muted-foreground">
                    Evaluasi perolehan skor, distribusi upvotes dan downvotes, serta tingkat
                    perdebatan (controversiality) di setiap lapisan sentimen opini.
                </p>
            </header>

            <EngagementKpiCards />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <ScoreSentimentChart />
                </div>
                <div className="lg:col-span-5">
                    <SentimentEngagementMetricsChart />
                </div>
            </section>

            <ControversialityAnalysisCard />

            <EngagementBreakdownTable />
        </div>
    )
}
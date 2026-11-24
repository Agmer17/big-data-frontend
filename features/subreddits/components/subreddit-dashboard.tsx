import { SubredditKpiCards } from "./subreddit-kpi-card";
import { SubredditScorePolarityChart } from "./subreddit-score-polarity";
import { SubredditsTable } from "./subreddit-table";
import { TopSubredditsChart } from "./top-subreddit-chart";


export function SubredditsDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Analisis Sentimen Komunitas Subreddit
                </h1>
                <p className="text-sm text-muted-foreground">
                    Pemetaan distribusi polaritas opini, intensitas diskusi, dan rata-rata skor
                    komentar lintas subreddit pada topik Israel–Palestina.
                </p>
            </header>

            <SubredditKpiCards />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <TopSubredditsChart />
                </div>
                <div className="lg:col-span-5">
                    <SubredditScorePolarityChart />
                </div>
            </section>

            <SubredditsTable />
        </div>
    )
}
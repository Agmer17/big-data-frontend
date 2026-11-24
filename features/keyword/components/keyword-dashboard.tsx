import { DistinctiveKeywordsCard } from "./distinctive-keyword";
import { KeywordThemesChart } from "./keyword-themes-chart";
import { KeywordsKpiCards } from "./keywords-kpi-card";
import { NegativeVsPositiveChart } from "./negative-positive";
import { TopKeywordsTable } from "./top-keywords-table";


export function KeywordsDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Analisis Kata Kunci &amp; Tema Wacana
                </h1>
                <p className="text-sm text-muted-foreground">
                    Pemetaan frekuensi kosakata, penanda leksikal khas setiap sentimen, polarisasi
                    negatif vs positif, serta distribusi tema diskusi di Reddit.
                </p>
            </header>

            <KeywordsKpiCards />

            <KeywordThemesChart />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6">
                    <DistinctiveKeywordsCard />
                </div>
                <div className="lg:col-span-6">
                    <NegativeVsPositiveChart />
                </div>
            </section>

            <TopKeywordsTable />
        </div>
    )
}
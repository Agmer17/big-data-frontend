import { KarmaBreakdownTable } from "./user-karma-breakdown-table";
import { KarmaWeightedComparisonChart } from "./user-karma-weight";
import { AccountAgeChart } from "./users-account-age";
import { KarmaSentimentChart } from "./users-karma-sentiment";
import { UsersKpiCards } from "./users-kpi-cards";
import { VerificationComparisonCard } from "./users-verification-comparison";


export function UsersDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Popularitas Akun (Karma) &amp; Karakteristik Pengguna
                </h1>
                <p className="text-sm text-muted-foreground">
                    Analisis polaritas opini berdasarkan reputasi karma, pembobotan aktivitas pengguna,
                    usia akun, serta status verifikasi di Reddit.
                </p>
            </header>

            <UsersKpiCards />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <KarmaSentimentChart />
                </div>
                <div className="lg:col-span-5">
                    <KarmaWeightedComparisonChart />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <AccountAgeChart />
                </div>
                <div className="lg:col-span-5">
                    <VerificationComparisonCard />
                </div>
            </section>

            <KarmaBreakdownTable />
        </div>
    )
}
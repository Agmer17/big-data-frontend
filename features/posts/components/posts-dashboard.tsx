
import { CommentCountHistogramChart } from "./comment-count-hisyogram"
import { PostsKpiCards } from "./posts-kpi-card"
import { PostsTable } from "./posts-table"
import { TopPostsCard } from "./top-posts-card"

export function PostsDashboard() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-1 border-b border-border/60 pb-4">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Analisis Topik Post &amp; Polaritas Utas
                </h1>
                <p className="text-sm text-muted-foreground">
                    Pemetaan kepadatan komentar, utas diskusi terpopuler, serta indeks keseimbangan
                    opini pada masing-masing post Reddit terkait konflik Israel–Palestina.
                </p>
            </header>

            <PostsKpiCards />

            <section className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6">
                    <CommentCountHistogramChart />
                </div>
                <div className="lg:col-span-6">
                    <TopPostsCard />
                </div>
            </section>

            <PostsTable />
        </div>
    )
}
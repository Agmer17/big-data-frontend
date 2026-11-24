"use client"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/dashboard/components/app-sidebar"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-14 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <h1 className="font-semibold">
                  Reddit Sentiment Analysis
                </h1>
              </header>

              {children}
            </SidebarInset>
          </SidebarProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
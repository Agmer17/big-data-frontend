"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  FileText,
  MessageSquareText,
  MessagesSquare,
  Users,
  Vote,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    label: "Gambaran umum",
    items: [
      { title: "Ringkasan", href: "/", icon: BarChart3 },
      { title: "Sentimen", href: "/sentimen", icon: Activity },
    ],
  },
  {
    label: "Komunitas",
    items: [
      { title: "Subreddit", href: "/subreddit", icon: Users },
      { title: "Karma", href: "/karma", icon: Vote },
      { title: "Engagement", href: "/engagement", icon: MessagesSquare },
      { title: "Reddit Posts", href: "/posts", icon: FileText },
    ],
  },
  {
    label: "Analisis teks",
    items: [
      {
        title: "Diskusi & kata kunci",
        href: "/keyword",
        icon: MessageSquareText,
      },
    ],
  },
]

function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358" />
    </svg>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Analisis Sentimen"
              render={
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <BarChart3 className="size-4" />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      Analisis Sentimen
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Reddit · Israel–Palestina
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href}
                          onClick={() => setOpenMobile(false)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                      tooltip={item.title}
                      isActive={isRouteActive(item.href)}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sumber data · Dataset Kaggle"
              render={
                <a
                  href="https://www.kaggle.com/datasets/asaniczka/reddit-on-israel-palestine-daily-updated"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground">
                    <KaggleIcon className="size-3.5" />
                  </div>

                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-medium">
                      Dataset Kaggle
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      Sumber data · Komentar Reddit
                    </span>
                  </div>

                  <ArrowUpRight className="ml-auto text-muted-foreground" />
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
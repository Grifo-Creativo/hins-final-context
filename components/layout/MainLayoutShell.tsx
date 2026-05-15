// components/layout/MainLayoutShell.tsx — shell exclusiva de /main
"use client"

import type { ReactNode } from "react"

import { MainSidebar } from "@/components/layout/MainSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function MainLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <MainSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

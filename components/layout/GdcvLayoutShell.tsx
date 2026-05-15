// components/layout/GdcvLayoutShell.tsx
"use client"

import type { ReactNode } from "react"

import { GdcvSidebar } from "@/components/layout/GdcvSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function GdcvLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <GdcvSidebar />
      <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}

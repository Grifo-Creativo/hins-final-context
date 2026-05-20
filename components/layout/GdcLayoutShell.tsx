// components/layout/GdcLayoutShell.tsx
"use client"

import type { ReactNode } from "react"

import { GdcSidebar } from "@/components/layout/GdcSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function GdcLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <GdcSidebar />
      <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}

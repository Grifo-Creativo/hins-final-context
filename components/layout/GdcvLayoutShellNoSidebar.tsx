// components/layout/GdcvLayoutShellNoSidebar.tsx
"use client"

import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function GdcvLayoutShellNoSidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}

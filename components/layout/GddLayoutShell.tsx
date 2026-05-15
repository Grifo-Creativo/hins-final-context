// components/layout/GddLayoutShell.tsx
"use client"

import type { ReactNode } from "react"

import { GddSidebar } from "@/components/layout/GddSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function GddLayoutShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <GddSidebar />
      <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}

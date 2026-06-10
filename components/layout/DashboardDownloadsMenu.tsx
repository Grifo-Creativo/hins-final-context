// components/layout/DashboardDownloadsMenu.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DASHBOARD_DOWNLOAD_OPTIONS,
  type DashboardDownloadsVariant,
} from "@/data/dashboard-downloads-mock"
import { DownloadIcon } from "lucide-react"

interface DashboardDownloadsMenuProps {
  variant: DashboardDownloadsVariant
}

/** Menú de descargas globales del dashboard — trigger download + ítems solo texto. */
export function DashboardDownloadsMenu({ variant }: DashboardDownloadsMenuProps) {
  const options = DASHBOARD_DOWNLOAD_OPTIONS[variant]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0 shadow-xs"
          aria-label="Exportar datos"
        >
          <DownloadIcon className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => {
              // TODO: wire export por dataset cuando exista backend / generación de archivos
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

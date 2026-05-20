// app/gdc/roi/page.tsx
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { gdcParkName } from "@/data/mantenimiento-mock"

export default function GdcRoiPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {gdcParkName}
          </h1>
          <Badge
            variant="secondary"
            className="shrink-0 border-transparent bg-amber-600 font-medium text-white hover:bg-amber-600"
          >
            GDC
          </Badge>
        </div>
      </header>
      <p className="text-sm text-muted-foreground">
        Retorno de inversión GDC — próximamente.
      </p>
      <Button asChild variant="outline" className="w-fit shadow-xs">
        <Link href="/gdc/mantenimiento">Ir a Mantenimiento</Link>
      </Button>
    </div>
  )
}

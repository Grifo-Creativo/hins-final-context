// app/gdc/performance/page.tsx
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ModelBadge } from "@/components/ui/model-badge"
import { gdcParkName } from "@/data/mantenimiento-mock"

export default function GdcPerformancePage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {gdcParkName}
          </h1>
          <ModelBadge model="GDC" />
        </div>
      </header>
      <p className="text-sm text-muted-foreground">
        Vista de performance GDC — próximamente.
      </p>
      <Button asChild variant="outline" className="w-fit shadow-xs">
        <Link href="/gdc/mantenimiento">Ir a Mantenimiento</Link>
      </Button>
    </div>
  )
}

// app/gdd/performance/page.tsx
import { redirect } from "next/navigation"
import { GddPageHeading } from "@/components/gdd/GddPageHeading"
import { GddPerformanceView } from "@/components/gdd/GddPerformanceView"
import { resolveDashboardContext, type DashboardContext } from "@/lib/api/dashboard-context"
import { UnauthorizedError } from "@/lib/api/client"
import { listEnergia, listEnergiaDiaria } from "@/lib/api/energia"
import type { RegistroEnergiaDiario, RegistroEnergiaMensual } from "@/lib/api/types"

interface GddPerformancePageProps {
  searchParams: Promise<{ proyectoId?: string }>
}

async function loadContext(proyectoId: string): Promise<DashboardContext | null> {
  try {
    return await resolveDashboardContext(proyectoId)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login")
    }
    throw error
  }
}

/**
 * Carga los registros de energía por separado del contexto proyecto/parque:
 * una falla acá no debe tumbar toda la página, solo mostrar el estado de
 * error del gráfico (User Story 3 — distinto del estado vacío).
 */
async function loadRegistrosEnergia(parqueId: string): Promise<{ registros: RegistroEnergiaMensual[] | null }> {
  try {
    const registros = await listEnergia(parqueId)
    return { registros }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login")
    }
    return { registros: null }
  }
}

function currentPeriodo(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

/**
 * Igual criterio que loadRegistrosEnergia: una falla acá no debe tumbar la
 * página, solo el estado de error de la card de energía del mes actual.
 */
async function loadRegistrosEnergiaDiaria(
  parqueId: string,
  periodo: string
): Promise<{ registros: RegistroEnergiaDiario[] | null }> {
  try {
    const registros = await listEnergiaDiaria(parqueId, periodo)
    return { registros }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login")
    }
    return { registros: null }
  }
}

export default async function GddPerformancePage({ searchParams }: GddPerformancePageProps) {
  const { proyectoId } = await searchParams
  if (!proyectoId) {
    return <p className="text-sm text-muted-foreground">Falta el parámetro proyectoId.</p>
  }

  const context = await loadContext(proyectoId)
  if (!context) {
    return <p className="text-sm text-muted-foreground">Proyecto o parque no encontrado.</p>
  }

  const periodoActual = currentPeriodo()
  const [{ registros: registrosEnergia }, { registros: registrosEnergiaDiaria }] = await Promise.all([
    loadRegistrosEnergia(context.parque.id),
    loadRegistrosEnergiaDiaria(context.parque.id, periodoActual),
  ])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GddPageHeading />
      <GddPerformanceView
        parque={context.parque}
        registrosEnergia={registrosEnergia}
        registrosEnergiaDiaria={registrosEnergiaDiaria}
        periodoActual={periodoActual}
      />
    </div>
  )
}

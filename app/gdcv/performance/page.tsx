// app/gdcv/performance/page.tsx
import { redirect } from "next/navigation"
import { GdcvPageHeading } from "@/components/gdcv/GdcvPageHeading"
import { GdcvPerformanceView } from "@/components/gdcv/GdcvPerformanceView"
import { resolveDashboardContext, type DashboardContext } from "@/lib/api/dashboard-context"
import { UnauthorizedError } from "@/lib/api/client"
import { listEnergia, listEnergiaDiaria } from "@/lib/api/energia"
import { listSocios } from "@/lib/api/socios"
import type { RegistroEnergiaDiario, RegistroEnergiaMensual, Socio } from "@/lib/api/types"

interface GdcvPerformancePageProps {
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
 * error del gráfico (igual criterio que app/gdd/performance/page.tsx).
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

/**
 * Igual criterio que loadRegistrosEnergia: una falla acá no debe tumbar la
 * página, solo el estado de error de la tabla de socios.
 */
async function loadSocios(parqueId: string): Promise<{ socios: Socio[] | null }> {
  try {
    const socios = await listSocios(parqueId)
    return { socios }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login")
    }
    return { socios: null }
  }
}

export default async function GdcvPerformancePage({ searchParams }: GdcvPerformancePageProps) {
  const { proyectoId } = await searchParams
  if (!proyectoId) {
    return <p className="text-sm text-muted-foreground">Falta el parámetro proyectoId.</p>
  }

  const context = await loadContext(proyectoId)
  if (!context) {
    return <p className="text-sm text-muted-foreground">Proyecto o parque no encontrado.</p>
  }

  const periodoActual = currentPeriodo()
  const [
    { registros: registrosEnergia },
    { registros: registrosEnergiaDiaria },
    { socios },
  ] = await Promise.all([
    loadRegistrosEnergia(context.parque.id),
    loadRegistrosEnergiaDiaria(context.parque.id, periodoActual),
    loadSocios(context.parque.id),
  ])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GdcvPageHeading />
      <GdcvPerformanceView
        parque={context.parque}
        registrosEnergia={registrosEnergia}
        registrosEnergiaDiaria={registrosEnergiaDiaria}
        periodoActual={periodoActual}
        socios={socios}
      />
    </div>
  )
}

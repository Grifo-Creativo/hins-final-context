// app/dev/components/page.tsx
"use client"

import { useState } from "react"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { ROIProjectionChart } from "@/components/charts/ROIProjectionChart"
import { RoiRecoveryLineChart } from "@/components/charts/RoiRecoveryLineChart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardWire } from "@/components/ui/card-wire"
import { CardWithContent } from "@/components/ui/card-with-content"
import { DatePicker } from "@/components/ui/date-picker"
import { FeatureItem } from "@/components/ui/feature-item"
import { HinsTooltip } from "@/components/ui/hins-tooltip"
import { IconBadge } from "@/components/ui/icon-badge"
import { KpiPrimary } from "@/components/ui/kpi-primary"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { PeriodSelectorLocal } from "@/components/ui/period-selector"
import { SectionHeader } from "@/components/ui/section-header"
import { SoftBadge } from "@/components/ui/soft-badge"
import { StatList, type StatListItem } from "@/components/ui/stat-list"
import { ConsumptionHistoryTable } from "@/components/gdd/ConsumptionHistoryTable"
import { InputWithIconButton } from "@/components/ui/input-with-icon-button"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import {
  generationSparklineConfig,
  parkEnergyBarChartConfig,
  roiRecoveryChartConfig,
} from "@/data/chart-config"
import {
  curvaRecuperacionData,
  curvaRecuperacionInversion,
} from "@/data/gdcv-agc-mock"
import {
  ROI_FECHA_HOY,
  ROI_INVERSION_META,
  roiProjectionData,
} from "@/data/gdcv-roi-mock"
import {
  consumptionHistoryMock,
  generationSparklinePoints,
} from "@/data/gdd-performance-mock"
import Link from "next/link"
import {
  DownloadIcon,
  InfoIcon,
  MoreHorizontal,
  PlusCircleIcon,
  SearchIcon,
  SunIcon,
  ParkingMeter,
  ZapIcon,
} from "lucide-react"

const BAR_DEMO = [
  { label: "Nov 25", generated: 120 },
  { label: "Dic 25", generated: 140 },
  { label: "Ene 26", generated: 130 },
  { label: "Feb 26", generated: 155 },
  { label: "Mar 26", generated: 168 },
  { label: "Abr 26", generated: 180 },
]

const STAT_LIST_DEMO: StatListItem[] = [
  { name: "Potencia utilizada", value: "NN kWh" },
  { name: "Fecha de alta", value: "NN" },
  { name: "Nombre del responsable", value: "NN" },
  { name: "Teléfono de contacto", value: "NN" },
  { name: "Ahorro en Emisiones", value: "3.47" },
]

function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 20)) // May 20, 2026

  return (
    <DatePicker
      value={selectedDate}
      onValueChange={setSelectedDate}
      disabled={(date) => date > new Date()} // No future dates
    />
  )
}

function Showcase({
  title,
  file,
  children,
}: {
  title: string
  file: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-8 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="font-mono text-xs text-muted-foreground">{file}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export default function DevComponentsPage() {
  const sparkForKpi = generationSparklinePoints.map((p) => ({ value: p.value }))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              HINS · Dev
            </p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              Galería de componentes
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Vista rápida de los bloques de{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">context/components.md</code>{" "}
              implementados en el repo.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </header>

        <div className="flex flex-col gap-10">
          <Showcase title="Button" file="components/ui/button.tsx">
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Variantes
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default" size="default">
                    Default (CTA)
                  </Button>
                  <Button variant="outline" size="default">
                    Outline
                  </Button>
                  <Button variant="secondary" size="default">
                    Secondary
                  </Button>
                  <Button variant="destructive" size="default">
                    Destructive
                  </Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Con íconos (tamaño default)
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default" size="default" className="gap-1.5 shadow-xs">
                    <PlusCircleIcon className="size-4" aria-hidden />
                    Nuevo
                  </Button>
                  <Button variant="outline" size="default" className="gap-1.5 shadow-xs">
                    <DownloadIcon className="size-4" aria-hidden />
                    Descargar
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Icon-only (header, acciones)
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow-xs"
                    aria-label="Buscar"
                  >
                    <SearchIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow-xs"
                    aria-label="Descargar"
                  >
                    <DownloadIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow-xs"
                    aria-label="Más acciones"
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tamaños
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="shadow-xs">
                    Pequeño (sm)
                  </Button>
                  <Button variant="outline" size="default" className="shadow-xs">
                    Default
                  </Button>
                  <Button variant="outline" size="lg" className="shadow-xs">
                    Grande (lg)
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estados
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="default" disabled className="shadow-xs">
                    Deshabilitado
                  </Button>
                </div>
              </div>
            </div>
          </Showcase>

          <Showcase
            title="InputWithIconButton"
            file="components/ui/input-with-icon-button.tsx"
          >
            <div className="max-w-xs">
              <InputWithIconButton
                label="N° de Medidor"
                icon={ParkingMeter}
                iconButtonLabel="Buscar medidor"
                iconTooltip="N° de medidor del parque"
                placeholder="Ingresar..."
              />
            </div>
          </Showcase>

          <Showcase
            title="DatePicker"
            file="components/ui/date-picker.tsx"
          >
            <div className="max-w-xs">
              <DatePickerDemo />
            </div>
          </Showcase>

          <Showcase title="TabsForBlocks" file="components/ui/tabs-for-blocks.tsx">
            <div className="h-10 max-w-md">
              <TabsForBlocks
                tabs={[
                  { value: "1m", label: "1M" },
                  { value: "3m", label: "3M" },
                  { value: "6m", label: "6M" },
                  { value: "1a", label: "1A" },
                  { value: "todo", label: "TODO" },
                ]}
                defaultValue="6m"
              />
            </div>
          </Showcase>

          <Showcase title="Card (shadcn)" file="components/ui/card.tsx">
            <Card className="max-w-md py-0 ring-0">
              <CardHeader className="border-b border-border">
                <CardTitle>Título de card</CardTitle>
                <CardDescription>Descripción secundaria opcional.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Contenido con padding definido por el consumidor.
                </p>
              </CardContent>
            </Card>
          </Showcase>

          <Showcase title="CardWire" file="components/ui/card-wire.tsx">
            <CardWire>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">
                  Contenedor con borde, sin sombra
                </p>
                <p className="text-xs text-muted-foreground">
                  Úsalo para desgloses de datos dentro de Sheets o vistas internas.
                </p>
              </div>
            </CardWire>
          </Showcase>

          <Showcase title="FeatureItem" file="components/ui/feature-item.tsx">
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Horizontal (default)
                </p>
                <FeatureItem label="Ahorro generado" value="$1,250.50" />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Vertical
                </p>
                <div className="max-w-xs">
                  <FeatureItem
                    label="Medidor"
                    value="MED-2024-001"
                    orientation="vertical"
                  />
                </div>
              </div>
            </div>
          </Showcase>

          <Showcase title="IconBadge" file="components/ui/icon-badge.tsx">
            <div className="flex items-center gap-4">
              <IconBadge icon={ZapIcon} size="sm" />
              <IconBadge icon={SunIcon} size="lg" />
            </div>
          </Showcase>

          <Showcase title="SoftBadge" file="components/ui/soft-badge.tsx">
            <div className="flex flex-wrap gap-2">
              <SoftBadge>+12% vs mes anterior</SoftBadge>
              <SoftBadge icon={ZapIcon}>Con ícono</SoftBadge>
            </div>
          </Showcase>

          <Showcase title="KpiPrimary" file="components/ui/kpi-primary.tsx">
            <div className="max-w-md">
              <KpiPrimary
                icon={SunIcon}
                label="Energía generada (abr.)"
                value="31.0"
                unit="kWh"
                delta="+8% vs marzo"
                sparklineData={sparkForKpi}
              />
            </div>
          </Showcase>

          <Showcase title="KpiSecondary" file="components/ui/kpi-secondary.tsx">
            <div className="max-w-xs">
              <KpiSecondary
                icon={ZapIcon}
                label="Participación"
                value="25%"
                delta="Cuotaparte"
                infoTooltip={{
                  content: "Porcentaje de energía asignada al socio en el parque.",
                }}
              />
            </div>
          </Showcase>

          <Showcase title="CardWithContent" file="components/ui/card-with-content.tsx">
            <CardWithContent
              title="Bloque con tabs"
              subtitle="Subtítulo de ejemplo"
              tabs={[
                { value: "a", label: "Tab A" },
                { value: "b", label: "Tab B" },
              ]}
              defaultTab="a"
            >
              <p className="text-sm text-muted-foreground">
                Contenido del bloque (chart, tabla, etc.).
              </p>
            </CardWithContent>
          </Showcase>

          <Showcase title="StatList" file="components/ui/stat-list.tsx">
            <div className="max-w-md rounded-lg border border-border p-4">
              <StatList title="Más información del socio" items={STAT_LIST_DEMO} />
            </div>
          </Showcase>

          <Showcase
            title="Table — sticky first column (mobile)"
            file="components/gdd/ConsumptionHistoryTable.tsx + lib/table-utils.ts"
          >
            <p className="text-sm text-muted-foreground">
              En viewports &lt; 640px la primera columna (Período) queda fija al
              hacer scroll horizontal. Contenedor de prueba a 360px:
            </p>
            <div className="max-w-[360px] border border-dashed border-border rounded-lg overflow-hidden">
              <ConsumptionHistoryTable data={consumptionHistoryMock} />
            </div>
          </Showcase>

          <section className="scroll-mt-8 rounded-xl border border-dashed border-border/80 bg-muted/20 p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Charts (Recharts)
            </h2>
            <div className="flex flex-col gap-10">
              <Showcase title="GenerationSparkline" file="components/charts/GenerationSparkline.tsx">
                <div className="max-w-xl rounded-lg border border-border bg-background p-4">
                  <GenerationSparkline
                    data={generationSparklinePoints}
                    chartConfig={generationSparklineConfig}
                    className="aspect-auto h-14 w-full"
                  />
                </div>
              </Showcase>

              <Showcase title="ParkEnergyBarChart" file="components/charts/ParkEnergyBarChart.tsx">
                <div className="rounded-lg border border-border bg-background p-4">
                  <ParkEnergyBarChart
                    data={BAR_DEMO}
                    chartConfig={parkEnergyBarChartConfig}
                  />
                </div>
              </Showcase>

              <Showcase
                title="RoiRecoveryLineChart"
                file="components/charts/RoiRecoveryLineChart.tsx"
              >
                <p className="text-xs text-muted-foreground">
                  Mock: misma data que GDD/GDCV — curva de recuperación acumulada.
                </p>
                <div className="rounded-lg border border-border bg-background p-4">
                  <RoiRecoveryLineChart
                    data={curvaRecuperacionData}
                    chartConfig={roiRecoveryChartConfig}
                    investmentReference={curvaRecuperacionInversion}
                  />
                </div>
              </Showcase>

              <Showcase
                title="ROIProjectionChart"
                file="components/charts/ROIProjectionChart.tsx"
              >
                <p className="text-xs text-muted-foreground">
                  Proyección multi-escenario (mock GDCV ROI). Chips opcionales:{" "}
                  <code className="rounded bg-muted px-1">showRangeChips</code> +{" "}
                  <code className="rounded bg-muted px-1">rangoAnios</code> inicial.
                </p>
                <div className="rounded-lg border border-border bg-background p-4">
                  <ROIProjectionChart
                    data={roiProjectionData}
                    inversionMeta={ROI_INVERSION_META}
                    fechaHoy={ROI_FECHA_HOY}
                    rangoAnios={5}
                    showRangeChips
                  />
                </div>
              </Showcase>
            </div>
          </section>

          <Showcase title="HinsTooltip" file="components/ui/hins-tooltip.tsx">
            <p className="text-sm text-foreground">
              Pasá el mouse por el ícono:{" "}
              <HinsTooltip
                trigger={<InfoIcon className="inline size-4 text-muted-foreground" />}
                content="Texto de ayuda contextual."
              />
            </p>
          </Showcase>

          <Showcase title="SectionHeader" file="components/ui/section-header.tsx">
            <SectionHeader
              title="Título de sección"
              size="md"
              action={
                <Button type="button" variant="outline" size="icon" className="shadow-xs" aria-label="Más">
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <SectionHeader title="Sub-sección" size="sm" className="mt-4" />
          </Showcase>

          <Showcase title="PeriodSelector" file="components/ui/period-selector.tsx">
            <PeriodSelectorLocal defaultValue="Abril 2026" />
          </Showcase>

          <Showcase title="HinsAlert" file="components/ui/alert.tsx">
            <div className="flex flex-col gap-3">
              <Alert variant="warning">
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>Ejemplo variante warning.</AlertDescription>
              </Alert>
              <Alert variant="info">
                <AlertDescription>Nota informativa sin título.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertDescription>Operación completada.</AlertDescription>
              </Alert>
              <Alert variant="error">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No se pudieron cargar los datos.</AlertDescription>
              </Alert>
            </div>
          </Showcase>

          <section className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Documentados en components.md (ver detalle en archivo)
            </h2>
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              <li>
                <span className="font-mono text-foreground">Form Elements</span> —{" "}
                <span className="font-mono">Input, Select, Textarea</span>
              </li>
              <li>
                <span className="font-mono text-foreground">InputWithIconButton</span> —{" "}
                <span className="font-mono">components/ui/input-with-icon-button.tsx</span>
              </li>
              <li>
                <span className="font-mono text-foreground">KpiSecondaryCompact</span> —{" "}
                <span className="font-mono">components/ui/kpi-secondary.tsx (variante)</span>
              </li>
              <li>
                <span className="font-mono text-foreground">KpiWithTimeline</span> —{" "}
                <span className="font-mono">components/ui/kpi-with-timeline.tsx</span>
              </li>
              <li>
                <span className="font-mono text-foreground">PageHeader</span> —{" "}
                <span className="font-mono">components/ui/page-header.tsx</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

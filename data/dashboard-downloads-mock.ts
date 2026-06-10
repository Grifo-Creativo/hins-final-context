// data/dashboard-downloads-mock.ts

export type DashboardDownloadsVariant = "gdd" | "gdcv-agc"

export type DashboardDownloadOption = {
  id: string
  label: string
}

export const DASHBOARD_DOWNLOAD_OPTIONS: Record<
  DashboardDownloadsVariant,
  readonly DashboardDownloadOption[]
> = {
  gdd: [
    { id: "tarifas", label: "Historial de tarifas" },
    { id: "generacion", label: "Historial de Generación" },
    { id: "mantenimiento", label: "Historial de Mantenimiento" },
    { id: "recupero", label: "Recupero de Inversión" },
  ],
  "gdcv-agc": [
    { id: "generacion", label: "Historial de Generación" },
    { id: "mantenimiento", label: "Historial de Mantenimiento" },
    { id: "recupero", label: "Recupero de Inversión" },
  ],
}

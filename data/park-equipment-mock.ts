// data/park-equipment-mock.ts

import { parkName as gddParkName } from "@/data/gdd-performance-mock"
import { gdcvParkName } from "@/data/gdcv-mock"
import { socioParkName } from "@/data/gdcv-socio-mock"

export type ParkEquipmentMetric = {
  label: string
  value: string
}

export type ParkEquipmentDetail = {
  parkName: string
  metrics: readonly ParkEquipmentMetric[]
}

/** Label canónico en `ParkDetailsCard` — única métrica con drill-down a dialog. */
export const PARK_EQUIPAMIENTO_METRIC_LABEL = "Equipamiento"

export const gddParkEquipmentDetail: ParkEquipmentDetail = {
  parkName: gddParkName,
  metrics: [
    { label: "Fabricante", value: "Jinko Solar" },
    { label: "Modelo", value: "Tiger Neo 72HL4-(V)" },
    { label: "Potencia nominal", value: "580 Wp" },
    { label: "Cantidad de módulos", value: "2.155 u." },
    { label: "Tecnología celda", value: "n-type TOPCon mono" },
    { label: "Inversores", value: "Sungrow SG125HX × 8" },
    { label: "Estructura de montaje", value: "Fixed-tilt galvanizada" },
    { label: "Sistema DC", value: "1.500 V" },
    { label: "Ratio DC/AC", value: "1,23" },
    { label: "Degradación anual", value: "0,40%" },
  ],
}

export const gdcvParkEquipmentDetail: ParkEquipmentDetail = {
  parkName: gdcvParkName,
  metrics: [
    { label: "Fabricante", value: "Canadian Solar" },
    { label: "Modelo", value: "HiKu7 CS7N-655MB-AG" },
    { label: "Potencia nominal", value: "655 Wp" },
    { label: "Cantidad de módulos", value: "1.496 u." },
    { label: "Tecnología celda", value: "Mono PERC bifacial" },
    { label: "Inversores", value: "Huawei SUN2000-100KTL × 10" },
    { label: "Estructura de montaje", value: "Fixed-tilt, aluminio anodizado" },
    { label: "Sistema DC", value: "1.500 V" },
    { label: "Ratio DC/AC", value: "1,20" },
    { label: "Garantía de potencia", value: "30 años (80%)" },
  ],
}

/** Mi Espacio — mismo equipamiento del parque, contexto del socio. */
export const socioParkEquipmentDetail: ParkEquipmentDetail = {
  parkName: socioParkName,
  metrics: gdcvParkEquipmentDetail.metrics,
}

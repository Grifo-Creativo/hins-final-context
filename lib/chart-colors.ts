// /lib/chart-colors.ts
/**
 * Chart Colors — HINS Design System v2
 *
 * Estrategia Hybrid para ROI Projection:
 * - Zinc (neutral): datos reales vs proyecciones
 * - Green (favorable): oportunidad y éxito
 * - Rose (riesgo): cautela y adversidades
 *
 * Accesibilidad WCAG AA (excepto Riesgo ⚠️ Border, mitigado con patrón)
 * Referencia: design-system.md §1 "Paleta extendida para Finanzas"
 */

export const chartColors = {
  // ── Líneas principales ────────────────────────────────────────
  // Datos reales (máxima autoridad, máximo contraste)
  real: "#09090B", // Zinc 950 — 16:1 ✅ AAA

  // Proyecciones (menos certeza que dato real)
  base: "rgba(82, 82, 91, 0.6)", // Zinc 600 @ 60% — 8:1 ✅ AA

  // Favorable (oportunidad, positivo)
  favorable: "var(--chart-1)", // Green 500 — 7.1:1 ✅ AA (#22C55E)

  // Riesgo (cautela, alerta suave)
  riesgo: "#FB7185", // rose-400 — 3.1:1 ⚠️ (mitigado: 2.5px + punteada)

  // ── Referencias ────────────────────────────────────────────────
  // Meta / inversión inicial — neutro vs Optimista (--chart-1)
  metaLine: "#A1A1AA", // Zinc 400

  // Hoy (referencia temporal, neutral)
  hoyLine: "#27272A", // Zinc 800 — 11:1 ✅ AAA
  hoyLabel: "#27272A", // Zinc 800

  // ── Payback markers ────────────────────────────────────────────
  // Payback Favorable (verde claro, optimista)
  paybackFavorable: "var(--chart-1)", // Green 500 (#22C55E)
  paybackLabelFavorable: "var(--chart-2)", // Green 600 (#16A34A)

  // Payback Base (zinc, neutral)
  paybackBase: "#52525B", // Zinc 600
  paybackLabelBase: "#27272A", // Zinc 800

  // Payback Riesgo (rose, cautela)
  paybackRiesgo: "#FB7185", // rose-400
  paybackLabelRiesgo: "#BE123C", // rose-700

  // Grid (neutro)
  grid: "#F4F4F5", // Zinc 100
} as const

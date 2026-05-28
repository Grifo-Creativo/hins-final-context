// lib/format-currency.ts
//
// Única fuente para prefijos y formateo monetario en UI.
// Reglas de contexto (tab global, labels sin moneda): design-system.md → Currency Context Rules
// Spec de implementación: context/components.md → FormatCurrency

/** Código de moneda en UI — alineado a toggles ROI (`usd` | `ars`). */
export type CurrencyCode = "ars" | "usd"

export type CurrencyFormatMode =
  /** KPI, tooltip, tablas, montos completos */
  | "full"
  /** Solo labels sobre barras (compacto + k/M) */
  | "compact"
  /** Eje Y de charts monetarios */
  | "axis"

export type FormatCurrencyOptions = {
  /** Decimales forzados (ej. tipo de cambio). Por defecto 0 en montos operativos. */
  decimals?: number
}

function currencyPrefix(currency: CurrencyCode): string {
  return currency === "ars" ? "$ " : "u$s "
}

function formatAmount(
  amount: number,
  fractionDigits: number
): string {
  return amount.toLocaleString("es-AR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

function formatScaledSuffix(
  amount: number,
  currency: CurrencyCode,
  suffix: "k" | "M",
  fractionDigits: number
): string {
  const divisor = suffix === "M" ? 1_000_000 : 1_000
  const scaled = amount / divisor
  const body = scaled.toLocaleString("es-AR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  return `${currencyPrefix(currency)}${body}${suffix}`
}

/**
 * Formato monetario Argentina: `$ ` (ARS) · `u$s ` (USD), miles `.`, decimales `,`.
 * La moneda se comunica solo vía tab global + prefijo del valor — no en labels.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  mode: CurrencyFormatMode = "full",
  options?: FormatCurrencyOptions
): string {
  const prefix = currencyPrefix(currency)
  const decimals = options?.decimals ?? 0
  const abs = Math.abs(amount)

  if (mode === "axis") {
    if (abs >= 1_000_000) {
      return formatScaledSuffix(amount, currency, "M", 0)
    }
    if (abs >= 1_000) {
      return formatScaledSuffix(amount, currency, "k", 0)
    }
    return `${prefix}${formatAmount(amount, 0)}`
  }

  if (mode === "compact") {
    if (abs >= 1_000_000) {
      return formatScaledSuffix(amount, currency, "M", 1)
    }
    if (abs >= 1_000) {
      return formatScaledSuffix(amount, currency, "k", 1)
    }
    return `${prefix}${formatAmount(amount, decimals)}`
  }

  return `${prefix}${formatAmount(amount, decimals)}`
}

/** Label de tabs / toggles globales (no es prefijo de monto). Siempre uppercase: DOLAR | ARS. */
export function currencyTabLabel(currency: CurrencyCode): string {
  return currency === "usd" ? "DOLAR" : "ARS"
}

/**
 * Sufijo de moneda para exports técnicos (CSV, PDF, columnas multi-currency).
 * @deprecated En UI in-app — no usar en headers de tabla, KPIs ni tooltips.
 * El contexto monetario lo define el tab global; ver Currency Context Rules.
 */
export function currencyExportColumnLabel(currency: CurrencyCode): string {
  return currencyTabLabel(currency)
}

/**
 * @deprecated Alias legacy — usar `currencyExportColumnLabel` solo en exports.
 * Prohibido en headers de tabla y labels de KPI dentro de la app.
 */
export function currencyColumnLabel(currency: CurrencyCode): string {
  return currencyExportColumnLabel(currency)
}

/** Valor base en USD × TC cuando la vista está en ARS. */
export function formatRoiFromUsd(
  valueUsd: number,
  currency: CurrencyCode,
  tipoCambioArs: number,
  mode: CurrencyFormatMode = "full",
  options?: FormatCurrencyOptions
): string {
  const amount = currency === "ars" ? valueUsd * tipoCambioArs : valueUsd
  return formatCurrency(amount, currency, mode, options)
}

/** Montos ≥ 1M pasan a `compact` (ej. `u$s 23,8M`) solo en mobile — más aire en KPIs/tablas ROI. */
export const ROI_MOBILE_COMPACT_MIN_AMOUNT = 1_000_000

export function formatRoiFromUsdResponsive(
  valueUsd: number,
  currency: CurrencyCode,
  tipoCambioArs: number,
  isMobile: boolean,
  desktopMode: CurrencyFormatMode = "full"
): string {
  const amount = currency === "ars" ? valueUsd * tipoCambioArs : valueUsd

  if (isMobile && desktopMode === "full" && Math.abs(amount) >= ROI_MOBILE_COMPACT_MIN_AMOUNT) {
    return formatCurrency(amount, currency, "compact")
  }

  return formatCurrency(amount, currency, desktopMode)
}

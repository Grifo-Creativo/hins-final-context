// lib/format-currency.ts

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
 * Tabs de moneda usan copy literal DOLAR / ARS — ver `currencyTabLabel`.
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

/** Label de tabs / toggles (no es prefijo de monto). */
export function currencyTabLabel(currency: CurrencyCode): string {
  return currency === "usd" ? "DOLAR" : "ARS"
}

/** Encabezados de tabla con moneda entre paréntesis. */
export function currencyColumnLabel(currency: CurrencyCode): string {
  return currencyTabLabel(currency)
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

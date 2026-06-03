/**
 * Energy & Power Parsing Utilities
 *
 * Centralized functions for parsing energy (kWh), power (kWp), and percentage values
 * from string representations. Used across all energy-related tables and components.
 *
 * IMPORTANT: When backend provides dynamic energy data, ensure string formats
 * remain compatible with regex patterns below (e.g., "123.5 kWh", "45,6 kWh").
 */

/**
 * Parse energy value from display string (handles "123 kWh", "45,6 kWh", etc.)
 * @param value Display string, e.g. "830 kWh" or "60,5 kWh"
 * @returns Numeric value or 0 if unparseable
 */
export function parseKwhDisplay(value: string): number {
  const m = value.match(/[\d]+(?:[.,][\d]+)?/)
  return m ? parseFloat(m[0].replace(",", ".")) : 0
}

/**
 * Parse power value from display string (handles "245 kWp", "1.5 kWp", etc.)
 * @param value Display string, e.g. "245 kWp" or "1,5 kWp"
 * @returns Numeric value or 0 if unparseable
 */
export function parseKwpDisplay(value: string): number {
  const m = value.match(/[\d]+(?:[.,][\d]+)?/)
  return m ? parseFloat(m[0].replace(",", ".")) : 0
}

/**
 * Parse percentage value from display string (handles "25%", "25.5%", etc.)
 * @param value Display string, e.g. "93%" or "25,5%"
 * @returns Numeric value or 0 if unparseable
 */
export function parsePercentDisplay(value: string): number {
  const m = value.match(/[\d]+(?:[.,][\d]+)?/)
  return m ? parseFloat(m[0].replace(",", ".")) : 0
}

/**
 * Parse monetary value from display string (handles "$100.000", "u$s 50,5", etc.)
 * @param value Display string, e.g. "$ 1.200" or "u$s 50,5"
 * @returns Numeric value or 0 if unparseable
 */
export function parseMoneyDisplay(value: string): number {
  const m = value.match(/[\d]+(?:[.,][\d]+)?/)
  return m ? parseFloat(m[0].replace(",", ".")) : 0
}

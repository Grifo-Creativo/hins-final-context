/**
 * Park Configuration Constants
 *
 * Centralized source of truth for park-specific settings and magic numbers.
 * When backend provides dynamic park configuration via API, replace these
 * constants with API calls and pass values as props to components.
 *
 * TODO: Replace with GET /api/parks/{id}/config endpoint
 */

// ─── GDCV (Parque Río Cuarto - Comunidad Virtual) ──────────────────────────

/** Total installed capacity of GDCV park (kWp). Source of truth for percentage calculations. */
export const GDCV_TOTAL_POTENCIA = 980

/** Virtual self-consumption percentage for GDCV socio distribution. */
export const GDCV_AUTOCONSUMO_PORCENTAJE = 0.68

/** Investment recovery target for ROI projection (ARS). */
export const GDCV_INVERSION_META = 38_000_000

// ─── GDD (Parque General Roca - Dueño) ───────────────────────────────────

/** Total installed capacity of GDD park (kWp). */
export const GDD_TOTAL_POTENCIA = 1_250

/** Investment recovery target for GDD ROI projection (ARS). */
export const GDD_INVERSION_META = 21_000_000

// ─── GDC (Parque Comunitario) ────────────────────────────────────────────

/** Total installed capacity of GDC park (kWp). */
export const GDC_TOTAL_POTENCIA = 1_500

/** Investment recovery target for GDC ROI projection (ARS). */
export const GDC_INVERSION_META = 45_000_000

// ─── Migration Notes for Backend Integration ──────────────────────────────

/**
 * When connecting to backend APIs:
 *
 * 1. Park capacity values (GDCV_TOTAL_POTENCIA, etc.)
 *    - Currently used by: SocioDetailSheet.tsx, SociosTable.tsx
 *    - Replace with: GET /api/parks/{id} → potenciaTotal
 *    - Pass as prop: <SociosTable totalPotencia={park.potenciaTotal} />
 *
 * 2. Autoconsumo percentage (GDCV_AUTOCONSUMO_PORCENTAJE)
 *    - Currently used by: SocioDetailSheet.tsx:65
 *    - Replace with: GET /api/parks/{id}/config → autoconsumoRatio
 *    - Pass as prop: fallbackDetail(socio, { autoconsumoRatio: 0.68 })
 *
 * 3. Investment targets (GDCV_INVERSION_META, etc.)
 *    - Currently used by: gdd-roi-mock.ts, gdcv-agc-mock.ts
 *    - Replace with: GET /api/parks/{id}/roi → inversionMeta
 *    - Update: ROIProjectionChart props
 *
 * 4. Current date for ROI "today" line
 *    - Currently hardcoded in: gdcv-roi-mock.ts, gdd-roi-mock.ts
 *    - Replace with: useContext or useQuery for current date
 *    - Update: ROIProjectionChart fechaHoy prop
 */

# GDCV Socio — Terminología (prototipo)

Referencia rápida para alinear UI, mocks y flows. Valores numéricos pueden cambiar con API real; **los términos** deben mantenerse.

## Cuota vs parque total

| Concepto | Mock | Dónde se muestra |
|---|---|---|
| Participación del socio | `socioPorcentaje` (15%) · `socioCuotaDelParqueSubtitle` | StatList Mi Espacio, donut |
| Potencia **asignada** al socio | `socioPotenciaInstalada` / `socioPotenciaAcople` (380 / 310 kWp) | `socioParkDetails` — `/gdcv/socio` |
| Potencia **total** del parque | `gdcvParkDetails` (980 / 815 kWp) | `socioParqueChartMetricRows` fila 1 — `/gdcv/socio/parque` |

> 380/310 **no** es 15% × 980/815 en el prototipo; la regla de asignación la define negocio/backend.

## Inversión

| Contexto | Fuente | Vista |
|---|---|---|
| Inversión del **socio** | `SOCIO_INVERSION_INICIAL_USD` → `formatCurrency(…, "usd")` (ej. `u$s 5,7M`) | ROI Mi Espacio + fila 2 bajo chart en parque |
| CAPEX parque AGC | `gdcv-mock` ($4.27 M) | Solo admin GDCV — no mezclar en Socio |

## Íconos en `FeatureItem` (parque y KPIs)

- **Zap** — energía, potencia, kWh acumulado  
- **Wallet** — ahorro total / factura  
- **CircleDollarSign** — montos $ que no son “ahorro” (inversión)  
- **Calendar** — inicio de operaciones  

Spec: `context/components.md` → FeatureItem → Íconos.

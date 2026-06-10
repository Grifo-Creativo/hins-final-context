# flows/GDD/roi-spec.md
# GDD ROI — Parque General Roca (spec de negocio + datos de maqueta)

> **Wireframe e implementación UI:** `flows/GDD/flow.md` → GDD_02  
> **Spec de componentes:** `context/components.md` → KpiWithAsset, FormatCurrency, etc.  
> **Mock en código:** `data/gdd-roi-mock.ts`

---

## 1. Contexto del proyecto

| Campo | Valor |
|---|---|
| **Proyecto** | Parque Fotovoltaico "Parque General Roca" |
| **Modelo de negocio** | Retorno basado en Ahorro Energético (USD o ARS) |
| **Inversión inicial total (base USD)** | `21.000.000` |
| **Inversión recuperada a la fecha (base USD)** | `6.000.000` |
| **Porcentaje de recuperación global** | `28.5%` |
| **Pendiente de recuperar (base USD)** | `15.000.000` |
| **Payback estimado total** | `7.0 años` |
| **Fecha de inicio** | Mayo 2024 |
| **Fecha de corte actual (mes en curso)** | Mayo 2026 (2.0 años / 24 meses transcurridos) |
| **Fecha estimada de finalización del payback** | Mayo 2031 |
| **TIR** | `15.00%` (moneda-agnóstica en UI) |
| **Plazo total del proyecto** | `20 años` (moneda-agnóstico en UI) |
| **Payback Velocity (tag informativo)** | `🟢 +8% más rápido de lo estimado` |

---

## 2. Arquitectura de información (layout)

La pantalla se divide en dos bloques:

1. **Bloque superior (macro):** KPIs de alto impacto — recuperado, barra de progreso, pendiente, payback con timeline, TIR y plazo.
2. **Bloque inferior (micro):** Tablas en tabs **Proyectado | Histórico** — pasado (auditoría) vs futuro (simulación).
3. **Control global de moneda:** Toggle en cabecera **DOLAR | ARS** — muta todos los montos de la vista.

---

## 3. Reglas DOLAR vs ARS

Resumen — spec completa en `context/components.md` → FormatCurrency y `context/design-system.md` → Currency Context Rules.

| Regla | Detalle |
|---|---|
| Base de datos | Montos numéricos en **USD** |
| Toggle ARS | `valor × TIPO_CAMBIO_ARS`; formateo vía `formatRoiFromUsd` / `formatCurrency` |
| Prefijos UI | DOLAR → `u$s ` · ARS → `$ ` (locale `es-AR`) |
| Agnósticos al toggle | Fechas, plazos, TIR, plazo del proyecto, porcentajes, tags de estado |
| Labels de KPI/columnas | Solo concepto de negocio — **sin** `(DOLAR)`, `(ARS)` ni moneda en copy |
| Tabs de moneda | Labels literales **DOLAR** y **ARS** (no `u$s` en el chip) |

---

## 4. Estacionalidad (hemisferio sur)

Curva fotovoltaica real: ingresos altos en verano (Ene–Mar), bajos en invierno (Jun–Ago). Los datasets de tablas deben ser consistentes con los KPIs superiores.

---

## 5. Dataset — Tabla Histórico

*Orden descendente hacia el pasado. Valores consolidados reales.*

| Período | Cap. Recuperado Mensual | Recupero Acumulado | Avance de Recuperación |
| :--- | :--- | :--- | :--- |
| **Abril 2026** | `$210.000` | `$6.000.000` | `28.5%` |
| **Marzo 2026** | `$260.000` | `$5.790.000` | `27.6%` |
| **Febrero 2026** | `$340.000` | `$5.530.000` | `26.3%` |
| **Enero 2026** | `$390.000` | `$5.190.000` | `24.7%` |
| **Diciembre 2025** | `$370.000` | `$4.800.000` | `22.9%` |
| **Noviembre 2025** | `$310.000` | `$4.430.000` | `21.1%` |

---

## 6. Dataset — Tabla Proyectado

*Orden cronológico hacia el futuro. Valores estimados.*

| Período | Ahorro Estimado | Pendiente de Recuperar | Avance de Recuperación | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Mayo 2026** | `$180.000` | `$15.000.000` | `28.5%` | `En Curso` |
| **Junio 2026** | `$140.000` | `$14.820.000` | `29.4%` | `Estimado` |
| **Julio 2026** | `$150.000` | `$14.680.000` | `30.1%` | `Estimado` |
| **Agosto 2026** | `$190.000` | `$14.530.000` | `30.8%` | `Estimado` |
| **Septiembre 2026** | `$270.000` | `$14.340.000` | `32.1%` | `Estimado` |
| **Octubre 2026** | `$320.000` | `$14.070.000` | `33.0%` | `Estimado` |

---

## 7. Reglas de formateo UI (checklist desarrollador)

1. Toggle **DOLAR | ARS** en header define moneda de toda la vista.
2. Labels de columna/KPI: solo concepto (`Ahorro Estimado`, `Cap. Recuperado`) — sin sufijo de moneda.
3. Valores monetarios: prefijo vía `formatRoiFromUsd` / `formatCurrency`.
4. Celdas monetarias (excepto TIR y Plazo) × `TIPO_CAMBIO_ARS` cuando tab ARS activo.
5. Implementación: `lib/format-currency.ts` + `context/components.md` → FormatCurrency.

# Data Model (tipos front, `lib/api/types.ts`)

Alcance = `"PARQUE" | "SOCIOS"`. Montos ARS: `string` decimal (API) → `montoArs: string`, `monto: number` derivado en borde.

- **IngresoPeriodo**: periodo, montoArs, energiaKwh, registros, valorInyeccionPromedio, porFranja?
- **IngresosResumen**: items[], total{montoArs, energiaKwh, registros}, cobertura
- **Cobertura**: registrosConEnergia, registrosSinIngreso, ultimoIngresoCalculadoEn (nullable). Regla: `registrosSinIngreso > 0` ⇒ aviso incompleto.
- **IngresosKpis**: mes, mesAnterior, variacion{montoPct|null, energiaPct|null}, acumulado{desde, montoArs, energiaKwh}, tarifaInyeccionVigente|null, promedioPorSocio|null, cobertura
- **TarifaVigente**: valor, unidad, franja, vigenteDesde, origen, variacionPct|null
- **IngresoSocio**: socioId, participacionPorcentaje, potenciaAsociadaKwp, medidores[{medidorId, energiaKwh, montoArs}], energiaKwh, montoArs, esquema PROPIO|PARQUE, sinMedidor, sinIngresos
- **IngresosPorSocio**: items[], total, cobertura
- **RoiRealizado**: inversionMeta|null, sinInversionMeta, meses[{periodo, ingresoArs, tipoCambio|null, ingresoUsd|null, acumuladoUsd, porcentajeRecuperado, tipoCambioFaltante}], resumen{acumuladoUsd, pendienteUsd, porcentajeRecuperado, mesesTranscurridos, aniosTranscurridos, mesesSinTipoCambio}
- **Socio** (ext.): medidores[], potenciaAsociadaKwp

## Estados derivados (puros)
`sinIngresosTodavia` (total.registros=0), `sinTarifa` (tarifa null), `sinInversionMeta`, `mesesSinTipoCambio>0`, socio `sinMedidor`/`sinIngresos`. Variación null ⇒ mostrar "—".

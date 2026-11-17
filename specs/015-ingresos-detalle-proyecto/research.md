# Research: Ingresos por inyección

## D1 Fuente de datos
- Decision: endpoints `ingresos/kpis`, `ingresos/resumen`, `ingresos/por-socio`, `roi/realizado`.
- Rationale: agregados calculados en backend evitan sumar registros de 15 min; contrato verificado en swagger vivo.
- Alternatives: sumar `registros_historico` en front (rechazado: volumen, precisión); usar `ingresoMes` de `/energia` (rechazado: fuente Huawei distinta).

## D2 Decimales
- Decision: montos como string en API; coaccionar con `toNumber` en `lib/api`, mantener `montoArs` string original para totales exactos y formatear con `Intl.NumberFormat`.
- Rationale: SC-002 exige 0 centavos de diferencia; no re-sumar en front.
- Alternatives: librería decimal (rechazada: dependencia nueva, V Simplicidad).

## D3 Alcance
- Decision: parámetro `alcance` obligatorio en la firma TS (no opcional); PARQUE para Performance/ROI/historial, SOCIOS para tabla y portal.
- Rationale: evita doble conteo (FR-022) por construcción de tipos.

## D4 Aislamiento de fallas
- Decision: un fetch por bloque, `Suspense` + error boundary por bloque con reintento (`router.refresh`); `Promise.allSettled` en páginas.
- Rationale: FR-024; mismo criterio que energía.

## D5 ROI
- Decision: `roi/realizado` es fuente principal; `RegistroRoi.creditoAcumulado` deja de mostrarse; `TIPO_CAMBIO_ARS` se elimina; conversión ARS usa tipoCambio por mes.
- Rationale: aclaración 1 de la spec.

## D6 Roles
- Decision: `por-socio` solo para HINS_ADMIN/AGC; rol SOCIO usa `resumen` alcance SOCIOS filtrado a su socio; `promedioPorSocio` null se oculta.
- Rationale: aclaración 4, privacidad.

## D7 Período y refresco
- Decision: mes en curso (hora Argentina, reusar `argentina-day-range`); lectura al renderizar; mostrar `ultimoIngresoCalculadoEn`.
- Rationale: aclaraciones 2 y 3.

## D8 Contrato
- Decision: regenerar `docs/openapi.json` desde `localhost:3000/docs-json`.

## Abiertos (verificar con datos reales, no bloquean)
- Medidores de socio exportan energía; existen tipos de cambio REAL mensuales.

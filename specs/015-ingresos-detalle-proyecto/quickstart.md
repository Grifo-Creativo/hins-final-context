# Quickstart de validación

Prereqs: backend en `localhost:3000` reiniciado con módulo ingresos; `HINS_API_BASE_URL=http://localhost:3000`; usuarios de cada rol.

1. `curl localhost:3000/docs-json -o docs/openapi.json` y confirmar paths `/ingresos/*` y `/roi/realizado`.
2. `npm test` (tests de lógica pura en rojo primero, luego verde); `npm run lint`; `npm run build`.
3. `npm run dev`. Como GDD_OWNER: Performance → ingresos del mes, variación, tarifa, energía acumulada; sin "Promedio por usuario".
4. Como AGC en parque GDCV: promedio por usuario, tabla de socios (sinMedidor, sinIngresos, desglose por medidor), totales = suma de filas.
5. ROI: acumulado/pendiente/% coinciden con `roi/realizado`; mes sin tipo de cambio marcado; parque sin inversión meta muestra mensaje. Payback, plazo, TIR proyectada y escenarios figuran como estimativos/no disponibles (FR-018).
6. Como SOCIO: solo datos propios; sin promedio por socio.
7. Detener backend de ingresos: solo el bloque falla, con reintento; resto operativo.
8. Revisión: ningún importe PARQUE sumado a SOCIOS; aviso de incompleto visible si `registrosSinIngreso>0`.

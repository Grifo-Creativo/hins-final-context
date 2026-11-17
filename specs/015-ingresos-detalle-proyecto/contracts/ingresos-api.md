# Contrato consumido (backend NestJS, swagger `/docs-json`)

| Endpoint | Roles | Alcance | Usa |
|---|---|---|---|
| GET /parques/{id}/ingresos/kpis?periodo&alcance&socioId | todos del parque | PARQUE / SOCIOS | Performance, portal |
| GET /parques/{id}/ingresos/resumen?agrupar=mes\|total&desde&hasta&alcance&socioId&medidorId&porFranja | todos del parque | PARQUE / SOCIOS | Historial, portal |
| GET /parques/{id}/ingresos/por-socio | HINS_ADMIN, AGC | SOCIOS | Tabla/detalle socios |
| GET /parques/{id}/roi/realizado?socioId&hasta | HINS_ADMIN, GDD_OWNER, AGC | PARQUE | ROI |
| GET /socios | existente | — | medidores[], potenciaAsociadaKwp |

Errores: 401 → UnauthorizedError (login), 403 → ForbiddenError, 404 → null (`apiFetch`).
Referencia completa: `docs/backend-requests-ingresos.md` y `docs/openapi.json` (regenerado).
`/ingresos/export` fuera de alcance.

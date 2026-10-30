# Research: Esquemas tarifarios

Fuente: `http://localhost:3000/docs-json` (revisado 2026-10-30).

## R1 — ¿Dónde viven los "rangos"?
- **Decision**: en `franjas[]` del esquema (`horaInicio`/`horaFin`). `Tarifa` (catálogo) no tiene campos de rango.
- **Rationale**: confirmado con el swagger y con el usuario.
- **Alternatives**: agregar rangos al catálogo — descartado, no existe en la API.

## R2 — Cómo validar cobertura 24 h
- **Decision**: función pura `validateFranjas` en cliente: exactamente un RESTO/PICO/VALLE; HH:MM válido; intervalos semiabiertos [inicio, fin) con cruce de medianoche (inicio > fin); unión = 24 h sin solapes ni huecos (suma de duraciones = 1440 min y sin superposición). Horarios omitidos → habituales del tipo.
- **Rationale**: feedback inmediato; el backend (400) sigue siendo autoridad.
- **Alternatives**: delegar todo al backend — peor UX, pierde datos del form en cada error.
- **Decision (horarios)**: omitir los tres horarios es válido (el backend aplica los habituales); si se informa alguno, deben informarse los tres y cubrir 24 h. No se hardcodean habituales; si el destino tiene esquema efectivo, se muestran como placeholder.

## R3 — Ubicación en la UI
- **Decision**: parque → ruta `/{modelo}/tarifas?proyectoId=` + ítem de menú; socio → diálogo desde fila de `SociosTable` (GDCV).
- **Rationale**: mismo patrón que Costos (013) y Histórico de socio (009/010).
- **Alternatives**: pestaña dentro de performance — acopla vistas de gráficos con configuración.

## R4 — Permisos
- **Decision**: lectura `HINS_ADMIN|AGC`, escritura `HINS_ADMIN`. Nuevo `requireReader()`; acciones usan `runCrudAction` y el backend responde 403 como defensa final.
- **Rationale**: swagger: GET exige `HINS_ADMIN o AGC`; POST/PATCH/DELETE `HINS_ADMIN`.

## R5 — Reutilización de componentes de 013
- **Decision**: reutilizar `ConfirmDeleteDialog`, `PaginationControls`, `FormField`, `SelectField`, `loadList`, `runCrudAction`. No reutilizar `ResourceFormDialog` (form plano).

## R6 — Selector de tarifa por franja
- **Decision**: opciones = nombres únicos del catálogo (`GET /tarifas` con límite alto o `GET /tarifas/vigente`), cargados en servidor y pasados al editor.
- **Rationale**: FR-007; `tarifaNombre` es referencia por nombre.
- **Open point**: si el catálogo supera una página, usar paginación acumulada; se asume ≤ 1.000 registros (como 013).

## R7 — Errores del backend
- **Decision**: mostrar el mensaje del backend para 400/404/409 (`apiFetch` ya lo propaga), más mensajes locales de validación.

## R8 — Advertencia al borrar tarifa en uso (FR-016)
- **Decision**: solo texto de advertencia en `deleteWarning` de la config de tarifas; si el backend rechaza con 409 se muestra su mensaje. No se consulta uso por esquemas (no hay endpoint).

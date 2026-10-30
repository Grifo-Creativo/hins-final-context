# Quickstart: validar esquemas tarifarios

Prerrequisitos: backend en `localhost:3000` con catálogo de tarifas (p. ej. "Resto", "Pico", "Valle"), un parque GDCV con ≥ 1 socio; usuarios `HINS_ADMIN` y `AGC`.

```sh
pnpm dev
pnpm test        # tests de esquema-franjas, lib/api y actions
pnpm lint && pnpm build
```

## Escenarios
1. **Vista efectiva (US1)**: como admin abrir `/gdcv/tarifas?proyectoId=<id>`: ver 3 franjas con horario, valores y badges PROPIO/CATÁLOGO. Cambiar `?fecha=` y verificar que cambia el esquema.
2. **Parque sin esquema**: estado vacío con botón "Crear" (admin) o sin botón (AGC).
3. **Crear esquema parque (US2)**: fecha posterior al último; 3 franjas válidas → aparece en historial. Probar horario con hueco → error local; fecha ≤ último → mensaje 409 del backend.
4. **Editar/eliminar**: FUTURA permite cambiar fecha; VIGENTE no; HISTÓRICA sin acciones. Eliminar pide confirmación.
5. **Socio (US3)**: en `/gdcv/performance` (tabla de socios) abrir "Tarifas" de un socio sin esquema: indica "heredado del parque". Crear esquema propio con precarga → pasa a "propio". Eliminarlo → vuelve a heredado.
6. **Permisos**: AGC ve vistas pero no botones de escritura; otro rol es redirigido.
7. **Catálogo (US4)**: borrar tarifa en `/main/tarifas` muestra advertencia sobre esquemas.

Contratos: [backend-endpoints.md](contracts/backend-endpoints.md) · Modelo: [data-model.md](data-model.md).

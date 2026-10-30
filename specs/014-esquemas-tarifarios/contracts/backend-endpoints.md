# Contrato backend consumido (esquemas tarifarios)

Base: `HINS_API_BASE_URL`. Auth por cookie de sesión (vía `apiFetch`). Roles: GET `HINS_ADMIN|AGC`; POST/PATCH/DELETE `HINS_ADMIN`.

| Método | Ruta | Uso | Errores relevantes |
|---|---|---|---|
| GET | `/parques/{parqueId}/esquemas-tarifarios?page&limit` | Historial parque | 404 parque |
| POST | `/parques/{parqueId}/esquemas-tarifarios` | Crear esquema parque | 400 datos/horarios; 404 parque o tarifa; 409 fecha ≤ último |
| GET | `/parques/{parqueId}/socios/{socioId}/esquemas-tarifarios?page&limit` | Historial socio | — |
| POST | `/parques/{parqueId}/socios/{socioId}/esquemas-tarifarios` | Crear esquema socio | ídem |
| GET | `/esquemas-tarifarios/{id}` | Detalle (precarga al editar) | 404 |
| PATCH | `/esquemas-tarifarios/{id}` | Editar (`vigenteDesde?` solo FUTURA, `franjas?`) | 400; 404; 409 histórico/fecha fuera de orden |
| DELETE | `/esquemas-tarifarios/{id}` | Eliminar vigente/futuro (204) | 404; 409 histórico |
| GET | `/parques/{parqueId}/tarifa-efectiva/franjas?fecha` | Franjas efectivas parque | — |
| GET | `/parques/{parqueId}/socios/{socioId}/tarifa-efectiva/franjas?fecha` | Franjas efectivas socio (hereda del parque) | — |
| GET | `/parques/{parqueId}/tarifa-efectiva?fecha&hora` | Franja actual (opcional) | — |
| GET | `/tarifas?page&limit` | Opciones de catálogo para el selector | — |

Cuerpos: ver [data-model.md](../data-model.md). Ejemplo POST:

```json
{ "vigenteDesde": "2026-11-01",
  "franjas": [
    { "tipo": "RESTO", "tarifaNombre": "Resto", "horaInicio": "05:00", "horaFin": "18:00" },
    { "tipo": "PICO",  "tarifaNombre": "Pico",  "horaInicio": "18:00", "horaFin": "23:00", "valorEnergia": 120.5 },
    { "tipo": "VALLE", "tarifaNombre": "Valle", "horaInicio": "23:00", "horaFin": "05:00" } ] }
```

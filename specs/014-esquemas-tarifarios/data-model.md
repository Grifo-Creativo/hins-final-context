# Data Model: Esquemas tarifarios

Tipos en `lib/api/types.ts` (fuente única). Decimales se coaccionan a `number` en `lib/api`.

## Enumeraciones
- `TipoFranja` = `"RESTO" | "PICO" | "VALLE"`
- `EsquemaEstado` = `"HISTORICA" | "VIGENTE" | "FUTURA"`
- `DestinoTipo` = `"PARQUE" | "SOCIO"`
- `OrigenValor` = `"PROPIO" | "CATALOGO"`

## Entidades

**Franja** (respuesta): `tipo`, `horaInicio` "HH:MM", `horaFin` "HH:MM", `tarifaNombre`, `valorEnergia|null`, `valorInyeccion|null`, `unidad|null` (null = toma del catálogo).

**FranjaDto** (envío): `tipo`, `tarifaNombre` (requeridos); `horaInicio?`, `horaFin?`, `valorEnergia?` (≥0), `valorInyeccion?` (≥0), `unidad?`.

**Esquema**: `id`, `destino {tipo, id}`, `vigenteDesde` YYYY-MM-DD, `vigenteHasta|null` (calculado), `estado`, `franjas: Franja[3]`.

**CreateEsquemaDto**: `vigenteDesde`, `franjas: FranjaDto[3]`. **UpdateEsquemaDto**: `vigenteDesde?` (solo FUTURA), `franjas?` (reemplazo total).

**FranjaEfectiva**: `tipo`, `horaInicio`, `horaFin`, `tarifaNombre`, `versionCatalogoDesde|null`, `valorEnergia {valor, origen}`, `valorInyeccion {valor, origen}`, `unidad {valor, origen}`.

**FranjasEfectivas**: `esquema {id, destino, vigenteDesde, vigenteHasta}`, `fecha`, `franjas: FranjaEfectiva[3]`.

## Estado del formulario (cliente)
`EsquemaFormValues = { vigenteDesde: string; franjas: Record<TipoFranja, { tarifaNombre; horaInicio; horaFin; valorEnergia; valorInyeccion; unidad }> }` — todo string; vacío = omitir.

## Reglas de validación (`lib/esquema-franjas.ts`)
- `vigenteDesde` requerido, YYYY-MM-DD.
- 1 franja por tipo; `tarifaNombre` requerido y presente en catálogo.
- Horas HH:MM; unión de [inicio, fin) cubre 24 h sin huecos/solapes (cruce de medianoche válido).
- Valores propios: vacío = omitir; si presente, número ≥ 0 (0 válido).

## Transiciones / reglas por estado
| Estado | Editar franjas | Editar fecha | Eliminar |
|---|---|---|---|
| HISTORICA | no | no | no |
| VIGENTE | sí | no | sí |
| FUTURA | sí | sí (posterior a hoy, entre vecinos) | sí |

Crear: `vigenteDesde` posterior al último esquema del destino (409 si no).
Herencia: socio sin esquema → efectivas del parque (`esquema.destino.tipo === "PARQUE"`).

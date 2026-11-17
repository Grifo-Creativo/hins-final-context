# Solicitudes al backend — Ingresos en el detalle de proyecto

Origen: análisis de las pantallas de Performance, Socios, Portal del Socio y ROI contra el swagger vivo (`/docs-json`) y el módulo `ingresos` del backend.
Alcance: solo datos que el backend **ya tiene** (`ingresos_energia`, `registros_historico`, `medidores`, `socios`, `parques`, `tipos_cambio`, `esquemas_tarifarios`, `roi`). No se piden modelos nuevos (neteo, proyección, TIR), solo agregación y cálculo sobre lo existente.

## Reglas comunes a todos los endpoints nuevos

1. **Agregar en SQL**, sobre `ingresos_energia.monto_ars` (y `energia_wh`) sin redondear. Redondear **una sola vez**, después de la suma. Devolver montos como string decimal con 2 decimales (`"1234567.89"`) para no perder precisión; la energía como número en kWh.
2. **Zona horaria** `America/Argentina/Buenos_Aires` para armar días y meses (igual que `medidor-principal/energia`). `hasta` es exclusivo, como en `/ingresos`.
3. **Nunca sumar medidor principal y medidores de socio en un mismo total.** El principal usa el esquema del parque y los de socio el propio (o el del parque por fallback): sumarlos duplica energía. Todo resumen debe tener un parámetro `alcance`:
   - `PARQUE` (default): solo medidores con `rol = PRINCIPAL_PARQUE`.
   - `SOCIOS`: solo medidores con `rol = SOCIO`.
   - Con `socioId` se fuerza `SOCIOS` y se filtra por ese socio.
4. **Permisos** iguales a `GET /parques/{id}/ingresos`: `HINS_ADMIN`, `GDD_OWNER`, `AGC`, `SOCIO` (este último limitado a su socio y a `alcance=SOCIOS`; con `alcance=PARQUE` responde 403). Excepción indicada en cada caso.
5. **Cobertura**: cada respuesta incluye cuántos registros de 15 min hay en `registros_historico` con energía informada y cuántos de ellos no tienen ingreso (omitidos por `SIN_ESQUEMA`, `SIN_CATALOGO`, etc.). Así el front puede avisar "datos incompletos" en vez de mostrar un total silenciosamente bajo.
6. **Documentar en swagger** con DTOs tipados (hoy `/energia`, `/roi` y `/mantenimiento` no tienen schema de respuesta).

---

## S1. `GET /parques/{parqueId}/ingresos/resumen` (prioridad 1, bloquea casi todo)

Query:

| Param | Tipo | Notas |
|---|---|---|
| `agrupar` | `intervalo` \| `hora` \| `dia` \| `mes` \| `total` | Default `mes`. `intervalo` = 15 min, para el gráfico de 1 día |
| `desde`, `hasta` | ISO-8601 | `hasta` exclusivo. Si se omiten: desde el primer ingreso hasta ahora |
| `alcance` | `PARQUE` \| `SOCIOS` | Ver regla 3 |
| `socioId`, `medidorId` | string | Opcionales |
| `porFranja` | boolean | Si `true`, cada fila trae desglose PICO/RESTO/VALLE |

Respuesta:

```json
{
  "agrupar": "mes",
  "alcance": "PARQUE",
  "moneda": "ARS",
  "items": [
    {
      "periodo": "2026-04",
      "montoArs": "74400.00",
      "energiaKwh": 830.17,
      "registros": 2880,
      "valorInyeccionPromedio": 89.62,
      "porFranja": [
        { "franja": "PICO", "energiaKwh": 210.4, "montoArs": "21000.00" }
      ]
    }
  ],
  "total": { "montoArs": "…", "energiaKwh": 0, "registros": 0 },
  "cobertura": {
    "registrosConEnergia": 2900,
    "registrosSinIngreso": 20,
    "ultimoIngresoCalculadoEn": "2026-05-01T06:00:00Z"
  }
}
```

- `periodo` es `YYYY-MM`, `YYYY-MM-DD`, `YYYY-MM-DDTHH:00` o ISO del intervalo, según `agrupar`.
- `valorInyeccionPromedio` = `montoArs / energiaKwh` (null si energía 0).
- Un período sin ingresos **no** se omite entre `desde` y `hasta` cuando `agrupar` es `dia` o `mes`: devolver fila con ceros, así los gráficos no tienen huecos ambiguos.
- Rango máximo: sin límite para `mes` y `total`; 366 días para `dia`; 31 días para `hora` e `intervalo`.

**Alimenta:** Historial de Generación (columna "Ahorro generado"), gráfico de ingresos por mes/día/1D, serie "inyectada" de "Mi Ahorro" en el portal del socio, tramo real de la curva de ROI, y la tabla ROI Histórico.

---

## S2. `GET /parques/{parqueId}/ingresos/kpis` (prioridad 1)

Query: `periodo=YYYY-MM` (default mes actual), `alcance` (default `PARQUE`), `socioId` opcional.

Respuesta:

```json
{
  "periodo": "2026-04",
  "alcance": "PARQUE",
  "mes": { "montoArs": "248143.00", "energiaKwh": 124.2, "registros": 2880 },
  "mesAnterior": { "periodo": "2026-03", "montoArs": "242000.00", "energiaKwh": 120.1 },
  "variacion": { "montoPct": 2.3, "energiaPct": 3.4 },
  "acumulado": {
    "desde": "2024-03-01",
    "montoArs": "…",
    "energiaKwh": 13556
  },
  "tarifaInyeccionVigente": {
    "valor": 80.0,
    "unidad": "ARS/kWh",
    "franja": "RESTO",
    "vigenteDesde": "2026-04-01",
    "origen": "CATALOGO",
    "variacionPct": 1.6
  },
  "promedioPorSocio": { "montoArs": "21836.00", "sociosConIngreso": 11 },
  "cobertura": { "registrosConEnergia": 0, "registrosSinIngreso": 0 }
}
```

- `variacionPct` = `(mes − mesAnterior) / mesAnterior × 100`; null si el anterior es 0.
- `acumulado.desde` = fecha del primer ingreso del alcance (no `fechaPuestaEnMarcha`: los ingresos empiezan cuando hay medidor y esquema).
- `tarifaInyeccionVigente`: franja vigente **ahora** (hora de Argentina) para el parque, resuelta con la misma lógica de `tarifa-efectiva`, pero **accesible para `GDD_OWNER`** (hoy `tarifa-efectiva` exige `HINS_ADMIN` o `AGC`). `variacionPct` compara con la tarifa de la misma franja 30 días antes.
- `promedioPorSocio` solo con `alcance=SOCIOS` o en vistas AGC: `montoArs` total de socios dividido por `sociosConIngreso` (socios con al menos un ingreso en el mes). Dejar documentada esta definición en el swagger.

**Alimenta:** KPI "Ahorro acumulado/Total en [mes]", "Valor de Tarifa Actual", sus deltas, "Promedio por usuario" y el texto "X kWh desde el Inicio".

---

## S3. `GET /parques/{parqueId}/ingresos/por-socio` (prioridad 1)

Query: `desde`, `hasta` (default mes actual), `periodo=YYYY-MM` como atajo. Roles: `HINS_ADMIN`, `AGC`.

```json
{
  "desde": "2026-04-01T00:00:00-03:00",
  "hasta": "2026-05-01T00:00:00-03:00",
  "items": [
    {
      "socioId": "…",
      "nombre": "Agro Sur Industrial",
      "participacionPorcentaje": 15,
      "potenciaAsociadaKwp": 147,
      "medidores": [
        { "medidorId": "…", "numeroSerie": "354904", "energiaKwh": 11.4, "montoArs": "22800.00" },
        { "medidorId": "…", "numeroSerie": "354906", "energiaKwh": 5.7, "montoArs": "11400.00" }
      ],
      "energiaKwh": 17.1,
      "montoArs": "34200.00",
      "esquema": "PROPIO",
      "sinMedidor": false,
      "sinIngresos": false
    }
  ],
  "total": { "energiaKwh": 0, "montoArs": "…", "participacionPorcentaje": 100 }
}
```

- Incluir **todos** los socios del parque, también los que no tienen medidor o ingresos (`sinMedidor` / `sinIngresos` en `true`, valores en 0), para que la tabla no oculte a nadie.
- `potenciaAsociadaKwp = participacionPorcentaje / 100 × parque.potenciaTotalKwp`.
- `esquema`: `PROPIO` si el socio tiene esquema tarifario vigente propio, `PARQUE` si usa el fallback del parque.
- `total.participacionPorcentaje` permite mostrar si las participaciones suman 100.

**Alimenta:** `SociosTable` (columnas "Potencia asociada", "Energía generada", "Ahorro generado", totales de pie), `SocioDetailSheet` (energía del mes, ahorro generado, desglose por medidor) y el multi-medidor.

---

## S4. `GET /parques/{parqueId}/socios`: ampliar respuesta (prioridad 2)

Agregar a cada socio, sin romper campos existentes:

```json
{ "medidores": [{ "id": "…", "numeroSerie": "…", "suministroNumero": "…", "contratoNumero": "…" }],
  "potenciaAsociadaKwp": 147 }
```

Hoy el front solo conoce `medidorNumero` (uno) y no puede mostrar socios con varios medidores. Si se pasa `?incluirIngresos=periodo` se podría fusionar con S3, pero se prefiere mantenerlos separados.

---

## S5. `GET /parques/{parqueId}/roi/realizado` (prioridad 2, ROI)

Calcula con datos existentes lo que hoy se carga a mano en `creditoAcumulado`.

Query: `alcance=PARQUE` (el ROI por socio queda fuera, ver nota), `hasta=YYYY-MM` (default mes actual).

```json
{
  "parqueId": "…",
  "fechaPuestaEnMarcha": "2024-03-01",
  "inversionMeta": { "valor": 38000000, "moneda": "USD", "periodoRegistro": "2026-04" },
  "meses": [
    {
      "periodo": "2026-04",
      "ingresoArs": "248143.00",
      "tipoCambio": { "valor": 1200, "tipo": "REAL", "periodicidad": "MENSUAL" },
      "ingresoUsd": "206.78",
      "acumuladoUsd": "14200000.00",
      "porcentajeRecuperado": 37.4,
      "tipoCambioFaltante": false
    }
  ],
  "resumen": {
    "acumuladoUsd": "14200000.00",
    "pendienteUsd": "23800000.00",
    "porcentajeRecuperado": 37.4,
    "mesesTranscurridos": 26,
    "aniosTranscurridos": 2.2,
    "mesesSinTipoCambio": []
  }
}
```

- Conversión: `ingresoUsd = ingresoArs / tipoCambio.valor`, con el tipo `REAL` del mes (si no hay mensual, caer a diario promedio o anual en ese orden; documentar la regla). Si no existe ningún tipo de cambio aplicable, `ingresoUsd = null`, `tipoCambioFaltante = true` y el mes queda listado en `mesesSinTipoCambio`; no inventar valor.
- `inversionMeta` sale del `RegistroRoi` más reciente del parque (`socioId` null).
- `aniosTranscurridos` y `mesesTranscurridos` desde `fechaPuestaEnMarcha`, para el timeline Inicio/Hoy.
- **Decisión a tomar por producto/backend** (no es técnica): si el ingreso del parque (medidor principal) es el "crédito acumulado" de recupero, o si solo cuenta lo que llega a los socios. Mientras tanto, `RegistroRoi.creditoAcumulado` manual sigue vigente y esta respuesta es complementaria.
- Nota: el ROI **por socio** no se pide, porque no existe inversión por socio; `RegistrarRoiDto` acepta `socioId` pero no se carga.

**Alimenta:** KPI "Inversión Recuperada", barra de progreso, "Pendiente de recuperar", tabla ROI Histórico (Cap. Recuperado, Recupero Acumulado, % Avance), tramo "real" de la curva, el timeline (Inicio / Hoy / años transcurridos) y el selector USD/ARS (reemplaza `TIPO_CAMBIO_ARS = 1200`).

---

## S6. Energía importada del medidor principal (prioridad 3)

Hoy `registros_historico.energia_activa_importada` está persistida pero **no se expone agregada**: `medidor-principal/energia` y los consolidados traen solo exportada.

Pedido: agregar `energiaImportadaKwh` a `EnergiaMedidorDto` (`GET /medidor-principal/energia`) y `energiaActivaImportada` (suma/máximo/promedio) a `ConsolidadoTarifaDto`/`ConsolidadoTotalDto`. Cambio aditivo, sin romper clientes.

**Requiere confirmación de producto antes de usarlo en pantalla:** si "Energía adquirida" (tabla de GDD) equivale a energía importada por el medidor principal (compra a la red). Con esa definición el backend ya podría devolver "adquirida", "total" y los dos porcentajes.

---

## S7. Exportación (prioridad 3)

`GET /parques/{parqueId}/ingresos/export?desde&hasta&alcance&socioId&formato=csv`

- Stream CSV con una fila por registro de 15 min: `fechaHora`, `medidorId`, `energiaKwh`, `franja`, `valorInyeccion`, `unidad`, `montoArs` (sin redondear), `esquemaId`, `esquemaDestinoTipo`.
- Límite de rango: 366 días. Mismos permisos y alcance que `/ingresos`.
- Reemplaza el "Descargar todo" mock. Evita que el front pagine cientos de requests.

---

## S8. Higiene de contrato (prioridad 1, es barato)

1. Documentar con schema el response de `GET /parques/{id}/energia` (hoy "Datos de energía del parque", sin tipo), `/roi` y `/mantenimiento`.
2. Aclarar en el swagger que `ingresoMes`/`ingresoDia` de `/energia` provienen de snapshots Huawei/FusionSolar y **no** de los medidores DiMS ni del esquema tarifario, para que nadie los sume con `/ingresos`.
3. Regenerar `docs/openapi.json` del front desde `/docs-json` (hoy no tiene ingresos, medidores, esquemas, costos, tipos de cambio, etc.).
4. Hacer `GET /parques/{id}/medidores` accesible a `GDD_OWNER` si algún flujo del front lo requiere (con S1 `alcance` ya no hace falta conocer el `medidorId` del principal).

---

## Resumen: pantalla → endpoint

| Pantalla / valor | Endpoint |
|---|---|
| Performance GDD/GDCV: KPI ahorro/ingreso del mes + delta | S2 |
| Performance: tarifa actual + delta | S2 |
| Performance GDCV: promedio por usuario | S2 |
| Performance: "X kWh desde el Inicio" | S2 (`acumulado.energiaKwh`) |
| Tabla Historial de Generación: "Ahorro generado" | S1 `agrupar=mes` |
| Tabla Historial de Generación: adquirida / total / % | S6 (sujeto a definición) |
| Gráfico de ingresos por día / 1D | S1 `agrupar=dia` / `intervalo` |
| Tabla de socios (potencia, energía, ahorro, totales) | S3 |
| Detalle de socio y multi-medidor | S3 + S4 |
| Portal socio: total del mes, ahorro por inyección, serie "inyectada" | S1/S2 con rol SOCIO |
| ROI: inversión recuperada, pendiente, %, timeline | S5 |
| ROI: tabla Histórico y tramo real de la curva | S5 |
| ROI: selector USD/ARS | S5 (`tipoCambio`) |
| Descargas CSV | S7 |

## Fuera de alcance de estas solicitudes (requieren definición de producto o datos que no existen)

Autoconsumo virtual, energía asignada y neteada, impuestos, ahorro por desplazamiento de compra a EPEC (GDD), proyecciones (ahorro estimado, payback, escenarios, TIR proyectada), ROI por socio, emisiones de CO₂, estado "Aplicado" de compensaciones y datos de ficha de socio (alta, responsable, teléfono).

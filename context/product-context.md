# product-context.md
# HINS — Contexto del Producto

---

## 1. Descripción del Producto

HINS es una plataforma web de monitoreo y gestión para parques fotovoltaicos.
Desarrollada por HINS (instalador y administrador de los proyectos).

**Naturaleza del sistema:** Visibilidad pura. Muestra lo que sucede, no ejecuta acciones sobre la red eléctrica.

**Propuesta de valor:** Permite visualizar la generación de energía, la asignación por participación y el impacto económico de cada parque, diferenciando entre tres modelos de negocio: GDD, GDC y GDCV.

**Tipo de producto:** B2B de cara al cliente final. HINS lo ofrece como parte de su propuesta de valor a los proyectos que desarrolla. Cada usuario accede con credenciales propias y ve únicamente la información correspondiente a su rol y proyecto.

**Marco normativo:** Res. 01/2021 · Res. 15/2024 · Res. SPE 09/2026 (BO 08/04/2026)

---

## 2. Modelos de Negocio

### Principio común a los tres modelos
Los modelos GDD, GDC y GDCV comparten el mismo flujo físico en el origen:
**toda la energía generada por el parque se inyecta a un único punto de red.**
Lo que los diferencia es a qué red se inyecta y cómo se valoriza y distribuye el beneficio.

> El modelo GD Autoconsumo existe normativamente pero está **fuera del scope** del producto actual.

---

### Modelo GDD — Generación Distribuida del Distribuidor
**Ejemplo real:** Parque General Roca

- Titularidad: Cooperativa Eléctrica (distribuidora concesionaria).
- El parque inyecta **100% a la red propia de la Cooperativa**, no a EPEC directamente.
- **Objetivo:** reducir la dependencia de compra a EPEC. Antes compraba 100 a EPEC, ahora genera 30 propios y compra solo 70.
- El beneficio es institucional: la Cooperativa reduce su costo de compra de energía.
- El ahorro se mide como reducción de compra a EPEC (desplazamiento tarifario).
- Los asociados de la Cooperativa reciben el beneficio reflejado en su factura, pero **no son usuarios de la plataforma**.
- Medición: punto único en el distribuidor.
- Normativa: Res. 15/2024 Art. 4°

**KPI principal:** Energía Generada + Ahorro por desplazamiento de compra a EPEC.

---

### Modelo GDC — Generación Distribuida Comunitaria

- Formado por Socios (cesionarios) con cuotaparte porcentual.
- **Toda la energía se inyecta a la red** en un punto único distinto al consumo.
- No hay autoconsumo.
- La energía generada se asocia directamente al consumo de los participantes (relación física concreta).
- El neteo opera dentro del grupo definido de usuarios.
- EPEC cruza generación asignada vs. consumo de cada socio → crédito en factura.
- Lógica: generación → comunidad participante → neteo contra su consumo → compensación.
- Medición: medidor bidireccional + medidor de generación en punto de inyección.
- Normativa: Res. 01/2021, Res. 09/2024 SPE

> **Nota:** Es posible que este modelo migre a GDCV normativamente. Pendiente de confirmación.

**KPI principal:** Energía Inyectada + Crédito Generado distribuido entre socios.

---

### Modelo GDCV — Generación Distribuida Comunitaria Virtual
**Ejemplo real:** Parque Río Cuarto

- Formado por Socios con cuotaparte porcentual.
- **Toda la energía se inyecta a la red** en un punto único distinto al consumo.
- No hay autoconsumo físico directo.
- La asignación de energía es **virtual y administrativa**: cada socio recibe virtualmente una porción según su participación, desacoplada de una relación física directa.
- El neteo se aplica sobre esa asignación virtual: lo que el socio consume en el mismo momento que el parque genera se "netea" directamente. Lo no neteado se vende a la red y vuelve como crédito.
- Medición: medidor inteligente con lectura en tiempo real cada 15 minutos por banda horaria.
- El reconocimiento económico varía según el tipo de socio:
  - **Con cargo de potencia contratada:** balance neto directo a tarifa de distribución (tarifa de energía antes de impuestos).
  - **Sin cargo de potencia:** compensación por costos evitados (Pass Through ERSeP).
- Normativa: Res. 15/2024, Res. SPE 09/2026

**KPI principal:** Energía Inyectada + Asignación virtual por participación + Neteo + Crédito o balance neto en factura.

---

## 3. Concepto de Neteo

El neteo es el mecanismo central de los modelos GDC y GDCV.

**Definición:** proceso de compensación entre la energía generada/asignada y la energía consumida por el socio.

**Operativamente:**
1. Se toma la energía producida por el parque.
2. Se asigna a cada socio según su % de participación.
3. Se compara esa asignación contra el consumo real del socio.
4. Se obtiene un saldo: positivo (excedente a favor) o negativo (consumió más de lo generado).

**Diferencia GDC vs GDCV en el neteo:**
- **GDC:** neteo sobre consumo real de participantes con vínculo físico directo.
- **GDCV:** neteo sobre energía previamente distribuida de forma virtual, sin vínculo físico necesario.

---

## 4. Taxonomía de Términos

| Término correcto | Evitar | Contexto |
|---|---|---|
| Energía Inyectada | Energía generada, energía volcada | GDC / GDCV — lo que va a la red |
| Energía Generada | Energía producida | GDD — lo que produce el parque |
| Crédito Generado | Descuento, ahorro, compensación | GDC / GDCV — valor económico de lo inyectado |
| Ahorro | Crédito, retorno | GDD — reducción de compra a EPEC |
| Consumo Eléctrico | Consumo del medidor, gasto | Todos — lo que consume el punto del socio |
| Saldo del período | Total compensado, neto | GDC / GDCV — resultado del neteo |
| Participación | Cuota, porcentaje, parte | Todos — % del socio en el parque |
| Medidor N° | Número de medidor | Todos — identificador del punto de consumo |
| Socios / Cesionarios | Usuarios, clientes, cuotapartistas | GDC / GDCV — participantes del parque |
| AGC | Admin, gestor | GDC / GDCV — Administrador del Generador Comunitario |
| Mantenimiento / Mantención | O&M, service, reparación | Módulo administrativo — registro de tareas y costos del parque |
| Historial de Mantenimiento | Log de servicios | Vista por período — cantidad de mantenciones y costos asociados |

---

## 5. Módulo Mantenimiento (transversal)

### Descripción funcional

Capacidad de **visibilidad y registro** de las actividades de mantenimiento de un parque fotovoltaico: tareas realizadas, periodicidad por mes y costos asociados.

**Objetivo de negocio:** Permitir a los administradores del parque **llevar y consultar el historial de la mantención** de esa instalación — qué se hizo, cuántas intervenciones hubo por período y cuánto costó — sin ejecutar operaciones sobre la red ni reemplazar un CMMS externo.

**Naturaleza en HINS:** Módulo de **solo lectura + registro documental** (prototipo: visualización con mock data; flujo de alta “Nueva mantención” pendiente). No implica control operativo de equipos ni despacho de cuadrillas.

### Alcance transversal (modelo de parque)

El módulo **Mantenimiento** aplica a los tres modelos de negocio:

| Modelo | Disponibilidad del módulo |
|---|---|
| **GDD** | ✅ Sí — Dueño del parque (sidebar administrativo) |
| **GDC** | ✅ Sí — AGC (sidebar administrativo) |
| **GDCV** | ✅ Sí — AGC (sidebar administrativo); prototipo construido en `/gdcv/mantenimiento` |

La **lógica de negocio energética** (generación, neteo, crédito, ROI) es distinta por modelo; el **registro de mantenimiento** es común a todos los parques porque es inherente a la instalación física, no al modelo tarifario.

### Quién tiene acceso

| Rol | Acceso a Mantenimiento |
|---|---|
| **HINS Admin Global** | ✅ Ver y gestionar (transversal a cartera; entra vía detalle de cada parque) |
| **Dueño del Parque GDD** | ✅ Ver y gestionar mantenimiento de su parque |
| **AGC (GDC / GDCV)** | ✅ Ver y gestionar mantenimiento de su parque |

### Quién NO tiene acceso

| Rol | Restricción |
|---|---|
| **Socio / Cesionario** | ❌ Sin acceso bajo ningún concepto |
| **Cualquier usuario read-only cliente final** | ❌ Sin acceso |

El socio **no debe visualizar** — ni por ruta directa, ni por sidebar, ni por enlaces compartidos, ni por métricas embebidas en otras vistas:

- Sección o ítem de navegación “Mantenimiento”
- Historial de mantenimiento, tablas o KPIs de mantención
- Acciones “Nueva mantención” o detalle administrativo de tareas
- Costos operativos del parque atribuibles a mantenimiento

### Vista del Socio (alcance exclusivo)

El flow del Socio permanece **exclusivamente** orientado a:

- Performance y generación/asignación en su contexto
- Neteo, crédito y impacto en factura
- ROI y seguimiento financiero personal
- Historial de compensaciones (propias)

**Mantenimiento no forma parte del flow del Socio** (`flows/GDCV-socio/`).

### Navegación (reglas)

- **Con sidebar administrativo** (HINS Admin, Dueño GDD, AGC): ítem **Mantenimiento** en sidebar del parque, junto a Performance y ROI (o equivalentes).
- **Sin sidebar** (Socio GDCV): **no** existe ítem Mantenimiento; solo tabs internos de su espacio personal.
- Rutas de referencia (prototipo GDCV AGC): `/gdcv/mantenimiento` — **no** expuesta en `/gdcv/socio/*`.

### Contenido de referencia (prototipo GDCV)

- Tabla **Historial de Mantenimiento**: Período | Cantidad de Mantenciones | Costos Asociados
- Período en curso (ej. Abril 2026) identificado con badge **En Curso**
- Botón **Nuevo** (placeholder — flujo de alta pendiente)
- Click en fila → Sheet de detalle (contenido pendiente)

---

## 6. Arquitectura de Datos (Jerarquía)

```
HINS (Admin Global — superadministrador)
└── Proyectos
└── Parques
├── Tipo: GDD
│   └── Dueño (Cooperativa Eléctrica)
│       └── Rol: Admin + Dueño del parque GDD
├── Tipo: GDC
│   ├── AGC (Administrador Generador Comunitario)
│   └── Socios / Cesionarios
└── Tipo: GDCV
├── AGC (Administrador Generador Comunitario)
└── Socios / Cesionarios
├── Con cargo de potencia → balance neto directo
└── Sin cargo de potencia → Pass Through ERSeP
```

---
---

## 7. Usuarios y Permisos (RBAC)

### Matriz resumida — Módulo Mantenimiento

| Rol | Mantenimiento |
|---|---|
| HINS Admin Global | ✅ |
| Dueño GDD | ✅ |
| AGC GDC / GDCV | ✅ |
| Socio / Cesionario | ❌ **Prohibido** |

---

### HINS — Admin Global
**Descripción:** Dueño de la solución. Instala y gestiona todos los proyectos.
**Permisos:** Ver y editar todos los proyectos y niveles de usuario.
**Problema que resuelve:** No tiene visibilidad centralizada del estado de todos sus parques en cartera.
**Acción principal:** Ver el estado de performance de todos sus proyectos desde una vista de cartera y entrar al detalle de cualquier parque o usuario.
**Pregunta clave:** ¿Cómo está rindiendo cada parque de la cartera?

**Objetivos:**
- Acceder a todos los proyectos en cartera.
- Monitorear el desempeño general de cada parque.
- Consultar el historial de mantenimiento de cualquier parque al entrar a su dashboard administrativo.
- [WIP] Crear, configurar y editar proyectos y sus características.
- [WIP] Acceder a la vista de cualquier usuario o rol dentro de los proyectos.

**Mantenimiento:** ✅ Acceso completo al módulo en cada parque (GDD, GDC, GDCV).

---

### Dueño del Parque GDD
**Descripción:** La Cooperativa Eléctrica propietaria del parque GDD.
**Permisos:** Ver y editar solo su parque.
**Rol técnico:** Admin + Usuario GDD.
**Problema que resuelve:** No puede medir con precisión cuánto le está ahorrando el parque en reducción de compra a EPEC, ni proyectar cuándo recupera la inversión.
**Acción principal:** Ver cuánta energía generó el parque y cuánto ahorro representa en desplazamiento de compra a EPEC.
**Pregunta clave:** ¿Cuánto me está ahorrando el parque y cuándo voy a recuperar lo que invertí?

**Objetivos:**
- Ver cuánta energía generó el parque en el período.
- Ver cuánto se desplazó de compra a EPEC (ahorro real).
- Ver la cobertura del parque sobre el consumo total de la Cooperativa (%).
- Ver un estimado de cuándo recupera la inversión (ROI / Payback).
- Cargar y/o modificar su cuadro tarifario.
- Ver el historial de generación a lo largo del tiempo.
- Consultar y registrar (futuro) el historial de mantenimiento del parque.

**Mantenimiento:** ✅ Acceso vía sidebar del parque (ruta prototipo futura: `/gdd/mantenimiento`).

---

### AGC — Administrador Generador Comunitario
**Descripción:** Administrador del parque comunitario (GDC o GDCV).
**Permisos:** Ver y editar solo su parque y sus socios.
**Rol técnico:** Admin GDC / GDCV.
**Problema que resuelve:** No tiene herramienta para gestionar el padrón de socios, ver su estado individual y verificar que la distribución de créditos funcione correctamente.
**Acción principal:** Ver la energía total inyectada por el parque y el estado de crédito de cada socio en el período activo.
**Pregunta clave:** ¿El parque está generando lo esperado y están llegando bien las compensaciones a cada socio?

**Objetivos (en scope):**
- Ver la energía total inyectada por el parque en el período.
- Ver el crédito total generado para el período y el promedio por socio.
- Ver la performance del parque (real vs. esperado).
- Identificar los socios del parque, su participación y tipo (con/sin cargo de potencia).
- Acceder al detalle individual de cualquier socio.
- Ver el ROI del parque completo.
- Consultar el historial de mantenimiento del parque (tareas y costos por período).

**Mantenimiento:** ✅ Acceso vía sidebar — ruta prototipo: `/gdcv/mantenimiento` (GDCV); equivalente en GDC cuando exista el flow.

**Fuera de scope (actual):**
- Cargar o modificar socios y % de participación.
- Configurar tipo de socio (con/sin cargo de potencia).
- Ejecución operativa de mantenimiento en campo (despacho, OT, integración SCADA).

---

### Socio / Cesionario
**Descripción:** Participante del parque comunitario GDC o GDCV con cuotaparte porcentual. Solo ve su vista personal.
**Permisos:** Ver solo su vista.
**Rol técnico:** Usuario GDC / GDCV.
**Problema que resuelve:** No puede ver qué parte de la generación le corresponde, cómo se netea con su consumo, ni cómo evoluciona su retorno de inversión.
**Acción principal:** Ver el crédito generado por su participación, el resultado del neteo contra su consumo y el saldo en su factura.
**Pregunta clave:** ¿Me está rindiendo la inversión? ¿Qué impacto real está teniendo en mi factura?

**Objetivos:**
- Ver cuánta energía inyectó el parque en total en el período.
- Ver cuánta energía le fue asignada según su participación (kWh).
- Ver el Crédito Generado correspondiente a su participación ($).
- Ver su Consumo Eléctrico del período (Medidor N°).
- Ver el Saldo del período (resultado del neteo: crédito vs. consumo).
- Ver el detalle histórico de compensaciones por período.
- Ver su ROI: crédito acumulado vs. inversión inicial, Payback estimado, TIR.

**Mantenimiento:** ❌ **Sin acceso.** No aparece en navegación, rutas ni datos visibles. Cualquier implementación que exponga mantenimiento al socio es un **bug de permisos**.

**Restricciones explícitas:**
- ❌ Sin ítem “Mantenimiento” en UI
- ❌ Sin rutas `/gdcv/mantenimiento` ni equivalentes bajo `/gdcv/socio`
- ❌ Sin métricas, tablas ni acciones de mantenimiento en sus vistas

---

## 8. Actores Externos (no usuarios de la plataforma)

### EPEC
- Empresa de Energía Eléctrica Estatal de Córdoba.
- Recibe la energía inyectada por los parques GDC y GDCV.
- Registra consumo vs. generación asignada por socio.
- Aplica crédito o balance neto en la factura individual de cada socio.
- Es fuente de datos externa. No tiene acceso a la plataforma.

### Asociados de la Cooperativa GDD
- Clientes finales de la Cooperativa que reciben el beneficio del GDD en su factura.
- **No son usuarios de la plataforma.**

---

## 9. Reglas de Negocio

- Un parque pertenece a un único modelo (GDD, GDC o GDCV). No son mixtos.
- Los tres modelos inyectan 100% de la energía generada a la red. GD Autoconsumo (fuera de scope) es el único que no sigue este patrón.
- En GDD no hay socios, solo un dueño que también administra. El beneficio es institucional.
- En GDC y GDCV el AGC administra. Puede o no tener cuotaparte como socio.
- Los socios solo ven su propia información, nunca la de otros socios.
- HINS tiene acceso transversal a todo el sistema como superadministrador.
- El sistema es de visibilidad: no ejecuta acciones sobre la red eléctrica.
- En GDCV, el reconocimiento económico varía según si el socio tiene cargo de potencia contratada o no.
- El neteo en GDCV opera sobre asignación virtual previa; en GDC sobre vínculo físico directo.
- GDC puede migrar normativamente a GDCV. Pendiente de confirmación con el cliente.

### Reglas — Módulo Mantenimiento

- El módulo **Mantenimiento** es **transversal a GDD, GDC y GDCV** pero **restringido por rol** — no es transversal a todos los usuarios.
- Solo roles **administrativos / gestión del parque** (HINS Admin Global, Dueño GDD, AGC) pueden ver el módulo.
- El **Socio / Cesionario** y cualquier perfil **read-only cliente final** tienen **ocultamiento total**: sin navegación, sin rutas, sin datos de mantenimiento en sus vistas.
- Mantenimiento forma parte de los **dashboards administrativos con sidebar**; **no** forma parte del flow del Socio (sin sidebar, solo tabs de performance/finanzas personales).
- Los datos de mantenimiento son **del parque**, no del socio: no se distribuyen por participación ni cuotaparte.
- HINS es visibilidad de registros: no ejecuta mantenimiento en la red eléctrica ni reemplaza sistemas de tickets/OT externos.
- Consistencia cross-model: misma semántica de columnas (Período, Cantidad de Mantenciones, Costos Asociados) en todos los parques que expongan el módulo.

---

## 10. Estructura de Flows

Cada flow tiene su propio archivo `flow.md` dentro de su carpeta,
junto con las referencias visuales (.png) correspondientes.

```
flows/
├── GDD/
│   ├── flow.md              ← flow Dueño GDD (GDD_01, GDD_02)
│   ├── GDD_01.png           ← Performance del Parque
│   └── GDD_02.png           ← Retorno de Inversión
├── main/
│   ├── flow.md              ← flow HINS Admin (Main_00)
│   └── Dashboard_root_00.png
├── GDC/                     ← pendiente
│   ├── flow.md
│   └── [wireframes]
├── GDCV/                    ← pendiente
│   ├── flow.md
│   └── [wireframes]
└── socio/                   ← pendiente
├── flow.md
└── [wireframes]
```

**Reglas:**
- Un `flow.md` por actor/flujo — no consolidar en un solo archivo.
- Las referencias visuales (.png) viven en la misma carpeta que su `flow.md`.
- Al referenciar en prompts de Cursor usar: `@flows/GDD/flow.md` y `@flows/GDD/GDD_01.png`.
- El `flow.md` de cada flow es la fuente de verdad. En caso de conflicto con otros `.md`, el `flow.md` correspondiente manda.

**Estado actual de flows:**

| Flow | Actor | Pantallas | Estado |
|---|---|---|---|
| GDD | Dueño del Parque GDD | GDD_01, GDD_02 | ✅ Construido |
| main | HINS Admin Global | Main_00 | ⏳ Pendiente |
| GDC | AGC + Socios GDC | — | ⏳ Pendiente |
| GDCV-agc | AGC GDCV | admin_01, admin_03, **mantenimiento** | ✅ Performance + ROI + Mantenimiento |
| GDCV-socio | Socio GDCV | socio_00, socio_01, socio_02 | ✅ Construido — **sin** Mantenimiento |

---

## 11. Scope del Prototipo

**Estado actual:**
- ✅ Flow GDD completo (GDD_01 Performance + GDD_02 ROI)
- ✅ Shell con sidebar, header sticky, navegación entre vistas
- ✅ Design system documentado en `/context/design-system.md`
- ✅ Componentes documentados en `/context/components.md`
- ✅ Transiciones entre vistas con Framer Motion
- ✅ Módulo Mantenimiento (GDCV AGC) — `/gdcv/mantenimiento` con historial mock
- ⏳ Flow main — HINS Admin vista de cartera (próximo)
- ⏳ Flow GDC — pendiente de wireframes
- ⏳ Flow GDCV — pendiente de wireframes
- ⏳ Flow Socio — pendiente de wireframes

**Incluido en scope:**
- Navegación completa entre todas las vistas documentadas en wireframes.
- UI final en alta basada en `design-system.md` y `components.md`.
- Mock data representativa del dominio para todos los flows.
- Autenticación mockeada (sin backend real).

**Incluido en scope (Mantenimiento):**
- Vista administrativa de historial por período (prototipo GDCV).
- Restricción documentada: Socio sin acceso al módulo.

**Fuera de scope:**
- Gestión de socios (agregar/quitar) por parte del AGC.
- Configuración de tipo de socio (con/sin cargo de potencia).
- Modelo GD Autoconsumo.
- **Ejecución operativa** de mantenimiento en campo (OT, cuadrillas, integración con proveedores).
- Flujo completo “Nueva mantención” (formulario y persistencia).
- Autenticación real con backend.
- Notificaciones en tiempo real.

> **Nota:** “Operación y mantenimiento del parque” como **ejecución en campo** sigue fuera de scope. El **registro y visualización** de mantenimiento para roles administrativos **sí** está en scope del producto.

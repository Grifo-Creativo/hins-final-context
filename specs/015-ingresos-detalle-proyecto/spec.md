# Feature Specification: Ingresos por inyección en el detalle de proyecto

**Feature Branch**: `015-ingresos-detalle-proyecto`

**Created**: 2026-11-16

**Status**: Draft

**Input**: User description: "Reemplazar los mocks de ingresos/ahorro del detalle de proyecto por la API de ingresos del backend (KPIs de Performance GDD y GDCV, columna 'Ahorro generado' del Historial de Generación, tabla y detalle de socios, KPIs y tabla Histórico de ROI, y total mensual del portal del socio), dejando fuera lo que no tiene dato real (autoconsumo, neteo, proyecciones, TIR proyectada, ROI por socio, CO₂, ficha de socio, energía adquirida y exportación CSV)."

## Contexto

El backend ahora calcula **ingresos de energía**: por cada registro de 15 minutos de un medidor, la energía exportada se valoriza con el valor de inyección del esquema tarifario vigente (del socio o, si no tiene, del parque). Además publica agregados ya calculados (por mes, por socio, KPIs del mes, ROI realizado en USD), que evitan sumar miles de registros en la interfaz.

Hoy las pantallas del detalle de proyecto muestran importes de "ahorro" **inventados** (mocks) o en cero: KPIs de Performance, historial de generación, tabla de socios, ROI y portal del socio. Esta feature reemplaza esos valores por datos reales de ingresos, usando el nombre correcto: **Ingresos por inyección**. El valor representa lo que se obtiene por la energía inyectada a la red; no incluye autoconsumo ni desplazamiento de compra a la distribuidora, por lo que no debe llamarse "ahorro".

Dos fuentes de energía conviven en el producto: el **medidor principal del parque** (alcance *Parque*) y los **medidores de cada socio** (alcance *Socios*). Cada una se valoriza con su propio esquema; **nunca se suman entre sí**, porque duplicaría la energía.

## Clarifications

### Session 2026-11-16

- Q: ¿Cuál es la fuente de la cifra principal de "Inversión Recuperada" en ROI? → A: Los ingresos reales convertidos a USD reemplazan al crédito acumulado manual como cifra principal; el crédito manual deja de mostrarse.
- Q: ¿Qué período muestran las tarjetas KPI y la tabla de socios? → A: Siempre el mes en curso, sin selector de período.
- Q: ¿Cómo se refrescan los datos de ingresos? → A: Se leen al abrir/recargar la pantalla, con la hora de última actualización visible; sin refresco automático.
- Q: ¿Qué roles ven la tabla/detalle de socios? → A: Solo HINS Admin y AGC; el dueño GDD no aplica y el socio ve únicamente su portal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver los ingresos reales del mes en Performance (Priority: P1)

El dueño del parque (GDD), el administrador comunitario (AGC) o HINS Admin abren Performance de un proyecto y ven en las tarjetas KPI los ingresos por inyección del mes en curso con su variación contra el mes anterior, la tarifa de inyección vigente con su variación, la energía acumulada desde el inicio y, en GDCV, el promedio de ingreso por socio.

**Why this priority**: Es la primera pantalla que se abre y hoy muestra cifras falsas ("Ahorro acumulado en Abril $66.400", tarifa $80). Es el mayor riesgo de decisiones erróneas y entrega valor por sí sola.

**Independent Test**: Abrir Performance de un parque GDD y de uno GDCV con ingresos cargados; verificar que importes, variaciones, tarifa, energía acumulada y promedio por socio coinciden con los datos del backend y que ya no aparece ningún valor fijo de ejemplo.

**Acceptance Scenarios**:

1. **Given** un parque con ingresos en el mes actual y el anterior, **When** el usuario abre Performance, **Then** ve el total de ingresos del mes en pesos, la variación porcentual contra el mes anterior con indicación de si sube o baja, y el rótulo "Ingresos por inyección".
2. **Given** un parque cuyo mes anterior no tiene ingresos, **When** se muestra la variación, **Then** no se muestra un porcentaje (se muestra un guion o texto neutro), nunca "∞" ni "0%".
3. **Given** un parque con esquema tarifario vigente, **When** el usuario ve la tarjeta de tarifa, **Then** ve el valor de inyección vigente ahora, su unidad, la franja en la que está y su variación porcentual.
4. **Given** un parque sin esquema vigente o sin versión de catálogo, **When** el usuario ve la tarjeta de tarifa, **Then** ve un estado "Sin tarifa vigente" en lugar de un valor, y el resto de la pantalla sigue funcionando.
5. **Given** un parque GDCV con socios, **When** se muestra "Promedio por usuario", **Then** el valor es el ingreso total de los socios del mes dividido por la cantidad de socios con ingresos en ese mes, y el rótulo aclara esa base.
6. **Given** un parque GDD, **When** se abre Performance, **Then** no se muestra "Promedio por usuario" (no aplica).
7. **Given** que el texto comparativo de la tarjeta de generación decía "X kWh desde el Inicio", **When** hay energía acumulada real, **Then** el texto usa ese valor real.

---

### User Story 2 - Ver el ingreso de cada mes en el Historial de Generación (Priority: P1)

El usuario ve en la tabla "Historial de Generación" la columna de ingresos por inyección de cada período con valores reales, en lugar de ceros.

**Why this priority**: Es la misma data que la historia 1 pero por período; completa la pantalla de Performance y tiene el menor esfuerzo. Los meses sin ingresos deben quedar visibles, no omitidos.

**Independent Test**: Abrir un parque con varios meses de historia y comparar cada fila con el total mensual de ingresos del backend.

**Acceptance Scenarios**:

1. **Given** un parque con ingresos en varios meses, **When** el usuario ve el historial, **Then** cada fila muestra el ingreso de ese mes en pesos.
2. **Given** un mes sin ingresos entre dos meses con ingresos, **When** se muestra el historial, **Then** el mes aparece con importe cero (no se omite la fila ni se muestra un guion engañoso).
3. **Given** que las demás columnas del historial (energía adquirida, otras fuentes, total, porcentajes) no tienen dato real, **When** se muestran, **Then** se presentan con guion y no con ceros, para no sugerir que el valor real es cero.

---

### User Story 3 - Ver ingresos, energía y potencia por socio (Priority: P2)

El AGC (o HINS Admin) abre la tabla de socios de un parque GDCV y ve, por cada socio, su potencia asociada, la energía del período, el ingreso por inyección y los totales al pie. Al abrir el detalle de un socio ve esos mismos datos desglosados por cada uno de sus medidores.

**Why this priority**: Responde "cuánto le corresponde a cada socio" y habilita socios con más de un medidor, hoy imposible de mostrar. Depende de datos de socios y medidores, por eso va después de Performance.

**Independent Test**: Abrir un parque con un socio de un medidor y otro de dos medidores; verificar potencia, energía, ingreso y desglose; verificar que los totales coinciden con la suma de las filas.

**Acceptance Scenarios**:

1. **Given** un parque con socios, **When** el usuario abre la tabla de socios, **Then** ve para cada uno su participación, potencia asociada (participación sobre la potencia total del parque), energía e ingreso del período.
2. **Given** un socio con dos medidores, **When** el usuario abre su detalle, **Then** ve la energía y el ingreso de cada medidor y que la suma coincide con la fila del socio.
3. **Given** un socio sin medidor registrado, **When** se muestra en la tabla, **Then** aparece con una indicación "Sin medidor" y valores en cero/guion, sin ocultarlo.
4. **Given** un socio con medidor pero sin ingresos en el período, **When** se muestra, **Then** aparece con la indicación "Sin ingresos en el período".
5. **Given** socios con esquema propio y socios que usan el del parque, **When** el usuario ve el detalle, **Then** se indica cuál rige para ese socio.
6. **Given** que las participaciones de los socios no suman 100%, **When** se muestran los totales, **Then** el total de participación refleja la suma real, lo que permite detectar la inconsistencia.
7. **Given** campos del socio sin dato real (autoconsumo, energía asignada/neteada, ahorro en emisiones, fecha de alta, responsable, teléfono), **When** se muestran, **Then** figuran como no disponibles y no con valores de ejemplo.

---

### User Story 4 - Ver el recupero de la inversión (ROI) con datos reales (Priority: P2)

El dueño del parque, el AGC o HINS Admin abren ROI y ven la inversión recuperada, el pendiente, el porcentaje de avance, el tiempo transcurrido desde la puesta en marcha, la tabla Histórico y el tramo real de la curva, calculados con los ingresos reales convertidos a USD con el tipo de cambio real de cada mes. El selector de moneda usa el tipo de cambio real en lugar de un valor fijo.

**Why this priority**: Es la pantalla de decisión de inversión, pero depende de una definición de producto pendiente (ver Supuestos) y de que existan tipos de cambio cargados; por eso viene después de lo operativo.

**Independent Test**: Abrir ROI de un parque con registro de inversión y tipos de cambio mensuales; verificar que el acumulado en USD es la suma de los ingresos mensuales convertidos y que el pendiente y el porcentaje son consistentes con la inversión meta.

**Acceptance Scenarios**:

1. **Given** un parque con inversión meta registrada, ingresos y tipos de cambio reales, **When** el usuario abre ROI, **Then** ve inversión recuperada, pendiente, porcentaje, total invertido y el tiempo transcurrido desde la puesta en marcha (inicio, hoy, años).
2. **Given** meses con ingresos pero sin tipo de cambio real, **When** se muestra el ROI, **Then** esos meses se identifican como "sin tipo de cambio", no se estima un valor, y se informa que el acumulado está incompleto.
3. **Given** un parque sin inversión meta registrada, **When** se abre ROI, **Then** se muestra el acumulado recuperado pero no el pendiente ni el porcentaje, con un mensaje claro de que falta registrar la inversión.
4. **Given** la tabla Histórico, **When** se muestra, **Then** cada mes tiene capital recuperado del mes, recupero acumulado y porcentaje de avance reales.
5. **Given** la curva de recuperación, **When** se muestra, **Then** el tramo histórico usa el acumulado real; el tramo proyectado (escenarios base/favorable/riesgo), el payback, el plazo y la TIR proyectada siguen sin dato real y se presentan marcados como estimativos o no disponibles.
6. **Given** el selector USD/ARS, **When** el usuario cambia de moneda, **Then** las cifras se convierten con el tipo de cambio real aplicado por mes (no con un valor fijo único).

---

### User Story 5 - El socio ve sus ingresos en su portal (Priority: P3)

El socio entra a su portal y ve el total de ingresos por inyección del mes de **su** socio, la serie mensual de ingresos por inyección y, en la tabla de compensaciones, la columna de ingreso por inyección con datos reales.

**Why this priority**: Beneficia a un solo tipo de usuario externo y su vista hoy es íntegramente demostrativa; el resto del portal (autoconsumo, neteo) sigue pendiente, por lo que el valor es parcial.

**Independent Test**: Ingresar como socio con medidor e ingresos; verificar que solo ve datos propios y que el total del mes coincide con la suma de sus ingresos.

**Acceptance Scenarios**:

1. **Given** un socio con ingresos en el mes, **When** abre su portal, **Then** ve el total de ingresos por inyección de su socio, no el del parque.
2. **Given** un socio, **When** intenta ver datos del parque (alcance Parque) u otro socio, **Then** no los ve ni se le ofrece verlos.
3. **Given** la tabla de compensaciones, **When** se muestra, **Then** la columna de ingreso por inyección usa valores reales, y las columnas de autoconsumo y total (que dependen de neteo) se muestran como no disponibles.
4. **Given** pocos socios en el parque, **When** el socio vería el promedio por socio, **Then** ese dato no se le muestra, para no revelar ingresos de otros socios.

---

### Edge Cases

- **Datos incompletos**: si hay registros de energía que no pudieron valorizarse (sin esquema tarifario vigente o sin catálogo), el importe mostrado es parcial. Toda vista con importes muestra un aviso visible de "datos incompletos" indicando la cantidad de registros afectados.
- **Último día en curso**: los ingresos de hoy pueden estar incompletos hasta la generación diaria; se informa la fecha/hora de la última actualización disponible.
- **Parque nuevo sin ingresos**: todas las tarjetas muestran estado "Sin ingresos todavía" en lugar de ceros o error.
- **Falla del servicio de ingresos**: la falla de una tarjeta o tabla no debe tumbar la pantalla; se muestra un estado de error con opción de reintentar solo en ese bloque, sin afectar las partes que cargan bien (mismo criterio que la energía hoy).
- **Doble conteo**: bajo ninguna circunstancia se suma el ingreso del medidor principal con el de los socios; cada importe indica de qué alcance proviene.
- **Valores nulos**: tarifa vigente nula, tipo de cambio faltante, inversión meta ausente, socio sin medidor y socio sin ingresos tienen cada uno un estado explícito y distinto.
- **Montos grandes**: los importes se muestran con separadores de miles locales y sin pérdida de precisión; los totales se suman sin redondeo intermedio (lo hace el backend).
- **Moneda**: los ingresos están siempre en pesos; la conversión a USD solo ocurre en ROI y solo con tipo de cambio real.
- **Permisos**: un usuario sin permisos sobre el parque o el socio recibe el mismo manejo de acceso denegado que el resto de la aplicación; la sesión vencida redirige a login.

## Requirements *(mandatory)*

### Functional Requirements

**Performance (GDD y GDCV)**

- **FR-001**: El sistema MUST mostrar en Performance el ingreso por inyección del mes en curso con datos reales, rotulado "Ingresos por inyección", reemplazando los valores fijos de "Ahorro".
- **FR-002**: El sistema MUST mostrar la variación porcentual del ingreso y de la energía contra el mes anterior, y MUST omitirla cuando el mes anterior no tiene valor de comparación.
- **FR-003**: El sistema MUST mostrar la tarifa de inyección vigente (valor, unidad, franja y variación porcentual) y MUST mostrar un estado "Sin tarifa vigente" cuando no exista.
- **FR-004**: El sistema MUST mostrar la energía acumulada desde el primer ingreso real en el texto comparativo de la tarjeta de generación, reemplazando el valor fijo.
- **FR-005**: El sistema MUST mostrar "Promedio por usuario" solo en parques GDCV, informado por el backend (ingreso total de socios dividido por socios con ingresos en el mes), con esa base aclarada en la interfaz; la interfaz no lo recalcula.
- **FR-006**: El sistema MUST mostrar en la columna de ingresos del Historial de Generación el ingreso real de cada mes, incluyendo los meses con ingreso cero, y MUST mostrar guion en las columnas sin dato real (adquirida, otras fuentes, total, porcentajes).

**Socios (GDCV)**

- **FR-007**: El sistema MUST mostrar por socio: participación, potencia asociada, energía, ingreso por inyección del período, y totales al pie, con datos reales.
- **FR-007b**: El sistema MUST restringir la tabla y el detalle de socios a HINS Admin y AGC; el dueño GDD no los ve y el socio accede solo a su portal.
- **FR-008**: El sistema MUST listar todos los socios del parque, incluidos los sin medidor y los sin ingresos, con estados diferenciados.
- **FR-009**: El sistema MUST mostrar, en el detalle del socio, el desglose de energía e ingreso por cada medidor cuando el socio tiene más de uno.
- **FR-010**: El sistema MUST indicar si el socio usa esquema tarifario propio o el del parque.
- **FR-011**: El sistema MUST mostrar los campos sin dato real del socio (autoconsumo, energía asignada/neteada, emisiones evitadas, fecha de alta, responsable, teléfono) como no disponibles y NO con valores de ejemplo.

**ROI (GDD y GDCV)**

- **FR-012**: El sistema MUST calcular y mostrar en ROI la inversión recuperada acumulada en USD a partir de los ingresos mensuales convertidos con el tipo de cambio real de cada mes, y MUST NOT mostrar el crédito acumulado cargado manualmente como cifra de recupero.
- **FR-013**: El sistema MUST mostrar el pendiente de recuperar y el porcentaje de avance solo cuando exista inversión meta registrada, y mostrar un mensaje claro cuando falte.
- **FR-014**: El sistema MUST identificar los meses sin tipo de cambio real, no estimar su valor y advertir que el acumulado está incompleto.
- **FR-015**: El sistema MUST mostrar el tiempo transcurrido desde la puesta en marcha (fecha de inicio, hoy, años) con datos reales.
- **FR-016**: El sistema MUST alimentar la tabla Histórico (capital recuperado del mes, acumulado, % de avance) y el tramo real de la curva con los datos reales.
- **FR-017**: El sistema MUST usar el tipo de cambio real devuelto por el servicio en el selector de moneda en lugar de un tipo de cambio fijo.
- **FR-018**: El sistema MUST seguir mostrando payback, plazo, TIR proyectada, tabla Proyectado y bandas de escenarios sin dato real, marcados como estimativos/no disponibles, sin presentarlos como cifras reales.

**Portal del socio**

- **FR-019**: El sistema MUST mostrar al socio el ingreso por inyección del mes y la serie mensual de **su propio socio**, sin acceso a datos del parque ni de otros socios.
- **FR-020**: El sistema MUST mostrar en la tabla de compensaciones del socio el ingreso por inyección real, y MUST mostrar autoconsumo, total y estado "Aplicado" como no disponibles.
- **FR-021**: El sistema MUST ocultar al socio el promedio por socio cuando el backend no lo informe por privacidad.

**Reglas transversales**

- **FR-022**: El sistema MUST consultar siempre con un alcance explícito (Parque o Socios) y MUST NOT sumar nunca importes de ambos alcances.
- **FR-023**: El sistema MUST mostrar un aviso de datos incompletos, con la cantidad de registros sin valorizar, en toda vista con importes cuando esa cantidad sea mayor que cero.
- **FR-024**: El sistema MUST aislar las fallas: un error al cargar ingresos solo afecta al bloque correspondiente, con opción de reintentar, y no a la pantalla completa.
- **FR-025**: El sistema MUST renombrar "Ahorro" a "Ingresos por inyección" donde el valor provenga de ingresos, y MUST NOT usar "Ahorro" para estos valores.
- **FR-026**: El sistema MUST mostrar estados explícitos y diferenciados para: sin tarifa vigente, sin tipo de cambio, sin inversión meta, socio sin medidor, socio sin ingresos, parque sin ingresos todavía.
- **FR-027**: El sistema MUST respetar los permisos existentes por rol (HINS Admin, dueño GDD, AGC, socio); cada usuario ve únicamente lo que su rol permite.
- **FR-028**: Los cálculos de variación, promedios, conversión y armado de series que se realicen en la interfaz MUST tener pruebas, y los importes se tratan sin pérdida de precisión.
- **FR-029**: El sistema MUST contar con un cliente tipado para los servicios de ingresos y ROI realizado, y el contrato publicado del backend usado como referencia MUST estar actualizado en la documentación del proyecto.

### Key Entities

- **Ingreso por inyección**: valor en pesos de la energía exportada por un medidor en un intervalo de 15 minutos, según el esquema tarifario vigente. Pertenece a un alcance (Parque o Socio).
- **Resumen de ingresos**: suma de ingresos y energía por período (intervalo, hora, día, mes o total), con cobertura (registros con energía, registros sin ingreso, última actualización).
- **KPIs de ingresos del mes**: ingreso y energía del mes, comparación con el mes anterior, acumulado histórico, tarifa de inyección vigente y promedio por socio.
- **Ingreso por socio**: por cada socio del parque, participación, potencia asociada, energía e ingreso totales y por medidor, esquema que rige (propio o parque) y banderas sin medidor / sin ingresos.
- **ROI realizado**: acumulado de ingresos convertidos a USD por mes con tipo de cambio real, comparado contra la inversión meta; incluye meses sin tipo de cambio y tiempo transcurrido desde la puesta en marcha.
- **Cobertura**: indicador de qué parte de la energía registrada pudo valorizarse; base del aviso de datos incompletos.
- **Socio / Medidor**: un socio puede tener uno o más medidores; cada medidor aporta energía e ingreso propios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los importes de "ahorro" mostrados en Performance, historial de generación, tabla de socios, ROI y portal del socio dentro del alcance provienen de datos reales; no queda ningún importe fijo de ejemplo en esas vistas.
- **SC-002**: Para un parque de prueba con datos conocidos, los importes y energías mostrados coinciden exactamente con los del backend (diferencia de 0 centavos en totales mensuales).
- **SC-003**: Performance muestra los KPIs de ingresos en el mismo tiempo percibido que la carga actual de energía (sin que el usuario espere más de 3 segundos adicionales sobre el estado actual en condiciones normales de red).
- **SC-004**: En ninguna vista el importe de un alcance Parque aparece sumado a uno de alcance Socios (0 casos de doble conteo en la revisión de las pantallas).
- **SC-005**: Ante cualquiera de los estados nulos listados (sin tarifa, sin tipo de cambio, sin inversión meta, socio sin medidor, socio sin ingresos, sin ingresos todavía), el 100% de las vistas afectadas muestra un mensaje claro y ninguna se rompe.
- **SC-006**: Cuando existen registros sin valorizar, el aviso de datos incompletos es visible en el 100% de las vistas con importes, en el mismo primer vistazo, sin interacción adicional.
- **SC-007**: Un usuario con rol socio no puede visualizar, por ningún flujo de la interfaz, ingresos del parque ni de otros socios.
- **SC-008**: La falla simulada del servicio de ingresos deja operativa el 100% de las demás secciones de la pantalla (energía, gráficos, tablas no dependientes).
- **SC-009**: Los usuarios pueden identificar qué cifras son reales y cuáles aún no están disponibles: ningún valor sin dato real se presenta como cero o como cifra de ejemplo.

## Assumptions

- **Fuente del ROI** (decidido): el recupero se calcula con los ingresos reales del medidor principal convertidos a USD. Reemplaza al "crédito acumulado" cargado manualmente, que sigue existiendo en el sistema pero deja de mostrarse en ROI.
- **Concepto del valor**: el importe representa solo el ingreso por inyección; no incluye autoconsumo, neteo ni ahorro por desplazamiento de compra a la distribuidora. En GDD, el "ahorro" propiamente dicho queda fuera de alcance.
- **Período** (decidido): tarjetas KPI y tabla/detalle de socios muestran siempre el mes en curso; no hay selector de período en esta feature.
- **Actualización** (decidido): los datos se leen al abrir o recargar la pantalla y se muestra la hora de última actualización de ingresos; no hay refresco automático.
- **Alcance por defecto**: Performance GDD/GDCV, ROI y KPIs de parque usan alcance Parque; tabla/detalle de socios y portal del socio usan alcance Socios.
- **Promedio por socio**: se define como ingreso total de socios del mes dividido por socios con al menos un ingreso en ese mes; se muestra solo a HINS Admin y AGC.
- **Datos a verificar con datos reales**: que los medidores de socio informen energía exportada (de lo contrario el ingreso del socio será cero aunque tenga participación) y que existan tipos de cambio reales mensuales cargados.
- **Mes en curso**: el período "actual" es el mes calendario en hora de Argentina; el día en curso puede estar incompleto.
- **Pantalla GDC**: las vistas del modelo GDC hoy son un marcador de posición y no se incluyen.
- **Energía adquirida**: las columnas "energía adquirida", "otras fuentes", "energía total" y porcentajes del historial GDD quedan pendientes de una definición de producto sobre energía importada y no forman parte de esta feature.
- **Fuera de alcance**: autoconsumo virtual, energía asignada y neteada, impuestos, proyecciones (ahorro estimado, payback, escenarios, TIR proyectada), ROI por socio, CO₂ evitado, estado "Aplicado" de compensaciones, ficha de socio (alta, responsable, teléfono) y exportación a CSV.
- **Dependencias**: servicios de ingresos (resumen, KPIs, por socio), ROI realizado, listado de socios con medidores y potencia asociada, y tipos de cambio publicados por el backend, ya disponibles; contrato de referencia en `docs/backend-requests-ingresos.md` y en el documento de contrato del backend.
- **Usuarios**: la aplicación sigue exigiendo sesión; se reutilizan los permisos y la gestión de sesión vencida existentes.

# Feature Specification: Esquemas tarifarios por franjas horarias (Parque y Socio)

**Feature Branch**: `014-esquemas-tarifarios`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Revisar http://localhost:3000/docs. Ahora existen esquemas tarifarios, lo que define 2 mejoras en la interfaz: (1) cada tarifa tiene rangos de aplicación; (2) a nivel de parque y a nivel de socio, cada uno puede definir la tarifa que aplica y su esquema de rangos. Hacer los cambios para que la interfaz soporte esto."

## Contexto

La API ahora expone un **esquema tarifario**: conjunto de exactamente tres franjas horarias (RESTO, PICO, VALLE) que cubren las 24 horas del día. Cada franja indica qué tarifa del catálogo aplica, su horario (inicio inclusivo, fin exclusivo) y, opcionalmente, valores propios (energía, inyección, unidad) que reemplazan los del catálogo. Cada esquema tiene fecha "vigente desde", estado (HISTÓRICO, VIGENTE, FUTURO) y pertenece a un parque o a un socio. Si un socio no tiene esquema propio, rige el del parque. La API también entrega la tarifa efectiva (franja y valores finales, con origen PROPIO o CATÁLOGO de cada valor).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver franjas de aplicación de las tarifas y tarifa efectiva (Priority: P1)

El administrador (o AGC, solo lectura) abre un parque y ve su esquema tarifario efectivo hoy: tres franjas con horario, tarifa aplicada, valor de energía, valor de inyección y unidad, indicando si cada valor es propio o viene del catálogo. Lo mismo para un socio, indicando si usa esquema propio o el heredado del parque.

**Why this priority**: Es el valor base: entender qué se cobra y en qué horario. Es de solo lectura y sirve de MVP.

**Independent Test**: Abrir un parque con esquema y uno sin esquema; abrir un socio con esquema propio y uno sin él; verificar franjas, valores y origen mostrados.

**Acceptance Scenarios**:

1. **Given** un parque con esquema vigente, **When** el usuario abre la sección de tarifas del parque, **Then** ve las tres franjas con horario, tarifa, valores y unidad, y la fecha desde la que rige el esquema.
2. **Given** una franja con valor propio y otro tomado del catálogo, **When** se muestra, **Then** cada valor indica su origen (propio/catálogo).
3. **Given** un socio sin esquema propio, **When** el usuario ve sus tarifas, **Then** ve las franjas heredadas del parque con una indicación clara de que son del parque.
4. **Given** un socio con esquema propio, **When** el usuario ve sus tarifas, **Then** ve sus franjas y que son propias.
5. **Given** un parque sin ningún esquema, **When** el usuario abre la sección, **Then** ve un estado vacío explicativo (y, si es admin, la acción de crear).
6. **Given** una fecha elegida por el usuario, **When** la cambia, **Then** las franjas mostradas corresponden al esquema vigente en esa fecha.

---

### User Story 2 - Definir el esquema tarifario de un parque (Priority: P1)

El administrador define para un parque su esquema: fecha de vigencia y, para cada una de las tres franjas, la tarifa del catálogo que aplica, el rango horario y, opcionalmente, valores propios. Puede ver el historial de esquemas (histórico/vigente/futuro), editar o eliminar los vigentes y futuros.

**Why this priority**: Es la mejora central pedida (definir tarifa y rangos a nivel parque).

**Independent Test**: Crear esquema para un parque, ver que aparece como vigente/futuro, editarlo, eliminarlo; probar errores de horario incompleto y fecha inválida.

**Acceptance Scenarios**:

1. **Given** un admin en el parque, **When** crea un esquema con fecha válida y las tres franjas completas, **Then** aparece en el historial con su estado.
2. **Given** el formulario, **When** elige una tarifa por franja, **Then** puede escoger solo tarifas existentes en el catálogo.
3. **Given** una franja sin horario indicado, **When** guarda, **Then** se usa el horario habitual del tipo de franja, mostrado como valor sugerido.
4. **Given** horarios que no cubren las 24 horas, **When** intenta guardar, **Then** ve un error claro y no se guarda.
5. **Given** valores propios dejados vacíos, **When** guarda, **Then** esos valores se toman del catálogo y así se muestra.
6. **Given** una fecha igual o anterior al último esquema, **When** intenta guardar, **Then** ve un error claro explicando la regla.
7. **Given** un esquema histórico, **When** ve su fila, **Then** editar y eliminar no están disponibles.
8. **Given** un esquema vigente o futuro, **When** el admin lo edita o elimina (con confirmación), **Then** el historial refleja el cambio; en uno vigente la fecha de vigencia no es editable.
9. **Given** un usuario AGC, **When** ve el historial, **Then** no ve acciones de crear/editar/eliminar.

---

### User Story 3 - Definir el esquema tarifario de un socio (Priority: P2)

El administrador define, para un socio de un parque, un esquema propio con el mismo formulario y reglas que el de parque. Puede ver el historial, editar/eliminar vigentes y futuros, y quitar el esquema propio para volver a heredar el del parque.

**Why this priority**: Segunda mejora pedida; reutiliza la experiencia de la historia 2.

**Independent Test**: Crear esquema para un socio, verificar que reemplaza al del parque en la vista efectiva; eliminarlo y verificar que vuelve el del parque.

**Acceptance Scenarios**:

1. **Given** un admin en un socio, **When** crea un esquema válido, **Then** aparece en su historial y la vista efectiva del socio lo refleja desde su fecha.
2. **Given** un socio con esquema propio, **When** se elimina el único esquema vigente/futuro, **Then** la vista efectiva vuelve a mostrar el del parque.
3. **Given** el formulario de socio, **When** se abre, **Then** puede precargar las franjas con las efectivas actuales (propias o del parque) para modificarlas.

---

### User Story 4 - Mantener catálogo de tarifas coherente con las franjas (Priority: P3)

En la pantalla existente de Tarifas, el usuario ve qué tarifas están en uso por esquemas, y al intentar eliminar una versión se advierte que puede afectar esquemas de parques o socios.

**Why this priority**: Evita errores de configuración; no bloquea las demás historias.

**Independent Test**: Eliminar una tarifa usada por un esquema y verificar la advertencia / el error mostrado.

**Acceptance Scenarios**:

1. **Given** una tarifa referenciada por esquemas, **When** el admin intenta eliminarla, **Then** ve una advertencia clara y, si el sistema la rechaza, el motivo.

---

### Edge Cases

- Franjas que se solapan o dejan huecos en las 24 horas, incluida una franja que cruza medianoche (ej. 23:00–05:00).
- Tarifa del catálogo inexistente o eliminada al guardar.
- Dos usuarios editan el mismo esquema; el segundo recibe error por esquema ya histórico o fecha fuera de orden.
- Esquema futuro entre dos esquemas vecinos: la nueva fecha debe quedar entre ambos.
- Hora exacta de límite entre franjas (inicio inclusivo, fin exclusivo) mostrada de forma consistente.
- Usuario sin permisos (rol distinto de admin/AGC) no ve la sección.
- Parque o socio sin esquema y sin catálogo de tarifas cargado.
- Valores propios en 0 (válido) versus vacío (toma catálogo).
- Catálogo de tarifas vacío: no se puede crear un esquema y se explica por qué.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La interfaz MUST mostrar, a nivel de parque, el esquema tarifario efectivo en una fecha: tres franjas (RESTO, PICO, VALLE) con horario, tarifa, valor de energía, valor de inyección y unidad.
- **FR-002**: La interfaz MUST indicar para cada valor mostrado si es propio o proviene del catálogo.
- **FR-003**: La interfaz MUST mostrar, a nivel de socio, el esquema efectivo e indicar si es propio o heredado del parque.
- **FR-004**: Los usuarios MUST poder elegir la fecha de consulta; por defecto, hoy.
- **FR-005**: La interfaz MUST listar el historial paginado de esquemas de un parque y de un socio, con fecha desde, fecha hasta y estado (histórico, vigente, futuro).
- **FR-006**: El admin MUST poder crear un esquema para un parque y para un socio, indicando fecha de vigencia y las tres franjas.
- **FR-007**: Cada franja MUST permitir elegir la tarifa del catálogo que aplica, el horario de inicio y fin, y opcionalmente valor de energía, valor de inyección y unidad propios.
- **FR-008**: La interfaz MUST exigir exactamente una franja de cada tipo (RESTO, PICO, VALLE) y validar que los horarios cubren las 24 horas antes de enviar, mostrando errores claros.
- **FR-009**: La interfaz MUST permitir omitir los horarios de las tres franjas a la vez (el sistema aplica los habituales de cada tipo); si se informa el horario de alguna, MUST informarse el de las tres.
- **FR-010**: Si un valor propio se omite, la interfaz MUST indicar que se tomará del catálogo.
- **FR-011**: El admin MUST poder editar (franjas y, en esquemas futuros, fecha de vigencia) y eliminar esquemas vigentes y futuros, con confirmación al eliminar; los históricos no ofrecen estas acciones.
- **FR-012**: La interfaz MUST mostrar mensajes comprensibles para los rechazos del sistema: fecha no posterior al último esquema, fecha fuera de orden entre vecinos, esquema histórico, tarifa inexistente y horarios que no cubren el día.
- **FR-013**: Usuarios con rol AGC MUST poder ver esquemas pero no crear, editar ni eliminar; otros roles no ven la sección.
- **FR-014**: El formulario de socio MUST ofrecer precargar las franjas con las efectivas actuales como punto de partida.
- **FR-015**: La interfaz MUST mostrar estados de carga, vacío y error en todas las vistas nuevas.
- **FR-016**: La pantalla de Tarifas MUST advertir al eliminar una versión que puede afectar esquemas de parques o socios.

### Key Entities

- **Tarifa (catálogo)**: Nombre, valor de energía, valor de inyección, unidad, vigencia por versiones. Es la referencia que cada franja aplica.
- **Esquema tarifario**: Conjunto de tres franjas con fecha vigente desde/hasta y estado. Pertenece a un destino (parque o socio).
- **Franja**: Tipo (RESTO, PICO, VALLE), horario inicio/fin, tarifa del catálogo aplicada y valores propios opcionales. Es el "rango de aplicación".
- **Destino**: Parque o socio dueño del esquema; el socio sin esquema hereda el del parque.
- **Tarifa efectiva**: Resultado de resolver franja y valores finales (con origen propio/catálogo) para una fecha y hora.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede saber la tarifa y franja horaria que aplica a un parque o socio en una fecha dada en menos de 10 segundos desde que abre su ficha.
- **SC-002**: Un admin crea un esquema completo (3 franjas) para un parque o socio en menos de 3 minutos.
- **SC-003**: El 100 % de los intentos con horarios incompletos o fechas inválidas muestran un mensaje que indica cómo corregir, sin perder los datos ya ingresados.
- **SC-004**: En el 100 % de los casos, un socio sin esquema propio muestra explícitamente que rige el del parque.
- **SC-005**: Ningún usuario sin permiso de administración puede ver acciones de crear, editar o eliminar esquemas.

## Assumptions

- "Rangos de aplicación" de una tarifa se interpreta como las **franjas horarias** del esquema: el catálogo de tarifas no almacena rangos propios; los rangos se definen en el esquema al asignar tarifas a franjas.
- La fecha "hoy" por defecto y los horarios usan hora local de Argentina, inicio inclusivo y fin exclusivo, según la API.
- Los roles son los existentes: admin (HINS_ADMIN) gestiona; AGC solo consulta.
- La sección se ubica dentro de la ficha del parque y de la ficha del socio, reutilizando patrones de lista paginada, formularios y confirmación ya existentes (ver feature 013).
- Alcance excluye el uso de la tarifa efectiva en cálculos de facturación o gráficos existentes.
- Estados y reglas de vigencia siguen las ya aplicadas a las versiones de tarifas.

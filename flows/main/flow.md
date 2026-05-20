# Flow: HINS Admin Global

## Actor
HINS — Dueño de la plataforma. Acceso transversal a todos los proyectos.
Pregunta clave: ¿Cómo está rindiendo cada parque de la cartera?

Acciones principales:
- Ver todos los proyectos en cartera
- Monitorear el desempeño general de cada proyecto
- Al entrar a un parque (dashboard administrativo), acceder también al **Mantenimiento** del parque (módulo transversal GDD/GDC/GDCV)

**Mantenimiento:** ✅ HINS Admin tiene acceso al módulo en cada parque que gestiona. No aplica en vista Socio.

---

## Pantallas

### Main_00 — Vista: Proyectos
Ruta: /main
Vista por defecto al ingresar como HINS Admin.
Referencia visual: Dashboard_root_00.png

Bloques (orden vertical):
1. Header: título "Proyectos" + TabsForBlocks de filtro (Todos / Comunitarios / Distribuidor) + botón "Nuevo" (sin acción por ahora).
2. Grid de cards: 2 cards por fila en desktop. Una card por proyecto.

Anatomía de cada card de proyecto:
- Imagen del parque en el bloque superior (placeholder por ahora)
- SoftBadge de tipo (GDD / GDC) sobre la imagen
- Nombre del parque
- Botón "Acceder" — acción principal de la card
- Toda la card + botón "Acceder" es zona activa

Interacciones definidas:
- Filtro "Todos" → muestra todas las cards (por defecto)
- Filtro "Comunitarios (GDC)" → muestra solo cards con badge GDC
- Filtro "Distribuidor (GDD)" → muestra solo cards con badge GDD
- Card "Parque Fotovoltaico de General Roca" (GDD) → navega a /gdd/performance
- Botón "Nuevo" → sin acción por ahora, incluir visualmente

---

## Nota para el agente
- Construir solo Main_00. Esperar aprobación antes de continuar.
- Usar Dashboard_root_00.png como referencia visual de layout y jerarquía.
- Mock data: incluir al menos 3 cards de proyectos de ejemplo (mix GDD y GDC).
- SoftBadge sobre imagen: usar el componente SoftBadge de /context/components.md.
- Grid responsive: 2 columnas en desktop, 1 columna en mobile.
- No implementar lógica de "Nuevo" — solo el botón visual.
- Para specs de componentes: @context/components.md
- Para tokens y sistema visual: @context/design-system.md

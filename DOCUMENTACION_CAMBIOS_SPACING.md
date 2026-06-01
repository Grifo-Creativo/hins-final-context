# Prompt para Documentación: Standardización de Spacing Responsive en Elementos Wrapper

## Tarea

Documentar los cambios de spacing responsive aplicados a toda la codebase en elementos wrapper de primer nivel. Esta documentación debe actualizarse en los archivos especificados a continuación, considerando que los cambios introducen una **VIOLACIÓN CONTROLADA** de las reglas del design-system que debe quedar explícita.

---

## Resumen Ejecutivo

Se aplicó un patrón responsive de spacing a **todos los elementos wrapper de primer nivel** (cards, bloques, grids principales) en la codebase. El cambio es:

```
De:  gap-6  (fijo)
A:   gap-4 sm:gap-6  (responsive)
```

**Resultado:**
- Mobile (<640px): gap-4 (16px, espacios compactos)
- Desktop (≥640px): gap-6 (24px, espacios normales)

**Impacto:** 20 archivos modificados, ~31 instancias cambiadas

---

## Violación de Reglas del Design System

### Conflicto Identificado

El `design-system.md` (líneas 215-218) define:
```
- gap-6 → separación ENTRE BLOQUES/SECCIONES (chart ↔ sidebar, header ↔ KPIs)
- gap-4 → separación ENTRE ITEMS DEL MISMO GRUPO en grid 2×N
```

### La Violación

Aplicamos `gap-4 sm:gap-6` a **elementos wrapper que separan BLOQUES/SECCIONES** (cards principales, contenedores principales), que según el design-system deberían usar `gap-6` consistentemente.

**Razón de la violación:** Optimización pragmática de espacio en mobile. El espacio disponible en viewport < 640px requiere reducir gap-6 a gap-4, incluso en separaciones entre bloques.

### Estado de las Reglas

La .cursorrules menciona (línea 218):
> "❌ No usar `gap-3 sm:gap-4` responsive en grids de KPIs — un solo token (`gap-4`) en mobile y desktop."

**Nota:** Nuestro cambio NO viola esta regla específica (no usamos gap-3 sm:gap-4, usamos gap-4 sm:gap-6). Pero sí extiende el uso responsive más allá de lo que el design-system contempla.

---

## Archivos Afectados

### Componentes UI
- `components/ui/kpi-roi-card.tsx`
- `components/ui/kpi-roi-duo.tsx`
- `components/ui/kpi-with-asset.tsx`
- `components/ui/performance-placeholder-card.tsx` (4 constantes grid)

### Componentes GDD
- `components/gdd/GddViewHeader.tsx`
- `components/gdd/GddPageHeading.tsx`
- `components/gdd/ParkPerformanceView.tsx`
- `components/mantenimiento/ParkMantenimientoView.tsx`

### Componentes GDCV
- `components/gdcv/SocioPageHeading.tsx`
- `components/gdcv/SocioDetailSheet.tsx`
- `components/gdcv/SocioPerformanceView.tsx`
- `components/gdcv/GdcvPerformanceView.tsx`
- `components/gdcv/GdcvPageHeading.tsx`

### Componentes Main
- `components/main/ProjectsView.tsx`
- `components/main/NewProjectDialog.tsx`

### Layouts
- `app/gdc/layout.tsx` (px-4 sm:px-6, py-4 sm:py-6)
- `app/gdd/layout.tsx` (px-4 sm:px-6, py-4 sm:py-6)
- `app/gdcv/layout.tsx` (px-4 sm:px-6, py-4 sm:py-6)
- `app/main/layout.tsx` (px-4 sm:px-6, py-4 sm:py-6)
- `app/gdcv/socio/layout.tsx` (gap-4 sm:gap-6)
- `app/dev/components/page.tsx`

---

## Qué Documentar

### 1. En `/context/design-system.md`

Agregar una nueva sección bajo "### Spacing — Desktop (base x4)" llamada:

#### **### Spacing Responsivo en Elementos Wrapper (Extensión Mobile)**

Contenido:

```markdown
Para optimizar espacio en mobile (<640px), los elementos wrapper de primer nivel 
(cards, bloques, contenedores principales) utilizan spacing responsivo:

| Contexto | Mobile (<640px) | Desktop (≥640px) | Uso |
|----------|---|---|---|
| Separación entre bloques | gap-4 (16px) | gap-6 (24px) | CardWithContent, grids principales, wrappers |
| Padding de layout | p-4 (16px) | p-6 (24px) | Main content area padding |

Esta es una **extensión pragmática** del modelo de spacing del design-system, 
que originalmente define gap-6 para "separación entre bloques/secciones" sin 
distinción responsiva. En mobile, gap-4 es suficiente y optimiza real estate visual.

**Nota:** Esta extensión no viola las reglas de KPI grids (línea 218), que 
mantienen gap-4 consistentemente.
```

---

### 2. En `/context/components.md`

Actualizar la sección "SectionHeader" (o "CardWithContent" / "StatList") para mencionar:

```markdown
### Spacing Responsivo en Headers y Wrappers

Todos los headers y elementos wrapper de primer nivel utilizan spacing responsivo:
- Mobile (<640px): gap-4 (16px), p-4 (16px)
- Desktop (≥640px): gap-6 (24px), p-6 (24px)

Esto permite que la codebase mantenga consistencia visual mientras optimiza 
para pantallas pequeñas.
```

---

### 3. En `.cursorrules`

Agregar una línea en la sección "## Reglas de componentes" (después de línea 55):

```markdown
- Spacing responsivo: Elementos wrapper de primer nivel usan `gap-4 sm:gap-6` 
  (mobile: 16px, desktop: 24px). Esta es una extensión pragmática de las reglas 
  de spacing base; ver `/context/design-system.md` → "Spacing Responsivo en Elementos Wrapper".
```

---

### 4. Crear archivo `/context/spacing-mobile-optimization.md` (Opcional pero Recomendado)

Documento técnico explicando:

#### **Optimización de Spacing para Mobile**

**Problema:** Mobile < 640px requería optimización de espacios entre cards

**Solución:** Patrón responsive `gap-4 sm:gap-6`

**Impacto:** 20 archivos, ~31 instancias

**Trade-offs:** Desviación del modelo original de spacing (gap-6 exclusivamente para bloques)

**Justificación:** Mejora de UX/espaciado sin comprometer jerarquía visual en desktop

**Alcance:** Solo elementos wrapper de primer nivel; componentes internos sin cambios

---

## Commits Relacionados

```
- 0519fbc: Optimize layout spacing for mobile: gap-6/px-6/py-6 → gap-4/px-4/py-4
- f314abe: Apply responsive spacing to all first-level wrapper elements: gap-6 → gap-4 sm:gap-6
- 775f082: Apply responsive spacing to KPI grid in GdcvPerformanceView
- 1b3670e: Apply gap-4 sm:gap-6 spacing to ALL first-level wrapper elements across codebase
```

---

## Consideraciones para el Documentador

1. **Enfatizar la violación controlada:** No es un error; es una decisión consciente de optimizar mobile.

2. **Mantener el cambio en el diseño-system:** Aunque extienda las reglas originales, el patrón es consistente y justificable.

3. **Alertar futuros modificadores:** Cualquiera que lea el design-system debe entender que gap-4 en wrapper mobile != gap-4 en grid items (contextos diferentes).

4. **Sugerir revisión:** Si se añaden más componentes wrapper, deben seguir el patrón `gap-4 sm:gap-6`.

---

## Validación Post-Documentación

- [ ] `/context/design-system.md` tiene sección sobre spacing responsivo
- [ ] `.cursorrules` menciona el patrón responsivo
- [ ] `/context/components.md` actualizado con notas de spacing
- [ ] Documentación explícita sobre la violación controlada
- [ ] `/context/spacing-mobile-optimization.md` creado (opcional)

---

## Instrucciones de Ejecución

1. **Leer este documento completo** para entender el contexto y la violación
2. **Revisar los archivos mencionados** en cada sección
3. **Aplicar los cambios de documentación** en el orden especificado
4. **Verificar que cada sección sea clara** sobre la extensión responsive
5. **Marcar los checkpoints** conforme se complete cada archivo
6. **Crear un commit** con los cambios de documentación:
   ```
   git commit -m "docs: Document spacing responsive pattern (gap-4 sm:gap-6) and design-system deviation"
   ```

---

**Nota Final:** Esta documentación establece un precedente para futuras decisiones pragmáticas que desvíen del design-system original. Asegúrate de que la justificación sea clara y que cualquiera que lea estos documentos entienda **por qué** se hizo esta extensión, no solo **que** se hizo.

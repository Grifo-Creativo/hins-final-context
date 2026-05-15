# Plan de Ejecución — KpiWithTimeline Implementation

## ¿QUÉ CAMBIÓ?

Decidiste cambiar la Card 3 ("Recupero Estimado") de un layout manual a un componente reutilizable: **KpiWithTimeline**

---

## PASO 1: Crear KpiWithTimeline en el proyecto

**Archivo a crear:** `/components/ui/kpi-with-timeline.tsx`

**Contenido:** Ver `outputs/kpi-with-timeline.tsx`

**Tiempo:** ~2 minutos

---

## PASO 2: Actualizar GdcvRoiView.tsx

**Archivo a modificar:** `/components/gdcv/GdcvRoiView.tsx`

**Cambios:**

1. **Remover imports obsoletos:**
   ```tsx
   // REMOVER:
   import { Card } from "@/components/ui/card"
   import { HinsTooltip } from "@/components/ui/hins-tooltip"
   ```

2. **Agregar nuevo import:**
   ```tsx
   import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
   import { Card } from "@/components/ui/card"  // Se mantiene para Card 2
   ```

3. **Remover constantes:**
   ```tsx
   // REMOVER:
   const CARD_BASE = "bg-white py-0 shadow-sm ring-0" as const
   const TIMELINE_GREEN = "#27500A" as const
   const pct = roiKpis.porcentajeRecuperado  // local variable
   ```

4. **Reemplazar Card 3 completa** (líneas ~77-170) con:
   ```tsx
   <KpiWithTimeline
     label="Recupero Estimado"
     value={roiKpis.recuperoEstimado}
     metricBadge={`TIR ${roiKpis.tir}`}
     timelineData={{
       inicio: roiKpis.timeline.inicio,
       hoy: roiKpis.timeline.hoy,
       payback: roiKpis.timeline.payback,
     }}
   />
   ```

5. **Actualizar Card 2** — cambiar `pct` por `roiKpis.porcentajeRecuperado`:
   ```tsx
   // Antes:
   width: `${pct}%`
   {pct}% recuperado
   
   // Después:
   width: `${roiKpis.porcentajeRecuperado}%`
   {roiKpis.porcentajeRecuperado}% recuperado
   ```

6. **Actualizar Card 2 className** — reemplazar `CARD_BASE`:
   ```tsx
   className="bg-white py-0 shadow-sm ring-0 rounded-xl"
   ```

**Referencia:** Ver `outputs/GdcvRoiView.tsx` — está completamente actualizado

**Tiempo:** ~5 minutos

---

## PASO 3: Actualizar components.md

**Archivo a modificar:** `@context/components.md`

**Qué hacer:**

Buscar la sección `## KpiSecondaryCompact` (línea ~821 aproximadamente).

Después de esa sección (después de "Casos de uso"), agregar:

```
---

[AQUÍ VA EL CONTENIDO DE KPI_WITH_TIMELINE_SECTION.md]

---
```

O copiar/pegar el contenido de `outputs/KPI_WITH_TIMELINE_SECTION.md` completo en components.md después de KpiSecondaryCompact.

**Tiempo:** ~2 minutos

---

## PROMPT para Cursor (cuando ya esté todo en stack):

```
Read @context/components.md (ACTUALIZADO con KpiWithTimeline)

Files to create/update:
1. Create: /components/ui/kpi-with-timeline.tsx
2. Update: /components/gdcv/GdcvRoiView.tsx

TASK: Implement KpiWithTimeline and refactor GdcvRoiView.tsx

STEP 1 — Create KpiWithTimeline
- Copy implementation from outputs/kpi-with-timeline.tsx
- Ensure all imports present: Card, HinsTooltip
- No TypeScript errors

STEP 2 — Update GdcvRoiView.tsx
- Add import: KpiWithTimeline
- Keep import: Card (needed for Card 2)
- Remove: HinsTooltip import (no longer used)
- Remove: CARD_BASE, TIMELINE_GREEN constants
- Remove: pct local variable declaration
- Replace Card 3 (entire block) with KpiWithTimeline component call
- Update Card 2: replace pct with roiKpis.porcentajeRecuperado
- Update Card 2: className inline instead of CARD_BASE

Reference: outputs/GdcvRoiView.tsx for exact implementation

WAIT FOR APPROVAL.
```

---

## CHECKLIST:

- [ ] KpiWithTimeline.tsx creado en `/components/ui/`
- [ ] GdcvRoiView.tsx actualizado:
  - [ ] Imports correctos
  - [ ] Constantes removidas
  - [ ] Card 3 reemplazada por KpiWithTimeline
  - [ ] Card 2 actualizado
- [ ] components.md actualizado con sección KpiWithTimeline
- [ ] Sin errores TS
- [ ] Vista ROI renderiza correctamente

---

## BENEFICIOS:

✅ **Código más limpio** — 95 líneas reducidas a 8 en Card 3  
✅ **Componente reutilizable** — KpiWithTimeline para futuras vistas  
✅ **Semántica clara** — KPI + Timeline como concepto unificado  
✅ **Mantenibilidad** — Lógica de timeline centralizada  
✅ **Consistencia visual** — spacing y tipografía controlada por componente  

---

**Ready to execute. ¿Pasamos a Cursor?**

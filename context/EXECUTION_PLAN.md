# Plan de Ejecución — Refactorización Familia KPIs + IconBadge

## Orden de Implementación (CRÍTICO)

---

## **PASO 1: Actualizar IconBadge en el proyecto**
**Archivo a modificar:** `/components/ui/icon-badge.tsx`

**Qué cambiar:**
- Reemplazar la implementación completa con la versión en `outputs/icon-badge.tsx`
- Agregará `size="md"` como opción nueva
- Removerá la prop `background` (causa conflicto semántico)
- Ajustará todas las opciones de tamaño y color

**Impacto:**
- ✅ KpiPrimary: sin cambios funcionales (size="lg" sigue igual)
- ✅ KpiSecondary: sin cambios funcionales (size="sm" sigue igual)
- ⚠️ Cualquier otro uso de `background` prop → error TS (buscar en el codebase y remover)

**Tiempo:** ~5 minutos

---

## **PASO 2: Crear KpiSecondaryCompact (componente nuevo)**
**Nuevo archivo:** `/components/ui/kpi-secondary-compact.tsx`

**Qué hacer:**
- Crear el archivo con el contenido de `outputs/kpi-secondary-compact.tsx`
- Es una copia optimizada de KpiSecondary pero:
  - Layout SIEMPRE horizontal (no prop)
  - IconBadge size="md" fijo (no size="sm")
  - gap-4 entre icon y content (vs gap-3 en KpiSecondary)
  - delta es OPCIONAL (prop?, no obligatorio string)

**Impacto:**
- ✅ Nuevo componente — no afecta nada existente
- ✅ Ready para usar en GDCV_admin_03

**Tiempo:** ~2 minutos

---

## **PASO 3: Actualizar KpiSecondary (no renombrar, pero documentar claramente)**
**Archivo a modificar:** `/components/ui/kpi-secondary.tsx`

**Qué cambiar:**
- Reemplazar con la versión de `outputs/kpi-secondary.tsx`
- Mantiene el nombre `KpiSecondary` (backward compatible)
- Agrega comentario en el archivo indicando que se comporta como "KpiSecondaryStacked"
- Elimina la prop `background` (si la tuviera)
- Mantiene la prop `layout` para horizontal/vertical

**Impacto:**
- ✅ Totalmente backward compatible
- ✅ Todos los usos existentes siguen funcionando
- ✅ Se suma la variante horizontal para casos específicos

**Tiempo:** ~3 minutos

---

## **PASO 4: Actualizar components.md en el stack de contexto**
**Archivo:** `@context/components.md`

**Qué hacer:**
- Reemplazar con la versión de `outputs/components.md`
- Contiene:
  - IconBadge actualizado (size="md" agregado)
  - KpiSecondary con documentación clara sobre "KpiSecondaryStacked"
  - KpiSecondaryCompact — sección completa nueva

**Impacto:**
- ✅ Cursor tendrá spec actualizado
- ✅ Futuras construcciones usarán la nueva familia
- ✅ Claridad semántica documentada

**Tiempo:** ~1 minuto (solo copiar/pegar)

---

## **PASO 5: Actualizar GdcvRoiView.tsx para usar KpiSecondaryCompact**
**Archivo a modificar:** `/components/gdcv/GdcvRoiView.tsx`

**Qué cambiar:**

Reemplazar Col 1 (KpiSecondary verticales) con KpiSecondaryCompact:

```tsx
// ANTES (dos KpiSecondary en flex-col)
<div className="flex flex-col gap-6">
  <KpiSecondary
    icon={TrendingUpIcon}
    label="Inversión Inicial"
    value={roiKpis.inversionInicial}
    delta=""
    layout="horizontal"  // ← hack temporal
  />
  <KpiSecondary
    icon={DollarSignIcon}
    label="Ahorrado Total (en facturas)"
    value={roiKpis.ahorradoTotal}
    delta=""
    layout="horizontal"  // ← hack temporal
  />
</div>

// DESPUÉS (dos KpiSecondaryCompact)
<div className="flex flex-col gap-6">
  <KpiSecondaryCompact
    icon={TrendingUpIcon}
    label="Inversión Inicial"
    value={roiKpis.inversionInicial}
  />
  <KpiSecondaryCompact
    icon={DollarSignIcon}
    label="Ahorrado Total (en facturas)"
    value={roiKpis.ahorradoTotal}
  />
</div>
```

**Agregar import:**
```tsx
import { KpiSecondaryCompact } from "@/components/ui/kpi-secondary-compact"
```

**Impacto:**
- ✅ Código más limpio (no necesita prop `layout`)
- ✅ Semántica correcta (KpiSecondaryCompact = horizontal)
- ✅ IconBadge ahora size="md" (36×36 en lugar de 24×24)
- ✅ Visualización correcta: icon mediano + layout compacto

**Tiempo:** ~5 minutos

---

## **PASO 6: Verificación final en todas las vistas**
**Buscar usos de:**
- `KpiSecondary` → asegurarse que siga funcionando (backward compatible ✅)
- `IconBadge` → buscar prop `background` y remover si existe
- Cualquier hardcode de tamaños de icon → verificar que ahora use IconBadge

**Vistas a revisar:**
- `/app/gdd/performance/page.tsx`
- `/app/gdcv/performance/page.tsx`
- `/app/gdcv/socio/page.tsx`
- Cualquier otra que tenga KPIs

**Tiempo:** ~10 minutos

---

## **Resumen de cambios:**

| Componente | Cambio | Breaking | Impacto |
|---|---|---|---|
| IconBadge | Agregar size="md", remover background | ⚠️ Si hay background prop | Buscar y remover |
| KpiSecondary | Sin cambios (backward compat) | ✅ No | Sigue funcionando igual |
| KpiSecondaryCompact | NUEVO componente | ✅ No | Ready para usar |
| components.md | Actualizar spec | ✅ No | Cursor tendrá info correcta |
| GdcvRoiView.tsx | Usar KpiSecondaryCompact | ✅ No | Visual mejorado |

---

## **Prompts para Cursor (en este orden):**

### **Prompt 1: IconBadge update**
```
Read: @context/components.md (ACTUALIZADO con IconBadge size="md")

File: /components/ui/icon-badge.tsx

TASK: Update IconBadge implementation.

1. Add size="md" option (36×36, `bg-[#F2ECE9]/36 text-green-600`)
2. Refactor to use object maps for sizeStyles and iconSizes
3. Remove the `background` prop completely
4. Match spec in components.md exactly

See outputs/icon-badge.tsx for reference.

WAIT FOR APPROVAL.
```

### **Prompt 2: Create KpiSecondaryCompact**
```
Read: @context/components.md (§ KpiSecondaryCompact)

File to create: /components/ui/kpi-secondary-compact.tsx

TASK: Create new KpiSecondaryCompact component.

1. Copy structure from KpiSecondary
2. Layout ALWAYS horizontal (no layout prop)
3. IconBadge size="md" (not sm)
4. gap-4 between icon and content
5. delta is OPTIONAL (not required string)
6. Match spec in components.md exactly

See outputs/kpi-secondary-compact.tsx for reference.

Import from: Card, IconBadge, SoftBadge, HinsTooltip, InfoIcon

WAIT FOR APPROVAL.
```

### **Prompt 3: Update KpiSecondary**
```
Read: @context/components.md (§ KpiSecondary)

File: /components/ui/kpi-secondary.tsx

TASK: Update KpiSecondary (backward compatible).

1. Remove background prop if present
2. Update showDelta logic to use Boolean(delta.trim())
3. Keep layout prop (vertical/horizontal)
4. Ensure both paths (vertical/horizontal) work correctly
5. Add comment at top: "// Behaves as KpiSecondaryStacked"

See outputs/kpi-secondary.tsx for reference.

WAIT FOR APPROVAL.
```

### **Prompt 4: Update GdcvRoiView**
```
Read: @context/components.md

File: /components/gdcv/GdcvRoiView.tsx

TASK: Update Col 1 KPIs to use KpiSecondaryCompact.

1. Replace the flex-col KpiSecondary with KpiSecondaryCompact calls
2. Remove layout="horizontal" prop (no longer needed)
3. Remove delta="" (not needed, delta is optional in KpiSecondaryCompact)
4. Add import: import { KpiSecondaryCompact } from "@/components/ui/kpi-secondary-compact"
5. Keep everything else unchanged

Col 1 should now have:
- KpiSecondaryCompact (Inversión Inicial)
- KpiSecondaryCompact (Ahorrado Total)

Stacked vertically with gap-6 between them.

WAIT FOR APPROVAL.
```

### **Prompt 5: Final check**
```
TASK: Verify all KPI usages across project.

1. Search for any remaining background prop on IconBadge → remove
2. Verify all KpiSecondary calls still work (backward compatible)
3. Check GdcvRoiView renders correctly with new KpiSecondaryCompact
4. Verify no TypeScript errors

No code changes needed if everything passes.

WAIT FOR APPROVAL.
```

---

## **Timeline estimado:**

| Paso | Tiempo |
|---|---|
| 1. IconBadge update | 5 min |
| 2. Create KpiSecondaryCompact | 2 min |
| 3. Update KpiSecondary | 3 min |
| 4. Update components.md | 1 min |
| 5. Update GdcvRoiView | 5 min |
| 6. Final verification | 10 min |
| **TOTAL** | **~26 minutos** |

---

## **Rollback plan (si algo sale mal):**

Si algo falla, rollback es simple:
1. Revert IconBadge a versión anterior
2. Delete KpiSecondaryCompact
3. Revert KpiSecondary a versión anterior
4. Revert GdcvRoiView a uso de KpiSecondary con `layout="horizontal"`

Todos los cambios son **aditivos o no-breaking** — fácil deshacer.

---

✅ **Ready to execute. Send to Cursor when you're ready.**

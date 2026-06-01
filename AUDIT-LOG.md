# 📋 AUDIT LOG — Inconsistencias Documentación ↔ Código
**Fecha:** Junio 1, 2026  
**Auditor:** Claude Code (Documentación)  
**Estado:** 🚨 CRÍTICO / ⚠️ MINOR

---

## 🚨 CRÍTICO: Button Shadow Inconsistency

### El Problema
**Inconsistencia en 3 lugares sobre shadows en botones:**

| Fuente | Says | Status |
|--------|------|--------|
| `components/ui/button.tsx` (código) | `shadow-xs` | ✅ Implementado |
| `context/components.md` L350 | `shadow-xs` | ✅ Correcto |
| `context/components.md` L457,469,483 (ejemplos) | `shadow-sm` | ❌ **CONTRADICE L350** |
| `context/components.md` L524 (nota agente) | `shadow-sm` | ❌ **CONTRADICE L350** |
| `context/design-system.md` L363 | `shadow-sm` | ❌ **CONTRADICE código** |

### Root Cause
En sesión anterior (May 15), usuario pidió cambiar botones a `shadow-xs`:
- ✅ Código cambió (button.tsx usa shadow-xs)
- ✅ components.md L350 actualizado a shadow-xs
- ❌ design-system.md L363 **NO fue actualizado**
- ❌ components.md ejemplos (L457,469,483) **NO fueron sincronizados**
- ❌ components.md nota agente (L524) **NO fue corregida**

### Fix Needed
**Archivo: `context/design-system.md`**
- L355: cambiar `Shadow: shadow-sm` → `Shadow: shadow-xs`
- L360: cambiar `Shadow: shadow-sm` → `Shadow: shadow-xs`
- L363: cambiar `Todos los botones de acción llevan shadow-sm sin excepción.` → `Todos los botones de acción llevan shadow-xs sin excepción.`

**Archivo: `context/components.md`**
- L457: cambiar `className="shadow-sm"` → `className="shadow-xs"`
- L469: cambiar `className="gap-1.5 shadow-sm"` → `className="gap-1.5 shadow-xs"`
- L483: cambiar `className="size-8 shadow-sm"` → `className="size-8 shadow-xs"`
- L524: cambiar `- Siempre usar shadow-sm en botones de acción — es regla de design-system.md` → `- Siempre usar shadow-xs en botones de acción`

---

## ⚠️ MINOR: TabsForBlocks Shadow Mismatch

### El Problema
`context/components.md` L561 dice:
```
| Tab activo — shadow | sm | `data-[state=active]:shadow-sm` |
```

Pero en `components/ui/tabs-for-blocks.tsx` línea ~120:
```tsx
"data-[state=active]:bg-white data-[state=active]:shadow-xs ..."
```

### Status
- Código implementa: `shadow-xs`
- Documentación dice: `shadow-sm`

### Fix Needed
**Archivo: `context/components.md`**
- L561: cambiar `| Tab activo — shadow | sm | `data-[state=active]:shadow-sm` |` → `| Tab activo — shadow | xs | `data-[state=active]:shadow-xs` |`

---

## ✅ MINOR: Ghost Button Documentation is Correct

Usuario ya solicitó (May 15) remover la regla rígida "NO USE ghost".

**Status:** ✅ Correcto — components.md L499-502 documenta cuándo usar ghost sin prohibiciones.

---

## 📋 CHECKLIST — Correcciones Necesarias

### design-system.md (3 cambios)
- [ ] L355: shadow-sm → shadow-xs (Primary button)
- [ ] L360: shadow-sm → shadow-xs (Secondary button)
- [ ] L363: "shadow-sm sin excepción" → "shadow-xs sin excepción"

### components.md (5 cambios)
- [ ] L457: shadow-sm → shadow-xs (ejemplo header button)
- [ ] L469: shadow-sm → shadow-xs (ejemplo primary button)
- [ ] L483: shadow-sm → shadow-xs (ejemplo tabla button)
- [ ] L524: shadow-sm → shadow-xs (nota agente)
- [ ] L561: shadow-sm → shadow-xs (TabsForBlocks spec)

---

## 🏗️ Recomendación de Proceso

Para evitar futuros desajustes:

1. **Regla:** Cambios de código → actualizar TODOS los archivos de documentación que referencien esa regla
2. **Validación:** Antes de commit, grep -r "shadow-sm" components/ y verificar que design-system.md y components.md digan lo mismo
3. **Pattern:** Mantener esta auditoría actualizada semanalmente durante development

---

## Estado Actual del Proyecto

**Componentes auditados:**
- ✅ Button (mismatch shadow documentado — pendiente fix)
- ✅ TabsForBlocks (mismatch shadow menor — pendiente fix)
- ✅ CardWithResponsiveTabs (nuevo, documentado)
- ✅ Spacing responsivo mobile (documentado en design-system.md)
- ⏳ Pendiente: KPIs, Charts, Design Tokens

**Cambios de código documentados (Cursor):**
- ✅ `gap-4 sm:gap-6` en wrappers mobile — design-system.md + components.md + .cursorrules
- ✅ `CardWithResponsiveTabs` — components.md §17b
- ✅ Bug fix: orden title/controls en header de chart

**Próximos pasos:**
1. Corregir mismatches shadow-xs / shadow-sm (8 cambios mecánicos en design-system.md + components.md)
2. Auditar: KPIs, Charts colors

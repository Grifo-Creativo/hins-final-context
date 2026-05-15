# 🧠 MEMORY — Contexto Persistente del Proyecto HINS

**Last updated:** 2026-05-14  
**Scope:** Arquitectura, patrones validados, decisiones clave, y lecciones aprendidas

---

## 1. PROYECTO: HINS (Plataforma de Monitoreo de Parques Fotovoltaicos)

### Descripción
- **Tipo:** B2B — Plataforma web de visibilidad y monitoreo (no ejecuta acciones sobre la red)
- **Stack:** Next.js + TypeScript + shadcn/ui + Tailwind CSS v4 + Recharts
- **Usuarios:** Admin HINS, Dueño GDD, AGC (GDCV/GDC), Socios/Cesionarios
- **Modelos de negocio:** GDD (Distribuidor), GDC (Comunitario), GDCV (Comunitario Virtual)

### URLs de referencia
- **Documentación:** `/context/` directorio
- **Specs exactas de componentes:** `/context/components.md` ← **FUENTE DE VERDAD**
- **Design tokens:** `/context/design-system.md`
- **Producto/negocio:** `/context/product-context.md`
- **Flujos:** `/flows/[tipo]/flow.md` (GDD/, GDCV-agc/, GDCV-socio/, main/)

---

## 2. ARQUITECTURA NAVEGACIÓN — PATRÓN ALINEADO ✅

### Decisión: Main alineado con GDD/GDCV (2026-05-14)

**Problema:** Main tenía arquitectura inconsistente con GDD/GDCV
- GDD/GDCV: layout.tsx (estructura) + Header (componente) + page.tsx (contenido)
- Main: MainLayoutShell inline (mezclaba sidebar + header)

**Solución ejecutada:**
```
Step 1: Crear app/main/layout.tsx
        └─ MainLayoutShell + MainHeader + PageTransition

Step 2: Limpiar MainLayoutShell.tsx
        └─ Remover 45 líneas de header inline
        └─ Mantener SOLO lógica de sidebar

Step 3: Simplificar app/main/page.tsx
        └─ Remover wrapper, solo ProjectsView
```

**Resultado:**
- ✅ Header height: h-11 (44px) — **igual en Main / GDD / GDCV**
- ✅ Patrón Next.js estándar en todas las vistas
- ✅ MainHeader.tsx reutilizado (no dead code)
- ✅ Separación de concerns: Layout → Shell → Header → Main Content
- ✅ Código más limpio: -47 líneas netas

**Commit:** `411279c` — "refactor: align Main navigation architecture with GDD/GDCV pattern"

---

## 3. PATRÓN DE COMPONENTES — REUTILIZACIÓN OBLIGATORIA ✅

### Regla Core
**NO reinventar la rueda.** Todo usa `@components/ui` y patrones de GDD/GDCV.

### Componentes validados
- **Layout Shell:** MainLayoutShell, GddLayoutShell, GdcvLayoutShell (misma lógica)
- **Headers:** MainHeader, GddHeader, GdcvHeader (misma altura h-11, misma estructura)
- **Sidebar:** MainSidebar, GddSidebar, GdcvSidebar (SidebarProvider + NavUser footer)
- **Data Tables, KPIs, Charts:** Definidos en `/context/components.md`

### Flujo de uso
1. Revisar `/context/components.md` si existe el componente
2. Usar el código exacto documentado (no modificar)
3. Si NO existe → crear siguiendo patrón de componentes existentes
4. Nunca hardcodear HTML que debería ser componente

---

## 4. SIDEBAR PATTERN — VALIDADO ✅

### Estructura correcta (Main / GDD / GDCV)
```tsx
<SidebarProvider>
  <MainSidebar />  {/* o GddSidebar / GdcvSidebar */}
  <SidebarInset>
    <Header />
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

### Componentes del Sidebar
- **Header:** Logo + Subtitle (p.ej. "Admin")
- **Nav Items:** Solo items activos (remover disabled items)
- **Footer:** NavUser component (avatar + username + dropdown)

### Advertencia ⚠️
- ❌ NO agregar items disabled o "próximamente"
- ❌ NO mezclar shell logic con header logic
- ❌ NO usar h-14 para headers (usar h-11)

---

## 5. HEADER PATTERN — VALIDADO ✅

### Altura correcta
- **Standard:** `h-11` (44px)
- **Nunca:** `h-14` (56px)

### Estructura
```tsx
<div className="flex h-11 items-center gap-4">
  <SidebarTrigger />
  <Breadcrumb />           {/* si aplica */}
  <div className="flex-1" />
  <Button size="icon">Search</Button>
  <Button size="icon">Bell (notificaciones)</Button>
  <Avatar />
</div>
```

### Componentes reutilizables
- `Breadcrumb` — mostrar navegación (Main muestra "Proyectos", GDD muestra "Proyectos > Parque")
- `Sheet` — para notificaciones panel
- `Avatar` — user info dropdown

---

## 6. DESIGN SYSTEM — REGLAS ESTRICTAS ✅

### Colores
- **Primary/UI:** Zinc (monocromático) — botones, texto, bordes
- **Charts:** Green ramp (`--chart-1` a `--chart-5`) — SOLO para gráficos
- **NO mezclar:** Charts colors en UI, o viceversa

### Tokens NUNCA hardcodear
- `--background`, `--foreground`, `--primary`, `--border`, `--chart-*`
- Usar clases Tailwind: `bg-background`, `text-foreground`, etc.

### Espaciado
- Usar escala de Tailwind: `p-4`, `gap-2`, etc.
- Design system completo en `/styles/globals.css`

---

## 7. LECCIONES APRENDIDAS — NO REPETIR ❌

### Mistake 1: Header inline en shell
**Problema:** MainLayoutShell tenía 45 líneas de header → dificulta mantenimiento, repetición de código
**Solución:** Separar en componente MainHeader, importar en layout.tsx
**Aplicar a:** Cualquier nueva shell/layout

### Mistake 2: Diferentes alturas de header
**Problema:** Main h-14, GDD/GDCV h-11 → inconsistencia visual
**Solución:** Standarizar en h-11 globalmente
**Aplicar a:** Revisar TODOS los headers en el proyecto

### Mistake 3: Items disabled en sidebar
**Problema:** MainSidebar tenía 4 items deshabilitados → confunde UX, ocupa espacio
**Solución:** Remover items disabled, agregar solo cuando está listo
**Aplicar a:** Quitar items "próximamente" o "bajo construcción"

### Mistake 4: Reutilizar MainHeader sin usarlo
**Problema:** MainHeader.tsx existía pero no se importaba → dead code
**Solución:** Eliminar archivos no usados o usarlos correctamente
**Aplicar a:** Revisar regularmente code que no se importa

---

## 8. GIT WORKFLOW — COMMITS LIMPIOS ✅

### Formato de commit
```
refactor: [descripción breve]
  
- Bullet point 1: qué cambió
- Bullet point 2: por qué
- Bullet point 3: resultado

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Commits importantes del proyecto
- `411279c` — Navigation consistency alignment (Main / GDD / GDCV)

---

## 9. PROCEDIMIENTO ANTES DE GENERAR CÓDIGO

### Siempre en este orden:
1. ✅ Leer `/context/product-context.md` — qué es HINS, modelos, usuarios
2. ✅ Leer `/context/design-system.md` — tokens, no hardcodear
3. ✅ Leer `/context/components.md` — spec exacta, reutilizar
4. ✅ Leer `/context/ux-guidelines.md` — jerarquía, patrones UX
5. ✅ Leer `/engineering/tech-stack.md` — stack, convenciones
6. ✅ Leer `/flows/[tipo]/flow.md` — estructura de la vista específica

### Si hay conflicto entre documentos:
- **Precedencia:** components.md > design-system.md > ux-guidelines.md > product-context.md

---

## 10. VERIFICACIÓN POST-CÓDIGO ✅

Después de implementar cualquier vista:

```
Visual:
  ☐ Header altura = h-11 (comparar con GDD/GDCV)
  ☐ Colores = tokens, no hex hardcodeados
  ☐ Spacing = Tailwind, no inline styles
  ☐ Responsive = mobile/tablet/desktop OK
  ☐ Sidebar collapsible funciona

Técnico:
  ☐ Sin errores en consola
  ☐ TypeScript strict (sin any)
  ☐ Componentes tipados correctamente
  ☐ Imports = rutas exactas, no relativos
  ☐ next/link para navegación interna

Accesibilidad:
  ☐ Contraste >= 4.5:1 (WCAG AA)
  ☐ Roles ARIA correctos
  ☐ Navegación keyboard
```

---

## 11. ARCHIVOS CRÍTICOS — REFERENCIAS RÁPIDAS

| Archivo | Propósito | Prioridad |
|---------|-----------|-----------|
| `/context/components.md` | Spec exacta de componentes | ⭐⭐⭐ |
| `/context/product-context.md` | Qué es HINS, modelos, usuarios | ⭐⭐⭐ |
| `/context/design-system.md` | Tokens, colores, spacing | ⭐⭐ |
| `/engineering/tech-stack.md` | Stack, convenciones | ⭐⭐ |
| `/context/ux-guidelines.md` | Patrones UX, anti-patterns | ⭐⭐ |
| `/flows/[tipo]/flow.md` | Estructura de vista específica | ⭐⭐ |
| `.cursorrules` | Orden de lectura, reglas | ⭐ |

---

## 12. CONTACTO / PREFERENCIAS DEL USUARIO

- **Usuario:** Designer + non-developer (Lee arquitectura, no código)
- **Estilo:** Directo, sin rodeos, explicar el "por qué"
- **Validación:** Mostrar cambios en browser antes de confirmar
- **Git:** Commits con mensajes claros y puntos

---

**Next steps:**
- Continuar con GDD_02 (ROI) si está en scope
- Implementar GDCV-agc y GDCV-socio vistas
- Configurar repo remoto (mencionado por usuario)

# 🎯 PLAN DE ACCIÓN: Consistencia en Navegación (Shell + Sidebar)

**Objetivo:** Alinear Main navigation con GDD/GDCV  
**Scope:** SOLO Shell Architecture + Header + Sidebar  
**NO tocar:** Componentes @ui, ProjectsView, contenido de vistas  
**Resultado:** Misma altura, misma estructura, misma UX en todas las vistas

---

## 1. PROBLEMA RAÍZ

### Estado actual:

```
Main:
  ❌ Header height: h-14 (56px)
  ❌ Header: INLINE en MainLayoutShell
  ❌ NO tiene app/main/layout.tsx
  ❌ MainHeader.tsx existe pero sin usar
  ❌ Mezcla shell + header en mismo componente

GDD/GDCV:
  ✅ Header height: h-11 (44px)
  ✅ Header: Componente separado (GddHeader/GdcvHeader)
  ✅ Tiene app/gdd/layout.tsx y app/gdcv/layout.tsx
  ✅ Patrón Next.js estándar
  ✅ Separación de concerns
```

---

## 2. PLAN DE 3 PASOS

### PASO 1: Crear `app/main/layout.tsx` (New File)

**Archivo a crear:** `app/main/layout.tsx`

```typescript
// app/main/layout.tsx
import type { ReactNode } from "react"

import { MainHeader } from "@/components/layout/MainHeader"
import { MainLayoutShell } from "@/components/layout/MainLayoutShell"
import { PageTransition } from "@/components/ui/page-transition"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayoutShell>
      <MainHeader />
      <main className="flex-1 px-6 py-6 bg-[#F2ECE9]/36">
        <PageTransition>{children}</PageTransition>
      </main>
    </MainLayoutShell>
  )
}
```

**Por qué:**
- Sigue patrón IDÉNTICO a gdcv/layout.tsx y gdd/layout.tsx
- Importa MainHeader como componente separado
- Usa PageTransition para consistencia
- Estructura clara: layout → header → main

**Archivos afectados:** 1 (nuevo)

---

### PASO 2: Modificar `MainLayoutShell.tsx` (Remove header, reduce height)

**Cambios en:** `components/layout/MainLayoutShell.tsx`

```diff
"use client"

import type { ReactNode } from "react"

import { MainSidebar } from "@/components/layout/MainSidebar"
- import { Avatar, AvatarFallback } from "@/components/ui/avatar"
- import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
- import { BellIcon, SearchIcon } from "lucide-react"

export function MainLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <MainSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
-       <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
-         <SidebarTrigger className="-ml-1" />
-         <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
-           <Button
-             type="button"
-             variant="ghost"
-             size="icon"
-             className="text-muted-foreground"
-             aria-label="Buscar"
-           >
-             <SearchIcon className="size-5" aria-hidden />
-           </Button>
-           <Button
-             type="button"
-             variant="ghost"
-             size="icon"
-             className="relative text-muted-foreground"
-             aria-label="Notificaciones"
-           >
-             <BellIcon className="size-5" aria-hidden />
-             <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
-           </Button>
-           <div className="ml-1 flex items-center gap-2 border-l border-border pl-3 sm:ml-2">
-             <Avatar className="size-9 rounded-full">
-               <AvatarFallback className="rounded-full text-xs font-medium">
-                 HU
-               </AvatarFallback>
-             </Avatar>
-             <div className="hidden min-w-0 sm:block">
-               <p className="truncate text-sm font-medium leading-none text-foreground">
-                 HINS Usr
-               </p>
-               <p className="mt-0.5 truncate text-xs text-muted-foreground">Admin</p>
-             </div>
-           </div>
-         </div>
-       </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

**Resultado:**
```typescript
// Nuevo MainLayoutShell.tsx (limpio)

"use client"

import type { ReactNode } from "react"

import { MainSidebar } from "@/components/layout/MainSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function MainLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <MainSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

**Por qué:**
- MainLayoutShell ahora SOLO maneja sidebar logic
- Header delegado a MainHeader (componente separado)
- Mismo patrón que GddLayoutShell/GdcvLayoutShell
- Más limpio, más reutilizable

**Archivos afectados:** 1 (modificado)
**Líneas eliminadas:** ~45 (todo el header inline)
**Líneas agregadas:** 0

---

### PASO 3: Modificar `app/main/page.tsx` (Remove MainLayoutShell wrapper)

**Cambios en:** `app/main/page.tsx`

```diff
- import { MainLayoutShell } from "@/components/layout/MainLayoutShell"
import { ProjectsView } from "@/components/main/ProjectsView"

export default function MainPage() {
  return (
-   <MainLayoutShell>
-     <ProjectsView />
-   </MainLayoutShell>
+   <ProjectsView />
  )
}
```

**Por qué:**
- MainLayoutShell ahora está en app/main/layout.tsx (donde pertenece)
- page.tsx solo renderiza el contenido
- Patrón Next.js estándar: layout.tsx (estructura) + page.tsx (contenido)

**Archivos afectados:** 1 (modificado)
**Líneas eliminadas:** 2 (imports)
**Líneas agregadas:** 0

---

## 3. COMPARACIÓN ANTES/DESPUÉS

### ANTES (Estructura inconsistente):

```
app/main/page.tsx
├── <MainLayoutShell>
│   ├── <MainSidebar />
│   ├── <header>              ← INLINE (56px)
│   │   ├── Search
│   │   ├── Bell
│   │   └── Avatar
│   └── <main>
│       └── <ProjectsView />
```

### DESPUÉS (Estructura consistente):

```
app/main/layout.tsx
├── <MainLayoutShell>
│   ├── <MainSidebar />
│   └── {children}
│
app/main/page.tsx
├── <MainHeader />             ← COMPONENTE
├── <main className="...">
│   ├── <PageTransition>
│   │   └── <ProjectsView />

RESULTADO: Header height h-11 (44px) — IGUAL que GDD/GDCV
```

---

## 4. IMPACTO DE CAMBIOS

### Archivos a crear:
```
✅ app/main/layout.tsx (nuevo — 17 líneas)
```

### Archivos a modificar:
```
✅ components/layout/MainLayoutShell.tsx (eliminar 45 líneas)
✅ app/main/page.tsx (eliminar 2 líneas)
```

### Archivos a REUTILIZAR (no crear):
```
✅ components/layout/MainHeader.tsx (YA EXISTE — solo importar)
✅ components/ui/page-transition.tsx (YA EXISTE — solo importar)
```

### Total cambios:
```
Líneas agregadas:   17
Líneas eliminadas:  47
Líneas netas:       -30 (más limpio)
Archivos nuevos:    1
Archivos modificados: 2
Archivos creados de cero: 0
```

---

## 5. RESULTADO FINAL

### Header Height:
```
GDD:    h-11 (44px)
GDCV:   h-11 (44px)
Main:   h-11 (44px)  ← ALINEADO ✅
```

### Architecture:
```
GDD:    layout.tsx + GddHeader + page.tsx
GDCV:   layout.tsx + GdcvHeader + page.tsx
Main:   layout.tsx + MainHeader + page.tsx  ← ALINEADO ✅
```

### Separación de Concerns:
```
Antes:
  MainLayoutShell = Shell + Header → TOO MUCH
  
Después:
  MainLayoutShell = Shell only → SINGLE RESPONSIBILITY ✅
  MainHeader = Header only → SINGLE RESPONSIBILITY ✅
```

### Code Cleanliness:
```
Antes:  45 líneas de header inline en shell
Después: 0 líneas de header inline → Reutiliza MainHeader.tsx ✅
```

---

## 6. VALIDACIÓN POST-CAMBIOS

Después de implementar, validar:

```bash
✅ Visual checks:
  - [ ] Header height mismo en /main, /gdd/performance, /gdcv/performance
  - [ ] Sidebar collapsible funciona igual en todas
  - [ ] Breadcrumb renders igual
  - [ ] Notifications sheet funciona igual
  - [ ] User avatar display igual
  
✅ Technical checks:
  - [ ] No errores en consola
  - [ ] app/main/layout.tsx se importa correctamente
  - [ ] MainHeader renderiza sin errores
  - [ ] PageTransition funciona
  - [ ] Responsive igual en mobile/tablet/desktop
  
✅ Comparación:
  - [ ] /main vs /gdd/performance: Misma altura header
  - [ ] /main vs /gdcv/performance: Misma altura header
  - [ ] Sidebar behavior idéntico
```

---

## 7. VENTAJAS DE ESTE PLAN

### ✅ Consistencia Visual:
- Mismo header height en todas las vistas
- Mismo patrón de navegación
- Mismo espaciado y proporciones

### ✅ Consistencia Arquitectónica:
- Patrón Next.js estándar (layout.tsx + page.tsx)
- Separación de responsabilidades
- Fácil de mantener y extender

### ✅ Code Quality:
- Eliminación de 47 líneas innecesarias
- Reutilización de MainHeader.tsx (no dead code)
- Patrón idéntico a GDD/GDCV

### ✅ Zero Risk:
- No toca @ui componentes
- No toca ProjectsView
- No toca lógica de negocio
- Solo reorganiza estructura existente

---

## 8. TIMELINE

```
Paso 1: Crear app/main/layout.tsx          ~2 min
Paso 2: Modificar MainLayoutShell.tsx      ~3 min
Paso 3: Modificar app/main/page.tsx        ~1 min
Pruebas visuales:                          ~5 min
─────────────────────────────────────────
TOTAL:                                     ~11 minutos
```

---

## 9. ROLLBACK (Si algo sale mal)

```bash
# Fácil revertir:
git revert [commit-hash]

# O editar manualmente:
- Eliminar app/main/layout.tsx
- Restaurar MainLayoutShell.tsx a versión anterior
- Restaurar app/main/page.tsx a versión anterior
```

**Riesgo:** BAJO (solo restructuración, no cambios lógicos)

---

## 10. CONCLUSIÓN

### Este plan:
✅ Alinea Main con GDD/GDCV  
✅ Usa componentes existentes  
✅ Sigue patrón Next.js estándar  
✅ Reduce código innecesario  
✅ Riesgo bajo  
✅ Fácil de implementar  

### Resultado esperado:
```
Antes: 68% alineación
Después: 95% alineación (¡Solo falta ajustes menores!)
```

---

**¿Apruebas este plan?**

Si es sí, puedo ejecutarlo:
1. ✅ Crear app/main/layout.tsx
2. ✅ Modificar MainLayoutShell.tsx
3. ✅ Modificar app/main/page.tsx
4. ✅ Hacer commit
5. ✅ Validar visualmente en navegador

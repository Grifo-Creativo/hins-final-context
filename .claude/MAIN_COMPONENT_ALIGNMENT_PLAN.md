# 🔧 PLAN DE ALINEACIÓN DE COMPONENTES — MAIN

**Objetivo:** Garantizar que Main use EXACTAMENTE los mismos componentes que gdcv/gdd  
**Status:** PRE-EJECUCIÓN — Awaiting approval  
**Backup:** ✅ Guardado en commit `ed73dc4`

---

## 📋 ANÁLISIS DE COMPONENTES COMPARTIDOS

### Componentes que USA gdcv/gdd:

```
✅ Sidebar (ui/sidebar.tsx)
   - SidebarHeader
   - SidebarContent
   - SidebarGroup
   - SidebarGroupLabel
   - SidebarGroupContent
   - SidebarMenu
   - SidebarMenuItem
   - SidebarMenuButton
   - SidebarFooter
   - SidebarRail

✅ NavUser (components/nav-user.tsx)
   - Avatar (ui/avatar.tsx)
   - DropdownMenu (ui/dropdown-menu.tsx)
   - SidebarMenu / SidebarMenuItem / SidebarMenuButton (ui/sidebar.tsx)

✅ Lucide Icons:
   - LayoutDashboardIcon
   - TrendingUpIcon
   - ZapIcon

✅ React/Next standard:
   - Link from next/link
   - usePathname from next/navigation
```

### Componentes que USA Main ACTUALMENTE:

```
✅ Sidebar (ui/sidebar.tsx) — OK
   - SidebarHeader
   - SidebarContent
   - SidebarGroup
   - SidebarGroupLabel
   - SidebarGroupContent
   - SidebarMenu
   - SidebarMenuItem
   - SidebarMenuButton
   - SidebarRail

❌ NO TIENE: SidebarFooter (FALTA)
❌ NO TIENE: NavUser (FALTA)

✅ Avatar (ui/avatar.tsx) — OK
✅ Button (ui/button.tsx) — OK
✅ TabsForBlocks (ui/tabs-for-blocks.tsx) — OK
✅ Card (ui/card.tsx) — OK
✅ SoftBadge (ui/soft-badge.tsx) — OK

❌ TIENE: MainFooter (components/main/MainFooter.tsx) — DEBE ELIMINAR
❌ TIENE: Badge (ui/badge.tsx) — Solo para items deshabilitados, ELIMINAR

✅ Lucide Icons:
   - LayoutDashboardIcon
   - PlusCircleIcon
   - SearchIcon
   - BellIcon
   - DownloadIcon
   - DollarSignIcon
   - TrendingUpIcon

✅ React/Next:
   - Link, usePathname
   - useMemo, useState
```

---

## ✅ GARANTÍAS — LO QUE CAMBIAREMOS

### 1. MainSidebar.tsx

#### ❌ Eliminará:
```tsx
- import { Badge } from "@/components/ui/badge"
- import { BriefcaseIcon, ChevronRightIcon, UsersIcon } from "lucide-react"
- All <SidebarMenuItem> with disabled items
  - "Section 2"
  - "Section 3"
  - "Section N" + Badge
  - "Customers"
  - "Staff Management"
```

#### ✅ Agregará:
```tsx
+ import { NavUser } from "@/components/nav-user"
+ <SidebarFooter>
+   <NavUser user={{ name: "HINS Admin", email: "admin@hins.example", avatar: "" }} />
+ </SidebarFooter>
```

#### ✅ Modificará header:
```tsx
// De:
<div className="flex size-9 flex-shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar text-sm font-bold">
  H
</div>

// A:
<div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
  <LayoutDashboardIcon className="size-4" aria-hidden />
</div>

// De:
<span className="truncate font-semibold">HINS</span>

// A:
<span className="truncate font-medium">HINS</span>
<span className="truncate text-xs text-muted-foreground">Admin</span>
```

#### ✅ Modificará item del menú:
```tsx
// De:
<span className="font-medium">Dashboard</span>

// A:
<span>Proyectos</span>
```

#### ✅ Modificará label:
```tsx
// De:
<SidebarGroupLabel>Menú</SidebarGroupLabel>

// A:
<SidebarGroupLabel>Navegación</SidebarGroupLabel>
```

---

### 2. MainLayoutShell.tsx

#### ❌ Eliminará:
```tsx
- import { MainFooter } from "@/components/main/MainFooter"
- <MainFooter />
```

#### ✅ Modificará estructura:
```tsx
// De:
<div className="flex min-h-0 flex-1 flex-col bg-[#F2ECE9]/36">
  <div className="flex min-h-0 flex-1 flex-col px-6 py-6">{children}</div>
  <MainFooter />
</div>

// A (como en gdcv/gdd):
<main className="flex-1 px-6 py-6 bg-[#F2ECE9]/36">
  {children}
</main>
```

---

### 3. MainFooter.tsx

#### ❌ Archivo:
```
- DEJAR TAL CUAL (por si se necesita en futuro)
- PERO NO SE IMPORTARÁ ni usará en ningún lado
```

---

## 📊 TABLA DE VALIDACIÓN — COMPONENTES

### Después de los cambios:

| Componente | Tipo | Main | Gdcv | Gdd | ¿Alineado? |
|-----------|------|------|------|-----|-----------|
| **Sidebar** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **SidebarHeader** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **SidebarContent** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **SidebarFooter** | @ui | ✅ NUEVO | ✅ | ✅ | ✅ SÍ |
| **SidebarGroup** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **SidebarMenu** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **NavUser** | custom | ✅ NUEVO | ✅ | ✅ | ✅ SÍ |
| **Avatar** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **Button** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **TabsForBlocks** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **Card** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **SoftBadge** | @ui | ✅ | ✅ | ✅ | ✅ SÍ |
| **Badge** | @ui | ❌ ELIMINA | ✅ | ✅ | ✅ SÍ |
| **MainFooter** | custom | ❌ NO USA | — | — | ✅ CLEAN |

---

## 🔐 GARANTÍAS DE REUTILIZACIÓN

### ✅ GARANTIZADO:

1. **Mismos componentes @ui:**
   - Sidebar, SidebarFooter, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail
   - Avatar
   - Button
   - TabsForBlocks
   - Card
   - SoftBadge

2. **Mismo custom component:**
   - NavUser (que ya usa Avatar + DropdownMenu + Sidebar internos)

3. **Mismos imports:**
   - import Link from "next/link"
   - import { usePathname } from "next/navigation"
   - import { LayoutDashboardIcon, TrendingUpIcon, ZapIcon } from "lucide-react"

4. **Misma estructura:**
   - SidebarHeader (con icon + HINS + subtítulo)
   - SidebarContent (con SidebarGroup > SidebarMenu > items)
   - SidebarFooter (con NavUser)
   - SidebarRail

5. **Misma semántica HTML:**
   - \<main\> (en lugar de \<div\>)

---

## 🚀 CAMBIOS ESPECÍFICOS (LÍNEA POR LÍNEA)

### MainSidebar.tsx — 140 líneas → ~95 líneas

```typescript
// NUEVA VERSIÓN

"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon } from "lucide-react"

export function MainSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <LayoutDashboardIcon className="size-4" aria-hidden />
          </div>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">HINS</span>
            <span className="truncate text-xs text-muted-foreground">
              Admin
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/main"}
                  tooltip="Proyectos"
                >
                  <Link href="/main">
                    <LayoutDashboardIcon />
                    <span>Proyectos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={{
          name: "HINS Admin",
          email: "admin@hins.example",
          avatar: "",
        }} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
```

---

### MainLayoutShell.tsx — 63 líneas → ~55 líneas

```typescript
// NUEVA VERSIÓN

"use client"

import type { ReactNode } from "react"

import { MainSidebar } from "@/components/layout/MainSidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon, SearchIcon } from "lucide-react"

export function MainLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <MainSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              aria-label="Buscar"
            >
              <SearchIcon className="size-5" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
              aria-label="Notificaciones"
            >
              <BellIcon className="size-5" aria-hidden />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>
            <div className="ml-1 flex items-center gap-2 border-l border-border pl-3 sm:ml-2">
              <Avatar className="size-9 rounded-full">
                <AvatarFallback className="rounded-full text-xs font-medium">
                  HU
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium leading-none text-foreground">
                  HINS Usr
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 bg-[#F2ECE9]/36">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

## ✅ CHECKLIST PRE-EJECUCIÓN

Antes de hacer los cambios, validaremos:

- [ ] `NavUser` existe y está disponible en `@/components/nav-user`
- [ ] Todos los imports de sidebar están disponibles
- [ ] LayoutDashboardIcon existe en lucide-react
- [ ] No hay referencias a MainFooter en otro lado del proyecto
- [ ] No hay referencias a Badge en MainSidebar en otro lado

---

## 🔍 VALIDACIÓN POST-CAMBIOS

Después de aplicar cambios, verificaremos:

```bash
# ✅ Checks:
- [ ] No errores de TypeScript
- [ ] No errores en consola del navegador
- [ ] Sidebar render sin errores
- [ ] NavUser muestra dropdown correcto
- [ ] Footer con usuario aparece en sidebar
- [ ] Header del sidebar tiene icon + "HINS" + "Admin"
- [ ] Solo 1 item activo: "Proyectos"
- [ ] No items deshabilitados visibles
- [ ] Responsivo: colapsa en mobile
- [ ] Link a /main funciona
```

---

## 📋 RESUMEN EJECUCIÓN

### Archivos a modificar:
1. `components/layout/MainSidebar.tsx` — Reescribir ~90% del contenido
2. `components/layout/MainLayoutShell.tsx` — Cambiar estructura main + eliminar import

### Archivos a dejar:
1. `components/main/MainFooter.tsx` — No se elimina (puede necesitarse después)

### Archivos no afectados:
- `components/main/ProjectsView.tsx`
- `components/main/ProjectCard.tsx`
- Toda la arquitectura de gdcv/gdd
- Todos los archivos @ui
- Todos los custom components

---

## 🎯 OBJETIVO FINAL

**Main Page después de los cambios:**

```
✅ Usa EXACTAMENTE los mismos componentes que gdcv/gdd
✅ Reutiliza NavUser (custom component compartido)
✅ Reutiliza todos los @ui/sidebar componentes
✅ Mismo patrón visual y estructural
✅ Misma información de usuario en footer
✅ Sin elementos deshabilitados o innecesarios
✅ Código limpio y mantenible
```

---

## ⚠️ RIESGOS IDENTIFICADOS

**BAJO:**
- Cambios aislados a 2 archivos
- No afectan funcionalidad
- Backup guardado
- Fácil de revertir

**MITIGATION:**
- Probar visualmente después
- Validar en navegador
- Comparar visualmente con gdcv/gdd

---

**Estado:** 🟡 AWAITING APPROVAL  
**Backup:** ✅ `ed73dc4`  
**Tiempo estimado:** 15 minutos  
**Riesgo:** BAJO  
**Reversibilidad:** ALTA (git revert)

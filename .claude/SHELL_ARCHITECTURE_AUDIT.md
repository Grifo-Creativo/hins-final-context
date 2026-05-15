# 🔍 AUDITORÍA: Shell Architecture Differences (Main vs GDD vs GDCV)

**Objetivo:** Analizar por qué Main, GDD y GDCV tienen shells diferentes  
**Status:** AUDITORÍA SOLO — NO EJECUTAR CAMBIOS  
**Hallazgo:** Arquitectura inconsistente entre vistas

---

## 1. COMPARACIÓN DE STRUCTURES

### GDD / GDCV (PATRÓN ESTÁNDAR)

```
app/gdcv/layout.tsx
├── <GdcvLayoutShell>
│   ├── <GdcvSidebar />
│   └── <SidebarInset>
│       └── {children}
│
app/gdcv/performance/page.tsx
├── <GdcvPageHeading />
├── <GdcvPerformanceView />
```

**Donde está el Header:**
```
gdcv/layout.tsx (NO — Ver app/gdcv/layout.tsx)
```

Revisando app/gdcv/layout.tsx:
```tsx
<GdcvLayoutShell>
  <GdcvHeader />           ← HEADER IMPORTADO AQUÍ
  <main>
    <PageTransition>{children}</PageTransition>
  </main>
</GdcvLayoutShell>
```

---

### MAIN (PATRÓN ACTUAL — INCONSISTENTE)

```
app/main/page.tsx
├── <MainLayoutShell>
│   ├── <MainSidebar />
│   ├── <header>          ← HEADER INLINE
│   │   ├── SidebarTrigger
│   │   ├── Search Button
│   │   ├── Bell Button
│   │   └── Avatar
│   └── <main>
│       └── <ProjectsView />
```

**Donde está el Header:**
- INLINE en MainLayoutShell.tsx (líneas 18-54)
- NO tiene componente separado MainHeader (aunque existe pero no se usa)

---

## 2. ALTURA DEL HEADER (el problema que notaste)

### GDD / GDCV Header Height

```tsx
// GddHeader.tsx, línea 37
<div className="flex h-11 items-center ..." >

// GdcvHeader.tsx, línea 28  
<div className="flex h-11 items-center ..." >

// MainHeader.tsx, línea 30
<div className="flex h-11 items-center ..." >
```

**Todos usan `h-11` (44px)**

---

### MAIN Layout Shell Header Height

```tsx
// MainLayoutShell.tsx, línea 17 (INLINE)
<header className="flex h-14 shrink-0 items-center ..." >
```

**Main usa `h-14` (56px)** ← 12px MÁS ALTO

---

## 3. TABLA COMPARATIVA DETALLADA

| Aspecto | GDD/GDCV | Main | ¿Alineado? |
|---------|----------|------|-----------|
| **Shell component** | GddLayoutShell / GdcvLayoutShell | MainLayoutShell | ❌ Diferente |
| **Header archivo** | Componente separado (GddHeader.tsx / GdcvHeader.tsx) | INLINE en Shell | ❌ NO |
| **Header height** | `h-11` (44px) | `h-14` (56px) | ❌ NO |
| **Sidebar component** | GddSidebar / GdcvSidebar | MainSidebar | ✅ Patrón OK |
| **Main content** | `<main>` | `<main>` | ✅ OK |
| **Breadcrumb** | Mostra parque + "Proyectos" | Solo "Proyectos" | ⚠️ Diferente |
| **Notifications** | Sheet con GddNotificationsPanel | Sheet vacío | ⚠️ Diferente |

---

## 4. DIFERENCIAS ESPECÍFICAS

### Problema 1: Header INLINE vs COMPONENTE

**GDD/GDCV Pattern:**
```tsx
// gdd/layout.tsx
export default function GddLayout({ children }) {
  return (
    <GddLayoutShell>
      <GddHeader />              ← COMPONENTE SEPARADO
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
    </GddLayoutShell>
  )
}
```

**Main Pattern:**
```tsx
// MainLayoutShell.tsx (component file)
export function MainLayoutShell({ children }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <MainSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
        <header className="flex h-14 ...">   ← INLINE HTML
          {/* header content */}
        </header>
        
        <main className="flex-1 px-6 py-6 ...">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

**Implicación:**
- ❌ Main mezcla shell logic + header en el mismo componente
- ✅ GDD/GDCV separan concerns (shell vs header)
- ❌ Dificulta reutilización
- ❌ Dificulta mantenimiento

---

### Problema 2: Header Height (`h-14` vs `h-11`)

**GDD/GDCV:**
```tsx
<div className="flex h-11 items-center justify-between ..." >
  {/* 44px height */}
</div>
```

**Main:**
```tsx
<header className="flex h-14 shrink-0 items-center gap-4 ..." >
  {/* 56px height */}
</header>
```

**Visual impact:**
- Main header es 12px más alto
- Menos espacio para contenido principal
- Inconsistencia visual entre vistas

---

### Problema 3: No usa el componente MainHeader

**Existe el archivo:**
```
components/layout/MainHeader.tsx
```

**Pero Main NO lo importa.** En su lugar, tiene el header inline en MainLayoutShell.

**MainHeader tiene:**
- Breadcrumb component (igual que GDD/GDCV)
- Sheet para notificaciones
- Avatar user info
- Todo estructurado igual que GddHeader/GdcvHeader

**Pero nunca se usa.**

---

### Problema 4: Estructura de app/gdcv vs app/main

**GDD Pattern:**
```
app/gdd/layout.tsx
├── <GddLayoutShell>
├── <GddHeader />           ← En el layout
└── <main>

app/gdd/performance/page.tsx
├── <GddHeader />           ← Importado en layout.tsx
├── Children renderizados
```

**Main Pattern:**
```
app/main/page.tsx (MONOLÍTICO)
├── <MainLayoutShell>       ← Shell + Header + Main todo junto
│   ├── <MainSidebar />
│   ├── <header>            ← Inline
│   ├── <main>
│   │   └── <ProjectsView />
```

**Main NO tiene:**
```
app/main/layout.tsx
```

---

## 5. RAÍCES DE LA INCONSISTENCIA

### Por qué GDD/GDCV son así:

✅ Tienen `app/gdd/layout.tsx` y `app/gdcv/layout.tsx`  
✅ Separan GddLayoutShell (solo sidebar logic)  
✅ Importan GddHeader en el layout  
✅ Importan PageTransition para animaciones  
✅ Patrón Next.js estándar: layout.tsx + page.tsx

---

### Por qué Main es diferente:

❌ NO tiene `app/main/layout.tsx`  
❌ Todo está en `app/main/page.tsx` + `MainLayoutShell` component  
❌ MainLayoutShell tiene header INLINE (no separado)  
❌ No usa el componente MainHeader que existe  
❌ Header height inconsistente (`h-14` vs `h-11`)

---

## 6. IMPACTO

### Visual / UX:
- ❌ Header de Main es 12px más alto → toma más espacio
- ⚠️ Usuarios verán diferente entre Main y otras vistas
- ❌ Falta consistencia en altura de chrome

### Técnico / Mantenibilidad:
- ❌ MainLayoutShell hace demasiado (shell + header + main layout)
- ❌ Difícil de reutilizar solo la shell sin el header
- ❌ MainHeader.tsx existe pero es "dead code"
- ❌ No sigue patrón Next.js estándar

### Consistencia de Proyecto:
- ❌ GDD/GDCV: Patrón A (layout.tsx + separación de componentes)
- ❌ Main: Patrón B (monolítico sin layout.tsx)
- ❌ Dos patrones arquitectónicos diferentes

---

## 7. TABLA DE COMPONENTES REUTILIZADOS

Aunque hay diferencias arquitectónicas, los componentes @ui son los mismos:

| Componente | Main | GDD | GDCV | Reutilizado |
|-----------|------|-----|------|-------------|
| **Sidebar** | ✅ | ✅ | ✅ | Sí |
| **SidebarTrigger** | ✅ | ✅ | ✅ | Sí |
| **Breadcrumb** | ✅ | ✅ | ✅ | Sí |
| **Button** | ✅ | ✅ | ✅ | Sí |
| **Avatar** | ✅ | ✅ | ✅ | Sí |
| **Sheet** | ✅ | ✅ | ❌ | Parcial |

**Conclusión:** Los @ui components SÍ se reutilizan (bueno)  
**Pero:** La arquitectura que los envuelve es inconsistente (malo)

---

## 8. RECOMENDACIÓN (SIN EJECUTAR)

### Opción A: Alinear Main con GDD/GDCV (más trabajo, más consistencia)

```
Cambios necesarios:

1. Crear: app/main/layout.tsx
   - Importar MainLayoutShell
   - Importar MainHeader (usar el que existe)
   - Patrón como gdcv/layout.tsx

2. Cambiar: MainLayoutShell.tsx
   - Remover header inline
   - Solo tener sidebar + sidebar-inset
   - Height volver a h-11

3. Cambiar: MainHeader.tsx
   - Asegurar breadcrumbs consistentes
   - Mismo tamaño que GddHeader/GdcvHeader

4. Cambiar: app/main/page.tsx
   - Remover MainLayoutShell
   - Solo tener <ProjectsView />
   - Layout lo maneja app/main/layout.tsx
```

**Resultado:** Main sigue patrón idéntico a GDD/GDCV

---

### Opción B: Dejar Main como está

**Pros:**
- No cambiar nada
- Funciona "bien enough"

**Contras:**
- Inconsistencia permanente
- Dificulta futuras features
- Violates "no reinventar rueda"

---

## 9. DATOS TÉCNICOS

### Header Heights:
```
GDD Header:     h-11 = 44px
GDCV Header:    h-11 = 44px  
Main Header:    h-14 = 56px  ← 12px extra
```

### Available space for content:
```
GDD/GDCV:  viewport - 44px (header) - sidebar = content area
Main:      viewport - 56px (header) - sidebar = content area ← Less space
```

---

## 10. CONCLUSIÓN

### Hallazgos:

✅ **Componentes @ui:** Reutilizados correctamente  
✅ **Design tokens:** Respetados en ambas  
❌ **Arquitectura shell:** INCONSISTENTE  
❌ **Header height:** INCONSISTENTE (12px diferencia)  
❌ **Patrón layout:** Dos patrones diferentes  
❌ **MainHeader:** Componente existente pero no utilizado  

### Puntuación de Alineación:

```
Componentes @ui:        ✅ 100%
Design System tokens:   ✅ 100%
Arquitectura shell:     ❌ 40%
Header consistency:     ❌ 50%
Patrón Next.js:        ❌ 50%
---
PROMEDIO ALINEACIÓN:   ❌ 68%
```

---

**Auditoría completada:** 2026-05-14  
**Recomendación:** Revisar Opción A cuando haya disponibilidad  
**Urgencia:** BAJA (funciona, pero inconsistente)  
**Complejidad:** MEDIA (requiere restructuración)

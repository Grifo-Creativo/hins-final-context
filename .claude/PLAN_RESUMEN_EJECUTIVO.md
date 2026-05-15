# 🎯 PLAN EJECUTIVO: Consistencia de Navegación

**Tiempo total:** 11 minutos  
**Riesgo:** BAJO  
**Archivos a cambiar:** 3  
**Componentes a tocar:** 0 (solo estructura)

---

## EL PROBLEMA EN 1 FRASE

Main tiene header **inline (56px)** y estructura diferente a GDD/GDCV que tienen header **separado (44px)**.

---

## LA SOLUCIÓN EN 3 PASOS

### 1️⃣ CREAR `app/main/layout.tsx`

**Qué es:** Un archivo nuevo que organiza la estructura (como tienen GDD y GDCV)

```typescript
// app/main/layout.tsx
<MainLayoutShell>
  <MainHeader />           ← El header ahora es COMPONENTE
  <main>
    <PageTransition>{children}</PageTransition>
  </main>
</MainLayoutShell>
```

**Por qué:** Sigue patrón Next.js estándar

---

### 2️⃣ LIMPIAR `MainLayoutShell.tsx`

**Qué hacer:** Eliminar las 45 líneas del header inline

**Antes:**
```tsx
<SidebarInset>
  <header className="h-14">...</header>  ← ELIMINAR
  {children}
</SidebarInset>
```

**Después:**
```tsx
<SidebarInset>
  {children}
</SidebarInset>
```

**Por qué:** Shell solo maneja sidebar, header es responsabilidad del layout

---

### 3️⃣ SIMPLIFICAR `app/main/page.tsx`

**Qué hacer:** Remover el wrapper MainLayoutShell

**Antes:**
```tsx
<MainLayoutShell>
  <ProjectsView />
</MainLayoutShell>
```

**Después:**
```tsx
<ProjectsView />
```

**Por qué:** MainLayoutShell ahora está en layout.tsx (donde pertenece)

---

## ANTES vs DESPUÉS

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Header height** | h-14 (56px) | h-11 (44px) ✅ |
| **Header ubicación** | Inline en Shell | Componente separado ✅ |
| **Tiene layout.tsx** | ❌ NO | ✅ SÍ |
| **Patrón** | Custom/inconsistente | Igual a GDD/GDCV ✅ |
| **Líneas innecesarias** | 45 | 0 ✅ |
| **Alineación** | 68% | 95% ✅ |

---

## RESULTADO VISUAL

```
ANTES:
  Main header:  |||||||||| (56px)
  GDD header:   ||||||| (44px)
  ❌ DIFERENTE

DESPUÉS:
  Main header:  ||||||| (44px)
  GDD header:   ||||||| (44px)
  GDCV header:  ||||||| (44px)
  ✅ IGUAL
```

---

## LO IMPORTANTE

✅ **NO toca componentes @ui** (Button, Avatar, Card, etc.)  
✅ **NO toca ProjectsView** (contenido)  
✅ **NO toca lógica** (todo sigue funcionando igual)  
✅ **SOLO reorganiza estructura**  
✅ **Reutiliza MainHeader.tsx que ya existe**  

---

## CHECKLIST POST-IMPLEMENTACIÓN

Después de los 3 pasos, validar:

```
Visual:
  ☐ Header mismo tamaño en /main, /gdd/performance, /gdcv/performance
  ☐ Sidebar colapsa igual en todas
  ☐ Responsive igual en mobile/tablet/desktop

Técnico:
  ☐ Sin errores en consola
  ☐ app/main/layout.tsx se importa
  ☐ MainHeader renderiza
  ☐ PageTransition funciona
```

---

## RIESGOS

🟢 **BAJO**

- Solo cambios estructurales
- No toca lógica de negocio
- Fácil revertir con `git revert`
- Componentes @ui intactos

---

## ¿Y SI FALLA?

```bash
# Revertir en 1 comando:
git revert [commit-hash]
```

O editar manualmente los 3 archivos de nuevo.

---

## TIMELINE

```
Paso 1: 2 min  (crear archivo)
Paso 2: 3 min  (editar shell)
Paso 3: 1 min  (editar page)
Tests: 5 min   (validar en navegador)
─────────────
TOTAL: 11 minutos
```

---

## PREGUNTAS FRECUENTES

**¿Se verá diferente en Main después?**  
No. Visualmente será igual. Solo el header será más pequeño (corrección).

**¿Se romperá algo?**  
No. Solo es reorganización estructural. Lógica intacta.

**¿Necesito cambiar componentes @ui?**  
No. Cero cambios en componentes.

**¿Cómo sé que funcionó?**  
Header de Main = altura de GDD/GDCV. Listo.

---

## RECOMENDACIÓN

✅ **HACER ESTE PLAN**

Mejora:
- Consistencia visual
- Arquitectura
- Mantenibilidad
- Código limpio

Costo: 11 minutos

---

**¿Procedo?**

Responde:
```
✅ SÍ, ADELANTE
```

Y hago los 3 pasos.

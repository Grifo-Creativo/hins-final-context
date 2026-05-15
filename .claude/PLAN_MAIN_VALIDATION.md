# 📋 PLAN DE VALIDACIÓN MAIN PAGE
**Sin modificaciones de código — solo verificación**

---

## 🎯 OBJETIVO
Confirmar que la página Main (/main) está correctamente construida con componentes @ui y alineada con @flows/main/flow.md

---

## ✅ PASO 1: VALIDACIÓN VISUAL (5 min)

### Abre: http://localhost:3000/main

Verifica visualmente estos puntos:

- [ ] **Layout general**
  - [ ] Sidebar a la izquierda (colapsable)
  - [ ] Header con Search + Bell + Avatar
  - [ ] Título "Proyectos" visible
  - [ ] Footer en la parte inferior

- [ ] **Filtros (TabsForBlocks)**
  - [ ] 3 opciones visibles: "Todos", "Comunitarios (GDC)", "Distribuidor (GDD)"
  - [ ] Tab "Todos" activo por defecto (fondo blanco, sombra)
  - [ ] Al hacer click en "GDC" → muestra solo 2 cards (Río Cuarto, Marcos Juarez, Arroyo Cabral)
  - [ ] Al hacer click en "GDD" → muestra 1 card (General Roca)

- [ ] **Grid de cards**
  - [ ] Desktop: 2 columnas
  - [ ] Mobile (resize a <640px): 1 columna
  - [ ] 4 cards totales

- [ ] **Cada card de proyecto**
  - [ ] Imagen con relación 4:3
  - [ ] SoftBadge en esquina superior izquierda (GDD o GDC)
  - [ ] Nombre del parque visible
  - [ ] Botón "Acceder" o "Próximamente"

- [ ] **Interactividad**
  - [ ] Pasar mouse sobre card → sombra aumenta (hover effect)
  - [ ] Click en "Río Cuarto" ("Acceder") → navega a `/gdcv/performance`
  - [ ] Click en "General Roca" ("Acceder") → navega a `/gdd/performance`
  - [ ] Click en "Marcos Juarez" → muestra "Próximamente" (sin enlace)
  - [ ] Click en "Arroyo Cabral" → muestra "Próximamente" (sin enlace)

- [ ] **Botones adicionales**
  - [ ] Botón "Nuevo" (icono + texto) — visible pero sin acción aún
  - [ ] Icono descargar (Download) — visible

---

## 🔍 PASO 2: VALIDACIÓN DE COMPONENTES (sin código)

### Preguntas de verificación

1. **¿TabsForBlocks está siendo usado?**
   - Dónde: ProjectsView.tsx línea 36
   - ✅ SÍ → import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
   - ✅ SÍ → <TabsForBlocks tabs={...} value={filter} onValueChange={...} />

2. **¿Card está siendo usado?**
   - Dónde: ProjectCard.tsx línea 4 + 34
   - ✅ SÍ → import { Card } from "@/components/ui/card"
   - ✅ SÍ → <Card className="...py-0...">

3. **¿SoftBadge está siendo usado?**
   - Dónde: ProjectCard.tsx línea 5 + 65
   - ✅ SÍ → import { SoftBadge } from "@/components/ui/soft-badge"
   - ✅ SÍ → <SoftBadge className="...">

4. **¿Button está siendo usado?**
   - Dónde: ProjectsView.tsx línea 6 + 43, 53
   - ✅ SÍ → import { Button } from "@/components/ui/button"
   - ✅ SÍ → <Button variant="default" ... > y <Button variant="ghost" ... >

5. **¿Avatar está siendo usado?**
   - Dónde: MainLayoutShell.tsx línea 8 + 41
   - ✅ SÍ → import { Avatar, AvatarFallback } from "@/components/ui/avatar"
   - ✅ SÍ → <Avatar><AvatarFallback>HU</AvatarFallback></Avatar>

---

## 📊 PASO 3: COMPARACIÓN ARQUITECTÓNICA

### ¿Está alineado con gdcv/gdd?

| Característica | Main | GDCV | GDD | ¿Alineado? |
|---|---|---|---|---|
| Tiene shell layout | ✅ MainLayoutShell | ✅ GdcvLayoutShell | ✅ GddLayoutShell | ✅ SÍ |
| Tiene sidebar | ✅ MainSidebar | ✅ (en shell) | ✅ (en shell) | ✅ SÍ |
| Tiene header | ✅ (en shell) | ✅ GdcvHeader | ✅ GddHeader | ✅ SÍ |
| Usa TabsForBlocks | ✅ | ✅ | ✅ | ✅ SÍ |
| Usa Card | ✅ | ✅ | ✅ | ✅ SÍ |
| Usa SoftBadge | ✅ | ✅ | ✅ | ✅ SÍ |

**Conclusión:** ✅ **Totalmente alineado**

---

## 🎨 PASO 4: VALIDACIÓN CONTRA FLOW.MD

### Checklist de @flows/main/flow.md

- [ ] **Main_00 - Vista: Proyectos**
  - [ ] Ruta: /main ✅
  - [ ] Vista por defecto ✅

- [ ] **Bloques (orden vertical)**
  - [ ] 1. Header con "Proyectos" + TabsForBlocks + "Nuevo" ✅
  - [ ] 2. Grid de cards ✅

- [ ] **TabsForBlocks**
  - [ ] "Todos" (muestra todas) ✅
  - [ ] "Comunitarios (GDC)" (muestra GDC) ✅
  - [ ] "Distribuidor (GDD)" (muestra GDD) ✅

- [ ] **Anatomía de card**
  - [ ] Imagen portada (4:3) ✅
  - [ ] SoftBadge sobre imagen ✅
  - [ ] Nombre del parque ✅
  - [ ] Botón "Acceder" ✅

- [ ] **Interacciones**
  - [ ] "Río Cuarto" (GDC) → /gdcv/performance ✅
  - [ ] "General Roca" (GDD) → /gdd/performance ✅
  - [ ] "Próximamente" para otros ✅

- [ ] **Responsive**
  - [ ] Grid 2 cols desktop ✅
  - [ ] Grid 1 col mobile ✅

---

## ⚠️ PASO 5: BÚSQUEDA DE PROBLEMAS

### Si algo se ve mal, describe:

**Si hay visual issue:**
- [ ] ¿Dónde exactamente? (ej: "header se superpone con contenido")
- [ ] ¿En qué viewport? (desktop/tablet/mobile)
- [ ] ¿Qué debería mostrar?
- [ ] ¿Qué está mostrando?

**Si hay functional issue:**
- [ ] ¿Qué botón/tab no funciona?
- [ ] ¿Qué debería pasar?
- [ ] ¿Qué está pasando?

**Si hay componente issue:**
- [ ] ¿Qué componente?
- [ ] ¿Error en consola?
- [ ] ¿Screenshot del error?

---

## 🚀 PASO 6: REPORTE

### Una vez completes la validación visual:

**Si todo está bien:**
```
✅ Main page valida correctamente
✅ Componentes @ui están siendo utilizados
✅ Alineado con flow.md
✅ Alineado con gdcv/gdd
✅ No cambios necesarios
```

**Si hay problemas:**
```
❌ Problema encontrado:
- Descripción: [describe exactamente]
- Ubicación: [pantalla / componente]
- Pasos para reproducir: [paso 1, paso 2, ...]
- Resultado esperado: [qué debería pasar]
- Resultado actual: [qué está pasando]
```

---

## 📝 NOTAS IMPORTANTES

### ⚠️ NO HAGAS ESTO:

- ❌ No modifiques MainLayoutShell.tsx
- ❌ No cambia TabsForBlocks por otro componente
- ❌ No refactorices ProjectCard.tsx
- ❌ No muevas MainFooter a otro lugar
- ❌ No cambies la estructura de carpetas

### ✅ ES SEGURO:

- ✅ Si encontras un bug específico → comunícalo
- ✅ Si necesitas textos diferentes → cambia main-mock.ts
- ✅ Si la layout necesita ajustes CSS menores → avisa primero
- ✅ Si quieres nueva funcionalidad → planea primero

---

## ✨ RESULTADO ESPERADO

Una vez valides todos los pasos, deberías poder reportar:

**Main page está correctamente implementada** porque:
1. ✅ Usa componentes @ui estándar (TabsForBlocks, Card, SoftBadge, Button, Avatar)
2. ✅ Cumple 100% con @flows/main/flow.md
3. ✅ Está alineada arquitectónicamente con gdcv/gdd
4. ✅ Es responsive (desktop/tablet/mobile)
5. ✅ Tiene filtros funcionales
6. ✅ Tiene enlaces correctos a sub-vistas

---

**Tiempo estimado:** 15 minutos  
**Riesgo:** BAJO (solo lectura, sin cambios)  
**Próximo paso:** Reportar resultados

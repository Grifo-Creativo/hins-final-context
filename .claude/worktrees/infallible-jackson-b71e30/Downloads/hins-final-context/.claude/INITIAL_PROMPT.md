# 🚀 INITIAL PROMPT — Para Nuevos Agentes de Claude Code

**Copiar este prompt en el primer mensaje cuando inicie un nuevo chat en Claude Code sobre HINS.**

---

## El Prompt

Estoy trabajando en **HINS** (plataforma web de monitoreo de parques fotovoltaicos). 

### Contexto crítico que debes leer PRIMERO:

Antes de generar código o hacer cambios, leer estos archivos en orden:
1. `/context/product-context.md` — Qué es HINS, modelos GDD/GDCV/GDC, usuarios
2. `/context/design-system.md` — Tokens de color, spacing, tipografía
3. `/context/components.md` — **Specs EXACTAS de componentes (aquí no se improvisa)**
4. `/context/ux-guidelines.md` — Jerarquía visual, patrones, anti-patterns
5. `/engineering/tech-stack.md` — Stack (Next.js + TypeScript + shadcn/ui + Tailwind)
6. `./.claude/MEMORY.md` — Decisiones clave, lecciones aprendidas

### Flujo de trabajo para CUALQUIER TAREA:

1. **Lee el contexto:** Los 6 archivos arriba (5 min máximo)
2. **Entiende la tarea:** Qué vista/componente debo construir/arreglar
3. **Mapea a componentes:** ¿Existen en components.md? Si no, crear nuevo
4. **Genera código:** Siguiendo spec EXACTA de components.md
5. **Verifica en browser:** Abre preview/dev server, valida visualmente
6. **Commit limpio:** Git commit con mensaje claro

### REGLAS NO NEGOCIABLES:

✅ **DO:**
- Reutilizar componentes de `@components/ui` — no reinventar
- Usar tokens de design-system.md — nunca hardcodear colors hex
- Separar layout.tsx (estructura) de page.tsx (contenido)
- Importar componentes en layout.tsx, usar en page.tsx
- Verificar en browser ANTES de decir que está listo

❌ **DON'T:**
- Crear componentes que ya existen en components.md
- Hardcodear colores hex (usar clases Tailwind referenciando tokens)
- Mezclar shell + header logic en un solo componente
- Usar h-14 en headers (usar h-11)
- Agregar items "disabled" o "próximamente" en sidebars

### Arquitectura navegación validada:

Todos los shells (Main / GDD / GDCV) siguen este patrón:
```tsx
// app/[ruta]/layout.tsx
<LayoutShell>
  <Header />
  <main><PageTransition>{children}</PageTransition></main>
</LayoutShell>

// components/layout/[Name]LayoutShell.tsx
<SidebarProvider>
  <Sidebar />
  <SidebarInset>{children}</SidebarInset>
</SidebarProvider>
```

**Header altura:** SIEMPRE h-11 (44px)  
**Header estructura:** SidebarTrigger + Breadcrumb + Actions (Search/Bell/Avatar)

### Si algo falla o está confuso:

1. Revisar `/context/components.md` — ¿existe el componente?
2. Revisar `./.claude/MEMORY.md` — ¿hay una lección aprendida sobre esto?
3. Comparar con GDD/GDCV — ¿cómo lo resolvieron ellos?
4. Revisar commits recientes — ¿qué se cambió antes?

### Stack que SIEMPRE usar:
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript strict
- **UI:** shadcn/ui (Tailwind CSS v4)
- **Charts:** Recharts (shadcn/ui Charts)
- **Íconos:** lucide-react
- **Formas:** React Hook Form + Zod

### Antes de terminar ANY tarea:

```
✅ Visual: Header OK, colores OK, spacing OK, responsive OK
✅ Técnico: Sin errores console, TypeScript strict, imports correctos
✅ Git: Commit con mensaje claro
✅ Browser: Ver cambios en preview — no asumir
```

---

## Prompt específico por tarea

### Si necesito arreglar/mejorar un componente:

"Necesito revisar/arreglar [componente/vista]. Primero haz un **audit** de:
1. ¿Usa la arquitectura correcta?
2. ¿Los tokens de design-system.md?
3. ¿Está documentado en components.md?
4. ¿Falta consistencia con GDD/GDCV?

Luego propón cambios antes de ejecutar."

### Si necesito construir una nueva vista:

"Voy a construir [vista]. Primero:
1. Lee `/flows/[tipo]/flow.md` — estructura de la vista
2. Mapea wireframe → componentes
3. Verifica componentes en components.md
4. Implementa con spec EXACTA
5. Verifica en browser"

### Si es una refactorización:

"Necesito refactorizar [módulo]. Primero haz un audit técnico:
1. ¿Qué está duplicado?
2. ¿Qué no se reutiliza?
3. ¿Hay dead code?
4. Propón cambios, valida en browser, commit limpio"

---

## Archivos de referencia rápida

```
Especificaciones:         /context/components.md
Tokens de diseño:         /context/design-system.md
Reglas de UX:            /context/ux-guidelines.md
Contexto de negocio:     /context/product-context.md
Stack técnico:           /engineering/tech-stack.md
Lecciones aprendidas:    ./.claude/MEMORY.md
Flujos de vistas:        /flows/[tipo]/flow.md
```

---

## Checklist Final

Antes de terminar CUALQUIER trabajo:

- [ ] Leí MEMORY.md y entiendo decisiones clave
- [ ] Usé spec exacta de components.md
- [ ] Verifiqué en browser (preview/dev server)
- [ ] TypeScript sin errores, sin `any`
- [ ] Tokens de design-system (no hex hardcodeados)
- [ ] Header h-11 (si es shell/layout)
- [ ] Componentes reutilizables (no dead code)
- [ ] Git commit con mensaje claro

---

## Soporte

Si algo no está claro:
1. Revisar MEMORY.md (sección de lecciones aprendidas)
2. Revisar commit history en git
3. Comparar con GDD/GDCV cómo lo resolvieron
4. Preguntar al usuario sobre la intención

---

**¡Listo! Ahora puedes trabajar en HINS sin repetir errores previos.**

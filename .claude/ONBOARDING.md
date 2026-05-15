# 📋 ONBOARDING CHEAT SHEET — HINS Project

**Para usar en tu primer día trabajando en HINS. Bookmark esto.**

---

## 🎯 Qué es HINS (en 1 minuto)

Plataforma web que muestra performance de parques fotovoltaicos.
- **Usuarios:** Admin HINS, Dueño (GDD), AGC + Socios (GDCV/GDC)
- **Lo que hace:** Muestra datos, gráficos, ROI — **NO ejecuta acciones**
- **Stack:** Next.js + TypeScript + shadcn/ui + Tailwind + Recharts

---

## 📂 Estructura de carpetas — Lo que necesitas saber

```
hins-final-context/
├── app/
│   ├── main/             ← HINS Admin (cartera de proyectos)
│   ├── gdd/              ← Vista GDD (parque distribuidor)
│   └── gdcv/             ← Vista GDCV (parque comunitario virtual)
│
├── components/
│   ├── ui/               ← Componentes base (Button, Card, KPI, etc)
│   ├── charts/           ← Gráficos (GenerationSparkline, BarChart, etc)
│   ├── layout/           ← Shell, Sidebar, Header
│   ├── main/             ← Componentes específicos de /main
│   ├── gdd/              ← Componentes específicos de /gdd
│   └── gdcv/             ← Componentes específicos de /gdcv
│
├── context/              ← 📖 DOCUMENTACIÓN IMPORTANTE
│   ├── product-context.md       [Qué es HINS, modelos, usuarios]
│   ├── design-system.md         [Tokens, colores, spacing]
│   ├── components.md            [✅ SPEC EXACTA — LEE ESTO]
│   ├── ux-guidelines.md         [Patrones, jerarquía]
│   └── kick-off.md              [Cómo empezar]
│
├── engineering/
│   └── tech-stack.md            [Stack, convenciones]
│
├── flows/                        ← Wireframes y specs de vistas
│   ├── GDD/
│   ├── GDCV-agc/
│   ├── GDCV-socio/
│   └── main/
│
├── data/                         ← Mock data
│   ├── gdd-performance-mock.ts
│   ├── gdcv-agc-mock.ts
│   └── main-mock.ts
│
├── .claude/                      ← 🧠 MEMORIA Y GUÍAS
│   ├── MEMORY.md                 [Decisiones clave, lecciones]
│   ├── INITIAL_PROMPT.md         [Cómo iniciar un nuevo chat]
│   └── ONBOARDING.md             [Este archivo]
│
└── README.md                     ← Intro del proyecto
```

---

## ✅ BEFORE YOU CODE — Checklist de 5 min

```
☐ Leer /context/product-context.md (2 min)
☐ Leer /context/components.md (2 min)
☐ Leer ./.claude/MEMORY.md (1 min)
☐ Abrir dev server: npm run dev
☐ Listo para empezar
```

---

## 🎨 Design System — Quick Reference

### Colores
```
UI (Zinc):     #09090B (text) | #FFFFFF (bg) | #E4E4E7 (border)
Charts (Green): #22C55E (principal) | #16A34A (base) | #15803D (oscuro)
```

**REGLA:** Usa Tailwind classes, nunca hex hardcodeados.
```tsx
❌ style={{ color: '#09090B' }}
✅ className="text-foreground"
```

### Spacing
```
gap-2  = 8px   |  p-4   = 16px   |  h-11 = 44px (headers)
gap-4  = 16px  |  p-6   = 24px   |  h-14 = 56px (❌ NO USAR)
gap-8  = 32px  |  py-6  = 24px v
```

---

## 🏗️ Arquitectura Navigation — El patrón validado

### Estructura correcta

```tsx
// app/[ruta]/layout.tsx
<LayoutShell>
  <Header />
  <main><PageTransition>{children}</PageTransition></main>
</LayoutShell>

// components/layout/[Name]LayoutShell.tsx
<SidebarProvider>
  <Sidebar />
  <SidebarInset className="flex min-h-0 flex-col">
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Header
- **Altura:** `h-11` (44px) — SIEMPRE
- **Elementos:** SidebarTrigger + Breadcrumb + Gap + Search/Bell/Avatar
- **Componente reutilizable:** MainHeader, GddHeader, GdcvHeader

### Sidebar
- **Items:** SOLO activos (no "disabled" o "próximamente")
- **Footer:** NavUser component (avatar + username)
- **Trigger:** En el header

---

## 🚫 Common Mistakes — NO hacer esto

| ❌ MALO | ✅ CORRECTO | Por qué |
|--------|-----------|---------|
| `h-14` en header | `h-11` | Inconsistencia con GDD/GDCV |
| Header inline en Shell | Componente separado | Duplicación, mantenimiento |
| 4 items disabled | 0 items disabled | Confunde UX |
| `#22C55E` en Button | Token Tailwind | Hardcodear = problema |
| MainHeader no importado | Importar en layout.tsx | Dead code |
| Crear nuevo Input | shadcn/ui existente | Reinventar rueda |

---

## 📖 Archivos por tarea

### Construir una NUEVA vista
→ Leer `/flows/[tipo]/flow.md` → Mapear componentes → Verificar en `components.md`

### Arreglar componente EXISTENTE
→ Leer `components.md` → Auditar spec vs implementación → Comparar GDD/GDCV

### Entender NEGOCIO
→ Leer `product-context.md` → ¿Cuál es el modelo? ¿Quién es el usuario?

### Entender DISEÑO
→ Leer `design-system.md` + `ux-guidelines.md` → ¿Tokens? ¿Patrones?

### Entender TECNICO
→ Leer `engineering/tech-stack.md` + `.cursorrules` → Stack, convenciones

---

## 🔍 TypeScript — Reglas estrictas

```tsx
// ❌ MALO
function MyComponent(props) { }
const data: any = fetchData()

// ✅ CORRECTO
interface MyProps {
  title: string
  count?: number
}

function MyComponent({ title, count = 0 }: MyProps) { }
const data: ChartData[] = await fetchData()
```

---

## 🎨 Componentes — Los que reutilizar

### Siempre existen en shadcn/ui:
```
Button | Card | Input | Select | Checkbox | Sheet | Dialog | Tabs
```

### Personalizados HINS (en /components/ui):
```
TabsForBlocks | KpiPrimary | KpiSecondary | SoftBadge | IconBadge
CardWithContent | PageHeader | SectionHeader | HinsTooltip
```

### Charts (en /components/charts):
```
GenerationSparkline | ParkEnergyBarChart | RoiRecoveryLineChart
```

**ANTES de crear nuevo componente → Revisar `/context/components.md`**

---

## 🔄 Git Workflow — Commits limpios

```bash
# Estructura
git commit -m "refactor: cambio breve

- Punto 1: qué cambió
- Punto 2: por qué
- Punto 3: resultado

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

**Ejemplo real:**
```
411279c — "refactor: align Main navigation architecture with GDD/GDCV pattern"
```

---

## 🌐 Navegación — URLs importantes

### Rutas en aplicación
```
/main                     → Admin HINS (cartera)
/gdd/performance          → Vista GDD (performance)
/gdd/roi                  → Vista GDD (ROI)
/gdcv/performance         → Vista GDCV AGC (performance)
/gdcv/roi                 → Vista GDCV AGC (ROI)
/gdcv/socio               → Vista Socio (landing)
/gdcv/socio/parque        → Vista Socio (performance)
```

### Navegación en código
```tsx
❌ <a href="/gdd/performance">Link</a>
✅ <Link href="/gdd/performance">Link</Link>
```

---

## 🚀 Primer día — Paso a paso

```
1. Leer MEMORY.md (5 min)
2. Leer /context/components.md (5 min)
3. Abrir dev server (npm run dev)
4. Navegar a http://localhost:3000/main (ver layout)
5. Comparar con /gdd/performance (ver patrón)
6. Pedir tarea específica
7. Leer /flows/[tipo]/flow.md si es nueva vista
8. Implementar + browser verification
9. Git commit
```

---

## 📞 Si algo no está claro

1. **¿Componente existe?** → `/context/components.md`
2. **¿Cómo se hace algo?** → Mirar GDD/GDCV (están completos)
3. **¿Lección aprendida?** → `./.claude/MEMORY.md`
4. **¿Qué cambió antes?** → `git log` (commits tienen contexto)

---

## 🎓 Conceptos clave — Si no sabes qué es

| Término | Significado | Archivo |
|---------|-----------|---------|
| **GDD** | Distribuidor (Parque General Roca) | /context/product-context.md |
| **GDCV** | Comunitario Virtual (Parque Río Cuarto) | /context/product-context.md |
| **AGC** | Admin del parque comunitario | /context/product-context.md |
| **Neteo** | Compensación energía consumo/generación | /context/product-context.md |
| **Shell** | Layout contenedor (sidebar + main) | /context/components.md |
| **Token** | Variable CSS reutilizable | /context/design-system.md |
| **Flow** | Wireframe + specs de vista | /flows/[tipo]/flow.md |

---

## ✨ Pro Tips

- **Tab completions en Cursor:** `@` + nombre archivo → autocompletar
- **Buscar componente:** Ctrl+F en `components.md`, no googlear
- **Validar header:** Comparar altura visualmente en Main vs GDD (dev tools)
- **Revisar specs:** Nunca asumir, siempre leer components.md
- **Test changes:** Preview/dev server ANTES de git commit

---

**You're ready! Let's build HINS.** 🚀

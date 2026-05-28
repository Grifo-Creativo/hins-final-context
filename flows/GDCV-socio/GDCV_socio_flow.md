# Flow: Socio / Cesionario — Parque GDCV

> Terminología: `flows/GDCV-socio/terminology.md` (cuota vs total parque, inversión socio, íconos FeatureItem).

## Actor
Socio GDCV — Participante del parque comunitario con cuotaparte porcentual (`socioPorcentaje` = 15% en prototipo).
**Pregunta clave:** ¿Me está rindiendo la inversión? ¿Qué impacto real está teniendo en mi factura?

**Restricción importante:** Sin Sidebar. Solo navega 2 tabs internos. No sale de aquí.

**Mantenimiento:** ❌ **Fuera de scope de este flow.** El socio no ve ni accede al módulo Mantenimiento del parque (historial, costos, navegación ni acciones). Ver `product-context.md` §5 y §9.

---

## Pantallas

### GDCV_socio_00 — Verificación de acceso (OTP medidor)
Ruta: `/gdcv/socio/acceso?socio=AS`
Ocurre **antes** de cualquier vista del socio. Sin wireframe — patrón estándar OTP.

**Cuándo:** Primera visita (o sesión sin verificar) hasta validación exitosa.

**Contenido:**
- Card centrada sobre fondo shell (`bg-background-subtle`)
- Contexto: nombre del parque + nombre del socio (v1: **Agro Sur Industrial**)
- H1: "Verificá tu acceso"
- Subtítulo: últimos 4 dígitos del N° de medidor
- Input OTP: 4 slots (`input-otp` shadcn, variante outlined)
- Botón primary "Continuar" (disabled hasta 4 dígitos)
- Error inline si OTP incorrecto

**Validación (prototipo):**
- Socio demo: `AS` (Agro Sur Industrial), medidor `354904` → OTP correcto: `4904`
- Sesión: `sessionStorage` clave `hins:gdcv-socio-verified`
- Tras éxito → redirect `/gdcv/socio`

**Origen del link:**
- AGC en tabla Socios del Parque → ⋮ → **Compartir** (solo fila Agro Sur) copia URL de acceso

---

### GDCV_socio_01 — Vista: Mi Espacio Personal (landing)
Ruta: `/gdcv/socio`
Vista por defecto al ingresar al flow.
Referencia visual: GDCV__socio_01.png

**Header:**
- H1: nombre del parque ("Parque Río Cuarto")
- Sin badge (a diferencia de AGC)
- TabsForBlocks: "Agro Sur Industrial" (mi vista) | "Performance del Parque" (tabs navegación)
- Sin botón export (user final)

**Bloque 1 — Mi Ahorro en Abril (izquierda):**
- CardWithContent:
  - Icon: DollarSignIcon
  - Title: "Mi Ahorro en abril"
  - Value: "$ 74.400,03"
  - Delta: "+12% vs mes anterior"
  - Tabs chips: 1M / 3M / 6M (default 6M)
  - Chart: bar chart 6 meses (Nov 25–Abr 26), período actual destacado en --chart-1
  - Valores: Nov 138k, Dic 121k, Ene 101k, Feb 85k, Mar 79k, Abr 124k (actual)

**Bloque 2 — Mi Energía Generada (derecha):**
- CardWithContent:
  - Top section:
    - Icon: ZapIcon
    - Title: "Mi Energía Generada"
    - Value: "830.17"
    - Unit: "kWh"
    - Badge período: "Abril 2026 · En Curso"
    - Sparkline: trend data
  - Bottom section: TabsForBlocks dentro de Card
    - Tab 1 "Inyección": StatList con items:
      - { icon: DollarSignIcon, name: "Por autoconsumo virtual", value: "$ 54.200" }
      - { icon: DollarSignIcon, name: "Por Energía Inyectada", value: "$ 20.200" }
      - { icon: WalletIcon, name: "Total Ahorro en Abril", value: "$ 74.400", subtitle: "De mi 15% del parque" (`socioCuotaDelParqueSubtitle`) }
    - Tab 2 "Energía": StatList con items:
      - { icon: ZapIcon, name: "Energía asignada", value: "207.5 kWh" }
      - { icon: ZapIcon, name: "Energía neteada", value: "185.3 kWh" }
      - { icon: WalletIcon, name: "Total kWh en Abril", value: "207.5 kWh", subtitle: "De mi 15% del parque" }

**Bloque 3 — Retorno de la Inversión (ROI):**
- `SectionHeader` `level="h2"`: "Retorno de la Inversión (ROI)" + `TabsForBlocks` DOLAR | ARS (`?currency=`, mismo patrón que GDD/GDCV ROI)
- Grid KPI = paridad GDD (`SocioRoiView` + `socioRoiKpis`):
  - Card 1: Inversión Recuperada + `KpiProgressBar`
  - Card 2: Recupero Estimado + badge `Payback` + `KpiPaybackTimeline`
  - Card 3: col `340px` (alineada al panel energía arriba). `lg`: TIR|Plazo fila 1, Mi Inversión fila 2, botón abajo. Mobile: TIR|Plazo, Mi Inversión full, botón
  - Botón «Ver Tabla de Recupero» → `SheetContentTable` (`showFooter={false}`) + `GddRoiRecuperoTable` `layout="embedded"`, `showColumnVisibility={false}`, `onCurrencyChange={handleCurrencyChange}`. La moneda DOLAR \| ARS es un tab **clickeable** en la toolbar de la tabla (mismo contenedor que Proyectado \| Histórico): convierte los valores y sincroniza `?currency=` igual que `/gdcv/roi`. Mocks `socioRoiProyectado` / `socioRoiHistorico`; anchos `lib/sheet-layout.ts`

**Bloque 4 — Historial de Compensaciones:**
- SectionHeader: "Historial de Compensaciones" size="md"
- Tabla con columnas: Período | Energía Generada | Ahorro por Autoconsumo | Ahorro por Inyección | Ahorro Total Generado | Estado | acciones (⋮)
- Características:
  - Column Sorting habilitado (excepto acciones)
  - Column Visibility toggle — botón "Ver columnas"
  - Row actions (⋮): Descargar | Copiar | Compartir
  - Estado badge: "En Curso" (verde) | "Aplicado" (gris)
  - Paginación al pie
- Mock data: 6 períodos (Nov 2025 – Abr 2026)

---

### GDCV_socio_02 — Vista: Performance del Parque
Ruta: `/gdcv/socio/parque`
Accedida mediante tab "Performance del Parque"
Referencia visual: GDCV__socio_02.png

**Header:**
- H1: nombre del parque ("Parque Río Cuarto")
- TabsForBlocks: "Agro Sur Industrial" (gris, inactivo) | "Performance del Parque" (activo)
- Sin botón export

**Bloque 1 — Energía generada del parque (izquierda):**
- CardWithContent (REUTILIZAR del performance AGC — GDCV_admin_01):
  - Title: "Energía generada del parque"
  - Subtitle: dinámico vía `getSocioParqueChartSubtitle` (ej. rango desde Marzo 2024); oculto en tab 1D
  - Tabs chips: 1M / 3M / 6M (default 6M)
  - Chart: bar chart 6 meses (Nov 25–Abr 26)
  - Valores: 247.1 kWh (Nov), 91.2 kWh (Dic), 250 kWh (Ene), 182.6 kWh (Feb), 240.4 kWh (Mar), 204.59 kWh (Abr — actual)
- Grid 2×2 debajo del chart (`socioParqueChartMetricRows` + `FeatureItem` + íconos lucide):
  - Fila 1: Potencia total instalada | 980 kWp (`Zap`) · Potencia total de acople | 815 kWp (`Zap`)
  - Fila 2: Inversión inicial | USD `u$s` (`CircleDollarSign`) · Inicio de operaciones | Marzo 2024 (`Calendar`)
  - Totales = parque (`gdcvParkDetails`). Cuota 380/310 kWp → solo Mi Espacio (`socioParkDetails`).

**Bloque 2 — Resumen del Parque (derecha):**
- CardWithContent:
  - Icon: ZapIcon
  - Title: "Generada en Abril"
  - Value: "204.59"
  - Unit: "kWh"
  - Delta: "+10 kWh vs mes anterior" (`socioEnergiaPark.delta`)
  - Sparkline: trend data parque completo
  - *(Opcional / no en UI prototipo)* Total acumulado 455.22 kWh · Cantidad de socios 6 Cuotapartes — solo en spec, no card extra
- Sección: "Participación por Socio"
  - Lista con 4 socios mostrados:
    - Ferretería Catalán | 20%
    - Avícola del Sur | 20%
    - Campo Vita Alimentos | 20%
    - Agro Sur Industrial | 15%
  - Botón "Ver Todos" → expande lista o navega (placeholder)

**Bloque 3 — Historial de Generación:**
- SectionHeader: "Historial de Generación" size="md"
- Tabla con columnas: Período | Energía Generada | Column N | acciones (⋮)
- Características:
  - Column Sorting habilitado
  - Column Visibility toggle
  - Row actions (⋮): acciones estándar
  - Paginación al pie
- Mock data: 6 períodos (Nov 2025 – Abr 2026)

---

## Interacciones definidas

- AGC → Socios del Parque → ⋮ Agro Sur → **Compartir** → copia `/gdcv/socio/acceso?socio=AS`
- Socio abre link → pantalla OTP (socio_00) → ingresa últimos 4 del medidor → `/gdcv/socio`
- Visitas posteriores a `/gdcv/socio` o `/gdcv/socio/parque` con sesión verificada → sin OTP
- Visitas sin sesión → redirect a `/gdcv/socio/acceso?socio=AS`
- Tab "Agro Sur Industrial" (socio_01) → `/gdcv/socio` (actual)
- Tab "Performance del Parque" (socio_02) → `/gdcv/socio/parque`
- Chips período 1M / 3M / 6M en bloque 1 (socio_01) → actualiza SOLO ese chart
- Chips período 1M / 3M / 6M en bloque 1 (socio_02) → actualiza SOLO ese chart
- KpiPrimary, ROI, tablas → valores fijos del período actual (Abril 2026)
- StatList tabs "Inyección" | "Energía" → cambian items dentro de StatList (controlado por estado)
- Botón "Ver Todos" en "Participación por Socio" → acción no implementada (placeholder)
- Row actions (⋮) en tablas → acciones estándar tabla (Descargar, Copiar, Compartir)
- ❌ Sin acceso a `/gdcv/mantenimiento` ni equivalente bajo rutas `/gdcv/socio/*`

---

## Mock data requerido

```ts
// Socio GDCV — Agro Sur Industrial, 15% participación, Parque Río Cuarto
{
  socioNombre: "Agro Sur Industrial",
  participacionPorcentaje: 25,
  parqueNombre: "Parque Río Cuarto",
  parqueModelo: "GDCV",
  
  // GDCV_socio_01 — Mi Espacio Personal
  
  // Bloque 1 — Mi Ahorro en Abril
  ahorroChart: [
    { mes: "Nov 25", ahorro: 82600 },
    { mes: "Dic 25", ahorro: 72200 },
    { mes: "Ene 26", ahorro: 60400 },
    { mes: "Feb 26", ahorro: 51200 },
    { mes: "Mar 26", ahorro: 47200 },
    { mes: "Abr 26", ahorro: 74400 }, // actual — destacado
  ],
  ahorroAbril: { value: "$ 74.400,03", delta: "+12% vs mes anterior" },
  
  // Bloque 2 — Mi Energía Generada
  energiaGenerada: { value: "830.17", unit: "kWh", period: "Abril 2026 · En Curso" },
  energiaSparkline: [42, 58, 53, 67, 61, 74, 83],
  ahorroInyeccion: [
    { icon: "DollarSignIcon", name: "Por autoconsumo virtual", value: "$ 54.200" },
    { icon: "DollarSignIcon", name: "Por Energía Inyectada", value: "$ 20.200" },
    { icon: "WalletIcon", name: "Total Ahorro en Abril", value: "$ 74.400", subtitle: "De mi 15% del parque" },
  ],
  ahorroEnergia: [
    { icon: "ZapIcon", name: "Energía asignada", value: "207.5 kWh" },
    { icon: "ZapIcon", name: "Energía neteada", value: "185.3 kWh" },
    { icon: "WalletIcon", name: "Total kWh en Abril", value: "207.5 kWh", subtitle: "De mi 15% del parque" },
  ],
  
  // Bloque 3 — ROI
  roi: {
    totalAhorrado: "$ 2,1M",
    totalAhorradoDelta: "+8% anual",
    inversionInicial: "u$s 5,7M",
    inversionRecuperada: "29%",
    paybackEstimado: "5.5 años",
    paybackDesde: "Marzo 2024",
    tir: "18.5%",
    inicioOperaciones: "Marzo 2024",
  },
  
  // Curva recuperación — mock `socioCurvaRecuperacion` (no en vista Mi Espacio; dev/charts)
  curvaRecuperacionData: [
    { fecha: "Mar 24", real: 1100, proyectada: 1200 },
    { fecha: "DIC 24", real: 1800, proyectada: 2100 },
    { fecha: "JUN 25", real: 2400, proyectada: 2800 },
    { fecha: "DIC 25", real: 3200, proyectada: 3500 },
    { fecha: "JUN 26", real: 4100, proyectada: 4300 },
    { fecha: "DIC 26", real: 4800, proyectada: 5200 },
    { fecha: "JUN 27", real: 5600, proyectada: 6100 },
  ],
  curvaRecuperacionInversion: 4270,
  
  // Bloque 4 — Historial de Compensaciones
  historicoCompensaciones: [
    { periodo: "Abril 2026", energiaGenerada: "372 kWh", ahorroAutoconsumo: "$ 54.200", ahorroInyeccion: "$ 20.200", ahorroTotal: "$ 74.400", estado: "En Curso" },
    { periodo: "Marzo 2026", energiaGenerada: "236 kWh", ahorroAutoconsumo: "$ 47.200", ahorroInyeccion: "$ 0", ahorroTotal: "$ 47.200", estado: "Aplicado" },
    { periodo: "Febrero 2026", energiaGenerada: "256 kWh", ahorroAutoconsumo: "$ 51.200", ahorroInyeccion: "$ 0", ahorroTotal: "$ 51.200", estado: "Aplicado" },
    { periodo: "Enero 2026", energiaGenerada: "302 kWh", ahorroAutoconsumo: "$ 60.400", ahorroInyeccion: "$ 0", ahorroTotal: "$ 60.400", estado: "Aplicado" },
    { periodo: "Diciembre 2025", energiaGenerada: "361 kWh", ahorroAutoconsumo: "$ 72.200", ahorroInyeccion: "$ 0", ahorroTotal: "$ 72.200", estado: "Aplicado" },
    { periodo: "Noviembre 2025", energiaGenerada: "413 kWh", ahorroAutoconsumo: "$ 82.600", ahorroInyeccion: "$ 0", ahorroTotal: "$ 82.600", estado: "Aplicado" },
  ],
  
  // GDCV_socio_02 — Performance del Parque
  
  // Bloque 1 — Energía generada del parque (REUTILIZAR del AGC)
  energiaParqueChart: [
    { mes: "Nov 25", kWh: 247.1 },
    { mes: "Dic 25", kWh: 91.2 },
    { mes: "Ene 26", kWh: 250 },
    { mes: "Feb 26", kWh: 182.6 },
    { mes: "Mar 26", kWh: 240.4 },
    { mes: "Abr 26", kWh: 204.59 }, // actual
  ],
  potenciaInstalada: "380 kWp",
  potenciaAcople: "310 kWp",
  
  // Bloque 2 — Resumen Parque
  energiaParqueAbril: { value: "204.59", unit: "kWh", delta: "+10 kWh vs mes anterior" },
  energiaParqueSparkline: [75, 92, 88, 110, 105, 130, 204],
  totalAcumulado: "455.22 kWh",
  cantidadSocios: "6 Cuotapartes",
  participacionSocios: [
    { nombre: "Ferretería Catalán", participacion: "20%" },
    { nombre: "Avícola del Sur", participacion: "20%" },
    { nombre: "Campo Vita Alimentos", participacion: "20%" },
    { nombre: "Agro Sur Industrial", participacion: "15%" },
    // [+ 2 más al expandir]
  ],
  
  // Bloque 3 — Historial Generación
  historicoGeneracion: [
    { periodo: "Abril 2026", energiaGenerada: "204.59 kWh", columnN: "nn" },
    { periodo: "Marzo 2026", energiaGenerada: "nn kWh", columnN: "nn" },
    { periodo: "Febrero 2026", energiaGenerada: "nn kWh", columnN: "nn" },
    { periodo: "Enero 2026", energiaGenerada: "nn kWh", columnN: "nn" },
    { periodo: "Diciembre 2025", energiaGenerada: "nn kWh", columnN: "nn" },
    { periodo: "Noviembre 2025", energiaGenerada: "nn kWh", columnN: "nn" },
  ],
}
```

---

## Notas para el agente

### Componentes a REUTILIZAR (cero reinventar):
- ✅ CardWithContent — mismo que GDD + GDCV-agc
- ✅ KpiPrimary + KpiSecondary — mismo styling/tokens
- ✅ TabsForBlocks — navegación tabs
- ✅ SectionHeader — h3 con acciones
- ✅ StatList — items con inyección/energía (ya existe)
- ✅ Bar chart "Energía generada" — REUTILIZAR del GDCV-agc (misma data, misma visual)
- ⚠️ RoiRecoveryLineChart — no en `/gdcv/socio`; mock `socioCurvaRecuperacion` solo dev/charts
- ✅ Tabla con Column Sorting + Column Visibility + Row Actions — Pattern documentado en `components.md`

### Consistencia visual:
- ✅ Colores: --chart-1, --chart-2 para charts. Nunca --primary.
- ✅ Spacing: gap-6 entre bloques principales, gap-4 internos. Tokens de `design-system.md`.
- ✅ Tipografía: h1 para parque, SectionHeader size="md" para títulos de bloque.
- ✅ Responsive: mobile collapse a single column, tables overflow-x-auto.

### SIN Sidebar:
- No SidebarProvider en layout
- Solo 2 tabs navegables internos (no sale de aquí)
- Layout simple: flex flex-col gap-6

### Rutas:
- `/gdcv/socio` — landing (socio_01 Mi Espacio)
- `/gdcv/socio/parque` — performance (socio_02 del Parque)

### Interacciones simples:
- Chips período actualiza SOLO su chart
- StatList tabs (Inyección/Energía) son controlados (state en componente)
- Tablas con sorting + visibility (usar Pattern documentado)
- Row actions: placeholder funcional

### Importante:
- Construir pantalla por pantalla. Esperar aprobación antes de continuar.
- Si algo no está en `components.md`, preguntar antes de crear nuevo.
- Verificar que chart ROI sea el MISMO que en GDD/GDCV-agc (no reimplementar).
- No modificar GDD, GDCV-agc, ni componentes existentes.

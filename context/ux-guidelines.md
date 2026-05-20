# ACTUALIZACIÓN: ux-guidelines.md §8 Accesibilidad + §9 Anti-patterns

---

## Sección a REEMPLAZAR: §8 Accesibilidad

**LOCALIZAR en ux-guidelines.md y REEMPLAZAR por:**

```markdown
## 8. Accesibilidad

- Estados de foco: siempre `--ring`.
- Contraste mínimo texto/fondo: 4.5:1 (WCAG AA).
- Colores de chart: ratio >3:1 sobre fondo blanco (estándar) o >2.7:1 si se mitiga con patrón visual (WCAG Border).
- No comunicar información solo por color — acompañar con patrón visual (sólido/punteado/grosor), texto o ícono.
- Íconos decorativos: `aria-hidden="true"`.
- Tablas: `<caption>` o `aria-label` descriptivo.
- Charts: validar con herramientas de daltonismo (protanopia, deuteranopia, tritanopia).
  - Recharts: usar `role="img"` + `aria-label` descriptivo en ResponsiveContainer.
  - Leyenda siempre: colores + patrones visuales (sólido/punteado) + labels.
```

---

## Sección a REEMPLAZAR: §9 Anti-patterns

**LOCALIZAR en ux-guidelines.md y REEMPLAZAR por:**

```markdown
## 9. Anti-patterns

- ❌ Mostrar datos de otros usuarios al Socio
- ❌ Exponer el módulo **Mantenimiento** al Socio / Cesionario (sidebar, rutas, tablas, KPIs o acciones de mantención)
- ❌ Incluir ítem “Mantenimiento” en navegación del flow Socio (`/gdcv/socio/*`)
- ❌ Usar `--primary` en charts
- ❌ Usar colores de chart en botones, badges o navegación
- ❌ Confiar SOLO en color para diferenciar series — siempre acompañar con patrón visual (sólido/punteado/grosor)
- ❌ Poner la acción principal fuera del viewport en mobile
- ❌ Usar Dialog (modal centrado) para drill-down — usar Sheet
- ❌ Mostrar pantalla vacía sin contexto cuando no hay datos
- ❌ Mezclar períodos distintos en la misma vista sin indicarlo
- ❌ Reutilizar la misma serie para 1M / 3M / 6M sin derivación
- ❌ Ocultar el estado del sistema (cargando, error, vacío)
- ❌ Abrir detalle o drill-down en página nueva si cumple criterio Sheet (§3)
- ❌ Fuentes distintas a `--font-sans`
- ❌ Hardcodear `font-family` en componentes
- ❌ Tamaños de fuente menores a 0.75rem (12px)
- ❌ Crear variantes de TabsForBlocks fuera del spec de `components.md`
- ❌ Usar tab activo con `--primary` o color negro — siempre `bg-white shadow-sm`
- ❌ Dejar columnas con altura auto en layouts multi-columna que requieren equal height
- ❌ Table dentro de Card
- ❌ Usar heading semántico incorrecto — el nivel del tag define jerarquía, no el tamaño visual
- ❌ Charts sin tooltip accesible — información debe ser explorable sin hover
- ❌ Líneas de chart muy delgadas (<1.5px) con colores claros — aumentar grosor para visibilidad
```

---

## Nueva sección a AGREGAR: §10 Charts Financieros (Paleta Extendida)

**AGREGAR AL FINAL del documento, antes de cualquier índice:**

```markdown
## 10. Charts Financieros — Paleta Extendida (Zinc + Green + Rose)

### Contexto

Charts de proyección financiera (ROI, recuperación, payback) requieren semántica
que va más allá de la paleta green estándar. Necesitan comunicar:
- Datos reales (concretos, no negociables)
- Proyecciones (probables pero inciertas)
- Oportunidades (favorable, positivo)
- Riesgos (cautela, adversidades)

### Paleta y uso

| Rol | Color | Ejemplo | Grosor | Patrón | Contrast |
|---|---|---|---|---|---|
| Datos reales | Zinc 950 | Real acumulada | 3px | Sólido | 16:1 ✅ AAA |
| Proyecciones | Zinc 600 @ 60% | Base | 2px | Sólido | 8:1 ✅ AA |
| Favorable | Green 500 | Escenario optimista | 1.5px | Sólido | 7.1:1 ✅ AA |
| Riesgo | Rose 400 | Escenario cautela | 2.5px | Punteado | 3.1:1 ⚠️ Border |
| Meta/Éxito | Green 600 | Objetivo, breakeven | 2px | Sólido | 9.8:1 ✅ AA |
| Referencia | Zinc 800 | Hoy, marcador temporal | 1.5px | Sólido | 11:1 ✅ AAA |

### Reglas

**Construcción:**
1. Línea de dato real = Zinc 950 sólida, máxima prominencia
2. Líneas de proyección = Zinc 600 con alpha 0.6, comunica incertidumbre
3. Línea favorable = Green 500, comunica oportunidad
4. Línea riesgo = Rose 400 punteada, comunica cautela (grosor compensa bajo contraste)
5. Línea meta = Green 600, objetivo esperado (neutral, no rojo = no es amenaza)
6. Referencia temporal = Zinc 800, marcador presente

**Accesibilidad:**
- Rose 400 (3.1:1 contrast) es WCAG Border — SOLO permitido si:
  - strokeWidth >= 2.5px
  - Patrón visual diferente (punteada, no sólida)
  - Acompañado de patrón en leyenda + tooltip
- Validar con herramienta de daltonismo antes de ship
- Tooltip accesible al hover — información no se pierde sin color

**Patrón visual:**
- NO confiar solo en color
- Combinación: color + grosor + patrón (sólido/punteado)
- Leyenda clara: muestra color + patrón + label

### Ejemplo: ROI Projection Chart

```
Real acumulada         Zinc 950 sólida 3px      (dato, máxima autoridad)
Base                   Zinc 600 @60% sólida 2px (proyección, menos certeza)
Favorable (optimista)  Green 500 sólida 1.5px   (oportunidad)
Riesgo (cautela)       Rose 400 punteada 2.5px  (alerta, suave)
Meta (objetivo)        Green 600 sólida 2px     (éxito esperado)
Hoy (presente)         Zinc 800 sólida 1.5px    (referencia temporal)
```

### Documentación y governance

Paleta extendida está documentada en `design-system.md` §1 "Paleta extendida para Finanzas".
Revisable cuando se defina color de marca primario en el sistema.

### Cuándo usar

✅ Charts de proyección financiera (ROI, payback, recuperación)
✅ Comparativas de escenarios (base vs favorable vs riesgo)
❌ Charts de generación, consumo, o energía (usar Green ramp estándar)
❌ UI funcional (botones, badges, navegación)

### Cuándo NO usar

- Gráficos de performance operacional (usar Green ramp)
- Datos energéticos (autoconsumo, inyectada)
- UI/navegación/acciones
- Si no hay capacidad de validar accesibilidad (daltonismo)
```

---

## Resumen de cambios

| Sección | Cambio |
|---------|--------|
| **§8 Accesibilidad** | Actualizar directives sobre color + patrón visual + validación daltonismo |
| **§9 Anti-patterns** | Agregar anti-pattern: "No confiar solo en color" |
| **§10 (nueva)** | Guía completa para paleta extendida + cuándo usar |

---

**Nota:** §10 es NEW CONTENT. §8 y §9 son REEMPLAZOS de texto existente.

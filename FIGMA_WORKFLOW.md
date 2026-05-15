# 🎨 Flujo de Trabajo: Figma → HINS Flows

Este documento explica cómo automatizar la importación de flows desde Figma usando dos métodos.

---

## 📋 Configuración (Una sola vez)

### 1️⃣ Obtener credenciales de Figma

#### ✅ FILE_KEY
De la URL de tu archivo Figma:
```
https://www.figma.com/file/[FILE_KEY]/nombre-del-archivo
```

#### ✅ Personal Access Token
1. En Figma → Avatar (arriba a la derecha)
2. **Settings** → **Personal access tokens**
3. **Generate new token** → `HINS_API`
4. Copia el token (aparece UNA sola vez)

### 2️⃣ Guardar credenciales

Crea `.env.local` en la raíz del proyecto:
```
FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxxxxxx
FIGMA_FILE_KEY=abcde1234567890
```

**⚠️ IMPORTANTE:** `.env.local` está en `.gitignore` — nunca commits esto.

---

## 🚀 Método A: Importar directamente desde API de Figma (Ideal)

**Requisitos:** Token con acceso API (algunos planes de Figma pueden tener restricciones)

### Paso 1: Explorar estructura de Figma
```bash
npm run figma:explore
```
Muestra todas las páginas y frames disponibles en tu archivo.

### Paso 2: Importar un flow específico
```bash
npm run figma:import -- \
  --name "GDD" \
  --page "🍃 HINS - Flow-> GDD" \
  --output flows/GDD
```

**Qué genera automáticamente:**
- ✅ `flows/GDD/flow.md` — documentación completa
- ✅ `flows/GDD/GDD_01.png`, `GDD_02.png`, etc — wireframes
- ✅ Estructura de pantallas y anotaciones parseadas

---

## 📸 Método B: Desde Screenshots (Fallback)

Si el Método A no funciona por restricciones de permisos en Figma Free.

### Paso 1: Exporta screenshots desde Figma

En Figma, para cada frame:
1. Selecciona el frame
2. **Export** (botón derecha)
3. Formato: **PNG** @ 2x
4. Destino: `flows/[nombre]/`

Estructura esperada:
```
flows/GDD/
├── GDD_01_Performance.png
├── GDD_02_ROI.png
├── GDD_03_Configuracion.png
└── (otros screenshots)
```

### Paso 2: Genera flow.md automáticamente

```bash
npm run flow:from-images -- \
  --name "GDD" \
  --actor "Dueño GDD" \
  --dir flows/GDD
```

**Qué genera:**
- ✅ `flows/GDD/flow.md` — estructura inicial documentada
- ✅ Índice de pantallas (nombres basados en screenshots)
- ✅ Template de mock data

### Paso 3: Completa el flow.md

El archivo generado tiene placeholders para:
- [ ] Describir qué hace cada pantalla
- [ ] Documentar flujos de usuario
- [ ] Listar componentes usados
- [ ] Definir interfaces de datos

---

## 🔍 Estructura esperada en Figma

Para que los scripts funcionen bien, organiza tu archivo así:

```
Archivo Figma
├── Page: "🍃 HINS - Flow-> GDD"
│   ├── Frame: "GDD_01_Performance" 
│   │   ├── Group: "Header" (encabezado verde)
│   │   ├── Group: "KPIs" (tarjetas principales)
│   │   ├── Component: "Card" (reutilizable)
│   │   └── Text: "[Anotación]" (violeta/contexto)
│   │
│   ├── Frame: "GDD_02_ROI"
│   │   └── [similar]
│   │
│   └── Frame: "GDD_03_Config"
│       └── [similar]
│
└── Page: "🍃 HINS - Flow-> GDCV"
    ├── Frame: "GDCV_admin_01"
    └── Frame: "GDCV_admin_02"
```

**Reglas:**
- 1 **Frame** = 1 pantalla
- Nombre del frame = ID de la pantalla (`GDD_01`, `GDCV_admin_01`, etc)
- Frames adentro de Pages (Figma organization)
- Text con anotaciones en violeta facilita documentación

---

## 📋 Checklist: Después de importar

Una vez importado el flow con cualquiera de los métodos:

- [ ] ✅ Leí `flows/[nombre]/flow.md`
- [ ] ✅ Revisé las anotaciones y descripción de cada pantalla
- [ ] ✅ Documenté los componentes usados (ver `@context/components.md`)
- [ ] ✅ Creé `data/[nombre]-mock.ts` con interfaces y datos
- [ ] ✅ Revisé que los nombres de pantallas coincidan con rutas en `/app`
- [ ] ✅ Comencé a construir componentes en `/components`

---

## 🛠️ Troubleshooting

### ❌ "FIGMA_TOKEN o FIGMA_FILE_KEY no están definidos"
→ Crea `.env.local` con los datos correctos

### ❌ "Figma API error: Forbidden"
→ El token podría tener permisos limitados. Usa **Método B** (screenshots)

### ❌ "No se encontraron screenshots"
→ Asegúrate de exportarlos desde Figma a `flows/[nombre]/` con extensión `.png`

### ❌ "Página no encontrada"
→ Usa `npm run figma:explore` para ver el nombre exacto de la página

---

## 💡 Tips

1. **Automáticamente documentado:** No necesitas escribir `flow.md` a mano
2. **Reutilizable:** Cada vez que cambies el design en Figma, puedes regenerar
3. **Flexible:** Completa los detalles después de importar
4. **Sincronizado:** Los screenshots siempre están en `flows/[nombre]/`

---

## Ejemplo: Importar el flujo "New Project"

### Con Método A (API):
```bash
npm run figma:import -- \
  --name "NewProject" \
  --page "🍃 HINS - Flow-> New proyect" \
  --output flows/NewProject
```

### Con Método B (Screenshots):
```bash
# 1. Exporta desde Figma a flows/NewProject/
# 2. Ejecuta:
npm run flow:from-images -- \
  --name "NewProject" \
  --actor "HINS Admin" \
  --dir flows/NewProject
```

---

**¡Listo!** Ahora puedes iterar sobre el flow.md y comenzar a construir componentes.

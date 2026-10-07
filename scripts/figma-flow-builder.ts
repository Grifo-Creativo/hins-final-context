#!/usr/bin/env node

/**
 * Figma Flow Builder — Automatiza la extracción de flows desde Figma
 *
 * Uso:
 * npx ts-node scripts/figma-flow-builder.ts --page "🍃 HINS - Flow-> New proyect" --output flows/NewProject
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Cargar .env.local manualmente
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Tipos de la API de Figma
interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  characters?: string;
  componentSetId?: string;
  mainComponent?: boolean;
  fills?: Array<{ type: string; color?: { r: number; g: number; b: number } }>;
  strokes?: Array<{ type: string; color?: { r: number; g: number; b: number } }>;
}

interface FigmaFile {
  document: FigmaNode;
  components: Record<string, any>;
}

interface Screen {
  name: string;
  frameId: string;
  description: string;
  annotations: string[];
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error("❌ Error: FIGMA_TOKEN o FIGMA_FILE_KEY no están definidos en .env.local");
  process.exit(1);
}

const API_BASE = "https://api.figma.com/v1";

/**
 * Obtiene el archivo completo de Figma
 */
async function fetchFigmaFile(): Promise<FigmaFile> {
  console.log("📡 Conectando a Figma API...");

  const response = await fetch(`${API_BASE}/files/${FIGMA_FILE_KEY}`, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.statusText}`);
  }

  return (await response.json()) as FigmaFile;
}

/**
 * Encuentra una página por nombre
 */
function findPage(document: FigmaNode, pageName: string): FigmaNode | null {
  if (document.name === pageName && document.type === "CANVAS") {
    return document;
  }

  if (document.children) {
    for (const child of document.children) {
      const found = findPage(child, pageName);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Extrae frames (pantallas) de una página
 */
function extractFrames(pageNode: FigmaNode): Screen[] {
  const screens: Screen[] = [];

  if (!pageNode.children) return screens;

  for (const child of pageNode.children) {
    if (child.type === "FRAME") {
      const annotations: string[] = [];

      // Busca texto que parezca anotaciones (dentro del frame)
      if (child.children) {
        for (const subChild of child.children) {
          // Nodos de texto que podrían ser anotaciones
          if (subChild.type === "TEXT" && subChild.characters) {
            // Heurística: si el texto está en un componente violeta o es un label largo
            annotations.push(subChild.characters);
          }
        }
      }

      screens.push({
        name: child.name,
        frameId: child.id,
        description: annotations.join(" / ") || "Sin descripción",
        annotations,
      });
    }
  }

  return screens;
}

/**
 * Genera un flow.md básico con la estructura
 */
function generateFlowMd(
  flowName: string,
  screens: Screen[],
  actor: string = "Usuario"
): string {
  const timestamp = new Date().toISOString().split("T")[0];

  let md = `# ${flowName}\n\n`;
  md += `**Estado:** ⏳ Draft (autogenerado desde Figma)\n`;
  md += `**Fecha:** ${timestamp}\n`;
  md += `**Actor:** ${actor}\n\n`;

  md += `---\n\n`;
  md += `## Estructura del Flujo\n\n`;

  screens.forEach((screen, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    md += `### ${flowName}_${num} — ${screen.name}\n\n`;
    md += `**Descripción:** ${screen.description}\n`;
    md += `**Wireframe:** \`${flowName}_${num}.png\`\n\n`;

    if (screen.annotations.length > 0) {
      md += `**Anotaciones:**\n`;
      screen.annotations.forEach((ann) => {
        md += `- ${ann}\n`;
      });
      md += `\n`;
    }

    md += `**Componentes usados:**\n`;
    md += `- [ ] Completar después de revisar diseño\n\n`;
  });

  md += `---\n\n`;
  md += `## Mock Data\n\n`;
  md += `\`\`\`typescript\n`;
  md += `// data/${flowName.toLowerCase()}-mock.ts\n`;
  md += `export const ${flowName}MockData = {\n`;
  md += `  // TODO: Completar con datos de ejemplo\n`;
  md += `};\n`;
  md += `\`\`\`\n\n`;

  md += `---\n\n`;
  md += `## Rutas en /app\n\n`;
  screens.forEach((screen, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    md += `- \`/${flowName.toLowerCase()}/${num}\` ← ${screen.name}\n`;
  });

  return md;
}

/**
 * Exporta screenshots de cada frame
 */
async function exportScreenshots(
  screens: Screen[],
  outputDir: string,
  flowName: string
): Promise<void> {
  console.log(`\n📸 Exportando screenshots...`);

  const frameIds = screens.map((s) => s.frameId).join(",");

  const response = await fetch(
    `${API_BASE}/files/${FIGMA_FILE_KEY}/images?ids=${frameIds}&format=png&scale=2`,
    {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN || "",
      },
    }
  );

  if (!response.ok) {
    console.warn(`⚠️  No se pudieron exportar automáticamente. Exporta desde Figma manualmente.`);
    return;
  }

  const data = (await response.json()) as Record<string, string>;

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const num = String(i + 1).padStart(2, "0");
    const imageUrl = data.images?.[screen.frameId];

    if (imageUrl) {
      const imgResponse = await fetch(imageUrl);
      const buffer = await imgResponse.buffer();

      const filename = `${flowName}_${num}.png`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, buffer);
      console.log(`  ✅ ${filename}`);
    }
  }
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  let pageName = "🍃 HINS - Flow-> New proyect";
  let outputDir = "flows/NewProject";
  let flowName = "NewProject";

  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--page") pageName = args[i + 1];
    if (args[i] === "--output") outputDir = args[i + 1];
    if (args[i] === "--name") flowName = args[i + 1];
  }

  try {
    console.log(`🎨 HINS Figma Flow Builder\n`);
    console.log(`📄 Página: "${pageName}"`);
    console.log(`📁 Output: "${outputDir}"\n`);

    // 1. Obtener archivo Figma
    const figmaFile = await fetchFigmaFile();
    console.log("✅ Archivo Figma descargado\n");

    // 2. Encontrar página
    const pageNode = findPage(figmaFile.document, pageName);
    if (!pageNode) {
      console.error(`❌ Página "${pageName}" no encontrada`);
      process.exit(1);
    }
    console.log(`✅ Página encontrada: ${pageNode.name}\n`);

    // 3. Extraer frames
    const screens = extractFrames(pageNode);
    console.log(`✅ Pantallas extraídas: ${screens.length}\n`);
    screens.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.name}`);
    });

    // 4. Crear directorio de output
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`\n✅ Directorio creado: ${outputDir}\n`);
    }

    // 5. Generar flow.md
    const flowMd = generateFlowMd(flowName, screens);
    const flowMdPath = path.join(outputDir, "flow.md");
    fs.writeFileSync(flowMdPath, flowMd);
    console.log(`✅ flow.md generado: ${flowMdPath}\n`);

    // 6. Exportar screenshots
    await exportScreenshots(screens, outputDir, flowName);

    console.log(`\n✨ ¡Listo! Flujo "${flowName}" importado desde Figma`);
    console.log(`\nSiguientes pasos:`);
    console.log(`1. Revisa ${flowMdPath}`);
    console.log(`2. Completa Mock Data en data/${flowName.toLowerCase()}-mock.ts`);
    console.log(`3. Documenta componentes usados en cada pantalla`);
  } catch (error) {
    console.error(`❌ Error:`, error);
    process.exit(1);
  }
}

main();

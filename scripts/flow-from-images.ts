#!/usr/bin/env node

/**
 * Flow Builder from Images — Genera flow.md a partir de screenshots exportados de Figma
 *
 * Uso:
 * 1. Exporta screenshots de cada frame desde Figma a flows/[flowname]/
 * 2. Ejecuta: npm run flow:from-images -- --name "GDD" --actor "Dueño GDD"
 *
 * Genera automáticamente:
 * - flow.md con estructura de pantallas
 * - Índice de imágenes
 */

import fs from "fs";
import path from "path";

interface FlowConfig {
  name: string;
  actor: string;
  outputDir: string;
}

function extractScreensFromDir(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directorio no encontrado: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    console.error(`❌ No se encontraron screenshots (.png) en ${dir}`);
    console.error(`   Por favor, exporta desde Figma primero.`);
    process.exit(1);
  }

  return files.sort();
}

function generateFlowMd(config: FlowConfig, screenshots: string[]): string {
  const timestamp = new Date().toISOString().split("T")[0];

  let md = `# ${config.name}\n\n`;
  md += `**Estado:** ⏳ WIP (generado desde screenshots de Figma)\n`;
  md += `**Fecha:** ${timestamp}\n`;
  md += `**Actor:** ${config.actor}\n\n`;

  md += `---\n\n`;
  md += `## 📐 Estructura del Flujo\n\n`;

  screenshots.forEach((screenshot, idx) => {
    // Extrae nombre del archivo sin extensión
    const screenName = screenshot.replace(".png", "");
    const screenNum = String(idx + 1).padStart(2, "0");

    md += `### ${config.name}_${screenNum} — ${screenName}\n\n`;
    md += `**Wireframe:** \`${screenshot}\`\n\n`;
    md += `**Descripción:**\n`;
    md += `- [ ] Completar descripción de esta pantalla\n`;
    md += `- [ ] Documentar flujo de usuario\n\n`;

    md += `**Componentes usados:**\n`;
    md += `- [ ] Card\n`;
    md += `- [ ] Button\n`;
    md += `- [ ] [Completar]\n\n`;

    md += `**Datos mockados:**\n`;
    md += `- [ ] Definir interfaces en data/${config.name.toLowerCase()}-mock.ts\n\n`;
  });

  md += `---\n\n`;
  md += `## 📦 Mock Data\n\n`;
  md += `**Archivo:** \`data/${config.name.toLowerCase()}-mock.ts\`\n\n`;
  md += `\`\`\`typescript\n`;
  md += `// TODO: Completar con datos de ejemplo\n`;
  md += `export const ${config.name}MockData = {\n`;
  md += `  screens: [\n`;

  screenshots.forEach((screenshot, idx) => {
    const screenName = screenshot.replace(".png", "");
    md += `    { id: '${idx + 1}', name: '${screenName}', data: {} },\n`;
  });

  md += `  ],\n`;
  md += `};\n`;
  md += `\`\`\`\n\n`;

  md += `---\n\n`;
  md += `## 🗂️ Rutas en /app\n\n`;

  screenshots.forEach((screenshot, idx) => {
    const screenNum = String(idx + 1).padStart(2, "0");
    const routeName = screenshot.replace(".png", "").toLowerCase();
    md += `- \`/${config.name.toLowerCase()}/${screenNum}\` ← ${screenshot}\n`;
  });

  return md;
}

async function main() {
  const args = process.argv.slice(2);
  const config: FlowConfig = {
    name: "NewFlow",
    actor: "Usuario",
    outputDir: "flows/NewFlow",
  };

  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name") config.name = args[i + 1];
    if (args[i] === "--actor") config.actor = args[i + 1];
    if (args[i] === "--dir") config.outputDir = args[i + 1];
  }

  try {
    console.log(`\n📐 HINS Flow Builder from Screenshots\n`);
    console.log(`🎯 Flow: ${config.name} (${config.actor})`);
    console.log(`📁 Directorio: ${config.outputDir}\n`);

    // 1. Extraer screenshots
    const screenshots = extractScreensFromDir(config.outputDir);
    console.log(`✅ Encontrados ${screenshots.length} screenshots:\n`);
    screenshots.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s}`);
    });

    // 2. Generar flow.md
    const flowMd = generateFlowMd(config, screenshots);
    const flowMdPath = path.join(config.outputDir, "flow.md");
    fs.writeFileSync(flowMdPath, flowMd);

    console.log(`\n✅ flow.md generado: ${flowMdPath}\n`);
    console.log(`\n📋 Siguientes pasos:`);
    console.log(`1. Completa las descripciones en ${flowMdPath}`);
    console.log(`2. Crea data/${config.name.toLowerCase()}-mock.ts con los datos`);
    console.log(`3. Implementa componentes en /app según las rutas listadas`);
    console.log(`4. Actualiza components.md si usas componentes nuevos\n`);
  } catch (error) {
    console.error(`\n❌ Error:`, error);
    process.exit(1);
  }
}

main();

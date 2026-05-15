#!/usr/bin/env node

/**
 * Figma Explorer — Explora la estructura de un archivo Figma
 * Útil para entender qué páginas y frames tienes disponibles
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

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

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaFile {
  document: FigmaNode;
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error("❌ Error: FIGMA_TOKEN o FIGMA_FILE_KEY no están definidos en .env.local");
  process.exit(1);
}

const API_BASE = "https://api.figma.com/v1";

async function fetchFigmaFile(): Promise<FigmaFile> {
  const response = await fetch(`${API_BASE}/files/${FIGMA_FILE_KEY}`, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN as string,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.statusText}`);
  }

  return (await response.json()) as FigmaFile;
}

function printTree(node: FigmaNode, indent = 0) {
  const prefix = "  ".repeat(indent);
  const icon =
    node.type === "CANVAS"
      ? "📄"
      : node.type === "FRAME"
        ? "🖼️"
        : node.type === "COMPONENT" || node.type === "COMPONENT_SET"
          ? "⚙️"
          : node.type === "TEXT"
            ? "📝"
            : node.type === "GROUP"
              ? "📦"
              : "•";

  console.log(`${prefix}${icon} [${node.type}] ${node.name}`);

  if (node.children && node.children.length > 0) {
    // Solo mostrar primeros 20 children para no saturar output
    const childrenToShow = node.children.slice(0, 20);
    childrenToShow.forEach((child) => {
      printTree(child, indent + 1);
    });

    if (node.children.length > 20) {
      console.log(`${prefix}  ... y ${node.children.length - 20} más`);
    }
  }
}

async function main() {
  try {
    console.log(`🔍 Figma Explorer\n`);
    console.log(`📡 Conectando a Figma...\n`);

    const figmaFile = await fetchFigmaFile();
    console.log(`✅ Archivo descargado: ${figmaFile.document.name}\n`);
    console.log(`📊 Estructura del archivo:\n`);

    printTree(figmaFile.document);

    console.log(`\n✨ Usa el nombre exacto de la página con: npm run figma:import -- --page "nombre"`);
  } catch (error) {
    console.error(`❌ Error:`, error);
    process.exit(1);
  }
}

main();

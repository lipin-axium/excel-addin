#!/usr/bin/env node
/**
 * Generates src/lib/skills/defaultSkills.ts by embedding all skill SKILL.md
 * files as TypeScript string constants.
 *
 * Run: node scripts/generate-default-skills.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const OUT_FILE = path.join(ROOT, "src", "lib", "skills", "defaultSkills.ts");

// List of all skill directories relative to ROOT/skills/
// Format: { name, relativePath }
const SKILL_PATHS = [
  // Custom financial skills
  { name: "financial-models", dir: "financial-models" },
  { name: "fixed-income", dir: "fixed-income" },
  { name: "monte-carlo-simulation", dir: "monte-carlo-simulation" },
  { name: "portfolio-optimization", dir: "portfolio-optimization" },
  { name: "stock-analysis", dir: "stock-analysis" },

  // Financial analysis
  { name: "dcf-model", dir: "financial-analysis/skills/dcf-model" },
  { name: "lbo-model", dir: "financial-analysis/skills/lbo-model" },
  { name: "comps-analysis", dir: "financial-analysis/skills/comps-analysis" },
  { name: "3-statements", dir: "financial-analysis/skills/3-statements" },
  { name: "check-model", dir: "financial-analysis/skills/check-model" },

  // Investment banking
  { name: "merger-model", dir: "investment-banking/skills/merger-model" },
  { name: "datapack-builder", dir: "investment-banking/skills/datapack-builder" },
  { name: "deal-tracker", dir: "investment-banking/skills/deal-tracker" },
  { name: "buyer-list", dir: "investment-banking/skills/buyer-list" },

  // Equity research
  { name: "earnings-preview", dir: "equity-research/skills/earnings-preview" },
  { name: "idea-generation", dir: "equity-research/skills/idea-generation" },
  { name: "model-update", dir: "equity-research/skills/model-update" },
  { name: "thesis-tracker", dir: "equity-research/skills/thesis-tracker" },
  { name: "catalyst-calendar", dir: "equity-research/skills/catalyst-calendar" },
  { name: "morning-note", dir: "equity-research/skills/morning-note" },

  // Private equity
  { name: "dd-checklist", dir: "private-equity/skills/dd-checklist" },
  { name: "returns-analysis", dir: "private-equity/skills/returns-analysis" },
  { name: "unit-economics", dir: "private-equity/skills/unit-economics" },
  { name: "portfolio-monitoring", dir: "private-equity/skills/portfolio-monitoring" },
  { name: "deal-screening", dir: "private-equity/skills/deal-screening" },
  { name: "dd-meeting-prep", dir: "private-equity/skills/dd-meeting-prep" },
  { name: "deal-sourcing", dir: "private-equity/skills/deal-sourcing" },
  { name: "ic-memo", dir: "private-equity/skills/ic-memo" },
  { name: "value-creation-plan", dir: "private-equity/skills/value-creation-plan" },

  // Wealth management
  { name: "portfolio-rebalance", dir: "wealth-management/skills/portfolio-rebalance" },
  { name: "tax-loss-harvesting", dir: "wealth-management/skills/tax-loss-harvesting" },
  { name: "financial-plan", dir: "wealth-management/skills/financial-plan" },
  { name: "client-review", dir: "wealth-management/skills/client-review" },
  { name: "investment-proposal", dir: "wealth-management/skills/investment-proposal" },
  { name: "client-report", dir: "wealth-management/skills/client-report" },
];

function escapeTemplateLiteral(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/** Recursively collect all files in a directory, returning { path, content } */
function collectFiles(dirPath, baseDir) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        results.push({ path: relativePath, content });
      } catch (e) {
        console.warn(`Skipping binary file: ${fullPath}`);
      }
    }
  }
  return results;
}

let output = `// AUTO-GENERATED — do not edit manually.
// Regenerate by running: node scripts/generate-default-skills.js

import type { SkillInput } from "./index";

export interface DefaultSkill {
  name: string;
  files: SkillInput[];
}

export const DEFAULT_SKILLS: DefaultSkill[] = [
`;

let count = 0;
const missing = [];

for (const { name, dir } of SKILL_PATHS) {
  const skillDir = path.join(SKILLS_DIR, dir);
  const files = collectFiles(skillDir, skillDir);

  if (files.length === 0) {
    missing.push(dir);
    console.warn(`⚠️  No files found for skill "${name}" at ${skillDir}`);
    continue;
  }

  output += `  {\n    name: ${JSON.stringify(name)},\n    files: [\n`;
  for (const { path: filePath, content } of files) {
    output += `      { path: ${JSON.stringify(filePath)}, data: \`${escapeTemplateLiteral(content)}\` },\n`;
  }
  output += `    ],\n  },\n`;
  count++;
}

output += `];\n`;

fs.writeFileSync(OUT_FILE, output, "utf-8");

console.log(`✅ Generated ${OUT_FILE}`);
console.log(`   Embedded ${count} skills`);
if (missing.length > 0) {
  console.log(`   Missing: ${missing.join(", ")}`);
}

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const prismaSeed = path.join(root, "prisma", "seed.js");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });

const jsFiles = [...walk(srcDir), prismaSeed].filter((file) => file.endsWith(".js"));

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
}

process.env.DATABASE_URL ||= "postgresql://postgres:postgres@localhost:5432/nivaas?schema=public";
process.env.JWT_SECRET ||= "smoke-check-secret";

require(path.join(srcDir, "app.js"));

console.log(`Smoke check passed: syntax checked ${jsFiles.length} files and loaded Express app.`);

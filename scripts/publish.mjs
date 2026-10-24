import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "web/dist");
rmSync(resolve(root, "assets"), { recursive: true, force: true });
mkdirSync(resolve(root, "assets"), { recursive: true });
cpSync(resolve(dist, "assets"), resolve(root, "assets"), { recursive: true });
cpSync(resolve(dist, "index.html"), resolve(root, "index.html"));
console.log("published", resolve(dist, "index.html"), "->", resolve(root, "index.html"));

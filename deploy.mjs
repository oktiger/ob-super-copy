import { copyFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import process from "process";

const PLUGIN_ID = "ob-super-copy";
const DEFAULT_VAULT = "~/Documents/TigerSync";

// The build directory whose contents are exactly what gets installed into the
// Obsidian plugin folder. Populated by `npm run build`.
const DIST_DIR = "dist";
const FILES = ["main.js", "manifest.json", "styles.css"];

const VAULT = resolveVaultPath();
const obsidianDir = join(VAULT, ".obsidian");

const dest = join(obsidianDir, "plugins", PLUGIN_ID);
mkdirSync(dest, { recursive: true });

for (const file of FILES) {
	const src = join(DIST_DIR, file);
	if (!existsSync(src)) {
		console.error(`✗ Missing build artifact: ${src} (run "npm run build" first)`);
		process.exit(1);
	}
	copyFileSync(src, join(dest, file));
	console.log(`  → ${file}`);
}

console.log(`✓ Deployed "${PLUGIN_ID}" to ${dest}`);

function resolveVaultPath() {
	if (process.env.VAULT) {
		return assertVault(process.env.VAULT, "VAULT environment variable");
	}

	return assertVault(DEFAULT_VAULT, "default vault path");
}

function assertVault(path, source) {
	const vault = normalizePath(path);
	if (!existsSync(join(vault, ".obsidian"))) {
		console.error(
			`✗ Not an Obsidian vault from ${source} (no .obsidian found): ${vault}`
		);
		process.exit(1);
	}
	return vault;
}

function normalizePath(path) {
	if (path === "~") {
		return homedir();
	}
	if (path.startsWith("~/")) {
		return join(homedir(), path.slice(2));
	}
	return path;
}

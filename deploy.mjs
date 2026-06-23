import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import process from "process";

// Where to install the plugin. Override with: VAULT=/path/to/vault npm run deploy
const VAULT =
	process.env.VAULT || "/Users/biem.mini/Documents/TigerSync";

const PLUGIN_ID = "ob-super-copy";

// The build directory whose contents are exactly what gets installed into the
// Obsidian plugin folder. Populated by `npm run build`.
const DIST_DIR = "dist";
const FILES = ["main.js", "manifest.json", "styles.css"];

const obsidianDir = join(VAULT, ".obsidian");
if (!existsSync(obsidianDir)) {
	console.error(
		`✗ Not an Obsidian vault (no .obsidian found): ${VAULT}\n` +
			`  Set the target with: VAULT=/path/to/vault npm run deploy`
	);
	process.exit(1);
}

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

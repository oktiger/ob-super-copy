import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const production = process.argv[2] === "production";

const OUT_DIR = "dist";

// Static files that ship alongside the bundled main.js. Copied into dist/ after
// every build so dist/ always holds the complete, ready-to-install plugin.
const STATIC_ASSETS = ["manifest.json", "styles.css"];

const copyAssetsPlugin = {
	name: "copy-assets",
	setup(build) {
		build.onEnd(() => {
			mkdirSync(OUT_DIR, { recursive: true });
			for (const file of STATIC_ASSETS) {
				copyFileSync(file, join(OUT_DIR, file));
			}
		});
	},
};

const context = await esbuild.context({
	entryPoints: ["main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		...builtins,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: production ? false : "inline",
	treeShaking: true,
	outfile: join(OUT_DIR, "main.js"),
	platform: "node",
	plugins: [copyAssetsPlugin],
});

if (production) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}

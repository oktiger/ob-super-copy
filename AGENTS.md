# AGENTS.md

This is an [Obsidian](https://obsidian.md) community plugin, not a standalone app or a web project.

- Plugin ID: `ob-super-copy`
- Display name: Super Copy
- Repo: https://github.com/oktiger/ob-super-copy
- Desktop-only (`manifest.json` → `isDesktopOnly: true`)
- Minimum Obsidian version: `1.8.7`
- Native “copy as a real file object” and absolute-path copy require the **macOS desktop app**

Work locally, keep the plugin small, and prefer existing Obsidian APIs over new abstractions.

## What it does

- Copy a vault file or folder as a native macOS file object (Finder-style paste)
- Copy Markdown / TXT text content
- Copy vault-relative paths, and local absolute paths on macOS
- Create a blank Markdown file or a new folder from File Explorer
- Copy the active note’s full contents from the editor
- Insert a fenced Markdown code block around a selection or at the cursor

The plugin makes **no network requests**. It only reads vault files the user explicitly copies, and stores settings in Obsidian plugin data.

## Layout

| File | Role |
| --- | --- |
| `main.ts` | Plugin entry. `CopyFileMacOSPlugin` (legacy class name) plus `SuperCopySettingTab` |
| `i18n.ts` | UI strings. Locale follows Obsidian via `getLanguage()`, English fallback |
| `styles.css` | Plugin CSS. Class prefix is `cfm-` (legacy “Copy File MacOS”) |
| `manifest.json` | Plugin identity and version shipped to Obsidian |
| `esbuild.config.mjs` | Bundles `main.ts` → `dist/main.js` and copies `manifest.json` + `styles.css` |
| `deploy.mjs` | Copies `dist/` into a local vault’s plugin folder |
| `version-bump.mjs` | Syncs `manifest.json` / `versions.json` on `npm version` |
| `eslint.config.mts` | ESLint with `eslint-plugin-obsidianmd` recommended rules |

There is no `src/` tree. Keep new logic in the existing files unless a split is clearly needed.

Build output lives in `dist/` (`main.js`, `manifest.json`, `styles.css`). Do not edit `dist/` by hand.

## Commands

```bash
npm ci
npm run dev          # esbuild watch → dist/
npm run build        # tsc --noEmit && production bundle
npm run lint
npm run check        # lint + build (this is the CI gate)
npm run deploy       # build artifacts → local vault (run build first)
```

Default deploy vault is `~/Documents/TigerSync`. Override with `VAULT=/path/to/vault`. Destination:

```
<vault>/.obsidian/plugins/ob-super-copy/
```

After deploy, reload Obsidian (or disable/enable the plugin) to pick up changes.

## Architecture notes

- **File Explorer hover buttons** have no official Obsidian API. Buttons are injected into `.nav-file-title` / `.nav-folder-title` on `pointerover`. Rows are recycled by Obsidian; re-hover re-injects. Do not try to persist button nodes across tree re-renders.
- **Native file copy** shells out to `/usr/bin/osascript`. The file path is passed as a trailing argv argument and read inside AppleScript. **Never interpolate paths into the script string.**
- **Absolute paths** come from `FileSystemAdapter.getFullPath()`. Guard with `Platform.isMacOS && Platform.isDesktop` and an `instanceof FileSystemAdapter` check.
- **Text clipboard** uses `navigator.clipboard.writeText`.
- **`.txt` files** are registered as the `markdown` view type so they show in Explorer and open in the editor.
- **Settings** use the imperative `PluginSettingTab` + `Setting` API. Do not switch to Obsidian 1.13 declarative settings until `minAppVersion` is at least 1.13.
- **Settings schema** is `SuperCopySettings`. Old boolean flags (`enableExplorerFileCopy`, etc.) are still migrated in `normalizeExplorerActionVisibility()`; keep that path working.
- **CSS variables** should come from Obsidian (`--text-muted`, `--background-modifier-hover`, …). New classes should keep the `cfm-` prefix.
- **Icons** use `setIcon()` with Lucide names already used in the plugin (`files`, `copy`, `file-plus`, `folder-plus`, `folder-tree`, `file-code-2`).
- **DOM construction** must use Obsidian helpers (`createEl`, `createDiv`, `Setting`). Do not assign `innerHTML` with untrusted content.
- **Commands** currently registered: `copy-current-file`, `insert-markdown-code-block`.

Explorer actions are a matrix of object type × action:

- Object types: `folder`, `markdown`, `text`, `other`
- Actions: `copyFile`, `addNew`, `addNewFolder`, `copyRelativePath`, `copyAbsolutePath`, `copyContent`
- Not every action is valid on every type (`SUPPORTED_EXPLORER_ACTIONS`). `addNew` and `addNewFolder` are folders only; `copyContent` is Markdown/TXT only.

## i18n

Locales live in `i18n.ts`: `en`, `zh`, `zh-tw`, `ja`, `ko`, `de`, `fr`, `es`, `pt-br`.

When adding or changing a user-visible string:

1. Add the key to the `Translation` type
2. Fill **every** locale object
3. Use `this.t.*` in UI code — do not hardcode English in `main.ts`

English is the source of truth. Other locales may be compact (one-line objects); keep that style unless you are rewriting a whole locale.

## Conventions

- TypeScript, target ES2018, `obsidian` is external (never bundle it).
- Match existing style: tabs in `main.ts` / `manifest.json`, existing comment tone, small focused functions.
- Prefer `Notice` for user-facing errors; `console.error` / `console.warn` for diagnostics.
- Guard macOS-only features instead of crashing on other desktop platforms.
- The plugin must stay local-only: no analytics, no fetch, no remote config.
- Do not expand scope (new features, extra files, extra dependencies) unless the task asks for it.
- `eslint-plugin-obsidianmd` is the style/API linter. Fix violations rather than disabling rules.

## Versioning and release

- `package.json` version, `manifest.json` version, and the git tag must match.
- `npm version` runs `version-bump.mjs` and stages `manifest.json` + `versions.json`.
- Pushing a tag runs `.github/workflows/release.yml`: `npm run check`, then a **draft** GitHub release with `dist/main.js`, `dist/manifest.json`, `dist/styles.css`.
- Manual install is those three files in `<vault>/.obsidian/plugins/ob-super-copy/`.

# Super Copy

Super Copy adds faster copy and Markdown editing actions to Obsidian on macOS.

## Features

- Copy a file or folder from the File Explorer as a native macOS file object, ready to paste into Finder or another app.
- Copy the text contents of Markdown and TXT files from the File Explorer.
- Copy relative vault paths for files and folders, and local absolute paths on macOS.
- Create a blank Markdown file directly inside a folder from the File Explorer.
- Copy the full contents of the active note from the editor.
- Insert a fenced Markdown code block around selected text or at the cursor.
- Automatically match Obsidian's interface language, with English fallback.

## Languages

Super Copy supports English, Simplified Chinese, Traditional Chinese, Japanese, Korean, German, French, Spanish, and Brazilian Portuguese.

## Usage

### Copy a file or folder

Hover over an item in the File Explorer and select the files icon, or right-click the item and select **Copy file** or **Copy folder**. You can also run **Super Copy: Copy current file** from the command palette. Command and menu names are translated to match Obsidian's interface language.

The copied item can be pasted into Finder or any macOS app that accepts file objects.

### Copy note contents

Select the copy icon beside a Markdown or TXT file in the File Explorer, or use the copy button in the active note.

### Copy paths and create files

Hover over a file or folder in the File Explorer to copy its relative path. On macOS, you can also copy its local absolute path. Folder rows include a button for creating a blank Markdown file. Each File Explorer action can be enabled or disabled in **Settings → Community plugins → Super Copy**.

### Insert a code block

Run **Super Copy: Insert Markdown code block** from the command palette. To assign a keyboard shortcut, open **Settings → Hotkeys** and search for the command.

The default code block language and each feature can be changed under **Settings → Community plugins → Super Copy**.

## Platform support

Super Copy requires the Obsidian desktop app. Copying files and folders as native file objects specifically requires macOS. The plugin invokes the built-in `/usr/bin/osascript` command only when you request this action; file paths are passed as command arguments and are never interpolated into executable script text.

## Privacy

Super Copy works locally and makes no network requests. It does not collect analytics or telemetry. The plugin reads only the vault files you explicitly copy and stores its settings in Obsidian's plugin data.

## Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest GitHub release.
2. Create `<vault>/.obsidian/plugins/ob-super-copy/`.
3. Copy the three files into that directory.
4. Reload Obsidian and enable **Super Copy** under **Settings → Community plugins**.

## Development

```bash
npm ci
npm run check
```

Build artifacts are written to `dist/`.

## License

[MIT](LICENSE)

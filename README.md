# Super Copy

Super Copy adds faster copy and Markdown editing actions to Obsidian on macOS.

## Features

- Copy a file or folder from the File Explorer as a native macOS file object, ready to paste into Finder or another app.
- Copy the text contents of Markdown and TXT files from the File Explorer.
- Copy the full contents of the active note from the editor.
- Insert a fenced Markdown code block around selected text or at the cursor.
- Optionally add a subtle background panel behind the note content.

## Usage

### Copy a file or folder

Hover over an item in the File Explorer and select the files icon, or right-click the item and select **复制文件** or **复制文件夹**. You can also run **Super Copy: 复制当前文件** from the command palette.

The copied item can be pasted into Finder or any macOS app that accepts file objects.

### Copy note contents

Select the copy icon beside a Markdown or TXT file in the File Explorer, or use the copy button in the active note.

### Insert a code block

Run **Super Copy: 插入 Markdown 代码框** from the command palette. To assign a keyboard shortcut, open **Settings → Hotkeys** and search for the command.

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

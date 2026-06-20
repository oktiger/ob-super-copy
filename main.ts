import {
	FileSystemAdapter,
	Menu,
	Notice,
	Platform,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
	setIcon,
} from "obsidian";
import { execFile } from "child_process";

const OSASCRIPT = "/usr/bin/osascript";

/**
 * AppleScript that writes a real file object (NSURL) onto the macOS general
 * pasteboard via the AppleScript-ObjC bridge. This is the same kind of clipboard
 * payload that Finder produces on Cmd+C, so the file can be pasted (Cmd+V) into
 * Finder and any other app that accepts file paste.
 *
 * The file path is NOT interpolated into this script. It is passed to osascript
 * as a trailing argument and read from `argv`, so spaces / quotes / special
 * characters in the path cannot break or inject into the script.
 */
const COPY_FILE_APPLESCRIPT = [
	'use framework "Foundation"',
	'use framework "AppKit"',
	"use scripting additions",
	"on run argv",
	"    set thePath to item 1 of argv",
	"    set theURL to current application's |NSURL|'s fileURLWithPath:thePath",
	"    set pb to current application's NSPasteboard's generalPasteboard()",
	"    pb's clearContents()",
	"    pb's writeObjects:{theURL}",
	"end run",
].join("\n");

export default class CopyFileMacOSPlugin extends Plugin {
	async onload() {
		// Right-click menu item for files in the File Explorer.
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file: TAbstractFile) => {
				if (!(file instanceof TFile) && !(file instanceof TFolder)) {
					return;
				}
				const title = file instanceof TFolder ? "复制文件夹" : "复制文件";
				menu.addItem((item) => {
					item
						.setTitle(title)
						.setIcon("files")
						.onClick(() => {
							void this.copyFileToClipboard(file);
						});
				});
			})
		);

		// Command palette command for the currently active file.
		this.addCommand({
			id: "copy-current-file",
			name: "复制当前文件",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file) {
					return false;
				}
				if (!checking) {
					void this.copyFileToClipboard(file);
				}
				return true;
			},
		});

		// Make .txt files appear in the File Explorer and open in the editor pane
		// (edited as plain text via the markdown view). Wrapped in try/catch in
		// case another plugin already registered the extension.
		try {
			this.registerExtensions(["txt"], "markdown");
		} catch (err) {
			console.warn("Super Copy: could not register .txt extension:", err);
		}

		// Hover action buttons on each File Explorer row (files and folders).
		// Obsidian has no official API for per-row hover buttons, so we lazily
		// inject them into the `.nav-file-title` / `.nav-folder-title` element the
		// first time a row is hovered. Rows are recycled when the tree re-renders,
		// which discards our buttons with them — re-hovering re-injects, nothing leaks.
		this.registerDomEvent(document, "pointerover", (evt: PointerEvent) => {
			const target = evt.target as HTMLElement | null;
			const titleEl = target?.closest?.(
				".nav-file-title, .nav-folder-title"
			) as HTMLElement | null;
			if (!titleEl || titleEl.querySelector(".cfm-actions")) {
				return;
			}
			const path = titleEl.getAttribute("data-path");
			if (!path) {
				return;
			}
			const file = this.app.vault.getAbstractFileByPath(path);
			if (file instanceof TFile || file instanceof TFolder) {
				this.injectRowButtons(titleEl, file);
			}
		});
	}

	/** Build the hover button group for one file or folder row. */
	private injectRowButtons(
		titleEl: HTMLElement,
		file: TFile | TFolder
	): void {
		const actions = titleEl.createDiv({ cls: "cfm-actions" });

		// Button 1 — copy the file/folder as a real macOS file object. All rows.
		// `files` (stacked files) reads as "duplicate / copy a file".
		const label = file instanceof TFolder ? "复制文件夹" : "复制文件";
		this.makeActionButton(actions, "files", label, () => {
			void this.copyFileToClipboard(file);
		});

		// Button 2 — copy the document's text content. Markdown documents only;
		// folders and non-document files only get the copy button.
		// `copy` (two overlapping squares) is the universal "copy content" icon.
		if (file instanceof TFile && file.extension === "md") {
			this.makeActionButton(actions, "copy", "复制内容", () => {
				void this.copyFileContent(file);
			});
		}
	}

	private makeActionButton(
		parent: HTMLElement,
		icon: string,
		label: string,
		onClick: () => void
	): void {
		const btn = parent.createEl("button", {
			cls: "cfm-action-btn",
			attr: { "aria-label": label },
		});
		setIcon(btn, icon);
		// Prevent the click from bubbling up to the row (which would open the file).
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			onClick();
		});
	}

	private async copyFileContent(file: TFile): Promise<void> {
		try {
			const content = await this.app.vault.cachedRead(file);
			await navigator.clipboard.writeText(content);
			new Notice(`已复制内容：${file.name}`);
		} catch (err) {
			console.error("Copy File (macOS) — copy content failed:", err);
			new Notice(`复制内容失败：${file.name}`);
		}
	}

	private async copyFileToClipboard(file: TFile | TFolder): Promise<void> {
		if (!Platform.isMacOS || !Platform.isDesktop) {
			new Notice("“复制文件”仅支持 macOS 桌面版");
			return;
		}

		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) {
			new Notice("无法获取文件的本地路径");
			return;
		}

		const fullPath = adapter.getFullPath(file.path);
		const kind = file instanceof TFolder ? "文件夹" : "文件";

		try {
			await this.runOsascript(fullPath);
			new Notice(`已复制${kind}：${file.name}`);
		} catch (err) {
			console.error("Copy File (macOS) failed:", err);
			new Notice(`复制失败：${file.name}`);
		}
	}

	private runOsascript(filePath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			execFile(
				OSASCRIPT,
				["-e", COPY_FILE_APPLESCRIPT, filePath],
				(error, _stdout, stderr) => {
					if (error) {
						reject(stderr || error);
						return;
					}
					resolve();
				}
			);
		});
	}
}

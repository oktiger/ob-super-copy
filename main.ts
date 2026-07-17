import { execFile } from "child_process";
import {
	Editor,
	FileSystemAdapter,
	Menu,
	MarkdownView,
	Notice,
	Platform,
	Plugin,
	PluginSettingTab,
	Setting,
	TAbstractFile,
	TFile,
	TFolder,
	setIcon,
} from "obsidian";
import { getTranslation, Translation } from "./i18n";

const OSASCRIPT = "/usr/bin/osascript";

interface SuperCopySettings {
	enableExplorerFileCopy: boolean;
	enableExplorerContentCopy: boolean;
	enableExplorerNewFile: boolean;
	enableExplorerRelativePathCopy: boolean;
	enableExplorerAbsolutePathCopy: boolean;
	enableEditorContentCopyButton: boolean;
	enableInsertCodeBlockCommand: boolean;
	defaultCodeBlockLanguage: string;
}

const DEFAULT_SETTINGS: SuperCopySettings = {
	enableExplorerFileCopy: true,
	enableExplorerContentCopy: true,
	enableExplorerNewFile: true,
	enableExplorerRelativePathCopy: true,
	enableExplorerAbsolutePathCopy: true,
	enableEditorContentCopyButton: true,
	enableInsertCodeBlockCommand: true,
	defaultCodeBlockLanguage: "",
};

const CODE_BLOCK_LANGUAGE_OPTIONS: Record<string, string> = {
	markdown: "Markdown",
	javascript: "JavaScript",
	typescript: "TypeScript",
	python: "Python",
	json: "JSON",
	yaml: "YAML",
	bash: "Shell / Bash",
	html: "HTML",
	css: "CSS",
	sql: "SQL",
};

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
	settings: SuperCopySettings;
	t: Translation;

	async onload() {
		this.t = getTranslation();
		this.removeLegacyBackgroundElements();
		await this.loadSettings();
		this.addSettingTab(new SuperCopySettingTab(this.app, this));
		this.refreshAllFeatures();

		// Right-click menu item for files in the File Explorer.
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file: TAbstractFile) => {
				if (!this.settings.enableExplorerFileCopy) {
					return;
				}
				if (!(file instanceof TFile) && !(file instanceof TFolder)) {
					return;
				}
				const title = file instanceof TFolder ? this.t.copyFolder : this.t.copyFile;
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
			name: this.t.copyCurrentFile,
			checkCallback: (checking: boolean) => {
				if (!this.settings.enableExplorerFileCopy) {
					return false;
				}
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

		this.addCommand({
			id: "insert-markdown-code-block",
			name: this.t.insertMarkdownCodeBlock,
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (!this.settings.enableInsertCodeBlockCommand) {
					return false;
				}
				if (!checking) {
					this.insertMarkdownCodeBlock(editor);
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

		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				this.refreshEditorEnhancements();
			})
		);
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.refreshEditorEnhancements();
			})
		);
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				this.refreshEditorEnhancements();
			})
		);
		this.registerDomEvent(window, "resize", () => {
			this.refreshEditorEnhancements();
		});

		this.app.workspace.onLayoutReady(() => {
			this.refreshAllFeatures();
		});
	}

	async loadSettings(): Promise<void> {
		const savedData: unknown = await this.loadData();
		const savedSettings =
			savedData && typeof savedData === "object"
				? (savedData as Partial<SuperCopySettings>)
				: {};
		this.settings = Object.assign({}, DEFAULT_SETTINGS, savedSettings);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private removeLegacyBackgroundElements(): void {
		document.body.removeClass("cfm-content-background-enabled");
		document
			.querySelectorAll(".cfm-editor-content-panel")
			.forEach((panel) => panel.remove());
	}

	refreshAllFeatures(): void {
		this.refreshExplorerButtons();
		this.refreshEditorEnhancements();
	}

	/** Build the hover button group for one file or folder row. */
	private injectRowButtons(
		titleEl: HTMLElement,
		file: TFile | TFolder
	): void {
		const actions = titleEl.createDiv({ cls: "cfm-actions" });

		// Button 1 — copy the file/folder as a real macOS file object. All rows.
		// `files` (stacked files) reads as "duplicate / copy a file".
		if (this.settings.enableExplorerFileCopy) {
			const label =
				file instanceof TFolder ? this.t.copyFolder : this.t.copyFile;
			this.makeActionButton(actions, "files", label, () => {
				void this.copyFileToClipboard(file);
			});
		}

		// Folder rows get a quick action for creating a blank Markdown file in
		// that folder. It is deliberately placed after the copy action so the two
		// folder-level actions stay together.
		if (this.settings.enableExplorerNewFile && file instanceof TFolder) {
			this.makeActionButton(actions, "file-plus", this.t.newFile, () => {
				void this.createFileInFolder(file);
			});
		}

		// Button 2 — copy the document's text content. Markdown documents only;
		// folders and non-document files only get the copy button.
		// `copy` (two overlapping squares) is the universal "copy content" icon.
		if (this.settings.enableExplorerContentCopy && this.isTextDocument(file)) {
			this.makeActionButton(actions, "copy", this.t.copyContent, () => {
				void this.copyFileContent(file);
			});
		}

		if (this.settings.enableExplorerRelativePathCopy) {
			this.makeActionButton(actions, "folder-tree", this.t.copyRelativePath, () => {
				void this.copyRelativePath(file);
			});
		}

		if (this.settings.enableExplorerAbsolutePathCopy) {
			this.makeActionButton(actions, "file-code-2", this.t.copyAbsolutePath, () => {
				void this.copyAbsolutePath(file);
			});
		}

		titleEl.style.setProperty(
			"--cfm-action-count",
			String(actions.childElementCount)
		);
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
			await this.writeTextToClipboard(content);
			new Notice(this.t.contentCopied(file.name));
		} catch (err) {
			console.error("Copy File (macOS) — copy content failed:", err);
			new Notice(this.t.contentCopyFailed(file.name));
		}
	}

	private async createFileInFolder(folder: TFolder): Promise<void> {
		const filePath = this.getNewFilePath(folder);
		try {
			const file = await this.app.vault.create(filePath, "");
			new Notice(this.t.fileCreated(file.path));
		} catch (err) {
			console.error("Super Copy — create file failed:", err);
			new Notice(this.t.fileCreateFailed);
		}
	}

	private async copyRelativePath(file: TFile | TFolder): Promise<void> {
		const relativePath = file.path || "/";
		try {
			await this.writeTextToClipboard(relativePath);
			new Notice(this.t.relativePathCopied(relativePath));
		} catch (err) {
			console.error("Super Copy — copy relative path failed:", err);
			new Notice(this.t.pathCopyFailed);
		}
	}

	private async copyAbsolutePath(file: TFile | TFolder): Promise<void> {
		if (!Platform.isMacOS || !Platform.isDesktop) {
			new Notice(this.t.absolutePathMacOnly);
			return;
		}

		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) {
			new Notice(this.t.localPathUnavailable);
			return;
		}

		const absolutePath = adapter.getFullPath(file.path);
		try {
			await this.writeTextToClipboard(absolutePath);
			new Notice(this.t.absolutePathCopied(absolutePath));
		} catch (err) {
			console.error("Super Copy — copy absolute path failed:", err);
			new Notice(this.t.pathCopyFailed);
		}
	}

	private getNewFilePath(folder: TFolder): string {
		const basePath = folder.path ? `${folder.path}/Untitled` : "Untitled";
		let suffix = 0;
		let filePath = `${basePath}.md`;

		while (this.app.vault.getAbstractFileByPath(filePath)) {
			suffix += 1;
			filePath = `${basePath} ${suffix}.md`;
		}

		return filePath;
	}

	private async copyFileToClipboard(file: TFile | TFolder): Promise<void> {
		if (!Platform.isMacOS || !Platform.isDesktop) {
			new Notice(this.t.copyFileMacOnly);
			return;
		}

		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) {
			new Notice(this.t.localPathUnavailable);
			return;
		}

		const fullPath = adapter.getFullPath(file.path);
		const kind = file instanceof TFolder ? this.t.folderKind : this.t.fileKind;

		try {
			await this.runOsascript(fullPath);
			new Notice(this.t.fileCopied(kind, file.name));
		} catch (err) {
			console.error("Copy File (macOS) failed:", err);
			new Notice(this.t.copyFailed(file.name));
		}
	}

	private runOsascript(filePath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			execFile(
				OSASCRIPT,
				["-e", COPY_FILE_APPLESCRIPT, filePath],
				(error, _stdout, stderr) => {
					if (error) {
						reject(new Error(stderr || error.message));
						return;
					}
					resolve();
				}
			);
		});
	}

	private async writeTextToClipboard(content: string): Promise<void> {
		if (!navigator.clipboard?.writeText) {
			throw new Error("Clipboard API is not available");
		}
		await navigator.clipboard.writeText(content);
	}

	private refreshExplorerButtons(): void {
		document.querySelectorAll(".cfm-actions").forEach((el) => el.remove());
	}

	private insertMarkdownCodeBlock(editor: Editor): void {
		const language = this.settings.defaultCodeBlockLanguage.trim();
		const fenceStart = `\`\`\`${language}`;
		const selection = editor.getSelection();

		if (selection) {
			editor.replaceSelection(`${fenceStart}\n${selection}\n\`\`\``);
			return;
		}

		const cursor = editor.getCursor();
		editor.replaceRange(`${fenceStart}\n\n\`\`\``, cursor);
		editor.setCursor({
			line: cursor.line + 1,
			ch: 0,
		});
	}

	private refreshEditorEnhancements(): void {
		document
			.querySelectorAll<HTMLElement>(
				".workspace-leaf-content[data-type='markdown'] .view-content"
			)
			.forEach((contentEl) => {
				const contentBounds = this.getRenderedContentBounds(contentEl);
				const existingButton = contentEl.querySelector(
					".cfm-editor-copy-btn"
				);
				if (!this.settings.enableEditorContentCopyButton || !contentBounds) {
					existingButton?.remove();
					return;
				}
				const btn =
					(existingButton as HTMLButtonElement | null) ??
					contentEl.createEl("button", {
						cls: "cfm-editor-copy-btn",
						attr: { "aria-label": this.t.copyCurrentDocumentContent },
					});

				if (!existingButton) {
					setIcon(btn, "copy");
					btn.addEventListener("click", (evt) => {
						evt.preventDefault();
						evt.stopPropagation();

						const file = this.getFileForContentEl(contentEl);
						if (!file) {
							new Notice(this.t.noCurrentDocument);
							return;
						}
						void this.copyFileContent(file);
					});
				}

				btn.style.top = `${contentBounds.top + 8}px`;
				btn.style.left = `${contentBounds.left + contentBounds.width - 36}px`;
			});
	}

	private getRenderedContentBounds(
		contentEl: HTMLElement
	): { top: number; left: number; width: number } | null {
		const viewRect = contentEl.getBoundingClientRect();
		const columnEl = contentEl.querySelector<HTMLElement>(
			[
				".markdown-preview-sizer",
				".markdown-source-view.mod-cm6 .cm-contentContainer",
				".markdown-source-view .cm-contentContainer",
				".markdown-source-view .cm-sizer",
			].join(", ")
		);
		const firstContentEl = this.getFirstRenderedContentEl(contentEl);

		if (!columnEl || !firstContentEl) {
			return null;
		}

		const columnRect = columnEl.getBoundingClientRect();
		const firstRect = firstContentEl.getBoundingClientRect();
		const titleRect = contentEl
			.querySelector<HTMLElement>(".inline-title, .mod-header")
			?.getBoundingClientRect();

		const topPadding = 18;
		const gapAfterTitle = 12;
		const titleBottom = titleRect ? titleRect.bottom - viewRect.top : 0;
		const contentTop = firstRect.top - viewRect.top;
		const top = Math.max(contentTop - topPadding, titleBottom + gapAfterTitle);

		return {
			top,
			left: columnRect.left - viewRect.left,
			width: columnRect.width,
		};
	}

	private getFirstRenderedContentEl(contentEl: HTMLElement): HTMLElement | null {
		const candidates = Array.from(
			contentEl.querySelectorAll<HTMLElement>(
				[
					".markdown-preview-section > div[class^='el-']",
					".markdown-preview-section > p",
					".markdown-preview-section > ul",
					".markdown-preview-section > ol",
					".markdown-preview-section > pre",
					".markdown-preview-section > blockquote",
					".markdown-source-view .cm-content",
				].join(", ")
			)
		);

		return (
			candidates.find((el) => {
				if (el.matches(".mod-header, .inline-title")) {
					return false;
				}
				if (el.querySelector(".inline-title")) {
					return false;
				}
				const rect = el.getBoundingClientRect();
				return rect.width > 0 && rect.height > 0;
			}) ?? null
		);
	}

	private getFileForContentEl(contentEl: HTMLElement): TFile | null {
		for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
			if (
				leaf.view instanceof MarkdownView &&
				leaf.view.containerEl.contains(contentEl)
			) {
				return leaf.view.file;
			}
		}
		return this.app.workspace.getActiveFile();
	}

	private isTextDocument(file: TAbstractFile): file is TFile {
		return file instanceof TFile && ["md", "txt"].includes(file.extension);
	}
}

// Declarative settings require Obsidian 1.13; keep the compatible imperative API
// until 1.13 becomes the minimum supported stable version.
class SuperCopySettingTab extends PluginSettingTab {
	plugin: CopyFileMacOSPlugin;

	constructor(app: CopyFileMacOSPlugin["app"], plugin: CopyFileMacOSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const { t } = this.plugin;
		containerEl.empty();

		this.createSection(
			containerEl,
			t.explorerActions,
			t.explorerActionsDesc
		);

		new Setting(containerEl)
			.setName(t.showCopyFileButton)
			.setDesc(t.showCopyFileButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerFileCopy)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerFileCopy = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		new Setting(containerEl)
			.setName(t.showCopyContentButton)
			.setDesc(t.showCopyContentButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerContentCopy)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerContentCopy = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		new Setting(containerEl)
			.setName(t.showNewFileButton)
			.setDesc(t.showNewFileButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerNewFile)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerNewFile = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		new Setting(containerEl)
			.setName(t.showCopyRelativePathButton)
			.setDesc(t.showCopyRelativePathButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerRelativePathCopy)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerRelativePathCopy = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		new Setting(containerEl)
			.setName(t.showCopyAbsolutePathButton)
			.setDesc(t.showCopyAbsolutePathButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerAbsolutePathCopy)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerAbsolutePathCopy = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		this.createSection(
			containerEl,
			t.documentContentArea,
			t.documentContentAreaDesc
		);

		new Setting(containerEl)
			.setName(t.showCopyDocumentButton)
			.setDesc(t.showCopyDocumentButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableEditorContentCopyButton)
					.onChange(async (value) => {
						this.plugin.settings.enableEditorContentCopyButton = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		this.createSection(
			containerEl,
			t.codeBlockInsertion,
			t.codeBlockInsertionDesc
		);

		new Setting(containerEl)
			.setName(t.enableCodeBlockCommand)
			.setDesc(t.enableCodeBlockCommandDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInsertCodeBlockCommand)
					.onChange(async (value) => {
						this.plugin.settings.enableInsertCodeBlockCommand = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t.defaultCodeBlockLanguage)
			.setDesc(t.defaultCodeBlockLanguageDesc)
			.addDropdown((dropdown) => {
				dropdown.addOption("", t.codeBlockPlain);
				for (const [value, label] of Object.entries(CODE_BLOCK_LANGUAGE_OPTIONS)) {
					dropdown.addOption(value, label);
				}
				const current = this.plugin.settings.defaultCodeBlockLanguage;
				if (current !== "" && !(current in CODE_BLOCK_LANGUAGE_OPTIONS)) {
					dropdown.addOption(current, t.customLanguage(current));
				}
				dropdown
					.setValue(current)
					.onChange(async (value) => {
						this.plugin.settings.defaultCodeBlockLanguage = value;
						await this.plugin.saveSettings();
					});
			});
	}

	private createSection(
		containerEl: HTMLElement,
		title: string,
		description: string
	): void {
		new Setting(containerEl).setName(title).setDesc(description).setHeading();
	}
}

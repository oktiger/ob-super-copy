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

const OSASCRIPT = "/usr/bin/osascript";
const SETTINGS_CLASS = "cfm-content-background-enabled";

interface SuperCopySettings {
	enableExplorerFileCopy: boolean;
	enableExplorerContentCopy: boolean;
	enableEditorContentCopyButton: boolean;
	enableEditorContentBackground: boolean;
	enableInsertCodeBlockCommand: boolean;
	defaultCodeBlockLanguage: string;
}

const DEFAULT_SETTINGS: SuperCopySettings = {
	enableExplorerFileCopy: true,
	enableExplorerContentCopy: true,
	enableEditorContentCopyButton: true,
	enableEditorContentBackground: true,
	enableInsertCodeBlockCommand: true,
	defaultCodeBlockLanguage: "",
};

const CODE_BLOCK_LANGUAGE_OPTIONS: Record<string, string> = {
	"": "普通代码框（不指定语言）",
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

	async onload() {
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
			name: "插入 Markdown 代码框",
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
			if (
				!this.settings.enableExplorerFileCopy &&
				!this.settings.enableExplorerContentCopy
			) {
				return;
			}
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
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
			const label = file instanceof TFolder ? "复制文件夹" : "复制文件";
			this.makeActionButton(actions, "files", label, () => {
				void this.copyFileToClipboard(file);
			});
		}

		// Button 2 — copy the document's text content. Markdown documents only;
		// folders and non-document files only get the copy button.
		// `copy` (two overlapping squares) is the universal "copy content" icon.
		if (this.settings.enableExplorerContentCopy && this.isTextDocument(file)) {
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
			await this.writeTextToClipboard(content);
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
			const execFile = this.getExecFile();
			if (!execFile) {
				reject("child_process is not available");
				return;
			}
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

	private getExecFile(): typeof import("child_process").execFile | null {
		const requireFn =
			(window as unknown as { require?: NodeRequire }).require ??
			(globalThis as unknown as { require?: NodeRequire }).require;
		if (!requireFn) {
			return null;
		}
		return requireFn("child_process").execFile;
	}

	private async writeTextToClipboard(content: string): Promise<void> {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(content);
			return;
		}

		const textarea = document.body.createEl("textarea", {
			text: content,
			attr: { readonly: "true" },
		});
		textarea.addClass("cfm-hidden-clipboard-textarea");
		textarea.select();
		const copied = document.execCommand("copy");
		textarea.remove();

		if (!copied) {
			throw new Error("Clipboard write failed");
		}
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
		document.body.toggleClass(
			SETTINGS_CLASS,
			this.settings.enableEditorContentBackground
		);

		document
			.querySelectorAll<HTMLElement>(
				".workspace-leaf-content[data-type='markdown'] .view-content"
			)
			.forEach((contentEl) => {
				contentEl
					.querySelectorAll(".cfm-editor-content-background")
					.forEach((el) => el.removeClass("cfm-editor-content-background"));

				const contentBounds = this.getRenderedContentBounds(contentEl);
				const panel = this.getOrCreateContentPanel(contentEl);
				if (this.settings.enableEditorContentBackground && contentBounds) {
					this.applyBounds(panel, contentBounds);
					panel.show();
				} else {
					panel.hide();
				}

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
						attr: { "aria-label": "复制当前文档内容" },
					});

				if (!existingButton) {
					setIcon(btn, "copy");
					btn.addEventListener("click", (evt) => {
						evt.preventDefault();
						evt.stopPropagation();

						const file = this.getFileForContentEl(contentEl);
						if (!file) {
							new Notice("没有可复制的当前文档");
							return;
						}
						void this.copyFileContent(file);
					});
				}

				btn.style.top = `${contentBounds.top + 8}px`;
				btn.style.left = `${contentBounds.left + contentBounds.width - 36}px`;
			});
	}

	private getOrCreateContentPanel(contentEl: HTMLElement): HTMLElement {
		return (
			contentEl.querySelector<HTMLElement>(".cfm-editor-content-panel") ??
			contentEl.createDiv({ cls: "cfm-editor-content-panel" })
		);
	}

	private applyBounds(
		el: HTMLElement,
		bounds: { top: number; left: number; width: number }
	): void {
		el.style.top = `${bounds.top}px`;
		el.style.left = `${bounds.left}px`;
		el.style.width = `${bounds.width}px`;
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

class SuperCopySettingTab extends PluginSettingTab {
	plugin: CopyFileMacOSPlugin;

	constructor(app: CopyFileMacOSPlugin["app"], plugin: CopyFileMacOSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Super Copy 设置" });
		this.createSection(
			containerEl,
			"Explorer 操作",
			"控制文件列表里的复制按钮和右键菜单项。"
		);

		new Setting(containerEl)
			.setName("显示复制文件按钮")
			.setDesc("在文件列表行和右键菜单中启用复制文件/文件夹。此功能只支持 macOS 桌面版。")
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
			.setName("显示复制内容按钮")
			.setDesc("在 Markdown 和 TXT 文件行上显示复制文档文本内容的按钮。")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableExplorerContentCopy)
					.onChange(async (value) => {
						this.plugin.settings.enableExplorerContentCopy = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		this.createSection(
			containerEl,
			"文档内容区",
			"控制打开文档正文区域里的复制按钮和背景样式。"
		);

		new Setting(containerEl)
			.setName("显示复制全文按钮")
			.setDesc("在打开文档的内容区域右上角显示复制全文按钮，不放在标题区域。")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableEditorContentCopyButton)
					.onChange(async (value) => {
						this.plugin.settings.enableEditorContentCopyButton = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		new Setting(containerEl)
			.setName("显示浅灰正文背景")
			.setDesc("给文档内容区域添加浅灰色背景，与标题区域和周围白色背景区分。")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableEditorContentBackground)
					.onChange(async (value) => {
						this.plugin.settings.enableEditorContentBackground = value;
						await this.plugin.saveSettings();
						this.plugin.refreshAllFeatures();
					})
			);

		this.createSection(
			containerEl,
			"代码框快捷插入",
			"在编辑器光标处插入 Markdown 代码框，或把选中的文字包进代码框。快捷键请在 Obsidian 的 Hotkeys 页面里设置。"
		);

		new Setting(containerEl)
			.setName("启用代码框插入命令")
			.setDesc("开启后，在 Hotkeys 里搜索“Super Copy: 插入 Markdown 代码框”，绑定你想用的快捷键。")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInsertCodeBlockCommand)
					.onChange(async (value) => {
						this.plugin.settings.enableInsertCodeBlockCommand = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("默认代码框类型")
			.setDesc("选择插入代码框时使用的语言标记。")
			.addDropdown((dropdown) => {
				for (const [value, label] of Object.entries(CODE_BLOCK_LANGUAGE_OPTIONS)) {
					dropdown.addOption(value, label);
				}
				const current = this.plugin.settings.defaultCodeBlockLanguage;
				if (!(current in CODE_BLOCK_LANGUAGE_OPTIONS)) {
					dropdown.addOption(current, `自定义：${current}`);
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

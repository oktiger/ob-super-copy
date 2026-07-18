import { getLanguage } from "obsidian";

export type Translation = {
	codeBlockPlain: string;
	copyFolder: string;
	copyFile: string;
	copyCurrentFile: string;
	newFile: string;
	fileCreated: (path: string) => string;
	fileCreateFailed: string;
	copyRelativePath: string;
	copyAbsolutePath: string;
	relativePathCopied: (path: string) => string;
	absolutePathCopied: (path: string) => string;
	pathCopyFailed: string;
	absolutePathMacOnly: string;
	insertMarkdownCodeBlock: string;
	copyContent: string;
	contentCopied: (name: string) => string;
	contentCopyFailed: (name: string) => string;
	copyFileMacOnly: string;
	localPathUnavailable: string;
	fileCopied: (kind: string, name: string) => string;
	copyFailed: (name: string) => string;
	folderKind: string;
	fileKind: string;
	copyCurrentDocumentContent: string;
	noCurrentDocument: string;
	explorerActions: string;
	explorerActionsDesc: string;
	explorerObjectType: string;
	explorerFolder: string;
	explorerMarkdown: string;
	explorerText: string;
	explorerOtherFiles: string;
	toggleAllAction: (action: string) => string;
	toggleActionForObject: (action: string, objectType: string) => string;
	actionUnavailable: string;
	explorerMacOnlyNote: string;
	restoreExplorerActions: string;
	restoreExplorerActionsDesc: string;
	restoreDefaults: string;
	explorerActionsRestored: string;
	showCopyFileButton: string;
	showCopyFileButtonDesc: string;
	showCopyContentButton: string;
	showCopyContentButtonDesc: string;
	showNewFileButton: string;
	showNewFileButtonDesc: string;
	showCopyRelativePathButton: string;
	showCopyRelativePathButtonDesc: string;
	showCopyAbsolutePathButton: string;
	showCopyAbsolutePathButtonDesc: string;
	documentContentArea: string;
	documentContentAreaDesc: string;
	showCopyDocumentButton: string;
	showCopyDocumentButtonDesc: string;
	codeBlockInsertion: string;
	codeBlockInsertionDesc: string;
	enableCodeBlockCommand: string;
	enableCodeBlockCommandDesc: string;
	defaultCodeBlockLanguage: string;
	defaultCodeBlockLanguageDesc: string;
	customLanguage: (language: string) => string;
};

const en: Translation = {
	codeBlockPlain: "Plain code block (no language)",
	copyFolder: "Copy folder",
	copyFile: "Copy file",
	copyCurrentFile: "Copy current file",
	newFile: "Add new",
	fileCreated: (path) => `Created file: ${path}`,
	fileCreateFailed: "Failed to create file",
	copyRelativePath: "Copy relative path",
	copyAbsolutePath: "Copy absolute path",
	relativePathCopied: (path) => `Relative path copied: ${path}`,
	absolutePathCopied: (path) => `Absolute path copied: ${path}`,
	pathCopyFailed: "Failed to copy path",
	absolutePathMacOnly: "Copy absolute path is only available in the macOS desktop app",
	insertMarkdownCodeBlock: "Insert Markdown code block",
	copyContent: "Copy content",
	contentCopied: (name) => `Content copied: ${name}`,
	contentCopyFailed: (name) => `Failed to copy content: ${name}`,
	copyFileMacOnly: "Copy file is only available in the macOS desktop app",
	localPathUnavailable: "Unable to access the local file path",
	fileCopied: (kind, name) => `${kind} copied: ${name}`,
	copyFailed: (name) => `Failed to copy: ${name}`,
	folderKind: "Folder",
	fileKind: "File",
	copyCurrentDocumentContent: "Copy current document content",
	noCurrentDocument: "There is no current document to copy",
	explorerActions: "File explorer actions",
	explorerActionsDesc: "Choose visible buttons.",
	explorerObjectType: "Explore item",
	explorerFolder: "Folder",
	explorerMarkdown: "Markdown .md",
	explorerText: "Plain text .txt",
	explorerOtherFiles: "Images, PDFs, attachments",
	toggleAllAction: (action) => `Toggle ${action} for all supported item types`,
	toggleActionForObject: (action, objectType) => `Toggle ${action} for ${objectType}`,
	actionUnavailable: "This action is not available for this item type",
	explorerMacOnlyNote: "Copy file and absolute path require macOS.",
	restoreExplorerActions: "Restore file explorer actions",
	restoreExplorerActionsDesc: "Restore recommended buttons.",
	restoreDefaults: "Restore defaults",
	explorerActionsRestored: "File explorer actions restored",
	showCopyFileButton: "Show copy file button",
	showCopyFileButtonDesc: "Enable copying files and folders from file explorer rows and context menus. This feature is only available in the macOS desktop app.",
	showCopyContentButton: "Show copy content button",
	showCopyContentButtonDesc: "Show a button for copying document text on Markdown and plain-text file rows.",
	showNewFileButton: "Show new file button",
	showNewFileButtonDesc: "Show a button on folder rows to create a blank Markdown file in that folder.",
	showCopyRelativePathButton: "Show copy relative path button",
	showCopyRelativePathButtonDesc: "Show a button for copying the path relative to the vault root on files and folders.",
	showCopyAbsolutePathButton: "Show copy absolute path button",
	showCopyAbsolutePathButtonDesc: "Show a button for copying the local absolute path on files and folders. This feature is only available in the macOS desktop app.",
	documentContentArea: "Document content area",
	documentContentAreaDesc: "Actions in open documents.",
	showCopyDocumentButton: "Show copy document button",
	showCopyDocumentButtonDesc: "Copy the whole document.",
	codeBlockInsertion: "Code block insertion",
	codeBlockInsertionDesc: "Insert or wrap a code block.",
	enableCodeBlockCommand: "Enable code block insertion command",
	enableCodeBlockCommandDesc: "Assign a shortcut in Hotkeys.",
	defaultCodeBlockLanguage: "Default code block language",
	defaultCodeBlockLanguageDesc: "Language used when inserting.",
	customLanguage: (language) => `Custom: ${language}`,
};

const zh: Translation = {
	copyRelativePath: "复制相对地址", copyAbsolutePath: "复制绝对地址", relativePathCopied: (path) => `已复制相对地址：${path}`, absolutePathCopied: (path) => `已复制绝对地址：${path}`, pathCopyFailed: "复制地址失败", absolutePathMacOnly: "“复制绝对地址”仅支持 macOS 桌面版",
	codeBlockPlain: "普通代码框（不指定语言）", copyFolder: "复制文件夹", copyFile: "复制文件", copyCurrentFile: "复制当前文件", newFile: "新建", fileCreated: (path) => `已新建文件：${path}`, fileCreateFailed: "新建文件失败", insertMarkdownCodeBlock: "插入 Markdown 代码框", copyContent: "复制内容",
	contentCopied: (name) => `已复制内容：${name}`, contentCopyFailed: (name) => `复制内容失败：${name}`, copyFileMacOnly: "“复制文件”仅支持 macOS 桌面版", localPathUnavailable: "无法获取文件的本地路径", fileCopied: (kind, name) => `已复制${kind}：${name}`, copyFailed: (name) => `复制失败：${name}`, folderKind: "文件夹", fileKind: "文件", copyCurrentDocumentContent: "复制当前文档内容", noCurrentDocument: "没有可复制的当前文档",
	explorerActions: "文件列表操作", explorerActionsDesc: "选择显示的按钮。", explorerObjectType: "Explore 对象", explorerFolder: "文件夹", explorerMarkdown: "Markdown .md", explorerText: "纯文本 .txt", explorerOtherFiles: "图片、PDF、附件", toggleAllAction: (action) => `为所有支持的对象切换“${action}”`, toggleActionForObject: (action, objectType) => `为${objectType}切换“${action}”`, actionUnavailable: "此功能不适用于该对象类型", explorerMacOnlyNote: "复制文件和绝对地址仅限 macOS。", restoreExplorerActions: "恢复文件列表操作", restoreExplorerActionsDesc: "恢复推荐的按钮。", restoreDefaults: "恢复默认设置", explorerActionsRestored: "已恢复文件列表操作", showCopyFileButton: "显示复制文件按钮", showCopyFileButtonDesc: "在文件列表行和右键菜单中启用复制文件/文件夹。此功能只支持 macOS 桌面版。", showCopyContentButton: "显示复制内容按钮", showCopyContentButtonDesc: "在 Markdown 和纯文本文件行上显示复制文档文本内容的按钮。",
	showNewFileButton: "显示新建文件按钮", showNewFileButtonDesc: "在文件夹行显示新建空白 Markdown 文件的按钮。", showCopyRelativePathButton: "显示复制相对地址按钮", showCopyRelativePathButtonDesc: "在文件和文件夹行显示复制相对于库根目录地址的按钮。", showCopyAbsolutePathButton: "显示复制绝对地址按钮", showCopyAbsolutePathButtonDesc: "在文件和文件夹行显示复制本机绝对地址的按钮。此功能只支持 macOS 桌面版。",
	documentContentArea: "文档内容区", documentContentAreaDesc: "打开文档中的操作。", showCopyDocumentButton: "显示复制全文按钮", showCopyDocumentButtonDesc: "复制整篇文档。",
	codeBlockInsertion: "代码框快捷插入", codeBlockInsertionDesc: "插入或包裹代码框。", enableCodeBlockCommand: "启用代码框插入命令", enableCodeBlockCommandDesc: "可在快捷键中分配按键。", defaultCodeBlockLanguage: "默认代码框类型", defaultCodeBlockLanguageDesc: "插入时使用的语言标记。", customLanguage: (language) => `自定义：${language}`,
};

const zhTW: Translation = {
	copyRelativePath: "複製相對路徑", copyAbsolutePath: "複製絕對路徑", relativePathCopied: (path) => `已複製相對路徑：${path}`, absolutePathCopied: (path) => `已複製絕對路徑：${path}`, pathCopyFailed: "複製路徑失敗", absolutePathMacOnly: "「複製絕對路徑」僅支援 macOS 桌面版",
	codeBlockPlain: "一般程式碼區塊（不指定語言）", copyFolder: "複製資料夾", copyFile: "複製檔案", copyCurrentFile: "複製目前檔案", newFile: "新增", fileCreated: (path) => `已新增檔案：${path}`, fileCreateFailed: "新增檔案失敗", insertMarkdownCodeBlock: "插入 Markdown 程式碼區塊", copyContent: "複製內容",
	contentCopied: (name) => `已複製內容：${name}`, contentCopyFailed: (name) => `複製內容失敗：${name}`, copyFileMacOnly: "「複製檔案」僅支援 macOS 桌面版", localPathUnavailable: "無法取得檔案的本機路徑", fileCopied: (kind, name) => `已複製${kind}：${name}`, copyFailed: (name) => `複製失敗：${name}`, folderKind: "資料夾", fileKind: "檔案", copyCurrentDocumentContent: "複製目前文件內容", noCurrentDocument: "沒有可複製的目前文件",
	explorerActions: "檔案總管操作", explorerActionsDesc: "選擇要顯示的按鈕。", explorerObjectType: "檔案總管項目", explorerFolder: "資料夾", explorerMarkdown: "Markdown .md", explorerText: "純文字 .txt", explorerOtherFiles: "圖片、PDF、附件", toggleAllAction: (action) => `為所有支援的項目切換「${action}」`, toggleActionForObject: (action, objectType) => `為${objectType}切換「${action}」`, actionUnavailable: "此功能不適用於此項目類型", explorerMacOnlyNote: "複製檔案和絕對路徑僅限 macOS。", restoreExplorerActions: "還原檔案總管操作", restoreExplorerActionsDesc: "還原建議的按鈕。", restoreDefaults: "還原預設值", explorerActionsRestored: "已還原檔案總管操作", showCopyFileButton: "顯示複製檔案按鈕", showCopyFileButtonDesc: "在檔案列表行顯示複製按鈕。", showCopyContentButton: "顯示複製內容按鈕", showCopyContentButtonDesc: "在 Markdown 和純文字檔案列顯示內容複製按鈕。",
	showNewFileButton: "顯示新增檔案按鈕", showNewFileButtonDesc: "在資料夾列顯示新增空白 Markdown 檔案的按鈕。", showCopyRelativePathButton: "顯示複製相對路徑按鈕", showCopyRelativePathButtonDesc: "在檔案和資料夾列顯示複製相對於庫根目錄路徑的按鈕。", showCopyAbsolutePathButton: "顯示複製絕對路徑按鈕", showCopyAbsolutePathButtonDesc: "在檔案和資料夾列顯示複製本機絕對路徑的按鈕。此功能僅支援 macOS 桌面版。",
	documentContentArea: "文件內容區域", documentContentAreaDesc: "開啟文件中的操作。", showCopyDocumentButton: "顯示複製全文按鈕", showCopyDocumentButtonDesc: "複製整篇文件。",
	codeBlockInsertion: "插入程式碼區塊", codeBlockInsertionDesc: "插入或包住程式碼區塊。", enableCodeBlockCommand: "啟用插入程式碼區塊命令", enableCodeBlockCommandDesc: "可在快捷鍵中指定按鍵。", defaultCodeBlockLanguage: "預設程式碼區塊語言", defaultCodeBlockLanguageDesc: "插入時使用的語言識別碼。", customLanguage: (language) => `自訂：${language}`,
};

const ja: Translation = {
	copyRelativePath: "相対パスをコピー", copyAbsolutePath: "絶対パスをコピー", relativePathCopied: (path) => `相対パスをコピーしました：${path}`, absolutePathCopied: (path) => `絶対パスをコピーしました：${path}`, pathCopyFailed: "パスをコピーできませんでした", absolutePathMacOnly: "絶対パスのコピーは macOS デスクトップ版でのみ利用できます",
	codeBlockPlain: "プレーンコードブロック（言語指定なし）", copyFolder: "フォルダーをコピー", copyFile: "ファイルをコピー", copyCurrentFile: "現在のファイルをコピー", newFile: "新規作成", fileCreated: (path) => `ファイルを作成しました：${path}`, fileCreateFailed: "ファイルを作成できませんでした", insertMarkdownCodeBlock: "Markdown コードブロックを挿入", copyContent: "内容をコピー",
	contentCopied: (name) => `内容をコピーしました：${name}`, contentCopyFailed: (name) => `内容をコピーできませんでした：${name}`, copyFileMacOnly: "「ファイルをコピー」は macOS デスクトップ版でのみ利用できます", localPathUnavailable: "ローカルファイルのパスを取得できません", fileCopied: (kind, name) => `${kind}をコピーしました：${name}`, copyFailed: (name) => `コピーできませんでした：${name}`, folderKind: "フォルダー", fileKind: "ファイル", copyCurrentDocumentContent: "現在の文書の内容をコピー", noCurrentDocument: "コピーできる文書がありません",
	explorerActions: "ファイルエクスプローラーの操作", explorerActionsDesc: "表示するボタンを選択します。", explorerObjectType: "エクスプローラー項目", explorerFolder: "フォルダー", explorerMarkdown: "Markdown .md", explorerText: "プレーンテキスト .txt", explorerOtherFiles: "画像、PDF、添付ファイル", toggleAllAction: (action) => `対応するすべての項目で「${action}」を切り替え`, toggleActionForObject: (action, objectType) => `${objectType}で「${action}」を切り替え`, actionUnavailable: "この操作はこの項目の種類では利用できません", explorerMacOnlyNote: "ファイルと絶対パスのコピーは macOS のみです。", restoreExplorerActions: "エクスプローラー操作を復元", restoreExplorerActionsDesc: "推奨ボタンを復元します。", restoreDefaults: "既定値に戻す", explorerActionsRestored: "エクスプローラー操作を復元しました", showCopyFileButton: "ファイルコピーボタンを表示", showCopyFileButtonDesc: "ファイル行にコピーボタンを表示します。", showCopyContentButton: "内容コピーボタンを表示", showCopyContentButtonDesc: "対応ファイルに内容コピーボタンを表示します。",
	showNewFileButton: "新規ファイルボタンを表示", showNewFileButtonDesc: "フォルダー行に空の Markdown ファイルを作成するボタンを表示します。", showCopyRelativePathButton: "相対パスコピーボタンを表示", showCopyRelativePathButtonDesc: "ファイルとフォルダー行に保管庫のルートからの相対パスをコピーするボタンを表示します。", showCopyAbsolutePathButton: "絶対パスコピーボタンを表示", showCopyAbsolutePathButtonDesc: "ファイルとフォルダー行にローカル絶対パスをコピーするボタンを表示します。この機能は macOS デスクトップ版でのみ利用できます。",
	documentContentArea: "文書の内容領域", documentContentAreaDesc: "開いている文書の操作。", showCopyDocumentButton: "全文コピーボタンを表示", showCopyDocumentButtonDesc: "文書全体をコピーします。",
	codeBlockInsertion: "コードブロックの挿入", codeBlockInsertionDesc: "コードブロックを挿入または囲みます。", enableCodeBlockCommand: "コードブロック挿入コマンドを有効化", enableCodeBlockCommandDesc: "ホットキーで割り当てます。", defaultCodeBlockLanguage: "既定のコードブロック言語", defaultCodeBlockLanguageDesc: "挿入時の言語です。", customLanguage: (language) => `カスタム：${language}`,
};

const ko: Translation = {
	copyRelativePath: "상대 경로 복사", copyAbsolutePath: "절대 경로 복사", relativePathCopied: (path) => `상대 경로를 복사했습니다: ${path}`, absolutePathCopied: (path) => `절대 경로를 복사했습니다: ${path}`, pathCopyFailed: "경로를 복사하지 못했습니다", absolutePathMacOnly: "절대 경로 복사는 macOS 데스크톱 앱에서만 사용할 수 있습니다",
	codeBlockPlain: "일반 코드 블록(언어 지정 없음)", copyFolder: "폴더 복사", copyFile: "파일 복사", copyCurrentFile: "현재 파일 복사", newFile: "새로 만들기", fileCreated: (path) => `파일을 만들었습니다: ${path}`, fileCreateFailed: "파일을 만들지 못했습니다", insertMarkdownCodeBlock: "Markdown 코드 블록 삽입", copyContent: "내용 복사",
	contentCopied: (name) => `내용을 복사했습니다: ${name}`, contentCopyFailed: (name) => `내용을 복사하지 못했습니다: ${name}`, copyFileMacOnly: "‘파일 복사’는 macOS 데스크톱 앱에서만 사용할 수 있습니다", localPathUnavailable: "로컬 파일 경로에 접근할 수 없습니다", fileCopied: (_kind, name) => `복사했습니다: ${name}`, copyFailed: (name) => `복사하지 못했습니다: ${name}`, folderKind: "폴더", fileKind: "파일", copyCurrentDocumentContent: "현재 문서 내용 복사", noCurrentDocument: "복사할 현재 문서가 없습니다",
	explorerActions: "파일 탐색기 동작", explorerActionsDesc: "표시할 버튼을 선택합니다.", explorerObjectType: "탐색기 항목", explorerFolder: "폴더", explorerMarkdown: "Markdown .md", explorerText: "일반 텍스트 .txt", explorerOtherFiles: "이미지, PDF, 첨부 파일", toggleAllAction: (action) => `지원되는 모든 항목에서 '${action}' 전환`, toggleActionForObject: (action, objectType) => `${objectType}에서 '${action}' 전환`, actionUnavailable: "이 항목 유형에서는 이 동작을 사용할 수 없습니다", explorerMacOnlyNote: "파일과 절대 경로 복사는 macOS 전용입니다.", restoreExplorerActions: "파일 탐색기 동작 복원", restoreExplorerActionsDesc: "추천 버튼을 복원합니다.", restoreDefaults: "기본값 복원", explorerActionsRestored: "파일 탐색기 동작을 복원했습니다", showCopyFileButton: "파일 복사 버튼 표시", showCopyFileButtonDesc: "파일 행에 복사 버튼을 표시합니다.", showCopyContentButton: "내용 복사 버튼 표시", showCopyContentButtonDesc: "지원 파일에 내용 복사 버튼을 표시합니다.",
	showNewFileButton: "새 파일 버튼 표시", showNewFileButtonDesc: "폴더 행에 빈 Markdown 파일을 만드는 버튼을 표시합니다.", showCopyRelativePathButton: "상대 경로 복사 버튼 표시", showCopyRelativePathButtonDesc: "파일과 폴더 행에 보관함 루트 기준 경로를 복사하는 버튼을 표시합니다.", showCopyAbsolutePathButton: "절대 경로 복사 버튼 표시", showCopyAbsolutePathButtonDesc: "파일과 폴더 행에 로컬 절대 경로를 복사하는 버튼을 표시합니다. 이 기능은 macOS 데스크톱 앱에서만 사용할 수 있습니다.",
	documentContentArea: "문서 내용 영역", documentContentAreaDesc: "열린 문서의 동작입니다.", showCopyDocumentButton: "문서 복사 버튼 표시", showCopyDocumentButtonDesc: "문서 전체를 복사합니다.",
	codeBlockInsertion: "코드 블록 삽입", codeBlockInsertionDesc: "코드 블록을 삽입하거나 감쌉니다.", enableCodeBlockCommand: "코드 블록 삽입 명령 활성화", enableCodeBlockCommandDesc: "단축키에서 지정합니다.", defaultCodeBlockLanguage: "기본 코드 블록 언어", defaultCodeBlockLanguageDesc: "삽입할 때 사용할 언어입니다.", customLanguage: (language) => `사용자 지정: ${language}`,
};

const de: Translation = {
	copyRelativePath: "Relativen Pfad kopieren", copyAbsolutePath: "Absoluten Pfad kopieren", relativePathCopied: (path) => `Relativer Pfad kopiert: ${path}`, absolutePathCopied: (path) => `Absoluter Pfad kopiert: ${path}`, pathCopyFailed: "Pfad konnte nicht kopiert werden", absolutePathMacOnly: "Das Kopieren absoluter Pfade ist nur in der macOS-Desktop-App verfügbar",
	codeBlockPlain: "Einfacher Codeblock (keine Sprache)", copyFolder: "Ordner kopieren", copyFile: "Datei kopieren", copyCurrentFile: "Aktuelle Datei kopieren", newFile: "Neu erstellen", fileCreated: (path) => `Datei erstellt: ${path}`, fileCreateFailed: "Datei konnte nicht erstellt werden", insertMarkdownCodeBlock: "Markdown-Codeblock einfügen", copyContent: "Inhalt kopieren",
	contentCopied: (name) => `Inhalt kopiert: ${name}`, contentCopyFailed: (name) => `Inhalt konnte nicht kopiert werden: ${name}`, copyFileMacOnly: "„Datei kopieren“ ist nur in der macOS-Desktop-App verfügbar", localPathUnavailable: "Auf den lokalen Dateipfad kann nicht zugegriffen werden", fileCopied: (kind, name) => `${kind} kopiert: ${name}`, copyFailed: (name) => `Kopieren fehlgeschlagen: ${name}`, folderKind: "Ordner", fileKind: "Datei", copyCurrentDocumentContent: "Inhalt des aktuellen Dokuments kopieren", noCurrentDocument: "Kein aktuelles Dokument zum Kopieren vorhanden",
	explorerActions: "Dateiexplorer-Aktionen", explorerActionsDesc: "Sichtbare Schaltflächen wählen.", explorerObjectType: "Explorer-Element", explorerFolder: "Ordner", explorerMarkdown: "Markdown .md", explorerText: "Textdatei .txt", explorerOtherFiles: "Bilder, PDFs, Anhänge", toggleAllAction: (action) => `${action} für alle unterstützten Elementtypen umschalten`, toggleActionForObject: (action, objectType) => `${action} für ${objectType} umschalten`, actionUnavailable: "Diese Aktion ist für diesen Elementtyp nicht verfügbar", explorerMacOnlyNote: "Datei und absoluter Pfad nur unter macOS.", restoreExplorerActions: "Dateiexplorer-Aktionen wiederherstellen", restoreExplorerActionsDesc: "Empfohlene Schaltflächen wiederherstellen.", restoreDefaults: "Standardwerte wiederherstellen", explorerActionsRestored: "Dateiexplorer-Aktionen wiederhergestellt", showCopyFileButton: "Schaltfläche zum Kopieren von Dateien anzeigen", showCopyFileButtonDesc: "Kopierschaltfläche in Datei-Zeilen anzeigen.", showCopyContentButton: "Schaltfläche zum Kopieren von Inhalten anzeigen", showCopyContentButtonDesc: "Inhaltskopie für unterstützte Dateien anzeigen.",
	showNewFileButton: "Schaltfläche für neue Datei anzeigen", showNewFileButtonDesc: "Eine Schaltfläche zum Erstellen einer leeren Markdown-Datei in Ordnerzeilen anzeigen.", showCopyRelativePathButton: "Schaltfläche zum Kopieren relativer Pfade anzeigen", showCopyRelativePathButtonDesc: "Eine Schaltfläche zum Kopieren des Pfads relativ zum Vault-Stamm in Datei- und Ordnerzeilen anzeigen.", showCopyAbsolutePathButton: "Schaltfläche zum Kopieren absoluter Pfade anzeigen", showCopyAbsolutePathButtonDesc: "Eine Schaltfläche zum Kopieren des lokalen absoluten Pfads in Datei- und Ordnerzeilen anzeigen. Diese Funktion ist nur in der macOS-Desktop-App verfügbar.",
	documentContentArea: "Dokumentinhalt", documentContentAreaDesc: "Aktionen im geöffneten Dokument.", showCopyDocumentButton: "Schaltfläche zum Kopieren des Dokuments anzeigen", showCopyDocumentButtonDesc: "Gesamtes Dokument kopieren.",
	codeBlockInsertion: "Codeblock einfügen", codeBlockInsertionDesc: "Codeblock einfügen oder umschließen.", enableCodeBlockCommand: "Befehl zum Einfügen von Codeblöcken aktivieren", enableCodeBlockCommandDesc: "Tastenkürzel zuweisen.", defaultCodeBlockLanguage: "Standardsprache für Codeblöcke", defaultCodeBlockLanguageDesc: "Sprache beim Einfügen.", customLanguage: (language) => `Benutzerdefiniert: ${language}`,
};

const fr: Translation = {
	copyRelativePath: "Copier le chemin relatif", copyAbsolutePath: "Copier le chemin absolu", relativePathCopied: (path) => `Chemin relatif copié : ${path}`, absolutePathCopied: (path) => `Chemin absolu copié : ${path}`, pathCopyFailed: "Impossible de copier le chemin", absolutePathMacOnly: "La copie de chemin absolu est uniquement disponible dans l’application de bureau macOS",
	codeBlockPlain: "Bloc de code simple (sans langage)", copyFolder: "Copier le dossier", copyFile: "Copier le fichier", copyCurrentFile: "Copier le fichier actuel", newFile: "Ajouter", fileCreated: (path) => `Fichier créé : ${path}`, fileCreateFailed: "Impossible de créer le fichier", insertMarkdownCodeBlock: "Insérer un bloc de code Markdown", copyContent: "Copier le contenu",
	contentCopied: (name) => `Contenu copié : ${name}`, contentCopyFailed: (name) => `Impossible de copier le contenu : ${name}`, copyFileMacOnly: "La copie de fichier est uniquement disponible dans l’application de bureau macOS", localPathUnavailable: "Impossible d’accéder au chemin local du fichier", fileCopied: (kind, name) => `${kind} copié : ${name}`, copyFailed: (name) => `Échec de la copie : ${name}`, folderKind: "Dossier", fileKind: "Fichier", copyCurrentDocumentContent: "Copier le contenu du document actuel", noCurrentDocument: "Aucun document actuel à copier",
	explorerActions: "Actions de l’explorateur de fichiers", explorerActionsDesc: "Choisissez les boutons visibles.", explorerObjectType: "Élément Explorer", explorerFolder: "Dossier", explorerMarkdown: "Markdown .md", explorerText: "Texte brut .txt", explorerOtherFiles: "Images, PDF, pièces jointes", toggleAllAction: (action) => `Activer ou désactiver ${action} pour tous les types compatibles`, toggleActionForObject: (action, objectType) => `Activer ou désactiver ${action} pour ${objectType}`, actionUnavailable: "Cette action n’est pas disponible pour ce type d’élément", explorerMacOnlyNote: "Copie de fichier et chemin absolu, macOS uniquement.", restoreExplorerActions: "Restaurer les actions de l’explorateur", restoreExplorerActionsDesc: "Restaurer les boutons recommandés.", restoreDefaults: "Restaurer les valeurs par défaut", explorerActionsRestored: "Actions de l’explorateur restaurées", showCopyFileButton: "Afficher le bouton de copie de fichier", showCopyFileButtonDesc: "Afficher la copie dans les lignes de fichier.", showCopyContentButton: "Afficher le bouton de copie du contenu", showCopyContentButtonDesc: "Afficher la copie du contenu pour les fichiers pris en charge.",
	showNewFileButton: "Afficher le bouton Nouveau fichier", showNewFileButtonDesc: "Afficher un bouton pour créer un fichier Markdown vide dans les lignes de dossier.", showCopyRelativePathButton: "Afficher le bouton de copie du chemin relatif", showCopyRelativePathButtonDesc: "Afficher un bouton pour copier le chemin relatif à la racine du coffre dans les lignes de fichiers et dossiers.", showCopyAbsolutePathButton: "Afficher le bouton de copie du chemin absolu", showCopyAbsolutePathButtonDesc: "Afficher un bouton pour copier le chemin absolu local dans les lignes de fichiers et dossiers. Cette fonction est uniquement disponible dans l’application de bureau macOS.",
	documentContentArea: "Zone de contenu du document", documentContentAreaDesc: "Actions du document ouvert.", showCopyDocumentButton: "Afficher le bouton de copie du document", showCopyDocumentButtonDesc: "Copier tout le document.",
	codeBlockInsertion: "Insertion de bloc de code", codeBlockInsertionDesc: "Insérer ou entourer un bloc de code.", enableCodeBlockCommand: "Activer la commande d’insertion de bloc de code", enableCodeBlockCommandDesc: "Attribuer un raccourci.", defaultCodeBlockLanguage: "Langage de bloc de code par défaut", defaultCodeBlockLanguageDesc: "Langage lors de l’insertion.", customLanguage: (language) => `Personnalisé : ${language}`,
};

const es: Translation = {
	copyRelativePath: "Copiar ruta relativa", copyAbsolutePath: "Copiar ruta absoluta", relativePathCopied: (path) => `Ruta relativa copiada: ${path}`, absolutePathCopied: (path) => `Ruta absoluta copiada: ${path}`, pathCopyFailed: "No se pudo copiar la ruta", absolutePathMacOnly: "Copiar la ruta absoluta solo está disponible en la aplicación de escritorio para macOS",
	codeBlockPlain: "Bloque de código simple (sin lenguaje)", copyFolder: "Copiar carpeta", copyFile: "Copiar archivo", copyCurrentFile: "Copiar archivo actual", newFile: "Añadir", fileCreated: (path) => `Archivo creado: ${path}`, fileCreateFailed: "No se pudo crear el archivo", insertMarkdownCodeBlock: "Insertar bloque de código Markdown", copyContent: "Copiar contenido",
	contentCopied: (name) => `Contenido copiado: ${name}`, contentCopyFailed: (name) => `No se pudo copiar el contenido: ${name}`, copyFileMacOnly: "Copiar archivos solo está disponible en la aplicación de escritorio para macOS", localPathUnavailable: "No se puede acceder a la ruta local del archivo", fileCopied: (_kind, name) => `Se copió: ${name}`, copyFailed: (name) => `Error al copiar: ${name}`, folderKind: "Carpeta", fileKind: "Archivo", copyCurrentDocumentContent: "Copiar el contenido del documento actual", noCurrentDocument: "No hay ningún documento actual para copiar",
	explorerActions: "Acciones del explorador de archivos", explorerActionsDesc: "Elige los botones visibles.", explorerObjectType: "Elemento de Explore", explorerFolder: "Carpeta", explorerMarkdown: "Markdown .md", explorerText: "Texto sin formato .txt", explorerOtherFiles: "Imágenes, PDF, adjuntos", toggleAllAction: (action) => `Alternar ${action} para todos los tipos compatibles`, toggleActionForObject: (action, objectType) => `Alternar ${action} para ${objectType}`, actionUnavailable: "Esta acción no está disponible para este tipo de elemento", explorerMacOnlyNote: "Copiar archivo y ruta absoluta solo en macOS.", restoreExplorerActions: "Restaurar acciones del explorador", restoreExplorerActionsDesc: "Restaurar botones recomendados.", restoreDefaults: "Restaurar valores predeterminados", explorerActionsRestored: "Acciones del explorador restauradas", showCopyFileButton: "Mostrar botón para copiar archivos", showCopyFileButtonDesc: "Muestra el botón en las filas de archivos.", showCopyContentButton: "Mostrar botón para copiar contenido", showCopyContentButtonDesc: "Muestra la copia de contenido para archivos compatibles.",
	showNewFileButton: "Mostrar botón de archivo nuevo", showNewFileButtonDesc: "Muestra un botón para crear un archivo Markdown vacío en las filas de carpetas.", showCopyRelativePathButton: "Mostrar botón para copiar ruta relativa", showCopyRelativePathButtonDesc: "Muestra un botón para copiar la ruta relativa a la raíz de la bóveda en las filas de archivos y carpetas.", showCopyAbsolutePathButton: "Mostrar botón para copiar ruta absoluta", showCopyAbsolutePathButtonDesc: "Muestra un botón para copiar la ruta absoluta local en las filas de archivos y carpetas. Esta función solo está disponible en la aplicación de escritorio para macOS.",
	documentContentArea: "Área de contenido del documento", documentContentAreaDesc: "Acciones del documento abierto.", showCopyDocumentButton: "Mostrar botón para copiar el documento", showCopyDocumentButtonDesc: "Copia todo el documento.",
	codeBlockInsertion: "Inserción de bloques de código", codeBlockInsertionDesc: "Inserta o envuelve un bloque de código.", enableCodeBlockCommand: "Activar comando para insertar bloques de código", enableCodeBlockCommandDesc: "Asigna un atajo.", defaultCodeBlockLanguage: "Lenguaje predeterminado del bloque de código", defaultCodeBlockLanguageDesc: "Lenguaje al insertar.", customLanguage: (language) => `Personalizado: ${language}`,
};

const ptBR: Translation = {
	copyRelativePath: "Copiar caminho relativo", copyAbsolutePath: "Copiar caminho absoluto", relativePathCopied: (path) => `Caminho relativo copiado: ${path}`, absolutePathCopied: (path) => `Caminho absoluto copiado: ${path}`, pathCopyFailed: "Não foi possível copiar o caminho", absolutePathMacOnly: "Copiar o caminho absoluto só está disponível no aplicativo para macOS",
	codeBlockPlain: "Bloco de código simples (sem linguagem)", copyFolder: "Copiar pasta", copyFile: "Copiar arquivo", copyCurrentFile: "Copiar arquivo atual", newFile: "Adicionar", fileCreated: (path) => `Arquivo criado: ${path}`, fileCreateFailed: "Não foi possível criar o arquivo", insertMarkdownCodeBlock: "Inserir bloco de código Markdown", copyContent: "Copiar conteúdo",
	contentCopied: (name) => `Conteúdo copiado: ${name}`, contentCopyFailed: (name) => `Não foi possível copiar o conteúdo: ${name}`, copyFileMacOnly: "Copiar arquivos só está disponível no aplicativo para macOS", localPathUnavailable: "Não foi possível acessar o caminho local do arquivo", fileCopied: (_kind, name) => `Cópia concluída: ${name}`, copyFailed: (name) => `Falha ao copiar: ${name}`, folderKind: "Pasta", fileKind: "Arquivo", copyCurrentDocumentContent: "Copiar conteúdo do documento atual", noCurrentDocument: "Não há um documento atual para copiar",
	explorerActions: "Ações do explorador de arquivos", explorerActionsDesc: "Escolha os botões visíveis.", explorerObjectType: "Item do Explore", explorerFolder: "Pasta", explorerMarkdown: "Markdown .md", explorerText: "Texto simples .txt", explorerOtherFiles: "Imagens, PDFs, anexos", toggleAllAction: (action) => `Alternar ${action} para todos os tipos compatíveis`, toggleActionForObject: (action, objectType) => `Alternar ${action} para ${objectType}`, actionUnavailable: "Esta ação não está disponível para este tipo de item", explorerMacOnlyNote: "Copiar arquivo e caminho absoluto, apenas no macOS.", restoreExplorerActions: "Restaurar ações do explorador", restoreExplorerActionsDesc: "Restaurar botões recomendados.", restoreDefaults: "Restaurar padrões", explorerActionsRestored: "Ações do explorador restauradas", showCopyFileButton: "Mostrar botão de copiar arquivo", showCopyFileButtonDesc: "Mostre o botão nas linhas de arquivo.", showCopyContentButton: "Mostrar botão de copiar conteúdo", showCopyContentButtonDesc: "Mostre a cópia de conteúdo para arquivos compatíveis.",
	showNewFileButton: "Mostrar botão de novo arquivo", showNewFileButtonDesc: "Mostre um botão para criar um arquivo Markdown em branco nas linhas de pastas.", showCopyRelativePathButton: "Mostrar botão de copiar caminho relativo", showCopyRelativePathButtonDesc: "Mostre um botão para copiar o caminho relativo à raiz do cofre nas linhas de arquivos e pastas.", showCopyAbsolutePathButton: "Mostrar botão de copiar caminho absoluto", showCopyAbsolutePathButtonDesc: "Mostre um botão para copiar o caminho absoluto local nas linhas de arquivos e pastas. Este recurso só está disponível no aplicativo para macOS.",
	documentContentArea: "Área de conteúdo do documento", documentContentAreaDesc: "Ações do documento aberto.", showCopyDocumentButton: "Mostrar botão de copiar documento", showCopyDocumentButtonDesc: "Copie o documento inteiro.",
	codeBlockInsertion: "Inserção de bloco de código", codeBlockInsertionDesc: "Insira ou envolva um bloco de código.", enableCodeBlockCommand: "Ativar comando de inserção de bloco de código", enableCodeBlockCommandDesc: "Atribua um atalho.", defaultCodeBlockLanguage: "Linguagem padrão do bloco de código", defaultCodeBlockLanguageDesc: "Linguagem ao inserir.", customLanguage: (language) => `Personalizado: ${language}`,
};

const translations: Record<string, Translation> = {
	en, zh, "zh-tw": zhTW, ja, ko, de, fr, es, "pt-br": ptBR,
};

export function getTranslation(language = getLanguage()): Translation {
	const locale = language.toLowerCase().replace("_", "-");
	if (translations[locale]) return translations[locale];
	if (locale.startsWith("zh-tw") || locale.startsWith("zh-hant")) return zhTW;
	if (locale.startsWith("pt-br")) return ptBR;
	return translations[locale.split("-")[0]] ?? en;
}

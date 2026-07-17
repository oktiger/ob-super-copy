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
	newFile: "New file",
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
	explorerActionsDesc: "Control copy buttons and context menu items in the file explorer.",
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
	documentContentAreaDesc: "Control the copy button in open documents.",
	showCopyDocumentButton: "Show copy document button",
	showCopyDocumentButtonDesc: "Show a button in the upper-right corner of the document content area to copy the entire document.",
	codeBlockInsertion: "Code block insertion",
	codeBlockInsertionDesc: "Insert a Markdown code block at the cursor or wrap selected text. Configure a shortcut in Obsidian's Hotkeys settings.",
	enableCodeBlockCommand: "Enable code block insertion command",
	enableCodeBlockCommandDesc: "When enabled, find “Insert Markdown code block” in Hotkeys and assign your preferred shortcut.",
	defaultCodeBlockLanguage: "Default code block language",
	defaultCodeBlockLanguageDesc: "Select the language identifier used for inserted code blocks.",
	customLanguage: (language) => `Custom: ${language}`,
};

const zh: Translation = {
	copyRelativePath: "复制相对地址", copyAbsolutePath: "复制绝对地址", relativePathCopied: (path) => `已复制相对地址：${path}`, absolutePathCopied: (path) => `已复制绝对地址：${path}`, pathCopyFailed: "复制地址失败", absolutePathMacOnly: "“复制绝对地址”仅支持 macOS 桌面版",
	codeBlockPlain: "普通代码框（不指定语言）", copyFolder: "复制文件夹", copyFile: "复制文件", copyCurrentFile: "复制当前文件", newFile: "新建文件", fileCreated: (path) => `已新建文件：${path}`, fileCreateFailed: "新建文件失败", insertMarkdownCodeBlock: "插入 Markdown 代码框", copyContent: "复制内容",
	contentCopied: (name) => `已复制内容：${name}`, contentCopyFailed: (name) => `复制内容失败：${name}`, copyFileMacOnly: "“复制文件”仅支持 macOS 桌面版", localPathUnavailable: "无法获取文件的本地路径", fileCopied: (kind, name) => `已复制${kind}：${name}`, copyFailed: (name) => `复制失败：${name}`, folderKind: "文件夹", fileKind: "文件", copyCurrentDocumentContent: "复制当前文档内容", noCurrentDocument: "没有可复制的当前文档",
	explorerActions: "文件列表操作", explorerActionsDesc: "控制文件列表里的复制按钮和右键菜单项。", showCopyFileButton: "显示复制文件按钮", showCopyFileButtonDesc: "在文件列表行和右键菜单中启用复制文件/文件夹。此功能只支持 macOS 桌面版。", showCopyContentButton: "显示复制内容按钮", showCopyContentButtonDesc: "在 Markdown 和纯文本文件行上显示复制文档文本内容的按钮。",
	showNewFileButton: "显示新建文件按钮", showNewFileButtonDesc: "在文件夹行显示新建空白 Markdown 文件的按钮。", showCopyRelativePathButton: "显示复制相对地址按钮", showCopyRelativePathButtonDesc: "在文件和文件夹行显示复制相对于库根目录地址的按钮。", showCopyAbsolutePathButton: "显示复制绝对地址按钮", showCopyAbsolutePathButtonDesc: "在文件和文件夹行显示复制本机绝对地址的按钮。此功能只支持 macOS 桌面版。",
	documentContentArea: "文档内容区", documentContentAreaDesc: "控制打开文档正文区域里的复制按钮。", showCopyDocumentButton: "显示复制全文按钮", showCopyDocumentButtonDesc: "在打开文档的内容区域右上角显示复制全文按钮，不放在标题区域。",
	codeBlockInsertion: "代码框快捷插入", codeBlockInsertionDesc: "在编辑器光标处插入 Markdown 代码框，或把选中的文字包进代码框。快捷键请在 Obsidian 的快捷键页面里设置。", enableCodeBlockCommand: "启用代码框插入命令", enableCodeBlockCommandDesc: "开启后，在快捷键页面搜索“插入 Markdown 代码框”，绑定你想用的快捷键。", defaultCodeBlockLanguage: "默认代码框类型", defaultCodeBlockLanguageDesc: "选择插入代码框时使用的语言标记。", customLanguage: (language) => `自定义：${language}`,
};

const zhTW: Translation = {
	copyRelativePath: "複製相對路徑", copyAbsolutePath: "複製絕對路徑", relativePathCopied: (path) => `已複製相對路徑：${path}`, absolutePathCopied: (path) => `已複製絕對路徑：${path}`, pathCopyFailed: "複製路徑失敗", absolutePathMacOnly: "「複製絕對路徑」僅支援 macOS 桌面版",
	codeBlockPlain: "一般程式碼區塊（不指定語言）", copyFolder: "複製資料夾", copyFile: "複製檔案", copyCurrentFile: "複製目前檔案", newFile: "新增檔案", fileCreated: (path) => `已新增檔案：${path}`, fileCreateFailed: "新增檔案失敗", insertMarkdownCodeBlock: "插入 Markdown 程式碼區塊", copyContent: "複製內容",
	contentCopied: (name) => `已複製內容：${name}`, contentCopyFailed: (name) => `複製內容失敗：${name}`, copyFileMacOnly: "「複製檔案」僅支援 macOS 桌面版", localPathUnavailable: "無法取得檔案的本機路徑", fileCopied: (kind, name) => `已複製${kind}：${name}`, copyFailed: (name) => `複製失敗：${name}`, folderKind: "資料夾", fileKind: "檔案", copyCurrentDocumentContent: "複製目前文件內容", noCurrentDocument: "沒有可複製的目前文件",
	explorerActions: "檔案總管操作", explorerActionsDesc: "控制檔案列表中的複製按鈕和右鍵選單項目。", showCopyFileButton: "顯示複製檔案按鈕", showCopyFileButtonDesc: "在檔案列表和右鍵選單中啟用複製檔案／資料夾。此功能僅支援 macOS 桌面版。", showCopyContentButton: "顯示複製內容按鈕", showCopyContentButtonDesc: "在 Markdown 和純文字檔案列上顯示複製文件文字內容的按鈕。",
	showNewFileButton: "顯示新增檔案按鈕", showNewFileButtonDesc: "在資料夾列顯示新增空白 Markdown 檔案的按鈕。", showCopyRelativePathButton: "顯示複製相對路徑按鈕", showCopyRelativePathButtonDesc: "在檔案和資料夾列顯示複製相對於庫根目錄路徑的按鈕。", showCopyAbsolutePathButton: "顯示複製絕對路徑按鈕", showCopyAbsolutePathButtonDesc: "在檔案和資料夾列顯示複製本機絕對路徑的按鈕。此功能僅支援 macOS 桌面版。",
	documentContentArea: "文件內容區域", documentContentAreaDesc: "控制開啟文件內容區域中的複製按鈕。", showCopyDocumentButton: "顯示複製全文按鈕", showCopyDocumentButtonDesc: "在文件內容區域右上角顯示複製全文按鈕。",
	codeBlockInsertion: "插入程式碼區塊", codeBlockInsertionDesc: "在游標處插入 Markdown 程式碼區塊，或將選取文字包入區塊。請在 Obsidian 的快捷鍵設定中指定快捷鍵。", enableCodeBlockCommand: "啟用插入程式碼區塊命令", enableCodeBlockCommandDesc: "啟用後，在快捷鍵中搜尋「插入 Markdown 程式碼區塊」並指定快捷鍵。", defaultCodeBlockLanguage: "預設程式碼區塊語言", defaultCodeBlockLanguageDesc: "選擇插入程式碼區塊時使用的語言識別碼。", customLanguage: (language) => `自訂：${language}`,
};

const ja: Translation = {
	copyRelativePath: "相対パスをコピー", copyAbsolutePath: "絶対パスをコピー", relativePathCopied: (path) => `相対パスをコピーしました：${path}`, absolutePathCopied: (path) => `絶対パスをコピーしました：${path}`, pathCopyFailed: "パスをコピーできませんでした", absolutePathMacOnly: "絶対パスのコピーは macOS デスクトップ版でのみ利用できます",
	codeBlockPlain: "プレーンコードブロック（言語指定なし）", copyFolder: "フォルダーをコピー", copyFile: "ファイルをコピー", copyCurrentFile: "現在のファイルをコピー", newFile: "新しいファイル", fileCreated: (path) => `ファイルを作成しました：${path}`, fileCreateFailed: "ファイルを作成できませんでした", insertMarkdownCodeBlock: "Markdown コードブロックを挿入", copyContent: "内容をコピー",
	contentCopied: (name) => `内容をコピーしました：${name}`, contentCopyFailed: (name) => `内容をコピーできませんでした：${name}`, copyFileMacOnly: "「ファイルをコピー」は macOS デスクトップ版でのみ利用できます", localPathUnavailable: "ローカルファイルのパスを取得できません", fileCopied: (kind, name) => `${kind}をコピーしました：${name}`, copyFailed: (name) => `コピーできませんでした：${name}`, folderKind: "フォルダー", fileKind: "ファイル", copyCurrentDocumentContent: "現在の文書の内容をコピー", noCurrentDocument: "コピーできる文書がありません",
	explorerActions: "ファイルエクスプローラーの操作", explorerActionsDesc: "ファイルエクスプローラーのコピーボタンとコンテキストメニュー項目を設定します。", showCopyFileButton: "ファイルコピーボタンを表示", showCopyFileButtonDesc: "ファイル行とコンテキストメニューからファイルやフォルダーをコピーできるようにします。この機能は macOS デスクトップ版でのみ利用できます。", showCopyContentButton: "内容コピーボタンを表示", showCopyContentButtonDesc: "Markdown およびプレーンテキストファイルの行に文書内容のコピーボタンを表示します。",
	showNewFileButton: "新規ファイルボタンを表示", showNewFileButtonDesc: "フォルダー行に空の Markdown ファイルを作成するボタンを表示します。", showCopyRelativePathButton: "相対パスコピーボタンを表示", showCopyRelativePathButtonDesc: "ファイルとフォルダー行に保管庫のルートからの相対パスをコピーするボタンを表示します。", showCopyAbsolutePathButton: "絶対パスコピーボタンを表示", showCopyAbsolutePathButtonDesc: "ファイルとフォルダー行にローカル絶対パスをコピーするボタンを表示します。この機能は macOS デスクトップ版でのみ利用できます。",
	documentContentArea: "文書の内容領域", documentContentAreaDesc: "開いている文書のコピーボタンを設定します。", showCopyDocumentButton: "全文コピーボタンを表示", showCopyDocumentButtonDesc: "文書内容領域の右上に全文をコピーするボタンを表示します。",
	codeBlockInsertion: "コードブロックの挿入", codeBlockInsertionDesc: "カーソル位置に Markdown コードブロックを挿入するか、選択したテキストを囲みます。Obsidian のホットキー設定でショートカットを指定してください。", enableCodeBlockCommand: "コードブロック挿入コマンドを有効化", enableCodeBlockCommandDesc: "有効にした後、ホットキーで「Markdown コードブロックを挿入」を検索し、ショートカットを割り当てます。", defaultCodeBlockLanguage: "既定のコードブロック言語", defaultCodeBlockLanguageDesc: "挿入するコードブロックの言語識別子を選択します。", customLanguage: (language) => `カスタム：${language}`,
};

const ko: Translation = {
	copyRelativePath: "상대 경로 복사", copyAbsolutePath: "절대 경로 복사", relativePathCopied: (path) => `상대 경로를 복사했습니다: ${path}`, absolutePathCopied: (path) => `절대 경로를 복사했습니다: ${path}`, pathCopyFailed: "경로를 복사하지 못했습니다", absolutePathMacOnly: "절대 경로 복사는 macOS 데스크톱 앱에서만 사용할 수 있습니다",
	codeBlockPlain: "일반 코드 블록(언어 지정 없음)", copyFolder: "폴더 복사", copyFile: "파일 복사", copyCurrentFile: "현재 파일 복사", newFile: "새 파일", fileCreated: (path) => `파일을 만들었습니다: ${path}`, fileCreateFailed: "파일을 만들지 못했습니다", insertMarkdownCodeBlock: "Markdown 코드 블록 삽입", copyContent: "내용 복사",
	contentCopied: (name) => `내용을 복사했습니다: ${name}`, contentCopyFailed: (name) => `내용을 복사하지 못했습니다: ${name}`, copyFileMacOnly: "‘파일 복사’는 macOS 데스크톱 앱에서만 사용할 수 있습니다", localPathUnavailable: "로컬 파일 경로에 접근할 수 없습니다", fileCopied: (_kind, name) => `복사했습니다: ${name}`, copyFailed: (name) => `복사하지 못했습니다: ${name}`, folderKind: "폴더", fileKind: "파일", copyCurrentDocumentContent: "현재 문서 내용 복사", noCurrentDocument: "복사할 현재 문서가 없습니다",
	explorerActions: "파일 탐색기 동작", explorerActionsDesc: "파일 탐색기의 복사 버튼과 컨텍스트 메뉴 항목을 설정합니다.", showCopyFileButton: "파일 복사 버튼 표시", showCopyFileButtonDesc: "파일 탐색기 행과 컨텍스트 메뉴에서 파일과 폴더를 복사합니다. 이 기능은 macOS 데스크톱 앱에서만 사용할 수 있습니다.", showCopyContentButton: "내용 복사 버튼 표시", showCopyContentButtonDesc: "Markdown 및 일반 텍스트 파일 행에 문서 텍스트 복사 버튼을 표시합니다.",
	showNewFileButton: "새 파일 버튼 표시", showNewFileButtonDesc: "폴더 행에 빈 Markdown 파일을 만드는 버튼을 표시합니다.", showCopyRelativePathButton: "상대 경로 복사 버튼 표시", showCopyRelativePathButtonDesc: "파일과 폴더 행에 보관함 루트 기준 경로를 복사하는 버튼을 표시합니다.", showCopyAbsolutePathButton: "절대 경로 복사 버튼 표시", showCopyAbsolutePathButtonDesc: "파일과 폴더 행에 로컬 절대 경로를 복사하는 버튼을 표시합니다. 이 기능은 macOS 데스크톱 앱에서만 사용할 수 있습니다.",
	documentContentArea: "문서 내용 영역", documentContentAreaDesc: "열린 문서의 복사 버튼을 설정합니다.", showCopyDocumentButton: "문서 복사 버튼 표시", showCopyDocumentButtonDesc: "문서 내용 영역 오른쪽 위에 전체 문서를 복사하는 버튼을 표시합니다.",
	codeBlockInsertion: "코드 블록 삽입", codeBlockInsertionDesc: "커서 위치에 Markdown 코드 블록을 삽입하거나 선택한 텍스트를 감쌉니다. Obsidian 단축키 설정에서 단축키를 지정하세요.", enableCodeBlockCommand: "코드 블록 삽입 명령 활성화", enableCodeBlockCommandDesc: "활성화한 뒤 단축키에서 ‘Markdown 코드 블록 삽입’을 검색하여 원하는 단축키를 지정하세요.", defaultCodeBlockLanguage: "기본 코드 블록 언어", defaultCodeBlockLanguageDesc: "삽입할 코드 블록에 사용할 언어 식별자를 선택합니다.", customLanguage: (language) => `사용자 지정: ${language}`,
};

const de: Translation = {
	copyRelativePath: "Relativen Pfad kopieren", copyAbsolutePath: "Absoluten Pfad kopieren", relativePathCopied: (path) => `Relativer Pfad kopiert: ${path}`, absolutePathCopied: (path) => `Absoluter Pfad kopiert: ${path}`, pathCopyFailed: "Pfad konnte nicht kopiert werden", absolutePathMacOnly: "Das Kopieren absoluter Pfade ist nur in der macOS-Desktop-App verfügbar",
	codeBlockPlain: "Einfacher Codeblock (keine Sprache)", copyFolder: "Ordner kopieren", copyFile: "Datei kopieren", copyCurrentFile: "Aktuelle Datei kopieren", newFile: "Neue Datei", fileCreated: (path) => `Datei erstellt: ${path}`, fileCreateFailed: "Datei konnte nicht erstellt werden", insertMarkdownCodeBlock: "Markdown-Codeblock einfügen", copyContent: "Inhalt kopieren",
	contentCopied: (name) => `Inhalt kopiert: ${name}`, contentCopyFailed: (name) => `Inhalt konnte nicht kopiert werden: ${name}`, copyFileMacOnly: "„Datei kopieren“ ist nur in der macOS-Desktop-App verfügbar", localPathUnavailable: "Auf den lokalen Dateipfad kann nicht zugegriffen werden", fileCopied: (kind, name) => `${kind} kopiert: ${name}`, copyFailed: (name) => `Kopieren fehlgeschlagen: ${name}`, folderKind: "Ordner", fileKind: "Datei", copyCurrentDocumentContent: "Inhalt des aktuellen Dokuments kopieren", noCurrentDocument: "Kein aktuelles Dokument zum Kopieren vorhanden",
	explorerActions: "Dateiexplorer-Aktionen", explorerActionsDesc: "Kopierschaltflächen und Kontextmenüeinträge im Dateiexplorer verwalten.", showCopyFileButton: "Schaltfläche zum Kopieren von Dateien anzeigen", showCopyFileButtonDesc: "Dateien und Ordner über Zeilen und Kontextmenüs des Dateiexplorers kopieren. Diese Funktion ist nur in der macOS-Desktop-App verfügbar.", showCopyContentButton: "Schaltfläche zum Kopieren von Inhalten anzeigen", showCopyContentButtonDesc: "Bei Markdown- und Textdateien eine Schaltfläche zum Kopieren des Dokumenttexts anzeigen.",
	showNewFileButton: "Schaltfläche für neue Datei anzeigen", showNewFileButtonDesc: "Eine Schaltfläche zum Erstellen einer leeren Markdown-Datei in Ordnerzeilen anzeigen.", showCopyRelativePathButton: "Schaltfläche zum Kopieren relativer Pfade anzeigen", showCopyRelativePathButtonDesc: "Eine Schaltfläche zum Kopieren des Pfads relativ zum Vault-Stamm in Datei- und Ordnerzeilen anzeigen.", showCopyAbsolutePathButton: "Schaltfläche zum Kopieren absoluter Pfade anzeigen", showCopyAbsolutePathButtonDesc: "Eine Schaltfläche zum Kopieren des lokalen absoluten Pfads in Datei- und Ordnerzeilen anzeigen. Diese Funktion ist nur in der macOS-Desktop-App verfügbar.",
	documentContentArea: "Dokumentinhalt", documentContentAreaDesc: "Kopierschaltfläche des geöffneten Dokuments verwalten.", showCopyDocumentButton: "Schaltfläche zum Kopieren des Dokuments anzeigen", showCopyDocumentButtonDesc: "Oben rechts im Dokumentinhalt eine Schaltfläche zum Kopieren des gesamten Dokuments anzeigen.",
	codeBlockInsertion: "Codeblock einfügen", codeBlockInsertionDesc: "Einen Markdown-Codeblock an der Cursorposition einfügen oder ausgewählten Text umschließen. Die Tastenkombination wird in Obsidians Einstellungen für Tastenkürzel festgelegt.", enableCodeBlockCommand: "Befehl zum Einfügen von Codeblöcken aktivieren", enableCodeBlockCommandDesc: "Danach unter Tastenkürzel nach „Markdown-Codeblock einfügen“ suchen und eine Tastenkombination zuweisen.", defaultCodeBlockLanguage: "Standardsprache für Codeblöcke", defaultCodeBlockLanguageDesc: "Die Sprachkennung für eingefügte Codeblöcke auswählen.", customLanguage: (language) => `Benutzerdefiniert: ${language}`,
};

const fr: Translation = {
	copyRelativePath: "Copier le chemin relatif", copyAbsolutePath: "Copier le chemin absolu", relativePathCopied: (path) => `Chemin relatif copié : ${path}`, absolutePathCopied: (path) => `Chemin absolu copié : ${path}`, pathCopyFailed: "Impossible de copier le chemin", absolutePathMacOnly: "La copie de chemin absolu est uniquement disponible dans l’application de bureau macOS",
	codeBlockPlain: "Bloc de code simple (sans langage)", copyFolder: "Copier le dossier", copyFile: "Copier le fichier", copyCurrentFile: "Copier le fichier actuel", newFile: "Nouveau fichier", fileCreated: (path) => `Fichier créé : ${path}`, fileCreateFailed: "Impossible de créer le fichier", insertMarkdownCodeBlock: "Insérer un bloc de code Markdown", copyContent: "Copier le contenu",
	contentCopied: (name) => `Contenu copié : ${name}`, contentCopyFailed: (name) => `Impossible de copier le contenu : ${name}`, copyFileMacOnly: "La copie de fichier est uniquement disponible dans l’application de bureau macOS", localPathUnavailable: "Impossible d’accéder au chemin local du fichier", fileCopied: (kind, name) => `${kind} copié : ${name}`, copyFailed: (name) => `Échec de la copie : ${name}`, folderKind: "Dossier", fileKind: "Fichier", copyCurrentDocumentContent: "Copier le contenu du document actuel", noCurrentDocument: "Aucun document actuel à copier",
	explorerActions: "Actions de l’explorateur de fichiers", explorerActionsDesc: "Gérer les boutons de copie et les éléments du menu contextuel de l’explorateur de fichiers.", showCopyFileButton: "Afficher le bouton de copie de fichier", showCopyFileButtonDesc: "Copier des fichiers et dossiers depuis les lignes et menus contextuels de l’explorateur. Cette fonction est uniquement disponible dans l’application de bureau macOS.", showCopyContentButton: "Afficher le bouton de copie du contenu", showCopyContentButtonDesc: "Afficher un bouton permettant de copier le texte des documents Markdown et texte brut.",
	showNewFileButton: "Afficher le bouton Nouveau fichier", showNewFileButtonDesc: "Afficher un bouton pour créer un fichier Markdown vide dans les lignes de dossier.", showCopyRelativePathButton: "Afficher le bouton de copie du chemin relatif", showCopyRelativePathButtonDesc: "Afficher un bouton pour copier le chemin relatif à la racine du coffre dans les lignes de fichiers et dossiers.", showCopyAbsolutePathButton: "Afficher le bouton de copie du chemin absolu", showCopyAbsolutePathButtonDesc: "Afficher un bouton pour copier le chemin absolu local dans les lignes de fichiers et dossiers. Cette fonction est uniquement disponible dans l’application de bureau macOS.",
	documentContentArea: "Zone de contenu du document", documentContentAreaDesc: "Gérer le bouton de copie des documents ouverts.", showCopyDocumentButton: "Afficher le bouton de copie du document", showCopyDocumentButtonDesc: "Afficher en haut à droite de la zone de contenu un bouton permettant de copier tout le document.",
	codeBlockInsertion: "Insertion de bloc de code", codeBlockInsertionDesc: "Insérer un bloc de code Markdown au niveau du curseur ou entourer le texte sélectionné. Configurez un raccourci dans les paramètres de raccourcis d’Obsidian.", enableCodeBlockCommand: "Activer la commande d’insertion de bloc de code", enableCodeBlockCommandDesc: "Recherchez ensuite « Insérer un bloc de code Markdown » dans les raccourcis et attribuez le raccourci souhaité.", defaultCodeBlockLanguage: "Langage de bloc de code par défaut", defaultCodeBlockLanguageDesc: "Sélectionner l’identifiant de langage utilisé pour les blocs de code insérés.", customLanguage: (language) => `Personnalisé : ${language}`,
};

const es: Translation = {
	copyRelativePath: "Copiar ruta relativa", copyAbsolutePath: "Copiar ruta absoluta", relativePathCopied: (path) => `Ruta relativa copiada: ${path}`, absolutePathCopied: (path) => `Ruta absoluta copiada: ${path}`, pathCopyFailed: "No se pudo copiar la ruta", absolutePathMacOnly: "Copiar la ruta absoluta solo está disponible en la aplicación de escritorio para macOS",
	codeBlockPlain: "Bloque de código simple (sin lenguaje)", copyFolder: "Copiar carpeta", copyFile: "Copiar archivo", copyCurrentFile: "Copiar archivo actual", newFile: "Nuevo archivo", fileCreated: (path) => `Archivo creado: ${path}`, fileCreateFailed: "No se pudo crear el archivo", insertMarkdownCodeBlock: "Insertar bloque de código Markdown", copyContent: "Copiar contenido",
	contentCopied: (name) => `Contenido copiado: ${name}`, contentCopyFailed: (name) => `No se pudo copiar el contenido: ${name}`, copyFileMacOnly: "Copiar archivos solo está disponible en la aplicación de escritorio para macOS", localPathUnavailable: "No se puede acceder a la ruta local del archivo", fileCopied: (_kind, name) => `Se copió: ${name}`, copyFailed: (name) => `Error al copiar: ${name}`, folderKind: "Carpeta", fileKind: "Archivo", copyCurrentDocumentContent: "Copiar el contenido del documento actual", noCurrentDocument: "No hay ningún documento actual para copiar",
	explorerActions: "Acciones del explorador de archivos", explorerActionsDesc: "Controla los botones de copia y las opciones del menú contextual del explorador de archivos.", showCopyFileButton: "Mostrar botón para copiar archivos", showCopyFileButtonDesc: "Permite copiar archivos y carpetas desde las filas y los menús contextuales del explorador. Esta función solo está disponible en la aplicación de escritorio para macOS.", showCopyContentButton: "Mostrar botón para copiar contenido", showCopyContentButtonDesc: "Muestra un botón para copiar el texto de documentos Markdown y de texto sin formato.",
	showNewFileButton: "Mostrar botón de archivo nuevo", showNewFileButtonDesc: "Muestra un botón para crear un archivo Markdown vacío en las filas de carpetas.", showCopyRelativePathButton: "Mostrar botón para copiar ruta relativa", showCopyRelativePathButtonDesc: "Muestra un botón para copiar la ruta relativa a la raíz de la bóveda en las filas de archivos y carpetas.", showCopyAbsolutePathButton: "Mostrar botón para copiar ruta absoluta", showCopyAbsolutePathButtonDesc: "Muestra un botón para copiar la ruta absoluta local en las filas de archivos y carpetas. Esta función solo está disponible en la aplicación de escritorio para macOS.",
	documentContentArea: "Área de contenido del documento", documentContentAreaDesc: "Controla el botón de copia de los documentos abiertos.", showCopyDocumentButton: "Mostrar botón para copiar el documento", showCopyDocumentButtonDesc: "Muestra en la esquina superior derecha del área de contenido un botón para copiar todo el documento.",
	codeBlockInsertion: "Inserción de bloques de código", codeBlockInsertionDesc: "Inserta un bloque de código Markdown en el cursor o envuelve el texto seleccionado. Configura un atajo en los ajustes de atajos de Obsidian.", enableCodeBlockCommand: "Activar comando para insertar bloques de código", enableCodeBlockCommandDesc: "Después, busca «Insertar bloque de código Markdown» en Atajos y asigna el atajo que prefieras.", defaultCodeBlockLanguage: "Lenguaje predeterminado del bloque de código", defaultCodeBlockLanguageDesc: "Selecciona el identificador de lenguaje para los bloques de código insertados.", customLanguage: (language) => `Personalizado: ${language}`,
};

const ptBR: Translation = {
	copyRelativePath: "Copiar caminho relativo", copyAbsolutePath: "Copiar caminho absoluto", relativePathCopied: (path) => `Caminho relativo copiado: ${path}`, absolutePathCopied: (path) => `Caminho absoluto copiado: ${path}`, pathCopyFailed: "Não foi possível copiar o caminho", absolutePathMacOnly: "Copiar o caminho absoluto só está disponível no aplicativo para macOS",
	codeBlockPlain: "Bloco de código simples (sem linguagem)", copyFolder: "Copiar pasta", copyFile: "Copiar arquivo", copyCurrentFile: "Copiar arquivo atual", newFile: "Novo arquivo", fileCreated: (path) => `Arquivo criado: ${path}`, fileCreateFailed: "Não foi possível criar o arquivo", insertMarkdownCodeBlock: "Inserir bloco de código Markdown", copyContent: "Copiar conteúdo",
	contentCopied: (name) => `Conteúdo copiado: ${name}`, contentCopyFailed: (name) => `Não foi possível copiar o conteúdo: ${name}`, copyFileMacOnly: "Copiar arquivos só está disponível no aplicativo para macOS", localPathUnavailable: "Não foi possível acessar o caminho local do arquivo", fileCopied: (_kind, name) => `Cópia concluída: ${name}`, copyFailed: (name) => `Falha ao copiar: ${name}`, folderKind: "Pasta", fileKind: "Arquivo", copyCurrentDocumentContent: "Copiar conteúdo do documento atual", noCurrentDocument: "Não há um documento atual para copiar",
	explorerActions: "Ações do explorador de arquivos", explorerActionsDesc: "Controle os botões de cópia e os itens do menu de contexto no explorador de arquivos.", showCopyFileButton: "Mostrar botão de copiar arquivo", showCopyFileButtonDesc: "Copie arquivos e pastas pelas linhas e pelos menus de contexto do explorador. Este recurso só está disponível no aplicativo para macOS.", showCopyContentButton: "Mostrar botão de copiar conteúdo", showCopyContentButtonDesc: "Mostre um botão para copiar o texto de documentos Markdown e arquivos de texto simples.",
	showNewFileButton: "Mostrar botão de novo arquivo", showNewFileButtonDesc: "Mostre um botão para criar um arquivo Markdown em branco nas linhas de pastas.", showCopyRelativePathButton: "Mostrar botão de copiar caminho relativo", showCopyRelativePathButtonDesc: "Mostre um botão para copiar o caminho relativo à raiz do cofre nas linhas de arquivos e pastas.", showCopyAbsolutePathButton: "Mostrar botão de copiar caminho absoluto", showCopyAbsolutePathButtonDesc: "Mostre um botão para copiar o caminho absoluto local nas linhas de arquivos e pastas. Este recurso só está disponível no aplicativo para macOS.",
	documentContentArea: "Área de conteúdo do documento", documentContentAreaDesc: "Controle o botão de cópia dos documentos abertos.", showCopyDocumentButton: "Mostrar botão de copiar documento", showCopyDocumentButtonDesc: "Mostre um botão no canto superior direito da área de conteúdo para copiar o documento inteiro.",
	codeBlockInsertion: "Inserção de bloco de código", codeBlockInsertionDesc: "Insira um bloco de código Markdown no cursor ou envolva o texto selecionado. Configure um atalho nas configurações de teclas de atalho do Obsidian.", enableCodeBlockCommand: "Ativar comando de inserção de bloco de código", enableCodeBlockCommandDesc: "Depois, procure “Inserir bloco de código Markdown” em Teclas de atalho e atribua o atalho desejado.", defaultCodeBlockLanguage: "Linguagem padrão do bloco de código", defaultCodeBlockLanguageDesc: "Selecione o identificador de linguagem usado nos blocos de código inseridos.", customLanguage: (language) => `Personalizado: ${language}`,
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

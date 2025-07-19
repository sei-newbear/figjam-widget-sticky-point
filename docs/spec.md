<!-- Imported from: docs/spec.md -->
# Sticky Point Widget 開発資料

## 1. プロジェクト概要

このプロジェクトは、FigJam上で付箋にポイントタグを適用し、その合計をカウントするためのウィジェット「Sticky Point」を開発するものです。

- **ウィジェット名**: Sticky Point
- **ID**: 1523141515156841697
- **目的**: FigJamの付箋にカスタマイズ可能なポイントタグを適用し、それらをカウントアップすることで、タスクの優先順位付け、作業量の見積もり、アイデアの分類などを視覚的に支援します。

## 2. 機能概要

Sticky Pointウィジェットは、プロパティメニューから `widgetType` を選択することで、主に以下の2つのモードを切り替えて使用します。

### 2.1. タグ付けモード (Point Widget)

付箋などのオブジェクトに追従（stick）させて使用する、ポイント表示用のウィジェットです。

- **プロパティメニューによる設定項目**:
    - **Widget Size**: `size: 'small' | 'medium' | 'large'`
        - ウィジェット全体のサイズと、内部のフォントサイズ、パディング、角丸を調整します。
    - **Widget Width**: `width: 52 | 72 | 104` (それぞれ 'Narrow', 'Normal', 'Wide' に対応)
        - ポイント入力欄の幅を調整します。
    - **Background Color**: `backgroundColor: string`
        - 18色のプリセットカラーから背景色を選択します。
    - **Text Color**: `textColor: string`
        - 黒、白、赤の3色から文字色を選択します。
    - **Grouping Toggle**: `groupingEnabled: boolean`
        - ONにすると、ウィジェットが追従しているオブジェクト（ホスト）と自動的にグループ化／グループ解除されるようになります。
        - 追従先を変更した場合も、新しいホストと自動でグループを形成します。

- **機能**:
    - **ポイント入力**: ウィジェット中央の数値を直接クリックして、任意のポイント（整数または小数）を入力できます。入力値は `point: number` として保存されます。
    - **追従機能**: Figmaの `useStickable` を利用しており、付箋や図形などに貼り付けて追従させることができます。
    - **自動削除機能**: 追従先のオブジェクトが削除された場合、本ウィジェットも自動的に削除されます。これは `useStickable` のイベントハンドラ内で、追従先のノード（ホスト）が存在しなくなったことを検知して実現しています。

### 2.2. カウントモード (Counter Tool)

指定された範囲内にあるPoint Widgetの合計ポイントを計算し、表示するツールです。

- **プロパティメニューによる設定項目**:
    - **Counter Size**: `counterSizeMode: 'normal' | 'compact'`
        - カウンターの表示スタイルを「通常」と「コンパクト」で切り替えます。
    - **Count Target**: `countTarget: 'manual' | 'section'`
        - 計数対象の指定方法を選択します。

- **表示モード (`counterSizeMode`)**:
    - **Normal**: 
        - 「Point Counter」というタイトル、合計値、詳細表示エリア、手動更新ボタンを持つ、情報量の多いレイアウトです。
        - 「Show details」をクリックすると、ポイントごとの内訳（例: 「5pt: 3 items」）が表示されます。
    - **Compact**:
        - 合計ポイントと手動更新ボタンのみの、省スペースなレイアウトです。

- **計数ロジック (`calculateTotal`)**:
    - **実行トリガー**: 「Count」ボタン（Normalモード）または更新アイコン（Compactモード）のクリック。
    - **計数対象の決定 (`countTarget`)**:
        - **Manual Selection**: ユーザーがFigma上で選択している要素（`figma.currentPage.selection`）を対象とします。選択範囲内のPoint Widgetを再帰的に検索して計数します。
        - **Containing Section**: カウンターウィジェット自身が配置されているセクションを対象とします。セクション内のすべてのPoint Widgetを計数します。
    - **計算処理**:
        1. 指定された計数対象の中から、`widgetType: 'point'` のウィジェットをすべて探し出します。
        2. 見つかった各Point Widgetの `point` の値を合計し、`total` stateに保存します。
        3. 同時に、ポイントの値ごとの個数を `pointCounts` stateに集計します。
    - **エラーハンドリング**: 計数対象内にPoint Widgetが見つからなかった場合、「No point widgets found...」という通知が表示されます。

## 3. 技術スタック

- **言語**: TypeScript
- **ビルドツール**: esbuild
- **フレームワーク/API**: Figma Widget API
- **パッケージマネージャー**: npm
- **リンター**: ESLint (@typescript-eslint/eslint-plugin, @figma/eslint-plugin-figma-plugins)

## 4. 開発手順

### 4.1. 依存関係のインストール

```bash
npm install
```

### 4.2. ビルド

ウィジェットをビルドします。出力ファイルは `dist/code.js` です。

```bash
npm run build
```

### 4.3. ウォッチモード

ファイルの変更を監視し、自動的にビルドを実行します。
基本的にウィッチモードで起動しているので、ビルドは不要です。

```bash
npm run watch
```

### 4.4. リンティング

TypeScriptおよびTSXファイルのコードスタイルをチェックします。

```bash
npm run lint
```

リンティングエラーを自動修正します。

```bash
npm run lint:fix
```

### 4.5. 型チェック

TypeScriptの型定義をチェックします。

```bash
npm run tsc
```

## 5. ファイル構成

- `manifest.json`: FigJamウィジェットのメタデータ（名前、ID、APIバージョン、エディタタイプなど）を定義します。
- `package.json`: プロジェクトの依存関係、スクリプト、開発ツール設定を定義します。
- `README.md`: プロジェクトの概要とセットアップ手順を提供します。
- `widget-src/`: ウィジェットのソースコードを格納します。
    - `code.tsx`: ウィジェットのメインロジックとUIコンポーネントが含まれます。
    - `tsconfig.json`: TypeScriptのコンパイル設定を定義します。
- `dist/`: ビルドされたJavaScriptファイルが格納されます。
    - `code.js`: `widget-src/code.tsx`からビルドされた最終的なウィジェットコードです。
- `docs/`: ドキュメントファイルを格納します。
    - `figjam`: figjam関連
        - `figjam_widget_format.md`: FigJamウィジェットの公開フォーマットに関する情報です。
        - `figjam_widget_spec.md`: Sticky Pointウィジェットの公開仕様です。
    - `spec.md` (本ファイル): 内部向け開発資料です。
- `images/`: ウィジェットのスクリーンショットやアイコンなどの画像ファイルを格納します。
- `.git/`: Gitリポジトリの管理ファイルです。
- `.vscode/`: VS Codeのエディタ設定ファイルです。
- `node_modules/`: npmによってインストールされた依存関係パッケージです。

## 必須ルール

公式ドキュメントを必ず確認すること。必要に応じて、公式ドキュメントの別ページを探すこと

### 公式ドキュメント

- [Plugin API Guide](https://www.figma.com/plugin-docs/)
- [Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/)
- [Widget API Guide](https://www.figma.com/widget-docs/)
- [Widget API Reference](https://www.figma.com/widget-docs/api/api-reference/)

<!-- End of import from: docs/spec.md -->

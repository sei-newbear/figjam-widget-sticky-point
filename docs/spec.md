# Sticky Point Widget 開発資料

## 1. プロジェクト概要

このプロジェクトは、FigJam上で付箋にポイントタグを適用し、その合計をカウントするためのウィジェット「Sticky Point」を開発するものです。

- **ウィジェット名**: Sticky Point
- **ID**: 1523141515156841697
- **目的**: FigJamの付箋にカスタマイズ可能なポイントタグを適用し、それらをカウントアップすることで、タスクの優先順位付け、作業量の見積もり、アイデアの分類などを視覚的に支援します。

## 2. 機能概要

Sticky Pointウィジェットは、主に以下の2つのモードで動作します。

### 2.1. タグ付けモード (Point Widget)

- **機能**: 付箋にポイントタグを付与します。
- **カスタマイズ**:
    - **サイズ**: Small, Medium, Large の3段階で調整可能です。
    - **背景色**: 複数のプリセットカラーから選択可能です。
    - **文字色**: 黒、白、赤から選択可能です。
    - **幅**: Narrow, Normal, Wide の3段階で調整可能です。
- **入力**: ポイント値は数値入力フィールドで直接編集できます。
- **挙動**: 付箋にスティックされたウィジェットが、付箋が削除された場合に自動的に削除されるようになっています。

### 2.2. カウントモード (Counter Tool)

- **機能**: 選択範囲内のポイントタグの合計値を計算し、表示します。
- **詳細表示**: 合計値だけでなく、各ポイント値ごとのアイテム数を詳細に表示する機能があります。
- **操作**:
    1. カウントしたいポイントタグを含む領域を選択します。
    2. 「Count」ボタンをクリックすると、選択範囲内のポイントタグの合計値が計算され表示されます。
    3. 「Show details」をクリックすると、各ポイント値ごとの内訳が表示されます。
- **エラーハンドリング**: ポイントウィジェットが選択されていない場合、「No point widgets selected」という通知が表示されます。

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

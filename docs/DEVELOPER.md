# Sticky Point Widget 開発者向けドキュメント

このドキュメントは、Sticky Point Widgetの開発に関する技術的な詳細を記載しています。

## 1. 技術スタック

- **言語**: TypeScript
- **ビルドツール**: esbuild
- **フレームワーク/API**: Figma Widget API
- **パッケージマネージャー**: npm
- **リンター**: ESLint (@typescript-eslint/eslint-plugin, @figma/eslint-plugin-figma-plugins)

## 2. ファイル構成

- `manifest.json`: FigJamウィジェットのメタデータ（名前、ID、APIバージョン、エディタタイプなど）を定義します。
- `package.json`: プロジェクトの依存関係、スクリプト、開発ツール設定を定義します。
- `README.md`: プロジェクトの概要とセットアップ手順を提供します。
- `widget-src/`: ウィジェットのソースコードを格納します。
    - `code.tsx`: ウィジェットのルートコンポーネント。State管理の起点となり、`PointWidget`と`CounterWidget`のどちらを表示するかを決定します。
    - `components/`: UI（ビュー）の責務を持つコンポーネントを格納します。
        - `PointWidget.tsx`: タグ付けモード（Point Widget）のUIを定義します。
        - `CounterWidget.tsx`: カウントモード（Counter Tool）のUIを定義します。
    - `hooks/`: State管理や副作用を含むロジック（カスタムフック）を格納します。
        - `useWidgetPropertyMenu.ts`: Figmaのプロパティメニューの構築とイベント処理を担当するフックです。
        - `usePointWidget.ts`: `PointWidget`の追従機能やグループ化など、ロジック部分を担当するフックです。
        - `useCounterWidget.ts`: `CounterWidget`のポイント計算やState管理など、ロジック部分を担当するフックです。
    - `logic/`: UIやFigma APIの副作用から独立した、純粋なビジネスロジックを格納します。
        - `calculation.ts`: ポイントの合計値や内訳を計算するロジックを担当します。
    - `types.ts`: ウィジェット全体で使用されるTypeScriptの型定義を格納します。
    - `utils.ts`: 特定のコンポーネントやフックに依存しない、汎用的なユーティリティ関数を格納します。
    - `tsconfig.json`: TypeScriptのコンパイル設定を定義します。
- `dist/`: ビルドされたJavaScriptファイルが格納されます。
    - `code.js`: `widget-src/code.tsx`からビルドされた最終的なウィジェットコードです。

## 3. アーキテクチャ

### 3.1. ウィジェットモード

Sticky Pointウィジェットは、プロパティメニューから `widgetType` を選択することで、主に以下の2つのモードを切り替えて使用します。

#### 3.1.1. タグ付けモード (Point Widget)

付箋などのオブジェクトに追従（stick）させて使用する、ポイント表示用のウィジェットです。

- **機能**:
    - **ポイント入力**: ウィジェット中央の数値を直接クリックして、任意のポイント（整数または小数）を入力できます。入力値は `point: number` として保存されます。
    - **追従機能**: Figmaの `useStickable` を利用しており、付箋や図形などに貼り付けて追従させることができます。
    - **自動削除機能**: 追従先のオブジェクトが削除された場合、本ウィジェットも自動的に削除されます。これは `useStickable` のイベントハンドラ内で、追従先のノード（ホスト）が存在しなくなったことを検知して実現しています。

#### 3.1.2. カウントモード (Counter Tool)

指定された範囲内にあるPoint Widgetの合計ポイントを計算し、表示するツールです。

- **計数ロジック (`calculateTotal`)**:
    - **実行トリガー**: 「Count」ボタン（Normalモード）または更新アイコン（Compactモード）のクリック。
    - **計数対象の決定 (`countTarget`)**:
        - **Manual Selection**: ユーザーがFigma上で選択している要素（`figma.currentPage.selection`）を対象とします。選択範囲内のPoint Widgetを再帰的に検索して計数します。
        - **Containing Section**: カウンターウィジェット自身が配置されているセクションを対象とします。セクション内のすべてのPoint Widgetを計数します。
    - **計算処理**:
        1. 指定された計数対象の中から、`widgetType: 'point'` のウィジェットをすべて探し出します。
        2. 見つかった各Point Widgetの `point` の値を合計し、`total` stateに保存します。
        3. 同時に、ポイントの値ごとの個数を `pointCounts` stateに集計します。

## 4. 開発手順

### 4.1. 依存関係のインストール

```bash
npm install
```

### 4.2. ビルド

```bash
npm run build
```

### 4.3. ウォッチモード

```bash
npm run watch
```

### 4.4. リンティング

```bash
npm run lint
```

リンティングエラーを自動修正します。

```bash
npm run lint:fix
```

### 4.5. 型チェック

```bash
npm run tsc
```

### 4.6. テスト

Jestを使用した単体テストが設定されています。

```bash
npm test
```

テストファイルは `test/` ディレクトリに配置します。特に、`widget-src/logic/` 内の純粋なビジネスロジックは、UIやAPIの依存と切り離されているため、積極的にテストを作成することが推奨されます。

## 5. 必須ルール

開発に着手する前に、必ず公式ドキュメントを確認してください。

- [Widget API Guide](https://www.figma.com/widget-docs/)
- [Widget API Reference](https://www.figma.com/widget-docs/api/api-reference/)
# Sticky Point Widget 開発者向けドキュメント

このドキュメントは、Sticky Point Widgetの開発に関する技術的な詳細を記載しています。

## 1. 技術スタック

- **言語**: TypeScript
- **ビルドツール**: esbuild
- **フレームワーク/API**: Figma Widget API
- **パッケージマネージャー**: npm
- **リンター**: ESLint (@typescript-eslint/eslint-plugin, @figma/eslint-plugin-figma-plugins)
- **テストフレームワーク**: Jest

## 2. ファイル構成

- `manifest.json`: FigJamウィジェットのメタデータ（名前、ID、APIバージョン、エディタタイプなど）を定義します。
- `package.json`: プロジェクトの依存関係、スクリプト、開発ツール設定を定義します。
- `README.md`: プロジェクトの概要とセットアップ手順を提供します。
- `widget-src/`: ウィジェットのソースコードを格納します。
    - `code.tsx`: ウィジェットのルートコンポーネント。State管理の起点となり、`PointWidget`と`CounterWidget`のどちらを表示するかを決定します。
    - `components/`: UI（ビュー）の責務を持つコンポーネントを格納します。
        - `PointWidget.tsx`: タグ付けモード（Point Widget）のUIを定義します。
        - `CounterWidget.tsx`: カウントモード（Counter Tool）のUIを定義します。
        - `OrganizerWidget.tsx`: 整理モード（Organizer Tool）のUIを定義します。
    - `hooks/`: State管理や副作用を含むロジック（カスタムフック）を格納します。
        - `useWidgetPropertyMenu.ts`: Figmaのプロパティメニューの構築とイベント処理を担当するフックです。
        - `usePointWidget.ts`: `PointWidget`の追従機能やグループ化など、ロジック部分を担当するフックです。
        - `useCounterWidget.ts`: `CounterWidget`のポイント計算やState管理など、ロジック部分を担当するフックです。
        - `useOrganizerWidget.ts`: `OrganizerWidget`のグループ化/グループ解除ロジックを担当するフックです。
    - `logic/`: UIやFigma APIの副作用から独立した、純粋なビジネスロジックを格納します。
        - `calculation.ts`: ポイントの合計値や内訳を計算するロジックを担当します。
        - `groupingRules.ts`: グループ化に関するルールを定義するロジックを担当します。
    - `types.ts`: ウィジェット全体で使用されるTypeScriptの型定義を格納します。
    - `utils/`: 特定のコンポーネントやフックに依存しない、汎用的なユーティリティ関数を格納します。
        - `grouping.ts`: オブジェクトのグループ化に関連するユーティリティ関数です。
        - `pointWidget.ts`: Point Widgetの作成や操作に関するユーティリティ関数です。
    - `tsconfig.json`: TypeScriptのコンパイル設定を定義します。
- `dist/`: ビルドされたJavaScriptファイルが格納されます。
    - `code.js`: `widget-src/code.tsx`からビルドされた最終的なウィジェットコードです。
- `test/`: テストコードを格納します。
    - `logic/`: `widget-src/logic`内のビジネスロジックに対応するテストです。
        - `calculation.test.ts`
        - `groupingRules.test.ts`
    - `utils/`: `widget-src/utils`内のユーティリティ関数に対応するテストです。
        - `pointWidget.test.ts`
    - `setupTests.ts`: Jestのテスト環境をセットアップするためのファイルです。
    - `tsconfig.json`: テスト用のTypeScriptコンパイル設定です。

## 3. 開発の進め方

### 3.1. テスト駆動開発 (TDD)

本プロジェクトでは、品質とメンテナンス性を高めるため、テスト駆動開発（TDD）を基本方針とします。

-   **最重要: `logic/` 内のビジネスロジック**
    -   `widget-src/logic/` に新しいロジックを追加・修正する場合は、**必ず先に `test/logic/` にテストコードを記述してください。**
    -   テストを実行して失敗することを確認してから、プロダクトコードの実装に着手します。
-   **推奨: `utils/` 内のユーティリティ**
    -   `widget-src/utils/` 内の関数についても、可能な限りテストを作成することが推奨されます。
-   **任意: その他のレイヤー**
    -   UIコンポーネント (`components/`) やカスタムフック (`hooks/`) については、現時点ではテストを必須とはしません。

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

テストファイルは `test/` ディレクトリに、テスト対象のファイル構造を模倣して配置します。特に、`widget-src/logic/` や `widget-src/utils/` 内の純粋なロジックは、UIやAPIの依存と切り離されているため、積極的にテストを作成することが推奨されます。

## 5. 必須ルール

開発に着手する前に、必ず公式ドキュメントを確認してください。

- [Widget API Guide](https://www.figma.com/widget-docs/)
- [Widget API Reference](https://www.figma.com/widget-docs/api/api-reference/)
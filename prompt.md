@widget-src/hooks/useStickyTaggerWidget.ts を読み込んでください。                                                                                   │

## やること

タグ一括付与機能の仕様を変更したいです。
現在の仕様は、テンプレートのPointタグのIDをウィジェットに登録し、一括付与時に登録したタグをコピーして貼り付けています。
せっかく、ウィジェットにタグを登録しているのに、Figjam上からタグのテンプレートを削除できない状態になっています。
処理フロー概要にしたがった実装に修正してください。

## 処理フロー概要
1. テンプレートのタグを登録時に、タグの`useSyncedState`で登録している内容をすべて保存する。
2. タグのコピーは、StickyTagger自身を`cloneWidget`を使って、コピーし、1で登録した内容で変更することで、StickyTaggerからPointタグに変更します。

## 注意事項

- 実装する際は、[公式ドキュメント](https://www.figma.com/widget-docs/managing-multiple-widgets/)をよく読んでください。
- `npm run watch`を別ターミナルで実行しているので、コード修正後にビルドは不要です。
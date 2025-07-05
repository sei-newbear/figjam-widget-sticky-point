ウィジェットを実行するための手順は以下の通りです。また、以下のリンク先でも手順を確認できます。

https://www.figma.com/widget-docs/setup-guide/

このウィジェットテンプレートは、JavaScriptアプリケーションを作成するための2つの標準的なツールであるTypeScriptとNPMを使用しています。

まず、NPMが付属しているNode.jsをダウンロードします。これにより、TypeScriptやその他のライブラリをインストールできるようになります。ダウンロードリンクはこちらです。

https://nodejs.org/en/download/

次に、以下を実行してTypeScript、esbuild、および最新の型定義をインストールします。

```
npm install
```

JavaScriptに詳しい方なら、TypeScriptは非常に馴染み深く見えるでしょう。実際、有効なJavaScriptコードは、すでに有効なTypeScriptコードです。

TypeScriptは変数に型注釈を追加します。これにより、Visual Studio Codeなどのコードエディタは、コードを記述している際にFigma APIに関する情報を提供したり、以前は気づかなかったバグを発見するのに役立ちます。

詳細については、https://www.typescriptlang.org/ をご覧ください。

TypeScriptを使用するには、ブラウザで実行するためにTypeScript（widget-src/code.tsx）をJavaScript（dist/code.js）に変換するコンパイラが必要です。私たちはそのためにesbuildを使用します。

TypeScriptのコーディングにはVisual Studio Codeの使用をお勧めします。

1.  まだダウンロードしていない場合は、Visual Studio Codeをダウンロードしてください: https://code.visualstudio.com/
2.  このディレクトリをVisual Studio Codeで開きます。
3.  TypeScriptをJavaScriptにコンパイルします: 「ターミナル > ビルド タスクの実行...」メニュー項目を実行し、「npm: watch」を選択します。Visual Studio Codeを再度開くたびに、この操作を繰り返す必要があります。

以上です！ Visual Studio Codeは、ファイルを保存するたびにJavaScriptファイルを再生成します。
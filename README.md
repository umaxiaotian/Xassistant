# Xassistant

Chromeのバージョン114以降で実装された、SidePanel機能を利用して、拡張機能を作りました。

オープンソースで公開していますので、皆さんぜひ使ってみてください。

また感想などありましたら教えてください。

# 今回作ったもの

作ったものは、サイドパネルでGPTと会話してみたり、Chromeのウェブサイトから文字を選択し、拡張機能に文字を渡して、ページの要約などができる機能などを実装しています。
![スクリーンショット 2023-10-21 154619.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/1a531340-08a6-ac48-9fcf-b767a85f4db3.png)

## 機能

- Chrome/Edgeのサイドパネルから会話できる機能
- サイト内の文字を選択して、要約したりその選択内容を質問で渡したりできる機能
- ダークモード切り替え機能
- LangchainのTools機能を使ってアニメランキングとGoogle検索に対応
    - [https://qiita.com/umaxiaotian/items/782603e4e3efae228157](https://qiita.com/umaxiaotian/items/782603e4e3efae228157) (アニメランキングはこちらを使って作っています。）

## ギャラリー

![bandicam-2023-10-10-20-54-18-575_(1).gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/733a5196-55dd-b41d-521b-c922cb47b599.gif)



## 今回のインストール手順をスキップして使う方法

下記のChrome拡張機能ストアからダウンロードできます。

ただし、APIはIP制限をかけているので、私に、Twitter ```umarun _j```宛にDMを送って貰えれば使えるようにします。

[https://chrome.google.com/webstore/detail/xassistant/onchpcbhinlpmohfkjjiemmofnigppfd](https://chrome.google.com/webstore/detail/xassistant/onchpcbhinlpmohfkjjiemmofnigppfd)

# コードセットアップ手順

- 前提
    - Python3がインストールされていること
    - NodeJSがインストールされていること。

どちらも最新で動作します。

まずは、下記からコードをクローンします。ZIPでダウンロードしても問題ありません。

[https://github.com/umaxiaotian/Xassistant](https://github.com/umaxiaotian/Xassistant)

※今回はCloneではなくZIPファイルで行っています。

Cloneされた方は②の手順以降を行ってください。

①下記でダウンロードします。
![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/e40bc7e3-1170-759a-a18a-93d5c72536d4.png)



②ZIPファイルを展開してください。

下記のようになればOK
![Untitled 1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/9b94435a-bbae-eba3-052b-95891c09764a.png)


### APIの手順

③APIファイルを開きます。

![Untitled 2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/a16e604c-9d7d-4579-adbb-b7cff664d968.png)


④.envを編集

.env.exampleを参考にOPENAIのAPIキーなどを設定してください。.envにリネームして保存します。

※ちなみにGoogle接続用のこの２つはなくても、大丈夫です。この２つはToolsのGoogle検索で利用するものになります。利用する方入れてください。

- GCSE_ID
- GAPI_KEY

![Untitled 3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/ae610687-64d3-4904-b0e5-7fe5e9dbfc11.png)


⑤アドレスバー部分に「cmd」と入力してEnterを押すと、コマンドプロンプトが立ち上がるはずです。

![Untitled 4.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/56080080-06a6-50a0-62eb-c77d1f45c9a4.png)


⑥必要パッケージをインストールします。

```jsx
pip install -r requirements.txt
```
![Untitled 5.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/931e4410-9146-0a47-4d7c-392e3fafca9b.png)


インストールできればOK

⑥APIの起動

下記を入力してUvicornを実行します。

```bash
python main.py
```

### 拡張機能の手順

①Extensionのフォルダを開きます。
![Untitled 6.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/9521a4b6-1e5c-f3ca-6bf8-13bdc8df3937.png)


②アドレスバーにcmdを入力し、エンターを押してコマンドプロンプトを起動してください。

![Untitled 7.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/4105dac8-3729-7080-095e-9cfd234f5683.png)


③パッケージのインストール

下記を実行してパッケージをインストールします。

```bash
pnpm install
```

![Untitled 8.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/64a213f5-7a06-5f88-6b83-16081fc4e214.png)


④パッケージを起動する。

下記のコマンドを実行して、パッケージを起動します。

```bash
npm run dev
```
![Untitled 9.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/4131dd44-2aee-170a-06be-e6c024addd24.png)


④Chromeでデバッグする

Extensionフォルダの下にbuildフォルダができたと思います。

![Untitled 10.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/217cc519-585f-7218-41e9-e6962712d580.png)


これをChromeで読み込みます。

**ここのアドレスをコピーしておきます。**

⑤Chromeを開きアドレスバーに下記を入力してください。

```bash
chrome://extensions/
```
![Untitled 11.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/d2c8f76e-79a3-70a2-b0ff-6f100eaecf42.png)


⑥開きましたら、「パッケージ化されていない拡張機能を読み込む」をクリックします。
![Untitled 12.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/14731829-8f1e-b431-38dd-6d41b83b34f8.png)


⑦下記をのフォルダの中に入り、フォルダを選択を押してください。

![Untitled 13.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/8e0adb7a-bda6-4d26-6518-be31e0a463cd.png)


このように入ったら完了です。
![Untitled 14.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/418662/b0bbc20e-b943-f451-2a74-4c70efe57f1b.png)

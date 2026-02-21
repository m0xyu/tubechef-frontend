# TubeChef (Frontend)

YouTube動画からAI（Gemini API）を活用してレシピを自動生成するサービス「TubeChef」のフロントエンドリポジトリです。
本プロジェクトはバックエンド（Laravel）の技術検証およびAPI連携を主眼として開発されています。

## 📌 プロジェクトの概要
YouTubeのURLを入力するだけで、AIが動画内容を解析し、以下の情報を自動抽出・生成します。
- **調理工程の構造化**: 動画のタイムスタンプと連動したステップ解説
- **シェフのコツ（Tips）**: 各工程およびレシピ全体に対する補足情報の生成
- **動画連動再生**: 手順ごとの再生ボタンにより、特定のシーンを即座に確認可能

## 🛠 技術スタック
バックエンドとの疎通および、複雑な型定義（Recipe/Step/Tip）の整合性を重視した構成です。

- **Framework**: React (Vite)
- **Routing**: TanStack Router
- **UI Components**: shadcn/ui, Tailwind CSS
- **API Client**: Axios (認証トークン管理・インターセプター実装)
- **Icon**: React Icons

## 🔧 セットアップ（開発用）

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# ※ VITE_API_BASE_URL にバックエンドのURLを設定

# 開発サーバーの起動
npm run dev
```
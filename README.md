# github-stats

GitHubのContribution（草）を、ターミナルで簡易的に確認するためのTypeScriptプログラム。


## 概要

- Bun Shellで実行
- GitHub CLI（`gh`コマンド）を使用します。認証はghコマンドが担います。
- 今日、昨日、一昨日のCommit数と、直近1週間の合計Commit数を出力します。


## 必要なもの

実行には以下のツールが必要です。

1. **[Bun](https://bun.sh/)** (Runtime)
2. **[GitHub CLI](https://cli.github.com/)**
   - ログイン済みであること（`gh auth login`）

## 実行例
```bash
📊 GitHub Stats for @your-id
────────────────────────────
Today:         5 🟢
Yesterday:    12
Last 7 Days:  45
────────────────────────────
```


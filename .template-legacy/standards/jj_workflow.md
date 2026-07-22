---
title: "Quarantined legacy jj workflow"
status: obsolete
draft_status: n/a
created_at: 2026-05-25
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/verification.md"
related_issues: []
related_prs: []
---

# Quarantined legacy jj workflow

> **NON-OPERATIONAL HISTORICAL REFERENCE. DO NOT EXECUTE OR FOLLOW ANY `jj`
> COMMANDS BELOW.** This file was moved out of `_docs/standards/` during the
> v1.0.0 compatibility migration because it conflicts with this repository's
> Git-based operating model. It is retained only for provenance and deferred
> deletion review; current work must follow `AGENTS.md` and the active project
> documentation instead.

## Original text (historical only)

このプロジェクトでは、「jj (Jujutsu)」を用いたバージョン管理を採用しています。一般的な開発フローにおいての使用方法を以下に示します。

## 基本的なワークフロー

1. **これから行う変更 / 行った変更に対して、適切にメッセージを記述する。**
    - 変更内容が明確に伝わるよう、具体的かつ簡潔なメッセージを心がけてください。メッセージの規則そのものは、Conventional Commitsに準拠します。
    - 使用するべきコマンド: `jj desc -m "(メッセージ内容)"`
    - 例: `jj desc -m "feat: Add user authentication module"`
2. **ブランチを追いつかせる**
    - 原則として`dev`ブランチをpushに使用します。`1.`で変更を記述した後、`dev`ブランチを最新の状態に追いつかせます。
    - 使用するべきコマンド: `jj bookmark set dev -r @`
    - 以上のコマンドは、"現在の変更位置に`dev`ブランチを移動させる"ことを意味します。もし先に`jj new`をしてしまった場合は、`jj bookmark set dev -r @-`を使用してください。また、`dev`が存在しなかった場合は、以下のどちらかの対応をとってください。
    - `jj bookmark create dev -r @` で新規作成する。
    - `jj bookmark list`で既存のブランチを確認し、適切なブランチを使用する。
3. **変更をリモートにpushする**
    - 変更をリモートリポジトリに反映させるために、pushを行います。ただし、状況によって分岐が存在します。
    1. **まずpushを試す**
        - 使用するべきコマンド: `jj git push --bookmark dev`
    2. **"トラックされていない"旨のエラーが出た場合**
        - この場合、以下のコマンドを使用して、リモートブランチとローカルブランチを紐付けます。
        - 使用するべきコマンド: `jj bookmark track dev --remote=origin`
        - その後、再度`jj git push --bookmark dev`を実行してください。
    3. **"リモートに新しい変更がある"旨のエラーが出た場合**
        - あなたがLLMである場合は、ユーザーに現在の状況を説明して、判断を仰いでください。この場合には、いかなる変更も禁止されます。
        - 人間のユーザーである場合は、`jj fetch`などでリモートの変更を取得し、状況を確認してください。
    4. **"コンフリクトが発生している"旨のエラーが出た場合**
        - あなたがLLMである場合は、ユーザーに現在の状況を説明して、判断を仰いでください。この場合には、いかなる変更も禁止されます。
        - 人間のユーザーである場合は、`jj edit`でコンフリクトを解消し、再度`jj git push --bookmark dev`を実行してください。

## CI との整合

Docs CI は `main` と `dev` への push、および `main` 向け pull request で実行されます。jj workflow では `dev` bookmark の push を基本とするため、通常の `jj git push --bookmark dev` 後にも documentation validators が走ります。

#!/usr/bin/env bun
import { $ } from "bun";

// 1. ログインユーザー名を自動取得（USERNAMEが空の場合）
let targetUser = ""; 
if (!targetUser) {
  const nameResponse = await $`gh api user --jq .login`.quiet();
  targetUser = nameResponse.stdout.toString().trim();
}

// 2. GraphQLクエリ
const query = `
query($userName: String!) {
  user(login: $userName) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

try {
  // 3. gh api 実行
  // stdoutだけを確実に取得し、不要な空白をtrimする
  const response = await $`gh api graphql -f query=${query} -f userName=${targetUser}`.text();
  const data = JSON.parse(response);

  if (!data.data?.user) {
    throw new Error("ユーザーデータが見つかりませんでした。");
  }

  // 4. データを平坦化して日付順にソート
  const days = data.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w: any) => w.contributionDays)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 5. 集計
  const today = days[0]?.contributionCount ?? 0;
  const yesterday = days[1]?.contributionCount ?? 0;
  const last7Days = days.slice(0, 7).reduce((acc: number, d: any) => acc + d.contributionCount, 0);

  // 6. 結果表示
  console.log(`\n📊 GitHub Stats for @${targetUser}`);
  console.log(`────────────────────────────`);
  console.log(`Today:       ${today.toString().padStart(3)} 🟢`);
  console.log(`Yesterday:   ${yesterday.toString().padStart(3)}`);
  console.log(`Last 7 Days: ${last7Days.toString().padStart(3)}`);
  console.log(`────────────────────────────\n`);

} catch (err) {
  console.error("❌ エラーが発生しました:");
  console.error(err instanceof Error ? err.message : err);
}

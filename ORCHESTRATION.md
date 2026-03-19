# market-intel 多 Agent 協作架構

版本：v1.0
建立：2026-03-19
維護者：Vera（Claude Code）

---

## 角色分工

| Agent | 名稱 | 模型 | 負責範圍 |
|-------|------|------|---------|
| **Vera** | Claude Code（大腦） | claude-sonnet-4-6 | 架構決策、任務分配、複雜開發、品質審查 |
| **CodeX** | Codex Exec | gpt5.3-codex | 腳本實作與改寫、新功能開發、bug 修復 |
| **Nova** | Gemini CLI | gemini-2.5-pro | 網路新聞研究、報告內容驗證、市場背景補充 |
| **Freya** | OpenClaw | minimax-m2.5 | Telegram 推送、報告排程交付、日常 ops |

---

## 收件匣路徑

| Agent | 收件匣 |
|-------|--------|
| Vera | `~/shared/bot_inbox/claude/` |
| CodeX | `~/shared/bot_inbox/codex/` |
| Nova | `~/shared/bot_inbox/gemini/` |
| Freya | `~/shared/bot_inbox/openclaw/` |

完成後的任務移至 `~/shared/done/`

---

## 任務流程

```
昆鴻 / 自動觸發
       ↓
   Vera（大腦）
   ├─ 分析需求
   ├─ 拆分子任務
   └─ 投入各 agent 收件匣（JSON）
         ↓
  ┌──────┬──────┬──────┐
  ▼      ▼      ▼      ▼
CodeX   Nova  Freya  Vera自做
（程式）（研究）（推送）（複雜決策）
  └──────┴──────┴──────┘
         ↓
   結果回報 → a2a_log.md
         ↓
   Vera 審查 → 昆鴻報告
```

---

## market-intel 任務清單（目前）

### ✅ 已完成（自動化）
- 每日盤後報告生成（05:00，market-close-report.py）
- 風險評分掃描（21:20/22:00，us-market-risk-scan.sh）
- GitHub 自動 push（08:30，market-intel-push.sh）
- 週報生成（週五 08:45，market-weekly-report.py）
- 網頁 dashboard（GitHub Pages）

### 🔴 待完成

| 任務ID | 描述 | 指派 | 優先級 |
|--------|------|------|--------|
| MIT-001 | Telegram 報告推送（每日盤後） | Freya | P1 |
| MIT-002 | ✅ 每日新聞補充（gemini-news-fetch.sh + market-close-report.py 整合） | Nova | P2 |
| MIT-003 | 持倉整合（從 Notion 抓成本價、股數） | CodeX | P2 |
| MIT-004 | ✅ 多日 J 段走勢圖（risk-trend-chart.py + SVG 嵌入 dashboard） | CodeX | P3 |
| MIT-005 | ✅ Telegram 週報推送（market-weekly-report.py 內建，cron 週五 08:45） | Freya | P2 |
| MIT-006 | ✅ 報告品質驗證腳本（market-report-validate.py，cron 5:10） | Nova | P3 |

---

## 任務 JSON 格式

```json
{
  "task_id": "MIT-001",
  "from": "vera",
  "to": "freya",
  "priority": "P1",
  "status": "pending",
  "title": "Telegram 報告推送",
  "description": "...",
  "inputs": [],
  "expected_output": "...",
  "deadline": "2026-03-20",
  "created_at": "2026-03-19T11:00:00+08:00"
}
```

---

## 調度腳本

```bash
~/scripts/market-intel-dispatch.sh [--assign | --status | --review]
```

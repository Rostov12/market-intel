# BTC SMC v1.0

Pine Script 檔案：`~/market-intel/pine-scripts/btc-smc-v1.pine`

## 目的
這版不是做成 LuxAlgo 的全資產通用版，而是做成 **BTC 現貨擇時輔助**：
- H4 看結構方向
- M15 看進場確認
- 搭配昆鴻現有 **Ichimoku + RSI** 當第二層濾網
- 用來輔助 V7 加密 13% bucket 的現貨分批進場節奏

## 授權
- 改編自 LuxAlgo Smart Money Concepts 思想框架
- 授權：**CC BY-NC-SA 4.0**
- 本版本保持相同授權

## 這版做了什麼

### 1. BOS / CHoCH 結構偵測
- 自動依 timeframe 給預設 swing length：
  - M15 → 20
  - H4 以上 → 50
  - 其他 → 30
- BOS 用實線
- CHoCH 用虛線
- label 會標 `Bull/Bear [timeframe]`

### 2. Order Block
- 使用「最後一根反向收盤 K」當 OB
- 加入 BTC 噪音過濾：
  - 若該反向 K 的 range < `ATR x 0.5`，直接忽略
- 只有當前 break bar 夠強（預設 `bar range >= ATR x 1.5`）才建立 OB
- 回踩 OB 會觸發 retest alert

### 3. FVG
- 使用 3 根 K 線缺口邏輯
- BTC 特化：最小缺口預設 `0.3%`
- 自動區分：
  - mitigated（開始回補）
  - filled（整段缺口回補完成）

### 4. Premium / Discount
- 以最近 swing high / swing low 中點當 EQ
- 價格在 EQ 上方 = premium
- 價格在 EQ 下方 = discount

### 5. BTC 特化濾網
- **24h 全時段可用**，沒有股票 RTH session 限制
- 單根 K 線漲跌超過 `5%` 的極端 bar，**不納入結構計算**
- 結構性 OB / FVG 預設要求 **break / impulse bar >= ATR x 1.5**

### 6. 回測輔助輸出
- 每次 CHoCH 發生後，追蹤後續 20 根 K 的結果
- 到第 20 根時，在當初 CHoCH 位置打標：
  - `WIN`
  - `LOSS`
- 右下角 table 顯示：
  - 目前 bias
  - Premium / Discount
  - 最近 20 次已完成樣本的 CHoCH 勝率

## 如何加到 TradingView
1. 打開 TradingView
2. 下方切到 **Pine Editor**
3. 把 `btc-smc-v1.pine` 全部貼進去
4. 按 **Save**
5. 按 **Add to chart**
6. 若跳 syntax error：
   - 先確認 TradingView 已切到 Pine v6
   - 再確認貼上時沒有少任何一行 header / function

## 建議 timeframe

### 主架構
- **H4**：看大方向
  - 結構 bias
  - 最近 CHoCH / BOS
  - Premium / Discount 區
  - H4 的 OB / FVG

### 進場層
- **M15**：找 pullback / retest / fill 後反應
  - M15 CHoCH
  - M15 OB retest
  - M15 FVG fill

## 建議用法（和 Ichimoku + RSI 結合）

### Long 篩選
1. H4 bias 為 bullish
2. H4 價格最好在 discount 或剛離開折價區
3. M15 出現 bullish CHoCH 或 bull OB retest
4. 再用你原本 Ichimoku + RSI 確認：
   - 價格不在雲下亂接
   - RSI 不要已經過熱

### Short / 減碼觀察
1. H4 bias 轉 bearish 或出現 bearish CHoCH
2. 價格進 premium 區
3. M15 出現 bear CHoCH / bear OB retest / bear FVG fill 後無法續強
4. 配合現有 Ichimoku + RSI 判斷是否減碼而不是追空

## Alert 設定教學
加到圖表後：
1. 點 TradingView 上方的 **Alert**
2. Condition 選這個指標
3. 可選以下條件：
   - `BTC SMC: CHoCH Bullish`
   - `BTC SMC: CHoCH Bearish`
   - `BTC SMC: Order Block Retested`
   - `BTC SMC: FVG Filled`
4. 建議 alert frequency：**Once Per Bar Close**

### 內建 alert 訊息
- `BTC SMC: CHoCH Bearish on {{interval}}`
- `BTC SMC: CHoCH Bullish on {{interval}}`
- `BTC SMC: Order Block Retested`
- `BTC SMC: FVG Filled`

腳本也有用 `alert()` 動態補充：
- 當前價
- 結構位
- 建議觀察方向

## 建議參數

### H4
- Auto swing：開
- 若手動：`50`
- ATR impulse threshold：`1.5`
- FVG min：`0.3%`
- Extreme bar filter：`5%`

### M15
- Auto swing：開
- 若手動：`20`
- 其他先維持預設

## 你應該怎麼評估這指標能不能用
不要只看畫面漂不漂亮，先看兩件事：

1. **最近 20 次 CHoCH 勝率**
   - 若長期 < 50%，代表單獨用沒 edge
   - 若 > 55% 且樣本夠多，才有保留價值

2. **是否能和 Ichimoku + RSI 形成分工**
   - SMC 做結構切換 / 流動性位置
   - Ichimoku 做趨勢濾網
   - RSI 做節奏與過熱檢查

## 已知限制（v1.0）
- 這版還不是多週期聯動版，**H4 bias 染色 + M15 entry 同屏** 的 v1.1 尚未做
- CHoCH 勝率是 indicator 內部的簡易 forward outcome 統計，不等於完整策略回測
- OB / FVG 目前偏實戰視覺化用途，不是 institutional-grade 全歷史狀態機
- 游標回看時，labels / boxes 很多是正常現象

## 建議下一版（v1.1）
1. 加入 H4 request.security 趨勢染色
2. M15 僅在 H4 bias 同方向時顯示 entry 訊號
3. 將 CHoCH outcome 輸出成更細的 long/short 分開勝率
4. 增加 Ichimoku filter 開關
5. 加入簡易 strategy wrapper 做 walk-forward 測試

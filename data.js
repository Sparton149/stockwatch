// STOCKWATCH data. MARKET WATCH updates this file; the page only reads it.
// Real entries mirror WATCHLIST.md. First sourced pass added 2026-10-25; verify leads before acting.
window.STOCKWATCH = {
  updated: "2026-10-25",
  market: {
    // SPY, QQQ, VIX baselines are set on MARKET WATCH's first pass.
    SPY: null,
    QQQ: null,
    VIX: null
  },
  alerts: [],
  watchlist: [
    {
      ticker: "NFLX", lean: "bearish", added: "2026-10-25", symbol: "NASDAQ:NFLX",
      reasons: [
        { text: "Q3 EPS $0.87 beat and revenue $12.87B matched, but Q4 revenue guidance ($13.4B) and full-year revenue ($51.1B) came in slightly below consensus.", url: "https://deadline.com/2026/10/netflix-q3-2026-earnings-layoffs-streaming-1237168825/", read: "2026-10-25" },
        { text: "2026 ad revenue guidance cut to $2.7B from $3B, blamed on a slower ad product rollout.", url: "https://deadline.com/2026/10/netflix-q3-2026-earnings-layoffs-streaming-1237168825/", read: "2026-10-25" },
        { text: "Shares down about 40% over the past year; about 1,000 layoffs and a content chief exit; co-CEO says viewership is not growing as fast as he wants.", url: "https://deadline.com/2026/10/netflix-q3-2026-earnings-layoffs-streaming-1237168825/", read: "2026-10-25" },
        { text: "HSBC cut to Hold ($76 target), Huber Research to Underweight ($70), Wells Fargo Underweight ($57); HSBC cites 7.8% US TV share vs YouTube at 14.2% (aggregator summary).", url: "https://stockstotrade.com/news/netflix-inc-nflx-news-2026_10_21/", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. Viewing-hours growth re-accelerating, ad guidance restored, a clear break above the roughly $72-73 range, or analyst cuts reversing. Margins and balance sheet are described as solid, so this is a growth-narrative case.",
      news: [
        { title: "Netflix Stock Falls Despite Solid Q3 Results On Lowered Advertising Guidance (Deadline)", url: "https://deadline.com/2026/10/netflix-q3-2026-earnings-layoffs-streaming-1237168825/", date: "2026-10-20" },
        { title: "Netflix Stock Slips As Weak Guidance And Downgrades Hit (StocksToTrade)", url: "https://stockstotrade.com/news/netflix-inc-nflx-news-2026_10_21/", date: "2026-10-21" },
        { title: "Netflix Stock Analysis, October 2026: HSBC Downgrade and Q3 Earnings Preview (Admirals)", url: "https://admiralmarkets.com/analytics/traders-blog/netflix-stock-analysis-october-2026", date: "2026-10-05" }
      ]
    },
    {
      ticker: "PLTR", lean: "neutral", added: "2026-10-25", symbol: "NASDAQ:PLTR",
      reasons: [
        { text: "Goldman Sachs upgraded to Buy from Neutral on Oct 8, 2026.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "Near $196.29 in the Oct 8 session, close to the $207.52 52-week high, trailing P/E 166.46. Average target $203.75 implies about 4% upside; UBS $250, lowest target $90. Valuation offsets the upgrade.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. Toward bullish: commercial growth that pushes targets well above the price. Toward bearish: government budget delays, slower commercial deal growth, or larger software rivals taking share. Single-source entry; verify.",
      news: [
        { title: "Strong Buy Stocks for Friday, October 9, 2026: Five Names Riding Thursday's Analyst Upgrades (Behind the Markets)", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", date: "2026-10-09" }
      ]
    },
    {
      ticker: "GNRC", lean: "bullish", added: "2026-10-25", symbol: "NYSE:GNRC",
      reasons: [
        { text: "KeyBanc upgraded to Overweight and Piper Sandler initiated at Overweight on Oct 8, 2026.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "14 of 17 tracked firms bullish; average target $279.47 vs about $218.42 (about 28% upside). Source's view: data-center backup power is a new growth driver.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "Counter-evidence: Citigroup cut its target to $232 from $300 (Sept 30) and Cantor to $297 from $333 (Oct 5); the stock is well below its $296.44 52-week high.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. Weak storm-dependent residential demand, data-center power competition, or further target cuts. Single-source entry; verify.",
      news: [
        { title: "Strong Buy Stocks for Friday, October 9, 2026: Five Names Riding Thursday's Analyst Upgrades (Behind the Markets)", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", date: "2026-10-09" }
      ]
    },
    {
      ticker: "BAH", lean: "bullish", added: "2026-10-25", symbol: "NYSE:BAH",
      reasons: [
        { text: "Truist upgraded to Buy from Hold on Oct 8, 2026 and raised its target to $85 from $70.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "About $71.53 with trailing P/E 11.19, 52-week range $59.50 to $109.10, yield near 3%. Source's view: the decline has priced in much of the federal spending pressure.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "Contrarian: consensus is Hold (3 bullish, 4 neutral, 3 bearish); Citigroup ($77) and Jefferies ($75) cut targets on Oct 7.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. More federal contract cancellations or budget delays, or more downgrades. Single-source entry; verify.",
      news: [
        { title: "Strong Buy Stocks for Friday, October 9, 2026: Five Names Riding Thursday's Analyst Upgrades (Behind the Markets)", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", date: "2026-10-09" }
      ]
    },
    {
      ticker: "GPN", lean: "bullish", added: "2026-10-25", symbol: "NYSE:GPN",
      reasons: [
        { text: "Oppenheimer upgraded to Outperform from Perform on Oct 8, 2026.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "About $82.68 in the Oct 8 session; 7 bullish and 10 neutral of 17 firms; average target $97.18 (about 18% upside). Source's view: the merchant-business restructuring could unlock value.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "Weak points: most of the panel is neutral and trailing P/E is negative because of charges.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. Integration problems, further neutral or negative rating changes, or weaker consumer spending. Single-source entry; verify.",
      news: [
        { title: "Strong Buy Stocks for Friday, October 9, 2026: Five Names Riding Thursday's Analyst Upgrades (Behind the Markets)", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", date: "2026-10-09" }
      ]
    },
    {
      ticker: "TREX", lean: "bullish", added: "2026-10-25", symbol: "NYSE:TREX",
      reasons: [
        { text: "Deutsche Bank upgraded to Buy from Hold on Oct 8, 2026 with a $57 target.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "About $44.62, trailing P/E 26.69; 11 bullish, 4 neutral, 2 bearish of 17 firms; average target $51.76 (about 16% upside).", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" },
        { text: "Rate-sensitive: the source says lower rate-hike odds could help housing stocks, but also reports the 10-year near 5.31% and about 70% odds of a hike by Dec 9.", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", read: "2026-10-25" }
      ],
      changes: "Hypothesis only. Higher mortgage rates, weak home-improvement spending, raw material costs, or rising rate-hike odds. Single-source entry; verify.",
      news: [
        { title: "Strong Buy Stocks for Friday, October 9, 2026: Five Names Riding Thursday's Analyst Upgrades (Behind the Markets)", url: "https://behindthemarkets.com/market-updates/strong-buy-stocks-for-friday-october-9-2026-five-names-riding-thursday-s-analyst-upgrades", date: "2026-10-09" }
      ]
    }
  ],
  ledger: []
};

// Clearly fake entries, shown only when the "Preview with sample data" button is used.
window.STOCKWATCH_SAMPLE = {
  updated: "SAMPLE DATA",
  market: {
    SPY: { value: "000.00", change: "+0.4%" },
    QQQ: { value: "000.00", change: "-0.2%" },
    VIX: { value: "00.0", change: "+3.1%" }
  },
  alerts: [
    { time: "sample", text: "Sample alert: this is how a reported change will appear.", source: "https://example.com" }
  ],
  watchlist: [
    { ticker: "AAAA", lean: "bullish", added: "2026-10-25",
      reasons: [
        { text: "Sample reason: guidance raised on latest report.", url: "https://example.com/a", read: "sample" },
        { text: "Sample reason: rising volume above recent average.", url: "https://example.com/b", read: "sample" }
      ],
      changes: "Sample: a miss on next earnings or a break below the recorded support level." },
    { ticker: "BBBB", lean: "bearish", added: "2026-10-25",
      reasons: [
        { text: "Sample reason: analyst downgrade and slowing sector demand.", url: "https://example.com/c", read: "sample" }
      ],
      changes: "Sample: a strong beat with raised guidance." },
    { ticker: "CCCC", lean: "neutral", added: "2026-10-25",
      reasons: [ { text: "Sample reason: mixed signals, waiting on catalyst.", url: "https://example.com/d", read: "sample" } ],
      changes: "Sample: a clear catalyst in either direction." }
  ],
  ledger: []
};

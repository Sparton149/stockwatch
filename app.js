(function () {
  "use strict";
  var real = window.STOCKWATCH || {};
  var sample = window.STOCKWATCH_SAMPLE || {};
  var UNI = (window.SW_UNIVERSE && window.SW_UNIVERSE.stocks) || [];
  var modeMeta = document.querySelector('meta[name="sw-mode"]');
  var isPublic = !!(modeMeta && modeMeta.getAttribute("content") === "public");
  var TABS = ["home", "stocks", "board", "watch", "market", "ledger", "about"];
  var PAGE = 50;
  var TV = "https://s3.tradingview.com/external-embedding/";
  var useSample = false;
  var state = {
    tab: null, drawer: null,
    filter: "all", sort: "added", q: "", sel: null,
    sq: "", sector: "", ssort: "ticker", sview: "all", shown: PAGE
  };
  var $ = function (id) { return document.getElementById(id); };
  var byTicker = {};
  UNI.forEach(function (u) { byTicker[u.t] = u; });

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : "#"; }
  function data() { return useSample ? sample : real; }
  function validTicker(t) { return /^[A-Z0-9.\-]{1,8}$/.test(t); }
  function symOk(s) { return /^[A-Za-z0-9.:_\-]{1,20}$/.test(s); }
  function watchMap() {
    var m = {};
    (data().watchlist || []).forEach(function (w) { m[String(w.ticker).toUpperCase()] = w; });
    return m;
  }
  function tickerLink(t, cls) {
    var up = String(t).toUpperCase();
    if (!useSample && validTicker(up)) {
      return '<a class="' + cls + '" href="#stock/' + encodeURIComponent(up) + '">' + esc(t) + "</a>";
    }
    return '<span class="' + cls + '">' + esc(t) + "</span>";
  }

  /* stars are saved on the viewer's own device only */
  function loadStars() {
    try {
      var v = JSON.parse(localStorage.getItem("sw_stars") || "[]");
      return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && validTicker(x); }) : [];
    } catch (e) { return []; }
  }
  var stars = loadStars();
  function saveStars() { try { localStorage.setItem("sw_stars", JSON.stringify(stars)); } catch (e) {} }
  function isStar(t) { return stars.indexOf(t) !== -1; }
  function toggleStar(t) {
    var i = stars.indexOf(t);
    if (i === -1) stars.push(t); else stars.splice(i, 1);
    saveStars();
  }

  function widget(src, cfg) {
    var wrap = document.createElement("div");
    wrap.className = "tradingview-widget-container";
    var inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    wrap.appendChild(inner);
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = src;
    s.text = JSON.stringify(cfg);
    wrap.appendChild(s);
    return wrap;
  }
  function mount(el, file, cfg) {
    if (!el) return;
    el.innerHTML = "";
    el.appendChild(widget(TV + file, cfg));
  }

  /* ---------- HOME ---------- */
  function stat(k, v, s) {
    return '<div class="stat"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div><div class="s">' + esc(s) + "</div></div>";
  }
  function renderHome() {
    var d = data();
    var list = d.watchlist || [];
    var c = { bullish: 0, bearish: 0, neutral: 0 };
    list.forEach(function (w) { if (c[w.lean] != null) c[w.lean]++; });
    var alerts = d.alerts || [];
    $("heroStats").innerHTML =
      stat("Stocks to browse", UNI.length, "S&P 500 listings") +
      stat("On the board", list.length, c.bullish + " bullish, " + c.bearish + " bearish, " + c.neutral + " neutral") +
      stat("Alerts", alerts.length, "reported so far") +
      stat("Last update", d.updated || "None yet", useSample ? "sample data" : "agent data");

    $("homeWatch").innerHTML = list.length
      ? list.slice(0, 6).map(function (w) {
          var r = (w.reasons || [])[0];
          return '<article class="card ' + esc(w.lean) + '"><div class="card-head">' + tickerLink(w.ticker, "ticker") +
            '<span class="lean">' + esc(w.lean) + "</span></div>" +
            '<p class="mini-reason">' + esc(r ? r.text : "No reasons saved yet.") + "</p>" +
            '<div class="added">Added ' + esc(w.added) + "</div></article>";
        }).join("")
      : '<div class="empty"><p class="muted">The board is empty. Names appear here once the agent has sourced reasons for them.</p></div>';

    $("homeAlerts").innerHTML = alerts.length
      ? alerts.slice(0, 3).map(function (x) {
          return '<div class="alert"><b>' + esc(x.time) + "</b> " + esc(x.text) + ' <a href="' + esc(safeUrl(x.source)) + '" target="_blank" rel="noopener">source</a></div>';
        }).join("")
      : '<p class="muted">All quiet. No alerts have been reported yet.</p>';
  }

  var homeMounted = false;
  function mountHome() {
    if (homeMounted) return;
    homeMounted = true;
    mount($("tape"), "embed-widget-ticker-tape.js", {
      symbols: [
        { proName: "AMEX:SPY", title: "SPY" },
        { proName: "NASDAQ:QQQ", title: "QQQ" },
        { proName: "AMEX:DIA", title: "DIA" },
        { proName: "AMEX:IWM", title: "IWM" },
        { proName: "CBOE:VIX", title: "VIX" }
      ],
      showSymbolLogo: false, colorTheme: "dark", isTransparent: true, displayMode: "adaptive", locale: "en"
    });
    mount($("heatmap"), "embed-widget-stock-heatmap.js", {
      exchanges: [], dataSource: "SPX500", grouping: "sector", blockSize: "market_cap_basic",
      blockColor: "change", locale: "en", symbolUrl: "", colorTheme: "dark", hasTopBar: false,
      isDataSetEnabled: false, isZoomEnabled: true, hasSymbolTooltip: true, isMonoSize: false,
      width: "100%", height: "100%"
    });
    mount($("movers"), "embed-widget-hotlists.js", {
      colorTheme: "dark", dateRange: "1D", exchange: "US", showChart: true, locale: "en",
      largeChartUrl: "", isTransparent: true, showSymbolLogo: false, showFloatingTooltip: false,
      width: "100%", height: "100%"
    });
  }

  /* ---------- STOCKS ---------- */
  function initSectors() {
    var counts = {};
    UNI.forEach(function (u) { counts[u.s] = (counts[u.s] || 0) + 1; });
    var names = Object.keys(counts).sort();
    $("ssector").innerHTML = '<option value="">All sectors (' + UNI.length + ")</option>" +
      names.map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + " (" + counts[n] + ")</option>"; }).join("");
  }

  function pool() {
    var base = UNI;
    if (state.sview === "watched") {
      var extra = (data().watchlist || []).filter(function (w) { return !byTicker[String(w.ticker).toUpperCase()]; })
        .map(function (w) { return { t: String(w.ticker).toUpperCase(), n: String(w.ticker), s: "Outside the S&P 500 list", i: "", a: "" }; });
      base = UNI.concat(extra);
    }
    return base;
  }

  function filtered() {
    var q = state.sq.trim().toLowerCase();
    var wm = watchMap();
    var list = pool().filter(function (u) {
      if (state.sector && u.s !== state.sector) return false;
      if (state.sview === "watched" && !wm[u.t]) return false;
      if (state.sview === "starred" && !isStar(u.t)) return false;
      if (!q) return true;
      return (u.t + " " + u.n + " " + u.i + " " + u.s).toLowerCase().indexOf(q) !== -1;
    });
    function score(u) {
      if (!q) return 0;
      var t = u.t.toLowerCase(), n = u.n.toLowerCase();
      if (t === q) return 0;
      if (t.indexOf(q) === 0) return 1;
      if (n.indexOf(q) === 0) return 2;
      return 3;
    }
    var s = state.ssort;
    list.sort(function (a, b) {
      if (q && s === "ticker") { var d = score(a) - score(b); if (d) return d; }
      if (s === "name") return a.n.localeCompare(b.n);
      if (s === "sector") return a.s.localeCompare(b.s) || a.t.localeCompare(b.t);
      if (s === "added") return String(b.a).localeCompare(String(a.a)) || a.t.localeCompare(b.t);
      return a.t.localeCompare(b.t);
    });
    return list;
  }

  function renderStocks() {
    var list = filtered();
    var wm = watchMap();
    var total = list.length;
    var shown = Math.min(state.shown, total);
    var plain = state.sview === "all" && !state.sq && !state.sector;
    $("sinfo").textContent = total
      ? "Showing " + shown + " of " + total + (plain ? " listings" : " matches") + " \u00b7 " + stars.length + " starred on this device"
      : "";
    $("sempty").hidden = total > 0;
    $("smore").hidden = shown >= total;
    $("sbody").innerHTML = list.slice(0, shown).map(function (u) {
      var w = wm[u.t];
      var on = isStar(u.t);
      var enc = encodeURIComponent(u.t);
      return '<tr data-t="' + esc(u.t) + '">' +
        '<td class="c-star"><button class="starbtn' + (on ? " on" : "") + '" data-star="' + esc(u.t) + '" aria-pressed="' + on + '" aria-label="' + (on ? "Unstar " : "Star ") + esc(u.t) + '">' + (on ? "\u2605" : "\u2606") + "</button></td>" +
        '<td><a class="sym" href="#stock/' + enc + '">' + esc(u.t) + "</a></td>" +
        '<td class="name">' + esc(u.n) + "</td>" +
        '<td class="sec">' + esc(u.s) + "</td>" +
        '<td class="ind">' + esc(u.i) + "</td>" +
        '<td class="status">' + (w ? '<span class="badge ' + esc(w.lean) + '">' + esc(w.lean) + "</span>" : "") + "</td></tr>";
    }).join("");
  }

  /* ---------- DRAWER ---------- */
  function updateDrawerStar() {
    var b = $("dStar");
    var on = state.drawer && isStar(state.drawer);
    b.classList.toggle("on", !!on);
    b.innerHTML = on ? "&#9733;" : "&#9734;";
    b.setAttribute("aria-label", on ? "Unstar this stock" : "Star this stock");
  }
  function section(title, id, cls) {
    return '<div class="d-sec"><h3>' + esc(title) + '</h3><div id="' + id + '" class="wbox ' + cls + '"></div></div>';
  }
  function openDrawer(t) {
    t = String(t).toUpperCase();
    if (!validTicker(t)) return;
    state.drawer = t;
    var u = byTicker[t];
    var w = watchMap()[t];
    $("dTitle").textContent = t + (u ? " \u00b7 " + u.n : "");
    $("dSub").textContent = u ? u.s + " \u00b7 " + u.i : (w ? "On the agent's board, not in the S&P 500 list" : "Not in the S&P 500 list");
    updateDrawerStar();

    var html = "";
    if (w) {
      var reasons = (w.reasons || []).map(function (r) {
        return "<li>" + esc(r.text) + ' <a href="' + esc(safeUrl(r.url)) + '" target="_blank" rel="noopener">source</a> <span class="read">read ' + esc(r.read) + "</span></li>";
      }).join("");
      html += '<div class="d-sec"><div class="d-watch ' + esc(w.lean) + '"><div class="card-head"><b>On the board</b><span class="lean ' + esc(w.lean) + '">' + esc(w.lean) + "</span></div>" +
        '<div class="added">Added ' + esc(w.added) + " \u00b7 hypothesis, not a certainty</div>" +
        '<ul class="plain">' + reasons + "</ul>" +
        '<div class="flip"><b>What would change this view:</b> ' + esc(w.changes) + "</div></div></div>";
    }
    html += section("Snapshot", "dInfo", "d-info") + section("Chart", "dChart", "d-chart") +
      section("Indicator summary (not a recommendation)", "dTech", "d-tech") + section("Live news", "dNews", "d-news");
    var y = encodeURIComponent(t.replace(".", "-"));
    html += '<div class="d-sec d-links">Open elsewhere: <a href="https://finance.yahoo.com/quote/' + y + '" target="_blank" rel="noopener">Yahoo Finance</a> <a href="https://www.google.com/finance/quote/' + encodeURIComponent(t) + '" target="_blank" rel="noopener">Google Finance</a></div>';
    $("dBody").innerHTML = html;
    $("drawer").hidden = false;
    document.body.classList.add("lock");
    $("drawer").querySelector(".drawer-pane").scrollTop = 0;

    var sym = (w && w.symbol && symOk(String(w.symbol))) ? String(w.symbol) : t;
    if (useSample) {
      ["dInfo", "dChart", "dTech", "dNews"].forEach(function (id) {
        $(id).innerHTML = '<p class="muted pad">Sample tickers are not real, so no live data is loaded.</p>';
      });
      return;
    }
    mount($("dInfo"), "embed-widget-symbol-info.js", { symbol: sym, width: "100%", locale: "en", colorTheme: "dark", isTransparent: true });
    mount($("dChart"), "embed-widget-advanced-chart.js", {
      autosize: true, symbol: sym, interval: "D", timezone: "Etc/UTC", theme: "dark", style: "1",
      locale: "en", allow_symbol_change: false, hide_side_toolbar: true, support_host: "https://www.tradingview.com"
    });
    mount($("dTech"), "embed-widget-technical-analysis.js", {
      interval: "1D", width: "100%", height: "100%", isTransparent: true, symbol: sym,
      showIntervalTabs: true, displayMode: "single", locale: "en", colorTheme: "dark"
    });
    mount($("dNews"), "embed-widget-timeline.js", {
      feedMode: "symbol", symbol: sym, colorTheme: "dark", isTransparent: true, displayMode: "regular",
      width: "100%", height: "100%", locale: "en"
    });
  }
  function hideDrawer() {
    state.drawer = null;
    $("drawer").hidden = true;
    $("dBody").innerHTML = "";
    document.body.classList.remove("lock");
  }
  function closeDrawer() { location.hash = state.tab || "stocks"; }

  /* ---------- BOARD ---------- */
  function renderBoard() {
    var d = data();
    var list = (d.watchlist || []).slice();
    var counts = { bullish: 0, bearish: 0, neutral: 0 };
    list.forEach(function (w) { if (counts[w.lean] != null) counts[w.lean]++; });
    $("counts").innerHTML = list.length
      ? ["bullish", "bearish", "neutral"].map(function (k) {
          return '<span class="chip ' + k + '">' + counts[k] + " " + k + "</span>";
        }).join("")
      : "";

    var q = state.q.toLowerCase();
    list = list.filter(function (w) {
      if (state.filter !== "all" && w.lean !== state.filter) return false;
      if (!q) return true;
      var hay = w.ticker + " " + (w.reasons || []).map(function (r) { return r.text; }).join(" ");
      return hay.toLowerCase().indexOf(q) !== -1;
    });
    list.sort(function (a, b) {
      if (state.sort === "ticker") return a.ticker.localeCompare(b.ticker);
      if (state.sort === "reasons") return (b.reasons || []).length - (a.reasons || []).length;
      return String(b.added).localeCompare(String(a.added));
    });

    $("empty").hidden = (d.watchlist || []).length > 0;
    $("cards").innerHTML = list.map(function (w) {
      var reasons = (w.reasons || []).map(function (r) {
        return "<li>" + esc(r.text) + '<br><a href="' + esc(safeUrl(r.url)) + '" target="_blank" rel="noopener">source</a> <span class="read">read ' + esc(r.read) + "</span></li>";
      }).join("");
      return '<article class="card ' + esc(w.lean) + '">' +
        '<div class="card-head">' + tickerLink(w.ticker, "ticker") + '<span class="lean">' + esc(w.lean) + "</span></div>" +
        '<div class="added">Added ' + esc(w.added) + " &middot; hypothesis, not a certainty</div>" +
        "<ul>" + reasons + "</ul>" +
        '<div class="flip"><b>What would change this view:</b> ' + esc(w.changes) + "</div></article>";
    }).join("");
  }

  /* ---------- MARKET / LEDGER ---------- */
  function renderMarket() {
    var d = data();
    var m = d.market || {};
    $("tiles").innerHTML = ["SPY", "QQQ", "VIX"].map(function (k) {
      var v = m[k];
      if (!v) return '<div class="tile"><div class="name">' + k + '</div><div class="val muted">&mdash;</div><div class="chg muted">baseline not set</div></div>';
      var down = String(v.change).charAt(0) === "-";
      return '<div class="tile"><div class="name">' + k + '</div><div class="val">' + esc(v.value) + '</div><div class="chg ' + (down ? "down" : "up") + '">' + esc(v.change) + "</div></div>";
    }).join("");
    var a = d.alerts || [];
    $("alerts").innerHTML = a.length
      ? a.map(function (x) {
          return '<div class="alert"><b>' + esc(x.time) + "</b> " + esc(x.text) + ' <a href="' + esc(safeUrl(x.source)) + '" target="_blank" rel="noopener">source</a></div>';
        }).join("")
      : '<p class="muted">All quiet. No alerts have been reported yet.</p>';
  }

  function renderLedger() {
    var rows = data().ledger || [];
    var closed = rows.filter(function (r) { return r.status === "closed"; }).length;
    var html = '<div class="panel"><h2>Paper ledger</h2>';
    if (!rows.length) {
      html += '<p class="muted">No paper trades logged yet. Strategy testing starts only when ULTRON says go.</p>';
    } else {
      html += "<p>" + rows.length + " trades logged, " + closed + " closed. ";
      html += closed >= 20 ? "Enough closed trades to compare strategies." : "Strategy results stay hidden until 20 trades are closed; the sample is too small to judge.";
      html += "</p>";
    }
    $("ledgerBox").innerHTML = html + "</div>";
  }

  /* ---------- WATCHLIST TAB ---------- */
  function renderWatch() {
    var d = data();
    var list = d.watchlist || [];
    var box = $("watchBox");
    if (!list.length) {
      box.innerHTML = '<div class="empty"><h2>No watched stocks yet</h2><p>When MARKET WATCH adds its first sourced names, they appear here. Click one to see its chart and news.</p><p class="muted">Use "Sample data" to see the layout.</p></div>';
      return;
    }
    if (!list.some(function (w) { return w.ticker === state.sel; })) state.sel = list[0].ticker;
    var w = list.filter(function (x) { return x.ticker === state.sel; })[0];

    var items = list.map(function (x) {
      return '<button class="wl-item ' + esc(x.lean) + (x.ticker === state.sel ? " active" : "") + '" data-t="' + esc(x.ticker) + '">' +
        '<span class="wl-t">' + esc(x.ticker) + '</span><span class="wl-l">' + esc(x.lean) + "</span></button>";
    }).join("");

    var sym = String(w.symbol || w.ticker);
    var enc = encodeURIComponent(w.ticker);
    var reasons = (w.reasons || []).map(function (r) {
      return "<li>" + esc(r.text) + ' <a href="' + esc(safeUrl(r.url)) + '" target="_blank" rel="noopener">source</a> <span class="read">read ' + esc(r.read) + "</span></li>";
    }).join("");
    var news = (w.news || []).map(function (n) {
      return '<li><a href="' + esc(safeUrl(n.url)) + '" target="_blank" rel="noopener">' + esc(n.title) + '</a> <span class="read">' + esc(n.date || "") + "</span></li>";
    }).join("");

    box.innerHTML =
      '<div class="wl">' +
      '<div class="wl-list">' + items + "</div>" +
      '<div class="wl-detail">' +
        '<div class="card-head"><span class="ticker">' + esc(w.ticker) + '</span><span class="lean ' + esc(w.lean) + '">' + esc(w.lean) + "</span></div>" +
        '<div class="added">Added ' + esc(w.added) + " &middot; hypothesis, not a certainty</div>" +
        '<h3 class="h3">Chart</h3><div id="chartBox" class="chartbox"></div>' +
        '<h3 class="h3">Why the agent is watching</h3><ul class="plain">' + reasons + "</ul>" +
        '<div class="flip"><b>What would change this view:</b> ' + esc(w.changes) + "</div>" +
        '<h3 class="h3">News the agent read</h3>' +
        (news ? '<ul class="plain">' + news + "</ul>" : '<p class="muted">No saved news items for this stock yet.</p>') +
        '<h3 class="h3">Live news feed</h3><div id="newsBox" class="newsbox"></div>' +
        '<p class="muted small">Open elsewhere: <a href="https://finance.yahoo.com/quote/' + enc + '" target="_blank" rel="noopener">Yahoo Finance</a> &middot; <a href="https://www.google.com/finance/quote/' + enc + '" target="_blank" rel="noopener">Google Finance</a></p>' +
      "</div></div>";

    var cb = $("chartBox"), nb = $("newsBox");
    if (useSample || !symOk(sym)) {
      var msg = '<p class="muted pad">' + (useSample ? "Sample tickers are not real, so no live chart or news is loaded." : "This symbol cannot be charted.") + "</p>";
      cb.innerHTML = msg; nb.innerHTML = msg;
      return;
    }
    cb.appendChild(widget(TV + "embed-widget-advanced-chart.js", {
      autosize: true, symbol: sym, interval: "D", timezone: "Etc/UTC", theme: "dark", style: "1",
      locale: "en", allow_symbol_change: false, hide_side_toolbar: true, support_host: "https://www.tradingview.com"
    }));
    nb.appendChild(widget(TV + "embed-widget-timeline.js", {
      feedMode: "symbol", symbol: sym, colorTheme: "dark", isTransparent: true, displayMode: "regular",
      width: "100%", height: "100%", locale: "en"
    }));
  }

  /* ---------- NAV / ROUTING ---------- */
  function activate(t) {
    if (TABS.indexOf(t) === -1) t = "home";
    if (isPublic && t === "ledger") t = "home";
    state.tab = t;
    Array.prototype.forEach.call(document.querySelectorAll("#tabs button"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === t);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (s) {
      s.classList.toggle("active", s.id === "tab-" + t);
    });
    if (t === "home") mountHome();
    if (t === "watch") renderWatch();
  }
  function route() {
    var h = (location.hash || "#home").slice(1);
    var m = h.match(/^stock\/([A-Za-z0-9.\-]{1,8})$/);
    if (m) {
      if (!state.tab) activate("stocks");
      var t = m[1].toUpperCase();
      if (state.drawer !== t) openDrawer(t);
      return;
    }
    if (state.drawer) hideDrawer();
    activate(h);
  }

  function renderAll() {
    var d = data();
    $("updated").textContent = d.updated ? "Updated: " + d.updated : "No data yet";
    $("sampleBanner").hidden = !useSample;
    $("sampleBtn").hidden = useSample;
    renderHome(); renderBoard(); renderMarket(); renderStocks();
    if (!isPublic) renderLedger();
    if (state.tab === "watch") renderWatch();
  }

  /* ---------- EVENTS ---------- */
  $("tabs").addEventListener("click", function (e) {
    var t = e.target.getAttribute("data-tab");
    if (t) location.hash = t;
  });
  document.addEventListener("click", function (e) {
    var g = e.target.closest ? e.target.closest("[data-go]") : null;
    if (g) location.hash = g.getAttribute("data-go");
  });
  $("filter").addEventListener("click", function (e) {
    var f = e.target.getAttribute("data-f");
    if (!f) return;
    state.filter = f;
    Array.prototype.forEach.call(document.querySelectorAll("#filter button"), function (b) { b.classList.toggle("active", b === e.target); });
    renderBoard();
  });
  $("watchBox").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-t]") : null;
    if (!b) return;
    state.sel = b.getAttribute("data-t");
    renderWatch();
  });
  $("search").addEventListener("input", function (e) { state.q = e.target.value; renderBoard(); });
  $("sort").addEventListener("change", function (e) { state.sort = e.target.value; renderBoard(); });

  $("sq").addEventListener("input", function (e) { state.sq = e.target.value; state.shown = PAGE; renderStocks(); });
  $("ssector").addEventListener("change", function (e) { state.sector = e.target.value; state.shown = PAGE; renderStocks(); });
  $("ssort").addEventListener("change", function (e) { state.ssort = e.target.value; state.shown = PAGE; renderStocks(); });
  $("sview").addEventListener("click", function (e) {
    var v = e.target.getAttribute("data-v");
    if (!v) return;
    state.sview = v; state.shown = PAGE;
    Array.prototype.forEach.call(document.querySelectorAll("#sview button"), function (b) { b.classList.toggle("active", b === e.target); });
    renderStocks();
  });
  $("smore").addEventListener("click", function () { state.shown += 100; renderStocks(); });
  $("sbody").addEventListener("click", function (e) {
    var star = e.target.closest ? e.target.closest("[data-star]") : null;
    if (star) {
      toggleStar(star.getAttribute("data-star"));
      renderStocks();
      return;
    }
    if (e.target.closest && e.target.closest("a")) return;
    var row = e.target.closest ? e.target.closest("tr[data-t]") : null;
    if (row && !useSample) location.hash = "stock/" + encodeURIComponent(row.getAttribute("data-t"));
  });

  $("dStar").addEventListener("click", function () {
    if (!state.drawer) return;
    toggleStar(state.drawer);
    updateDrawerStar();
    renderStocks();
  });
  $("drawer").addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-close]")) closeDrawer();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.drawer) closeDrawer();
  });
  window.addEventListener("hashchange", route);

  $("sampleBtn").addEventListener("click", function () { useSample = true; renderAll(); });
  $("sampleOff").addEventListener("click", function () { useSample = false; renderAll(); });

  /* ---------- START ---------- */
  if (isPublic) $("ledgerTab").hidden = true;
  initSectors();
  renderAll();
  route();
})();

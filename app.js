(function () {
  var real = window.STOCKWATCH;
  var sample = window.STOCKWATCH_SAMPLE;
  var useSample = false;
  var state = { filter: "all", sort: "added", q: "", sel: null };
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : "#"; }
  function data() { return useSample ? sample : real; }

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
        '<div class="card-head"><span class="ticker">' + esc(w.ticker) + '</span><span class="lean">' + esc(w.lean) + "</span></div>" +
        '<div class="added">Added ' + esc(w.added) + " &middot; hypothesis, not a certainty</div>" +
        "<ul>" + reasons + "</ul>" +
        '<div class="flip"><b>What would change this view:</b> ' + esc(w.changes) + "</div></article>";
    }).join("");
  }

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

  function renderWatch() {
    var d = data();
    var list = d.watchlist || [];
    var box = $("watchBox");
    if (!list.length) {
      box.innerHTML = '<div class="empty"><h2>No watched stocks yet</h2><p>When MARKET WATCH adds its first sourced names, they appear here. Click one to see its chart and news.</p><p class="muted">Use "Preview with sample data" to see the layout.</p></div>';
      return;
    }
    if (!list.some(function (w) { return w.ticker === state.sel; })) state.sel = list[0].ticker;
    var w = list.filter(function (x) { return x.ticker === state.sel; })[0];

    var items = list.map(function (x) {
      return '<button class="wl-item ' + esc(x.lean) + (x.ticker === state.sel ? " active" : "") + '" data-t="' + esc(x.ticker) + '">' +
        '<span class="wl-t">' + esc(x.ticker) + '</span><span class="wl-l">' + esc(x.lean) + "</span></button>";
    }).join("");

    var sym = String(w.symbol || w.ticker);
    var okSym = /^[A-Za-z0-9.:_\-]{1,20}$/.test(sym);
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
    if (useSample || !okSym) {
      var msg = '<p class="muted pad">' + (useSample ? "Sample tickers are not real, so no live chart or news is loaded." : "This symbol cannot be charted.") + "</p>";
      cb.innerHTML = msg; nb.innerHTML = msg;
      return;
    }
    cb.appendChild(widget("https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js", {
      autosize: true, symbol: sym, interval: "D", timezone: "Etc/UTC", theme: "dark", style: "1",
      locale: "en", allow_symbol_change: false, hide_side_toolbar: true, support_host: "https://www.tradingview.com"
    }));
    nb.appendChild(widget("https://s3.tradingview.com/external-embedding/embed-widget-timeline.js", {
      feedMode: "symbol", symbol: sym, colorTheme: "dark", isTransparent: true, displayMode: "regular",
      width: "100%", height: "100%", locale: "en"
    }));
  }

  function renderAll() {
    var d = data();
    $("updated").textContent = d.updated ? "Updated: " + d.updated : "No data yet";
    $("sampleBanner").hidden = !useSample;
    $("sampleBtn").hidden = useSample;
    renderBoard(); renderWatch(); renderMarket(); renderLedger();
  }

  $("tabs").addEventListener("click", function (e) {
    var t = e.target.getAttribute("data-tab");
    if (!t) return;
    Array.prototype.forEach.call(document.querySelectorAll(".tabs button"), function (b) { b.classList.toggle("active", b === e.target); });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (s) { s.classList.toggle("active", s.id === "tab-" + t); });
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
  $("sampleBtn").addEventListener("click", function () { useSample = true; renderAll(); });
  $("sampleOff").addEventListener("click", function () { useSample = false; renderAll(); });

  renderAll();
})();

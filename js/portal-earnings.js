// ── EARNINGS & REVENUE CALCULATOR ──────────────────────────
// Extracted from portal.js — calculator projections, earnings periods, payouts

var _portalTier = 'direct';
var _portalTierConfig = {
  direct:     { rate: 8,  refMax: 20,  refDefault: 5,  name: 'Direct',     next: 'Enterprise', nextRate: 13 },
  enterprise: { rate: 13, refMax: 50,  refDefault: 15, name: 'Enterprise', next: 'Strategic',  nextRate: 18 },
  strategic:  { rate: 18, refMax: 100, refDefault: 30, name: 'Strategic',  next: null,         nextRate: null }
};

function setCalcTier(btn, tier) {
  document.querySelectorAll('.calc-tier-pill').forEach(function(p) { p.classList.remove('calc-tier-pill-active'); });
  btn.classList.add('calc-tier-pill-active');
  _portalTier = tier;

  var cfg = _portalTierConfig[tier];
  var sl = document.getElementById('calc-ref');
  if (sl) {
    sl.min = 1;
    sl.max = cfg.refMax;
    sl.value = cfg.refDefault;
  }
  var lblMin = document.getElementById('calc-ref-min');
  var lblMid = document.getElementById('calc-ref-mid');
  var lblMax = document.getElementById('calc-ref-max');
  if (lblMin) lblMin.textContent = '1';
  if (lblMid) lblMid.textContent = Math.round(cfg.refMax / 2);
  if (lblMax) lblMax.textContent = cfg.refMax;

  // Lock commission rate slider to tier rate
  var rateSl = document.getElementById('calc-rate');
  if (rateSl) rateSl.value = cfg.rate;

  calcProjection();
}

function calcProjection() {
  var cfg = _portalTierConfig[_portalTier];
  var refs = parseInt(document.getElementById('calc-ref').value) || 5;
  var debt = parseInt(document.getElementById('calc-debt').value) || 25000;
  var rate = cfg.rate;

  document.getElementById('calc-ref-val').textContent = refs;
  document.getElementById('calc-debt-val').textContent = '$' + debt.toLocaleString();
  document.getElementById('calc-rate-val').textContent = rate + '%';

  // Sync rate slider to tier
  var rateSl = document.getElementById('calc-rate');
  if (rateSl && parseInt(rateSl.value) !== rate) rateSl.value = rate;

  var monthly = refs * debt * (rate / 100);
  var annual = monthly * 12;
  var threeYr = annual * 3;

  animateCalcValue('calc-monthly', monthly);
  animateCalcValue('calc-annual', annual);
  animateCalcValue('calc-3yr', threeYr);

  // Tier comparison
  var currentAnnual = annual;
  var curName = document.getElementById('calc-tier-current-name');
  var curPct = document.getElementById('calc-tier-current-pct');
  if (curName) curName.textContent = cfg.name;
  if (curPct) curPct.textContent = rate + '% commission';
  document.getElementById('calc-tier-current').textContent = '$' + Math.round(currentAnnual).toLocaleString() + '/yr';

  var nextName = document.getElementById('calc-tier-next-name');
  var nextPct = document.getElementById('calc-tier-next-pct');
  var diffEl = document.getElementById('calc-tier-diff');

  if (cfg.next) {
    var nextAnnual = refs * debt * (cfg.nextRate / 100) * 12;
    if (nextName) nextName.textContent = cfg.next;
    if (nextPct) nextPct.textContent = cfg.nextRate + '% commission';
    document.getElementById('calc-tier-next').textContent = '$' + Math.round(nextAnnual).toLocaleString() + '/yr';
    document.getElementById('calc-tier-bonus').textContent = '$' + Math.round(nextAnnual - currentAnnual).toLocaleString();
    if (diffEl) diffEl.innerHTML = 'Upgrading to ' + cfg.next + ' means <strong id="calc-tier-bonus">$' + Math.round(nextAnnual - currentAnnual).toLocaleString() + '</strong> more per year';
  } else {
    if (nextName) nextName.textContent = '--';
    if (nextPct) nextPct.textContent = 'Max tier';
    document.getElementById('calc-tier-next').textContent = '--';
    if (diffEl) diffEl.innerHTML = 'You are at the <strong>highest tier</strong> -- maximum revenue share';
  }

  // Growth bars
  var maxRef = cfg.refMax;
  var volumes = [Math.round(maxRef * 0.15), Math.round(maxRef * 0.35), Math.round(maxRef * 0.6), maxRef];
  var maxVal = maxRef * debt * (rate / 100) * 12;
  volumes.forEach(function(vol, i) {
    var val = vol * debt * (rate / 100) * 12;
    var pct = Math.max(4, (val / maxVal) * 100);
    var ids = ['calc-grow-3', 'calc-grow-5', 'calc-grow-10', 'calc-grow-20'];
    var bar = document.getElementById(ids[i]);
    var label = document.getElementById(ids[i] + '-val');
    var rowLabel = bar ? bar.closest('.calc-grow-row') : null;
    if (rowLabel) {
      var lbl = rowLabel.querySelector('.calc-grow-label');
      if (lbl) lbl.textContent = vol + '/mo';
    }
    if (bar) bar.style.width = pct + '%';
    if (label) {
      if (val >= 1000000) label.textContent = '$' + (val / 1000000).toFixed(1) + 'M';
      else if (val >= 1000) label.textContent = '$' + Math.round(val / 1000) + 'k';
      else label.textContent = '$' + Math.round(val);
    }
  });

  // Breakeven indicator
  var perRef = debt * (rate / 100);
  var breakeven = perRef > 0 ? Math.ceil(75000 / 12 / perRef) : 0;
  var beVal = document.getElementById('calc-breakeven-val');
  if (beVal) beVal.textContent = breakeven;
}

// Animate calculator projection numbers
function animateCalcValue(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 0;
  if (Math.round(current) === Math.round(target)) {
    el.textContent = '$' + Math.round(target).toLocaleString();
    return;
  }
  var start = performance.now();
  var duration = 400;
  function tick(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var val = current + (target - current) * eased;
    el.textContent = '$' + Math.round(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Earnings: Period Data Sets ---
var EARN_DATA = {
  month: {
    kpis: { total: '$2,490', avg: '$498', best: '$1,280', bestLabel: 'Feb 12', pending: '$2,736', pendingSub: '1 referral' },
    trend: { total: '+8.2%', totalDir: 'up', avg: '+2.4%', avgDir: 'up' },
    chart: { title: 'Weekly Earnings (Feb 2026)', yLabels: ['$1.5k','$1.2k','$900','$600','$300','$0'], bars: [
      { h: '52%', val: '$780', label: 'Wk 1' },
      { h: '85%', val: '$1,280', label: 'Wk 2', best: true },
      { h: '29%', val: '$430', label: 'Wk 3', current: true },
      { h: '0%', val: '--', label: 'Wk 4' }
    ]},
    rows: [
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' }
    ]
  },
  quarter: {
    kpis: { total: '$9,402', avg: '$470', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+18.6%', totalDir: 'up', avg: '+5.3%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (Q1 2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true },
      { h: '54%', val: '$2,688', label: 'Mar' }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' }
    ]
  },
  year: {
    kpis: { total: '$24,850', avg: '$438', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+34.2%', totalDir: 'up', avg: '+12.1%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' }
    ]
  },
  all: {
    kpis: { total: '$67,310', avg: '$415', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+142%', totalDir: 'up', avg: '+28.5%', avgDir: 'up' },
    chart: { title: 'Quarterly Earnings (All Time)', yLabels: ['$20k','$16k','$12k','$8k','$4k','$0'], bars: [
      { h: '18%', val: '$3,600', label: 'Q2 \'25' },
      { h: '34%', val: '$6,840', label: 'Q3 \'25' },
      { h: '47%', val: '$9,408', label: 'Q4 \'25' },
      { h: '47%', val: '$9,402', label: 'Q1 \'26', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' },
      { initials: 'SB', color: '#6366f1', name: 'Sarah Brooks', type: 'Installment Agreement', debt: '$41,200', comm: '$3,296', commColor: 'var(--cyan-text)', date: 'Dec 8, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'TN', color: 'var(--cyan-text)', name: 'Tom Nguyen', type: 'Offer in Compromise', debt: '$29,800', comm: '$2,384', commColor: 'var(--cyan-text)', date: 'Nov 15, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'LM', color: 'var(--sky)', name: 'Lisa Martinez', type: 'Penalty Abatement', debt: '$15,600', comm: '$1,248', commColor: 'var(--cyan-text)', date: 'Oct 22, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' }
    ]
  }
};

function setEarnPeriod(btn, period) {
  document.querySelectorAll('.earn-period').forEach(function(p) { p.classList.remove('earn-period-active'); });
  btn.classList.add('earn-period-active');

  var data = EARN_DATA[period];
  if (!data) return;

  // Update KPIs
  var kpis = document.querySelectorAll('#portal-sec-earnings .earn-kpi');
  if (kpis[0]) {
    kpis[0].querySelector('.earn-kpi-val').textContent = data.kpis.total;
    var t0 = kpis[0].querySelector('.earn-kpi-trend');
    if (t0) { t0.textContent = data.trend.total; t0.className = 'earn-kpi-trend earn-kpi-' + data.trend.totalDir; }
  }
  if (kpis[1]) {
    kpis[1].querySelector('.earn-kpi-val').textContent = data.kpis.avg;
    var t1 = kpis[1].querySelector('.earn-kpi-trend');
    if (t1) { t1.textContent = data.trend.avg; t1.className = 'earn-kpi-trend earn-kpi-' + data.trend.avgDir; }
  }
  if (kpis[2]) {
    kpis[2].querySelector('.earn-kpi-val').textContent = data.kpis.best;
    var sub2 = kpis[2].querySelector('.earn-kpi-subtext');
    if (sub2) sub2.textContent = data.kpis.bestLabel;
  }
  if (kpis[3]) {
    kpis[3].querySelector('.earn-kpi-val').textContent = data.kpis.pending;
    var sub3 = kpis[3].querySelector('.earn-kpi-subtext');
    if (sub3) sub3.textContent = data.kpis.pendingSub;
  }

  // Update chart
  var chartTitle = document.querySelector('#portal-sec-earnings .earn-chart-title');
  if (chartTitle) chartTitle.textContent = data.chart.title;

  var yAxis = document.querySelector('#portal-sec-earnings .earn-chart-y');
  if (yAxis) {
    yAxis.innerHTML = data.chart.yLabels.map(function(l) { return '<span>' + l + '</span>'; }).join('');
  }

  var barsWrap = document.querySelector('#portal-sec-earnings .earn-chart-bars');
  if (barsWrap) {
    barsWrap.innerHTML = data.chart.bars.map(function(b) {
      var barClass = 'earn-bar';
      if (b.best) barClass += ' earn-bar-best';
      if (b.current) barClass += ' earn-bar-current';
      return '<div class="earn-bar-col">' +
        '<div class="' + barClass + '" style="height:' + b.h + '"><span class="earn-bar-val">' + b.val + '</span></div>' +
        '<div class="earn-bar-label">' + b.label + '</div></div>';
    }).join('');
  }

  // Update table
  var tableWrap = document.querySelector('#portal-sec-earnings .earn-table-wrap');
  if (tableWrap) {
    var headHtml = '<div class="earn-table-title">Earnings by Referral</div>' +
      '<div class="earn-table-head"><div>Client</div><div>Resolution Type</div><div>Tax Debt</div><div>Commission</div><div>Date</div><div>Status</div></div>';

    var rowsHtml = data.rows.map(function(r) {
      var commStyle = r.commColor ? 'font-weight:700;color:' + r.commColor : 'font-weight:700';
      return '<div class="earn-table-row">' +
        '<div class="earn-td-client"><div class="earn-avatar" style="background:' + r.color + '">' + r.initials + '</div><span>' + r.name + '</span></div>' +
        '<div>' + r.type + '</div>' +
        '<div style="font-weight:600">' + r.debt + '</div>' +
        '<div style="' + commStyle + '">' + r.comm + '</div>' +
        '<div>' + r.date + '</div>' +
        '<div><span class="earn-badge ' + r.badgeClass + '">' + r.badge + '</span></div></div>';
    }).join('');

    tableWrap.innerHTML = headHtml + rowsHtml;
  }
}

// --- Earnings: Export CSV ---
function exportEarningsCSV() {
  var rows = [['Client', 'Resolution Type', 'Tax Debt', 'Commission', 'Date', 'Status']];
  document.querySelectorAll('.earn-table-row').forEach(function(row) {
    var cells = [];
    row.querySelectorAll(':scope > div').forEach(function(cell) {
      cells.push(cell.textContent.trim());
    });
    rows.push(cells);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'earnings_export.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Earnings exported to CSV', 'success');
}

// --- Earnings: Bar chart animation on reveal ---
var earningsAnimated = false;
function initEarningsAnimation() {
  if (earningsAnimated) return;
  earningsAnimated = true;
  var bars = document.querySelectorAll('.earn-bar');
  bars.forEach(function(bar) {
    var targetH = bar.style.height;
    bar.classList.add('earn-bar-init');
    setTimeout(function() {
      bar.classList.remove('earn-bar-init');
      bar.style.height = targetH;
    }, 50);
  });
}

// --- Payouts: Live countdown ---
function initPayCountdown() {
  var el = document.getElementById('pay-countdown');
  if (!el) return;
  // Count down to March 1, 2026
  var target = new Date('2026-03-01T00:00:00');
  function update() {
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) { el.textContent = 'Today!'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm remaining';
  }
  update();
  setInterval(update, 60000);
}

// --- Payouts: Year filter ---
function payYearFilter(btn, year) {
  document.querySelectorAll('.pay-year-pill').forEach(function(p) { p.classList.remove('pay-year-active'); });
  btn.classList.add('pay-year-active');
  var total = 0;
  document.querySelectorAll('.pay-ledger-row').forEach(function(row) {
    if (!row.getAttribute('data-year')) return;
    if (year === 'all' || row.getAttribute('data-year') === year) {
      row.style.display = '';
      total += parseFloat(row.getAttribute('data-amount') || 0);
    } else {
      row.style.display = 'none';
    }
  });
  var totalEl = document.getElementById('pay-running-total');
  if (totalEl) totalEl.textContent = 'Total Paid to Date: $' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

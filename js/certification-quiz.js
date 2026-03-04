// ══════════════════════════════════════════
//  M3P3C2: PARTNER CERTIFICATION QUIZ
//  Knowledge assessment + certification system
// ══════════════════════════════════════════

var CERT_STORAGE_KEY = 'ctax_cert_results';
var CERT_BADGE_KEY = 'ctax_cert_badges';

// ── QUIZ QUESTION BANK ──────────────────────────────
var CERT_QUESTIONS = [
  // Category: Program Basics
  { category: 'Program Basics', q: 'What is the minimum qualifying tax debt for a Community Tax referral?', options: ['$3,000', '$5,000', '$7,000', '$10,000'], answer: 2 },
  { category: 'Program Basics', q: 'What is the investigation fee for individual clients?', options: ['$195', '$295', '$395', '$495'], answer: 1 },
  { category: 'Program Basics', q: 'What is the typical referral-to-consultation conversion rate?', options: ['~50%', '~65%', '~80%', '~90%'], answer: 2 },
  { category: 'Program Basics', q: 'How is partner revenue share paid?', options: ['Weekly via PayPal', 'Monthly NET-30 via ACH or check', 'Quarterly via wire transfer', 'Bi-monthly via direct deposit'], answer: 1 },
  { category: 'Program Basics', q: 'What is the revenue share percentage for the Direct tier?', options: ['5%', '8%', '10%', '13%'], answer: 1 },

  // Category: Resolution Programs
  { category: 'Resolution Programs', q: 'Which IRS program allows a taxpayer to settle their debt for less than what they owe?', options: ['Installment Agreement', 'Offer in Compromise', 'Currently Not Collectible', 'Penalty Abatement'], answer: 1 },
  { category: 'Resolution Programs', q: 'What does CNC status mean for a taxpayer?', options: ['Client Not Compliant', 'Currently Not Collectible', 'Case Not Closed', 'Credit Not Confirmed'], answer: 1 },
  { category: 'Resolution Programs', q: 'What is the typical referral-to-close timeline?', options: ['7-14 days', '15-30 days', '30-90 days', '6-12 months'], answer: 2 },
  { category: 'Resolution Programs', q: 'Which IRS notice indicates "Intent to Levy"?', options: ['CP14', 'CP501', 'Letter 1058', 'Letter 3172'], answer: 2 },
  { category: 'Resolution Programs', q: 'What is the investigation fee for business tax cases?', options: ['$295', '$395', '$500', '$750'], answer: 2 },

  // Category: Client Qualification
  { category: 'Client Qualification', q: 'Which is a red flag that a client may need tax resolution help?', options: ['They filed on time last year', 'Refund offset by IRS', 'They owe state taxes only', 'They use TurboTax'], answer: 1 },
  { category: 'Client Qualification', q: 'A client has a CP504 notice. What does this mean?', options: ['Balance due reminder', 'Intent to levy', 'Federal tax lien filed', 'Audit notification'], answer: 1 },
  { category: 'Client Qualification', q: 'What type of client is NOT a good referral candidate?', options: ['Self-employed with $40k debt', 'W-2 employee with $15k debt and wage garnishment', 'Someone who owes $4,000 from one year', 'Business owner with unfiled returns and $60k debt'], answer: 2 },
  { category: 'Client Qualification', q: 'How many states is Community Tax licensed in?', options: ['All 50', '48', '45', '42'], answer: 1 },
  { category: 'Client Qualification', q: 'What languages does Community Tax support?', options: ['English only', 'English and Spanish', 'English, Spanish, and Mandarin', 'All major languages'], answer: 1 },

  // Category: Partner Operations
  { category: 'Partner Operations', q: 'How quickly does Community Tax contact a referred client?', options: ['Same day', 'Within 24 hours', 'Within 48 hours', 'Within one week'], answer: 1 },
  { category: 'Partner Operations', q: 'What is the minimum referrals/quarter needed for Enterprise tier?', options: ['5', '10', '15', '25'], answer: 1 },
  { category: 'Partner Operations', q: 'Which compliance rule is required for all partners?', options: ['Guarantee specific tax savings', 'Always disclose referral relationship', 'Provide tax advice directly', 'Set specific resolution timelines'], answer: 1 },
  { category: 'Partner Operations', q: 'What is the average partner revenue per closed case?', options: ['$500-$1,000', '$1,000-$1,500', '$1,500-$4,000', '$5,000-$10,000'], answer: 2 },
  { category: 'Partner Operations', q: 'How should you respond to a client who says "I can\'t afford it"?', options: ['Tell them to handle it themselves', 'Explain investigation is $295, resolution can be monthly, penalties compound daily', 'Offer to pay for them', 'Tell them to wait until they have more money'], answer: 1 }
];

// ── STATE ──────────────────────────────────────
var _certStep = 0;
var _certAnswers = [];
var _certStartTime = 0;
var _certQuizSet = [];

function certGetResults() {
  try { return JSON.parse(localStorage.getItem(CERT_STORAGE_KEY) || '[]'); } catch (e) { return []; }
}

function certSetResults(data) {
  try { localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function certGetBadges() {
  try { return JSON.parse(localStorage.getItem(CERT_BADGE_KEY) || '[]'); } catch (e) { return []; }
}

function certSetBadges(data) {
  try { localStorage.setItem(CERT_BADGE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── QUIZ LAUNCHER ──────────────────────────────────────
function certShowQuiz() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'cert-quiz-modal';

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '640px';

  // Pick 10 random questions
  _certQuizSet = shuffleArray(CERT_QUESTIONS.slice()).slice(0, 10);
  _certStep = 0;
  _certAnswers = [];
  _certStartTime = Date.now();

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Partner Certification Quiz</div>'
    + '<div class="aid-modal-meta">10 questions &middot; Test your knowledge</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'cert-quiz-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body" id="cert-quiz-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  certRenderQuestion();
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
  }
  return arr;
}

function certRenderQuestion() {
  var body = document.getElementById('cert-quiz-body');
  if (!body) return;

  if (_certStep >= _certQuizSet.length) {
    certShowResults();
    return;
  }

  var q = _certQuizSet[_certStep];
  var progress = Math.round(((_certStep) / _certQuizSet.length) * 100);

  var html = '<div class="cert-progress">'
    + '<div class="cert-progress-bar"><div class="cert-progress-fill" style="width:' + progress + '%"></div></div>'
    + '<div class="cert-progress-label">Question ' + (_certStep + 1) + ' of ' + _certQuizSet.length + '</div>'
    + '</div>';

  html += '<div class="cert-category">' + q.category + '</div>';
  html += '<div class="cert-question">' + q.q + '</div>';
  html += '<div class="cert-options">';

  q.options.forEach(function(opt, i) {
    html += '<button class="cert-option" onclick="certSelectAnswer(' + i + ')">'
      + '<span class="cert-option-letter">' + 'ABCD'[i] + '</span>'
      + '<span class="cert-option-text">' + opt + '</span>'
      + '</button>';
  });

  html += '</div>';
  body.innerHTML = html;
}

function certSelectAnswer(idx) {
  var q = _certQuizSet[_certStep];
  var isCorrect = idx === q.answer;
  _certAnswers.push({ question: q.q, selected: idx, correct: q.answer, isCorrect: isCorrect, category: q.category });

  // Visual feedback
  var options = document.querySelectorAll('.cert-option');
  options.forEach(function(opt, i) {
    opt.disabled = true;
    opt.style.pointerEvents = 'none';
    if (i === q.answer) opt.classList.add('cert-option-correct');
    if (i === idx && !isCorrect) opt.classList.add('cert-option-wrong');
  });

  // Auto-advance after brief delay
  setTimeout(function() {
    _certStep++;
    certRenderQuestion();
  }, 800);
}

function certShowResults() {
  var body = document.getElementById('cert-quiz-body');
  if (!body) return;

  var correct = _certAnswers.filter(function(a) { return a.isCorrect; }).length;
  var total = _certAnswers.length;
  var pct = Math.round((correct / total) * 100);
  var elapsed = Math.round((Date.now() - _certStartTime) / 1000);
  var mins = Math.floor(elapsed / 60);
  var secs = elapsed % 60;
  var timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;

  var passed = pct >= 70;
  var tier = pct >= 90 ? 'Gold' : pct >= 80 ? 'Silver' : pct >= 70 ? 'Bronze' : 'Not Certified';
  var tierColor = pct >= 90 ? '#F59E0B' : pct >= 80 ? '#94A3B8' : pct >= 70 ? '#CD7F32' : '#EF4444';

  // Save result
  var results = certGetResults();
  var result = {
    score: pct,
    correct: correct,
    total: total,
    tier: tier,
    time: timeStr,
    date: new Date().toISOString(),
    details: _certAnswers
  };
  results.unshift(result);
  if (results.length > 10) results = results.slice(0, 10);
  certSetResults(results);

  // Award badge if passed
  if (passed) {
    var badges = certGetBadges();
    var existingIdx = -1;
    badges.forEach(function(b, i) { if (b.tier === tier) existingIdx = i; });
    if (existingIdx === -1) {
      badges.push({ tier: tier, score: pct, date: new Date().toISOString() });
      certSetBadges(badges);
    } else if (badges[existingIdx].score < pct) {
      badges[existingIdx].score = pct;
      badges[existingIdx].date = new Date().toISOString();
      certSetBadges(badges);
    }

    // Mark onboarding step complete
    if (typeof onboardMarkComplete === 'function') onboardMarkComplete('tax_basics');
  }

  // Category breakdown
  var catScores = {};
  _certAnswers.forEach(function(a) {
    if (!catScores[a.category]) catScores[a.category] = { correct: 0, total: 0 };
    catScores[a.category].total++;
    if (a.isCorrect) catScores[a.category].correct++;
  });

  var html = '<div class="cert-result-header">'
    + '<div class="cert-result-score" style="color:' + tierColor + '">' + pct + '%</div>'
    + '<div class="cert-result-tier" style="color:' + tierColor + '">' + tier + '</div>'
    + '<div class="cert-result-detail">' + correct + ' of ' + total + ' correct &middot; ' + timeStr + '</div>'
    + '</div>';

  if (passed) {
    html += '<div class="cert-badge-display">'
      + '<div class="cert-badge-icon" style="border-color:' + tierColor + ';color:' + tierColor + '">'
      + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.91-.57L12 6l2.09 3.54L18 10.11l-3.17 3L15.5 17z"/></svg>'
      + '</div>'
      + '<div class="cert-badge-text">' + tier + ' Certified Partner</div>'
      + '</div>';
  } else {
    html += '<div class="cert-fail-msg">You need 70% or higher to earn certification. Review the material and try again!</div>';
  }

  // Category breakdown
  html += '<div class="cert-cats-title">Score by Category</div>';
  Object.keys(catScores).forEach(function(cat) {
    var cs = catScores[cat];
    var catPct = Math.round((cs.correct / cs.total) * 100);
    var catColor = catPct >= 80 ? '#059669' : catPct >= 60 ? '#F59E0B' : '#EF4444';
    html += '<div class="cert-cat-row">'
      + '<div class="cert-cat-label">' + cat + '</div>'
      + '<div class="cert-cat-bar-wrap"><div class="cert-cat-bar" style="width:' + catPct + '%;background:' + catColor + '"></div></div>'
      + '<div class="cert-cat-val" style="color:' + catColor + '">' + cs.correct + '/' + cs.total + '</div>'
      + '</div>';
  });

  // Wrong answers review
  var wrong = _certAnswers.filter(function(a) { return !a.isCorrect; });
  if (wrong.length > 0) {
    html += '<div class="cert-review-title">Review Incorrect Answers</div>';
    wrong.forEach(function(a) {
      var q = _certQuizSet.find(function(qq) { return qq.q === a.question; });
      if (!q) return;
      html += '<div class="cert-review-item">'
        + '<div class="cert-review-q">' + a.question + '</div>'
        + '<div class="cert-review-wrong">Your answer: ' + q.options[a.selected] + '</div>'
        + '<div class="cert-review-correct">Correct: ' + q.options[a.correct] + '</div>'
        + '</div>';
    });
  }

  html += '<div class="cert-result-actions">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'cert-quiz-modal\').remove()">Close</button>'
    + '<button class="btn btn-g" onclick="certShowHistory2()">View History</button>'
    + '<button class="btn btn-p" onclick="certShowQuiz2()">Retake Quiz</button>'
    + '</div>';

  body.innerHTML = html;
}

function certShowQuiz2() {
  var m = document.getElementById('cert-quiz-modal');
  if (m) m.remove();
  certShowQuiz();
}

function certShowHistory2() {
  var m = document.getElementById('cert-quiz-modal');
  if (m) m.remove();
  certShowCertHistory();
}

// ── CERTIFICATION HISTORY ──────────────────────────────
function certShowCertHistory() {
  var results = certGetResults();
  var badges = certGetBadges();

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'cert-hist-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '600px';

  var badgeHtml = '';
  if (badges.length > 0) {
    badgeHtml = '<div class="cert-badges-row">';
    badges.forEach(function(b) {
      var color = b.tier === 'Gold' ? '#F59E0B' : b.tier === 'Silver' ? '#94A3B8' : '#CD7F32';
      badgeHtml += '<div class="cert-badge-card" style="border-color:' + color + '">'
        + '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.5"><path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.91-.57L12 6l2.09 3.54L18 10.11l-3.17 3L15.5 17z"/></svg>'
        + '<div class="cert-badge-tier" style="color:' + color + '">' + b.tier + '</div>'
        + '<div class="cert-badge-score">' + b.score + '%</div>'
        + '</div>';
    });
    badgeHtml += '</div>';
  }

  var histHtml = '';
  if (!results.length) {
    histHtml = '<div class="aid-empty-sm">No quiz attempts yet.</div>';
  } else {
    results.slice(0, 5).forEach(function(r) {
      var date = new Date(r.date).toLocaleDateString();
      var tierColor = r.tier === 'Gold' ? '#F59E0B' : r.tier === 'Silver' ? '#94A3B8' : r.tier === 'Bronze' ? '#CD7F32' : '#EF4444';
      histHtml += '<div class="cert-hist-row">'
        + '<div class="cert-hist-score" style="color:' + tierColor + '">' + r.score + '%</div>'
        + '<div class="cert-hist-info">'
        + '<div class="cert-hist-tier" style="color:' + tierColor + '">' + r.tier + '</div>'
        + '<div class="cert-hist-meta">' + r.correct + '/' + r.total + ' correct &middot; ' + r.time + ' &middot; ' + date + '</div>'
        + '</div>'
        + '</div>';
    });
  }

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div class="aid-modal-title">Certification History</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'cert-hist-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body">'
    + badgeHtml
    + '<div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--slate);margin:20px 0 12px">Quiz Attempts</div>'
    + histHtml
    + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'cert-hist-modal\').remove()">Close</button>'
    + '<button class="btn btn-p" onclick="document.getElementById(\'cert-hist-modal\').remove();certShowQuiz()">Take Quiz</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ── RENDER CERTIFICATION BADGE IN PORTAL ──────────────
function certRenderBadgeWidget(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var badges = certGetBadges();
  var bestBadge = null;
  badges.forEach(function(b) {
    if (!bestBadge || b.score > bestBadge.score) bestBadge = b;
  });

  if (!bestBadge) {
    el.innerHTML = '<div class="cert-widget">'
      + '<div class="cert-widget-empty">'
      + '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--mist)" stroke-width="1.5"><path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.91-.57L12 6l2.09 3.54L18 10.11l-3.17 3L15.5 17z"/></svg>'
      + '<div>Not yet certified</div>'
      + '</div>'
      + '<button class="btn btn-s" onclick="certShowQuiz()">Take Quiz</button>'
      + '</div>';
    return;
  }

  var color = bestBadge.tier === 'Gold' ? '#F59E0B' : bestBadge.tier === 'Silver' ? '#94A3B8' : '#CD7F32';
  el.innerHTML = '<div class="cert-widget cert-widget-earned">'
    + '<div class="cert-widget-badge" style="border-color:' + color + '">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.5"><path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.91-.57L12 6l2.09 3.54L18 10.11l-3.17 3L15.5 17z"/></svg>'
    + '</div>'
    + '<div>'
    + '<div class="cert-widget-tier" style="color:' + color + '">' + bestBadge.tier + ' Certified</div>'
    + '<div class="cert-widget-score">' + bestBadge.score + '% score</div>'
    + '</div>'
    + '<button class="btn btn-s" onclick="certShowCertHistory()">History</button>'
    + '</div>';
}

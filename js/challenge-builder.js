// ══════════════════════════════════════════
//  M4P3C2: CUSTOM CHALLENGE BUILDER
//  Personalized challenge tracks from task library
// ══════════════════════════════════════════

var CHB_CUSTOM_KEY = 'ch_custom_tracks_v1';
var CHB_ACTIVE_KEY = 'ch_active_custom_v1';

// ── TASK LIBRARY ──────────────────────────────
// Partners pick from these to build custom 30-day plans

var CHB_TASK_LIBRARY = [
  // Setup & Foundation
  { id: 't01', title: 'Set your 90-day revenue goal', category: 'Setup', pts: 100, difficulty: 'easy', tool: 'portal-sec-planner', est: '15 min' },
  { id: 't02', title: 'Upload brand assets and logo', category: 'Setup', pts: 100, difficulty: 'easy', tool: 'portal-sec-settings', est: '10 min' },
  { id: 't03', title: 'Configure notification preferences', category: 'Setup', pts: 80, difficulty: 'easy', tool: 'portal-sec-settings', est: '5 min' },
  { id: 't04', title: 'Build your ideal client profile', category: 'Setup', pts: 120, difficulty: 'easy', tool: 'portal-sec-icp', est: '20 min' },
  { id: 't05', title: 'Set up payment method', category: 'Setup', pts: 80, difficulty: 'easy', tool: 'portal-sec-settings', est: '5 min' },

  // Learning
  { id: 't06', title: 'Complete Tax Resolution Basics', category: 'Learning', pts: 120, difficulty: 'easy', tool: 'portal-sec-training', est: '15 min' },
  { id: 't07', title: 'Watch a CE webinar', category: 'Learning', pts: 130, difficulty: 'easy', tool: 'portal-sec-ce', est: '30 min' },
  { id: 't08', title: 'Study the Referral Playbook', category: 'Learning', pts: 120, difficulty: 'easy', tool: 'portal-sec-playbook', est: '20 min' },
  { id: 't09', title: 'Complete advanced training module', category: 'Learning', pts: 150, difficulty: 'medium', tool: 'portal-sec-training', est: '25 min' },
  { id: 't10', title: 'Pass the certification quiz', category: 'Learning', pts: 200, difficulty: 'medium', tool: null, est: '15 min' },

  // Content Creation
  { id: 't11', title: 'Build a referral intro script', category: 'Content', pts: 150, difficulty: 'medium', tool: 'portal-sec-ai-scripts', est: '10 min' },
  { id: 't12', title: 'Create a social media ad', category: 'Content', pts: 150, difficulty: 'medium', tool: 'portal-sec-ai-admaker', est: '10 min' },
  { id: 't13', title: 'Write a follow-up email template', category: 'Content', pts: 150, difficulty: 'medium', tool: 'portal-sec-ai-scripts', est: '10 min' },
  { id: 't14', title: 'Build 3-email drip sequence', category: 'Content', pts: 200, difficulty: 'hard', tool: 'portal-sec-ai-scripts', est: '20 min' },
  { id: 't15', title: 'Create a landing page', category: 'Content', pts: 250, difficulty: 'hard', tool: 'portal-sec-pb', est: '30 min' },
  { id: 't16', title: 'Generate client-facing presentation', category: 'Content', pts: 200, difficulty: 'hard', tool: 'portal-sec-ai-admaker', est: '15 min' },
  { id: 't17', title: 'Create objection handling scripts', category: 'Content', pts: 170, difficulty: 'medium', tool: 'portal-sec-ai-scripts', est: '15 min' },

  // Outreach
  { id: 't18', title: 'Identify 3 potential referral clients', category: 'Outreach', pts: 130, difficulty: 'medium', tool: null, est: '15 min' },
  { id: 't19', title: 'Send first outreach email', category: 'Outreach', pts: 150, difficulty: 'medium', tool: 'portal-sec-marketing', est: '10 min' },
  { id: 't20', title: 'Follow up with a pending client', category: 'Outreach', pts: 150, difficulty: 'medium', tool: 'portal-sec-referrals', est: '10 min' },
  { id: 't21', title: 'Share marketing asset on social', category: 'Outreach', pts: 130, difficulty: 'easy', tool: 'portal-sec-marketing', est: '10 min' },
  { id: 't22', title: 'Reach out to 3 new prospects', category: 'Outreach', pts: 200, difficulty: 'hard', tool: null, est: '30 min' },
  { id: 't23', title: 'Practice cold-to-warm pivot', category: 'Outreach', pts: 130, difficulty: 'medium', tool: 'portal-sec-playbook', est: '15 min' },

  // Referrals
  { id: 't24', title: 'Submit a referral', category: 'Referrals', pts: 250, difficulty: 'hard', tool: 'portal-sec-submit', est: '5 min' },
  { id: 't25', title: 'Qualify a client with AI tool', category: 'Referrals', pts: 150, difficulty: 'medium', tool: 'portal-sec-ai-qualifier', est: '10 min' },
  { id: 't26', title: 'Review referral pipeline', category: 'Referrals', pts: 130, difficulty: 'easy', tool: 'portal-sec-dashboard', est: '10 min' },

  // Review & Growth
  { id: 't27', title: 'Run revenue projection', category: 'Review', pts: 120, difficulty: 'easy', tool: 'portal-sec-calculator', est: '10 min' },
  { id: 't28', title: 'Review weekly progress', category: 'Review', pts: 130, difficulty: 'easy', tool: 'portal-sec-dashboard', est: '10 min' },
  { id: 't29', title: 'Update growth roadmap', category: 'Review', pts: 100, difficulty: 'easy', tool: 'portal-sec-planner', est: '10 min' },
  { id: 't30', title: 'Set next 30-day goal', category: 'Review', pts: 130, difficulty: 'easy', tool: null, est: '10 min' },
  { id: 't31', title: 'Analyze conversion metrics', category: 'Review', pts: 150, difficulty: 'medium', tool: 'portal-sec-dashboard', est: '15 min' },
  { id: 't32', title: 'Celebrate a win and plan next', category: 'Review', pts: 100, difficulty: 'easy', tool: null, est: '5 min' }
];

// ── PRE-BUILT TRACK TEMPLATES ──────────────────────────────

var CHB_TEMPLATES = [
  {
    id: 'aggressive',
    name: 'Aggressive Growth',
    desc: 'For partners who want results fast. Heavy on outreach and referrals.',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    tasks: ['t01','t04','t11','t18','t19','t12','t25','t24','t20','t14','t22','t24','t13','t19','t28','t16','t22','t25','t24','t20','t17','t19','t22','t24','t31','t22','t24','t20','t24','t30']
  },
  {
    id: 'steady',
    name: 'Steady Builder',
    desc: 'Balanced approach. Learn, build content, then outreach.',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    tasks: ['t01','t02','t06','t08','t04','t11','t18','t07','t12','t19','t25','t13','t28','t09','t20','t24','t17','t21','t27','t22','t14','t24','t16','t23','t29','t24','t31','t22','t24','t30']
  },
  {
    id: 'learning',
    name: 'Knowledge First',
    desc: 'Master the fundamentals before outreach. Best for new partners.',
    icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
    tasks: ['t01','t02','t03','t06','t08','t05','t07','t10','t09','t04','t11','t08','t12','t13','t18','t25','t19','t17','t28','t20','t27','t24','t21','t14','t22','t29','t16','t24','t31','t30']
  },
  {
    id: 'content',
    name: 'Content Machine',
    desc: 'Build a marketing arsenal first, then deploy it.',
    icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    tasks: ['t01','t02','t04','t11','t12','t13','t15','t17','t14','t16','t06','t12','t11','t28','t18','t19','t21','t12','t25','t20','t14','t22','t27','t24','t16','t12','t29','t24','t31','t30']
  }
];

// ── STATE ──────────────────────────────

function chbGetTracks() {
  try { return JSON.parse(localStorage.getItem(CHB_CUSTOM_KEY) || '[]'); } catch (e) { return []; }
}

function chbSetTracks(data) {
  try { localStorage.setItem(CHB_CUSTOM_KEY, JSON.stringify(data)); } catch (e) {}
}

function chbGetActive() {
  try { return JSON.parse(localStorage.getItem(CHB_ACTIVE_KEY) || 'null'); } catch (e) { return null; }
}

function chbSetActive(data) {
  try { localStorage.setItem(CHB_ACTIVE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── BUILDER STATE ──────────────────────────────

var _chbSelected = [];
var _chbFilterCat = 'all';
var _chbFilterDiff = 'all';

// ── MAIN MODAL ──────────────────────────────

function chbShowBuilder() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'chb-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '780px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Challenge Builder</div>'
    + '<div class="aid-modal-meta">Design your perfect 30-day track</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'chb-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="chb-tabs" id="chb-tabs"></div>'
    + '<div class="aid-modal-body" id="chb-body" style="padding-top:0"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  _chbSelected = [];
  chbRenderTabs('templates');
  chbRenderTemplates();
}

function chbRenderTabs(active) {
  var tabs = [
    { key: 'templates', label: 'Track Templates' },
    { key: 'custom', label: 'Custom Builder' },
    { key: 'mytracks', label: 'My Tracks' }
  ];

  var el = document.getElementById('chb-tabs');
  if (!el) return;

  el.innerHTML = tabs.map(function(t) {
    return '<button class="chb-tab' + (t.key === active ? ' chb-tab-active' : '') + '" onclick="chbSwitchTab(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function chbSwitchTab(key) {
  chbRenderTabs(key);
  var renderers = {
    templates: chbRenderTemplates,
    custom: chbRenderCustom,
    mytracks: chbRenderMyTracks
  };
  if (renderers[key]) renderers[key]();
}

// ── TEMPLATES TAB ──────────────────────────────

function chbRenderTemplates() {
  var body = document.getElementById('chb-body');
  if (!body) return;

  var html = '<div class="chb-section-title">Pre-Built Challenge Tracks</div>'
    + '<div class="chb-desc">Choose a track designed for your goals, or build your own from scratch.</div>';

  html += '<div class="chb-template-grid">';

  CHB_TEMPLATES.forEach(function(tmpl) {
    var totalPts = 0;
    var cats = {};
    tmpl.tasks.forEach(function(tid) {
      var task = CHB_TASK_LIBRARY.find(function(t) { return t.id === tid; });
      if (task) {
        totalPts += task.pts;
        cats[task.category] = (cats[task.category] || 0) + 1;
      }
    });

    var topCats = Object.keys(cats).sort(function(a, b) { return cats[b] - cats[a]; }).slice(0, 3);

    html += '<div class="chb-tmpl-card">'
      + '<div class="chb-tmpl-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + tmpl.icon + '</svg></div>'
      + '<div class="chb-tmpl-name">' + tmpl.name + '</div>'
      + '<div class="chb-tmpl-desc">' + tmpl.desc + '</div>'
      + '<div class="chb-tmpl-stats">'
      + '<span>' + totalPts.toLocaleString() + ' pts</span>'
      + '<span>30 days</span>'
      + '</div>'
      + '<div class="chb-tmpl-cats">' + topCats.map(function(c) { return '<span class="chb-cat-tag">' + c + ' (' + cats[c] + ')</span>'; }).join(' ') + '</div>'
      + '<div class="chb-tmpl-actions">'
      + '<button class="btn btn-g btn-sm" onclick="chbPreviewTemplate(\'' + tmpl.id + '\')">Preview</button>'
      + '<button class="btn btn-p btn-sm" onclick="chbActivateTemplate(\'' + tmpl.id + '\')">Start Track</button>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';

  body.innerHTML = html;
}

function chbPreviewTemplate(tmplId) {
  var tmpl = CHB_TEMPLATES.find(function(t) { return t.id === tmplId; });
  if (!tmpl) return;

  var body = document.getElementById('chb-body');
  if (!body) return;

  var html = '<div style="margin-bottom:12px">'
    + '<button class="btn btn-g btn-sm" onclick="chbRenderTemplates()">&larr; Back to Templates</button>'
    + '</div>';

  html += '<div class="chb-preview-header">'
    + '<div class="chb-preview-name">' + tmpl.name + '</div>'
    + '<div class="chb-preview-desc">' + tmpl.desc + '</div>'
    + '</div>';

  html += '<div class="chb-preview-grid">';
  tmpl.tasks.forEach(function(tid, i) {
    var task = CHB_TASK_LIBRARY.find(function(t) { return t.id === tid; });
    if (!task) return;
    var diffColor = task.difficulty === 'hard' ? '#EF4444' : task.difficulty === 'medium' ? '#F59E0B' : '#059669';

    html += '<div class="chb-preview-day">'
      + '<div class="chb-pd-num">Day ' + (i + 1) + '</div>'
      + '<div class="chb-pd-info">'
      + '<div class="chb-pd-title">' + task.title + '</div>'
      + '<div class="chb-pd-meta">'
      + '<span class="chb-pd-cat">' + task.category + '</span>'
      + '<span class="chb-pd-diff" style="color:' + diffColor + '">' + task.difficulty + '</span>'
      + '<span class="chb-pd-pts">' + task.pts + ' pts</span>'
      + '<span class="chb-pd-est">' + task.est + '</span>'
      + '</div>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';

  html += '<div style="text-align:center;margin-top:20px">'
    + '<button class="btn btn-p" onclick="chbActivateTemplate(\'' + tmplId + '\')">Start This Track</button>'
    + '</div>';

  body.innerHTML = html;
}

function chbActivateTemplate(tmplId) {
  var tmpl = CHB_TEMPLATES.find(function(t) { return t.id === tmplId; });
  if (!tmpl) return;

  var track = {
    id: 'track_' + Date.now(),
    name: tmpl.name,
    tasks: tmpl.tasks.slice(),
    created: new Date().toISOString(),
    fromTemplate: tmplId
  };

  var tracks = chbGetTracks();
  tracks.unshift(track);
  chbSetTracks(tracks);
  chbSetActive(track.id);

  if (typeof showToast === 'function') showToast('Track "' + tmpl.name + '" activated!', 'success');

  chbSwitchTab('mytracks');
}

// ── CUSTOM BUILDER TAB ──────────────────────────────

function chbRenderCustom() {
  var body = document.getElementById('chb-body');
  if (!body) return;

  var html = '<div class="chb-builder-header">'
    + '<div class="chb-builder-count">'
    + '<span class="chb-count-num" id="chb-count">' + _chbSelected.length + '</span>'
    + '<span class="chb-count-label"> / 30 tasks selected</span>'
    + '</div>'
    + '</div>';

  // Filters
  var categories = ['all'];
  var catMap = {};
  CHB_TASK_LIBRARY.forEach(function(t) {
    if (!catMap[t.category]) { catMap[t.category] = true; categories.push(t.category); }
  });

  html += '<div class="chb-filters">'
    + '<div class="chb-filter-group">'
    + '<span class="chb-filter-label">Category:</span>'
    + categories.map(function(c) {
      return '<button class="chb-filter-btn' + (_chbFilterCat === c ? ' chb-filter-active' : '') + '" onclick="chbSetFilter(\'cat\',\'' + c + '\')">' + (c === 'all' ? 'All' : c) + '</button>';
    }).join('')
    + '</div>'
    + '<div class="chb-filter-group">'
    + '<span class="chb-filter-label">Difficulty:</span>'
    + ['all','easy','medium','hard'].map(function(d) {
      return '<button class="chb-filter-btn' + (_chbFilterDiff === d ? ' chb-filter-active' : '') + '" onclick="chbSetFilter(\'diff\',\'' + d + '\')">' + (d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)) + '</button>';
    }).join('')
    + '</div>'
    + '</div>';

  // Task library
  var filtered = CHB_TASK_LIBRARY.filter(function(t) {
    if (_chbFilterCat !== 'all' && t.category !== _chbFilterCat) return false;
    if (_chbFilterDiff !== 'all' && t.difficulty !== _chbFilterDiff) return false;
    return true;
  });

  html += '<div class="chb-task-list" id="chb-task-list">';
  filtered.forEach(function(task) {
    var isSelected = _chbSelected.indexOf(task.id) !== -1;
    var count = _chbSelected.filter(function(id) { return id === task.id; }).length;
    var diffColor = task.difficulty === 'hard' ? '#EF4444' : task.difficulty === 'medium' ? '#F59E0B' : '#059669';

    html += '<div class="chb-task-item' + (isSelected ? ' chb-task-selected' : '') + '" onclick="chbToggleTask(\'' + task.id + '\')">'
      + '<div class="chb-ti-check">' + (isSelected ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#059669" stroke="#059669" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : '<span class="chb-ti-circle"></span>') + '</div>'
      + '<div class="chb-ti-info">'
      + '<div class="chb-ti-title">' + task.title + (count > 1 ? ' <span class="chb-ti-count">x' + count + '</span>' : '') + '</div>'
      + '<div class="chb-ti-meta">'
      + '<span class="chb-pd-cat">' + task.category + '</span>'
      + '<span class="chb-pd-diff" style="color:' + diffColor + '">' + task.difficulty + '</span>'
      + '<span class="chb-pd-pts">' + task.pts + ' pts</span>'
      + '<span class="chb-pd-est">' + task.est + '</span>'
      + '</div>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';

  // Selected summary
  if (_chbSelected.length > 0) {
    var totalPts = 0;
    _chbSelected.forEach(function(tid) {
      var t = CHB_TASK_LIBRARY.find(function(tt) { return tt.id === tid; });
      if (t) totalPts += t.pts;
    });

    html += '<div class="chb-selected-bar">'
      + '<div class="chb-sel-info">'
      + '<span class="chb-sel-count">' + _chbSelected.length + '/30 tasks</span>'
      + '<span class="chb-sel-pts">' + totalPts.toLocaleString() + ' total pts</span>'
      + '</div>'
      + '<div class="chb-sel-actions">'
      + '<button class="btn btn-g btn-sm" onclick="chbClearSelection()">Clear</button>'
      + (_chbSelected.length >= 7 ? '<button class="btn btn-p btn-sm" onclick="chbSaveCustom()">Save Track</button>' : '')
      + '</div>'
      + '</div>';
  }

  body.innerHTML = html;
}

function chbSetFilter(type, value) {
  if (type === 'cat') _chbFilterCat = value;
  if (type === 'diff') _chbFilterDiff = value;
  chbRenderCustom();
}

function chbToggleTask(taskId) {
  var idx = _chbSelected.indexOf(taskId);
  if (idx !== -1) {
    _chbSelected.splice(idx, 1);
  } else {
    if (_chbSelected.length >= 30) {
      if (typeof showToast === 'function') showToast('Maximum 30 tasks per track', 'error');
      return;
    }
    _chbSelected.push(taskId);
  }
  chbRenderCustom();
}

function chbClearSelection() {
  _chbSelected = [];
  chbRenderCustom();
}

function chbSaveCustom() {
  if (_chbSelected.length < 7) {
    if (typeof showToast === 'function') showToast('Select at least 7 tasks', 'error');
    return;
  }

  var name = prompt('Name your challenge track:');
  if (!name || !name.trim()) return;

  var track = {
    id: 'track_' + Date.now(),
    name: name.trim(),
    tasks: _chbSelected.slice(),
    created: new Date().toISOString(),
    fromTemplate: null
  };

  var tracks = chbGetTracks();
  tracks.unshift(track);
  chbSetTracks(tracks);

  _chbSelected = [];
  if (typeof showToast === 'function') showToast('Track "' + name + '" saved!', 'success');

  chbSwitchTab('mytracks');
}

// ── MY TRACKS TAB ──────────────────────────────

function chbRenderMyTracks() {
  var body = document.getElementById('chb-body');
  if (!body) return;

  var tracks = chbGetTracks();
  var activeId = chbGetActive();

  var html = '<div class="chb-section-title">My Challenge Tracks</div>';

  if (tracks.length === 0) {
    html += '<div class="chb-empty">'
      + '<div class="chb-empty-title">No custom tracks yet</div>'
      + '<div class="chb-empty-desc">Choose a template or build your own from scratch.</div>'
      + '<div style="margin-top:12px;display:flex;gap:8px;justify-content:center">'
      + '<button class="btn btn-g" onclick="chbSwitchTab(\'templates\')">Browse Templates</button>'
      + '<button class="btn btn-p" onclick="chbSwitchTab(\'custom\')">Build Custom</button>'
      + '</div>'
      + '</div>';
    body.innerHTML = html;
    return;
  }

  html += '<div class="chb-tracks-list">';
  tracks.forEach(function(track) {
    var isActive = track.id === activeId;
    var totalPts = 0;
    var catCounts = {};
    track.tasks.forEach(function(tid) {
      var t = CHB_TASK_LIBRARY.find(function(tt) { return tt.id === tid; });
      if (t) {
        totalPts += t.pts;
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
      }
    });

    var topCats = Object.keys(catCounts).sort(function(a, b) { return catCounts[b] - catCounts[a]; }).slice(0, 3);
    var created = new Date(track.created).toLocaleDateString();

    html += '<div class="chb-track-card' + (isActive ? ' chb-track-active' : '') + '">'
      + '<div class="chb-track-header">'
      + '<div>'
      + '<div class="chb-track-name">' + track.name + (isActive ? ' <span class="chb-active-tag">Active</span>' : '') + '</div>'
      + '<div class="chb-track-meta">' + track.tasks.length + ' days &middot; ' + totalPts.toLocaleString() + ' pts &middot; Created ' + created + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="chb-track-cats">' + topCats.map(function(c) { return '<span class="chb-cat-tag">' + c + ' (' + catCounts[c] + ')</span>'; }).join(' ') + '</div>'
      + '<div class="chb-track-actions">'
      + '<button class="btn btn-g btn-sm" onclick="chbDeleteTrack(\'' + track.id + '\')">Delete</button>'
      + '<button class="btn btn-g btn-sm" onclick="chbDuplicateTrack(\'' + track.id + '\')">Duplicate</button>'
      + (!isActive ? '<button class="btn btn-p btn-sm" onclick="chbActivateTrack(\'' + track.id + '\')">Activate</button>' : '<button class="btn btn-g btn-sm" disabled>Active</button>')
      + '</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

function chbActivateTrack(trackId) {
  chbSetActive(trackId);
  if (typeof showToast === 'function') showToast('Track activated!', 'success');
  chbRenderMyTracks();
}

function chbDeleteTrack(trackId) {
  if (!confirm('Delete this track?')) return;
  var tracks = chbGetTracks().filter(function(t) { return t.id !== trackId; });
  chbSetTracks(tracks);
  var activeId = chbGetActive();
  if (activeId === trackId) chbSetActive(null);
  chbRenderMyTracks();
}

function chbDuplicateTrack(trackId) {
  var tracks = chbGetTracks();
  var orig = tracks.find(function(t) { return t.id === trackId; });
  if (!orig) return;

  var dupe = {
    id: 'track_' + Date.now(),
    name: orig.name + ' (Copy)',
    tasks: orig.tasks.slice(),
    created: new Date().toISOString(),
    fromTemplate: orig.fromTemplate
  };

  tracks.unshift(dupe);
  chbSetTracks(tracks);
  if (typeof showToast === 'function') showToast('Track duplicated!', 'success');
  chbRenderMyTracks();
}

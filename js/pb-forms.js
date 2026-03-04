// ══════════════════════════════════════════
//  M1P3C3: FORM BUILDER & SUBMISSION MANAGER
//  Custom form fields, submission tracking, CSV export
// ══════════════════════════════════════════

var PBF_SUBMISSIONS_KEY = 'ctax_pb_submissions';
var PBF_FIELDS_KEY = 'ctax_pb_form_config';

function pbfShowManager() {
  var existing = document.getElementById('pbf-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'pb-tpl-overlay';
  overlay.id = 'pbf-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'pb-tpl-modal';
  modal.style.maxWidth = '740px';

  modal.innerHTML = '<div class="pb-tpl-header">'
    + '<div>'
    + '<div class="pb-tpl-title">Form Manager</div>'
    + '<div class="pb-tpl-subtitle">Customize form fields, track submissions, and export leads.</div>'
    + '</div>'
    + '<button class="pb-tpl-close" onclick="document.getElementById(\'pbf-overlay\').remove()">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    + '</button>'
    + '</div>'
    + '<div id="pbf-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  pbfRenderTabs();
}

var pbfActiveTab = 'fields';

function pbfRenderTabs() {
  var body = document.getElementById('pbf-body');
  if (!body) return;

  var subs = pbfGetSubmissions();
  var tabs = [
    { id: 'fields', label: 'Form Fields' },
    { id: 'submissions', label: 'Submissions (' + subs.length + ')' },
    { id: 'settings', label: 'Settings' }
  ];

  var html = '<div class="pbseo-tabs">';
  tabs.forEach(function(t) {
    html += '<button class="pbseo-tab' + (t.id === pbfActiveTab ? ' pbseo-tab-active' : '') + '" onclick="pbfActiveTab=\'' + t.id + '\';pbfRenderTabs()">' + t.label + '</button>';
  });
  html += '</div>';

  html += '<div class="pbseo-content">';
  if (pbfActiveTab === 'fields') {
    html += pbfRenderFields();
  } else if (pbfActiveTab === 'submissions') {
    html += pbfRenderSubmissions(subs);
  } else if (pbfActiveTab === 'settings') {
    html += pbfRenderSettings();
  }
  html += '</div>';

  body.innerHTML = html;
}

// ── FIELDS TAB ──────────────────────────────

function pbfGetFieldConfig() {
  try { return JSON.parse(localStorage.getItem(PBF_FIELDS_KEY)) || pbfDefaultFields(); }
  catch (e) { return pbfDefaultFields(); }
}

function pbfSaveFieldConfig(fields) {
  try { localStorage.setItem(PBF_FIELDS_KEY, JSON.stringify(fields)); } catch (e) {}
}

function pbfDefaultFields() {
  return [
    { id: 'first_name', label: 'First Name', type: 'text', required: true, enabled: true },
    { id: 'last_name', label: 'Last Name', type: 'text', required: true, enabled: true },
    { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: true, enabled: true },
    { id: 'tax_debt', label: 'Estimated Tax Debt', type: 'select', required: false, enabled: true,
      options: ['$5,000 - $15,000', '$15,000 - $50,000', '$50,000 - $100,000', '$100,000+'] },
    { id: 'issue_type', label: 'Tax Issue Type', type: 'select', required: false, enabled: false,
      options: ['Back Taxes', 'Unfiled Returns', 'IRS Audit', 'Wage Garnishment', 'Tax Lien', 'Bank Levy', 'Other'] },
    { id: 'message', label: 'Message', type: 'textarea', required: false, enabled: false },
    { id: 'preferred_time', label: 'Best Time to Call', type: 'select', required: false, enabled: false,
      options: ['Morning (9am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)'] },
    { id: 'referral_source', label: 'How Did You Hear About Us?', type: 'select', required: false, enabled: false,
      options: ['Google Search', 'Social Media', 'Referral', 'Advertisement', 'Other'] },
    { id: 'zip_code', label: 'ZIP Code', type: 'text', required: false, enabled: false }
  ];
}

function pbfRenderFields() {
  var fields = pbfGetFieldConfig();

  var html = '<div class="pbf-fields-header">'
    + '<div class="pbf-fields-info">Toggle fields on/off and reorder them. Active fields appear in your landing page forms.</div>'
    + '<button class="btn btn-g btn-sm" onclick="pbfAddCustomField()">+ Add Custom Field</button>'
    + '</div>';

  html += '<div class="pbf-field-list" id="pbf-field-list">';
  fields.forEach(function(f, i) {
    html += '<div class="pbf-field-row' + (f.enabled ? '' : ' pbf-field-disabled') + '" data-index="' + i + '">'
      + '<div class="pbf-field-drag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg></div>'
      + '<div class="pbf-field-toggle">'
      + '<label class="pbf-switch"><input type="checkbox"' + (f.enabled ? ' checked' : '') + ' onchange="pbfToggleField(' + i + ',this.checked)"><span class="pbf-switch-slider"></span></label>'
      + '</div>'
      + '<div class="pbf-field-info">'
      + '<div class="pbf-field-label">' + f.label + '</div>'
      + '<div class="pbf-field-meta">' + f.type + (f.required ? ' -- required' : '') + '</div>'
      + '</div>'
      + '<div class="pbf-field-actions">';

    if (i > 0) {
      html += '<button class="pbf-field-btn" onclick="pbfMoveField(' + i + ',-1)" title="Move up"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>';
    }
    if (i < fields.length - 1) {
      html += '<button class="pbf-field-btn" onclick="pbfMoveField(' + i + ',1)" title="Move down"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>';
    }

    // Only custom fields can be deleted
    if (f.id.startsWith('custom_')) {
      html += '<button class="pbf-field-btn pbf-field-btn-del" onclick="pbfDeleteField(' + i + ')" title="Delete"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>';
    }

    html += '</div></div>';
  });
  html += '</div>';

  // Preview
  html += '<div class="pbf-preview-section">'
    + '<div class="pbf-preview-label">Form Preview</div>'
    + '<div class="pbf-preview-box" id="pbf-preview">'
    + pbfRenderFormPreview(fields)
    + '</div>'
    + '</div>';

  // Apply to editor
  html += '<div class="pbseo-footer" style="padding-top:12px;border-top:1.5px solid var(--off2)">'
    + '<button class="btn btn-p btn-sm" onclick="pbfApplyToEditor()">Apply to Page Builder</button>'
    + '</div>';

  return html;
}

function pbfRenderFormPreview(fields) {
  var active = fields.filter(function(f) { return f.enabled; });
  if (active.length === 0) return '<div style="text-align:center;color:var(--gray);padding:20px">No fields enabled</div>';

  var html = '<form style="display:flex;flex-direction:column;gap:10px" onsubmit="return false">';
  active.forEach(function(f) {
    if (f.type === 'textarea') {
      html += '<textarea placeholder="' + f.label + (f.required ? ' *' : '') + '" style="padding:10px 12px;border:1.5px solid var(--off2);border-radius:8px;font-size:13px;font-family:DM Sans,sans-serif;resize:none" rows="2" disabled></textarea>';
    } else if (f.type === 'select') {
      html += '<select style="padding:10px 12px;border:1.5px solid var(--off2);border-radius:8px;font-size:13px;font-family:DM Sans,sans-serif;color:var(--gray)" disabled>'
        + '<option>' + f.label + (f.required ? ' *' : '') + '</option>'
        + '</select>';
    } else {
      html += '<input type="' + f.type + '" placeholder="' + f.label + (f.required ? ' *' : '') + '" style="padding:10px 12px;border:1.5px solid var(--off2);border-radius:8px;font-size:13px;font-family:DM Sans,sans-serif" disabled>';
    }
  });
  html += '<button type="submit" style="padding:12px;background:var(--blue);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif" disabled>Submit</button>';
  html += '</form>';
  return html;
}

function pbfToggleField(index, enabled) {
  var fields = pbfGetFieldConfig();
  if (fields[index]) {
    fields[index] = Object.assign({}, fields[index], { enabled: enabled });
    pbfSaveFieldConfig(fields);
    pbfRenderTabs();
  }
}

function pbfMoveField(index, direction) {
  var fields = pbfGetFieldConfig();
  var newIndex = index + direction;
  if (newIndex < 0 || newIndex >= fields.length) return;
  var temp = fields[index];
  fields[index] = fields[newIndex];
  fields[newIndex] = temp;
  pbfSaveFieldConfig(fields);
  pbfRenderTabs();
}

function pbfDeleteField(index) {
  var fields = pbfGetFieldConfig();
  if (fields[index] && fields[index].id.startsWith('custom_')) {
    fields.splice(index, 1);
    pbfSaveFieldConfig(fields);
    pbfRenderTabs();
  }
}

function pbfAddCustomField() {
  var fields = pbfGetFieldConfig();
  var id = 'custom_' + Date.now();
  var label = prompt('Enter field label:');
  if (!label) return;

  fields.push({
    id: id,
    label: label,
    type: 'text',
    required: false,
    enabled: true
  });
  pbfSaveFieldConfig(fields);
  pbfRenderTabs();
}

function pbfApplyToEditor() {
  if (typeof pbEditor === 'undefined' || !pbEditor) {
    if (typeof portalToast === 'function') portalToast('Open the page builder first', 'error');
    return;
  }

  var fields = pbfGetFieldConfig().filter(function(f) { return f.enabled; });
  var formHtml = '<form data-section="form" style="display:flex;flex-direction:column;gap:12px;max-width:500px;margin:0 auto;padding:40px 24px">';

  fields.forEach(function(f) {
    if (f.type === 'textarea') {
      formHtml += '<textarea name="' + f.id + '" placeholder="' + f.label + (f.required ? ' *' : '') + '" style="padding:14px 16px;border:1.5px solid #ddd;border-radius:8px;font-size:15px;font-family:DM Sans,sans-serif;resize:vertical" rows="3"' + (f.required ? ' required' : '') + '></textarea>';
    } else if (f.type === 'select' && f.options) {
      formHtml += '<select name="' + f.id + '" style="padding:14px 16px;border:1.5px solid #ddd;border-radius:8px;font-size:15px;font-family:DM Sans,sans-serif"' + (f.required ? ' required' : '') + '>';
      formHtml += '<option value="">' + f.label + '</option>';
      f.options.forEach(function(o) {
        formHtml += '<option value="' + o + '">' + o + '</option>';
      });
      formHtml += '</select>';
    } else {
      formHtml += '<input type="' + f.type + '" name="' + f.id + '" placeholder="' + f.label + (f.required ? ' *' : '') + '" style="padding:14px 16px;border:1.5px solid #ddd;border-radius:8px;font-size:15px;font-family:DM Sans,sans-serif"' + (f.required ? ' required' : '') + '>';
    }
  });

  formHtml += '<button type="submit" style="padding:16px;background:#0B5FD8;color:white;border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif">Get Your Free Consultation</button>';
  formHtml += '</form>';

  // Find existing form section or add at end
  var wrapper = pbEditor.getWrapper();
  var components = wrapper.components();
  var formFound = false;

  components.forEach(function(comp) {
    if (comp.getAttributes()['data-section'] === 'form') {
      comp.replaceWith(formHtml);
      formFound = true;
    }
  });

  if (!formFound) {
    wrapper.append(formHtml);
  }

  if (typeof pbSave === 'function') pbSave();
  if (typeof portalToast === 'function') portalToast('Form updated in page builder', 'success');

  var overlay = document.getElementById('pbf-overlay');
  if (overlay) overlay.remove();
}

// ── SUBMISSIONS TAB ──────────────────────────────

function pbfGetSubmissions() {
  try { return JSON.parse(localStorage.getItem(PBF_SUBMISSIONS_KEY)) || []; }
  catch (e) { return []; }
}

function pbfSaveSubmission(data) {
  var subs = pbfGetSubmissions();
  subs.unshift(Object.assign({}, data, {
    id: 'sub_' + Date.now(),
    timestamp: Date.now(),
    status: 'new'
  }));
  if (subs.length > 500) subs = subs.slice(0, 500);
  try { localStorage.setItem(PBF_SUBMISSIONS_KEY, JSON.stringify(subs)); } catch (e) {}
}

function pbfRenderSubmissions(subs) {
  if (subs.length === 0) {
    return '<div class="pbf-empty">'
      + '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
      + '<div class="pbf-empty-title">No Submissions Yet</div>'
      + '<div class="pbf-empty-text">Form submissions from your landing pages will appear here.</div>'
      + '<button class="btn btn-g btn-sm" onclick="pbfAddDemoSubmissions()">Add Demo Submissions</button>'
      + '</div>';
  }

  // Stats row
  var newCount = subs.filter(function(s) { return s.status === 'new'; }).length;
  var todayCount = subs.filter(function(s) { return new Date(s.timestamp).toDateString() === new Date().toDateString(); }).length;

  var html = '<div class="pbf-stats-row">'
    + '<div class="pbf-stat"><div class="pbf-stat-num">' + subs.length + '</div><div class="pbf-stat-label">Total</div></div>'
    + '<div class="pbf-stat"><div class="pbf-stat-num pbf-stat-new">' + newCount + '</div><div class="pbf-stat-label">New</div></div>'
    + '<div class="pbf-stat"><div class="pbf-stat-num">' + todayCount + '</div><div class="pbf-stat-label">Today</div></div>'
    + '<button class="btn btn-g btn-sm" onclick="pbfExportCSV()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV</button>'
    + '</div>';

  // Submissions list
  html += '<div class="pbf-sub-list">';
  subs.slice(0, 20).forEach(function(s) {
    var date = new Date(s.timestamp);
    var isNew = s.status === 'new';
    var name = (s.first_name || '') + ' ' + (s.last_name || '');
    name = name.trim() || 'Unknown';

    html += '<div class="pbf-sub-item' + (isNew ? ' pbf-sub-new' : '') + '" onclick="pbfToggleDetail(this)">'
      + '<div class="pbf-sub-header">'
      + '<div class="pbf-sub-name">' + (isNew ? '<span class="pbf-new-badge">NEW</span> ' : '') + name + '</div>'
      + '<div class="pbf-sub-date">' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>'
      + '</div>'
      + '<div class="pbf-sub-summary">' + (s.email || '') + (s.phone ? ' -- ' + s.phone : '') + (s.tax_debt ? ' -- ' + s.tax_debt : '') + '</div>'
      + '<div class="pbf-sub-detail" style="display:none">';

    // Show all fields
    Object.keys(s).forEach(function(key) {
      if (['id', 'timestamp', 'status'].indexOf(key) === -1 && s[key]) {
        html += '<div class="pbf-sub-field"><span class="pbf-sub-field-label">' + key.replace(/_/g, ' ') + ':</span> ' + s[key] + '</div>';
      }
    });

    html += '<div class="pbf-sub-actions">'
      + '<button class="btn btn-g btn-sm" onclick="event.stopPropagation();pbfMarkRead(\'' + s.id + '\')">Mark Read</button>'
      + '</div>';

    html += '</div></div>';
  });
  html += '</div>';

  if (subs.length > 20) {
    html += '<div style="text-align:center;padding:12px;font-size:13px;color:var(--gray)">Showing 20 of ' + subs.length + ' submissions. Export CSV for full data.</div>';
  }

  return html;
}

function pbfToggleDetail(el) {
  var detail = el.querySelector('.pbf-sub-detail');
  if (detail) {
    detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
  }
}

function pbfMarkRead(id) {
  var subs = pbfGetSubmissions();
  var updated = subs.map(function(s) {
    if (s.id === id) return Object.assign({}, s, { status: 'read' });
    return s;
  });
  try { localStorage.setItem(PBF_SUBMISSIONS_KEY, JSON.stringify(updated)); } catch (e) {}
  pbfRenderTabs();
}

function pbfExportCSV() {
  var subs = pbfGetSubmissions();
  if (subs.length === 0) return;

  // Collect all unique keys
  var keys = [];
  subs.forEach(function(s) {
    Object.keys(s).forEach(function(k) {
      if (keys.indexOf(k) === -1 && k !== 'id') keys.push(k);
    });
  });

  var csv = keys.join(',') + '\n';
  subs.forEach(function(s) {
    csv += keys.map(function(k) {
      var val = (s[k] || '').toString().replace(/"/g, '""');
      return '"' + val + '"';
    }).join(',') + '\n';
  });

  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'form_submissions_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);

  if (typeof portalToast === 'function') portalToast('CSV exported', 'success');
}

function pbfAddDemoSubmissions() {
  var demos = [
    { first_name: 'James', last_name: 'Wilson', email: 'jwilson@email.com', phone: '(555) 123-4567', tax_debt: '$15,000 - $50,000', referral_source: 'Google Search' },
    { first_name: 'Maria', last_name: 'Santos', email: 'msantos@email.com', phone: '(555) 234-5678', tax_debt: '$50,000 - $100,000', issue_type: 'Wage Garnishment' },
    { first_name: 'Robert', last_name: 'Chen', email: 'rchen@email.com', phone: '(555) 345-6789', tax_debt: '$5,000 - $15,000', preferred_time: 'Morning (9am-12pm)' },
    { first_name: 'Linda', last_name: 'Thompson', email: 'lthompson@email.com', phone: '(555) 456-7890', tax_debt: '$100,000+', message: 'I received a levy notice last week and need help ASAP.' },
    { first_name: 'Kevin', last_name: 'Park', email: 'kpark@email.com', phone: '(555) 567-8901', tax_debt: '$15,000 - $50,000', issue_type: 'Unfiled Returns' }
  ];

  demos.forEach(function(d, i) {
    var sub = Object.assign({}, d, {
      id: 'sub_demo_' + i,
      timestamp: Date.now() - (i * 3600000 * (i + 1)),
      status: i < 2 ? 'new' : 'read'
    });
    var subs = pbfGetSubmissions();
    subs.push(sub);
    try { localStorage.setItem(PBF_SUBMISSIONS_KEY, JSON.stringify(subs)); } catch (e) {}
  });

  pbfRenderTabs();
  if (typeof portalToast === 'function') portalToast('5 demo submissions added', 'success');
}

// ── SETTINGS TAB ──────────────────────────────

function pbfRenderSettings() {
  var config = pbfGetFormSettings();

  var html = '<div class="pbseo-section">'
    + '<div class="pbseo-section-title">Form Behavior</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Success Message</label>'
    + '<input type="text" class="pbseo-input" id="pbf-success-msg" value="' + (config.successMessage || 'Thank you! We will be in touch within 24 hours.').replace(/"/g, '&quot;') + '">'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Redirect URL After Submit <span style="font-weight:400;color:var(--gray)">(optional)</span></label>'
    + '<input type="url" class="pbseo-input" id="pbf-redirect" value="' + (config.redirectUrl || '').replace(/"/g, '&quot;') + '" placeholder="https://yoursite.com/thank-you">'
    + '</div>';

  html += '<div class="pbseo-field pbseo-checkbox-row">'
    + '<label class="pbseo-checkbox-label">'
    + '<input type="checkbox" id="pbf-email-notify"' + (config.emailNotify ? ' checked' : '') + '>'
    + ' <span>Email notification on new submission</span>'
    + '</label>'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Notification Email</label>'
    + '<input type="email" class="pbseo-input" id="pbf-notify-email" value="' + (config.notifyEmail || '').replace(/"/g, '&quot;') + '" placeholder="you@yourpractice.com">'
    + '</div>';

  html += '</div>';

  html += '<div class="pbseo-section">'
    + '<div class="pbseo-section-title">Spam Prevention</div>'
    + '<div class="pbseo-field pbseo-checkbox-row">'
    + '<label class="pbseo-checkbox-label">'
    + '<input type="checkbox" id="pbf-honeypot"' + (config.honeypot !== false ? ' checked' : '') + '>'
    + ' <span>Honeypot field (hidden field that catches bots)</span>'
    + '</label>'
    + '</div>'
    + '<div class="pbseo-field pbseo-checkbox-row">'
    + '<label class="pbseo-checkbox-label">'
    + '<input type="checkbox" id="pbf-rate-limit"' + (config.rateLimit !== false ? ' checked' : '') + '>'
    + ' <span>Rate limiting (1 submission per minute per visitor)</span>'
    + '</label>'
    + '</div>'
    + '</div>';

  html += '<div class="pbseo-footer" style="border-top:1.5px solid var(--off2)">'
    + '<button class="btn btn-p btn-sm" onclick="pbfSaveSettings()">Save Settings</button>'
    + '</div>';

  return html;
}

function pbfGetFormSettings() {
  try { return JSON.parse(localStorage.getItem('ctax_pb_form_settings')) || {}; }
  catch (e) { return {}; }
}

function pbfSaveSettings() {
  var config = {
    successMessage: (document.getElementById('pbf-success-msg') || {}).value || '',
    redirectUrl: (document.getElementById('pbf-redirect') || {}).value || '',
    emailNotify: (document.getElementById('pbf-email-notify') || {}).checked || false,
    notifyEmail: (document.getElementById('pbf-notify-email') || {}).value || '',
    honeypot: (document.getElementById('pbf-honeypot') || {}).checked !== false,
    rateLimit: (document.getElementById('pbf-rate-limit') || {}).checked !== false
  };

  try { localStorage.setItem('ctax_pb_form_settings', JSON.stringify(config)); } catch (e) {}
  if (typeof portalToast === 'function') portalToast('Form settings saved', 'success');
}

// ── ICP CONTEXT MODULE ─────────────────────────────────────
// Shared ICP context that all portal AI tools consume.
// The ICP Builder saves data here; each tool reads from here.
//
// Schema:
// {
//   icp_title: string,
//   icp_tagline: string,
//   fit_score: 'HIGH' | 'MEDIUM' | 'LOW',
//   commission_range: string,
//   referral_frequency: string,
//   profession_type: string,
//   answers: { q1: string, q2: string, q3: string, q4: string, q5: string, q6: string },
//   sections: { who_they_are: string, red_flags: string, how_to_bring_it_up: string,
//               why_they_convert: string, disqualifiers: string, twelve_week_playbook: string },
//   saved_at: string (ISO date)
// }

var ICP_STORAGE_KEY = 'ctax_icp_profile';

var ICPContext = {
  // Save ICP data to localStorage
  save: function(data) {
    if (!data || !data.icp_title) return false;
    var profile = {
      icp_title: data.icp_title || '',
      icp_tagline: data.icp_tagline || '',
      fit_score: data.fit_score || 'MEDIUM',
      commission_range: data.commission_range || '',
      referral_frequency: data.referral_frequency || '',
      profession_type: data.profession_type || '',
      answers: data.answers || {},
      sections: data.sections || {},
      saved_at: new Date().toISOString()
    };
    try {
      localStorage.setItem(ICP_STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Failed to save ICP profile:', e);
      return false;
    }
  },

  // Load ICP data from localStorage
  load: function() {
    try {
      var raw = localStorage.getItem(ICP_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load ICP profile:', e);
      return null;
    }
  },

  // Check if an ICP profile exists
  hasProfile: function() {
    return !!localStorage.getItem(ICP_STORAGE_KEY);
  },

  // Clear stored ICP data
  clear: function() {
    localStorage.removeItem(ICP_STORAGE_KEY);
  },

  // Get a summary string for use in AI prompts
  getPromptContext: function() {
    var profile = this.load();
    if (!profile) return '';

    var parts = [
      'PARTNER ICP PROFILE:',
      'Title: ' + profile.icp_title,
      'Tagline: ' + profile.icp_tagline,
      'Fit Score: ' + profile.fit_score,
      'Commission Range: ' + profile.commission_range,
      'Referral Frequency: ' + profile.referral_frequency
    ];

    if (profile.profession_type) {
      parts.push('Profession Type: ' + profile.profession_type);
    }

    if (profile.sections) {
      if (profile.sections.who_they_are) {
        parts.push('\nWHO THEY ARE:\n' + profile.sections.who_they_are);
      }
      if (profile.sections.red_flags) {
        parts.push('\nRED FLAGS:\n' + profile.sections.red_flags);
      }
      if (profile.sections.how_to_bring_it_up) {
        parts.push('\nHOW TO BRING IT UP:\n' + profile.sections.how_to_bring_it_up);
      }
      if (profile.sections.why_they_convert) {
        parts.push('\nWHY THEY CONVERT:\n' + profile.sections.why_they_convert);
      }
      if (profile.sections.disqualifiers) {
        parts.push('\nDISQUALIFIERS:\n' + profile.sections.disqualifiers);
      }
    }

    return parts.join('\n');
  },

  // Render a compact ICP status badge for tool UIs
  renderBadge: function(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    var profile = this.load();
    if (!profile) {
      el.innerHTML =
        '<div style="padding:12px 16px;background:#1a1612;border:1px solid #2a2520;border-radius:8px;margin-bottom:16px;">' +
          '<p style="color:#c8a96e;font-size:13px;margin:0;">No ICP profile loaded.</p>' +
          '<p style="color:#8a8580;font-size:12px;margin:4px 0 0;">Build your ICP profile first, then return here for personalized results.</p>' +
        '</div>';
      return;
    }

    var badgeColor = profile.fit_score === 'HIGH' ? '#4ade80' : (profile.fit_score === 'MEDIUM' ? '#fbbf24' : '#f87171');
    el.innerHTML =
      '<div style="padding:12px 16px;background:#0f1a0f;border:1px solid #166534;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div>' +
          '<p style="color:#4ade80;font-size:13px;font-weight:600;margin:0;">ICP Profile Active</p>' +
          '<p style="color:#86efac;font-size:12px;margin:2px 0 0;">' + esc(profile.icp_title) + '</p>' +
        '</div>' +
        '<span style="font-size:11px;padding:3px 8px;border-radius:4px;background:rgba(0,0,0,0.3);color:' + badgeColor + ';font-weight:600;">' +
          esc(profile.fit_score) + ' FIT' +
        '</span>' +
      '</div>';
  }
};

// Helper: escape HTML (reuse if esc() exists globally, otherwise define)
if (typeof esc !== 'function') {
  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}

// Auto-render badges on known containers whenever they appear
var _icpBadgeIds = ['sb-icp-badge', 'res-icp-badge'];
function _icpRenderAllBadges() {
  _icpBadgeIds.forEach(function(id) {
    ICPContext.renderBadge(id);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(_icpRenderAllBadges, 300);
});
// Re-render on SPA navigation
var _origShowPage = window.showPage;
if (typeof _origShowPage === 'function') {
  window.showPage = function(id, skip) {
    _origShowPage(id, skip);
    setTimeout(_icpRenderAllBadges, 200);
  };
}

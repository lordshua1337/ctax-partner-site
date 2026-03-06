// ── REFERRAL TRACKER ──────────────────────────────────────────────
// localStorage-backed referral tracking with pipeline stages.
// All data persists across sessions. Dashboard reads from this.

(function () {
  'use strict';

  var STORAGE_KEY = 'ctax-referrals';
  var STATS_KEY = 'ctax-referral-stats';

  var STAGES = ['submitted', 'in_review', 'in_progress', 'resolved', 'paid'];
  var STAGE_LABELS = {
    submitted: 'Submitted',
    in_review: 'In Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    paid: 'Paid'
  };
  var STAGE_COLORS = {
    submitted: '#4BA3FF',
    in_review: '#F59E0B',
    in_progress: '#8B5CF6',
    resolved: '#22C55E',
    paid: '#10B981'
  };

  // ── SEED DATA ──────────────────────────────────────────────────
  // Realistic referrals so dashboard looks alive from day one

  function getSeedReferrals() {
    var now = Date.now();
    var day = 86400000;

    return [
      {
        id: 'ref-001',
        clientName: 'J. Williams',
        clientEmail: 'j.williams@example.com',
        taxDebt: 45000,
        estimatedFee: 4500,
        stage: 'paid',
        submittedAt: new Date(now - 42 * day).toISOString(),
        updatedAt: new Date(now - 5 * day).toISOString(),
        notes: 'IRS levy release + installment agreement'
      },
      {
        id: 'ref-002',
        clientName: 'M. Garcia',
        clientEmail: 'm.garcia@example.com',
        taxDebt: 72000,
        estimatedFee: 7200,
        stage: 'resolved',
        submittedAt: new Date(now - 28 * day).toISOString(),
        updatedAt: new Date(now - 2 * day).toISOString(),
        notes: 'Offer in Compromise accepted'
      },
      {
        id: 'ref-003',
        clientName: 'R. Thompson',
        clientEmail: 'r.thompson@example.com',
        taxDebt: 18500,
        estimatedFee: 1850,
        stage: 'in_progress',
        submittedAt: new Date(now - 14 * day).toISOString(),
        updatedAt: new Date(now - 1 * day).toISOString(),
        notes: 'Penalty abatement in process'
      },
      {
        id: 'ref-004',
        clientName: 'K. Patel',
        clientEmail: 'k.patel@example.com',
        taxDebt: 125000,
        estimatedFee: 12500,
        stage: 'in_review',
        submittedAt: new Date(now - 7 * day).toISOString(),
        updatedAt: new Date(now - 7 * day).toISOString(),
        notes: 'Business tax debt - multiple years'
      },
      {
        id: 'ref-005',
        clientName: 'S. Chen',
        clientEmail: 's.chen@example.com',
        taxDebt: 33000,
        estimatedFee: 3300,
        stage: 'paid',
        submittedAt: new Date(now - 60 * day).toISOString(),
        updatedAt: new Date(now - 20 * day).toISOString(),
        notes: 'Installment agreement completed'
      },
      {
        id: 'ref-006',
        clientName: 'D. Roberts',
        clientEmail: 'd.roberts@example.com',
        taxDebt: 89000,
        estimatedFee: 8900,
        stage: 'paid',
        submittedAt: new Date(now - 55 * day).toISOString(),
        updatedAt: new Date(now - 15 * day).toISOString(),
        notes: 'OIC + penalty relief'
      },
      {
        id: 'ref-007',
        clientName: 'A. Martinez',
        clientEmail: 'a.martinez@example.com',
        taxDebt: 52000,
        estimatedFee: 5200,
        stage: 'resolved',
        submittedAt: new Date(now - 35 * day).toISOString(),
        updatedAt: new Date(now - 3 * day).toISOString(),
        notes: 'Currently non-collectible status granted'
      },
      {
        id: 'ref-008',
        clientName: 'L. Johnson',
        clientEmail: 'l.johnson@example.com',
        taxDebt: 28000,
        estimatedFee: 2800,
        stage: 'submitted',
        submittedAt: new Date(now - 2 * day).toISOString(),
        updatedAt: new Date(now - 2 * day).toISOString(),
        notes: 'New referral - back taxes 2021-2023'
      },
      {
        id: 'ref-009',
        clientName: 'T. Anderson',
        clientEmail: 't.anderson@example.com',
        taxDebt: 156000,
        estimatedFee: 15600,
        stage: 'in_progress',
        submittedAt: new Date(now - 21 * day).toISOString(),
        updatedAt: new Date(now - 4 * day).toISOString(),
        notes: 'Complex business + personal tax debt'
      },
      {
        id: 'ref-010',
        clientName: 'B. Kim',
        clientEmail: 'b.kim@example.com',
        taxDebt: 41000,
        estimatedFee: 4100,
        stage: 'submitted',
        submittedAt: new Date(now - 1 * day).toISOString(),
        updatedAt: new Date(now - 1 * day).toISOString(),
        notes: 'Wage garnishment relief needed'
      }
    ];
  }

  // ── PERSISTENCE ────────────────────────────────────────────────

  function loadReferrals() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // First load -- seed with demo data
        var seed = getSeedReferrals();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw);
    } catch (e) {
      return getSeedReferrals();
    }
  }

  function saveReferrals(referrals) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(referrals));
    } catch (e) {
      console.error('Failed to save referrals:', e);
    }
  }

  // ── COMPUTED STATS ─────────────────────────────────────────────

  function computeStats(referrals) {
    var totalReferrals = referrals.length;
    var paidReferrals = referrals.filter(function (r) { return r.stage === 'paid'; });
    var resolvedReferrals = referrals.filter(function (r) { return r.stage === 'resolved'; });
    var activeReferrals = referrals.filter(function (r) {
      return r.stage !== 'paid' && r.stage !== 'resolved';
    });

    var totalEarned = paidReferrals.reduce(function (s, r) { return s + r.estimatedFee; }, 0);
    var pendingFees = resolvedReferrals.reduce(function (s, r) { return s + r.estimatedFee; }, 0);
    var pipelineValue = activeReferrals.reduce(function (s, r) { return s + r.estimatedFee; }, 0);

    // This month
    var now = new Date();
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    var thisMonthPaid = paidReferrals.filter(function (r) {
      return new Date(r.updatedAt) >= monthStart;
    });
    var earnedThisMonth = thisMonthPaid.reduce(function (s, r) { return s + r.estimatedFee; }, 0);

    // Conversion rate
    var completedCount = paidReferrals.length + resolvedReferrals.length;
    var conversionRate = totalReferrals > 0 ? Math.round((completedCount / totalReferrals) * 100) : 0;

    // Avg referral value
    var avgValue = totalReferrals > 0 ? Math.round(referrals.reduce(function (s, r) { return s + r.taxDebt; }, 0) / totalReferrals) : 0;

    // By stage
    var byStage = {};
    STAGES.forEach(function (stage) {
      byStage[stage] = referrals.filter(function (r) { return r.stage === stage; }).length;
    });

    return {
      totalReferrals: totalReferrals,
      activeReferrals: activeReferrals.length,
      totalEarned: totalEarned,
      pendingFees: pendingFees,
      pipelineValue: pipelineValue,
      earnedThisMonth: earnedThisMonth,
      conversionRate: conversionRate,
      avgReferralValue: avgValue,
      byStage: byStage
    };
  }

  // ── ADD REFERRAL ───────────────────────────────────────────────

  function addReferral(data) {
    var referrals = loadReferrals();
    var newRef = {
      id: 'ref-' + Date.now(),
      clientName: data.clientName || 'New Client',
      clientEmail: data.clientEmail || '',
      taxDebt: data.taxDebt || 0,
      estimatedFee: Math.round((data.taxDebt || 0) * 0.10),
      stage: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes || ''
    };
    referrals.push(newRef);
    saveReferrals(referrals);
    return newRef;
  }

  // ── UPDATE STAGE ───────────────────────────────────────────────

  function updateReferralStage(id, newStage) {
    var referrals = loadReferrals();
    var updated = referrals.map(function (r) {
      if (r.id === id) {
        return Object.assign({}, r, {
          stage: newStage,
          updatedAt: new Date().toISOString()
        });
      }
      return r;
    });
    saveReferrals(updated);
    return updated;
  }

  // ── FORMAT HELPERS ─────────────────────────────────────────────

  function formatCurrency(cents) {
    return '$' + cents.toLocaleString('en-US');
  }

  function formatDate(isoStr) {
    var d = new Date(isoStr);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
  }

  function timeAgo(isoStr) {
    var diff = Date.now() - new Date(isoStr).getTime();
    var days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 30) return Math.floor(days / 7) + 'w ago';
    return Math.floor(days / 30) + 'mo ago';
  }

  // ── EXPORTS ────────────────────────────────────────────────────

  window.ReferralTracker = {
    load: loadReferrals,
    save: saveReferrals,
    add: addReferral,
    updateStage: updateReferralStage,
    computeStats: computeStats,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    timeAgo: timeAgo,
    STAGES: STAGES,
    STAGE_LABELS: STAGE_LABELS,
    STAGE_COLORS: STAGE_COLORS
  };
})();

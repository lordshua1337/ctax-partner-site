// -- PARTNER PROGRESS --
// Unified read layer across all localStorage keys.
// Every tool writes to its own key; this module aggregates into one object.
// No new storage -- just reads existing data.

var PartnerProgress = (function() {

  function read() {
    var progress = {
      // Phase tracking
      icpComplete: false,
      planComplete: false,
      challengeStarted: false,
      challengeDay: 0,
      challengeComplete: false,

      // Activity counters
      scriptsCreated: 0,
      clientsQualified: 0,
      referralsSubmitted: 0,
      adsCreated: 0,
      pagesCreated: 0,
      pagesPublished: 0,

      // Streak
      challengeStreak: 0,
      challengeCompletedDays: 0,

      // Business planner
      hasRoadmap: false
    };

    // Phase 1: ICP
    try {
      if (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) {
        progress.icpComplete = true;
      }
    } catch (e) {}

    // Phase 2: Business Planner
    try {
      var bpInputs = localStorage.getItem('bp_saved_inputs');
      var bpRoadmap = localStorage.getItem('ctax_bp_roadmap') || localStorage.getItem('bp_ai_roadmap');
      if (bpInputs || bpRoadmap) {
        progress.planComplete = true;
        progress.hasRoadmap = !!bpRoadmap;
      }
    } catch (e) {}

    // Phase 3: Challenge
    try {
      var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
      if (chState.currentDay && chState.currentDay > 0) {
        progress.challengeStarted = true;
        progress.challengeDay = chState.currentDay;
        progress.challengeStreak = chState.streak || 0;
      }
      if (chState.completedDays) {
        var completed = Object.keys(chState.completedDays).filter(function(k) {
          return chState.completedDays[k];
        });
        progress.challengeCompletedDays = completed.length;
        progress.challengeComplete = completed.length >= 30;
      }
    } catch (e) {}

    // Tool stats
    try {
      var stats = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}');
      if (stats['script-builder']) progress.scriptsCreated = stats['script-builder'].count || 0;
      if (stats['client-qualifier']) progress.clientsQualified = stats['client-qualifier'].count || 0;
      if (stats['ad-maker']) progress.adsCreated = stats['ad-maker'].count || 0;
    } catch (e) {}

    // Pages
    try {
      var pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]');
      progress.pagesCreated = pages.length;
      progress.pagesPublished = pages.filter(function(p) { return p.published; }).length;
    } catch (e) {}

    return progress;
  }

  // Which phase is the user currently in?
  // Returns 1-4 based on completion state
  function currentPhase() {
    var p = read();
    if (!p.icpComplete) return 1;
    if (!p.planComplete) return 2;
    if (!p.challengeComplete) return 3;
    return 4;
  }

  // Human-readable phase label
  function phaseLabel(phase) {
    var labels = {
      1: 'Know Your Client',
      2: 'Build Your Plan',
      3: 'Execute Daily',
      4: 'Graduate'
    };
    return labels[phase] || '';
  }

  return {
    read: read,
    currentPhase: currentPhase,
    phaseLabel: phaseLabel
  };
})();

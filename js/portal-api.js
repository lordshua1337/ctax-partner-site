// --- Portal API Service ---
// Handles all data fetching, caching, and state management for the partner portal.
// Designed to receive payloads from backend APIs and populate portal sections.

var PortalAPI = (function() {
  'use strict';

  // Configuration — override these before calling init()
  var config = {
    baseUrl: '',
    authToken: '',
    partnerId: '',
    refreshInterval: 300000, // 5 minutes
    timeout: 15000
  };

  // In-memory cache with TTL
  var cache = {};
  var refreshTimers = {};

  // --- Configuration ---

  function configure(opts) {
    var keys = Object.keys(opts);
    for (var i = 0; i < keys.length; i++) {
      if (config.hasOwnProperty(keys[i])) {
        config[keys[i]] = opts[keys[i]];
      }
    }
  }

  function getConfig() {
    return Object.assign({}, config);
  }

  // --- HTTP Layer ---

  function request(endpoint, options) {
    var opts = options || {};
    var method = opts.method || 'GET';
    var body = opts.body || null;
    var url = config.baseUrl + endpoint;

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = config.timeout;

      // Set headers
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (config.authToken) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + config.authToken);
      }
      if (opts.headers) {
        var hKeys = Object.keys(opts.headers);
        for (var i = 0; i < hKeys.length; i++) {
          xhr.setRequestHeader(hKeys[i], opts.headers[hKeys[i]]);
        }
      }

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject({
            status: xhr.status,
            message: xhr.statusText,
            body: xhr.responseText
          });
        }
      };

      xhr.onerror = function() {
        reject({ status: 0, message: 'Network error', body: '' });
      };

      xhr.ontimeout = function() {
        reject({ status: 0, message: 'Request timeout', body: '' });
      };

      xhr.send(body ? JSON.stringify(body) : null);
    });
  }

  // --- Cache Layer ---

  function cacheGet(key) {
    var entry = cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      delete cache[key];
      return null;
    }
    return entry.data;
  }

  function cacheSet(key, data, ttlMs) {
    cache[key] = {
      data: data,
      expires: Date.now() + (ttlMs || config.refreshInterval)
    };
  }

  function cacheClear(key) {
    if (key) {
      delete cache[key];
    } else {
      cache = {};
    }
  }

  // --- Data Fetchers ---

  function fetchWithCache(endpoint, cacheKey, ttl) {
    var cached = cacheGet(cacheKey);
    if (cached) return Promise.resolve(cached);

    return request(endpoint).then(function(data) {
      cacheSet(cacheKey, data, ttl);
      return data;
    });
  }

  // Partner profile
  function getPartnerProfile() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId,
      'partner_profile',
      600000 // 10 min
    );
  }

  // Dashboard KPIs
  function getDashboardKPIs() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId + '/dashboard',
      'dashboard_kpis',
      300000 // 5 min
    );
  }

  // Referrals list
  function getReferrals(params) {
    var query = params || {};
    var qs = Object.keys(query).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
    }).join('&');
    var endpoint = '/api/partners/' + config.partnerId + '/referrals' + (qs ? '?' + qs : '');
    return request(endpoint);
  }

  // Submit a new referral
  function submitReferral(referralData) {
    return request('/api/partners/' + config.partnerId + '/referrals', {
      method: 'POST',
      body: referralData
    });
  }

  // Earnings data
  function getEarnings(period) {
    var endpoint = '/api/partners/' + config.partnerId + '/earnings';
    if (period) endpoint += '?period=' + encodeURIComponent(period);
    return fetchWithCache(endpoint, 'earnings_' + (period || 'all'), 300000);
  }

  // Payouts data
  function getPayouts(params) {
    var query = params || {};
    var qs = Object.keys(query).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
    }).join('&');
    var endpoint = '/api/partners/' + config.partnerId + '/payouts' + (qs ? '?' + qs : '');
    return request(endpoint);
  }

  // Documents list
  function getDocuments() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId + '/documents',
      'documents',
      300000
    );
  }

  // Upload document
  function uploadDocument(file, metadata) {
    return new Promise(function(resolve, reject) {
      var formData = new FormData();
      formData.append('file', file);
      if (metadata) {
        var keys = Object.keys(metadata);
        for (var i = 0; i < keys.length; i++) {
          formData.append(keys[i], metadata[keys[i]]);
        }
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', config.baseUrl + '/api/partners/' + config.partnerId + '/documents', true);
      if (config.authToken) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + config.authToken);
      }

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          cacheClear('documents');
          try { resolve(JSON.parse(xhr.responseText)); }
          catch (e) { resolve(xhr.responseText); }
        } else {
          reject({ status: xhr.status, message: xhr.statusText });
        }
      };
      xhr.onerror = function() { reject({ status: 0, message: 'Upload failed' }); };
      xhr.send(formData);
    });
  }

  // Notifications
  function getNotifications() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId + '/notifications',
      'notifications',
      60000 // 1 min
    );
  }

  // Mark notification read
  function markNotificationRead(notifId) {
    return request('/api/partners/' + config.partnerId + '/notifications/' + notifId + '/read', {
      method: 'PUT'
    }).then(function(data) {
      cacheClear('notifications');
      return data;
    });
  }

  // Partner settings
  function getSettings() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId + '/settings',
      'settings',
      600000
    );
  }

  function updateSettings(settingsData) {
    return request('/api/partners/' + config.partnerId + '/settings', {
      method: 'PUT',
      body: settingsData
    }).then(function(data) {
      cacheClear('settings');
      return data;
    });
  }

  // Support tickets
  function getTickets() {
    return fetchWithCache(
      '/api/partners/' + config.partnerId + '/tickets',
      'tickets',
      120000 // 2 min
    );
  }

  function createTicket(ticketData) {
    return request('/api/partners/' + config.partnerId + '/tickets', {
      method: 'POST',
      body: ticketData
    }).then(function(data) {
      cacheClear('tickets');
      return data;
    });
  }

  // --- Webhook Receiver ---
  // Handles incoming real-time data pushes from backend

  var webhookHandlers = {};

  function onWebhook(eventType, handler) {
    if (!webhookHandlers[eventType]) {
      webhookHandlers[eventType] = [];
    }
    webhookHandlers[eventType].push(handler);
  }

  function handleWebhookEvent(event) {
    var type = event.type;
    var data = event.data;

    // Invalidate relevant cache
    var cacheMap = {
      'referral.created': ['dashboard_kpis'],
      'referral.updated': ['dashboard_kpis'],
      'referral.status_changed': ['dashboard_kpis'],
      'earning.created': ['earnings_all', 'earnings_month', 'earnings_quarter', 'earnings_year', 'dashboard_kpis'],
      'payout.processed': ['dashboard_kpis'],
      'notification.created': ['notifications'],
      'document.uploaded': ['documents']
    };

    var keysToInvalidate = cacheMap[type] || [];
    for (var i = 0; i < keysToInvalidate.length; i++) {
      cacheClear(keysToInvalidate[i]);
    }

    // Fire registered handlers
    var handlers = webhookHandlers[type] || [];
    for (var j = 0; j < handlers.length; j++) {
      try {
        handlers[j](data);
      } catch (e) {
        console.error('Webhook handler error:', type, e);
      }
    }

    // Fire wildcard handlers
    var wildcardHandlers = webhookHandlers['*'] || [];
    for (var k = 0; k < wildcardHandlers.length; k++) {
      try {
        wildcardHandlers[k](event);
      } catch (e) {
        console.error('Webhook wildcard handler error:', e);
      }
    }
  }

  // --- WebSocket Connection ---
  // For real-time data push from backend

  var ws = null;
  var wsReconnectTimer = null;
  var wsReconnectDelay = 1000;

  function connectWebSocket(url) {
    if (ws) ws.close();

    try {
      ws = new WebSocket(url);
    } catch (e) {
      console.error('WebSocket connection failed:', e);
      return;
    }

    ws.onopen = function() {
      wsReconnectDelay = 1000;
      // Authenticate
      if (config.authToken) {
        ws.send(JSON.stringify({
          type: 'auth',
          token: config.authToken,
          partnerId: config.partnerId
        }));
      }
    };

    ws.onmessage = function(msg) {
      try {
        var event = JSON.parse(msg.data);
        handleWebhookEvent(event);
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    ws.onclose = function() {
      // Exponential backoff reconnect
      wsReconnectTimer = setTimeout(function() {
        wsReconnectDelay = Math.min(wsReconnectDelay * 2, 30000);
        connectWebSocket(url);
      }, wsReconnectDelay);
    };

    ws.onerror = function() {
      ws.close();
    };
  }

  function disconnectWebSocket() {
    if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
    if (ws) ws.close();
    ws = null;
  }

  // --- Auto-Refresh ---

  function startAutoRefresh(key, fetchFn, intervalMs) {
    stopAutoRefresh(key);
    refreshTimers[key] = setInterval(function() {
      fetchFn().catch(function(err) {
        console.error('Auto-refresh error for ' + key + ':', err);
      });
    }, intervalMs || config.refreshInterval);
  }

  function stopAutoRefresh(key) {
    if (key) {
      if (refreshTimers[key]) clearInterval(refreshTimers[key]);
      delete refreshTimers[key];
    } else {
      var keys = Object.keys(refreshTimers);
      for (var i = 0; i < keys.length; i++) {
        clearInterval(refreshTimers[keys[i]]);
      }
      refreshTimers = {};
    }
  }

  // --- Initialization ---

  function init(opts) {
    if (opts) configure(opts);

    if (!config.baseUrl || !config.partnerId) {
      console.warn('PortalAPI: baseUrl and partnerId required. Running in demo mode with mock data.');
      return Promise.resolve({ mode: 'demo' });
    }

    // Start auto-refresh for key data
    startAutoRefresh('dashboard', getDashboardKPIs, 300000);
    startAutoRefresh('notifications', getNotifications, 60000);

    // Connect WebSocket if available
    if (config.baseUrl) {
      var wsUrl = config.baseUrl.replace(/^http/, 'ws') + '/ws/partners/' + config.partnerId;
      connectWebSocket(wsUrl);
    }

    return getPartnerProfile();
  }

  function destroy() {
    stopAutoRefresh();
    disconnectWebSocket();
    cacheClear();
  }

  // --- Public API ---

  return {
    configure: configure,
    getConfig: getConfig,
    init: init,
    destroy: destroy,

    // Data fetchers
    getPartnerProfile: getPartnerProfile,
    getDashboardKPIs: getDashboardKPIs,
    getReferrals: getReferrals,
    submitReferral: submitReferral,
    getEarnings: getEarnings,
    getPayouts: getPayouts,
    getDocuments: getDocuments,
    uploadDocument: uploadDocument,
    getNotifications: getNotifications,
    markNotificationRead: markNotificationRead,
    getSettings: getSettings,
    updateSettings: updateSettings,
    getTickets: getTickets,
    createTicket: createTicket,

    // Real-time
    onWebhook: onWebhook,
    handleWebhookEvent: handleWebhookEvent,
    connectWebSocket: connectWebSocket,
    disconnectWebSocket: disconnectWebSocket,

    // Cache management
    cacheClear: cacheClear,

    // Auto-refresh
    startAutoRefresh: startAutoRefresh,
    stopAutoRefresh: stopAutoRefresh,

    // Low-level (for custom endpoints)
    request: request
  };
})();

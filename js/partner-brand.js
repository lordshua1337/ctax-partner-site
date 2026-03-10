// -- PARTNER BRAND PERSISTENCE --
// Save firm branding once, auto-fill every builder.
// Stores: firmName, phone, email, website, tagline, brandColor, logoDataUrl

var PartnerBrand = (function() {
  var STORAGE_KEY = 'ctax_partner_brand';

  var DEFAULTS = {
    firmName: '',
    phone: '',
    email: '',
    website: '',
    tagline: '',
    brandColor: '#0B5FD8',
    logoDataUrl: ''
  };

  function load() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return Object.assign({}, DEFAULTS);
      // Merge with defaults so new fields get picked up
      var result = Object.assign({}, DEFAULTS);
      Object.keys(stored).forEach(function(k) {
        if (stored[k] !== undefined && stored[k] !== null) {
          result[k] = stored[k];
        }
      });
      return result;
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function save(data) {
    var current = load();
    var updated = Object.assign({}, current);
    Object.keys(data).forEach(function(k) {
      if (data[k] !== undefined) {
        updated[k] = data[k];
      }
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('PartnerBrand save error:', e);
    }
    return updated;
  }

  function hasProfile() {
    var brand = load();
    return !!(brand.firmName && brand.firmName.trim());
  }

  function hasLogo() {
    var brand = load();
    return !!(brand.logoDataUrl && brand.logoDataUrl.length > 100);
  }

  // Save logo as data URL from a File object
  function saveLogo(file, callback) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      save({ logoDataUrl: e.target.result });
      if (callback) callback(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    load: load,
    save: save,
    hasProfile: hasProfile,
    hasLogo: hasLogo,
    saveLogo: saveLogo,
    clear: clear
  };
})();

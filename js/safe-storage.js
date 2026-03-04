// ══════════════════════════════════════════
//  SAFE STORAGE UTILITIES
//  Centralized localStorage helpers with
//  error surfacing and quota protection
// ══════════════════════════════════════════

/**
 * Safely read and parse JSON from localStorage.
 * Returns fallback on any error (corrupt data, missing key, etc.)
 *
 * @param {string} key - localStorage key
 * @param {*} fallback - default value if read fails
 * @returns {*} parsed value or fallback
 */
function safeStorageGet(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Storage] Failed to read "' + key + '":', e.message);
    return fallback;
  }
}

/**
 * Safely write JSON to localStorage.
 * Warns on quota exceeded or other write failures.
 *
 * @param {string} key - localStorage key
 * @param {*} value - value to JSON-serialize and store
 * @returns {boolean} true if write succeeded
 */
function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('[Storage] Failed to write "' + key + '":', e.message);
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.warn('[Storage] localStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * Safely remove a key from localStorage.
 *
 * @param {string} key - localStorage key to remove
 */
function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[Storage] Failed to remove "' + key + '":', e.message);
  }
}

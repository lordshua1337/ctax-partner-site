// --- Portal navigation ---
function portalNav(el, secId) {
  document.querySelectorAll('.portal-nav-item').forEach(function(a) { a.classList.remove('pni-active'); });
  el.classList.add('pni-active');
  document.querySelectorAll('.portal-section').forEach(function(s) { s.classList.remove('portal-sec-active'); });
  var sec = document.getElementById(secId);
  if (sec) sec.classList.add('portal-sec-active');
  document.querySelector('.portal-sidebar').classList.remove('portal-sb-open');
  document.querySelector('.portal-main').scrollTo(0, 0);
}

// --- Partner brand ---
function initPortalBrand() {
  var input = document.getElementById('portal-logo-input');
  var preview = document.getElementById('portal-brand-preview');
  var label = document.getElementById('portal-brand-text');
  var drop = document.getElementById('portal-brand-drop');
  if (!input || input._wired) return;
  input._wired = true;

  input.addEventListener('change', function() {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      showLogo(dataUrl);
      extractColors(dataUrl, function(colors) {
        if (colors.length > 1) {
          showColorPicker(colors, dataUrl);
        } else {
          applyAccent(colors[0]);
        }
      });
    };
    reader.readAsDataURL(file);
  });

  function showLogo(url) {
    preview.innerHTML = '<img src="' + url + '" alt="Logo" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px">';
    label.textContent = 'Change logo';
    drop.classList.add('portal-brand-loaded');
  }

  function showColorPicker(colors, logoUrl) {
    // Remove existing picker
    var old = document.getElementById('portal-color-picker');
    if (old) old.remove();

    var picker = document.createElement('div');
    picker.id = 'portal-color-picker';
    picker.className = 'portal-cpicker';
    picker.innerHTML = '<div class="portal-cpicker-title">Pick your brand color</div><div class="portal-cpicker-swatches" id="portal-cpicker-swatches"></div>';

    var swatches = picker.querySelector('#portal-cpicker-swatches');
    colors.forEach(function(color) {
      var btn = document.createElement('button');
      btn.className = 'portal-cpicker-swatch';
      btn.style.background = color;
      btn.onclick = function() {
        applyAccent(color);
        picker.remove();
      };
      swatches.appendChild(btn);
    });

    drop.parentElement.appendChild(picker);
  }

  function applyAccent(color) {
    var layout = document.querySelector('.portal-layout');
    if (!layout) return;
    var rgb = hexToRgb(color);
    layout.style.setProperty('--pa', color);
    layout.style.setProperty('--pa-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
    layout.classList.add('portal-branded');

    // Remove picker if still showing
    var picker = document.getElementById('portal-color-picker');
    if (picker) picker.remove();
  }

  function extractColors(dataUrl, cb) {
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      var px = ctx.getImageData(0, 0, 64, 64).data;

      // Collect saturated pixels with hue info
      var buckets = {};
      for (var i = 0; i < px.length; i += 8) {
        var r = px[i], g = px[i+1], b = px[i+2], a = px[i+3];
        if (a < 128) continue;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var l = (max + min) / 2;
        if (l < 25 || l > 235) continue;
        var d = max - min;
        var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l / 255 - 1));
        if (s < 50) continue;

        var h = 0;
        if (d > 0) {
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          else if (max === g) h = ((b - r) / d + 2) * 60;
          else h = ((r - g) / d + 4) * 60;
        }

        // Bucket by 30-degree hue slices
        var bucket = Math.floor(h / 30) * 30;
        if (!buckets[bucket]) buckets[bucket] = { count: 0, totalS: 0, bestS: 0, bestColor: '' };
        buckets[bucket].count++;
        buckets[bucket].totalS += s;
        if (s > buckets[bucket].bestS) {
          buckets[bucket].bestS = s;
          buckets[bucket].bestColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
      }

      // Sort buckets by pixel count
      var sorted = Object.keys(buckets).map(function(k) {
        return { hue: k, count: buckets[k].count, color: buckets[k].bestColor, s: buckets[k].bestS };
      }).sort(function(a, b) { return b.count - a.count; });

      if (sorted.length === 0) {
        cb(['#888888']);
        return;
      }

      // Top color is always included
      var results = [sorted[0].color];

      // If there's a strong second color (at least 25% of the top), include it
      if (sorted.length > 1 && sorted[1].count > sorted[0].count * 0.25) {
        // Make sure it's visually different (different hue bucket)
        var hueDiff = Math.abs(parseInt(sorted[0].hue) - parseInt(sorted[1].hue));
        if (hueDiff > 30 || hueDiff === 0) {
          // Actually check if it's far enough apart
          if (hueDiff >= 60 || (360 - hueDiff) >= 60) {
            results.push(sorted[1].color);
          }
        }
      }

      cb(results);
    };
    img.src = dataUrl;
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r: 136, g: 136, b: 136 };
  }
}

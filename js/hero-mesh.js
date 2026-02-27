// Interactive magnetic mesh for hero background
// Points form a triangle grid; cursor displaces nearby points with spring physics.
(function () {
  var canvas = document.getElementById('hero-mesh');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // --- Config ---
  var SPACING = 44;
  var MOUSE_RADIUS = 40;
  var MOUSE_STRENGTH = 14;
  var SPRING = 0.025;
  var DAMPING = 0.88;
  var LINE_BASE_ALPHA = 0.045;
  var LINE_HOVER_ALPHA = 0.22;
  var DOT_RADIUS = 1.2;
  var DOT_HOVER_RADIUS = 2.4;

  // Brand colors
  var COLOR_REST = { r: 75, g: 163, b: 255 };    // --sky
  var COLOR_ACTIVE = { r: 0, g: 200, b: 224 };    // --cyan

  var points = [];
  var cols = 0;
  var rows = 0;
  var mouse = { x: -9999, y: -9999 };
  var heroWrap = canvas.parentElement;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var raf;
  var w = 0;
  var h = 0;

  function resize() {
    var rect = heroWrap.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function buildGrid() {
    points = [];
    var rowH = SPACING * Math.sin(Math.PI / 3);
    cols = Math.ceil(w / SPACING) + 2;
    rows = Math.ceil(h / rowH) + 2;
    var offsetX = -SPACING;
    var offsetY = -rowH;

    for (var r = 0; r < rows; r++) {
      var shift = (r % 2) * (SPACING * 0.5);
      for (var c = 0; c < cols; c++) {
        var ox = offsetX + c * SPACING + shift;
        var oy = offsetY + r * rowH;
        points.push({
          ox: ox,
          oy: oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          row: r,
          col: c
        });
      }
    }
  }

  function getPoint(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return points[r * cols + c];
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    // Update physics
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      // Mouse repulsion
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        var force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
        var angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.06;
        p.vy += Math.sin(angle) * force * 0.06;
      }

      // Spring back to origin
      p.vx += (p.ox - p.x) * SPRING;
      p.vy += (p.oy - p.y) * SPRING;

      // Damping
      p.vx *= DAMPING;
      p.vy *= DAMPING;

      // Integrate
      p.x += p.vx;
      p.y += p.vy;
    }

    // Draw triangles (lines between neighbors)
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var r = p.row;
      var c = p.col;

      // Right neighbor
      var right = getPoint(r, c + 1);
      if (right) drawLine(p, right);

      // Bottom-left and bottom-right (depends on even/odd row)
      if (r % 2 === 0) {
        var bl = getPoint(r + 1, c - 1);
        var br = getPoint(r + 1, c);
        if (bl) drawLine(p, bl);
        if (br) drawLine(p, br);
      } else {
        var bl = getPoint(r + 1, c);
        var br = getPoint(r + 1, c + 1);
        if (bl) drawLine(p, bl);
        if (br) drawLine(p, br);
      }
    }

    // Draw dots
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var disp = Math.sqrt(
        (p.x - p.ox) * (p.x - p.ox) + (p.y - p.oy) * (p.y - p.oy)
      );
      var t = Math.min(disp / 30, 1);
      var distMouse = Math.sqrt(
        (p.x - mouse.x) * (p.x - mouse.x) +
        (p.y - mouse.y) * (p.y - mouse.y)
      );
      var proximity = Math.max(0, 1 - distMouse / MOUSE_RADIUS);
      var dotAlpha = 0.08 + proximity * 0.5 + t * 0.3;
      var dotR = DOT_RADIUS + proximity * (DOT_HOVER_RADIUS - DOT_RADIUS);

      var cr = COLOR_REST.r + (COLOR_ACTIVE.r - COLOR_REST.r) * t;
      var cg = COLOR_REST.g + (COLOR_ACTIVE.g - COLOR_REST.g) * t;
      var cb = COLOR_REST.b + (COLOR_ACTIVE.b - COLOR_REST.b) * t;

      ctx.beginPath();
      ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + dotAlpha.toFixed(3) + ')';
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  function drawLine(a, b) {
    var mx = (a.x + b.x) * 0.5;
    var my = (a.y + b.y) * 0.5;
    var distMouse = Math.sqrt(
      (mx - mouse.x) * (mx - mouse.x) + (my - mouse.y) * (my - mouse.y)
    );
    var proximity = Math.max(0, 1 - distMouse / (MOUSE_RADIUS * 1.4));

    // Displacement-based color shift
    var dispA = Math.sqrt(
      (a.x - a.ox) * (a.x - a.ox) + (a.y - a.oy) * (a.y - a.oy)
    );
    var dispB = Math.sqrt(
      (b.x - b.ox) * (b.x - b.ox) + (b.y - b.oy) * (b.y - b.oy)
    );
    var t = Math.min((dispA + dispB) / 50, 1);

    var alpha = LINE_BASE_ALPHA + proximity * (LINE_HOVER_ALPHA - LINE_BASE_ALPHA);
    var cr = COLOR_REST.r + (COLOR_ACTIVE.r - COLOR_REST.r) * t;
    var cg = COLOR_REST.g + (COLOR_ACTIVE.g - COLOR_REST.g) * t;
    var cb = COLOR_REST.b + (COLOR_ACTIVE.b - COLOR_REST.b) * t;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + alpha.toFixed(3) + ')';
    ctx.lineWidth = 0.8 + proximity * 0.6;
    ctx.stroke();
  }

  // Mouse tracking on the hero wrapper (not the canvas, since canvas is pointer-events:none)
  heroWrap.addEventListener('mousemove', function (e) {
    var rect = heroWrap.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroWrap.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  heroWrap.addEventListener('touchmove', function (e) {
    var rect = heroWrap.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  heroWrap.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Skip on mobile
  if (window.innerWidth <= 768) return;

  // Init
  window.addEventListener('resize', resize);
  resize();
  tick();

  // Pause when not visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(tick);
    }
  });
})();

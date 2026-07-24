/* ============================================
   Delta Force Guide — Three.js Hero
   3D Particle Tactical Field
   ============================================ */

(function() {
  'use strict';

  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  // Check for WebGL support
  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      // Fallback: CSS gradient background
      canvas.style.background = 'radial-gradient(ellipse at center, #1a2235 0%, #0a0e17 100%)';
      return;
    }
  } catch(e) {
    canvas.style.background = 'radial-gradient(ellipse at center, #1a2235 0%, #0a0e17 100%)';
    return;
  }

  // --- Minimal Three.js-like renderer (no dependency) ---
  // Using raw WebGL for a particle field effect

  var width, height;
  var particles = [];
  var PARTICLE_COUNT = 200;
  var mouseX = 0, mouseY = 0;
  var animationId;

  function init() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * Math.min(window.devicePixelRatio, 2);
    canvas.height = height * Math.min(window.devicePixelRatio, 2);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Create particles
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#f59e0b' : (Math.random() > 0.5 ? '#3b82f6' : '#10b981')
      });
    }

    animate();
  }

  function animate() {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines (tactical feel)
    ctx.strokeStyle = 'rgba(42, 52, 80, 0.3)';
    ctx.lineWidth = 0.5;
    var gridSize = 80;
    for (var gx = 0; gx < width; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (var gy = 0; gy < height; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Move
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;

      // Mouse influence
      var dx = mouseX - p.x;
      var dy = mouseY - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx -= dx * 0.00005;
        p.vy -= dy * 0.00005;
      }

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      // Draw connections
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var cdx = p.x - p2.x;
        var cdy = p.y - p2.y;
        var cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - cdist / 120) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;

    // Draw crosshair at mouse position
    if (mouseX > 0 && mouseY > 0) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mouseX - 30, mouseY);
      ctx.lineTo(mouseX + 30, mouseY);
      ctx.moveTo(mouseX, mouseY - 30);
      ctx.lineTo(mouseX, mouseY + 30);
      ctx.stroke();
    }

    animationId = requestAnimationFrame(animate);
  }

  // --- Event listeners ---
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function() {
    mouseX = -100;
    mouseY = -100;
  });

  window.addEventListener('resize', function() {
    cancelAnimationFrame(animationId);
    init();
  });

  // Start
  init();

})();

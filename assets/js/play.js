(function () {
  "use strict";

  var letters = Array.prototype.slice.call(document.querySelectorAll("[data-letter]"));
  if (!letters.length) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var params = {
    speed: 0.7,
    gravity: 3050,
    bounce: 0.36,
    dropHeight: 240,
    stagger: 300,
    wobble: 25,
  };

  var rafId = null;
  var lastTime = null;
  var states = [];
  var SETTLE_VELOCITY = 40;

  function createState(el, now) {
    return {
      el: el,
      y: -params.dropHeight,
      vy: 0,
      jitter: 0.85 + Math.random() * 0.3,
      rotSign: Math.random() < 0.5 ? -1 : 1,
      startAt: now + Math.random() * params.stagger,
      started: false,
      settled: false,
    };
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    var now = performance.now();
    states = letters.map(function (el) {
      return createState(el, now);
    });
    states.forEach(function (s) {
      s.el.style.transition = "none";
      s.el.style.opacity = "0";
      s.el.style.transform = "translateY(" + s.y + "px)";
    });
    // force layout so the instant hide+reposition commits before the transition is restored
    void letters[0].offsetHeight;
    states.forEach(function (s) {
      s.el.style.transition = "";
    });
    lastTime = now;
    rafId = requestAnimationFrame(tick);
  }

  function tick(now) {
    var dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;
    var anyActive = false;

    states.forEach(function (s) {
      if (s.settled) return;
      anyActive = true;

      if (!s.started) {
        if (now < s.startAt) return;
        s.started = true;
        s.el.style.opacity = "1";
      }

      s.vy += params.gravity * params.speed * s.jitter * dt;
      s.y += s.vy * dt;

      if (s.y >= 0) {
        s.y = 0;
        s.vy = -s.vy * params.bounce;
        if (Math.abs(s.vy) < SETTLE_VELOCITY) {
          s.vy = 0;
          s.settled = true;
        }
      }

      var rot = s.settled
        ? 0
        : Math.max(-1, Math.min(1, s.vy / 1200)) * params.wobble * s.rotSign;
      s.el.style.transform = "translateY(" + s.y.toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg)";
    });

    if (anyActive) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function showSettled() {
    letters.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  var replayButton = document.getElementById("playReset");
  if (replayButton) {
    replayButton.addEventListener("click", function () {
      if (prefersReducedMotion) return;
      start();
    });
  }

  if (prefersReducedMotion) {
    showSettled();
  } else {
    start();
  }
})();

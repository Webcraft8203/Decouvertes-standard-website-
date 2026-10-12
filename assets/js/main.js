/* =============================================================
   DECOUVERTES — site scripts (vanilla, no dependencies)
   ============================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state + back-to-top ---------- */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  var ticking = false;
  var applyScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (toTop) toTop.classList.toggle("is-visible", y > 620);
    ticking = false;
  };
  var onScroll = function () {
    if (!ticking) { window.requestAnimationFrame(applyScroll); ticking = true; }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  applyScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Slide-out drawer ---------- */
  var drawer = document.querySelector(".drawer");
  var scrim = document.querySelector(".scrim");
  var openBtn = document.querySelector(".hamburger");
  var closeBtn = document.querySelector(".drawer__close");
  var setMenu = function (open) {
    if (!drawer || !scrim) return;
    drawer.classList.toggle("is-open", open);
    scrim.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };
  if (openBtn) openBtn.addEventListener("click", function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Inline video (plays in place — auto-starts when it scrolls into view) ---------- */
  var playInlineVideo = function (host, id, muted) {
    if (!host || !id || host.classList.contains("is-playing")) return;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0" + (muted ? "&mute=1" : "");
    iframe.title = "Video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    host.appendChild(iframe);
    host.classList.add("is-playing");
  };
  var videoTriggers = [].slice.call(document.querySelectorAll("[data-video]"));
  videoTriggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      playInlineVideo(btn.closest(".split__media"), btn.getAttribute("data-video"), false);
    });
  });
  if ("IntersectionObserver" in window && videoTriggers.length) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          playInlineVideo(en.target.closest(".split__media"), en.target.getAttribute("data-video"), true);
          vio.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    videoTriggers.forEach(function (btn) { vio.observe(btn); });
  }

  /* ---------- Hero slider ---------- */
  var hSlides = [].slice.call(document.querySelectorAll(".hero__slide"));
  var hDots = document.querySelector(".hero__dots");
  if (hSlides.length > 1 && hDots) {
    var hIdx = 0, hTimer, hPaused = false, HERO_MS = 6500;
    var hCurrentEl = document.querySelector("[data-hero-current]");
    var hTotalEl = document.querySelector("[data-hero-total]");
    var hPauseBtn = document.querySelector(".hero__pause");
    if (hTotalEl) hTotalEl.textContent = hSlides.length;
    hSlides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Slide " + (i + 1));
      if (i === 0) d.classList.add("is-active");
      d.addEventListener("click", function () { hGo(i); hReset(); });
      hDots.appendChild(d);
    });
    var hDotEls = [].slice.call(hDots.children);
    var hVideo = function () { return hSlides[hIdx].querySelector("video"); };
    /* Video slides load their film only when first shown, play it through
       once, then hand back to the slideshow. */
    function hPlayVideo() {
      var v = hVideo();
      if (!v || reduceMotion || v.dataset.failed) return;
      if (!v.getAttribute("src")) v.src = v.dataset.src;
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.dataset.failed = "1"; hReset(); });
    }
    function hSlideMs() {
      var v = hVideo();
      if (!v || reduceMotion || v.dataset.failed) return HERO_MS;
      return isFinite(v.duration) ? (v.duration - v.currentTime) * 1000 + 400 : 90000;
    }
    function hGo(n) {
      var oldV = hVideo();
      if (oldV) { oldV.pause(); if (oldV.readyState) oldV.currentTime = 0; }
      hSlides[hIdx].classList.remove("is-active");
      hDotEls[hIdx].classList.remove("is-active");
      hIdx = (n + hSlides.length) % hSlides.length;
      hSlides[hIdx].classList.add("is-active");
      hDotEls[hIdx].classList.add("is-active");
      if (hCurrentEl) hCurrentEl.textContent = hIdx + 1;
      if (!hPaused) hPlayVideo();
    }
    function hReset() {
      clearTimeout(hTimer);
      if (hPaused) return;
      hTimer = setTimeout(function () { hGo(hIdx + 1); hReset(); }, hSlideMs());
    }
    hSlides.forEach(function (slide) {
      var v = slide.querySelector("video");
      if (!v) return;
      v.addEventListener("loadedmetadata", function () { if (slide.classList.contains("is-active")) hReset(); });
      v.addEventListener("ended", function () { if (slide.classList.contains("is-active") && !hPaused) { hGo(hIdx + 1); hReset(); } });
      v.addEventListener("error", function () { v.dataset.failed = "1"; if (slide.classList.contains("is-active")) hReset(); });
    });
    var heroEl = document.querySelector(".hero");
    heroEl.addEventListener("mouseenter", function () { if (!hVideo()) clearTimeout(hTimer); });
    heroEl.addEventListener("mouseleave", hReset);
    if (hPauseBtn) {
      hPauseBtn.addEventListener("click", function () {
        hPaused = !hPaused;
        hPauseBtn.classList.toggle("is-paused", hPaused);
        hPauseBtn.setAttribute("aria-label", hPaused ? "Play slideshow" : "Pause slideshow");
        if (hPaused) { clearTimeout(hTimer); if (hVideo()) hVideo().pause(); }
        else { hPlayVideo(); hReset(); }
      });
    }
    hReset();
  }

  /* ---------- Capabilities carousel ---------- */
  var caps = document.querySelector(".caps");
  var prev = document.querySelector("[data-caps-prev]");
  var next = document.querySelector("[data-caps-next]");
  if (caps && prev && next) {
    var step = function () {
      var card = caps.querySelector(".cap");
      return card ? card.getBoundingClientRect().width + 32 : 340;
    };
    prev.addEventListener("click", function () { caps.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { caps.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* ---------- Track + dots slider (mobile/tablet swipe, reused by partners & people) ---------- */
  var initTrackDots = function (trackSel, dotsSel, label) {
    var track = document.querySelector(trackSel);
    var dots = document.querySelector(dotsSel);
    if (!track || !dots) return;
    var chips = [].slice.call(track.children);
    chips.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", label + " " + (i + 1));
      if (i === 0) d.classList.add("is-active");
      d.addEventListener("click", function () {
        track.scrollTo({ left: chips[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
      });
      dots.appendChild(d);
    });
    var dotEls = [].slice.call(dots.children);
    var ticking = false;
    var syncActive = function () {
      var mid = track.scrollLeft + track.clientWidth / 2;
      var closest = 0, best = Infinity;
      chips.forEach(function (chip, i) {
        var d = Math.abs((chip.offsetLeft - track.offsetLeft + chip.offsetWidth / 2) - mid);
        if (d < best) { best = d; closest = i; }
      });
      dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === closest); });
      ticking = false;
    };
    track.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(syncActive); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", syncActive);
  };
  initTrackDots("[data-partners]", "[data-partners-dots]", "Show logo");
  initTrackDots("[data-people]", "[data-people-dots]", "Show leader");

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  var sweep = function () {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add("is-visible");
    });
  };
  setTimeout(sweep, 1500);
  window.addEventListener("load", function () { setTimeout(sweep, 200); });

  /* ---------- Count-up ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.innerHTML = target + '<span class="u">' + suffix + "</span>"; return; }
    var start = performance.now(), dur = 1500;
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var val = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.innerHTML = val + '<span class="u">' + suffix + "</span>";
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Certification filter ---------- */
  var chips = document.querySelectorAll(".cert-chip");
  var certCards = document.querySelectorAll(".cert-card");
  if (chips.length && certCards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var f = chip.getAttribute("data-filter");
        certCards.forEach(function (card) {
          card.classList.toggle("is-hidden", !(f === "all" || card.getAttribute("data-cat") === f));
        });
      });
    });
  }

  /* ---------- Image fallback ---------- */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      var host = img.closest(".hero__media,.cap__img,.news-card__thumb,.split__media,.page-hero__media,.post-card__thumb,figure");
      if (host) host.style.background = "linear-gradient(120deg,#2b3538,#3a4a3f,#5a3a1f)";
      img.style.display = "none";
    });
  });

  /* ---------- Footer year ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

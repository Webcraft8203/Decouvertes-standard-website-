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
    function hGo(n) {
      hSlides[hIdx].classList.remove("is-active");
      hDotEls[hIdx].classList.remove("is-active");
      hIdx = (n + hSlides.length) % hSlides.length;
      hSlides[hIdx].classList.add("is-active");
      hDotEls[hIdx].classList.add("is-active");
      if (hCurrentEl) hCurrentEl.textContent = hIdx + 1;
    }
    function hReset() {
      clearInterval(hTimer);
      if (hPaused) return;
      hTimer = setInterval(function () { hGo(hIdx + 1); }, HERO_MS);
    }
    var heroEl = document.querySelector(".hero");
    heroEl.addEventListener("mouseenter", function () { clearInterval(hTimer); });
    heroEl.addEventListener("mouseleave", hReset);
    if (hPauseBtn) {
      hPauseBtn.addEventListener("click", function () {
        hPaused = !hPaused;
        hPauseBtn.classList.toggle("is-paused", hPaused);
        hPauseBtn.setAttribute("aria-label", hPaused ? "Play slideshow" : "Pause slideshow");
        if (hPaused) clearInterval(hTimer); else hReset();
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

  /* ---------- Partners slider (mobile/tablet swipe + dots) ---------- */
  var pTrack = document.querySelector("[data-partners]");
  var pDots = document.querySelector("[data-partners-dots]");
  if (pTrack && pDots) {
    var pChips = [].slice.call(pTrack.children);
    pChips.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Show logo " + (i + 1));
      if (i === 0) d.classList.add("is-active");
      d.addEventListener("click", function () {
        pTrack.scrollTo({ left: pChips[i].offsetLeft - pTrack.offsetLeft, behavior: "smooth" });
      });
      pDots.appendChild(d);
    });
    var pDotEls = [].slice.call(pDots.children);
    var pTicking = false;
    var pSyncActive = function () {
      var mid = pTrack.scrollLeft + pTrack.clientWidth / 2;
      var closest = 0, best = Infinity;
      pChips.forEach(function (chip, i) {
        var d = Math.abs((chip.offsetLeft - pTrack.offsetLeft + chip.offsetWidth / 2) - mid);
        if (d < best) { best = d; closest = i; }
      });
      pDotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === closest); });
      pTicking = false;
    };
    pTrack.addEventListener("scroll", function () {
      if (!pTicking) { window.requestAnimationFrame(pSyncActive); pTicking = true; }
    }, { passive: true });
    window.addEventListener("resize", pSyncActive);
  }

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

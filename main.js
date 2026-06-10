/* =========================================================================
   STUDIO [NOME STUDIO] — JavaScript condiviso (vanilla, nessuna libreria)
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- 1. Menu mobile ------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- 2. Micro-animazioni allo scroll (rispetta reduced motion) */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- 3. Filtro professionisti per ambito ---------------------- */
  var filterbar = document.querySelector("[data-filterbar]");
  if (filterbar) {
    var cards = document.querySelectorAll("[data-ambito]");
    filterbar.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-filter]");
      if (!btn) return;
      filterbar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (c) {
        c.classList.toggle("is-hidden", f !== "tutti" && c.getAttribute("data-ambito") !== f);
      });
    });
  }

  /* ---------- 4. Pagina Prenota: scelta professionista → embed --------- */
  var picker = document.querySelector("[data-booking-picker]");
  if (picker) {
    var slots = document.querySelectorAll(".embed-slot");
    var showSlot = function (id) {
      slots.forEach(function (s) { s.classList.toggle("is-active", s.id === id); });
      var active = document.getElementById(id);
      if (active) active.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
    };
    picker.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-embed]");
      if (!btn) return;
      picker.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      showSlot(btn.getAttribute("data-embed"));
    });
    /* Deep-link: prenota.html?pro=p3 apre direttamente il professionista */
    var params = new URLSearchParams(window.location.search);
    var pro = params.get("pro");
    if (pro) {
      var target = picker.querySelector('button[data-embed="embed-' + pro + '"]');
      if (target) target.click();
    }
  }

  /* ---------- 5. Banner cookie (GDPR: consenso PRIMA dei tracciamenti) -
     Gli script di terze parti non necessari vanno inseriti così:
       <script type="text/plain" data-consent="statistics" src="..."></script>
     e vengono attivati SOLO dopo il consenso dell'utente.               */
  var KEY = "studio-cookie-consent"; // "all" | "necessary"
  var banner = document.getElementById("cookie-banner");

  function activateConsentScripts() {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(function (old) {
      var s = document.createElement("script");
      if (old.src) s.src = old.src; else s.textContent = old.textContent;
      document.head.appendChild(s);
      old.remove();
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage non disponibile */ }

  if (saved === "all") {
    activateConsentScripts();
  } else if (!saved && banner) {
    banner.classList.add("is-visible");
  }

  if (banner) {
    banner.addEventListener("click", function (ev) {
      var choice = ev.target.closest("button[data-consent-choice]");
      if (!choice) return;
      var value = choice.getAttribute("data-consent-choice");
      try { localStorage.setItem(KEY, value); } catch (e) {}
      if (value === "all") activateConsentScripts();
      banner.classList.remove("is-visible");
    });
  }

  /* ---------- 6. Anno corrente nel footer ------------------------------ */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

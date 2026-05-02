/* ═══════════════════════════════════════════════════════════
   DEVIATION MATRIX — Onboarding Walkthrough
   Drop-in: add  <script src="js/onboarding.js"></script>
   just before </body> (after all other scripts).
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Tour steps ─────────────────────────────────────────── */
  const STEPS = [
    {
      target: '.hdr',
      title: '👋 Welcome to Deviation Matrix',
      body: 'Your all-in-one tool for planning <strong>Once Human</strong> Deviation fusions — inventory, simulation, blueprints, and a full trait encyclopedia.',
      placement: 'bottom',
    },
    {
      target: '.nav',
      title: '🗂️ Four Power Tabs',
      body: '<strong>INVENTORY</strong> tracks your Deviations. <strong>FUSION SIM</strong> calculates odds live. <strong>BLUEPRINT</strong> maps the path to your dream Deviation. <strong>TRAIT ENC.</strong> is a searchable trait database.',
      placement: 'bottom',
    },
    {
      target: '#tab-inventory .sh:first-child',
      title: '➕ Add a Deviation',
      body: 'Pick a species from the dropdown — its type fills automatically. Set your Skill ⭐ and Activity ⭐ stars, pick up to 3 trait slots, then hit <em>+ ADD TO INVENTORY</em>.',
      placement: 'bottom',
      tab: 'inventory',
    },
    {
      target: '#tab-inventory .collapse-hdr:nth-of-type(1)',
      title: '🐾 Animals & Furniture (Collapsed)',
      body: 'These counters track your Slot 3 fusion materials. Click the arrow to expand. They start collapsed to keep things tidy.',
      placement: 'bottom',
      tab: 'inventory',
      expandTarget: 'animals-body',
    },
    {
      target: '#tab-inventory .fbar',
      title: '🔍 Filter Your Inventory',
      body: 'Search by name, filter by type (Combat / Territory / Crafting), fuse count, Skill stars, or Activity stars. Combine filters freely.',
      placement: 'top',
      tab: 'inventory',
    },
    {
      target: '#tab-inventory .btn-p',
      title: '📤 Export / Import XLSX',
      body: 'Back up your whole inventory to an Excel file or restore it on another device — no account needed.',
      placement: 'top',
      tab: 'inventory',
    },
    {
      target: '.tbox',
      title: '⏱️ Fusion Countdown Timer',
      body: 'Hit <strong>START</strong> for a 5-minute timer that mirrors the in-game fusion timer. When it ends, parents and materials are automatically consumed from your inventory.',
      placement: 'bottom',
      tab: 'fusion',
    },
    {
      target: '.fl',
      title: '🧬 Select Your Parents',
      body: 'Choose a <strong>Left Parent</strong> (loses one fuse) and a <strong>Right Parent</strong> (destroyed). The simulator will show live species odds and stat ranges.',
      placement: 'bottom',
      tab: 'fusion',
    },
    {
      target: '#mat-slots',
      title: '🧪 Middle Tube Materials',
      body: 'Add up to 3 materials. Materials matching a parent\'s species shift the species odds. Materials with desired traits boost trait pass-down. Materials with no matching traits add +10% "Clean" bonus to other slots.',
      placement: 'top',
      tab: 'fusion',
    },
    {
      target: '.bps',
      title: '🏗️ Blueprint Architect',
      body: 'Set a target Deviation, desired skill/activity stars, and up to 3 traits. Hit <em>GENERATE BLUEPRINT</em> to see which inventory Deviations or materials can donate each trait — missing donors are highlighted.',
      placement: 'bottom',
      tab: 'blueprint',
    },
    {
      target: '#enc-s',
      title: '📖 Trait Encyclopedia',
      body: 'Search all traits by name, category, source, or effect. Use the category sidebar to filter by General, Combat, Territory, Crafting, Animal, Furniture, or Variation.',
      placement: 'bottom',
      tab: 'encyclopedia',
    },
    {
      target: '.hdr .hs',
      title: '✅ You\'re All Set!',
      body: 'Your inventory auto-saves to <strong>localStorage</strong> — no server needed. Start by adding your first Deviation in the <em>Inventory</em> tab. Good luck, Outlander! 🌿',
      placement: 'bottom',
      tab: 'inventory',
    },
  ];

  /* ── State ──────────────────────────────────────────────── */
  let currentStep = 0;
  let overlay, spotlight, card, skipBtn, prevBtn, nextBtn, stepCounter;

  /* ── Helpers ─────────────────────────────────────────────── */
  function switchTab(tabName) {
    // Mirrors the global sw() function in the app
    if (typeof sw === 'function') {
      const btn = document.querySelector(`.tb[onclick*="'${tabName}'"]`);
      if (btn) sw(tabName, btn);
    }
  }

  function getTargetEl(selector) {
    return document.querySelector(selector);
  }

  function getRect(el) {
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
      height: r.height,
    };
  }

  /* ── Build DOM ───────────────────────────────────────────── */
  function buildUI() {
    // Dark overlay
    overlay = document.createElement('div');
    overlay.id = 'ob-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '9000',
      pointerEvents: 'none',
    });

    // SVG spotlight mask
    spotlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spotlight.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    Object.assign(spotlight.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      zIndex: '9001', pointerEvents: 'none',
    });
    spotlight.innerHTML = `
      <defs>
        <mask id="ob-mask">
          <rect width="100%" height="100%" fill="white"/>
          <rect id="ob-hole" rx="6" fill="black"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,8,20,0.82)" mask="url(#ob-mask)"/>
    `;

    // Tooltip card
    card = document.createElement('div');
    card.id = 'ob-card';
    card.innerHTML = `
      <div id="ob-title"></div>
      <div id="ob-body"></div>
      <div id="ob-footer">
        <span id="ob-counter"></span>
        <div id="ob-btns">
          <button id="ob-skip">Skip tour</button>
          <button id="ob-prev">← Back</button>
          <button id="ob-next">Next →</button>
        </div>
      </div>
    `;

    injectStyles();
    document.body.append(overlay, spotlight, card);

    skipBtn = document.getElementById('ob-skip');
    prevBtn = document.getElementById('ob-prev');
    nextBtn = document.getElementById('ob-next');
    stepCounter = document.getElementById('ob-counter');

    skipBtn.addEventListener('click', endTour);
    prevBtn.addEventListener('click', () => gotoStep(currentStep - 1));
    nextBtn.addEventListener('click', () => gotoStep(currentStep + 1));
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      #ob-card {
        position: fixed;
        z-index: 9100;
        background: linear-gradient(135deg, rgba(0,18,32,0.98) 0%, rgba(0,30,50,0.98) 100%);
        border: 1px solid #00f5ff55;
        border-radius: 8px;
        padding: 20px 22px 16px;
        max-width: 340px;
        min-width: 260px;
        box-shadow: 0 0 0 1px #00f5ff22, 0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(0,245,255,0.08);
        font-family: 'Share Tech Mono', 'Courier New', monospace;
        color: #c8d8e8;
        animation: ob-fadein 0.22s ease;
        pointer-events: all;
      }
      @keyframes ob-fadein {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      #ob-title {
        font-family: 'Orbitron', monospace;
        font-size: 13px;
        font-weight: 700;
        color: #00f5ff;
        margin-bottom: 10px;
        letter-spacing: 0.04em;
        line-height: 1.4;
      }
      #ob-body {
        font-size: 12.5px;
        line-height: 1.65;
        color: #a8bfcc;
        margin-bottom: 16px;
      }
      #ob-body strong { color: #00f5ff; }
      #ob-body em    { color: #b8a0ff; font-style: normal; }
      #ob-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      #ob-counter {
        font-size: 10px;
        color: #4a6070;
        font-family: 'Orbitron', monospace;
        letter-spacing: 0.1em;
        white-space: nowrap;
      }
      #ob-btns { display: flex; gap: 6px; align-items: center; }
      #ob-skip {
        background: none;
        border: none;
        color: #4a6070;
        font-size: 10px;
        cursor: pointer;
        padding: 4px 6px;
        font-family: inherit;
        text-decoration: underline;
        transition: color 0.2s;
      }
      #ob-skip:hover { color: #8899aa; }
      #ob-prev, #ob-next {
        background: none;
        border: 1px solid #00f5ff44;
        color: #00f5ff;
        font-family: 'Orbitron', monospace;
        font-size: 10px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 3px;
        cursor: pointer;
        letter-spacing: 0.06em;
        transition: background 0.18s, border-color 0.18s;
      }
      #ob-prev:hover, #ob-next:hover {
        background: rgba(0,245,255,0.08);
        border-color: #00f5ffaa;
      }
      #ob-prev:disabled { opacity: 0.25; cursor: default; }
      #ob-next { background: rgba(0,245,255,0.07); }

      /* Spotlight ring */
      #ob-ring {
        position: fixed;
        border: 2px solid rgba(0,245,255,0.55);
        border-radius: 8px;
        box-shadow: 0 0 18px rgba(0,245,255,0.25);
        pointer-events: none;
        z-index: 9050;
        transition: all 0.3s cubic-bezier(.4,0,.2,1);
        animation: ob-pulse 2s ease-in-out infinite;
      }
      @keyframes ob-pulse {
        0%,100% { box-shadow: 0 0 14px rgba(0,245,255,0.25); }
        50%      { box-shadow: 0 0 28px rgba(0,245,255,0.5); }
      }

      /* Launch button */
      #ob-launch-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 8000;
        background: rgba(0,18,32,0.92);
        border: 1px solid #00f5ff55;
        color: #00f5ff;
        font-family: 'Orbitron', monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        padding: 9px 15px;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 0 16px rgba(0,245,255,0.15);
        transition: all 0.2s;
      }
      #ob-launch-btn:hover {
        background: rgba(0,40,60,0.95);
        border-color: #00f5ffaa;
        box-shadow: 0 0 24px rgba(0,245,255,0.25);
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Spotlight ring element ──────────────────────────────── */
  let ring = null;
  function ensureRing() {
    if (!ring) {
      ring = document.createElement('div');
      ring.id = 'ob-ring';
      document.body.appendChild(ring);
    }
  }

  function positionRing(el) {
    ensureRing();
    const PAD = 6;
    const r = el.getBoundingClientRect();
    Object.assign(ring.style, {
      top:    (r.top    - PAD) + 'px',
      left:   (r.left   - PAD) + 'px',
      width:  (r.width  + PAD * 2) + 'px',
      height: (r.height + PAD * 2) + 'px',
    });
    // Update SVG hole
    const hole = document.getElementById('ob-hole');
    if (hole) {
      hole.setAttribute('x',      r.left   - PAD);
      hole.setAttribute('y',      r.top    - PAD);
      hole.setAttribute('width',  r.width  + PAD * 2);
      hole.setAttribute('height', r.height + PAD * 2);
    }
  }

  function positionCard(targetEl, placement) {
    const PAD = 14;
    const ARROW_H = 0;
    const r = targetEl.getBoundingClientRect();
    const cw = card.offsetWidth  || 330;
    const ch = card.offsetHeight || 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top, left;

    if (placement === 'bottom') {
      top  = r.bottom + PAD + ARROW_H;
      left = r.left + r.width / 2 - cw / 2;
    } else {
      top  = r.top - ch - PAD - ARROW_H;
      left = r.left + r.width / 2 - cw / 2;
    }

    // Clamp within viewport
    left = Math.max(10, Math.min(left, vw - cw - 10));
    top  = Math.max(10, Math.min(top,  vh - ch - 10));

    card.style.top  = top  + 'px';
    card.style.left = left + 'px';
  }

  /* ── Navigate ────────────────────────────────────────────── */
  function gotoStep(index) {
    if (index < 0 || index >= STEPS.length) { endTour(); return; }
    currentStep = index;
    const step = STEPS[index];

    // Switch tab if needed
    if (step.tab) switchTab(step.tab);

    // Expand a collapsed section if needed
    if (step.expandTarget) {
      const body = document.getElementById(step.expandTarget);
      if (body && body.classList.contains('closed')) {
        const hdr = body.previousElementSibling;
        if (hdr) hdr.click();
      }
    }

    // Wait a tick for tab/expand animations
    setTimeout(() => {
      const el = getTargetEl(step.target);
      if (!el) { gotoStep(index + 1); return; }

      // Scroll target into view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        positionRing(el);

        // Update card content
        document.getElementById('ob-title').innerHTML = step.title;
        document.getElementById('ob-body').innerHTML  = step.body;
        stepCounter.textContent = `${index + 1} / ${STEPS.length}`;
        prevBtn.disabled = index === 0;
        nextBtn.textContent = index === STEPS.length - 1 ? 'Finish ✓' : 'Next →';

        // Reposition card after content renders
        requestAnimationFrame(() => positionCard(el, step.placement));
      }, 320);
    }, 80);
  }

  /* ── Start / End ─────────────────────────────────────────── */
  function startTour() {
    // Remove launch button
    const lb = document.getElementById('ob-launch-btn');
    if (lb) lb.remove();

    buildUI();
    gotoStep(0);
  }

  function endTour() {
    [overlay, spotlight, card, ring].forEach(function(el) { if (el) el.remove(); });
    overlay = spotlight = card = ring = null;
    localStorage.setItem('dm_tour_done', '1');
    return; // REMOVED: addLaunchButton restored the button blocking clicks
  }


  /* ── Launch button (persistent) ─────────────────────────── */
  function addLaunchButton() {
    if (document.getElementById('ob-launch-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'ob-launch-btn';
    btn.textContent = '? TOUR';
    btn.addEventListener('click', startTour);
    document.body.appendChild(btn);
  }

  /* ── Auto-launch on first visit ──────────────────────────── */
  window.addEventListener('DOMContentLoaded', () => {
    // Only auto-start tour on direct visits to the root URL (no hash)
    // Hash navigation should land directly on the intended tab without the tour interfering
    if (!localStorage.getItem('dm_tour_done') && !location.hash) {
      setTimeout(startTour, 600);
    }
  });

  /* Expose globally so the tour can be re-triggered from console */
  window.startDeviationTour = startTour;
})();

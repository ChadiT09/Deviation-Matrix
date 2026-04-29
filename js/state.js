/**
 * js/state.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Application state, persistence helpers, and shared utilities.
 * All other modules read/write through these exports.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ════════ PERSISTENT STATE ════════
var inv       = JSON.parse(localStorage.getItem('oh4_inv')  || '[]');
var matCounts = JSON.parse(localStorage.getItem('oh4_matc') || '{}');

// ════════ FUSION SNAPSHOT (undo support) ════════
var fusionSnapshot = null;

function takeFusionSnapshot() {
  fusionSnapshot = {
    inv:         JSON.parse(JSON.stringify(inv)),
    matCounts:   JSON.parse(JSON.stringify(matCounts)),
    matSlotsF:   JSON.parse(JSON.stringify(matSlotsF)),
    timerRem:    timerRem,
    timerRunning: timerRunning
  };
}

function undoFusion() {
  if (!fusionSnapshot) { alert('No fusion to undo.'); return; }
  if (!confirm('Undo last fusion? This will restore your inventory to before the fusion was started.')) return;
  inv         = fusionSnapshot.inv;
  matCounts   = fusionSnapshot.matCounts;
  matSlotsF   = fusionSnapshot.matSlotsF;
  timerRem    = fusionSnapshot.timerRem;
  timerRunning = false;
  clearInterval(timerInt);
  save();
  renderInv();
  renderMatCounters();
  popFusion();
  renderMatSlotsUI();
  document.getElementById('t-btn').textContent  = 'START';
  document.getElementById('t-stat').textContent = 'Ready to fuse';
  document.getElementById('fuse-mini').style.display = 'none';
  updateTimerUI();
  fusionSnapshot = null;
  alert('Fusion undone. Inventory restored.');
}

// ════════ SHARE / LINK SYNC ════════
function getShareableLink() {
  var payload = {
    inv:       inv,
    matCounts: matCounts
  };
  var encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  var baseUrl = window.location.origin + window.location.pathname;
  return baseUrl + '?data=' + encoded;
}

function loadFromLink() {
  var params = new URLSearchParams(window.location.search);
  var data   = params.get('data');
  if (!data) return false;
  try {
    var decoded = JSON.parse(decodeURIComponent(atob(data)));
    if (decoded.inv)       inv       = decoded.inv;
    if (decoded.matCounts) matCounts = decoded.matCounts;
    save();
    renderInv();
    renderMatCounters();
    return true;
  } catch (e) {
    console.warn('Failed to load shared data:', e);
    return false;
  }
}

function shareBuild() {
  var link = getShareableLink();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(function() {
      alert('Shareable link copied to clipboard!');
    }).catch(function() {
      prompt('Copy this link:', link);
    });
  } else {
    prompt('Copy this link:', link);
  }
}

// ════════ EPHEMERAL UI STATE ════════
var selSkill    = 3;
var selAct      = 3;
var bpSk        = 5;
var bpAc        = 5;
var selDev      = null;
var selBpDev    = null;
var tVals       = [null, null, null];
var bpTVals     = [null, null, null];
var encCat      = 'All';
var matSlotsF   = [null, null, null];
var timerInt    = null;
var timerRem    = 300;
var timerRunning = false;
var editingId   = null;


// ════════ PERSISTENCE ════════
function save() {
  localStorage.setItem('oh4_inv',  JSON.stringify(inv));
  localStorage.setItem('oh4_matc', JSON.stringify(matCounts));
  document.getElementById('ic').innerHTML =
    '<div class="dot a"></div>' + inv.length + ' DEV';
}


// ════════ LOOKUP HELPERS ════════
function getDev(id) {
  return inv.find(function(d) { return d.id == id; });
}

function getTraitInfo(n) {
  var exact = TRAITS.find(function(t) { return t.n === n; });
  if (exact) return exact;
  // Partial match: strip parenthetical / bracketed suffix
  // e.g. "Starfall Inversion (Mini Wonder)" → "Starfall Inversion"
  //      "Moonlight Assault [Wolf]"          → "Moonlight Assault"
  var bare = n.replace(/\s*[\(\【\[].*$/, '').trim();
  return TRAITS.find(function(t) {
    return t.n === bare || t.n.startsWith(bare + ' (') || t.n.startsWith(bare + ' -') || t.n.startsWith(bare + ' [');
  });
}

function getType(n) {
  var i = getTraitInfo(n);
  return i ? i.type : 'positive';
}

function getDevType(sp) {
  var d = DEVS.find(function(x) { return x.n === sp; });
  return d ? d.t : 'Combat';
}

function getMatCount(id) {
  return matCounts[id] || 0;
}

function setMatCount(id, v) {
  if (v < 0) v = 0;
  matCounts[id] = v;
  save();
  renderMatCounters();
}


// ════════ SHARED RENDERERS ════════

/** Render a star-rating widget into element #id, calls cb(value) on click. */
function mkStars(id, cur, cb) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  for (var i = 1; i <= 5; i++) {
    var b = document.createElement('button');
    b.className = 'sb2' + (i <= cur ? ' act' : '');
    b.textContent = i;
    b.onclick = (function(v) {
      return function() { cb(v); mkStars(id, v, cb); };
    })(i);
    el.appendChild(b);
  }
}

/** Return an HTML trait-pill <span> with tooltip bindings. */
function traitPill(name) {
  var info = getTraitInfo(name);
  var type = info ? info.type : 'positive';
  return '<span class="tt ' + type + '" ' +
    'onmouseenter="showTip(this,\'' + name.replace(/'/g, "\\'") + '\')" ' +
    'onmouseleave="hideTip()">' + name + '</span>';
}

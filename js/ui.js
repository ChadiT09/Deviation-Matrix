/**
 * js/ui.js
 * ─────────────────────────────────────────────────────────────────────────────
 * UI utility functions:
 *   - Tooltip
 *   - Collapse sections
 *   - Tab switching
 *   - Deviation dropdown
 *   - Trait dropdown
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ════════ TOOLTIP ════════
var gTip = document.getElementById('g-tooltip');

function showTip(el, name) {
  var info = getTraitInfo(name);
  if (!info) return;
  var r = el.getBoundingClientRect();
  gTip.innerHTML =
    '<div class="tip-name">' + info.n + '</div>' +
    '<div class="tip-desc">' + info.d + '</div>' +
    '<div class="tip-src">Source: ' + info.src + '</div>' +
    '<div class="tip-slot">Slot ' + info.s + ' | ' + info.cat +
    (info.vfor ? ' | For: ' + info.vfor : '') + '</div>';
  gTip.style.display = 'block';
  var tw = gTip.offsetWidth, th = gTip.offsetHeight;
  var left = r.left + r.width / 2 - tw / 2;
  var top  = r.top - th - 8;
  if (top  < 4) top = r.bottom + 8;
  if (left < 4) left = 4;
  if (left + tw > window.innerWidth - 4) left = window.innerWidth - tw - 4;
  gTip.style.left = left + 'px';
  gTip.style.top  = top  + 'px';
}

function hideTip() {
  gTip.style.display = 'none';
}


// ════════ COLLAPSE ════════
function toggleCollapse(bodyId, hdr) {
  var body  = document.getElementById(bodyId);
  var arrow = hdr.querySelector('.collapse-arrow');
  if (body.classList.contains('closed')) {
    body.classList.remove('closed');
    body.style.maxHeight = body.scrollHeight + 'px';
    arrow.classList.add('open');
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(function() { body.style.maxHeight = '0px'; });
    body.classList.add('closed');
    arrow.classList.remove('open');
  }
}


// ════════ TABS ════════
function sw(name, el) {
  document.querySelectorAll('.pn').forEach(function(p) { p.classList.remove('act'); });
  document.querySelectorAll('.tb').forEach(function(b) { b.classList.remove('act'); });
  document.getElementById('tab-' + name).classList.add('act');
  el.classList.add('act');

  if (name === 'fusion')      { popFusion(); renderMatSlotsUI(); }
  if (name === 'encyclopedia') { renderEnc(); }
  if (name === 'meta') { renderMetaDev(); }
  if (name === 'blueprint') {
    mkStars('bp-sk', bpSk, function(v) { bpSk = v; });
    mkStars('bp-ac', bpAc, function(v) { bpAc = v; });
  }
}


// ════════ DEVIATION DROPDOWN ════════
var ddCatFilter = { dev: 'All', bp: 'All', ndev: 'All' };

function openDD(which) {
  var panel  = document.getElementById(which + '-dd-panel');
  var isOpen = panel.classList.contains('open');
  document.querySelectorAll('.dd-panel').forEach(function(p) { p.classList.remove('open'); });
  if (!isOpen) {
    panel.classList.add('open');
    renderDevDD(which);
    setTimeout(function() {
      var s = document.getElementById(which + '-dd-search');
      if (s) s.focus();
    }, 50);
  }
}

function renderDevDD(which) {
  which = which || 'dev';
  var srch = (document.getElementById(which + '-dd-search').value || '').toLowerCase();
  var cf   = ddCatFilter[which] || 'All';

  var catEl = document.getElementById(which + '-dd-cats');
  catEl.innerHTML = ['All', 'Combat', 'Territory', 'Crafting'].map(function(c) {
    return '<span class="dd-cat ' + (cf === c ? 'act' : '') +
      '" onclick="event.stopPropagation();ddCatFilter[\'' + which + '\']=\'' + c +
      '\';renderDevDD(\'' + which + '\')">' + c + '</span>';
  }).join('');

  var list   = DEVS.filter(function(d) {
    return (cf === 'All' || d.t === cf) && (!srch || d.n.toLowerCase().indexOf(srch) >= 0);
  });
  var listEl = document.getElementById(which + '-dd-list');
  if (!list.length) { listEl.innerHTML = '<div class="dd-empty">No deviations found</div>'; return; }

  var cur = which === 'dev'  ? (selDev   ? selDev.n   : '') :
            which === 'bp'   ? (selBpDev ? selBpDev.n : '') : '';

  listEl.innerHTML = list.map(function(d) {
    return '<div class="dd-item ' + (d.n === cur ? 'sel' : '') +
      '" onclick="selDevDD(\'' + d.n.replace(/'/g, "\\'") + "','" + which + '\')">' +
      '<img class="dd-dev-img" src="' + getDevImage(d.n) + '" alt="' + d.n + '" onerror="this.style.display=\'none\'">' +
      '<div style="flex:1"><div class="dd-item-name">' + d.n + '</div>' +
      '<div class="dd-item-meta">' + d.t + '</div></div>' +
      '<span class="dd-item-badge tt ' + (d.t === 'Combat' ? 'negative' : d.t === 'Territory' ? 'variation' : 'positive') + '">' + d.t + '</span></div>';
  }).join('');
}

function pickDev(which, name, type) {
  if (which === 'dev') {
    selDev = DEVS.find(function(d) { return d.n === name; });
    document.getElementById('dev-val-display').value = name;
    document.getElementById('i-type-display').textContent = type;
    document.getElementById('i-type-display').style.color =
      type === 'Combat' ? 'var(--cd)' : type === 'Territory' ? 'var(--cp)' : 'var(--ca)';
    document.getElementById('dev-dd-panel').classList.remove('open');
  } else if (which === 'bp') {
    selBpDev = DEVS.find(function(d) { return d.n === name; });
    document.getElementById('bp-val-display').value = name;
    document.getElementById('bp-dd-panel').classList.remove('open');
    // Clear trait slots when deviation changes so old traits don't persist
    [10, 11, 12].forEach(function(i) {
      bpTVals[i - 10] = null;
      var el = document.getElementById('t-disp-' + i);
      if (el) el.value = '';
    });
  } else if (which === 'ndev') {
    document.getElementById('ndev-val-display').value = name;
    document.getElementById('ndev-dd-panel').classList.remove('open');
  }
}


// ════════ TRAIT DROPDOWN ════════
var traitCatFilters = {};

function openTraitDD(idx) {
  var panel  = document.getElementById('trait-panel-' + idx);
  var isOpen = panel.classList.contains('open');
  document.querySelectorAll('.dd-panel').forEach(function(p) { p.classList.remove('open'); });
  if (!isOpen) {
    panel.classList.add('open');
    renderTraitDD(idx);
    setTimeout(function() {
      var s = document.getElementById('t-srch-' + idx);
      if (s) s.focus();
    }, 50);
  }
}

function renderTraitDD(idx) {
  if (idx >= 20) { renderTraitDD_modal(idx); return; }

  var srch  = ((document.getElementById('t-srch-' + idx) || {}).value || '').toLowerCase();
  var cf    = traitCatFilters[idx] || 'All';
  var slotMap = { 0:[1], 1:[2], 2:[3], 10:[1], 11:[2], 12:[3] };
  var slots = slotMap[idx] || [1, 2, 3];
  var currentDev = idx < 3 ? selDev : (idx >= 10 && idx <= 12 ? selBpDev : null);

  var available = TRAITS.filter(function(t) { return slots.indexOf(t.s) >= 0; });
  var rawCats   = ['All'];
  available.forEach(function(t) { if (rawCats.indexOf(t.cat) < 0) rawCats.push(t.cat); });

  var catsEl = document.getElementById('t-cats-' + idx);
  if (catsEl) catsEl.innerHTML = rawCats.map(function(c) {
    return '<span class="dd-cat ' + (cf === c ? 'act' : '') +
      '" onclick="event.stopPropagation();traitCatFilters[' + idx + ']=\'' + c +
      '\';renderTraitDD(' + idx + ')">' + c + '</span>';
  }).join('');

  var filtered = available;
  if (cf !== 'All') {
    if (cf === 'Variation' && currentDev) {
      filtered = available.filter(function(t) {
        return t.cat === 'Variation' && t.vfor &&
          (t.vfor === currentDev.n || t.src.indexOf(currentDev.n) >= 0);
      });
    } else {
      filtered = available.filter(function(t) { return t.cat === cf; });
    }
  }
  if (srch) filtered = filtered.filter(function(t) {
    return t.n.toLowerCase().indexOf(srch) >= 0 ||
           t.d.toLowerCase().indexOf(srch) >= 0 ||
           t.src.toLowerCase().indexOf(srch) >= 0;
  });

  var listEl = document.getElementById('t-list-' + idx);
  if (!listEl) return;
  if (!filtered.length) {
    listEl.innerHTML = '<div class="dd-empty">' +
      (cf === 'Variation' && !currentDev ? 'Select a Deviation first' : 'No traits found') +
      '</div>';
    return;
  }

  var cur = idx < 10 ? (tVals[idx] ? tVals[idx].n : '') :
                       (bpTVals[idx - 10] ? bpTVals[idx - 10].n : '');

  listEl.innerHTML = filtered.map(function(t) {
    return '<div class="dd-item ' + (t.n === cur ? 'sel' : '') +
      '" onclick="pickTrait(' + idx + ',\'' + t.n.replace(/'/g, "\\'") + '\')">' +
      '<div style="flex:1">' +
        '<div class="dd-item-name">' + t.n + ' <span class="slot-badge">S' + t.s + '</span></div>' +
        '<div class="dd-item-meta">' + t.d + '</div>' +
        '<div class="dd-item-src">' + t.src + '</div>' +
      '</div>' +
      '<span class="dd-item-badge tt ' + t.type + '">' + t.type + '</span></div>';
  }).join('');
}

function renderTraitDD_modal(idx) {
  var srch    = ((document.getElementById('t-srch-' + idx) || {}).value || '').toLowerCase();
  var cf      = traitCatFilters[idx] || 'All';
  var rawCats = ['All'];
  TRAITS.forEach(function(t) { if (rawCats.indexOf(t.cat) < 0) rawCats.push(t.cat); });

  var catsEl = document.getElementById('t-cats-' + idx);
  if (catsEl) catsEl.innerHTML = rawCats.map(function(c) {
    return '<span class="dd-cat ' + (cf === c ? 'act' : '') +
      '" onclick="event.stopPropagation();traitCatFilters[' + idx + ']=\'' + c +
      '\';renderTraitDD(' + idx + ')">' + c + '</span>';
  }).join('');

  var filtered = TRAITS.filter(function(t) {
    return (cf === 'All' || t.cat === cf) && (!srch || t.n.toLowerCase().indexOf(srch) >= 0);
  });

  var listEl = document.getElementById('t-list-' + idx);
  if (!listEl) return;
  listEl.innerHTML = filtered.length ? filtered.map(function(t) {
    return '<div class="dd-item" onclick="document.getElementById(\'t-disp-' + idx + '\').value=\'' +
      t.n.replace(/'/g, "\\'") + '\';document.getElementById(\'trait-panel-' + idx +
      '\').classList.remove(\'open\')">' +
      '<div style="flex:1"><div class="dd-item-name">' + t.n + '</div>' +
      '<div class="dd-item-meta">' + t.d + '</div></div>' +
      '<span class="dd-item-badge tt ' + t.type + '">' + t.type + '</span></div>';
  }).join('') : '<div class="dd-empty">No traits</div>';
}

function pickTrait(idx, name) {
  var info = TRAITS.find(function(t) { return t.n === name; });
  if (idx < 10)       { tVals[idx]       = info; document.getElementById('t-disp-' + idx).value = name; }
  else if (idx < 20)  { bpTVals[idx-10]  = info; document.getElementById('t-disp-' + idx).value = name; }
  var p = document.getElementById('trait-panel-' + idx);
  if (p) p.classList.remove('open');
}

// Close all dropdowns on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dd-wrap') && !e.target.closest('.dd-panel'))
    document.querySelectorAll('.dd-panel').forEach(function(p) { p.classList.remove('open'); });
});

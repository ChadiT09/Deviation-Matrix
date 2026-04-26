/**
 * js/fusion.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fusion Simulator:
 *   - Countdown timer
 *   - Parent selection + preview
 *   - Material slot management
 *   - calcFusion — species odds, stat range, per-category trait odds
 *   - destroyAfterFusion — consumes parents/materials on timer completion
 *   - showNewDevModal — post-fusion offspring logging
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ════════ NOTIFICATIONS ════════
var notifEnabled = localStorage.getItem('oh4_notif') === '1';

function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  updateNotifBtn();
}

function toggleNotif() {
  notifEnabled = !notifEnabled;
  updateNotifBtn();
  localStorage.setItem('oh4_notif', notifEnabled ? '1' : '0');
}

function updateNotifBtn() {
  var btn = document.getElementById('notif-btn');
  if (!btn) return;
  if (!('Notification' in window)) {
    btn.style.display = 'none';
    return;
  }
  if (Notification.permission === 'granted' && notifEnabled) {
    btn.classList.add('on');
  } else {
    btn.classList.remove('on');
  }
}

function showFusionNotif() {
  if (!notifEnabled) { playDoneSound(); return; }
  var notifSupported = 'Notification' in window;
  if (notifSupported && Notification.permission === 'granted') {
    try {
      new Notification('Fusion Complete!', {
        body: 'Your 5-minute fusion timer has finished. Tap to log your offspring.',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><polygon points="13,2 22,7 22,19 13,24 4,19 4,7" stroke="%2300f5ff" stroke-width="2" fill="none"/><circle cx="13" cy="13" r="4" fill="%2300f5ff"/></svg>',
        tag: 'fusion-complete',
        requireInteraction: true
      }).onclick = function() {
        window.focus();
        document.querySelector('.tb:nth-child(2)').click();
      };
    } catch (e) { playDoneSound(); }
  } else {
    playDoneSound();
  }
}


// ════════ TIMER ════════
function fmt(s) {
  var m = Math.floor(s / 60), sc = s % 60;
  return m + ':' + (sc < 10 ? '0' : '') + sc;
}

function updateTimerUI() {
  document.getElementById('t-disp').textContent = fmt(timerRem);
  document.getElementById('t-fil').style.width  = (timerRem / 300 * 100) + '%';
  document.getElementById('mini-t').textContent = fmt(timerRem);
  if (timerRem <= 0) {
    clearInterval(timerInt);
    timerRunning = false;
    timerRem     = 300;
    document.getElementById('t-btn').textContent  = 'START';
    document.getElementById('t-stat').textContent = 'Fusion complete!';
    document.getElementById('fuse-mini').style.display = 'none';
    showFusionNotif();
    destroyAfterFusion();
    showNewDevModal();
  }
}

function playDoneSound() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach(function(f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sine';
      g.gain.setValueAtTime(0.25, ctx.currentTime + i * .12);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * .12 + 0.35);
      o.start(ctx.currentTime + i * .12);
      o.stop(ctx.currentTime + i * .12 + 0.4);
    });
  } catch (e) {}
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInt);
    timerRunning = false;
    document.getElementById('t-btn').textContent  = 'START';
    document.getElementById('t-stat').textContent = 'Paused';
    document.getElementById('fuse-mini').style.display = 'none';
  } else {
    if (timerRem <= 0) timerRem = 300;
    timerRunning = true;
    document.getElementById('t-btn').textContent  = 'PAUSE';
    document.getElementById('fuse-mini').style.display = 'flex';
    document.getElementById('t-stat').textContent = 'In progress';
    timerInt = setInterval(function() { timerRem--; updateTimerUI(); }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInt);
  timerRunning = false;
  timerRem     = 300;
  updateTimerUI();
  document.getElementById('t-btn').textContent  = 'START';
  document.getElementById('t-stat').textContent = 'Ready to fuse';
  document.getElementById('fuse-mini').style.display = 'none';
}

function undoFusion() {
  if (!fusionSnapshot) { alert('No fusion to undo.'); return; }
  if (!confirm('Undo last fusion? This will restore your inventory to before the fusion was started.')) return;
  inv         = fusionSnapshot.inv;
  matCounts   = fusionSnapshot.matCounts;
  matSlotsF   = JSON.parse(JSON.stringify([null, null, null]));
  timerRem    = 300;
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


// ════════ DESTROY AFTER FUSION ════════
function destroyAfterFusion() {
  var aId = parseInt(document.getElementById('f-a').value);
  var bId = parseInt(document.getElementById('f-b').value);
  var aD  = getDev(aId), bD = getDev(bId);

  if (aD) {
    if (aD.fuses >= 1)
      inv = inv.map(function(d) { return d.id === aId ? Object.assign({}, d, { fuses: 0 }) : d; });
    else
      inv = inv.filter(function(d) { return d.id !== aId; });
  }
  if (bD) inv = inv.filter(function(d) { return d.id !== bId; });

  matSlotsF.forEach(function(ms) {
    if (!ms) return;
    if (ms.type === 'dev') {
      inv = inv.filter(function(d) { return d.id !== ms.id; });
    } else if (ms.type === 'mat') {
      var def = MAT_DEFS.find(function(x) { return x.id === ms.id; });
      if (def && getMatCount(ms.id) > 0) setMatCount(ms.id, getMatCount(ms.id) - 1);
    }
  });

  matSlotsF = [null, null, null];
  save();
  renderInv();
  renderMatCounters();
  popFusion();
  renderMatSlotsUI();
}


// ════════ PARENT PREVIEW ════════
function renderParentPreview(cid, devId) {
  var el = document.getElementById(cid);
  if (!devId) { el.innerHTML = ''; return; }
  var d = getDev(devId);
  if (!d)     { el.innerHTML = ''; return; }
  var fc     = d.fuses >= 1 ? 'h' : 'z';
  var fl     = d.fuses === 0 ? 'FODDER' : '1 FUSE';
  var traits = d.traits.map(function(t) { return traitPill(t); }).join('') ||
               '<span style="font-size:10px;color:var(--tm)">No traits</span>';
  el.innerHTML =
    '<div class="parent-prev">' +
      '<div class="pp-name">' + d.name + '</div>' +
      '<div class="pp-species">' + d.species +
        ' <span class="type-badge ' + d.type + '">' + d.type + '</span></div>' +
      '<div class="pp-stats">' +
        '<div class="pp-stat">Skill: <span>' + d.skill + '/5</span></div>' +
        '<div class="pp-stat">Activity: <span>' + d.activity + '/5</span></div>' +
      '</div>' +
      '<div class="pp-fuse"><span class="fb ' + fc + '">' + fl + '</span></div>' +
      '<div class="pp-traits">' + traits + '</div>' +
    '</div>';
}


// ════════ POPULATE PARENT SELECTS ════════
function popFusion() {
  ['f-a', 'f-b'].forEach(function(id) {
    var sel = document.getElementById(id);
    var cur = sel.value;
    sel.innerHTML = '<option value="">-- Select --</option>';
    inv.filter(function(d) { return d.fuses >= 1; }).forEach(function(d) {
      var o = document.createElement('option');
      o.value = d.id;
      o.textContent = d.name + ' (' + d.species + ') S' + d.skill + '/A' + d.activity +
                      ' | ' + (d.traits.join(', ') || 'no traits');
      sel.appendChild(o);
    });
    if (cur) sel.value = cur;
  });
  renderParentPreview('fa-prev', document.getElementById('f-a').value);
  renderParentPreview('fb-prev', document.getElementById('f-b').value);
}


// ════════ MATERIAL SLOTS ════════
function renderMatSlotsUI() {
  var el        = document.getElementById('mat-slots');
  el.innerHTML  = '';
  var parentAId = parseInt(document.getElementById('f-a').value) || 0;
  var parentBId = parseInt(document.getElementById('f-b').value) || 0;

  for (var i = 0; i < 3; i++) {
    var m   = matSlotsF[i];
    var row = document.createElement('div');
    row.className = 'mat-row';

    if (m) {
      var name = '?', trait = '?';
      if (m.type === 'dev') {
        var dd = getDev(m.id);
        name  = dd ? dd.name : '?';
        trait = dd ? (dd.traits.join(', ') || 'No traits') : '?';
      } else {
        var def = MAT_DEFS.find(function(x) { return x.id === m.id; });
        name  = def ? def.name  : '?';
        trait = def ? def.trait : '?';
      }
      var kind = m.type === 'dev' ? 'Deviation' : 'Animal/Furniture';
      row.innerHTML =
        '<div style="font-size:10px;color:var(--td);min-width:60px;font-family:var(--mono)">MAT ' + (i + 1) + '</div>' +
        '<div class="mat-name">' + name + ' <span style="font-size:9px;color:var(--td)">[' + kind + ']</span></div>' +
        '<div class="mat-traits">' + trait + '</div>' +
        '<button class="btn btn-xs btn-d" onclick="clearMatSlot(' + i + ')">X</button>';
    } else {
      var usedDevIds = [parentAId, parentBId];
      matSlotsF.forEach(function(ms) { if (ms && ms.type === 'dev') usedDevIds.push(ms.id); });

      var devOpts = inv.filter(function(d) { return usedDevIds.indexOf(d.id) < 0; })
        .map(function(d) {
          return '<option value="dev:' + d.id + '">' + d.name + ' (' + d.species + ') | ' +
                 (d.traits.join(', ') || 'no traits') + '</option>';
        }).join('');

      var matOpts = MAT_DEFS.filter(function(md) { return getMatCount(md.id) > 0; })
        .map(function(md) {
          return '<option value="mat:' + md.id + '">' + md.name + ' [' + md.kind + '] | ' + md.trait + '</option>';
        }).join('');

      row.innerHTML =
        '<div style="font-size:10px;color:var(--td);min-width:60px;font-family:var(--mono)">MAT ' + (i + 1) + '</div>' +
        '<select onchange="assignMatSlot(' + i + ',this.value)" style="font-size:12px;flex:1">' +
          '<option value="">-- None --</option>' +
          (devOpts ? '<optgroup label="Deviations">' + devOpts + '</optgroup>' : '') +
          (matOpts ? '<optgroup label="Animals/Furniture">' + matOpts + '</optgroup>' : '') +
        '</select>';
    }
    el.appendChild(row);
  }
  calcFusion();
}

function assignMatSlot(i, val) {
  if (!val) { matSlotsF[i] = null; }
  else {
    var p = val.split(':');
    matSlotsF[i] = { type: p[0], id: p[0] === 'dev' ? parseInt(p[1]) : p[1] };
  }
  renderMatSlotsUI();
}

function clearMatSlot(i) {
  matSlotsF[i] = null;
  renderMatSlotsUI();
}


// ════════ FUSION CALCULATION ════════
// Step 1-3 per documented rules.
// Step 4 REMOVED: all 3 middle tube slots have equal RNG weight.
// Variant traits: 0% if outcome species doesn't match vfor.
function calcFusion() {
  var aId = document.getElementById('f-a').value;
  var bId = document.getElementById('f-b').value;
  var res = document.getElementById('fusion-res');
  renderParentPreview('fa-prev', aId);
  renderParentPreview('fb-prev', bId);
  if (!aId || !bId) { res.innerHTML = ''; return; }

  var left = getDev(aId), right = getDev(bId);
  if (!left || !right) { res.innerHTML = ''; return; }

  // Collect middle tube
  var midDevs = [];
  for (var mi = 0; mi < 3; mi++) {
    var ms = matSlotsF[mi];
    if (!ms) { midDevs.push(null); continue; }
    if (ms.type === 'dev') {
      var md = getDev(ms.id);
      midDevs.push(md ? {
        species: md.species, type: md.type,
        traits: md.traits.map(function(n) { return getTraitInfo(n); }).filter(Boolean),
        name: md.name
      } : null);
    } else {
      var def = MAT_DEFS.find(function(x) { return x.id === ms.id; });
      midDevs.push(def ? {
        species: '__mat__', type: '__mat__',
        traits: def.trait ? [getTraitInfo(def.trait)].filter(Boolean) : [],
        name: def.name
      } : null);
    }
  }
  var midActive = midDevs.filter(Boolean);

  // ── STEP 1: SPECIES ODDS ──
  var spA = left.species, spB = right.species;
  var sameSpecies = spA === spB;
  var countA = 1, countB = 1;
  if (!sameSpecies) {
    midActive.forEach(function(m) {
      if (m.species === spA) countA++;
      else if (m.species === spB) countB++;
    });
  }
  var probA = sameSpecies ? 1 : countA / (countA + countB);
  var probB = sameSpecies ? 0 : countB / (countA + countB);

  // ── Helper: compute per-category trait odds for a given outcome ──
  function computeTraitOdds(outcomeType, outcomeSpecies) {
    var allInputs = [
      { type: left.type,  traits: left.traits.map(function(n)  { return getTraitInfo(n); }).filter(Boolean), species: left.species,  label: 'Left' },
      { type: right.type, traits: right.traits.map(function(n) { return getTraitInfo(n); }).filter(Boolean), species: right.species, label: 'Right' }
    ];
    midActive.forEach(function(m) { allInputs.push(m); });

    // ── STEP 2: FILTER TRAITS + VARIANT CHECK ──
    var filteredInputs = allInputs.map(function(inp, idx) {
      var validTraits = inp.traits.filter(function(t) {
        if (!t) return false;
        // Variant traits: only valid for their own species
        if (t.vfor && t.vfor !== outcomeSpecies) return false;
        // Slot 1: always valid
        if (t.s === 1) return true;
        // Slot 3: Animal/Furniture traits branch by outcome type
        if (t.s === 3) {
          if (t.cat === 'Animal' && outcomeType !== 'Combat') return false;
          if (t.cat === 'Furniture' && outcomeType === 'Combat') return false;
          return true;
        }
        // Slot 2: type-specific traits
        if (t.s === 2) {
          if (t.typeReq && t.typeReq !== outcomeType) return false;
          if (t.cat !== 'Variation' && ['Combat','Territory','Crafting'].indexOf(t.cat) >= 0 &&
              t.cat !== outcomeType) return false;
          return true;
        }
        return true;
      });
      return { validTraits: validTraits, isMiddle: idx >= 2, label: inp.label || inp.name || 'Material' };
    });

    // ── STEP 3: PER-CATEGORY ──
    var categories = [
      { name: 'GENERAL (Slot 1)',           slot: 1 },
      { name: outcomeType.toUpperCase() + ' (Slot 2)', slot: 2 },
      { name: 'DEVIATED (Slot 3)' + (outcomeType !== 'Combat' ? ' [Furniture Branch]' : ' [Animal Branch]'), slot: 3 }
    ];
    var catResults = [];
    categories.forEach(function(cat) {
      var traitCounts = {}, cleanMiddleCount = 0;
      filteredInputs.forEach(function(inp) {
        var catTraits = inp.validTraits.filter(function(t) { return t.s === cat.slot; });
        if (inp.isMiddle && catTraits.length === 0) cleanMiddleCount++;
        catTraits.forEach(function(t) {
          if (!traitCounts[t.n]) traitCounts[t.n] = { count: 0, info: t, sources: [] };
          traitCounts[t.n].count++;
          traitCounts[t.n].sources.push(inp.label);
        });
      });

      var uniqueTraits = Object.keys(traitCounts);
      var totalCopies  = 0;
      uniqueTraits.forEach(function(k) { totalCopies += traitCounts[k].count; });

      if (uniqueTraits.length === 0) {
        catResults.push({ catName: cat.name, scenario: 'A', traits: [], cleanMiddleCount: cleanMiddleCount });
      } else if (uniqueTraits.length === 1) {
        var tn = uniqueTraits[0], td = traitCounts[tn];
        var baseChance = td.count >= 2 ? 1.0 : 0.5;
        var cleanBuff  = cleanMiddleCount * 0.10;
        catResults.push({
          catName: cat.name, scenario: 'B',
          traits: [{ name: tn, info: td.info, count: td.count, chance: Math.min(1.0, baseChance + cleanBuff), sources: td.sources }],
          cleanMiddleCount: cleanMiddleCount
        });
      } else {
        var traitArr = [];
        uniqueTraits.forEach(function(tn) {
          var td = traitCounts[tn];
          traitArr.push({ name: tn, info: td.info, count: td.count, chance: td.count / totalCopies, sources: td.sources });
        });
        traitArr.sort(function(a, b) { return b.chance - a.chance; });
        catResults.push({ catName: cat.name, scenario: 'C', traits: traitArr, cleanMiddleCount: cleanMiddleCount, totalCopies: totalCopies });
      }
    });
    return { catResults: catResults };
  }

  // ── BUILD OUTPUT ──
  var html = '';
  if (left.fuses === 0)
    html += '<div class="wb"><div class="wi">!</div><div class="wt">LEFT PARENT is Fodder (0 fuses). Cannot be used as main parent.</div></div>';

  // Species odds
  html += '<div class="rb"><h3>STEP 1: SPECIES ODDS</h3>';
  if (sameSpecies) {
    html += '<div class="pb"><div class="pl">' + spA + '</div><div class="pt"><div class="pf hi" style="width:100%"></div></div><div class="pp">100%</div></div>';
  } else {
    html += '<div class="pb"><div class="pl">' + spA + ' (Left)</div><div class="pt"><div class="pf ' + (probA >= 0.5 ? 'mi' : 'lo') + '" style="width:' + (probA * 100) + '%"></div></div><div class="pp">' + (probA * 100).toFixed(1) + '%</div></div>';
    html += '<div class="pb"><div class="pl">' + spB + ' (Right)</div><div class="pt"><div class="pf ' + (probB >= 0.5 ? 'mi' : 'lo') + '" style="width:' + (probB * 100) + '%"></div></div><div class="pp">' + (probB * 100).toFixed(1) + '%</div></div>';
  }
  html += '</div>';

  // Stat range
  var avgSk = (left.skill + right.skill) / 2;
  var avgAc = (left.activity + right.activity) / 2;
  var minSk = Math.max(1, Math.floor(avgSk - 1)), maxSk = Math.min(5, Math.ceil(avgSk + 1));
  var minAc = Math.max(1, Math.floor(avgAc - 1)), maxAc = Math.min(5, Math.ceil(avgAc + 1));
  html += '<div class="rb"><h3>STAT RANGE (RNG)</h3>' +
    '<div style="display:flex;gap:24px">' +
      '<div><div style="font-size:10px;color:var(--td)">SKILL</div>' +
           '<div style="font-family:\'Orbitron\',monospace;font-size:20px;font-weight:700;color:var(--c)">' + minSk + '&ndash;' + maxSk + '</div>' +
           '<div style="font-size:9px;color:var(--tm)">' + left.skill + ' + ' + right.skill + '</div></div>' +
      '<div><div style="font-size:10px;color:var(--td)">ACTIVITY</div>' +
           '<div style="font-family:\'Orbitron\',monospace;font-size:20px;font-weight:700;color:var(--c)">' + minAc + '&ndash;' + maxAc + '</div>' +
           '<div style="font-size:9px;color:var(--tm)">' + left.activity + ' + ' + right.activity + '</div></div>' +
    '</div></div>';

  // Trait analysis
  function renderBranch(bType, bSpecies, bProb) {
    var result = computeTraitOdds(bType, bSpecies);
    html += '<div class="rb"><h3>TRAIT ODDS';
    if (!sameSpecies) html += ' (if ' + bSpecies + ' / ' + bType + ' &mdash; ' + (bProb * 100).toFixed(1) + '%)';
    html += '</h3>';
    html += '<div style="font-size:10px;color:var(--td);margin-bottom:8px">Incompatible type traits filtered. Variant traits only apply to their own deviation (0% otherwise). Clean materials: +10% each to non-competing odds.</div>';

    result.catResults.forEach(function(cr) {
      html += '<div class="cat-hdr">' + cr.catName + ' &mdash; Scenario ' + cr.scenario +
        (cr.cleanMiddleCount ? ' &mdash; <span style="color:var(--cg)">' + cr.cleanMiddleCount +
         ' Clean (+' + cr.cleanMiddleCount * 10 + '%)</span>' : '') + '</div>';

      if (cr.scenario === 'A') {
        html += '<div class="slot-empty">Empty &mdash; no valid traits in pool.</div>';
      } else if (cr.scenario === 'B') {
        var t   = cr.traits[0];
        var pct = Math.round(t.chance * 100);
        var cls = pct >= 100 ? 'hi' : pct >= 50 ? 'mi' : 'lo';
        html += '<div class="pb"><div class="pl">' + traitPill(t.name) +
          ' <span style="font-size:8px;color:var(--tm)">&times;' + t.count + '</span></div>' +
          '<div class="pt"><div class="pf ' + cls + '" style="width:' + Math.min(100, pct) + '%"></div></div>' +
          '<div class="pp">' + pct + '%</div></div>';
        html += '<div style="font-size:9px;color:var(--tm);margin-bottom:4px">Base: ' +
          (t.count >= 2 ? '100%' : '50%') +
          (cr.cleanMiddleCount ? ' + Clean +' + cr.cleanMiddleCount * 10 + '%' : '') + '</div>';
      } else {
        html += '<div style="font-size:9px;color:var(--td);margin-bottom:4px">Competing &mdash; slot 100% filled (' + cr.totalCopies + ' copies). Split:</div>';
        cr.traits.forEach(function(t) {
          var pct = Math.round(t.chance * 100);
          var cls = pct >= 50 ? 'hi' : pct >= 30 ? 'mi' : 'lo';
          html += '<div class="pb"><div class="pl">' + traitPill(t.name) +
            ' <span style="font-size:8px;color:var(--tm)">&times;' + t.count + '/' + cr.totalCopies + '</span></div>' +
            '<div class="pt"><div class="pf ' + cls + '" style="width:' + pct + '%"></div></div>' +
            '<div class="pp">' + pct + '%</div></div>';
        });
      }
    });
    html += '</div>';
  }

  if (sameSpecies) { renderBranch(left.type, spA, 1); }
  else             { renderBranch(left.type, spA, probA); renderBranch(right.type, spB, probB); }

  html += '<div class="info-box"><div class="ii">i</div><div class="it">Species odds from input counts. Trait filtering by outcome type. Per-category Scenario A/B/C with Clean buffs. Variant traits: 0% if species mismatch. All 3 material slots share equal RNG. Left Parent uses fuse. Right Parent + materials destroyed. 5 min fusion.</div></div>';
  res.innerHTML = html;
}


// ════════ MODAL — LOG OFFSPRING ════════
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('modal-body').innerHTML = '';
}

function showNewDevModal() {
  document.getElementById('modal-body').innerHTML =
    '<h3>FUSION COMPLETE -- LOG OFFSPRING</h3>' +
    '<div class="fg mb12">' +
      '<div class="fgr"><label>SPECIES</label>' +
        '<div class="dd-wrap"><div class="dd-input" onclick="openDD(\'ndev\')">' +
          '<input type="text" id="ndev-val-display" placeholder="Select" readonly style="cursor:pointer">' +
          '<span class="dd-arrow">&#x25BC;</span></div>' +
          '<div class="dd-panel" id="ndev-dd-panel">' +
            '<div class="dd-search"><input type="text" id="ndev-dd-search" placeholder="Search" oninput="renderDevDD(\'ndev\')"></div>' +
            '<div class="dd-cats" id="ndev-dd-cats"></div>' +
            '<div class="dd-list" id="ndev-dd-list"></div>' +
          '</div></div></div>' +
      '<div class="fgr"><label>NICKNAME</label><input type="text" id="ndev-name"></div>' +
    '</div>' +
    '<div class="fg mb12">' +
      '<div class="fgr"><label>SKILL</label><div class="ss" id="ndev-sk"></div></div>' +
      '<div class="fgr"><label>ACTIVITY</label><div class="ss" id="ndev-ac"></div></div>' +
    '</div>' +
    '<div class="fgr mb12"><label>TRAITS</label>' +
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        [20, 21, 22].map(function(n, i) {
          return '<div class="dd-wrap"><div class="dd-input" onclick="openTraitDD(' + n + ')">' +
            '<input type="text" id="t-disp-' + n + '" placeholder="Trait ' + (i+1) + '" readonly style="cursor:pointer">' +
            '<span class="dd-arrow">&#x25BC;</span></div>' +
            '<div class="dd-panel" id="trait-panel-' + n + '">' +
              '<div class="dd-search"><input type="text" id="t-srch-' + n + '" placeholder="Search" oninput="renderTraitDD(' + n + ')"></div>' +
              '<div class="dd-cats" id="t-cats-' + n + '"></div>' +
              '<div class="dd-list" id="t-list-' + n + '"></div>' +
            '</div></div>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px">' +
      '<button class="btn btn-p" onclick="saveNewOffspring()">+ ADD</button>' +
      '<button class="btn" onclick="closeModalDirect()">SKIP</button>' +
    '</div>';

  var nsk = 3, nac = 3;
  mkStars('ndev-sk', nsk, function(v) { nsk = v; });
  mkStars('ndev-ac', nac, function(v) { nac = v; });

  window.saveNewOffspring = function() {
    var sp = document.getElementById('ndev-val-display').value;
    if (!sp) { alert('Select species.'); return; }
    var t1 = document.getElementById('t-disp-20').value;
    var t2 = document.getElementById('t-disp-21').value;
    var t3 = document.getElementById('t-disp-22').value;
    inv.push({
      id: Date.now(),
      name: document.getElementById('ndev-name').value.trim() || sp,
      species: sp,
      type: getDevType(sp),
      fuses: 1,
      skill: nsk,
      activity: nac,
      traits: [t1, t2, t3].filter(Boolean),
      notes: 'fusion offspring'
    });
    save(); renderInv(); closeModalDirect();
  };

  document.getElementById('modal-overlay').style.display = 'flex';
}

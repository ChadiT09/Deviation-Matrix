// ════════ SCREENSHOT IMPORT (Card-based) ════════

function triggerScreenshotImport() {
  var input = document.getElementById('screenshot-import-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = 'screenshot-import-input';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.style.display = 'none';
    input.onchange = handleScreenshotImport;
    document.body.appendChild(input);
  }
  input.click();
}

// Tesseract worker singleton
var _tesseractWorker = null;
async function getTesseractWorker() {
  if (!_tesseractWorker) {
    _tesseractWorker = await Tesseract.createWorker('eng');
  }
  return _tesseractWorker;
}

// ── Step 1: Show UI, load image, present instructions ──
async function handleScreenshotImport(event) {
  var file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  var modalBody = document.getElementById('modal-body');
  document.getElementById('modal-overlay').style.display = 'flex';
  modalBody.innerHTML =
    '<h3>📸 Deviation Card Import</h3>' +
    '<div class="ocr-guide">' +
      '<div class="ocr-guide-step"><span class="ocr-step-num">1</span> Take a screenshot of <b>ONE deviation card</b> in your inventory</div>' +
      '<div class="ocr-guide-step"><span class="ocr-step-num">2</span> Make sure the card shows clearly — name, stars, and traits all visible</div>' +
      '<div class="ocr-guide-step"><span class="ocr-step-num">3</span> Confirm the results below and tap ADD</div>' +
    '</div>' +
    '<img src="" id="ocr-preview" style="display:none;max-width:100%;border:1px solid var(--bd);margin:10px 0;border-radius:4px">' +
    '<div id="ocr-status" style="font-size:12px;color:var(--td);margin:8px 0">Loading image...</div>' +
    '<div id="ocr-progress" style="height:4px;background:var(--bd);border-radius:2px;margin:8px 0;display:none"><div id="ocr-bar" style="height:100%;background:var(--c);width:0%;transition:width .3s;border-radius:2px"></div></div>' +
    '<div id="ocr-results" style="display:none"></div>' +
    '<div id="ocr-actions" style="display:none;margin-top:12px"><button class="btn btn-p" onclick="confirmOcrImport()">+ ADD TO INVENTORY</button></div>' +
    '<button class="btn btn-sm" onclick="closeModalDirect()" style="margin-top:8px">CANCEL</button>';

  try {
    var preview = document.getElementById('ocr-preview');
    preview.src = URL.createObjectURL(file);
    preview.onload = function() {
      document.getElementById('ocr-status').textContent = 'Image loaded — scanning card...';
      processCardImage(preview);
    };
    preview.style.display = 'block';
  } catch(err) {
    document.getElementById('ocr-status').textContent = 'Error loading image: ' + err.message;
  }
}

// ── Step 2: Process card with Tesseract (region-based) ──
async function processCardImage(imgEl) {
  var progress = document.getElementById('ocr-progress');
  var bar = document.getElementById('ocr-bar');
  var status = document.getElementById('ocr-status');
  progress.style.display = 'block';

  try {
    bar.style.width = '15%';
    status.textContent = 'Initializing OCR engine...';
    var worker = await getTesseractWorker();

    bar.style.width = '30%';
    status.textContent = 'Scanning card content...';
    var result = await worker.recognize(imgEl);
    bar.style.width = '70%';
    status.textContent = 'Parsing results...';

    var text = result.data.text;
    var words = result.data.words || [];
    var lines = result.data.lines || [];

    var parsed = parseCardLayout(text, words, lines, imgEl.naturalWidth, imgEl.naturalHeight);

    bar.style.width = '100%';

    if (parsed) {
      status.textContent = 'Card scanned successfully!';
      showCardResults(parsed);
    } else {
      status.textContent = 'Could not parse card. Try a clearer screenshot.';
      document.getElementById('ocr-results').innerHTML =
        '<div class="es" style="margin-top:8px">Card not recognized. Tips: make sure the deviation name and traits are clearly visible.</div>' +
        '<div style="font-size:10px;color:var(--tm);margin-top:8px">Raw text: <pre style="white-space:pre-wrap;margin-top:4px;font-size:9px">' + (text || '(empty)').slice(0, 300) + '</pre></div>';
    }
  } catch(err) {
    status.textContent = 'OCR Error: ' + err.message;
    status.style.color = 'var(--cd)';
  }
}

// ── Step 3: Parse card layout ──
// imgW/imgH = original pixel dimensions of the image
function parseCardLayout(text, words, lines, imgW, imgH) {
  var text = (text || '').trim();
  if (!text) return null;

  var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
  var allText = lines.join(' ');

  // ── 1. Deviation name: first substantial line (not "Combat" or stats) ──
  var knownDevs = DEVS.map(function(d) { return d.n; });
  var devName = null;
  var devNameLine = null;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    // Skip very short lines (likely UI noise)
    if (l.length < 3) continue;
    // Skip obvious stats/UI text
    if (/^(skill|activity|fusion|combat|territory|crafting|rating|stars?)$/i.test(l)) continue;
    // Try to match known deviation name (possibly with variation suffix)
    for (var j = 0; j < knownDevs.length; j++) {
      var dn = knownDevs[j];
      if (l.toLowerCase().indexOf(dn.toLowerCase()) >= 0 || fuzzyMatch(l, dn)) {
        devName = dn;
        devNameLine = l;
        break;
      }
    }
    if (devName) break;
  }

  if (!devName) return null;

  // ── 2. Type from lines ──
  var devType = 'Combat';
  var typeLines = ['Combat', 'Territory', 'Crafting'];
  for (var i = 0; i < lines.length; i++) {
    for (var j = 0; j < typeLines.length; j++) {
      if (lines[i].toLowerCase().indexOf(typeLines[j].toLowerCase()) >= 0) {
        devType = typeLines[j];
        break;
      }
    }
  }

  // ── 3. Skill & Activity stars: look for ★ or * count near skill/activity keywords ──
  var skill = 3, activity = 3;
  var inSkill = false, inActivity = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    var lower = l.toLowerCase();
    if (lower.indexOf('skill') >= 0) inSkill = true;
    if (lower.indexOf('activ') >= 0) inActivity = true;
    // Count stars in this line
    var stars = (l.match(/★/g) || []).length;
    var asterisks = (l.match(/\*/g) || []).length;
    var starCount = Math.max(stars, asterisks);
    if (starCount > 0 && starCount <= 5) {
      if (inSkill) skill = starCount;
      if (inActivity) activity = starCount;
    }
    // Also check for "S3" or "Skill 4" pattern in nearby lines
    var sMatch = l.match(/S[^a-z]*(\d)/i) || l.match(/Skill[^0-9]*(\d)/i);
    if (sMatch && inSkill) skill = Math.min(5, Math.max(1, parseInt(sMatch[1])));
    var aMatch = l.match(/A[^a-z]*(\d)/i) || l.match(/Act[^0-9]*(\d)/i);
    if (aMatch && inActivity) activity = Math.min(5, Math.max(1, parseInt(aMatch[1])));
    if (lower.indexOf('skill') < 0 && lower.indexOf('activ') < 0 &&
        lower.indexOf('rating') < 0 && lower.indexOf('fusion') < 0 &&
        lower.indexOf('combat') < 0) {
      inSkill = false;
      inActivity = false;
    }
  }

  // ── 4. Fusion count: "0 Fusion Chances" or "X Fuse" ──
  var fuses = 1;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    var fuseMatch = l.match(/(\d+)\s*fusion/i) || l.match(/(\d+)\s*fuse/i) || l.match(/fusion.*?(\d+)/i);
    if (fuseMatch) {
      fuses = Math.max(0, Math.min(5, parseInt(fuseMatch[1])));
      break;
    }
  }

  // ── 5. Traits: find trait lines (not name, not stats) ──
  var TRAIT_KEYWORDS = [
    'Moonlight Assault','Crack Shot','Power Rewind','Lunar Oracle','Starfall Inversion',
    'Psychic Kid','Weakspot Master','Marine Star','Aberrant Progeny','Chaos',
    'Fluffy Curse','Frigid Touch','Infrasonic Illusion','Dazing Aura',
    'Upper Hand','Optimist','Covert Energy','Stable Energy','Stable Vitality',
    'Move More','Living Map','Stardust Affinity','Productivity First',
    'Dream Wild','Sweet Talk','Hydrophilic','Water Dormancy','Buy 1 Get 2',
    'Come As One','Mineral Talent','Work of Proficiency',
    'Night Assault','Daybreak','Iron Will',
    'A World of','HP ','Rebecca'
  ];

  var traits = [];
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (l.length < 3) continue;
    // Skip the deviation name itself
    if (fuzzyMatch(l, devName)) continue;
    // Skip obvious non-trait text
    if (/^(skill|activity|fusion|combat|territory|crafting|rating|stars?|\d+)$/i.test(l)) continue;

    for (var j = 0; j < TRAIT_KEYWORDS.length; j++) {
      var kw = TRAIT_KEYWORDS[j];
      if (l.toLowerCase().indexOf(kw.toLowerCase()) >= 0) {
        var info = getTraitInfo(kw);
        if (info && traits.indexOf(info.n) < 0 && traits.length < 3) {
          traits.push(info.n);
        }
        break;
      }
    }
    // Also try partial/fuzzy trait match
    if (traits.length < 3) {
      for (var j = 0; j < TRAITS.length; j++) {
        var tn = TRAITS[j].n;
        if (fuzzyMatch(l, tn) && traits.indexOf(tn) < 0 && traits.length < 3) {
          traits.push(tn);
          break;
        }
      }
    }
  }

  return {
    name: devName,
    species: devName,
    type: devType,
    skill: skill,
    activity: activity,
    fuses: fuses,
    traits: traits,
    notes: 'screenshot import',
    matchQuality: traits.length > 0 ? 'high' : 'medium'
  };
}

// ── Step 4: Show results for confirmation ──
function showCardResults(parsed) {
  var resultsEl = document.getElementById('ocr-results');
  resultsEl.style.display = 'block';

  var traitHtml = parsed.traits.length
    ? parsed.traits.map(function(t) { return '<span class="tt positive" style="margin:2px">' + t + '</span>'; }).join('')
    : '<span style="color:var(--tm);font-size:11px">No traits detected</span>';

  var stars = function(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); };

  resultsEl.innerHTML =
    '<div class="ocr-card-preview">' +
      '<div class="ocr-card-name" id="ocr-card-name">' + parsed.name + '</div>' +
      '<div class="ocr-card-type"><span class="type-badge ' + parsed.type + '" id="ocr-type-badge">' + parsed.type + '</span></div>' +
      '<div class="ocr-card-stats">' +
        '<div class="ocr-stat"><span class="ocr-stat-lbl">SKILL</span><span class="ocr-stars" id="ocr-sk">' + stars(parsed.skill) + '</span></div>' +
        '<div class="ocr-stat"><span class="ocr-stat-lbl">ACTIVITY</span><span class="ocr-stars" id="ocr-ac">' + stars(parsed.activity) + '</span></div>' +
        '<div class="ocr-stat"><span class="ocr-stat-lbl">FUSES</span><span class="ocr-stars" id="ocr-fuses">' + parsed.fuses + '</span></div>' +
      '</div>' +
      '<div class="ocr-card-traits"><span class="ocr-stat-lbl">TRAITS</span><div style="margin-top:4px" id="ocr-traits">' + traitHtml + '</div></div>' +
    '</div>' +
    '<div class="ocr-confirm-note">Edit values below if needed, then tap ADD.</div>' +
    '<div id="ocr-edit" style="margin-top:12px;display:flex;flex-direction:column;gap:8px">' +

      // Deviation name — searchable dropdown
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<label style="width:70px;font-size:11px;color:var(--td)">NAME</label>' +
        '<div class="dd-wrap" style="flex:1">' +
          '<div class="dd-input" id="ocr-name-dd-trigger" onclick="openOcrNameDD()">' +
            '<input type="text" id="ocr-name-display" value="' + parsed.name + '" placeholder="Search deviation..." ' +
              'style="cursor:pointer;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);padding:4px 8px;border-radius:2px;font-size:12px;width:100%" ' +
              'oninput="renderOcrNameDD(this.value)" onblur="closeOcrNameDDDelayed()">' +
            '<span class="dd-arrow">&#x25BC;</span>' +
          '</div>' +
          '<div class="dd-panel" id="ocr-name-dd-panel" style="min-width:200px;max-height:220px;overflow-y:auto">' +
            '<div class="dd-list" id="ocr-name-dd-list" style="max-height:180px;overflow-y:auto"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:8px">' +
        '<label style="width:70px;font-size:11px;color:var(--td)">SKILL</label>' +
        '<div class="ss" id="ocr-sk-edit"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<label style="width:70px;font-size:11px;color:var(--td)">ACTIVITY</label>' +
        '<div class="ss" id="ocr-ac-edit"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<label style="width:70px;font-size:11px;color:var(--td)">FUSES</label>' +
        '<select id="ocr-fuses-edit" style="background:var(--bg2);color:var(--tx);border:1px solid var(--bd);padding:4px 8px;border-radius:2px">' +
          '<option value="1">1 — Fresh</option><option value="0">0 — Fodder</option>' +
        '</select>' +
      '</div>' +

      // Trait slots — filterable dropdowns
      '<div style="display:flex;align-items:flex-start;gap:8px">' +
        '<label style="width:70px;font-size:11px;color:var(--td);padding-top:4px">TRAITS</label>' +
        '<div style="display:flex;flex-direction:column;gap:6px;flex:1">' +
          '<div class="dd-wrap">' +
            '<div class="dd-input" id="ocr-trait-dd-0-trigger" onclick="openOcrTraitDD(0)">' +
              '<input type="text" id="t-disp-ocr-0" placeholder="Slot 1 — General/Variation" readonly ' +
                'style="cursor:pointer;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);padding:4px 8px;border-radius:2px;font-size:12px;width:100%">' +
              '<span class="dd-arrow">&#x25BC;</span>' +
            '</div>' +
            '<div class="dd-panel" id="trait-panel-ocr-0">' +
              '<div class="dd-search"><input type="text" id="t-srch-ocr-0" placeholder="Search traits..." oninput="renderOcrTraitDD(0)"></div>' +
              '<div class="dd-cats" id="t-cats-ocr-0"></div>' +
              '<div class="dd-list" id="t-list-ocr-0"></div>' +
            '</div>' +
          '</div>' +
          '<div class="dd-wrap">' +
            '<div class="dd-input" id="ocr-trait-dd-1-trigger" onclick="openOcrTraitDD(1)">' +
              '<input type="text" id="t-disp-ocr-1" placeholder="Slot 2 — Type-Specific" readonly ' +
                'style="cursor:pointer;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);padding:4px 8px;border-radius:2px;font-size:12px;width:100%">' +
              '<span class="dd-arrow">&#x25BC;</span>' +
            '</div>' +
            '<div class="dd-panel" id="trait-panel-ocr-1">' +
              '<div class="dd-search"><input type="text" id="t-srch-ocr-1" placeholder="Search traits..." oninput="renderOcrTraitDD(1)"></div>' +
              '<div class="dd-cats" id="t-cats-ocr-1"></div>' +
              '<div class="dd-list" id="t-list-ocr-1"></div>' +
            '</div>' +
          '</div>' +
          '<div class="dd-wrap">' +
            '<div class="dd-input" id="ocr-trait-dd-2-trigger" onclick="openOcrTraitDD(2)">' +
              '<input type="text" id="t-disp-ocr-2" placeholder="Slot 3 — Deviated (Animal/Furniture)" readonly ' +
                'style="cursor:pointer;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);padding:4px 8px;border-radius:2px;font-size:12px;width:100%">' +
              '<span class="dd-arrow">&#x25BC;</span>' +
            '</div>' +
            '<div class="dd-panel" id="trait-panel-ocr-2">' +
              '<div class="dd-search"><input type="text" id="t-srch-ocr-2" placeholder="Search traits..." oninput="renderOcrTraitDD(2)"></div>' +
              '<div class="dd-cats" id="t-cats-ocr-2"></div>' +
              '<div class="dd-list" id="t-list-ocr-2"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Init star editors; store refs for confirmOcrImport
  window._ocrParsed = parsed;
  window._ocrTraits = [null, null, null];

  mkStars('ocr-sk-edit', parsed.skill, function(v) {
    window._ocrParsed.skill = v;
    updateOcrStars('ocr-sk', v);
  });
  mkStars('ocr-ac-edit', parsed.activity, function(v) {
    window._ocrParsed.activity = v;
    updateOcrStars('ocr-ac', v);
  });
  document.getElementById('ocr-fuses-edit').value = parsed.fuses;

  // Pre-fill trait dropdowns with parsed traits
  parsed.traits.forEach(function(t, i) {
    if (i < 3) {
      window._ocrTraits[i] = TRAITS.find(function(tr) { return tr.n === t; }) || null;
      var el = document.getElementById('t-disp-ocr-' + i);
      if (el) el.value = t;
    }
  });

  document.getElementById('ocr-actions').style.display = 'block';
}

// ── Deviation name dropdown (OCR) ──
function openOcrNameDD() {
  renderOcrNameDD('');
}

function renderOcrNameDD(query) {
  var panel = document.getElementById('ocr-name-dd-panel');
  var list = document.getElementById('ocr-name-dd-list');
  var q = (query || '').toLowerCase();
  var filtered = DEVS.filter(function(d) {
    return !q || d.n.toLowerCase().indexOf(q) >= 0;
  });
  list.innerHTML = filtered.map(function(d) {
    return '<div class="dd-item" onclick="pickOcrDev(\'' + d.n.replace(/'/g, "\\'") + '\',\'' + d.t + '\')">' +
      '<div style="flex:1"><div class="dd-item-name">' + d.n + '</div><div class="dd-item-meta">' + d.t + '</div></div>' +
      '<span class="type-badge ' + d.t + '">' + d.t + '</span></div>';
  }).join('');
}

function pickOcrDev(name, type) {
  window._ocrParsed.name = name;
  window._ocrParsed.species = name;
  window._ocrParsed.type = type;
  document.getElementById('ocr-name-display').value = name;
  document.getElementById('ocr-type-badge').textContent = type;
  document.getElementById('ocr-type-badge').className = 'type-badge ' + type;
  document.getElementById('ocr-card-name').textContent = name;
  closeOcrNameDD();
}

function closeOcrNameDDDelayed() {
  setTimeout(function() {
    var panel = document.getElementById('ocr-name-dd-panel');
    if (panel) panel.classList.remove('open');
  }, 200);
}

// ── Trait dropdowns (OCR) ──
var ocrTraitCatFilters = ['', '', ''];

function openOcrTraitDD(idx) {
  renderOcrTraitDD(idx);
  document.getElementById('trait-panel-ocr-' + idx).classList.add('open');
}

function renderOcrTraitDD(idx) {
  var srch = ((document.getElementById('t-srch-ocr-' + idx) || {}).value || '').toLowerCase();
  var cf = ocrTraitCatFilters[idx] || 'All';

  // Slot mapping: 0→S1, 1→S2, 2→S3
  var slots = [idx + 1]; // 0→[1], 1→[2], 2→[3]
  var available = TRAITS.filter(function(t) { return slots.indexOf(t.s) >= 0; });

  var rawCats = ['All'];
  available.forEach(function(t) { if (rawCats.indexOf(t.cat) < 0) rawCats.push(t.cat); });

  var catsEl = document.getElementById('t-cats-ocr-' + idx);
  if (catsEl) catsEl.innerHTML = rawCats.map(function(c) {
    return '<span class="dd-cat ' + (cf === c ? 'act' : '') +
      '" onclick="event.stopPropagation();ocrTraitCatFilters[' + idx + ']=\'' + c +
      '\';renderOcrTraitDD(' + idx + ')">' + c + '</span>';
  }).join('');

  var filtered = available;
  if (cf !== 'All') filtered = filtered.filter(function(t) { return t.cat === cf; });
  if (srch) filtered = filtered.filter(function(t) {
    return t.n.toLowerCase().indexOf(srch) >= 0 || t.d.toLowerCase().indexOf(srch) >= 0;
  });

  var listEl = document.getElementById('t-list-ocr-' + idx);
  if (!listEl) return;
  if (!filtered.length) { listEl.innerHTML = '<div class="dd-empty">No traits found</div>'; return; }

  var cur = window._ocrTraits[idx] ? window._ocrTraits[idx].n : '';
  listEl.innerHTML = filtered.map(function(t) {
    return '<div class="dd-item ' + (t.n === cur ? 'sel' : '') +
      '" onclick="pickOcrTrait(' + idx + ',\'' + t.n.replace(/'/g, "\\'") + '\')">' +
      '<div style="flex:1"><div class="dd-item-name">' + t.n + ' <span class="slot-badge">S' + t.s + '</span></div>' +
      '<div class="dd-item-meta">' + t.d + '</div></div>' +
      '<span class="dd-item-badge tt ' + t.type + '">' + t.type + '</span></div>';
  }).join('');
}

function pickOcrTrait(idx, name) {
  var info = TRAITS.find(function(t) { return t.n === name; });
  window._ocrTraits[idx] = info;
  document.getElementById('t-disp-ocr-' + idx).value = name;
  document.getElementById('trait-panel-ocr-' + idx).classList.remove('open');
}

// Close OCR trait panels on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dd-wrap')) {
    [0, 1, 2].forEach(function(i) {
      var p = document.getElementById('trait-panel-ocr-' + i);
      if (p) p.classList.remove('open');
    });
  }
});

function updateOcrStars(elId, v) {
  var el = document.getElementById(elId);
  if (el) el.textContent = '★'.repeat(v) + '☆'.repeat(5 - v);
}

// ── Step 5: Confirm & import ──
function confirmOcrImport() {
  var parsed = window._ocrParsed;
  if (!parsed) return;

  var editedSkill  = parseInt(document.getElementById('ocr-sk-edit').dataset.val || parsed.skill);
  var editedAct    = parseInt(document.getElementById('ocr-ac-edit').dataset.val || parsed.activity);
  var editedFuses  = parseInt(document.getElementById('ocr-fuses-edit').value) || parsed.fuses;

  // Read traits from the dropdown-backed display inputs
  var editedTraits = [0, 1, 2].map(function(i) {
    var el = document.getElementById('t-disp-ocr-' + i);
    return el ? el.value.trim() : '';
  }).filter(Boolean);

  var dev = {
    id:       Date.now(),
    name:     parsed.name,
    species:  parsed.species,
    type:     parsed.type,
    skill:    editedSkill,
    activity: editedAct,
    fuses:    editedFuses,
    traits:   editedTraits,
    notes:    'screenshot import'
  };

  inv.push(dev);
  save();
  renderInv();
  closeModalDirect();
  window._ocrParsed  = null;
  window._ocrTraits  = [null, null, null];

  var invTabBtn = document.querySelector('.tb[onclick*="inventory"]');
  if (invTabBtn) invTabBtn.click();
}

// ── Utility ──
function fuzzyMatch(a, b) {
  a = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  b = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return true;
  if (Math.abs(a.length - b.length) > 3) return false;
  var matches = 0;
  for (var j = 0; j < b.length; j++) {
    if (a.indexOf(b[j]) >= 0) matches++;
  }
  return matches >= b.length * 0.7;
}

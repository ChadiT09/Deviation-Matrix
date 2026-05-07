/**
 * js/exportimport.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Export / Import for:
 *   - Deviation Inventory  (oh4_inv)
 *   - Animal counts        (oh4_matc, kind=Animal)
 *   - Furniture counts     (oh4_matc, kind=Furniture)
 *
 * Uses SheetJS (CDN) to read/write .xlsx files.
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ════════ EXPORT ════════
function exportToXLSX() {
  var wb = XLSX.utils.book_new();

  // ── Sheet 1: Deviation Inventory ──
  var invRows = inv.map(function(d) {
    return {
      ID:       d.id,
      Name:     d.name,
      Species:  d.species,
      Type:     d.type,
      Fuses:    d.fuses,
      Skill:    d.skill,
      Activity: d.activity,
      Trait1:   d.traits[0] || '',
      Trait2:   d.traits[1] || '',
      Trait3:   d.traits[2] || '',
      Notes:    d.notes || ''
    };
  });
  if (!invRows.length) invRows = [{ ID:'', Name:'', Species:'', Type:'', Fuses:'', Skill:'', Activity:'', Trait1:'', Trait2:'', Trait3:'', Notes:'' }];
  var wsInv = XLSX.utils.json_to_sheet(invRows);
  wsInv['!cols'] = [
    {wch:14},{wch:20},{wch:20},{wch:12},{wch:6},
    {wch:6},{wch:8},{wch:22},{wch:22},{wch:22},{wch:28}
  ];
  XLSX.utils.book_append_sheet(wb, wsInv, 'Deviation Inventory');

  // ── Sheet 2: Animals ──
  var animalRows = MAT_DEFS.filter(function(m){ return m.kind === 'Animal'; }).map(function(m){
    return { ID: m.id, Name: m.name, Trait: m.trait, Description: m.d, Count: getMatCount(m.id) };
  });
  if (!animalRows.length) animalRows = [{ ID:'', Name:'', Trait:'', Description:'', Count:'' }];
  var wsAni = XLSX.utils.json_to_sheet(animalRows);
  wsAni['!cols'] = [{wch:18},{wch:24},{wch:24},{wch:36},{wch:8}];
  XLSX.utils.book_append_sheet(wb, wsAni, 'Animals');

  // ── Sheet 3: Furniture ──
  var furnitureRows = MAT_DEFS.filter(function(m){ return m.kind === 'Furniture'; }).map(function(m){
    return { ID: m.id, Name: m.name, Trait: m.trait, Description: m.d, Count: getMatCount(m.id) };
  });
  if (!furnitureRows.length) furnitureRows = [{ ID:'', Name:'', Trait:'', Description:'', Count:'' }];
  var wsFur = XLSX.utils.json_to_sheet(furnitureRows);
  wsFur['!cols'] = [{wch:18},{wch:24},{wch:24},{wch:36},{wch:8}];
  XLSX.utils.book_append_sheet(wb, wsFur, 'Furniture');

  // ── Download ──
  var date = new Date();
  var stamp = date.getFullYear() + '-' +
    String(date.getMonth()+1).padStart(2,'0') + '-' +
    String(date.getDate()).padStart(2,'0');
  XLSX.writeFile(wb, 'deviation-matrix-' + stamp + '.xlsx');
}


// ════════ IMPORT ════════
function triggerImport() {
  document.getElementById('xlsx-import-input').click();
}

function handleImportFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var wb   = XLSX.read(data, { type: 'array' });

      var imported = { inventory: 0, animals: 0, furniture: 0 };

      // ── Sheet 1: Deviation Inventory ──
      if (wb.SheetNames.indexOf('Deviation Inventory') >= 0) {
        var rows = XLSX.utils.sheet_to_json(wb.Sheets['Deviation Inventory']);
        var newInv = rows
          .filter(function(r){ return r.Species; })
          .map(function(r){
            var traits = [r.Trait1, r.Trait2, r.Trait3].filter(Boolean);
            return {
              id:       r.ID || Date.now() + Math.random(),
              name:     r.Name     || r.Species,
              species:  r.Species,
              type:     r.Type     || 'Combat',
              fuses:    parseInt(r.Fuses)    || 0,
              skill:    parseInt(r.Skill)    || 3,
              activity: parseInt(r.Activity) || 3,
              traits:   traits,
              notes:    r.Notes    || ''
            };
          });
        inv = newInv;
        imported.inventory = newInv.length;
      }

      // ── Sheet 2: Animals ──
      if (wb.SheetNames.indexOf('Animals') >= 0) {
        var aRows = XLSX.utils.sheet_to_json(wb.Sheets['Animals']);
        aRows.forEach(function(r){
          if (r.ID !== undefined && r.ID !== '') {
            var v = parseInt(r.Count) || 0;
            if (v < 0) v = 0;
            matCounts[r.ID] = v;
            imported.animals++;
          }
        });
      }

      // ── Sheet 3: Furniture ──
      if (wb.SheetNames.indexOf('Furniture') >= 0) {
        var fRows = XLSX.utils.sheet_to_json(wb.Sheets['Furniture']);
        fRows.forEach(function(r){
          if (r.ID !== undefined && r.ID !== '') {
            var v = parseInt(r.Count) || 0;
            if (v < 0) v = 0;
            matCounts[r.ID] = v;
            imported.furniture++;
          }
        });
      }

      save();
      renderInv();
      renderMatCounters();

      alert(
        'Import successful!\n' +
        '• ' + imported.inventory + ' deviations loaded\n' +
        '• ' + imported.animals   + ' animal counts updated\n' +
        '• ' + imported.furniture + ' furniture counts updated'
      );

    } catch(err) {
      alert('Import failed. Make sure you are using a file exported from Deviation Matrix.\n\nError: ' + err.message);
    }
    // reset input so same file can be re-imported
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

// ════════ JSON EXPORT ════════
function exportToJSON() {
  var data = {
    version: 1,
    exported: new Date().toISOString(),
    inventory: inv,
    materials: matCounts
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'deviation-matrix-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function triggerJSONImport() {
  document.getElementById('json-import-input').click();
}

function handleImportJSON(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      if (data.inventory) inv = data.inventory;
      if (data.materials) matCounts = data.materials;
      save();
      renderInv();
      renderMatCounters();
      alert('JSON import successful! ' + (data.inventory ? data.inventory.length : 0) + ' deviations loaded.');
    } catch(err) {
      alert('JSON import failed: ' + err.message);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ════════ BUILD CODE (compact Base64) ════════
function showBuildCode() {
  var data = {
    v: 1,
    i: inv,
    m: matCounts
  };
  var code = btoa(encodeURIComponent(JSON.stringify(data)));
  
  document.getElementById('modal-body').innerHTML =
    '<h3>BUILD CODE</h3>' +
    '<p style="font-size:12px;color:var(--td);margin-bottom:10px">Copy this code to share or save your inventory. Paste it below to restore.</p>' +
    '<textarea id="build-code-ta" style="width:100%;height:100px;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-family:var(--mono);font-size:11px;padding:8px;border-radius:2px;resize:none" readonly onclick="this.select();document.execCommand(\'copy\');this.nextSibling.nextSibling.style.display=\'block\'">' + code + '</textarea>' +
    '<div id="copy-confirm" style="display:none;font-size:11px;color:var(--cg);margin-top:4px">Copied!</div>' +
    '<div style="margin-top:12px">' +
      '<input type="text" id="load-code-input" placeholder="Paste code here to load..." style="width:100%;margin-bottom:8px">' +
      '<button class="btn btn-p btn-sm" onclick="loadBuildCode()">LOAD CODE</button>' +
    '</div>' +
    '<button class="btn btn-sm" onclick="closeModalDirect()" style="margin-top:12px">CLOSE</button>';
  document.getElementById('modal-overlay').style.display = 'flex';
}

function loadBuildCode() {
  var code = document.getElementById('load-code-input').value.trim();
  if (!code) { alert('Paste a build code first.'); return; }
  try {
    var data = JSON.parse(decodeURIComponent(atob(code)));
    if (data.i) inv = data.i;
    if (data.m) matCounts = data.m;
    save();
    renderInv();
    renderMatCounters();
    closeModalDirect();
    alert('Build code loaded successfully!');
  } catch(err) {
    alert('Invalid build code: ' + err.message);
  }
}

// ════════ SCREENSHOT OCR IMPORT (Tesseract.js — runs locally, no API key needed) ════════
var _ocrParsedDevs = [];

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

function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Build a compact deviation name → info map ──
var _devNameMap = null;
function getDevNameMap() {
  if (_devNameMap) return _devNameMap;
  _devNameMap = {};
  DEVS.forEach(function(d) { _devNameMap[d.n.toLowerCase()] = d; });
  return _devNameMap;
}

// ── Known trait abbreviations OCR might produce ──
var TRUNC_MAP = {
  'Fluffy Curse V':      'Fluffy Curse',
  'Stable Vitality':     'Stable Vitality',
  'Rise and Shine 1':    'Rise and Shine',
  'Psychic Kid':         'Psychic Kid',
  'It Moonlight':       'Moonlight Assault',
  'Infrasonic Illus':    'Infrasonic Illusion',
  'A World of Ch':      'A World of Charm',
  'A World of C':       'A World of Charm',
  'Forever Youn':       'Forever Young',
  'Moonlight Assa':     'Moonlight Assault',
  'Starfall Inver':     'Starfall Inversion',
  'Aberrant Proge':     'Aberrant Progeny',
  'HP -3':              'HP Boost',
  'Covert Energ':       'Covert Energy',
  'Stable Energ':        'Stable Energy',
  'Upper Hand':         'Upper Hand',
  'Move More':          'Move More',
  'Living Map':         'Living Map',
  'Productivity Fir':   'Productivity First',
  'Dream Wild':         'Dream Wild',
  'Come As One':        'Come As One',
  'Mineral Talen':      'Mineral Talent',
  'Work of Profici':    'Work of Proficiency',
};

function resolveTruncation(raw) {
  if (TRUNC_MAP[raw]) return TRUNC_MAP[raw];
  for (var t in TRUNC_MAP) {
    if (t.startsWith(raw) || raw.startsWith(t.slice(0, Math.min(raw.length, 6)))) {
      return TRUNC_MAP[t];
    }
  }
  return raw;
}

async function handleScreenshotImport(event) {
  var file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  var modalBody = document.getElementById('modal-body');
  document.getElementById('modal-overlay').style.display = 'flex';
  modalBody.innerHTML =
    '<h3>📸 Game Card Scanner</h3>' +
    '<p style="font-size:11px;color:var(--td);margin-bottom:10px">Take a <u>screenshot of ONE deviation card</u> from your game. Cards are read one at a time for best accuracy.</p>' +
    '<img src="" id="ocr-preview" style="display:none;max-width:100%;border:1px solid var(--bd);margin:10px 0;border-radius:4px">' +
    '<div id="ocr-status" style="font-size:12px;color:var(--td);margin:10px 0">Initializing Tesseract...</div>' +
    '<div id="ocr-progress" style="height:4px;background:var(--bd);border-radius:2px;margin:10px 0"><div id="ocr-bar" style="height:100%;background:var(--c);width:0%;transition:width .3s;border-radius:2px"></div></div>' +
    '<div id="ocr-results" style="display:none"></div>' +
    '<button class="btn btn-sm" onclick="closeModalDirect()" style="margin-top:8px">CANCEL</button>';

  try {
    var preview = document.getElementById('ocr-preview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';

    document.getElementById('ocr-status').textContent = 'Loading Tesseract worker (first time takes a moment)...';
    document.getElementById('ocr-bar').style.width = '10%';

    // Use Tesseract.js — runs 100% on-device, no API key, no billing
    var result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: function(m) {
          if (m.status === 'recognizing text') {
            var pct = Math.round(m.progress * 100);
            document.getElementById('ocr-bar').style.width = (10 + pct * 0.85) + '%';
            document.getElementById('ocr-status').textContent = 'Reading card text... ' + pct + '%';
          }
        }
      }
    );

    document.getElementById('ocr-bar').style.width = '95%';
    document.getElementById('ocr-status').textContent = 'Parsing card data...';

    var text = result.data.text;
    var parsed = parseCardFromText(text);

    document.getElementById('ocr-bar').style.width = '100%';

    if (!parsed.name) {
      document.getElementById('ocr-results').style.display = 'block';
      document.getElementById('ocr-results').innerHTML =
        '<div style="color:var(--cd);padding:10px 0">Could not read a deviation card. Make sure the card is clearly visible and try again.</div>' +
        '<div style="font-size:10px;color:var(--tm);margin-top:8px">Raw text:<br><pre style="white-space:pre-wrap;margin-top:4px">' + text.slice(0, 400) + '</pre></div>';
      document.getElementById('ocr-status').textContent = 'Scan failed — no card detected';
      return;
    }

    // ── Render editable preview ──
    var devMap = getDevNameMap();
    var devInfo = devMap[parsed.name.toLowerCase()] || { n: parsed.name, t: parsed.type || 'Combat' };

    document.getElementById('ocr-results').style.display = 'block';
    document.getElementById('ocr-results').innerHTML =
      '<div style="font-size:11px;color:var(--cg);margin-bottom:8px">✓ Card scanned — review and edit below before adding</div>' +
      '<div style="border:1px solid var(--bd);padding:10px;background:rgba(0,18,32,.6);margin-bottom:10px;font-size:12px">' +
        '<div style="margin-bottom:8px">' +
          '<label style="color:var(--td);font-size:10px">DEVIATION NAME</label><br>' +
          '<input type="text" id="ocr-name" value="' + escHtml(devInfo.n) + '" style="width:100%;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px">' +
        '</div>' +
        '<div style="margin-bottom:8px">' +
          '<label style="color:var(--td);font-size:10px">TYPE</label><br>' +
          '<select id="ocr-type" style="background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px">' +
            '<option value="Combat"' + (devInfo.t === 'Combat' ? ' selected' : '') + '>Combat</option>' +
            '<option value="Territory"' + (devInfo.t === 'Territory' ? ' selected' : '') + '>Territory</option>' +
            '<option value="Crafting"' + (devInfo.t === 'Crafting' ? ' selected' : '') + '>Crafting</option>' +
          '</select>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:8px">' +
          '<div style="flex:1">' +
            '<label style="color:var(--td);font-size:10px">SKILL ★</label><br>' +
            '<input type="number" id="ocr-skill" value="' + parsed.skill + '" min="1" max="5" style="width:60px;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px">' +
          '</div>' +
          '<div style="flex:1">' +
            '<label style="color:var(--td);font-size:10px">ACTIVITY ★</label><br>' +
            '<input type="number" id="ocr-activity" value="' + parsed.activity + '" min="1" max="5" style="width:60px;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px">' +
          '</div>' +
          '<div style="flex:1">' +
            '<label style="color:var(--td);font-size:10px">FUSES</label><br>' +
            '<input type="number" id="ocr-fuses" value="' + parsed.fuses + '" min="0" max="9" style="width:60px;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px">' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:4px">' +
          '<label style="color:var(--td);font-size:10px">TRAITS (up to 3)</label>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:5px">' +
          '<div><input type="text" id="ocr-trait-0" value="' + escHtml(parsed.traits[0] || '') + '" placeholder="Trait 1" style="width:100%;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px"></div>' +
          '<div><input type="text" id="ocr-trait-1" value="' + escHtml(parsed.traits[1] || '') + '" placeholder="Trait 2" style="width:100%;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px"></div>' +
          '<div><input type="text" id="ocr-trait-2" value="' + escHtml(parsed.traits[2] || '') + '" placeholder="Trait 3" style="width:100%;background:rgba(0,18,32,.9);border:1px solid var(--bd);color:var(--c);font-size:12px;padding:5px;border-radius:2px"></div>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-p" onclick="confirmOcrImport()">+ ADD TO INVENTORY</button>';

    document.getElementById('ocr-status').textContent = 'Card scanned — edit if needed';

    // Store parsed for confirm
    _ocrParsedDevs = [parsed];

  } catch(err) {
    document.getElementById('ocr-status').textContent = 'Error: ' + err.message;
    document.getElementById('ocr-bar').style.width = '100%';
    document.getElementById('ocr-bar').style.background = 'var(--cd)';
  }
}

function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function parseCardFromText(text) {
  var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
  var devMap = getDevNameMap();
  var result = { name: null, type: 'Combat', skill: 3, activity: 3, fuses: 1, traits: [] };

  var KNOWN_TRAITS = [
    'Moonlight Assault','Crack Shot','Power Rewind','Lunar Oracle','Starfall Inversion',
    'Psychic Kid','Weakspot Master','Marine Star','Aberrant Progeny','Chaos',
    'Fluffy Curse','Frigid Touch','Infrasonic Illusion','Dazing Aura',
    'Upper Hand','Optimist','Covert Energy','Stable Energy','Stable Vitality',
    'Move More','Living Map','Stardust Affinity','Productivity First',
    'Dream Wild','Sweet Talk','Hydrophilic','Water Dormancy','Buy 1 Get 1',
    'Come As One','Mineral Talent','Work of Proficiency',
    'A World of Charm','Forever Young','HP Boost','Enchanting Void',
    'Rise and Shine','Iron Guardian','Bloodlust','Mortal Kombat'
  ];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lower = line.toLowerCase();

    // ── Deviation name: look for known deviation names in text ──
    if (!result.name) {
      for (var d in devMap) {
        if (lower.indexOf(d) >= 0) {
          result.name = devMap[d].n;
          result.type = devMap[d].t;
          break;
        }
      }
    }

    // ── "Name - Species" pattern ──
    if (!result.name) {
      var dashM = line.match(/^([A-Za-z0-9\s]+?)\s*-\s*(.+)$/);
      if (dashM) {
        var left = dashM[1].trim().toLowerCase();
        var right = dashM[2].trim().toLowerCase();
        if (devMap[right]) { result.name = devMap[right].n; result.type = devMap[right].t; }
        else if (devMap[left]) { result.name = devMap[left].n; result.type = devMap[left].t; }
      }
    }

    // ── Skill stars (★ or ⭐) ──
    var stars = (line.match(/★/g) || []).length;
    if (stars > 0 && stars <= 5) {
      if (lower.indexOf('skill') >= 0 || lower.indexOf('⭐') >= 0) result.skill = stars;
      else if (lower.indexOf('activ') >= 0) result.activity = stars;
    }

    // ── Numeric S/5 or A/5 ──
    var sM = line.match(/S[\/:\s]*(\d)/i);
    if (sM) result.skill = Math.min(5, Math.max(1, parseInt(sM[1])));
    var aM = line.match(/A[\/:\s]*(\d)/i);
    if (aM) result.activity = Math.min(5, Math.max(1, parseInt(aM[1])));

    // ── Fuse count ──
    var fuseM = line.match(/(\d+)\s*[fF]use/i);
    if (fuseM) result.fuses = Math.max(1, parseInt(fuseM[1]));

    // ── Traits: resolve truncations first ──
    var resolved = resolveTruncation(line);
    for (var j = 0; j < KNOWN_TRAITS.length; j++) {
      var tn = KNOWN_TRAITS[j];
      var searchable = lower.replace(/v+$/i, '').replace(/1+$/, '');
      if (searchable.indexOf(tn.toLowerCase()) >= 0 || tn.toLowerCase().indexOf(searchable) >= 0) {
        if (result.traits.indexOf(tn) < 0 && result.traits.length < 3) {
          result.traits.push(tn);
        }
      }
    }
  }

  // Default name if still not found
  if (!result.name) {
    // Try first line with any alpha characters as fallback
    for (var i = 0; i < lines.length; i++) {
      if (/[a-zA-Z]{4,}/.test(lines[i])) {
        result.name = lines[i].replace(/[^\w\s]/g, '').trim();
        break;
      }
    }
    if (!result.name) result.name = 'Unknown';
  }

  return result;
}

function confirmOcrImport() {
  var devs = _ocrParsedDevs || [];
  if (!devs.length) return;

  // Read values from edit fields
  var name    = document.getElementById('ocr-name').value.trim();
  var type    = document.getElementById('ocr-type').value;
  var skill   = Math.min(5, Math.max(1, parseInt(document.getElementById('ocr-skill').value) || 3));
  var activity = Math.min(5, Math.max(1, parseInt(document.getElementById('ocr-activity').value) || 3));
  var fuses   = Math.max(0, parseInt(document.getElementById('ocr-fuses').value) || 0);
  var traits  = [
    document.getElementById('ocr-trait-0').value.trim(),
    document.getElementById('ocr-trait-1').value.trim(),
    document.getElementById('ocr-trait-2').value.trim()
  ].filter(Boolean);

  // Map trait names to canonical names
  var traitMap = {};
  TRAITS.forEach(function(t) { traitMap[t.n.toLowerCase()] = t.n; });
  traits = traits.map(function(t) {
    var low = t.toLowerCase();
    if (traitMap[low]) return traitMap[low];
    // Fuzzy: check if any known trait starts with this prefix
    for (var k in traitMap) {
      if (k.startsWith(low.slice(0, 6))) return traitMap[k];
    }
    return t;
  });

  // Add to inventory
  inv.push({
    id: Date.now(),
    name: name,
    species: name,
    type: type,
    fuses: fuses,
    skill: skill,
    activity: activity,
    traits: traits,
    notes: 'card scan'
  });

  save();
  renderInv();
  closeModalDirect();

  // Switch to inventory tab
  sw('inventory', document.querySelector('.tb'));

  alert('Added "' + name + '" to your inventory!');
}

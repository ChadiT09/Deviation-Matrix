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

// ════════ SCREENSHOT OCR IMPORT ════════
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

var _ocrWorker = null;
async function getOcrWorker() {
  if (!_ocrWorker) {
    _ocrWorker = await Tesseract.createWorker('eng');
  }
  return _ocrWorker;
}

async function handleScreenshotImport(event) {
  var file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  var modalBody = document.getElementById('modal-body');
  document.getElementById('modal-overlay').style.display = 'flex';
  modalBody.innerHTML =
    '<h3>📸 Scanning Screenshot...</h3>' +
    '<img src="" id="ocr-preview" style="display:none;max-width:100%;border:1px solid var(--bd);margin:10px 0;border-radius:4px">' +
    '<div id="ocr-status" style="font-size:12px;color:var(--td);margin:10px 0">Initializing OCR engine...</div>' +
    '<div id="ocr-progress" style="height:4px;background:var(--bd);border-radius:2px;margin:10px 0"><div id="ocr-bar" style="height:100%;background:var(--c);width:0%;transition:width .3s;border-radius:2px"></div></div>' +
    '<div id="ocr-results" style="display:none;max-height:300px;overflow-y:auto;font-size:11px;font-family:var(--mono);background:rgba(0,18,32,.7);padding:10px;border:1px solid var(--bd)"></div>' +
    '<div id="ocr-actions" style="display:none;margin-top:10px"><button class="btn btn-p" onclick="confirmOcrImport()">+ ADD TO INVENTORY</button></div>' +
    '<button class="btn btn-sm" onclick="closeModalDirect()" style="margin-top:8px">CANCEL</button>';

  try {
    var preview = document.getElementById('ocr-preview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';

    document.getElementById('ocr-status').textContent = 'Loading OCR engine (first time may take a moment)...';
    document.getElementById('ocr-bar').style.width = '20%';

    var worker = await getOcrWorker();
    document.getElementById('ocr-status').textContent = 'Recognizing text...';
    document.getElementById('ocr-bar').style.width = '40%';

    var result = await worker.recognize(file);
    document.getElementById('ocr-bar').style.width = '70%';
    document.getElementById('ocr-status').textContent = 'Parsing deviations...';

    var text = result.data.text;
    var parsed = parseDeviationsFromText(text);

    document.getElementById('ocr-bar').style.width = '100%';
    document.getElementById('ocr-status').textContent = parsed.length + ' potential deviation(s) found';

    var resultsEl = document.getElementById('ocr-results');
    resultsEl.style.display = 'block';

    if (parsed.length === 0) {
      resultsEl.innerHTML = '<div style="color:var(--cd)">No deviations detected. Try a clearer screenshot of your inventory grid.</div><div style="margin-top:8px;font-size:10px;color:var(--tm)">Raw text:<br><pre style="white-space:pre-wrap;margin-top:4px">' + text.slice(0,500) + '</pre></div>';
    } else {
      resultsEl.innerHTML = parsed.map(function(d, i) {
        return '<div style="margin-bottom:8px;padding:6px;border:1px solid var(--bd)">' +
          '<div style="color:var(--c);font-weight:600">' + (i+1) + '. ' + d.name + '</div>' +
          '<div style="color:var(--td);font-size:10px">' + d.species + ' | Skill:' + d.skill + ' Act:' + d.activity + ' | Fuses:' + d.fuses + '</div>' +
          '<div style="color:var(--cg);font-size:10px">' + (d.traits.length ? d.traits.join(', ') : 'no traits') + '</div>' +
          '<div style="font-size:9px;color:' + (d.matchQuality === 'high' ? 'var(--cg)' : 'var(--ca)') + ';margin-top:2px">Confidence: ' + d.matchQuality + '</div>' +
          '</div>';
      }).join('');
      document.getElementById('ocr-actions').style.display = 'block';
      window._pendingOcrDeviations = parsed;
    }
  } catch(err) {
    document.getElementById('ocr-status').innerHTML = '<span style="color:var(--cd)">OCR failed: ' + err.message + '</span>';
    console.error('OCR error:', err);
  }
}

function parseDeviationsFromText(text) {
  var deviations = [];
  var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);

  // ── Trait name patterns to look for ──
  var TRAIT_KEYWORDS = [
    'Moonlight Assault','Crack Shot','Power Rewind','Lunar Oracle','Starfall Inversion',
    'Psychic Kid','Weakspot Master','Marine Star','Aberrant Progeny','Chaos',
    'Fluffy Curse','Frigid Touch','Infrasonic Illusion','Dazing Aura','Iron意志',
    'Upper Hand','Optimist','Covert Energy','Stable Energy','Stable Vitality',
    'Move More','Living Map','Stardust Affinity','Productivity First',
    'Dream Wild','Sweet Talk','Hydrophilic','Water Dormancy','Buy 1 Get 2',
    'Come As One','Mineral Talent','Work of Proficiency'
  ];

  // ── Known deviation names to look for ──
  var KNOWN_DEVS = DEVS.map(function(d){ return d.n; });

  // ── Skill/Activity star patterns ──
  var starPattern = /[\*★☆•·]+|(\d+)\/5|S(\d)|A(\d)/gi;
  // Fuse pattern
  var fusePattern = /fuse[s]?[:\s]*(\d+)|(\d+)\s*fuse/i;

  var i = 0;
  while (i < lines.length) {
    var line = lines[i];
    var lower = line.toLowerCase();

    // Check if this line contains a known deviation name
    var matchedDev = null;
    for (var j = 0; j < KNOWN_DEVS.length; j++) {
      if (lower.indexOf(KNOWN_DEVS[j].toLowerCase()) >= 0 ||
          fuzzyMatch(line, KNOWN_DEVS[j])) {
        matchedDev = KNOWN_DEVS[j];
        break;
      }
    }

    if (matchedDev) {
      var dev = {
        name: matchedDev,
        species: matchedDev,
        type: getDevType(matchedDev),
        skill: 3,
        activity: 3,
        fuses: 1,
        traits: [],
        notes: 'ocr import',
        matchQuality: 'medium'
      };

      // Look for stars in nearby lines
      for (var k = Math.max(0, i-2); k <= Math.min(lines.length-1, i+3); k++) {
        if (k === i) continue;
        var check = lines[k];
        var stars = check.match(/★+/g) || check.match(/\*/g) || [];
        if (stars.length > 0) {
          if (check.toLowerCase().indexOf('skill') >= 0 || check.toLowerCase().indexOf('⭐') >= 0) {
            dev.skill = Math.min(5, Math.max(1, stars.length));
          } else if (check.toLowerCase().indexOf('activ') >= 0 || check.toLowerCase().indexOf('act') >= 0) {
            dev.activity = Math.min(5, Math.max(1, stars.length));
          }
        }
        // Try numeric skill/activity
        var numMatch = check.match(/S[:\s]*(\d)/i) || check.match(/Skill[:\s]*(\d)/i);
        if (numMatch) dev.skill = Math.min(5, Math.max(1, parseInt(numMatch[1])));
        var actMatch = check.match(/A[:\s]*(\d)/i) || check.match(/Act[:\s]*(\d)/i);
        if (actMatch) dev.activity = Math.min(5, Math.max(1, parseInt(actMatch[1])));
        // Try star count (★ counts)
        var starCount = (check.match(/★/g) || []).length;
        if (starCount > 0 && starCount <= 5) {
          if (check.toLowerCase().indexOf('skill') >= 0) dev.skill = starCount;
          else if (check.toLowerCase().indexOf('activ') >= 0) dev.activity = starCount;
        }
        // Fuse count
        var fuseM = lines[k].match(/(\d+)\s*fuse/i);
        if (fuseM) dev.fuses = parseInt(fuseM[1]);
        // Trait keywords
        for (var t = 0; t < TRAIT_KEYWORDS.length; t++) {
          if (check.toLowerCase().indexOf(TRAIT_KEYWORDS[t].toLowerCase()) >= 0) {
            var info = getTraitInfo(TRAIT_KEYWORDS[t]);
            if (info && dev.traits.indexOf(info.n) < 0 && dev.traits.length < 3) {
              dev.traits.push(info.n);
            }
          }
        }
      }

      // If we found traits, mark as high quality
      if (dev.traits.length > 0) dev.matchQuality = 'high';

      deviations.push(dev);
      i++;
      continue;
    }

    // Try to detect by trait keywords alone
    for (var t = 0; t < TRAIT_KEYWORDS.length; t++) {
      if (lower.indexOf(TRAIT_KEYWORDS[t].toLowerCase()) >= 0) {
        var info = getTraitInfo(TRAIT_KEYWORDS[t]);
        if (info) {
          // Check if this trait's vfor (variation for) gives us the deviation name
          var devName = null;
          if (info.vfor) {
            devName = info.vfor;
          } else {
            // Check nearby lines for a deviation name
            for (var n = Math.max(0, i-2); n <= Math.min(lines.length-1, i+2); n++) {
              if (n === i) continue;
              for (var d = 0; d < KNOWN_DEVS.length; d++) {
                if (fuzzyMatch(lines[n], KNOWN_DEVS[d])) {
                  devName = KNOWN_DEVS[d];
                  break;
                }
              }
              if (devName) break;
            }
          }

          if (devName) {
            // Check if we already added this deviation
            var existing = deviations.filter(function(x){ return x.species === devName; })[0];
            if (existing && existing.traits.indexOf(info.n) < 0 && existing.traits.length < 3) {
              existing.traits.push(info.n);
            } else if (!existing) {
              deviations.push({
                name: devName, species: devName, type: getDevType(devName),
                skill: 3, activity: 3, fuses: 1,
                traits: [info.n], notes: 'ocr import', matchQuality: 'medium'
              });
            }
          }
        }
        break;
      }
    }
    i++;
  }

  return deviations;
}

function fuzzyMatch(a, b) {
  a = a.toLowerCase().replace(/[^a-z0-9]/g,'');
  b = b.toLowerCase().replace(/[^a-z0-9]/g,'');
  if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return true;
  // Levenshtein-like quick check
  if (Math.abs(a.length - b.length) > 3) return false;
  var matches = 0;
  for (var j = 0; j < b.length; j++) {
    if (a.indexOf(b[j]) >= 0) matches++;
  }
  return matches >= b.length * 0.75;
}

function confirmOcrImport() {
  var devs = window._pendingOcrDeviations || [];
  if (!devs.length) return;
  var added = 0;
  devs.forEach(function(d) {
    // Skip if this deviation already exists in inventory
    var exists = inv.filter(function(x){ return x.species === d.species; });
    if (exists.length > 0) return;
    inv.push({
      id: Date.now() + added,
      name: d.name,
      species: d.species,
      type: d.type,
      fuses: d.fuses,
      skill: d.skill,
      activity: d.activity,
      traits: d.traits,
      notes: d.notes
    });
    added++;
  });
  save();
  renderInv();
  closeModalDirect();
  alert('Added ' + added + ' deviation(s) from screenshot. ' + (devs.length - added) + ' skipped (already in inventory).');
}

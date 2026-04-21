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
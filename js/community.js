/**
 * js/community.js — Meta's Dev & User Data tabs
 * Meta's Dev: Community tier-ranked deviation builds
 * User Data: Import/export/share inventory + build codes
 */

var COMM_TIERS = ['SS','S','A','B','C','D'];
var communityTab = 'All';

// ─═══ META'S DEV ─═══
var COMM_DATA = [
  ['SS','Invincible Sun',   ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['SS','Polar Jelly',      ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['SS','Voodoo Doll',      ['Power Rewind 2 / Fluffy Curse','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['SS','Zapcam',           ['Lunar Oracle','Crack Shot','Moonlight Assault']],
  ['S','Brave George',      ['Power Rewind 2','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['S',"Butterfly's Emissary",['Power Rewind 2','Weakspot Master','Moonlight Assault']],
  ['S','Mr. Wish',          ['Power Rewind 2','Crack Shot','Chaos','Moonlight Assault']],
  ['S','Zapamander',        ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['A','Dr. Teddy',         ['Aberrant Progeny','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['A','Mini Wonder',       ['Power Rewind 2','Crack Shot','Chaos','Moonlight Assault']],
  ['A','Pyro Dino',          ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['A','Snowsprite',         ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['A','Zeno-Purifier',      ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['B','Festering Gel',      ['Power Rewind 2','Marine Star','Moonlight Assault']],
  ['B','Grumpy Bulb',        ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['B',"Lonewolf's Whisper",['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['B','Soul Summoner',      ['Power Rewind 2','Crack Shot','Moonlight Assault']],
  ['B','Whalepup',           ['Power Rewind 2','Crack Shot','Moonlight Assault']],
  ['C','Mini Feaster',       ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['C','Shattered Maiden',   ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['D','By-the-Wind',       ['Frigid Touch','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['D','Enchanting Void',   ['Power Rewind 2','Psychic Kid / Crack Shot','Moonlight Assault']],
];

function renderMetaDev() {
  var s = ((document.getElementById('meta-s')||{}).value||'').toLowerCase();
  var tierFilter = communityTab;

  var tiers = ['All','SS','S','A','B','C','D'];
  var tierHtml = '<div class="tier-filter-bar">';
  tiers.forEach(function(t) {
    var cnt = t==='All' ? COMM_DATA.length : COMM_DATA.filter(function(d){return d[0]===t}).length;
    tierHtml += '<button class="tf-btn '+(tierFilter===t?'act':'')+'" onclick="communityTab=\''+t+'\';renderMetaDev()">'+t+' <span class="tf-count">'+cnt+'</span></button>';
  });
  tierHtml += '</div>';
  document.getElementById('meta-tier-bar').innerHTML = tierHtml;

  var filtered = COMM_DATA.filter(function(d) {
    if (tierFilter !== 'All' && d[0] !== tierFilter) return false;
    if (s) {
      var hay = (d[1]+' '+d[2].join(' ')).toLowerCase();
      if (hay.indexOf(s) < 0) return false;
    }
    return true;
  });

  var totalCount = COMM_DATA.length;
  var shownCount = filtered.length;

  var statsHtml = '<div class="comm-stats">' +
    '<div class="cs-item"><div class="cs-val">'+totalCount+'</div><div class="cs-lbl">TOTAL</div></div>' +
    '<div class="cs-item"><div class="cs-val">'+shownCount+'</div><div class="cs-lbl">SHOWN</div></div>' +
    '</div>';

  var content = document.getElementById('meta-con');
  content.innerHTML = statsHtml;

  if (!filtered.length) {
    content.innerHTML += '<div class="es">No deviations match.</div>';
    return;
  }

  var currentTier = null;
  filtered.forEach(function(d) {
    var tier = d[0], name = d[1], traits = d[2];
    if (tier !== currentTier) {
      currentTier = tier;
      content.innerHTML += '<div class="tier-hdr"><span class="tier-badge tier-'+tier.toLowerCase()+'">'+tier+'</span> '+tierLabel(tier)+'</div>';
    }

    var traitHtml = traits.map(function(t) {
      var alts = t.split(' / ');
      var info = getTraitInfo(alts[0]);
      if (info) {
        return traitPill(info.n);
      } else {
        return '<span class="tt unknown" title="Not yet in database">'+t+'</span>';
      }
    }).join('');

    var exists = DEVS.find(function(x){return x.n===name;});
    var devBadge = exists ? '<span class="dev-avail">&#10003; in DB</span>' : '<span class="dev-miss">&#9888; missing</span>';

    // Build traits string for Blueprint
    var traitsForBP = traits.map(function(t) { return t.split(' / ')[0]; });

    content.innerHTML +=
      '<div class="comm-card tier-'+tier.toLowerCase()+'">' +
        '<div class="comm-card-name">'+name+'</div>' +
        '<div class="comm-tier-badge-sm">'+tier+'</div>' +
        '<div class="comm-traits">'+traitHtml+'</div>' +
        '<div class="comm-footer">'+
          devBadge +
          ' <button class="btn btn-sm btn-meta" onclick="goToBlueprint(\''+name.replace(/'/g,"\\'")+'\', '+JSON.stringify(traitsForBP).replace(/"/g,'&quot;')+')">&#9881; BLUEPRINT</button>' +
        '</div>' +
      '</div>';
  });
}

function goToBlueprint(devName, traits) {
  selBpDev = DEVS.find(function(d){return d.n===devName;}) || {n:devName, t:'Combat'};
  document.getElementById('bp-val-display').value = devName;

  var bpBtns = document.querySelectorAll('#bp-val-display');
  if (bpBtns.length) bpBtns[0].dispatchEvent(new Event('change'));

  var traitSlots = [10,11,12];
  bpTVals = [null, null, null];
  traits.forEach(function(tn, i) {
    if (i < 3) {
      bpTVals[i] = getTraitInfo(tn);
      var el = document.getElementById('t-disp-'+traitSlots[i]);
      if (el) el.value = tn;
    }
  });

  var tabBtn = document.querySelector('.tb[onclick*="blueprint"]');
  if (tabBtn) sw('blueprint', tabBtn);

  setTimeout(function() { genBP(); }, 150);
}

function tierLabel(t) {
  return {SS:'Legendary',S:'Epic',A:'Rare',B:'Uncommon',C:'Common',D:'Basic'}[t]||t;
}

// ─═══ USER DATA ─═══
function renderUserData() {
  renderMetaDev();

  var invCount = inv.length;
  var matCount = Object.keys(matCounts).filter(function(k){return matCounts[k]>0;}).length;
  var fuseCount = inv.filter(function(d){return d.fuses>0;}).length;
  var traitCount = 0;
  inv.forEach(function(d){ traitCount += (d.traits||[]).length; });

  document.getElementById('userdata-stats').innerHTML =
    '<div class="ud-stat"><div class="ud-sv">'+invCount+'</div><div class="ud-sl">Deviations</div></div>' +
    '<div class="ud-stat"><div class="ud-sv">'+fuseCount+'</div><div class="ud-sl">With Fuses</div></div>' +
    '<div class="ud-stat"><div class="ud-sv">'+matCount+'</div><div class="ud-sl">Materials</div></div>' +
    '<div class="ud-stat"><div class="ud-sv">'+traitCount+'</div><div class="ud-sl">Traits</div></div>';
}

function exportToJSON() {
  var data = { inv: inv, matCounts: matCounts, version: '4.5', exportDate: new Date().toISOString() };
  var blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'deviation-matrix-backup-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  URL.revokeObjectURL(url);
}

function triggerJSONImport() { document.getElementById('json-import-input').click(); }

function handleJSONImportFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      if (data.inv) inv = data.inv;
      if (data.matCounts) matCounts = data.matCounts;
      save();
      renderInv();
      renderMatCounters();
      renderUserData();
      alert('Import successful! ' + inv.length + ' deviations restored.');
    } catch(err) {
      alert('Import failed: ' + err.message);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function copyBuildCode() {
  var aId = parseInt(document.getElementById('f-a').value);
  var bId = parseInt(document.getElementById('f-b').value);
  if (!aId || !bId) { alert('Select both parents in the Fusion Sim tab first.'); return; }
  var matData = matSlotsF.filter(Boolean).map(function(ms) {
    return ms.type + ':' + (ms.type==='dev' ? ms.id : ms.id);
  }).join(',');

  var code = [
    document.getElementById('f-a').value,
    document.getElementById('f-b').value,
    matData,
    bpSk, bpAc,
    bpTVals.filter(Boolean).map(function(t){return t.n;}).join('|')
  ].join(';');

  var encoded = btoa(code);
  navigator.clipboard.writeText(encoded).then(function() {
    alert('Build code copied to clipboard!');
  }).catch(function() {
    prompt('Copy this build code:', encoded);
  });
}

function loadBuildFromCode() {
  var raw = document.getElementById('load-code-input').value.trim();
  if (!raw) return;
  try {
    var parts = atob(raw).split(';');
    var aId = parseInt(parts[0]), bId = parseInt(parts[1]);

    document.getElementById('f-a').value = aId;
    document.getElementById('f-b').value = bId;

    calcFusion();

    var tabBtn = document.querySelector('.tb[onclick*="blueprint"]');
    if (tabBtn) sw('blueprint', tabBtn);
    setTimeout(function() { genBP(); }, 150);

    alert('Build loaded! Review the Blueprint tab.');
  } catch(err) {
    alert('Invalid build code: ' + err.message);
  }
}

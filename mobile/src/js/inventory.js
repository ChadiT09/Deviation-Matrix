/**
 * js/inventory.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Inventory management:
 *   addDev / editDev / remDev — CRUD for the deviation inventory
 *   renderInv                 — re-renders the inventory grid
 *   renderMatCounters         — renders animal/furniture counter rows
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ════════ ADD / EDIT DEVIATION ════════
function addDev() {
  if (!selDev) { alert('Select a Deviation species.'); return; }
  var traits = tVals.filter(Boolean).map(function(t) { return t.n; });
  var fuses  = parseInt(document.getElementById('i-fuses').value);
  var dev = {
    id:       editingId || Date.now(),
    name:     document.getElementById('i-name').value.trim() || selDev.n,
    species:  selDev.n,
    type:     selDev.t,
    fuses:    fuses,
    skill:    selSkill,
    activity: selAct,
    traits:   traits,
    notes:    document.getElementById('i-notes').value.trim()
  };
  if (editingId) {
    inv = inv.map(function(d) { return d.id === editingId ? dev : d; });
    editingId = null;
  } else {
    inv.push(dev);
  }
  save();
  renderInv();
  resetForm();
}

function resetForm() {
  selDev = null;
  document.getElementById('dev-val-display').value = '';
  document.getElementById('i-name').value  = '';
  document.getElementById('i-notes').value = '';
  document.getElementById('i-type-display').textContent = 'select deviation first';
  document.getElementById('i-type-display').style.color = 'var(--td)';
  tVals = [null, null, null];
  [0, 1, 2].forEach(function(i) {
    var el = document.getElementById('t-disp-' + i);
    if (el) el.value = '';
  });
  selSkill = 3; selAct = 3;
  mkStars('sk-skill', 3, function(v) { selSkill = v; });
  mkStars('sk-act',   3, function(v) { selAct   = v; });
}

function editDev(id) {
  var d = getDev(id);
  if (!d) return;
  editingId = id;
  selDev = DEVS.find(function(x) { return x.n === d.species; }) || { n: d.species, t: d.type };
  document.getElementById('dev-val-display').value = d.species;
  document.getElementById('i-name').value          = d.name !== d.species ? d.name : '';
  document.getElementById('i-type-display').textContent = d.type;
  document.getElementById('i-fuses').value          = d.fuses;
  document.getElementById('i-notes').value          = d.notes || '';
  selSkill = d.skill;
  selAct   = d.activity;
  mkStars('sk-skill', d.skill,    function(v) { selSkill = v; });
  mkStars('sk-act',   d.activity, function(v) { selAct   = v; });
  tVals = d.traits.map(function(n) {
    return TRAITS.find(function(t) { return t.n === n; }) || null;
  });
  while (tVals.length < 3) tVals.push(null);
  d.traits.forEach(function(n, i) {
    var el = document.getElementById('t-disp-' + i);
    if (el) el.value = n;
  });
  sw('inventory', document.querySelector('.tb'));
}

function remDev(id) {
  if (!confirm('Remove?')) return;
  inv = inv.filter(function(d) { return d.id !== id; });
  save();
  renderInv();
}


// ════════ ANIMAL / FURNITURE COUNTER ROWS ════════
function renderMatCounters() {
  var aEl = document.getElementById('animal-counters');
  var fEl = document.getElementById('furniture-counters');
  aEl.innerHTML = '';
  fEl.innerHTML = '';

  MAT_DEFS.forEach(function(m) {
    var cnt = getMatCount(m.id);
    var row =
      '<div class="ctr-row">' +
        '<div class="ctr-name">' + m.name + '</div>' +
        '<div class="ctr-trait">' + m.d + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span class="ctr-val" id="mc-' + m.id + '">' + cnt + '</span>' +
          '<div class="ctr-btn" onclick="setMatCount(\'' + m.id + '\',getMatCount(\'' + m.id + '\')-1)">-</div>' +
          '<div class="ctr-btn" onclick="setMatCount(\'' + m.id + '\',getMatCount(\'' + m.id + '\')+1)">+</div>' +
        '</div>' +
      '</div>';
    if (m.kind === 'Animal') aEl.innerHTML += row;
    else                     fEl.innerHTML += row;
  });

  ['animals-body', 'furniture-body'].forEach(function(id) {
    var b = document.getElementById(id);
    if (b && !b.classList.contains('closed')) b.style.maxHeight = b.scrollHeight + 'px';
  });
}


// ════════ INVENTORY RENDER ════════
function renderInv() {
  var grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  var s   = document.getElementById('inv-srch').value.toLowerCase();
  var ft  = document.getElementById('inv-flt').value;
  var ff  = document.getElementById('inv-fuse').value;
  var fsk = document.getElementById('inv-sk').value;
  var fac = document.getElementById('inv-ac').value;

  var list = inv.filter(function(d) {
    return (ft  === 'all' || d.type === ft) &&
           (!s  || d.name.toLowerCase().indexOf(s) >= 0 ||
                   d.species.toLowerCase().indexOf(s) >= 0 ||
                   d.traits.some(function(t) { return t.toLowerCase().indexOf(s) >= 0; })) &&
           (ff  === 'all' || (ff === '1' && d.fuses > 0) || (ff === '0' && d.fuses === 0)) &&
           (fsk === 'all' || d.skill    === parseInt(fsk)) &&
           (fac === 'all' || d.activity === parseInt(fac));
  });

  if (!list.length) {
    grid.innerHTML = '<div class="es" style="grid-column:1/-1">NO DEVIATIONS LOGGED</div>';
    return;
  }

  list.forEach(function(d) {
    var fc     = d.fuses >= 1 ? 'h' : 'z';
    var fl     = d.fuses === 0 ? 'FODDER' : d.fuses + ' FUSE';
    var traits = d.traits.map(function(t) { return traitPill(t); }).join('');
    var div    = document.createElement('div');
    div.className = 'dc';
    div.innerHTML =
      '<div class="dn">' + d.name + '</div>' +
      '<div style="font-family:var(--mono);font-size:9px;color:var(--td);margin-bottom:6px">' +
        d.species + ' <span class="type-badge ' + d.type + '">' + d.type + '</span></div>' +
      '<div class="sbw"><div class="sl3"><span>SKILL</span><span>' + d.skill + '/5</span></div>' +
        '<div class="sb"><div class="sf" style="width:' + d.skill * 20 + '%"></div></div></div>' +
      '<div class="sbw"><div class="sl3"><span>ACTIVITY</span><span>' + d.activity + '/5</span></div>' +
        '<div class="sb"><div class="sf" style="width:' + d.activity * 20 + '%"></div></div></div>' +
      '<span class="fb ' + fc + '">' + fl + '</span>' +
      (d.traits.length ? '<div class="tl">' + traits + '</div>' : '') +
      (d.notes ? '<div style="margin-top:5px;font-size:10px;color:var(--tm)">' + d.notes + '</div>' : '') +
      '<div style="margin-top:9px;display:flex;gap:6px">' +
        '<button class="btn btn-sm" onclick="editDev(' + d.id + ')">EDIT</button>' +
        '<button class="btn btn-sm btn-d" onclick="remDev(' + d.id + ')">REMOVE</button>' +
      '</div>';
    grid.appendChild(div);
  });
}

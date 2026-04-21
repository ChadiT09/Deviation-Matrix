/**
 * js/blueprint.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Blueprint Architect — generates a recommended fusion path to produce
 * a target Deviation species with desired traits sourced from inventory.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function genBP() {
  var sp  = selBpDev ? selBpDev.n : document.getElementById('bp-val-display').value.trim();
  var out = document.getElementById('bp-out');
  if (!sp) { out.innerHTML = '<div class="es">Select a target deviation.</div>'; return; }

  var cands   = inv.filter(function(d) { return d.species === sp; });
  var parentA = cands.find(function(d) { return d.fuses >= 1; });
  var parentB = cands
    .filter(function(d) { return !parentA || d.id !== parentA.id; })
    .sort(function(x, y) { return (y.skill + y.activity) - (x.skill + x.activity); })[0];

  var traitSources = bpTVals.filter(Boolean).map(function(t) {
    var isA = t.cat === 'Animal', isF = t.cat === 'Furniture';
    var donor = null;
    if (isA || isF) {
      var def = MAT_DEFS.find(function(m) { return m.trait === t.n; });
      if (def && getMatCount(def.id) > 0) donor = { name: def.name };
    } else {
      donor = inv.find(function(d) {
        return d.traits.indexOf(t.n) >= 0 && d.species !== sp;
      });
    }
    return { trait: t.n, info: t, donor: donor, isA: isA, isF: isF };
  });

  var html = '';

  // Missing-donor warnings
  traitSources.filter(function(ts) { return !ts.donor; }).forEach(function(m) {
    html += '<div class="wb"><div class="wi">!</div><div class="wt">MISSING: <b>' + m.trait + '</b></div></div>';
  });

  // Fusion path diagram
  html += '<div class="fc"><div style="text-align:center;margin-bottom:12px;font-family:\'Orbitron\',monospace;font-size:9px;color:var(--tm);letter-spacing:.14em">FUSION PATH</div>';

  html += '<div class="fn ' + (parentA ? 'pa' : 'ms') + '">' +
    '<div class="flab">LEFT PARENT</div>' +
    '<div class="fnam">' + (parentA ? parentA.name : sp) + '</div>' +
    (!parentA ? '<div class="mtag2">NEED ' + sp + '</div>' : '') +
    '</div><div class="fco">+</div>';

  html += '<div class="fn ' + (parentB ? 'pb2' : 'ms') + '">' +
    '<div class="flab">RIGHT PARENT</div>' +
    '<div class="fnam">' + (parentB ? parentB.name : sp) + '</div>' +
    (!parentB ? '<div class="mtag2">NEED 2nd</div>' : '') +
    '</div>';

  if (traitSources.length) {
    html += '<div class="fco">+</div><div class="fn"><div class="flab">MATERIALS</div>';
    traitSources.forEach(function(ts) {
      html +=
        '<div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--bd)">' +
        traitPill(ts.trait) +
        '<span style="font-size:9px;color:' + (ts.donor ? 'var(--td)' : 'var(--cd)') + ';font-family:var(--mono)">' +
        (ts.donor ? ts.donor.name : 'MISSING') + '</span></div>';
    });
    html += '</div>';
  }

  html +=
    '<div class="fco">&darr;</div>' +
    '<div class="fn of2">' +
      '<div class="flab">TARGET</div>' +
      '<div class="fnam" style="color:var(--cg)">' + sp + '</div>' +
      '<div class="fdet">S' + bpSk + '/A' + bpAc + '</div>' +
    '</div></div>';

  out.innerHTML = html;
}

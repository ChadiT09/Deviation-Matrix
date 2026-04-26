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
      if (def) {
        var cnt = getMatCount(def.id);
        donor = { name: def.name, have: cnt, need: 1, isMat: true, def: def };
      }
    } else {
      donor = inv.find(function(d) {
        return d.traits.indexOf(t.n) >= 0 && d.species !== sp;
      });
      if (donor) donor = { name: donor.name, have: 1, need: 1, isMat: false };
    }
    return { trait: t.n, info: t, donor: donor, isA: isA, isF: isF };
  });

  var html = '';

  // Shopping list — all needed materials with proximity indicators
  if (traitSources.length) {
    html += '<div class="rb"><h3>SHOPPING LIST</h3>';
    html += '<div style="font-size:11px;color:var(--td);margin-bottom:10px">What you need to acquire before fusion:</div>';
    traitSources.forEach(function(ts) {
      var have = ts.donor ? ts.donor.have : 0;
      var need = ts.donor ? ts.donor.need : 1;
      var pct  = Math.min(100, Math.round((have / need) * 100));
      var cls  = have >= need ? 'hi' : have > 0 ? 'mi' : 'lo';
      var status = have >= need
        ? '<span style="color:var(--cg)">&#10003; READY</span>'
        : have > 0
          ? '<span style="color:var(--ca)">&#9888; ' + have + '/' + need + ' (partial)</span>'
          : '<span style="color:var(--cd)">&#10007; MISSING</span>';

      html += '<div class="pb" style="margin-bottom:8px">' +
        '<div class="pl" style="min-width:180px">' + traitPill(ts.trait) + '</div>' +
        '<div class="pt"><div class="pf ' + cls + '" style="width:' + pct + '%"></div></div>' +
        '<div class="pp" style="font-size:10px">' + have + '/' + need + '</div></div>';

      var donorName = ts.donor ? ts.donor.name : (isA || isF ? 'Any ' + (isA ? 'Animal' : 'Furniture') + ' with trait' : 'A deviation with ' + ts.trait);
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-top:1px solid var(--bd);font-size:10px">' +
        '<span style="font-family:var(--mono);color:var(--tm)">' + donorName + '</span>' +
        status +
        '</div>';
    });
    html += '</div>';
  }

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

/**
 * js/encyclopedia.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Trait Encyclopedia — searchable, category-filtered reference for all traits.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function renderEnc() {
  var s    = ((document.getElementById('enc-s') || {}).value || '').toLowerCase();
  var devFilter = ((document.getElementById('enc-dev-filter') || {}).value || '').toLowerCase();
  var cats = ['All', 'General', 'Combat', 'Territory', 'Crafting', 'Animal', 'Furniture', 'Variation', 'Chaos'];

  document.getElementById('enc-cats').innerHTML = cats.map(function(c) {
    var count = TRAITS.filter(function(t) { return c === 'All' || t.cat === c; }).length;
    return '<div class="ec ' + (encCat === c ? 'act' : '') +
      '" onclick="encCat=\'' + c + '\';renderEnc()">' + c +
      '<span class="ecnt">' + count + '</span></div>';
  }).join('');

  var filt = TRAITS.filter(function(t) {
    var matchCat   = encCat === 'All' || t.cat === encCat;
    var matchSearch = !s || t.n.toLowerCase().indexOf(s)   >= 0 ||
                      t.d.toLowerCase().indexOf(s)   >= 0 ||
                      t.src.toLowerCase().indexOf(s) >= 0;
    var matchDev   = !devFilter || (t.vfor && t.vfor.toLowerCase().indexOf(devFilter) >= 0) ||
                     (t.src    && t.src.toLowerCase().indexOf(devFilter)    >= 0);
    return matchCat && matchSearch && matchDev;
  });

  document.getElementById('enc-con').innerHTML = filt.length
    ? filt.map(function(t) {
        return '<div class="et">' +
          '<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px">' +
            '<div class="etn">' + t.n + '</div>' +
            '<span class="tt ' + t.type + '" style="font-size:8px">' + t.type + '</span>' +
            '<span class="slot-badge" style="margin-left:auto">S' + t.s + '</span>' +
          '</div>' +
          '<div class="etd">' + t.d + '</div>' +
          '<div class="ets">SRC: <span>' + t.src + '</span>' +
            (t.vfor ? ' | FOR: <span>' + t.vfor + '</span>' : '') +
          '</div></div>';
      }).join('')
    : '<div class="es">No traits match.</div>';
}

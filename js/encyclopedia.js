/**
 * js/encyclopedia.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Trait Encyclopedia — searchable, category-filtered reference for all traits.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function renderEnc() {
  var s    = ((document.getElementById('enc-s') || {}).value || '').toLowerCase();
  var cats = ['All', 'General', 'Combat', 'Territory', 'Crafting', 'Animal', 'Furniture', 'Variation'];

  document.getElementById('enc-cats').innerHTML = cats.map(function(c) {
    return '<div class="ec ' + (encCat === c ? 'act' : '') +
      '" onclick="encCat=\'' + c + '\';renderEnc()">' + c +
      '<span class="ecnt">' + TRAITS.filter(function(t) { return c === 'All' || t.cat === c; }).length + '</span>' +
      '</div>';
  }).join('');

  var filt = TRAITS.filter(function(t) {
    return (encCat === 'All' || t.cat === encCat) &&
           (!s || t.n.toLowerCase().indexOf(s)   >= 0 ||
                  t.d.toLowerCase().indexOf(s)   >= 0 ||
                  t.src.toLowerCase().indexOf(s) >= 0);
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

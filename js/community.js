/**
 * js/community.js
 * Community Suggestions tab - tier-ranked combat deviation builds
 */

var COMM_TIERS = ['SS','S','A','B','C','D'];
var communityTab = 'All';

var COMM_DATA = [
  ['SS','Invincible Sun',   ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['SS','Polar Jelly',      ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['SS','Voodoo Doll',      ['Power Rewind 2 / Fluffy Curse','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['SS','ZapCam',           ['Lunar Oracle','Crack Shot','Moonlight Assault']],
  ['S','Brave George',      ['Power Rewind 2','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['S',"Butterfly's Emissary",['Power Rewind 2','Weakspot Master','Moonlight Assault']],
  ['S','Mr. Wish',          ['Power Rewind 2','Crack Shot','Chaos','Moonlight Assault']],
  ['S','Zapamander',        ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['A','Dr. Teddy',         ['Aberrant Progeny','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['A','Mini Wonder',       ['Power Rewind 2','Crack Shot','Chaos','Moonlight Assault']],
  ['A','Pyro Dino',         ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['A','Snowsprite',        ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['A','Zeno-Purifier',     ['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['B','Festering Gel',     ['Power Rewind 2','Marine Star','Moonlight Assault']],
  ['B','Grumpy Bulb',       ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['B',"Lonewolf's Whisper",['Power Rewind 2','Lunar Oracle','Moonlight Assault']],
  ['B','Soul Summoner',     ['Power Rewind 2','Crack Shot','Moonlight Assault']],
  ['B','Whalepup',          ['Power Rewind 2','Crack Shot','Moonlight Assault']],
  ['C','Mini Feaster',     ['Power Rewind 2','Starfall Inversion','Moonlight Assault']],
  ['C','Shattered Maiden',  ['Power Rewind 2','Psychic Kid','Moonlight Assault']],
  ['D','By-the-Wind',      ['Frigid Touch','Psychic Kid / Crack Shot','Moonlight Assault']],
  ['D','Enchanting Void',   ['Power Rewind 2','Psychic Kid / Crack Shot','Moonlight Assault']],
];

function renderCommunity() {
  var s = ((document.getElementById('comm-s')||{}).value||'').toLowerCase();
  var tierFilter = communityTab;

  var tiers = ['All','SS','S','A','B','C','D'];
  var tierHtml = '<div class="tier-filter-bar">';
  tiers.forEach(function(t) {
    var cnt = t==='All' ? COMM_DATA.length : COMM_DATA.filter(function(d){return d[0]===t}).length;
    tierHtml += '<button class="tf-btn '+(tierFilter===t?'act':'')+'" onclick="communityTab=\''+t+'\';renderCommunity()">'+t+' <span class="tf-count">'+cnt+'</span></button>';
  });
  tierHtml += '</div>';
  document.getElementById('comm-tier-bar').innerHTML = tierHtml;

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

  var content = document.getElementById('comm-con');
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

    content.innerHTML +=
      '<div class="comm-card tier-'+tier.toLowerCase()+'">' +
        '<div class="comm-card-name">'+name+'</div>' +
        '<div class="comm-tier-badge-sm">'+tier+'</div>' +
        '<div class="comm-traits">'+traitHtml+'</div>' +
        '<div class="comm-footer">'+devBadge+'</div>' +
      '</div>';
  });
}

function tierLabel(t) {
  return {SS:'Legendary',S:'Epic',A:'Rare',B:'Uncommon',C:'Common',D:'Basic'}[t]||t;
}

/**
 * data/database.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Static game data for Once Human — Deviation Matrix tool.
 * Contains three datasets:
 *   DEVS      — all playable Deviation species (name + type)
 *   MAT_DEFS  — Animal & Furniture fusion material definitions
 *   TRAITS    — complete trait encyclopedia (slot, name, desc, category, type)
 *
 * To update game data: edit these arrays only; no logic changes required.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ════════ DEVIATION SPECIES ════════
var DEVS = [
  // Combat
  { n: "Butterfly's Emissary", t: "Combat" },
  { n: "By the Wind", t: "Combat" },
  { n: "Dr. Teddy", t: "Combat" },
  { n: "Enchanting Void", t: "Combat" },
  { n: "Festering Gel", t: "Combat" },
  { n: "Grumpy Bulb", t: "Combat" },
  { n: "Invincible Sun", t: "Combat" },
  { n: "Lonewolf's Whisper", t: "Combat" },
  { n: "Mini Feaster", t: "Combat" },
  { n: "Mini Wonder", t: "Combat" },
  { n: "Mr. Wish", t: "Combat" },
  { n: "Polar Jelly", t: "Combat" },
  { n: "Pyro Dino", t: "Combat" },
  { n: "Radiant One", t: "Combat" },
  { n: "Shattered Maiden", t: "Combat" },
  { n: "Snapshot", t: "Combat" },
  { n: "Snowsprite", t: "Combat" },
  { n: "Soul Summoner", t: "Combat" },
  { n: "Voodoo Doll", t: "Combat" },
  { n: "Whalepup", t: "Combat" },
  { n: "Zeno-Purifier", t: "Combat" },

  // Territory
  { n: "Berserkosaurus Rex", t: "Territory" },
  { n: "Buzzy Bee", t: "Territory" },
  { n: "Cattiva", t: "Territory" },
  { n: "Chefosaurus Rex", t: "Territory" },
  { n: "Chillet", t: "Territory" },
  { n: "Chillet Ignis", t: "Territory" },
  { n: "Director Fox", t: "Territory" },
  { n: "Electric Eel", t: "Territory" },
  { n: "Extradimensional Cat", t: "Territory" },
  { n: "Fetch-A-Lot Bunny", t: "Territory" },
  { n: "Flame Essence", t: "Territory" },
  { n: "Gazocchio", t: "Territory" },
  { n: "Growshroom", t: "Territory" },
  { n: "H37", t: "Territory" },
  { n: "Hydronaut Fish", t: "Territory" },
  { n: "Lethal Rabbit", t: "Territory" },
  { n: "Logging Beaver", t: "Territory" },
  { n: "Nutcracker", t: "Territory" },
  { n: "Paper Doll", t: "Territory" },
  { n: "Rain Man", t: "Territory" },
  { n: "Rebecca", t: "Territory" },
  { n: "Tar Pudding", t: "Territory" },
  { n: "The Digby Boy", t: "Territory" },
  { n: "Wish Box", t: "Territory" },


  // Crafting
  { n: "Artisan's Touch", t: "Crafting" },
  { n: "Atomic Lighter", t: "Crafting" },
  { n: "Atomic Snail", t: "Crafting" },
  { n: "Disco Ball", t: "Crafting" },
  { n: "Dreamcatcher", t: "Crafting" },
  { n: "Frog the Leaper", t: "Crafting" },
  { n: "Gingerbread House", t: "Crafting" },
  { n: "Harveseed", t: "Crafting" },
  { n: "Hug-in-a-Bowl", t: "Crafting" },
  { n: "Ice Pot", t: "Crafting" },
  { n: "Masonic Pyramid", t: "Crafting" },
  { n: "Orb Lightning", t: "Crafting" },
  { n: "Party Monkey", t: "Crafting" },
  { n: "Pup Buddy", t: "Crafting" },
  { n: "Snow Globe", t: "Crafting" },
  { n: "Space Turner", t: "Crafting" },
  { n: "Strange Door", t: "Crafting" },
  { n: "Upper World Spawn", t: "Crafting" }

];


// ════════ ANIMAL & FURNITURE MATERIAL DEFINITIONS ════════
var MAT_DEFS = [
  // Animals
  { id: "bear",      name: "Bear",             kind: "Animal",    trait: "Brute Force Rules [Bear]",         d: "Dodge shatters ores/trees. 10% double output." },
  { id: "boar",      name: "Boar",             kind: "Animal",    trait: "Foul Symbiosis [Boar]",            d: "10% +1 Acid on kills / Pollution Zone." },
  { id: "buffalo",   name: "Buffalo",          kind: "Animal",    trait: "Top Grunt [Buffalo]",              d: "No Stamina gathering. Auto Mood-to-Power at 10%." },
  { id: "capybara",  name: "Capybara",         kind: "Animal",    trait: "Mind Massage [Capybara]",          d: "Recover 10% Sanity on return (10m CD)." },
  { id: "crocodile", name: "Crocodile",        kind: "Animal",    trait: "Nightmare Waters [Crocodile]",     d: "Near water, extra fish chance." },
  { id: "deer",      name: "Deer/Goat",        kind: "Animal",    trait: "Herbivore [Deer/Goat]",            d: "Herbivores don't flee. Extra deviated plant." },
  { id: "leopard",   name: "Leopard",          kind: "Animal",    trait: "Feline Creatures [Leopard]",       d: "-50% fall DMG. Extra Lightweight item." },
  { id: "polarbear", name: "Polar Bear",       kind: "Animal",    trait: "Polar Beast [Polar Bear]",         d: "Below 0C: Attack +10% / Mood recovery +10%." },
  { id: "wolf",      name: "Wolf",             kind: "Animal",    trait: "Moonlight Assault [Wolf]",         d: "Night: Power & Mood recovery +15%." },
  // Furniture
  { id: "candelabra",name: "Candelabra",       kind: "Furniture", trait: "Warm Flame [Candelabra]",          d: "+10 Cold Resist in territory." },
  { id: "carton",    name: "Carton",           kind: "Furniture", trait: "Extra Load [Carton]",              d: "Max Load +20 / Max storage +15%." },
  { id: "clock",     name: "Desktop Clock",    kind: "Furniture", trait: "Precision Moment [Clock]",         d: "Mood +10 & Power +10 every hour." },
  { id: "fan",       name: "Fan",              kind: "Furniture", trait: "Master of Temperatures [Fan]",     d: "+10 Heat Resist in territory." },
  { id: "jukebox",   name: "Jukebox",          kind: "Furniture", trait: "Music Resonance [Jukebox]",        d: "DSU needs no music." },
  { id: "lamp",      name: "Warm Lamp",        kind: "Furniture", trait: "Eureka Moment [Lamp]",             d: "DSU needs no light." },
  { id: "sink",      name: "Sink",             kind: "Furniture", trait: "Clean and Hygienic [Sink]",        d: "Sanity auto-recovers to 20%." },
  { id: "table",     name: "Table",            kind: "Furniture", trait: "Knights of The Round Table [Table]",d: "Defense +5%, less Power consumption." },
  { id: "toilet",    name: "Modern Toilet",    kind: "Furniture", trait: "Pollution Adaptation [Toilet]",    d: "Sanity 90% slower in Pollution Zone." }
];


// ════════ TRAIT DATABASE ════════
// Fields: s = slot (1=General, 2=Type-specific, 3=Deviated)
//         n = name,  d = description,  cat = category
//         type = positive | negative | mixed | variation
//         src = source,  vfor = variation-specific deviation,  typeReq = required dev type
var TRAITS = [

  // ── SLOT 1 — GENERAL ──────────────────────────────────────────────────────
  { s:1, n:"Upper Hand",     d:"When Deviant Power drops to 0, auto consume Mood to recover.", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Stable Energy",  d:"Max Deviant Power +30",  cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Stable Vitality",d:"Max Mood +30",           cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist",       d:"Max Mood +15%/+20%/+25%/+30%/+35% (L1-5)",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy",  d:"Max Deviant Power +15%/+20%/+25%/+30%/+35% (L1-5)", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Power Rewind",   d:"Deviant Power recovery speed +5%/+10% (L1-2)",      cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine", d:"Mood recovery speed +5%~+25% (L1-5)",               cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Growing Pains",  d:"Max Power +30%/+40%/+50%; Mood recovery -5% (L1-3)",cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Cheer Up",       d:"Max Mood +30%/+40%/+50%; Power recovery -5% (L1-3)",cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Worn-out",       d:"Max Deviant Power -5%/-10%/-15% (L1-3)",            cat:"General", type:"negative", src:"Any" },
  { s:1, n:"Feeling Blue",   d:"Max Activity Score -5%/-10%/-15% (L1-3)",           cat:"General", type:"negative", src:"Any" },

  // ── SLOT 1 — VARIATIONS ───────────────────────────────────────────────────
  { s:1, n:"Distant Tears",           d:"Max Deviant Power +40%",       cat:"Variation", type:"variation", src:"Lonewolf's Whisper",   vfor:"Lonewolf's Whisper" },
  { s:1, n:"Bursting Magma",          d:"Max Deviant Power +40%",       cat:"Variation", type:"variation", src:"Lonewolf's Whisper",   vfor:"Lonewolf's Whisper" },
  { s:1, n:"Fluffy Curse",            d:"Power recovery speed +10%",    cat:"Variation", type:"variation", src:"Voodoo Doll",          vfor:"Voodoo Doll" },
  { s:1, n:"Pharaoh",                 d:"Mood recovery speed +30%",     cat:"Variation", type:"variation", src:"Enchanting Void",      vfor:"Enchanting Void" },
  { s:1, n:"Violet Robe",             d:"Max Power +40%",               cat:"Variation", type:"variation", src:"Grumpy Bulb",          vfor:"Grumpy Bulb" },
  { s:1, n:"Milk Sugar",              d:"Max Mood +35%",                cat:"Variation", type:"variation", src:"Festering Gel",        vfor:"Festering Gel" },
  { s:1, n:"Ancient Scroll",          d:"Max Power +40%",               cat:"Variation", type:"variation", src:"Butterfly's Emissary", vfor:"Butterfly's Emissary" },
  { s:1, n:"Spring's Return",         d:"Max Mood +35%",                cat:"Variation", type:"variation", src:"Snowsprite",           vfor:"Snowsprite" },
  { s:1, n:"Pumpkin Lantern",         d:"Max Power +10%",               cat:"Variation", type:"variation", src:"Buzzy Bee",            vfor:"Buzzy Bee" },
  { s:1, n:"Radiant Flourish",        d:"Max Mood +8%",                 cat:"Variation", type:"variation", src:"Buzzy Bee",            vfor:"Buzzy Bee" },
  { s:1, n:"Gold Lightning",          d:"Power recovery +15%",          cat:"Variation", type:"variation", src:"Electric Eel",         vfor:"Electric Eel" },
  { s:1, n:"Optimism - Good Fortune", d:"Max Mood +40%",                cat:"Variation", type:"variation", src:"Extradimensional Cat", vfor:"Extradimensional Cat" },
  { s:1, n:"Aquarius",                d:"Mood recovery +30%",           cat:"Variation", type:"variation", src:"Fetch-A-Lot",          vfor:"Fetch-A-Lot" },
  { s:1, n:"Prototype",               d:"Power recovery +10%",          cat:"Variation", type:"variation", src:"H37",                  vfor:"H37" },
  { s:1, n:"Witch's Beloved",         d:"Mood recovery +20%",           cat:"Variation", type:"variation", src:"Paper Doll",           vfor:"Paper Doll" },
  { s:1, n:"Childlike Whimsy",        d:"Power recovery +30%",          cat:"Variation", type:"variation", src:"Rain Man",             vfor:"Rain Man" },
  { s:1, n:"Radiance",                d:"Max Power +40%",               cat:"Variation", type:"variation", src:"Tar Pudding",          vfor:"Tar Pudding" },
  { s:1, n:"White Cliff Remnants",    d:"Max Mood +35%",                cat:"Variation", type:"variation", src:"Space Turner",         vfor:"Space Turner" },
  { s:1, n:"Star Devourer",           d:"Power recovery +10%",          cat:"Variation", type:"variation", src:"Mini Feaster",         vfor:"Mini Feaster" },
  { s:1, n:"Reserved Energy",         d:"Max Energy +40%",              cat:"Variation", type:"variation", src:"Nutcracker",           vfor:"Nutcracker" },
  { s:1, n:"Emerald",                 d:"Energy Recovery +10%",         cat:"Variation", type:"variation", src:"The Digby Boy",        vfor:"The Digby Boy" },

  // ── SLOT 2 — COMBAT ───────────────────────────────────────────────────────
  { s:2, n:"Psychic Kid",     d:"When summoned, Status DMG +5%",  cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Crack Shot",      d:"When summoned, Weapon DMG +5%",  cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Run Fast",        d:"Movement Speed +5%",             cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Beast of Burden", d:"Max Load +8",                    cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Durability",      d:"Stamina Consumption -5%",        cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Wellbeing",       d:"Max Stamina +10",                cat:"Combat", type:"positive", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Brute Force",     d:"Max Load +15 & Movement Speed -5%", cat:"Combat", type:"mixed", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Sedentary",       d:"Max Load -8 in Settlements",     cat:"Combat", type:"negative", src:"Combat Deviations",  typeReq:"Combat" },
  { s:2, n:"Stay Indoors",    d:"Stamina +8% in Settlements",     cat:"Combat", type:"negative", src:"Combat Deviations",  typeReq:"Combat" },

  // ── SLOT 2 — COMBAT VARIATIONS ────────────────────────────────────────────
  { s:2, n:"Starfall Inversion (Voodoo)", d:"+1 Power every 8s (1.5 airborne)", cat:"Variation", type:"variation", src:"Voodoo Doll", vfor:"Voodoo Doll", typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Zapcam)",       d:"Weapon DMG +5% (+7.5% sanity<30%)", cat:"Variation", type:"variation", src:"Zapcam",      vfor:"Zapcam",      typeReq:"Combat" },

  // ── SLOT 2 — TERRITORY ────────────────────────────────────────────────────
  { s:2, n:"A World of Charm",    d:"Dormant Mood, 10% others +Mood 20",       cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Anti-Burnout",        d:"Dormant Power, 20% others +Power 5",      cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Devoted Laborer",     d:"Mood/Power interval +20%",                cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Workaholic",          d:"Mood/Power interval +10%",                cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Voluntary Overtime",  d:"10% no Mood consumed",                   cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Heartthrob",          d:"10% others lose Power or +Mood 5 dormant",cat:"Territory", type:"mixed",    src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Baffling Behavior",   d:"10% others lose Power",                  cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Holding the Team Back",d:"10% others lose Mood",                  cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Lazy Bones",          d:"Working speed -5%",                      cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },

  // ── SLOT 2 — TERRITORY VARIATIONS ────────────────────────────────────────
  { s:2, n:"Daydreaming - Moonlit Jewels", d:"Dormant Power, 20% +15 Power others", cat:"Variation", type:"variation", src:"Extradimensional Cat", vfor:"Extradimensional Cat", typeReq:"Territory" },
  { s:2, n:"Aberrant Progeny",             d:"30% no Mood in Pollution Zone",        cat:"Variation", type:"variation", src:"Rain Man",             vfor:"Rain Man",             typeReq:"Territory" },

  // ── SLOT 2 — CRAFTING ─────────────────────────────────────────────────────
  { s:2, n:"Big Cup",              d:"Max storage +20%",                       cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Super Big Cup",        d:"Max storage +30%",                       cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Speed Up",             d:"Production interval -10%",              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"The Last Night",       d:"Production interval -15%",              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Efficiency Above All", d:"Crafting +20%; Storage -30%",           cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Clumsy",               d:"5% output -1",                          cat:"Crafting", type:"negative", src:"Crafting Deviations", typeReq:"Crafting" },

  // ── SLOT 3 — DEVIATED (Animal / Furniture) ────────────────────────────────
  { s:3, n:"Brute Force Rules [Bear]",            d:"Dodge shatters ores. 10% double output.",    cat:"Animal",    type:"positive", src:"Bear" },
  { s:3, n:"Foul Symbiosis [Boar]",               d:"10% +1 Acid.",                               cat:"Animal",    type:"positive", src:"Boar" },
  { s:3, n:"Top Grunt [Buffalo]",                 d:"No Stamina gathering.",                      cat:"Animal",    type:"positive", src:"Buffalo" },
  { s:3, n:"Mind Massage [Capybara]",             d:"10% Sanity on return.",                      cat:"Animal",    type:"positive", src:"Capybara" },
  { s:3, n:"Nightmare Waters [Crocodile]",        d:"Extra fish near water.",                     cat:"Animal",    type:"positive", src:"Crocodile" },
  { s:3, n:"Herbivore [Deer/Goat]",               d:"Extra deviated plant.",                      cat:"Animal",    type:"positive", src:"Deer or Goat" },
  { s:3, n:"Feline Creatures [Leopard]",          d:"-50% fall DMG. Extra Lightweight.",          cat:"Animal",    type:"positive", src:"Leopard" },
  { s:3, n:"Polar Beast [Polar Bear]",            d:"Below 0C bonuses.",                          cat:"Animal",    type:"positive", src:"Polar Bear" },
  { s:3, n:"Moonlight Assault [Wolf]",            d:"Night recovery +15%.",                       cat:"Animal",    type:"positive", src:"Wolf" },
  { s:3, n:"Warm Flame [Candelabra]",             d:"+10 Cold Resist.",                           cat:"Furniture", type:"positive", src:"Candelabra" },
  { s:3, n:"Extra Load [Carton]",                 d:"Max Load +20. Storage +15%.",                cat:"Furniture", type:"positive", src:"Any Carton" },
  { s:3, n:"Precision Moment [Clock]",            d:"+10 Mood/Power hourly.",                     cat:"Furniture", type:"positive", src:"Desktop Electronic Clock" },
  { s:3, n:"Master of Temperatures [Fan]",        d:"+10 Heat Resist.",                           cat:"Furniture", type:"positive", src:"Any Fan" },
  { s:3, n:"Music Resonance [Jukebox]",           d:"DSU no music needed.",                       cat:"Furniture", type:"positive", src:"Jukebox" },
  { s:3, n:"Eureka Moment [Lamp]",                d:"DSU no light needed.",                       cat:"Furniture", type:"positive", src:"Warm Lamp" },
  { s:3, n:"Clean and Hygienic [Sink]",           d:"Sanity auto-recovers to 20%.",               cat:"Furniture", type:"positive", src:"Sink" },
  { s:3, n:"Knights of The Round Table [Table]",  d:"Defense +5%.",                              cat:"Furniture", type:"positive", src:"Any Table" },
  { s:3, n:"Pollution Adaptation [Toilet]",       d:"Sanity 90% slower pollution.",               cat:"Furniture", type:"positive", src:"Modern Toilet" }
];

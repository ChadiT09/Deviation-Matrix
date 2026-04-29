/**
 * data/database.js
 * -----------------------------------------------------------------------------
 * Static game data for Once Human — Deviation Matrix tool.
 * Contains three datasets:
 *   DEVS      — all playable Deviation species (name + type)
 *   MAT_DEFS  — Animal & Furniture fusion material definitions
 *   TRAITS    — complete trait encyclopedia (slot, name, desc, category, type)
 *
 * To update game data: edit these arrays only; no logic changes required.
 *
 * typeReq can now be a string OR an array of strings for multi-type traits:
 *   typeReq: "Combat"                → only Combat
 *   typeReq: ["Territory","Crafting"] → Territory and Crafting
 * -----------------------------------------------------------------------------
 */

// ======== DEVIATION SPECIES ========
var DEVS = [
  // Combat
  { n: "Butterfly's Emissary", t: "Combat" },
  { n: "By the Wind", t: "Combat" },
  { n: "By-the-Wind", t: "Territory" },
  { n: "Dr. Teddy", t: "Combat" },
  { n: "Enchanting Void", t: "Combat" },
  { n: "Enchanting Void - Starfall Inversion", t: "Combat" },
  { n: "Festering Gel", t: "Combat" },
  { n: "Grumpy Bulb", t: "Combat" },
  { n: "Invincible Sun", t: "Combat" },
  { n: "Lonewolf's Whisper", t: "Combat" },
  { n: "Mini Feaster", t: "Combat" },
  { n: "Mini Feaster - Starfall Inversion", t: "Combat" },
  { n: "Mini Wonder", t: "Combat" },
  { n: "Mini Wonder - Starfall Inversion", t: "Combat" },
  { n: "Mr. Wish", t: "Combat" },
  { n: "Polar Jelly", t: "Combat" },
  { n: "Polar Jelly - Starfall Inversion", t: "Combat" },
  { n: "Pyro Dino", t: "Combat" },
  { n: "Radiant One", t: "Combat" },
  { n: "Shattered Maiden", t: "Combat" },
  { n: "Snapshot", t: "Combat" },
  { n: "Snowsprite", t: "Combat" },
  { n: "Soul Summoner", t: "Combat" },
  { n: "Voodoo Doll", t: "Combat" },
  { n: "Whalepup", t: "Combat" },
  { n: "Zeno-Purifier", t: "Combat" },
  { n: "Brave George", t: "Combat" },
  { n: "Zapcam", t: "Combat" },
  { n: "Zapamander", t: "Combat" },

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
  { n: "Doctor Raven", t: "Territory" },
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


// ======== ANIMAL & FURNITURE MATERIAL DEFINITIONS ========
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
  { id: "like",      name: "Like",             kind: "Furniture", trait: "Neon Flicker [Like]",              d: "+1 max Mood per Neon Flicker deviation in territory." },
  { id: "sink",      name: "Sink",             kind: "Furniture", trait: "Clean and Hygienic [Sink]",        d: "Sanity auto-recovers to 20%." },
  { id: "table",     name: "Table",            kind: "Furniture", trait: "Knights of The Round Table [Table]",d: "Defense +5%, less Power consumption." },
  { id: "toilet",    name: "Modern Toilet",    kind: "Furniture", trait: "Pollution Adaptation [Toilet]",    d: "Sanity 90% slower in Pollution Zone." }
];


// ======== TRAIT DATABASE ========
// Fields: s = slot (1=General, 2=Type-specific, 3=Deviated, 4=Chaos/Special)
//         n = name,  d = description,  cat = category
//         type = positive | negative | mixed | variation
//         src = source,  vfor = variation-specific deviation,  typeReq = required dev type (string or array)
var TRAITS = [

  // ===========================================================================
  // -- SLOT 1 — GENERAL ------------------------------------------------------
  // ===========================================================================
  { s:1, n:"Upper Hand",     d:"When Deviant Power drops to 0, automatically consume All Mood to recover All Deviant Power.", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Stable Energy",  d:"Max Deviant Power +30",    cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Stable Vitality",d:"Max Mood +30",             cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist 1",       d:"Max Mood +15%",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist 2",       d:"Max Mood +20%",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist 3",       d:"Max Mood +25%",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist 4",       d:"Max Mood +30%",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Optimist 5",       d:"Max Mood +35%",          cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy 1",  d:"Max Deviant Power +15%", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy 2",  d:"Max Deviant Power +20%", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy 3",  d:"Max Deviant Power +25%", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy 4",  d:"Max Deviant Power +30%", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Covert Energy 5",  d:"Max Deviant Power +35%", cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Power Rewind 1",   d:"Deviant Power recovery speed +5%",       cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Power Rewind 2",   d:"Deviant Power recovery speed +10%",       cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine 1", d:"Mood recovery speed +5%",                cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine 2", d:"Mood recovery speed +10%",                cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine 3", d:"Mood recovery speed +15%",                cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine 4", d:"Mood recovery speed +20%",                cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Rise and Shine 5", d:"Mood recovery speed +25%",                cat:"General", type:"positive", src:"Any" },
  { s:1, n:"Growing Pains 1",  d:"Max Power +30%; Mood recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Growing Pains 2",  d:"Max Power +40%; Mood recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Growing Pains 3",  d:"Max Power +50%; Mood recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Cheer Up 1",       d:"Max Mood +30%; Power recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Cheer Up 2",       d:"Max Mood +40%; Power recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Cheer Up 3",       d:"Max Mood +50%; Power recovery -5%", cat:"General", type:"mixed",    src:"Any" },
  { s:1, n:"Worn-out 1",       d:"Max Deviant Power -5%/",             cat:"General", type:"negative", src:"Any" },
  { s:1, n:"Worn-out 2",       d:"Max Deviant Power -10%",             cat:"General", type:"negative", src:"Any" },
  { s:1, n:"Feeling Blue 1",   d:"Max Mood -5%",                      cat:"General", type:"negative", src:"Any" },
  { s:1, n:"Feeling Blue 2",   d:"Max Mood -10%",                      cat:"General", type:"negative", src:"Any" },

  // ===========================================================================
  // -- SLOT 1 — FESTERING GEL VARIATIONS -------------------------------------
  // ===========================================================================
  { s:1, n:"Milk Sugar",          d:"Max Mood +35%",                                      cat:"Variation", type:"variation", src:"Festering Gel",   vfor:"Festering Gel" },

  // -- SLOT 1 — BUTTERFLY'S EMISSARY VARIATIONS -----------------------------
  { s:1, n:"Ancient Scroll",      d:"Max Energy +40%",                                    cat:"Variation", type:"variation", src:"Butterfly's Emissary", vfor:"Butterfly's Emissary" },

  // -- SLOT 1 — FETCH-A-LOT VARIATIONS --------------------------------------
  { s:1, n:"Aquarius",            d:"Mood Recovery Speed +30%",                            cat:"Variation", type:"variation", src:"Fetch-A-Lot Bunny",   vfor:"Fetch-A-Lot Bunny" },
  { s:1, n:"Gluttonous Bunny",    d:"Energy Recovery Speed +15%",                          cat:"Variation", type:"variation", src:"Fetch-A-Lot Bunny",   vfor:"Fetch-A-Lot Bunny" },

  // -- SLOT 1 — GRUMPY BULB VARIATIONS --------------------------------------
  { s:1, n:"Violet Robe",         d:"Max Energy +40%",                                    cat:"Variation", type:"variation", src:"Grumpy Bulb",         vfor:"Grumpy Bulb" },

  // -- SLOT 1 — GROWSHROOM VARIATIONS ---------------------------------------
  { s:1, n:"Shadow Shroom",       d:"Max Energy +40%",                                    cat:"Variation", type:"variation", src:"Growshroom",          vfor:"Growshroom" },
  { s:1, n:"Optimism - Extra Large", d:"Max Mood +40%",                                   cat:"Variation", type:"variation", src:"Growshroom",          vfor:"Growshroom" },

  // -- SLOT 1 — NUTCRACKER VARIATIONS ---------------------------------------
  { s:1, n:"Infrasonic Illusion (Nutcracker)", d:"Max Mood +35",                           cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Deep Purple",         d:"Mood Recovery Speed +30%",                            cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Green Field",         d:"Energy Max Limit increased by 10",                    cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Copper Green",        d:"Max Deviant Power +7%",                               cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Stable Energy - Tin Soldier", d:"Max Energy +35",                              cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Reserved Energy - Twisted Fairy Tale", d:"Max Energy +40%",                    cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Wood Yellow",         d:"Mood Recovery Speed +7%",                             cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Clear Lake",          d:"Deviant Power Recovery Speed +7%",                    cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Power Rewind - Purple", d:"Energy Recovery Speed +15%",                        cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Date Brown",          d:"Max Mood +7%",                                        cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },
  { s:1, n:"Stable Vitality - Golden Era", d:"Max Mood +35",                               cat:"Variation", type:"variation", src:"Nutcracker",          vfor:"Nutcracker" },

  // -- SLOT 1 — EXTRADIMENSIONAL CAT VARIATIONS -----------------------------
  { s:1, n:"Optimism - Good Fortune", d:"Max Mood +40%",                                   cat:"Variation", type:"variation", src:"Extradimensional Cat", vfor:"Extradimensional Cat" },

  // -- SLOT 1 — DIGBY BOY VARIATIONS ----------------------------------------
  { s:1, n:"Emerald",             d:"Energy Recovery Speed +10%",                           cat:"Variation", type:"variation", src:"The Digby Boy",       vfor:"The Digby Boy" },
  { s:1, n:"Fortune Dice",        d:"Max Deviant Power +6%",                                cat:"Variation", type:"variation", src:"The Digby Boy",       vfor:"The Digby Boy" },

  // -- SLOT 1 — BUZZY BEE VARIATIONS ---------------------------------------
  { s:1, n:"Radiant Flourish",    d:"Max Mood +8%",                                        cat:"Variation", type:"variation", src:"Buzzy Bee",           vfor:"Buzzy Bee" },
  { s:1, n:"Pumpkin Lantern",     d:"Max Deviant Power +10%",                               cat:"Variation", type:"variation", src:"Buzzy Bee",           vfor:"Buzzy Bee" },

  // -- SLOT 1 — ENCHANTING VOID VARIATIONS ----------------------------------
  { s:1, n:"Pharaoh",             d:"Mood Recovery Speed +30%",                             cat:"Variation", type:"variation", src:"Enchanting Void",     vfor:"Enchanting Void" },

  // -- SLOT 1 — LONEWOLF'S WHISPER VARIATIONS -------------------------------
  { s:1, n:"Bursting Magma (Lonewolf)", d:"Max Energy +40%",                                cat:"Variation", type:"variation", src:"Lonewolf's Whisper",  vfor:"Lonewolf's Whisper" },
  { s:1, n:"Distant Tears",       d:"Max Energy +40%",                                     cat:"Variation", type:"variation", src:"Lonewolf's Whisper",  vfor:"Lonewolf's Whisper" },
  { s:1, n:"Radiant Variant (Lonewolf)", d:"Max Mood +7%",                                  cat:"Variation", type:"variation", src:"Lonewolf's Whisper",  vfor:"Lonewolf's Whisper" },

  // -- SLOT 1 — BY-THE-WIND VARIATIONS --------------------------------------
  { s:1, n:"Bursting Magma (By-The-Wind)", d:"Energy Recovery Speed +10%",                  cat:"Variation", type:"variation", src:"By the Wind",         vfor:"By the Wind" },
  { s:1, n:"Frigid Touch",        d:"Energy Recovery Speed +15%",                           cat:"Variation", type:"variation", src:"By the Wind",         vfor:"By the Wind" },

  // -- SLOT 1 — SHATTERED MAIDEN VARIATIONS ---------------------------------
  { s:1, n:"Wandering Witch",     d:"Max Deviant Power +10%",                               cat:"Variation", type:"variation", src:"Shattered Maiden",    vfor:"Shattered Maiden" },

  // -- SLOT 1 — POLAR JELLYFISH VARIATIONS ----------------------------------
  { s:1, n:"Radiant (Polar Jelly)", d:"Mood Recovery Speed +20%",                           cat:"Variation", type:"variation", src:"Polar Jelly",         vfor:"Polar Jelly" },

  // -- SLOT 1 — FLAME ESSENCE VARIATIONS ------------------------------------
  { s:1, n:"Golden Toad",         d:"Mood Recovery Speed +20%",                             cat:"Variation", type:"variation", src:"Flame Essence",       vfor:"Flame Essence" },
  { s:1, n:"Prince (Flame Essence)", d:"Max Mood +35",                                     cat:"Variation", type:"variation", src:"Flame Essence",       vfor:"Flame Essence" },

  // -- SLOT 1 — SPACE TURNER VARIATIONS -------------------------------------
  { s:1, n:"White Cliff Remnants", d:"Max Mood +35",                                       cat:"Variation", type:"variation", src:"Space Turner",        vfor:"Space Turner" },

  // -- SLOT 1 — VOODOO DOLL VARIATIONS --------------------------------------
  { s:1, n:"Fluffy Curse",        d:"Energy Recovery Speed +10%",                           cat:"Variation", type:"variation", src:"Voodoo Doll",         vfor:"Voodoo Doll" },

  // -- SLOT 1 — DR. TEDDY VARIATIONS ---------------------------------------
  { s:1, n:"Infrasonic Illusion (Dr. Teddy)", d:"Energy Recovery Speed +20%",               cat:"Variation", type:"variation", src:"Dr. Teddy",           vfor:"Dr. Teddy" },
  { s:1, n:"Christmas Spirit (Chefosaurus Rx)", d:"The appearance of the Deviation has changed. Max Deviant Power +10%, Deviant Power recovery speed +5%.", cat:"Variation", type:"variation", src:"Chefosaurus Rex", vfor:"Chefosaurus Rex" },
  { s:2, n:"Christmas Spirit (Chefosaurus Rx)", d:"The appearance of the Deviation has changed. Max Deviant Power +10%, Deviant Power recovery speed +5%.", cat:"Variation", type:"variation", src:"Chefosaurus Rex", vfor:"Chefosaurus Rex", typeReq:"Combat" },
  { s:1, n:"Aberrant Progeny (Dr. Teddy)",       d:"When synced, Deviation Power is increased by an additional 8.", cat:"Variation", type:"variation", src:"Dr. Teddy", vfor:"Dr. Teddy" },
  { s:2, n:"Aberrant Progeny (Dr. Teddy)",       d:"When synced, Deviation Power is increased by an additional 8.", cat:"Variation", type:"variation", src:"Dr. Teddy", vfor:"Dr. Teddy", typeReq:"Combat" },
  { s:1, n:"Aberrant Progeny (Chefosaurus Rx)",  d:"When synced, Deviation Power is increased by an additional 8.", cat:"Variation", type:"variation", src:"Chefosaurus Rex", vfor:"Chefosaurus Rex" },
  { s:2, n:"Aberrant Progeny (Chefosaurus Rx)",  d:"When synced, Deviation Power is increased by an additional 8.", cat:"Variation", type:"variation", src:"Chefosaurus Rex", vfor:"Chefosaurus Rex", typeReq:"Combat" },

  // -- SLOT 1 — MINI WONDER VARIATIONS --------------------------------------
  { s:1, n:"Bursting Magma (Mini Wonder)", d:"Max Mood +35",                                cat:"Variation", type:"variation", src:"Mini Wonder",         vfor:"Mini Wonder" },

  // -- SLOT 1 — SNOWSPRITE VARIATIONS ---------------------------------------
  { s:1, n:"Spring's Return",     d:"Max Mood +35",                                        cat:"Variation", type:"variation", src:"Snowsprite",          vfor:"Snowsprite" },

  // -- SLOT 1 — INVINCIBLE SUN VARIATIONS -----------------------------------
  { s:1, n:"Malevolent Sun",      d:"Mood Recovery Speed +20%",                             cat:"Variation", type:"variation", src:"Invincible Sun",      vfor:"Invincible Sun" },

  // -- SLOT 1 — PARTY MONKEY VARIATIONS -------------------------------------
  { s:1, n:"Infrasonic Illusion (Party Monkey)", d:"Energy Recovery Speed +10%",            cat:"Variation", type:"variation", src:"Party Monkey",        vfor:"Party Monkey" },

  // -- SLOT 1 — DISCO BALL VARIATIONS ---------------------------------------
  { s:1, n:"Infrasonic Illusion (Disco Ball)", d:"Energy Recovery Speed +10%",              cat:"Variation", type:"variation", src:"Disco Ball",          vfor:"Disco Ball" },

  // -- SLOT 1 — ZAPCAM VARIATIONS -------------------------------------------
  { s:1, n:"Fool's Memory",       d:"Energy Recovery Speed +10%",                           cat:"Variation", type:"variation", src:"Zapcam",              vfor:"Zapcam" },

  // -- SLOT 1 — RAIN MAN VARIATIONS ----------------------------------------
  { s:1, n:"Light Rain",          d:"Energy Recovery Speed +15%",                           cat:"Variation", type:"variation", src:"Rain Man",            vfor:"Rain Man" },
  { s:1, n:"Childlike Whimsy",    d:"Energy Recovery Speed +30%",                           cat:"Variation", type:"variation", src:"Rain Man",            vfor:"Rain Man" },
  { s:1, n:"Youthful Heart",      d:"Mood Recovery Speed +30%",                             cat:"Variation", type:"variation", src:"Rain Man",            vfor:"Rain Man" },

  // -- SLOT 1 — TAR PUDDING VARIATIONS --------------------------------------
  { s:1, n:"Radiance (Tar Pudding)", d:"Max Energy +40%",                                  cat:"Variation", type:"variation", src:"Tar Pudding",         vfor:"Tar Pudding" },
  { s:1, n:"Fine Brew",           d:"Energy Recovery Speed +10%",                           cat:"Variation", type:"variation", src:"Tar Pudding",         vfor:"Tar Pudding" },

  // -- SLOT 1 — ELECTRIC EEL VARIATIONS -------------------------------------
  { s:1, n:"Gold Lightning (Eel)", d:"Energy Recovery Speed +15%",                          cat:"Variation", type:"variation", src:"Electric Eel",        vfor:"Electric Eel" },
  { s:1, n:"Infrasonic Illusion (Eel)", d:"Max Mood +35",                                  cat:"Variation", type:"variation", src:"Electric Eel",        vfor:"Electric Eel" },

  // -- SLOT 1 — H37 VARIATIONS ----------------------------------------------
  { s:1, n:"Infrasonic Illusion (H37)", d:"Mood Recovery Speed +20%",                      cat:"Variation", type:"variation", src:"H37",                 vfor:"H37" },
  { s:1, n:"Prototype",           d:"Energy Recovery Speed +10%",                           cat:"Variation", type:"variation", src:"H37",                 vfor:"H37" },

  // -- SLOT 1 — PAPER DOLL VARIATIONS ---------------------------------------
  { s:1, n:"Witch's Beloved",     d:"Mood Recovery Speed +20%",                             cat:"Variation", type:"variation", src:"Paper Doll",          vfor:"Paper Doll" },

  // -- SLOT 1 — PUP BUDDY VARIATIONS ---------------------------------------
  { s:1, n:"Golden Lightning (Pup)", d:"Mood Recovery Speed +30%",                          cat:"Variation", type:"variation", src:"Pup Buddy",           vfor:"Pup Buddy" },

  // -- SLOT 1 — ATOMIC SNAIL VARIATIONS -------------------------------------
  { s:1, n:"Gold Lightning (Snail)", d:"Energy Recovery Speed +15%",                        cat:"Variation", type:"variation", src:"Atomic Snail",        vfor:"Atomic Snail" },


  // ===========================================================================
  // -- SLOT 2 — COMBAT TRAITS ------------------------------------------------
  // ===========================================================================
  { s:2, n:"Psychic Kid",          d:"Having it fight alongside grants Status DMG +5%",                              cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Crack Shot",           d:"Having it fight alongside grants Weapon DMG +5%",                              cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Heavy and Solid",      d:"Higher Load grants higher DMG Reduction for torso, up to +15%",                cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Run Fast",             d:"Syncing with this Deviation grants Movement Speed +5%",                        cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Beast of Burden",      d:"Syncing with it grants Max Load +8",                                           cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"City Folk",            d:"Syncing with it grants Max Load +15 when exploring Settlements",               cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Durability",           d:"Syncing with it grants Stamina Consumption -5%",                               cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Move More, Live Better", d:"Recover 1 Deviant Power every 8s while sprinting",                           cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Street Rascal",        d:"Syncing with it grants Movement Speed +10% in Settlements",                    cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Wellbeing",            d:"Syncing with this Deviation grants Max Stamina +10",                           cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Lighten Your Mind",    d:"Lower Load grants higher DMG Reduction for head, up to +15%",                  cat:"Combat", type:"positive", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Power King",           d:"Syncing with it grants Max Load +25, Movement Speed -5%",                      cat:"Combat", type:"mixed",    src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Brute Force",          d:"Syncing with it grants Max Load +15, Movement Speed -5%",                      cat:"Combat", type:"mixed",    src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Long Distance Runner", d:"Syncing with it grants Stamina Consumption -20%, Movement Speed -10%",         cat:"Combat", type:"mixed",    src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Save Energy",          d:"Syncing with it grants Stamina Consumption -10%, Movement Speed -5%",          cat:"Combat", type:"mixed",    src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Vegetative Calm",      d:"Syncing with it grants Max Stamina +15, Movement Speed -5%",                   cat:"Combat", type:"mixed",    src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Two-Shift System",     d:"Syncing with it grants Max Load +16 at daytime, and Movement Speed +12% at night", cat:"Combat", type:"mixed", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Stay Indoors",         d:"Syncing with it grants +8% Stamina Consumption in Settlements",                cat:"Combat", type:"negative", src:"Combat Deviations", typeReq:"Combat" },
  { s:2, n:"Sedentary",            d:"Syncing with it grants Max Load -8 when exploring Settlements",                cat:"Combat", type:"negative", src:"Combat Deviations", typeReq:"Combat" },

  // -- SLOT 2 — COMBAT VARIATIONS --------------------------------------------
  // Butterfly's Emissary
  { s:2, n:"Praise the Moon - Starry Night", d:"When synced, deal 6% more DMG (Weapon & Status) at night. Halved during the day.", cat:"Variation", type:"variation", src:"Butterfly's Emissary", vfor:"Butterfly's Emissary", typeReq:"Combat" },
  { s:2, n:"Weakspot Master - Glistening Blue", d:"When synced, hitting a Weakspot increases Deviation Power by 1. Cooldown: 3s.", cat:"Variation", type:"variation", src:"Butterfly's Emissary", vfor:"Butterfly's Emissary", typeReq:"Combat" },
  // Festering Gel
  { s:2, n:"Praise the Sun - Spring Rose", d:"When synced, receive 20% more healing during the day. Halved at night.",       cat:"Variation", type:"variation", src:"Festering Gel", vfor:"Festering Gel", typeReq:"Combat" },
  { s:2, n:"Starry Sky - Marine Star",     d:"When synced, each reload gives either 5% Weapon DMG or 5% Status DMG at random.", cat:"Variation", type:"variation", src:"Festering Gel", vfor:"Festering Gel", typeReq:"Combat" },
  // By-The-Wind
  { s:2, n:"Marine Star (By-The-Wind)",    d:"When synced, each reload gives either 5% Weapon DMG or 5% Status DMG at random.", cat:"Variation", type:"variation", src:"By the Wind", vfor:"By the Wind", typeReq:"Combat" },

  // -- SLOT 2 — LUNAR ORACLE VARIATIONS (Combat) ----------------------------
  { s:2, n:"Lunar Oracle (Zapcam)",              d:"Weapon DMG +5%, 7.5% when sanity below 30%",                                       cat:"Variation", type:"variation", src:"Zapcam",              vfor:"Zapcam",              typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Lonewolf)",            d:"Weapon DMG +5%, 7.5% when sanity below 30%",                                       cat:"Variation", type:"variation", src:"Lonewolf's Whisper",  vfor:"Lonewolf's Whisper",  typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Festering Gel)",       d:"Restores 1 Deviant Power every 8s, 1.5 if sanity below 30%",                       cat:"Variation", type:"variation", src:"Festering Gel",       vfor:"Festering Gel",       typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Snowsprite)",          d:"Status DMG +5%, 7.5% when sanity below 30%",                                       cat:"Variation", type:"variation", src:"Snowsprite",          vfor:"Snowsprite",          typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (By-The-Wind)",         d:"Gliding: downward speed -20%, horizontal +10% (-30%/+15% if sanity below 30%)",     cat:"Variation", type:"variation", src:"By the Wind",         vfor:"By the Wind",         typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Zeno Purifier)",       d:"Melee DMG +10% to you and Zeno, +15% when sanity below 30%",                       cat:"Variation", type:"variation", src:"Zeno-Purifier",       vfor:"Zeno-Purifier",       typeReq:"Combat" },
  { s:2, n:"Lunar Oracle (Pyro Dino)",           d:"Status DMG +5%, 7.5% when sanity below 30%",                                       cat:"Variation", type:"variation", src:"Pyro Dino",           vfor:"Pyro Dino",           typeReq:"Combat" },

  // -- SLOT 2 — GRAVITY / STARFALL INVERSION VARIATIONS (Combat) -------------
  { s:2, n:"Starfall Inversion (Mini Wonder)",   d:"+5% head and torso DMG reduction. +7.5% when airborne.",                            cat:"Variation", type:"variation", src:"Mini Wonder",         vfor:"Mini Wonder",         typeReq:"Combat" },
  { s:2, n:"Starfall Inversion (Invincible Sun)",d:"+5% Blaze Elemental DMG. +7.5% when airborne.",                                    cat:"Variation", type:"variation", src:"Invincible Sun",      vfor:"Invincible Sun",      typeReq:"Combat" },
  { s:2, n:"Starfall Inversion (Polar Jelly)",   d:"+5% Frost Elemental DMG. +7.5% when airborne.",                                    cat:"Variation", type:"variation", src:"Polar Jelly",         vfor:"Polar Jelly",         typeReq:"Combat" },
  { s:2, n:"Starfall Inversion (Voodoo Doll)",   d:"+1 Deviant Power every 8s. +1.5 while airborne.",                                  cat:"Variation", type:"variation", src:"Voodoo Doll",         vfor:"Voodoo Doll",         typeReq:"Combat" },
  { s:2, n:"Starfall Inversion (Enchanting Void)", d:"+5% Melee DMG. +7.5% when airborne.",                                            cat:"Variation", type:"variation", src:"Enchanting Void",     vfor:"Enchanting Void",     typeReq:"Combat" },
  { s:2, n:"Starfall Inversion (Mini Feaster)",  d:"+5% Status DMG. +7.5% when airborne.",                                             cat:"Variation", type:"variation", src:"Mini Feaster",        vfor:"Mini Feaster",        typeReq:"Combat" },


  // ===========================================================================
  // -- SLOT 2 — TERRITORY TRAITS ---------------------------------------------
  // ===========================================================================
  { s:2, n:"Anti-Burnout",            d:"When dormant regaining Deviant Power, 20% chance other Territorial Deviations receive Deviant Power +5 (all)", cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Dream Wild",             d:"When dormant regaining Deviant Power, 10% chance other Territorial Deviations receive Deviant Power +10 (all)", cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"A World of Charm",       d:"When dormant regaining Mood, 10% chance other Territorial Deviations receive Mood +20 (all)",                  cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Sweet Talk",             d:"When dormant regaining Mood, 20% chance other Territorial Deviations receive Mood +5 (all)",                   cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Hydrophilic",            d:"When resting by water, Energy Recovery Speed +30% (single)",                                                   cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Devoted Laborer",        d:"Mood and Deviant Power consumption interval +20% for working Territorial Deviation (single)",                   cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Workaholic",             d:"Mood and Deviant Power consumption interval +10% for working Territorial Deviation (single)",                   cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Water Dormancy",         d:"When resting by water, Mood Recovery Speed +30% (single)",                                                     cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Voluntary Overtime",     d:"10% chance that working does not consume Mood (single)",                                                       cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Living Map",             d:"Resource production interval -5% for Territorial Deviation (single)",                                          cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Stardust Affinity",      d:"When working in Pollution Zone, 20% chance to not consume Mood (single)",                                      cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"OnePlus",                d:"When returning with resources, 5% chance to bring back rare crystals. Return time increased (single)",          cat:"Territory", type:"mixed",    src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Imperfect Endless Motion", d:"10% chance that working does not consume Deviant Power (single)",                                            cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },

  // -- SLOT 2 — TERRITORY NEGATIVE TRAITS ------------------------------------
  { s:2, n:"Heartthrob",             d:"10% others lose Power when its Power decreases. Dormant Mood: 10% others +Mood 5 (all)",                       cat:"Territory", type:"mixed",    src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Snooze Aficionado",      d:"10% others lose Mood when its Mood decreases. Dormant Power: 10% others +Power 5 (all)",                       cat:"Territory", type:"mixed",    src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Baffling Behavior",      d:"When its Deviant Power decreases, 10% chance other Territorial Deviations lose Power (all)",                    cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Holding the Team Back",  d:"When its Mood decreases, 10% chance other Territorial Deviations lose Mood (all)",                             cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Wild Wood Spirit",       d:"When returning with resources, 5% chance to bring a deviated flower (single)",                                  cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Toxicologist",           d:"Territorial Deviation may bring back Acid (single)",                                                            cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Gilded Oracle",          d:"Territorial Deviation may bring back additional ores (single)",                                                 cat:"Territory", type:"positive", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Lazy Bones",             d:"Working speed -5% for Territorial Deviation (single)",                                                         cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Panovision",             d:"Working speed -10% for Territorial Deviation (single)",                                                        cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"Slacking Off",           d:"Mood and Deviant Power consumption speed +5% for working Territorial Deviation (single)",                       cat:"Territory", type:"negative", src:"Territory Deviations", typeReq:"Territory" },
  { s:2, n:"An Old Hand Knows the Ropes", d:"Faster Mood and Deviant Power consumption, and Working Speed +10% for Territorial Deviation (single)",     cat:"Territory", type:"mixed",    src:"Territory Deviations", typeReq:"Territory" },

  // -- SLOT 2 — TERRITORY VARIATIONS -----------------------------------------
  { s:2, n:"Daydreaming - Moonlit Jewels",  d:"When recovering Energy while dormant, 20% chance to restore 15 Deviant Power to other Territory Deviations", cat:"Variation", type:"variation", src:"Extradimensional Cat", vfor:"Extradimensional Cat", typeReq:"Territory" },
  { s:2, n:"Water Dormancy - Heavy Ginger", d:"When resting by water, Mood Recovery Speed +35%",                                                           cat:"Variation", type:"variation", src:"Extradimensional Cat", vfor:"Extradimensional Cat", typeReq:"Territory" },
  // Nutcracker territory variations
  { s:2, n:"Sweet Talk - Silver Gentleman", d:"When recovering Mood while dormant, 25% chance to restore 10 Mood to Territory Deviations",                  cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Diamond Duke",                  d:"When working in Pollution Zone, 5% chance to not consume Energy",                                            cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Stardust Affinity - Ocean Blue", d:"When working in Pollution Zone, 30% chance to not consume Mood",                                           cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Christmas",                     d:"While working, energy and Mood consumption interval +5%",                                                    cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Sugar Guard",                   d:"3% chance that working does not consume Mood",                                                               cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Admiral",                       d:"3% chance that working does not consume Deviant Power",                                                      cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Imperfect Endless Motion - Elegant Purple", d:"When working, 20% chance to not consume Deviant Power",                                          cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  { s:2, n:"Workaholic - Lights and Shadows", d:"When working, Energy and Mood consumption interval +20%",                                                  cat:"Variation", type:"variation", src:"Nutcracker", vfor:"Nutcracker", typeReq:"Territory" },
  // Fetch-A-Lot territory variations
  { s:2, n:"Toxicologist - Dark Rebel",      d:"When exploring, has a chance to bring back Acid",                                                           cat:"Variation", type:"variation", src:"Fetch-A-Lot Bunny", vfor:"Fetch-A-Lot Bunny", typeReq:"Territory" },
  { s:2, n:"The Spirit of the Woods - Alice", d:"When exploring, 10% chance to bring back Acid",                                                           cat:"Variation", type:"variation", src:"Fetch-A-Lot Bunny", vfor:"Fetch-A-Lot Bunny", typeReq:"Territory" },
  // Digby Boy territory variations
  { s:2, n:"Gold Speaker - Pure Gold",       d:"When exploring, has a chance to bring back additional ores",                                                cat:"Variation", type:"variation", src:"The Digby Boy", vfor:"The Digby Boy", typeReq:"Territory" },
  { s:2, n:"Voluntary Overtime - Prism",     d:"When working, 15% chance to not consume Mood",                                                             cat:"Variation", type:"variation", src:"The Digby Boy", vfor:"The Digby Boy", typeReq:"Territory" },
  // Lunar Oracle territory variations
  { s:2, n:"Lunar Oracle (Electric Eel)",    d:"While working, energy and Activity Score consumption interval +20%",                                        cat:"Variation", type:"variation", src:"Electric Eel", vfor:"Electric Eel", typeReq:"Territory" },
  { s:2, n:"Lunar Oracle (Atomic Snail)",    d:"Resource production interval reduced by 15%",                                                              cat:"Variation", type:"variation", src:"Atomic Snail", vfor:"Atomic Snail", typeReq:"Crafting" },


  // ===========================================================================
  // -- SLOT 2 — CRAFTING TRAITS ----------------------------------------------
  // ===========================================================================
  { s:2, n:"Waste Not",            d:"When Activity Score >90%, 5% chance to increase other Deviations' Deviant Power by 10 when generating resources (all)",  cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Leftover",             d:"When Activity Score >20%, 10% chance to increase other Deviations' Power by 1 when generating resources. Max Storage -20% (all)", cat:"Crafting", type:"mixed", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Byproduct",            d:"When Activity Score >90%, 10% chance to increase other Deviations' Power by 2 when generating resources (all)",          cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Efficiency Above All", d:"Crafting speed +20%, Max storage capacity -30% (single)",                                                                cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Stardust Empowerment", d:"When working in Pollution Zone, 20% chance to not consume Energy (single)",                                             cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Speed Up",             d:"Resource production interval for Crafting reduced by 10% (single)",                                                     cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Productivity First",   d:"Resource production interval for Crafting reduced by 5% (single)",                                                      cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Collection +1",        d:"5% chance crafting output +2, crafting speed -20% (single)",                                                             cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Eureka Moment (Crafting)", d:"1% chance to produce 10 extra units, but production interval +50% (single)",                                        cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"The Joy of Slacking Off", d:"10% chance crafting consumes 0 Mood, crafting speed -20% (single)",                                                  cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Unhinged Production",  d:"When Activity Score <20%, consume other Deviations' Power by 1 to produce 2 extra units (single)",                       cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Unplanned Production", d:"10% chance crafting consumes 0 Deviant Power, crafting speed -20% (single)",                                            cat:"Crafting", type:"mixed",    src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Big Cup",              d:"Limit capacity during Crafting increased by 20% (single)",                                                              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Buy 1 Get 2",          d:"When generating resources, 5% chance to produce 1 extra unit (single)",                                                 cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Come As One",          d:"When producing resources, output +1 for every 1 Territory Deviation in the Territory (single)",                          cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Efficiency First",     d:"Resource production interval for Crafting reduced by 5% (single)",                                                      cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Medium Cup",           d:"Max storage capacity +10% (single)",                                                                                    cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Mineral Talent",       d:"When producing within Oil Field radius, 20% chance to increase output by 1 (single)",                                   cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"One More Bottle",      d:"When generating resources, 2% chance to produce 2 extra units (single)",                                                cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Out of Scratch",       d:"When producing resources, 3% chance to not use up Deviant Power (single)",                                              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Piece of Cake",        d:"When producing resources, 5% chance to not use up Activity Score (single)",                                             cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Super Big Cup",        d:"Limit capacity during Crafting increased by 30% (single)",                                                              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"The Last Night",       d:"Resource production interval for Crafting reduced by 15% (single)",                                                     cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Work of Proficiency",  d:"When producing resources, 5% chance to not use up Deviant Power (single)",                                              cat:"Crafting", type:"positive", src:"Crafting Deviations", typeReq:"Crafting" },

  // -- SLOT 2 — CRAFTING NEGATIVE TRAITS -------------------------------------
  { s:2, n:"Smooth Sheep Rustler",  d:"When Activity Score <20%, consume all other Deviations' Power by 5 when generating resources (all)",                    cat:"Crafting", type:"negative", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Clumsy",                d:"5% chance that Crafting Output -1 (single)",                                                                            cat:"Crafting", type:"negative", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"No Such Thing As a Small Cup", d:"Max Storage Capacity -10% (single)",                                                                            cat:"Crafting", type:"negative", src:"Crafting Deviations", typeReq:"Crafting" },
  { s:2, n:"Lazy",                   d:"Crafting speed -10% (single)",                                                                                         cat:"Crafting", type:"negative", src:"Crafting Deviations", typeReq:"Crafting" },

  // -- SLOT 2 — GROWSHROOM CRAFTING VARIATION --------------------------------
  { s:2, n:"Toxicologist - Green Touch", d:"When working in Pollution Zone, 25% chance to not consume Energy",                                                cat:"Variation", type:"variation", src:"Growshroom", vfor:"Growshroom", typeReq:"Crafting" },


  // ===========================================================================
  // -- SLOT 3 — DEVIATED (Animal / Furniture) --------------------------------
  // ===========================================================================
  // These traits have DIFFERENT effects depending on whether the deviation
  // is Combat vs. Territory/Crafting. Descriptions below cover both.

  // -- Animals — Combat Effects ----------------------------------------------
  { s:3, n:"Moonlight Assault [Wolf]",            d:"At night, Deviant Energy and Mood Recovery rates are increased.",                                          cat:"Animal", type:"positive", src:"Wolf" },
  { s:3, n:"Feline Creatures [Leopard]",          d:"After syncing, fall damage reduced by 50%, fractures prevented.",                                         cat:"Animal", type:"positive", src:"Leopard" },
  { s:3, n:"Brute Force Rules [Bear]",            d:"Combat: Dodge shatters ores/trees (no resources). Crafting: 10% double resource output.",                 cat:"Animal", type:"positive", src:"Bear" },
  { s:3, n:"Foul Symbiosis [Boar]",               d:"Combat: Killing Deviants, 10% chance +1 Acid. Crafting: In Pollution Zone, 10% +1 Acid.",                cat:"Animal", type:"positive", src:"Boar" },
  { s:3, n:"Polar Beast [Polar Bear]",            d:"Combat: Below 0C, Attack +10%. Territory: Below 0C, Mood recovery +10%.",                                cat:"Animal", type:"positive", src:"Polar Bear" },
  { s:3, n:"Top Grunt [Buffalo]",                 d:"Combat: No Stamina consumed during gathering. Territory: Auto converts Mood to Deviant Energy at 10%.",  cat:"Animal", type:"positive", src:"Buffalo" },
  { s:3, n:"Nightmare Waters [Crocodile]",        d:"Combat: Stamina reduced while diving, Oxygen increased. Territory: Near water, extra fish chance.",       cat:"Animal", type:"positive", src:"Crocodile" },
  { s:3, n:"Mind Massage [Capybara]",             d:"Combat: Sanity gradually recovers. Territory: 10% Sanity on return (10m CD).",                            cat:"Animal", type:"positive", src:"Capybara" },
  { s:3, n:"Herbivore [Deer/Goat]",               d:"Combat: Nearby herbivores won't flee. Crafting: Chance to yield extra deviated plant.",                   cat:"Animal", type:"positive", src:"Deer or Goat" },

  // -- Furniture — Effects ---------------------------------------------------
  { s:3, n:"Pollution Adaptation [Toilet]",       d:"Combat: Sanity drops 90% slower in Pollution Zone. Territory: Max Deviant Energy +15 in Pollution.",      cat:"Furniture", type:"positive", src:"Modern Toilet" },
  { s:3, n:"Precision Moment [Clock]",            d:"Increases Mood by 10 and Deviant Energy by 10 for all Deviations in territory every hour (no stack).",    cat:"Furniture", type:"positive", src:"Desktop Electronic Clock" },
  { s:3, n:"Master of Temperatures [Fan]",        d:"Combat: +10 Heat Resist in territory. Territory: +10 Heat Resist.",                                      cat:"Furniture", type:"positive", src:"Any Fan" },
  { s:3, n:"Knights of The Round Table [Table]",  d:"Combat: Slightly reduces damage taken. Territory: Defense +5%, less Power consumption when hit.",         cat:"Furniture", type:"positive", src:"Any Table" },
  { s:3, n:"Warm Flame [Candelabra]",             d:"Combat: Cold Resist +10. Territory: +10 Cold Resist in territory.",                                       cat:"Furniture", type:"positive", src:"Candelabra" },
  { s:3, n:"Eureka Moment [Lamp]",                d:"Combat: If attacked, attacker revealed, Weapon DMG -10% for 2s (60s CD). Territory: DSU no light needed.", cat:"Furniture", type:"positive", src:"Warm Lamp" },
  { s:3, n:"Extra Load [Carton]",                 d:"Combat: Max Load +20. Territory: Storage capacity for Crafting Deviations +15%.",                         cat:"Furniture", type:"positive", src:"Any Carton" },
  { s:3, n:"Music Resonance [Jukebox]",           d:"DSU no music/radio needed.",                                                                              cat:"Furniture", type:"positive", src:"Jukebox" },
  { s:3, n:"Clean and Hygienic [Sink]",           d:"Combat: Sanity auto-recovers to 20% threshold. Territory: Sanity won't drop below 20% in territory.",    cat:"Furniture", type:"positive", src:"Sink" },
  { s:3, n:"Neon Flicker [Like]",                 d:"For every Deviation with Neon Flicker in territory, max Mood of all Deviations increases by 1.",          cat:"Furniture", type:"positive", src:"Like" },


  // ===========================================================================
  // -- SLOT 4 — CHAOS / SPECIAL ----------------------------------------------
  // ===========================================================================
  { s:4, n:"Chaosaurus",         d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Arena NPC Shop", vfor:"Pyro Dino" },
  { s:4, n:"Chaos Mr. Wish",    d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Arena NPC Shop", vfor:"Mr. Wish" },
  { s:4, n:"Chaos Snowsprite",  d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Arena NPC Shop", vfor:"Snowsprite" },
  { s:4, n:"Chaos Cat",         d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Scenario",       vfor:"Extradimensional Cat" },
  { s:4, n:"Chaos Cat",         d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Scenario",       vfor:"Extradimensional Cat" },
  { s:4, n:"Chaos Cat",         d:"Chaos trait with extremely high Dex Value (Deviation Secure Scenario)",  cat:"Chaos", type:"variation", src:"Deviation Secure Scenario",       vfor:"Extradimensional Cat" },
];

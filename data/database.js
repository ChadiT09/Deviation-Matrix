# Deviation Matrix — Once Human Fusion Intelligence

A browser-based tool for the survival game **Once Human** that helps players plan and track Deviation fusions.

> Inspired by [DevAbhi-Chauhan/Once_human_fusion](https://github.com/DevAbhi-Chauhan/Once_human_fusion)

---

## Features

| Tab | What it does |
|-----|-------------|
| **Inventory** | Log your Deviations with species, nickname, skill/activity stars, traits, fuses, and notes. Track Animals & Furniture counts for Slot 3 materials. |
| **Fusion Sim** | Select two parents + up to 3 middle-tube materials. Live calculation of species odds, stat ranges, and per-slot trait odds (Scenario A/B/C + Clean buff). Includes a 5-minute countdown timer that auto-consumes parents and materials on completion. |
| **Blueprint** | Pick a target species + desired traits. Generates a fusion path diagram showing which inventory deviations or materials can supply each trait, with missing-donor warnings. |
| **Trait Enc.** | Full searchable encyclopedia of all traits — filterable by category, with slot, source, and description. |

---

## What's New (v4.4 — April 2026)

### Massive Trait Database Expansion
- **90+ new traits** added from community spreadsheet data, cross-validated against the[Once Human Fandom Wiki](https://once-human.fandom.com/wiki/Deviation/traits).
- Full coverage of all **Combat**, **Territory**, and **Crafting** Slot 2 traits including previously missing entries like Dream Wild, Sweet Talk, Hydrophilic, Water Dormancy, Living Map, Stardust Affinity, Productivity First, Buy 1 Get 2, Come As One, Mineral Talent, Work of Proficiency, and many more.
- All **negative and mixed traits** now catalogued: Smooth Sheep Rustler, Snooze Aficionado, Panovision, An Old Hand Knows the Ropes, No Such Thing As a Small Cup, Lazy, etc.

### New Variation Traits
- Added all known **Nutcracker** variations (Silver Gentleman, Diamond Duke, Ocean Blue, Christmas, Sugar Guard, Admiral, Elegant Purple, Lights and Shadows, Deep Purple, Green Field, Copper Green, Tin Soldier, Twisted Fairy Tale, Wood Yellow, Clear Lake, Date Brown, Golden Era, and more).
- Added **Fetch-A-Lot Bunny** variations (Gluttonous Bunny, Dark Rebel, Alice).
- Added **Digby Boy** variations (Fortune Dice, Pure Gold, Prism).
- Added **Growshroom** variations (Shadow Shroom, Extra Large, Green Touch).
- Added **Rain Man** variations (Light Rain, Childlike Whimsy, Youthful Heart).
- Added **Tar Pudding** variations (Radiance, Fine Brew).
- Added **Electric Eel** variations (Gold Lightning, Infrasonic Illusion).
- Added **H37** variations (Infrasonic Illusion, Prototype).
- Added variations for By-The-Wind, Lonewolf's Whisper, Pup Buddy, Atomic Snail, Paper Doll, Flame Essence, Space Turner, Dr. Teddy, Mini Wonder, Snowsprite, Invincible Sun, Shattered Maiden, Polar Jelly, Party Monkey, Disco Ball, Zapcam, and more.

### Lunar Oracle & Starfall Inversion
- All **Lunar Oracle** event variations added (Zapcam, Lonewolf's Whisper, Festering Gel, Snowsprite, By-The-Wind, Zeno Purifier, Pyro Dino, Electric Eel, Atomic Snail).
- All **Starfall Inversion / Gravity** variations added (Mini Wonder, Invincible Sun, Polar Jelly, Voodoo Doll, Enchanting Void, Mini Feaster).

### Chaos Traits (Slot 4) "Developer Mode"
- Added **Chaos** traits for Pyro Dino (Chaosaurus), Mr. Wish, Snowsprite, and Extradimensional Cat from the Deviation Secure Scenario.

### New Furniture Material
- **Neon Flicker [Like]** added to both `MAT_DEFS` and `TRAITS`. Each deviation with this trait in your territory increases max Mood for all deviations by 1.

### New Deviation Species
- **Zapcam** added to the Combat deviations list (was missing from previous version).

### Slot 3 Trait Descriptions Enhanced
- All Animal and Furniture (Slot 3) trait descriptions now show **both Combat and Territory/Crafting effects** side by side, since these traits behave differently depending on deviation type.

### Onboarding Walkthrough Fix
- Fixed Step 6 targeting the wrong element (was highlighting "ADD TO INVENTORY" instead of the Export/Import buttons).

### Data Validation Notes
- Spreadsheet data cross-referenced with the [Once Human Fandom Wiki](https://once-human.fandom.com/wiki/Deviation/traits). Known discrepancies documented below in the [Data Discrepancies](#data-discrepancies) section.

---

## Data Discrepancies

The following differences were found between the community spreadsheet and the Fandom Wiki. The database uses the most accurate version available:

| Trait | Spreadsheet | Wiki | Resolution |
|-------|------------|------|------------|
| Covert Energy 1 | +10% | +15% | **Wiki value used (+15%)** |
| Stable Energy | +30% | +30 (flat) | **Wiki value used (flat +30)** |
| Stable Vitality | +30% | +30 (flat) | **Wiki value used (flat +30)** |
| Move More, Live Better | "Securement Progress +1 per 8s" | "Recover 1 Deviant Power every 8s while sprinting" | **Wiki value used** |
| Weakspot Master | "increases Deviation Power by 1" | "increases Secured by 1 additional point" | **Wiki wording used** |
| Worn-out / Feeling Blue | Only L1-2 in spreadsheet | L1-3 on wiki | **All 3 levels included** |
| Neon Flicker "Like" | Present in spreadsheet | Not on wiki | **Included (likely newer content)** |
| Stardust Empowerment | "20% chance to not consume Energy" | "20% chance to increase output by 1" | **Wiki value used** |

---

## Project Structure

```text
deviation-matrix/
├── index.html         ← Shell: HTML layout for all four tabs + modal
├── css/
│   └── style.css      ← All styling (tokens, components, responsive)
├── data/
│   └── database.js    ← Game data: DEVS, MAT_DEFS, TRAITS arrays
└── js/
    ├── state.js       ← App state, localStorage persistence, shared helpers
    ├── ui.js          ← Tooltip, collapse, tabs, deviation/trait dropdowns
    ├── inventory.js   ← Add/edit/remove deviations, inventory grid render
    ├── fusion.js      ← Timer, parent selects, material slots, calcFusion, modal
    ├── blueprint.js   ← Blueprint path generator
    ├── encyclopedia.js← Trait encyclopedia render
    ├── exportimport.js← XLSX export/import functionality
    └── onboarding.js  ← Interactive walkthrough tour
```

---

## Trait Slot System

The game uses a 4-slot trait system. Each deviation can have up to 3 traits (Slots 1–3), with Slot 4 reserved for special Chaos variants:

| Slot | Name | What Goes Here | `typeReq` Filtering |
|------|------|---------------|---------------------|
| **1** | General / Variation | Universal traits (Optimist, Covert Energy, etc.) and species-specific cosmetic variations | No type filter — applies to all |
| **2** | Type-Specific | Combat traits, Territory traits, or Crafting traits depending on the deviation's type | Filtered by `typeReq` — only shows traits matching the deviation's type |
| **3** | Deviated (Animal/Furniture) | Traits gained by fusing with Animal or Furniture materials | No type filter — but effects differ by type (descriptions note both) |
| **4** | Chaos / Special | Rare traits from Deviation Secure Scenario | Species-specific via `vfor` |

---

## Running Locally

No build step required — pure HTML/CSS/JS.

```bash
git clone https://github.com/ChadiT09/Deviation-Matrix.git
cd Deviation-Matrix

# Option A: open directly
open index.html

# Option B: local dev server (avoids any file:// quirks)
npx serve .
# or
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080`.

---

## Updating Game Data

All game content lives in `data/database.js`. No logic changes needed for routine updates.

### Adding a new Deviation species
```js
// In the DEVS array:
{ n: "New Deviation Name", t: "Combat" },  // t = Combat | Territory | Crafting
```

### Adding a new Trait
```js
// In the TRAITS array:
{
  s: 1,                // slot: 1=General, 2=Type-specific, 3=Deviated, 4=Chaos
  n: "Trait Name",
  d: "Effect description",
  cat: "General",      // General | Combat | Territory | Crafting | Animal | Furniture | Variation | Chaos
  type: "positive",    // positive | negative | mixed | variation
  src: "Any",
  // Optional:
  vfor: "Deviation Name",   // variation traits only — which deviation this belongs to
  typeReq: "Combat"         // slot-2 traits only — required deviation type
}
```

### Adding a new Animal or Furniture material
```js
// In the MAT_DEFS array:
{
  id: "unique_id",
  name: "Display Name",
  kind: "Animal",         // Animal | Furniture
  trait: "Trait Name",    // must match an entry in TRAITS
  d: "Short description"
}
```

---

## Trait Categories Reference

| Category | Used For |
|----------|----------|
| **General** | Slot 1 universal traits (Optimist, Covert Energy, Upper Hand, etc.) |
| **Combat** | Slot 2 traits exclusive to Combat deviations |
| **Territory**| Slot 2 traits exclusive to Territory deviations |
| **Crafting** | Slot 2 traits exclusive to Crafting deviations |
| **Animal** | Slot 3 traits from animal fusion materials |
| **Furniture**| Slot 3 traits from furniture fusion materials |
| **Variation**| Cosmetic/stat variations tied to a specific deviation species |
| **Chaos** | Slot 4 special traits from Deviation Secure Scenario  "Developer Mode" |

---

## Data Persistence

All inventory and material counts are saved to `localStorage` under the keys:

- `oh4_inv` — deviation inventory array
- `oh4_matc` — animal/furniture count map

No server, no account, no sync — data lives directly in the browser.

---

## Known Limitations

- **Slot 3 dual effects:** Animal and Furniture traits behave differently on Combat vs. Territory/Crafting deviations. Descriptions now document both effects, but the fusion simulator does not yet branch Slot 3 odds by outcome type.
- **Chaos traits (Slot 4):** Included in the encyclopedia for reference, but these cannot be fused and are not part of the fusion calculation.

---

## Contributing

Pull requests welcome! Please keep game data changes in `data/database.js` only. Logic and UI changes should go in the appropriate module under `js/`.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/new-deviations`
3. Commit your changes
4. Open a PR with a description of what changed and why

### Data Contribution Guidelines
- Cross-reference new traits against the [Once Human Fandom Wiki](https://once-human.fandom.com/wiki/Deviation/traits) before submitting.
- Note any discrepancies between sources in your PR description.
- Use the correct `cat` and `typeReq` values — traits that only apply to specific deviation types must have `typeReq` set.
- Variation traits must include both `vfor` (target deviation species) and `src` (source deviation).

*Disclaimer: I used AI to assist in building this, as it started as a small project and grew beyond its original scope.*

---

## License

MIT — free to use, modify, and redistribute.

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

## Project Structure

```
deviation-matrix/
├── index.html          ← Shell: HTML layout for all four tabs + modal
├── css/
│   └── style.css       ← All styling (tokens, components, responsive)
├── data/
│   └── database.js     ← Game data: DEVS, MAT_DEFS, TRAITS arrays
└── js/
    ├── state.js        ← App state, localStorage persistence, shared helpers
    ├── ui.js           ← Tooltip, collapse, tabs, deviation/trait dropdowns
    ├── inventory.js    ← Add/edit/remove deviations, inventory grid render
    ├── fusion.js       ← Timer, parent selects, material slots, calcFusion, modal
    ├── blueprint.js    ← Blueprint path generator
    └── encyclopedia.js ← Trait encyclopedia render
```

---

## Running Locally

No build step required — pure HTML/CSS/JS.

```bash
git clone https://github.com/YOUR_USERNAME/deviation-matrix.git
cd deviation-matrix

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

All game content lives in **`data/database.js`**. No logic changes needed for routine updates.

### Adding a new Deviation species
```js
// In the DEVS array:
{ n: "New Deviation Name", t: "Combat" },  // t = Combat | Territory | Crafting
```

### Adding a new Trait
```js
// In the TRAITS array:
{
  s: 1,                // slot: 1=General, 2=Type-specific, 3=Deviated
  n: "Trait Name",
  d: "Effect description",
  cat: "General",      // General | Combat | Territory | Crafting | Animal | Furniture | Variation
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

## Data Persistence

All inventory and material counts are saved to **`localStorage`** under the keys:
- `oh4_inv` — deviation inventory array
- `oh4_matc` — animal/furniture count map

No server, no account, no sync — data lives in the browser.

---

## Contributing

Pull requests welcome! Please keep game data changes in `data/database.js` only. Logic and UI changes should go in the appropriate module under `js/`.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/new-deviations`
3. Commit your changes
4. Open a PR with a description of what changed and why

---

Disclaimer: I used AI to assist in building this, as it started as a small project and grew beyond its original scope.

---

## License

MIT — free to use, modify, and redistribute.

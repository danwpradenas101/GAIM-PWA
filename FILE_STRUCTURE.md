# GAIM PWA - File Structure & What Each Does

## 📁 Top-Level Files

### Configuration Files
```
package.json              - Lists all dependencies & scripts (npm install reads this)
tsconfig.json            - TypeScript compiler settings
tsconfig.node.json       - TypeScript settings for Vite
vite.config.ts           - Build tool configuration (PWA settings)
.gitignore              - Which files to ignore in version control
```

### Documentation Files
```
README.md               - ⭐ Complete user guide, features, deployment
QUICKSTART.md           - ⭐ 5-minute setup guide (read this first!)
DEVELOPMENT.md          - 🔧 Developer guide, architecture details
MIGRATION_COMPLETE.md   - What was built and why
NEXT_STEPS.md          - What to do right now
```

---

## 📂 Source Code (`src/` folder)

### Main Application
```
src/
├── App.tsx             - Main app component (entry point for UI)
├── App.css             - App-wide styling
├── main.tsx            - React startup & Service Worker registration
├── index.css           - Global styles & CSS variables
├── vite-env.d.ts       - TypeScript environment definitions
└── sw.ts               - Service Worker (for offline support)
```

### Components (`src/components/`)
Each component is a reusable UI piece:

```
ParameterSelector.tsx         - Welcome screen with parameter checkboxes
ParameterSelector.module.css  - Styles for welcome screen
├─ Props: config, onSelect, onNext
└─ Shows: Checkboxes for all parameters

ParametersPanel.tsx           - Collapsible sidebar control panel
ParametersPanel.module.css    - Styles for controls
├─ Props: params, config, onChange, onOpenConfig
└─ Shows: Key, Tempo, Instruments, Mood, etc.

CompositionDisplay.tsx        - Shows generated composition
CompositionDisplay.module.css - Styles for display
├─ Props: params, pitches, isDodecafonic, handlers
└─ Shows: Composition output + action buttons

BeatMaker.tsx                 - Visual drum machine
BeatMaker.module.css          - Styles for beat grid
├─ Props: pattern, onClose, onExport
└─ Shows: Grid of beats, export button

ConfigurationScreen.tsx       - Parameter list editor
ConfigurationScreen.module.css - Styles for editor
├─ Props: config, onSave, onClose
└─ Shows: Tab interface, add/remove items
```

### Utilities (`src/utils/`)
Core logic and helper functions:

```
gaim.ts                - ⭐ Core composition generation functions
                         (Python logic converted to TypeScript)
  Functions:
  - randomKey()
  - randomTempo()
  - randomTimeSignature()
  - randomInstrumentation()
  - randomMood()
  - selectRandomPitches()
  - generateRhythmPattern()
  - generateCompositionIdea()
  - exportPatternToMIDI()

config.ts              - Default parameter lists & configuration
  Exports: DEFAULT_CONFIG, GAIMConfig interface

storage.ts             - Database operations (IndexedDB wrapper)
  Functions:
  - saveComposition()
  - getCompositions()
  - saveConfig()
  - getConfig()
  - setPreference()
  - getPreference()

midi.ts                - MIDI file export
  Functions:
  - exportToMIDI()
  - createMIDIHeader()
  - createMIDITrack()
  - encodeVariableLength()
```

### Workers (`src/workers/`)
Currently empty, ready for Web Workers if needed in future.

---

## 📁 Public Files (`public/`)

```
index.html            - Entry HTML file
                       Loads Service Worker, sets PWA manifest
```

---

## 🔧 How Each File Works Together

### User Clicks "Generate New"
```
App.tsx
└─ calls generateCompositionIdea()
   ├─ from: gaim.ts
   ├─ uses: config.ts (DEFAULT_CONFIG)
   └─ returns: CompositionIdea
      ├─ stored in: App state
      ├─ displayed by: CompositionDisplay.tsx
      └─ saved to: storage.ts (IndexedDB)
```

### User Opens Beat Maker
```
App.tsx
└─ calls generateRhythmPattern()
   ├─ from: gaim.ts
   └─ returns: RhythmPattern
      ├─ displayed by: BeatMaker.tsx
      └─ when exported
         ├─ calls: exportToMIDI()
         ├─ from: midi.ts
         └─ saves to: storage.ts
```

### User Modifies Parameters
```
ParametersPanel.tsx
└─ onChange event
   └─ calls: handleParamChange()
      ├─ in: App.tsx
      ├─ updates: currentIdea state
      └─ re-renders: CompositionDisplay.tsx
```

### User Opens Config Screen
```
ConfigurationScreen.tsx
└─ onSave event
   └─ calls: handleSaveConfig()
      ├─ in: App.tsx
      ├─ updates: config state
      ├─ saves to: storage.ts (IndexedDB)
      └─ uses new config for: all composition generation
```

### First Visit (Offline Setup)
```
main.tsx
└─ registers: sw.ts (Service Worker)
   └─ Service Worker
      ├─ downloads: all files in dist/
      ├─ caches: HTML, CSS, JS, images
      └─ on subsequent visits
         └─ serves from cache (offline ready!)
```

---

## 📊 Data Flow

### Composition Generation
```
user input (parameters)
    ↓
ParametersPanel.tsx / selectRandomPitches
    ↓
gaim.ts (core logic)
    ↓
CompositionIdea object
    ↓
CompositionDisplay.tsx (display)
    ↓
localStorage / IndexedDB (storage.ts)
```

### Storage Architecture
```
IndexedDB Database "gaim"
├─ Store: compositions
│  └─ keyPath: timestamp
│     ├─ params: CompositionParams
│     ├─ pitches: string[]
│     ├─ is_dodecafonic: boolean
│     └─ timestamp: number
├─ Store: rhythms
│  └─ keyPath: timestamp
│     ├─ pattern details
│     └─ timestamp: number
├─ Store: config
│  └─ key: "current"
│     └─ value: GAIMConfig
└─ Store: preferences
   └─ key: string
      └─ value: any
```

---

## 🚀 Build Process

```
TypeScript Source (src/*.ts, src/**/*.tsx)
    ↓
TypeScript Compiler (tsconfig.json rules)
    ↓
Vite Builder (vite.config.ts)
    ├─ Minifies code
    ├─ Bundles dependencies
    ├─ Generates Service Worker
    ├─ Creates PWA manifest
    └─ Optimizes images
    ↓
Production Output (dist/)
    ├─ index.html (minified)
    ├─ JavaScript bundles (minified, code-split)
    ├─ CSS files (minified)
    ├─ Service Worker manifest
    ├─ PWA manifest
    └─ Assets
```

---

## 📝 File Size Reference

Typical file sizes (unminified):
```
gaim.ts               ~15 KB  (core logic)
components/           ~8 KB each
config.ts            ~3 KB
storage.ts           ~4 KB
App.tsx              ~6 KB
styles               ~1-2 KB each

Total source:        ~100 KB
Build output:        ~200 KB gzipped (very efficient!)
```

---

## 🔍 Finding Things

**If you want to...**

| Goal | File |
|------|------|
| Change default parameters | `src/utils/config.ts` |
| Add/remove composition features | `src/utils/gaim.ts` |
| Change colors/styling | `src/index.css` |
| Modify component layout | `src/components/*.tsx` |
| Change app flow | `src/App.tsx` |
| Offline caching behavior | `src/sw.ts` |
| Database operations | `src/utils/storage.ts` |
| Build settings | `vite.config.ts` |
| Dependencies | `package.json` |

---

## 🔗 Key Interfaces

### CompositionParams
```typescript
{
  key: string                    // "C Major"
  tempo: number                  // 120 BPM
  time_signature: string         // "4/4"
  instrumentation: string[]      // ["Piano", "Strings"]
  mood: string                   // "Energetic"
  style: string                  // "Jazz"
  composer: string               // "Bach"
  adjective: string              // "bright"
  num_pitches: number            // 8
  allow_repeats: boolean         // false
  pitch_usage: string            // "Melody"
}
```

### CompositionIdea
```typescript
{
  params: CompositionParams
  pitches: string[]              // ["C", "E", "G", ...]
  is_dodecafonic: boolean        // true if 12 pitches
  timestamp: number              // Date.now()
}
```

### RhythmPattern
```typescript
{
  measures: number               // 2
  time_signature: string         // "4/4"
  subdivision: string            // "sixteenth"
  use_triplets: boolean          // true
  pattern_string: string         // "|| 0101 | 1100 ||"
  pattern_matrix: number[][][]   // 3D array of beats
  steps_per_measure: number      // 16
  target_beats: number           // 10
}
```

---

## ✅ Verification Checklist

After `npm install`, you should have:
- [ ] `node_modules/` folder (dependencies installed)
- [ ] All files listed above created
- [ ] `npm run dev` works
- [ ] Browser opens to http://localhost:5173
- [ ] App is interactive

If any issues, check:
1. You're in the correct directory (`pwa/`)
2. Node version is 16+ (`node --version`)
3. npm is up to date (`npm install -g npm@latest`)

---

## 📚 Related Resources

- **React Docs** - https://react.dev
- **TypeScript** - https://www.typescriptlang.org/docs/
- **Vite** - https://vitejs.dev/
- **PWA Guide** - https://web.dev/progressive-web-apps/
- **IndexedDB** - https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

---

**Everything is connected! Edit files in `src/`, they automatically rebuild.**

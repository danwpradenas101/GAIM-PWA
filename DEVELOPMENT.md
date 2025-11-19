# GAIM PWA Setup & Development Guide

## Getting Started

### 1. Install Dependencies

```bash
cd pwa
npm install
```

This will install:
- React & React DOM
- TypeScript
- Vite (build tool)
- Vite PWA plugin (for offline support)
- IndexedDB wrapper (idb)
- ESLint & dev tools

### 2. Start Development Server

```bash
npm run dev
```

- Opens browser automatically at `http://localhost:5173`
- Hot reload on file changes
- Fast rebuild times

### 3. Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder ready for deployment:
- Minified JavaScript
- Optimized CSS
- Service Worker precaching manifest
- PWA manifest and icons

### 4. Preview Production Build

```bash
npm run preview
```

Tests the production build locally before deploying.

## Project Architecture

### Component Structure

```
ParameterSelector (Welcome Screen)
└─ Main App
   ├─ Sidebar
   │  ├─ ParametersPanel (collapsible controls)
   │  └─ Action buttons (Generate, Reset)
   └─ Main Content
      └─ CompositionDisplay
         ├─ Current composition
         └─ Action buttons (Copy, Save, Beats)

BeatMaker (Modal)
└─ Drum machine grid
   └─ Export/Cancel

ConfigurationScreen (Modal)
└─ Tab-based list editor
   ├─ Instruments
   ├─ Moods
   ├─ Styles
   ├─ Composers
   ├─ Adjectives
   └─ Pitch Usage Patterns
```

### Core Logic

- **gaim.ts** - All composition generation functions
- **config.ts** - Default parameter lists
- **storage.ts** - IndexedDB database wrapper
- **midi.ts** - MIDI file export

All core logic is framework-agnostic TypeScript.

## Key Features Implementation

### 1. Parameter Selection Screen

File: `src/components/ParameterSelector.tsx`

First screen users see. Allows selection of which parameters to randomize.

**How it works:**
1. Render checkboxes for each parameter
2. Store selection in state
3. Pass to main app
4. Main app uses selection to decide what to regenerate

### 2. Drum Machine Beat Maker

File: `src/components/BeatMaker.tsx`

Visual grid representation of beats.

**How it works:**
- Parse time signature → calculate quarters per measure
- Generate grid: measures × quarters × subdivision steps
- Each square represents a time step (16th note, eighth note, etc.)
- Click to toggle beat on/off
- Export as MIDI

**Beat Maker Logic:**
```
Time Signature 4/4:
- 4 quarters per measure
- At sixteenth subdivision: 4 × 4 = 16 steps per measure
- Each square = one sixteenth note
```

### 3. Configuration Screen

File: `src/components/ConfigurationScreen.tsx`

Allows users to modify parameter lists.

**How it works:**
1. Show tabs for each editable list
2. Input field to add new items
3. Click to remove items
4. "Reset to Defaults" button
5. Save to IndexedDB on close

### 4. Offline Support (Service Worker)

File: `src/sw.ts`

Service Worker handles offline caching.

**How it works:**
- Precaches all app assets (HTML, CSS, JS)
- First load: downloads and caches
- Subsequent loads: serves from cache
- Network falls back to cache if offline

**Workbox Configuration:**
- Precache everything in `dist/`
- Cache-first for Google Fonts
- Network-first for API calls (if added)

### 5. Local Storage (IndexedDB)

File: `src/utils/storage.ts`

Persistent database for compositions and settings.

**Stores:**
- `compositions` - Saved composition ideas
- `rhythms` - Saved beat patterns
- `config` - Custom parameter lists
- `preferences` - User preferences (theme, etc.)

## Adding Features

### Add a New Parameter Type

1. **Update config.ts:**
   ```typescript
   export const DEFAULT_CONFIG: GAIMConfig = {
     new_params: ['Option 1', 'Option 2', ...],
     ...
   }
   ```

2. **Update gaim.ts:**
   ```typescript
   export function randomNewParam(config: GAIMConfig): string {
     return randomChoice(config.new_params)
   }
   ```

3. **Update ConfigurationScreen.tsx:**
   - Add to editable tabs list

4. **Use in components:**
   ```typescript
   const idea = generateCompositionIdea(config)
   // idea.params will include new_param
   ```

### Add a New Component

1. Create file in `src/components/MyComponent.tsx`
2. Import styles: `import styles from './MyComponent.module.css'`
3. Create corresponding `.module.css` file
4. Export component
5. Import and use in App.tsx or other components

### Styling

All components use CSS modules for scoped styling.

**Color variables available:**
- Primary colors: `--primary`, `--primary-dark`, `--secondary`
- Status: `--success`, `--danger`, `--warning`
- Grays: `--gray-50` through `--gray-900`
- Special: `--bg`, `--fg` (background/foreground, theme-aware)

## Database

### IndexedDB Structure

```
Database: "gaim"
Version: 1

Store: compositions
- keyPath: timestamp
- {
    params: CompositionParams,
    pitches: string[],
    is_dodecafonic: boolean,
    timestamp: number
  }

Store: rhythms
- keyPath: timestamp
- {
    ...RhythmPattern,
    timestamp: number
  }

Store: config
- key: "current"
- value: GAIMConfig

Store: preferences
- key: string (theme, etc.)
- value: any
```

### Accessing Data

```typescript
import { saveComposition, getCompositions } from './utils/storage'

// Save
await saveComposition(idea)

// Retrieve
const ideas = await getCompositions(limit: 50)
```

## Performance Tips

1. **Code Splitting** - Components are automatically code-split by Vite
2. **Lazy Loading** - Consider lazy loading config screen
3. **Memoization** - Use React.memo() for expensive components
4. **Images** - Optimize SVGs and PNGs before adding
5. **Caching** - Service Worker handles all caching

Current size budget: ~250KB gzipped total.

## Testing

### Manual Testing

1. **Offline mode:**
   - DevTools → Network → Offline
   - App should still work

2. **Storage:**
   - DevTools → Application → IndexedDB → gaim
   - Save a composition, verify it appears

3. **Responsiveness:**
   - DevTools → Device toolbar
   - Test on mobile sizes

### Type Checking

```bash
npm run type-check
```

Catches TypeScript errors before runtime.

## Deployment

### Environment-Specific Builds

Edit `vite.config.ts` if you need environment-specific builds.

### Environment Variables

Create `.env` file:
```
VITE_APP_TITLE=GAIM PWA
```

Access in code: `import.meta.env.VITE_APP_TITLE`

### Build Optimization

Check bundle size:
```bash
npm run build
# Check dist/ folder sizes
```

## Troubleshooting

### Service Worker Not Updating

Delete site data:
1. DevTools → Application
2. Storage → Clear site data

Then reload page.

### IndexedDB Not Persisting

Check quota:
```javascript
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} bytes`)
  console.log(`Available: ${estimate.quota} bytes`)
})
```

### TypeScript Errors

Run type-check:
```bash
npm run type-check
```

Install missing types:
```bash
npm install --save-dev @types/package-name
```

## Next Steps

Potential enhancements:
- [ ] Dark/light theme toggle
- [ ] Export composition as JSON
- [ ] Import previous compositions
- [ ] Audio preview (Web Audio API)
- [ ] Collaboration/sharing features
- [ ] History/undo system
- [ ] Keyboard shortcuts
- [ ] Search/filter compositions
- [ ] Advanced rhythm patterns

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

Happy composing! 🎵

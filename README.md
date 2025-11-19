# GAIM PWA - Generate AI Music Composition Ideas

A modern Progressive Web App version of GAIM, now completely web-based and accessible offline on any platform (Windows, macOS, Linux, Android, iOS, and more).

## Features

✨ **New Features in PWA Version:**
- 🎯 **Parameter Selection Screen** - First page for choosing which parameters to randomize
- 🥁 **Visual Drum Machine** - Drag-and-drop beat maker with visual grid representation
- ⚙️ **Configuration Screen** - Modify all parameter lists within the app
- 📱 **Cross-Platform** - Works on desktop, tablet, and mobile
- 🔌 **Fully Offline** - Works without internet connection (cached offline)
- 💾 **Local Storage** - All compositions and preferences saved locally in IndexedDB
- 🎨 **Modern UI** - Clean, responsive interface with dark/light theme support

### Original Features

- **Random Pitch Selection**: Generate 1-12 random pitches with optional repeats
- **Dodecafonic Series**: Automatically creates 12-tone series when 12 pitches selected
- **Parameter Control**: Tweak key, tempo, time signature, instrumentation, mood, style, and more
- **MIDI Export**: Export beat patterns as MIDI files
- **Randomize Mode**: Generate fully random composition ideas with one click

## Installation

### Prerequisites

- **Node.js 16+** and **npm** (or yarn/pnpm)

### Quick Start

1. **Navigate to the PWA directory:**
   ```bash
   cd pwa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will automatically open in your browser at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized app will be in the `dist` folder

## Usage

### First Time

When you launch the app, you'll see a welcome screen where you can select which parameters you want randomized:
- Key / Mode
- Tempo
- Time Signature
- Instrumentation
- Mood
- Pitches
- Musical Style
- Composer Inspiration
- Adjectives
- Beat Maker (optional)

Once selected, click "Continue" to proceed to the main interface.

### Main Interface

The app has a sidebar on the left with controls and the composition display on the right:

1. **Generate New** - Creates a random composition idea
2. **Parameters Panel** - Expand to tweak individual parameters
3. **Manage Lists** - Opens configuration screen to add/remove parameter options

### Composition Display

Shows the generated composition with:
- 🔄 **Regenerate Pitches** - Get new pitches while keeping other parameters
- 📋 **Copy** - Copy composition to clipboard
- 💾 **Save** - Save composition to local database
- 🥁 **Beats** - Open the beat maker for rhythm creation

### Beat Maker

Visual drum machine with:
- **Measurement View** - See each measure and beat clearly
- **Click to Toggle** - Click any square to turn that beat on/off
- **Live Grid** - Shows measures, time signature, and subdivision
- **Export MIDI** - Download beat as MIDI file for use in DAWs

### Configuration Screen

Modify parameter lists:
- Add new items to any parameter category
- Remove existing items
- Reset to defaults
- Changes are saved automatically to local storage

## Offline Support

This PWA works completely offline:

1. **First Visit** - App is downloaded and cached by Service Worker
2. **Subsequent Visits** - App loads instantly from cache (no internet needed)
3. **Data Persistence** - All compositions, preferences, and config saved locally via IndexedDB

### Installing as App

**Windows/macOS/Linux:**
1. Open the app in your browser
2. Click the install button (usually in address bar)
3. Or use menu: ⋯ → "Install GAIM"

**Mobile (Android/iOS):**
1. Open in mobile browser
2. Tap share menu
3. Select "Add to Home Screen"
4. App will appear on your home screen

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Ultra-fast build tool
- **CSS 3** - Modern styling with CSS variables
- **IndexedDB** - Local database for offline storage
- **Service Worker** - PWA offline support
- **Workbox** - PWA precaching and caching strategies

## Project Structure

```
pwa/
├── public/              # Static assets
│   └── index.html      # PWA manifest
├── src/
│   ├── components/     # React components
│   │   ├── ParameterSelector.tsx
│   │   ├── ParametersPanel.tsx
│   │   ├── CompositionDisplay.tsx
│   │   ├── BeatMaker.tsx
│   │   └── ConfigurationScreen.tsx
│   ├── pages/          # Full page components (optional)
│   ├── utils/          # Utility functions
│   │   ├── gaim.ts     # Core GAIM logic
│   │   ├── config.ts   # Configuration
│   │   ├── storage.ts  # IndexedDB wrapper
│   │   └── midi.ts     # MIDI export
│   ├── workers/        # Web Workers (future)
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   ├── sw.ts           # Service Worker
│   └── index.css       # Global styles
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

## Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build optimized production version
- `npm run preview` - Preview production build locally
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint code (ESLint)

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14.1+
- Opera 74+

All modern browsers with PWA and Service Worker support.

## Data Storage

All data is stored **locally** in your browser:

- **Compositions** - IndexedDB "compositions" store
- **Rhythms** - IndexedDB "rhythms" store
- **Config** - IndexedDB "config" store
- **Preferences** - IndexedDB "preferences" store

Data **never leaves your device**. No accounts, no cloud sync, no tracking.

### Exporting Data

Compositions and beats are easily exported:
- Compositions can be copied to clipboard
- Beats can be exported as MIDI files
- Config can be manually edited in "Manage Lists" screen

### Clearing Data

To clear all app data:
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Select "IndexedDB" → "gaim"
4. Delete the stores

Or clear app data through browser settings.

## Customization

### Adding New Parameters

Edit `src/utils/config.ts`:

```typescript
export const DEFAULT_CONFIG: GAIMConfig = {
  instruments: [
    'Piano', 'Strings', 'Synth', 
    'Your New Instrument',  // Add here
    ...
  ],
  // ...
}
```

Parameters can also be added via the Configuration Screen in the app.

### Modifying Styles

Edit `src/index.css` for global variables:

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --success: #10b981;
  /* ... more colors ... */
}
```

Component styles are in `.module.css` files.

## Deployment

### Netlify (Recommended)

1. Push to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

```bash
vercel
```

### GitHub Pages

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Self-Hosted

```bash
npm run build
# Copy dist/ folder to your web server
```

All files in `dist/` are static and can be served by any web server.

## Performance

- **Initial Load:** ~200KB gzipped (includes React, UI, and all assets)
- **Subsequent Loads:** ~0KB (served from cache)
- **First Paint:** <1 second
- **Fully Interactive:** <2 seconds

Optimized with:
- Code splitting
- Tree shaking
- Minification
- Gzip compression
- Service Worker caching

## License

Open source. Use freely.

## Contributing

Issues, suggestions, and pull requests welcome!

## FAQ

**Q: Does this app require internet?**
A: No! After the first load, it works completely offline. All data stays on your device.

**Q: Where is my data stored?**
A: All compositions, preferences, and settings are stored in your browser's IndexedDB (local database). No cloud sync, no accounts needed.

**Q: Can I use this on my phone?**
A: Yes! Install it as an app on Android or iOS home screen. It works just like a native app.

**Q: How do I export my compositions?**
A: Click "Copy" to copy to clipboard, or "Save" to store in app database. Beats export as MIDI files.

**Q: Can I delete the app and reinstall it?**
A: Yes, but your saved compositions will be cleared. Export them to MIDI first if needed.

**Q: Is there a desktop version?**
A: The PWA works on desktop! Or see the original Python version for a native desktop app.

## Original Python Version

The original Python version is still available in the parent directory. Use it for:
- Advanced MIDI features
- Integration with DAWs
- Desktop-only workflows

The PWA version is recommended for:
- Cross-platform use
- Mobile/tablet use
- Offline-first workflows
- No installation required

---

**Built with ❤️ for composers and musicians everywhere**

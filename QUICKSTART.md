# 🚀 GAIM PWA - Quick Start Guide

## What You Have

A complete Progressive Web App version of GAIM that:
- ✅ Works on **any platform** (Windows, Mac, Linux, Android, iOS)
- ✅ Works **completely offline** once loaded
- ✅ Has a **modern UI** with all the improvements you requested
- ✅ Can be **installed as an app** on desktop and mobile
- ✅ Stores all data **locally** (no cloud, no tracking)

## Installation & Running (5 minutes)

### Step 1: Install Dependencies
```bash
cd pwa
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Your browser should open automatically at `http://localhost:5173`

### That's it! You now have GAIM running. 🎉

## What's New

### 1️⃣ Parameter Selection Screen
When you first open the app, you see a welcome screen. Select which parameters you want randomized:
- Key, Tempo, Time Signature
- Instrumentation, Mood
- Style, Composer, Adjectives
- And more...

Once selected, click "Continue" to go to the main interface.

### 2️⃣ Drum Machine Beat Maker
Instead of just showing a text pattern, you now get:
- **Visual Grid** - Each square is a beat you can click
- **Time Signature** - Clearly shows measures and time signature
- **Subdivision Display** - See if using quarter, eighth, or sixteenth notes
- **Triplet Support** - Visual indication when triplets are used
- **Export to MIDI** - Download beats for use in DAWs

### 3️⃣ Configuration Screen
Modify parameter lists directly in the app:
- **Add New Items** - Type and add to any parameter list
- **Remove Items** - Click the X to remove
- **Reset to Defaults** - Start over if needed
- **Auto-Save** - Changes saved automatically

Access via "⚙️ Manage Lists" button in the Parameters panel.

## How It Works

### Main Interface Layout

**Left Sidebar:**
- GAIM title and description
- Parameters Panel (collapsible)
  - Key selection
  - Tempo slider
  - Time Signature
  - Mood, Style, Composer
  - Instrumentation (checkboxes)
  - Pitches (number + allow repeats)
  - "Manage Lists" button
- "Generate New" button
- "Reset Preferences" button

**Right Content Area:**
- Your generated composition
- Shows all parameters
- Shows selected pitches
- Indicator if dodecafonic series
- Buttons: 🔄 Regenerate Pitches | 📋 Copy | 💾 Save | 🥁 Beats

### Workflow Example

1. **Open App** → See Welcome Screen
2. **Select Parameters** → Click "Continue"
3. **Click "Generate New"** → See random composition
4. **Tweak Parameters** → Expand Parameters Panel, adjust controls
5. **Like It?** → Click "Save" to save to local database
6. **Make Beats** → Click "🥁 Beats" to open beat maker
7. **Export Beat** → Click "Export MIDI" to download

## Offline Support

Once you load the app once:
- App is cached in your browser
- Completely works without internet
- All compositions saved locally
- Settings/preferences saved locally

### Install as App (Optional)

**On Desktop (Chrome/Edge/Firefox):**
1. Open the app in your browser
2. Click the install button in the address bar
3. App appears in your apps menu

**On Mobile (Android/iOS):**
1. Open in mobile browser
2. Tap Share menu
3. Select "Add to Home Screen"
4. App appears on your home screen

## File Structure

```
gaim/                          (your project root)
├── pwa/                        (the PWA app)
│   ├── src/
│   │   ├── components/         (React components)
│   │   ├── utils/             (core logic & database)
│   │   ├── App.tsx            (main app)
│   │   ├── main.tsx           (entry point)
│   │   ├── sw.ts              (Service Worker for offline)
│   │   └── index.css          (global styles)
│   ├── public/                (static files)
│   ├── package.json           (dependencies)
│   ├── vite.config.ts         (build config)
│   ├── README.md              (full documentation)
│   └── DEVELOPMENT.md         (dev guide)
│
├── gaim.py                    (original Python version)
├── gui.py                     (original Python GUI)
└── README.md                  (original docs)
```

## Commands

```bash
# Start development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## Your Data

- **Where is it stored?** Your browser's local IndexedDB
- **Who has access?** Only you - it never leaves your device
- **Can I clear it?** Yes - browser storage settings
- **Can I export it?** Yes - via Copy/Save buttons, or MIDI export

## Next Steps

### Option 1: Develop Further
- Edit files in `src/`
- See changes instantly (hot reload)
- See DEVELOPMENT.md for detailed guide

### Option 2: Build & Deploy
```bash
npm run build
```

Then deploy `dist/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Your own server

See README.md for detailed deployment steps.

### Option 3: Keep Both Versions
You now have:
1. **PWA (web)** - Use on any device, offline-ready
2. **Python (desktop)** - Original version still available

## Troubleshooting

**Q: App not starting?**
A: Make sure you're in the `pwa` directory when running `npm install` and `npm run dev`

**Q: Hot reload not working?**
A: Refresh the browser page manually

**Q: Changes not showing?**
A: Check browser console (F12) for errors

**Q: Want to clear all saved data?**
A: DevTools → Application → Storage → Clear site data

## Tips & Tricks

1. **Keyboard Shortcut**: Use Tab key to navigate parameters
2. **Beat Maker**: Click multiple times to toggle beats rapidly
3. **Copy Composition**: Use 📋 Copy button, then paste in text editor
4. **Export MIDI**: Save beats and import into your DAW
5. **Reset Welcome**: Click "↻ Reset Preferences" to see welcome screen again

## Full Documentation

- **README.md** - Complete feature list and usage guide
- **DEVELOPMENT.md** - Technical architecture and development guide

## Support

If you encounter issues:
1. Check browser console (F12 → Console tab)
2. See if data is in IndexedDB (F12 → Application → IndexedDB)
3. Try clearing site data and reloading
4. Check DEVELOPMENT.md troubleshooting section

---

**Enjoy the new GAIM! Now available everywhere, offline, and always accessible.** 🎵

Questions? See README.md or DEVELOPMENT.md for detailed docs.

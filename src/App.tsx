import { useState, useEffect } from 'react'
import { LanguageProvider, useTranslation } from './i18n'
import { ParameterSelector } from './components/ParameterSelector'
import { ParametersPanel } from './components/ParametersPanel'
import { CompositionDisplay } from './components/CompositionDisplay'
import { BeatMaker } from './components/BeatMaker'
import { ConfigurationScreen } from './components/ConfigurationScreen'
import { generateCompositionIdea, selectRandomPitches, generateRhythmPattern, CompositionIdea, RhythmPattern, CompositionParams } from './utils/gaim'
import { DEFAULT_CONFIG, GAIMConfig } from './utils/config'
import { saveComposition, saveConfig, getConfig, saveRhythm } from './utils/storage'
import { exportToMIDI } from './utils/midi'
import './App.css'

type AppScreen = 'welcome' | 'main' | 'beats' | 'config'

function AppContent() {
    const [screen, setScreen] = useState<AppScreen>('welcome')
    const [config, setConfig] = useState<GAIMConfig>(DEFAULT_CONFIG)
    const [currentIdea, setCurrentIdea] = useState<CompositionIdea | null>(null)
    const [currentPattern, setCurrentPattern] = useState<RhythmPattern | null>(null)
    const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({})
    const { t, translateConfig, lang, setLang } = useTranslation()
    const displayedConfig = translateConfig(config)

    useEffect(() => {
        loadConfig()
    }, [])

    const loadConfig = async () => {
        const saved = await getConfig()
        setConfig(saved || DEFAULT_CONFIG)
    }

    const handleParamSelection = (selected: Record<string, boolean>) => {
        setSelectedParams(selected)
    }

    const handleWelcomeNext = () => {
        generateNewIdea()
        setScreen('main')
    }

    const generateNewIdea = () => {
        const idea = generateCompositionIdea(config)
        setCurrentIdea(idea)
    }

    const handleRegeneratePitches = () => {
        if (!currentIdea) return
        const [num, pitches] = selectRandomPitches(currentIdea.params.num_pitches, currentIdea.params.allow_repeats, config)
        setCurrentIdea({
            ...currentIdea,
            pitches,
            is_dodecafonic: num === 12 && !currentIdea.params.allow_repeats,
        })
    }

    const handleParamChange = (changes: Partial<CompositionParams>) => {
        if (!currentIdea) return
        setCurrentIdea({
            ...currentIdea,
            params: { ...currentIdea.params, ...changes },
        })
    }

    const handleCopyOutput = () => {
        if (!currentIdea) return

        const lookupValue = (val: string | string[]): string => {
            if (Array.isArray(val)) {
                return val.map(v => lookupValue(v)).join(', ')
            }
            const s = String(val)
            // Search translated config lists for a match and return the translated label if found
            for (const k of Object.keys(displayedConfig as any)) {
                const list = (displayedConfig as any)[k]
                if (!Array.isArray(list)) continue
                for (const item of list) {
                    if (typeof item === 'string') {
                        if (item === s) return item
                    } else if (item && (item.id === s || item.value === s || item.label === s)) {
                        return item.label || item.value || item.id
                    }
                }
            }
            // fallback to raw value
            return s
        }

        const output = `${t('label.key')}: ${lookupValue(currentIdea.params.key)}
${t('label.tempo')}: ${currentIdea.params.tempo} BPM
${t('label.time_signature')}: ${lookupValue(currentIdea.params.time_signature)}
${t('label.instrumentation')}: ${lookupValue(currentIdea.params.instrumentation)}
${t('label.mood')}: ${lookupValue(currentIdea.params.mood)}
${t('label.style')}: ${lookupValue(currentIdea.params.style)}

${t('label.pitches')}:
${currentIdea.pitches.join(', ')}`

        navigator.clipboard.writeText(output)
    }

    const handleSaveComposition = async () => {
        if (!currentIdea) return
        await saveComposition(currentIdea)
        alert(t('composition_saved'))
    }

    const handleOpenBeats = () => {
        const pattern = generateRhythmPattern(
            currentIdea?.params.time_signature || '4/4',
            2,
            'sixteenth',
            true
        )
        setCurrentPattern(pattern)
        setScreen('beats')
    }

    const handleExportBeat = async (pattern: RhythmPattern) => {
        const midi = exportToMIDI(pattern, currentIdea?.params.key || 'C', currentIdea?.params.tempo || 120)
        const url = URL.createObjectURL(midi)
        const a = document.createElement('a')
        a.href = url
        a.download = `beat_${Date.now()}.mid`
        a.click()
        await saveRhythm({ ...pattern, timestamp: Date.now() })
        setScreen('main')
    }

    const handleSaveConfig = async (newConfig: GAIMConfig) => {
        setConfig(newConfig)
        await saveConfig(newConfig)
    }

    if (screen === 'welcome') {
        return (
            <ParameterSelector
                config={displayedConfig}
                onSelect={handleParamSelection}
                onNext={handleWelcomeNext}
            />
        )
    }

    if (screen === 'beats' && currentPattern) {
        return (
            <div className="app-container">
                <BeatMaker
                    pattern={currentPattern}
                    onClose={() => setScreen('main')}
                    onExport={handleExportBeat}
                />
            </div>
        )
    }

    if (screen === 'config') {
        return (
            <div className="app-container">
                <ConfigurationScreen
                    config={config}
                    onSave={handleSaveConfig}
                    onClose={() => setScreen('main')}
                />
            </div>
        )
    }



    return (
        <div className="app-container">
            <div className="main-layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ margin: 0 }}>{t('app.title')}</h1>
                                <p style={{ margin: 0 }}>{t('app.subtitle')}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button onClick={() => setLang('en')} style={{ opacity: lang === 'en' ? 1 : 0.6 }}>EN</button>
                                <button onClick={() => setLang('es')} style={{ opacity: lang === 'es' ? 1 : 0.6 }}>ES</button>
                            </div>
                        </div>
                    </div>
                    <ParametersPanel
                        params={currentIdea?.params || {} as CompositionParams}
                        config={displayedConfig}
                        selected={selectedParams}
                        onChange={handleParamChange}
                        onOpenConfig={() => setScreen('config')}
                    />

                    <button className="new-btn" onClick={generateNewIdea}>
                        {t('generate_new')}
                    </button>
                    <button className="welcome-btn" onClick={() => setScreen('welcome')}>
                        {t('reset_preferences')}
                    </button>
                </aside>

                <main className="content">
                    {currentIdea ? (
                        <CompositionDisplay
                            params={currentIdea.params}
                            pitches={currentIdea.pitches}
                            isDodecafonic={currentIdea.is_dodecafonic}
                            selected={selectedParams}
                            onRegeneratePitches={handleRegeneratePitches}
                            onCopy={handleCopyOutput}
                            onSave={handleSaveComposition}
                            onOpenBeats={handleOpenBeats}
                        />
                    ) : (
                        <div className="empty-state">
                            <p>{t('empty_state')}</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    )
}

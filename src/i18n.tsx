import React, { createContext, useContext, useState } from 'react'

export type Lang = 'en' | 'es'

const translations: Record<Lang, Record<string, string>> = {
    en: {
        'app.title': 'GAIM',
        'app.subtitle': 'Random Music Ideas Generator',
        'manage_lists': 'Manage Lists (advanced)',
        'generate_new': '✨ Generate New',
        'apply_changes': '⚙️ Apply Changes',
        'reset_preferences': '↻ Back to Start',
        'empty_state': 'Click "Generate New" to create a composition idea',

        'welcome.title': 'Welcome to GAIM',
        'welcome.subtitle': 'Select which parameters you want randomized',
        'select_all': 'Select All',
        'clear_all': 'Clear All',
        'continue': 'Continue',

        'composition.title': 'Composition Idea',
        'beats': '🥁 Beats',
        'pitches_btn': '🔄 Pitches',
        'copy': '📋 Copy',
        'copied': '✓ Copied',
        'save': '💾 Save',

        'label.key': 'Key',
        'label.tempo': 'Tempo',
        'label.time_signature': 'Time Signature',
        'label.instrumentation': 'Instrumentation',
        'label.mood': 'Mood',
        'label.style': 'Style',
        'label.composer': 'Composer Inspiration',
        'label.adjective': 'Character',
        'label.pitches': 'Pitches',
        'label.pitch_usage': 'Use as',
        'allow_repeats': 'Allow repeats',
        'dodecafonic_notice': '✓ DODECAFONIC SERIES (all 12 pitches)',

        // scale modes (display values)
        'mode.Major': 'Major',
        'mode.Dorian': 'Dorian',
        'mode.Phrygian': 'Phrygian',
        'mode.Lydian': 'Lydian',
        'mode.Mixolydian': 'Mixolydian',
        'mode.Minor': 'Minor',
        'mode.Locrian': 'Locrian',
        'mode.Harmonic Minor': 'Harmonic Minor',
        'mode.Melodic Minor': 'Melodic Minor',

        // tempo names
        'tempo.Grave': 'Grave',
        'tempo.Largo': 'Largo',
        'tempo.Lento': 'Lento',
        'tempo.Adagio': 'Adagio',
        'tempo.Andante': 'Andante',
        'tempo.Moderato': 'Moderato',
        'tempo.Allegro': 'Allegro',
        'tempo.Vivace': 'Vivace',
        'tempo.Presto': 'Presto',

        // config tabs
        'tab.instruments': 'Instruments',
        'tab.moods': 'Moods',
        'tab.styles': 'Styles',
        'tab.composers': 'Composers',
        'tab.adjectives': 'Adjectives',
        'tab.pitch_usage_patterns': 'Pitch Usage Patterns',

        'beatmaker.title': 'Beat Maker',
        'measures': 'Measures',
        'subdivision': 'Subdivision',
        'measures_per_row': 'Measures / row',
        'generate_new_pattern': 'Generate New Pattern',
        'export_midi': 'Export MIDI',
        'cancel': 'Cancel',

        'lists.title': 'Lists Editor',
        'new_list_name_placeholder': 'New list name',
        'create_list': 'Create List',
        'one_item_per_line': 'One item per line for',
        'no_list_selected': 'No list selected',
        'save_btn': 'Save',
        'export_btn': 'Export',
        'import_btn': 'Import',
        'close': 'Close',
        'enter_valid_name': 'Enter a valid name for the new list',
        'already_exists': 'A list with that name already exists',
        'invalid_json': 'Invalid JSON file',

        'config.title': 'Configuration',
        'reset_confirm': 'Reset to default configuration?',
        'reset_to_defaults': 'Reset to Defaults',
        'add': 'Add',
        'composition_saved': 'Composition saved!',
    },
    es: {
        'composition_saved': '¡Composición guardada!',
        'app.title': 'GAIM',
        'app.subtitle': 'Generador Aleatorio de Ideas Musicales',
        'manage_lists': 'Administrar Listas (avanzado)',
        'generate_new': '✨ Generar Nuevo',
        'apply_changes': '⚙️ Aplicar Cambios',
        'reset_preferences': '↻ Volver al Inicio',
        'empty_state': 'Haga clic en "Generar Nuevo" para crear una idea de composición',

        'welcome.title': 'Bienvenido a GAIM',
        'welcome.subtitle': 'Seleccione qué parámetros deseas aleatorizar',
        'select_all': 'Seleccionar Todo',
        'clear_all': 'Limpiar Todo',
        'continue': 'Continuar',

        'composition.title': 'Idea de Composición',
        'beats': '🥁 Ritmos',
        'pitches_btn': '🔄 Tonos',
        'copy': '📋 Copiar',
        'copied': '✓ Copiado',
        'save': '💾 Guardar',

        'label.key': 'Tonalidad',
        'label.tempo': 'Tempo',
        'label.time_signature': 'Compás',
        'label.instrumentation': 'Instrumentación',
        'label.mood': 'Estado de ánimo',
        'label.style': 'Estilo',
        'label.composer': 'Inspiración de compositor',
        'label.adjective': 'Carácter',
        'label.pitches': 'Tonos',
        'label.pitch_usage': 'Usar como',
        'allow_repeats': 'Permitir repeticiones',
        'dodecafonic_notice': '✓ SERIE DODECAFÓNICA (las 12 notas)',

        'beatmaker.title': 'Creador de Ritmos',
        'measures': 'Compases',
        'subdivision': 'Subdivisión',
        'measures_per_row': 'Compases / fila',
        'generate_new_pattern': 'Generar Nuevo Patrón',
        'export_midi': 'Exportar MIDI',
        'cancel': 'Cancelar',

        'lists.title': 'Editor de Listas',
        'new_list_name_placeholder': 'Nombre de la nueva lista',
        'create_list': 'Crear Lista',
        'one_item_per_line': 'Un elemento por línea para',
        'no_list_selected': 'Ninguna lista seleccionada',
        'save_btn': 'Guardar',
        'export_btn': 'Exportar',
        'import_btn': 'Importar',
        'close': 'Cerrar',
        'enter_valid_name': 'Ingrese un nombre válido para la nueva lista',
        'already_exists': 'Ya existe una lista con ese nombre',
        'invalid_json': 'Archivo JSON inválido',

        'config.title': 'Configuración',
        'reset_confirm': '¿Restablecer a la configuración predeterminada?',
        'reset_to_defaults': 'Restablecer a predeterminados',
        'add': 'Agregar',
        'mode.Major': 'Mayor',
        'mode.Dorian': 'Dórico',
        'mode.Phrygian': 'Frigio',
        'mode.Lydian': 'Lidio',
        'mode.Mixolydian': 'Mixolidio',
        'mode.Minor': 'Menor',
        'mode.Locrian': 'Locrio',
        'mode.Harmonic Minor': 'Menor armónico',
        'mode.Melodic Minor': 'Menor melódico',

        'tempo.Grave': 'Grave',
        'tempo.Largo': 'Largo',
        'tempo.Lento': 'Lento',
        'tempo.Adagio': 'Adagio',
        'tempo.Andante': 'Andante',
        'tempo.Moderato': 'Moderato',
        'tempo.Allegro': 'Allegro',
        'tempo.Vivace': 'Vivace',
        'tempo.Presto': 'Presto',

        // config tabs
        'tab.instruments': 'Instrumentos',
        'tab.moods': 'Estados de ánimo',
        'tab.styles': 'Estilos',
        'tab.composers': 'Compositores',
        'tab.adjectives': 'Adjetivos',
        'tab.pitch_usage_patterns': 'Uso de tonos',
    }
}

type ContextType = {
    lang: Lang
    setLang: (l: Lang) => void
    t: (key: string) => string
    translateConfig: (cfg: any) => any
}

const LanguageContext = createContext<ContextType>({
    lang: 'en',
    setLang: () => { },
    t: (k: string) => k,
    translateConfig: (c: any) => c,
})

// Static translations for config arrays
const staticTranslations: Record<Lang, Partial<any>> = {
    en: {},
    es: {
        instruments: ['Piano', 'Cuerdas', 'Sintetizador', 'Guitarra', 'Batería', 'Metales', 'Vientos', 'Voz', 'Arpa', 'Percusión'],
        moods: ['Elevado', 'Melancólico', 'Enérgico', 'Calmado', 'Dramático', 'Juguetón', 'Oscuro', 'Misterioso', 'Alegre', 'Tenso', 'Nostálgico', 'Etéreo', 'Caótico', 'Sereno'],
        styles: ['Jazz', 'Rock', 'Blues', 'Folk', 'Mundo', 'Funk', 'Pop', 'Clásica', 'Electrónica', 'Ambiental'],
        composers: ['Bach', 'Mozart', 'Beethoven', 'Chopin', 'Debussy', 'Stravinsky', 'Miles Davis', 'John Coltrane', 'The Beatles', 'Joni Mitchell', 'Nina Simone', 'Herbie Hancock', 'Radiohead', 'Ludovico Einaudi'],
        adjectives: ['brillante', 'oscuro', 'cálido', 'frío', 'escaso', 'denso', 'áspero', 'suave', 'angular', 'fluido', 'embrujador', 'optimista', 'intenso', 'juguetón', 'misterioso', 'vidrioso', 'texturado', 'minimal', 'exuberante'],
        pitch_usage_patterns: ['Raíces de acordes', 'Línea de bajo', 'Melodía', 'Ostinato', 'Arpegio', 'Progresión armónica', 'Contramelodía', 'Tonos de dron']
    }
}

// Static translations for config arrays - includes base items that should be translated
const baseConfigItems: Record<string, string[]> = {
    instruments: ['Piano', 'Strings', 'Synth', 'Guitar', 'Drums', 'Brass', 'Winds', 'Vocals', 'Harp', 'Percussion'],
    moods: ['Uplifting', 'Melancholic', 'Energetic', 'Calm', 'Dramatic', 'Playful', 'Dark', 'Mysterious', 'Bright', 'Tense', 'Nostalgic', 'Ethereal', 'Chaotic', 'Serene'],
    styles: ['Jazz', 'Rock', 'Blues', 'Folk', 'World', 'Funk', 'Pop', 'Classical', 'Electronic', 'Ambient'],
    composers: ['Bach', 'Mozart', 'Beethoven', 'Chopin', 'Debussy', 'Stravinsky', 'Miles Davis', 'John Coltrane', 'The Beatles', 'Joni Mitchell', 'Nina Simone', 'Herbie Hancock', 'Radiohead', 'Ludovico Einaudi'],
    adjectives: ['bright', 'dark', 'warm', 'cold', 'sparse', 'dense', 'harsh', 'smooth', 'angular', 'flowing', 'haunting', 'uplifting', 'intense', 'playful', 'mysterious', 'glassy', 'textured', 'minimal', 'lush'],
    pitch_usage_patterns: ['Chord roots', 'Bass line', 'Melody', 'Ostinato', 'Arpeggio', 'Harmonic progression', 'Counter melody', 'Drone tones']
}

const translateConfigImpl = (cfg: any, lang: Lang) => {
    // If language is English, just return the config as-is
    if (lang === 'en') return cfg

    const translated = { ...cfg }
    const stat = staticTranslations[lang] || {}

    // For Spanish, merge static translations with user additions
    for (const k of Object.keys(stat)) {
        if (k in cfg && Array.isArray(cfg[k])) {
            const staticItems = (stat as any)[k] || []
            const userItems = cfg[k] || []
            const baseItems = baseConfigItems[k] || []

            // Start with static translations
            const merged = [...staticItems]

            // Add user items that aren't already in the base English items
            for (const userItem of userItems) {
                const isBaseItem = baseItems.includes(userItem)
                const alreadyIncluded = merged.includes(userItem)

                // If it's not a base item (so it's user-added) and not already included, add it
                if (!isBaseItem && !alreadyIncluded) {
                    merged.push(userItem)
                }
            }

            translated[k] = merged
        }
    }
    return translated
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const initial = ((): Lang => {
        try {
            const v = localStorage.getItem('lang')
            if (v === 'es' || v === 'en') return v
        } catch (e) { }
        return 'en'
    })()

    const [lang, setLangState] = useState<Lang>(initial)

    const setLang = (l: Lang) => {
        try { localStorage.setItem('lang', l) } catch (e) { }
        setLangState(l)
    }

    const t = (key: string) => {
        return translations[lang][key] ?? translations['en'][key] ?? key
    }

    const translateConfig = (cfg: any) => translateConfigImpl(cfg, lang)

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, translateConfig }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useTranslation = () => useContext(LanguageContext)

export default LanguageContext

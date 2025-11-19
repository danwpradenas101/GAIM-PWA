// Default configuration for GAIM
export interface GAIMConfig {
    time_signatures: string[]
    tempo_indications: Record<string, [number, number]>
    scale_modes: Record<string, string>
    instruments: string[]
    moods: string[]
    styles: string[]
    composers: string[]
    adjectives: string[]
    pitch_usage_patterns: string[]
}

export const DEFAULT_CONFIG: GAIMConfig = {
    time_signatures: ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'],

    tempo_indications: {
        'Grave': [40, 60],
        'Largo': [45, 60],
        'Lento': [50, 70],
        'Adagio': [60, 75],
        'Andante': [75, 105],
        'Moderato': [105, 120],
        'Allegro': [120, 140],
        'Vivace': [140, 160],
        'Presto': [160, 200],
    },

    scale_modes: {
        'Ionian': 'Major',
        'Dorian': 'Dorian',
        'Phrygian': 'Phrygian',
        'Lydian': 'Lydian',
        'Mixolydian': 'Mixolydian',
        'Aeolian': 'Minor',
        'Locrian': 'Locrian',
        'Harmonic Minor': 'Harmonic Minor',
        'Melodic Minor': 'Melodic Minor',
    },

    instruments: ['Piano', 'Strings', 'Synth', 'Guitar', 'Drums', 'Brass', 'Woodwinds', 'Voice', 'Harp', 'Percussion'],

    moods: ['Uplifting', 'Melancholic', 'Energetic', 'Calm', 'Dramatic', 'Playful', 'Dark',
        'Mysterious', 'Joyful', 'Tense', 'Nostalgic', 'Ethereal', 'Chaotic', 'Serene'],

    styles: ['Jazz', 'Rock', 'Blues', 'Folk', 'World', 'Funk', 'Pop', 'Classical', 'Electronic', 'Ambient'],

    composers: [
        'Bach', 'Mozart', 'Beethoven', 'Chopin', 'Debussy', 'Stravinsky',
        'Miles Davis', 'John Coltrane', 'The Beatles', 'Joni Mitchell',
        'Nina Simone', 'Herbie Hancock', 'Radiohead', 'Ludovico Einaudi'
    ],

    adjectives: [
        'bright', 'dark', 'warm', 'cold', 'sparse', 'dense', 'gritty', 'smooth',
        'angular', 'flowing', 'haunting', 'optimistic', 'brooding', 'playful',
        'mysterious', 'glassy', 'textured', 'minimal', 'lush'
    ],

    pitch_usage_patterns: [
        'Chord Roots',
        'Bass Line',
        'Melody',
        'Ostinato',
        'Arpeggio',
        'Harmonic Progression',
        'Countermelody',
        'Drone Tones',
    ],
}

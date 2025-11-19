import { DEFAULT_CONFIG, GAIMConfig } from './config'

const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_TO_MIDI: Record<string, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
}

export interface CompositionParams {
    key: string
    tempo: number
    time_signature: string
    instrumentation: string[]
    mood: string
    style: string
    composer: string
    adjective: string
    num_pitches: number
    allow_repeats: boolean
    pitch_usage: string
}

export interface CompositionIdea {
    params: CompositionParams
    pitches: string[]
    is_dodecafonic: boolean
    timestamp: number
}

export interface RhythmPattern {
    measures: number
    time_signature: string
    subdivision: 'quarter' | 'eighth' | 'sixteenth'
    use_triplets: boolean
    pattern_string: string
    pattern_matrix: number[][][]
    steps_per_measure: number
    target_beats: number
}

// Random selection helpers
export function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomSample<T>(arr: T[], k: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(k, arr.length))
}

// GAIM Core Functions
export function randomKey(config: GAIMConfig): string {
    const pitches = PITCH_CLASSES
    const modes = Object.values(config.scale_modes)
    return `${randomChoice(pitches)} ${randomChoice(modes)}`
}

export function randomTempo(config: GAIMConfig): number {
    const indications = Object.entries(config.tempo_indications)
    const [_, range] = randomChoice(indications)
    return randomInt(range[0], range[1])
}

export function randomTimeSignature(config: GAIMConfig): string {
    return randomChoice(config.time_signatures)
}

export function randomInstrumentation(config: GAIMConfig, count?: number): string[] {
    const n = count ?? randomInt(2, 4)
    return randomSample(config.instruments, n)
}

export function randomMood(config: GAIMConfig): string {
    return randomChoice(config.moods)
}

export function randomStyle(config: GAIMConfig): string {
    return randomChoice(config.styles)
}

export function randomComposer(config: GAIMConfig): string {
    return randomChoice(config.composers)
}

export function randomAdjective(config: GAIMConfig): string {
    return randomChoice(config.adjectives)
}

export function randomPitchUsage(config: GAIMConfig): string {
    return randomChoice(config.pitch_usage_patterns)
}

export function selectRandomPitches(
    num?: number,
    allowRepeats: boolean = false,
    _config: GAIMConfig = DEFAULT_CONFIG
): [number, string[]] {
    const pitches = PITCH_CLASSES
    let numNotes = num ?? randomInt(1, 12)

    if (numNotes < 1 || numNotes > 12) {
        numNotes = 8
    }

    if (numNotes === 12) {
        // Dodecafonic series: random permutation of all 12
        const shuffled = [...pitches].sort(() => Math.random() - 0.5)
        return [numNotes, shuffled]
    }

    if (allowRepeats) {
        const selected: string[] = []
        for (let i = 0; i < numNotes; i++) {
            selected.push(randomChoice(pitches))
        }
        return [numNotes, selected]
    } else {
        return [numNotes, randomSample(pitches, numNotes)]
    }
}

export function generateCompositionIdea(config: GAIMConfig): CompositionIdea {
    const [numPitches, pitches] = selectRandomPitches(undefined, false, config)

    const params: CompositionParams = {
        key: randomKey(config),
        tempo: randomTempo(config),
        time_signature: randomTimeSignature(config),
        instrumentation: randomInstrumentation(config),
        mood: randomMood(config),
        style: randomStyle(config),
        composer: randomComposer(config),
        adjective: randomAdjective(config),
        num_pitches: numPitches,
        allow_repeats: false,
        pitch_usage: randomPitchUsage(config),
    }

    return {
        params,
        pitches,
        is_dodecafonic: numPitches === 12 && !params.allow_repeats,
        timestamp: Date.now(),
    }
}

export function generateRhythmPattern(
    timeSignature: string = '4/4',
    measures: number = 2,
    subdivision: 'quarter' | 'eighth' | 'sixteenth' = 'sixteenth',
    useTriplets: boolean = false
): RhythmPattern {
    // Parse time signature
    const [numStr, denStr] = timeSignature.split('/')
    const num = parseInt(numStr)
    const den = parseInt(denStr)

    // Calculate quarters per measure
    const quartersPerMeasure = num * (4 / den)

    // Steps per quarter based on subdivision
    const stepsPerQuarter = { quarter: 1, eighth: 2, sixteenth: 4 }[subdivision]
    const stepsPerMeasure = quartersPerMeasure * stepsPerQuarter
    const totalBaseSteps = stepsPerMeasure * measures

    // Target beats between 1/2 and 2/3 of base steps
    const low = Math.max(1, Math.floor(totalBaseSteps / 2))
    const high = Math.max(low, Math.floor(totalBaseSteps * 2 / 3))
    const targetBeats = randomInt(low, high)

    // Build pattern matrix
    const patternMatrix: number[][][] = []
    const tripletIndices: [number, number][] = []

    for (let m = 0; m < measures; m++) {
        const measureGroups: number[][] = []
        for (let q = 0; q < quartersPerMeasure; q++) {
            const isTrip = useTriplets && Math.random() < 0.35
            if (isTrip) {
                measureGroups.push([0, 0, 0])
                tripletIndices.push([m, measureGroups.length - 1])
            } else {
                measureGroups.push(Array(stepsPerQuarter).fill(0))
            }
        }
        patternMatrix.push(measureGroups)
    }

    // Ensure triplet groups don't exceed target beats
    let reserved = tripletIndices.length
    if (reserved > targetBeats) {
        const toClear = reserved - targetBeats
        tripletIndices.sort(() => Math.random() - 0.5)
        for (let i = 0; i < toClear; i++) {
            const [mIdx, gIdx] = tripletIndices[i]
            patternMatrix[mIdx][gIdx] = Array(stepsPerQuarter).fill(0)
        }
        tripletIndices.splice(0, toClear)
        reserved = tripletIndices.length
    }

    // Reserve one beat in each triplet
    for (const [mIdx, gIdx] of tripletIndices) {
        const grp = patternMatrix[mIdx][gIdx]
        const pos = randomInt(0, grp.length - 1)
        grp[pos] = 1
    }

    let remaining = targetBeats - reserved

    // Flatten available positions
    const avail: [number, number, number][] = []
    for (let m = 0; m < patternMatrix.length; m++) {
        for (let g = 0; g < patternMatrix[m].length; g++) {
            for (let p = 0; p < patternMatrix[m][g].length; p++) {
                if (patternMatrix[m][g][p] === 0) {
                    avail.push([m, g, p])
                }
            }
        }
    }

    remaining = Math.min(remaining, avail.length)

    // Choose random positions
    const chosen = avail.sort(() => Math.random() - 0.5).slice(0, remaining)
    for (const [mIdx, gIdx, pIdx] of chosen) {
        patternMatrix[mIdx][gIdx][pIdx] = 1
    }

    // Build pattern string
    const measureStrs: string[] = []
    for (const measure of patternMatrix) {
        const parts: string[] = []
        for (const grp of measure) {
            parts.push(grp.map(v => v ? '1' : '0').join(''))
        }
        measureStrs.push(parts.join(' '))
    }

    const patternString = '|| ' + measureStrs.join(' | ') + ' ||'

    return {
        measures,
        time_signature: timeSignature,
        subdivision,
        use_triplets: useTriplets,
        pattern_string: patternString,
        pattern_matrix: patternMatrix,
        steps_per_measure: stepsPerMeasure,
        target_beats: targetBeats,
    }
}

export function exportPatternToMIDI(
    pattern: RhythmPattern,
    keyRoot: string = 'C',
    _tempo: number = 120
): Uint8Array {
    // Minimal placeholder MIDI exporter: returns an empty buffer for now.
    // A full MIDI generation implementation can be added later.
    void pattern
    void keyRoot
    void _tempo
    void NOTE_TO_MIDI
    return new Uint8Array()
}

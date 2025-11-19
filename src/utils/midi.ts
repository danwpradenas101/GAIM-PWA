export function exportToMIDI(
    pattern: any,
    keyRoot: string = 'C',
    tempo: number = 120
): Blob {
    // MIDI file structure
    const header = createMIDIHeader()
    const track = createMIDITrack(pattern, keyRoot, tempo)

    // Combine header and track
    const midi = new Uint8Array(header.length + track.length)
    midi.set(header, 0)
    midi.set(track, header.length)

    return new Blob([midi], { type: 'audio/midi' })
}

function createMIDIHeader(): Uint8Array {
    // MThd chunk
    const header = new Uint8Array(14)

    // Chunk type: "MThd"
    header[0] = 0x4D // M
    header[1] = 0x54 // T
    header[2] = 0x68 // h
    header[3] = 0x64 // d

    // Chunk length: 6
    header[4] = 0x00
    header[5] = 0x00
    header[6] = 0x00
    header[7] = 0x06

    // Format type: 0 (single track)
    header[8] = 0x00
    header[9] = 0x00

    // Number of tracks: 1
    header[10] = 0x00
    header[11] = 0x01

    // Division: 480 ticks per quarter note
    header[12] = 0x01
    header[13] = 0xE0

    return header
}

function createMIDITrack(pattern: any, _keyRoot: string, tempo: number): Uint8Array {
    const events: number[] = []

    // Track type "MTrk"
    const trackType = [0x4D, 0x54, 0x72, 0x6B] // "MTrk"

    // Tempo meta event
    const tempoValue = Math.round(60000000 / tempo)
    const tempoEvent = [
        0x00, // delta time
        0xFF, 0x51, 0x03, // meta event, set tempo
        (tempoValue >> 16) & 0xFF,
        (tempoValue >> 8) & 0xFF,
        tempoValue & 0xFF
    ]

    events.push(...trackType)
    events.push(...encodeVariableLength(tempoEvent.length)) // placeholder for length
    events.push(...tempoEvent)

    // Note events (simplified)
    const tpq = 480 // ticks per quarter
    let currentTime = 0

    for (const measure of pattern.pattern_matrix ?? []) {
        for (const group of measure) {
            const groupDuration = tpq // quarter note
            const unitDuration = groupDuration / group.length

            for (const val of group) {
                if (val) {
                    // Note on
                    events.push(...encodeVariableLength(0)) // delta time
                    events.push(0x90, 60, 0x64) // channel 0, note 60 (C4), velocity 100

                    // Note off
                    events.push(...encodeVariableLength(Math.floor(unitDuration * 0.9)))
                    events.push(0x80, 60, 0x40) // channel 0, note 60, velocity 64
                }
                currentTime += unitDuration
            }
        }
    }

    // End of track
    const eotEvent = [0x00, 0xFF, 0x2F, 0x00]
    events.push(...eotEvent)

    return new Uint8Array(events)
}

function encodeVariableLength(value: number): number[] {
    const bytes: number[] = []
    let val = value & 0x7F
    bytes.push(val)

    while (value > 0x7F) {
        value >>= 7
        val = value & 0x7F
        bytes.unshift(val | 0x80)
    }

    return bytes
}

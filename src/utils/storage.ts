import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { CompositionIdea, RhythmPattern } from './gaim'
import { DEFAULT_CONFIG, GAIMConfig } from './config'

interface GAIMStore extends DBSchema {
    compositions: {
        key: number
        value: CompositionIdea
    }
    rhythms: {
        key: number
        value: RhythmPattern & { timestamp: number }
    }
    config: {
        key: string
        value: GAIMConfig
    }
    preferences: {
        key: string
        value: unknown
    }
}

let db: IDBPDatabase<GAIMStore> | null = null

async function getDB(): Promise<IDBPDatabase<GAIMStore>> {
    if (db) return db

    db = await openDB<GAIMStore>('gaim', 1, {
        upgrade(db) {
            // Create compositions store
            if (!db.objectStoreNames.contains('compositions')) {
                db.createObjectStore('compositions', { keyPath: 'timestamp' })
            }
            // Create rhythms store
            if (!db.objectStoreNames.contains('rhythms')) {
                db.createObjectStore('rhythms', { keyPath: 'timestamp' })
            }
            // Create config store
            if (!db.objectStoreNames.contains('config')) {
                db.createObjectStore('config')
            }
            // Create preferences store
            if (!db.objectStoreNames.contains('preferences')) {
                db.createObjectStore('preferences')
            }
        },
    })

    return db
}

export async function saveComposition(idea: CompositionIdea): Promise<void> {
    const database = await getDB()
    await database.put('compositions', idea)
}

export async function getCompositions(limit: number = 50): Promise<CompositionIdea[]> {
    const database = await getDB()
    const all = await database.getAll('compositions')
    return all.reverse().slice(0, limit)
}

export async function deleteComposition(timestamp: number): Promise<void> {
    const database = await getDB()
    await database.delete('compositions', timestamp)
}

export async function saveRhythm(pattern: RhythmPattern & { timestamp: number }): Promise<void> {
    const database = await getDB()
    await database.put('rhythms', pattern)
}

export async function getRhythms(limit: number = 50): Promise<Array<RhythmPattern & { timestamp: number }>> {
    const database = await getDB()
    const all = await database.getAll('rhythms')
    return all.reverse().slice(0, limit)
}

export async function saveConfig(config: GAIMConfig): Promise<void> {
    const database = await getDB()
    await database.put('config', config, 'current')
}

export async function getConfig(): Promise<GAIMConfig> {
    const database = await getDB()
    const config = await database.get('config', 'current')
    return config ?? DEFAULT_CONFIG
}

export async function setPreference(key: string, value: unknown): Promise<void> {
    const database = await getDB()
    await database.put('preferences', value, key)
}

export async function getPreference(key: string): Promise<unknown> {
    const database = await getDB()
    return await database.get('preferences', key)
}

export async function deleteAllCompositions(): Promise<void> {
    const database = await getDB()
    await database.clear('compositions')
}

export async function deleteAllRhythms(): Promise<void> {
    const database = await getDB()
    await database.clear('rhythms')
}

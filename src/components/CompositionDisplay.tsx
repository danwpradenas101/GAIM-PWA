import React, { useState } from 'react'
import { CompositionParams } from '../utils/gaim'
import styles from './CompositionDisplay.module.css'
import { useTranslation } from '../i18n'

interface CompositionDisplayProps {
    params: CompositionParams
    pitches: string[]
    isDodecafonic: boolean
    selected?: Record<string, boolean>
    onRegeneratePitches: () => void
    onCopy: () => void
    onSave: () => void
    onOpenBeats: () => void
}

export const CompositionDisplay: React.FC<CompositionDisplayProps> = ({
    params,
    pitches,
    isDodecafonic,
    selected,
    onRegeneratePitches,
    onCopy,
    onSave,
    onOpenBeats,
}) => {
    const [copied, setCopied] = useState(false)
    const { t } = useTranslation()

    const handleCopy = () => {
        onCopy()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Helper to check if a parameter should be shown
    const shouldShow = (key: string) => {
        if (!selected || Object.keys(selected).length === 0) return true
        return !!selected[key]
    }

    // Build output based on selected parameters
    const outputLines: string[] = []
    if (shouldShow('key')) outputLines.push(`${t('label.key')}: ${params.key}`)
    if (shouldShow('tempo')) outputLines.push(`${t('label.tempo')}: ${params.tempo} BPM`)
    if (shouldShow('time_signature')) outputLines.push(`${t('label.time_signature')}: ${params.time_signature}`)
    if (shouldShow('instrumentation')) outputLines.push(`${t('label.instrumentation')}: ${params.instrumentation.join(', ')}`)
    if (shouldShow('mood')) outputLines.push(`${t('label.mood')}: ${params.mood}`)
    if (shouldShow('style')) outputLines.push(`${t('label.style')}: ${params.style}`)
    if (shouldShow('composer')) outputLines.push(`${t('label.composer')}: ${params.composer}`)
    if (shouldShow('adjective')) outputLines.push(`${t('label.adjective')}: ${params.adjective}`)

    if (shouldShow('pitches')) {
        outputLines.push('')
        outputLines.push(`${t('label.pitches')} (${params.num_pitches} selected):`)
        outputLines.push(`  ${pitches.join(', ')}`)
    }

    if (shouldShow('pitch_usage')) outputLines.push(`\n${t('label.pitch_usage')}: ${params.pitch_usage}`)

    if (isDodecafonic && shouldShow('pitches')) {
        outputLines.push('\n' + t('dodecafonic_notice'))
    }

    const output = outputLines.join('\n')

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t('composition.title')}</h2>
                <div className={styles.buttons}>
                    <button onClick={onOpenBeats} className={styles.beatBtn} title={t('beats')}>
                        {t('beats')}
                    </button>
                    <button onClick={onRegeneratePitches} className={styles.regenerateBtn} title={t('pitches_btn')}>
                        {t('pitches_btn')}
                    </button>
                    <button onClick={handleCopy} className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}>
                        {copied ? t('copied') : t('copy')}
                    </button>
                    <button onClick={onSave} className={styles.saveBtn}>
                        {t('save')}
                    </button>
                </div>
            </div>

            <pre className={styles.output}>{output}</pre>
        </div>
    )
}

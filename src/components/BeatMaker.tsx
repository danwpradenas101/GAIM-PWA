import React, { useEffect, useState } from 'react'
import { useTranslation } from '../i18n'
import { RhythmPattern, generateRhythmPattern } from '../utils/gaim'
import styles from './BeatMaker.module.css'

interface BeatMakerProps {
    pattern: RhythmPattern
    onClose: () => void
    onExport: (pattern: RhythmPattern) => void
}

export const BeatMaker: React.FC<BeatMakerProps> = ({ pattern, onClose, onExport }) => {
    const [beats, setBeats] = useState(pattern.pattern_matrix)
    const [measuresCount, setMeasuresCount] = useState<number>(pattern.measures)
    const [subdivision, setSubdivision] = useState<RhythmPattern['subdivision']>(pattern.subdivision)
    const [measuresPerRow, setMeasuresPerRow] = useState<number>(4)

    const handleBeatToggle = (measureIdx: number, groupIdx: number, stepIdx: number) => {
        const newBeats = JSON.parse(JSON.stringify(beats))
        newBeats[measureIdx][groupIdx][stepIdx] = newBeats[measureIdx][groupIdx][stepIdx] ? 0 : 1
        setBeats(newBeats)
    }

    const handleExport = () => {
        const updatedPattern: RhythmPattern = {
            ...pattern,
            pattern_matrix: beats,
        }
        onExport(updatedPattern)
    }

    const handleGenerateNew = () => {
        const newPattern = generateRhythmPattern(pattern.time_signature, measuresCount, subdivision, pattern.use_triplets)
        setBeats(newPattern.pattern_matrix)
    }

    const { t } = useTranslation()

    // time_signature parsed when generating patterns as needed

    useEffect(() => {
        // Regenerate internal beats when measures or subdivision change
        const newPattern = generateRhythmPattern(pattern.time_signature, measuresCount, subdivision, pattern.use_triplets)
        setBeats(newPattern.pattern_matrix)
    }, [measuresCount, subdivision, pattern.time_signature, pattern.use_triplets])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t('beatmaker.title')}</h2>
                <div className={styles.info}>
                    <span>{pattern.measures} {t('measures')} × {pattern.time_signature}</span>
                    <span className={styles.subdivision}>{pattern.subdivision}</span>
                    {pattern.use_triplets && <span className={styles.triplets}>Triplets</span>}
                </div>
                <button onClick={onClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.controlsRow}>
                <label>
                    {t('measures')}:
                    <input type="number" min={1} max={16} value={measuresCount} onChange={(e) => setMeasuresCount(Math.max(1, Math.min(16, parseInt(e.target.value) || 1)))} className={styles.smallNumber} />
                </label>

                <label>
                    {t('subdivision')}:
                    <select value={subdivision} onChange={(e) => setSubdivision(e.target.value as any)} className={styles.smallSelect}>
                        <option value="quarter">Quarter</option>
                        <option value="eighth">Eighth</option>
                        <option value="sixteenth">Sixteenth</option>
                    </select>
                </label>

                <label>
                    {t('measures_per_row')}:
                    <select value={measuresPerRow} onChange={(e) => setMeasuresPerRow(parseInt(e.target.value))} className={styles.smallSelect}>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </label>
            </div>

            <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${measuresPerRow}, 1fr)` }}>
                {beats.map((measure, mIdx) => (
                    <div key={mIdx} className={styles.measure}>
                        <div className={styles.measureLabel}>Measure {mIdx + 1}</div>
                        <div className={styles.beats}>
                            {measure.map((group, gIdx) => (
                                <div key={`${mIdx}-${gIdx}`} className={styles.group}>
                                    <div className={styles.beatRow}>
                                        {group.map((step, sIdx) => (
                                            <button
                                                key={`${mIdx}-${gIdx}-${sIdx}`}
                                                className={`${styles.beat} ${step ? styles.active : ''}`}
                                                onClick={() => handleBeatToggle(mIdx, gIdx, sIdx)}
                                                title={`Beat ${gIdx + 1}, Step ${sIdx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button onClick={onClose} className={styles.cancelBtn}>{t('cancel')}</button>
                <button onClick={handleGenerateNew} className={styles.generateBtn}>{t('generate_new_pattern')}</button>
                <button onClick={handleExport} className={styles.exportBtn}>{t('export_midi')}</button>
            </div>
        </div>
    )
}

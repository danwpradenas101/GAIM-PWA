import React from 'react'
import { useTranslation } from '../i18n'
import { CompositionParams } from '../utils/gaim'
import { GAIMConfig } from '../utils/config'
import styles from './ParametersPanel.module.css'

interface ParametersPanelProps {
    params: CompositionParams
    config: GAIMConfig
    selected?: Record<string, boolean>
    onChange: (params: Partial<CompositionParams>) => void
    onOpenConfig: () => void
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({
    params,
    config,
    selected,
    onChange,
    onOpenConfig,
}) => {
    const { t } = useTranslation()
    // Helper to decide whether to show a control: if `selected` is empty, show all.
    const shouldShow = (key: string) => {
        if (!selected || Object.keys(selected).length === 0) return true
        return !!selected[key]
    }

    // Always show parameters (no collapsing) and make content scrollable
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {shouldShow('key') && (
                    <div className={styles.group}>
                        <label>{t('label.key')}</label>
                        <select
                            value={params.key}
                            onChange={(e) => onChange({ key: e.target.value })}
                            className={styles.select}
                        >
                            {config.scale_modes && Object.keys(config.scale_modes).length > 0 && (
                                ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((pitch) =>
                                    Object.values(config.scale_modes).map((mode) => (
                                        <option key={`${pitch}-${mode}`} value={`${pitch} ${mode}`}>
                                            {pitch} {(t(`mode.${mode}`) !== `mode.${mode}`) ? t(`mode.${mode}`) : mode}
                                        </option>
                                    ))
                                )
                            )}
                        </select>
                    </div>
                )}

                {shouldShow('tempo') && (
                    <div className={styles.group}>
                        <label>{t('label.tempo')} (BPM)</label>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="40"
                                max="200"
                                value={params.tempo}
                                onChange={(e) => onChange({ tempo: parseInt(e.target.value) })}
                                className={styles.slider}
                            />
                            <span className={styles.value}>{params.tempo}</span>
                        </div>
                    </div>
                )}

                {shouldShow('time_signature') && (
                    <div className={styles.group}>
                        <label>{t('label.time_signature')}</label>
                        <select
                            value={params.time_signature}
                            onChange={(e) => onChange({ time_signature: e.target.value })}
                            className={styles.select}
                        >
                            {config.time_signatures?.map((ts) => (
                                <option key={ts} value={ts}>{ts}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('mood') && (
                    <div className={styles.group}>
                        <label>{t('label.mood')}</label>
                        <select
                            value={params.mood}
                            onChange={(e) => onChange({ mood: e.target.value })}
                            className={styles.select}
                        >
                            {config.moods?.map((mood) => (
                                <option key={mood} value={mood}>{mood}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('style') && (
                    <div className={styles.group}>
                        <label>{t('label.style')}</label>
                        <select
                            value={params.style}
                            onChange={(e) => onChange({ style: e.target.value })}
                            className={styles.select}
                        >
                            {config.styles?.map((style) => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('instrumentation') && (
                    <div className={styles.group}>
                        <label>{t('label.instrumentation')}</label>
                        <div className={styles.multiSelect}>
                            {config.instruments?.map((inst) => (
                                <label key={inst} className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={params.instrumentation.includes(inst)}
                                        onChange={(e) => {
                                            const updated = e.target.checked
                                                ? [...params.instrumentation, inst]
                                                : params.instrumentation.filter(i => i !== inst)
                                            onChange({ instrumentation: updated })
                                        }}
                                    />
                                    <span>{inst}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {shouldShow('composer') && (
                    <div className={styles.group}>
                        <label>{t('label.composer')}</label>
                        <select
                            value={params.composer}
                            onChange={(e) => onChange({ composer: e.target.value })}
                            className={styles.select}
                        >
                            {config.composers?.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('adjective') && (
                    <div className={styles.group}>
                        <label>{t('label.adjective')}</label>
                        <select
                            value={params.adjective}
                            onChange={(e) => onChange({ adjective: e.target.value })}
                            className={styles.select}
                        >
                            {config.adjectives?.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('pitch_usage') && (
                    <div className={styles.group}>
                        <label>{t('label.pitch_usage')}</label>
                        <select
                            value={params.pitch_usage}
                            onChange={(e) => onChange({ pitch_usage: e.target.value })}
                            className={styles.select}
                        >
                            {config.pitch_usage_patterns?.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                )}

                {shouldShow('pitches') && (
                    <div className={styles.group}>
                        <label>{t('label.pitches')}</label>
                        <div className={styles.pitchControls}>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={params.num_pitches}
                                onChange={(e) => onChange({ num_pitches: parseInt(e.target.value) })}
                                className={styles.numberInput}
                            />
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={params.allow_repeats}
                                    onChange={(e) => onChange({ allow_repeats: e.target.checked })}
                                />
                                <span>{t('allow_repeats')}</span>
                            </label>
                        </div>
                    </div>
                )}

                <button onClick={onOpenConfig} className={styles.configBtn}>
                    ⚙️ {t('manage_lists')}
                </button>
            </div>
        </div>
    )
}

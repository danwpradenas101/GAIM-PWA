import React, { useState } from 'react'
import { GAIMConfig } from '../utils/config'
import styles from './ParameterSelector.module.css'
import { useTranslation } from '../i18n'

interface ParameterSelectorProps {
    config: GAIMConfig
    onSelect: (selected: Record<string, boolean>) => void
    onNext: () => void
}

export const ParameterSelector: React.FC<ParameterSelectorProps> = ({ config: _config, onSelect, onNext }) => {
    const { t } = useTranslation()
    const [selected, setSelected] = useState<Record<string, boolean>>({
        key: true,
        tempo: true,
        time_signature: true,
        instrumentation: true,
        mood: true,
        pitches: true,
        style: true,
        composer: true,
        adjective: true,
        pitch_usage: true,
    })

    const handleToggle = (key: string) => {
        const updated = { ...selected, [key]: !selected[key] }
        setSelected(updated)
        onSelect(updated)
    }

    const handleSelectAll = () => {
        const allSelected = Object.keys(selected).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        setSelected(allSelected)
        onSelect(allSelected)
    }

    const handleClearAll = () => {
        const allCleared = Object.keys(selected).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        setSelected(allCleared)
        onSelect(allCleared)
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.langRow}>
                    <LanguageChooser />
                </div>
                <h1>{t('welcome.title')}</h1>
                <p className={styles.subtitle}>{t('welcome.subtitle')}</p>

                <div className={styles.grid}>
                    {Object.entries(selected).map(([key, value]) => (
                        <label key={key} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => handleToggle(key)}
                            />
                            <span className={styles.label}>
                                {t(`label.${key}`) !== `label.${key}` ? t(`label.${key}`) : key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                        </label>
                    ))}
                </div>

                <div className={styles.buttonGroup}>
                    <button onClick={handleSelectAll} className={styles.secondaryBtn}>
                        {t('select_all')}
                    </button>
                    <button onClick={handleClearAll} className={styles.secondaryBtn}>
                        {t('clear_all')}
                    </button>
                </div>

                <button
                    onClick={onNext}
                    className={styles.button}
                >
                    {t('continue')}
                </button>
            </div>
        </div>
    )
}

const LanguageChooser: React.FC = () => {
    const { lang, setLang } = useTranslation()
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12 }}>Lang:</span>
            <button onClick={() => setLang('en')} style={{ opacity: lang === 'en' ? 1 : 0.6 }}>EN</button>
            <button onClick={() => setLang('es')} style={{ opacity: lang === 'es' ? 1 : 0.6 }}>ES</button>
        </div>
    )
}


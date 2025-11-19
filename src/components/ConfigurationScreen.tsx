import React, { useState } from 'react'
import { useTranslation } from '../i18n'
import { GAIMConfig, DEFAULT_CONFIG } from '../utils/config'
import styles from './ConfigurationScreen.module.css'

interface ConfigurationScreenProps {
    config: GAIMConfig
    onSave: (config: GAIMConfig) => void
    onClose: () => void
}

export const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
    config,
    onSave,
    onClose,
}) => {
    const { t } = useTranslation()
    const [currentConfig, setCurrentConfig] = useState<GAIMConfig>(config)
    const [activeTab, setActiveTab] = useState<keyof GAIMConfig>('instruments')
    const [newValue, setNewValue] = useState('')

    const handleAddValue = () => {
        if (!newValue.trim()) return

        const key = activeTab
        const current = currentConfig[key]

        if (Array.isArray(current) && !current.includes(newValue)) {
            const updated = [...current, newValue]
            setCurrentConfig({ ...currentConfig, [key]: updated })
            setNewValue('')
        }
    }

    const handleRemoveValue = (key: keyof GAIMConfig, value: string) => {
        const current = currentConfig[key]
        if (Array.isArray(current)) {
            const updated = current.filter(v => v !== value)
            setCurrentConfig({ ...currentConfig, [key]: updated })
        }
    }

    const handleReset = () => {
        if (confirm(t('reset_confirm'))) {
            setCurrentConfig(DEFAULT_CONFIG)
        }
    }

    const renderEditableList = (key: keyof GAIMConfig) => {
        const value = currentConfig[key]
        if (!Array.isArray(value)) return null

        return (
            <div className={styles.listEditor}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                        placeholder={`Add new ${key.replace(/_/g, ' ')}`}
                        className={styles.input}
                    />
                    <button onClick={handleAddValue} className={styles.addBtn}>{t('add')}</button>
                </div>

                <div className={styles.items}>
                    {value.map((item, idx) => (
                        <div key={idx} className={styles.item}>
                            <span>{item}</span>
                            <button
                                onClick={() => handleRemoveValue(key, item)}
                                className={styles.removeBtn}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t('manage_lists')}</h2>
                <button onClick={onClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.tabs}>
                {(['instruments', 'moods', 'styles', 'composers', 'adjectives', 'pitch_usage_patterns'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                    >
                        {t(`tab.${tab}`) ?? tab.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                {renderEditableList(activeTab)}
            </div>

            <div className={styles.footer}>
                <button onClick={handleReset} className={styles.resetBtn}>{t('reset_to_defaults')}</button>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelBtn}>{t('cancel')}</button>
                    <button onClick={() => { onSave(currentConfig); onClose(); }} className={styles.saveBtn}>{t('save_btn')}</button>
                </div>
            </div>
        </div>
    )
}

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n'
import { GAIMConfig } from '../utils/config'
import styles from './ListsEditor.module.css'

interface ListsEditorProps {
    config: GAIMConfig
    onSave: (config: GAIMConfig) => void
    onClose: () => void
}

export const ListsEditor: React.FC<ListsEditorProps> = ({ config, onSave, onClose }) => {
    const { t } = useTranslation()
    const [currentConfig, setCurrentConfig] = useState<GAIMConfig>(config)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Discover keys dynamically where the value is an array
    const arrayKeys = useMemo(() => Object.keys(currentConfig).filter(k => Array.isArray((currentConfig as any)[k])), [currentConfig])

    const [activeKey, setActiveKey] = useState<string>(arrayKeys[0] || '')
    const [textValue, setTextValue] = useState<string>('')
    const [newListName, setNewListName] = useState<string>('')

    useEffect(() => {
        if (!activeKey && arrayKeys.length > 0) setActiveKey(arrayKeys[0])
    }, [arrayKeys, activeKey])

    useEffect(() => {
        if (activeKey) {
            const arr = (currentConfig as any)[activeKey] || []
            setTextValue(Array.isArray(arr) ? arr.join('\n') : '')
        }
    }, [activeKey, currentConfig])

    const switchKey = (key: string) => {
        setActiveKey(key)
    }

    const handleSaveList = () => {
        if (!activeKey) return
        const arr = textValue.split('\n').map(s => s.trim()).filter(Boolean)
        const updated = { ...(currentConfig as any), [activeKey]: arr }
        setCurrentConfig(updated)
        onSave(updated)
    }

    const handleExport = () => {
        if (!activeKey) return
        const data = { [activeKey]: (currentConfig as any)[activeKey] }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeKey}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        const reader = new FileReader()
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result))
                const values = (parsed as any)[activeKey] || Object.values(parsed)[0]
                if (Array.isArray(values)) {
                    const updated = { ...(currentConfig as any), [activeKey]: values }
                    setCurrentConfig(updated)
                    onSave(updated)
                }
            } catch (err) {
                alert(t('invalid_json'))
            }
        }
        reader.readAsText(f)
        e.currentTarget.value = ''
    }

    const handleCreateList = () => {
        const name = newListName.trim()
        if (!name) return alert(t('enter_valid_name'))
        if ((currentConfig as any)[name]) return alert(t('already_exists'))
        const updated = { ...(currentConfig as any), [name]: [] }
        setCurrentConfig(updated)
        onSave(updated)
        setNewListName('')
        setActiveKey(name)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t('lists.title')}</h2>
                <button onClick={onClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <div className={styles.newListForm}>
                        <input value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder={t('new_list_name_placeholder')} className={styles.newListInput} />
                        <button onClick={handleCreateList} className={styles.createListBtn}>{t('create_list')}</button>
                    </div>
                    {arrayKeys.map((k) => (
                        <button
                            key={k}
                            className={`${styles.listBtn} ${activeKey === k ? styles.active : ''}`}
                            onClick={() => switchKey(k)}
                        >
                            {k.replace(/_/g, ' ')}
                        </button>
                    ))}
                </aside>

                <section className={styles.editorArea}>
                    <textarea
                        className={styles.textarea}
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder={activeKey ? `${t('one_item_per_line')} ${activeKey}` : t('no_list_selected')}
                    />

                    <div className={styles.actions}>
                        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFile} style={{ display: 'none' }} />
                        <button onClick={handleSaveList} className={styles.saveBtn}>{t('save_btn')}</button>
                        <button onClick={handleExport} className={styles.exportBtn}>{t('export_btn')}</button>
                        <button onClick={handleImportClick} className={styles.importBtn}>{t('import_btn')}</button>
                        <button onClick={onClose} className={styles.cancelBtn}>{t('close')}</button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ListsEditor

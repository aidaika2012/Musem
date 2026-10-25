import { useApp } from '../context/AppContext'
import translations from './translations'

/**
 * useTranslation()
 * Returns:
 *   t(key)            — translates a key from translations.js
 *   localize(item)    — merges item.i18n[lang] over item, returns localized copy
 *   language          — current language string ('EN' | 'KG' | 'RU' | 'ZH')
 */
export function useTranslation() {
  const { language } = useApp()

  const t = (key) => {
    const lang = translations[language] || translations['EN']
    return lang[key] ?? translations['EN'][key] ?? key
  }

  /**
   * localize(item)
   * Takes a data object that has an optional `i18n` field like:
   *   { title: 'EN title', i18n: { KG: { title: 'KG title' }, RU: {...} } }
   * Returns a new object with i18n[language] fields merged on top.
   * Falls back to the base (EN) fields if no translation exists.
   */
  const localize = (item) => {
    if (!item) return item
    if (language === 'EN' || !item.i18n || !item.i18n[language]) return item
    return { ...item, ...item.i18n[language] }
  }

  return { t, localize, language }
}

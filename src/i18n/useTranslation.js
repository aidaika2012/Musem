import { useApp } from '../context/AppContext'
import translations from './translations'

/**
 * useTranslation()
 * Returns t(key) function that looks up the current language.
 * Falls back to EN if key is missing in selected language.
 */
export function useTranslation() {
  const { language } = useApp()

  const t = (key) => {
    const lang = translations[language] || translations['EN']
    return lang[key] ?? translations['EN'][key] ?? key
  }

  return { t, language }
}
 
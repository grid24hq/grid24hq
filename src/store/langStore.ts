import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'

type Language = 'nl' | 'en'

interface LangState {
  language:   Language
  setLanguage: (lang: Language) => void
  toggle:     () => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      language: 'nl',

      setLanguage: (language) => {
        i18n.changeLanguage(language)
        set({ language })
      },

      toggle: () => {
        const next = get().language === 'nl' ? 'en' : 'nl'
        i18n.changeLanguage(next)
        set({ language: next })
      },
    }),
    { name: 'grid24hq-lang' },
  ),
)
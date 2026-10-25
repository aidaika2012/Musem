import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'
import { artworks as initialArtworks } from '../data/artworks'
import { exhibitions as initialExhibitions } from '../data/exhibitions'
import {
  fetchBookings,
  fetchExhibitions,
  createBooking,
  createExhibition,
  updateExhibition as saveExhibition,
  removeExhibition,
  removeBooking,
} from '../services/apiService'

const AppContext = createContext(null)
const SUPPORTED_LANGUAGES = ['EN', 'KG', 'RU', 'ZH']
const ADMIN_SESSION_KEY = 'museum-admin-session'
const ADMIN_CREDENTIAL = Object.freeze({
  email: 'admin@musem.kg',
  password: 'admin-musem-26',
})
const ADMIN_EMAILS = [ADMIN_CREDENTIAL.email, 'diana@gmail.com']

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = window.localStorage.getItem('museum-language')
      return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : 'EN'
    } catch {
      return 'EN'
    }
  })
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('museum-theme')
      return savedTheme === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const [bookings, setBookings] = useState([])

  const [adminExhibitions, setAdminExhibitions] = useState([])
  const [museumDataLoading, setMuseumDataLoading] = useState(true)
  const [adminArtworks, setAdminArtworks] = useState(initialArtworks)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem('museum-theme', theme)
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem('museum-language', language)
    } catch {
      return
    }
  }, [language])

  useEffect(() => {
    let active = true
    Promise.allSettled([fetchBookings(), fetchExhibitions()])
      .then(([bookingsResult, exhibitionsResult]) => {
        if (!active) return

        if (bookingsResult.status === 'fulfilled') {
          setBookings(bookingsResult.value)
        } else {
          console.error('Could not load bookings from MockAPI:', bookingsResult.reason)
        }

        if (exhibitionsResult.status === 'fulfilled') {
          setAdminExhibitions(exhibitionsResult.value.map(serverExhibition => {
            const localExhibition = initialExhibitions.find(item => item.title === serverExhibition.title)
            if (!localExhibition?.i18n) return serverExhibition

            const locales = new Set([
              ...Object.keys(localExhibition.i18n),
              ...Object.keys(serverExhibition.i18n || {}),
            ])

            const i18n = Object.fromEntries([...locales].map(locale => [
              locale,
              { ...localExhibition.i18n[locale], ...serverExhibition.i18n?.[locale] },
            ]))

            return { ...serverExhibition, i18n }
          }))
        } else {
          console.error('Could not load exhibitions from MockAPI:', exhibitionsResult.reason)
        }
      })
      .finally(() => {
        if (active) setMuseumDataLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const role = ADMIN_EMAILS.includes(firebaseUser.email) ? 'admin' : 'user'
        const nextUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role,
        }

        setUser(nextUser)

        if (role === 'admin') {
          window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextUser))
        } else {
          window.localStorage.removeItem(ADMIN_SESSION_KEY)
        }
      } else {
        setUser(null)
        setFavorites([])
        window.localStorage.removeItem(ADMIN_SESSION_KEY)
      }
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    try {
      const savedAdmin = window.localStorage.getItem(ADMIN_SESSION_KEY)
      if (!savedAdmin) return
      const parsed = JSON.parse(savedAdmin)
      if (parsed?.email) {
        setUser({ ...parsed, role: 'admin' })
      }
    } catch {
      window.localStorage.removeItem(ADMIN_SESSION_KEY)
    }
  }, [])

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })

    const nextUser = {
      uid: credential.user.uid,
      name,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
    }

    setUser(nextUser)
    return nextUser
  }

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)

    const nextUser = {
      uid: credential.user.uid,
      name: credential.user.displayName || credential.user.email.split('@')[0],
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      role: ADMIN_EMAILS.includes(credential.user.email) ? 'admin' : 'user',
    }

    setUser(nextUser)
    return nextUser
  }

  const logout = async () => {
    await signOut(auth)
    setBookings([])
    setFavorites([])
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
  }

  const toggleFavorite = (artworkId) => {
    setFavorites(prev =>
      prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    )
  }

  const isFavorite = artworkId => favorites.includes(artworkId)

  const addBooking = async (booking) => {
    const newBooking = await createBooking({
      ...booking,
      id: `BK-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    })
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }

  const deleteBooking = async (id) => {
    await removeBooking(id)
    setBookings(prev => prev.filter(b => String(b.id) !== String(id)))
  }

  const addExhibition = async (payload) => {
    const created = await createExhibition(payload)
    setAdminExhibitions(prev => [created, ...prev])
    return created
  }

  const updateExhibition = async (id, payload) => {
    const updated = await saveExhibition(id, payload)
    setAdminExhibitions(prev => prev.map(ex => String(ex.id) === String(id) ? { ...ex, ...updated } : ex))
    return updated
  }

  const deleteExhibition = async (id) => {
    await removeExhibition(id)
    setAdminExhibitions(prev => prev.filter(ex => String(ex.id) !== String(id)))
  }

  const addArtwork = artwork => {
    const newArtwork = { ...artwork, id: Number(artwork.id || Date.now()) }
    setAdminArtworks(prev => [newArtwork, ...prev])
    return newArtwork
  }

  const updateArtwork = (id, payload) => {
    setAdminArtworks(prev => prev.map(item => Number(item.id) === Number(id) ? { ...item, ...payload } : item))
  }

  const deleteArtwork = (id) => {
    setAdminArtworks(prev => prev.filter(a => a.id !== Number(id)))
  }

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      register,
      favorites,
      toggleFavorite,
      isFavorite,
      language,
      setLanguage,
      theme,
      setTheme,
      bookings,
      addBooking,
      deleteBooking,
      adminExhibitions,
      museumDataLoading,
      addExhibition,
      updateExhibition,
      deleteExhibition,
      adminArtworks,
      addArtwork,
      updateArtwork,
      deleteArtwork,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

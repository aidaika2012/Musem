import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true) // Firebase auth state жүктөлүп жатканда
  const [language, setLanguage] = useState('EN')
  const [bookings, setBookings] = useState([])

  // ── Firebase auth listener ──────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
        setFavorites([])
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ── Register ────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    // Колдонуучунун атын Firebase profile'га сакта
    await updateProfile(credential.user, { displayName: name })
    // onAuthStateChanged автоматтык setUser чакырат, бирок displayName үчүн кайра жаз
    setUser({
      uid: credential.user.uid,
      name: name,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
    })
  }

  // ── Login ───────────────────────────────────────────────────────
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    // onAuthStateChanged setUser автоматтык иштейт
  }

  // ── Logout ──────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth)
    setBookings([])
    setFavorites([])
  }

  // ── Favorites ───────────────────────────────────────────────────
  const toggleFavorite = (artworkId) => {
    setFavorites(prev =>
      prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    )
  }

  const isFavorite = (artworkId) => favorites.includes(artworkId)

  // ── Bookings ────────────────────────────────────────────────────
  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BK-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      login,
      logout,
      register,
      favorites,
      toggleFavorite,
      isFavorite,
      language,
      setLanguage,
      bookings,
      addBooking,
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

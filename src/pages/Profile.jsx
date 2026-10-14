import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../firebase'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'
import { artworks } from '../data/artworks'

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function Profile() {
  const { t } = useTranslation()
  const { user, authLoading, logout, bookings, favorites, toggleFavorite } = useApp()
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [settingMsg, setSettingMsg]   = useState({ type: '', text: '' })
  const [settingLoading, setSettingLoading] = useState(false)

  const tabs = [t('prof_tab_bookings'), t('prof_tab_favorites'), t('prof_tab_settings')]

  if (authLoading) return (
    <div className="pt-28 pb-24 min-h-screen flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-[#c8a96e]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )

  if (!user) return (
    <div className="pt-28 pb-24 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-[#f0ebe3] flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
        </svg>
      </div>
      <p className="font-serif text-3xl mb-3">{t('prof_please_login')}</p>
      <p className="text-[#6b6b6b] mb-8">{t('prof_need_account')}</p>
      <Link to="/login" className="btn-ticket">{t('prof_sign_in')}</Link>
    </div>
  )

  const favArtworks = artworks.filter(a => favorites.includes(a.id))
  const initial     = (user.name || user.email).charAt(0).toUpperCase()

  const handleLogout = async () => { await logout(); navigate('/') }

  const handleUpdateName = async () => {
    if (!displayName.trim()) return
    setSettingLoading(true); setSettingMsg({ type: '', text: '' })
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() })
      setSettingMsg({ type: 'success', text: t('prof_save_name') + ' ✓' })
      setDisplayName('')
    } catch { setSettingMsg({ type: 'error', text: 'Error. Try again.' }) }
    finally   { setSettingLoading(false) }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) { setSettingMsg({ type: 'error', text: t('login_err_short') }); return }
    if (!currentPassword) { setSettingMsg({ type: 'error', text: t('prof_current_pw') + ' required.' }); return }
    setSettingLoading(true); setSettingMsg({ type: '', text: '' })
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, newPassword)
      setSettingMsg({ type: 'success', text: t('prof_update_pw') + ' ✓' })
      setCurrentPassword(''); setNewPassword('')
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Current password is incorrect.' : 'Error. Try again.'
      setSettingMsg({ type: 'error', text: msg })
    } finally { setSettingLoading(false) }
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-8 border-b border-[#e0d9d0]">
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.photoURL
              ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              : <span className="font-serif text-3xl text-white">{initial}</span>}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl text-[#1a1a1a]">{user.name}</h1>
            <p className="text-[#9b9490] text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={() => setActiveTab(2)} className="btn-outline text-sm">{t('prof_edit')}</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#f0ebe3] rounded-full p-1 mb-10 w-fit flex-wrap">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => { setActiveTab(i); setSettingMsg({ type: '', text: '' }) }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-[0.06em] transition-all duration-300
                ${activeTab === i ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#1a1a1a]'}`}>
              {tab}
              {i === 0 && bookings.length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === i ? 'bg-white/20' : 'bg-[#e0d9d0]'}`}>
                  {bookings.length}
                </span>
              )}
              {i === 1 && favArtworks.length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === i ? 'bg-white/20' : 'bg-[#e0d9d0]'}`}>
                  {favArtworks.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabVariants} initial="initial" animate="animate" exit="exit">

            {/* Bookings */}
            {activeTab === 0 && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-serif text-2xl text-[#1a1a1a] mb-3">{t('prof_no_bookings')}</p>
                    <p className="text-[#6b6b6b] mb-6">{t('prof_no_bookings_sub')}</p>
                    <Link to="/booking" className="btn-ticket">{t('prof_book_visit')}</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(b => (
                      <div key={b.id} className="bg-white rounded-2xl border border-[#e0d9d0] p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: t('prof_booking_id'), value: b.id },
                            { label: t('prof_date_time'),  value: `${b.date} at ${b.time}` },
                            { label: t('prof_tickets'),    value: Object.entries(b.tickets).filter(([,v])=>v>0).map(([k,v])=>`${v}× ${k}`).join(', ') },
                            { label: t('prof_total'),      value: `${b.totalPrice} KGS` },
                          ].map(r => (
                            <div key={r.label}>
                              <p className="section-label mb-0.5">{r.label}</p>
                              <p className="font-mono text-sm font-medium">{r.value}</p>
                            </div>
                          ))}
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                          {t('prof_status')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            {activeTab === 1 && (
              <div>
                {favArtworks.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-serif text-2xl text-[#1a1a1a] mb-3">{t('prof_no_favorites')}</p>
                    <p className="text-[#6b6b6b] mb-6">{t('prof_no_favorites_sub')}</p>
                    <Link to="/collection" className="btn-ticket">{t('prof_explore')}</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favArtworks.map(a => (
                      <div key={a.id} className="group relative">
                        <Link to={`/artworks/${a.id}`}>
                          <div className="img-zoom rounded-2xl overflow-hidden aspect-[3/4] mb-3">
                            <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                          </div>
                          <p className="font-serif text-sm text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">{a.title}</p>
                          <p className="text-[0.7rem] text-[#9b9490] mt-0.5">{a.artist}</p>
                        </Link>
                        <button onClick={() => toggleFavorite(a.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white shadow-sm transition-colors">
                          ♥
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 2 && (
              <div className="max-w-md space-y-6">
                {settingMsg.text && (
                  <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm
                    ${settingMsg.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-600'}`}>
                    <span>{settingMsg.type === 'success' ? '✓' : '!'}</span> {settingMsg.text}
                  </div>
                )}

                {/* Display name */}
                <div className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
                  <h3 className="font-serif text-xl mb-5">{t('prof_display_name')}</h3>
                  <p className="text-[#9b9490] text-sm mb-4">
                    {t('prof_current_name')}: <span className="font-medium text-[#1a1a1a]">{user.name}</span>
                  </p>
                  <label className="section-label block mb-1.5">{t('prof_new_name')}</label>
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder={t('prof_new_name')}
                    className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors mb-4" />
                  <button onClick={handleUpdateName} disabled={settingLoading || !displayName.trim()}
                    className="btn-ticket w-full justify-center text-sm disabled:opacity-40">
                    {settingLoading ? t('prof_saving') : t('prof_save_name')}
                  </button>
                </div>

                {/* Change password */}
                <div className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
                  <h3 className="font-serif text-xl mb-5">{t('prof_change_pw')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="section-label block mb-1.5">{t('prof_current_pw')}</label>
                      <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors" />
                    </div>
                    <div>
                      <label className="section-label block mb-1.5">{t('prof_new_pw')}</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors" />
                    </div>
                    <button onClick={handleUpdatePassword} disabled={settingLoading}
                      className="btn-ticket w-full justify-center text-sm disabled:opacity-40">
                      {settingLoading ? t('prof_updating') : t('prof_update_pw')}
                    </button>
                  </div>
                </div>

                {/* Account info */}
                <div className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
                  <h3 className="font-serif text-xl mb-4">{t('prof_account_info')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9b9490]">Email</span>
                      <span className="font-medium text-[#1a1a1a]">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9b9490]">UID</span>
                      <span className="font-mono text-xs text-[#9b9490] truncate max-w-[160px]">{user.uid}</span>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
                  <h3 className="font-serif text-xl mb-5">{t('prof_notifications')}</h3>
                  {[
                    { label: t('prof_notif_1'), desc: t('prof_notif_1_desc') },
                    { label: t('prof_notif_2'), desc: t('prof_notif_2_desc') },
                    { label: t('prof_notif_3'), desc: t('prof_notif_3_desc') },
                  ].map(n => (
                    <label key={n.label} className="flex items-center justify-between py-3 border-b border-[#f0ebe3] last:border-0 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1a]">{n.label}</p>
                        <p className="text-[0.72rem] text-[#9b9490]">{n.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#c8a96e] w-4 h-4" />
                    </label>
                  ))}
                </div>

                <button onClick={handleLogout}
                  className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('prof_sign_out')}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

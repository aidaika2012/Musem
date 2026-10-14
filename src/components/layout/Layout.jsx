import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '../header/Header'
import Footer from '../footer/Footer'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f0]">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

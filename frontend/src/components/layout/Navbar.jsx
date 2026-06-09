import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/analyzer', label: 'Analyzer' },
  { to: '/builder', label: 'Builder' },
  { to: '/templates', label: 'Templates' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
            <span className="font-bold text-lg gradient-text hidden sm:block">ResumeAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(l.to)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block text-gray-700">{user.username}</span>
                  <FiChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiUser className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={() => { logout(); setProfileOpen(false) }} className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-gray-50 transition-colors w-full text-left">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg transition-shadow">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500">
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive(l.to) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'
                  }`}
                >{l.label}</Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-600">Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="block px-3 py-2 rounded-xl text-sm font-medium text-red-500 w-full text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-600">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-purple-500 text-center">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

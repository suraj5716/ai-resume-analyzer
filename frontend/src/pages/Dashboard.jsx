import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFileText, FiTrendingUp, FiPlus, FiArrowRight, FiClock, FiBarChart2, FiDownload, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/resumes/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => setResumes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/resumes/${id}/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setResumes(resumes.filter(r => r.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const stats = [
    { icon: FiFileText, label: 'Total Resumes', value: resumes.length },
    { icon: FiTrendingUp, label: 'Avg ATS Score', value: resumes.length ? Math.round(resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / resumes.length) : 0 },
    { icon: FiClock, label: 'Recent Activity', value: resumes.length ? 'Active' : 'No activity' },
    { icon: FiBarChart2, label: 'Analyses Done', value: resumes.length || 0 },
  ]

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username || 'User'}</h1>
            <p className="text-gray-500">Manage your resumes and track your progress</p>
          </div>
          <Link to="/analyzer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg transition-all">
            <FiPlus className="w-4 h-4" /> New Analysis
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <stat.icon className="w-5 h-5 text-primary-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}{typeof stat.value === 'number' && stat.label === 'Avg ATS Score' ? '%' : ''}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Your Resumes</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">No resumes yet</h3>
              <p className="text-sm text-gray-500 mb-4">Upload your first resume to get started</p>
              <Link to="/analyzer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg transition-all">
                <FiPlus className="w-4 h-4" /> Analyze Resume
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {resumes.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{r.title || r.file_name || 'Untitled Resume'}</div>
                      <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()} · ATS Score: {r.ats_score || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(r.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <Link to={`/analyzer?resume=${r.id}`} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

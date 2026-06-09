import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiFileText, FiTrendingUp, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'
import ScoreGauge from '../components/charts/ScoreGauge'
import ScoreChart from '../components/charts/ScoreChart'
import ScoreRadar from '../components/charts/ScoreRadar'

export default function ResumeAnalyzer() {
  const fileInput = useRef(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [jobDesc, setJobDesc] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.docx'))) setFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    if (jobDesc.trim()) formData.append('job_description', jobDesc)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { data } = await axios.post('/api/analyze/', formData, { headers })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const atsScores = result ? [
    { label: 'Keyword Match', score: result.scores?.keyword_match ?? result.ats_score ?? 70, color: '#8b5cf6' },
    { label: 'Skills Match', score: result.scores?.skills_match ?? 65, color: '#6366f1' },
    { label: 'ATS Formatting', score: result.scores?.formatting ?? 85, color: '#22c55e' },
    { label: 'Completeness', score: result.scores?.section_completeness ?? 75, color: '#eab308' },
    { label: 'Impact Language', score: result.scores?.impact_language ?? 60, color: '#f97316' },
  ] : []

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ATS Resume <span className="gradient-text">Analyzer</span></h1>
          <p className="text-gray-500">Upload your resume and get instant AI-powered ATS compatibility analysis.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInput.current?.click()}
              className={`bg-white rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                file ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/50'
              }`}
            >
              <input ref={fileInput} type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files[0])} className="hidden" />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FiFileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <p className="font-medium text-sm text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                    <FiUpload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-medium text-sm text-gray-900">Drop your resume here</p>
                  <p className="text-xs text-gray-500">or click to browse · PDF or DOCX</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description (optional)</label>
              <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={6} className="w-full rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm p-3" placeholder="Paste the job description here for keyword matching..." />
            </div>

            <button onClick={handleUpload} disabled={!file || loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiTrendingUp className="w-4 h-4" /> Analyze Resume</>}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}
          </div>

          <div className="lg:col-span-3">
            {!result ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <FiFileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No analysis yet</h3>
                <p className="text-sm text-gray-500">Upload your resume and click analyze to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <ScoreGauge score={result.ats_score || 0} label="ATS Score" />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h4 className="font-medium text-sm text-gray-900 mb-3">Quick Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Word Count</span>
                        <span className="font-medium text-gray-700">{result.word_count || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Missing Keywords</span>
                        <span className="font-medium text-red-500">{result.missing_keywords?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Suggestions</span>
                        <span className="font-medium text-amber-500">{result.suggestions?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h4 className="font-medium text-sm text-gray-900 mb-4">Dimensional Scores</h4>
                  <ScoreChart scores={atsScores} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h4 className="font-medium text-sm text-gray-900 mb-4">Score Radar</h4>
                    <ScoreRadar scores={atsScores} />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h4 className="font-medium text-sm text-gray-900 mb-3">Missing Keywords</h4>
                    {result.missing_keywords?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.missing_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium">{kw}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No missing keywords found</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h4 className="font-medium text-sm text-gray-900 mb-4">Suggestions</h4>
                  {result.suggestions?.length > 0 ? (
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No suggestions available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

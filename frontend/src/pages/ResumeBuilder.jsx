import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiFileText, FiPlus, FiTrash2, FiArrowRight, FiDownload } from 'react-icons/fi'
import axios from 'axios'

export default function ResumeBuilder() {
  const fileInput = useRef(null)
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', summary: '', experience: [{ title: '', company: '', years: '', desc: '' }], education: [{ degree: '', school: '', year: '' }], skills: '' })

  const addExperience = () => setForm({ ...form, experience: [...form.experience, { title: '', company: '', years: '', desc: '' }] })
  const removeExperience = (i) => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) })
  const updateExp = (i, k, v) => { const e = [...form.experience]; e[i][k] = v; setForm({ ...form, experience: e }) }

  const addEducation = () => setForm({ ...form, education: [...form.education, { degree: '', school: '', year: '' }] })
  const removeEducation = (i) => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) })
  const updateEdu = (i, k, v) => { const e = [...form.education]; e[i][k] = v; setForm({ ...form, education: e }) }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { data } = await axios.post('/api/extract/', formData, { headers })
      setForm(prev => ({ ...prev, ...data.extracted_data }))
      setStep(2)
    } catch (err) {
      setError('Failed to extract data. Please fill manually.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { data } = await axios.post('/api/build/', form, { headers })
      setResult(data)
      setStep(3)
    } catch (err) {
      setError('Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadResume = () => {
    if (result?.resume_url) window.open(result.resume_url)
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Resume <span className="gradient-text">Builder</span></h1>
          <p className="text-gray-500">Build a professional, ATS-optimized resume in minutes.</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {[{ n: 1, l: 'Upload' }, { n: 2, l: 'Edit' }, { n: 3, l: 'Download' }].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.n ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>{s.n}</div>
              <span className={`text-sm font-medium ${step >= s.n ? 'text-gray-900' : 'text-gray-400'}`}>{s.l}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-100" />}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div onClick={() => fileInput.current?.click()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f) }} onDragOver={e => e.preventDefault()} className={`bg-white rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
                file ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/50'
              }`}>
                <input ref={fileInput} type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files[0])} className="hidden" />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center"><FiFileText className="w-7 h-7 text-primary-500" /></div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center"><FiUpload className="w-7 h-7 text-gray-400" /></div>
                    <p className="font-medium text-gray-900">Upload existing resume</p>
                    <p className="text-xs text-gray-500">or click to browse · PDF or DOCX</p>
                  </div>
                )}
              </div>
              <button onClick={handleUpload} disabled={!file || loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Extract Data <FiArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-sm text-gray-500">or <button onClick={() => setStep(2)} className="text-primary-600 hover:text-primary-700 font-medium">start from scratch</button></p>
              {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Personal Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="col-span-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                </div>
                <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={3} placeholder="Professional Summary" className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  <button onClick={addExperience} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary-500 transition-colors"><FiPlus className="w-4 h-4" /></button>
                </div>
                {form.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 relative">
                    {form.experience.length > 1 && <button onClick={() => removeExperience(i)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><FiTrash2 className="w-3 h-3" /></button>}
                    <div className="grid grid-cols-2 gap-3">
                      <input value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Job Title" className="col-span-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                      <input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                      <input value={exp.years} onChange={e => updateExp(i, 'years', e.target.value)} placeholder="Years (e.g. 2020-2023)" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                    </div>
                    <textarea value={exp.desc} onChange={e => updateExp(i, 'desc', e.target.value)} rows={2} placeholder="Description of responsibilities and achievements" className="w-full mt-3 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Education</h3>
                  <button onClick={addEducation} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary-500 transition-colors"><FiPlus className="w-4 h-4" /></button>
                </div>
                {form.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 relative">
                    {form.education.length > 1 && <button onClick={() => removeEducation(i)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><FiTrash2 className="w-3 h-3" /></button>}
                    <div className="grid grid-cols-2 gap-3">
                      <input value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Degree" className="col-span-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                      <input value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="School/University" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                      <input value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="Year" className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Skills</h3>
                <textarea value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} rows={3} placeholder="Python, JavaScript, React, Project Management, ..." className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
              </div>

              <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Generate Resume <FiArrowRight className="w-4 h-4" /></>}
              </button>
              {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Ready!</h2>
              <p className="text-gray-500 mb-6">Your AI-generated resume is ready for download.</p>
              <button onClick={downloadResume} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all">
                <FiDownload className="w-4 h-4" /> Download Resume
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

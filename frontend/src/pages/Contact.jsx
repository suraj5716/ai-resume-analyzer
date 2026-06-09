import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-500">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: FiMail, label: 'Email', value: 'hello@resumeai.com' },
              { icon: FiMapPin, label: 'Location', value: 'San Francisco, CA' },
              { icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-medium text-gray-900">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your Email" className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
              </div>
              <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
              <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your Message" className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm" />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {sent ? 'Message Sent!' : <><FiSend className="w-4 h-4" /> Send Message</>}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  )
}

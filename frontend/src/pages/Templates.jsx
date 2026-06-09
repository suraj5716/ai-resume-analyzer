import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import AnimatedSection from '../components/ui/AnimatedSection'

const templates = [
  { name: 'Modern', category: 'Professional', color: 'from-blue-500 to-cyan-500', popular: true },
  { name: 'Minimal', category: 'Clean', color: 'from-gray-500 to-slate-500', popular: false },
  { name: 'Executive', category: 'Corporate', color: 'from-primary-500 to-purple-500', popular: true },
  { name: 'Creative', category: 'Design', color: 'from-pink-500 to-rose-500', popular: false },
  { name: 'Tech', category: 'IT & Engineering', color: 'from-green-500 to-emerald-500', popular: true },
  { name: 'Academic', category: 'Research', color: 'from-amber-500 to-orange-500', popular: false },
  { name: 'Medical', category: 'Healthcare', color: 'from-teal-500 to-cyan-500', popular: false },
  { name: 'Legal', category: 'Law', color: 'from-indigo-500 to-violet-500', popular: false },
  { name: 'Startup', category: 'Entrepreneur', color: 'from-red-500 to-pink-500', popular: false },
  { name: 'LinkedIn', category: 'Social', color: 'from-sky-500 to-blue-500', popular: true },
]

export default function Templates() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume <span className="gradient-text">Templates</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Choose from 10+ professionally designed, ATS-optimized templates.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {templates.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
            >
              <div className={`aspect-[3/4] bg-gradient-to-br ${t.color} p-6 flex flex-col items-center justify-center relative`}>
                {t.popular && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-700 flex items-center gap-1">
                    <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" /> Popular
                  </div>
                )}
                <div className="w-full h-full rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-lg opacity-70">{t.name}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900">{t.name} Resume</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/builder" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all">
            Build Your Resume <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

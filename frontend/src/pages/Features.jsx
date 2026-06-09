import { motion } from 'framer-motion'
import { FiSearch, FiFileText, FiTrendingUp, FiShield, FiStar, FiDollarSign, FiTool, FiLayout, FiRefreshCw, FiLayers, FiCheckCircle, FiGitBranch, FiBarChart2, FiZap } from 'react-icons/fi'
import AnimatedSection from '../components/ui/AnimatedSection'

const features = [
  {
    icon: FiSearch, title: 'ATS Score Analysis', desc: 'Get instant ATS compatibility scores with detailed breakdowns across 5 key dimensions — keyword match, skills match, formatting, completeness, and impact language.',
    items: ['Real-time scoring', '5-dimension breakdown', 'Actionable insights'],
  },
  {
    icon: FiTrendingUp, title: 'Smart Keyword Match', desc: 'Compare your resume against any job description and instantly identify missing keywords and skills that recruiters look for.',
    items: ['JD comparison', 'Missing keyword detection', 'Industry-specific terms'],
  },
  {
    icon: FiFileText, title: 'AI Resume Builder', desc: 'Generate professional, ATS-optimized resumes from scratch or by uploading an existing one. AI-powered content suggestions included.',
    items: ['Upload or start fresh', 'AI content suggestions', 'Real-time preview'],
  },
  {
    icon: FiLayout, title: 'Premium Templates', desc: 'Choose from 10+ professionally designed templates, each optimized for ATS parsing and recruiter preferences.',
    items: ['10+ templates', 'ATS-optimized', 'Category-specific'],
  },
  {
    icon: FiBarChart2, title: 'Skill Gap Analysis', desc: 'Identify missing skills and get personalized learning recommendations to boost your career prospects.',
    items: ['Skills assessment', 'Learning recommendations', 'Career insights'],
  },
  {
    icon: FiZap, title: 'ATS Optimization', desc: 'Ensure your resume passes automated screening systems with formatting checks, keyword density analysis, and section compliance.',
    items: ['Formatting validation', 'Keyword density', 'Section compliance'],
  },
  {
    icon: FiShield, title: 'Privacy & Security', desc: 'Your data is encrypted in transit and at rest. We never share your personal information with third parties.',
    items: ['End-to-end encryption', 'GDPR compliant', 'No data sharing'],
  },
  {
    icon: FiRefreshCw, title: 'Version History', desc: 'Track changes and revert to previous versions of your resume. Never lose a draft again.',
    items: ['Auto-save', 'Version comparison', 'Easy rollback'],
  },
  {
    icon: FiCheckCircle, title: 'Cover Letter Builder', desc: 'Generate tailored cover letters that complement your resume and match the job you are applying for.',
    items: ['AI-generated', 'Role-specific', 'Downloadable'],
  },
]

export default function Features() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Powerful <span className="gradient-text">Features</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to land your dream job, powered by AI.</p>
        </AnimatedSection>

        <div className="space-y-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h2>
                <p className="text-gray-500 mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <f.icon className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">Preview</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

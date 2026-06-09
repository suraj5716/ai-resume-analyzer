import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUpload, FiTrendingUp, FiFileText, FiShield, FiArrowRight, FiStar, FiCheck, FiDollarSign, FiUsers, FiBarChart2 } from 'react-icons/fi'
import AnimatedSection from '../components/ui/AnimatedSection'
import FeatureCard from '../components/ui/FeatureCard'

const stats = [
  { icon: FiUsers, value: '50K+', label: 'Active Users' },
  { icon: FiFileText, value: '100K+', label: 'Resumes Analyzed' },
  { icon: FiBarChart2, value: '85%', label: 'Avg Score Boost' },
  { icon: FiStar, value: '4.9/5', label: 'User Rating' },
]

const features = [
  { icon: '🔍', title: 'ATS Score Analysis', description: 'Get instant ATS compatibility score with detailed breakdown across 5 key dimensions.' },
  { icon: '🎯', title: 'Smart Keyword Match', description: 'Compare your resume against job descriptions and find exactly what\'s missing.' },
  { icon: '✍️', title: 'AI Resume Builder', description: 'Generate professional resumes with AI-optimized content and industry-standard bullet points.' },
  { icon: '🎨', title: 'Premium Templates', description: 'Choose from 10+ professionally designed templates optimized for every career field.' },
  { icon: '📊', title: 'Skill Gap Analysis', description: 'Identify missing skills and get personalized recommendations for career growth.' },
  { icon: '🛡️', title: 'ATS Optimization', description: 'Ensure your resume passes automated screening systems with formatting checks.' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer at Google', text: 'The ATS analysis helped me understand why I wasn\'t getting callbacks. After optimizing, I got interviews at top tech companies.', rating: 5, avatar: 'S' },
  { name: 'Michael Chen', role: 'Product Manager at Stripe', text: 'The AI builder created a resume that perfectly highlighted my achievements. Landed my dream role within 2 weeks.', rating: 5, avatar: 'M' },
  { name: 'Emily Rodriguez', role: 'Marketing Director', text: 'Incredible tool! The keyword matching feature showed me exactly what recruiters were looking for.', rating: 5, avatar: 'E' },
]

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 analyses/mo', 'Basic templates', 'ATS score check', 'Email support'], cta: 'Get Started', popular: false },
  { name: 'Pro', price: '$12', period: '/month', features: ['Unlimited analyses', 'All templates', 'AI resume builder', 'ATS optimization', 'Cover letters', 'Priority support'], cta: 'Start Free Trial', popular: true },
  { name: 'Premium', price: '$29', period: '/month', features: ['Everything in Pro', 'AI rewriting', 'LinkedIn optimization', 'Multi-language', 'API access', 'Dedicated manager'], cta: 'Contact Sales', popular: false },
]

const faqs = [
  { q: 'How does the ATS scoring work?', a: 'Our AI analyzes your resume against 5 key dimensions: keyword match, skills match, formatting, section completeness, and impact language. Each dimension is weighted and scored to give you a comprehensive ATS compatibility score.' },
  { q: 'What file formats are supported?', a: 'We support PDF and DOCX file formats. Our parser extracts text while preserving formatting for accurate analysis.' },
  { q: 'Can I use the resume builder without a job description?', a: 'Absolutely! You can build a professional resume from scratch or upload an existing one. Adding a job description helps us optimize it for specific roles.' },
  { q: 'Is my data secure?', a: 'Yes, we take security seriously. Your resumes are encrypted in transit and at rest. We never share your data with third parties.' },
  { q: 'What is the free plan limit?', a: 'The free plan includes 5 resume analyses per month with basic templates and ATS score checking.' },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
    ))}
  </div>
)

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  AI-Powered Resume Optimization
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 mb-6">
                Land Your Dream{' '}
                <span className="gradient-text">Job</span>{' '}
                With AI-Powered Resumes
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-gray-500 mb-8 max-w-lg">
                Analyze, optimize, and build ATS-friendly resumes with AI. Get past automated screening systems and impress recruiters.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4">
                <Link to="/analyzer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  Analyze Your Resume <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/templates" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all">
                  View Templates
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {['S', 'M', 'E', 'J'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <StarRating rating={5} />
                  <p className="text-xs text-gray-400 mt-1">Trusted by 50K+ job seekers</p>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">ATS Score Overview</h3>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">82/100</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Keyword Match', score: 85, color: '#22c55e' },
                    { label: 'Skills Match', score: 70, color: '#eab308' },
                    { label: 'ATS Formatting', score: 90, color: '#22c55e' },
                    { label: 'Section Completeness', score: 75, color: '#eab308' },
                    { label: 'Impact Language', score: 60, color: '#f97316' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-700">{item.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Powerful AI tools to analyze, optimize, and build resumes that get you hired.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Three simple steps to optimize your resume.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: FiUpload, title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume. Our parser extracts and analyzes the content instantly.' },
              { step: '02', icon: FiTrendingUp, title: 'Get AI Analysis', desc: 'Receive comprehensive ATS scoring, keyword match analysis, and actionable suggestions.' },
              { step: '03', icon: FiShield, title: 'Optimize & Apply', desc: 'Apply AI suggestions, rebuild with premium templates, and land more interviews.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-500" />
                </div>
                <div className="text-sm font-bold text-primary-500 mb-2">{item.step}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium <span className="gradient-text">Templates</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Choose from 10+ professionally designed, ATS-optimized templates.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Modern', 'Minimal', 'Executive', 'Creative', 'Tech'].map((name, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 text-center cursor-pointer border border-gray-100 shadow-sm">
                <div className="w-full aspect-[3/4] rounded-xl bg-gray-50 border border-gray-100 mb-4 flex items-center justify-center text-gray-400 text-sm">
                  {name}
                </div>
                <h4 className="font-medium text-sm text-gray-900">{name} Resume</h4>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/templates" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              View All Templates <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users <span className="gradient-text">Say</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Join thousands of professionals who landed their dream jobs.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <StarRating rating={t.rating} />
                <p className="text-sm text-gray-600 mt-4 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple <span className="gradient-text">Pricing</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade anytime.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`bg-white rounded-2xl p-6 relative border shadow-sm ${plan.popular ? 'border-primary-200 shadow-md' : 'border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-medium">Most Popular</div>
                )}
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.popular ? '/register' : '/pricing'} className={`block w-full text-center py-3 rounded-xl font-medium text-sm transition-all ${
                  plan.popular ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </AnimatedSection>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {faq.q}
                  <FiChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-500">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Land Your <span className="gradient-text">Dream Job</span>?</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">Join 50,000+ professionals who have optimized their resumes with AI.</p>
            <Link to="/analyzer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all text-lg">
              Analyze Your Resume Free <FiArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

const FiChevronDown = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

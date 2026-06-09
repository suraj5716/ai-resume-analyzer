import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight } from 'react-icons/fi'
import AnimatedSection from '../components/ui/AnimatedSection'

const plans = [
  { name: 'Free', price: '$0', period: '/month', desc: 'Perfect for getting started', features: ['5 resume analyses per month', 'Basic templates', 'ATS score check', 'Keyword suggestions', 'Email support'], cta: 'Get Started', popular: false },
  { name: 'Pro', price: '$12', period: '/month', desc: 'For serious job seekers', features: ['Unlimited analyses', 'All premium templates', 'AI resume builder', 'ATS optimization', 'Cover letter generator', 'Priority support', 'Skill gap analysis'], cta: 'Start Free Trial', popular: true },
  { name: 'Premium', price: '$29', period: '/month', desc: 'For career growth', features: ['Everything in Pro', 'AI content rewriting', 'LinkedIn optimization', 'Multi-language support', 'API access', 'Dedicated career manager', 'Interview prep'], cta: 'Contact Sales', popular: false },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
  { q: 'Is there a free trial?', a: 'Pro plan comes with a 14-day free trial. No credit card required.' },
  { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade your plan anytime.' },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple <span className="gradient-text">Pricing</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-6 relative border shadow-sm ${
                plan.popular ? 'border-primary-200 shadow-md' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-medium">Most Popular</div>
              )}
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
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

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-500">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

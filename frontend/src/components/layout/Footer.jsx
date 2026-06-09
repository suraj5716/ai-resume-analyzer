import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const footerLinks = {
  Product: [
    { label: 'Analyzer', to: '/analyzer' },
    { label: 'Builder', to: '/builder' },
    { label: 'Templates', to: '/templates' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Company: [
    { label: 'Features', to: '/features' },
    { label: 'Contact', to: '/contact' },
    { label: 'About', to: '#' },
    { label: 'Blog', to: '#' },
  ],
  Support: [
    { label: 'Documentation', to: '#' },
    { label: 'FAQ', to: '/pricing' },
    { label: 'Privacy', to: '#' },
    { label: 'Terms', to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
              <span className="font-bold text-lg gradient-text">ResumeAI</span>
            </Link>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">AI-powered resume analysis and building platform. Land your dream job with optimized resumes.</p>
            <div className="flex items-center gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

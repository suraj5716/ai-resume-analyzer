import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

export default function TemplateCard({ name, category, color, popular, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
    >
      <div className={`aspect-[3/4] bg-gradient-to-br ${color} p-6 flex flex-col items-center justify-center relative`}>
        {popular && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-700 flex items-center gap-1">
            <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" /> Popular
          </div>
        )}
        <div className="w-full h-full rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white font-bold text-lg opacity-70">{name}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{category}</p>
      </div>
    </motion.div>
  )
}

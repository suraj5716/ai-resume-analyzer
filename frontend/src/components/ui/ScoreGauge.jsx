export default function ScoreGauge({ score = 0, label = '', size = 'md' }) {
  const getColor = (s) => s >= 80 ? '#00e676' : s >= 60 ? '#ffea00' : s >= 40 ? '#ff9100' : '#ff1744'
  const color = getColor(score)
  const dimensions = size === 'lg' ? { w: 180, h: 90 } : size === 'sm' ? { w: 100, h: 50 } : { w: 140, h: 70 }

  const canvasW = dimensions.w
  const canvasH = dimensions.h
  const cx = canvasW / 2
  const cy = canvasH
  const r = canvasH - 10
  const startAngle = Math.PI
  const endAngle = Math.PI + (score / 100) * Math.PI

  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)

  const largeArc = score > 50 ? 1 : 0

  return (
    <div className="flex flex-col items-center">
      <svg width={canvasW} height={canvasH + 10} viewBox={`0 0 ${canvasW} ${canvasH + 10}`}>
        <path
          d={`M ${cx - r + 2} ${cy} A ${r - 2} ${r - 2} 0 0 1 ${cx + r - 2} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-gray-200 dark:text-gray-700"
        />
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          className="drop-shadow-glow"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" className="font-bold" fill={color} fontSize={size === 'lg' ? 32 : size === 'sm' ? 18 : 24}>
          {score}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="currentColor" className="text-gray-500 dark:text-gray-400" fontSize={size === 'sm' ? 8 : 10}>
          {label || 'ATS Score'}
        </text>
      </svg>
    </div>
  )
}

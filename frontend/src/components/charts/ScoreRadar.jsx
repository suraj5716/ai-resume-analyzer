export default function ScoreRadar({ scores = [], size = 250 }) {
  if (!scores.length) return <div className="text-sm text-gray-500 text-center py-4">No data to display</div>

  const cx = size / 2
  const cy = size / 2
  const r = (size - 40) / 2
  const angles = scores.map((_, i) => (Math.PI * 2 * i) / scores.length - Math.PI / 2)

  const points = angles.map(a => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  }))

  const dataPoints = scores.map((s, i) => ({
    x: cx + (r * s.score) / 100 * Math.cos(angles[i]),
    y: cy + (r * s.score) / 100 * Math.sin(angles[i]),
  }))

  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')
  const gridPolygons = [0.25, 0.5, 0.75, 1].map(level => {
    return angles.map(a => ({
      x: cx + r * level * Math.cos(a),
      y: cy + r * level * Math.sin(a),
    })).map(p => `${p.x},${p.y}`).join(' ')
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridPolygons.map((poly, i) => (
        <polygon key={i} points={poly} fill="none" stroke="#f0f0f0" strokeWidth="1" />
      ))}
      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f0f0f0" strokeWidth="1" />
      ))}
      <polygon points={dataPolygon} fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#8b5cf6" className="drop-shadow-sm" />
      ))}
      {scores.map((s, i) => (
        <text key={i} x={points[i].x} y={points[i].y + (angles[i] > Math.PI / 2 && angles[i] < Math.PI * 3 / 2 ? 14 : -8)} textAnchor="middle" fontSize="10" fill="#6b7280">
          {s.label}
        </text>
      ))}
    </svg>
  )
}

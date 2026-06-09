export default function ScoreChart({ scores = [] }) {
  if (!scores.length) return <div className="text-sm text-gray-500 text-center py-4">No scores to display</div>

  return (
    <div className="space-y-4">
      {scores.map((s, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">{s.label}</span>
            <span className="font-medium text-gray-700">{s.score}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${s.score}%`, backgroundColor: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

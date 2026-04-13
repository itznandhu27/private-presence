export default function TimeTracker({ minutes, goalMinutes, progressPercent, bothActive }) {
  return (
    <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-xs text-warm-600 uppercase tracking-widest">Together today</h3>
        {bothActive && (
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            Counting
          </span>
        )}
      </div>

      {/* Time display */}
      <div className="flex items-baseline gap-1">
        <span className="font-serif text-3xl text-blush-100">{minutes}</span>
        <span className="font-sans text-warm-600 text-sm">/ {goalMinutes} min ❤️</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-warm-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blush-400 to-blush-500 rounded-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Status message */}
      <p className="font-sans text-xs text-warm-600">
        {progressPercent >= 100
          ? '🎉 Daily goal reached!'
          : bothActive
          ? 'Timer running while you\'re both here'
          : 'Timer pauses when one of you is away'}
      </p>
    </div>
  )
}

const STATUS_COLORS = {
  active: 'bg-emerald-400',
  idle: 'bg-yellow-400',
  offline: 'bg-warm-600',
}

const STATUS_LABELS = {
  active: 'Online now',
  idle: 'Idle',
  offline: 'Offline',
}

function formatLastSeen(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function StatusBadge({ status, lastSeen, email, large = false }) {
  const dotSize = large ? 'w-3 h-3' : 'w-2 h-2'
  const pulse = status === 'active' ? 'animate-pulse-soft' : ''

  return (
    <div className={`flex items-center gap-2 ${large ? 'flex-col' : ''}`}>
      {large ? (
        <div className="relative">
          <div className={`${dotSize} rounded-full ${STATUS_COLORS[status] || STATUS_COLORS.offline} ${pulse}`} />
          {status === 'active' && (
            <div className={`absolute inset-0 rounded-full ${STATUS_COLORS.active} opacity-40 scale-150 animate-ping`} />
          )}
        </div>
      ) : (
        <div className={`relative flex items-center`}>
          <div className={`${dotSize} rounded-full ${STATUS_COLORS[status] || STATUS_COLORS.offline} ${pulse}`} />
          {status === 'active' && (
            <div className={`absolute inset-0 rounded-full ${STATUS_COLORS.active} opacity-30 scale-[2] animate-ping`} />
          )}
        </div>
      )}

      <div className={large ? 'text-center' : ''}>
        {email && (
          <p className="text-blush-200 font-sans text-xs font-medium">{email}</p>
        )}
        <p className={`font-sans ${large ? 'text-sm' : 'text-xs'} ${status === 'active' ? 'text-emerald-400' : 'text-warm-600'}`}>
          {STATUS_LABELS[status] || 'Offline'}
          {status !== 'active' && lastSeen && (
            <span className="text-warm-600"> · Last seen {formatLastSeen(lastSeen)}</span>
          )}
        </p>
      </div>
    </div>
  )
}

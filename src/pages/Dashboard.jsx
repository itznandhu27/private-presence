import { useAuth } from '../hooks/useAuth'
import { usePresence } from '../hooks/usePresence'
import { useTimeTracker } from '../hooks/useTimeTracker'
import StatusBadge from '../components/StatusBadge'
import TimeTracker from '../components/TimeTracker'
import Chat from '../components/Chat'
import ThinkingButton from '../components/ThinkingButton'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { myStatus, otherUser } = usePresence(user?.id)
  const { minutes, goalMinutes, progressPercent, bothActive } = useTimeTracker(
    user?.id,
    myStatus,
    otherUser?.status
  )

  const togetherNow = myStatus === 'active' && otherUser?.status === 'active'

  return (
    <div className="min-h-screen bg-warm-900 text-blush-100">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, #ff2d55 0%, transparent 40%), radial-gradient(circle at 90% 80%, #ff8fa3 0%, transparent 40%)'
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-warm-900/90 backdrop-blur-sm border-b border-warm-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🫀</span>
            <span className="font-serif italic text-blush-200">Private Presence</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={myStatus} />
            <button
              onClick={logout}
              className="text-warm-600 hover:text-blush-300 text-xs font-sans transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Together / Waiting banner */}
        <div className={`
          rounded-2xl p-5 text-center transition-all duration-700
          ${togetherNow
            ? 'bg-gradient-to-r from-blush-600/20 to-blush-500/20 border border-blush-500/30'
            : 'bg-warm-800 border border-warm-700'
          }
        `}>
          {togetherNow ? (
            <div className="space-y-1 animate-fade-in">
              <p className="font-serif text-xl italic text-blush-200">
                You're together now ❤️
              </p>
              <p className="font-sans text-xs text-warm-600">Both of you are here</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-serif text-xl italic text-warm-600">Waiting…</p>
              <p className="font-sans text-xs text-warm-600">
                {otherUser
                  ? `${otherUser.email?.split('@')[0]} is ${otherUser.status}`
                  : 'Your person hasn\'t arrived yet'}
              </p>
            </div>
          )}
        </div>

        {/* Other user presence card */}
        {otherUser && (
          <div className="bg-warm-800 border border-warm-700 rounded-2xl p-5">
            <h3 className="font-sans text-xs text-warm-600 uppercase tracking-widest mb-3">Their status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-blush-200 font-medium">
                  {otherUser.email?.split('@')[0]}
                </p>
                <p className="font-sans text-xs text-warm-600 mt-0.5">
                  {otherUser.email}
                </p>
              </div>
              <StatusBadge
                status={otherUser.status}
                lastSeen={otherUser.last_seen}
              />
            </div>
          </div>
        )}

        {/* Time Tracker */}
        <TimeTracker
          minutes={minutes}
          goalMinutes={goalMinutes}
          progressPercent={progressPercent}
          bothActive={bothActive}
        />

        {/* Thinking of You */}
        <div className="flex justify-center py-2">
          <ThinkingButton userId={user?.id} />
        </div>

        {/* Chat */}
        <Chat userId={user?.id} myEmail={user?.email} />

        {/* Footer */}
        <p className="text-center text-warm-700 text-xs font-sans pb-4">
          Private · End-to-end ready · Just you two
        </p>
      </main>
    </div>
  )
}

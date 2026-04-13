import { useThinkingOfYou } from '../hooks/useThinkingOfYou'

export default function ThinkingButton({ userId }) {
  const { glowing, sending, sendSignal } = useThinkingOfYou(userId)

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Glow overlay when receiving signal */}
      {glowing && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-blush-500 opacity-10 animate-fade-in" />
          <div className="absolute inset-0 border-4 border-blush-400 opacity-30 animate-glow-ping rounded-none" />
        </div>
      )}

      {glowing && (
        <p className="text-blush-300 text-xs font-sans animate-fade-in text-center">
          💗 They're thinking of you
        </p>
      )}

      <button
        onClick={sendSignal}
        disabled={sending}
        className={`
          relative group flex items-center gap-2 px-5 py-3
          border rounded-2xl font-sans text-sm font-medium
          transition-all duration-300
          ${sending
            ? 'bg-blush-500/20 border-blush-500 text-blush-300 cursor-default'
            : 'bg-warm-800 border-warm-700 text-warm-600 hover:border-blush-500 hover:text-blush-300 hover:bg-warm-700'
          }
        `}
      >
        <span className={`text-lg transition-transform ${sending ? 'animate-heartbeat' : 'group-hover:scale-110'}`}>
          🫶
        </span>
        {sending ? "Sent with love" : "I'm thinking of you"}
      </button>
    </div>
  )
}

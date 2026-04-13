import { useState } from 'react'
import { useChat } from '../hooks/useChat'

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Chat({ userId, myEmail }) {
  const { messages, loading, sendMessage, bottomRef } = useChat(userId)
  const [input, setInput] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await sendMessage(input)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="flex flex-col bg-warm-800 border border-warm-700 rounded-2xl overflow-hidden" style={{ height: '420px' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-warm-700">
        <h3 className="font-sans text-xs text-warm-600 uppercase tracking-widest">Messages</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <p className="text-center text-warm-600 text-xs font-sans">Loading…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-warm-600 text-xs font-sans mt-8">
            Say hello ✨
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-slide-up`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                isMe
                  ? 'bg-blush-500 text-white rounded-br-sm'
                  : 'bg-warm-700 text-blush-100 rounded-bl-sm'
              }`}>
                <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
              </div>
              <span className="text-warm-600 text-xs font-mono mt-1 px-1">
                {formatTime(msg.created_at)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-warm-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type something…"
          className="flex-1 bg-warm-700 border border-warm-600 rounded-xl px-4 py-2.5
                     text-blush-100 font-sans text-sm placeholder-warm-600
                     focus:outline-none focus:border-blush-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blush-500 hover:bg-blush-600 disabled:bg-warm-700 disabled:text-warm-600
                     text-white w-10 h-10 rounded-xl flex items-center justify-center
                     transition-all flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

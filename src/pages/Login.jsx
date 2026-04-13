import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setLoading(true)
    const { error } = await login(email, password)
    if (error) setLocalError(error.message || 'Login failed')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-warm-900 flex items-center justify-center px-4">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #ff2d55 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff8fa3 0%, transparent 40%)'
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="text-5xl mb-4">🫀</div>
          <h1 className="font-serif text-3xl text-blush-100 italic">Private Presence</h1>
          <p className="font-sans text-warm-600 text-sm mt-2 font-light tracking-widest uppercase">
            Just the two of us
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3
                         text-blush-100 font-sans text-sm placeholder-warm-600
                         focus:outline-none focus:border-blush-500 focus:ring-1 focus:ring-blush-500
                         transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-warm-800 border border-warm-700 rounded-xl px-4 py-3
                         text-blush-100 font-sans text-sm placeholder-warm-600
                         focus:outline-none focus:border-blush-500 focus:ring-1 focus:ring-blush-500
                         transition-colors"
            />
          </div>

          {(localError || error) && (
            <p className="text-blush-400 text-xs font-sans text-center">
              {localError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blush-500 hover:bg-blush-600 disabled:bg-warm-700
                       text-white font-sans font-medium text-sm
                       rounded-xl px-4 py-3 transition-all duration-200
                       hover:shadow-lg hover:shadow-blush-500/20"
          >
            {loading ? 'Signing in…' : 'Enter our space'}
          </button>
        </form>

        <p className="text-center text-warm-600 text-xs font-sans mt-8">
          Private · Secure · Just you two
        </p>
      </div>
    </div>
  )
}

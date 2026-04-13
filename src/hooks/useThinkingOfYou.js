import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useThinkingOfYou(userId) {
  const [glowing, setGlowing] = useState(false)
  const [sending, setSending] = useState(false)

  const sendSignal = async () => {
    if (!userId || sending) return
    setSending(true)
    await supabase.from('signals').insert({ sender_id: userId })
    setTimeout(() => setSending(false), 3000)
  }

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('signals')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'signals',
        filter: `sender_id=neq.${userId}`,
      }, () => {
        setGlowing(true)
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200])
        }
        setTimeout(() => setGlowing(false), 4000)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  return { glowing, sending, sendSignal }
}

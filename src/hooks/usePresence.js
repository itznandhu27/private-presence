import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const IDLE_TIMEOUT = 30_000 // 30 seconds

export function usePresence(userId) {
  const [myStatus, setMyStatus] = useState('active')
  const [otherUser, setOtherUser] = useState(null) // { id, email, status, last_seen }
  const idleTimer = useRef(null)
  const channelRef = useRef(null)

  const updateStatus = useCallback(async (status) => {
    if (!userId) return
    setMyStatus(status)
    await supabase
      .from('presence')
      .upsert({
        user_id: userId,
        status,
        last_seen: new Date().toISOString(),
      }, { onConflict: 'user_id' })
  }, [userId])

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current)
    if (myStatus !== 'active') updateStatus('active')
    idleTimer.current = setTimeout(() => {
      updateStatus('idle')
    }, IDLE_TIMEOUT)
  }, [myStatus, updateStatus])

  useEffect(() => {
    if (!userId) return

    // Set active on load
    updateStatus('active')

    // Activity listeners
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetIdleTimer))
    resetIdleTimer()

    // Tab visibility
    const handleVisibility = () => {
      if (document.hidden) {
        updateStatus('idle')
      } else {
        updateStatus('active')
        resetIdleTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Offline on close
    window.addEventListener('beforeunload', () => {
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/presence`,
        JSON.stringify({ user_id: userId, status: 'offline', last_seen: new Date().toISOString() })
      )
    })

    return () => {
      clearTimeout(idleTimer.current)
      events.forEach(e => window.removeEventListener(e, resetIdleTimer))
      document.removeEventListener('visibilitychange', handleVisibility)
      updateStatus('offline')
    }
  }, [userId])

  // Subscribe to other user's presence
  useEffect(() => {
    if (!userId) return

    // Load other user presence initially
    const loadOtherPresence = async () => {
      const { data } = await supabase
        .from('presence')
        .select('*, users(email)')
        .neq('user_id', userId)
        .single()
      if (data) {
        setOtherUser({
          id: data.user_id,
          email: data.users?.email,
          status: data.status,
          last_seen: data.last_seen,
        })
      }
    }
    loadOtherPresence()

    // Realtime subscription
    const channel = supabase
      .channel('presence-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'presence',
        filter: `user_id=neq.${userId}`,
      }, (payload) => {
        const row = payload.new
        setOtherUser(prev => ({
          ...prev,
          id: row.user_id,
          status: row.status,
          last_seen: row.last_seen,
        }))
      })
      .subscribe()

    channelRef.current = channel
    return () => supabase.removeChannel(channel)
  }, [userId])

  return { myStatus, otherUser }
}

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DAILY_GOAL_SECONDS = 2 * 60 * 60 // 2 hours
const today = () => new Date().toISOString().split('T')[0]

export function useTimeTracker(userId, myStatus, otherUserStatus) {
  const [sharedSeconds, setSharedSeconds] = useState(0)
  const [trackingId, setTrackingId] = useState(null)
  const timerRef = useRef(null)
  const bothActive = myStatus === 'active' && otherUserStatus === 'active'

  // Load today's time from DB
  const loadToday = useCallback(async () => {
    const { data } = await supabase
      .from('time_tracking')
      .select('*')
      .eq('date', today())
      .single()

    if (data) {
      setSharedSeconds(data.shared_time)
      setTrackingId(data.id)
    } else {
      // Create today's record
      const { data: newRow } = await supabase
        .from('time_tracking')
        .insert({ date: today(), shared_time: 0 })
        .select()
        .single()
      if (newRow) setTrackingId(newRow.id)
    }
  }, [])

  useEffect(() => {
    if (userId) loadToday()
  }, [userId])

  // Subscribe to realtime updates from other user
  useEffect(() => {
    if (!trackingId) return
    const channel = supabase
      .channel('time-tracking')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'time_tracking',
        filter: `id=eq.${trackingId}`,
      }, (payload) => {
        setSharedSeconds(payload.new.shared_time)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [trackingId])

  // Timer logic
  useEffect(() => {
    if (bothActive && trackingId) {
      timerRef.current = setInterval(async () => {
        setSharedSeconds(prev => {
          const next = prev + 1
          // Update DB every 5 seconds to reduce writes
          if (next % 5 === 0) {
            supabase
              .from('time_tracking')
              .update({ shared_time: next })
              .eq('id', trackingId)
          }
          return next
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [bothActive, trackingId])

  const progressPercent = Math.min((sharedSeconds / DAILY_GOAL_SECONDS) * 100, 100)
  const minutes = Math.floor(sharedSeconds / 60)
  const goalMinutes = DAILY_GOAL_SECONDS / 60

  return { sharedSeconds, progressPercent, minutes, goalMinutes, bothActive }
}

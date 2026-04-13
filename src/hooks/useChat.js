import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useChat(userId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  // Load message history
  useEffect(() => {
    if (!userId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, users(email)')
        .order('created_at', { ascending: true })
        .limit(100)

      setMessages(data || [])
      setLoading(false)
    }
    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        // Fetch sender info
        const { data: userData } = await supabase
          .from('users')
          .select('email')
          .eq('id', payload.new.sender_id)
          .single()

        setMessages(prev => [...prev, {
          ...payload.new,
          users: userData,
        }])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content) => {
    if (!content.trim() || !userId) return

    // Content stored as-is; structure ready for encryption layer
    await supabase.from('messages').insert({
      sender_id: userId,
      content: content.trim(),
    })
  }

  return { messages, loading, sendMessage, bottomRef }
}

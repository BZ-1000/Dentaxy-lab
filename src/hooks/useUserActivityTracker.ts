
import { useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

function getTodayISODate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useUserActivityTracker() {
  const { user } = useAuth()
  const sessionStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (!user) {
      sessionStartRef.current = null
      return
    }

    const startSession = () => {
      if (document.hidden) return
      if (sessionStartRef.current) return
      sessionStartRef.current = Date.now()
    }

    const endSession = async () => {
      const start = sessionStartRef.current
      if (!start) return
      sessionStartRef.current = null

      const end = Date.now()
      const durationMinutes = Math.max(0, Math.round((end - start) / 60000))
      if (durationMinutes <= 0) return

      const sessionStartISO = new Date(start).toISOString()
      const sessionEndISO = new Date(end).toISOString()

      try {
        await supabase.from('user_activity_sessions').insert({
          user_id: user.id,
          date: getTodayISODate(),
          session_start: sessionStartISO,
          session_end: sessionEndISO,
          duration_minutes: durationMinutes,
        })
      } catch (e) {
        // Silently ignore errors to not block navigation
        console.error('Failed to save activity session', e)
      }
    }

    const handleVisibility = () => {
      if (document.hidden) {
        void endSession()
      } else {
        startSession()
      }
    }

    startSession()

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', endSession)
    window.addEventListener('beforeunload', endSession)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', endSession)
      window.removeEventListener('beforeunload', endSession)
      void endSession()
    }
  }, [user])
}

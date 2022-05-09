import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export const LogoutBtn = () => {
  const router = useRouter()
  const logout = () => {
    supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="absolute top-20 right-4">
      <button className="link" onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}

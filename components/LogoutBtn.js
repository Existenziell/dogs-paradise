import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const LogoutBtn = () => {
  const router = useRouter()
  const logout = () => {
    supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="absolute top-24 right-4">
      <button className="link" onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}

export default LogoutBtn

import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const LogoutBtn = () => {
  const router = useRouter()
  const logout = () => {
    supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button onClick={logout} aria-label='Logout'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300 dark:hover:text-brand hover:text-brand hover:scale-105 transition-all cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  )
}

export default LogoutBtn

import { useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const DarkModeToggle = () => {

  const appCtx = useContext(AppContext)
  const { darkmode, setDarkmode } = appCtx

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkmode(true)
    } else {
      setDarkmode(false)
    }
  }, [])

  const toggleDarkmode = (mode) => {
    if (mode === 'dark') {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')
      setDarkmode(true)
    } else {
      localStorage.theme = 'light'
      document.documentElement.classList.remove('dark')
      setDarkmode(false)
    }
  }

  return (
    <div>
      {!darkmode ?
        <svg onClick={() => toggleDarkmode('dark')} xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 hover:text-slate-400 cursor-pointer text-brand hover:scale-105' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
        </svg>
        :
        <svg onClick={() => toggleDarkmode('light')} xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 hover:text-slate-400 cursor-pointer text-brand hover:scale-105' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
      }
    </div>
  )
}

export default DarkModeToggle

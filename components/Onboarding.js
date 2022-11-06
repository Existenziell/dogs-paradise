import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import useApp from '../context/AppContext'
import updateProfile from '../lib/updateProfile'

const Onboarding = () => {
  const { notify, setShowOnboarding } = useApp()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateProfile({ username, setLoading, notify })
    setLoading(false)
    setShowOnboarding(false)
    router.reload(window.location.pathname)
  }

  return (
    <form onSubmit={handleSubmit} className="pb-8 flex flex-col items-center justify-center">
      <Image
        src='/logo.webp'
        alt='Logo'
        className='w-28 rounded shadow-md dark:shadow-none dark:invert'
        width={200}
        height={200}
        placeholder='blur'
        blurDataURL='/logo.webp'
      />
      <h1 className='text-2xl mt-6'>Welcome to Dog&apos;s Paradise</h1>
      <p className="mb-6">Please choose a username:</p>
      <div>
        <input
          id="username"
          className='text-center'
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          className="button mt-8"
          type='submit'
          disabled={loading || !username}
          aria-label='Create Profile'
        >
          {loading ? 'Loading ...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default Onboarding

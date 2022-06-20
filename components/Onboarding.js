import { useRouter } from 'next/router'
import { useState } from 'react'
import useApp from '../context/AppContext'
import updateProfile from '../lib/updateProfile'
import Avatar from './Avatar'

const Onboarding = () => {
  const { notify, setShowOnboarding } = useApp()

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    updateProfile({ username, quote, avatar_url, setLoading, notify })
    setLoading(false)
    setShowOnboarding(false)
    router.reload(window.location.pathname)
  }

  return (
    <form onSubmit={handleSubmit} className="pb-8 flex flex-col items-center justify-center">
      <img src='/logo.png' alt='Logo' className='w-28 rounded shadow-md dark:shadow-none dark:invert' />
      <h1 className='text-2xl mt-6'>Welcome to Dog's Paradise</h1>
      <p className="mb-6">Just follow these few steps to finalize your Membership Card!</p>
      <div>
        <label htmlFor="username" className='block text-sm mb-1'>Choose a username</label>
        <input
          id="username"
          className='text-center'
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className='mt-4'>
        <label htmlFor="quote" className='block text-sm mb-1'>Favorite Quote <br />(Could be about dogs &#128021;)</label>
        <textarea
          rows={5}
          id="quote"
          type="text"
          value={quote || ''}
          onChange={(e) => setQuote(e.target.value)}
          className='w-full p-4 rounded-sm'
        >
        </textarea>
      </div>

      <div className='flex flex-col items-center justify-center my-8'>
        <Avatar
          bucket='avatars'
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ username, quote, avatar_url: url, setLoading, notify })
          }}
        />
      </div>
      <div>
        <button
          className="link mt-2"
          type='submit'
          disabled={loading}
          aria-label='Create Profile'
        >
          {loading ? 'Loading ...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default Onboarding

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
    <form onSubmit={handleSubmit} className="py-8 text-left">
      <h1 className="text-xl mb-6">Just a few more steps to finalize your Membership Card!</h1>
      <div>
        <label htmlFor="username" className='block text-sm mb-1'>Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className='mt-4'>
        <label htmlFor="quote" className='block text-sm mb-1'>Favorite Quote <br />Could be about dogs &#128021;)</label>
        <input
          id="quote"
          type="text"
          value={quote || ''}
          onChange={(e) => setQuote(e.target.value)}
          className='w-full'
        />
      </div>

      <div className='text-left my-8'>
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

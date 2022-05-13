import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import updateProfile from '../lib/updateProfile'
import Avatar from './Avatar'

const Onboarding = () => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  return (
    <div className="py-8 text-left">
      <h1 className="text-xl mb-6">Just a few more steps to finalize your Membership Card!</h1>
      <div>
        <label htmlFor="username" className='block text-sm mb-1'>Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={() => updateProfile({ username, quote, avatar_url, setLoading, notify })}
          disabled={loading}
          aria-label='Create Profile'
        >
          {loading ? 'Loading ...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding

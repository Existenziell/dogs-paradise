import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Avatar from './Avatar'

const Onboarding = () => {
  const ctx = useContext(AppContext)
  const userCtx = ctx.user
  const appCtx = ctx.appState

  const updateProfile = () => {
    const { username, quote, avatarUrl } = userCtx
    userCtx.updateProfile({ username, quote, avatarUrl })
  }

  return (
    <div className="py-8 text-left">
      <h1 className="text-xl mb-6">Just a few more steps to finalize your Membership Card!</h1>
      <div>
        <label htmlFor="username" className='block text-sm mb-1'>Username</label>
        <input
          id="username"
          type="text"
          value={userCtx.username || ''}
          onChange={(e) => userCtx.setUsername(e.target.value)}
        />
      </div>
      <div className='mt-4'>
        <label htmlFor="quote" className='block text-sm mb-1'>Favorite Quote <br />Could be about dogs &#128021;)</label>
        <input
          id="quote"
          type="text"
          value={userCtx.quote || ''}
          onChange={(e) => userCtx.setQuote(e.target.value)}
          className='w-full'
        />
      </div>

      <div className='w-64 text-left'>
        <Avatar
          url={userCtx.avatarUrl}
        />
      </div>
      <div>
        <button
          className="link mt-2"
          onClick={updateProfile}
          disabled={appCtx.loading}
        >
          {appCtx.loading ? 'Loading ...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding

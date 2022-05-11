import { useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function Avatar({ url }) {
  const ctx = useContext(AppContext)
  const userCtx = ctx.user
  const appCtx = ctx.appState
  const bucket = 'avatars'

  // On load if user image exists
  useEffect(() => {
    if (url) {
      userCtx.downloadImage(bucket, url)
    }
  }, [url])

  // After upload
  useEffect(() => {
    if (userCtx.avatarUrl) {
      userCtx.downloadImage(bucket, userCtx.avatarUrl)
    }
  }, [userCtx.avatarUrl])

  const uploadAvatar = async (e) => {
    userCtx.uploadImage(e, bucket)
    userCtx.updateProfile({ avatar_url: userCtx.setAvatarUrl })
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {userCtx.finalAvatarUrl ?
        <img
          src={userCtx.finalAvatarUrl}
          alt="Avatar"
          className="rounded-xl border-4 border-white"
        />
        :
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      <div>
        <label className="text-xs" htmlFor="single">
          {appCtx.uploading ? 'Uploading ...' : <span className='cursor-pointer'>Change Avatar</span>}
        </label>
        <input
          style={{
            visibility: 'hidden',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={appCtx.uploading}
        />
      </div>
    </div>
  )
}

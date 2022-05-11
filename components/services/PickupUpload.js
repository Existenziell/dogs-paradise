import { useEffect, useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { PacmanLoader } from 'react-spinners'

const PickupUpload = ({ setPicture }) => {
  const ctx = useContext(AppContext)
  const userCtx = ctx.user
  const appCtx = ctx.appState
  const bucket = 'pickups'

  useEffect(() => {
    if (userCtx.avatarUrl) {
      userCtx.downloadImage(bucket, userCtx.avatarUrl)
      userCtx.setAvatarUrl(userCtx.avatarUrl)
      setPicture(userCtx.avatarUrl)
    }
  }, [userCtx.avatarUrl])

  const handleUpload = (e) => {
    userCtx.uploadImage(e, bucket)
  }

  return (
    <>
      {userCtx.avatarUrl &&
        <img
          src={userCtx.avatarUrl}
          alt="Avatar"
          className="rounded border border-slate-200 w-64 my-8"
        />
      }

      <div>
        <label htmlFor="single">
          {appCtx.uploading ?
            <div className='mx-8 py-8'>
              <PacmanLoader color={'var(--color-brand-dark)'} size={20} />
            </div>
            :
            <div className='max-w-max mt-6 ml-12'>
              <div className='cursor-pointer hover:scale-105 transition-all flex flex-col items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Upload Image</span>
              </div>
            </div>
          }
        </label>

        <input
          style={{
            visibility: 'hidden',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={handleUpload}
          disabled={appCtx.uploading}
        />
      </div>
    </>
  )
}

export default PickupUpload

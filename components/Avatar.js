import { useEffect, useState } from 'react'
import downloadImage from '../lib/supabase/downloadImage'
import uploadImage from '../lib/supabase/uploadImage'

export default function Avatar({ bucket, url, size, onUpload, text }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(bucket, url, setAvatarUrl)
  }, [url, bucket])

  return (
    <div className='flex flex-col items-center'>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-xl shadow"
          style={{ height: size, width: size }}
        />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 m-0 p-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      <div style={{ width: size }}>
        <label className="text-sm" htmlFor="single">
          {uploading ? 'Uploading ...' : <span className='cursor-pointer link'>{text ? text : `Change Avatar`}</span>}
        </label>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
          disabled={uploading}
          className='hidden'
        />
      </div>
    </div>
  )
}

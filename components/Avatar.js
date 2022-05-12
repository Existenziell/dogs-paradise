import { useEffect, useState } from 'react'
import downloadImage from '../lib/downloadImage'
import uploadImage from '../lib/uploadImage'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const bucket = 'avatars'

  useEffect(() => {
    if (url) downloadImage(bucket, url, setAvatarUrl)
  }, [url])

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-xl border-2 border-white"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="text-sm" htmlFor="single">
          {uploading ? 'Uploading ...' : <span className='cursor-pointer hover:text-slate-300'>Change Avatar</span>}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

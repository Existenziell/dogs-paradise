import Image from 'next/image'
import uploadImage from '../lib/supabase/uploadImage'
import { useState } from 'react'
import { SyncLoader } from 'react-spinners'
import { PhotographIcon } from '@heroicons/react/solid'

export default function Avatar({ bucket, url, size = 400, onUpload, text }) {
  const [uploading, setUploading] = useState(false)

  return (
    <div className='flex flex-col items-center'>
      {url ?
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${bucket}/${url}`}
          alt="Avatar"
          width={size}
          height={size}
          className="rounded-xl shadow"
          placeholder='blur'
          objectFit='contain'
          blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${bucket}/${url}`}
        />
        :
        uploading ?
          <div className='h-32 w-32 flex items-center justify-center'>
            <SyncLoader className='w-4' color='var(--color-brand)' />
          </div>
          :
          <PhotographIcon className='p-0 m-0' />
      }
      <div style={{ width: size }}>
        <label className="text-sm text-center mt-2 block" htmlFor="single">
          {uploading ?
            `Uploading...`
            :
            <p className='cursor-pointer link'>{text || `Change Avatar`}</p>
          }
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

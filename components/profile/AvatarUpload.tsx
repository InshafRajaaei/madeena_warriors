'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'

interface AvatarUploadProps {
  url: string | null
  onUpload: (url: string) => void
}

export default function AvatarUpload({ url, onUpload }: AvatarUploadProps) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true)

      if (!acceptedFiles || acceptedFiles.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = acceptedFiles[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      onUpload(data.publicUrl)
      
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }, [supabase, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp']
    },
    maxFiles: 1,
  })

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div 
        {...getRootProps()} 
        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 cursor-pointer transition-all duration-200 group flex items-center justify-center bg-gray-100
          ${isDragActive ? 'border-primary-orange scale-105' : 'border-primary-navy/20 hover:border-primary-navy'}`}
      >
        <input {...getInputProps()} />
        
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="128px"
          />
        ) : (
          <div className="text-gray-400 font-medium text-sm text-center px-4">
            Upload Photo
          </div>
        )}

        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-opacity">
          <span className="text-white text-xs font-medium">
            {uploading ? 'Uploading...' : 'Change Photo'}
          </span>
        </div>
      </div>
      <p className="text-xs text-text-secondary">
        Recommended size: 500x500px. JPG, PNG, or WEBP.
      </p>
    </div>
  )
}

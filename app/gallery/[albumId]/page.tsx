'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, X, ChevronLeft, ChevronRight, Trash2, Calendar,
  ImageIcon, Play, FolderOpen, Tag
} from "lucide-react"

interface GalleryAlbum {
  id: string
  title: string
  description: string | null
  year: number
  category: string
  cover_image_url: string | null
  is_featured: boolean
  created_at: string
}

interface GalleryPhoto {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  category: string
  created_at: string
  is_approved: boolean
  album_id: string | null
  year: number | null
  media_type: string
}

export default function AlbumPage() {
  const params = useParams()
  const albumId = params.albumId as string
  const supabase = createClient()

  const [album, setAlbum] = useState<GalleryAlbum | null>(null)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        if (profile?.is_admin) setIsAdmin(true)
      }
    }
    getSession()
  }, [supabase])

  useEffect(() => {
    async function fetchAlbum() {
      setLoading(true)
      const [albumRes, photosRes] = await Promise.all([
        supabase.from('gallery_albums').select('*').eq('id', albumId).single(),
        supabase.from('gallery_photos').select('*').eq('album_id', albumId).order('created_at', { ascending: true }),
      ])

      if (albumRes.data) setAlbum(albumRes.data)
      if (photosRes.data) setPhotos(photosRes.data)
      setLoading(false)
    }
    if (albumId) fetchAlbum()
  }, [supabase, albumId])

  const visiblePhotos = isAdmin ? photos : photos.filter(p => p.is_approved !== false)
  const photoItems = visiblePhotos.filter(p => p.media_type !== 'video')
  const videoItems = visiblePhotos.filter(p => p.media_type === 'video')

  const lightboxPhoto = lightboxIndex !== null ? visiblePhotos[lightboxIndex] : null

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return
    const len = visiblePhotos.length
    if (direction === 'prev') setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : len - 1)
    else setLightboxIndex(lightboxIndex < len - 1 ? lightboxIndex + 1 : 0)
  }, [lightboxIndex, visiblePhotos.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
      if (e.key === 'ArrowRight') navigateLightbox('next')
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, navigateLightbox])

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!window.confirm("Delete this photo permanently?")) return
    try {
      const urlParts = photo.image_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      await supabase.storage.from('gallery').remove([fileName])
      const { error } = await supabase.from('gallery_photos').delete().eq('id', photo.id)
      if (error) throw error
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      if (lightboxIndex !== null) setLightboxIndex(null)
    } catch (err: any) {
      alert("Delete failed: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FolderOpen size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Album not found</h2>
          <Link href="/gallery" className="text-primary-orange hover:underline text-sm">Back to Gallery</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {album.cover_image_url && (
          <div className="absolute inset-0">
            <Image src={album.cover_image_url} alt="" fill className="object-cover opacity-15 blur-sm" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/60 via-bg-dark/80 to-bg-dark" />
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-orange/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-app relative z-10">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="badge-orange"><Calendar size={12} /> {album.year}</span>
              <span className="badge-blue"><Tag size={12} /> {album.category}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{album.title}</h1>

            {album.description && (
              <p className="text-gray-400 text-lg leading-relaxed mb-6">{album.description}</p>
            )}

            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} /> {photoItems.length} photo{photoItems.length !== 1 ? 's' : ''}
              </span>
              {videoItems.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Play size={14} /> {videoItems.length} video{videoItems.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="pb-24 relative z-10">
        <div className="container-app">
          {visiblePhotos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={32} className="text-white/20" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No photos in this album yet</h3>
              <p className="text-gray-500 text-sm">Photos will appear here once added to this album.</p>
            </div>
          ) : (
            <>
              {/* Photos section */}
              {photoItems.length > 0 && (
                <div className="mb-10">
                  <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                    {photoItems.map((photo) => {
                      const idx = visiblePhotos.indexOf(photo)
                      return (
                        <div
                          key={photo.id}
                          className="break-inside-avoid group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer bg-white/[0.02]"
                          onClick={() => setLightboxIndex(idx)}
                        >
                          {isAdmin && !photo.is_approved && (
                            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded-md">
                              Pending
                            </div>
                          )}
                          <Image
                            src={photo.image_url}
                            alt={photo.caption || "Memory"}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            {photo.caption && (
                              <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Videos section */}
              {videoItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Play size={18} className="text-primary-orange" />
                    Video Memories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoItems.map((video) => {
                      const idx = visiblePhotos.indexOf(video)
                      return (
                        <div
                          key={video.id}
                          className="group relative aspect-video rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer bg-white/[0.02]"
                          onClick={() => setLightboxIndex(idx)}
                        >
                          <video src={video.image_url} className="w-full h-full object-cover" muted preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-primary-orange/80 transition-colors">
                              <Play size={24} className="text-white ml-1" fill="white" />
                            </div>
                          </div>
                          {video.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                              <p className="text-white text-sm font-medium">{video.caption}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors cursor-pointer">
            <X size={28} />
          </button>

          {visiblePhotos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); navigateLightbox('prev') }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="relative max-w-5xl max-h-[85vh] w-full mx-16" onClick={e => e.stopPropagation()}>
            {lightboxPhoto.media_type === 'video' ? (
              <video
                src={lightboxPhoto.image_url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-lg bg-black"
              />
            ) : (
              <Image
                src={lightboxPhoto.image_url}
                alt={lightboxPhoto.caption || "Memory"}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                sizes="100vw"
                priority
              />
            )}
            <div className="flex items-center justify-between mt-4 px-2">
              <div>
                {lightboxPhoto.caption && (
                  <p className="text-white font-medium mb-1">{lightboxPhoto.caption}</p>
                )}
                <p className="text-gray-500 text-sm">
                  {new Date(lightboxPhoto.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              {(userId === lightboxPhoto.user_id || isAdmin) && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(lightboxPhoto) }}
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
            <p className="text-center text-gray-600 text-xs mt-3">
              {lightboxIndex + 1} / {visiblePhotos.length}
            </p>
          </div>

          {visiblePhotos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); navigateLightbox('next') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

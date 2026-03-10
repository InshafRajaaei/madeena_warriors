'use client'

import { useEffect, useState, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import {
  Camera, Upload, X, ChevronLeft, ChevronRight, Trash2, Loader2,
  ImageIcon, Star, Calendar, Play, Filter, FolderOpen, Clock,
  ChevronDown, Sparkles
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"

/* ─── Types ─── */
interface GalleryAlbum {
  id: string
  title: string
  description: string | null
  year: number
  category: string
  cover_image_url: string | null
  is_featured: boolean
  created_at: string
  photo_count?: number
  video_count?: number
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

/* ─── Constants ─── */
const DEFAULT_CATEGORIES = ["School Days", "Sports & Events", "Farewell 2018", "Reunions", "Achievements", "Campus Life", "General"]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR + 1 - 2009 + 1 }, (_, i) => 2009 + i)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_BATCH_FILES = 50
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

const YEAR_LABELS: Record<number, string> = {
  2009: 'The Beginning',
  2010: 'Early School Years',
  2011: 'Growing Together',
  2012: 'First Competitions',
  2013: 'Building Bonds',
  2014: 'Trips & Adventures',
  2015: 'Milestones',
  2016: 'Major Events',
  2017: 'The Final Stretch',
  2018: 'O/L Batch — Final Year',
}

export default function GalleryPage() {
  const supabase = createClient()

  /* ─── State ─── */
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'albums' | 'timeline' | 'videos'>('all')
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Upload state
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([])
  const [uploadCaption, setUploadCaption] = useState("")
  const [uploadCategory, setUploadCategory] = useState("General")
  const [uploadYear, setUploadYear] = useState<number>(2018)
  const [uploadAlbumId, setUploadAlbumId] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Expanded timeline years
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())

  /* ─── Fetch session ─── */
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

  /* ─── Fetch data ─── */
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const [photosRes, albumsRes, categoriesRes] = await Promise.all([
        supabase
          .from('gallery_photos')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('gallery_albums')
          .select('*')
          .order('year', { ascending: true }),
        supabase
          .from('gallery_categories')
          .select('name')
          .order('sort_order', { ascending: true })
      ])

      if (photosRes.data) setPhotos(photosRes.data)
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data.map((c: { name: string }) => c.name))
      }
      if (albumsRes.data && !albumsRes.error) {
        const albumsWithCounts = albumsRes.data.map((album: GalleryAlbum) => {
          const albumPhotos = (photosRes.data || []).filter((p: GalleryPhoto) => p.album_id === album.id && p.is_approved)
          return {
            ...album,
            photo_count: albumPhotos.filter((p: GalleryPhoto) => p.media_type !== 'video').length,
            video_count: albumPhotos.filter((p: GalleryPhoto) => p.media_type === 'video').length,
          }
        })
        setAlbums(albumsWithCounts)
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  /* ─── Derived data ─── */
  const visiblePhotos = isAdmin ? photos : photos.filter(p => p.is_approved !== false)

  const filteredPhotos = useMemo(() => {
    let result = visiblePhotos
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory)
    }
    if (activeYear !== null) {
      result = result.filter(p => p.year === activeYear)
    }
    if (activeFilter === 'videos') {
      result = result.filter(p => p.media_type === 'video')
    }
    return result
  }, [visiblePhotos, activeCategory, activeYear, activeFilter])

  const featuredAlbums = albums.filter(a => a.is_featured)

  const photosByYear = useMemo(() => {
    const grouped: Record<number, GalleryPhoto[]> = {}
    const photosForTimeline = activeCategory !== "All"
      ? visiblePhotos.filter(p => p.category === activeCategory)
      : visiblePhotos

    photosForTimeline.forEach(p => {
      const year = p.year || new Date(p.created_at).getFullYear()
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(p)
    })
    return grouped
  }, [visiblePhotos, activeCategory])

  const timelineYears = Object.keys(photosByYear).map(Number).sort((a, b) => b - a)

  const lightboxPhotos = useMemo(() => {
    if (activeFilter === 'timeline') {
      const flat: GalleryPhoto[] = []
      timelineYears.forEach(year => {
        if (photosByYear[year]) flat.push(...photosByYear[year])
      })
      return flat
    }
    return filteredPhotos
  }, [activeFilter, filteredPhotos, timelineYears, photosByYear])

  /* ─── Handlers ─── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return

    // Validate total count
    const totalCount = uploadFiles.length + selectedFiles.length
    if (totalCount > MAX_BATCH_FILES) {
      alert(`You can upload a maximum of ${MAX_BATCH_FILES} files at once. You selected ${totalCount}.`)
      return
    }

    const validFiles: File[] = []
    const previews: string[] = []
    const errors: string[] = []

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported format`)
        continue
      }
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
      if (file.size > maxSize) {
        errors.push(`${file.name}: too large (max ${maxSize / 1024 / 1024}MB for ${isVideo ? 'videos' : 'images'})`)
        continue
      }
      validFiles.push(file)
    }

    if (errors.length > 0) {
      alert(`Some files were skipped:\n${errors.join('\n')}`)
    }

    if (validFiles.length === 0) return

    // Generate previews for images (first 10 only to avoid memory issues), video thumbnail placeholder
    validFiles.forEach(file => {
      if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        previews.push('video:' + file.name)
      } else if (uploadFiles.length + validFiles.indexOf(file) < 10) {
        const reader = new FileReader()
        reader.onload = () => {
          setUploadPreviews(prev => {
            const next = [...prev]
            next[uploadFiles.length + validFiles.indexOf(file)] = reader.result as string
            return next
          })
        }
        reader.readAsDataURL(file)
        previews.push('') // placeholder, will be replaced by reader
      } else {
        previews.push('') // no preview for large batches
      }
    })

    setUploadFiles(prev => [...prev, ...validFiles])
    setUploadPreviews(prev => [...prev, ...previews])

    // Reset input so same files can be selected again
    e.target.value = ''
  }

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
    setUploadPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const clearUploadFiles = () => {
    setUploadFiles([])
    setUploadPreviews([])
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !userId) return
    setUploading(true)
    setUploadProgress({ current: 0, total: uploadFiles.length })

    const uploaded: GalleryPhoto[] = []
    const failed: string[] = []

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i]
      setUploadProgress({ current: i + 1, total: uploadFiles.length })

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file)
        if (storageError) throw storageError

        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName)
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
        const { data: newPhoto, error: insertError } = await supabase
          .from('gallery_photos')
          .insert({
            user_id: userId,
            image_url: urlData.publicUrl,
            caption: uploadFiles.length === 1 ? (uploadCaption.trim() || null) : null,
            category: uploadCategory,
            year: uploadYear,
            album_id: uploadAlbumId || null,
            media_type: isVideo ? 'video' : 'photo',
          })
          .select()
          .single()

        if (insertError) throw insertError
        uploaded.push(newPhoto)
      } catch {
        failed.push(file.name)
      }
    }

    if (uploaded.length > 0) {
      setPhotos(prev => [...uploaded, ...prev])
    }

    // Reset
    setShowUpload(false)
    setUploadFiles([])
    setUploadPreviews([])
    setUploadCaption("")
    setUploadCategory("General")
    setUploadYear(2018)
    setUploadAlbumId("")
    setUploadProgress({ current: 0, total: 0 })
    setUploading(false)

    if (failed.length > 0) {
      alert(`${uploaded.length} uploaded, ${failed.length} failed:\n${failed.join('\n')}\n\nUploaded files will appear once approved by an admin.`)
    } else {
      alert(`${uploaded.length} ${uploaded.length === 1 ? 'file' : 'files'} uploaded! ${uploaded.length === 1 ? 'It' : 'They'} will appear once approved by an admin.`)
    }
  }

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

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  /* ─── Lightbox ─── */
  const lightboxPhoto = lightboxIndex !== null ? lightboxPhotos[lightboxIndex] : null

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return
    const len = lightboxPhotos.length
    if (direction === 'prev') setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : len - 1)
    else setLightboxIndex(lightboxIndex < len - 1 ? lightboxIndex + 1 : 0)
  }, [lightboxIndex, lightboxPhotos.length])

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

  const openLightboxForPhoto = (photo: GalleryPhoto) => {
    const idx = lightboxPhotos.findIndex(p => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }

  /* ─── Render ─── */
  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app relative z-10 text-center">
          <div className="badge-orange mb-4 mx-auto">
            <Camera size={14} />
            Memory Archive
          </div>
          <h1 className="section-heading">
            Our Journey — <span className="text-gradient">Madeena Warriors</span>
          </h1>
          <p className="text-sm text-gray-500 font-semibold tracking-widest uppercase mt-2">2009 — Present</p>
          <div className="divider-line mt-5 mb-6" />
          <p className="section-subheading">
            Not just photos — these are the stories, memories, and moments that shaped our batch.
            Scroll through the years and relive every chapter.
          </p>

          {userId && (
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3 cursor-pointer"
            >
              <Upload size={18} />
              Share a Memory
            </button>
          )}
        </div>
      </section>

      {/* ─── Featured Memories ─── */}
      {featuredAlbums.length > 0 && (
        <section className="pb-16 relative z-10">
          <div className="container-app">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary-orange/10 flex items-center justify-center">
                <Sparkles size={16} className="text-primary-orange" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">Featured Memories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredAlbums.slice(0, 5).map(album => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 hover:border-primary-orange/30 transition-all duration-500"
                >
                  {album.cover_image_url ? (
                    <Image
                      src={album.cover_image_url}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-navy to-bg-dark flex items-center justify-center">
                      <FolderOpen size={48} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-primary-orange/90 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Featured
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-orange transition-colors">{album.title}</h3>
                    <div className="flex items-center gap-3 text-gray-300 text-xs">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {album.year}</span>
                      {(album.photo_count ?? 0) > 0 && <span className="flex items-center gap-1"><ImageIcon size={11} /> {album.photo_count} photos</span>}
                      {(album.video_count ?? 0) > 0 && <span className="flex items-center gap-1"><Play size={11} /> {album.video_count} videos</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── View Toggle & Filters ─── */}
      <section className="pb-6 relative z-10">
        <div className="container-app">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all' as const, label: 'All Memories', icon: ImageIcon },
                { key: 'timeline' as const, label: 'Journey Timeline', icon: Clock },
                { key: 'albums' as const, label: 'Albums', icon: FolderOpen },
                { key: 'videos' as const, label: 'Videos', icon: Play },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveFilter(tab.key); setActiveYear(null) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                    activeFilter === tab.key
                      ? 'bg-primary-orange text-white border-primary-orange shadow-lg shadow-primary-orange/20'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <Filter size={14} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="card-static p-5 mb-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {['All', ...categories].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        activeCategory === cat
                          ? 'bg-primary-orange/20 text-primary-orange border-primary-orange/30'
                          : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Year</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveYear(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      activeYear === null
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    All Years
                  </button>
                  {YEARS.map(year => (
                    <button
                      key={year}
                      onClick={() => setActiveYear(year)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        activeYear === year
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="py-4 pb-24 relative z-10">
        <div className="container-app">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              {/* ─── Albums View ─── */}
              {activeFilter === 'albums' && (
                <>
                  {albums.length === 0 ? (
                    <EmptyState
                      icon={<FolderOpen size={32} className="text-white/20" />}
                      title="No albums yet"
                      subtitle="Albums will be created by the admin to organize memories."
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {albums
                        .filter(a => activeYear === null || a.year === activeYear)
                        .filter(a => activeCategory === 'All' || a.category === activeCategory)
                        .map(album => (
                        <Link
                          key={album.id}
                          href={`/gallery/${album.id}`}
                          className="group card overflow-hidden"
                        >
                          <div className="relative aspect-[16/10]">
                            {album.cover_image_url ? (
                              <Image
                                src={album.cover_image_url}
                                alt={album.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-navy/50 to-bg-dark flex items-center justify-center">
                                <FolderOpen size={40} className="text-white/10" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-md">{album.year}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary-orange transition-colors">{album.title}</h3>
                            {album.description && (
                              <p className="text-gray-500 text-sm line-clamp-2 mb-2">{album.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-gray-600 text-xs">
                              <span className="flex items-center gap-1"><ImageIcon size={11} /> {album.photo_count ?? 0} photos</span>
                              {(album.video_count ?? 0) > 0 && <span className="flex items-center gap-1"><Play size={11} /> {album.video_count} videos</span>}
                              <span className="badge-orange text-[10px] px-1.5 py-0.5">{album.category}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ─── Timeline View ─── */}
              {activeFilter === 'timeline' && (
                <>
                  {timelineYears.length === 0 ? (
                    <EmptyState
                      icon={<Clock size={32} className="text-white/20" />}
                      title="No memories in timeline"
                      subtitle="Upload photos to see them organized by year."
                    />
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-orange via-blue-500 to-purple-500 opacity-30" />

                      <div className="space-y-8">
                        {timelineYears.map(year => {
                          const yearPhotos = photosByYear[year] || []
                          const isExpanded = expandedYears.has(year)
                          const displayPhotos = isExpanded ? yearPhotos : yearPhotos.slice(0, 6)

                          return (
                            <div key={year} className="relative pl-12 md:pl-20">
                              <div className="absolute left-4 md:left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-orange border-4 border-bg-dark z-10 mt-2" />

                              <div className="mb-4">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-2xl md:text-3xl font-black text-white">{year}</h3>
                                  <div className="h-px flex-1 bg-white/5" />
                                  <span className="text-xs text-gray-600 font-semibold">{yearPhotos.length} memories</span>
                                </div>
                                <p className="text-sm text-primary-orange font-semibold mt-1">
                                  {YEAR_LABELS[year] || 'Memories'}
                                </p>
                              </div>

                              {albums.filter(a => a.year === year).length > 0 && (
                                <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                                  {albums.filter(a => a.year === year).map(album => (
                                    <Link
                                      key={album.id}
                                      href={`/gallery/${album.id}`}
                                      className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary-orange/30 transition-all text-sm"
                                    >
                                      <FolderOpen size={14} className="text-primary-orange" />
                                      <span className="text-white font-medium whitespace-nowrap">{album.title}</span>
                                      <span className="text-gray-600 text-xs">{album.photo_count ?? 0}</span>
                                    </Link>
                                  ))}
                                </div>
                              )}

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {displayPhotos.map(photo => (
                                  <div
                                    key={photo.id}
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer bg-white/[0.02]"
                                    onClick={() => openLightboxForPhoto(photo)}
                                  >
                                    {isAdmin && !photo.is_approved && (
                                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded-md">
                                        Pending
                                      </div>
                                    )}
                                    {photo.media_type === 'video' ? (
                                      <>
                                        <video src={photo.image_url} className="object-cover w-full h-full" muted preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                          <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/20">
                                            <Play size={18} className="text-white ml-0.5" fill="white" />
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        src={photo.image_url}
                                        alt={photo.caption || "Memory"}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                      />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                      {photo.caption && (
                                        <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {yearPhotos.length > 6 && (
                                <button
                                  onClick={() => toggleYear(year)}
                                  className="mt-3 text-sm text-primary-orange hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {isExpanded ? 'Show less' : `Show all ${yearPhotos.length} memories`}
                                  <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ─── All / Videos View (Masonry Grid) ─── */}
              {(activeFilter === 'all' || activeFilter === 'videos') && (
                <>
                  {filteredPhotos.length === 0 ? (
                    <EmptyState
                      icon={<ImageIcon size={32} className="text-white/20" />}
                      title={activeFilter === 'videos' ? "No videos yet" : "No memories yet"}
                      subtitle={userId ? "Be the first to share a memory!" : "Login to start uploading."}
                    />
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm mb-6 text-center">
                        {filteredPhotos.length} {activeFilter === 'videos' ? 'video' : 'memor'}{filteredPhotos.length !== 1 ? (activeFilter === 'videos' ? 's' : 'ies') : (activeFilter === 'videos' ? '' : 'y')}
                      </p>
                      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {filteredPhotos.map((photo, i) => (
                          <div
                            key={photo.id}
                            className="break-inside-avoid group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer bg-white/[0.02]"
                            onClick={() => setLightboxIndex(i)}
                          >
                            <div className="relative w-full">
                              {isAdmin && !photo.is_approved && (
                                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-md">
                                  Pending
                                </div>
                              )}
                              {photo.media_type === 'video' ? (
                                <>
                                  <video src={photo.image_url} className="w-full h-auto object-cover" muted preload="metadata" />
                                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                      <Play size={24} className="text-white ml-1" fill="white" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <Image
                                  src={photo.image_url}
                                  alt={photo.caption || "Memory"}
                                  width={600}
                                  height={400}
                                  className="w-full h-auto object-cover"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div>
                                  {photo.caption && (
                                    <p className="text-white text-sm font-medium mb-1">{photo.caption}</p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <span>{photo.category}</span>
                                    {photo.year && <span>• {photo.year}</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── Upload Modal ─── */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setShowUpload(false)}>
          <div className="bg-[#0c1230] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => !uploading && setShowUpload(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer">
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload size={20} className="text-primary-orange" />
              Share Memories
            </h2>

            {/* File selection area */}
            <div className="mb-5">
              {uploadFiles.length > 0 ? (
                <div>
                  {/* Preview grid */}
                  <div className="grid grid-cols-4 gap-2 mb-3 max-h-[200px] overflow-y-auto rounded-xl border border-white/10 p-2 bg-black/20">
                    {uploadFiles.map((file, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/5">
                        {ALLOWED_VIDEO_TYPES.includes(file.type) ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <Play size={20} className="text-primary-orange mb-1" />
                            <span className="text-[9px] text-center px-1 truncate w-full">{file.name.split('.').pop()?.toUpperCase()}</span>
                          </div>
                        ) : uploadPreviews[idx] && !uploadPreviews[idx].startsWith('video:') ? (
                          <Image src={uploadPreviews[idx]} alt="" width={100} height={100} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        {!uploading && (
                          <button
                            onClick={() => removeUploadFile(idx)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-400">
                      <span className="text-white font-medium">{uploadFiles.length}</span> {uploadFiles.length === 1 ? 'file' : 'files'} selected
                      {uploadFiles.some(f => ALLOWED_VIDEO_TYPES.includes(f.type)) && (
                        <span className="text-primary-orange ml-1">
                          ({uploadFiles.filter(f => ALLOWED_VIDEO_TYPES.includes(f.type)).length} video{uploadFiles.filter(f => ALLOWED_VIDEO_TYPES.includes(f.type)).length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      {!uploading && (
                        <>
                          <label className="text-xs text-primary-orange hover:text-primary-orange/80 cursor-pointer transition-colors font-medium">
                            + Add more
                            <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={handleFileSelect} className="hidden" />
                          </label>
                          <button onClick={clearUploadFiles} className="text-xs text-gray-500 hover:text-red-400 cursor-pointer transition-colors">
                            Clear all
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-white/10 hover:border-primary-orange/40 rounded-xl p-10 text-center cursor-pointer transition-colors">
                  <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={handleFileSelect} className="hidden" />
                  <Camera size={32} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Click to select photos & videos</p>
                  <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP, MP4, WebM — up to 50 files</p>
                  <p className="text-gray-600 text-xs">Images max 10MB • Videos max 100MB</p>
                </label>
              )}
            </div>

            {/* Caption - only show for single file */}
            {uploadFiles.length <= 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Caption (optional)</label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={e => setUploadCaption(e.target.value)}
                  placeholder="Describe this memory..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 outline-none focus:border-primary-orange/50 transition-colors"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Year</label>
              <select
                value={uploadYear}
                onChange={e => setUploadYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-orange/50 transition-colors cursor-pointer appearance-none"
              >
                {YEARS.map(y => (
                  <option key={y} value={y} className="bg-[#0c1230]">{y}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
              <select
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-orange/50 transition-colors cursor-pointer appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#0c1230]">{cat}</option>
                ))}
              </select>
            </div>

            {albums.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Album (optional)</label>
                <select
                  value={uploadAlbumId}
                  onChange={e => setUploadAlbumId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-orange/50 transition-colors cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0c1230]">No album</option>
                  {albums.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#0c1230]">{a.title} ({a.year})</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploadFiles.length === 0 || uploading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading {uploadProgress.current} of {uploadProgress.total}...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  {uploadFiles.length <= 1 ? 'Share Memory' : `Upload ${uploadFiles.length} Files`}
                </>
              )}
            </button>

            {uploading && uploadProgress.total > 1 && (
              <div className="mt-3">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-orange to-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Lightbox ─── */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors cursor-pointer">
            <X size={28} />
          </button>

          {lightboxPhotos.length > 1 && (
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
                  {lightboxPhoto.category}
                  {lightboxPhoto.year && ` • ${lightboxPhoto.year}`}
                  {' • '}
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
              {lightboxIndex + 1} / {lightboxPhotos.length}
            </p>
          </div>

          {lightboxPhotos.length > 1 && (
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

/* ─── Helper Components ─── */
function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  )
}

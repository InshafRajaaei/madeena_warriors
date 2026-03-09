'use client'

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Camera, Upload, X, ChevronLeft, ChevronRight, Trash2, Loader2, ImageIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

const CATEGORIES = ["All", "School Days", "Sports & Events", "Farewell 2018", "Reunions", "Achievements", "Campus Life", "General"]

interface GalleryPhoto {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  category: string
  created_at: string
}

export default function GalleryPage() {
  const supabase = createClient()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Upload state
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadCaption, setUploadCaption] = useState("")
  const [uploadCategory, setUploadCategory] = useState("General")
  const [uploading, setUploading] = useState(false)

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Fetch session
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

  // Fetch photos
  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && !error) {
        setPhotos(data)
      }
      setLoading(false)
    }
    fetchPhotos()
  }, [supabase])

  // Filtered photos
  const filteredPhotos = activeCategory === "All" 
    ? photos 
    : photos.filter(p => p.category === activeCategory)

  // Constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only JPG, PNG, WebP, and GIF images are allowed.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
      return
    }

    setUploadFile(file)
    const reader = new FileReader()
    reader.onload = () => setUploadPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Handle upload
  const handleUpload = async () => {
    if (!uploadFile || !userId) return

    setUploading(true)
    try {
      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, uploadFile)

      if (storageError) throw storageError

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName)

      const { data: newPhoto, error: insertError } = await supabase
        .from('gallery_photos')
        .insert({
          user_id: userId,
          image_url: urlData.publicUrl,
          caption: uploadCaption.trim() || null,
          category: uploadCategory,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setPhotos(prev => [newPhoto, ...prev])
      setShowUpload(false)
      setUploadFile(null)
      setUploadPreview(null)
      setUploadCaption("")
      setUploadCategory("General")
    } catch (err: any) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Handle delete
  const handleDelete = async (photo: GalleryPhoto) => {
    if (!window.confirm("Delete this photo permanently?")) return

    try {
      // Extract file name from URL
      const urlParts = photo.image_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      await supabase.storage.from('gallery').remove([fileName])

      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id)

      if (error) throw error

      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      if (lightboxIndex !== null) setLightboxIndex(null)
    } catch (err: any) {
      alert("Delete failed: " + err.message)
    }
  }

  // Lightbox navigation
  const lightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return
    if (direction === 'prev') {
      setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filteredPhotos.length - 1)
    } else {
      setLightboxIndex(lightboxIndex < filteredPhotos.length - 1 ? lightboxIndex + 1 : 0)
    }
  }, [lightboxIndex, filteredPhotos.length])

  // Keyboard navigation for lightbox
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container-app relative z-10 text-center">
          <div className="badge-orange mb-4 mx-auto">
            <Camera size={14} />
            Memory Archive
          </div>
          <h1 className="section-heading">
            Batch 2018 <span className="text-gradient">Gallery</span>
          </h1>
          <div className="divider-line mt-5 mb-6" />
          <p className="section-subheading">
            A shared collection of moments from school days, events, and reunions.
          </p>

          {userId && (
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3 cursor-pointer"
            >
              <Upload size={18} />
              Upload Photo
            </button>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-6 relative z-10">
        <div className="container-app">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-primary-orange text-white border-primary-orange shadow-lg shadow-primary-orange/20'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 pb-24 relative z-10">
        <div className="container-app">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin" />
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={32} className="text-white/20" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {activeCategory === "All" ? "No photos yet" : `No photos in "${activeCategory}"`}
              </h3>
              <p className="text-gray-500 text-sm">
                {userId ? "Be the first to share a memory!" : "Login to start uploading photos."}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-6 text-center">{filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}</p>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {filteredPhotos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="break-inside-avoid group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer bg-white/[0.02]"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="relative w-full">
                      <Image
                        src={photo.image_url}
                        alt={photo.caption || "Gallery photo"}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          {photo.caption && (
                            <p className="text-white text-sm font-medium mb-1">{photo.caption}</p>
                          )}
                          <span className="text-xs text-gray-300">{photo.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setShowUpload(false)}>
          <div className="bg-[#0c1230] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => !uploading && setShowUpload(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer">
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload size={20} className="text-primary-orange" />
              Upload Photo
            </h2>

            {/* File Input */}
            <div className="mb-5">
              {uploadPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 mb-3">
                  <Image src={uploadPreview} alt="Preview" width={500} height={300} className="w-full h-auto max-h-[250px] object-contain bg-black/40" />
                  <button
                    onClick={() => { setUploadFile(null); setUploadPreview(null) }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500/60 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-white/10 hover:border-primary-orange/40 rounded-xl p-10 text-center cursor-pointer transition-colors">
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <Camera size={32} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Click or drag a photo here</p>
                  <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP — max 10MB</p>
                </label>
              )}
            </div>

            {/* Caption */}
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

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
              <select
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-orange/50 transition-colors cursor-pointer appearance-none"
              >
                {CATEGORIES.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat} className="bg-[#0c1230]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          {/* Close */}
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors cursor-pointer">
            <X size={28} />
          </button>

          {/* Nav - Previous */}
          {filteredPhotos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); navigateLightbox('prev') }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full mx-16" onClick={e => e.stopPropagation()}>
            <Image
              src={lightboxPhoto.image_url}
              alt={lightboxPhoto.caption || "Gallery photo"}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              sizes="100vw"
              priority
            />
            {/* Info bar */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div>
                {lightboxPhoto.caption && (
                  <p className="text-white font-medium mb-1">{lightboxPhoto.caption}</p>
                )}
                <p className="text-gray-500 text-sm">
                  {lightboxPhoto.category} &middot; {new Date(lightboxPhoto.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
            {/* Counter */}
            <p className="text-center text-gray-600 text-xs mt-3">
              {lightboxIndex + 1} / {filteredPhotos.length}
            </p>
          </div>

          {/* Nav - Next */}
          {filteredPhotos.length > 1 && (
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

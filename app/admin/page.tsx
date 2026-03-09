'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, Trash2, ShieldAlert, Clock, UserCheck, Users, Camera, ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingProfiles, setPendingProfiles] = useState<any[]>([])
  const [approvedCount, setApprovedCount] = useState(0)
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([])

  useEffect(() => {
    async function checkAdminAndLoad() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
        
      if (!profile?.is_admin) {
        router.push('/dashboard')
        return
      }
      
      setIsAdmin(true)

      const { data: pending } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })
        
      if (pending) setPendingProfiles(pending)

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)
      
      if (count) setApprovedCount(count)

      // Fetch pending gallery photos
      const { data: pendingGallery } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })
      
      if (pendingGallery) setPendingPhotos(pendingGallery)
      
      setLoading(false)
    }

    checkAdminAndLoad()
  }, [supabase, router])

  const handleApprove = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to approve ${name}?`)) return
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', id)
      
    if (!error) {
      setPendingProfiles(pendingProfiles.filter(p => p.id !== id))
      setApprovedCount(prev => prev + 1)
    } else {
      alert("Failed to approve: " + error.message)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to DELETE ${name} permanently?`)) return
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      
    if (!error) {
      setPendingProfiles(pendingProfiles.filter(p => p.id !== id))
    } else {
      alert("Failed to delete: " + error.message)
    }
  }

  const handleApprovePhoto = async (id: string) => {
    const { error } = await supabase
      .from('gallery_photos')
      .update({ is_approved: true })
      .eq('id', id)
    
    if (!error) {
      setPendingPhotos(pendingPhotos.filter(p => p.id !== id))
    } else {
      alert("Failed to approve photo: " + error.message)
    }
  }

  const handleRejectPhoto = async (id: string) => {
    if (!window.confirm('Delete this photo permanently?')) return
    
    const photo = pendingPhotos.find(p => p.id === id)
    if (photo) {
      const urlParts = photo.image_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      await supabase.storage.from('gallery').remove([fileName])
    }
    
    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setPendingPhotos(pendingPhotos.filter(p => p.id !== id))
    } else {
      alert("Failed to delete photo: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Verifying credentials...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container-app relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert size={28} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Admin Panel</h1>
              <p className="text-gray-500 mt-1">Review and approve new batch members.</p>
            </div>
          </div>
          <div className="divider-line mt-6" />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clock size={20} className="text-primary-orange" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gradient">{pendingProfiles.length}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <UserCheck size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gradient-blue">{approvedCount}</p>
                  <p className="text-xs text-gray-500">Approved</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{pendingProfiles.length + approvedCount}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pending List */}
      <section className="pb-20 relative z-10">
        <div className="container-app">
          <div className="card-static p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock size={18} className="text-primary-orange" />
              Pending Approvals
            </h2>

            {pendingProfiles.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                <UserCheck size={40} className="mx-auto text-green-400/50 mb-4" />
                <p className="text-gray-500 font-medium">All clear! No pending approvals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProfiles.map(profile => (
                  <div key={profile.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary-navy/50 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(profile.first_name?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{profile.first_name} {profile.last_name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Joined {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(profile.id, `${profile.first_name} ${profile.last_name}`)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-green-500/20"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id, `${profile.first_name} ${profile.last_name}`)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
                      >
                        <Trash2 size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pending Gallery Photos */}
      <section className="pb-20 relative z-10">
        <div className="container-app">
          <div className="card-static p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Camera size={18} className="text-purple-400" />
              Pending Gallery Photos
              {pendingPhotos.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/20">
                  {pendingPhotos.length}
                </span>
              )}
            </h2>

            {pendingPhotos.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                <ImageIcon size={40} className="mx-auto text-green-400/50 mb-4" />
                <p className="text-gray-500 font-medium">No pending photos to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingPhotos.map(photo => (
                  <div key={photo.id} className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                    <div className="relative w-full h-48">
                      <Image
                        src={photo.image_url}
                        alt={photo.caption || "Pending photo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      {photo.caption && (
                        <p className="text-sm text-gray-300 mb-1 truncate">{photo.caption}</p>
                      )}
                      <p className="text-xs text-gray-600 mb-3">
                        {photo.category} &middot; {new Date(photo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePhoto(photo.id)}
                          className="flex-1 px-3 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-green-500/20"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectPhoto(photo.id)}
                          className="flex-1 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
                        >
                          <Trash2 size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

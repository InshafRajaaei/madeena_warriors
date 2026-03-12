import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Briefcase, GraduationCap, LinkIcon, Mail, ArrowLeft, Edit3, Clock, Globe, Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    return notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === profile.id

  let isAdmin = false
  if (user) {
    const { data: adminCheck } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    isAdmin = adminCheck?.is_admin || false
  }

  const privacy = profile.privacy || {}
  const showLocation = isOwner || !privacy.hide_location
  const showContact = isOwner || !privacy.hide_contact
  const showEducation = isOwner || !privacy.hide_education

  if (!profile.is_approved && !isOwner && !isAdmin) {
    return (
      <div className="container-app py-20 flex flex-col items-center justify-center text-center">
        <div className="card-static p-12 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary-orange/10 border border-primary-orange/20 flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-primary-orange" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Profile Pending Approval</h1>
          <p className="text-gray-400">This member&apos;s profile is currently waiting for admin approval.</p>
        </div>
      </div>
    )
  }

  const hasContactLinks = showContact && (profile.contact_links?.facebook || profile.contact_links?.instagram || profile.contact_links?.linkedin || profile.contact_links?.email)

  return (
    <div className="container-app py-10 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/directory" className="text-gray-400 hover:text-primary-orange text-sm font-medium flex items-center gap-2 transition-colors w-fit">
            <ArrowLeft size={16} />
            Back to Directory
          </Link>
        </div>

        <div className="card-static overflow-hidden">
          {/* Banner */}
          <div className="h-36 md:h-52 bg-gradient-to-r from-primary-navy via-[#1a287a] to-primary-navy relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec7c08' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050A1F]/80 to-transparent" />
          </div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar + Edit Button */}
            <div className="relative flex justify-between items-end -mt-16 md:-mt-20 mb-8">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#0a1230] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden bg-primary-navy">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={`${profile.first_name} ${profile.last_name}`} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 112px, 144px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white">
                    {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                  </div>
                )}
              </div>

              {isOwner && (
                <Link href="/dashboard" className="btn-outline text-sm px-5 py-2 hidden sm:flex items-center gap-2">
                  <Edit3 size={14} />
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                  {profile.first_name} {profile.last_name}
                </h1>
                
                {profile.job_title && (
                  <p className="text-lg text-primary-orange font-medium mb-6">
                    {profile.job_title}
                  </p>
                )}

                {/* Info Cards */}
                <div className="space-y-4 mt-6">
                  {showLocation && profile.current_country && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0 border border-green-500/20">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase tracking-widest font-semibold text-gray-500">Current Location</span>
                        <span className="font-medium text-white">
                          {profile.current_city && `${profile.current_city}, `}{profile.current_country}
                        </span>
                      </div>
                    </div>
                  )}

                  {showEducation && profile.education && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 border border-blue-500/20">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase tracking-widest font-semibold text-gray-500">Education</span>
                        <span className="font-medium text-white">{profile.education}</span>
                      </div>
                    </div>
                  )}

                  {profile.job_title && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-orange/10 flex items-center justify-center text-primary-orange flex-shrink-0 border border-primary-orange/20">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase tracking-widest font-semibold text-gray-500">Profession</span>
                        <span className="font-medium text-white">{profile.job_title}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Sidebar */}
              {hasContactLinks && (
                <div className="w-full lg:w-72">
                  <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                    <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} className="text-primary-orange" />
                      Connect
                    </h3>
                    <div className="space-y-3">
                      {profile.contact_links?.facebook && (
                        <a href={profile.contact_links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#1877f2] transition-colors duration-200 text-sm font-medium group">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#1877f2]/10 transition-colors">
                            <Facebook size={14} />
                          </div>
                          Facebook
                        </a>
                      )}
                      {profile.contact_links?.instagram && (
                        <a href={profile.contact_links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#e4405f] transition-colors duration-200 text-sm font-medium group">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#e4405f]/10 transition-colors">
                            <Instagram size={14} />
                          </div>
                          Instagram
                        </a>
                      )}
                      {profile.contact_links?.linkedin && (
                        <a href={profile.contact_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#0a66c2] transition-colors duration-200 text-sm font-medium group">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#0a66c2]/10 transition-colors">
                            <LinkIcon size={14} />
                          </div>
                          LinkedIn
                        </a>
                      )}
                      {profile.contact_links?.email && (
                        <a href={`mailto:${profile.contact_links.email}`} className="flex items-center gap-3 text-gray-400 hover:text-primary-orange transition-colors duration-200 text-sm font-medium group">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary-orange/10 transition-colors">
                            <Mail size={14} />
                          </div>
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Edit Button */}
            {isOwner && (
              <div className="mt-8 sm:hidden">
                <Link href="/dashboard" className="btn-outline text-sm w-full text-center flex items-center justify-center gap-2">
                  <Edit3 size={14} />
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

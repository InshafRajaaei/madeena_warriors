'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import AvatarUpload from '@/components/profile/AvatarUpload'
import { Eye, Save, Briefcase, GraduationCap, MapPin, Mail, Linkedin, Globe, Clock, AlertCircle, CheckCircle2, User } from 'lucide-react'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [education, setEducation] = useState('')
  const [currentCountry, setCurrentCountry] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [emailLink, setEmailLink] = useState('')
  const [linkedinLink, setLinkedinLink] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setProfile(data)
        setAvatarUrl(data.avatar_url || null)
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setJobTitle(data.job_title || '')
        setEducation(data.education || '')
        setCurrentCountry(data.current_country || '')
        setCurrentCity(data.current_city || '')
        setEmailLink(data.contact_links?.email || '')
        setLinkedinLink(data.contact_links?.linkedin || '')
        setWebsiteLink(data.contact_links?.website || '')
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) return

    const updates = {
      id: session.user.id,
      avatar_url: avatarUrl,
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      education: education,
      current_country: currentCountry,
      current_city: currentCity,
      contact_links: {
        email: emailLink,
        linkedin: linkedinLink,
        website: websiteLink
      },
      updated_at: new Date()
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Profile updated successfully!')
      router.refresh()
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="container-app py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin" />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    )
  }

  if (profile && !profile.is_approved && !profile.is_admin) {
    return (
      <div className="container-app py-20 flex flex-col items-center justify-center text-center">
        <div className="card-static p-12 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary-orange/10 border border-primary-orange/20 flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-primary-orange" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">Pending Approval</h1>
          <p className="text-gray-400 leading-relaxed">
            Your account is waiting for admin approval to verify you are part of the 2018 batch. 
            Once approved, you&apos;ll be able to edit your profile and appear in the directory.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-10 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Your <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-light">Update your professional details and contact information.</p>
        </div>
        {profile?.id && (
          <Link href={`/profile/${profile.id}`} className="btn-outline flex items-center gap-2 text-sm">
            <Eye size={16} />
            View Public Profile
          </Link>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="card-static p-6 md:p-10">
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Status Messages */}
            {message && (
              <div className="flex items-start gap-3 bg-green-500/10 text-green-400 p-4 rounded-xl text-sm border border-green-500/20">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                {message}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Avatar & Name Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-white/10">
              <AvatarUpload 
                url={avatarUrl} 
                onUpload={(url) => setAvatarUrl(url)} 
              />
              
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="label-field" htmlFor="firstName">
                    <User size={14} className="inline mr-1.5 text-gray-500" />
                    First Name
                  </label>
                  <input id="firstName" type="text" className="input-field opacity-60 cursor-not-allowed" value={firstName} disabled />
                  <p className="text-xs text-gray-600 mt-1.5">Contact an admin to change your name.</p>
                </div>
                <div>
                  <label className="label-field" htmlFor="lastName">
                    <User size={14} className="inline mr-1.5 text-gray-500" />
                    Last Name
                  </label>
                  <input id="lastName" type="text" className="input-field opacity-60 cursor-not-allowed" value={lastName} disabled />
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-orange/10 flex items-center justify-center">
                  <Briefcase size={16} className="text-primary-orange" />
                </span>
                Current Status
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="label-field" htmlFor="jobTitle">
                    <Briefcase size={14} className="inline mr-1.5 text-gray-500" />
                    Job Title / Profession
                  </label>
                  <input id="jobTitle" type="text" className="input-field" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer, Medical Student" />
                </div>
                <div>
                  <label className="label-field" htmlFor="education">
                    <GraduationCap size={14} className="inline mr-1.5 text-gray-500" />
                    Education
                  </label>
                  <input id="education" type="text" className="input-field" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. BSc Computer Science at XYZ University" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field" htmlFor="currentCountry">
                      <Globe size={14} className="inline mr-1.5 text-gray-500" />
                      Current Country
                    </label>
                    <input id="currentCountry" type="text" className="input-field" value={currentCountry} onChange={(e) => setCurrentCountry(e.target.value)} placeholder="e.g. Sri Lanka, UAE, UK" />
                  </div>
                  <div>
                    <label className="label-field" htmlFor="currentCity">
                      <MapPin size={14} className="inline mr-1.5 text-gray-500" />
                      Current City / District
                    </label>
                    <input id="currentCity" type="text" className="input-field" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} placeholder="e.g. Colombo, Ampara, Dubai" />
                    <p className="text-xs text-gray-600 mt-1.5">Required to appear on the Maps.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Links */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail size={16} className="text-blue-400" />
                </span>
                Contact Links
              </h3>
              <p className="text-sm text-gray-500 mb-5">Optional — let classmates connect with you professionally.</p>
              <div className="space-y-5">
                <div>
                  <label className="label-field" htmlFor="emailLink">
                    <Mail size={14} className="inline mr-1.5 text-gray-500" />
                    Public Contact Email
                  </label>
                  <input id="emailLink" type="email" className="input-field" value={emailLink} onChange={(e) => setEmailLink(e.target.value)} placeholder="hello@example.com" />
                </div>
                <div>
                  <label className="label-field" htmlFor="linkedinLink">
                    <Linkedin size={14} className="inline mr-1.5 text-gray-500" />
                    LinkedIn URL
                  </label>
                  <input id="linkedinLink" type="url" className="input-field" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className="label-field" htmlFor="websiteLink">
                    <Globe size={14} className="inline mr-1.5 text-gray-500" />
                    Personal Website
                  </label>
                  <input id="websiteLink" type="url" className="input-field" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} placeholder="https://yourwebsite.com" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3" disabled={saving}>
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

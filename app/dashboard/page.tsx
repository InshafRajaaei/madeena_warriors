'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import AvatarUpload from '@/components/profile/AvatarUpload'
import { Eye, Save, Briefcase, GraduationCap, MapPin, Mail, Linkedin, Globe, Clock, AlertCircle, CheckCircle2, User, Shield, Facebook, Instagram } from 'lucide-react'
import { COUNTRIES, SRI_LANKA_CITIES, INTERNATIONAL_CITIES } from '@/lib/locations'

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
  const [facebookLink, setFacebookLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [linkedinLink, setLinkedinLink] = useState('')
  const [emailLink, setEmailLink] = useState('')
  const [hideLocation, setHideLocation] = useState(false)
  const [hideContact, setHideContact] = useState(false)
  const [hideEducation, setHideEducation] = useState(false)

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
        setFacebookLink(data.contact_links?.facebook || '')
        setInstagramLink(data.contact_links?.instagram || '')
        setLinkedinLink(data.contact_links?.linkedin || '')
        setEmailLink(data.contact_links?.email || '')
        setHideLocation(data.privacy?.hide_location || false)
        setHideContact(data.privacy?.hide_contact || false)
        setHideEducation(data.privacy?.hide_education || false)
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
        facebook: facebookLink,
        instagram: instagramLink,
        linkedin: linkedinLink,
        email: emailLink
      },
      privacy: {
        hide_location: hideLocation,
        hide_contact: hideContact,
        hide_education: hideEducation,
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

      {/* Profile Completeness */}
      {(() => {
        const fields = [avatarUrl, jobTitle, education, currentCountry, currentCity, facebookLink || instagramLink || linkedinLink || emailLink]
        const filled = fields.filter(Boolean).length
        const percent = Math.round((filled / fields.length) * 100)
        return (
          <div className="card-static p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Profile Completion</h3>
              <span className={`text-sm font-black ${percent === 100 ? 'text-green-400' : 'text-primary-orange'}`}>{percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-orange to-yellow-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            {percent < 100 && (
              <p className="text-xs text-gray-600 mt-2">
                Complete your {!avatarUrl ? 'photo, ' : ''}{!jobTitle ? 'job title, ' : ''}{!education ? 'education, ' : ''}{!currentCountry ? 'country, ' : ''}{!currentCity ? 'city, ' : ''}{!(facebookLink || instagramLink || linkedinLink || emailLink) ? 'contact links' : ''}
              </p>
            )}
          </div>
        )
      })()}

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
                    <select
                      id="currentCountry"
                      className="input-field appearance-none cursor-pointer"
                      value={currentCountry}
                      onChange={(e) => { setCurrentCountry(e.target.value); setCurrentCity(''); }}
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-field" htmlFor="currentCity">
                      <MapPin size={14} className="inline mr-1.5 text-gray-500" />
                      Current City / District
                    </label>
                    <select
                      id="currentCity"
                      className="input-field appearance-none cursor-pointer"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      {currentCountry === 'Sri Lanka'
                        ? Object.entries(SRI_LANKA_CITIES).map(([district, cities]) => (
                            <optgroup key={district} label={`${district} District`}>
                              {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                              ))}
                            </optgroup>
                          ))
                        : (INTERNATIONAL_CITIES[currentCountry] || []).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))
                      }
                    </select>
                    <p className="text-xs text-gray-600 mt-1.5">Required to appear on the Maps. Select your country first.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Links */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe size={16} className="text-blue-400" />
                </span>
                Social & Contact Links
              </h3>
              <p className="text-sm text-gray-500 mb-5">Optional — let classmates connect with you on social media.</p>
              <div className="space-y-5">
                <div>
                  <label className="label-field" htmlFor="facebookLink">
                    <Facebook size={14} className="inline mr-1.5 text-gray-500" />
                    Facebook Profile
                  </label>
                  <input id="facebookLink" type="url" className="input-field" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/username" />
                </div>
                <div>
                  <label className="label-field" htmlFor="instagramLink">
                    <Instagram size={14} className="inline mr-1.5 text-gray-500" />
                    Instagram Handle
                  </label>
                  <input id="instagramLink" type="url" className="input-field" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://instagram.com/username" />
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-600 mb-4">Professional links (optional)</p>
                  <div className="space-y-5">
                    <div>
                      <label className="label-field" htmlFor="linkedinLink">
                        <Linkedin size={14} className="inline mr-1.5 text-gray-500" />
                        LinkedIn URL
                      </label>
                      <input id="linkedinLink" type="url" className="input-field" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div>
                      <label className="label-field" htmlFor="emailLink">
                        <Mail size={14} className="inline mr-1.5 text-gray-500" />
                        Public Contact Email
                      </label>
                      <input id="emailLink" type="email" className="input-field" value={emailLink} onChange={(e) => setEmailLink(e.target.value)} placeholder="hello@example.com" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield size={16} className="text-purple-400" />
                </span>
                Privacy Controls
              </h3>
              <p className="text-sm text-gray-500 mb-5">Choose what information is visible on your public profile.</p>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-green-400" />
                    <div>
                      <span className="text-sm font-medium text-white">Hide Location</span>
                      <p className="text-xs text-gray-600">Country and city won&apos;t appear on your profile</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={hideLocation} onChange={(e) => setHideLocation(e.target.checked)} className="w-5 h-5 rounded accent-primary-orange cursor-pointer" />
                </label>
                <label className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-400" />
                    <div>
                      <span className="text-sm font-medium text-white">Hide Contact Links</span>
                      <p className="text-xs text-gray-600">All social and contact links won&apos;t be shown</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={hideContact} onChange={(e) => setHideContact(e.target.checked)} className="w-5 h-5 rounded accent-primary-orange cursor-pointer" />
                </label>
                <label className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <GraduationCap size={16} className="text-yellow-400" />
                    <div>
                      <span className="text-sm font-medium text-white">Hide Education</span>
                      <p className="text-xs text-gray-600">Education details won&apos;t appear publicly</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={hideEducation} onChange={(e) => setHideEducation(e.target.checked)} className="w-5 h-5 rounded accent-primary-orange cursor-pointer" />
                </label>
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

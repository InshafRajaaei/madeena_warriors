'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Briefcase, GraduationCap, X, Users } from 'lucide-react'

interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  current_country: string | null
  current_city: string | null
  job_title: string | null
  education: string | null
}

// Fisher-Yates shuffle
function shuffleArray(array: Profile[]) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function DirectoryGrid({ profiles }: { profiles: Profile[] }) {
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('')

  // Shuffle once on mount
  const shuffled = useMemo(() => shuffleArray(profiles), [profiles])

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set<string>()
    profiles.forEach(p => {
      if (p.current_country) set.add(p.current_country.trim())
    })
    return Array.from(set).sort()
  }, [profiles])

  // Filtered results
  const filtered = useMemo(() => {
    let result = shuffled
    
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => 
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
        (p.job_title && p.job_title.toLowerCase().includes(q)) ||
        (p.education && p.education.toLowerCase().includes(q)) ||
        (p.current_country && p.current_country.toLowerCase().includes(q)) ||
        (p.current_city && p.current_city.toLowerCase().includes(q))
      )
    }

    if (filterCountry) {
      result = result.filter(p => p.current_country?.trim() === filterCountry)
    }

    return result
  }, [shuffled, search, filterCountry])

  const hasFilters = search.trim() || filterCountry

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="card-static p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, profession, country..."
              className="input-field pl-12 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Country Filter */}
          <select
            className="input-field md:w-56 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%236b7280%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')] bg-[position:right_12px_center] bg-no-repeat bg-[length:16px]"
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Active filters & count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <p className="text-sm text-gray-500">
            <span className="text-primary-orange font-bold">{filtered.length}</span> {filtered.length === 1 ? 'member' : 'members'} found
          </p>
          {hasFilters && (
            <button 
              onClick={() => { setSearch(''); setFilterCountry('') }}
              className="text-xs text-primary-orange hover:text-primary-orange/80 font-medium transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card-static text-center py-20">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">
            {profiles.length === 0 
              ? 'No members have been approved yet. Check back soon!'
              : 'No members found matching your search.'}
          </p>
          {hasFilters && (
            <button 
              onClick={() => { setSearch(''); setFilterCountry('') }}
              className="btn-outline mt-6 text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((profile) => (
            <Link 
              key={profile.id} 
              href={`/profile/${profile.id}`} 
              className="card group hover:-translate-y-1 flex flex-col items-center p-6 text-center"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-primary-orange/40 flex-shrink-0 relative transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-navy to-primary-navy/60 flex items-center justify-center text-white text-xl font-bold">
                    {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-orange transition-colors">
                {profile.first_name} {profile.last_name}
              </h3>
              
              <div className="flex flex-col gap-2 mt-3 w-full border-t border-white/5 pt-3">
                {profile.job_title && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                    <Briefcase size={13} className="text-primary-orange flex-shrink-0" />
                    <span className="truncate">{profile.job_title}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                    <GraduationCap size={13} className="text-blue-400 flex-shrink-0" />
                    <span className="truncate">{profile.education}</span>
                  </div>
                )}
                {profile.current_country && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                    <MapPin size={13} className="text-green-400 flex-shrink-0" />
                    <span className="truncate">{profile.current_country}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import DirectoryGrid from './DirectoryGrid'

export default async function DirectoryPage() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, current_country, current_city, job_title, education')
    .eq('is_approved', true)

  if (error) {
    console.error('Error fetching directory:', error)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container-app relative z-10 text-center">
          <div className="badge-orange mb-4 mx-auto">
            <Users size={14} />
            Where Are They Now
          </div>
          <h1 className="section-heading">Batch <span className="text-gradient">Directory</span></h1>
          <div className="divider-line mt-5 mb-6" />
          <p className="section-subheading">
            Explore where the Madeena Warriors are today. The order is randomized on every visit to ensure equal visibility.
          </p>
        </div>
      </section>

      {/* Directory Grid with Search */}
      <section className="pb-20 relative z-10">
        <div className="container-app">
          <DirectoryGrid profiles={profiles || []} />
        </div>
      </section>
    </div>
  )
}

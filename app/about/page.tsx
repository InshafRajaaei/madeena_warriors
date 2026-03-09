import { GraduationCap, Heart, MapPin, Users, Calendar, Star, BookOpen, Trophy } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-primary-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app relative z-10 text-center">
          <div className="badge-orange mb-4 mx-auto">
            <BookOpen size={14} />
            Our Story
          </div>
          <h1 className="section-heading">
            The <span className="text-gradient">Madeena Warriors</span>
          </h1>
          <div className="divider-line mt-5 mb-6" />
          <p className="section-subheading max-w-3xl mx-auto">
            The very first O/L batch (2018) of KM Maruthamunai Al-Madeena Vidyalaya — a bond forged 
            during our formative years that continues to define who we are today.
          </p>
        </div>
      </section>

      {/* The School */}
      <section className="pb-20 relative z-10">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge-blue mb-4">
                <GraduationCap size={14} />
                The School
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                KM Maruthamunai <span className="text-gradient-blue">Al-Madeena Vidyalaya</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Al-Madeena Vidyalaya is located in Maruthamunai, Ampara District, Eastern Province 
                  of Sri Lanka. The school has been a beacon of education in the local community, 
                  nurturing generations of students with quality education and strong values.
                </p>
                <p>
                  Our batch entered the school with dreams and left with memories and skills that are 
                  now scattered across the globe — from the streets of Colombo to cities across 
                  the Middle East, Europe, and beyond.
                </p>
              </div>
            </div>
            <div className="card-static p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-primary-orange/10 border border-primary-orange/20 flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={40} className="text-primary-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Al-Madeena Vidyalaya</h3>
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <MapPin size={14} /> Maruthamunai, Ampara, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24 relative z-10">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="badge-orange mb-4 mx-auto">
              <Calendar size={14} />
              Our Journey
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              A <span className="text-gradient">Timeline</span> of Memories
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-orange via-blue-500 to-purple-500 md:-translate-x-px" />

            {[
              { year: '2009', title: 'The Beginning', description: 'We entered Al-Madeena Vidyalaya as young students, starting a journey that would shape our futures. Fresh faces, new friendships, and endless possibilities.', icon: Star, color: 'orange' },
              { year: '2018', title: 'O/L Examination', description: 'The defining moment — our batch sat for the O/L examination together. Years of hard work culminated in this milestone that marked the transition from school to the wider world.', icon: Trophy, color: 'blue' },
              { year: '2019', title: 'Paths Diverge', description: 'Some continued to A/Levels, others pursued vocational training, and many began their professional journeys. The batch scattered but the bond stayed strong.', icon: Users, color: 'purple' },
              { year: 'Today', title: 'Warriors Worldwide', description: 'From local businesses to international careers, the Madeena Warriors are making their mark across the globe. This platform reconnects us and celebrates every journey.', icon: Heart, color: 'red' }
            ].map((item, i) => (
              <div key={item.year} className={`relative flex items-start gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-0`}>
                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-0 md:text-right' : 'md:pl-0 md:text-left'}`}>
                  <div className="card-static p-6 hover:border-white/10 transition-colors">
                    <span className={`text-sm font-black ${item.color === 'orange' ? 'text-primary-orange' : item.color === 'blue' ? 'text-blue-400' : item.color === 'purple' ? 'text-purple-400' : 'text-red-400'}`}>
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-4 border-[#050A1F] z-10 mt-8" />

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why "Warriors" */}
      <section className="pb-24 relative z-10">
        <div className="container-app">
          <div className="card-static p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-orange via-gold to-primary-orange" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Why &ldquo;Warriors&rdquo;?
            </h2>
            <div className="divider-line mb-6" />
            <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
              The name &ldquo;Madeena Warriors&rdquo; represents the fighting spirit of our batch. 
              Through challenges, exams, life transitions, and growing up together — we approached 
              everything with resilience and unity. The warrior spirit isn&apos;t about competition 
              among ourselves, but about each member&apos;s personal battle to succeed and uplift 
              those around them.
            </p>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-black text-gradient">Unity</div>
                <p className="text-xs text-gray-600 mt-1">Our Foundation</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-gradient-blue">Resilience</div>
                <p className="text-xs text-gray-600 mt-1">Our Strength</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-gradient">Growth</div>
                <p className="text-xs text-gray-600 mt-1">Our Goal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-24 relative z-10">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              What This Platform <span className="text-gradient">Stands For</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: 'Reconnection', desc: 'Stay connected with every batch member, no matter where life takes them.', color: 'blue' },
              { icon: Heart, title: 'No Comparison', desc: 'No academic rankings. Every journey is unique and equally valued here.', color: 'red' },
              { icon: Star, title: 'Celebrate All', desc: 'From local heroes to global achievers — every story deserves the spotlight.', color: 'orange' },
              { icon: MapPin, title: 'Privacy First', desc: 'Share only what you want. No forced data disclosure, ever.', color: 'green' }
            ].map(val => (
              <div key={val.title} className="card-static p-6 text-center group hover:border-white/10 transition-all">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${val.color === 'blue' ? 'bg-blue-500/10' : val.color === 'red' ? 'bg-red-500/10' : val.color === 'orange' ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
                  <val.icon size={22} className={`${val.color === 'blue' ? 'text-blue-400' : val.color === 'red' ? 'text-red-400' : val.color === 'orange' ? 'text-primary-orange' : 'text-green-400'}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

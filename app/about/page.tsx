import { GraduationCap, Heart, MapPin, Users, Calendar, Star, BookOpen, Trophy, CandlestickChart, User } from 'lucide-react'
import Image from 'next/image'

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
                  Al-Madeena Vidyalaya was born from resilience. After the devastating 2004 tsunami 
                  destroyed the school that once stood by the beach in Maruthamunai, the land lay 
                  abandoned with damaged buildings. In 2009, a group of visionaries — led by founding 
                  principal <strong className="text-white">AR Nihmathulla</strong> — transformed that 
                  very ground into a new school, giving the community a fresh start.
                </p>
                <p>
                  The school started with classes only up to <span className="whitespace-nowrap">Grade 4.</span> Each year, one new grade was added — 
                  Grade 5 in 2010, Grade 6 in 2011, and so on. It paused at Grade 9, and the two senior 
                  batches had to leave as there were no O/L classes. But for our batch, Grade 10 was 
                  introduced in 2017 and O/L in 2018 — making us the very first O/L batch in the 
                  school&apos;s history. The school provides education up to Ordinary Level.
                </p>
                <p>
                  We entered as Grade 2 students in 2009, the same year the school was founded. We 
                  grew with the school, and the school grew with us.
                </p>
              </div>
            </div>
            <div className="card-static p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-orange/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-orange/10 overflow-hidden">
                  <Image
                    src="/school-logo.png"
                    alt="Al-Madeena Vidyalaya Logo"
                    width={160}
                    height={160}
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Al-Madeena Vidyalaya</h3>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <MapPin size={14} /> Maruthamunai, Ampara, Sri Lanka
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <GraduationCap size={14} className="text-primary-orange" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Est. 2009 · Up to O/L</span>
                </div>
              </div>
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
              { year: '2009', title: 'School Founded — We Joined', description: 'Al-Madeena Vidyalaya was founded by Principal AR Nihmathulla on land left abandoned after the 2004 tsunami. We joined as Grade 2 students — the school started with classes only up to Grade\u00A04.', icon: Star, color: 'orange' },
              { year: '2010–16', title: 'Growing Together', description: 'Each year, a new grade was added. Grade 5 in 2010, Grade 6 in 2011, and so on. The school and our batch grew side by side. Two senior batches had to leave when it stopped at Grade 9.', icon: GraduationCap, color: 'blue' },
              { year: '2017–18', title: 'First O/L Batch', description: 'Grade 10 was introduced in 2017 and the O/L examination in 2018. We became the very first batch to sit for O/Ls at Al-Madeena Vidyalaya — a historic milestone for the school and for us.', icon: Trophy, color: 'purple' },
              { year: '2019', title: 'Results & Loss', description: 'Our O/L results came in and paths diverged. Tragically, our beloved founding principal AR Nihmathulla sir passed away the same year. The man who built the school and knew each of us personally was gone.', icon: Heart, color: 'red' },
              { year: 'Today', title: 'Warriors Worldwide', description: 'From local businesses to international careers across the Middle East, Europe, and beyond — the Madeena Warriors carry the legacy of their school and principal wherever they go.', icon: Users, color: 'orange' }
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

      {/* Tribute to Principal */}
      <section className="pb-24 relative z-10">
        <div className="container-app">
          <div className="max-w-3xl mx-auto relative">
            <div className="card-static p-8 md:p-12 relative overflow-hidden border-white/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-orange via-gold to-primary-orange" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-orange/3 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-orange font-semibold mb-3">Tribute</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                    The Man Who <span className="text-gradient">Built Our School</span>
                  </h2>
                  <div className="divider-line mb-4" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border-2 border-primary-orange/20 overflow-hidden shadow-lg shadow-primary-orange/10 relative">
                      <Image
                        src="/memorial/AR-Nihmathulla.png"
                        alt="Principal AR Nihmathulla"
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-lg font-bold text-white">AR Nihmathulla</h3>
                      <p className="text-primary-orange text-sm font-semibold">Founding Principal</p>
                      <p className="text-gray-600 text-xs mt-1">2009 — 2019</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                    <p>
                      After the 2004 tsunami destroyed the school near the beach, the land in Maruthamunai 
                      lay abandoned with damaged buildings. While others saw ruins, <strong className="text-white">AR Nihmathulla sir</strong> saw 
                      a future. In 2009, he founded Al-Madeena Vidyalaya on that very ground — giving the 
                      community&apos;s children a place to learn and dream again.
                    </p>
                    <p>
                      He wasn&apos;t just a principal — he was a father figure to every student. He knew 
                      each of our families, our struggles, our strengths. He guided us not just in 
                      academics but in life. He stayed until we, his first O/L batch, wrote our exams 
                      in 2018.
                    </p>
                    <p>
                      In 2019, the year our results came, sir was no longer the principal. He fell ill 
                      and passed away that same year. The school he built, the students he raised, and 
                      the legacy he left behind — that is what the Madeena Warriors carry forward.
                    </p>
                    <p className="text-gray-500 italic border-l-2 border-primary-orange/30 pl-4">
                      &ldquo;He gave us a school when we had none. He gave us belief when we had doubt. 
                      We are his legacy.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-gradient">Unity</div>
                <p className="text-xs text-gray-600 mt-1">Our Foundation</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="sm:hidden w-16 h-px bg-white/10" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-gradient-blue">Resilience</div>
                <p className="text-xs text-gray-600 mt-1">Our Strength</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="sm:hidden w-16 h-px bg-white/10" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-gradient">Growth</div>
                <p className="text-xs text-gray-600 mt-1">Our Goal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-24 relative z-10">

        {/* In Memoriam */}
        <div className="container-app mb-24">
          <div className="card-static p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden border-white/10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 via-white/30 to-gray-600" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <CandlestickChart size={28} className="text-white/40" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-3">In Memoriam</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                Forever in Our Hearts
              </h2>
              <div className="divider-line mb-6" />
              <p className="text-gray-400 leading-relaxed max-w-xl mx-auto mb-6">
                Some warriors left us too soon, but their memory lives on through this batch forever. 
                They walked these halls with us, shared the same classrooms, and remain a part of our story.
              </p>

              {/* Memorial Photos */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {[
                  { name: 'Mohamed Jarath', photo: '/memorial/Mohamed-Jarath.jpg' },
                  // Add more friends here: { name: 'Name', photo: '/memorial/name.jpg' },
                ].map((friend, i) => (
                  <div key={friend.name} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center relative">
                      {friend.photo ? (
                        <Image
                          src={friend.photo}
                          alt={friend.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <User size={32} className="text-white/20" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{friend.name}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-sm italic">
                &ldquo;Gone from our sight, but never from our hearts.&rdquo;
              </p>
            </div>
          </div>
        </div>
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

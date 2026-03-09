import Link from "next/link";
import Image from "next/image";
import { Users, BookOpen, MapPin, ShieldCheck, GraduationCap, Camera, Calendar, Globe, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const timelineEvents = [
    { year: "2013", title: "The Beginning", desc: "KM Maruthamunai Al-Madeena Vidyalaya was established — a new chapter for education in the community." },
    { year: "2018", title: "First O/L Batch", desc: "The Madeena Warriors made history as the very first batch to sit the O/L examinations." },
    { year: "2019+", title: "Diverse Paths", desc: "Members spread across the globe — pursuing higher education, careers, and entrepreneurship." },
    { year: "Today", title: "United Again", desc: "This platform brings the batch back together — preserving our legacy and celebrating every journey." },
  ];

  return (
    <div className="flex flex-col w-full bg-[#050A1F] min-h-screen overflow-hidden">

      {/* ==================== HERO ==================== */}
      <section className="relative w-full py-28 lg:py-44 flex items-center justify-center">
        {/* Animated Glowing Orbs */}
        <div className="absolute top-1/4 left-1/5 w-72 h-72 md:w-96 md:h-96 bg-primary-orange/15 rounded-full blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 md:w-[420px] md:h-[420px] bg-primary-navy/30 rounded-full blur-[140px] animate-float-delayed pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-school-gold/5 rounded-full blur-[180px] pointer-events-none" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-app relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-10 rounded-full bg-white/5 backdrop-blur-xl p-2 shadow-[0_0_60px_rgba(236,124,8,0.15)] overflow-hidden border border-white/15 animate-float-delayed">
            <div className="w-full h-full relative rounded-full overflow-hidden bg-white">
              <Image src="/logo.png" alt="Madeena Warriors Logo" fill className="object-cover scale-95" sizes="160px" priority />
            </div>
          </div>

          {/* School Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-primary-orange text-sm md:text-base font-medium mb-8 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <GraduationCap size={18} />
            <span className="tracking-wide">KM Maruthamunai Al-Madeena Vidyalaya</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight max-w-5xl mb-6 leading-[1.05] drop-shadow-2xl">
            The <span className="text-gradient">First O/L Batch</span>
            <br className="hidden md:block" />
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-300">of 2018</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
            An exclusive digital archive preserving our legacy, celebrating diverse journeys, and uniting the pioneers across the globe.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/directory" className="btn-primary text-lg px-10 py-4 w-full sm:w-auto flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(236,124,8,0.3)]">
              <Users size={20} />
              Explore the Batch
            </Link>
            <Link href="/about" className="btn-ghost text-lg px-10 py-4 w-full sm:w-auto flex items-center justify-center gap-2.5 border border-white/10 hover:border-white/20">
              Our Story
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gradient" />

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 lg:py-32 relative z-10">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="badge-orange mb-4 mx-auto">
              <Sparkles size={14} />
              Why This Platform
            </div>
            <h2 className="section-heading">Built for the <span className="text-gradient">Warriors</span></h2>
            <div className="divider-line mt-6 mb-8" />
            <p className="section-subheading">
              We are the pioneers — the very first O/L batch of KM Maruthamunai Al-Madeena Vidyalaya. Though we&apos;ve travelled different paths, our shared history remains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, color: "primary-orange", title: "Equal Status", desc: "No rankings, no comparisons. Just a showcase of diverse paths and current endeavors.", gradient: "from-primary-orange/20" },
              { icon: BookOpen, color: "blue-400", title: "Living Archive", desc: "A centralized digital memory bank preserving our collective school history securely.", gradient: "from-blue-500/20" },
              { icon: MapPin, color: "purple-400", title: "Global Map", desc: "See where our classmates are actively contributing across the globe today.", gradient: "from-purple-500/20" },
              { icon: ShieldCheck, color: "green-400", title: "Verified Access", desc: "Strict admin approval ensures only genuine members from the 2018 batch can join.", gradient: "from-green-500/20" },
            ].map((feature, i) => (
              <div key={i} className="card p-8 flex flex-col items-center text-center group hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} to-transparent flex items-center justify-center text-${feature.color} mb-6 border border-${feature.color}/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(236,124,8,0.1)]`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-white tracking-wide">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BATCH TIMELINE ==================== */}
      <section className="py-24 lg:py-32 relative z-10">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="badge-blue mb-4 mx-auto">
              <Calendar size={14} />
              Our Journey
            </div>
            <h2 className="section-heading">Batch <span className="text-gradient">Timeline</span></h2>
            <div className="divider-line mt-6 mb-8" />
            <p className="section-subheading">
              From the founding of the school to this digital reunion — key milestones that define the Madeena Warriors.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-orange/50 via-primary-orange/20 to-transparent" />

            {timelineEvents.map((event, i) => (
              <div key={i} className={`relative flex items-start gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-orange shadow-[0_0_12px_rgba(236,124,8,0.6)] z-10 mt-6" />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                  <div className="card-static p-6 group hover:border-primary-orange/30">
                    <span className="text-primary-orange font-black text-2xl">{event.year}</span>
                    <h3 className="text-white font-bold text-lg mt-2 mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{event.desc}</p>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QUICK STATS ==================== */}
      <section className="py-24 lg:py-28 relative z-10">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "2018", label: "O/L Batch Year", icon: Calendar },
              { value: "1st", label: "Batch in History", icon: GraduationCap },
              { value: "🌍", label: "Members Worldwide", icon: Globe },
              { value: "∞", label: "Memories Shared", icon: Camera },
            ].map((stat, i) => (
              <div key={i} className="stat-card group hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2">{stat.value}</div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 lg:py-28 relative z-10 px-4">
        <div className="max-w-5xl mx-auto glass-panel relative overflow-hidden rounded-[2rem] p-10 md:p-16 lg:p-20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 group">
          {/* Animated background highlights */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-orange/20 rounded-full blur-[100px] group-hover:bg-primary-orange/30 transition-colors duration-700 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] group-hover:bg-blue-600/25 transition-colors duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="badge-orange mb-6 mx-auto">
              <Sparkles size={14} />
              Join the Movement
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Claim Your <span className="text-gradient">Legacy</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Create your personal profile today. Reconnect with old friends, share your milestones, and cement your place in our digital history.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login" className="btn-primary text-lg px-12 py-4 shadow-[0_0_30px_rgba(236,124,8,0.4)] hover:shadow-[0_0_50px_rgba(236,124,8,0.6)]">
                Join the Network
              </Link>
              <Link href="/directory" className="btn-ghost text-lg px-12 py-4 border border-white/10 hover:border-white/20">
                Browse Members
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

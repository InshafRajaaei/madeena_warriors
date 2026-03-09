import Link from 'next/link'
import { Heart, MapPin, GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-[#030816] border-t border-white/5 mt-auto">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary-orange/40 to-transparent" />

      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Madeena <span className="text-primary-orange">Warriors</span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">Batch Network &mdash; Est. 2018</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A digital archive and social network for the first O/L batch of KM Maruthamunai Al-Madeena Vidyalaya.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
              <MapPin size={12} />
              <span>Maruthamunai, Sri Lanka</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Explore</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About the Batch', path: '/about' },
                { name: 'Member Directory', path: '/directory' },
                { name: 'Global Map', path: '/map' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Login / Join', path: '/login' },
              ].map(link => (
                <Link key={link.path} href={link.path} className="text-sm text-gray-500 hover:text-primary-orange transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* School Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">School</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <GraduationCap size={16} className="text-primary-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300 font-medium">KM Maruthamunai Al-Madeena Vidyalaya</p>
                  <p className="text-xs text-gray-500">1st O/L Batch &mdash; 2018</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                The pioneers who paved the way. Different paths, one legacy.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Madeena Warriors Network. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            Built with <Heart size={12} className="text-primary-orange" /> for the Batch
          </p>
        </div>
      </div>
    </footer>
  )
}

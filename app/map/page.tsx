'use client'

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Globe, MapPin } from 'lucide-react'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const lkGeoUrl = "/lk.json"

export default function GlobalMapPage() {
  const supabase = createClient()
  const [view, setView] = useState<'global' | 'sl'>('global')
  const [countriesData, setCountriesData] = useState<Record<string, number>>({})
  const [districtsData, setDistrictsData] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [tooltipContent, setTooltipContent] = useState("")

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from('profiles')
        .select('current_country, current_city')
        .eq('is_approved', true)

      if (data && !error) {
        const countryCounts: Record<string, number> = {}
        const districtCounts: Record<string, number> = {}
        
        data.forEach(profile => {
          if (profile.current_country) {
            let country = profile.current_country.trim()
            if (country.toLowerCase() === 'uae' || country.toLowerCase() === 'dubai') country = 'United Arab Emirates'
            if (country.toLowerCase() === 'uk' || country.toLowerCase() === 'england') country = 'United Kingdom'
            if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') country = 'United States of America'
            if (country.toLowerCase() === 'ksa' || country.toLowerCase() === 'saudi') country = 'Saudi Arabia'
            countryCounts[country] = (countryCounts[country] || 0) + 1
          }

          if (profile.current_city) {
            let city = profile.current_city.trim().toLowerCase()
            let district = city;
            if (city.includes('colombo') || city.includes('dehiwala') || city.includes('mount') || city.includes('moratuwa')) district = 'Colombo';
            if (city.includes('kandy') || city.includes('peradeniya')) district = 'Kandy';
            if (city.includes('ampara') || city.includes('maruthamunai') || city.includes('kalmunai') || city.includes('sainthamaruthu') || city.includes('samanthurai') || city.includes('nintavur') || city.includes('akkaraipattu') || city.includes('pottuvil') || city.includes('addalaichenai')) district = 'Ampara';
            if (city.includes('galle')) district = 'Galle';
            if (city.includes('matara')) district = 'Matara';
            if (city.includes('batticaloa') || city.includes('kattankudy') || city.includes('eravur')) district = 'Batticaloa';
            if (city.includes('trincomalee') || city.includes('kinniya') || city.includes('mutur')) district = 'Trincomalee';
            if (city.includes('kurunegala')) district = 'Kurunegala';
            if (city.includes('puttalam')) district = 'Puttalam';
            if (city.includes('badulla')) district = 'Badulla';
            if (city.includes('gampaha') || city.includes('negombo')) district = 'Gampaha';
            districtCounts[district] = (districtCounts[district] || 0) + 1;
          }
        })
        
        setCountriesData(countryCounts)
        setDistrictsData(districtCounts)
      }
      setLoading(false)
    }

    fetchLocations()
  }, [supabase])

  const totalMembers = Object.values(view === 'global' ? countriesData : districtsData).reduce((a, b) => a + b, 0)
  const totalRegions = Object.keys(view === 'global' ? countriesData : districtsData).length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container-app relative z-10 text-center">
          <div className="badge-blue mb-4 mx-auto">
            <Globe size={14} />
            Where Are They Now
          </div>
          <h1 className="section-heading">
            {view === 'global' ? 'Global' : 'Sri Lanka'} <span className="text-gradient">Network</span>
          </h1>
          <div className="divider-line mt-5 mb-6" />
          <p className="section-subheading">
            {view === 'global' 
              ? 'See where the Madeena Warriors are making an impact across the world today.'
              : 'Zooming into Sri Lanka to see which districts our local members are located in.'}
          </p>

          {/* View Toggle */}
          <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 mt-8">
            <button
              onClick={() => setView('global')}
              className={`px-6 py-2.5 rounded-full text-sm outline-none font-bold transition-all duration-300 cursor-pointer ${view === 'global' ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/30' : 'text-gray-500 hover:text-white'}`}
            >
              🌍 Global View
            </button>
            <button
              onClick={() => setView('sl')}
              className={`px-6 py-2.5 rounded-full text-sm outline-none font-bold transition-all duration-300 cursor-pointer ${view === 'sl' ? 'bg-primary-orange text-white shadow-lg shadow-primary-orange/30' : 'text-gray-500 hover:text-primary-orange'}`}
            >
              🇱🇰 Sri Lanka
            </button>
          </div>
        </div>
      </section>

      {/* Map & Stats */}
      <section className="pb-20 relative z-10">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="stat-card">
                <div className="text-3xl font-black text-gradient mb-1">{totalMembers}</div>
                <p className="text-gray-500 text-sm">Members Mapped</p>
              </div>
              <div className="stat-card">
                <div className="text-3xl font-black text-gradient-blue mb-1">{totalRegions}</div>
                <p className="text-gray-500 text-sm">{view === 'global' ? 'Countries' : 'Districts'}</p>
              </div>
              
              {/* Legend */}
              <div className="card-static p-5">
                <h3 className="font-bold text-sm text-white mb-3">Legend</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded bg-[#1a1f3a] border border-white/10" /> No Members
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded bg-primary-orange/50" /> 1-4 Members
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded bg-primary-orange" /> 5+ Members
                  </div>
                </div>
              </div>

              {/* Top Locations */}
              <div className="card-static p-5">
                <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-primary-orange" />
                  Top {view === 'global' ? 'Countries' : 'Districts'}
                </h3>
                <div className="space-y-2">
                  {Object.entries(view === 'global' ? countriesData : districtsData)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 truncate pr-2">{name}</span>
                        <span className="text-primary-orange font-bold">{count}</span>
                      </div>
                    ))
                  }
                  {Object.keys(view === 'global' ? countriesData : districtsData).length === 0 && (
                    <p className="text-xs text-gray-600">No data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <div className="card-static p-3 md:p-6 relative">
                {loading && (
                  <div className="absolute inset-0 z-10 bg-[#050A1F]/90 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <span className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin mb-4" />
                      <p className="text-white font-medium">Loading map data...</p>
                    </div>
                  </div>
                )}

                {/* Tooltip */}
                {tooltipContent && (
                  <div className="absolute top-6 right-6 z-10 bg-primary-navy/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl font-medium text-sm pointer-events-none border border-white/10 animate-fade-in">
                    {tooltipContent}
                  </div>
                )}

                <div className="w-full h-[400px] md:h-[550px] bg-[#0a1230] rounded-xl overflow-hidden cursor-move">
                  {view === 'global' ? (
                    <ComposableMap
                      projectionConfig={{ scale: 140 }}
                      width={800}
                      height={500}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ZoomableGroup zoom={1} center={[0, 20]}>
                        <Geographies geography={geoUrl}>
                          {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                              const countryName = geo.properties.name;
                              const normalizedCountryName = countryName.toLowerCase();
                              const matchedKey = Object.keys(countriesData).find(k => k.toLowerCase() === normalizedCountryName);
                              const count = matchedKey ? countriesData[matchedKey] : 0;
                              
                              let fill = "#1a1f3a"; 
                              if (count > 0 && count < 5) fill = "#c96a08"; 
                              if (count >= 5) fill = "#EC7C08"; 

                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  onMouseEnter={() => {
                                    setTooltipContent(count > 0 ? `${countryName}: ${count} Alumni` : countryName);
                                  }}
                                  onMouseLeave={() => setTooltipContent("")}
                                  style={{
                                    default: { fill, outline: "none", stroke: "#0a1230", strokeWidth: 0.5 },
                                    hover: { fill: count > 0 ? "#ffa94d" : "#252a4a", outline: "none", cursor: "pointer", transition: "all 0.2s" },
                                    pressed: { fill: "#EC7C08", outline: "none" }
                                  }}
                                />
                              );
                            })
                          }
                        </Geographies>
                      </ZoomableGroup>
                    </ComposableMap>
                  ) : (
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        scale: 6000,
                        center: [80.7718, 7.8731]
                      }}
                      width={800}
                      height={600}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ZoomableGroup zoom={1} center={[80.7718, 7.8731]} maxZoom={5}>
                        <Geographies geography={lkGeoUrl}>
                          {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                              const rawAltNames = geo.properties['alt-name'] || '';
                              const districtName = geo.properties['woe-name'] || rawAltNames.split('|')[0] || geo.properties.name || "Unknown District";
                              const normalizedDistrictName = districtName.toLowerCase().replace(' district', '');
                              
                              const matchedKey = Object.keys(districtsData).find(k => 
                                normalizedDistrictName.includes(k.toLowerCase()) || 
                                k.toLowerCase().includes(normalizedDistrictName) ||
                                rawAltNames.toLowerCase().includes(k.toLowerCase())
                              );
                              const count = matchedKey ? districtsData[matchedKey] : 0;
                              
                              let fill = "#1a1f3a"; 
                              if (count > 0 && count < 5) fill = "#c96a08"; 
                              if (count >= 5) fill = "#EC7C08"; 

                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  onMouseEnter={() => {
                                    setTooltipContent(count > 0 ? `${districtName}: ${count} Alumni` : districtName);
                                  }}
                                  onMouseLeave={() => setTooltipContent("")}
                                  style={{
                                    default: { fill, outline: "none", stroke: "#0a1230", strokeWidth: 1 },
                                    hover: { fill: count > 0 ? "#ffa94d" : "#252a4a", outline: "none", cursor: "pointer", transition: "all 0.2s" },
                                    pressed: { fill: "#EC7C08", outline: "none" }
                                  }}
                                />
                              );
                            })
                          }
                        </Geographies>
                      </ZoomableGroup>
                    </ComposableMap>
                  )}
                </div>
                <p className="text-center text-xs text-gray-600 mt-4">
                  Members must input valid country and city names in their Dashboard to appear on the map. Drag and scroll to navigate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

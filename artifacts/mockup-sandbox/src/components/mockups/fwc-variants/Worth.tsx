import React from "react";
import { X, Heart, MapPin, Briefcase, ShieldCheck, Compass, Users, MessageSquare, Activity, User } from "lucide-react";

export function Worth() {
  return (
    <div className="w-[390px] h-[844px] bg-[#1a0924] text-stone-100 mx-auto relative overflow-hidden flex flex-col font-sans shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-[#36134f] rounded-[100%] blur-[120px] opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <h1 className="text-2xl font-serif tracking-widest text-[#e8cf89] uppercase">The Yard</h1>
        <div className="w-8 h-8 rounded-full border border-[#e8cf89]/30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#e8cf89]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-4 relative z-10 flex flex-col">
        {/* Profile Card */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl shadow-[#000000]/50 flex flex-col justify-end">
          <img 
            src="/__mockup/images/sarah.png" 
            alt="Sarah" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0924] via-[#1a0924]/60 to-transparent h-[60%] mt-auto" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0924]/30 to-transparent h-[20%]" />

          {/* Profile Details */}
          <div className="relative z-20 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8cf89]/10 border border-[#e8cf89]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e8cf89]" />
                <span className="text-xs font-medium tracking-wide text-[#e8cf89] uppercase">Cleared</span>
              </div>
            </div>

            <div className="mt-1">
              <h2 className="text-5xl font-serif text-white tracking-tight leading-none">Sarah, <span className="text-[#e8cf89] font-sans font-light text-4xl">28</span></h2>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-stone-300 text-sm">
                <MapPin className="w-4 h-4 text-[#e8cf89]/70" />
                <span className="font-light tracking-wide">5 miles away</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-sm">
                <Briefcase className="w-4 h-4 text-[#e8cf89]/70" />
                <span className="font-light tracking-wide">Peer Support Specialist</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-stone-200 font-serif italic text-lg leading-relaxed">
                "Did 8 years, came home changed. Solid vibes only."
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-6 px-4 mb-2">
          <button className="w-16 h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <button className="flex-1 h-16 rounded-full bg-gradient-to-r from-[#e8cf89] to-[#c7aa56] text-[#1a0924] font-bold text-lg tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(232,207,137,0.3)]">
            <Heart className="w-6 h-6 fill-[#1a0924]" />
            Connect
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-[84px] pb-6 px-6 bg-[#12051a] border-t border-white/5 flex items-center justify-between relative z-20">
        <NavItem icon={<Compass className="w-6 h-6" />} label="Yard" active />
        <NavItem icon={<Users className="w-6 h-6" />} label="Connects" />
        <NavItem icon={<MessageSquare className="w-6 h-6" />} label="Kites" />
        <NavItem icon={<Activity className="w-6 h-6" />} label="Lifeline" />
        <NavItem icon={<User className="w-6 h-6" />} label="My Info" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 ${active ? 'text-[#e8cf89]' : 'text-stone-500 hover:text-stone-300'}`}>
      {icon}
      <span className="text-[10px] font-medium tracking-wider uppercase">{label}</span>
    </button>
  );
}

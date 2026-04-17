import React from "react";
import { Check, X, Heart, MapPin, Search, Users, Mail, LifeBuoy, User, Shield } from "lucide-react";

export function Community() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#fdfbf7] mx-auto relative overflow-hidden font-sans text-stone-800 shadow-2xl flex flex-col border border-stone-200">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-stone-200 bg-[#fdfbf7] z-10 sticky top-0">
        <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">The Yard</h1>
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center shadow-sm">
          <span className="text-stone-700 text-xs font-bold">FWC</span>
        </div>
      </div>

      {/* Main Content area */}
      <div className="flex-1 px-4 pt-5 pb-24 overflow-y-auto overflow-x-hidden bg-[#f4f1ea] relative bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* Profile Card - Paper/Bulletin board style */}
        <div className="bg-[#fdfbf7] rounded shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-stone-200/60 p-3 pb-6 relative transform transition-transform duration-300">
          
          <div className="relative">
            <img 
              src="/__mockup/images/sarah-fwc.png" 
              alt="Sarah" 
              className="w-full h-[460px] object-cover rounded shadow-inner filter brightness-95 contrast-105 saturate-[0.85] sepia-[0.1]"
            />
            {/* Cleared Badge - Stamped look */}
            <div className="absolute top-4 right-4 bg-[#2c4c3b] text-[#fdfbf7] text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-md flex items-center gap-1.5 backdrop-blur-sm border border-[#1e3629]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Cleared
            </div>
            
            {/* Name overlay gradient */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12 rounded-b">
              <h2 className="text-3xl font-serif font-bold text-white leading-none mb-1">Sarah, 28</h2>
              <p className="text-stone-200 text-sm flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4" /> 5 miles away
              </p>
            </div>
          </div>

          <div className="px-3 pt-5">
            <p className="text-stone-500 font-bold mb-3 uppercase tracking-wider text-xs">
              Peer Support Specialist
            </p>
            
            {/* Bio snippet */}
            <div className="relative">
              <p className="text-stone-800 text-base leading-relaxed font-serif">
                "Did 8 years, came home changed. Solid vibes only."
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-6 mt-8 mb-6 relative z-10">
          <button className="w-16 h-16 rounded-full bg-[#fdfbf7] text-stone-400 flex items-center justify-center shadow-[0_4px_14px_rgb(0,0,0,0.06)] border border-stone-200 hover:scale-105 active:scale-95 transition-all focus:outline-none">
            <X className="w-7 h-7" strokeWidth={2.5} />
          </button>
          <button className="w-16 h-16 rounded-full bg-[#9a3412] text-[#fdfbf7] flex items-center justify-center shadow-[0_4px_14px_rgb(154,52,18,0.25)] border border-[#7c2d12] hover:scale-105 active:scale-95 transition-all focus:outline-none">
            <Heart className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-[#fdfbf7] border-t border-stone-200 px-2 py-3 pb-6 flex justify-between items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button className="flex-1 flex flex-col items-center gap-1 text-[#9a3412]">
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Yard</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors">
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Connects</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors relative">
          <Mail className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Kites</span>
          <span className="absolute top-0 right-4 w-2 h-2 bg-[#ea580c] rounded-full border-2 border-[#fdfbf7]"></span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors">
          <LifeBuoy className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Lifeline</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors">
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">My Info</span>
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { CheckCircle2, X, Heart, MessageSquare, Users, Shield, User } from "lucide-react";

export function Grounded() {
  return (
    <div className="flex justify-center bg-black min-h-screen font-sans antialiased text-neutral-200">
      <div className="w-[390px] min-h-[844px] bg-neutral-950 relative overflow-hidden flex flex-col shadow-2xl border-x border-neutral-900">
        
        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
          <h1 className="text-3xl font-black tracking-tighter text-neutral-100">
            THE <span className="text-amber-500">YARD</span>
          </h1>
          <button className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Shield className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 pb-28 flex flex-col relative z-0">
          
          {/* Card */}
          <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-800/50">
            {/* Image */}
            <div className="absolute inset-0">
              <img 
                src="/__mockup/images/sarah-profile.png" 
                alt="Sarah"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-950/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-32 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-white tracking-tight">Sarah, 28</h2>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Cleared</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm font-medium text-neutral-400">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  5 miles away
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                  Peer Support Specialist
                </p>
              </div>

              <div className="mt-2 text-base leading-relaxed text-neutral-300 font-medium">
                "Did 8 years, came home changed. Solid vibes only."
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-all active:scale-95 shadow-xl">
              <X className="w-8 h-8 stroke-[3]" />
            </button>
            <button className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Heart className="w-10 h-10 fill-black stroke-black" />
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-900 pb-safe pt-2 px-6">
          <div className="flex justify-between items-center pb-4">
            <button className="flex flex-col items-center gap-1 p-2 text-amber-500">
              <div className="w-6 h-6 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Yard</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-neutral-600 hover:text-neutral-400 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Connects</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-neutral-600 hover:text-neutral-400 transition-colors relative">
              <div className="w-6 h-6 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
                <div className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-neutral-950"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Kites</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-neutral-600 hover:text-neutral-400 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Lifeline</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-neutral-600 hover:text-neutral-400 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">My Info</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

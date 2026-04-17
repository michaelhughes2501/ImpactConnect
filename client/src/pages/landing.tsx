import { Shield, Heart, MessageSquare } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Heart className="w-5 h-5 fill-black stroke-black" />
          </div>
          <span className="text-lg font-black tracking-tighter text-neutral-100">
            FREE<span className="text-amber-500">WORLD</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Shield className="w-3.5 h-3.5" />
            Everyone's Background Checked
          </div>

          <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
            The yard for
            <br />
            <span className="text-amber-500">real ones</span>
            <br />
            only.
          </h1>

          <p className="text-neutral-400 text-lg leading-relaxed max-w-sm mx-auto mb-10">
            A space built by and for people who know what it's like behind those walls — and who came home ready to build something real.
          </p>

          <a
            href="/api/login"
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-gradient-to-br from-amber-400 to-orange-600 text-black font-black text-base py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            Get Into the Yard
          </a>

          <p className="text-neutral-600 text-sm mt-4">
            No judgment. No pretending. Solid vibes only.
          </p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Shield, label: "Cleared", sub: "Everyone verified" },
            { icon: Heart, label: "Connects", sub: "Real matches" },
            { icon: MessageSquare, label: "Kites", sub: "Private chats" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-neutral-200">{label}</div>
              <div className="text-xs text-neutral-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-neutral-700 text-xs">
        Keep it 100. Stay out the mix. Stay protected out here.
      </footer>
    </div>
  );
}

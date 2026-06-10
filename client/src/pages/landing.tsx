import { Shield, Heart, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Ambient drifting glows */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Heart className="w-5 h-5 fill-black stroke-black" />
          </div>
          <span className="text-lg font-black tracking-tighter text-neutral-100">
            FREE<span className="text-amber-500">WORLD</span>
          </span>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="mb-8"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
          >
            <Shield className="w-3.5 h-3.5" />
            Everyone's Background Checked
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl font-black tracking-tighter leading-none mb-6">
            The yard for
            <br />
            <span className="text-amber-500">real ones</span>
            <br />
            only.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed max-w-sm mx-auto mb-10">
            A space built by and for people who know what it's like behind those walls — and who came home ready to build something real.
          </motion.p>

          <motion.a
            variants={fadeUp}
            href="/api/login"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-gradient-to-br from-amber-400 to-orange-600 text-black font-black text-base py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-shadow"
          >
            Get Into the Yard
          </motion.a>

          <motion.p variants={fadeUp} className="text-neutral-600 text-sm mt-4">
            No judgment. No pretending. Solid vibes only.
          </motion.p>
        </motion.div>

        <motion.div
          className="w-full max-w-sm grid grid-cols-3 gap-4 mt-8"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
          initial="hidden"
          animate="show"
        >
          {[
            { icon: Shield, label: "Cleared", sub: "Everyone verified" },
            { icon: Heart, label: "Connects", sub: "Real matches" },
            { icon: MessageSquare, label: "Kites", sub: "Private chats" },
          ].map(({ icon: Icon, label, sub }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center transition-colors hover:border-amber-500/40"
            >
              <Icon className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-neutral-200">{label}</div>
              <div className="text-xs text-neutral-600 mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="relative px-6 py-8 text-center text-neutral-700 text-xs">
        Keep it 100. Stay out the mix. Stay protected out here.
      </footer>
    </div>
  );
}

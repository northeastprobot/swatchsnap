import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Home, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Home size={28} />,
    title: "Upload Your Home",
    description:
      "Snap a photo or upload an existing one. Any angle, any style — our AI handles the rest.",
  },
  {
    step: "02",
    icon: <Palette size={28} />,
    title: "Pick Your Colors",
    description:
      "Browse hundreds of authentic Benjamin Moore exterior colors. Choose walls, trim, and accent colors.",
  },
  {
    step: "03",
    icon: <Sparkles size={28} />,
    title: "See the Magic",
    description:
      "Watch AI transform your home in seconds. Download your preview or get a real estimate.",
  },
];

const trustItems = [
  "Powered by AI",
  "Benjamin Moore Color Library",
  "Free to Use",
  "No Sign Up Required",
];

const popularColors = [
  { name: "Hale Navy", hex: "#364958" },
  { name: "Chantilly Lace", hex: "#F5F4EF" },
  { name: "Revere Pewter", hex: "#C2B9A7" },
  { name: "Tarrytown Green", hex: "#5E7148" },
  { name: "White Dove", hex: "#F3F1E9" },
  { name: "Wrought Iron", hex: "#474B4E" },
  { name: "Heritage Red", hex: "#943030" },
  { name: "Mustard Seed", hex: "#B89040" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f11" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#2e2e35]/60 bg-[#0f0f11]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              SwatchSnap
            </span>
          </div>
          <Link
            href="/app"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-semibold text-sm rounded-full transition-all hover:gap-2.5"
          >
            Try It Free <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full text-[#f97316] text-sm font-medium mb-8">
          <Sparkles size={14} />
          AI-Powered Color Visualizer
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-5">
          See Your Home in{" "}
          <span className="text-[#f97316]">Any Color</span>
          {" "}—{" "}
          <span className="text-white">Instantly</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#8b8b97] max-w-xl mb-10 leading-relaxed">
          Upload a photo, pick your Benjamin Moore colors, and preview the
          transformation before you commit.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#f97316]/20"
          >
            Try It Free — No Sign Up
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Color swatches preview */}
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {popularColors.map((color) => (
            <div
              key={color.name}
              className="group relative"
              title={color.name}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-white/10 shadow-md hover:scale-125 transition-transform cursor-default"
                style={{ backgroundColor: color.hex }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1a1f] border border-[#2e2e35] rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                {color.name}
              </div>
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#2e2e35] flex items-center justify-center text-[#8b8b97] text-xs font-bold">
            80+
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trustItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-sm text-[#8b8b97]"
            >
              <CheckCircle size={14} className="text-[#f97316] flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 border-t border-[#2e2e35]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Three steps to your dream home
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.step}
                className="group relative p-6 bg-[#1a1a1f] border border-[#2e2e35] rounded-2xl hover:border-[#f97316]/30 transition-all hover:bg-[#1a1a1f]/80"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f97316]/10 rounded-xl text-[#f97316] group-hover:bg-[#f97316]/20 transition-colors flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="text-right ml-auto">
                    <span className="text-3xl font-black text-[#2e2e35] group-hover:text-[#f97316]/20 transition-colors">
                      {step.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-[#8b8b97] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#f97316]/20"
            >
              Start Visualizing Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof / Features */}
      <section className="py-16 px-5 border-t border-[#2e2e35] bg-[#1a1a1f]/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            {[
              { value: "80+", label: "Benjamin Moore Colors" },
              { value: "Free", label: "No Credit Card Needed" },
              { value: "AI", label: "Powered Visualization" },
            ].map((stat) => (
              <div key={stat.label} className="p-6">
                <div className="text-4xl font-black text-[#f97316] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#8b8b97] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 border-t border-[#2e2e35]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#f97316] rounded-md flex items-center justify-center">
              <Palette size={12} className="text-white" />
            </div>
            <span className="text-[#8b8b97] text-sm">SwatchSnap</span>
          </div>

          <p className="text-[#8b8b97] text-sm text-center">
            Powered by{" "}
            <a
              href="https://northeastproservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#f97316] transition-colors font-medium"
            >
              Northeast Pro Services
            </a>{" "}
            — Buffalo, NY&rsquo;s premier exterior painting team
          </p>

          <p className="text-[#8b8b97] text-xs">
            &copy; {new Date().getFullYear()} SwatchSnap
          </p>
        </div>
      </footer>
    </div>
  );
}

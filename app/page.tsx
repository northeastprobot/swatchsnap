import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Home, CheckCircle, Star } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Home size={28} />,
    title: "Upload Your Home",
    description:
      "Snap a photo or upload an existing one. Front angle, side view — our AI handles any shot with photorealistic accuracy.",
  },
  {
    step: "02",
    icon: <Palette size={28} />,
    title: "Browse 500+ BM Colors",
    description:
      "Explore Benjamin Moore's full color library — Historical Colors, Off-Whites, Williamsburg Collection, Affinity, and more. Search by name or number.",
  },
  {
    step: "03",
    icon: <Sparkles size={28} />,
    title: "See the Transformation",
    description:
      "Watch AI render your home with stunning realism in under 60 seconds. Download your preview or request a professional estimate.",
  },
];

const trustItems = [
  "500+ Authentic Benjamin Moore Colors",
  "AI-Powered Visualization",
  "Free — No Credit Card",
  "Instant Results",
];

const featuredSwatches = [
  { name: "Hale Navy", number: "HC-154", hex: "#364958" },
  { name: "Revere Pewter", number: "HC-172", hex: "#C2B9A7" },
  { name: "Chantilly Lace", number: "OC-65", hex: "#F5F4EF" },
  { name: "Tarrytown Green", number: "HC-134", hex: "#5E7148" },
  { name: "White Dove", number: "OC-17", hex: "#F3F1E9" },
  { name: "Wrought Iron", number: "2124-10", hex: "#474B4E" },
  { name: "Van Deusen Blue", number: "HC-156", hex: "#4A6274" },
  { name: "Edgecomb Gray", number: "HC-173", hex: "#CBB99B" },
  { name: "October Mist", number: "1495", hex: "#B4C2AD" },
  { name: "Newburyport Blue", number: "HC-155", hex: "#3B5A74" },
  { name: "Heritage Red", number: "PM-18", hex: "#943030" },
  { name: "Pale Oak", number: "OC-20", hex: "#DDD5C4" },
  { name: "Wythe Blue", number: "CW-40", hex: "#6C8FA8" },
  { name: "Stonington Gray", number: "HC-170", hex: "#C0C0BA" },
  { name: "Guilford Green", number: "HC-116", hex: "#778C6D" },
  { name: "Caliente", number: "AF-290", hex: "#8B2829" },
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
          Benjamin Moore's Full Color Library — AI-Powered
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-5">
          See Your Home in Any{" "}
          <span className="text-[#f97316]">Benjamin Moore</span>{" "}
          Color — Instantly
        </h1>

        <p className="text-lg sm:text-xl text-[#8b8b97] max-w-2xl mb-4 leading-relaxed">
          Upload a photo of your house, choose from 500+ authentic Benjamin Moore exterior colors
          — Historical Colors, Off-Whites, Williamsburg Collection, and more — and watch AI
          transform your home in seconds.
        </p>
        <p className="text-sm text-[#8b8b97]/70 mb-10">
          Free. No sign-up. Professional-grade results in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#f97316]/20"
          >
            Visualize My Home — Free
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Color swatch preview grid */}
        <div className="w-full max-w-2xl mb-10">
          <p className="text-xs text-[#8b8b97] uppercase tracking-widest mb-4 font-medium">
            Featured Colors
          </p>
          <div className="grid grid-cols-8 gap-1.5">
            {featuredSwatches.map((color) => (
              <div key={color.number} className="group relative flex flex-col">
                <div
                  className="w-full aspect-square rounded-lg shadow-md hover:scale-110 transition-transform cursor-default border border-white/5"
                  style={{ backgroundColor: color.hex }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-[#1a1a1f] border border-[#2e2e35] rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                  <p className="font-semibold">{color.name}</p>
                  <p className="text-[#8b8b97]">{color.number}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8b8b97] mt-3">
            + 480 more colors across all major Benjamin Moore collections
          </p>
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

      {/* Stats banner */}
      <section className="py-10 px-5 border-y border-[#2e2e35] bg-[#1a1a1f]/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "BM Colors", sub: "Authentic library" },
            { value: "AI", label: "Powered", sub: "gpt-image-1 model" },
            { value: "Free", label: "Always", sub: "No credit card" },
            { value: "60s", label: "Results", sub: "Instant preview" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="text-3xl font-black text-[#f97316]">{stat.value}</div>
              <div className="text-white font-semibold text-sm">{stat.label}</div>
              <div className="text-[#8b8b97] text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Color library showcase */}
      <section className="py-20 px-5 border-b border-[#2e2e35]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-3">
              Color Library
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Every major Benjamin Moore collection
            </h2>
            <p className="text-[#8b8b97] max-w-xl mx-auto">
              From timeless Historical Colors to the full Affinity and Williamsburg collections — all 500+ colors searchable by name or number.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Historical Colors",
                prefix: "HC",
                desc: "75+ iconic HC-series colors trusted by designers for generations.",
                swatches: ["#364958", "#C2B9A7", "#778C6D", "#C0C0BA", "#5E7148"],
              },
              {
                name: "Off-Whites",
                prefix: "OC / OW",
                desc: "50+ crisp whites and warm off-whites — the perfect backdrop for any exterior.",
                swatches: ["#F5F4EF", "#F3F1E9", "#F0EBD8", "#CFD0CA", "#DDD5C4"],
              },
              {
                name: "Williamsburg Collection",
                prefix: "CW",
                desc: "Colonial-inspired hues inspired by historic Williamsburg, Virginia.",
                swatches: ["#6C8FA8", "#DAD0B8", "#4E6840", "#C4AB89", "#6E4C2E"],
              },
              {
                name: "Affinity Collection",
                prefix: "AF",
                desc: "144 harmonious colors curated to work beautifully together.",
                swatches: ["#8B2829", "#EFF2EC", "#3E625F", "#DECDB2", "#464C55"],
              },
              {
                name: "Color Stories",
                prefix: "2000-series",
                desc: "Classic fan-deck colors — the backbone of the BM lineup.",
                swatches: ["#474B4E", "#3B5A74", "#A02020", "#B89040", "#567761"],
              },
              {
                name: "Americas Colors",
                prefix: "AC",
                desc: "Inspired by the diverse landscapes of the Americas.",
                swatches: ["#CBC5B1", "#B7916C", "#8C9591", "#DECAAD", "#4F726A"],
              },
            ].map((collection) => (
              <div
                key={collection.name}
                className="p-5 bg-[#1a1a1f] border border-[#2e2e35] rounded-2xl hover:border-[#f97316]/20 transition-all"
              >
                <div className="flex gap-1.5 mb-3">
                  {collection.swatches.map((hex) => (
                    <div
                      key={hex}
                      className="flex-1 h-8 rounded-md border border-white/5"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold text-sm">{collection.name}</h3>
                  <span className="text-[10px] text-[#f97316] font-medium bg-[#f97316]/10 px-2 py-0.5 rounded-full">
                    {collection.prefix}
                  </span>
                </div>
                <p className="text-[#8b8b97] text-xs leading-relaxed">{collection.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 border-b border-[#2e2e35]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Three steps to your dream exterior
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
                <h3 className="text-white font-bold text-lg mt-4 mb-2">{step.title}</h3>
                <p className="text-[#8b8b97] text-sm leading-relaxed">{step.description}</p>
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

      {/* Social proof */}
      <section className="py-16 px-5 border-b border-[#2e2e35] bg-[#1a1a1f]/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-3">
              Why SwatchSnap
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Professional color planning, completely free
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Star size={22} />,
                title: "Authentic Colors",
                desc: "Every color is a real Benjamin Moore paint with accurate hex values — no guessing.",
              },
              {
                icon: <Sparkles size={22} />,
                title: "AI-Powered Realism",
                desc: "OpenAI's gpt-image-1 model paints your actual home photo with photorealistic accuracy.",
              },
              {
                icon: <CheckCircle size={22} />,
                title: "Zero Commitment",
                desc: "No account required, no credit card, no upsells. Just pick colors and visualize.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 bg-[#1a1a1f] border border-[#2e2e35] rounded-2xl text-center"
              >
                <div className="w-11 h-11 bg-[#f97316]/10 rounded-xl flex items-center justify-center text-[#f97316] mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-[#8b8b97] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to see your home in a new light?
          </h2>
          <p className="text-[#8b8b97] mb-8 text-lg">
            Upload your photo and explore 500+ Benjamin Moore exterior colors — free, instant, no sign-up.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#f97316]/20"
          >
            Try SwatchSnap Free
            <ArrowRight size={20} />
          </Link>
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

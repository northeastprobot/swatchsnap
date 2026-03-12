"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Palette,
  Download,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import ColorPicker from "@/components/ColorPicker";
import LeadModal from "@/components/LeadModal";
import type { BenjaminMooreColor } from "@/lib/colors";

type Step = 1 | 2 | 3;

interface ColorSelection {
  primary: BenjaminMooreColor | null;
  trim: BenjaminMooreColor | null;
  accent: BenjaminMooreColor | null;
}

const stepLabels: Record<Step, string> = {
  1: "Upload",
  2: "Colors",
  3: "Visualize",
};

export default function AppPage() {
  const [step, setStep] = useState<Step>(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [colorSelection, setColorSelection] = useState<ColorSelection>({
    primary: null,
    trim: null,
    accent: null,
  });
  const [activeRole, setActiveRole] = useState<"primary" | "trim" | "accent">("primary");

  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isMockResult, setIsMockResult] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const [showLeadModal, setShowLeadModal] = useState(false);

  const handlePhotoSelected = useCallback((file: File, dataUrl: string) => {
    setPhotoFile(file);
    setPhoto(dataUrl);
  }, []);

  const handleClearPhoto = useCallback(() => {
    setPhoto(null);
    setPhotoFile(null);
  }, []);

  const canProceedStep1 = !!photo;
  const canProceedStep2 = !!(colorSelection.primary && colorSelection.trim);

  const handleGenerate = async () => {
    if (!photo || !colorSelection.primary || !colorSelection.trim) return;

    setGenerating(true);
    setGenError(null);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo,
          primaryColor: colorSelection.primary.hex,
          primaryColorName: `${colorSelection.primary.name} ${colorSelection.primary.number}`,
          trimColor: colorSelection.trim.hex,
          trimColorName: `${colorSelection.trim.name} ${colorSelection.trim.number}`,
          accentColor: colorSelection.accent?.hex,
          accentColorName: colorSelection.accent
            ? `${colorSelection.accent.name} ${colorSelection.accent.number}`
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setGeneratedImage(data.imageUrl);
      setIsMockResult(data.mock === true);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "swatchsnap-preview.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(generatedImage, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f11" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#2e2e35]/60 bg-[#0f0f11]/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8b8b97] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#f97316] rounded-lg flex items-center justify-center">
              <Palette size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              SwatchSnap
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s === step
                      ? "bg-[#f97316] text-white"
                      : s < step
                      ? "bg-[#f97316]/30 text-[#f97316]"
                      : "bg-[#242429] text-[#8b8b97]"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-4 h-0.5 rounded ${
                      s < step ? "bg-[#f97316]/30" : "bg-[#2e2e35]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-8">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Upload your home photo
              </h1>
              <p className="text-[#8b8b97] text-sm">
                Use a clear exterior shot for the best results
              </p>
            </div>

            <PhotoUpload
              onPhotoSelected={handlePhotoSelected}
              currentPhoto={photo}
              onClear={handleClearPhoto}
            />

            {/* Tips */}
            {!photo && (
              <div className="p-4 bg-[#1a1a1f] rounded-xl border border-[#2e2e35]">
                <p className="text-xs text-[#8b8b97] font-medium mb-2 uppercase tracking-wide">
                  Tips for best results
                </p>
                <ul className="space-y-1">
                  {[
                    "Front-facing photo works best",
                    "Natural daylight gives the most accurate preview",
                    "Include the full house from foundation to roof",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-xs text-[#8b8b97]"
                    >
                      <span className="text-[#f97316] mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full py-4 bg-[#f97316] hover:bg-[#ea6c0d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:gap-3"
            >
              Continue to Color Selection
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Color Selection */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Choose your colors
                </h1>
                <p className="text-[#8b8b97] text-sm">
                  Select walls and trim (required), plus an accent color for the door
                </p>
              </div>
              {/* Photo thumbnail */}
              {photo && (
                <div className="flex-shrink-0">
                  <div
                    className="relative rounded-xl overflow-hidden border border-[#2e2e35]"
                    style={{ width: 72, height: 54 }}
                  >
                    <Image
                      src={photo}
                      alt="Your home"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>

            <ColorPicker
              selection={colorSelection}
              onSelectionChange={setColorSelection}
              activeRole={activeRole}
              onRoleChange={setActiveRole}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 bg-[#1a1a1f] hover:bg-[#242429] text-white font-medium rounded-2xl border border-[#2e2e35] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-[2] py-3.5 bg-[#f97316] hover:bg-[#ea6c0d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {!canProceedStep2
                  ? "Pick walls & trim first"
                  : "Visualize My Home"}
                {canProceedStep2 && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generate & Result */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {generatedImage ? "Your transformation" : "Ready to visualize"}
              </h1>
              <p className="text-[#8b8b97] text-sm">
                {generatedImage
                  ? "Here's how your home could look with your selected colors"
                  : "Click below to generate your AI-powered preview"}
              </p>
            </div>

            {/* Color recap */}
            <div className="flex gap-3 flex-wrap">
              {(["primary", "trim", "accent"] as const).map((role) => {
                const color = colorSelection[role];
                if (!color) return null;
                const labels = { primary: "Walls", trim: "Trim", accent: "Accents" };
                return (
                  <div
                    key={role}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1f] rounded-xl border border-[#2e2e35]"
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-[10px] text-[#8b8b97]">{labels[role]}</p>
                      <p className="text-xs text-white font-medium leading-tight">
                        {color.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Side-by-side when generated */}
            {generatedImage && photo && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <p className="text-xs text-[#8b8b97] mb-1.5 text-center">Before</p>
                  <div
                    className="relative w-full rounded-xl overflow-hidden border border-[#2e2e35]"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={photo}
                      alt="Original home"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#f97316] mb-1.5 text-center font-medium">After</p>
                  <div
                    className="relative w-full rounded-xl overflow-hidden border border-[#f97316]/30"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={generatedImage}
                      alt="Visualized home"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Generation area */}
            {!generatedImage && !generating && (
              <div
                className="relative w-full rounded-2xl overflow-hidden border border-[#2e2e35] bg-[#1a1a1f] flex flex-col items-center justify-center gap-4 p-12"
                style={{ aspectRatio: "16/10" }}
              >
                {photo && (
                  <>
                    <Image
                      src={photo}
                      alt="Your home"
                      fill
                      className="object-cover opacity-20"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/60 to-transparent" />
                  </>
                )}
                <div className="relative text-center z-10">
                  <Sparkles size={40} className="text-[#f97316] mx-auto mb-3" />
                  <p className="text-white font-semibold text-lg">
                    Ready to transform your home
                  </p>
                  <p className="text-[#8b8b97] text-sm mt-1">
                    AI generation takes about 30–60 seconds
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {generating && (
              <div
                className="w-full rounded-2xl border border-[#2e2e35] bg-[#1a1a1f] flex flex-col items-center justify-center gap-4 p-12"
                style={{ aspectRatio: "16/10" }}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#2e2e35]" />
                  <div
                    className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-[#f97316] border-r-transparent border-b-transparent border-l-transparent"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">Generating your preview...</p>
                  <p className="text-[#8b8b97] text-sm mt-1">
                    Our AI is applying your colors
                  </p>
                </div>
                {/* Animated color bar */}
                <div className="flex gap-2 mt-2">
                  {[colorSelection.primary, colorSelection.trim, colorSelection.accent].map(
                    (c, i) =>
                      c ? (
                        <div
                          key={i}
                          className="h-1.5 rounded-full"
                          style={{
                            width: i === 0 ? 48 : i === 1 ? 32 : 20,
                            backgroundColor: c.hex,
                            animation: `pulse ${1 + i * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      ) : null
                  )}
                </div>
              </div>
            )}

            {/* Mock mode notice */}
            {isMockResult && (
              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  <strong>Demo mode:</strong> Add your REPLICATE_API_TOKEN to .env.local for real AI-generated previews.
                </p>
              </div>
            )}

            {/* Error */}
            {genError && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{genError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {!generatedImage && !generating && (
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20 hover:scale-[1.01]"
                >
                  <Sparkles size={20} />
                  Visualize My Home
                </button>
              )}

              {generatedImage && (
                <>
                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="w-full py-4 bg-[#f97316] hover:bg-[#ea6c0d] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20"
                  >
                    Love it? Get a Free Professional Estimate
                    <ChevronRight size={18} />
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 bg-[#1a1a1f] hover:bg-[#242429] text-white font-medium rounded-2xl border border-[#2e2e35] transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedImage(null);
                        setIsMockResult(false);
                        setGenError(null);
                        handleGenerate();
                      }}
                      className="flex-1 py-3 bg-[#1a1a1f] hover:bg-[#242429] text-white font-medium rounded-2xl border border-[#2e2e35] transition-all"
                    >
                      Regenerate
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setStep(2);
                      setGeneratedImage(null);
                    }}
                    className="w-full py-3 text-[#8b8b97] hover:text-white transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    Try different colors
                  </button>
                </>
              )}

              {!generatedImage && !generating && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-[#1a1a1f] hover:bg-[#242429] text-[#8b8b97] hover:text-white font-medium rounded-2xl border border-[#2e2e35] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Colors
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2e2e35] py-6 px-5 mt-auto">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#8b8b97] text-xs">
            Powered by{" "}
            <a
              href="https://northeastproservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#f97316] transition-colors font-medium"
            >
              Northeast Pro Services
            </a>{" "}
            — Buffalo, NY
          </p>
        </div>
      </footer>

      {/* Lead Modal */}
      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        colors={colorSelection}
      />
    </div>
  );
}

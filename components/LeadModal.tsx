"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import type { BenjaminMooreColor } from "@/lib/colors";

interface LeadData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: {
    primary: BenjaminMooreColor | null;
    trim: BenjaminMooreColor | null;
    accent: BenjaminMooreColor | null;
  };
}

export default function LeadModal({ isOpen, onClose, colors }: LeadModalProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          colors: {
            primary: colors.primary
              ? `${colors.primary.name} (${colors.primary.number})`
              : null,
            trim: colors.trim
              ? `${colors.trim.name} (${colors.trim.number})`
              : null,
            accent: colors.accent
              ? `${colors.accent.name} (${colors.accent.number})`
              : null,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#1a1a1f] border border-[#2e2e35] rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] to-[#fb923c]" />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#8b8b97] hover:text-white hover:bg-[#2e2e35] transition-colors"
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="flex justify-center mb-4">
                <CheckCircle size={56} className="text-[#f97316]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                You&rsquo;re all set!
              </h2>
              <p className="text-[#8b8b97] mb-6">
                Thanks! Our team at Northeast Pro Services will be in touch within 24 hours with your free estimate.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#242429] hover:bg-[#2e2e35] text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Color preview bar */}
              {(colors.primary || colors.trim || colors.accent) && (
                <div className="flex gap-1.5 mb-5 h-3 rounded-full overflow-hidden">
                  {colors.primary && (
                    <div
                      className="flex-[2] rounded-full"
                      style={{ backgroundColor: colors.primary.hex }}
                      title={colors.primary.name}
                    />
                  )}
                  {colors.trim && (
                    <div
                      className="flex-1 rounded-full"
                      style={{ backgroundColor: colors.trim.hex }}
                      title={colors.trim.name}
                    />
                  )}
                  {colors.accent && (
                    <div
                      className="flex-[0.5] rounded-full"
                      style={{ backgroundColor: colors.accent.hex }}
                      title={colors.accent.name}
                    />
                  )}
                </div>
              )}

              <h2 className="text-xl font-bold text-white mb-1">
                Love your new look?
              </h2>
              <p className="text-[#8b8b97] text-sm mb-5">
                Get a free professional estimate from Northeast Pro Services — Buffalo&rsquo;s premier exterior painting team.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name *"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242429] border border-[#2e2e35] rounded-xl text-white placeholder-[#8b8b97] focus:outline-none focus:border-[#f97316] transition-colors text-sm"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242429] border border-[#2e2e35] rounded-xl text-white placeholder-[#8b8b97] focus:outline-none focus:border-[#f97316] transition-colors text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242429] border border-[#2e2e35] rounded-xl text-white placeholder-[#8b8b97] focus:outline-none focus:border-[#f97316] transition-colors text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Property address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242429] border border-[#2e2e35] rounded-xl text-white placeholder-[#8b8b97] focus:outline-none focus:border-[#f97316] transition-colors text-sm"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center animate-fade-in">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea6c0d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get My Free Estimate
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#8b8b97] text-center">
                  No spam, ever. Your info goes directly to our team.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

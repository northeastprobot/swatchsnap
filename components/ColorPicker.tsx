"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Check, Search, X } from "lucide-react";
import {
  ALL_COLORS,
  COLLECTIONS,
  type BenjaminMooreColor,
  type CollectionName,
} from "@/lib/colors";

interface ColorSelectionState {
  primary: BenjaminMooreColor | null;
  trim: BenjaminMooreColor | null;
  accent: BenjaminMooreColor | null;
}

interface ColorPickerProps {
  selection: ColorSelectionState;
  onSelectionChange: (selection: ColorSelectionState) => void;
  activeRole: "primary" | "trim" | "accent";
  onRoleChange: (role: "primary" | "trim" | "accent") => void;
}

const roleLabels = {
  primary: { label: "Walls", description: "Main body / siding color" },
  trim: { label: "Trim", description: "Fascia, soffits, window frames" },
  accent: { label: "Accents", description: "Door, shutters (optional)" },
};

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default function ColorPicker({
  selection,
  onSelectionChange,
  activeRole,
  onRoleChange,
}: ColorPickerProps) {
  const [activeCollection, setActiveCollection] = useState<CollectionName>("Historical Colors");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Filtered colors: search overrides collection filter
  const visibleColors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length >= 2) {
      return ALL_COLORS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.number.toLowerCase().includes(q) ||
          c.collection.toLowerCase().includes(q)
      );
    }
    if (activeCollection === "All") return ALL_COLORS;
    return ALL_COLORS.filter((c) => c.collection === activeCollection);
  }, [searchQuery, activeCollection]);

  const handleColorClick = (color: BenjaminMooreColor) => {
    onSelectionChange({ ...selection, [activeRole]: color });
  };

  const getRoleForColor = (color: BenjaminMooreColor): "primary" | "trim" | "accent" | null => {
    if (selection.primary?.number === color.number && selection.primary?.hex === color.hex) return "primary";
    if (selection.trim?.number === color.number && selection.trim?.hex === color.hex) return "trim";
    if (selection.accent?.number === color.number && selection.accent?.hex === color.hex) return "accent";
    return null;
  };

  const isActiveRoleColor = (color: BenjaminMooreColor) =>
    selection[activeRole]?.number === color.number && selection[activeRole]?.hex === color.hex;

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  // Scroll active collection tab into view
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeBtn = tabsRef.current.querySelector("[data-active='true']") as HTMLElement | null;
    activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCollection]);

  return (
    <div className="w-full space-y-4">
      {/* ── Role selector ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {(["primary", "trim", "accent"] as const).map((role) => {
          const color = selection[role];
          const isActive = activeRole === role;
          return (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150
                ${isActive
                  ? "border-[#f97316] bg-[#f97316]/5"
                  : "border-[#2e2e35] bg-[#1a1a1f] hover:border-[#3e3e45]"}
              `}
            >
              {/* Color chip */}
              <div
                className="w-10 h-10 rounded-full border-2 border-white/10 shadow-md transition-transform hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: color?.hex ?? "#2e2e35" }}
              >
                {color && isActive && (
                  <Check
                    size={14}
                    style={{ color: contrastColor(color.hex) }}
                    strokeWidth={3}
                  />
                )}
              </div>
              <div className="text-center w-full">
                <p className={`text-xs font-semibold ${isActive ? "text-[#f97316]" : "text-white"}`}>
                  {roleLabels[role].label}
                </p>
                {color ? (
                  <p className="text-[10px] text-[#8b8b97] leading-tight mt-0.5 truncate max-w-full px-1">
                    {color.name}
                  </p>
                ) : (
                  <p className="text-[10px] text-[#8b8b97] mt-0.5">
                    {role === "accent" ? "Optional" : "Pick a color"}
                  </p>
                )}
              </div>
              {isActive && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#f97316] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#8b8b97] text-center">
        Selecting:{" "}
        <span className="text-white font-medium">{roleLabels[activeRole].description}</span>
      </p>

      {/* ── Search bar ─────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8b97] pointer-events-none"
        />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or number (e.g. Hale Navy, HC-154)"
          className="w-full pl-9 pr-9 py-2.5 bg-[#1a1a1f] border border-[#2e2e35] rounded-xl text-sm text-white placeholder-[#8b8b97] focus:outline-none focus:border-[#f97316] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8b97] hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Collection tabs ────────────────────────────────────────── */}
      {!searchQuery && (
        <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {COLLECTIONS.map((col) => (
            <button
              key={col}
              data-active={activeCollection === col}
              onClick={() => setActiveCollection(col as CollectionName)}
              className={`
                whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
                ${activeCollection === col
                  ? "bg-[#f97316] text-white"
                  : "bg-[#242429] text-[#8b8b97] hover:text-white hover:bg-[#2e2e35]"}
              `}
            >
              {col}
            </button>
          ))}
        </div>
      )}

      {/* Search results count */}
      {searchQuery.trim().length >= 2 && (
        <p className="text-xs text-[#8b8b97]">
          {visibleColors.length === 0
            ? "No colors found"
            : `${visibleColors.length} color${visibleColors.length !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* ── Premium color grid ─────────────────────────────────────── */}
      {visibleColors.length === 0 ? (
        <div className="py-12 text-center text-[#8b8b97] text-sm">
          No colors match &ldquo;{searchQuery}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
          {visibleColors.map((color) => {
            const role = getRoleForColor(color);
            const isCurrentRole = isActiveRoleColor(color);
            const roleTag = role
              ? { primary: "W", trim: "T", accent: "A" }[role]
              : null;

            return (
              <button
                key={`${color.number}-${color.hex}`}
                onClick={() => handleColorClick(color)}
                className={`
                  group relative flex flex-col rounded-xl overflow-hidden transition-all duration-150
                  hover:scale-[1.03] hover:shadow-lg hover:shadow-black/30
                  ${isCurrentRole
                    ? "ring-2 ring-[#f97316] ring-offset-2 ring-offset-[#0f0f11]"
                    : role
                    ? "ring-1 ring-white/20 ring-offset-1 ring-offset-[#0f0f11]"
                    : ""}
                `}
              >
                {/* Color chip */}
                <div
                  className="w-full aspect-[4/3] relative"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Role badge */}
                  {roleTag && (
                    <div
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow"
                      style={{
                        backgroundColor: isCurrentRole ? "#f97316" : "rgba(0,0,0,0.4)",
                        color: "#fff",
                      }}
                    >
                      {roleTag}
                    </div>
                  )}
                  {/* Checkmark for active selection */}
                  {isCurrentRole && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg">
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="bg-[#1a1a1f] px-1.5 py-1.5 border-t border-[#2e2e35] group-hover:bg-[#242429] transition-colors">
                  <p className="text-[10px] font-semibold text-white leading-tight truncate">
                    {color.name}
                  </p>
                  <p className="text-[9px] text-[#8b8b97] mt-0.5 leading-tight">
                    {color.number}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Selected colors summary ────────────────────────────────── */}
      {(selection.primary || selection.trim || selection.accent) && (
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#1a1a1f] rounded-xl border border-[#2e2e35]">
          {(["primary", "trim", "accent"] as const).map((role) => {
            const color = selection[role];
            const label = roleLabels[role].label;
            return (
              <div key={role} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10 shadow-sm"
                  style={{ backgroundColor: color?.hex ?? "#2e2e35" }}
                />
                <div className="text-center min-w-0 w-full">
                  <p className="text-[9px] text-[#8b8b97] uppercase tracking-wide">{label}</p>
                  <p className="text-[10px] text-white font-medium truncate px-0.5">
                    {color ? color.name : <span className="text-[#8b8b97]">—</span>}
                  </p>
                  {color && (
                    <p className="text-[9px] text-[#8b8b97]">{color.number}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

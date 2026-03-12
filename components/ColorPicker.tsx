"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  bmColors,
  colorCategories,
  type BenjaminMooreColor,
  type ColorCategory,
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

export default function ColorPicker({
  selection,
  onSelectionChange,
  activeRole,
  onRoleChange,
}: ColorPickerProps) {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>(
    colorCategories[0]
  );

  const visibleColors = bmColors.filter((c) => c.category === activeCategory);

  const handleColorClick = (color: BenjaminMooreColor) => {
    onSelectionChange({ ...selection, [activeRole]: color });
  };

  const isSelected = (color: BenjaminMooreColor) => {
    return (
      selection.primary?.hex === color.hex ||
      selection.trim?.hex === color.hex ||
      selection.accent?.hex === color.hex
    );
  };

  const getRoleForColor = (color: BenjaminMooreColor): string | null => {
    if (selection.primary?.hex === color.hex) return "W";
    if (selection.trim?.hex === color.hex) return "T";
    if (selection.accent?.hex === color.hex) return "A";
    return null;
  };

  function contrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  return (
    <div className="w-full space-y-4">
      {/* Role selector */}
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
                  : "border-[#2e2e35] bg-[#1a1a1f] hover:border-[#2e2e35]/80"
                }
              `}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-white/10 shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: color?.hex ?? "#2e2e35" }}
              />
              <div className="text-center">
                <p className={`text-xs font-semibold ${isActive ? "text-[#f97316]" : "text-white"}`}>
                  {roleLabels[role].label}
                </p>
                {color ? (
                  <p className="text-[10px] text-[#8b8b97] leading-tight mt-0.5 truncate max-w-[90px]">
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
        <span className="text-white font-medium">
          {roleLabels[activeRole].description}
        </span>
      </p>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {colorCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
              ${activeCategory === cat
                ? "bg-[#f97316] text-white"
                : "bg-[#242429] text-[#8b8b97] hover:text-white hover:bg-[#2e2e35]"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Color grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {visibleColors.map((color) => {
          const roleLabel = getRoleForColor(color);
          const selected = isSelected(color);
          const isCurrentRole = selection[activeRole]?.hex === color.hex;

          return (
            <button
              key={`${color.number}-${color.hex}`}
              onClick={() => handleColorClick(color)}
              title={`${color.name} (${color.number})`}
              className={`
                group relative aspect-square rounded-xl transition-all duration-150 hover:scale-110 hover:shadow-lg
                ${isCurrentRole ? "ring-2 ring-[#f97316] ring-offset-2 ring-offset-[#0f0f11] scale-105" : ""}
                ${selected && !isCurrentRole ? "ring-1 ring-white/30 ring-offset-1 ring-offset-[#0f0f11]" : ""}
              `}
              style={{ backgroundColor: color.hex }}
            >
              {roleLabel && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ color: contrastColor(color.hex) }}
                >
                  {roleLabel}
                </span>
              )}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0f0f11] border border-[#2e2e35] rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                <p className="font-medium">{color.name}</p>
                <p className="text-[#8b8b97]">{color.number}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected colors summary */}
      {(selection.primary || selection.trim || selection.accent) && (
        <div className="flex gap-3 p-3 bg-[#1a1a1f] rounded-xl border border-[#2e2e35]">
          {(["primary", "trim", "accent"] as const).map((role) => {
            const color = selection[role];
            if (!color && role === "accent") return null;
            return (
              <div key={role} className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0 border border-white/10"
                  style={{ backgroundColor: color?.hex ?? "#2e2e35" }}
                />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#8b8b97] capitalize">{roleLabels[role].label}</p>
                  <p className="text-xs text-white font-medium truncate">
                    {color ? color.name : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

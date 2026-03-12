"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelected: (file: File, dataUrl: string) => void;
  currentPhoto?: string | null;
  onClear?: () => void;
}

export default function PhotoUpload({
  onPhotoSelected,
  currentPhoto,
  onClear,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = useCallback(
    (file: File) => {
      setError(null);

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onPhotoSelected(file, dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onPhotoSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
  };

  if (currentPhoto) {
    return (
      <div className="relative w-full animate-fade-in">
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#2e2e35] bg-[#1a1a1f]" style={{ aspectRatio: "16/9" }}>
          <Image
            src={currentPhoto}
            alt="Uploaded home"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110"
            title="Remove photo"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-2 text-sm text-[#8b8b97] text-center">
          Photo uploaded — looking great!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center gap-4 p-10
          ${isDragging
            ? "border-[#f97316] bg-[#f97316]/5 scale-[1.01]"
            : "border-[#2e2e35] bg-[#1a1a1f] hover:border-[#f97316]/50 hover:bg-[#1a1a1f]/80"
          }
        `}
        style={{ minHeight: "240px" }}
      >
        <div
          className={`p-4 rounded-full transition-colors ${
            isDragging ? "bg-[#f97316]/20" : "bg-[#242429]"
          }`}
        >
          {isDragging ? (
            <ImageIcon size={32} className="text-[#f97316]" />
          ) : (
            <Upload size={32} className="text-[#8b8b97]" />
          )}
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">
            {isDragging ? "Drop it here!" : "Upload a photo of your home"}
          </p>
          <p className="text-[#8b8b97] text-sm mt-1">
            Drag & drop or click to browse
          </p>
          <p className="text-[#8b8b97] text-xs mt-1">
            JPG, PNG or WebP — up to 10MB
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 text-center animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

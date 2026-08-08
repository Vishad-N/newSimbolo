"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { MediaSelector } from "../shared/MediaSelector";

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  folder?: string;
}

export function ImageUploader({ label, value, onChange, className, folder = "general" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleRemove = () => {
    setPreview(null);
    onChange?.("");
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      
      {preview ? (
        <div className="relative rounded-xl overflow-hidden group aspect-video bg-black/50 border border-white/10">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
            <MediaSelector 
              triggerText="Replace" 
              folder={folder}
              onSelect={(asset) => {
                setPreview(asset.url);
                onChange?.(asset.url);
              }}
            />
            <button 
              onClick={handleRemove}
              type="button"
              className="bg-red-500/20 text-red-300 hover:bg-red-500/40 px-3 py-2 rounded-md font-medium text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]">
          <MediaSelector 
            triggerText="Browse Cloudinary Library" 
            folder={folder}
            onSelect={(asset) => {
              setPreview(asset.url);
              onChange?.(asset.url);
            }}
          />
          <p className="text-xs text-gray-500 mt-4">Select an existing asset or upload a new one.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/utils";

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ImageUploader({ label, value, onChange, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In a real implementation, upload to server here.
    // We'll mock it by just setting a mock URL.
    const mockUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop";
    setPreview(mockUrl);
    onChange?.(mockUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Mock upload
      const mockUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop";
      setPreview(mockUrl);
      onChange?.(mockUrl);
    }
  };

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
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={handleRemove}
              type="button"
              className="bg-red-500/20 text-red-300 hover:bg-red-500/40 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
          )}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-200 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}
    </div>
  );
}

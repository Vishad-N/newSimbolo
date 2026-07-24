"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PreviewType } from "@/types/video-editing";

type VideoPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  previewUrl: string;
  previewType: PreviewType;
};

export function VideoPreviewModal({ isOpen, onClose, title, previewUrl, previewType }: VideoPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl overflow-hidden rounded-[16px] border border-[var(--accent)]/30 bg-[var(--surface)] shadow-[0_0_50px_rgba(34,211,238,0.15)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-[var(--background)]">
            <h3 className="text-[1.1rem] font-bold text-white">{title} Preview</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative aspect-video w-full bg-black">
            {previewType === "youtube" && (
              <iframe
                src={previewUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
            
            {previewType === "vimeo" && (
              <iframe
                src={previewUrl}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
            
            {previewType === "direct" && (
              <video
                src={previewUrl}
                controls
                autoPlay
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}

            {previewType === "instagram" && (
              <div className="flex h-full items-center justify-center">
                <p className="text-white/50">Instagram Reel Previews coming soon.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

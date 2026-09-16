"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PreviewType } from "@/types/video-editing";
import { toEmbeddableVideoUrl } from "@/lib/utils";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type VideoPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  previewUrl: string;
  previewType: PreviewType;
};

export function VideoPreviewModal({ isOpen, onClose, title, previewUrl, previewType }: VideoPreviewModalProps) {
  // Instagram doesn't allow embedding reels in a plain iframe; the only supported route
  // is their official embed.js widget script processing a data-instgrm-permalink
  // blockquote, so the script must be (re)loaded and re-run whenever this modal opens.
  useEffect(() => {
    if (!isOpen || previewType !== "instagram") return;

    const process = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.getElementById("instagram-embed-js");
    if (existing) {
      existing.addEventListener("load", process, { once: true });
      return () => existing.removeEventListener("load", process);
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-js";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", process, { once: true });
    document.body.appendChild(script);
  }, [isOpen, previewType, previewUrl]);

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
          className={`relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-[16px] border border-[var(--accent)]/30 bg-[var(--surface)] shadow-[0_0_50px_rgba(34,211,238,0.15)] ${previewType === "instagram" ? "max-w-[400px]" : "max-w-5xl"}`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4 bg-[var(--background)]">
            <h3 className="text-[1.1rem] font-bold text-white">{title} Preview</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={`relative w-full bg-black ${previewType === "instagram" ? "overflow-y-auto" : "aspect-video"}`}>
            {previewType === "youtube" && (
              <iframe
                src={toEmbeddableVideoUrl(previewUrl, "youtube")}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}

            {previewType === "vimeo" && (
              <iframe
                src={toEmbeddableVideoUrl(previewUrl, "vimeo")}
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
              <div className="flex justify-center bg-[var(--surface)] p-3 sm:p-4">
                <div className="w-full max-w-[350px] overflow-hidden rounded-xl bg-white shadow-lg">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={previewUrl}
                    data-instgrm-version="14"
                    style={{ margin: 0, width: "100%" }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

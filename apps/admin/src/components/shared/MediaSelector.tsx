"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UploadCloud, Image as ImageIcon, Check, X } from "lucide-react";
import { cn } from "@/utils/utils";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  format: string;
  width?: number;
  height?: number;
  folder: string;
}

interface MediaSelectorProps {
  onSelect: (media: MediaAsset) => void;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  folder?: string;
}

export function MediaSelector({ onSelect, triggerText = "Select Media", triggerIcon, folder }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAssets = async () => {
    setTimeout(() => setIsLoading(true), 0);
    try {
      const url = folder ? `/api/website-media?folder=${folder}` : "/api/website-media";
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Failed to fetch media assets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, folder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    try {
      const res = await fetch("/api/website-media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });

      if (res.ok) {
        await fetchAssets();
      }
    } catch (error) {
      console.error("Failed to upload file", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      setIsOpen(false);
      setSelectedAsset(null);
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
      >
        {triggerIcon || <ImageIcon className="w-4 h-4" />}
        {triggerText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative z-50 flex flex-col w-full max-w-4xl h-[80vh] bg-background border rounded-lg shadow-lg overflow-hidden m-4">
            <div className="flex flex-row items-center justify-between border-b p-6">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Website Media Library (Cloudinary)</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleUpload}
                    accept="image/*,video/*,.pdf"
                    disabled={isUploading}
                  />
                  <button 
                    disabled={isUploading} 
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    Upload New
                  </button>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p>No media found. Upload something to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {assets.map((asset) => (
                    <div 
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={cn(
                        "relative group cursor-pointer aspect-square rounded-lg border-2 overflow-hidden bg-background transition-all",
                        selectedAsset?.id === asset.id ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
                      )}
                    >
                      <img 
                        src={asset.url} 
                        alt={asset.filename} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {selectedAsset?.id === asset.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs font-medium text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.filename}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t bg-background">
              <button 
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={handleConfirm} 
                disabled={!selectedAsset}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

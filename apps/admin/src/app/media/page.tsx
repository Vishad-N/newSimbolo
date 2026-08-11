"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UploadCloud, Image as ImageIcon, Search, Trash2, Folder, Grid, List } from "lucide-react";
import { cn } from "@/utils/utils";
import { api } from "@/services/api";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  format: string;
  folder: string;
  createdAt: string;
  bytes: number;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("general");
  
  const folders = ["general", "blogs", "services", "homepage", "case-studies"];

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await api.media.getAll(selectedFolder);
      setAssets(data as MediaAsset[]);
    } catch (error) {
      console.error("Failed to fetch media assets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [selectedFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", selectedFolder);

    try {
      await api.media.upload(formData);
      fetchAssets();
    } catch (error) {
      console.error("Failed to upload file", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    
    try {
      await api.media.delete(id);
      fetchAssets();
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage public assets used across your landing pages and CMS.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search assets..." 
              className="pl-8 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative overflow-hidden inline-flex">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleUpload}
              accept="image/*,video/*,.pdf"
              disabled={isUploading}
            />
            <button disabled={isUploading} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Upload Asset
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Folders</h3>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                selectedFolder === folder 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "hover:bg-accent text-foreground"
              )}
            >
              <Folder className={cn("w-4 h-4", selectedFolder === folder ? "text-primary-foreground" : "text-muted-foreground")} />
              <span className="capitalize">{folder.replace('-', ' ')}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold capitalize flex items-center gap-2">
              {selectedFolder.replace('-', ' ')}
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-normal">
                {filteredAssets.length} items
              </span>
            </h2>
            <div className="flex items-center bg-muted rounded-md p-0.5">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-sm transition-colors", viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-sm transition-colors", viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading media...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto gap-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-medium text-lg">No assets found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No media matches your search." : `This folder is empty. Upload an asset to get started.`}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="group relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    <img 
                      src={asset.url} 
                      alt={asset.filename} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-xs font-medium text-white truncate" title={asset.filename}>{asset.filename}</p>
                      <p className="text-[10px] text-white/70 mt-0.5">{(asset.bytes / 1024).toFixed(1)} KB • {asset.format}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                        <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-medium text-sm truncate" title={asset.filename}>{asset.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{asset.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{(asset.bytes / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

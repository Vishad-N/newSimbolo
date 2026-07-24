"use client";

import { useState } from "react";
import { Search, UploadCloud, Folder, Image as ImageIcon, FileVideo, MoreVertical, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "svg";
  url: string;
  size: string;
  date: string;
}

const mockMedia: MediaItem[] = [
  { id: "1", name: "hero-bg.jpg", type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop", size: "2.4 MB", date: "Oct 24, 2023" },
  { id: "2", name: "logo-white.svg", type: "svg", url: "", size: "12 KB", date: "Oct 25, 2023" },
  { id: "3", name: "promo-video.mp4", type: "video", url: "", size: "15.8 MB", date: "Oct 26, 2023" },
  { id: "4", name: "team-photo.jpg", type: "image", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop", size: "3.1 MB", date: "Oct 27, 2023" },
  { id: "5", name: "icon-set.svg", type: "svg", url: "", size: "45 KB", date: "Oct 28, 2023" },
  { id: "6", name: "office-tour.mp4", type: "video", url: "", size: "42.5 MB", date: "Oct 29, 2023" },
];

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>(mockMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video" | "svg">("all");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-400" />;
      case 'video': return <FileVideo className="w-8 h-8 text-purple-400" />;
      case 'svg': return <ImageIcon className="w-8 h-8 text-orange-400" />;
      default: return <ImageIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Media Library</h1>
          <p className="text-sm text-gray-400">Manage all your images, videos, and icons in one place.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <UploadCloud className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
          {["all", "image", "video", "svg"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Upload Card */}
        <div className="glass-card rounded-xl aspect-square flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/[0.02] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-primary" />
          </div>
          <span className="text-sm font-medium text-gray-300">Drag & Drop</span>
        </div>

        {/* Media Items */}
        {filteredItems.map(item => (
          <div key={item.id} className="glass-card rounded-xl aspect-square flex flex-col overflow-hidden group relative">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setItems(items.filter(i => i.id !== item.id))}
                className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md backdrop-blur-sm transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex-1 bg-black/40 flex items-center justify-center relative overflow-hidden">
              {item.type === 'image' && item.url ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                getIcon(item.type)
              )}
            </div>
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
              <p className="text-xs font-medium text-white truncate" title={item.name}>{item.name}</p>
              <div className="flex justify-between mt-1 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>{item.type}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
          <p className="text-gray-400">No media files found matching your search.</p>
        </div>
      )}
    </div>
  );
}

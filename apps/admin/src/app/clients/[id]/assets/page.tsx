"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Folder, File, FileImage, FileVideo, Download, Upload, FolderPlus, Trash2 } from "lucide-react";
import { UploadModal } from "@/components/documents/UploadModal";
import { CreateFolderModal } from "@/components/documents/CreateFolderModal";
import { Card } from "@/components/ui/Card";

export default function ClientAssetsPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);

  // Mock data for Admin view (eventually fetched via API)
  const [folders, setFolders] = useState([
    { name: "Contracts & Agreements", count: 3 },
    { name: "Brand Assets", count: 45 },
  ]);

  const [recentFiles, setRecentFiles] = useState([
    { name: "Q3_SEO_Strategy.pdf", type: "pdf", date: "Oct 12, 2026", size: "2.4 MB", url: "data:text/plain,Preview%20file%20metadata" },
    { name: "Website_Wireframes.fig", type: "design", date: "Oct 10, 2026", size: "14 MB", url: "data:text/plain,Preview%20file%20metadata" },
    { name: "Promo_Video_v2.mp4", type: "video", date: "Oct 05, 2026", size: "128 MB", url: "data:text/plain,Preview%20file%20metadata" },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Client Assets Portal
          </h1>
          <p className="text-sm text-gray-400">Manage deliverables and assets for Client: {clientId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setCreateFolderModalOpen(true)}
            className="px-4 py-2 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
          <button 
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-[12px] bg-[var(--primary)] text-black text-sm font-bold hover:scale-105 hover:shadow-[0_8px_16px_var(--primary-glow)] transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>
      </div>

      {/* Storage Usage Bar */}
      <div className="bg-surface/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-medium">Storage Allocation (Client Quota)</span>
          <span className="text-gray-400">2.4 GB / 10 GB</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[var(--primary)] w-[24%] rounded-full shadow-[0_0_10px_var(--primary-glow)]"></div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Folders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {folders.map((f, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-surface/60 backdrop-blur border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-white">{f.name}</div>
                <div className="text-xs text-gray-500">{f.count} files</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">All Files</h2>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {recentFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400">
                    {file.type === "pdf" ? <File className="w-5 h-5 text-red-400" /> :
                     file.type === "design" ? <FileImage className="w-5 h-5 text-purple-400" /> :
                     <FileVideo className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm group-hover:text-primary transition-colors">{file.name}</div>
                    <div className="text-xs text-gray-500 flex gap-2">
                      <span>{file.date}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={file.url} download={file.name} aria-label={`Download ${file.name}`} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Download className="w-4 h-4" />
                  </a>
                  <button onClick={() => setRecentFiles((files) => files.filter((_, fileIndex) => fileIndex !== i))} aria-label={`Remove ${file.name}`} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* These will reuse the client app modals for now. In reality we'd create admin specific versions. */}
      {isUploadModalOpen && (
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setUploadModalOpen(false)} 
          onUpload={async (files) => {
            setRecentFiles((currentFiles) => [
              ...files.map((file) => ({
                name: file.name,
                type: file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "design" : "pdf",
                date: new Date().toLocaleDateString(),
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                url: URL.createObjectURL(file),
              })),
              ...currentFiles,
            ]);
          }} 
        />
      )}
      {isCreateFolderModalOpen && (
        <CreateFolderModal 
          isOpen={isCreateFolderModalOpen} 
          onClose={() => setCreateFolderModalOpen(false)} 
          onCreate={(name) => {
            setFolders(prev => [...prev, { name, count: 0 }]);
          }} 
        />
      )}
    </div>
  );
}

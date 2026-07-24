"use client";

import { Card } from "@/components/ui/Card";
import { FileText, Folder, File, FileImage, FileVideo, Download } from "lucide-react";

export default function DocumentsPage() {
  const folders = [
    { name: "Contracts & Agreements", count: 3 },
    { name: "Invoices", count: 12 },
    { name: "Brand Assets", count: 45 },
  ];

  const recentFiles = [
    { name: "Q3_SEO_Strategy.pdf", type: "pdf", date: "Oct 12, 2026", size: "2.4 MB" },
    { name: "Website_Wireframes.fig", type: "design", date: "Oct 10, 2026", size: "14 MB" },
    { name: "Promo_Video_v2.mp4", type: "video", date: "Oct 05, 2026", size: "128 MB" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Documents & Files
          </h1>
          <p className="text-sm text-gray-400">Access your project deliverables, contracts, and assets.</p>
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
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Files</h2>
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
                <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

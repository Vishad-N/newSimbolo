"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { FileText, Folder, File, FileImage, FileVideo, Download, Upload, MoreVertical, Loader2 } from "lucide-react";
import { UploadModal } from "@/components/documents/UploadModal";
import { mockApi } from "@/services/api";

interface DocumentRecord {
  id: string;
  title: string;
  category: string;
  mimeType?: string | null;
  fileSize?: number | null;
  fileUrl: string;
  createdAt: string;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function fileIconFor(mimeType?: string | null) {
  if (mimeType?.startsWith("image/")) return <FileImage className="w-5 h-5 text-purple-400" />;
  if (mimeType?.startsWith("video/")) return <FileVideo className="w-5 h-5 text-blue-400" />;
  return <File className="w-5 h-5 text-red-400" />;
}

function categoryLabel(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DocumentsPage() {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockApi.documents.getAll();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error("Failed to fetch documents", requestError);
      setError("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = async (doc: DocumentRecord) => {
    try {
      await mockApi.documents.trackDownload(doc.id);
    } catch (requestError) {
      console.error("Failed to record download", requestError);
    }
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  // Derived from real documents — there's no user-created "folder" concept on the
  // backend, just a fixed category enum, so group by that instead of faking folders.
  const categoryCounts = documents.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.category] = (acc[doc.category] ?? 0) + 1;
    return acc;
  }, {});

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
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-[12px] bg-[var(--primary)] text-black text-sm font-bold hover:scale-105 hover:shadow-[0_8px_16px_var(--primary-glow)] transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      ) : documents.length === 0 ? (
        <Card className="p-12 text-center text-gray-400">
          No documents yet. Files shared by your account manager will appear here.
        </Card>
      ) : (
        <>
          {Object.keys(categoryCounts).length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center gap-4 p-4 bg-surface/60 backdrop-blur border border-white/10 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{categoryLabel(category)}</div>
                      <div className="text-xs text-gray-500">{count} file{count === 1 ? "" : "s"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">All Files</h2>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-white/5">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400">
                        {fileIconFor(doc.mimeType)}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm group-hover:text-primary transition-colors">{doc.title}</div>
                        <div className="text-xs text-gray-500 flex gap-2">
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={async (files) => {
          // One document per file — the backend registers each upload as its
          // own Document record, using the file's own name as the title since
          // this modal doesn't collect one separately.
          for (const file of files) {
            await mockApi.documents.upload(file, file.name);
          }
          await fetchDocuments();
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { FileText, Upload, Download, RefreshCw, X, UploadCloud } from "lucide-react";
import { api, AdminDocument, DocumentCategory, getDataArray } from "@/services/api";

const CATEGORY_OPTIONS: DocumentCategory[] = ["CONTRACT", "NDA", "PROPOSAL", "REPORT", "BRIEF", "PROJECT_FILE", "OTHER"];

interface ClientOption {
  id: string;
  name: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function categoryLabel(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function UploadDocumentModal({
  isOpen,
  onClose,
  clients,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientOption[];
  onUpload: (file: File, title: string, category: DocumentCategory, clientId: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("OTHER");
  const [clientId, setClientId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setFile(null);
    setTitle("");
    setCategory("OTHER");
    setClientId("");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!file || !title.trim() || !clientId) {
      setError("File, title, and client are all required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onUpload(file, title.trim(), category, clientId);
      reset();
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Upload failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface/90 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-heading">Upload Document</h2>
          <button onClick={handleClose} disabled={submitting} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4">
          <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer border-white/20 hover:border-white/40 bg-white/[0.02] transition-all">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <UploadCloud className="w-8 h-8 text-primary mb-2" />
            <span className="text-sm text-gray-300">{file ? file.name : "Click to choose a file"}</span>
            {file && <span className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</span>}
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client NDA – Acme Corp 2026"
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{categoryLabel(c)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="">Select a client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
          <button onClick={handleClose} disabled={submitting} className="px-6 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-[var(--primary)] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setUploadOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docsPage, clientsRaw] = await Promise.all([
        api.documents.getAll({ pageSize: 100 }),
        api.clients.getAll(),
      ]);
      setDocuments(docsPage.items);
      setClients(
        getDataArray<any>(clientsRaw).map((c) => ({
          id: c.id,
          name: [c.user?.firstName, c.user?.lastName].filter(Boolean).join(" ") || c.user?.email || c.id,
        })),
      );
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Failed to load documents"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File, title: string, category: DocumentCategory, clientId: string) => {
    await api.documents.upload(file, { title, category, clientId });
    await fetchData();
  };

  const handleDelete = async (doc: AdminDocument) => {
    if (!confirm(`Delete "${doc.title}"?`)) return;
    try {
      await api.documents.delete(doc.id);
      fetchData();
    } catch (requestError) {
      alert("Failed to delete document: " + getErrorMessage(requestError, "Unknown error"));
    }
  };

  const columns: Column<AdminDocument>[] = [
    {
      key: "title",
      header: "Document",
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-medium text-white block">{doc.title}</span>
            <span className="text-xs text-gray-400 block">{formatFileSize(doc.fileSize)}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (doc) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
          {categoryLabel(doc.category)}
        </span>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (doc) => {
        const name = [doc.client?.user?.firstName, doc.client?.user?.lastName].filter(Boolean).join(" ");
        return <span className="text-gray-300">{name || "—"}</span>;
      },
    },
    {
      key: "uploadedBy",
      header: "Uploaded By",
      render: (doc) => {
        const name = [doc.uploadedBy?.firstName, doc.uploadedBy?.lastName].filter(Boolean).join(" ");
        return <span className="text-gray-300">{name || "—"}</span>;
      },
    },
    {
      key: "createdAt",
      header: "Date",
      render: (doc) => new Date(doc.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (doc) => (
        <div className="flex items-center gap-2">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Documents</h1>
          <p className="text-sm text-gray-400">Contracts, proposals, and files shared with clients.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-black text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Error: {error}</div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading documents...</div>
      ) : (
        <DataTable columns={columns} data={documents} onDelete={handleDelete} emptyMessage="No documents uploaded yet." />
      )}

      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        clients={clients}
        onUpload={handleUpload}
      />
    </div>
  );
}

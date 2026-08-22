import { useState, useRef } from "react";
import { X, UploadCloud, File, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    // Simulate progress for UI purposes until real R2 upload is hooked up
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);

    try {
      await onUpload(files);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setFiles([]);
        setProgress(0);
        onClose();
      }, 1000);
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
      setUploading(false);
      setProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface/90 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-heading">Upload Documents</h2>
          <button onClick={onClose} disabled={uploading} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {!uploading ? (
            <>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                  dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/20 hover:border-white/40 bg-white/[0.02]"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleChange}
                />
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Drag & Drop files here</h3>
                <p className="text-sm text-gray-400 mb-6">Support for images, videos, PDFs, and archives.</p>
                <button className="px-6 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                  Browse Files
                </button>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Selected Files</h4>
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <File className="w-5 h-5 text-gray-400 shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-md transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              {progress < 100 ? (
                <div className="relative w-20 h-20 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="var(--primary)" strokeWidth="8" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * progress) / 100} className="transition-all duration-300" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
                    {progress}%
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{progress < 100 ? 'Uploading Files...' : 'Upload Complete!'}</h3>
              <p className="text-gray-400 text-sm">Please do not close this window.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
          <button 
            onClick={onClose} 
            disabled={uploading}
            className="px-6 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleUploadSubmit}
            disabled={files.length === 0 || uploading}
            className="px-6 py-2 rounded-lg bg-[var(--primary)] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
}

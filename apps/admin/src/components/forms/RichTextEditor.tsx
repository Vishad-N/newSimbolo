"use client";

import { Bold, Italic, List, ListOrdered, Link2, Image as ImageIcon, Type } from "lucide-react";
import { cn } from "@/utils/utils";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({ label, value, onChange, className, placeholder }: RichTextEditorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02] flex-wrap">
          <ToolbarButton icon={<Type className="w-4 h-4" />} title="Heading" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<Bold className="w-4 h-4" />} title="Bold" />
          <ToolbarButton icon={<Italic className="w-4 h-4" />} title="Italic" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<List className="w-4 h-4" />} title="Bullet List" />
          <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} title="Numbered List" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<Link2 className="w-4 h-4" />} title="Link" />
          <ToolbarButton icon={<ImageIcon className="w-4 h-4" />} title="Image" />
        </div>
        
        {/* Editor Area (Mocked with textarea for now) */}
        <textarea
          className="w-full min-h-[150px] bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none resize-y"
          placeholder={placeholder || "Start typing..."}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

function ToolbarButton({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
    >
      {icon}
    </button>
  );
}

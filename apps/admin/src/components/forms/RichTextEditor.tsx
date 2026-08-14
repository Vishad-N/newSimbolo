"use client";

import { Bold, Italic, List, ListOrdered, Link2, Image as ImageIcon, Type } from "lucide-react";
import { cn } from "@/utils/utils";
import { useRef } from "react";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({ label, value, onChange, className, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix = "", fallback = "text") => {
    const textarea = textareaRef.current;
    if (!textarea || !onChange) return;
    const currentValue = value || "";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.slice(start, end) || fallback;
    const replacement = `${prefix}${selectedText}${suffix}`;
    onChange(`${currentValue.slice(0, start)}${replacement}${currentValue.slice(end)}`);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    });
  };

  const prefixLines = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !onChange) return;
    const currentValue = value || "";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.slice(start, end) || "List item";
    const replacement = selectedText.split("\n").map((line) => `${prefix}${line}`).join("\n");
    onChange(`${currentValue.slice(0, start)}${replacement}${currentValue.slice(end)}`);
    requestAnimationFrame(() => textarea.focus());
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02] flex-wrap">
          <ToolbarButton icon={<Type className="w-4 h-4" />} title="Heading" onClick={() => prefixLines("## ")} />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<Bold className="w-4 h-4" />} title="Bold" onClick={() => insertMarkdown("**", "**")} />
          <ToolbarButton icon={<Italic className="w-4 h-4" />} title="Italic" onClick={() => insertMarkdown("_", "_")} />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<List className="w-4 h-4" />} title="Bullet List" onClick={() => prefixLines("- ")} />
          <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} title="Numbered List" onClick={() => prefixLines("1. ")} />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton icon={<Link2 className="w-4 h-4" />} title="Link" onClick={() => insertMarkdown("[", "](https://)", "link text")} />
          <ToolbarButton icon={<ImageIcon className="w-4 h-4" />} title="Image" onClick={() => insertMarkdown("![", "](https://)", "image description")} />
        </div>
        
        {/* Editor Area (Mocked with textarea for now) */}
        <textarea
          ref={textareaRef}
          className="w-full min-h-[150px] bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none resize-y"
          placeholder={placeholder || "Start typing..."}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

function ToolbarButton({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
    >
      {icon}
    </button>
  );
}

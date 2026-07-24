"use client";

import { useState } from "react";
import { ChevronDown, Save, Eye, EyeOff, RotateCcw } from "lucide-react";
import { cn } from "@/utils/utils";

interface SectionEditorProps {
  title: string;
  description?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  onSave?: () => void;
  onReset?: () => void;
}

export function SectionEditor({
  title,
  description,
  defaultExpanded = false,
  children,
  onSave,
  onReset,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(true);
  const [isDirty, setIsDirty] = useState(false); // Mock dirty state

  const handleSave = () => {
    setIsDirty(false);
    onSave?.();
  };

  const handleReset = () => {
    setIsDirty(false);
    onReset?.();
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-6 border border-white/10">
      <div 
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors",
          isExpanded && "border-b border-white/10 bg-white/[0.02]"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
            {title}
            {isDirty && <span className="w-2 h-2 rounded-full bg-primary" title="Unsaved changes"></span>}
          </h2>
          {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
        </div>
        
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            title={isVisible ? "Hide section on website" : "Show section on website"}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-400" />}
          </button>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isExpanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-black/20">
          <div 
            className="space-y-6"
            // To simulate "dirty" state when children form inputs change (in a real app we'd use react-hook-form)
            onChange={() => !isDirty && setIsDirty(true)} 
          >
            {children}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

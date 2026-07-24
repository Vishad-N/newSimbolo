"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
}

interface TimelineEditorProps {
  initialData?: TimelineStep[];
  onChange?: (data: TimelineStep[]) => void;
}

export function TimelineEditor({ initialData = [], onChange }: TimelineEditorProps) {
  const [steps, setSteps] = useState<TimelineStep[]>(initialData);

  const addStep = () => {
    const newSteps = [...steps, { id: Date.now().toString(), title: "New Step", description: "Describe what happens in this step." }];
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  const updateStep = (id: string, field: keyof TimelineStep, value: string) => {
    const newSteps = steps.map(step => step.id === id ? { ...step, [field]: value } : step);
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  const removeStep = (id: string) => {
    const newSteps = steps.filter(step => step.id !== id);
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Timeline / Steps
        </h3>
        <button 
          type="button"
          onClick={addStep}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Step
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4 p-4 bg-black/40 border border-white/10 rounded-xl relative group">
            <div className="flex flex-col items-center mt-1">
              <button type="button" className="text-gray-500 cursor-move hover:text-white transition-colors mb-2">
                <GripVertical className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-400">
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className="w-px h-16 bg-white/10 my-2" />
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <input 
                type="text" 
                value={step.title}
                onChange={(e) => updateStep(step.id, "title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Step Title"
              />
              <textarea 
                value={step.description}
                onChange={(e) => updateStep(step.id, "description", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 min-h-[80px] resize-y focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Detailed description of this step..."
              />
            </div>

            <button 
              type="button" 
              onClick={() => removeStep(step.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-white/10 rounded-xl">
            No steps added yet. Build your process timeline.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ClarityMode } from "@/types";

interface ModeSelectorProps {
  selectedMode: ClarityMode;
  onModeSelect: (mode: ClarityMode) => void;
  onGenerate: () => void;
  canGenerate?: boolean;
  isGenerating?: boolean;
}

export function ModeSelector({ selectedMode, onModeSelect, onGenerate, canGenerate = false, isGenerating = false }: ModeSelectorProps) {
  
  const modes: { id: ClarityMode; icon: string; title: string; desc: string }[] = [
    { id: 'zen', icon: 'spa', title: 'Zen', desc: 'Text only. Zero distractions.' },
    { id: 'flow', icon: 'waves', title: 'Flow', desc: 'Balanced layout. Key visuals.' },
    { id: 'adhd', icon: 'visibility', title: 'ADHD', desc: 'Bionic reading highlights.' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-[840px] z-10 transition-colors duration-300">
        <div className="flex items-center justify-between">
            <label className="text-text-subtle text-xs font-bold uppercase tracking-wider">Select Clarity Mode</label>
            <a href="#" className="text-primary text-xs font-bold hover:text-text-primary transition-colors flex items-center gap-1">
                Compare modes <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modes.map((mode) => (
                <label key={mode.id} className="cursor-pointer relative group">
                    <input 
                        type="radio" 
                        name="mode" 
                        className="peer sr-only" 
                        checked={selectedMode === mode.id}
                        onChange={() => onModeSelect(mode.id)}
                    />
                    <div className="h-full flex flex-col items-center text-center gap-3 rounded-xl border border-border bg-bg/50 p-5 transition-all hover:border-text-subtle hover:bg-border/30 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_0_1px_rgba(25,93,230,1)]">
                        <div className="p-2 rounded-full bg-border/50 text-text-subtle peer-checked:bg-primary peer-checked:text-white transition-colors">
                            <span className="material-symbols-outlined">{mode.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-text-primary text-sm font-bold">{mode.title}</h3>
                            <p className="text-text-subtle text-xs mt-1">{mode.desc}</p>
                        </div>
                    </div>
                </label>
            ))}
        </div>

        <button 
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full flex items-center justify-center gap-3 h-14 bg-border text-text-subtle rounded-xl font-bold text-lg cursor-not-allowed disabled:opacity-50 hover:opacity-100 hover:bg-surface-border hover:text-text-primary transition-all data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:cursor-pointer data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20"
            data-active={canGenerate && !isGenerating}
        >
            {isGenerating ? (
                <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Generating...
                </>
            ) : (
                <>
                     <span className="material-symbols-outlined">auto_awesome</span>
                     Generate Clarity View
                </>
            )}
        </button>
    </div>
  );
}

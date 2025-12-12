"use client";

import React from "react";
import { ClarityMode } from "@/types";

interface TwoPanelLayoutProps {
    originalContent: React.ReactNode;
    clarityContent: React.ReactNode;
    mode: ClarityMode;
    isOriginalVisible: boolean;
    onToggleOriginal: () => void;
}

export function TwoPanelLayout({ 
    originalContent, 
    clarityContent, 
    mode, 
    isOriginalVisible, 
    onToggleOriginal 
}: TwoPanelLayoutProps) {
    
    const getLeftWidth = () => {
        if (!isOriginalVisible) return 'w-0 opacity-0 p-0 border-0 scale-95';
        switch (mode) {
            case 'zen': return 'w-[50%]';
            case 'flow': return 'w-[40%]';
            case 'adhd': return 'w-[30%]';
            default: return 'w-[50%]';
        }
    };

    return (
        <div className="flex-1 overflow-hidden relative w-full h-[calc(100vh-80px)] bg-bg p-4 md:p-6 flex flex-row gap-6 transition-colors duration-300">
            {/* Left Panel */}
            <section className={`flex flex-col shrink-0 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${getLeftWidth()}`}>
               <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg/50 backdrop-blur-sm z-10 shrink-0">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                     <h3 className="text-sm font-bold text-text-primary truncate">Original View</h3>
                  </div>
                  <button onClick={onToggleOriginal} className="flex items-center justify-center size-8 rounded-full hover:bg-border/50 text-text-secondary transition-colors" title="Collapse Panel">
                      <span className="material-symbols-outlined text-[20px]">first_page</span>
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto relative bg-bg/10 backdrop-blur-sm scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {originalContent}
               </div>
            </section>

            {/* Right Panel */}
            <section className="flex flex-col flex-1 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden h-full relative transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                 {!isOriginalVisible && (
                     <div className="absolute top-4 left-4 z-50">
                        <button onClick={onToggleOriginal} className="flex items-center justify-center size-10 rounded-full bg-surface border border-border hover:bg-border/50 shadow-md text-text-primary transition-colors" title="Show Original">
                             <span className="material-symbols-outlined">last_page</span>
                        </button>
                     </div>
                 )}
                 <div className="h-full w-full overflow-hidden">
                    {clarityContent}
                 </div>
            </section>
        </div>
    );
}

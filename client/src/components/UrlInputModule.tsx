"use client";

import React, { useState } from "react";

interface UrlInputModuleProps {
    url: string;
    setUrl: (url: string) => void;
    onFetch: () => void;
    onUpload: (file: File) => void;
    isLoading: boolean;
}

export function UrlInputModule({ url, setUrl, onFetch, onUpload, isLoading }: UrlInputModuleProps) {
  const [isHtmlOpen, setIsHtmlOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          onUpload(e.target.files[0]);
      }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 flex flex-col gap-8 relative transition-colors duration-300">
      <div className="flex flex-col gap-2">
        <label className="text-text-subtle text-xs font-bold uppercase tracking-wider ml-1">Page Source</label>
        <div className="relative w-full group z-30">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary transition-colors">link</span>
          </div>
          <input
            autoFocus
            type="text"
            className="block w-full rounded-xl border border-primary bg-bg/50 pl-12 pr-[140px] h-16 text-text-primary placeholder:text-text-muted ring-1 ring-primary text-lg transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Paste URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onFetch()}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button 
                onClick={onFetch}
                disabled={isLoading}
                className="h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Fetching...' : 'Fetch Page'}
            </button>
          </div>
          
          {/* Suggestions Dropdown (Static for Demo) */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl z-40 overflow-hidden animate-fade-in-up">
             {/* ... content similar to code.html ... */}
            <div className="p-1.5 flex flex-col gap-0.5">
               <div className="px-3 py-2 text-[10px] font-bold text-text-subtle uppercase tracking-widest flex items-center justify-between">
                 <span>Smart Suggestions</span>
                 <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">AI Ready</span>
               </div>
               
               {[
                 { icon: 'history', color: 'blue', title: 'The Future of Interface Design', source: 'Medium', url: 'medium.com/ux-collective/future...' },
                 { icon: 'trending_up', color: 'emerald', title: 'Climate Change Report 2024', source: 'NY Times', url: 'nytimes.com/section/climate...' },
                 { icon: 'auto_awesome', color: 'purple', title: 'Surprise Me', source: 'Random', url: 'Fetch a random curated article' }
               ].map((item, idx) => (
                 <button key={idx} onClick={() => setUrl(item.url.startsWith('http') ? item.url : 'https://example.com')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-border/50 transition-colors text-left group/item relative overflow-hidden">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-border/50 text-text-subtle relative z-10">
                        <span className={`material-symbols-outlined text-[20px] text-${item.color}-400`}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-primary truncate">{item.title}</span>
                            <span className="text-[10px] text-text-subtle bg-surface-border px-1.5 rounded-md">{item.source}</span>
                        </div>
                        <div className="text-xs text-text-subtle truncate">{item.url}</div>
                    </div>
                 </button>
               ))}
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
        />
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-border hover:border-text-subtle hover:bg-border/50 text-text-subtle hover:text-text-primary transition-all text-sm font-medium group"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_a_photo</span>
          Upload Screenshot
        </button>
        <div className="flex-1">
          <div className="group w-full relative">
            <button 
                onClick={() => setIsHtmlOpen(!isHtmlOpen)}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-border hover:border-text-subtle hover:bg-border/50 text-text-subtle hover:text-text-primary transition-all text-sm font-medium select-none"
            >
              <span className={`material-symbols-outlined transition-transform ${isHtmlOpen ? 'rotate-180' : ''}`}>code</span>
              Paste HTML
            </button>
            {isHtmlOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20">
                    <textarea 
                        className="w-full h-40 bg-bg border border-border rounded-xl p-4 text-sm text-text-primary font-mono focus:border-primary focus:ring-1 focus:ring-primary shadow-xl resize-none focus:outline-none" 
                        placeholder="Paste raw HTML code here..."
                    ></textarea>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

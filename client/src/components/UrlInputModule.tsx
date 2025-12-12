"use client";

import React, { useState, useEffect, useRef } from "react";

interface UrlInputModuleProps {
    url: string;
    setUrl: (url: string) => void;
    onFetch: () => void;
    onUpload: (file: File) => void;
    isLoading: boolean;
}

export function UrlInputModule({ url, setUrl, onFetch, onUpload, isLoading }: UrlInputModuleProps) {
  const [isHtmlOpen, setIsHtmlOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlInputContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (htmlInputContainerRef.current && !htmlInputContainerRef.current.contains(event.target as Node)) {
          setIsHtmlOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          onUpload(e.target.files[0]);
      }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 flex flex-col gap-8 relative transition-colors duration-300">
      <div className="flex flex-col gap-2">
        <label className="text-text-subtle text-xs font-bold uppercase tracking-wider ml-1">Page Source</label>
        <div className="relative w-full group z-30" ref={inputContainerRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary transition-colors">link</span>
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-primary bg-bg/50 pl-12 pr-[140px] h-16 text-text-primary placeholder:text-text-muted ring-1 ring-primary text-lg transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Paste URL here..."
            value={url}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
                setUrl(e.target.value);
                setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onFetch();
                    setShowSuggestions(false);
                }
                if (e.key === 'Escape') {
                    setShowSuggestions(false);
                    e.currentTarget.blur();
                }
            }}
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
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl z-40 overflow-hidden animate-fade-in-up">
                <div className="p-1.5 flex flex-col gap-0.5">
                   <div className="px-3 py-2 text-[10px] font-bold text-text-subtle uppercase tracking-widest flex items-center justify-between">
                     <span>Smart Suggestions</span>
                     <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">AI Ready</span>
                   </div>
                   
                   {[
                     { icon: 'query_stats', color: 'blue', title: 'US Gov Analytics', source: 'Dashboard', url: 'https://analytics.usa.gov/' },
                     { icon: 'currency_bitcoin', color: 'yellow', title: 'CoinGecko Markets', source: 'Dashboard', url: 'https://www.coingecko.com/' },
                     { icon: 'shopping_cart', color: 'orange', title: 'Amazon', source: 'E-commerce', url: 'https://www.amazon.com/' },
                     { icon: 'shopping_bag', color: 'red', title: 'eBay', source: 'E-commerce', url: 'https://www.ebay.com/' },
                     { icon: 'menu_book', color: 'purple', title: 'IRS Forms', source: 'Government', url: 'https://www.irs.gov/' },
                     { icon: 'newspaper', color: 'red', title: 'BBC News', source: 'News', url: 'https://www.bbc.com/' },
                     { icon: 'breaking_news', color: 'red', title: 'CNN', source: 'News', url: 'https://www.cnn.com/' },
                   ].map((item, idx) => (
                     <button 
                        key={idx} 
                        onClick={() => {
                            setUrl(item.url);
                            setShowSuggestions(false);
                        }} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-border/50 transition-colors text-left group/item relative overflow-hidden"
                     >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-border/50 text-${item.color}-500 relative z-10`}>
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
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
          )}
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
          <div className="group w-full relative" ref={htmlInputContainerRef}>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setIsHtmlOpen(false);
                                e.currentTarget.blur();
                            }
                        }}
                    ></textarea>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

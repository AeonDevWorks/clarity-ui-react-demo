"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const { themeValue, isSystem, setThemeValue, setIsSystem } = useTheme();

  return (
    <header className="w-full border-b border-border bg-bg/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-start sm:items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 text-text-primary py-2">
          <div className="flex items-center justify-center text-primary bg-primary/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-2xl">filter_center_focus</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight hidden sm:block">ClarityUI</h2>
        </div>

        {/* Theme Controls */}
        <div className="flex-1 max-w-2xl hidden md:flex flex-col gap-2 bg-surface border border-border rounded-xl px-4 py-2 shadow-lg transition-colors duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-text-primary text-xs font-bold uppercase tracking-wider">Theme</span>
              <label className="flex items-center cursor-pointer gap-2 select-none group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isSystem}
                    onChange={(e) => setIsSystem(e.target.checked)}
                  />
                  <div className="block bg-border w-8 h-4 rounded-full peer-checked:bg-primary/50 transition-colors"></div>
                  <div className="dot absolute left-0.5 top-0.5 bg-text-subtle w-3 h-3 rounded-full transition-transform peer-checked:translate-x-full peer-checked:bg-primary"></div>
                </div>
                <span className="text-[10px] text-text-subtle group-hover:text-text-primary transition-colors">System</span>
              </label>
            </div>
            
            {/* Theme Swatches (Visual only in this design) */}
            <div className="flex items-center gap-1.5">
               {[
                 { title: "High Contrast Light", class: "bg-white border border-gray-300" },
                 { title: "Standard Light", class: "bg-gray-100" },
                 { title: "Mild Light", class: "bg-gray-300" },
                 { title: "Mild Dark", class: "bg-gray-700" },
                 { title: "Standard Dark", class: "bg-gray-900 border border-gray-600" },
                 { title: "High Contrast Dark", class: "bg-black border border-gray-700" },
               ].map((t, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full ${t.class}`} title={t.title}></div>
               ))}
            </div>

            <div className="flex items-center gap-1 bg-emerald-900/30 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
              <span className="material-symbols-outlined text-[10px]">check_circle</span>
              WCAG AAA
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="1" 
              value={themeValue}
              disabled={isSystem}
              onChange={(e) => setThemeValue(parseInt(e.target.value) as any)}
              className={`w-full h-2 bg-transparent appearance-none cursor-pointer ${isSystem ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <div className="flex justify-between w-full text-[9px] text-text-subtle uppercase font-semibold tracking-wider">
              <span className={`text-center w-10 ${themeValue === 0 ? 'text-primary' : ''}`}>Hi-C Lt</span>
              <span className={`text-center w-10 ${themeValue === 1 ? 'text-primary' : ''}`}>Std Lt</span>
              <span className={`text-center w-10 ${themeValue === 2 ? 'text-primary' : ''}`}>Mild Lt</span>
              <span className={`text-center w-10 ${themeValue === 3 ? 'text-primary' : ''}`}>Mild Dk</span>
              <span className={`text-center w-10 ${themeValue === 4 ? 'text-primary' : ''}`}>Std Dk</span>
              <span className={`text-center w-10 ${themeValue === 5 ? 'text-primary' : ''}`}>Hi-C Dk</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden pt-2">
          <button className="text-text-primary p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}

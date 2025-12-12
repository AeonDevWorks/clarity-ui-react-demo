"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { UrlInputModule } from "@/components/UrlInputModule";
import { ModeSelector } from "@/components/ModeSelector";
import { Footer } from "@/components/Footer";
import { TwoPanelLayout } from "@/components/TwoPanelLayout";
import { ClarityMode } from "@/types";
import { useUrlOrScreenshotInput } from "@/hooks/useUrlOrScreenshotInput";
import { DynamicRenderer } from "@/components/DynamicRenderer";
import { generateClarityView } from "@/lib/gemini";

export default function Home() {
  const [mode, setMode] = useState<ClarityMode>('flow');
  const [isOriginalVisible, setIsOriginalVisible] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    url, 
    setUrl, 
    isLoading, 
    fetchedData, 
    fetchUrl, 
    uploadScreenshot 
  } = useUrlOrScreenshotInput();

  const handleFetch = () => {
    if (url) fetchUrl(url);
  };

  const handleGenerate = async () => {
    if (!fetchedData) return;
    setIsGenerating(true);
    try {
        const result = await generateClarityView(fetchedData, mode);
        setGeneratedContent(result);
    } catch (e) {
        console.error("Generation failed", e);
        // In a real app, set error state
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen w-full flex flex-col font-display overflow-x-hidden selection:bg-primary/30 selection:text-white transition-colors duration-300">
      <Header />
      
      {fetchedData ? (
        <TwoPanelLayout 
            mode={mode}
            isOriginalVisible={isOriginalVisible}
            onToggleOriginal={() => setIsOriginalVisible(!isOriginalVisible)}
            originalContent={
                fetchedData.screenshotBase64 ? (
                    <img src={fetchedData.screenshotBase64} alt="Original Site" className="w-full h-auto object-contain" />
                ) : (
                    <div className="flex items-center justify-center h-full text-text-subtle">
                        {fetchedData.renderedHtml ? 'HTML Content Loaded' : 'No visual content available'}
                    </div>
                )
            }
            clarityContent={
                <div className="flex flex-col items-center justify-center h-full gap-4 p-10 text-center w-full h-full overflow-y-auto relative">
                    {!generatedContent ? (
                        <>
                            <div className="p-4 rounded-full bg-primary/10 text-primary animate-pulse">
                                <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                            </div>
                            <h2 className="text-xl font-bold text-text-primary">Clarity View ({mode})</h2>
                            <p className="text-text-secondary max-w-md">
                                Ready to generate structured view.
                            </p>
                        </>
                    ) : (
                        <div className="w-full h-full text-left p-4 overflow-auto">
                            <DynamicRenderer content={generatedContent} />
                        </div>
                    )}
                    
                    {!generatedContent && (
                        <div className="mt-4 w-full max-w-md">
                            <ModeSelector 
                                selectedMode={mode} 
                                onModeSelect={setMode} 
                                onGenerate={handleGenerate} 
                                canGenerate={true}
                                isGenerating={isGenerating}
                            />
                        </div>
                    )}
                    
                    {/* Floating controls when content is generated */}
                    {generatedContent && (
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-full shadow-2xl p-2 flex gap-2">
                             <ModeSelector 
                                selectedMode={mode} 
                                onModeSelect={setMode} 
                                onGenerate={handleGenerate} 
                                canGenerate={true}
                                isGenerating={isGenerating}
                            />
                         </div>
                    )}

                </div>
            }
        />
      ) : (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden gap-10">
        
        {/* Background Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Hero Title */}
        <div className="w-full max-w-[840px] flex flex-col gap-10 z-10">
            <div className="text-center flex flex-col gap-5 animate-fade-in-up">
                <h1 className="text-text-primary text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.03em] drop-shadow-2xl transition-colors duration-300">
                    Clarify the Web
                </h1>
                <p className="text-text-subtle text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto transition-colors duration-300">
                    Transform cluttered webpages into calm, structured views.
                </p>
            </div>
            
            <UrlInputModule 
                url={url}
                setUrl={setUrl}
                onFetch={handleFetch}
                onUpload={uploadScreenshot}
                isLoading={isLoading}
            />

            <div className="border-t border-border/50 w-full" />
            
            <ModeSelector 
                selectedMode={mode} 
                onModeSelect={setMode} 
                onGenerate={handleGenerate} 
            />
            
            <Footer />
        </div>
      </main>
      )}
    </div>
  );
}

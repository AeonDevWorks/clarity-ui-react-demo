"use client";

import React from "react";

export function Footer() {
  const domains = [
    "bbc.com", "cnn.com", "amazon.com", "ebay.com", "walmart.com", "irs.gov", 
    "usa.gov", "analytics.usa.gov", "coingecko.com", "bls.gov", "wikipedia.com", "arxiv.com"
  ];

  return (
    <div className="text-center flex flex-col gap-6 w-full max-w-[840px] z-10">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-text-subtle uppercase tracking-widest opacity-60">Supported Domains</span>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-text-muted font-medium max-w-lg">
          {domains.map((d, i) => (
            <React.Fragment key={d}>
              <span>{d}</span>
              {i < domains.length - 1 && <span className="opacity-30">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="text-text-muted text-xs max-w-md mx-auto leading-relaxed">
        ClarityUI processes content locally when possible. Results may vary based on page complexity.{" "}
        <a href="#" className="underline decoration-surface-border hover:decoration-text-subtle hover:text-text-subtle transition-colors">Privacy Policy</a>
      </p>
    </div>
  );
}

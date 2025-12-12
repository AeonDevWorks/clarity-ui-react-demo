import React from "react";

interface ClarityCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function ClarityCard({ title, children, className = "" }: ClarityCardProps) {
    return (
        <div className={`bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col gap-4 ${className}`}>
            {title && (
                <div className="border-b border-border pb-3 mb-1">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                        {/* Optional icon logic could go here */}
                        <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
                        {title}
                    </h3>
                </div>
            )}
            <div className="text-text-secondary text-sm leading-relaxed">
                {children}
            </div>
        </div>
    );
}

import React from "react";

interface ClarityTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    children: React.ReactNode;
    className?: string;
}

export function ClarityText({ variant = 'body', children, className = "" }: ClarityTextProps) {
    const styles = {
        h1: "text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4",
        h2: "text-xl md:text-2xl font-bold text-text-primary mb-3",
        h3: "text-lg md:text-xl font-semibold text-text-primary mb-2",
        body: "text-sm md:text-base text-text-secondary leading-relaxed mb-2",
        caption: "text-xs text-text-muted italic",
        label: "text-xs font-bold text-text-subtle uppercase tracking-wider"
    };

    const Component = variant === 'h1' ? 'h1' : 
                      variant === 'h2' ? 'h2' : 
                      variant === 'h3' ? 'h3' : 
                      variant === 'label' ? 'span' : 'p';

    return (
        <Component className={`${styles[variant]} ${className}`}>
            {children}
        </Component>
    );
}

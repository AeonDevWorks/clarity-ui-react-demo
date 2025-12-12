import React from "react";

interface ClarityContainerProps {
    layout?: 'col' | 'row' | 'grid';
    gap?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}

export function ClarityContainer({ layout = 'col', gap = 'md', children, className = "" }: ClarityContainerProps) {
    const layoutStyles = {
        col: 'flex flex-col',
        row: 'flex flex-row flex-wrap',
        grid: 'grid grid-cols-1 md:grid-cols-2'
    };

    const gapStyles = {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-8'
    };

    return (
        <div className={`${layoutStyles[layout]} ${gapStyles[gap]} w-full ${className}`}>
            {children}
        </div>
    );
}

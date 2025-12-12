import React from "react";

interface ClarityListProps {
    items?: any[];
    renderItem?: (item: any, index: number) => React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export function ClarityList({ items, renderItem, children, className = "" }: ClarityListProps) {
    return (
        <ul className={`flex flex-col gap-2 w-full ${className}`}>
             {items && renderItem ? (
                 items.map((item, i) => (
                     <li key={i} className="w-full">
                         {renderItem(item, i)}
                     </li>
                 ))
             ) : (
                 children
             )}
        </ul>
    );
}

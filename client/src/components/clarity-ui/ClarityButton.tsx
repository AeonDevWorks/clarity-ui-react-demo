import React from "react";

interface ClarityButtonProps {
    actionToken?: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
    onClick?: () => void;
}

export function ClarityButton({ actionToken, label, variant = 'primary', icon, onClick }: ClarityButtonProps) {
    const baseStyles = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20",
        secondary: "bg-surface-border/50 text-text-primary hover:bg-surface-border",
        outline: "border border-border text-text-secondary hover:border-text-subtle hover:text-text-primary bg-transparent"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]}`}
            onClick={() => {
                if (onClick) onClick();
                if (actionToken) console.log("Action Token Triggered:", actionToken);
            }}
        >
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            {label}
        </button>
    );
}

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    light?: boolean;
    hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    light = false,
    hoverable = false,
    ...props
}) => {
    const baseClass = light ? 'glass-card-light text-slate-800' : 'glass-card text-slate-100';
    const hoverClass = hoverable 
        ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(147,51,234,0.15)]' 
        : '';

    return (
        <div
            className={`rounded-2xl p-6 ${baseClass} ${hoverClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;

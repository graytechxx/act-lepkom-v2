import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    light?: boolean;
    loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    variant = 'primary',
    light = false,
    loading = false,
    className = '',
    disabled,
    ...props
}) => {
    let buttonStyle = '';

    if (variant === 'primary') {
        buttonStyle = 'glass-btn-primary disabled:opacity-50 disabled:cursor-not-allowed';
    } else if (variant === 'secondary') {
        buttonStyle = light 
            ? 'glass-btn-secondary-light disabled:opacity-50 disabled:cursor-not-allowed' 
            : 'glass-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed';
    } else if (variant === 'danger') {
        buttonStyle = 'bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/35 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_0_rgba(239,68,68,0.15)]';
    }

    return (
        <button
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${buttonStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default GlassButton;

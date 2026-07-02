import React, { forwardRef } from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    light?: boolean;
    type?: string;
    options?: { value: string | number; label: string }[]; // For select dropdowns
    isTextArea?: boolean;
}

export const GlassInput = forwardRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement, GlassInputProps>(({
    label,
    error,
    light = false,
    type = 'text',
    options,
    isTextArea = false,
    className = '',
    ...props
}, ref) => {
    const inputClass = light ? 'glass-input-light' : 'glass-input';
    const borderClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';
    const combinedClasses = `w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all duration-200 ${inputClass} ${borderClass} ${className}`;

    return (
        <div className="w-full mb-4">
            {label && (
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${light ? 'text-slate-600' : 'text-slate-400'}`}>
                    {label}
                </label>
            )}
            
            {options ? (
                <select
                    ref={ref}
                    className={combinedClasses}
                    {...props as React.SelectHTMLAttributes<HTMLSelectElement>}
                >
                    {props.placeholder && <option value="" className={light ? 'text-slate-500' : 'text-slate-400 bg-slate-900'}>{props.placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className={light ? 'text-slate-800' : 'text-slate-200 bg-slate-900'}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : isTextArea ? (
                <textarea
                    ref={ref}
                    className={`${combinedClasses} resize-y`}
                    rows={4}
                    {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
                />
            ) : (
                <input
                    ref={ref}
                    type={type}
                    className={combinedClasses}
                    {...props as React.InputHTMLAttributes<HTMLInputElement>}
                />
            )}

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;

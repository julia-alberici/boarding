import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="w-full">
            {label && (
                <label className="text-sm text-[#dddddd]">
                    {label}
                </label>
            )}
            <input
                className={`
                    mt-1
                    text-[#f5f5f5] placeholder:text-[#999]
                    w-full px-3 py-2 border rounded-lg shadow-sm
                    bg-[#1a1a1a] border-[#333]
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
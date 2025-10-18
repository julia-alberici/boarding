import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center';

    const variants = {
        primary: 'bg-[#E50914] text-[#F5F5F5] hover:bg-[#B30000] disabled:bg-[#8B0000]/50',
        secondary: 'bg-[#B30000] text-[#F5F5F5] hover:bg-[#8B0000] disabled:bg-[#8B0000]/50',
        outline: 'border-2 border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-[#F5F5F5] disabled:bg-[#121212] disabled:text-[#A0A0A0] disabled:border-[#A0A0A0]',
        ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${isLoading ? 'cursor-wait' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : null}
            {children}
        </button>
    );
};
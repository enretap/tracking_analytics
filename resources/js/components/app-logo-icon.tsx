import { SVGAttributes } from 'react';

export default function AppLogoIcon({size = 32, className = ''} ) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#logoGradient)"/>
                <path d="M14 20L20 16L28 26L34 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="14" cy="20" r="2" fill="white"/>
                <circle cx="34" cy="20" r="2" fill="white"/>
                <circle cx="28" cy="26" r="2" fill="white"/>
        </svg>
    );
}

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
                <rect width="48" height="48" rx="12" fill="#3B82F6"/>
                <path d="M14 20L20 16L28 26L34 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="14" cy="20" r="2" fill="white"/>
                <circle cx="34" cy="20" r="2" fill="white"/>
                <circle cx="28" cy="26" r="2" fill="white"/>
        </svg>
    );
}

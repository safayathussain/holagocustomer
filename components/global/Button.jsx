'use client'
import React from 'react';

const Button = ({ children, variant = 'primary', className, size = 'md', onClick= () => {} }) => {
    let variantClassName = '';
    let sizeClassName = ''
    switch (variant) {
        case 'primary':
            variantClassName = 'bg-black text-white ';
            break;
    }
    switch (size) {
        case 'sm':
            sizeClassName = 'text-xs px-2 py-1 rounded-md';
            break;
        case 'md':
            sizeClassName = 'text-sm md:text-base px-5 py-2 rounded-xl';
            break;
    }

    return (
        <button className={`px-4 py-2 ${variantClassName} ${sizeClassName} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;

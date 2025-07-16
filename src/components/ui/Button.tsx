'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  disabled = false
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400';
  
  const variantClasses = {
    primary: 'bg-[#F8E71C] text-black hover:bg-[#FFD700] disabled:bg-gray-600 disabled:text-gray-400',
    secondary: 'bg-[#1A1A1A] text-[#F8E71C] border border-[#F8E71C] hover:bg-[#F8E71C] hover:text-black disabled:border-gray-600 disabled:text-gray-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}
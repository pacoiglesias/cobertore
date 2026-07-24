'use client';
import React from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'brand';
  showText?: boolean;
}

export const ManoFilLogo: React.FC<LogoProps> = ({ 
  className = "w-12 h-12", 
  variant = 'light',
  showText = true 
}) => {
  const { settings } = useSystemSettings();
  const logoSrc = settings?.logoUrl || "/logo-oficial.png";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Mano Fil S.A. Logo Oficial" 
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
};

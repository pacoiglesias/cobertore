'use client';
import React, { useState, useEffect } from 'react';

interface ObfuscatedEmailProps {
  user?: string;
  domain?: string;
  className?: string;
}

export const ObfuscatedEmail: React.FC<ObfuscatedEmailProps> = ({
  user = 'ventas',
  domain = 'cobertores.com',
  className = 'font-semibold text-white'
}) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Reconstruct the email on the client to block scrapers
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    // Placeholder shown in static HTML (prevents email scrapers)
    return <span className={className}>{user.substring(0, 1)}•••••@••••••••••.com</span>;
  }

  return (
    <a href={`mailto:${email}`} className={`${className} hover:text-amber-500 transition-colors`}>
      {email}
    </a>
  );
};

'use client';

import { useEffect } from 'react';

export default function RedirectClient() {
  useEffect(() => {
    window.location.replace('/es');
  }, []);

  return null;
}

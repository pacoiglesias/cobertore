'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SystemSettings {
  logoUrl?: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SystemSettings);
      } else {
        setSettings({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching system settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { settings, loading };
}

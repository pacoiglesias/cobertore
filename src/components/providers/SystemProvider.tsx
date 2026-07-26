'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SystemSettingsData {
  whatsappNumber: string;
  contactEmail: string;
  address: string;
  officeHours: string;
  rssItemsLimit: number;
  newsSources: Array<{ id: string; name: string; url: string; isActive: boolean }>;
}

const defaultSettings: SystemSettingsData = {
  whatsappNumber: '525512345678',
  contactEmail: 'ventas@cobertores.com',
  address: 'Calle Industria Textil 123, Tlaxcala, México',
  officeHours: 'Lunes a Viernes de 9:00 a 18:00 hrs',
  rssItemsLimit: 20,
  newsSources: []
};

const SystemContext = createContext<{ settings: SystemSettingsData; loading: boolean }>({
  settings: defaultSettings,
  loading: true,
});

export const useSystemSettings = () => useContext(SystemContext);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as SystemSettingsData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading system settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <SystemContext.Provider value={{ settings, loading }}>
      {children}
    </SystemContext.Provider>
  );
}

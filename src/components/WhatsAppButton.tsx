'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useSystemSettings } from './providers/SystemProvider';

interface WhatsAppButtonProps {
  /** Phone number with country code, e.g., "522464642891" */
  phoneNumber?: string;
  /** Pre-filled message */
  message?: string;
}

/**
 * Botón flotante de WhatsApp en esquina inferior derecha.
 * Se oculta durante el primer segundo para no interferir con la carga.
 *
 * El número real ahora se lee de system_settings/global (editable desde
 * el dashboard, Configuración → Contacto y WhatsApp) -- antes estaba
 * quemado aquí y solo se podía cambiar editando código.
 */
export function WhatsAppButton({
  phoneNumber,
  message = 'Hola, me interesa cotizar cobertores por mayoreo.',
}: WhatsAppButtonProps) {
  const { settings } = useSystemSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const numeroReal = phoneNumber || settings.whatsappNumber || '522464642891';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 4000);
      const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible]);

  const whatsappUrl = `https://wa.me/${numeroReal}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="bg-white text-slate-800 px-4 py-3 rounded-2xl rounded-br-md shadow-xl text-sm font-medium max-w-[200px] relative"
              >
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-2 -right-2 bg-slate-200 rounded-full p-0.5 hover:bg-slate-300 transition-colors"
                  aria-label="Cerrar tooltip"
                >
                  <X className="w-3 h-3" />
                </button>
                ¡Cotiza por WhatsApp! 📦
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cotizar por WhatsApp"
            className="group relative"
            onClick={(e) => {
              try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                  const audioCtx = new AudioContext();
                  const oscillator = audioCtx.createOscillator();
                  const gainNode = audioCtx.createGain();
                  oscillator.connect(gainNode);
                  gainNode.connect(audioCtx.destination);
                  oscillator.type = 'sine';
                  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                  gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                  oscillator.start();
                  oscillator.stop(audioCtx.currentTime + 0.2);
                }
              } catch (err) {}
            }}
          >
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            <div className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-all duration-300 group-hover:shadow-[0_4px_30px_rgba(34,197,94,0.6)] group-hover:scale-110">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

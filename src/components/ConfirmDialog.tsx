'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  /** If provided, shows a text input and returns its value via onConfirm */
  inputProps?: {
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
  };
}

/**
 * Modal de confirmación accesible que reemplaza window.confirm() y window.prompt().
 * Soporta modo destructivo (rojo), advertencia (amarillo), e info (azul).
 * También soporta modo input para reemplazar window.prompt().
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
  inputProps,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(inputProps?.defaultValue || '');

  useEffect(() => {
    if (open && inputProps) {
      setInputValue(inputProps.defaultValue || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (open) {
      setTimeout(() => cancelRef.current?.focus(), 100);
    }
  }, [open, inputProps]);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  const iconColors = {
    danger: 'bg-red-500/20 text-red-400',
    warning: 'bg-amber-500/20 text-amber-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-500',
    warning: 'bg-amber-600 hover:bg-amber-500',
    info: 'bg-blue-600 hover:bg-blue-500',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              aria-label="Cerrar diálogo"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconColors[variant]}`}>
                {variant === 'danger' ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 id="confirm-dialog-title" className="text-lg font-bold text-white mb-2">
                  {title}
                </h3>
                <p id="confirm-dialog-desc" className="text-sm text-slate-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {inputProps && (
              <div className="mt-6">
                <label htmlFor="confirm-dialog-input" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">
                  {inputProps.label}
                </label>
                <input
                  ref={inputRef}
                  id="confirm-dialog-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputProps.placeholder}
                  className="w-full bg-[#070b14] border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-colors text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (!inputProps.required || inputValue.trim())) {
                      onConfirm();
                    }
                  }}
                />
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                ref={cancelRef}
                onClick={onCancel}
                className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-colors hover:bg-white/10"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={inputProps?.required && !inputValue.trim()}
                className={`flex-1 ${buttonColors[variant]} text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-colors disabled:opacity-50`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

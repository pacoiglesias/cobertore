import React from 'react';
import { FileText, File, FileSignature, Image as ImageIcon } from 'lucide-react';

export const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
  if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
  if (type.includes('word') || type.includes('document')) return <FileSignature className="w-5 h-5 text-blue-600" />;
  return <File className="w-5 h-5 text-slate-400" />;
};

export const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

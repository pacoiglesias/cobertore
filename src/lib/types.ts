import { Timestamp } from 'firebase/firestore';

export interface CatalogProduct {
  id: string;
  title: string;
  weight: string;
  desc: string;
  measures: string;
  composition: string;
  imgUrl: string;
  createdAt?: Timestamp;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body?: string;
  sourceName?: string;
  originalUrl?: string;
  imgUrl?: string;
  createdAt?: Timestamp | string;
}

export interface RssSource {
  id: string;
  name: string;
  url: string;
  active: boolean;
}

export interface SystemSettings {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  logoUrl?: string;
  bankName?: string;
  bankAccount?: string;
  bankClabe?: string;
  bankRfc?: string;
  newsSources?: RssSource[];
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  rssItemsLimit?: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  quantity: string;
  message: string;
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  folio: string;
  clientName: string;
  status: 'Cotizado' | 'En Producción' | 'Listo para Carga' | 'Entregado' | 'Cancelado' | 'Abandonado';
  updatedAt: Timestamp;
}

export interface OfficialDocument {
  id: string;
  folio: string;
  title: string;
  recipient: string;
  body: string;
  date: string;
  createdAt: Timestamp;
}

export interface IntranetFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: Timestamp;
  storagePath: string;
}

export interface UserPrivilege {
  id?: string;
  email: string;
  role: 'editor' | 'lector';
  expiresAt: Timestamp | null;
}

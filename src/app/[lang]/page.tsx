import React from 'react';
import LandingClient from './LandingClient';
import { Lang } from '../../lib/i18n/dictionaries';

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  const validLang = (params.lang === 'en' || params.lang === 'es') ? (params.lang as Lang) : 'es';
  return <LandingClient lang={validLang} />;
}

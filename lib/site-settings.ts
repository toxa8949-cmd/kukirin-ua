import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type SiteSettings = {
  // Contacts
  phone: string;
  phone_alt: string;
  email: string;
  address: string;
  work_hours: string;
  // Social
  telegram_url: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  viber_url: string;
  // Misc
  site_title: string;
  footer_about: string;
  copyright: string;
};

const DEFAULTS: SiteSettings = {
  phone: '',
  phone_alt: '',
  email: '',
  address: '',
  work_hours: '',
  telegram_url: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  viber_url: '',
  site_title: 'KUKIRIN.UA',
  footer_about: '',
  copyright: '© KUKIRIN.UA',
};

/**
 * Load all site settings as a flat object. Cached per request so multiple
 * components (Header, Footer, contacts page) share the same fetch.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      console.error('getSiteSettings:', error);
      return DEFAULTS;
    }

    const out: Record<string, string> = { ...DEFAULTS };
    for (const row of (data ?? []) as Array<{ key: string; value: string }>) {
      if (row.value && typeof row.value === 'string') {
        out[row.key] = row.value;
      }
    }
    return out as SiteSettings;
  } catch (e) {
    console.error('getSiteSettings exception:', e);
    return DEFAULTS;
  }
});

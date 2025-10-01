import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useTranslation = (namespace = 'common') => {
  const { i18n, t, ready } = useI18nTranslation(namespace);
  const router = useRouter();

  useEffect(() => {
    if (router.locale && i18n.language !== router.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale, i18n]);

  const changeLanguage = (locale) => {
    i18n.changeLanguage(locale);
    // Update URL without reload
    router.push(router.pathname, router.asPath, { locale, scroll: false });
  };

  return {
    t,
    i18n,
    ready,
    currentLanguage: i18n.language,
    changeLanguage,
  };
};

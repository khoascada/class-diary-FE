import { useTranslation } from '@/hooks/useTranslation';
import { Select } from 'antd';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useTranslation();

  return (
    <Select
      value={currentLanguage}
      onChange={changeLanguage}
      style={{ minWidth: 120 }}
      placeholder={t('selectLanguage')}
    >
      {languages.map((lang) => (
        <Select.Option key={lang.code} value={lang.code}>
          <span className="flex items-center gap-2">
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </span>
        </Select.Option>
      ))}
    </Select>
  );
};

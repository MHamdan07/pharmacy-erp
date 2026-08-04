import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const langMap = {
    en: { name: 'English', flag: '🇺🇸', label: 'English (US)' },
    ur: { name: 'اردو', flag: '🇵🇰', label: 'اردو (Urdu)' },
    es: { name: 'Español', flag: '🇪🇸', label: 'Español (ES)' }
  };

  const current = langMap[language] || langMap.en;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition cursor-pointer shadow-sm"
        title="Switch Language / زبان تبدیل کریں"
      >
        <Globe className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-sm">{current.flag}</span>
        <span>{current.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
            Select Language / زبان
          </div>
          {Object.entries(langMap).map(([code, item]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                language === code
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </span>
              {language === code && <Check className="w-3.5 h-3.5 text-purple-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="min-w-[60px]"
      >
        EN
      </Button>
      <Button
        variant={language === 'rw' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('rw')}
        className="min-w-[60px]"
      >
        RW
      </Button>
    </div>
  );
} 
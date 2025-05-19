import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white py-12 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-lg">Ivugire</span>
            </div>
            <p className="text-gray-600">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.links.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-green-600">
                  {t('footer.links.home')}
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-600 hover:text-green-600">
                  {t('footer.links.submit')}
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-600 hover:text-green-600">
                  {t('footer.links.track')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
            <address className="not-italic text-gray-600">
              <p>{t('footer.contact.location')}</p>
              <p>Email: {t('footer.contact.email')}</p>
              <p>Tel: {t('footer.contact.phone')}</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

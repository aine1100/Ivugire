import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'home': 'Home',
    'submit': 'Submit Complaint',
    'track': 'Track Complaint',
    'login': 'Staff Login',
    // Index.tsx
    'hero.title': 'Citizen Engagement System',
    'hero.subtitle': 'Submit your feedback and complaints about public services in Rwanda easily and securely.',
    'hero.submit': 'Submit Complaint',
    'hero.track': 'Track Complaint',
    'howItWorks.title': 'How It Works',
    'howItWorks.submit': 'Submit',
    'howItWorks.submitDesc': 'Fill out the complaint form with your feedback about the service.',
    'howItWorks.track': 'Track',
    'howItWorks.trackDesc': 'Use your complaint number to track its progress.',
    'howItWorks.response': 'Response',
    'howItWorks.responseDesc': 'Get updates on your complaint status through this system.',
    'categories.title': 'Complaint Categories',
    'categories.education': 'Education Issues',
    'categories.healthcare': 'Healthcare Issues',
    'categories.business': 'Business Issues',
    'categories.infrastructure': 'Infrastructure Issues',
    'readMore': 'Read More',
    'stats.title': 'Trusted by Rwandan Citizens',
    'stats.subtitle': 'Many citizens use this system to submit their feedback and complaints',
    'stats.users': 'System Users',
    'stats.rating': 'User Rating',
    'stats.resolved': 'Issues Resolved',
    'feedback.title': 'Share Your Feedback',
    'feedback.subtitle': 'Your feedback is important for improving our services. Let us know what you think.',
    'feedback.feedback': 'Feedback *',
    'feedback.feedbackPlaceholder': 'Write your feedback here...',
    'feedback.province': 'Province *',
    'feedback.district': 'District *',
    'feedback.sector': 'Sector',
    'feedback.cell': 'Cell *',
    'feedback.village': 'Village *',
    'feedback.email': 'Email',
    'feedback.phone': 'Phone',
    'feedback.submit': 'Submit Feedback',
    'cta.title': 'Ready to share your feedback?',
    'cta.subtitle': 'Our feedback system helps you communicate with the right government officials.',
    'cta.button': 'Submit Complaint Now',
    // Feedback validation errors
    'errors.feedbackRequired': 'Please write your feedback.',
    'errors.provinceRequired': 'Please select a province.',
    'errors.districtRequired': 'Please enter a district.',
    'errors.cellRequired': 'Please enter a cell.',
    'errors.villageRequired': 'Please enter a village.',
    'errors.requiredFields': 'Please fill in all required fields.',

    // SubmitComplaint.tsx
    'submit.title': 'Submit a Complaint',
    'submit.subtitle': 'Fill in the form below to submit your complaint or feedback about a public service in Rwanda.',
    'submit.fullName': 'Full Name',
    'submit.nationalId': 'National ID',
    'submit.email': 'Email',
    'submit.phone': 'Phone Number',
    'submit.province': 'Province',
    'submit.district': 'District',
    'submit.sector': 'Sector',
    'submit.cell': 'Cell',
    'submit.village': 'Village',
    'submit.serviceType': 'Type of Service',
    'submit.description': 'Description',
    'submit.descriptionPlaceholder': 'Please describe your complaint in detail',
    'submit.cancel': 'Cancel',
    'submit.submit': 'Submit Complaint',
    'submit.submitting': 'Submitting...',

    // TrackComplaint.tsx
    'track.title': 'Track Your Complaint',
    'track.subtitle': 'Enter your complaint number to view its status.',
    'track.complaintNumber': 'Complaint Number',
    'track.search': 'Search Complaint',
    'track.searching': 'Searching...',
    'track.complaintDetails': 'Complaint Details',
    'track.submittedOn': 'Submitted on',
    'track.complaintType': 'Complaint Type',
    'track.location': 'Location',
    'track.sector': 'Sector',
    'track.village': 'Village',
    'track.description': 'Description',
    'track.response': 'Response',
    'track.respondedBy': 'Responded by',
    'track.responseDate': 'Response Date',
    'track.saveNumber': 'Save complaint number',
  },
  rw: {
    // Navigation
    'home': 'Ahabanza',
    'submit': 'Tanga Ikibazo',
    'track': 'Kureba Ikibazo',
    'login': 'Kwinjira',
    // Index.tsx
    'hero.title': 'Sisitemu yo Gutanga Ibitekerezo',
    'hero.subtitle': 'Ikoreshwa mu gutanga ibitekerezo n\'ibibazo ku mirimo ya Leta mu Rwanda byoroshye kandi mu mucyo.',
    'hero.submit': 'Tanga Ikibazo',
    'hero.track': 'Kureba Aho Ikibazo Kigeze',
    'howItWorks.title': 'Uko Bikorwa',
    'howItWorks.submit': 'Tanga',
    'howItWorks.submitDesc': 'Uzuza ifishi y\'ikibazo n\'ibitekerezo byawe ku bijyanye na serivisi.',
    'howItWorks.track': 'Kurikirana',
    'howItWorks.trackDesc': 'Koresha nimero y\'ikibazo cyawe kugira ngo ukurikirane aho kigeze.',
    'howItWorks.response': 'Igisubizo',
    'howItWorks.responseDesc': 'Kubona amakuru ku gikemuro cy\'ikibazo cyawe ukoresheje iyi sisitemu.',
    'categories.title': 'Amoko y\'Ibibazo',
    'categories.education': 'Ibibazo Mu Burezi',
    'categories.healthcare': 'Ibibazo Mu Buvuzi',
    'categories.business': 'Ibibazo Mu Bucuruzi',
    'categories.infrastructure': 'Ibibazo Mu Bikorwa Remezo',
    'readMore': 'Soma Ibindi',
    'stats.title': 'Byakunzwe n\'Abaturage bo mu Rwanda',
    'stats.subtitle': 'Abaturage benshi bakoresha iyi sisitemu yo gutanga ibitekerezo n\'ibibazo byabo',
    'stats.users': 'Abakoresha sisitemu',
    'stats.rating': 'Amanota batanga',
    'stats.resolved': 'Ibibazo byakemurwa',
    'feedback.title': 'Tubwire Ibitekerezo',
    'feedback.subtitle': 'Ibitekerezo byawe ni ingenzi mu guteza imbere serivisi zacu. Tubwire icyo utekereza.',
    'feedback.feedback': 'Igitekerezo *',
    'feedback.feedbackPlaceholder': 'Andika hano igitekerezo cyawe...',
    'feedback.province': 'Intara *',
    'feedback.district': 'Akarere *',
    'feedback.sector': 'Umurenge',
    'feedback.cell': 'Akagari *',
    'feedback.village': 'Umudugudu *',
    'feedback.email': 'Imeli',
    'feedback.phone': 'Telefoni',
    'feedback.submit': 'Ohereza Ibitekerezo',
    'cta.title': 'Witegure gutanga igitekerezo cyawe?',
    'cta.subtitle': 'Sisitemu yacu yo gutanga ibitekerezo igufasha kuvugana n\'abakozi ba Leta bakwiye.',
    'cta.button': 'Tanga Ikibazo Nonaha',
    // Feedback validation errors
    'errors.feedbackRequired': 'Andika igitekerezo cyawe.',
    'errors.provinceRequired': 'Hitamo intara.',
    'errors.districtRequired': 'Andika akarere.',
    'errors.cellRequired': 'Andika akagari.',
    'errors.villageRequired': 'Andika umudugudu.',
    'errors.requiredFields': 'Nyamuneka wujuze ibisabwa.',

    // SubmitComplaint.tsx
    'submit.title': 'Tanga Ikibazo',
    'submit.subtitle': 'Uzuza ifishi iri munsi yo gutanga ikibazo cyawe cyangwa igitekerezo ku bijyanye na serivisi ya Leta mu Rwanda.',
    'submit.fullName': 'Amazina Yombi',
    'submit.nationalId': 'Indangamuntu',
    'submit.email': 'Imeli',
    'submit.phone': 'Telefoni',
    'submit.province': 'Intara',
    'submit.district': 'Akarere',
    'submit.sector': 'Umurenge',
    'submit.cell': 'Akagari',
    'submit.village': 'Umudugudu',
    'submit.serviceType': 'Ubwoko bw\'ikibazo',
    'submit.description': 'Inshamake',
    'submit.descriptionPlaceholder': 'Nyamuneka vuga inshamake y\'ikibazo cyawe',
    'submit.cancel': 'Reka',
    'submit.submit': 'Ohereza Ikibazo',
    'submit.submitting': 'Arikoherezwa...',

    // TrackComplaint.tsx
    'track.title': 'Kureba Aho Ikibazo Kigeze',
    'track.subtitle': 'Andika nimero y\'ikibazo cyawe uzahabwa amakuru kuri cyo.',
    'track.complaintNumber': 'Nimero y\'Ikibazo',
    'track.search': 'Reba Ikibazo',
    'track.searching': 'Turitegereje...',
    'track.complaintDetails': 'Amakuru y\'ikibazo',
    'track.submittedOn': 'Cyashyizweho',
    'track.complaintType': 'Ubwoko bw\'ikibazo',
    'track.location': 'Aho kiri',
    'track.sector': 'Umurenge',
    'track.village': 'Umudugudu',
    'track.description': 'Inshamake',
    'track.response': 'Igisubizo',
    'track.respondedBy': 'Byatanzwe na',
    'track.responseDate': 'Itariki y\'igisubizo',
    'track.saveNumber': 'Shyira nimero mu bubiko',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
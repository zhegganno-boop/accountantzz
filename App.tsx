import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Instagram,
  Phone,
  MapPin,
  Mail,
  FileText,
  Check,
  CheckCircle2,
  Calculator,
  HelpCircle,
  Send,
  Lock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Menu,
  X,
  Bell,
  Database,
  Users,
  CheckSquare,
  Camera,
  Upload
} from 'lucide-react';

import { SERVICES, FAQS, INSTAGRAM_POSTS } from './data';
import { ConsultationRequest } from './types';
import FeeCalculator from './FeeCalculator';
import AdminRequestsDrawer from './AdminRequestsDrawer';

export default function App() {
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Lead submission / persistence states
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successLeadDetails, setSuccessLeadDetails] = useState<any>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBusinessType, setFormBusinessType] = useState('ФОП 3 група (5%)');
  const [formMessage, setFormMessage] = useState('');
  const [formCalculatedPrice, setFormCalculatedPrice] = useState<number | undefined>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Calculator custom selection toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // FAQ interactive state
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [faqCategory, setFaqCategory] = useState<'all' | 'fop' | 'tov' | 'taxes'>('all');

  // Profile Photo state (persisted so Oksana can upload her real image)
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('oksana_profile_image') || 'https://images.unsplash.com/photo-1580894732444-8fecef2271ac?auto=format&fit=crop&w=800&q=80';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem('oksana_profile_image', base64String);
          setProfileImage(base64String);
          setToastMessage('Фотографію успішно оновлено!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
          // If storage quota exceeded for base64, set state but inform user
          setProfileImage(base64String);
          setToastMessage('Фото завантажено тимчасово (перевищено ліміт локального сховища для офлайн збереження).');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // References for smooth scrolling
  const servicesRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Pre-seed mock requests on first load to make the dashboard look exciting
  useEffect(() => {
    const saved = localStorage.getItem('oksana_accounting_requests');
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      const mockSeeds: ConsultationRequest[] = [
        {
          id: 'seed-1',
          name: 'Дмитро Коваленко',
          phone: '+380 97 123 4567',
          businessType: 'ФОП 3 група',
          message: 'Потрібен повний супровід IT-ФОП із валютними рахунками Payoneer та Wise. Працюю за контрактом із США.',
          calculatedPrice: 1800,
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
          status: 'new'
        },
        {
          id: 'seed-2',
          name: 'Олена (ТОВ "Смарт Трейд")',
          phone: '+380 50 987 6543',
          businessType: 'ТОВ (з ПДВ)',
          message: 'Цікавить ведення кадрового обліку на 4 особи, робота з ПДВ та первинною документацією. Була затримка зі звітами у попереднього бухгалтера.',
          calculatedPrice: 9100,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
          status: 'contacted'
        }
      ];
      localStorage.setItem('oksana_accounting_requests', JSON.stringify(mockSeeds));
      setRequests(mockSeeds);
    }
  }, []);

  // Save requests helper
  const saveRequests = (updated: ConsultationRequest[]) => {
    localStorage.setItem('oksana_accounting_requests', JSON.stringify(updated));
    setRequests(updated);
  };

  // Handle new request submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setFormSubmitting(true);

    setTimeout(() => {
      const newRequest: ConsultationRequest = {
        id: 'req-' + Math.random().toString(36).substr(2, 9),
        name: formName,
        phone: formPhone,
        businessType: formBusinessType,
        message: formMessage,
        calculatedPrice: formCalculatedPrice,
        timestamp: new Date().toISOString(),
        status: 'new'
      };

      const updated = [newRequest, ...requests];
      saveRequests(updated);

      setSuccessLeadDetails({
        name: formName,
        businessType: formBusinessType,
        calculatedPrice: formCalculatedPrice
      });

      // Clear form
      setFormName('');
      setFormPhone('');
      setFormMessage('');
      setFormCalculatedPrice(undefined);
      setFormSubmitting(false);
      setShowSuccessModal(true);
    }, 800);
  };

  // Update request status
  const handleUpdateStatus = (id: string, status: 'new' | 'contacted' | 'completed') => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    saveRequests(updated);
  };

  // Delete request
  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    saveRequests(updated);
  };

  // Scroll helper
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setIsMobileMenuOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler when a package is chosen from the calculator
  const handleSelectPackageFromCalculator = (details: {
    businessType: string;
    employees: number;
    transactions: string;
    extraServices: string[];
    totalPrice: number;
  }) => {
    setFormBusinessType(`${details.businessType} (${details.transactions})`);
    setFormCalculatedPrice(details.totalPrice);
    
    let message = `Обрано через калькулятор:\n- Працівників: ${details.employees}\n- Транзакції: ${details.transactions}`;
    if (details.extraServices.length > 0) {
      message += `\n- Додатково: ${details.extraServices.join(', ')}`;
    }
    setFormMessage(message);

    // Show toast notification
    setToastMessage(`Пакет "${details.businessType}" обрано! Ціна: ${details.totalPrice} грн/міс. Форма заповнена.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // Smooth scroll to form
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick select standard package
  const handleQuickSelectPackage = (pkgTitle: string, basePrice: string) => {
    setFormBusinessType(pkgTitle);
    setFormCalculatedPrice(parseInt(basePrice.replace(/\D/g, '')) || undefined);
    setFormMessage(`Цікавить пакет послуг: "${pkgTitle}"`);
    
    setToastMessage(`Обрано послугу "${pkgTitle}". Перенаправляємо до форми...`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter FAQs
  const filteredFaqs = FAQS.filter(faq => {
    if (faqCategory === 'all') return true;
    return faq.category === faqCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 selection:bg-brand-emerald selection:text-white" id="root-container">
      
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-neutral-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-neutral-800 flex items-start gap-3"
          >
            <div className="p-1 bg-brand-emerald rounded-full text-white shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Повідомлення</p>
              <p className="text-sm mt-0.5 font-medium leading-relaxed">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Top Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Personal Brand Title */}
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
              Оксана Фальонок
              <Sparkles className="w-4.5 h-4.5 text-brand-gold animate-pulse fill-brand-gold/10" />
            </span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono">
              Бухгалтерські Послуги
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo(aboutRef)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              Про мене
            </button>
            <button
              onClick={() => scrollTo(servicesRef)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              Пакетні послуги
            </button>
            <button
              onClick={() => scrollTo(calculatorRef)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              Калькулятор
            </button>
            <button
              onClick={() => scrollTo(faqRef)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              Питання
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Interactive Leads Panel Indicator (Admin demonstration purpose) */}
            <button
              onClick={() => setIsAdminDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-all cursor-pointer flex items-center gap-2 group"
              title="Переглянути заявки (Демо)"
            >
              <Database className="w-5 h-5 text-neutral-500 group-hover:text-brand-emerald transition-colors" />
              <span className="text-xs font-semibold text-neutral-500 font-mono hidden lg:inline">Заявки (Демо)</span>
              {requests.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gold text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {requests.filter(r => r.status === 'new').length}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => scrollTo(contactRef)}
              className="bg-brand-emerald hover:bg-brand-emerald-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-emerald/10 transition-all duration-200 cursor-pointer"
            >
              Отримати консультацію
            </button>
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsAdminDrawerOpen(true)}
              className="relative p-2 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-600"
            >
              <Database className="w-4.5 h-4.5" />
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {requests.filter(r => r.status === 'new').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-50 border border-neutral-150 text-neutral-700 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-neutral-150 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <button
                  onClick={() => scrollTo(aboutRef)}
                  className="text-left py-2 font-medium text-neutral-700 hover:text-brand-emerald"
                >
                  Про мене
                </button>
                <button
                  onClick={() => scrollTo(servicesRef)}
                  className="text-left py-2 font-medium text-neutral-700 hover:text-brand-emerald"
                >
                  Пакетні послуги
                </button>
                <button
                  onClick={() => scrollTo(calculatorRef)}
                  className="text-left py-2 font-medium text-neutral-700 hover:text-brand-emerald"
                >
                  Калькулятор вартості
                </button>
                <button
                  onClick={() => scrollTo(faqRef)}
                  className="text-left py-2 font-medium text-neutral-700 hover:text-brand-emerald"
                >
                  Питання та відповіді
                </button>
                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAdminDrawerOpen(true);
                    }}
                    className="w-full text-center py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    <span>Панель заявок (Демонстрація)</span>
                  </button>
                  <button
                    onClick={() => scrollTo(contactRef)}
                    className="w-full text-center py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-emerald/15"
                  >
                    Безкоштовна консультація
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1">

        {/* 1. HERO SECTION */}
        <section className="relative py-12 md:py-20 lg:py-24 bg-gradient-to-b from-white to-brand-warm-gray/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Active Indicator status */}
                <div className="inline-flex items-center gap-2 bg-brand-mint/50 border border-brand-emerald/20 rounded-full px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                  </span>
                  <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider font-mono">
                    Онлайн супровід по всій Україні
                  </span>
                </div>

                {/* Primary Premium Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 tracking-tight leading-[1.12]">
                  Поверніть фокус на <span className="text-brand-emerald italic underline decoration-brand-gold/40">ріст вашого бізнесу</span>, поки я веду облік
                </h1>

                {/* Engaging Subheading */}
                <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Професійні бухгалтерські послуги для ФОП та ТОВ від <strong>Оксани Фальонок</strong>. Ведення звітності, сплата податків, запуск ПРРО та ЗЕД без штрафів, помилок та стресу.
                </p>

                {/* CTA Elements */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => scrollTo(contactRef)}
                    className="w-full sm:w-auto bg-brand-emerald hover:bg-brand-emerald-dark text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-brand-emerald/25 hover:shadow-brand-emerald/40 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Отримати консультацію</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => scrollTo(calculatorRef)}
                    className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-semibold px-8 py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4.5 h-4.5 text-neutral-500" />
                    <span>Розрахувати ціну</span>
                  </button>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-8 grid grid-cols-3 gap-4 border-t border-neutral-150/70 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                  <div className="space-y-0.5">
                    <span className="block text-2xl md:text-3xl font-bold font-mono text-brand-emerald">5+</span>
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Років досвіду</span>
                  </div>
                  <div className="space-y-0.5 border-x border-neutral-200 px-4">
                    <span className="block text-2xl md:text-3xl font-bold font-mono text-brand-emerald">30+</span>
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">ФОП на супроводі</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-2xl md:text-3xl font-bold font-mono text-brand-emerald">0</span>
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Штрафів клієнтів</span>
                  </div>
                </div>

              </div>

              {/* Right Column illustration / Graphic Layout */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
                <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
                  
                  {/* Decorative background shapes */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-mint/60 rounded-full blur-2xl -z-10" />
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl -z-10" />

                  {/* Main graphic container */}
                  <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                      alt="Бухгалтерська звітність"
                      referrerPolicy="no-referrer"
                      className="w-full h-64 md:h-80 object-cover rounded-2xl"
                    />
                    
                    {/* Floating Info card */}
                    <div className="absolute bottom-8 right-8 left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-neutral-100/50 flex items-center gap-3">
                      <div className="p-2.5 bg-brand-emerald text-white rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-brand-mint" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block font-mono">Гарантія</span>
                        <span className="text-sm font-semibold text-neutral-800 leading-tight block">Безпека даних та відсутність пені</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Instagram link bubble badge */}
                  <a
                    href="https://www.instagram.com/oksana_falonok"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute -top-5 -right-5 bg-white border border-neutral-150 p-3 rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="p-1.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white rounded-lg">
                      <Instagram className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left text-xs">
                      <span className="font-bold block text-neutral-800">@oksana_falonok</span>
                      <span className="text-[10px] text-neutral-400">Переглянути профіл</span>
                    </div>
                  </a>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. VALUE PROPOSITION / ADVANTAGES */}
        <section className="py-16 md:py-24 bg-white border-y border-neutral-100" id="advantages">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Чому обирають мене</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
                Ваш фінансовий спокій — мій головний пріоритет
              </h2>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                Я не просто заповнюю цифри у звітах. Я глибоко аналізую ваш бізнес, пропоную законні шляхи заощадження та беру на себе всі комунікації з податковою службою.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Advantage 1 */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-neutral-150/60 hover:shadow-lg hover:border-neutral-200 transition-all duration-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 text-brand-emerald flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">100% Відповідальність</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Повністю контролюю відповідність обліку вимогам чинного законодавства України. Будь-які ризики чи штрафні санкції виключені.
                </p>
              </div>

              {/* Advantage 2 */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-neutral-150/60 hover:shadow-lg hover:border-neutral-200 transition-all duration-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 text-brand-emerald flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">Економія вашого часу</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Ви звільняєте щонайменше 15-20 годин на місяць, які раніше витрачали на звіти, калькуляції, платіжки та вивчення нових законів.
                </p>
              </div>

              {/* Advantage 3 */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-neutral-150/60 hover:shadow-lg hover:border-neutral-200 transition-all duration-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 text-brand-emerald flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">Легальна оптимізація</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Допомагаю правильно обрати систему оподаткування, КВЕДи та легально знизити податкові платежі на основі специфіки бізнесу.
                </p>
              </div>

              {/* Advantage 4 */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-neutral-150/60 hover:shadow-lg hover:border-neutral-200 transition-all duration-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 text-brand-emerald flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">Постійний зв’язок</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Жодних "абонент недоступний" у звітний період. Я завжди оперативно відповідаю на ваші запитання у Viber, Telegram чи телефоном.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 3. ABOUT ME (Oksana Falonok Personal Profile) */}
        <section className="py-16 md:py-24 bg-stone-50" ref={aboutRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column - Beautiful Profile Image Layout */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative">
                  {/* Design frames */}
                  <div className="absolute -inset-4 rounded-3xl border border-dashed border-brand-emerald/30 -z-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-mint/40 rounded-full blur-3xl -z-20" />
                  
                  {/* Main Portrait */}
                  <div className="relative bg-white p-3 rounded-2xl shadow-xl overflow-hidden max-w-sm group">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={profileImage}
                        alt="Оксана Фальонок"
                        referrerPolicy="no-referrer"
                        className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Interactive Edit Overlay */}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-neutral-900/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white cursor-pointer"
                        title="Завантажити власну фотографію"
                      >
                        <div className="p-3 bg-brand-emerald text-white rounded-full shadow-lg">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold tracking-wide">Завантажити власне фото</span>
                        <span className="text-[10px] text-neutral-300 px-4 text-center">Натисніть, щоб обрати файл на пристрої</span>
                      </button>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    <div className="p-4 text-center">
                      <h4 className="font-serif font-bold text-lg text-neutral-800">Оксана Фальонок</h4>
                      <p className="text-xs text-neutral-500 font-semibold mt-0.5">Бухгалтер-експерт та засновник сервісу</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Story, values & Instagram mention */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Про мене особисто</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                  Я роблю складну бухгалтерію зрозумілою та прозорою
                </h2>
                
                <div className="text-neutral-600 space-y-4 text-sm md:text-base leading-relaxed">
                  <p>
                    Вітаю! Я — <strong>Оксана Фальонок</strong>, сертифікований практикуючий бухгалтер. Мій шлях у сфері фінансів та обліку почався понад 5 років тому. За цей час я допомогла десяткам підприємців налагодити фінансовий облік, успішно пройти перевірки та уникнути штрафів ДПС.
                  </p>
                  <p>
                    Моя спеціалізація — повний бухгалтерський та кадровий супровід мікро- та малого бізнесу в Україні. Я детально опрацьовую кожен кейс: чи то реєстрація нового IT-ФОПу, касові операції (ПРРО), ЗЕД-діяльність з іноземними контрагентами, чи ведення обліку для великих ТОВ з ПДВ.
                  </p>
                  <p className="bg-white border-l-4 border-brand-emerald p-4 rounded-r-xl italic shadow-sm text-neutral-700">
                    "Головне моє завдання — звільнити ваш час для розвитку бізнесу. Ви займаєтесь клієнтами та продуктом, я беру на себе всю рутину: звіти, банки, первинку та спілкування з контролюючими органами."
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="https://www.instagram.com/oksana_falonok"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                  >
                    <Instagram className="w-4.5 h-4.5 text-pink-400" />
                    <span>Слідкувати в Instagram</span>
                  </a>

                  <button
                    onClick={() => scrollTo(contactRef)}
                    className="bg-brand-mint text-brand-emerald hover:bg-brand-emerald hover:text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center transition-all cursor-pointer text-sm"
                  >
                    Записатися на дзвінок
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 4. SERVICES AND PACKAGES GRID */}
        <section className="py-16 md:py-24 bg-white" ref={servicesRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Пакети послуг</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
                Оберіть оптимальний формат супроводу
              </h2>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                Прозорі фіксовані тарифи без прихованих платежів. Оберіть пакет під свій бізнес або скористайтесь калькулятором для точного налаштування.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.filter(s => s.period === 'місяць').map((service) => (
                <div
                  key={service.id}
                  className={`bg-stone-50 rounded-3xl p-6 md:p-8 border flex flex-col justify-between relative ${
                    service.popular
                      ? 'border-brand-emerald ring-2 ring-brand-emerald bg-white shadow-xl shadow-brand-emerald/5'
                      : 'border-neutral-200'
                  }`}
                >
                  {service.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-gold text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow">
                      Популярний вибір
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 font-serif">{service.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed mt-2">{service.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-4 border-y border-neutral-200">
                      <span className="text-2xl md:text-3xl font-serif font-extrabold text-neutral-900">{service.basePrice}</span>
                      <span className="text-sm font-semibold text-neutral-500">грн / {service.period}</span>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Що входить у пакет:</span>
                      <ul className="space-y-2.5">
                        {service.details.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed">
                            <CheckSquare className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleQuickSelectPackage(service.title, service.basePrice)}
                      className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                        service.popular
                          ? 'bg-brand-emerald hover:bg-brand-emerald-dark text-white shadow-lg shadow-brand-emerald/10'
                          : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                      }`}
                    >
                      Обрати цей пакет
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Single Services */}
            <div className="mt-12 bg-stone-50 rounded-2xl p-6 md:p-8 border border-neutral-150 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <span className="bg-brand-mint text-brand-emerald text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Разові послуги
                </span>
                <h4 className="text-lg md:text-xl font-bold text-neutral-900">Потрібна допомога з реєстрацією ФОП чи консультація?</h4>
                <p className="text-xs text-neutral-500 max-w-xl">
                  Вирішую точкові запити: реєстрація ФОП «під ключ», ліквідація ФОП, відновлення занедбаного бухгалтерського обліку чи індивідуальні консультації.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => handleQuickSelectPackage('Реєстрація ФОП Під Ключ', '1000')}
                  className="bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 text-xs font-bold px-5 py-3.5 rounded-xl transition-all text-center cursor-pointer"
                >
                  Реєстрація ФОП (1 000 грн)
                </button>
                <button
                  onClick={() => handleQuickSelectPackage('Індивідуальна Консультація', '600')}
                  className="bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold px-5 py-3.5 rounded-xl transition-all text-center cursor-pointer"
                >
                  Консультація (600 грн/год)
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 5. INTERACTIVE COST CALCULATOR SECTION */}
        <section className="py-16 md:py-24 bg-stone-50 border-t border-neutral-150" ref={calculatorRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Розрахунок вартості</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
                Складіть свій персональний тариф
              </h2>
              <p className="text-neutral-500 text-sm md:text-base">
                Налаштуйте параметри свого бізнесу самостійно та дізнайтесь орієнтовну вартість бухгалтерських послуг за 10 секунд.
              </p>
            </div>

            {/* Calculator Render */}
            <FeeCalculator onSelectPackage={handleSelectPackageFromCalculator} />

          </div>
        </section>

        {/* 6. INSTAGRAM BLOG SECTION */}
        <section className="py-16 md:py-24 bg-white border-t border-neutral-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-3 text-center md:text-left">
                <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Корисний блог</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
                  Поради та інсайти від @oksana_falonok
                </h2>
                <p className="text-neutral-500 text-sm max-w-2xl">
                  Я регулярно ділюся актуальними новинами законодавства, корисними інструкціями для ФОП та порадами щодо оптимізації податків у своєму Instagram.
                </p>
              </div>
              <a
                href="https://www.instagram.com/oksana_falonok"
                target="_blank"
                rel="noreferrer"
                className="bg-brand-mint text-brand-emerald hover:bg-brand-emerald hover:text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all self-center md:self-end shrink-0 cursor-pointer text-xs"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Читати в Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Mock feed of useful posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {INSTAGRAM_POSTS.map((post) => (
                <div key={post.id} className="bg-stone-50 rounded-2xl overflow-hidden border border-neutral-150 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Post image with aspect-ratio */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt="Instagram Post"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase font-mono tracking-wider">
                        Блог
                      </div>
                    </div>

                    {/* Post caption text */}
                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-bold font-mono text-neutral-400 block">{post.date}</span>
                      <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4">
                        {post.caption}
                      </p>
                    </div>
                  </div>

                  {/* Likes/Engagement bar */}
                  <div className="px-5 py-4 border-t border-neutral-200 bg-neutral-100/50 flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-4">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-emerald font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Переглянути</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 7. FAQS (COLLAPSIBLE ACCORDION) */}
        <section className="py-16 md:py-24 bg-stone-50 border-t border-neutral-150" ref={faqRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-widest block font-mono">Часті питання</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
                Запитання та відповіді
              </h2>
              <p className="text-neutral-500 text-sm">
                Знайдіть швидкі відповіді на найпопулярніші запитання підприємців щодо бухгалтерії, податків та звітності.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'all', label: 'Всі питання' },
                { id: 'fop', label: 'Для ФОП' },
                { id: 'tov', label: 'Для ТОВ' },
                { id: 'taxes', label: 'Податки' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setFaqCategory(category.id as any);
                    setActiveFaqId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    faqCategory === category.id
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-neutral-150 overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-neutral-800 hover:text-brand-emerald transition-colors cursor-pointer"
                    >
                      <span className="text-sm md:text-base leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-emerald' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-neutral-600 border-t border-neutral-100 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 8. CONTACT FORM / REQUEST SECTION */}
        <section className="py-16 md:py-24 bg-white border-t border-neutral-150" ref={contactRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-stone-50 rounded-3xl border border-neutral-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column Information card */}
              <div className="lg:col-span-5 bg-brand-emerald text-white p-8 md:p-12 flex flex-col justify-between space-y-12">
                <div className="space-y-6">
                  <span className="text-xs font-bold text-brand-mint uppercase tracking-widest block font-mono">Почати співпрацю</span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                    Зробіть перший крок до спокійного обліку
                  </h3>
                  <p className="text-brand-mint/85 text-xs md:text-sm leading-relaxed">
                    Залиште заявку у формі, і я зв’яжуся з вами протягом 1 години для первинного обговорення. Ми проведемо аудит та підберемо краще рішення для вашого бізнесу.
                  </p>
                </div>

                {/* Contact information detail */}
                <div className="space-y-4 text-xs md:text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-mint shrink-0" />
                    <span className="font-medium">+380 97 123 4567 (Контактний номер)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-mint shrink-0" />
                    <span className="font-medium">oksana.falonok.acc@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-mint shrink-0" />
                    <span className="font-medium">Онлайн супровід • Вся Україна</span>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="pt-6 border-t border-white/10 flex items-center gap-2.5 text-xs text-brand-mint/70">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Ваші персональні дані під надійним захистом</span>
                </div>
              </div>

              {/* Right Column Interactive Form */}
              <div className="lg:col-span-7 p-8 md:p-12">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {formCalculatedPrice !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-brand-mint/50 border border-brand-emerald/20 p-4 rounded-xl flex items-center justify-between text-xs text-brand-emerald"
                    >
                      <div>
                        <span className="font-bold">Ви обрали пакет у калькуляторі:</span>
                        <p className="mt-0.5">{formBusinessType}</p>
                      </div>
                      <span className="text-base font-extrabold font-mono">{formCalculatedPrice} грн/міс</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div className="space-y-2">
                      <label htmlFor="name-input" className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                        Ваше Ім’я *
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Олександр Коваленко"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Phone input */}
                    <div className="space-y-2">
                      <label htmlFor="phone-input" className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                        Телефон *
                      </label>
                      <input
                        id="phone-input"
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+380 97 123 4567"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Business Type selection input */}
                  <div className="space-y-2">
                    <label htmlFor="business-type-input" className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                      Тип вашої діяльності / Запит
                    </label>
                    <select
                      id="business-type-input"
                      value={formBusinessType}
                      onChange={(e) => setFormBusinessType(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="ФОП 1-2 група">ФОП 1-2 група (Супровід)</option>
                      <option value="ФОП 3 група (5%)">ФОП 3 група (5%) (Супровід)</option>
                      <option value="ТОВ (без ПДВ)">ТОВ (без ПДВ) (Супровід)</option>
                      <option value="ТОВ (з ПДВ)">ТОВ (з ПДВ) (Супровід)</option>
                      <option value="Реєстрація ФОП Під Ключ">Реєстрація ФОП «Під ключ»</option>
                      <option value="Індивідуальна Консультація">Індивідуальна Консультація</option>
                      <option value="Інший запит">Інший запит / Індивідуальне обговорення</option>
                    </select>
                  </div>

                  {/* Message input */}
                  <div className="space-y-2">
                    <label htmlFor="message-input" className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                      Ваш коментар чи опис бізнесу (необов’язково)
                    </label>
                    <textarea
                      id="message-input"
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Опишіть вашу діяльність, кількість операцій або складність ситуації..."
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Form Submit button */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-brand-emerald hover:bg-brand-emerald-dark disabled:bg-neutral-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-brand-emerald/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Надсилаємо заявку...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Надіслати запит на консультацію</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center">
                    Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних згідно з чинним законодавством України.
                  </p>

                </form>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-neutral-950 text-white py-12 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-900">
            {/* Left */}
            <div className="text-center md:text-left space-y-1">
              <span className="font-serif text-lg font-bold block tracking-tight">Оксана Фальонок</span>
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest font-mono">
                Сертифікований бухгалтер • Податковий консультант
              </span>
            </div>

            {/* Middle Nav */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-neutral-400 font-medium">
              <button onClick={() => scrollTo(aboutRef)} className="hover:text-white transition-colors cursor-pointer">Про мене</button>
              <button onClick={() => scrollTo(servicesRef)} className="hover:text-white transition-colors cursor-pointer">Послуги</button>
              <button onClick={() => scrollTo(calculatorRef)} className="hover:text-white transition-colors cursor-pointer">Калькулятор</button>
              <button onClick={() => scrollTo(faqRef)} className="hover:text-white transition-colors cursor-pointer">Питання</button>
            </div>

            {/* Right social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/oksana_falonok"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all border border-neutral-800"
                title="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <button
                onClick={() => setIsAdminDrawerOpen(true)}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-brand-gold rounded-xl transition-all border border-neutral-800 flex items-center gap-1.5"
                title="Панель замовлень (Демо)"
              >
                <Database className="w-4 h-4" />
                <span className="text-xs font-mono font-bold hidden sm:inline">Заявки ({requests.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Оксана Фальонок. Всі права захищено.</p>
            <p>
              Розроблено за запитом для презентації послуг бухгалтерського обліку.
            </p>
          </div>

        </div>
      </footer>

      {/* LEAD SUBMISSION SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" id="success-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6 border border-neutral-100"
            >
              <div className="w-16 h-16 bg-brand-mint text-brand-emerald rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-900">Запит прийнято!</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Дякуємо, <strong>{successLeadDetails?.name}</strong>! Вашу заявку успішно зареєстровано. Я зв’яжуся з вами по телефону найближчим часом.
                </p>
              </div>

              {successLeadDetails?.calculatedPrice && (
                <div className="bg-stone-50 p-3.5 rounded-xl border border-neutral-150 inline-block w-full">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">Обраний розрахунок</span>
                  <span className="text-lg font-extrabold text-brand-emerald font-mono block mt-0.5">
                    {successLeadDetails.calculatedPrice} грн/міс
                  </span>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-xs text-amber-800 text-left flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Перевірте панель заявок!</span>
                  <span>Ви можете переглянути свою нову заявку в локальній базі, клікнувши кнопку <strong>"Заявки (Демо)"</strong> в правому кутку заголовка.</span>
                </div>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer text-sm"
              >
                Чудово, повернутись на сайт
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN DRAWER RENDER */}
      <AdminRequestsDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        requests={requests}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteRequest}
      />

    </div>
  );
}

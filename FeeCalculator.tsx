import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface FeeCalculatorProps {
  onSelectPackage: (details: {
    businessType: string;
    employees: number;
    transactions: string;
    extraServices: string[];
    totalPrice: number;
  }) => void;
}

export default function FeeCalculator({ onSelectPackage }: FeeCalculatorProps) {
  const [businessType, setBusinessType] = useState<string>('fop-3');
  const [employees, setEmployees] = useState<number>(0);
  const [transactions, setTransactions] = useState<string>('up-to-20');
  const [extraServices, setExtraServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(1800);

  // Business type config
  const businessTypes = [
    { id: 'fop-1-2', label: 'ФОП 1-2 група', basePrice: 1200, desc: 'Фіксований податок, без ПДВ' },
    { id: 'fop-3', label: 'ФОП 3 група', basePrice: 1800, desc: '5% від доходу, IT-сфера, послуги, торгівля' },
    { id: 'tov-no-vat', label: 'ТОВ (без ПДВ)', basePrice: 5500, desc: 'Юридична особа на спрощеній системі' },
    { id: 'tov-vat', label: 'ТОВ (з ПДВ)', basePrice: 7500, desc: 'Юридична особа на загальній системі, робота з ПДВ' },
  ];

  const transactionOptions = [
    { id: 'up-to-20', label: 'До 20 операцій', price: 0, desc: 'Мінімальна активність рахунку' },
    { id: '21-50', label: '21 – 50 операцій', price: 600, desc: 'Помірна кількість замовлень' },
    { id: '51-100', label: '51 – 100 операцій', price: 1200, desc: 'Активний бізнес та торгівля' },
    { id: 'over-100', label: 'Понад 100 операцій', price: 2500, desc: 'Великий обсяг транзакцій' },
  ];

  const extrasConfig = [
    { id: 'prro', label: 'Робота з ПРРО/РРО', price: 500, desc: 'Касовий апарат, фіскалізація чеків, звіти' },
    { id: 'zed', label: 'ЗЕД (Імпорт / Експорт)', price: 1000, desc: 'Валютні рахунки, інвойси, курсові різниці' },
    { id: 'hr', label: 'Кадровий облік (за працівника)', price: 400, desc: 'Трудові договори, звіти, накази (нараховується за кожного)' },
  ];

  // Calculate price dynamically
  useEffect(() => {
    let price = 0;
    const selectedType = businessTypes.find(t => t.id === businessType);
    if (selectedType) {
      price += selectedType.basePrice;
    }

    // Employees impact (400 UAH per employee)
    price += employees * 400;

    // Transactions impact
    const selectedTrans = transactionOptions.find(t => t.id === transactions);
    if (selectedTrans) {
      price += selectedTrans.price;
    }

    // Extra services impact
    extraServices.forEach(serviceId => {
      const service = extrasConfig.find(s => s.id === serviceId);
      if (service) {
        if (serviceId === 'hr') {
          // already calculated via employees or if employee > 0 we can add basic HR setup
          price += employees > 0 ? 0 : service.price; // add basic fee if no employees specified but checked
        } else {
          price += service.price;
        }
      }
    });

    setTotalPrice(price);
  }, [businessType, employees, transactions, extraServices]);

  const toggleExtra = (id: string) => {
    if (extraServices.includes(id)) {
      setExtraServices(extraServices.filter(item => item !== id));
    } else {
      setExtraServices([...extraServices, id]);
    }
  };

  const handleApply = () => {
    const selectedTypeLabel = businessTypes.find(t => t.id === businessType)?.label || '';
    onSelectPackage({
      businessType: selectedTypeLabel,
      employees,
      transactions: transactionOptions.find(t => t.id === transactions)?.label || '',
      extraServices: extraServices.map(id => extrasConfig.find(s => s.id === id)?.label || ''),
      totalPrice
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-neutral-100 border border-neutral-100/80 overflow-hidden" id="fee-calculator-component">
      <div className="p-6 md:p-8 bg-brand-emerald text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Calculator className="w-6 h-6 text-brand-mint" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold">Калькулятор вартості супроводу</h3>
            <p className="text-sm text-brand-mint/90 mt-0.5">Оберіть параметри вашого бізнесу для точного прорахунку</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Step 1: Business Type */}
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500 block">
            1. Форма власності та система оподаткування
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setBusinessType(type.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  businessType === type.id
                    ? 'border-brand-emerald bg-brand-emerald/5 ring-1 ring-brand-emerald'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div>
                  <span className={`font-semibold block ${businessType === type.id ? 'text-brand-emerald' : 'text-neutral-800'}`}>
                    {type.label}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1 block leading-relaxed">{type.desc}</span>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xs text-neutral-400">від</span>
                  <span className={`text-lg font-bold ${businessType === type.id ? 'text-brand-emerald' : 'text-neutral-700'}`}>
                    {type.basePrice}
                  </span>
                  <span className="text-xs text-neutral-400">грн/міс</span>
                </div>
                {businessType === type.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Employees Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              2. Кількість найманих працівників
            </label>
            <span className="bg-brand-mint text-brand-emerald text-sm font-bold px-3 py-1 rounded-full">
              {employees === 0 ? 'Без працівників' : `${employees} осіб(а)`}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            +400 грн за кожного працівника (нарахування зарплати, звіти ЄСВ/ПДФО, кадрова документація)
          </p>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="15"
              value={employees}
              onChange={(e) => setEmployees(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-2 font-mono">
              <span>0</span>
              <span>3</span>
              <span>6</span>
              <span>9</span>
              <span>12</span>
              <span>15+</span>
            </div>
          </div>
        </div>

        {/* Step 3: Transactions */}
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500 block">
            3. Кількість банківських операцій на місяць
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {transactionOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTransactions(option.id)}
                className={`p-3 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between ${
                  transactions === option.id
                    ? 'border-brand-emerald bg-brand-emerald/5 ring-1 ring-brand-emerald'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div>
                  <span className={`text-xs font-bold block ${transactions === option.id ? 'text-brand-emerald' : 'text-neutral-700'}`}>
                    {option.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5 leading-tight">{option.desc}</span>
                </div>
                {option.price > 0 && (
                  <span className="text-xs font-medium text-neutral-400 mt-2 block">
                    +{option.price} грн
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Extra Services */}
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500 block">
            4. Додаткові послуги та специфіка бізнесу
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {extrasConfig.map((extra) => {
              // disable HR checkbox visual state if employees are already set, since HR is auto-active
              const isActive = extraServices.includes(extra.id) || (extra.id === 'hr' && employees > 0);
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => {
                    if (extra.id === 'hr' && employees > 0) return; // auto-managed
                    toggleExtra(extra.id);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between relative ${
                    isActive
                      ? 'border-brand-emerald bg-brand-emerald/5'
                      : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                  } ${extra.id === 'hr' && employees > 0 ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div>
                    <span className={`text-xs font-bold block ${isActive ? 'text-brand-emerald' : 'text-neutral-700'}`}>
                      {extra.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-1 leading-snug">{extra.desc}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-emerald bg-brand-mint px-2 py-0.5 rounded">
                      +{extra.price} грн
                    </span>
                    {extra.id === 'hr' && employees > 0 && (
                      <span className="text-[9px] text-brand-emerald font-semibold italic">Включено</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Price & CTA */}
        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-150 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Розрахункова вартість</span>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-brand-emerald font-mono">{totalPrice}</span>
              <span className="text-lg font-bold text-neutral-500">грн/місяць</span>
            </div>
            <div className="flex items-center gap-1 justify-center md:justify-start text-xs text-neutral-500 mt-1">
              <Info className="w-3.5 h-3.5 text-brand-gold" />
              <span>Остаточна ціна фіксується після індивідуального аналізу</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full md:w-auto bg-brand-emerald hover:bg-brand-emerald-dark text-white font-medium px-8 py-4 rounded-2xl shadow-lg shadow-brand-emerald/20 hover:shadow-brand-emerald-dark/20 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Замовити цей пакет</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

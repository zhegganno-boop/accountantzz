import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Phone, Briefcase, FileText, Check, Trash2, ShieldAlert } from 'lucide-react';
import { ConsultationRequest } from '../types';

interface AdminRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ConsultationRequest[];
  onUpdateStatus: (id: string, status: 'new' | 'contacted' | 'completed') => void;
  onDelete: (id: string) => void;
}

export default function AdminRequestsDrawer({
  isOpen,
  onClose,
  requests,
  onUpdateStatus,
  onDelete
}: AdminRequestsDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden" id="admin-requests-drawer">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-150 flex items-center justify-between bg-brand-emerald text-white">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <FileText className="w-5 h-5 text-brand-mint" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Панель заявок</h3>
                  <p className="text-xs text-brand-mint/80">Локальний демо-перегляд отриманих лідів</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Notice */}
            <div className="bg-amber-50 border-b border-amber-100 p-4 flex gap-3 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Демонстраційний режим</span>
                <span>Це інтерактивна панель замовлень. Всі нові заявки з форми сайту чи калькулятора миттєво з’являються тут і зберігаються у вашому браузері.</span>
              </div>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <FileText className="w-12 h-12 mx-auto stroke-[1.2] mb-3" />
                  <p className="text-sm">Поки що немає отриманих заявок</p>
                  <p className="text-xs mt-1 text-neutral-400">Надішліть тестову форму на сайті, щоб протестувати</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      req.status === 'new'
                        ? 'border-l-4 border-l-brand-gold bg-amber-50/20 border-neutral-200 shadow-sm'
                        : req.status === 'contacted'
                        ? 'border-l-4 border-l-blue-500 bg-blue-50/10 border-neutral-200'
                        : 'border-l-4 border-l-green-500 bg-neutral-50/50 border-neutral-100 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        {/* Name & Phone */}
                        <div>
                          <h4 className="font-bold text-neutral-800 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-neutral-400" />
                            {req.name}
                          </h4>
                          <a
                            href={`tel:${req.phone}`}
                            className="text-sm font-medium text-brand-emerald hover:underline flex items-center gap-1.5 mt-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            {req.phone}
                          </a>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100 text-xs">
                          <div>
                            <span className="text-neutral-400 block">Тип бізнесу:</span>
                            <span className="font-semibold text-neutral-700 flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                              {req.businessType}
                            </span>
                          </div>
                          {req.calculatedPrice && (
                            <div>
                              <span className="text-neutral-400 block">Розрахована ціна:</span>
                              <span className="font-bold text-brand-emerald mt-0.5 block font-mono">
                                {req.calculatedPrice} грн/міс
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {req.message && (
                          <div className="bg-white p-2.5 rounded-xl border border-neutral-150 text-xs text-neutral-600 leading-relaxed">
                            <span className="font-semibold text-neutral-400 block mb-0.5">Повідомлення:</span>
                            {req.message}
                          </div>
                        )}

                        {/* Footer details */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(req.timestamp).toLocaleString('uk-UA')}
                          </span>

                          {/* Status pill */}
                          <span
                            className={`px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider ${
                              req.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {req.status === 'new'
                              ? 'Нова'
                              : req.status === 'contacted'
                              ? 'Зв’язались'
                              : 'Опрацьовано'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-dashed border-neutral-200">
                      {req.status === 'new' && (
                        <button
                          onClick={() => onUpdateStatus(req.id, 'contacted')}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Позначити як "Зв’язались"</span>
                        </button>
                      )}
                      {req.status !== 'completed' && (
                        <button
                          onClick={() => onUpdateStatus(req.id, 'completed')}
                          className="px-2.5 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Завершити</span>
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(req.id)}
                        className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors ml-auto cursor-pointer"
                        title="Видалити"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

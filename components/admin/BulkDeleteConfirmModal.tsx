'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';

interface BulkDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedMobiles: MobileItem[];
  isDeleting: boolean;
}

export default function BulkDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedMobiles,
  isDeleting,
}: BulkDeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f1422] border border-rose-500/30 rounded-2xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-rose-950/40">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-rose-500/10 to-transparent border-b border-rose-500/20 flex items-start justify-between">
          <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Delete Selected Mobiles?</h3>
              <p className="text-[11px] sm:text-xs text-rose-300/80 mt-0.5 font-medium">
                Permanently remove {selectedMobiles.length} phone
                {selectedMobiles.length > 1 ? 's' : ''} from stock!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Items List Preview */}
        <div className="p-5 sm:p-6 space-y-3">
          <p className="text-xs font-semibold text-slate-300">
            Mobiles selected for permanent deletion:
          </p>
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {selectedMobiles.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                  <span className="font-bold text-white truncate">{item.title}</span>
                  <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                    {item.brand}
                  </span>
                </div>
                <span className="font-extrabold text-emerald-400 shrink-0">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
            Ye action wapas nahi liya ja sakta. Kya aap sach me in sabhi{' '}
            <strong className="text-white">{selectedMobiles.length}</strong> phones ko delete
            karna chahte hain?
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 sm:space-x-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete {selectedMobiles.length} Phones</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

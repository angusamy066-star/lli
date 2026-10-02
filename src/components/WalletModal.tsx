import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, PlusCircle, ArrowUpRight, ArrowDownLeft, X, HelpCircle, ShieldCheck } from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { showWalletModal, closeWalletModal, user, transactions, createInstantDirectLiveRoom } = useApp();

  if (!showWalletModal) return null;

  const timeCredits = user ? user.timeCredits : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Time Credits Wallet</h3>
              <p className="text-xs text-slate-500">
                1 Time Credit = approximately 1 hour of verified time-based community learning value.
              </p>
            </div>
          </div>
          <button
            onClick={closeWalletModal}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="mt-5 p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-xl text-white relative overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Available Time Balance
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1 flex items-baseline gap-2 tabular-nums">
                {timeCredits}
                <span className="text-base font-medium text-slate-300">Credits</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Time Credits are not money. Never show monetary equivalents.
              </p>
            </div>

            <button
              onClick={() => {
                closeWalletModal();
                createInstantDirectLiveRoom('Fullstack Software Exchange');
              }}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Use in Live Call</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Registration Gift</span>
              <span className="font-semibold text-emerald-400">+5 Credits</span>
            </div>
            <div>
              <span className="text-slate-400 block">Earning Rate</span>
              <span className="font-semibold text-slate-200">+1 Credit / Verified Hour Taught</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">Exchange Rate</span>
              <span className="font-semibold text-slate-200">-1 Credit / Verified Hour Learned</span>
            </div>
          </div>
        </div>

        {/* Ledger History */}
        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Immutable Transaction Ledger
            </h4>
            <span className="text-xs text-slate-500">
              {transactions.length} records
            </span>
          </div>

          <div className="space-y-2.5">
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No transactions recorded yet.</p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.amount > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{tx.description}</p>
                      <span className="text-[11px] text-slate-500">{tx.timestamp} · Type: {tx.type}</span>
                    </div>
                  </div>

                  <div
                    className={`text-sm font-bold tabular-nums whitespace-nowrap ${
                      tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Time Bank Principles Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>LearnX Time Banking Policy</span>
            </div>
            <p className="leading-relaxed">
              Every verified teaching hour generates 1 Time Credit once both participants confirm completion. Time credits cannot be purchased with fiat money and have no cash redemption value. They are community proof of reciprocal human teaching.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

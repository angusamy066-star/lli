import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Video, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const WelcomeBonusModal: React.FC = () => {
  const { showWelcomeBonusModal, closeWelcomeBonusModal, user, createInstantDirectLiveRoom } = useApp();

  if (!showWelcomeBonusModal || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden text-slate-900">
        
        {/* Decorative ambient gradient backdrop */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-indigo-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-amber-100 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome to LearnX!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-sm mx-auto">
            Your account is set up. You have received <strong className="text-slate-900 font-bold">5 Free Time Credits</strong> to begin exchanging knowledge immediately!
          </p>

          {/* Time Credits Hero Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starting Balance</span>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-lg tabular-nums">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>5 Time Credits</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Book <strong>5 full 1-on-1 sessions</strong> with verified community peers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Launch <strong>instant live video sessions</strong> with whiteboard and code sharing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Replenish your credits anytime by teaching what you know!</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                closeWelcomeBonusModal();
                createInstantDirectLiveRoom('Welcome Orientation');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live Call Now</span>
            </button>
            <button
              onClick={closeWelcomeBonusModal}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

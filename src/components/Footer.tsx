import React from 'react';
import { Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                X
              </span>
              <span className="font-bold text-white text-base tracking-tight">LearnX</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Exchange, Learn & Grow. The peer-to-peer knowledge network where time is the universal currency. Every new member gets 5 free time credits on registration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>1 Hour Taught = 1 Time Credit Earned</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Live In-Browser Video Studio</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Collaborative Whiteboard Canvas</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Direct Skill Swapping Matcher</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Time Credits Ledger</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Skill Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Software & Distributed Systems</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Conversational Languages</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Design Systems & UI/UX</span></li>
              <li><span className="hover:text-slate-200 transition-colors cursor-pointer">Startup Pitching & Strategy</span></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LearnX Network. All skills exchanged freely under human reciprocity.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Charter</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Time Bank Terms</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

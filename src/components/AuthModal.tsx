import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Clock, X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, closeAuthModal, registerUser, loginUser } = useApp();
  const [isLoginView, setIsLoginView] = useState<boolean>(false);

  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [offeringInput, setOfferingInput] = useState<string>('');
  const [seekingInput, setSeekingInput] = useState<string>('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      if (email.trim()) loginUser(email.trim());
    } else {
      const offering = offeringInput.split(',').map((s) => s.trim()).filter(Boolean);
      const seeking = seekingInput.split(',').map((s) => s.trim()).filter(Boolean);
      const teachSkill = offering[0] || '';
      const learnSkill = seeking[0] || '';
      registerUser(name.trim(), email.trim(), teachSkill, learnSkill, `Skills offered: ${offering.join(', ')}. Seeking: ${seeking.join(', ')}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 5 Free Credits Welcome Callout Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mb-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span>Registration Bonus</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">5 Free Time Credits</span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Every newly registered member receives 5 free time credits to start learning 1-on-1 immediately!
            </p>
          </div>
        </div>

        {/* Modal Title */}
        <div className="mb-5">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {isLoginView ? 'Welcome Back to LearnX' : 'Create Your LearnX Account'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isLoginView
              ? 'Enter your email to access your peer skill exchange account.'
              : 'Join the community to exchange skills 1-on-1 using time credits.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jordan.lee@example.com"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {!isLoginView && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skills You Can Teach or Share (Comma separated)
                </label>
                <input
                  type="text"
                  value={offeringInput}
                  onChange={(e) => setOfferingInput(e.target.value)}
                  placeholder="e.g. Python, Digital Photography, French"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  You can teach whatever you enjoy—coding, languages, music, cooking, etc.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skills You Want to Learn (Comma separated)
                </label>
                <input
                  type="text"
                  value={seekingInput}
                  onChange={(e) => setSeekingInput(e.target.value)}
                  placeholder="e.g. Conversational Spanish, Figma Systems"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  We will automatically pair you with mentors who want what you teach!
                </span>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <span>{isLoginView ? 'Sign In' : 'Register & Claim 5 Free Credits'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* View Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-center text-xs text-slate-600">
          {isLoginView ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className="text-indigo-600 font-bold hover:underline"
              >
                Register for 5 Free Credits
              </button>
            </span>
          ) : (
            <span>
              Already a member?{' '}
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

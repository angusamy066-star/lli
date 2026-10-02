import React from 'react';
import { useApp } from '../context/AppContext';
import { Video, Clock, User, LogOut, Sparkles, Repeat, BookOpen, Home, Play } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    user,
    isRegistered,
    userMode,
    setUserMode,
    toggleUserMode,
    openAuthModal,
    logoutUser,
    createInstantDirectLiveRoom,
    openWalletModal
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#18050e]/95 backdrop-blur-md border-b border-pink-950/60 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setCurrentTab('home')}
          className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-700 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-pink-900/50">
            X
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold text-white tracking-tight text-base leading-none">LearnX</span>
            <span className="text-[10px] text-pink-200/80 font-normal tracking-wide mt-0.5">Exchange. Learn. Grow.</span>
          </div>
        </button>

        {/* Zone 2: 5 clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-pink-100/80">
          <button
            onClick={() => setCurrentTab('home')}
            className={`transition-colors hover:text-white py-1 ${
              currentTab === 'home' ? 'text-pink-400 font-bold border-b-2 border-pink-500' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentTab('exchange')}
            className={`transition-colors hover:text-white py-1 ${
              currentTab === 'exchange' ? 'text-pink-400 font-bold border-b-2 border-pink-500' : ''
            }`}
          >
            Exchange
          </button>

          <button
            onClick={() => setCurrentTab('courses')}
            className={`transition-colors hover:text-white py-1 ${
              currentTab === 'courses' ? 'text-pink-400 font-bold border-b-2 border-pink-500' : ''
            }`}
          >
            Courses
          </button>

          <button
            onClick={() => setCurrentTab('live')}
            className={`transition-colors hover:text-white py-1 flex items-center gap-1 ${
              currentTab === 'live' ? 'text-pink-400 font-bold border-b-2 border-pink-500' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`transition-colors hover:text-white py-1 ${
              currentTab === 'profile' ? 'text-pink-400 font-bold border-b-2 border-pink-500' : ''
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {/* Dual Segmented Mode Switcher (Always accessible) */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#250817] border border-pink-900/60 shadow-xs">
            <button
              onClick={() => setUserMode('LEARN')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                userMode === 'LEARN'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                  : 'text-pink-300/70 hover:text-white'
              }`}
              title="Learn Mode: Find peer mentors who teach skills you need"
            >
              LEARN
            </button>
            <button
              onClick={() => setUserMode('TEACH')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                userMode === 'TEACH'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs ring-1 ring-rose-400/50'
                  : 'text-pink-300/70 hover:text-white'
              }`}
              title="Teach Mode: Enable teach mode to find learners and offer sessions"
            >
              TEACH
            </button>
          </div>

          {/* Time Credits Button */}
          <button
            onClick={openWalletModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#250817] hover:bg-[#340b20] border border-pink-900/60 text-amber-300 rounded-lg text-xs font-semibold transition-colors tabular-nums"
            title="1 Time Credit = approximately 1 hour of verified time-based community learning value. Time Credits are not money."
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{user ? user.timeCredits : 0} Credits</span>
          </button>

          {/* Quick Instant Live Call Button */}
          <button
            onClick={() => createInstantDirectLiveRoom('Fullstack Coding')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-pink-900/40 active:scale-95 whitespace-nowrap"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Studio</span>
          </button>

          {/* User profile / Register */}
          {user && isRegistered ? (
            <div className="flex items-center gap-2 pl-2 border-l border-pink-950">
              <button
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-2 group text-left"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-pink-700 group-hover:ring-pink-400 transition-all"
                />
              </button>
              <button
                onClick={logoutUser}
                className="p-1 text-pink-300/70 hover:text-white transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-pink-50 text-pink-950 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Register (5 Credits)</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

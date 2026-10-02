import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ExchangeTab } from './components/ExchangeTab';
import { CoursesTab } from './components/CoursesTab';
import { LiveTab } from './components/LiveTab';
import { ProfileTab } from './components/ProfileTab';
import { VideoSessionRoom } from './components/VideoSessionRoom';
import { CreateRequestModal } from './components/CreateRequestModal';
import { WalletModal } from './components/WalletModal';
import { AuthModal } from './components/AuthModal';
import { WelcomeBonusModal } from './components/WelcomeBonusModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';
import { Video, CheckCircle2, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeLiveSession, notification, createInstantDirectLiveRoom } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);

  // If inside an active live video call room, show full screen video studio
  if (activeLiveSession) {
    return <VideoSessionRoom />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white pb-14 md:pb-0">
      
      {/* Global Notification Banner */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'exchange' && <ExchangeTab />}
        {currentTab === 'courses' && <CoursesTab />}
        {currentTab === 'live' && <LiveTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      {/* Floating Actions (AI Assistant + Instant Live Studio) */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:flex items-center gap-3">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#18050e] hover:bg-[#340b20] text-pink-200 border border-pink-700/60 rounded-2xl shadow-xl font-bold text-xs transition-all hover:scale-105 active:scale-95"
          title="Open LearnX AI Assistant (OpenAI Powered)"
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={() => createInstantDirectLiveRoom('Fullstack Software Exchange')}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl shadow-xl font-bold text-xs transition-all hover:scale-105 active:scale-95 border border-pink-400/30"
          title="Start Instant Live Video Session"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Video className="w-4 h-4" />
          <span>Instant Live Call</span>
        </button>
      </div>

      {/* Bottom Navigation for mobile */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Modals */}
      <CreateRequestModal />
      <WalletModal />
      <AuthModal />
      <WelcomeBonusModal />
      <AIAssistantModal isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />

      {/* Clean Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

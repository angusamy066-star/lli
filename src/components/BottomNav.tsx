import React from 'react';
import { Home, Repeat, BookOpen, Video, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'exchange', label: 'Exchange', icon: Repeat },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'live', label: 'Live', icon: Video },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#18050e]/95 border-t border-pink-950/60 backdrop-blur-md md:hidden py-1 px-2 flex items-center justify-around shadow-lg">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = currentTab === id;
        return (
          <button
            key={id}
            onClick={() => setCurrentTab(id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-pink-400 font-bold' : 'text-pink-200/60 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

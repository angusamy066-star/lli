import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { SKILL_CATALOGUE } from '../data/learnxCatalog';
import {
  Search,
  Video,
  Send,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const {
    allUsers,
    user,
    userMode,
    setUserMode,
    toggleUserMode,
    isRegistered,
    openAuthModal,
    openCreateRequestModal,
    createInstantDirectLiveRoom,
    blockedUserIds
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  // Filter real users
  const activeMembers = allUsers.filter((u) => {
    // Exclude self and blocked users
    if (user && u.id === user.id) return false;
    if (blockedUserIds.includes(u.id)) return false;

    // Filter by mode
    if (userMode === 'LEARN') {
      // In learn mode, we want people who can teach
      if (u.canTeach.length === 0) return false;
    } else {
      // In teach mode, we want people who want to learn
      if (u.wantsToLearn.length === 0) return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchTeach = u.canTeach.some((s) => s.name.toLowerCase().includes(q));
      const matchLearn = u.wantsToLearn.some((s) => s.name.toLowerCase().includes(q));
      const matchBio = u.bio.toLowerCase().includes(q);
      if (!matchName && !matchTeach && !matchLearn && !matchBio) return false;
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      const categorySkills = (SKILL_CATALOGUE as Record<string, string[]>)[selectedCategory] || [];
      const hasSkillInCategory =
        userMode === 'LEARN'
          ? u.canTeach.some((s) => categorySkills.some((cs) => cs.toLowerCase() === s.name.toLowerCase()))
          : u.wantsToLearn.some((s) => categorySkills.some((cs) => cs.toLowerCase() === s.name.toLowerCase()));
      if (!hasSkillInCategory) return false;
    }

    return true;
  });

  return (
    <div className="pb-16 bg-slate-50 min-h-screen">
      
      {/* 1. Hero / Header Banner with Dark Maroon & Indigo Theme */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Give What You're Good At. Get What You Actually Need.</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              LearnX — Exchange. Learn. Grow.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              A real-time peer-to-peer knowledge network. A single account can both learn and teach. Connect directly with real peers using verified time credits.
            </p>
          </div>

          {/* Mode Switch Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md shrink-0 w-full md:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Active Account Mode
            </span>
            <div className="p-1 bg-slate-950 rounded-xl flex items-center gap-1 border border-slate-800">
              <button
                onClick={() => setUserMode('LEARN')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  userMode === 'LEARN'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LEARN MODE
              </button>
              <button
                onClick={() => setUserMode('TEACH')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  userMode === 'TEACH'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm ring-1 ring-rose-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TEACH MODE
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              {userMode === 'LEARN'
                ? '📘 Learn Mode: Showing peers who can teach skills you may need.'
                : '🎓 Teach Mode Active: Showing learners seeking what you can share. Earn 1 Credit / hr.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Registration Incentive Callout (Rule: New users get 5 Free Time Credits) */}
      {!isRegistered && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Registration Perk: 5 Free Time Credits
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Sign up in 30 seconds to claim your 5 credits and start your first 1-on-1 peer learning session.
                </p>
              </div>
            </div>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap shadow-xs"
            >
              Register (Get 5 Credits)
            </button>
          </div>
        </div>
      )}

      {/* 3. Search & Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills or members: Python, English, Java..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...Object.keys(SKILL_CATALOGUE)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Real Members Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span className="font-semibold text-slate-800 tabular-nums">
            {activeMembers.length} {userMode === 'LEARN' ? 'available mentors' : 'eager learners'}
          </span>
          <span>Online Peer-to-Peer Learning Network</span>
        </div>

        {/* 4. Real Users Directory Grid */}
        {activeMembers.length === 0 ? (
          /* Honest Empty State Rule: No fake cards! */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No mentors available right now.
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              We never populate fake data. {!isRegistered ? 'Register to create your account and add skills you can teach or learn.' : 'Add skills in your profile to appear in peer searches.'}
            </p>
            {!isRegistered ? (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs"
              >
                Register Account (5 Free Credits)
              </button>
            ) : (
              <button
                onClick={toggleUserMode}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs"
              >
                Switch to {userMode === 'LEARN' ? 'TEACH' : 'LEARN'} Mode
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name, Status, Reliability */}
                  <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      {member.isOnline && (
                        <span
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                          title="Online now"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{member.name}</h3>
                        
                        {/* Rating rule: If no ratings yet, show honest label */}
                        <div className="text-xs font-semibold tabular-nums text-slate-700">
                          {member.ratingAverage !== null ? (
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{member.ratingAverage.toFixed(2)}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">No ratings yet</span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 truncate mt-0.5">{member.educationWorkStatus}</p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{member.language}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-600 font-medium">{member.reliabilityStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 my-3.5 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Trust Score & Verified Sessions */}
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Trust Metric</span>
                      <span className="font-bold text-slate-800">
                        {member.trustScore !== null ? `${member.trustScore}% Score` : 'Not enough data yet'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Verified Sessions</span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {member.sessionsCompleted} completed
                      </span>
                    </div>
                  </div>

                  {/* Can Teach (Zero-Pill Discipline) */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      Can Teach
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {member.canTeach.map((item, idx) => (
                        <span key={item.id}>
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({item.level} · {item.proof})</span>
                          {idx < member.canTeach.length - 1 && <span className="text-slate-300 mx-1.5">·</span>}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Wants to Learn (Zero-Pill Discipline) */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                      Wants to Learn
                    </span>
                    <p className="text-xs text-slate-500">
                      {member.wantsToLearn.map((item, idx) => (
                        <span key={item.id}>
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({item.level})</span>
                          {idx < member.wantsToLearn.length - 1 && <span className="text-slate-300 mx-1.5">/</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openCreateRequestModal(member)}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Session</span>
                  </button>

                  <button
                    onClick={() => createInstantDirectLiveRoom(member.canTeach[0]?.name || 'Java', member)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    title="Launch Live Video Room Now"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Live Call</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

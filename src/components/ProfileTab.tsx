import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserSkillItem, SkillLevel } from '../types';
import { SKILL_CATALOGUE } from '../data/learnxCatalog';
import {
  User,
  Clock,
  Star,
  ShieldCheck,
  Award,
  Edit3,
  Plus,
  Trash2,
  Lock,
  ShieldAlert,
  FileText,
  CheckCircle2,
  Users,
  AlertCircle
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const {
    user,
    allUsers,
    transactions,
    auditLogs,
    updateProfileSkills,
    toggleAdminRole,
    openWalletModal,
    openAuthModal,
    logoutUser,
    isRegistered,
    userMode,
    setUserMode
  } = useApp();

  const [isEditingSkills, setIsEditingSkills] = useState<boolean>(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'wallet' | 'admin'>('profile');

  // Skill Editor Local State
  const [teachSkills, setTeachSkills] = useState<UserSkillItem[]>(user?.canTeach || []);
  const [learnSkills, setLearnSkills] = useState<UserSkillItem[]>(user?.wantsToLearn || []);

  const [newTeachName, setNewTeachName] = useState<string>('');
  const [newTeachLevel, setNewTeachLevel] = useState<SkillLevel>('Intermediate');

  const [newLearnName, setNewLearnName] = useState<string>('');
  const [newLearnLevel, setNewLearnLevel] = useState<SkillLevel>('Beginner');

  if (!isRegistered || !user) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Create Your LearnX Account</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Register to establish your peer exchange profile, add skills you can teach, and immediately receive 5 Free Time Credits!
        </p>
        <button
          onClick={openAuthModal}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Register (Get 5 Free Credits)
        </button>
      </div>
    );
  }

  // Handlers for skill editing
  const handleAddTeachSkill = () => {
    if (!newTeachName.trim()) return;
    const newItem: UserSkillItem = {
      id: `sk-t-${Date.now()}`,
      name: newTeachName.trim(),
      category: 'Technical',
      level: newTeachLevel,
      proof: 'Self Claimed',
      verifiedSessionsCount: 0
    };
    const updated = [...teachSkills, newItem];
    setTeachSkills(updated);
    updateProfileSkills(updated, learnSkills);
  };

  const handleRemoveTeachSkill = (id: string) => {
    const updated = teachSkills.filter((s) => s.id !== id);
    setTeachSkills(updated);
    updateProfileSkills(updated, learnSkills);
  };

  const handleAddLearnSkill = () => {
    if (!newLearnName.trim()) return;
    const newItem: UserSkillItem = {
      id: `sk-l-${Date.now()}`,
      name: newLearnName.trim(),
      category: 'Communication',
      level: newLearnLevel,
      proof: 'Self Claimed',
      verifiedSessionsCount: 0
    };
    const updated = [...learnSkills, newItem];
    setLearnSkills(updated);
    updateProfileSkills(teachSkills, updated);
  };

  const handleRemoveLearnSkill = (id: string) => {
    const updated = learnSkills.filter((s) => s.id !== id);
    setLearnSkills(updated);
    updateProfileSkills(teachSkills, updated);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation tabs inside profile view */}
        <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1 max-w-md mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveProfileTab('profile')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeProfileTab === 'profile'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveProfileTab('wallet')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeProfileTab === 'wallet'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallet Ledger
          </button>
          {user.isAdmin && (
            <button
              onClick={() => setActiveProfileTab('admin')}
              className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                activeProfileTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Portal
            </button>
          )}
        </div>

        {/* 1. Main Profile Screen */}
        {activeProfileTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {user.educationWorkStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-lg">{user.bio}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span>{user.language}</span>
                      <span aria-hidden="true">·</span>
                      <span>Member since {user.memberSince}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {/* Account Mode Switcher (Learn vs Teach) */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                    <button
                      onClick={() => setUserMode('LEARN')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                        userMode === 'LEARN'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Switch to Learn Mode"
                    >
                      Learn Mode
                    </button>
                    <button
                      onClick={() => setUserMode('TEACH')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                        userMode === 'TEACH'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Enable Teach Mode to offer mentoring to peers"
                    >
                      Teach Mode
                    </button>
                  </div>

                  <button
                    onClick={toggleAdminRole}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {user.isAdmin ? 'Admin Mode (Active)' : 'Enable Admin Mode'}
                  </button>
                  <button
                    onClick={logoutUser}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-rose-600 rounded-lg text-xs font-medium"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              {/* Real Platform Activity Metrics (Rule: No fake numbers!) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Time Credits</span>
                  <span className="text-xl font-black text-indigo-700 tabular-nums">
                    {user.timeCredits} Credits
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Verified Sessions</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {user.sessionsCompleted} completed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Teaching Hours</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {user.teachingHours} hrs
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Learning Hours</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {user.learningHours} hrs
                  </span>
                </div>
              </div>

              {/* Trust, Reliability & Ratings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Rating Score
                  </span>
                  <div className="font-semibold text-slate-800">
                    {user.ratingAverage !== null ? (
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{user.ratingAverage.toFixed(2)} ({user.ratingsCount} reviews)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">No ratings yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Trust Score
                  </span>
                  <div className="font-semibold text-slate-800">
                    {user.trustScore !== null ? (
                      <span className="text-emerald-700 font-bold">{user.trustScore}% Score</span>
                    ) : (
                      <span className="text-slate-500">Not enough data yet</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    (Requires 3 verified sessions)
                  </span>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Reliability Metric
                  </span>
                  <div className="font-semibold text-indigo-700">
                    {user.reliabilityStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Management (Rule: Single Account - Both Learn & Teach) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Skills & Exchange Configuration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modifying your skills updates real-time bilateral matching instantly.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingSkills ? 'Close Editor' : 'Manage Skills'}</span>
                </button>
              </div>

              {isEditingSkills && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 mb-6 space-y-4 text-xs">
                  {/* Add Teach Skill */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Add Skill You Can Teach</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTeachName}
                        onChange={(e) => setNewTeachName(e.target.value)}
                        placeholder="e.g. Java, Python, Web Development"
                        className="flex-1 px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={newTeachLevel}
                        onChange={(e) => setNewTeachLevel(e.target.value as SkillLevel)}
                        className="px-3 py-2 bg-white rounded-lg border border-slate-300"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Elementary">Elementary</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddTeachSkill}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Add Learn Skill */}
                  <div className="pt-2 border-t border-indigo-200/60">
                    <label className="block font-bold text-slate-700 mb-1">Add Skill You Want to Learn</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLearnName}
                        onChange={(e) => setNewLearnName(e.target.value)}
                        placeholder="e.g. English, Figma, Public Speaking"
                        className="flex-1 px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={newLearnLevel}
                        onChange={(e) => setNewLearnLevel(e.target.value as SkillLevel)}
                        className="px-3 py-2 bg-white rounded-lg border border-slate-300"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Elementary">Elementary</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddLearnSkill}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
                      >
                        Add Need
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Can Teach */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-3">
                    Can Teach ({teachSkills.length})
                  </span>
                  {teachSkills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No teaching skills configured yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {teachSkills.map((item) => (
                        <div key={item.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2">({item.level} · {item.proof})</span>
                          </div>
                          {isEditingSkills && (
                            <button
                              onClick={() => handleRemoveTeachSkill(item.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wants to Learn */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-3">
                    Wants to Learn ({learnSkills.length})
                  </span>
                  {learnSkills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No learning goals configured yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {learnSkills.map((item) => (
                        <div key={item.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2">({item.level})</span>
                          </div>
                          {isEditingSkills && (
                            <button
                              onClick={() => handleRemoveLearnSkill(item.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements rule: New user -> "No achievements yet." */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    LearnX Achievements & Badges
                  </span>
                  <span className="text-[11px] text-pink-600 font-semibold">
                    {user.achievements.length} earned
                  </span>
                </div>
                {user.achievements.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                    <p className="font-semibold text-slate-700 mb-0.5">No achievements yet.</p>
                    <p className="text-[11px]">
                      Complete verified peer sessions, pass skill quizzes, and teach community members to earn verifiable LearnX badges.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.map((ach) => (
                      <span key={ach} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-900 shadow-xs">
                        🏆 {ach}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 2. Wallet & Immutable Ledger Screen */}
        {activeProfileTab === 'wallet' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Time Credits Wallet</h3>
                <p className="text-xs text-slate-500">
                  "1 Time Credit = approximately 1 hour of verified time-based community learning value. Time Credits are not money."
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</span>
                <div className="text-2xl font-black text-indigo-700 tabular-nums">
                  {user.timeCredits} Credits
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Immutable Transaction History
              </h4>
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-500">No transactions recorded yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block">{tx.description}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{tx.timestamp} · Type: {tx.type}</span>
                    </div>
                    <span className={`font-bold tabular-nums text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. Secure Admin Portal Screen */}
        {activeProfileTab === 'admin' && user.isAdmin && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
                  Restricted Access
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">LearnX Admin Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Platform oversight, user status verification, audit logs, and moderation.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white">
                Admin Role Active
              </span>
            </div>

            {/* Registered Users List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Registered Community Users ({allUsers.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {allUsers.map((u) => (
                  <div key={u.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="text-[11px] text-slate-500 ml-2 font-mono">({u.email})</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Can Teach: {u.canTeach.map((s) => s.name).join(', ')} · Balance: {u.timeCredits} credits
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{u.reliabilityStatus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Platform Security & Audit Log ({auditLogs.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold text-indigo-700">{log.action}</span>
                      <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

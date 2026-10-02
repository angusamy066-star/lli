import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, LearningRequest } from '../types';
import {
  ArrowLeftRight,
  Send,
  Check,
  X,
  Clock,
  Calendar,
  Video,
  User,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Repeat,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const ExchangeTab: React.FC = () => {
  const {
    user,
    allUsers,
    requests,
    respondToRequest,
    cancelRequest,
    openCreateRequestModal,
    createInstantDirectLiveRoom,
    startLiveSessionFromRecord,
    sessions,
    blockedUserIds
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'incoming' | 'outgoing' | 'cycles' | 'skillgap'>('matches');

  // Filter blocked users
  const availablePeers = allUsers.filter((u) => u.id !== user?.id && !blockedUserIds.includes(u.id));

  // Compute Direct Mutual Matches (A teaches what B wants, AND B teaches what A wants)
  const myTeaches = (user?.canTeach || []).map((t) => t.name.toLowerCase());
  const myWants = (user?.wantsToLearn || []).map((w) => w.name.toLowerCase());

  const directMutualMatches = availablePeers.map((peer) => {
    const peerTeaches = peer.canTeach.map((t) => t.name.toLowerCase());
    const peerWants = peer.wantsToLearn.map((w) => w.name.toLowerCase());

    // What peer teaches that I want
    const theyTeachMe = peer.canTeach.filter((item) =>
      myWants.some((w) => item.name.toLowerCase() === w || item.name.toLowerCase().includes(w) || w.includes(item.name.toLowerCase()))
    );

    // What I teach that peer wants
    const iTeachThem = (user?.canTeach || []).filter((item) =>
      peerWants.some((w) => item.name.toLowerCase() === w || item.name.toLowerCase().includes(w) || w.includes(item.name.toLowerCase()))
    );

    const isDirectSwap = theyTeachMe.length > 0 && iTeachThem.length > 0;
    const compatibilityScore = (theyTeachMe.length > 0 ? 50 : 0) + (iTeachThem.length > 0 ? 50 : 0);

    return {
      peer,
      theyTeachMe,
      iTeachThem,
      isDirectSwap,
      compatibilityScore
    };
  }).filter((match) => match.compatibilityScore > 0)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Filter Requests
  const incomingRequests = requests.filter((r) => r.receiverId === user?.id);
  const outgoingRequests = requests.filter((r) => r.senderId === user?.id);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Reciprocal Matching Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Swaps & Request Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Real-time matching based on mutual reciprocity. When skills change or users update their profiles, matches recompute automatically.
            </p>
          </div>
        </div>

        {/* Sub-tab segmented control */}
        <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1 max-w-xl mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('matches')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSubTab === 'matches'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Swaps ({directMutualMatches.filter((m) => m.isDirectSwap).length})
          </button>

          <button
            onClick={() => setActiveSubTab('incoming')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'incoming'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Incoming</span>
            {incomingRequests.filter((r) => r.status === 'REQUESTED').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
                {incomingRequests.filter((r) => r.status === 'REQUESTED').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('outgoing')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSubTab === 'outgoing'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Outgoing ({outgoingRequests.length})
          </button>

          <button
            onClick={() => setActiveSubTab('cycles')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSubTab === 'cycles'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exchange Cycles
          </button>

          <button
            onClick={() => setActiveSubTab('skillgap')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'skillgap'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-sm'
                : 'text-pink-900/80 hover:text-pink-950 font-semibold'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>LEARNX SKILL GAP</span>
          </button>
        </div>

        {/* 1. Direct Swaps Tab */}
        {activeSubTab === 'matches' && (
          <div>
            {directMutualMatches.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-3">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  No mutual matches found right now.
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Direct swaps require two users whose teaching and learning interests align reciprocally. Try adding more skills to your profile!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {directMutualMatches.map(({ peer, theyTeachMe, iTeachThem, isDirectSwap, compatibilityScore }) => (
                  <div
                    key={peer.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isDirectSwap
                        ? 'border-indigo-400 bg-white shadow-md ring-1 ring-indigo-400/40'
                        : 'border-slate-200 bg-white shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Badge / Compatibility */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                        <span className={`font-bold flex items-center gap-1.5 ${isDirectSwap ? 'text-indigo-700' : 'text-slate-600'}`}>
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>{isDirectSwap ? '100% Direct Reciprocal Swap' : `${compatibilityScore}% Match`}</span>
                        </span>
                        {peer.isOnline && (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        )}
                      </div>

                      {/* Peer info */}
                      <div className="flex items-center gap-3 my-3">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{peer.name}</h3>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{peer.educationWorkStatus}</p>
                          <span className="text-[11px] text-slate-400">{peer.language}</span>
                        </div>
                      </div>

                      {/* Mutual breakdown */}
                      <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 my-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                            They Teach You:
                          </span>
                          <span className="font-semibold text-slate-900 block mt-0.5">
                            {theyTeachMe.length > 0 ? theyTeachMe.map((s) => s.name).join(', ') : peer.canTeach[0]?.name}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                            You Teach Them:
                          </span>
                          <span className="font-semibold text-slate-900 block mt-0.5">
                            {iTeachThem.length > 0 ? iTeachThem.map((s) => s.name).join(', ') : user?.canTeach[0]?.name || 'Java'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => openCreateRequestModal(peer)}
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Request</span>
                      </button>
                      <button
                        onClick={() => createInstantDirectLiveRoom(theyTeachMe[0]?.name || peer.canTeach[0]?.name || 'Java', peer)}
                        className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Start Instant Live Video"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Incoming Requests Tab */}
        {activeSubTab === 'incoming' && (
          <div>
            {incomingRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800 mb-1">No incoming requests yet.</p>
                <p className="text-xs text-slate-500">When other members request a learning session with you, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={req.senderAvatar}
                        alt={req.senderName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{req.senderName}</h4>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          Wants to learn: <span className="text-indigo-600">{req.skillName}</span>
                        </p>
                        <p className="text-xs text-slate-500 italic mt-0.5">"{req.message}"</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{req.preferredDate}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{req.preferredTime} ({req.durationMinutes} min)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {req.status === 'REQUESTED' ? (
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => respondToRequest(req.id, 'ACCEPT')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Schedule</span>
                        </button>
                        <button
                          onClick={() => respondToRequest(req.id, 'REJECT')}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Request {req.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Outgoing Requests Tab */}
        {activeSubTab === 'outgoing' && (
          <div>
            {outgoingRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800 mb-1">No outgoing requests.</p>
                <p className="text-xs text-slate-500 mb-4">You have not sent any session requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={req.receiverAvatar}
                        alt={req.receiverName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">To {req.receiverName}</h4>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              req.status === 'ACCEPTED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          Skill: <span className="text-indigo-600">{req.skillName}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Goal: {req.goal}</p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Proposed: {req.preferredDate} at {req.preferredTime}
                        </span>
                      </div>
                    </div>

                    {req.status === 'REQUESTED' && (
                      <button
                        onClick={() => cancelRequest(req.id)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium self-end sm:self-center"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Multi-Person Exchange Cycles */}
        {activeSubTab === 'cycles' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Repeat className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Person Exchange Cycle Detection
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                When direct bilateral matching isn't possible, LearnX calculates multi-way closed reciprocity loops:
                <strong> A teaches B, B teaches C, and C teaches A.</strong> Everyone gives what they're good at and gets what they need!
              </p>

              {/* Dynamic Cycle Calculation or Honest Empty State */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  No closed exchange cycles detected yet.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  When 3 or more real registered members have circular complementary skills (A → B → C → A), the engine resolves the exchange loop without net credit expenditure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. LEARNX SKILL GAP Analysis */}
        {activeSubTab === 'skillgap' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-pink-950/20 via-white to-white border border-pink-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>LEARNX SKILL GAP</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                        Diagnostic Engine
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Personalized analysis comparing your learning targets with available peer mentors and verified competencies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-200/60 self-start sm:self-auto">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Peer Exchange Roadmap</span>
                </div>
              </div>

              {/* Skill Gap Cards */}
              {!user || (user.wantsToLearn || []).length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 max-w-md mx-auto">
                  <p className="font-semibold text-slate-800 mb-1">No learning targets defined yet.</p>
                  <p className="leading-relaxed">
                    Add skills you want to learn in your Profile to generate your personalized LearnX Skill Gap diagnostics and peer matching roadmap.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {user.wantsToLearn.map((goalSkill) => {
                    // Find peers who teach this skill
                    const matchingMentors = availablePeers.filter((p) =>
                      p.canTeach.some((t) => t.name.toLowerCase() === goalSkill.name.toLowerCase())
                    );

                    return (
                      <div
                        key={goalSkill.id}
                        className="p-5 rounded-xl border border-slate-200 bg-white hover:border-pink-300 transition-all shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 block">
                              Target Skill
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                              {goalSkill.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500">Current Level:</span>
                            <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {goalSkill.level}
                            </span>
                            <span className="text-slate-400">➔</span>
                            <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Target: Advanced
                            </span>
                          </div>
                        </div>

                        {/* Gap Diagnosis */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-4">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Proof Status</span>
                            <span className="font-semibold text-slate-700">{goalSkill.proof}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended Step</span>
                            <span className="font-semibold text-slate-700">1-on-1 Practice Session</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Mentors</span>
                            <span className="font-semibold text-pink-700 tabular-nums">
                              {matchingMentors.length} {matchingMentors.length === 1 ? 'peer' : 'peers'} offering
                            </span>
                          </div>
                        </div>

                        {/* Mentor matches for this gap */}
                        {matchingMentors.length > 0 ? (
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Mentors:</span>
                              <div className="flex -space-x-2">
                                {matchingMentors.slice(0, 3).map((m) => (
                                  <img
                                    key={m.id}
                                    src={m.avatar}
                                    alt={m.name}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                                    title={m.name}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-slate-700">
                                {matchingMentors[0].name} {matchingMentors.length > 1 ? `+${matchingMentors.length - 1} more` : ''}
                              </span>
                            </div>

                            <button
                              onClick={() => openCreateRequestModal(matchingMentors[0])}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                            >
                              Bridge Gap with {matchingMentors[0].name.split(' ')[0]}
                            </button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">
                            No community peer is currently offering {goalSkill.name}. As more members register, matches will be highlighted here.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

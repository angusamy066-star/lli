import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SessionRecord } from '../types';
import {
  Video,
  Play,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';

export const LiveTab: React.FC = () => {
  const {
    sessions,
    startLiveSessionFromRecord,
    createInstantDirectLiveRoom,
    confirmSessionCompletion,
    submitRating,
    user
  } = useApp();

  const [ratingSessionId, setRatingSessionId] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const liveSessions = sessions.filter((s) => s.status === 'IN_PROGRESS');
  const pendingConfirmationSessions = sessions.filter((s) => s.status === 'PENDING_CONFIRMATION');
  const upcomingSessions = sessions.filter((s) => s.status === 'SCHEDULED');
  const verifiedSessions = sessions.filter((s) => s.status === 'VERIFIED');

  const handleRatingSubmit = (session: SessionRecord) => {
    const reviewedId = user?.id === session.teacherId ? session.learnerId : session.teacherId;
    submitRating(session.id, reviewedId, starCount, reviewComment);
    setRatingSessionId(null);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Live Video Studio & Sessions
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Calls & Session Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              In-browser WebRTC video calls with camera, audio, screen sharing, and whiteboard. Dual confirmation verifies completed hours and transfers time credits.
            </p>
          </div>

          <button
            onClick={() => createInstantDirectLiveRoom('Fullstack Architecture')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Launch Instant Room</span>
          </button>
        </div>

        {/* 1. Live Now Section */}
        {liveSessions.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Live Calls In Progress ({liveSessions.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="pr-12">
                    <span className="text-xs font-semibold text-indigo-600 block">{session.skill} Exchange</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{session.goal}</h4>
                  </div>

                  <div className="my-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800 block">Teacher: {session.teacherName}</span>
                      <span className="text-slate-500">Learner: {session.learnerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] text-indigo-600 block">{session.roomCode}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In Call
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => startLiveSessionFromRecord(session)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Enter Live Room</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Pending Dual Confirmation Section */}
        {pendingConfirmationSessions.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Pending Verification ({pendingConfirmationSessions.length})
              </h3>
            </div>

            <div className="space-y-4">
              {pendingConfirmationSessions.map((session) => {
                const isTeacher = user?.id === session.teacherId;
                const isLearner = user?.id === session.learnerId;

                return (
                  <div
                    key={session.id}
                    className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Awaiting Dual Confirmation
                        </span>
                        <span className="text-xs font-mono text-slate-500">Room: {session.roomCode}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{session.skill} Session</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Teacher: <strong>{session.teacherName}</strong> ({session.teacherConfirmed ? '✓ Confirmed' : 'Pending'}) · Learner: <strong>{session.learnerName}</strong> ({session.learnerConfirmed ? '✓ Confirmed' : 'Pending'})
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Rule: Both teacher and learner must confirm completion before 1 Time Credit transfers.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isTeacher && !session.teacherConfirmed && (
                        <button
                          onClick={() => confirmSessionCompletion(session.id, 'teacher')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm as Teacher</span>
                        </button>
                      )}

                      {isLearner && !session.learnerConfirmed && (
                        <button
                          onClick={() => confirmSessionCompletion(session.id, 'learner')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm as Learner</span>
                        </button>
                      )}

                      {/* If user is neither or testing, allow test confirmation */}
                      {!isTeacher && !isLearner && (
                        <div className="flex items-center gap-2">
                          {!session.teacherConfirmed && (
                            <button
                              onClick={() => confirmSessionCompletion(session.id, 'teacher')}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium"
                            >
                              Confirm as Teacher
                            </button>
                          )}
                          {!session.learnerConfirmed && (
                            <button
                              onClick={() => confirmSessionCompletion(session.id, 'learner')}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium"
                            >
                              Confirm as Learner
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Upcoming Scheduled Sessions */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
            Upcoming Scheduled Sessions ({upcomingSessions.length})
          </h3>

          {upcomingSessions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
              <p className="text-xs text-slate-500">No upcoming scheduled sessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{session.skill} with {session.teacherName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{session.scheduledDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{session.startTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{session.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {session.roomCode}
                    </span>
                    <button
                      onClick={() => startLiveSessionFromRecord(session)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Verified Completed Sessions */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
            Verified Sessions History ({verifiedSessions.length})
          </h3>

          {verifiedSessions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
              <p className="text-xs text-slate-500">No verified sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {verifiedSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{session.skill} Verified Exchange</h4>
                      <p className="text-xs text-slate-500">
                        {session.teacherName} (Teacher) ↔ {session.learnerName} (Learner) · 1 Time Credit Transferred
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setRatingSessionId(session.id)}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium self-end sm:self-center flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rate Session</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Submission Modal */}
        {ratingSessionId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Submit Verified Session Rating
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Ratings directly impact peer Trust and Reliability scores on LearnX.
              </p>

              {/* Star selector */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStarCount(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${s <= starCount ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Review & Feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRatingSessionId(null)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sess = sessions.find((s) => s.id === ratingSessionId);
                    if (sess) handleRatingSubmit(sess);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

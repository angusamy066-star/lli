import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Clock, Calendar, X, ShieldCheck, User } from 'lucide-react';

export const CreateRequestModal: React.FC = () => {
  const {
    showCreateRequestModal,
    closeCreateRequestModal,
    selectedPeerForRequest,
    sendLearningRequest,
    user,
    openWalletModal
  } = useApp();

  const timeCredits = user ? user.timeCredits : 0;

  const [selectedSkill, setSelectedSkill] = useState<string>(
    selectedPeerForRequest?.canTeach[0]?.name || ''
  );
  const [goal, setGoal] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(45);

  useEffect(() => {
    if (selectedPeerForRequest && selectedPeerForRequest.canTeach.length > 0) {
      setSelectedSkill(selectedPeerForRequest.canTeach[0].name);
    }
  }, [selectedPeerForRequest]);

  if (!showCreateRequestModal || !selectedPeerForRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendLearningRequest(
      selectedPeerForRequest.id,
      selectedSkill,
      goal,
      message,
      date,
      time,
      duration
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={selectedPeerForRequest.avatar}
              alt={selectedPeerForRequest.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Request Learning Session
              </h3>
              <p className="text-xs text-slate-500">
                With {selectedPeerForRequest.name} ({selectedPeerForRequest.language})
              </p>
            </div>
          </div>
          <button
            onClick={closeCreateRequestModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Skill Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Skill You Want to Learn
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {selectedPeerForRequest.canTeach.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} ({item.level} · {item.proof})
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Learning Goal / Focus Topic
            </label>
            <input
              type="text"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master classes, methods, and OOP inheritance"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Intro Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Personal Note / Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Proposed Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Tomorrow or Monday"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Proposed Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:00 PM IST"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    duration === mins
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Wallet check banner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-semibold text-slate-900">Exchange Cost: 1 Time Credit</span>
                <span className="block text-[11px] text-slate-500">Available balance: {timeCredits} credits</span>
              </div>
            </div>
            {timeCredits < 1 ? (
              <button
                type="button"
                onClick={openWalletModal}
                className="text-indigo-600 font-semibold underline text-xs"
              >
                Top Up
              </button>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Credit Available</span>
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeCreateRequestModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserMode,
  UserSkillItem,
  LearningRequest,
  SessionRecord,
  WalletTransaction,
  ReviewRecord,
  LearningPath,
  Quiz,
  PartnerCourse,
  CertificateRecord,
  AuditLog
} from '../types';
import {
  SKILL_CATALOGUE,
  INITIAL_LEARNING_PATHS,
  INITIAL_QUIZZES,
  INITIAL_PARTNER_COURSES,
  REGISTERED_COMMUNITY_MEMBERS
} from '../data/learnxCatalog';

interface AppContextType {
  user: UserProfile | null;
  isRegistered: boolean;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  toggleUserMode: () => void;
  allUsers: UserProfile[];
  blockedUserIds: string[];
  requests: LearningRequest[];
  sessions: SessionRecord[];
  activeLiveSession: SessionRecord | null;
  transactions: WalletTransaction[];
  reviews: ReviewRecord[];
  learningPaths: LearningPath[];
  quizzes: Quiz[];
  partnerCourses: PartnerCourse[];
  certificates: CertificateRecord[];
  auditLogs: AuditLog[];
  notification: string | null;
  showAuthModal: boolean;
  showWalletModal: boolean;
  showWelcomeBonusModal: boolean;
  showCreateRequestModal: boolean;
  selectedPeerForRequest: UserProfile | null;

  // Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  closeWelcomeBonusModal: () => void;
  openCreateRequestModal: (peer?: UserProfile) => void;
  closeCreateRequestModal: () => void;
  setNotificationMessage: (msg: string | null) => void;

  // Auth & Profile
  registerUser: (
    name: string,
    email: string,
    teachSkillName: string,
    learnSkillName: string,
    bio?: string,
    language?: string
  ) => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  updateProfileSkills: (canTeach: UserSkillItem[], wantsToLearn: UserSkillItem[]) => void;
  toggleAdminRole: () => void;

  // Request & Session Flow
  sendLearningRequest: (
    receiverId: string,
    skillName: string,
    goal: string,
    message: string,
    date: string,
    time: string,
    duration: number
  ) => boolean;
  respondToRequest: (requestId: string, action: 'ACCEPT' | 'REJECT') => void;
  cancelRequest: (requestId: string) => void;

  startLiveSessionFromRecord: (session: SessionRecord) => void;
  createInstantDirectLiveRoom: (skill: string, partnerPeer?: UserProfile) => SessionRecord;
  leaveLiveSessionRoom: () => void;
  endLiveSessionRoom: () => void;
  confirmSessionCompletion: (sessionId: string, asRole: 'teacher' | 'learner') => void;

  // Ratings, Skills, Quizzes, Courses
  submitRating: (sessionId: string, reviewedUserId: string, rating: number, comment: string) => void;
  submitQuizResult: (quizId: string, score: number, total: number) => void;
  toggleTopicCompletion: (pathId: string, topicId: string) => void;
  enrollInCourse: (courseId: string) => void;
  issueCourseCertificate: (courseId: string) => void;

  // Moderation
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'learnx_active_user_clean',
  ALL_USERS: 'learnx_all_users_clean',
  REQUESTS: 'learnx_requests_clean',
  SESSIONS: 'learnx_sessions_clean',
  TRANSACTIONS: 'learnx_transactions_clean',
  REVIEWS: 'learnx_reviews_clean',
  PATHS: 'learnx_paths_clean',
  COURSES: 'learnx_courses_clean',
  CERTS: 'learnx_certs_clean',
  AUDIT: 'learnx_audit_clean',
  BLOCKED: 'learnx_blocked_clean'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All registered community members
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Current active logged in user
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const isRegistered = user !== null;
  const [guestMode, setGuestMode] = useState<UserMode>('LEARN');
  const userMode: UserMode = user ? user.mode : guestMode;

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Requests
  const [requests, setRequests] = useState<LearningRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Sessions
  const [sessions, setSessions] = useState<SessionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [activeLiveSession, setActiveLiveSession] = useState<SessionRecord | null>(null);

  // Transactions
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Reviews
  const [reviews, setReviews] = useState<ReviewRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Learning Paths
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATHS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_LEARNING_PATHS;
  });

  // Quizzes
  const [quizzes] = useState<Quiz[]>(INITIAL_QUIZZES);

  // Partner Courses
  const [partnerCourses, setPartnerCourses] = useState<PartnerCourse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PARTNER_COURSES;
  });

  // Certificates
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showWelcomeBonusModal, setShowWelcomeBonusModal] = useState<boolean>(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState<boolean>(false);
  const [selectedPeerForRequest, setSelectedPeerForRequest] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATHS, JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(partnerCourses));
  }, [partnerCourses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  const setNotificationMessage = (msg: string | null) => {
    setNotification(msg);
    if (msg) setTimeout(() => setNotification(null), 4500);
  };

  // Switch between LEARN MODE and TEACH MODE
  const setUserMode = (mode: UserMode) => {
    setGuestMode(mode);
    if (user) {
      const updated = { ...user, mode };
      setUser(updated);
      setAllUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    }
    setNotificationMessage(`Switched to ${mode} MODE`);
  };

  const toggleUserMode = () => {
    const nextMode: UserMode = userMode === 'LEARN' ? 'TEACH' : 'LEARN';
    setUserMode(nextMode);
  };

  // Register New User (Core Rule: Every newly registered user receives 5 Free Time Credits!)
  const registerUser = (
    name: string,
    email: string,
    teachSkillName: string,
    learnSkillName: string,
    bio?: string,
    language?: string
  ) => {
    const cleanName = name.trim() || 'New Learner';
    const cleanEmail = email.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '')}@learnx.org`;

    const canTeachItems: UserSkillItem[] = teachSkillName.trim()
      ? [
          {
            id: `sk-teach-${Date.now()}`,
            name: teachSkillName.trim(),
            category: 'Technical',
            level: 'Beginner', // Rule: Every new user starts as Beginner
            proof: 'Self Claimed', // Rule: New skills start Self Claimed
            verifiedSessionsCount: 0
          }
        ]
      : [];

    const wantsToLearnItems: UserSkillItem[] = learnSkillName.trim()
      ? [
          {
            id: `sk-learn-${Date.now()}`,
            name: learnSkillName.trim(),
            category: 'Communication',
            level: 'Beginner',
            proof: 'Self Claimed',
            verifiedSessionsCount: 0
          }
        ]
      : [];

    // Every new user receives 5 free time credits upon registration (per user's explicit rule)
    const initialCredits = 5;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: '/src/assets/images/avatar_elena_mentor_1790921198840.jpg',
      bio: bio?.trim() || (canTeachItems.length && wantsToLearnItems.length ? `Excited to teach ${canTeachItems[0].name} and learn ${wantsToLearnItems[0].name}.` : ''),
      language: language?.trim() || 'English',
      educationWorkStatus: 'Member',
      mode: 'LEARN',
      canTeach: canTeachItems,
      wantsToLearn: wantsToLearnItems,
      learningGoals: wantsToLearnItems.length ? [`Master ${wantsToLearnItems[0].name} through peer exchange.`] : [],
      availabilityDays: ['Flexible'],
      availabilityTime: 'Flexible',
      learningStyle: 'Hands-on / Practical',
      timeCredits: initialCredits,
      sessionsCompleted: 0,
      teachingHours: 0,
      learningHours: 0,
      ratingAverage: null, // "No ratings yet."
      ratingsCount: 0,
      trustScore: null, // "Not enough data yet" (null until 3 verified sessions)
      reliabilityStatus: 'New member', // "New member"
      achievements: [], // "No achievements yet."
      isAdmin: false,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isOnline: true
    };

    const welcomeTx: WalletTransaction = {
      id: `tx-welcome-${Date.now()}`,
      userId: newUser.id,
      type: 'EARNED',
      amount: initialCredits,
      description: 'Registration Reward: 5 Free Time Credits granted upon sign-up',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const audit: AuditLog = {
      id: `aud-reg-${Date.now()}`,
      action: 'USER_REGISTERED',
      actorId: newUser.id,
      actorName: newUser.name,
      details: `New account created. 5 welcome credits deposited.`,
      timestamp: new Date().toLocaleString()
    };

    setUser(newUser);
    setAllUsers((prev) => [newUser, ...prev.filter((u) => u.email !== cleanEmail)]);
    setTransactions((prev) => [welcomeTx, ...prev]);
    setAuditLogs((prev) => [audit, ...prev]);
    setShowAuthModal(false);
    setShowWelcomeBonusModal(true);
    setNotificationMessage('Welcome to LearnX! 5 Free Time Credits have been deposited into your wallet.');
  };

  const loginUser = (email: string) => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setUser(existing);
      setShowAuthModal(false);
      setNotificationMessage(`Welcome back, ${existing.name}!`);
    } else {
      setNotificationMessage('No registered account found with that email. Please create a new account.');
    }
  };

  const logoutUser = () => {
    setUser(null);
    setNotificationMessage('Logged out. Register a new profile to receive 5 free time credits!');
  };

  // Skill updates with real-time matching effect
  const updateProfileSkills = (canTeach: UserSkillItem[], wantsToLearn: UserSkillItem[]) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      canTeach,
      wantsToLearn
    };
    setUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    setNotificationMessage('Your skill profile updated. Matches have recomputed automatically!');
  };

  const toggleAdminRole = () => {
    if (!user) return;
    const updated = { ...user, isAdmin: !user.isAdmin };
    setUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    setNotificationMessage(updated.isAdmin ? 'Admin Portal Access Activated' : 'Admin Role Deactivated');
  };

  // Send Learning Request
  const sendLearningRequest = (
    receiverId: string,
    skillName: string,
    goal: string,
    message: string,
    date: string,
    time: string,
    duration: number
  ): boolean => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }

    if (user.timeCredits < 1) {
      setNotificationMessage('Insufficient Time Credits. You need at least 1 credit to book a session.');
      setShowWalletModal(true);
      return false;
    }

    const receiver = allUsers.find((u) => u.id === receiverId);
    if (!receiver) return false;

    const newReq: LearningRequest = {
      id: `req-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverAvatar: receiver.avatar,
      skillName,
      goal: goal || `Learn ${skillName} fundamentals`,
      message: message || `Hi ${receiver.name}, I would love to exchange knowledge with you on ${skillName}!`,
      preferredDate: date || 'Tomorrow',
      preferredTime: time || '4:00 PM',
      durationMinutes: duration || 45,
      status: 'REQUESTED',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setRequests((prev) => [newReq, ...prev]);
    setShowCreateRequestModal(false);
    setNotificationMessage(`Learning request sent to ${receiver.name}!`);
    return true;
  };

  // Respond to request
  const respondToRequest = (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    if (action === 'ACCEPT') {
      const roomCode = `LX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const newSession: SessionRecord = {
        id: `sess-${Date.now()}`,
        requestId: req.id,
        teacherId: req.receiverId,
        teacherName: req.receiverName,
        teacherAvatar: req.receiverAvatar,
        learnerId: req.senderId,
        learnerName: req.senderName,
        learnerAvatar: req.senderAvatar,
        skill: req.skillName,
        goal: req.goal,
        scheduledDate: req.preferredDate,
        startTime: req.preferredTime,
        durationMinutes: req.durationMinutes,
        roomCode,
        status: 'SCHEDULED',
        teacherConfirmed: false,
        learnerConfirmed: false,
        creditsTransferred: false,
        createdAt: new Date().toLocaleDateString()
      };

      setSessions((prev) => [newSession, ...prev]);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r))
      );
      setNotificationMessage(`Request accepted! Live Session scheduled with Room Code: ${roomCode}`);
    } else {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED' } : r))
      );
      setNotificationMessage('Request declined.');
    }
  };

  const cancelRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'CANCELLED' } : r))
    );
    setNotificationMessage('Request cancelled.');
  };

  // Live Session Controls
  const startLiveSessionFromRecord = (session: SessionRecord) => {
    const inProgressSession: SessionRecord = {
      ...session,
      status: 'IN_PROGRESS'
    };
    setSessions((prev) => prev.map((s) => (s.id === session.id ? inProgressSession : s)));
    setActiveLiveSession(inProgressSession);
  };

  const createInstantDirectLiveRoom = (skill: string, partnerPeer?: UserProfile): SessionRecord => {
    const roomCode = `LX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const otherPeer = partnerPeer || allUsers.find((u) => u.id !== user?.id) || null;

    const instantSession: SessionRecord = {
      id: `sess-instant-${Date.now()}`,
      teacherId: otherPeer ? otherPeer.id : 'peer-host',
      teacherName: otherPeer ? otherPeer.name : 'Waiting for Partner',
      teacherAvatar: otherPeer ? otherPeer.avatar : '/src/assets/images/avatar_elena_mentor_1790921198840.jpg',
      learnerId: user?.id || 'learner-guest',
      learnerName: user?.name || 'Learner',
      learnerAvatar: user?.avatar || '/src/assets/images/avatar_elena_mentor_1790921198840.jpg',
      skill: skill || 'General Skill Exchange',
      goal: `Real-time collaborative exchange on ${skill}`,
      scheduledDate: 'Live Right Now',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: 45,
      roomCode,
      status: 'IN_PROGRESS',
      teacherConfirmed: false,
      learnerConfirmed: false,
      creditsTransferred: false,
      createdAt: new Date().toLocaleDateString()
    };

    setSessions((prev) => [instantSession, ...prev]);
    setActiveLiveSession(instantSession);
    return instantSession;
  };

  const leaveLiveSessionRoom = () => {
    setActiveLiveSession(null);
  };

  const endLiveSessionRoom = () => {
    if (!activeLiveSession) return;
    const pendingSession: SessionRecord = {
      ...activeLiveSession,
      status: 'PENDING_CONFIRMATION'
    };
    setSessions((prev) => prev.map((s) => (s.id === activeLiveSession.id ? pendingSession : s)));
    setActiveLiveSession(null);
    setNotificationMessage('Live video call ended. Both teacher and learner must confirm completion to verify time credit transfer.');
  };

  // Dual Confirmation Rule: Both participants must confirm
  const confirmSessionCompletion = (sessionId: string, asRole: 'teacher' | 'learner') => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;

        const updatedTeacher = asRole === 'teacher' ? true : s.teacherConfirmed;
        const updatedLearner = asRole === 'learner' ? true : s.learnerConfirmed;
        const isBothConfirmed = updatedTeacher && updatedLearner;

        // If both confirmed and not transferred yet, execute deterministic credit transfer
        if (isBothConfirmed && !s.creditsTransferred) {
          // Rule: 1 verified teaching hour = 1 Time Credit
          // Rule: Sessions under 10 minutes do not receive credit
          const creditAmount = s.durationMinutes >= 10 ? 1 : 0;

          if (creditAmount > 0) {
            // Deduct from learner
            if (user && user.id === s.learnerId) {
              const updatedLearnerUser = {
                ...user,
                timeCredits: Math.max(0, user.timeCredits - creditAmount),
                learningHours: user.learningHours + 1,
                sessionsCompleted: user.sessionsCompleted + 1
              };
              setUser(updatedLearnerUser);
              setAllUsers((users) =>
                users.map((u) => (u.id === user.id ? updatedLearnerUser : u))
              );
            }

            // Award to teacher
            setAllUsers((users) =>
              users.map((u) => {
                if (u.id === s.teacherId) {
                  return {
                    ...u,
                    timeCredits: u.timeCredits + creditAmount,
                    teachingHours: u.teachingHours + 1,
                    sessionsCompleted: u.sessionsCompleted + 1
                  };
                }
                return u;
              })
            );

            // Record immutable transactions
            const txLearner: WalletTransaction = {
              id: `tx-used-${Date.now()}`,
              userId: s.learnerId,
              type: 'USED',
              amount: -creditAmount,
              description: `Verified session: ${s.skill} taught by ${s.teacherName}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              relatedSessionId: s.id
            };

            const txTeacher: WalletTransaction = {
              id: `tx-earned-${Date.now()}`,
              userId: s.teacherId,
              type: 'EARNED',
              amount: creditAmount,
              description: `Verified session taught: ${s.skill} to ${s.learnerName}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              relatedSessionId: s.id
            };

            setTransactions((txs) => [txLearner, txTeacher, ...txs]);
          }

          setNotificationMessage('Session VERIFIED! Both participants confirmed. 1 Time Credit transferred.');

          return {
            ...s,
            teacherConfirmed: updatedTeacher,
            learnerConfirmed: updatedLearner,
            creditsTransferred: true,
            status: 'VERIFIED'
          };
        }

        setNotificationMessage(`Confirmation recorded for ${asRole}. Awaiting peer confirmation.`);
        return {
          ...s,
          teacherConfirmed: updatedTeacher,
          learnerConfirmed: updatedLearner
        };
      })
    );
  };

  // Submit Rating after verified session
  const submitRating = (
    sessionId: string,
    reviewedUserId: string,
    rating: number,
    comment: string
  ) => {
    if (!user) return;

    const newRev: ReviewRecord = {
      id: `rev-${Date.now()}`,
      sessionId,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewedUserId,
      rating,
      comment,
      createdAt: new Date().toLocaleDateString()
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update reviewed user's ratings and trust calculation
    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === reviewedUserId) {
          const userReviews = [...reviews.filter((r) => r.reviewedUserId === u.id), newRev];
          const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
          // Trust remains null until 3 verified sessions
          const trust =
            u.sessionsCompleted >= 3
              ? Math.min(100, Math.round(avg * 19.5))
              : null;

          return {
            ...u,
            ratingAverage: Number(avg.toFixed(2)),
            ratingsCount: userReviews.length,
            trustScore: trust,
            reliabilityStatus: u.sessionsCompleted >= 5 ? 'Exceptional' : 'Reliable'
          };
        }
        return u;
      })
    );

    setNotificationMessage('Rating submitted successfully. Thank you for your feedback!');
  };

  // Submit Quiz Result & Upgrade SkillProof
  const submitQuizResult = (quizId: string, score: number, total: number) => {
    if (!user) return;
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const pct = Math.round((score / total) * 100);

    // If score >= 60%, upgrade SkillProof to 'AI Assessed'
    if (pct >= 60) {
      const updatedCanTeach = user.canTeach.map((item) => {
        if (item.name.toLowerCase() === quiz.skillName.toLowerCase()) {
          return {
            ...item,
            proof: 'AI Assessed' as const,
            level: 'Intermediate' as const
          };
        }
        return item;
      });

      const updated = {
        ...user,
        canTeach: updatedCanTeach,
        achievements: user.achievements.includes('Skill Explorer')
          ? user.achievements
          : [...user.achievements, 'Skill Explorer']
      };

      setUser(updated);
      setAllUsers((users) => users.map((u) => (u.id === user.id ? updated : u)));
      setNotificationMessage(`Quiz passed with ${pct}%! SkillProof for ${quiz.skillName} upgraded to AI Assessed.`);
    } else {
      setNotificationMessage(`Quiz completed with ${pct}%. Review the explanations and retry to upgrade SkillProof.`);
    }
  };

  // Topic Completion in Learning Path
  const toggleTopicCompletion = (pathId: string, topicId: string) => {
    setLearningPaths((paths) =>
      paths.map((p) => {
        if (p.id !== pathId) return p;
        return {
          ...p,
          topics: p.topics.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          )
        };
      })
    );
  };

  // Enroll in Partner Course
  const enrollInCourse = (courseId: string) => {
    setPartnerCourses((courses) =>
      courses.map((c) =>
        c.id === courseId ? { ...c, isEnrolled: true, enrolledLearnersCount: c.enrolledLearnersCount + 1 } : c
      )
    );
    setNotificationMessage('Enrolled in partner course! Syllabus modules unlocked.');
  };

  // Issue Certificate
  const issueCourseCertificate = (courseId: string) => {
    if (!user) return;
    const course = partnerCourses.find((c) => c.id === courseId);
    if (!course) return;

    const certCode = `CERT-LX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      learnerId: user.id,
      learnerName: user.name,
      courseTitle: course.title,
      organizationName: course.organizationName,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      certificateCode: certCode,
      verificationUrl: `${window.location.origin}/verify/${certCode}`
    };

    setCertificates((prev) => [newCert, ...prev]);
    setNotificationMessage(`Congratulations! Certificate ${certCode} issued by ${course.organizationName}.`);
  };

  // Moderation
  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    setNotificationMessage('User blocked. They will not appear in your matches or directory.');
  };

  const reportUser = (userId: string, reason: string) => {
    const audit: AuditLog = {
      id: `rep-${Date.now()}`,
      action: 'USER_REPORTED',
      actorId: user?.id || 'guest',
      actorName: user?.name || 'User',
      details: `Report filed for user ${userId}. Reason: ${reason}`,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs((prev) => [audit, ...prev]);
    setNotificationMessage('Report submitted to LearnX safety board.');
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  const openWalletModal = () => setShowWalletModal(true);
  const closeWalletModal = () => setShowWalletModal(false);
  const closeWelcomeBonusModal = () => setShowWelcomeBonusModal(false);
  const openCreateRequestModal = (peer?: UserProfile) => {
    if (peer) setSelectedPeerForRequest(peer);
    setShowCreateRequestModal(true);
  };
  const closeCreateRequestModal = () => {
    setSelectedPeerForRequest(null);
    setShowCreateRequestModal(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isRegistered,
        userMode,
        setUserMode,
        toggleUserMode,
        allUsers,
        blockedUserIds,
        requests,
        sessions,
        activeLiveSession,
        transactions,
        reviews,
        learningPaths,
        quizzes,
        partnerCourses,
        certificates,
        auditLogs,
        notification,
        showAuthModal,
        showWalletModal,
        showWelcomeBonusModal,
        showCreateRequestModal,
        selectedPeerForRequest,
        openAuthModal,
        closeAuthModal,
        openWalletModal,
        closeWalletModal,
        closeWelcomeBonusModal,
        openCreateRequestModal,
        closeCreateRequestModal,
        setNotificationMessage,
        registerUser,
        loginUser,
        logoutUser,
        updateProfileSkills,
        toggleAdminRole,
        sendLearningRequest,
        respondToRequest,
        cancelRequest,
        startLiveSessionFromRecord,
        createInstantDirectLiveRoom,
        leaveLiveSessionRoom,
        endLiveSessionRoom,
        confirmSessionCompletion,
        submitRating,
        submitQuizResult,
        toggleTopicCompletion,
        enrollInCourse,
        issueCourseCertificate,
        blockUser,
        reportUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

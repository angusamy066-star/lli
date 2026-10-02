export type SkillLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';

export type UserMode = 'LEARN' | 'TEACH';

export type SkillProofStatus = 'Self Claimed' | 'AI Assessed' | 'Peer Verified' | 'Institution Verified';

export interface UserSkillItem {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  proof: SkillProofStatus;
  verifiedSessionsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  mobile?: string;
  language: string;
  educationWorkStatus: string;
  mode: UserMode;
  canTeach: UserSkillItem[];
  wantsToLearn: UserSkillItem[];
  learningGoals: string[];
  availabilityDays: string[];
  availabilityTime: string;
  learningStyle: 'Hands-on / Practical' | 'Visual / Diagrammatic' | 'Conversational / Discussion' | 'Theory & Deep-Dive';
  timeCredits: number;
  sessionsCompleted: number;
  teachingHours: number;
  learningHours: number;
  ratingAverage: number | null; // null if no ratings yet
  ratingsCount: number;
  trustScore: number | null; // null until 3 verified sessions
  reliabilityStatus: 'New member' | 'Reliable' | 'Very High' | 'Exceptional';
  achievements: string[];
  isAdmin: boolean;
  memberSince: string;
  isOnline: boolean;
}

export interface LearningRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  skillName: string;
  goal: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  requestId?: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  skill: string;
  goal: string;
  scheduledDate: string;
  startTime: string;
  durationMinutes: number;
  roomCode: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'PENDING_CONFIRMATION' | 'VERIFIED' | 'CANCELLED' | 'DISPUTED';
  teacherConfirmed: boolean;
  learnerConfirmed: boolean;
  creditsTransferred: boolean;
  notes?: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'USED' | 'ADJUSTMENT';
  amount: number;
  description: string;
  timestamp: string;
  relatedSessionId?: string;
}

export interface ReviewRecord {
  id: string;
  sessionId: string;
  reviewerId: string;
  reviewerName: string;
  reviewedUserId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface LearningPathTopic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface LearningPath {
  id: string;
  skillName: string;
  category: string;
  level: SkillLevel;
  description: string;
  topics: LearningPathTopic[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  skillName: string;
  title: string;
  difficulty: SkillLevel;
  questions: QuizQuestion[];
}

export interface PartnerCourse {
  id: string;
  organizationName: string;
  organizationLogo: string;
  title: string;
  category: string;
  level: SkillLevel;
  durationWeeks: number;
  description: string;
  modulesCount: number;
  enrolledLearnersCount: number;
  hasCertificate: boolean;
  isEnrolled?: boolean;
}

export interface CertificateRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  courseTitle: string;
  organizationName: string;
  issueDate: string;
  certificateCode: string;
  verificationUrl: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  details: string;
  timestamp: string;
}

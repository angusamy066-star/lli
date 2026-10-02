import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PartnerCourse, LearningPath, Quiz, CertificateRecord } from '../types';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Sparkles,
  QrCode,
  GraduationCap
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const {
    partnerCourses,
    learningPaths,
    quizzes,
    certificates,
    enrollInCourse,
    issueCourseCertificate,
    toggleTopicCompletion,
    submitQuizResult,
    user
  } = useApp();

  const [activeSection, setActiveSection] = useState<'courses' | 'paths' | 'quizzes' | 'certs'>('courses');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Active quiz object
  const currentQuiz = quizzes.find((q) => q.id === activeQuizId);

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    let score = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    submitQuizResult(currentQuiz.id, score, currentQuiz.questions.length);
  };

  const resetQuizState = (quizId: string) => {
    setActiveQuizId(quizId);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Curriculum & SkillProof
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Partner Courses & Structured Learning Paths
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Official partner-provided syllabi, structured step-by-step learning progression, and skill assessments to level up your SkillProof.
            </p>
          </div>
        </div>

        {/* Section switcher */}
        <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1 max-w-xl mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveSection('courses')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSection === 'courses' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Partner Courses ({partnerCourses.length})
          </button>
          <button
            onClick={() => setActiveSection('paths')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSection === 'paths' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Learning Paths ({learningPaths.length})
          </button>
          <button
            onClick={() => setActiveSection('quizzes')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSection === 'quizzes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveSection('certs')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeSection === 'certs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificates ({certificates.length})
          </button>
        </div>

        {/* 1. Partner Courses Grid */}
        {activeSection === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
                    <span className="text-base">{course.organizationLogo}</span>
                    <span>{course.organizationName}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{course.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    <div>
                      <span className="text-slate-400 block">Duration</span>
                      <span className="font-semibold text-slate-700">{course.durationWeeks} Weeks</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Syllabus</span>
                      <span className="font-semibold text-slate-700">{course.modulesCount} Modules</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Target Level</span>
                      <span className="font-semibold text-slate-700">{course.level}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Enrolled</span>
                      <span className="font-semibold text-slate-700">{course.enrolledLearnersCount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {course.isEnrolled ? (
                    <button
                      onClick={() => issueCourseCertificate(course.id)}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Complete & Claim Certificate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Enroll in Course
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Structured Learning Paths */}
        {activeSection === 'paths' && (
          <div className="space-y-6">
            {learningPaths.map((path) => {
              const completedCount = path.topics.filter((t) => t.completed).length;
              const progressPct = Math.round((completedCount / path.topics.length) * 100);

              return (
                <div key={path.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          {path.category} · {path.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{path.skillName} Mastery Path</h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">{path.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500">Progress</span>
                      <div className="text-lg font-extrabold text-indigo-600 tabular-nums">
                        {progressPct}%
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {completedCount} of {path.topics.length} topics completed
                      </span>
                    </div>
                  </div>

                  {/* Topics Checklist */}
                  <div className="mt-4 space-y-2.5">
                    {path.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopicCompletion(path.id, topic.id)}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          topic.completed
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              topic.completed ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          />
                          <div>
                            <span className="font-semibold block">{topic.title}</span>
                            <span className="text-[11px] text-slate-500">{topic.description}</span>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
                          {topic.estimatedMinutes} mins
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Skill Assessment Quizzes */}
        {activeSection === 'quizzes' && (
          <div>
            {!activeQuizId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                      {quiz.skillName} · {quiz.difficulty} Assessment
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{quiz.title}</h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Pass this {quiz.questions.length}-question assessment with 60% or higher to upgrade your SkillProof status from Self Claimed to AI Assessed.
                    </p>
                    <button
                      onClick={() => resetQuizState(quiz.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            ) : currentQuiz ? (
              /* Quiz Runner */
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                      {currentQuiz.skillName} Assessment
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{currentQuiz.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveQuizId(null)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Back to Quizzes
                  </button>
                </div>

                <div className="space-y-6">
                  {currentQuiz.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-3">
                        {qIdx + 1}. {q.question}
                      </span>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;

                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                          if (isSelected) btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                            else if (isSelected && !isCorrect) btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="mt-2.5 p-2 rounded bg-indigo-50 text-[11px] text-indigo-900 leading-relaxed">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  {quizSubmitted ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">
                        Score: {quizScore} / {currentQuiz.questions.length} ({Math.round((quizScore / currentQuiz.questions.length) * 100)}%)
                      </span>
                      <button
                        onClick={() => resetQuizState(currentQuiz.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs ml-auto"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 4. Issued Certificates */}
        {activeSection === 'certs' && (
          <div>
            {certificates.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No partner certificates yet.</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Complete partner courses and assessments to earn verifiable credentials on LearnX.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      Verified
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-6 h-6 text-indigo-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cert.courseTitle}</h4>
                        <span className="text-xs text-slate-500">{cert.organizationName}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-4 font-mono">
                      <div>Learner: {cert.learnerName}</div>
                      <div>Issued: {cert.issueDate}</div>
                      <div className="text-indigo-600 font-bold">ID: {cert.certificateCode}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Publicly Verifiable</span>
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">QR Validated</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

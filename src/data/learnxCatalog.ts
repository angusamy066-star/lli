import { LearningPath, Quiz, PartnerCourse, UserProfile } from '../types';

export const SKILL_CATALOGUE = {
  Technical: [
    'Python',
    'Java',
    'JavaScript',
    'Web Development',
    'AI & Machine Learning',
    'Data Science',
    'Cloud Architecture',
    'Cybersecurity',
    'Excel & Analytics'
  ],
  Communication: [
    'English',
    'Tamil',
    'Hindi',
    'Public Speaking',
    'Professional Communication'
  ],
  Career: [
    'Resume Building',
    'Tech Interview Prep',
    'Presentation Skills',
    'Engineering Leadership'
  ],
  Creative: [
    'Graphic Design',
    'Video Editing',
    'Photography',
    'Music & Audio Production',
    'Figma & UI/UX'
  ],
  Academic: [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science Foundations'
  ],
  Other: [
    'Cooking & Nutrition',
    'Digital Literacy',
    'Personal Finance'
  ]
};

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-python-beg',
    skillName: 'Python',
    category: 'Technical',
    level: 'Beginner',
    description: 'Master fundamentals of Python programming from variables to writing working scripts and data parsers.',
    topics: [
      { id: 'p1', title: '01. Variables & Primitive Data Types', description: 'Numbers, Strings, Booleans and dynamic typing rules.', estimatedMinutes: 45, completed: false },
      { id: 'p2', title: '02. Control Flow & Conditions', description: 'if, elif, else branches and Boolean comparison operators.', estimatedMinutes: 40, completed: false },
      { id: 'p3', title: '03. Loops & Iterations', description: 'for loops, while loops, range() generator, and list iterations.', estimatedMinutes: 50, completed: false },
      { id: 'p4', title: '04. Functions & Scope', description: 'Defining def functions, arguments, return statements, and local/global scope.', estimatedMinutes: 60, completed: false },
      { id: 'p5', title: '05. Collections (Lists, Dicts, Sets)', description: 'Working with structured collections, key-value lookups, and mutations.', estimatedMinutes: 60, completed: false },
      { id: 'p6', title: '06. Capstone Project: Command-Line Task Engine', description: 'Build an interactive console program applying all learned patterns.', estimatedMinutes: 90, completed: false }
    ]
  },
  {
    id: 'path-java-beg',
    skillName: 'Java',
    category: 'Technical',
    level: 'Beginner',
    description: 'Object-oriented programming principles, classes, memory management, and OOP architectures in Java.',
    topics: [
      { id: 'j1', title: '01. JVM Architecture & First Class', description: 'Understanding bytecode, main method, compilation, and types.', estimatedMinutes: 50, completed: false },
      { id: 'j2', title: '02. Object-Oriented Principles: Classes & Objects', description: 'Constructors, instance variables, methods, and encapsulation.', estimatedMinutes: 60, completed: false },
      { id: 'j3', title: '03. Inheritance & Polymorphism', description: 'extends, implements, method overriding, and runtime dispatch.', estimatedMinutes: 75, completed: false },
      { id: 'j4', title: '04. Java Collections Framework', description: 'ArrayList, HashMap, HashSet, and Iterator interfaces.', estimatedMinutes: 65, completed: false }
    ]
  },
  {
    id: 'path-english-comm',
    skillName: 'English',
    category: 'Communication',
    level: 'Elementary',
    description: 'Fluency in technical discussions, agile standup reporting, and professional email correspondence.',
    topics: [
      { id: 'e1', title: '01. Daily Standup & Work Status Delivery', description: 'Clear sentence structures for yesterday, today, and blockers.', estimatedMinutes: 30, completed: false },
      { id: 'e2', title: '02. Expressing Opinions & Polite Disagreement', description: 'Constructive workplace phrasing and nuance.', estimatedMinutes: 45, completed: false },
      { id: 'e3', title: '03. Technical Explanations & Asking Clarifications', description: 'Demystifying architectural ideas without stutter.', estimatedMinutes: 50, completed: false }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-python-101',
    skillName: 'Python',
    title: 'Python Fundamentals & Data Structures',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'q1',
        question: 'Which of the following creates an immutable sequence of elements in Python?',
        options: ['list = [1, 2, 3]', 'tuple = (1, 2, 3)', 'dict = {1: 2}', 'set = {1, 2, 3}'],
        correctIndex: 1,
        explanation: 'Tuples are defined with parentheses and are immutable once created in Python.'
      },
      {
        id: 'q2',
        question: 'What is the output of `bool([])` in Python?',
        options: ['True', 'False', 'TypeError', 'None'],
        correctIndex: 1,
        explanation: 'In Python, empty collections (empty lists, empty strings, empty dicts) evaluate to falsy values.'
      },
      {
        id: 'q3',
        question: 'What keyword is used to handle exceptions in Python?',
        options: ['catch', 'rescue', 'except', 'handle'],
        correctIndex: 2,
        explanation: 'Python uses the `try ... except ... finally` block construct for error handling.'
      }
    ]
  },
  {
    id: 'quiz-java-101',
    skillName: 'Java',
    title: 'Java OOP Foundations Assessment',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'jq1',
        question: 'Which keyword prevents a class from being subclassed in Java?',
        options: ['static', 'abstract', 'final', 'immutable'],
        correctIndex: 2,
        explanation: 'The `final` keyword applied to a class declaration prevents any class from extending it.'
      },
      {
        id: 'jq2',
        question: 'Where are objects allocated in Java memory runtime?',
        options: ['Stack memory', 'Heap memory', 'Register memory', 'Classloader table'],
        correctIndex: 1,
        explanation: 'All object instances in Java are dynamically allocated on the Heap.'
      }
    ]
  }
];

export const INITIAL_PARTNER_COURSES: PartnerCourse[] = [
  {
    id: 'course-gcp-cloud',
    organizationName: 'Cloud Engineering Alliance',
    organizationLogo: '☁️',
    title: 'Distributed Cloud Architecture & Microservices',
    category: 'Technical',
    level: 'Intermediate',
    durationWeeks: 4,
    description: 'Official partner syllabus covering containerized deployments, Kubernetes orchestration, and resilient cloud storage systems.',
    modulesCount: 6,
    enrolledLearnersCount: 342,
    hasCertificate: true,
    isEnrolled: false
  },
  {
    id: 'course-open-web',
    organizationName: 'Mozilla Open Web Guild',
    organizationLogo: '🌐',
    title: 'Accessible Web Systems & Modern Standards',
    category: 'Technical',
    level: 'Beginner',
    durationWeeks: 3,
    description: 'In-depth accessibility guidelines (WCAG 2.2 AA), semantic markup, high-performance DOM architecture, and security headers.',
    modulesCount: 5,
    enrolledLearnersCount: 518,
    hasCertificate: true,
    isEnrolled: false
  },
  {
    id: 'course-tech-comm',
    organizationName: 'Global Leadership Institute',
    organizationLogo: '🎙️',
    title: 'Executive Communication for Engineers',
    category: 'Career',
    level: 'Intermediate',
    durationWeeks: 2,
    description: 'Translating complex system metrics into executive business roadmaps, board presentations, and team mentorship frameworks.',
    modulesCount: 4,
    enrolledLearnersCount: 220,
    hasCertificate: true,
    isEnrolled: false
  }
];

export const REGISTERED_COMMUNITY_MEMBERS: UserProfile[] = [
  {
    id: 'usr-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@learnx.org',
    avatar: '/src/assets/images/avatar_elena_mentor_1790921198840.jpg',
    bio: 'Senior Python & ML Engineer. Passionate about algorithms, clean code architecture, and mentoring emerging developers.',
    language: 'English',
    educationWorkStatus: 'Staff Software Engineer',
    mode: 'TEACH',
    canTeach: [
      {
        id: 'sk-elena-1',
        name: 'Python',
        category: 'Technical',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 12
      },
      {
        id: 'sk-elena-2',
        name: 'AI & Machine Learning',
        category: 'Technical',
        level: 'Intermediate',
        proof: 'Peer Verified',
        verifiedSessionsCount: 6
      }
    ],
    wantsToLearn: [
      {
        id: 'sk-elena-learn-1',
        name: 'Public Speaking',
        category: 'Communication',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      },
      {
        id: 'sk-elena-learn-2',
        name: 'Figma & UI/UX',
        category: 'Creative',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      }
    ],
    learningGoals: ['Improve conference keynote delivery', 'Design intuitive interfaces for machine learning tools'],
    availabilityDays: ['Monday', 'Wednesday', 'Saturday'],
    availabilityTime: 'Evenings (6:00 PM - 9:00 PM)',
    learningStyle: 'Hands-on / Practical',
    timeCredits: 12,
    sessionsCompleted: 16,
    teachingHours: 14,
    learningHours: 2,
    ratingAverage: 4.95,
    ratingsCount: 14,
    trustScore: 98,
    reliabilityStatus: 'Exceptional',
    achievements: ['Top Rated Mentor', 'Python Pioneer', '10+ Verified Sessions'],
    isAdmin: false,
    memberSince: 'January 2026',
    isOnline: true
  },
  {
    id: 'usr-marcus',
    name: 'Marcus Vance',
    email: 'marcus.vance@learnx.org',
    avatar: '/src/assets/images/avatar_marcus_mentor_1790921212941.jpg',
    bio: 'Fullstack web specialist specializing in React, TypeScript, and microservice cloud infrastructure. Excited to exchange knowledge!',
    language: 'English',
    educationWorkStatus: 'Solutions Architect',
    mode: 'TEACH',
    canTeach: [
      {
        id: 'sk-marcus-1',
        name: 'Web Development',
        category: 'Technical',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 10
      },
      {
        id: 'sk-marcus-2',
        name: 'JavaScript',
        category: 'Technical',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 8
      },
      {
        id: 'sk-marcus-3',
        name: 'Cloud Architecture',
        category: 'Technical',
        level: 'Intermediate',
        proof: 'AI Assessed',
        verifiedSessionsCount: 4
      }
    ],
    wantsToLearn: [
      {
        id: 'sk-marcus-learn-1',
        name: 'Python',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      },
      {
        id: 'sk-marcus-learn-2',
        name: 'Data Science',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      }
    ],
    learningGoals: ['Build automated data parsing pipelines in Python'],
    availabilityDays: ['Tuesday', 'Thursday', 'Sunday'],
    availabilityTime: 'Afternoons (2:00 PM - 6:00 PM)',
    learningStyle: 'Hands-on / Practical',
    timeCredits: 8,
    sessionsCompleted: 11,
    teachingHours: 9,
    learningHours: 2,
    ratingAverage: 4.88,
    ratingsCount: 9,
    trustScore: 95,
    reliabilityStatus: 'Exceptional',
    achievements: ['Code Architect', 'Community Pillar'],
    isAdmin: false,
    memberSince: 'February 2026',
    isOnline: true
  },
  {
    id: 'usr-priya',
    name: 'Priya Patel',
    email: 'priya.patel@learnx.org',
    avatar: '/src/assets/images/avatar_priya_mentor_1790921226019.jpg',
    bio: 'Product Designer & Design Systems lead. I help developers master typography, wireframing, and Figma component libraries.',
    language: 'English',
    educationWorkStatus: 'Lead Product Designer',
    mode: 'TEACH',
    canTeach: [
      {
        id: 'sk-priya-1',
        name: 'Figma & UI/UX',
        category: 'Creative',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 8
      },
      {
        id: 'sk-priya-2',
        name: 'Professional Communication',
        category: 'Communication',
        level: 'Intermediate',
        proof: 'Peer Verified',
        verifiedSessionsCount: 5
      }
    ],
    wantsToLearn: [
      {
        id: 'sk-priya-learn-1',
        name: 'Web Development',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      },
      {
        id: 'sk-priya-learn-2',
        name: 'JavaScript',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      }
    ],
    learningGoals: ['Implement interactive frontend UI prototypes with JavaScript'],
    availabilityDays: ['Monday', 'Friday', 'Saturday'],
    availabilityTime: 'Mornings (9:00 AM - 12:00 PM)',
    learningStyle: 'Visual / Diagrammatic',
    timeCredits: 7,
    sessionsCompleted: 9,
    teachingHours: 7,
    learningHours: 2,
    ratingAverage: 4.92,
    ratingsCount: 8,
    trustScore: 96,
    reliabilityStatus: 'Exceptional',
    achievements: ['Design Maestro', 'Top Reviewer'],
    isAdmin: false,
    memberSince: 'March 2026',
    isOnline: true
  },
  {
    id: 'usr-kenji',
    name: 'Kenji Sato',
    email: 'kenji.sato@learnx.org',
    avatar: '/src/assets/images/avatar_kenji_quant_1790921280361.jpg',
    bio: 'Data analyst and finance professional. Expertise in advanced spreadsheet modeling, metrics analytics, and data-informed decision making.',
    language: 'English',
    educationWorkStatus: 'Senior Financial Analyst',
    mode: 'TEACH',
    canTeach: [
      {
        id: 'sk-kenji-1',
        name: 'Excel & Analytics',
        category: 'Technical',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 6
      },
      {
        id: 'sk-kenji-2',
        name: 'Personal Finance',
        category: 'Other',
        level: 'Intermediate',
        proof: 'AI Assessed',
        verifiedSessionsCount: 3
      }
    ],
    wantsToLearn: [
      {
        id: 'sk-kenji-learn-1',
        name: 'Python',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      },
      {
        id: 'sk-kenji-learn-2',
        name: 'AI & Machine Learning',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      }
    ],
    learningGoals: ['Automate quantitative financial modeling with Python data libraries'],
    availabilityDays: ['Wednesday', 'Thursday', 'Sunday'],
    availabilityTime: 'Flexible',
    learningStyle: 'Theory & Deep-Dive',
    timeCredits: 6,
    sessionsCompleted: 7,
    teachingHours: 6,
    learningHours: 1,
    ratingAverage: 4.82,
    ratingsCount: 6,
    trustScore: 93,
    reliabilityStatus: 'Reliable',
    achievements: ['Analytical Master'],
    isAdmin: false,
    memberSince: 'March 2026',
    isOnline: false
  },
  {
    id: 'usr-chloe',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@learnx.org',
    avatar: '/src/assets/images/avatar_chloe_pitch_1790921292416.jpg',
    bio: 'Tech founder and pitch coach. Mentoring engineers and founders in technical interview performance, resume clarity, and live presentations.',
    language: 'English',
    educationWorkStatus: 'Startup Founder & Advisor',
    mode: 'TEACH',
    canTeach: [
      {
        id: 'sk-chloe-1',
        name: 'Tech Interview Prep',
        category: 'Career',
        level: 'Advanced',
        proof: 'Peer Verified',
        verifiedSessionsCount: 5
      },
      {
        id: 'sk-chloe-2',
        name: 'Public Speaking',
        category: 'Communication',
        level: 'Intermediate',
        proof: 'Peer Verified',
        verifiedSessionsCount: 4
      }
    ],
    wantsToLearn: [
      {
        id: 'sk-chloe-learn-1',
        name: 'Cloud Architecture',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      },
      {
        id: 'sk-chloe-learn-2',
        name: 'Cybersecurity',
        category: 'Technical',
        level: 'Beginner',
        proof: 'Self Claimed',
        verifiedSessionsCount: 0
      }
    ],
    learningGoals: ['Understand high-level microservice reliability and security protocols'],
    availabilityDays: ['Tuesday', 'Saturday'],
    availabilityTime: 'Mornings (10:00 AM - 1:00 PM)',
    learningStyle: 'Conversational / Discussion',
    timeCredits: 5,
    sessionsCompleted: 6,
    teachingHours: 5,
    learningHours: 1,
    ratingAverage: 4.9,
    ratingsCount: 5,
    trustScore: 95,
    reliabilityStatus: 'Reliable',
    achievements: ['Pitch Master', 'Career Catalyst'],
    isAdmin: false,
    memberSince: 'April 2026',
    isOnline: true
  }
];


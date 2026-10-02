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

export const REGISTERED_COMMUNITY_MEMBERS: UserProfile[] = [];


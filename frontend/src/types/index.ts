export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  tests: TestCase[];
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  challenges: Challenge[];
  quizzes: Quiz[];
  progress: number; // 0-100
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedChallenges: string[];
  completedQuizzes: string[];
  currentCourse: string;
  totalProgress: number;
}

export interface InteractiveDiagram {
  id: string;
  title: string;
  description: string;
  type: 'props-vs-context' | 'state-updates' | 'concurrent-rendering' | 'custom-hooks';
  interactive: boolean;
}


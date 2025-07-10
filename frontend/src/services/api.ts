const API_BASE_URL = 'https://w5hni7c703g1.manus.space';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  orderIndex: number;
  createdAt: string;
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
  createdAt: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
}

export interface TestResult {
  passed: boolean;
  description: string;
  input?: any;
  expected?: any;
  actual?: any;
  error?: string;
}

export interface SubmissionResult {
  submissionId: number;
  passed: boolean;
  testResults: TestResult[];
  message: string;
}

export interface UserProgress {
  id: number;
  userId: string;
  lessonId: string;
  completed: boolean;
  progressPercentage: number;
  completedAt: string | null;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Lesson endpoints
  async getLessons(): Promise<Lesson[]> {
    return this.request<Lesson[]>('/lessons');
  }

  async getLesson(lessonId: string): Promise<Lesson> {
    return this.request<Lesson>(`/lessons/${lessonId}`);
  }

  async updateLessonProgress(data: {
    lessonId: string;
    userId: string;
    progressPercentage: number;
    completed: boolean;
  }): Promise<UserProgress> {
    return this.request<UserProgress>('/lessons/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.request<UserProgress[]>(`/users/${userId}/progress`);
  }

  async getUserProgressSummary(userId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    averageProgress: number;
    completionRate: number;
  }> {
    return this.request(`/users/${userId}/progress/summary`);
  }

  // Challenge endpoints
  async getChallenges(): Promise<Challenge[]> {
    return this.request<Challenge[]>('/challenges');
  }

  async getChallenge(challengeId: string): Promise<Challenge> {
    return this.request<Challenge>(`/challenges/${challengeId}`);
  }

  async submitChallenge(challengeId: string, data: {
    code: string;
    userId: string;
  }): Promise<SubmissionResult> {
    return this.request<SubmissionResult>(`/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChallengeSubmissions(challengeId: string, userId: string): Promise<any[]> {
    return this.request<any[]>(`/challenges/${challengeId}/submissions?userId=${userId}`);
  }

  // Create new lesson (admin function)
  async createLesson(lesson: Omit<Lesson, 'createdAt'>): Promise<Lesson> {
    return this.request<Lesson>('/lessons', {
      method: 'POST',
      body: JSON.stringify(lesson),
    });
  }

  // Create new challenge (admin function)
  async createChallenge(challenge: Omit<Challenge, 'createdAt'>): Promise<Challenge> {
    return this.request<Challenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(challenge),
    });
  }
}

export const apiService = new ApiService();


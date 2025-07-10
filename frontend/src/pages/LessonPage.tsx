import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Target } from 'lucide-react';
import { LessonContent } from '../components/Lesson/LessonContent';
import { Quiz } from '../components/Quiz/Quiz';
import { PropsVsState } from '../components/InteractiveDiagram/PropsVsState';
import { Button } from '../components/UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { apiService, type Lesson } from '../services/api';
import { cn } from '../utils/cn';

// Sample quiz data for Props & State lesson
const propsStateQuiz = [
  {
    id: 'q1',
    question: 'What are props in React?',
    options: [
      'Data that can be modified by child components',
      'Data passed from parent to child components',
      'Internal component state',
      'CSS properties for styling'
    ],
    correctAnswer: 1,
    explanation: 'Props are data passed from parent components to child components. They are read-only and cannot be modified by the child.',
    difficulty: 'easy' as const
  },
  {
    id: 'q2',
    question: 'Which hook is used to manage state in functional components?',
    options: [
      'useEffect',
      'useContext',
      'useState',
      'useReducer'
    ],
    correctAnswer: 2,
    explanation: 'useState is the primary hook for managing state in functional components.',
    difficulty: 'easy' as const
  },
  {
    id: 'q3',
    question: 'What happens when state changes in a React component?',
    options: [
      'Nothing happens',
      'The component re-renders',
      'The entire page refreshes',
      'Only the state variable updates'
    ],
    correctAnswer: 1,
    explanation: 'When state changes, React automatically re-renders the component to reflect the new data.',
    difficulty: 'medium' as const
  }
];

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'lesson' | 'diagram' | 'quiz'>('lesson');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return;
      
      try {
        setLoading(true);
        const lessonData = await apiService.getLesson(lessonId);
        setLesson(lessonData);
        setProgress(33); // Start with some progress
      } catch (err) {
        setError('Failed to load lesson. Please try again.');
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  const handleNext = () => {
    if (currentSection === 'lesson') {
      setCurrentSection('diagram');
      setProgress(66);
    } else if (currentSection === 'diagram') {
      setCurrentSection('quiz');
      setProgress(90);
    } else {
      // Complete lesson
      handleLessonComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'quiz') {
      setCurrentSection('diagram');
      setProgress(66);
    } else if (currentSection === 'diagram') {
      setCurrentSection('lesson');
      setProgress(33);
    }
  };

  const handleLessonComplete = async () => {
    if (!lessonId) return;
    
    try {
      await apiService.updateLessonProgress({
        lessonId,
        userId: 'anonymous',
        progressPercentage: 100,
        completed: true
      });
      setProgress(100);
      // Navigate to next lesson or challenges
      navigate('/challenges');
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    console.log(`Quiz completed with ${percentage}% score`);
    setProgress(100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Lesson
              </h2>
              <p className="text-red-600 mb-4">
                {error || 'Lesson not found'}
              </p>
              <Button onClick={() => navigate('/lessons')}>
                Back to Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/lessons')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lessons</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Lesson</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{lesson.duration} min</span>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getDifficultyColor(lesson.difficulty)
          )}>
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Lesson Progress</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentSection('lesson')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                currentSection === 'lesson'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              1. Lesson Content
            </button>
            <button
              onClick={() => setCurrentSection('diagram')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                currentSection === 'diagram'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              2. Interactive Demo
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                currentSection === 'quiz'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              3. Quiz
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      {currentSection === 'lesson' && (
        <LessonContent
          title={lesson.title}
          description={lesson.description}
          duration={lesson.duration}
          difficulty={lesson.difficulty}
          progress={progress}
          content={lesson.content}
          onNext={handleNext}
          onPrevious={currentSection !== 'lesson' ? handlePrevious : undefined}
        />
      )}

      {currentSection === 'diagram' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demonstration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Explore the concepts you just learned with this interactive demonstration.
              </p>
            </CardContent>
          </Card>
          
          <PropsVsState />
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Lesson
            </Button>
            <Button onClick={handleNext}>
              Next: Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentSection === 'quiz' && (
        <div className="space-y-6">
          <Quiz
            questions={propsStateQuiz}
            title="Props & State Quiz"
            onComplete={handleQuizComplete}
          />
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Demo
            </Button>
            <Button onClick={handleLessonComplete}>
              Complete Lesson
              <Target className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


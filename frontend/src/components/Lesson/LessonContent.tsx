import React from 'react';
import { Clock, BookOpen, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/ProgressBar';
import { cn } from '../../utils/cn';

interface LessonContentProps {
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  content: string;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  title,
  description,
  duration,
  difficulty,
  progress,
  content,
  onNext,
  onPrevious,
  className
}) => {
  const difficultyColors = {
    beginner: 'text-green-600 bg-green-100',
    intermediate: 'text-yellow-600 bg-yellow-100',
    advanced: 'text-red-600 bg-red-100'
  };

  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      {/* Lesson Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <p className="text-gray-600 mb-4">{description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration} min</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    difficultyColors[difficulty]
                  )}>
                    {difficulty}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson 3 of 10</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ProgressBar 
            progress={progress} 
            showLabel 
            className="mb-4"
          />
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card className="mb-6">
        <CardContent>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!onPrevious}
        >
          Previous Lesson
        </Button>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            Save Progress
          </Button>
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={!onNext}
          >
            Next: Interactive Challenge
          </Button>
        </div>
      </div>
    </div>
  );
};


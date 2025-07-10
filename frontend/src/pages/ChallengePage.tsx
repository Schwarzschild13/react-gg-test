import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor/CodeEditor';
import { Button } from '../components/UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { apiService, type Challenge, type SubmissionResult } from '../services/api';
import { cn } from '../utils/cn';

export const ChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId) return;
      
      try {
        setLoading(true);
        const challengeData = await apiService.getChallenge(challengeId);
        setChallenge(challengeData);
      } catch (err) {
        setError('Failed to load challenge. Please try again.');
        console.error('Error loading challenge:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

  const handleSubmit = async (code: string): Promise<SubmissionResult> => {
    if (!challengeId) {
      throw new Error('Challenge ID not found');
    }

    try {
      const result = await apiService.submitChallenge(challengeId, {
        code,
        userId: 'anonymous' // In a real app, this would come from auth context
      });
      return result;
    } catch (error) {
      console.error('Error submitting challenge:', error);
      throw new Error('Failed to submit challenge. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
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

  if (error || !challenge) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Challenge
              </h2>
              <p className="text-red-600 mb-4">
                {error || 'Challenge not found'}
              </p>
              <Button onClick={() => navigate('/challenges')}>
                Back to Challenges
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
          onClick={() => navigate('/challenges')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Challenge</span>
          </div>
        </div>
      </div>

      {/* Challenge Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl">{challenge.title}</span>
            <div className="flex items-center space-x-3">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                getDifficultyColor(challenge.difficulty)
              )}>
                {challenge.difficulty}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{challenge.description}</p>
          
          {challenge.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Editor */}
      <CodeEditor
        title={challenge.title}
        description={challenge.description}
        starterCode={challenge.starterCode}
        hints={challenge.hints}
        onSubmit={handleSubmit}
      />
    </div>
  );
};


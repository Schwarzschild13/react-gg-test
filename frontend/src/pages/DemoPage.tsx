import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor/CodeEditor';
import { Quiz } from '../components/Quiz/Quiz';
import { PropsVsState } from '../components/InteractiveDiagram/PropsVsState';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

// Sample challenge data
const sampleChallenge = {
  id: 'demo-props',
  title: 'Props Demo Challenge',
  description: 'Create a component that displays user information using props.',
  starterCode: `// Create a UserCard component that displays user information
function UserCard(props) {
  // Your code here
  return (
    <div>
      {/* Display the user's name and email */}
    </div>
  );
}

// Export the component
export default UserCard;`,
  hints: [
    'Remember to access props using props.propertyName',
    'Use JSX to display the values inside HTML elements',
    'Make sure to return the JSX from your component function'
  ]
};

// Sample quiz data
const sampleQuiz = [
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
  }
];

export const DemoPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'editor' | 'quiz' | 'diagram'>('editor');

  const handleSubmit = async (code: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock test results
    const testResults = [
      {
        passed: code.includes('props.name'),
        description: 'Component should display user name',
        input: { name: 'John Doe', email: 'john@example.com' },
        expected: 'true',
        actual: code.includes('props.name') ? 'true' : 'false'
      },
      {
        passed: code.includes('props.email'),
        description: 'Component should display user email',
        input: { name: 'Jane Smith', email: 'jane@example.com' },
        expected: 'true',
        actual: code.includes('props.email') ? 'true' : 'false'
      }
    ];

    const passed = testResults.every(test => test.passed);
    
    return {
      passed,
      testResults,
      message: passed 
        ? 'Great job! Your component correctly displays user information using props.' 
        : 'Keep trying! Make sure to access both props.name and props.email in your component.'
    };
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    console.log(`Quiz completed with ${percentage}% score`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Explore the interactive components that make up the React learning platform.
          </p>
          <div className="flex space-x-4">
            <Button
              variant={activeDemo === 'editor' ? 'primary' : 'outline'}
              onClick={() => setActiveDemo('editor')}
            >
              Code Editor
            </Button>
            <Button
              variant={activeDemo === 'quiz' ? 'primary' : 'outline'}
              onClick={() => setActiveDemo('quiz')}
            >
              Quiz Component
            </Button>
            <Button
              variant={activeDemo === 'diagram' ? 'primary' : 'outline'}
              onClick={() => setActiveDemo('diagram')}
            >
              Interactive Diagram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Content */}
      {activeDemo === 'editor' && (
        <CodeEditor
          title={sampleChallenge.title}
          description={sampleChallenge.description}
          starterCode={sampleChallenge.starterCode}
          hints={sampleChallenge.hints}
          onSubmit={handleSubmit}
        />
      )}

      {activeDemo === 'quiz' && (
        <Quiz
          questions={sampleQuiz}
          title="Sample Quiz"
          onComplete={handleQuizComplete}
        />
      )}

      {activeDemo === 'diagram' && (
        <PropsVsState />
      )}
    </div>
  );
};


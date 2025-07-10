import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { cn } from '../../utils/cn';

interface TestResult {
  passed: boolean;
  description: string;
  input?: any;
  expected?: any;
  actual?: any;
  error?: string;
}

interface CodeEditorProps {
  title: string;
  description: string;
  starterCode: string;
  hints: string[];
  onSubmit?: (code: string) => Promise<{ passed: boolean; testResults: TestResult[]; message: string }>;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  description,
  starterCode,
  hints,
  onSubmit,
  className
}) => {
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);
  
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleReset = () => {
    setCode(starterCode);
    setTestResults([]);
    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    
    setIsRunning(true);
    setTestResults([]);
    setSubmissionResult(null);
    
    try {
      const result = await onSubmit(code);
      setTestResults(result.testResults);
      setSubmissionResult({
        passed: result.passed,
        message: result.message
      });
    } catch (error) {
      setSubmissionResult({
        passed: false,
        message: 'An error occurred while running your code. Please try again.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Challenge Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Hints ({hints.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{description}</p>
          
          {showHints && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">💡 Hints:</h4>
              <ul className="space-y-1">
                {hints.map((hint, index) => (
                  <li key={index} className="text-yellow-700 text-sm">
                    {index + 1}. {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Code Editor</span>
            <Button
              onClick={handleSubmit}
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Test Results</span>
              <span className={cn(
                "text-sm px-2 py-1 rounded-full",
                passedTests === totalTests 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              )}>
                {passedTests}/{totalTests} passed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border",
                    test.passed 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {test.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      test.passed ? "text-green-800" : "text-red-800"
                    )}>
                      {test.description}
                    </p>
                    {test.error && (
                      <p className="text-red-600 text-sm mt-1">{test.error}</p>
                    )}
                    {test.input && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Input:</span> {JSON.stringify(test.input)}
                      </div>
                    )}
                    {test.expected && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Expected:</span> {JSON.stringify(test.expected)}
                      </div>
                    )}
                    {test.actual && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Actual:</span> {JSON.stringify(test.actual)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Result */}
      {submissionResult && (
        <Card className={cn(
          "border-2",
          submissionResult.passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              {submissionResult.passed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  submissionResult.passed ? "text-green-800" : "text-red-800"
                )}>
                  {submissionResult.passed ? "Challenge Completed!" : "Keep Trying!"}
                </h3>
                <p className={cn(
                  "text-sm",
                  submissionResult.passed ? "text-green-700" : "text-red-700"
                )}>
                  {submissionResult.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


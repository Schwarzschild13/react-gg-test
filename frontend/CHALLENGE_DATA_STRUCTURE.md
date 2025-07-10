# Challenge Data Structure Documentation

## Overview

This document defines the comprehensive data structure for coding challenges in the React Learning Platform. The structure supports various challenge types, test cases, hints, and feedback mechanisms while maintaining flexibility for future enhancements.

## Core Challenge Schema

### Challenge Entity

```typescript
interface Challenge {
  id: string;                    // Unique identifier (e.g., "props-component")
  title: string;                 // Display title (e.g., "Create a Props Component")
  description: string;           // Detailed problem description
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;         // Estimated completion time in minutes
  topics: string[];              // Related topics (e.g., ["props", "components"])
  prerequisites: string[];       // Required prior knowledge/challenges
  
  // Code-related fields
  starterCode: string;           // Initial code template
  solutionCode: string;          // Reference solution (for instructors)
  language: 'javascript' | 'typescript' | 'jsx' | 'tsx';
  
  // Test and validation
  testCases: TestCase[];         // Array of test cases
  hints: Hint[];                 // Progressive hint system
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tags: string[];
  orderIndex: number;            // Position in curriculum
}
```

### Test Case Structure

```typescript
interface TestCase {
  id: string;                    // Unique test identifier
  name: string;                  // Descriptive test name
  description: string;           // What this test validates
  type: 'unit' | 'integration' | 'visual' | 'performance';
  
  // Test execution
  setup?: string;                // Setup code (runs before test)
  testCode: string;              // Actual test implementation
  cleanup?: string;              // Cleanup code (runs after test)
  
  // Expected results
  expectedOutput?: any;          // Expected return value
  expectedConsoleOutput?: string[]; // Expected console.log outputs
  shouldThrow?: boolean;         // Whether code should throw error
  expectedError?: string;        // Expected error message pattern
  
  // Validation criteria
  timeout: number;               // Max execution time (ms)
  memoryLimit?: number;          // Max memory usage (MB)
  
  // Feedback
  successMessage: string;        // Message when test passes
  failureMessage: string;        // Message when test fails
  hints: string[];               // Hints specific to this test
  
  // Metadata
  weight: number;                // Importance (1-10)
  isHidden: boolean;             // Whether visible to learners
  category: string;              // Test category for grouping
}
```

### Hint System Structure

```typescript
interface Hint {
  id: string;
  level: number;                 // Progressive hint level (1-5)
  trigger: HintTrigger;          // When to show this hint
  content: string;               // Hint text content
  codeExample?: string;          // Optional code example
  type: 'conceptual' | 'syntax' | 'debugging' | 'optimization';
  
  // Conditional display
  showAfter?: number;            // Show after X minutes
  showAfterAttempts?: number;    // Show after X failed attempts
  showOnError?: string;          // Show on specific error pattern
}

interface HintTrigger {
  type: 'time' | 'attempts' | 'error' | 'manual';
  condition: string;             // Specific trigger condition
  threshold?: number;            // Numeric threshold if applicable
}
```

## Sample Challenge Implementation

### Props Component Challenge

```json
{
  "id": "props-component",
  "title": "Create a UserCard Component with Props",
  "description": "Create a React component that displays user information using props. The component should accept name, age, and email as props and display them in a formatted card layout.",
  "difficulty": "beginner",
  "estimatedTime": 15,
  "topics": ["props", "components", "jsx"],
  "prerequisites": ["intro-to-react", "components-jsx"],
  
  "starterCode": "// Create a UserCard component that displays user information\n// The component should accept props: name, age, email\n\nfunction UserCard(props) {\n  // Your code here\n  return (\n    <div>\n      {/* Display the user's name and email */}\n    </div>\n  );\n}\n\n// Export the component\nexport default UserCard;",
  
  "solutionCode": "function UserCard(props) {\n  return (\n    <div className=\"user-card\">\n      <h2>Hello, {props.name}!</h2>\n      <p>Age: {props.age}</p>\n      <p>Email: {props.email}</p>\n    </div>\n  );\n}\n\nexport default UserCard;",
  
  "language": "jsx",
  
  "testCases": [
    {
      "id": "test-basic-rendering",
      "name": "Basic Component Rendering",
      "description": "Component renders without errors",
      "type": "unit",
      "testCode": "const { render } = require('@testing-library/react');\nconst UserCard = require('./UserCard');\n\ntest('renders without crashing', () => {\n  render(<UserCard name=\"John\" age={25} email=\"john@example.com\" />);\n});",
      "timeout": 5000,
      "successMessage": "Great! Your component renders successfully.",
      "failureMessage": "Component failed to render. Check your JSX syntax.",
      "hints": ["Make sure your component returns valid JSX", "Check for missing closing tags"],
      "weight": 3,
      "isHidden": false,
      "category": "basic"
    },
    {
      "id": "test-props-display",
      "name": "Props Display Test",
      "description": "Component displays all props correctly",
      "type": "unit",
      "testCode": "const { render, screen } = require('@testing-library/react');\nconst UserCard = require('./UserCard');\n\ntest('displays user props correctly', () => {\n  render(<UserCard name=\"Alice\" age={30} email=\"alice@test.com\" />);\n  \n  expect(screen.getByText(/Alice/)).toBeInTheDocument();\n  expect(screen.getByText(/30/)).toBeInTheDocument();\n  expect(screen.getByText(/alice@test.com/)).toBeInTheDocument();\n});",
      "timeout": 5000,
      "successMessage": "Perfect! Your component displays all props correctly.",
      "failureMessage": "Some props are not being displayed. Check your JSX.",
      "hints": ["Use {props.name} to display the name prop", "Make sure all props are included in the JSX"],
      "weight": 5,
      "isHidden": false,
      "category": "functionality"
    },
    {
      "id": "test-different-props",
      "name": "Different Props Test",
      "description": "Component works with different prop values",
      "type": "unit",
      "testCode": "const { render, screen } = require('@testing-library/react');\nconst UserCard = require('./UserCard');\n\ntest('works with different prop values', () => {\n  const { rerender } = render(<UserCard name=\"Bob\" age={45} email=\"bob@example.com\" />);\n  \n  expect(screen.getByText(/Bob/)).toBeInTheDocument();\n  \n  rerender(<UserCard name=\"Carol\" age={28} email=\"carol@test.org\" />);\n  \n  expect(screen.getByText(/Carol/)).toBeInTheDocument();\n  expect(screen.getByText(/28/)).toBeInTheDocument();\n});",
      "timeout": 5000,
      "successMessage": "Excellent! Your component handles different props correctly.",
      "failureMessage": "Component doesn't update properly with different props.",
      "hints": ["Props should be dynamic, not hardcoded", "Use the actual prop values in your JSX"],
      "weight": 4,
      "isHidden": false,
      "category": "functionality"
    }
  ],
  
  "hints": [
    {
      "id": "hint-props-access",
      "level": 1,
      "trigger": {
        "type": "time",
        "condition": "struggling",
        "threshold": 300
      },
      "content": "Remember that props are passed as the first parameter to your function component. You can access them using props.propertyName.",
      "type": "conceptual",
      "showAfter": 5
    },
    {
      "id": "hint-jsx-syntax",
      "level": 2,
      "trigger": {
        "type": "error",
        "condition": "syntax_error"
      },
      "content": "To display JavaScript values in JSX, wrap them in curly braces: {props.name}",
      "codeExample": "<h2>Hello, {props.name}!</h2>",
      "type": "syntax",
      "showOnError": "SyntaxError"
    },
    {
      "id": "hint-complete-solution",
      "level": 3,
      "trigger": {
        "type": "attempts",
        "condition": "multiple_failures",
        "threshold": 3
      },
      "content": "Your component should return a div containing elements that display each prop. Use JSX expressions like {props.name} to show the values.",
      "codeExample": "return (\n  <div>\n    <h2>{props.name}</h2>\n    <p>Age: {props.age}</p>\n  </div>\n);",
      "type": "debugging",
      "showAfterAttempts": 3
    }
  ],
  
  "createdAt": "2025-07-10T16:35:18.775051",
  "updatedAt": "2025-07-10T16:35:18.775051",
  "authorId": "system",
  "tags": ["react", "props", "beginner", "components"],
  "orderIndex": 1
}
```

## Test Execution Flow

### 1. Code Submission Process

```typescript
interface SubmissionRequest {
  challengeId: string;
  userCode: string;
  userId: string;
  sessionId: string;
}

interface SubmissionResponse {
  submissionId: string;
  status: 'success' | 'failure' | 'error';
  results: TestResult[];
  overallScore: number;
  feedback: string;
  hints: Hint[];
  executionTime: number;
  nextSteps?: string[];
}
```

### 2. Test Result Structure

```typescript
interface TestResult {
  testCaseId: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  message: string;
  actualOutput?: any;
  expectedOutput?: any;
  executionTime: number;
  memoryUsage?: number;
  errorDetails?: {
    type: string;
    message: string;
    stack?: string;
    line?: number;
    column?: number;
  };
}
```

### 3. Execution Environment

```typescript
interface ExecutionEnvironment {
  language: string;
  version: string;
  timeout: number;
  memoryLimit: number;
  allowedModules: string[];
  restrictedAPIs: string[];
  sandboxConfig: {
    networkAccess: boolean;
    fileSystemAccess: boolean;
    processAccess: boolean;
  };
}
```

## Feedback and Hint System

### Progressive Hint Delivery

The hint system provides progressive assistance based on user behavior:

1. **Level 1 (Gentle Nudge)**: General conceptual hints after 5 minutes
2. **Level 2 (Specific Guidance)**: Syntax or approach hints after failed attempts
3. **Level 3 (Detailed Help)**: Code examples after multiple failures
4. **Level 4 (Step-by-step)**: Detailed solution breakdown
5. **Level 5 (Solution)**: Complete solution with explanation

### Feedback Categories

- **Syntax Feedback**: Identifies and explains syntax errors
- **Logic Feedback**: Points out logical errors in implementation
- **Performance Feedback**: Suggests optimizations for slow code
- **Best Practices**: Recommends React best practices and patterns
- **Accessibility**: Highlights accessibility improvements

## Challenge Types and Variations

### 1. Component Creation Challenges
- Create functional components
- Implement class components (legacy)
- Build custom hooks
- Design compound components

### 2. Props and State Challenges
- Pass and use props
- Manage local state
- Lift state up
- Implement controlled components

### 3. Event Handling Challenges
- Handle user interactions
- Implement form submissions
- Manage keyboard events
- Create custom event handlers

### 4. Lifecycle and Effects Challenges
- Use useEffect hook
- Implement cleanup functions
- Handle dependencies
- Optimize re-renders

### 5. Advanced Pattern Challenges
- Implement render props
- Create higher-order components
- Use context API
- Build custom hooks

## Extensibility and Customization

### Custom Test Types

The system supports custom test types for specific learning objectives:

```typescript
interface CustomTestType {
  name: string;
  validator: (code: string, expected: any) => TestResult;
  description: string;
  examples: string[];
}
```

### Challenge Templates

Reusable templates for common challenge patterns:

```typescript
interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  starterCodeTemplate: string;
  testCaseTemplates: TestCaseTemplate[];
  variables: TemplateVariable[];
}
```

### Adaptive Difficulty

The system can adjust challenge difficulty based on user performance:

```typescript
interface AdaptiveDifficulty {
  baseChallenge: Challenge;
  variations: {
    easier: Partial<Challenge>;
    harder: Partial<Challenge>;
  };
  adaptationRules: AdaptationRule[];
}
```

## Integration with Learning Management

### Progress Tracking

```typescript
interface ChallengeProgress {
  challengeId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  attempts: number;
  bestScore: number;
  timeSpent: number;
  hintsUsed: string[];
  lastAttempt: Date;
  completedAt?: Date;
}
```

### Analytics and Insights

```typescript
interface ChallengeAnalytics {
  challengeId: string;
  completionRate: number;
  averageAttempts: number;
  averageTime: number;
  commonErrors: ErrorPattern[];
  hintEffectiveness: HintAnalytics[];
  difficultyRating: number;
}
```

This comprehensive data structure provides the foundation for a robust, scalable challenge system that can adapt to different learning styles and provide meaningful feedback to help learners master React concepts effectively.


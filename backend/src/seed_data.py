#!/usr/bin/env python3
"""
Seed script to populate the database with sample lessons and challenges
"""
import os
import sys
import json

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app, db
from src.models.lesson import Lesson
from src.models.challenge import Challenge

def seed_lessons():
    """Add sample lessons to the database"""
    lessons_data = [
        {
            'id': 'intro-to-react',
            'title': 'Introduction to React',
            'description': 'Learn the basics of React and why it\'s a powerful library for building user interfaces.',
            'content': '''
<h2>Welcome to React!</h2>
<p>React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Meta and the open-source community.</p>

<h3>What makes React special?</h3>
<ul>
<li><strong>Component-Based:</strong> Build encapsulated components that manage their own state</li>
<li><strong>Declarative:</strong> React makes it painless to create interactive UIs</li>
<li><strong>Learn Once, Write Anywhere:</strong> You can develop new features without rewriting existing code</li>
</ul>

<h3>Your First React Component</h3>
<pre><code>function Welcome() {
  return &lt;h1&gt;Hello, World!&lt;/h1&gt;;
}</code></pre>

<p>This simple function is a React component that returns JSX - a syntax extension for JavaScript that looks like HTML.</p>
            ''',
            'duration': 10,
            'difficulty': 'beginner',
            'prerequisites': [],
            'order_index': 1
        },
        {
            'id': 'components-jsx',
            'title': 'Components & JSX',
            'description': 'Understand React components and JSX syntax for building dynamic user interfaces.',
            'content': '''
<h2>React Components and JSX</h2>
<p>Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.</p>

<h3>Function Components</h3>
<pre><code>function Greeting(props) {
  return &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;
}</code></pre>

<h3>JSX Rules</h3>
<ul>
<li>JSX must return a single parent element</li>
<li>Use className instead of class</li>
<li>Close all tags, including self-closing ones</li>
<li>Use camelCase for attributes</li>
</ul>

<h3>Embedding Expressions</h3>
<pre><code>const name = 'React';
const element = &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;</code></pre>
            ''',
            'duration': 15,
            'difficulty': 'beginner',
            'prerequisites': ['intro-to-react'],
            'order_index': 2
        },
        {
            'id': 'props-state',
            'title': 'Props and State',
            'description': 'Learn the fundamental concepts of props and state in React, and understand how they work together to create dynamic components.',
            'content': '''
<h2>Understanding Props and State in React</h2>

<p>In this lesson, we'll explore two fundamental concepts in React: <strong>props</strong> and <strong>state</strong>. These are the building blocks that make React components dynamic and interactive.</p>

<h3>What are Props?</h3>

<p>Props (short for "properties") are a way to pass data from parent components to child components. Think of props as function arguments - they allow you to customize how a component behaves and what it displays.</p>

<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
  <p class="text-blue-800"><strong>Key Point:</strong> Props are read-only and cannot be modified by the child component.</p>
</div>

<h4>Example: Passing Props</h4>

<pre><code>// Parent Component
function App() {
  return (
    &lt;div&gt;
      &lt;Welcome name="Alice" age={25} /&gt;
      &lt;Welcome name="Bob" age={30} /&gt;
    &lt;/div&gt;
  );
}

// Child Component
function Welcome(props) {
  return (
    &lt;h1&gt;Hello, {props.name}! You are {props.age} years old.&lt;/h1&gt;
  );
}</code></pre>

<h3>What is State?</h3>

<p>State is a way to store and manage data that can change over time within a component. Unlike props, state is internal to the component and can be updated using the <code>useState</code> hook.</p>

<div class="bg-green-50 border-l-4 border-green-400 p-4 my-4">
  <p class="text-green-800"><strong>Remember:</strong> When state changes, React automatically re-renders the component to reflect the new data.</p>
</div>

<h4>Example: Using State</h4>

<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>Best Practices</h3>

<ul>
<li>Use props to pass data down the component tree</li>
<li>Use state for data that changes over time</li>
<li>Keep state as minimal as possible</li>
<li>Lift state up when multiple components need to share data</li>
<li>Use descriptive names for props and state variables</li>
</ul>
            ''',
            'duration': 15,
            'difficulty': 'beginner',
            'prerequisites': ['components-jsx'],
            'order_index': 3
        }
    ]
    
    for lesson_data in lessons_data:
        lesson = Lesson(
            id=lesson_data['id'],
            title=lesson_data['title'],
            description=lesson_data['description'],
            content=lesson_data['content'],
            duration=lesson_data['duration'],
            difficulty=lesson_data['difficulty'],
            prerequisites=json.dumps(lesson_data['prerequisites']),
            order_index=lesson_data['order_index']
        )
        db.session.add(lesson)
    
    db.session.commit()
    print(f"✅ Added {len(lessons_data)} lessons to the database")

def seed_challenges():
    """Add sample challenges to the database"""
    challenges_data = [
        {
            'id': 'props-basic',
            'title': 'Basic Props Challenge',
            'description': 'Create a component that accepts and displays props correctly.',
            'starter_code': '''// Create a UserCard component that displays user information
function UserCard(props) {
  // Your code here
  return (
    <div>
      {/* Display the user's name and email */}
    </div>
  );
}

// Export the component
export default UserCard;''',
            'solution': '''function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
}

export default UserCard;''',
            'tests': [
                {
                    'id': 'test-1',
                    'description': 'Component should display user name',
                    'input': '{ name: "John Doe", email: "john@example.com" }',
                    'expectedOutput': 'true'
                },
                {
                    'id': 'test-2',
                    'description': 'Component should display user email',
                    'input': '{ name: "Jane Smith", email: "jane@example.com" }',
                    'expectedOutput': 'true'
                }
            ],
            'hints': [
                'Remember to access props using props.propertyName',
                'Use JSX to display the values inside HTML elements',
                'Make sure to return the JSX from your component function'
            ],
            'difficulty': 'easy',
            'tags': ['props', 'components', 'jsx']
        },
        {
            'id': 'state-counter',
            'title': 'State Counter Challenge',
            'description': 'Build a counter component using React state.',
            'starter_code': '''import { useState } from 'react';

function Counter() {
  // Add state for the counter value
  
  // Add functions to increment and decrement
  
  return (
    <div>
      <h2>Count: {/* Display count here */}</h2>
      <button onClick={/* Add increment function */}>+</button>
      <button onClick={/* Add decrement function */}>-</button>
    </div>
  );
}

export default Counter;''',
            'solution': '''import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;''',
            'tests': [
                {
                    'id': 'test-1',
                    'description': 'Counter should start at 0',
                    'input': '{}',
                    'expectedOutput': '0'
                },
                {
                    'id': 'test-2',
                    'description': 'Counter should increment when + button is clicked',
                    'input': '{ action: "increment" }',
                    'expectedOutput': '1'
                }
            ],
            'hints': [
                'Use the useState hook to create state',
                'useState returns an array with the current value and a setter function',
                'Create functions to handle increment and decrement operations'
            ],
            'difficulty': 'medium',
            'tags': ['state', 'hooks', 'events']
        }
    ]
    
    for challenge_data in challenges_data:
        challenge = Challenge(
            id=challenge_data['id'],
            title=challenge_data['title'],
            description=challenge_data['description'],
            starter_code=challenge_data['starter_code'],
            solution=challenge_data['solution'],
            tests=json.dumps(challenge_data['tests']),
            hints=json.dumps(challenge_data['hints']),
            difficulty=challenge_data['difficulty'],
            tags=json.dumps(challenge_data['tags'])
        )
        db.session.add(challenge)
    
    db.session.commit()
    print(f"✅ Added {len(challenges_data)} challenges to the database")

def main():
    """Run the seed script"""
    with app.app_context():
        print("🌱 Seeding database with sample data...")
        # Create all tables first
        db.create_all()
        print("📊 Database tables created")
        seed_lessons()
        seed_challenges()
        print("🎉 Database seeding completed!")

if __name__ == '__main__':
    main()


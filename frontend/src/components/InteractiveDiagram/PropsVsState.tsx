import React, { useState } from 'react';
import { ArrowDown, ArrowRight, RotateCcw, Play } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { cn } from '../../utils/cn';

interface PropsVsStateProps {
  className?: string;
}

export const PropsVsState: React.FC<PropsVsStateProps> = ({ className }) => {
  const [activeDemo, setActiveDemo] = useState<'props' | 'state' | null>(null);
  const [propsData, setPropsData] = useState({ name: 'Alice', age: 25 });
  const [stateCount, setStateCount] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  const handlePropsDemo = () => {
    setActiveDemo('props');
    setAnimationStep(0);
    
    // Animate props flow
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => setAnimationStep(3), 1500);
  };

  const handleStateDemo = () => {
    setActiveDemo('state');
    setAnimationStep(0);
    setStateCount(0);
  };

  const handleReset = () => {
    setActiveDemo(null);
    setAnimationStep(0);
    setStateCount(0);
    setPropsData({ name: 'Alice', age: 25 });
  };

  const incrementCounter = () => {
    setStateCount(prev => prev + 1);
  };

  const updateProps = () => {
    setPropsData(prev => ({
      name: prev.name === 'Alice' ? 'Bob' : 'Alice',
      age: prev.age === 25 ? 30 : 25
    }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Props vs State: Interactive Demo</span>
            <div className="flex space-x-2">
              <Button
                variant={activeDemo === 'props' ? 'primary' : 'outline'}
                size="sm"
                onClick={handlePropsDemo}
              >
                <Play className="w-4 h-4 mr-1" />
                Demo Props
              </Button>
              <Button
                variant={activeDemo === 'state' ? 'primary' : 'outline'}
                size="sm"
                onClick={handleStateDemo}
              >
                <Play className="w-4 h-4 mr-1" />
                Demo State
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Click the demo buttons to see how props flow from parent to child components, 
            and how state is managed within a component.
          </p>
        </CardContent>
      </Card>

      {/* Props Demo */}
      {activeDemo === 'props' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Props Flow Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Parent Component */}
              <div className={cn(
                "p-4 bg-white rounded-lg border-2 transition-all duration-500",
                animationStep >= 1 ? "border-blue-500 shadow-lg" : "border-gray-300"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Parent Component (App)</h3>
                  <Button size="sm" onClick={updateProps}>
                    Update Props
                  </Button>
                </div>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  {`<Welcome name="${propsData.name}" age={${propsData.age}} />`}
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-4">
                  <div className={cn(
                    "flex items-center space-x-2 transition-all duration-500",
                    animationStep >= 2 ? "text-blue-600" : "text-gray-400"
                  )}>
                    <span className="text-sm font-medium">Props passed down</span>
                    <ArrowDown className={cn(
                      "w-6 h-6 transition-all duration-500",
                      animationStep >= 2 && "animate-bounce"
                    )} />
                  </div>
                </div>
              </div>

              {/* Child Component */}
              <div className={cn(
                "p-4 bg-white rounded-lg border-2 transition-all duration-500",
                animationStep >= 3 ? "border-green-500 shadow-lg" : "border-gray-300"
              )}>
                <h3 className="font-semibold text-gray-800 mb-3">Child Component (Welcome)</h3>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-3">
                  {`function Welcome(props) {
  return <h1>Hello, {props.name}! Age: {props.age}</h1>;
}`}
                </div>
                <div className={cn(
                  "p-3 bg-green-100 rounded border transition-all duration-500",
                  animationStep >= 3 ? "border-green-500" : "border-gray-300"
                )}>
                  <h1 className="text-lg font-semibold text-green-800">
                    Hello, {propsData.name}! Age: {propsData.age}
                  </h1>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Key Points:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Props are passed from parent to child components</li>
                  <li>• Props are read-only (immutable) in the child component</li>
                  <li>• When parent updates props, child re-renders automatically</li>
                  <li>• Props enable component reusability and customization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State Demo */}
      {activeDemo === 'state' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">State Management Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Component with State */}
              <div className="p-4 bg-white rounded-lg border-2 border-green-500 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Counter Component</h3>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
                  {`function Counter() {
  const [count, setCount] = useState(${stateCount});
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
                </div>
                
                {/* Live Demo */}
                <div className="p-4 bg-green-100 rounded border border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-green-800">
                        Count: {stateCount}
                      </p>
                    </div>
                    <Button onClick={incrementCounter}>
                      Increment
                    </Button>
                  </div>
                </div>
              </div>

              {/* State Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">1. User Action</div>
                  <div className="text-xs text-gray-500">Button Click</div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">2. State Update</div>
                  <div className="text-xs text-gray-500">setCount(count + 1)</div>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Key Points:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• State is internal to the component</li>
                  <li>• State can be updated using setter functions</li>
                  <li>• When state changes, component re-renders automatically</li>
                  <li>• State enables interactive and dynamic behavior</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {!activeDemo && (
        <Card>
          <CardHeader>
            <CardTitle>Props vs State Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-blue-700">Props</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Mutability</td>
                    <td className="border border-gray-300 px-4 py-2">Read-only (Immutable)</td>
                    <td className="border border-gray-300 px-4 py-2">Mutable</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Source</td>
                    <td className="border border-gray-300 px-4 py-2">Parent component</td>
                    <td className="border border-gray-300 px-4 py-2">Component itself</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Purpose</td>
                    <td className="border border-gray-300 px-4 py-2">Configure component behavior</td>
                    <td className="border border-gray-300 px-4 py-2">Manage component data</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Updates</td>
                    <td className="border border-gray-300 px-4 py-2">Updated by parent</td>
                    <td className="border border-gray-300 px-4 py-2">Updated by component</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Re-renders</td>
                    <td className="border border-gray-300 px-4 py-2">When parent re-renders</td>
                    <td className="border border-gray-300 px-4 py-2">When state changes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


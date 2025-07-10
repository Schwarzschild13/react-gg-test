import React from 'react';
import { ChevronRight, CheckCircle, Circle, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface LessonItem {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
}

const lessons: LessonItem[] = [
  { id: '1', title: 'Introduction to React', completed: true, locked: false },
  { id: '2', title: 'Components & JSX', completed: true, locked: false },
  { id: '3', title: 'Props & State', completed: false, locked: false, current: true },
  { id: '4', title: 'Event Handling', completed: false, locked: true },
  { id: '5', title: 'Conditional Rendering', completed: false, locked: true },
  { id: '6', title: 'Lists & Keys', completed: false, locked: true },
  { id: '7', title: 'Forms & Controlled Components', completed: false, locked: true },
  { id: '8', title: 'useEffect Hook', completed: false, locked: true },
  { id: '9', title: 'Custom Hooks', completed: false, locked: true },
  { id: '10', title: 'Context API', completed: false, locked: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  isOpen = true 
}) => {
  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 h-full overflow-y-auto transition-all duration-300",
      isOpen ? "w-80" : "w-16",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn(
            "text-lg font-semibold text-gray-900 transition-opacity",
            !isOpen && "opacity-0"
          )}>
            React Fundamentals
          </h2>
          <div className={cn(
            "text-sm text-gray-500 transition-opacity",
            !isOpen && "opacity-0"
          )}>
            3/10 completed
          </div>
        </div>

        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={cn(
                "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200",
                lesson.current && "bg-blue-50 border border-blue-200",
                lesson.completed && !lesson.current && "bg-green-50 hover:bg-green-100",
                !lesson.completed && !lesson.locked && !lesson.current && "hover:bg-gray-50",
                lesson.locked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : lesson.locked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Circle className={cn(
                      "w-5 h-5",
                      lesson.current ? "text-blue-600" : "text-gray-400"
                    )} />
                  )}
                </div>
                
                <div className={cn(
                  "flex-1 transition-opacity",
                  !isOpen && "opacity-0"
                )}>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-medium",
                      lesson.current ? "text-blue-900" : "text-gray-900",
                      lesson.locked && "text-gray-500"
                    )}>
                      {index + 1}. {lesson.title}
                    </span>
                    {!lesson.locked && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={cn(
          "mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg transition-opacity",
          !isOpen && "opacity-0"
        )}>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Progress Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Lessons</span>
              <span>3/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};


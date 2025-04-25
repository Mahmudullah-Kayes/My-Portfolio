import React from 'react';
import { CircleCheck, CircleAlert } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  title: string;
  description: string;
  className?: string;
}

export const DatabaseAlert: React.FC<AlertProps> = ({ 
  type, 
  title, 
  description, 
  className = '' 
}) => {
  return (
    <div 
      className={`mt-4 relative w-full rounded-lg border p-4 ${
        type === 'error' 
          ? 'border-red-500/50 text-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/10' 
          : 'border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700'
      } ${className}`}
      role="alert"
    >
      <div className="flex">
        {type === 'success' ? (
          <CircleCheck className="h-5 w-5 text-green-500 mr-3" />
        ) : (
          <CircleAlert className="h-5 w-5 text-red-500 mr-3" />
        )}
        <div>
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {title}
          </h5>
          <div className="text-sm">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseAlert; 
import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'text' | 'metric';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-gray-100 rounded-xl p-5 animate-pulse ${className}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`space-y-2 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        );
        
      case 'metric':
        return (
          <div className={`bg-gray-100 rounded-xl p-5 animate-pulse ${className}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-7 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;

import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 animate-pulse w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="h-4 bg-secondary-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-secondary-100 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-secondary-100 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-secondary-200 p-4 animate-pulse">
      <div className="h-8 bg-secondary-200 rounded mb-4 w-full"></div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="grid grid-cols-4 gap-4 py-3 border-b border-secondary-100">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-4 bg-secondary-100 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

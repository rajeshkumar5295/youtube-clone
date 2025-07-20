import React, { useContext } from 'react';
import { Context } from '../context/Context';

const Skeleton = () => {
  const { isDarkMode } = useContext(Context);
  
  return (
    <div className="animate-pulse">
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg overflow-hidden`}>
        {/* Thumbnail skeleton */}
        <div className={`w-full h-48 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        
        {/* Content skeleton */}
        <div className="p-3">
          <div className="flex items-start space-x-3">
            {/* Channel avatar skeleton */}
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex-shrink-0`}></div>
            
            {/* Text content skeleton */}
            <div className="flex-1 space-y-2">
              <div className={`h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4`}></div>
              <div className={`h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2`}></div>
              <div className={`h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-2/3`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton; 
import React, { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import LeftNav from './LeftNav'
import { Context } from '../context/Context'
import VideoCard from './VideoCard';
import Skeleton from '../shared/Skeleton';


const Feed = () => {
  const {loading, searchResults, setSearchResults, selectCategories, fetchSelectedCategoryData, isDarkMode}=useContext(Context);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Load more videos when user scrolls to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && !loading) {
      loadMoreVideos();
    }
  }, [inView, hasMore, isLoadingMore, loading]);

  const loadMoreVideos = async () => {
    setIsLoadingMore(true);
    try {
      // Simulate API call with next page token
      // In real implementation, you would pass page token to your API
      const nextPage = page + 1;
      setPage(nextPage);
      
      // For demo purposes, we'll just add more videos from the same results
      // In real implementation, you would fetch new data from API
      setTimeout(() => {
        if (searchResults && searchResults.length > 0) {
          // Duplicate some videos to simulate more content
          const moreVideos = searchResults.slice(0, 8); // Get first 8 videos
          setSearchResults(prev => [...prev, ...moreVideos]);
        }
        setIsLoadingMore(false);
        
        // Stop infinite scroll after 5 pages for demo
        if (nextPage >= 5) {
          setHasMore(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error loading more videos:', error);
      setIsLoadingMore(false);
    }
  };

  // Reset pagination when category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectCategories]);

  // Generate skeleton array for loading
  const skeletonArray = Array.from({ length: 12 }, (_, index) => index);
      
  return (
    <div className='flex flex-row h-[calc(100%-56px)]'>
      <LeftNav />
      {/* rightpartofhomepage */}
      <div className={`grow overflow-y-auto w-[calc(100%-250px)] h-full ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className='grid grid-cols-1 ml-15 md:ml-0 lg:ml-0 xl:ml-0 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4'>
          {/* Show skeletons while loading */}
          {loading && skeletonArray.map((index) => (
            <Skeleton key={`skeleton-${index}`} />
          ))}
          
          {/* Show videos when not loading */}
          {!loading && searchResults?.map((item, index) => (
            <VideoCard 
              key={`video-${index}`} 
              video={item?.id}
              snippet={item?.snippet} 
            />
          ))}
          
          {/* Show loading more skeletons */}
          {isLoadingMore && skeletonArray.slice(0, 8).map((index) => (
            <Skeleton key={`loading-more-${index}`} />
          ))}
          
          {/* Intersection observer target for infinite scroll */}
          <div ref={ref} className="col-span-full h-4" />
        </div>
        
                 {/* End of content message */}
         {!hasMore && searchResults && searchResults.length > 0 && (
           <div className="text-center py-8">
             <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You've reached the end of the feed!</p>
           </div>
         )}
      </div>
    </div>
  )
}

export default Feed

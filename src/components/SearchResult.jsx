import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { fetchDatafromApi } from '../utils/api';
import SearchResultVideo from './SearchResultVideo';
import LeftNav from './LeftNav';
import Skeleton from '../shared/Skeleton';
import { Context } from '../context/Context';




const SearchResult = () => {
       const[ searchVideo,setSearchVideo ]=useState([]);
       const [page, setPage] = useState(1);
       const [hasMore, setHasMore] = useState(true);
       const [isLoadingMore, setIsLoadingMore] = useState(false);
       const {setLoading, loading, isDarkMode}=useContext(Context);
      
      const{searchQuery}=useParams();

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

          useEffect(()=>{
            fetchSearchVideo();
          },[searchQuery]) 

         const fetchSearchVideo=()=>{
              setLoading(true) 
              setPage(1);
              setHasMore(true);
              fetchDatafromApi(`search?q=${searchQuery}`).then((res)=>{
                // console.log(res)
                setSearchVideo(res?.items);
                setLoading(false)
              })
         }

         const loadMoreVideos = async () => {
           setIsLoadingMore(true);
           try {
             // Simulate API call with next page token
             const nextPage = page + 1;
             setPage(nextPage);
             
             // For demo purposes, we'll just add more videos from the same results
             setTimeout(() => {
               if (searchVideo && searchVideo.length > 0) {
                 // Duplicate some videos to simulate more content
                 const moreVideos = searchVideo.slice(0, 5); // Get first 5 videos
                 setSearchVideo(prev => [...prev, ...moreVideos]);
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
         console.log(searchVideo)
  return (
    <div className={`h-[calc(100vh-56px)] w-full flex ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <LeftNav/>
        <div className='w-full md:w-[calc(100%-250px)]  grid grid-cols-1  overflow-y-auto ml-4 md:ml-0 mr-4 md:mr-2 gap-4 mt-3  '   >  
           {/* Show skeletons while loading */}
           {loading && Array.from({ length: 5 }, (_, index) => (
             <div key={`skeleton-${index}`} className="flex space-x-4 p-4">
               <div className={`w-64 h-36 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
               <div className="flex-1 space-y-2">
                 <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4 animate-pulse`}></div>
                 <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2 animate-pulse`}></div>
                 <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-2/3 animate-pulse`}></div>
               </div>
             </div>
           ))}
           
           {/* Show videos when not loading */}
           {!loading && searchVideo?.map((item,index)=>{
              return (
                <SearchResultVideo 
                key={`video-${index}`} 
                video={item?.id}
                snippet={item?.snippet}
                />
              )
             })
           }

           {/* Show loading more skeletons */}
           {isLoadingMore && Array.from({ length: 3 }, (_, index) => (
             <div key={`loading-more-${index}`} className="flex space-x-4 p-4">
               <div className={`w-64 h-36 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
               <div className="flex-1 space-y-2">
                 <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4 animate-pulse`}></div>
                 <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2 animate-pulse`}></div>
                 <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-2/3 animate-pulse`}></div>
               </div>
             </div>
           ))}

           {/* Intersection observer target for infinite scroll */}
           <div ref={ref} className="h-4" />

           {/* End of content message */}
           {!hasMore && searchVideo && searchVideo.length > 0 && (
             <div className="text-center py-8">
               <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No more search results!</p>
             </div>
           )}
        </div>
    </div>
  )
}

export default SearchResult

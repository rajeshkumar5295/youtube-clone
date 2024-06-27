import React, { useContext, useEffect } from 'react'
import LeftNav from './LeftNav'
import { Context } from '../context/Context'
import VideoCard from './VideoCard';


const Feed = () => {
          
  const {loading,searchResults}=useContext(Context);
  console.log( loading, searchResults)

      
  return (
    <div  className='flex flex-row h-[calc(100%-56px)]'  >
         <LeftNav />
         {/* rightpartofhomepage */}
         <div  className='grow overflow-y-auto bg-black w-[calc(100%-250px)]  h-full ' >
              <div className=' grid grid-cols-1  ml-15 md:ml-0  lg:ml-0 xl:ml-0  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4  ' >
                {
                  !loading && (
                    searchResults?.map((item,index)=>{

                      return (
                         <VideoCard 
                           key={index} 
                           video={item?.id}
                           snippet={item?.snippet} 
                         
                         />
                      )
                   })
                  )
                
                  
                }
                
              </div>
         </div>
    </div>
  )
}

export default Feed

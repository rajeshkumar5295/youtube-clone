import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Videolength from '../shared/Videolength';
import { Context } from '../context/Context';


const VideoCard = ( {video,snippet} ) => {
    const { isDarkMode } = useContext(Context);
    console.log(video,snippet);
  return (
    <Link to={`/video/${video?.videoId}`} >
        <div className=' flex flex-col mb-8' >  
            <div className=' relative h-48 md:h-40  rounded-xl overflow-hidden '  >
              <img src={snippet?.thumbnails?.medium?.url} alt="" className='h-full w-full object-cover' />
              <Videolength  time={snippet?.publishTime}  />/
            </div>
            
             <div className={`flex mt-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className=' flex items-start' >
                <div className='h-9 w-9  rounded-full  flex overflow-hidden '  >
                  <img src={snippet?.thumbnails?.high?.url} alt=""  className='h-full w-full  object-cover ' />
                </div>

              </div>
              <div className='flex flex-col ml-3 overflow-hidden '  >
                <span className='text-sm font-bold line-clamp-2' >  { snippet?.title }  </span> 
                <span className={`text-[18px] ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}> {snippet?.channelTitle}  </span>
                <div className='flex items-center' >
                   <span className={`h-3 w-3 flex rounded-full ${isDarkMode ? 'bg-white/50' : 'bg-gray-400'}`}> </span>
                   <span className={`ml-2 flex items-center justify-center ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>{snippet?.publishTime}  </span>
                </div>
              </div>
               
               
             </div>


        </div>
    
    </Link>
  )
}

export default VideoCard

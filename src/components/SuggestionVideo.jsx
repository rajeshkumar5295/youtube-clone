import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Videolength from '../shared/Videolength';
import { Context } from '../context/Context';

const SuggestionVideo = ( {video,snippet} ) => { 
       const { isDarkMode } = useContext(Context);
       console.log(video,snippet);
  return (
    <Link to={`/video/${video?.videoId}`} >
        <div className={`flex mb-3 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>  
            <div className={`relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <img src={snippet?.thumbnails?.medium?.url} alt="" className='h-full w-full object-cover' />
              <Videolength  time={snippet?.publishTime}  />
            </div>
            
           
              <div className='flex flex-col ml-3 overflow-hidden'> 
                <span className={`text-sm font-bold line-clamp-2 lg:text-xs xl:text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>  { snippet?.title }  </span> 
                <span className={`text-[12px] lg:text-[10px] xl:text-[12px] font-semibold mt-2 flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}> {snippet?.channelTitle}  </span>
                <div className='flex items-center'> 
                   <span className={`h-3 w-3 flex rounded-full mt-2 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}> </span>
                   <span className={`ml-2 flex text-[12px] lg:text-[10px] xl:text-[12px] font-semibold mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{snippet?.publishTime}  </span>
                </div>
              </div>
               
               
        


        </div>
    
    </Link>
  )
}

export default SuggestionVideo

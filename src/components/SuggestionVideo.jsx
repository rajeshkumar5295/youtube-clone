import React from 'react'
import { Link } from 'react-router-dom';
import Videolength from '../shared/Videolength';

const SuggestionVideo = ( {video,snippet} ) => { 
       console.log(video,snippet);
  return (
    <Link to={`/video/${video?.videoId}`} >
        <div className=' flex  mb-3' >  
            <div className=' relative  h-24 lg:h-20 xl:h-24  w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800  overflow-hidden '  >
              <img src={snippet?.thumbnails?.medium?.url} alt="" className='h-full w-full object-cover' />
              <Videolength  time={snippet?.publishTime}  />/
            </div>
            
           
              <div className='flex flex-col ml-3 overflow-hidden '  >
                <span className='text-sm font-bold line-clamp-2 lg:text-xs xl:text-sm text-white  ' >  { snippet?.title }  </span> 
                <span className='text-white/[0.7] text-[12px]  lg:text-[10px] xl:text-[12px] font-semibold mt-2  flex items-center  ' > {snippet?.channelTitle}  </span>
                <div className='flex items-center ' >
                   <span  className=' bg-white/[0.5] h-3 w-3 flex rounded-full mt-2 ' > </span>
                   <span className=' ml-2 flex  text-[12px]  lg:text-[10px] xl:text-[12px] font-semibold mt-2 ' >{snippet?.publishTime}  </span>
                </div>
              </div>
               
               
        


        </div>
    
    </Link>
  )
}

export default SuggestionVideo

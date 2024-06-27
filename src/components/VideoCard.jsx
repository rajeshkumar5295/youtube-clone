import React from 'react'
import { Link } from 'react-router-dom';
import Videolength from '../shared/Videolength';


const VideoCard = ( {video,snippet} ) => {

    console.log(video,snippet);
  return (
    <Link to={`/video/${video?.videoId}`} >
        <div className=' flex flex-col mb-8' >  
            <div className=' relative h-48 md:h-40  rounded-xl overflow-hidden '  >
              <img src={snippet?.thumbnails?.medium?.url} alt="" className='h-full w-full object-cover' />
              <Videolength  time={snippet?.publishTime}  />/
            </div>
            
             <div className='flex mt-5 text-white'  >
              <div className=' flex items-start' >
                <div className='h-9 w-9  rounded-full  flex overflow-hidden '  >
                  <img src={snippet?.thumbnails?.high?.url} alt=""  className='h-full w-full  object-cover ' />
                </div>

              </div>
              <div className='flex flex-col ml-3 overflow-hidden '  >
                <span className='text-sm font-bold line-clamp-2' >  { snippet?.title }  </span> 
                <span className='text-white/[0.7] text-[18px]  ' > {snippet?.channelTitle}  </span>
                <div className='flex items-center' >
                   <span  className=' bg-white/[0.5] h-3 w-3 flex rounded-full ' > </span>
                   <span className=' ml-2 flex items-center justify-center' >{snippet?.publishTime}  </span>
                </div>
              </div>
               
               
             </div>


        </div>
    
    </Link>
  )
}

export default VideoCard

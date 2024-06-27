import React from 'react'
import { Link } from 'react-router-dom'
import Videolength from '../shared/Videolength'

const SearchResultVideo = ({video,snippet} ) => {
       console.log(snippet)
  return (
   <Link  to={`/video/${video?.videoId}`} > 
         <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row  hover:bg-white/[0.05]   rounded-3xl  p-2    '  >
             <div className='shrink-0 h-48 w-full md:h-[110px] md:w-[210px] lg:h-[120px] lg:w-[240px]   overflow-hidden rounded-3xl  relative '  >  
               <img src={snippet?.thumbnails?.high?.url} alt="" className='h-full w-full object-cover' />
                <Videolength/>
             </div>

             <div  className='text-white ml-0  md:ml-8 flex flex-col gap-2 mt-4 md:mt-2  ' >
                <span  className=' font-bold leading-3 md:text-[20px] ' >  {snippet?.channelTitle}  </span>
                <span className='text-sm text-white/[0.5] leading-4 truncate md:truncate '  > {snippet?.description}  </span>
                 <div className='flex ' >
                     <div className='items-start  ' > 
                         <div className='h-11 w-11 flex rounded-full overflow-hidden ' >
                          <img src="https://xsgames.co/randomusers/assets/avatars/female/49.jpg" alt=""  className='h-full w-full object-cover '  />
                         </div>
                      </div>
                       <div className='flex flex-col ml-2' > 
                         <span  className='  text-sm' > {snippet?.channelTitle} </span>
                         <div className='flex gap-2' >
                         <span className='text-sm ' > 1458 views    </span>
                          <span className='text-xs mt-1 flex gap-1 '>  <span className=' h-2 w-2 bg-white/[0.5] rounded-full overflow-hidden mt-[4px] ' ></span> 2 years ago </span>
                         </div>

                       
                       </div>
                  </div> 
             </div>
         </div>
   </Link>
  )
}

export default SearchResultVideo

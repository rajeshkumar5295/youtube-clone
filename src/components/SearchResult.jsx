import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDatafromApi } from '../utils/api';
import SearchResultVideo from './SearchResultVideo';
import LeftNav from './LeftNav';
import { Context } from '../context/Context';




const SearchResult = () => {

       const[ searchVideo,setSearchVideo ]=useState([]);
       const {setLoading}=useContext(Context);
      
      const{searchQuery}=useParams();

          useEffect(()=>{
            fetchSearchVideo();
          },[searchQuery]) 

         const fetchSearchVideo=()=>{
              setLoading(true) 
              fetchDatafromApi(`search?q=${searchQuery}`).then((res)=>{
                // console.log(res)
                setSearchVideo(res?.items);
                setLoading(false)
              })
         }
         console.log(searchVideo)
  return (
    <div className=' h-[calc(100vh-56px)]   bg-black w-full  flex      '   >
        <LeftNav/>
        <div className='w-full md:w-[calc(100%-250px)]  grid grid-cols-1  overflow-y-auto ml-4 md:ml-0 mr-4 md:mr-2 gap-4 mt-3  '   >  
           {
             searchVideo?.map((item,index)=>{
              return (
                <SearchResultVideo 
                key={index} 
                video={item?.id}
                snippet={item?.snippet}

              
                />
              )
             })
           }

        </div>
      

    </div>
  )
}

export default SearchResult

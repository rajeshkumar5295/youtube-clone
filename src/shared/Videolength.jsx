import React from 'react'
import moment from "moment" 

const Videolength = ({time} ) => {
    // console.log(time)
      
    //   const currentDate=moment().format('YYYY-MM-DD HH:mm:ss')
     // here i pass a constant value as i am not fetching time from api 
     const videoLength=moment().startOf("day").seconds(2564).format("H:mm:ss")
    //    console.log({videoLength});
  return (
    <div className='absolute text-white  bg-black/[0.58]   right-[4px] bottom-2 rounded-md text-sm'  >
      {videoLength}
    </div>
  )
}

export default Videolength

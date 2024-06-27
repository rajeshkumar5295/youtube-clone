import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ytLogo from "../Images/yt-logo.png"
import ytLogoMobile from "../Images/yt-logo-mobile.png"
 
  import {SlMenu} from "react-icons/sl";
  import { RiVideoAddFill } from "react-icons/ri";
  import { IoSearch } from "react-icons/io5";
  import { FiBell } from "react-icons/fi";
  import { CgClose } from "react-icons/cg";



import {Context} from "../context/Context"
import Loader from '../shared/Loader';

const Header = () => {
         
       const navigate=useNavigate();
      const [searchQuery,setSearchQuery]=useState("");

      const{loading, mobileMenue,setMobileMenue}=useContext(Context);

      const searchQueryHandler=(event)=>{
          // console.log(event);

              if((event?.key==="Enter" || event==="searchButton") && searchQuery?.length > 0 ){
                navigate(`/searchResult/${searchQuery}`)

              }
      }
        
      const mobileMenueToggle=()=>{
        setMobileMenue(!mobileMenue)
      }
     

      
       const {pathname}=useLocation();
        //  console.log(useLocation());

       console.log(pathname)
      const pageName=pathname?.split("/")?.filter(Boolean)?.[0]
      console.log(pageName)

  return (
    <div className=' sticky top-0 z-10 flex flex-row items-center justify-between px-4 md:px-5 h-14 bg-white dark:bg-black  '   >
           {loading && <Loader/>  }

           
      
       <div className=' flex  h-5 items-center '  > 
             
             {
              pageName !=="video" && (
                <div className='cursor-pointer md:hidden h-10 w-10 flex items-center justify-center  hover:bg-[#303030]/[0.6] rounded-2xl  '  
                onClick={mobileMenueToggle}>   
                   {
                    mobileMenue ? (
                      < CgClose className='text-white text-xl' />
                    ):(
                      <SlMenu className='text-white text-xl ' />
                    )
                   }     
                </div>
              )
             }
          
            <Link to="/" className=' h-5 flex  items-center  ' >
                
                <img src={ytLogo} alt="formdscreen" className='h-full hidden dark:md:block '  />
                <img src={ ytLogoMobile} alt="" className=' h-full md:hidden  ' />
            
            </Link>
          
       </div>

      
       <div className='flex items-center group  ' >
          
          <div className='flex   h-8 md:h-10 md:ml-10 md:pl-5  items-center justify-center border border-[#303030]  rounded-l-[44px]   group-focus-within:border-blue-500 md:group-focus-within:ml-5  md:grou-focul-within:pl-0 ' >
            <div className='w-10 items-center justify-center group-focus-within:md:block hidden ' >
              <IoSearch className='text-white text-xl ' /> 
            </div>
            <input
             type="text"
             placeholder='Search'
              className=' outline-none border-none bg-transparent text-white w-44 md:w-64 lg:w-[500px] pr-5 pl-5 md:pl-0 group-focus-within:md:pl-0  '
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              onKeyUp={searchQueryHandler}
            />
             
          </div>
          <button className='border border-[#303030]   rounded-r-[44px]  w-[40px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border-l-0  bg-white/[0.1]  ' >
             <IoSearch className='text-white text-xl ' /> 
          </button>

       </div>

       
       <div className='flex' >
         
         <div className=' hidden md:flex ' >
            <div className='flex  h-10 w-10 items-center justify-center   hover:bg-[#303030]/[0.6] rounded-full ' >
              <RiVideoAddFill  className='text-white text-xl cursor-pointer ' />
            </div>
            <div className='flex h-10 w-10 items-center justify-center hover:bg-[#303030]/[0.6]  rounded-full ' >
              <FiBell  className='text-white text-xl cursor-pointer  '  />
            </div>
          
         </div>
         <div className='h-10 w-10 rounded-full overflow-hidden  cursor-pointer flex '  >
              <img src="https://xsgames.co/randomusers/assets/avatars/female/74.jpg" alt="" className='w-full h-full ' />
            </div>

       </div>
      
    </div>
  )
}

export default Header

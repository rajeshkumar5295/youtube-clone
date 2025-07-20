import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ytLogo from "../Images/yt-logo.png"
import ytLogoMobile from "../Images/yt-logo-mobile.png"
 
  import {SlMenu} from "react-icons/sl";
  import { RiVideoAddFill } from "react-icons/ri";
  import { IoSearch } from "react-icons/io5";
  import { FiBell } from "react-icons/fi";
  import { CgClose } from "react-icons/cg";
  import { FiUser } from "react-icons/fi";
  import { FiSun, FiMoon } from "react-icons/fi";



import {Context} from "../context/Context"
import Loader from '../shared/Loader';

const Header = () => {
         
       const navigate=useNavigate();
      const [searchQuery,setSearchQuery]=useState("");

      const{loading, mobileMenue,setMobileMenue, user, signInWithGoogle, signOut, isDarkMode, toggleTheme}=useContext(Context);

      const searchQueryHandler=(event)=>{
          // console.log(event);

              if((event?.key==="Enter" || event==="searchButton") && searchQuery?.length > 0 ){
                navigate(`/searchResult/${searchQuery}`)

              }
      }
        
      const mobileMenueToggle=()=>{
        setMobileMenue(!mobileMenue)
      }

      const handleSignIn = async () => {
        try {
          await signInWithGoogle();
        } catch (error) {
          console.error('Sign in error:', error);
        }
      };

      const handleSignOut = async () => {
        try {
          await signOut();
        } catch (error) {
          console.error('Sign out error:', error);
        }
      };

      const handleVideoUpload = () => {
        if (!user) {
          alert('Please sign in to upload videos');
          return;
        }
        navigate('/profile?upload=true');
      };
     

      
       const {pathname}=useLocation();
        //  console.log(useLocation());

       console.log(pathname)
      const pageName=pathname?.split("/")?.filter(Boolean)?.[0]
      console.log(pageName)

  return (
    <div className={`sticky top-0 z-10 flex flex-row items-center justify-between px-4 md:px-5 h-14 ${isDarkMode ? 'bg-black' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
           {loading && <Loader/>  }

           
      
       <div className=' flex  h-5 items-center '  > 
             
             {
              pageName !=="video" && (
                <div className={`cursor-pointer md:hidden h-10 w-10 flex items-center justify-center hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl transition-colors`}  
                onClick={mobileMenueToggle}>   
                   {
                    mobileMenue ? (
                      < CgClose className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    ):(
                      <SlMenu className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    )
                   }     
                </div>
              )
             }
          
            <Link to="/" className=' h-8 flex  items-center  ' >
                
                <img src={ytLogo} alt="YouTube" className='h-full hidden md:block object-contain'  />
                <img src={ ytLogoMobile} alt="YouTube" className=' h-full md:hidden object-contain' />
            
            </Link>
          
       </div>

      
                 <div className='flex items-center group  ' >
          
          <div className={`flex h-8 md:h-10 md:ml-10 md:pl-5 items-center justify-center border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-l-[44px] group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:grou-focul-within:pl-0`}>
            <div className='w-10 items-center justify-center group-focus-within:md:block hidden ' >
              <IoSearch className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-600'}`} /> 
            </div>
            <input
             type="text"
             placeholder='Search'
              className={`outline-none border-none bg-transparent w-44 md:w-64 lg:w-[500px] pr-5 pl-5 md:pl-0 group-focus-within:md:pl-0 ${isDarkMode ? 'text-white' : 'text-gray-900'} placeholder-${isDarkMode ? 'gray-400' : 'gray-500'}`}
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              onKeyUp={searchQueryHandler}
            />
             
          </div>
          <button className={`border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-r-[44px] w-[40px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border-l-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
             <IoSearch className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-600'}`} /> 
          </button>

       </div>

       
       <div className='flex items-center space-x-2' >
         
         <div className=' hidden md:flex ' >
            <div 
              className={`flex h-10 w-10 items-center justify-center hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full transition-colors cursor-pointer`}
              onClick={handleVideoUpload}
              title="Upload Video"
            >
              <RiVideoAddFill  className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
            </div>
            <div className={`flex h-10 w-10 items-center justify-center hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full transition-colors`}>
              <FiBell  className={`text-xl cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-700'}`}  />
            </div>
            <button 
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full transition-colors`}
            >
              {isDarkMode ? (
                <FiSun className='text-white text-xl cursor-pointer' />
              ) : (
                <FiMoon className='text-gray-700 text-xl cursor-pointer' />
              )}
            </button>
          
         </div>

         {/* Mobile Upload Button */}
         {user && (
           <div className='md:hidden'>
             <div 
               className={`flex h-10 w-10 items-center justify-center hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full transition-colors cursor-pointer`}
               onClick={handleVideoUpload}
               title="Upload Video"
             >
               <RiVideoAddFill  className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
             </div>
           </div>
         )}
         
         {user ? (
           <div className="flex items-center space-x-3">
             <Link to="/profile" className={`h-10 w-10 rounded-full overflow-hidden cursor-pointer flex hover:opacity-80 transition-opacity border-2 ${isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'}`}>
               <img 
                 src={user.photoURL || `https://picsum.photos/100/100?random=${user.uid || 'user'}`} 
                 alt="Profile" 
                 className='w-full h-full object-cover' 
               />
             </Link>
             <div className="hidden md:block">
               <p className={`text-sm font-medium truncate max-w-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                 {user.displayName || user.email?.split('@')[0] || 'User'}
               </p>
             </div>
           </div>
         ) : (
           <button 
             onClick={handleSignIn}
             className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
           >
             <FiUser className="text-lg" />
             <span className="hidden md:block font-medium">Sign In</span>
           </button>
         )}

       </div>
      
    </div>
  )
}

export default Header

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {categories} from "../utils/constant";
import { Context } from '../context/Context';
import LeftNavMenuItem from './LeftNavMenuItem';
import { useNavigate } from 'react-router-dom';


const LeftNav = () => {
    
     const { selectCategories,setSelectCategories,mobileMenue, isDarkMode }=useContext(Context);
     const navigate=useNavigate();
      const clickHandler=(name,type)=>{ 
          switch(type){
            case "home": 
               return setSelectCategories(name);
            case "category":
                return setSelectCategories(name);
            case "menu":
                return false
            default: break;
          }
        

      }
  return (

    <div  className={`${isDarkMode ? 'bg-black' : 'bg-white'} w-[250px] py-4 overflow-y-auto md:block h-full absolute md:relative z-10 translate-x-[-250px] md:translate-x-0 transition-all ${mobileMenue && "translate-x-0"} border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}   >
      <div className='flex flex-col px-5 ' >
          {
            categories?.map((item,index)=>{
              return (
                  
                     <React.Fragment key={index} >
                        <LeftNavMenuItem
                       
                       text={item?.type==="home"?"Home":item?.name}
                       icon={item?.icon}
                       action={()=>{ 
                        clickHandler(item.name,item.type )
                        navigate("/")
                      
                      }}
                       className={ `${selectCategories===item.name ? "bg-white/[0.15]":"" } `}
                       
                     />

                     {
                      item?.divider && (
                        <hr className={`my-5 ${isDarkMode ? 'border-white/[0.2]' : 'border-gray-300'}`}  />
                      )
                     }
                     </React.Fragment>
                      
                
              )
            })
          }

          <hr className={`my-5 ${isDarkMode ? 'border-white/[0.2]' : 'border-gray-300'}`} />
          <div className={`text-[12px] ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`} >
               RRR Group
         </div>
      </div>
    </div>
  )
}

export default LeftNav

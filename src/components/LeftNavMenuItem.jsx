import React, { useContext } from 'react'
import { Context } from '../context/Context';

const LeftNavMenuItem = ({text,icon,className,action}) => {
  const { isDarkMode } = useContext(Context);
  
  return (
    <div className={`flex flex-row items-center text-sm mb-[1px] px-3 h-9 rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'text-white hover:bg-white/[0.15]' : 'text-gray-900 hover:bg-gray-100'} ${className}`} 
      onClick={action}
    >
        <span className='mr-4 text-xl' >
          {icon}
        </span>
        {text}


    </div>
  )
}

export default LeftNavMenuItem

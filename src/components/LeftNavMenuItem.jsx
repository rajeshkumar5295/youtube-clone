import React from 'react'

const LeftNavMenuItem = ({text,icon,className,action}) => {
  return (
    <div className={ ' text-white flex flex-row items-center text-sm  mb-[1px]  px-3 h-9 rounded-xl hover:bg-white/[0.15] cursor-pointer  ' + className } 
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

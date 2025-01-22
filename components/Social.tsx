import React from 'react'
import 'font-awesome/css/font-awesome.min.css';

const Social = () => {
  return (
    <div>
    <div className='flex mt-[1vmin] cursor-pointer'>
        <i className="bg-[#999] fa fa-twitter rounded-full w-[3vmin] h-[3vmin] text-center content-center text-gray-700 mr-[.8vmin] hover:bg-[#1DA1F2] hover:text-white" />
        <i className="bg-[#999] fa fa-facebook rounded-full w-[3vmin] h-[3vmin] text-center content-center text-gray-700 mr-[.8vmin] hover:bg-[#305483] hover:text-white" />
        <i className="bg-[#999] fa fa-pinterest rounded-full w-[3vmin] h-[3vmin] text-center content-center text-gray-700 mr-[.8vmin] hover:bg-[#a02d29] hover:text-white" />
        <i className="bg-[#999] fa fa-instagram rounded-full w-[3vmin] h-[3vmin] text-center content-center text-gray-700 mr-[.8vmin] hover:bg-[#9b3f5e] hover:text-white" />
        <i className="bg-[#999] fa fa-youtube rounded-full w-[3vmin] h-[3vmin] text-center content-center text-gray-700 mr-[.8vmin] hover:bg-[#ad3535] hover:text-white" />
    </div>
    </div>
  )
}

export default Social
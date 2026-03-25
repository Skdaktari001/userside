import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 bg-primary'>
        <div className='animate-reveal'>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-6 opacity-80' alt="Exchange" />
            <p className='font-semibold text-secondary uppercase tracking-widest text-xs mb-2'>Easy Exchange Policy</p>
            <p className='text-secondary opacity-60 font-light text-sm'>We offer a hassle-free exchange policy for all items.</p>
        </div>
        <div className='animate-reveal' style={{animationDelay: '0.1s'}}>
            <img src={assets.quality_icon} className='w-12 m-auto mb-6 opacity-80' alt="Return" />
            <p className='font-semibold text-secondary uppercase tracking-widest text-xs mb-2'>7 Days Return Policy</p>
            <p className='text-secondary opacity-60 font-light text-sm'>Items can be returned within 7 days of delivery.</p>
        </div>
        <div className='animate-reveal' style={{animationDelay: '0.2s'}}>
            <img src={assets.support_img} className='w-12 m-auto mb-6 opacity-80' alt="Support" />
            <p className='font-semibold text-secondary uppercase tracking-widest text-xs mb-2'>Best Customer Support</p>
            <p className='text-secondary opacity-60 font-light text-sm'>Our team is available 24/7 to assist you.</p>
        </div>
    </div>
  )
}

export default OurPolicy

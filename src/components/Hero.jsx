import React from 'react' 
import { assets } from '../assets/assets'
const Hero = () => { 
    return ( 
        <div className='flex flex-col sm:flex-row bg-primary border-none overflow-hidden'> 
            {/* Hero Left Side */} 
            <div className='w-full sm:w-1/2 flex items-center justify-center py-20 sm:py-0 px-10'> 
                <div className='text-secondary animate-reveal'> 
                    <div className='flex items-center gap-3 mb-4'> 
                        <p className='w-12 h-[1px] bg-secondary'></p> 
                        <p className='font-light text-xs md:text-sm tracking-[0.3em] uppercase'>New Collection</p> 
                    </div> 
                    <h1 className='text-4xl sm:py-4 lg:text-7xl leading-tight font-light tracking-tight mb-8'>
                        Modern comfort <br /> for your home.
                    </h1>
                    <div className='flex items-center gap-2'>
                        <button className='bg-accent text-white px-10 py-3 rounded-full text-xs font-medium tracking-widest hover:bg-opacity-80 transition-all'>
                            SHOP NOW
                        </button>
                    </div>
                </div> 
            </div> 
            {/* Hero Right Side */}
            <div className='w-full sm:w-1/2 overflow-hidden group'>
                <img className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' src={assets.hero_img} alt="Hero" />
            </div>
        </div> 
    ) 
} 
export default Hero
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary border-t border-neutral-variant mt-32 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className='max-w-7xl mx-auto py-16'>
        <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-12 sm:gap-24 mb-16'>
          <div>
            <img src={assets.logo} className='mb-6 w-28 sm:w-32' alt="Logo" />
            <p className='w-full md:w-4/5 text-[13px] leading-relaxed font-light opacity-80'>
              Discover the latest in modern home apparel. We prioritize quality and comfort to bring you pieces that feel as good as they look.
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold mb-6 tracking-[0.2em] uppercase'>Company</p>
            <ul className='flex flex-col gap-3 text-[13px] font-light opacity-80'>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">Home</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">About us</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">Delivery</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</li>
            </ul>
          </div>
          <div>
            <p className='text-xs font-semibold mb-6 tracking-[0.2em] uppercase'>Get in Touch</p>
            <ul className='flex flex-col gap-3 text-[13px] font-light opacity-80'>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">+1-212-456-7890</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">info@forever.com</li>
            </ul>
          </div>
        </div>
        
        <div className='pt-8 border-t border-neutral-variant'>
          <p className='text-[10px] sm:text-xs text-center tracking-widest uppercase opacity-60'>
            © 2024 FOREVER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

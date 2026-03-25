import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler=(event)=>{
        event.preventDefault()
    }
  return (
    <div className='text-center py-20 px-4'>
        <p className='text-2xl sm:text-3xl font-light text-secondary tracking-widest uppercase mb-4'>Subscribe now & get 20% off</p>
        <p className='text-secondary opacity-60 font-light text-sm mb-10'>Be the first to know about new arrivals and exclusive promotions.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center mx-auto border border-neutral-variant bg-white pl-6 rounded-full overflow-hidden shadow-sm'>
            <input className='w-full sm:flex-1 outline-none text-sm font-light py-4' type="email" placeholder='Enter your email' required/>
            <button className='bg-accent text-white text-[10px] font-semibold tracking-[0.2em] px-10 py-5 hover:bg-opacity-90 transition-all' type='submit'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox;

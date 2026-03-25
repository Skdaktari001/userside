import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    const bestProduct = products.filter((item) => (item.bestseller));
    setBestSeller(bestProduct.slice(0, 5))
  }, [products])
  return (
    <div className='my-24 font-roboto'>
      <div className='text-center py-10'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-[15px] font-light text-secondary opacity-70 tracking-wide'>
          Our most loved pieces, curated for quality and style. Explore the collection that defines our aesthetic.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12'>
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item.id} image={item.images} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default BestSeller

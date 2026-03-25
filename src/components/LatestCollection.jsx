import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext); // Only accessing the necessary value
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]); // Ensure that you re-fetch products if they change

  return (
    <div className='my-24'>
      <div className='text-center py-10'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-[15px] font-light text-secondary opacity-70 tracking-wide'>
          Experience our newest arrivals, designed with meticulous attention to detail and modern comfort in mind.
        </p>
      </div>
      {/* Rendering products */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12'>
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item.id} image={item.images} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;

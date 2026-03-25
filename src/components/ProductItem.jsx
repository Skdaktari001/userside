import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // Ensure `image` is an array and has at least one element, extracting imageUrl
  const productImage = Array.isArray(image) && image.length > 0 ? (image[0]?.imageUrl || image[0]) : "placeholder.jpg";

  return (
    <Link className='text-secondary cursor-pointer group' to={id ? `/product/${id}` : '#'}>
      <div className='overflow-hidden bg-neutral-variant aspect-[3/4]'>
        <img className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' src={productImage} alt={name || "Product"} />
      </div>
      <div className='pt-4 pb-1'>
        <p className='text-[13px] font-light tracking-wider uppercase mb-1'>{name || "No Name"}</p>
        <p className='text-sm font-semibold tracking-widest'>{currency ? currency + price : price}</p>
      </div>
    </Link>
  );
};

export default ProductItem;

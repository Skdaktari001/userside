import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewItem from '../components/ReviewItem';
import axios from 'axios';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  
  // New state for functional tabs and reviews
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchProductData = () => {
    const product = products.find((item) => item.id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]?.imageUrl || product.images[0]);
    }
  };

  const fetchReviews = async () => {
    if (!productId) return;
    setLoadingReviews(true);
    try {
      const response = await axios.get(`${backendUrl}api/review/product/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setReviewSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products]);

  return productData ? (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4">
      {/* Product Section */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.6fr] gap-12 lg:gap-20">
        
        {/* Left Section: Image Gallery (Scrollable) */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {productData.images.map((item, index) => (
              <div key={index} className="bg-neutral-variant aspect-[3/4] overflow-hidden group">
                <img
                  src={item.imageUrl || item}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={`Product ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Product Details (Sticky) */}
        <div className="lg:sticky lg:top-32 h-fit pb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-accent text-white px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm">SET</span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-light tracking-[0.1em] text-secondary uppercase leading-tight mb-4">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mb-4">
             {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src={assets.star_icon} 
                  className={`w-3.5 ${i < (reviewSummary?.averageRating || 0) ? '' : 'grayscale opacity-30'}`} 
                  alt="" 
                />
             ))}
             <p className='pl-2 text-xs text-secondary opacity-60'>({reviews.length})</p>
          </div>

          <p className="text-lg sm:text-xl font-medium text-secondary opacity-80 mb-8">
            {currency}{productData.price.toLocaleString()}
          </p>

          <div className="mb-10">
            <p className="text-[13px] font-light text-secondary mb-4 tracking-wider uppercase">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`min-w-[50px] h-[45px] flex items-center justify-center border text-xs tracking-widest transition-all ${
                    item === size 
                      ? 'border-accent bg-accent text-white' 
                      : 'border-neutral-variant hover:border-secondary text-secondary opacity-70'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-10">
            <button 
              onClick={() => addToCart(productData.id, size)} 
              className="w-full border border-accent text-accent py-4 rounded-[14px] text-[13px] font-medium tracking-[0.2em] hover:bg-accent hover:text-white transition-all uppercase"
            >
              Add to Cart
            </button>
            <button 
              className="w-full bg-accent text-white py-4 rounded-[14px] text-[13px] font-medium tracking-[0.2em] hover:bg-opacity-90 transition-all uppercase shadow-lg shadow-black/5"
            >
              Buy it Now
            </button>
          </div>

          <div className="text-[13px] font-light text-secondary leading-relaxed opacity-70 space-y-4 mb-10">
            <p>{productData.description}</p>
          </div>

          <div className="space-y-3 pt-6 border-t border-neutral-variant">
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-secondary opacity-60 uppercase">
              <img src={assets.star_icon} className="w-3" alt="" />
              <span>100% Original Product</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-secondary opacity-60 uppercase">
              <img src={assets.star_icon} className="w-3" alt="" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-secondary opacity-60 uppercase">
              <img src={assets.star_icon} className="w-3" alt="" />
              <span>Easy 7-Day Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews Tabs */}
      <div className="mt-20 pt-20 border-t border-neutral-variant">
        <div className="flex gap-10 mb-8">
          <button 
            onClick={() => setActiveTab('description')}
            className={`text-[13px] tracking-widest uppercase pb-2 transition-all ${activeTab === 'description' ? 'font-semibold border-b-2 border-accent' : 'font-light opacity-40 hover:opacity-100'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`text-[13px] tracking-widest uppercase pb-2 transition-all ${activeTab === 'reviews' ? 'font-semibold border-b-2 border-accent' : 'font-light opacity-40 hover:opacity-100'}`}
          >
            Reviews ({reviews.length})
          </button>
        </div>
        
        <div className="max-w-4xl">
          {activeTab === 'description' ? (
            <div className="text-[13px] leading-[1.8] font-light text-secondary opacity-70">
              <p className="mb-6 whitespace-pre-line">
                {productData.description}
              </p>
              <p>
                Experience our commitment to modern aesthetic and unparalleled comfort with this meticulously crafted piece. Each detail is considered, from the choice of premium materials to the precise construction, ensuring a product that not only looks exceptional but stands the test of time.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {loadingReviews ? (
                <p className="text-sm opacity-50">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((item, index) => (
                  <ReviewItem key={index} review={item} />
                ))
              ) : (
                <p className="text-[13px] font-light text-secondary opacity-50 italic">No reviews yet for this product. Be the first to share your experience!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-20">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>

  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;

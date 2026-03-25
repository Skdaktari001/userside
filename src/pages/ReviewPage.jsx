import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ReviewForm from '../components/ReviewForm';
import ReviewItem from '../components/ReviewItem';
import { assets } from '../assets/assets';

const ReviewPage = () => {
    const { productId, orderId } = useParams();
    const navigate = useNavigate();
    const {
        products,
        user,
        fetchProductReviews,
        submitReview,
        deleteUserReview,
        reportReview,
        token
    } = useContext(ShopContext);

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        fetchProductData();
        fetchReviews();
    }, [productId]);

    const fetchProductData = () => {
        const foundProduct = products.find(p => p.id === productId);
        setProduct(foundProduct);
    };

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetchProductReviews(productId);
            setReviews(response.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (formData) => {
        try {
            setSubmitting(true);
            await submitReview(formData);
            setShowReviewForm(false);
            fetchReviews(); // Refresh reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await deleteUserReview(reviewId);
            setReviews(prev => prev.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleReportReview = async (reviewId, reason) => {
        try {
            await reportReview(reviewId, reason);
            alert('Review reported successfully');
        } catch (error) {
            console.error('Error reporting review:', error);
        }
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    // Count ratings
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        ratingCounts[review.rating]++;
    });

    // Render rating distribution bar
    const renderRatingBar = (rating, count) => {
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

        return (
            <div className="flex items-center gap-2 mb-1">
                <span className="w-8">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="w-10 text-sm text-gray-600">{count}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="pt-10">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="h-64 bg-gray-200 rounded mb-4"></div>
                        </div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-10 text-center">
                <Title text1="PRODUCT" text2="NOT FOUND" />
                <p className="text-gray-600 mt-4">The product you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/collection')}
                    className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="pt-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Title text1="REVIEWS" text2="& RATINGS" />
                {user && token && !showReviewForm && orderId && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Back to Product */}
            <button
                onClick={() => navigate(`/product/${productId}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
            >
                <img src={assets.back_icon} alt="Back" className="w-4 rotate-180" />
                Back to Product
            </button>

            {/* Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 my-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Write a Review</h2>
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="text-2xl text-gray-500 hover:text-black"
                            >
                                ×
                            </button>
                        </div>
                        <ReviewForm
                            product={product}
                            orderId={orderId}
                            onSubmit={handleSubmitReview}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
                        {/* Overall Rating */}
                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                            <div className="flex justify-center text-2xl mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600">{reviews.length} reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-3">Rating Breakdown</h3>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating}>
                                    {renderRatingBar(rating, ratingCounts[rating])}
                                </div>
                            ))}
                        </div>

                        {/* Product Info */}
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.images[0]?.imageUrl || product.images[0]}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h4 className="font-medium">{product.name}</h4>
                                    <p className="text-gray-600 text-sm">${product.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Reviews List */}
                <div className="lg:col-span-2">
                    {/* Sort Options */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">
                            All Reviews ({reviews.length})
                        </h3>
                        <select className="border border-gray-300 rounded px-3 py-2">
                            <option value="recent">Most Recent</option>
                            <option value="helpful">Most Helpful</option>
                            <option value="high-rating">Highest Rating</option>
                            <option value="low-rating">Lowest Rating</option>
                        </select>
                    </div>

                    {/* Reviews */}
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <img src={assets.empty_icon} alt="No reviews" className="w-24 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                            <p className="text-gray-600 mb-6">Be the first to review this product!</p>
                            {user && token && orderId && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Write the First Review
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {reviews.map((review) => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    onDelete={handleDeleteReview}
                                    onReport={handleReportReview}
                                    userReview={review.userId?.id === user?.id}
                                />
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {reviews.length > 10 && (
                        <div className="text-center mt-8">
                            <button className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50">
                                Load More Reviews
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ReviewItem from '../components/ReviewItem';
import { assets } from '../assets/assets';

const MyReviews = () => {
    const {
        user,
        token,
        fetchUserReviews,
        deleteUserReview,
        fetchReviewableOrders
    } = useContext(ShopContext);

    const [reviews, setReviews] = useState([]);
    const [reviewableOrders, setReviewableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-reviews');

    useEffect(() => {
        if (user && token) {
            loadData();
        }
    }, [user, token]);

    const loadData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'my-reviews') {
                const userReviews = await fetchUserReviews();
                setReviews(userReviews.reviews || []);
            } else {
                const orders = await fetchReviewableOrders();
                setReviewableOrders(orders.orders || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setLoading(true);
        setTimeout(() => {
            if (tab === 'my-reviews') {
                // Load user reviews
                fetchUserReviews().then(data => {
                    setReviews(data.reviews || []);
                    setLoading(false);
                });
            } else {
                // Load reviewable orders
                fetchReviewableOrders().then(data => {
                    setReviewableOrders(data.orders || []);
                    setLoading(false);
                });
            }
        }, 300);
    };

    const renderReviewableOrders = () => {
        if (reviewableOrders.length === 0) {
            return (
                <div className="text-center py-12">
                    <img src={assets.empty_icon} alt="No orders" className="w-24 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No Orders to Review</h3>
                    <p className="text-gray-600">You don't have any delivered orders waiting for review.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {reviewableOrders.map((order) => (
                    <div key={order.orderId} className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-medium">Order #{order.orderId.slice(-6)}</h3>
                                <p className="text-gray-600 text-sm">
                                    Delivered on {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-gray-600 text-sm">
                                            Size: {item.size} • Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <a
                                        href={`/review/${item.productId}/${order.orderId}`}
                                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
                                    >
                                        Write Review
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMyReviews = () => {
        if (reviews.length === 0) {
            return (
                <div className="text-center py-12">
                    <img src={assets.empty_icon} alt="No reviews" className="w-24 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't written any reviews yet.</p>
                    <button
                        onClick={() => handleTabChange('to-review')}
                        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Review Your Purchases
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-0">
                {reviews.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        onDelete={handleDeleteReview}
                        userReview={true}
                    />
                ))}
            </div>
        );
    };

    if (!user || !token) {
        return (
            <div className="pt-10 text-center">
                <Title text1="MY" text2="REVIEWS" />
                <div className="mt-8 p-8 bg-gray-50 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-medium mb-4">Sign In Required</h3>
                    <p className="text-gray-600 mb-6">Please sign in to view and manage your reviews.</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-10">
            <Title text1="MY" text2="REVIEWS" />

            {/* Tabs */}
            <div className="border-b mb-8">
                <div className="flex gap-6">
                    <button
                        onClick={() => handleTabChange('my-reviews')}
                        className={`pb-3 font-medium ${activeTab === 'my-reviews'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        My Reviews ({reviews.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('to-review')}
                        className={`pb-3 font-medium ${activeTab === 'to-review'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        To Review ({reviewableOrders.reduce((acc, order) => acc + order.items.length, 0)})
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            ) : (
                <>
                    {/* Content based on active tab */}
                    {activeTab === 'my-reviews' ? renderMyReviews() : renderReviewableOrders()}
                </>
            )}
        </div>
    );
};

export default MyReviews;
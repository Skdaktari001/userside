import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const ReviewItem = ({ review, onDelete, onReport, userReview = false }) => {
    const { user } = useContext(ShopContext);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const handleDelete = () => {
        if (onDelete) {
            onDelete(review.id);
        }
        setShowDeleteConfirm(false);
    };

    const handleReport = () => {
        if (onReport && reportReason.trim()) {
            onReport(review.id, reportReason);
            setShowReportModal(false);
            setReportReason('');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Render star rating
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={i < rating ? 'text-yellow-500' : 'text-gray-300'}
            >
                ★
            </span>
        ));
    };

    return (
        <>
            <div className="border-b py-6">
                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        {review.user?.profileImage ? (
                            <img
                                src={review.user.profileImage}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                    {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex">
                                    {renderStars(review.rating)}
                                </div>
                                <span>•</span>
                                <span>{formatDate(review.createdAt)}</span>
                                {review.verifiedPurchase && (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-600">✓ Verified Purchase</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            ⋮
                        </button>
                    </div>
                </div>

                {/* Review Title */}
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>

                {/* Review Description */}
                <p className="text-gray-700 mb-4">{review.description}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {review.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.imageUrl || image}
                                alt={`Review ${index + 1}`}
                                className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-90"
                                onClick={() => window.open(image.imageUrl || image, '_blank')}
                            />
                        ))}
                    </div>
                )}

                {/* Review Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {/* Implement helpful vote */ }}
                            className="flex items-center gap-1 hover:text-black"
                        >
                            <span>Helpful?</span>
                            <span className="text-gray-400">({review.helpfulVotes || 0})</span>
                        </button>
                        {!userReview && (
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="hover:text-red-500"
                            >
                                Report
                            </button>
                        )}
                    </div>

                    {userReview && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {/* Implement edit */ }}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Review</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this review? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Report Review</h3>
                        <p className="text-gray-600 mb-4">
                            Please tell us why you're reporting this review:
                        </p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="w-full border border-gray-300 rounded p-3 mb-4"
                            rows="3"
                            placeholder="Enter reason..."
                            maxLength="500"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowReportModal(false);
                                    setReportReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReport}
                                disabled={!reportReason.trim()}
                                className={`px-4 py-2 rounded ${reportReason.trim()
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewItem;
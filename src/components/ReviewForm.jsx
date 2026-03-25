import React, { useState } from 'react';
import { assets } from '../assets/assets';

const ReviewForm = ({ product, orderId, onSubmit, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate file count
        if (images.length + files.length > 4) {
            setError('Maximum 4 images allowed');
            return;
        }

        // Validate file types and size
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setError('Only JPG, PNG, GIF, and WebP images are allowed');
                return false;
            }

            if (file.size > maxSize) {
                setError('Image size must be less than 5MB');
                return false;
            }

            return true;
        });

        // Create preview URLs
        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
        setError('');
    };

    const removeImage = (index) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            setError('Please enter a title for your review');
            return;
        }

        if (!description.trim()) {
            setError('Please enter your review description');
            return;
        }

        if (description.trim().length < 10) {
            setError('Please write a more detailed review (at least 10 characters)');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('productId', product.id);
            formData.append('orderId', orderId);
            formData.append('rating', rating);
            formData.append('title', title.trim());
            formData.append('description', description.trim());

            // Append images
            images.forEach(image => {
                formData.append('images', image.file);
            });

            // Call onSubmit with form data
            await onSubmit(formData);

            // Clear form
            setRating(5);
            setTitle('');
            setDescription('');
            setImages([]);

        } catch (error) {
            setError(error.message || 'Failed to submit review');
        } finally {
            setUploading(false);
        }
    };

    // Render star rating input
    const renderStarInput = () => {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-3xl focus:outline-none"
                        >
                            <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                                ★
                            </span>
                        </button>
                    ))}
                    <span className="ml-2 text-gray-600 self-center">{rating}.0</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <img
                    src={product.images[0]?.imageUrl || product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                />
                <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600 text-sm">Reviewing your purchase</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                {renderStarInput()}

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Review Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3"
                        placeholder="Summarize your experience"
                        maxLength="100"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {title.length}/100 characters
                    </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Review</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3"
                        rows="5"
                        placeholder="Share details of your experience with this product..."
                        maxLength="1000"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {description.length}/1000 characters
                    </p>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                        Upload Photos (Optional)
                        <span className="text-gray-500 text-sm ml-2">Max 4 images, 5MB each</span>
                    </label>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    {images.length < 4 && (
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                            <img src={assets.upload_icon} alt="Upload" className="w-5" />
                            Upload Photos
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={uploading || !title.trim() || !description.trim()}
                    >
                        {uploading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
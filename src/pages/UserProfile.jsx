// pages/UserProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    User, Camera, Save, Lock, Mail, Phone, MapPin, 
    Bell, Globe, Shield, Upload, X, Check, Trash2
} from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

// Define backendUrl locally or import from App if needed
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const UserProfile = () => {
    const { token, navigate, user: contextUser, setUser, fetchUserProfile } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    
    // User data
    const [localUser, setLocalUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            newsletter: true
        }
    });
    
    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Image upload
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Check if user is logged in
    useEffect(() => {
        if (!token) {
            toast.error('Please login to view your profile');
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch user profile
    const fetchLocalUserProfile = async () => {
        if (!token) {
            toast.error('Please login first');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}api/user-profile/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                const userData = response.data.user;
                setLocalUser(userData);
                setUser(userData); // Update context user
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || {
                        street: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: ''
                    },
                    preferences: userData.preferences || {
                        emailNotifications: true,
                        smsNotifications: false,
                        newsletter: true
                    }
                });
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLocalUserProfile();
        }
    }, [token]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else if (name.startsWith('preferences.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                toast.error('Please select an image file');
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Upload profile image
    const uploadProfileImage = async () => {
        if (!selectedImage) {
            toast.error('Please select an image first');
            return;
        }

        if (!token) {
            toast.error('Please login to upload image');
            return;
        }

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', selectedImage);

            const response = await axios.post(
                `${backendUrl}api/user-profile/profile/image`,
                uploadFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Profile image updated successfully!');
                const updatedUser = response.data.user;
                setLocalUser(updatedUser);
                setUser(updatedUser); // Update context user
                setSelectedImage(null);
                setImagePreview('');
                fetchUserProfile(); // Refresh context user data
            }
        } catch (error) {
            console.error('Upload image error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to upload image');
            }
        } finally {
            setUploading(false);
        }
    };

    // Delete profile image
    const deleteProfileImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        if (!token) {
            toast.error('Please login to delete image');
            return;
        }

        try {
            const response = await axios.delete(
                `${backendUrl}api/user-profile/profile/image`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Profile image removed!');
                const updatedUser = response.data.user;
                setLocalUser(updatedUser);
                setUser(updatedUser); // Update context user
                fetchUserProfile(); // Refresh context user data
            }
        } catch (error) {
            console.error('Delete image error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error('Failed to remove profile image');
            }
        }
    };

    // Save profile changes
    const saveProfile = async () => {
        if (!token) {
            toast.error('Please login to save profile');
            return;
        }

        setSaving(true);
        try {
            const response = await axios.put(
                `${backendUrl}api/user-profile/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                const updatedUser = response.data.user;
                setLocalUser(updatedUser);
                setUser(updatedUser); // Update context user
                fetchUserProfile(); // Refresh context user data
            }
        } catch (error) {
            console.error('Save profile error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    // Change password
    const handleChangePassword = async () => {
        if (!token) {
            toast.error('Please login to change password');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setChangingPassword(true);
        try {
            const response = await axios.post(
                `${backendUrl}api/user-profile/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setActiveTab('profile');
            }
        } catch (error) {
            console.error('Change password error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to change password');
            }
        } finally {
            setChangingPassword(false);
        }
    };

    // Use combined user data for display
    const displayUser = localUser || contextUser;

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Show message if not logged in (should redirect, but just in case)
    if (!token) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Please Login</h2>
                <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                       {/* Profile Image Section */}
<div className="text-center mb-6">
    <div className="relative inline-block">
        <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                {displayUser?.profileImage || imagePreview ? (
                    <img
                        src={imagePreview || displayUser?.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                    </div>
                )}
            </div>
            
            {/* Upload Button - bottom right */}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md z-10">
                <Camera size={16} />
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                />
            </label>
            
            {/* Trash Bin Icon - top right, outside the image */}
            {displayUser?.profileImage && !selectedImage && (
                <button
                    onClick={deleteProfileImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md z-20"
                    title="Remove profile picture"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    </div>
    
    <h2 className="text-xl font-semibold mt-4">{displayUser?.name}</h2>
    <p className="text-gray-500">{displayUser?.email}</p>
    {displayUser?.isAdmin && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-2">
            <Shield size={12} className="mr-1" />
            Administrator
        </span>
    )}
</div>

                        {/* Image Actions */}
                        {selectedImage && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">New image selected</span>
                                    <button
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setImagePreview('');
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={uploadProfileImage}
                                    disabled={uploading}
                                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Upload Image
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Navigation Tabs */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                                    activeTab === 'profile'
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <User size={18} />
                                Personal Information
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                                    activeTab === 'security'
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Lock size={18} />
                                Security
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                                    activeTab === 'preferences'
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Bell size={18} />
                                Preferences
                            </button>
                        </div>

                        {/* Account Info */}
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
                            <div className="space-y-B2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-medium">
                                        {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last updated</span>
                                    <span className="font-medium">
                                        {displayUser?.updatedAt ? new Date(displayUser.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-medium ${
                                        displayUser?.active ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {displayUser?.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        {/* Personal Information Tab */}
                        {activeTab === 'profile' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <User size={20} />
                                        Personal Information
                                    </h2>
                                    <button
                                        onClick={saveProfile}
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin size={18} />
                                            Address Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.street"
                                                    value={formData.address.street}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.city"
                                                        value={formData.address.city}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        State/Province
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.state"
                                                        value={formData.address.state}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Country
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.country"
                                                        value={formData.address.country}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ZIP/Postal Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.zipCode"
                                                        value={formData.address.zipCode}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Lock size={20} />
                                    Security Settings
                                </h2>

                                <div className="space-y-6">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <h3 className="font-medium text-yellow-800 mb-2">Change Password</h3>
                                        <p className="text-sm text-yellow-600 mb-4">
                                            Use a strong password that you don't use elsewhere
                                        </p>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        currentPassword: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        newPassword: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Enter new password"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Must be at least 8 characters long
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        confirmPassword: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {changingPassword ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                        Changing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={16} />
                                                        Change Password
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-red-600 mb-4">
                                            These actions are irreversible. Please proceed with caution.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                                                    toast.error('Account deletion not implemented yet');
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Delete My Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <Bell size={20} />
                                        Preferences
                                    </h2>
                                    <button
                                        onClick={saveProfile}
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {saving ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">
                                            Notification Settings
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <label className="font-medium text-gray-900">Email Notifications</label>
                                                    <p className="text-sm text-gray-600">
                                                        Receive updates and announcements via email
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="preferences.emailNotifications"
                                                        checked={formData.preferences.emailNotifications}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <label className="font-medium text-gray-900">SMS Notifications</label>
                                                    <p className="text-sm text-gray-600">
                                                        Receive important alerts via text message
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="preferences.smsNotifications"
                                                        checked={formData.preferences.smsNotifications}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <label className="font-medium text-gray-900">Newsletter Subscription</label>
                                                    <p className="text-sm text-gray-600">
                                                        Receive our weekly newsletter with tips and updates
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="preferences.newsletter"
                                                        checked={formData.preferences.newsletter}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                            <Globe size={18} />
                                            Language & Region
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Language
                                                </label>
                                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                                    <option>English (US)</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                    <option>German</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Time Zone
                                                </label>
                                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                                    <option>Eastern Time (ET)</option>
                                                    <option>Central Time (CT)</option>
                                                    <option>Pacific Time (PT)</option>
                                                    <option>UTC</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                    defaultChecked
                                                />
                                                <span className="ml-2 text-gray-700">
                                                    Show my profile to other users
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                    defaultChecked
                                                />
                                                <span className="ml-2 text-gray-700">
                                                    Allow search engines to link to my profile
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                    defaultChecked
                                                />
                                                <span className="ml-2 text-gray-700">
                                                    Send me security alerts via email
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Activity Section */}
                    <div className="mt-6 bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    <span>Profile updated - {displayUser?.updatedAt ? new Date(displayUser.updatedAt).toLocaleDateString() : 'Today'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                    <span>Last login - {displayUser?.lastLogin ? new Date(displayUser.lastLogin).toLocaleString() : 'Recently'}</span>
                                </div>
                                {displayUser?.profileImage && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                        <span>Profile picture updated</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
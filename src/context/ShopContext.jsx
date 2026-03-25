import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({}); // Changed from [] to {}
    const [products, setProducts] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // NEW: User profile state
    const [user, setUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Setup axios defaults when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.timeout = 15000; // Global 15s timeout
            localStorage.setItem('token', token);
            // Fetch user profile when token is set
            fetchUserProfile();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            delete axios.defaults.timeout;
            localStorage.removeItem('token');
            // Clear user data when token is removed
            setUser(null);
        }
    }, [token]);

    // NEW: Function to fetch user profile with retry
    const fetchUserProfile = async (retryCount = 0) => {
        if (!token) {
            setUser(null);
            return;
        }

        setProfileLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}api/user-profile/profile`,
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000 // 15s limit
                }
            );

            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' && retryCount < 1) {
                console.warn('Profile fetch timed out, retrying once...');
                return fetchUserProfile(retryCount + 1);
            }
            console.error('Fetch user profile error:', error);
            if (error.response?.status === 401) {
                setUser(null);
                setToken('');
            }
        } finally {
            if (retryCount === 0 || !user) {
                setProfileLoading(false);
            }
        }
    };

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            // Decode JWT token to get user ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        // Update local state immediately for better UX
        const updatedCart = { ...cartItems };

        if (!updatedCart[itemId]) {
            updatedCart[itemId] = {};
        }

        updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
        setCartItems(updatedCart);

        // Sync with backend if user is logged in
        if (token) {
            try {
                const userId = getUserIdFromToken();
                if (!userId) {
                    toast.error('Invalid token. Please login again.');
                    setToken('');
                    return;
                }

                const response = await axios.post(
                    `${backendUrl}api/cart/add`,
                    {
                        userId,
                        itemId,
                        size
                    }
                    // Headers are set globally via axios.defaults
                );

                if (response.data.success) {
                    toast.success('Added to cart!');
                    // Update with server response (in case of conflicts)
                    setCartItems(response.data.cartData || updatedCart);
                } else {
                    toast.error(response.data.message || 'Failed to add to cart');
                }
            } catch (error) {
                console.error('Add to cart error:', error);

                // Handle 401 Unauthorized
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    setToken('');
                    localStorage.removeItem('token');
                } else {
                    toast.error(error.response?.data?.message || error.message || 'Failed to add to cart');
                }

                // Revert local changes on error
                setCartItems(cartItems);
            }
        } else {
            toast.success('Added to cart (local) - Login to save cart');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size];
                if (quantity > 0) {
                    totalCount += quantity;
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        // Update local state
        const updatedCart = { ...cartItems };

        if (!updatedCart[itemId]) {
            updatedCart[itemId] = {};
        }

        if (quantity <= 0) {
            delete updatedCart[itemId][size];
            // Remove item if no sizes left
            if (Object.keys(updatedCart[itemId]).length === 0) {
                delete updatedCart[itemId];
            }
        } else {
            updatedCart[itemId][size] = quantity;
        }

        setCartItems(updatedCart);

        // Sync with backend if user is logged in
        if (token) {
            try {
                const userId = getUserIdFromToken();
                if (!userId) {
                    toast.error('Invalid token. Please login again.');
                    setToken('');
                    return;
                }

                const response = await axios.put(
                    `${backendUrl}api/cart/update`,
                    {
                        userId,
                        itemId,
                        size,
                        quantity
                    }
                );

                if (response.data.success) {
                    // Update with server response
                    setCartItems(response.data.cartData || updatedCart);
                }
            } catch (error) {
                console.error('Update cart error:', error);

                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    setToken('');
                    localStorage.removeItem('token');
                }

                // Revert on error
                setCartItems(cartItems);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product.id === itemId);
            if (itemInfo) {
                for (const size in cartItems[itemId]) {
                    const quantity = cartItems[itemId][size];
                    if (quantity > 0) {
                        totalAmount += itemInfo.price * quantity;
                    }
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message || 'Failed to load products');
            }
        } catch (error) {
            console.error('Get products error:', error);
            toast.error(error.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }

    const getUserCart = async () => {
        if (!token) return;

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('Invalid token. Please login again.');
                setToken('');
                return;
            }

            const response = await axios.get(
                `${backendUrl}api/cart`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error('Get cart error:', error);

            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                setToken('');
                localStorage.removeItem('token');
            }
        }
    }

    // Clear cart function
    const clearCart = () => {
        setCartItems({});
    }

    // Remove item from cart
    const removeFromCart = async (itemId, size) => {
        await updateQuantity(itemId, size, 0);
    }

    // NEW: Function to update user data in context
    const updateUserData = (userData) => {
        setUser(userData);
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (token) {
            getUserCart();
        } else {
            // Clear cart when logged out
            setCartItems({});
        }
    }, [token]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        setProducts,
        loading,
        clearCart,
        removeFromCart,
        getUserIdFromToken,
        // NEW: User profile data and functions
        user,
        setUser,
        fetchUserProfile,
        updateUserData,
        profileLoading
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Payment = () => {
  const { backendUrl, token, currency, setCartItems } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { orderId, amount, email } = location.state || {};

  useEffect(() => {
    if (!orderId || !amount) {
      navigate('/orders');
    }
  }, [orderId, amount, navigate]);

  const handlePaystackPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}api/payment/paystack/initialize`,
        { orderId, email, amount },
        { headers: { token } }
      );

      if (response.data.success) {
        // Redirect to Paystack authorization URL
        window.location.href = response.data.data.authorization_url;
      } else {
        toast.error(response.data.message || "Initialization failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return null;

  return (
    <div className='min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-indigo-50'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
            </svg>
          </div>
          <h2 className='text-3xl font-extrabold text-slate-900'>Secure Checkout</h2>
          <p className='mt-2 text-sm text-slate-500'>Order Reference: <span className='font-mono font-semibold text-indigo-600'>{orderId.substring(0, 8)}...</span></p>
        </div>

        <div className='bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100'>
          <div className='flex justify-between items-center text-slate-600 pb-4 border-b border-slate-200'>
            <span>Subtotal</span>
            <span>{currency}{parseFloat(amount).toFixed(2)}</span>
          </div>
          <div className='flex justify-between items-center text-xl font-bold text-slate-900'>
            <span>Total Payable</span>
            <span className='text-indigo-600'>{currency}{parseFloat(amount).toFixed(2)}</span>
          </div>
        </div>

        <div className='space-y-4'>
          <button
            onClick={handlePaystackPayment}
            disabled={loading}
            className='group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50'
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className='flex items-center gap-2'>
                Pay Securely with Paystack
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className='w-full flex justify-center py-3 px-4 border-2 border-slate-200 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition-colors duration-200'
          >
            Cancel and Return
          </button>
        </div>

        <div className='pt-6 flex items-center justify-center gap-6 opacity-60'>
          <div className='flex items-center gap-1 grayscale'>
            <span className='text-xs font-bold'>SSL</span>
            <span className='text-[10px]'>SECURED</span>
          </div>
          <div className='h-4 w-px bg-slate-300'></div>
          <div className='flex items-center gap-1'>
            <span className='text-[10px] font-bold text-indigo-600'>PAYSTACK</span>
            <span className='text-[10px] uppercase tracking-widest'>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);
  const [verifying, setVerifying] = useState(true);

  const reference = searchParams.get('reference');

  const verifyPayment = async () => {
    try {
      if (!reference) {
        toast.error("No payment reference found");
        navigate('/orders');
        return;
      }

      const response = await axios.get(
        `${backendUrl}api/payment/paystack/verify/${reference}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Payment successful!");
        setCartItems({}); // Clear cart
        navigate('/orders');
      } else {
        toast.error(response.data.message || "Payment verification failed");
        navigate('/orders');
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred while verifying payment");
      navigate('/orders');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);

  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center space-y-6'>
      <div className='w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-slate-900'>Verifying Payment...</h2>
        <p className='text-slate-500'>Please hold on while we confirm your transaction with Paystack.</p>
      </div>
      <p className='text-xs font-mono text-slate-400'>Ref: {reference || 'N/A'}</p>
    </div>
  );
};

export default VerifyPayment;

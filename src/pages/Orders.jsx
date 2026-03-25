import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    if (!token) {
      toast.error('Please login to view orders');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}api/order/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order.id; // Add order ID for reference
            allOrderItems.push(item);
          });
        });
        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.error('Load order error:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');

      // If token is invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('userToken');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return (
      <div className="border-t pt-16">
        <div className='text-2xl mb-8'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16 px-4 md:px-6'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {orderData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg">No orders yet</p>
          <p className="text-gray-400 mt-2">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orderData.slice(0, 4).map((item, index) => (
            <div key={index} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img
                  className='w-16 sm:w-20 h-16 sm:h-20 object-cover rounded'
                  src={item.images?.[0]?.imageUrl || item.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.name}
                />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{Number(item.price)?.toFixed(2) || '0.00'}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <div className={`min-w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' :
                    item.status === 'Shipped' ? 'bg-blue-500' :
                      item.status === 'Packing' ? 'bg-yellow-500' :
                        'bg-gray-500'
                    }`}></div>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors'
                >
                  Refresh
                </button>
              </div>
            </div>
          ))}

          {orderData.length > 4 && (
            <div className="text-center pt-4">
              <p className="text-gray-500">
                Showing 4 of {orderData.length} orders
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Orders;
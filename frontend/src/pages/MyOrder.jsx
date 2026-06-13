import OrderCard from '@/components/OrderCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const getUserOrders = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await axios.get(`${API_URL}/api/orders/my-order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <OrderCard userOrder={userOrder} navigate={navigate}/>
  );
};

export default MyOrder;
